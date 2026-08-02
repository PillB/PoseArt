# 12 — Operaciones, privacidad y backups

> **Propósito:** Documentar cómo se opera PoseArt en producción: entornos, backups, rotación de secretos, retención de datos, exportación y borrado de usuarios (RGPD/CCPA), auditoría y respuesta a incidentes.
>
> **Tiempo estimado:** 1 hora para configurar; revisión semanal de 15 min.
> **Resultado esperado:** Puedes responder a "¿qué hago si se cae Supabase?", "¿cómo borro los datos de un usuario?", "¿cuándo rotaste la última vez la service_role?".

---

## Cómo leer este documento

Cada procedimiento tiene los campos habituales (Objetivo, Por qué hace falta, Prerrequisitos, Dónde ejecutar, Acción exacta, Resultado esperado, Cómo verificar, Errores comunes, Cómo revertir, Fuente oficial).

### Marcadores visuales

| Marcador | Significado |
|---|---|
| 🟣 **PANEL** | Panel de proveedor (Supabase, Stripe, PostHog, Sentry). |
| 🟢 **TERMINAL** | Terminal local. |
| 📝 **EDITOR** | Editor de código. |
| 🌐 **HOSTING** | Panel del hosting. |
| 🚀 **PROD** | Producción. |
| 🧪 **TEST** | Staging / test. |

> ⚠️ **Aviso:** Los planes y límites citados son los vigentes a fecha de agosto 2026 según la documentación pública de cada proveedor. Verifícalos antes.

---

## Índice

1. [Entornos](#1-entornos)
2. [Backups de Supabase](#2-backups-de-supabase)
3. [Procedimiento de restauración](#3-procedimiento-de-restauración)
4. [Rotación de secretos](#4-rotación-de-secretos)
5. [Política de retención por tabla](#5-política-de-retención-por-tabla)
6. [Exportación de datos de usuario (RGPD)](#6-exportación-de-datos-de-usuario-rgpd)
7. [Borrado de cuenta (soft + hard delete)](#7-borrado-de-cuenta-soft--hard-delete)
8. [Revisión del audit log](#8-revisión-del-audit-log)
9. [Respuesta a incidentes](#9-respuesta-a-incidentes)
10. [Runbook semanal / mensual](#10-runbook-semanal--mensual)

---

## 1. Entornos

PoseArt necesita al menos 3 entornos aislados:

| Entorno | Propósito | Supabase | Stripe | PostHog | Sentry | Hosting |
|---|---|---|---|---|---|---|
| **Local** | Desarrollo en tu ordenador | Proyecto `poseart-dev` (o un solo proyecto compartido con staging si no quieres pagar dos) | Test mode | Proyecto `poseart-dev` | Proyecto `poseart-dev` | `http://localhost:8095` |
| **Staging** | Pruebas pre-prod con datos realistas pero no sensibles | Proyecto `poseart-staging` | Test mode | Proyecto `poseart-dev` (o separado) | Proyecto `poseart-dev` | `<staging>.pages.dev` o rama `staging` |
| **Producción** | Usuarios reales | Proyecto `poseart-prod` | Live mode (cuando esté aprobado) | Proyecto `poseart-prod` | Proyecto `poseart-prod` | `https://poseart.com` |

### Reglas de oro

1. **NUNCA uses credenciales de producción en local.** Si lo haces por error, rota esas credenciales inmediatamente.
2. **Staging usa los mismos secretos que prod sólo si los datos no son sensibles.** Mejor: staging tiene sus propios secretos.
3. **Local NUNCA escribe en la base de datos de producción.** Si necesitas datos reales para debug, exporta un dump de prod (anonimizado) y cárgalo en local.
4. **El plan gratuito de Supabase** te permite un solo proyecto por organización. Crea varias organizaciones si necesitas varios entornos a la vez.

> ⚠️ **No verificado:** el límite "un proyecto por organización en plan gratuito" puede haber cambiado. Verifica en https://supabase.com/pricing.

---

## 2. Backups de Supabase

### 2.1 Backups automáticos (plan Pro)

- **Objetivo:** Tener backups diarios sin intervención manual.
- **Por qué hace falta:** Si un usuario borra datos por error o un bug corrompe la base, necesitas restaurar.
- **Prerrequisitos:** Plan Pro de Supabase ($25/mes al escribir esto).
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **Database → Backups**.
- **Acción exacta:**
  1. En plan Pro, los backups diarios (PITR — Point-in-Time Recovery) están activados por defecto.
  2. Verifica que el último backup es de menos de 24 horas.
  3. Configura retención: 7 días (default) o 30 días si necesitas más histórico.
- **Resultado esperado:** En la pestaña "Backups" ves una lista cronológica de backups completos + la opción de restaurar a cualquier minuto dentro de la ventana de retención.
- **Cómo verificar:** Entra a un backup y comprueba que el tamaño coincide con tu base actual (no es 0).
- **Errores comunes:**
  - Si pasas del límite de almacenamiento del plan, Supabase puede pausar backups. Monitoriza el uso en **Project Settings → Usage**.
- **Cómo revertir:** N/A (no hay acción destructiva).
- **Fuente oficial:** https://supabase.com/docs/guides/platform/backups

### 2.2 Backups manuales (plan Free)

- **Objetivo:** En plan Free (sin backups automáticos), hacer un dump manual.
- **Por qué hace falta:** El plan Free NO ofrece PITR. Si pierdes datos, no hay restauración automática.
- **Prerrequisitos:** `pg_dump` instalado (viene con PostgreSQL) o acceso al SQL Editor.
- **Dónde ejecutar:** 🟢 **TERMINAL** o 🟣 **PANEL**.
- **Acción exacta (método pg_dump):**
  1. 🟣 **PANEL** — Project Settings → Database → Connection string → copia la URL.
  2. 🟢 **TERMINAL**:
     ```bash
     # Sustituye <PASSWORD> y <PROJECT-REF>
     pg_dump "postgresql://postgres:<PASSWORD>@db.<PROJECT-REF>.supabase.co:5432/postgres" \
       --format=custom \
       --file=poseart-backup-$(date +%Y%m%d-%H%M%S).dump
     ```
  3. Sube el archivo a almacenamiento cifrado (Backblaze B2, AWS S3 con SSE-KMS, o al menos tu disco local cifrado).
- **Resultado esperado:** Archivo `.dump` de varios MB (depende del tamaño).
- **Cómo verificar:**
  ```bash
  pg_restore --list poseart-backup-*.dump | head -20
  ```
  Debe listar tablas.
- **Errores comunes:**
  - `pg_dump: server version mismatch` → tu `pg_dump` es más viejo que el Postgres de Supabase (PostgreSQL 15). Actualiza: `brew install postgresql@15` o usa Docker.
  - Timeout en conexiones lentas → añade `--no-owner --no-privileges` para reducir metadatos.
- **Cómo revertir:** N/A (es backup, no acción destructiva).
- **Fuente oficial:** https://www.postgresql.org/docs/current/app-pgdump.html

### 2.3 Cron de backup manual (si no pagas Pro)

- **Objetivo:** Automatizar el dump diario aunque estés en Free.
- **Dónde ejecutar:** 🟢 **TERMINAL** en una máquina siempre encendida (servidor propio, Raspberry Pi, GitHub Actions cron).
- **Acción exacta (GitHub Actions cron):**
  ```yaml
  # .github/workflows/backup-supabase.yml
  name: Daily Supabase backup
  on:
    schedule:
      - cron: '0 3 * * *'  # 3:00 UTC diario
  jobs:
    backup:
      runs-on: ubuntu-latest
      steps:
        - name: Install pg_dump
          run: sudo apt-get update && sudo apt-get install -y postgresql-client
        - name: Dump
          env:
            DB_URL: ${{ secrets.SUPABASE_DB_URL }}
          run: |
            pg_dump "$DB_URL" --format=custom --file=backup-$(date +%Y%m%d).dump
        - name: Upload artifact
          uses: actions/upload-artifact@v4
          with:
            name: supabase-backup-${{ github.run_id }}
            path: backup-*.dump
            retention-days: 30
  ```
- **Resultado esperado:** Cada día a las 3:00 UTC se ejecuta un backup y queda en GitHub Artifacts durante 30 días.
- **Errores comunes:**
  - GitHub Actions schedule puede retrasarse hasta 30 min en horas pico. No lo uses para SLA crítico.
  - El artifact de GitHub tiene límite de 2 GB por archivo en plan Free.
- **Cómo revertir:** Borra el workflow.
- **Fuente oficial:** https://docs.github.com/es/actions/using-workflows/events-that-trigger-workflows#schedule

---

## 3. Procedimiento de restauración

### 3.1 Restaurar desde PITR (plan Pro)

- **Objetivo:** Recuperar la base a un punto en el tiempo.
- **Por qué hace falta:** Alguien borró datos por error hace 2 horas.
- **Prerrequisitos:** Plan Pro activo.
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **Database → Backups → PITR**.
- **Acción exacta:**
  1. Pulsa "Restore to timestamp".
  2. Elige el timestamp deseado (con minutos de precisión).
  3. Supabase crea un **nuevo proyecto** con la base restaurada. NO sobreescribe el original (por seguridad).
  4. Verifica los datos en el nuevo proyecto.
  5. Si confirmas, redirige el dominio / claves al nuevo proyecto. Si no, descarta el proyecto restaurado.
- **Resultado esperado:** Nuevo proyecto con datos al timestamp elegido.
- **Cómo verificar:** Ejecuta `SELECT count(*) FROM ...` en el nuevo proyecto.
- **Errores comunes:**
  - El nuevo proyecto tiene un Reference ID distinto → hay que actualizar claves en el hosting. Planifica el cambio.
  - El nuevo proyecto no tiene las Edge Functions del original → re-deploya con `supabase functions deploy`.
- **Cómo revertir:** Borra el nuevo proyecto restaurado y vuelve a usar el original.
- **Fuente oficial:** https://supabase.com/docs/guides/platform/backups#point-in-time-recovery

### 3.2 Restaurar desde dump manual

- **Dónde ejecutar:** 🟢 **TERMINAL** (en un proyecto Supabase nuevo o en un Postgres local).
- **Acción exacta:**
  ```bash
  pg_restore --dbname="postgresql://postgres:<PASSWORD>@db.<NEW-PROJECT-REF>.supabase.co:5432/postgres" \
    --no-owner --no-privileges \
    poseart-backup-YYYYMMDD.dump
  ```
- **Resultado esperado:** Las tablas y datos aparecen en el proyecto destino.
- **Errores comunes:**
  - `extension does not exist` → instala la extensión antes del restore (p. ej. `create extension pgcrypto;`).
  - Conflictos con RLS ya activado → desactiva RLS temporalmente antes del restore y re-actívalo después.
- **Cómo revertir:** Drop & recreate del schema destino: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`.
- **Fuente oficial:** https://www.postgresql.org/docs/current/app-pgrestore.html

---

## 4. Rotación de secretos

Política: rota todos los secretos cada 90 días, e inmediatamente si sospechas filtración.

### 4.1 Rotar `service_role` de Supabase

- **Objetivo:** Invalidar la clave antigua y emitir una nueva.
- **Por qué hace falta:** Si se filtró (commit por error, log público), un atacante podría leer/escribir cualquier fila saltándose RLS.
- **Prerrequisitos:** Lista de sitios donde se usa: Edge Functions (Supabase Secrets), scripts de servidor, GitHub Actions (si los hay).
- **Dónde ejecutar:** 🟣 **PANEL** + 🟢 **TERMINAL**.
- **Acción exacta:**
  1. 🟣 **PANEL** — Project Settings → API → "Rotate service_role key".
  2. La clave antigua deja de funcionar inmediatamente.
  3. 🟢 **TERMINAL** — Actualiza todos los sitios que la usan:
     ```bash
     echo "<NEW_SERVICE_ROLE>" | supabase secrets set SUPABASE_SERVICE_ROLE_KEY=-
     ```
  4. Actualiza tu `.env` local.
  5. Si usabas la clave en GitHub Actions: Settings → Secrets → update.
  6. Redeploya las Edge Functions para que carguen el nuevo secret.
- **Resultado esperado:** Las Edge Functions siguen funcionando con la nueva clave.
- **Cómo verificar:**
  - Llama a una Edge Function que use `service_role`. Debe responder 200.
  - Llama con la clave antigua. Debe responder 401.
- **Errores comunes:**
  - Olvidas actualizar algún sitio → las funciones empiezan a fallar 401. Busca logs en Supabase → Functions → Logs.
- **Cómo revertir:** No se puede volver a la clave anterior (es el objetivo). Si rompiste algo, genera una nueva rotación.
- **Fuente oficial:** https://supabase.com/docs/guides/api/api-keys

### 4.2 Rotar `STRIPE_SECRET_KEY`

- **Dónde ejecutar:** 🟣 **PANEL** — Stripe → Developers → API keys.
- **Acción exacta:**
  1. Crea una nueva secret key (o usa restricted key).
  2. Actualiza el secret en Supabase:
     ```bash
     echo "<NEW_SK>" | supabase secrets set STRIPE_SECRET_KEY=-
     ```
  3. Redeploya las Edge Functions.
  4. Roll (revoca) la clave antigua en Stripe.
- **Resultado esperado:** Las funciones de Checkout siguen funcionando.
- **Cómo verificar:** Crea una sesión de Checkout de prueba → debe responder OK.
- **Errores comunes:** Si la clave antigua estaba en uso por un cron o webhook externo, ese fallará tras el roll.
- **Cómo revertir:** Crea una nueva clave y vuelve a actualizar.
- **Fuente oficial:** https://docs.stripe.com/keys#roll-keys

### 4.3 Rotar `STRIPE_WEBHOOK_SECRET`

- **Por qué hace falta:** Si cambias la URL del webhook o sospechas filtración del secret.
- **Dónde ejecutar:** 🟣 **PANEL** — Stripe → Developers → Webhooks → tu endpoint → "Update".
- **Acción exacta:**
  1. En Stripe, edita el webhook. Al guardar, Stripe genera un nuevo `whsec_...`.
  2. Cópialo.
  3. Actualiza Supabase:
     ```bash
     echo "<NEW_WSEC>" | supabase secrets set STRIPE_WEBHOOK_SECRET=-
     ```
  4. Redeploya la Edge Function `stripe-webhook`.
  5. Test: `stripe trigger checkout.session.completed` → debe llegar al webhook y responder 200.
- **Resultado esperado:** Webhook firma correctamente con el nuevo secret.
- **Cómo revertir:** Vuelve a generar el secret.
- **Fuente oficial:** https://docs.stripe.com/webhooks#verify-events

### 4.4 Rotar claves de PostHog y Sentry

- **PostHog:** Project Settings → Project API key → "Rotate". Actualiza `VITE_POSTHOG_KEY` en el hosting.
- **Sentry:** Project Settings → Client Keys → "Generate new DSN". Actualiza `VITE_SENTRY_DSN`.
- **Fuente PostHog:** https://posthog.com/docs/api/api
- **Fuente Sentry:** https://docs.sentry.io/product/sentry-dsn-explainer/

### 4.5 Rotar contraseña de base de datos Supabase

- **Dónde ejecutar:** 🟣 **PANEL** — Project Settings → Database → "Reset database password".
- **Cuidado:** Esto invalida la connection string usada por `pg_dump` y por cualquier script externo. Actualiza tu `.env` y los GitHub Actions secrets.
- **Fuente:** https://supabase.com/docs/guides/database/postgres/roles#the-postgres-role

---

## 5. Política de retención por tabla

| Tabla | Retención | Acción al expirar | Justificación |
|---|---|---|---|
| `profiles` (sin `deleted_at`) | Indefinida (mientras cuenta activa) | N/A | Necesario para funcionamiento |
| `profiles` (con `deleted_at`) | 30 días, luego hard delete | Cron job borra fila | RGPD: derecho al olvido |
| `user_preferences` | Igual que `profiles` | Cascade delete | Atado al usuario |
| `favorites` | Indefinida | N/A | Datos de producto |
| `pose_sessions` | 24 meses | Cron job archiva (>24m) → tabla `pose_sessions_archive` o borra | Reducir volumen |
| `captures` (si existe) | 90 días, luego borrar storage + fila | Cron job | Privacidad: fotos corporales sensibles |
| `poses` (privadas del usuario) | Indefinida mientras cuenta activa | Cascade delete con perfil | Datos de producto |
| `poses` (publicadas) | Indefinida | N/A | Contenido público |
| `tours` (privados) | Indefinida mientras cuenta activa | Cascade delete | Datos de producto |
| `tours` (publicados) | Indefinida | N/A | Contenido público |
| `products` | Indefinida (incluso si withdrawn) | N/A | Necesario para historial de compras |
| `entitlements` | Indefinida (incluso si revoked) | N/A | Necesario para auditoría fiscal |
| `reviews` | Indefinida | N/A | Contenido público |
| `bug_reports` | 90 días, luego borrar | Cron job | Datos de debug, sensibles limitados |
| `audit_log` | 12 meses | Cron job borra >12m | Auditoría, sin PII sensible |
| `webhook_events` (tabla de idempotencia) | 30 días | Cron job | Suficiente para reintentos de Stripe |

### Implementación del cron

- **Dónde ejecutar:** Supabase → **Database → Scheduled functions** (pg_cron extension).
- **Acción exacta:**
  ```sql
  -- Habilitar pg_cron (si no está)
  create extension if not exists pg_cron;

  -- Borrar hard deletes pendientes (más de 30 días en soft delete)
  select cron.schedule(
    'hard-delete-profiles',
    '0 4 * * *',
    $$delete from profiles where deleted_at is not null and deleted_at < now() - interval '30 days'$$
  );

  -- Borrar bug_reports > 90 días
  select cron.schedule(
    'purge-bug-reports',
    '0 4 * * *',
    $$delete from bug_reports where created_at < now() - interval '90 days'$$
  );

  -- Borrar audit_log > 12 meses
  select cron.schedule(
    'purge-audit-log',
    '0 4 * * *',
    $$delete from audit_log where created_at < now() - interval '12 months'$$
  );
  ```
- **Resultado esperado:** Cada día a las 4:00 UTC, los datos caducados se borran.
- **Cómo verificar:**
  ```sql
  select * from cron.job;
  select * from cron.job_run_details order by start_time desc limit 10;
  ```
- **Errores comunes:** pg_cron en Supabase Cloud corre en la base `postgres`, no en `public`. Usa el schema completo si quieres acceder a tus tablas: `public.profiles`.
- **Cómo revertir:**
  ```sql
  select cron.unschedule('hard-delete-profiles');
  ```
- **Fuente oficial:** https://supabase.com/docs/guides/database/extensions/pg_cron

---

## 6. Exportación de datos de usuario (RGPD)

### 6.1 Generar export JSON

- **Objetivo:** Cumplir con el derecho de portabilidad (Art. 20 RGPD).
- **Por qué hace falta:** Un usuario puede pedir "todos mis datos".
- **Prerrequisitos:** Endpoint autenticado (Edge Function) o panel de admin.
- **Dónde ejecutar:** 📝 **EDITOR** — Edge Function `export-user-data`.
- **Acción exacta:**
  ```typescript
  // supabase/functions/export-user-data/index.ts
  import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

  Deno.serve(async (req) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response("Unauthorized", { status: 401 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const userId = user.id;

    const [profile, preferences, favorites, sessions, poses, tours, entitlements, reviews, bugReports] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("user_preferences").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("favorites").select("*").eq("user_id", userId),
      supabase.from("pose_sessions").select("*").eq("user_id", userId),
      supabase.from("poses").select("*").eq("author_id", userId),
      supabase.from("tours").select("*").eq("author_id", userId),
      supabase.from("entitlements").select("*").eq("user_id", userId),
      supabase.from("reviews").select("*").eq("user_id", userId),
      supabase.from("bug_reports").select("*").eq("user_id", userId)
    ]);

    const exportData = {
      exported_at: new Date().toISOString(),
      user_id: userId,
      profile: profile.data,
      preferences: preferences.data,
      favorites: favorites.data,
      pose_sessions: sessions.data,
      poses: poses.data,
      tours: tours.data,
      entitlements: entitlements.data,
      reviews: reviews.data,
      bug_reports: bugReports.data
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="poseart-export-${userId}.json"`
      }
    });
  });
  ```
  Deploy con `supabase functions deploy export-user-data` (sin `--no-verify-jwt`).
- **Resultado esperado:** El usuario puede descargar un JSON con todos sus datos desde su perfil.
- **Cómo verificar:** Llama a la función con el JWT de un usuario → devuelve JSON con todos sus datos.
- **Errores comunes:**
  - Devolver datos de otros usuarios → la función usa `auth.uid()` implícito vía JWT verificado. Re-verifica que NO usas `service_role` para filtrar; usa el cliente con el JWT del usuario.
  - Devolver `email` original: el `profiles.email` sí puede incluirse (es del propio usuario).
- **Cómo revertir:** Borra la función.
- **Fuente oficial:** https://supabase.com/docs/guides/functions

### 6.2 Exportación de datos en PostHog

- PostHog guarda eventos por usuario. El usuario puede pedir que se exporten/borren.
- API: https://posthog.com/docs/api/export
- Para exportar todos los eventos de un `user_id`:
  ```bash
  curl "https://app.posthog.com/api/event/?person_id=<person_id>" \
    -H "Authorization: Bearer <personal_api_key>"
  ```

### 6.3 Exportación en Sentry

- Sentry proporciona GDPR export/delete endpoints: https://docs.sentry.io/product/data-management-settings/privacy/legal-export-delete/

---

## 7. Borrado de cuenta (soft + hard delete)

### 7.1 Flujo completo

1. **Usuario solicita borrado** desde la UI: "Delete my account".
2. **Confirmación:** pide contraseña + texto "DELETE" escrito a mano.
3. **Soft delete:** la Edge Function `delete-account`:
   - Set `profiles.deleted_at = now()`.
   - Set `profiles.email = concat(id, '@deleted.local')` (rompe vínculo con email real).
   - Marca `auth.users.banned_until = '2999-01-01'` (bloquea login inmediato).
   - NO borra datos de tablas relacionadas todavía (necesarios para auditoría fiscal si había compras).
   - Llama a PostHog API para anonimizar al usuario: https://posthog.com/docs/privacy/data-deletion.
   - Llama a Sentry GDPR API para borrar al usuario: https://docs.sentry.io/product/data-management-settings/privacy/legal-export-delete/.
   - Si tenía suscripción activa: cancela en Stripe (`stripe.subscriptions.cancel(sub_id, { prorate: false })`).
4. **Hard delete (a los 30 días):** cron job (ver sección 5) borra:
   - `profiles` con `deleted_at < now() - interval '30 days'`.
   - Cascade delete borra `user_preferences`, `favorites`, `pose_sessions`, `poses` privadas, `tours` privados, `bug_reports`.
   - `entitlements` se conservan (anonimizados con `user_id` ya no mapeable) para auditoría fiscal.
   - `reviews` se conservan pero se actualiza `author_display_name` a "Deleted user".
   - En Supabase Auth: llama a `auth.admin.deleteUser(userId)`.
5. **Notificación:** email al usuario (si aún tiene email válido) confirmando el borrado. Opcional.

### 7.2 Implementación de la Edge Function

- **Dónde ejecutar:** 📝 **EDITOR** + 🟢 **TERMINAL** para deploy.
- **Acción exacta:**
  ```typescript
  // supabase/functions/delete-account/index.ts
  import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
  import Stripe from "https://esm.sh/stripe@14?target=deno";

  Deno.serve(async (req) => {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response("Unauthorized", { status: 401 });

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    if (body.confirm_text !== "DELETE") {
      return new Response(JSON.stringify({ error: "Confirmation text mismatch" }), { status: 400 });
    }

    // Cliente admin para operaciones que el usuario no puede hacer
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });

    // 1. Cancelar suscripciones activas
    const { data: subs } = await adminClient
      .from("entitlements")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      .eq("source", "subscription")
      .not("stripe_subscription_id", "is", null);

    for (const s of subs ?? []) {
      try { await stripe.subscriptions.cancel(s.stripe_subscription_id); } catch (e) { /* log */ }
    }

    // 2. Soft delete en profiles
    const { error: profileErr } = await adminClient
      .from("profiles")
      .update({
        deleted_at: new Date().toISOString(),
        email: `${user.id}@deleted.local`,
        display_name: "Deleted user"
      })
      .eq("id", user.id);
    if (profileErr) return new Response(JSON.stringify({ error: profileErr.message }), { status: 500 });

    // 3. Anonimizar reviews (mantener contenido, quitar autor visible)
    await adminClient
      .from("reviews")
      .update({ author_display_name: "Deleted user" })
      .eq("user_id", user.id);

    // 4. Banear en Auth (hasta hard delete)
    await adminClient.auth.admin.updateUserById(user.id, { ban_duration: "2999-01-01" });

    // 5. PostHog y Sentry (llamadas server-to-server)
    //    PostHog: https://posthog.com/docs/api/delete
    //    Sentry:  https://docs.sentry.io/product/data-management-settings/privacy/legal-export-delete/

    return new Response(JSON.stringify({ status: "scheduled_for_hard_delete", scheduled_at: new Date(Date.now() + 30 * 86400 * 1000).toISOString() }), { status: 200 });
  });
  ```
- **Resultado esperado:** El usuario queda en estado soft-delete. A los 30 días, el cron lo elimina completamente.
- **Cómo verificar:**
  1. Tras solicitar borrado, intenta login → debe fallar ("User banned").
  2. `SELECT deleted_at, email FROM profiles WHERE id = '<uuid>';` debe mostrar `deleted_at` no nulo y email `@deleted.local`.
- **Errores comunes:**
  - Cancelar suscripciones falla si la `stripe_subscription_id` está mal. Haz try/catch para que un fallo no bloquee el soft delete.
  - El cron de hard delete no se ejecuta si pg_cron está pausado.
- **Cómo revertir (antes del hard delete):**
  ```sql
  UPDATE profiles SET deleted_at = NULL, email = '<original_email>', display_name = '<original_name>' WHERE id = '<uuid>';
  -- Des-bannear en Auth (vía panel Supabase → Users → Remove ban)
  ```
  Tras 30 días, **NO hay reversa posible**.
- **Fuente oficial:** https://supabase.com/docs/reference/auth/admin-api y https://posthog.com/docs/privacy/data-deletion

---

## 8. Revisión del audit log

### 8.1 Qué auditar

La tabla `audit_log` debe registrar (mínimo):

| Acción | `actor_id` | Notas |
|---|---|---|
| `user.signup` | propio user | Auto via trigger |
| `user.login` | propio user | Auto via trigger |
| `user.logout` | propio user | Auto via trigger |
| `user.password_reset` | propio user | Auto |
| `user.soft_delete` | propio user | Vía Edge Function |
| `user.hard_delete` | NULL (cron) | Vía pg_cron |
| `entitlement.granted` | NULL (webhook) | Vía Edge Function |
| `entitlement.revoked` | NULL (webhook) | Vía Edge Function |
| `admin.role_change` | admin | Manual (panel admin) |
| `admin.user_ban` | admin | Manual |
| `admin.withdraw_product` | admin/creator | Vía Edge Function |
| `seed.run` | admin | Cuando se corre `003-seed-development.sql` |

### 8.2 Procedimiento de revisión semanal

- **Objetivo:** Detectar actividad sospechosa.
- **Dónde ejecutar:** 🟣 **PANEL** → SQL Editor.
- **Acción exacta:**
  ```sql
  -- 1. Login fuera de horas normales (noche local del admin)
  SELECT * FROM audit_log
  WHERE action = 'user.login'
    AND created_at > now() - interval '7 days'
    AND EXTRACT(HOUR FROM created_at) NOT BETWEEN 6 AND 23
  ORDER BY created_at DESC;

  -- 2. Picos de signup (potencial ataque de enumeración o spam)
  SELECT date_trunc('hour', created_at) AS hour, count(*) AS signups
  FROM audit_log
  WHERE action = 'user.signup'
    AND created_at > now() - interval '7 days'
  GROUP BY 1
  HAVING count(*) > 5
  ORDER BY 1 DESC;

  -- 3. Cambios de rol admin (deberían ser raros)
  SELECT * FROM audit_log
  WHERE action = 'admin.role_change'
    AND created_at > now() - interval '30 days'
  ORDER BY created_at DESC;

  -- 4. Entitlements concedidos sin webhook asociado (sospecha de inyección manual)
  SELECT e.*, a.id AS audit_id
  FROM entitlements e
  LEFT JOIN audit_log a ON a.target_id = e.id AND a.action = 'entitlement.granted'
  WHERE e.granted_at > now() - interval '7 days'
    AND a.id IS NULL;
  ```
- **Resultado esperado:** Lista corta o vacía. Si hay hallazgos, investiga.
- **Fuente:** interno.

### 8.3 Acceso al audit log

- La tabla `audit_log` debe ser:
  - SELECT: sólo `service_role` (nadie más puede leer).
  - INSERT: sólo `service_role` y triggers internos.
  - UPDATE/DELETE: NUNCA permitido (sólo cron de purga).
- **Cómo verificar:** Ver sección 7.7 de `11-TESTING-AND-SECURITY-CHECKLIST.md`.

---

## 9. Respuesta a incidentes

### 9.1 Clasificación

| Severidad | Definición | Ejemplo | SLA de respuesta |
|---|---|---|---|
| **P0** | Servicio caído o datos sensibles filtrados | Supabase inaccesible, `service_role` filtrada | 1 hora |
| **P1** | Función crítica rota o pago incorrecto | Webhook de Stripe cae, usuario cobrado sin recibir producto | 4 horas |
| **P2** | Función no crítica rota | Editor de poses no guarda | 24 horas |
| **P3** | Bug cosmético | Error tipográfico en UI | Próximo sprint |

### 9.2 Playbook para P0: filtración de `service_role`

1. **Confirmar:** ¿La clave está en un commit público? ¿En un log?
2. **Rotar inmediatamente** (ver sección 4.1).
3. **Auditar accessos sospechosos:**
   ```sql
   SELECT * FROM audit_log
   WHERE created_at > now() - interval '7 days'
   ORDER BY created_at DESC;
   ```
4. **Revisar inserts recientes en `entitlements` y `profiles.role`:**
   ```sql
   SELECT * FROM entitlements WHERE granted_at > now() - interval '7 days';
   SELECT * FROM profiles WHERE role = 'admin' AND created_at > now() - interval '7 days';
   ```
5. **Notificar a usuarios afectados** si hubo acceso a sus datos.
6. **Postmortem** en `docs/backend/incidents/<fecha>-service-role-leak.md`:
   - Qué pasó.
   - Impacto.
   - Cómo se detectó.
   - Qué se hizo.
   - Qué se cambia para evitar repetición.

### 9.3 Playbook para P0: Supabase caído

1. **Verificar estado:** https://status.supabase.com/
2. **Si es global:** espera recuperación. Avisa a usuarios en la app con banner "Estamos teniendo problemas, volvemos pronto".
3. **Si es tu proyecto:** entra al panel y comprueba si hay pausa por límite de uso (plan Free pausa tras 7 días inactivo). Re-activa.
4. **Recuperar desde backup** si hay corrupción (ver sección 3).

### 9.4 Playbook para P1: webhook de Stripe fallando

1. **Verificar:** Stripe → Developers → Events → ¿hay eventos con `failed` delivery?
2. **Ver logs de la Edge Function:**
   ```bash
   supabase functions logs stripe-webhook --scroll
   ```
3. **Causas comunes:**
   - `STRIPE_WEBHOOK_SECRET` mal configurado (tras rotación fallida).
   - Error 500 en el código (bug introducido en deploy).
   - Base de datos caída (la función no puede escribir).
4. **Reprocesar eventos fallidos:** Stripe reintenta automáticamente durante 3 días. Si necesitas reenviar antes: en Stripe → Events → "Resend".
5. **Verificar usuarios afectados:** usuarios que pagaron pero no recibieron entitlement. Crédito manual o re-ejecuta el webhook cuando se arregle.

### 9.5 Comunicación durante incidentes

- Usa la plantilla de mensaje:
  ```
  Estamos investigando un incidente que afecta a [función]. Los datos de los usuarios están a salvo.
  Actualizaremos en [próxima hora o cuando haya novedad].
  ```
- Publica en:
  - Banner en la app (`<div id="incident-banner">`).
  - Status page (si tienes, p. ej. https://status.poseart.com con Atlassian Statuspage free).
  - Email a afectados (si hay PII comprometida, obligatorio por RGPD Art. 34).

---

## 10. Runbook semanal / mensual

### 10.1 Diario (automatizable)

| Tarea | Cómo |
|---|---|
| Backup automático (plan Pro) | Supabase lo gestiona |
| Cron de purga (soft deletes, bug_reports, audit_log) | pg_cron (sección 5) |
| Revisar errores en Sentry | Dashboard Sentry |

### 10.2 Semanal (15 min)

| Tarea | Dónde |
|---|---|
| Revisar funnels principales en PostHog | PostHog → Insights |
| Revisar top 10 errores en Sentry | Sentry → Issues |
| Revisar audit log (queries de sección 8.2) | Supabase → SQL Editor |
| Verificar uso de cuota de Supabase | Supabase → Project Settings → Usage |
| Verificar que Stripe no tiene webhooks fallando | Stripe → Developers → Events |

### 10.3 Mensual (1 hora)

| Tarea | Dónde |
|---|---|
| Rotar secretos si toca (cada 90 días) | Sección 4 |
| Revisar tamaño de tablas (crecimiento) | `SELECT pg_size_pretty(pg_database_size('postgres'));` |
| Revisar usuarios sin actividad > 30 días (para reactivación) | PostHog cohort |
| Verificar que los cron jobs de purga están corriendo | `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 30;` |
| Revisar y cerrar hallazgos de `11-TESTING-AND-SECURITY-CHECKLIST.md` | Documento |
| Actualizar `SOURCE-LEDGER.md` con nuevas URLs o claves rotadas | Repo |

### 10.4 Trimestral (3 horas)

| Tarea |
|---|
| Ejecutar de nuevo `11-TESTING-AND-SECURITY-CHECKLIST.md` completo |
| Auditar funciones `SECURITY DEFINER` |
| Revisar políticas RLS nuevas añadidas desde última auditoría |
| Rotar TODOS los secretos (incluso si no toca) |
| Revisar planes de proveedores: ¿sigue siendo Free suficiente o hay que subir a Pro? |
| Test de restauración de backup (restaurar un dump en proyecto staging y verificar) |

### 10.5 Anual

| Tarea |
|---|
| Pen-test externo (contrata a un tercero si el producto tiene usuarios reales) |
| Revisar Términos de Servicio y Política de Privacidad con abogado |
| Renovar dominio (si aplica) |
| Recertificar cumplimiento RGPD/CCPA si cambiaron leyes |

---

## Anexo: contactos y enlaces críticos

Mantén esta lista accesible fuera del repo (en tu gestor de contraseñas):

- **Supabase support:** https://supabase.com/dashboard/support
- **Stripe support:** https://support.stripe.com/contact/
- **PostHog status:** https://status.posthog.com/
- **Sentry status:** https://status.sentry.io/
- **GitHub Pages status:** https://www.githubstatus.com/
- **Tu contacto de incidentes:** `<tu-email>`
- **Abogado/asesor legal (RGPD):** `<contacto>`

> Cuando rotes una clave o cambies un dominio, actualiza este anexo Y el archivo `URLS.md` mencionado en `06-DOMAIN-HOSTING-DEPLOYMENT.md`.

---

## Siguientes pasos

- `00-READ-ME-FIRST.md` — Volver al índice general.
- `11-TESTING-AND-SECURITY-CHECKLIST.md` — Antes de cada deploy.
- `06-DOMAIN-HOSTING-DEPLOYMENT.md` — Si cambias de hosting o dominio.
