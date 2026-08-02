# 13 — TROUBLESHOOTING Y FAQ: Problemas comunes y soluciones

> **Propósito:** Recopilar los problemas, errores y confusiones más frecuentes que enfrentan principiantes al configurar Supabase + Stripe + PostHog + Sentry, con soluciones concretas y verificadas.

---

## Índice

1. [Supabase local development](#1-supabase-local-development)
2. [Supabase Auth y emails](#2-supabase-auth-y-emails)
3. [Supabase RLS (Row Level Security)](#3-supabase-rls-row-level-security)
4. [Stripe Checkout y webhooks](#4-stripe-checkout-y-webhooks)
5. [CORS y redirecciones](#5-cors-y-redirecciones)
6. [PostHog y Sentry](#6-posthog-y-sentry)
7. [Migración de localStorage](#7-migración-de-localstorage)
8. [Errores de SQL](#8-errores-de-sql)
9. [Despliegue en GitHub Pages](#9-despliegue-en-github-pages)
10. [Preguntas frecuentes](#10-preguntas-frecuentes)

---

## 1. Supabase local development

### ❌ "failed to inspect container health: docker: command not found"

**Causa:** El CLI de Supabase necesita Docker (o Podman) para ejecutar el stack local (PostgreSQL, Auth, Storage, etc.).

**Solución:**

1. Instala Docker Desktop:
   - **macOS:** https://docs.docker.com/desktop/install/mac-install/
   - **Windows:** https://docs.docker.com/desktop/install/windows-install/
   - **Linux:** https://docs.docker.com/engine/install/

2. Verifica que Docker esté corriendo:
   ```bash
   docker --version
   docker info
   ```

3. Si Docker no inicia, verifica:
   - Que tienes suficiente RAM (mínimo 4 GB libres)
   - Que la virtualización está activada en BIOS (Windows/Linux)
   - En Linux, que tu usuario está en el grupo `docker`: `sudo usermod -aG docker $USER` (cierra sesión y vuelve a entrar)

4. Alternativa sin Docker: usa el panel web de Supabase directamente (https://supabase.com/dashboard) en un proyecto de prueba. No tendrás entorno local, pero puedes ejecutar el SQL desde el SQL Editor del panel.

> **Fuente:** https://supabase.com/docs/guides/local-development — "you'll need to install the Supabase CLI and a container runtime"

### ❌ "Cannot start local CLI" / Docker image not found

**Causa:** Versión del CLI incompatible con la imagen de Docker, o caché corrupta.

**Solución:**

```bash
# Actualizar el CLI
npm install -g supabase@latest

# Limpiar caché de Docker
docker system prune -a

# Reiniciar el stack local
supabase stop
supabase start
```

> **Fuente:** https://github.com/supabase/cli/issues — múltiples reportes de este tipo

### ❌ "supabase db reset" borra mis datos

**Causa:** `db reset` elimina todas las migraciones y recrea la base de datos desde cero. Es el comportamiento esperado.

**Solución:** NUNCA uses `db reset` en producción. En desarrollo, tus datos seed se recrean si están en `supabase/seed.sql`. Usa `supabase db push` para aplicar cambios sin resetear.

---

## 2. Supabase Auth y emails

### ❌ El email de confirmación/redirección va a localhost en producción

**Causa:** La "Site URL" en el dashboard de Supabase sigue configurada como `http://localhost:3000`.

**Solución:**

1. Ve a Supabase Dashboard → Authentication → URL Configuration
2. Cambia **Site URL** a tu URL de producción: `https://tu-dominio.com`
3. Añade **Redirect URLs**:
   - `https://tu-dominio.com`
   - `https://tu-dominio.com/auth/callback`
   - `http://localhost:8095` (para desarrollo local)
4. Guarda los cambios

> **Fuente:** https://supabase.com/docs/guides/auth/redirect-urls — "Supabase Auth will reject messages that are signed for URLs that are not on the allowed list"

### ❌ Los emails de confirmación no llegan

**Causa:** El plan gratuito de Supabase tiene un límite de emails por hora (4 emails/hora en el plan Free).

**Solución:**

1. Verifica en Supabase Dashboard → Authentication → Users si el usuario aparece como "unconfirmed"
2. Para desarrollo local, usa el email de InBucket (el SMTP de prueba local): `http://localhost:54324` (puerto por defecto de InBucket en el stack local)
3. Para producción, configura un SMTP custom (SendGrid, Resend, Amazon SES) en Authentication → Email Templates → SMTP Settings

> **Fuente:** https://supabase.com/docs/guides/auth/auth-email — límites del plan Free

### ❌ "Email not confirmed" pero el usuario confirmó

**Causa:** El email se confirmó pero la sesión no se actualizó.

**Solución:**

```javascript
// Después del click en el email, el usuario vuelve a tu app.
// Llama a getSession() para verificar el estado real:
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  // La sesión no se creó. Pide al usuario que inicie sesión manualmente.
  await supabase.auth.signInWithPassword({ email, password });
}
```

### ❌ No puedo hacer login con Google/GitHub (OAuth)

**Causa:** OAuth requiere configurar el proveedor en el dashboard con Client ID y Client Secret.

**Solución:** Para el MVP, usa email/password. OAuth es una mejora posterior. Si lo necesitas, sigue: https://supabase.com/docs/guides/auth/social-login

---

## 3. Supabase RLS (Row Level Security)

### ❌ "permission denied" o "No rows returned" aunque la policy existe

**Causas comunes (en orden de frecuencia):**

1. **RLS no está habilitada en la tabla:**
   ```sql
   -- Verificar:
   SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'tu_tabla';
   -- Si relrowsecurity = false, habilitar:
   ALTER TABLE tu_tabla ENABLE ROW LEVEL SECURITY;
   ```

2. **La policy usa `auth.uid()` pero el usuario no está autenticado:**
   ```sql
   -- auth.uid() devuelve NULL si no hay sesión.
   -- Para permitir lectura pública, añade una policy para anon:
   CREATE POLICY "anon can read" ON tu_tabla FOR SELECT TO anon USING (true);
   ```

3. **La policy tiene `USING` pero no `WITH CHECK`:**
   ```sql
   -- USING controla qué filas se pueden leer (SELECT)
   -- WITH CHECK controla qué filas se pueden escribir (INSERT/UPDATE)
   -- Si falta WITH CHECK, los INSERT fallarán:
   CREATE POLICY "user insert own" ON tu_tabla
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

4. **Estás usando la service_role key en el cliente:**
   ```javascript
   // ❌ MAL — service_role bypassa RLS
   const supabase = createClient(url, SERVICE_ROLE_KEY)
   // ✅ BIEN — anon key respeta RLS
   const supabase = createClient(url, ANON_KEY)
   ```

> **Fuente:** https://supabase.com/docs/guides/database/postgres/row-level-security — "RLS must always be enabled on any tables stored in an exposed schema"

### ❌ Una policy `USING (true)` permite acceso a todo

**Causa:** `USING (true)` significa "todas las filas pasan la condición". Es correcto para contenido público, pero NO para datos privados.

**Solución:**
```sql
-- ✅ Contenido público (poses oficiales):
CREATE POLICY "anyone can read official poses"
  ON poses FOR SELECT USING (visibility = 'public' AND publication_status = 'published');

-- ✅ Datos privados del usuario:
CREATE POLICY "user reads own favorites"
  ON favorites FOR SELECT USING (auth.uid() = user_id);

-- ❌ NUNCA para datos privados:
CREATE POLICY "all access" ON favorites FOR SELECT USING (true);  -- ¡PELIGROSO!
```

### ❌ "new row violates row-level security policy" en INSERT

**Causa:** La policy de INSERT falta o no coincide con los datos que se intentan insertar.

**Solución:**
```sql
-- Verificar que existe una policy de INSERT
SELECT * FROM pg_policies WHERE tablename = 'tu_tabla' AND cmd = 'insert';

-- Si no existe, crearla:
CREATE POLICY "user inserts own data" ON tu_tabla
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

## 4. Stripe Checkout y webhooks

### ❌ "Webhook signature verification failed"

**Causa:** El webhook no recibe el cuerpo RAW de la petición. Supabase Edge Functions parsean el JSON automáticamente, pero Stripe necesita el body sin parsear.

**Solución en Supabase Edge Functions:**

```typescript
// ❌ MAL — el body ya está parseado como JSON
const body = await req.json();

// ✅ BIEN — leer el body raw
const body = await req.text();
const event = await stripe.webhooks.constructEventAsync(
  body,
  signature,
  WEBHOOK_SECRET
);
```

> **Fuente:** https://www.reddit.com/r/Supabase/comments/1kj1zkb/ — "Stripe signature verification needs the RAW request body"
> **Fuente:** https://supabase.com/docs/guides/functions/examples/stripe-webhooks

### ❌ El webhook recibe eventos pero no actualiza la base de datos

**Causas comunes:**

1. **La Edge Function usa `anon` key en lugar de `service_role`:**
   ```typescript
   // ❌ MAL — anon key respeta RLS, el webhook no tiene sesión de usuario
   const supabase = createClient(url, ANON_KEY);

   // ✅ BIEN — service_role bypassa RLS (solo en servidor)
   const supabase = createClient(url, SERVICE_ROLE_KEY);
   ```

2. **El evento no se procesa porque el tipo no está en tu switch/if:**
   ```typescript
   // Verifica qué eventos estás manejando
   switch (event.type) {
     case 'checkout.session.completed': ...
     case 'customer.subscription.updated': ...
     // ¿Falta alguno?
   }
   ```

3. **Idempotencia rechaza eventos ya procesados (comportamiento correcto):**
   - Si reenvías un evento desde el dashboard de Stripe, el `webhook_events` table ya tiene el `stripe_event_id` y el `ON CONFLICT DO NOTHING` lo ignora. Esto es correcto — verifica el campo `processed_at` en la tabla.

> **Fuente:** https://www.reddit.com/r/Supabase/comments/1cgcgqd/ — "My Stripe webhook doesn't update my database table"

### ❌ Stripe CLI no reenvía webhooks a localhost

**Causa:** El CLI de Stripe no está escuchando o el endpoint URL es incorrecto.

**Solución:**
```bash
# 1. Iniciar el listener de Stripe
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook

# 2. Copiar el webhook signing secret que muestra (whsec_...)
# 3. Configurarlo en .env:
STRIPE_WEBHOOK_SECRET=whsec_<el-que-muestra-stripe-listen>

# 4. Reiniciar la Edge Function
supabase functions serve stripe-webhook

# 5. Probar con un evento de prueba:
stripe trigger checkout.session.completed
```

> **Fuente:** https://docs.stripe.com/stripe-cli

### ❌ Tarjetas de prueba de Stripe

Para probar en modo test, usa estas tarjetas:

| Escenario | Número | Resultado |
|---|---|---|
| Pago exitoso | `4242 4242 4242 4242` | Pago completado |
| Pago con autenticación 3D Secure | `4000 0025 0000 3155` | Requiere autenticación |
| Pago declinado | `4000 0000 0000 0002` | Tarjeta rechazada |
| Fondos insuficientes | `4000 0000 0000 9995` | Pago fallido |

- **Fecha:** cualquier fecha futura (ej: `12/34`)
- **CVC:** cualquier 3 dígitos (ej: `123`)
- **ZIP:** cualquier código postal (ej: `12345`)

> **Fuente:** https://docs.stripe.com/testing

---

## 5. CORS y redirecciones

### ❌ "CORS error" al llamar a Supabase desde el navegador

**Causa:** La URL de tu frontend no está en la lista de orígenes permitidos de Supabase.

**Solución:**

1. Ve a Supabase Dashboard → Settings → API
2. En **CORS origins**, añade:
   - `http://localhost:8095` (desarrollo local)
   - `https://tu-dominio.com` (producción)
   - `https://pillb.github.io` (GitHub Pages)
3. Guarda los cambios

> **Nota:** Supabase permite todos los orígenes por defecto en el plan Free. Si lo restringes, asegúrate de incluir todos los orígenes necesarios.

### ❌ "CORS error" al crear Checkout Session de Stripe

**Causa:** Estás llamando directamente a la API de Stripe desde el navegador en lugar de usar una Edge Function.

**Solución:**
```javascript
// ❌ MAL — llamar a Stripe desde el navegador
fetch('https://api.stripe.com/v1/checkout/sessions', ...)

// ✅ BIEN — llamar a tu Edge Function, que llama a Stripe
const response = await fetch('/functions/v1/create-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ priceId: 'price_...' })
});
const { url } = await response.json();
window.location.href = url;
```

> **Fuente:** https://www.reddit.com/r/Supabase/comments/... — "Stripe Checkout example running into CORS error from localhost"

### ❌ Después del pago, redirige a una página en blanco

**Causa:** La `success_url` de Checkout apunta a una ruta que no existe o no maneja el callback.

**Solución:**
```typescript
// En la Edge Function que crea el Checkout:
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: `${APP_URL}/?checkout=success`,
  cancel_url: `${APP_URL}/?checkout=cancelled`,
  // NO usar success_url como prueba de pago — usar webhook
});
```

```javascript
// En el frontend, manejar el retorno:
const params = new URLSearchParams(window.location.search);
if (params.get('checkout') === 'success') {
  // Mostrar mensaje de "procesando" — NO conceder acceso todavía
  showToast('Pago en proceso. Tu acceso Pro se activará en unos segundos.');
  // El webhook confirmará el pago y creará el entitlement
  // Polling para detectar cuando el entitlement aparezca:
  const checkEntitlement = setInterval(async () => {
    const { data } = await supabase.from('entitlements')
      .select('*').eq('user_id', userId).eq('active', true);
    if (data?.length > 0) {
      clearInterval(checkEntitlement);
      showToast('¡Pro activado! 🎉');
      location.reload();
    }
  }, 2000);
  // Timeout después de 30 segundos
  setTimeout(() => clearInterval(checkEntitlement), 30000);
}
```

---

## 6. PostHog y Sentry

### ❌ PostHog no recibe eventos

**Causas comunes:**

1. **El `posthog.init()` no se llama antes del primer evento:**
   ```javascript
   // Llamar al inicio de la app, antes de cualquier track()
   posthog.init('phc_tu_key', { api_host: 'https://tu-host.posthog.com' });
   ```

2. **El consentimiento del usuario no se ha dado (si tienes opt-in):**
   ```javascript
   if (userConsented) {
     posthog.opt_in_capturing();
   } else {
     posthog.opt_out_capturing();
   }
   ```

3. **Ad blockers bloquean PostHog:**
   - Solución: usa un proxy (PostHog self-hosted o Cloudflare Worker)

> **Fuente:** https://posthog.com/docs/privacy

### ❌ Sentry captura demasiados errores irrelevantes

**Solución:**
```javascript
Sentry.init({
  dsn: 'https://tu-dsn@sentry.io/tu-proyecto',
  // Filtrar errores de extensions del navegador
  beforeSend(event) {
    if (event.request?.url?.includes('chrome-extension://')) return null;
    return event;
  },
  // Solo capturar errores en producción
  environment: window.location.hostname === 'localhost' ? 'development' : 'production',
  // Sample rate para no exceder el plan gratuito
  tracesSampleRate: 0.1, // 10% de las transacciones
});
```

---

## 7. Migración de localStorage

### ❌ "Data migration interrupted" — la migración se cortó a la mitad

**Causa:** La conexión a Supabase se perdió o el navegador se cerró.

**Solución:**
- La migración es **idempotente** — reejecútala. Los datos ya migrados se detectan via `ON CONFLICT DO NOTHING` y se saltan.
- El campo `profiles.migration_completed_at` marca si la migración terminó. Si está NULL, la migración está incompleta.

### ❌ Los datos aparecen duplicados después de la migración

**Causa:** La deduplicación no funciona porque los IDs no coinciden.

**Solución:**
- Los IDs de localStorage son strings (`'tour-1234567890-abc'`). Los IDs de Supabase son UUIDs.
- El adaptador debe mapear el ID local al UUID de Supabase en una tabla `migration_id_map`.
- Si ya hay duplicados, elimina los que tengan `created_at` más reciente y conserva el original.

### ❌ El usuario migró datos en el dispositivo A pero no aparecen en el B

**Causa:** El dispositivo B no ha hecho login, o la migración del dispositivo B no se ha ejecutado.

**Solución:**
1. Verifica que el usuario esté logueado en el dispositivo B
2. Si el usuario YA migró en el dispositivo A, el campo `migration_completed_at` está en el perfil. El dispositivo B debe leer los datos de Supabase (no migrar de nuevo).
3. Si el usuario tiene datos locales en el dispositivo B que NO están en Supabase, ofrece la migración del dispositivo B como "merge".

---

## 8. Errores de SQL

### ❌ "relation already exists" al ejecutar el schema

**Causa:** La tabla ya existe (ejecutaste el script dos veces).

**Solución:**
```sql
-- Usar IF NOT EXISTS en CREATE TABLE:
CREATE TABLE IF NOT EXISTS profiles (...);

-- O eliminar todo antes (¡SOLO en desarrollo!):
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

### ❌ "cannot drop table because other objects depend on it"

**Causa:** Foreign keys impiden el DROP.

**Solución:**
```sql
-- Eliminar en orden inverso a la creación, o:
DROP TABLE IF EXISTS table_name CASCADE;
```

### ❌ "column does not exist" después de modificar el schema

**Causa:** El caché de PostgREST (la API de Supabase) no se ha actualizado.

**Solución:**
```bash
# Reiniciar PostgREST en el stack local:
supabase stop
supabase start

# O en el panel web de Supabase:
# Settings → API → "Reload schema cache"
```

---

## 9. Despliegue en GitHub Pages

### ❌ "404 Not Found" al acceder a rutas internas

**Causa:** GitHub Pages sirve archivos estáticos. Las rutas tipo `/poses/scurve-stand` no existen como archivos.

**Solución:** PoseArt es una SPA (Single Page Application). Usa `hash routing` o un `404.html` que redirija a `index.html`:

```html
<!-- 404.html en la raíz del repo -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PoseArt</title>
  <script>
    // Redirect to index.html with the path as hash
    var path = window.location.pathname.replace(/\.html$/, '');
    window.location.href = '/' + path.split('/').slice(2).join('/') + '/index.html' + window.location.search + window.location.hash;
  </script>
</head>
<body>Redirecting...</body>
</html>
```

> **Fuente:** https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site

### ❌ Los cambios no aparecen después de push

**Causa:** GitHub Pages puede tardar 1-5 minutos en propagar el despliegue.

**Solución:**
- Espera 5 minutos y refresca con Ctrl+Shift+R (hard refresh)
- Verifica en https://github.com/PillB/PoseArt/actions que el workflow de deploy terminó
- Verifica en https://pillb.github.io/PoseArt/ que el archivo cambió: abre las DevTools → Network → busca el archivo

---

## 10. Preguntas frecuentes

### ¿Puedo usar Supabase sin Docker?

Sí. Para desarrollo local sin Docker, usa el panel web de Supabase directamente (crea un proyecto de prueba en https://supabase.com/dashboard). Ejecuta el SQL desde el SQL Editor del panel. No tendrás Edge Functions locales, pero puedes desplegarlas directamente al proyecto de prueba.

### ¿Puedo usar Stripe sin servidor?

No de forma segura. Stripe Checkout requiere una llamada al API de Stripe desde un servidor (con la `secret_key`). Si lo haces desde el navegador, expones la `secret_key`. Usa una Supabase Edge Function.

### ¿El navegador puede verificar si un usuario es Pro?

El navegador puede **leer** el estado de Pro (consultando la tabla `entitlements` con RLS), pero **no puede concederlo**. El entitlement solo se crea desde el webhook verificado de Stripe.

### ¿Qué pasa si el webhook llega antes de que el usuario vuelva del checkout?

El webhook crea el entitlement independientemente de dónde esté el usuario. Cuando el usuario vuelve a la app, el frontend hace polling de `entitlements` y detecta el Pro. No hay race condition porque el webhook es la fuente de verdad, no el redirect.

### ¿Puedo tener múltiples entornos (dev/staging/prod)?

Sí. Crea 3 proyectos de Supabase (uno por entorno). Usa variables de entorno diferentes en cada uno. Para Stripe, usa `test mode` para dev/staging y `live mode` para prod (con claves diferentes).

### ¿Cuánto cuesta empezar?

| Servicio | Coste inicial |
|---|---|
| Supabase Free | $0 (500 MB DB, 50k usuarios, 2 Edge Functions) |
| Stripe | $0 (solo comisión por transacción: 2.9% + $0.30) |
| PostHog Free | $0 (1M eventos/mes) |
| Sentry Free | $0 (5k errores/mes) |
| GitHub Pages | $0 |
| **Total** | **$0/mes** hasta que superes los límites gratuitos |

> **Verifica los límites actuales** en cada sitio antes de registrarte. Ver `SOURCE-LEDGER.md`.

### ¿Qué hago si excedo los límites gratuitos?

| Servicio | Cuando subes | Coste aproximado |
|---|---|---|
| Supabase Pro | >500MB DB o >50k usuarios | $25/mes |
| PostHog | >1M eventos/mes | $0.00031/evento adicional |
| Sentry | >5k errores/mes | $26/mes (Team plan) |

### ¿Necesito un dominio propio?

No. GitHub Pages te da `https://pillb.github.io/PoseArt/` gratis. Pero un dominio propio (`https://poseart.app`) es más profesional y te da control sobre DNS. Un dominio `.com` cuesta ~$10-15/año.

---

## Fuentes consultadas

| Servicio | URL | Fecha |
|---|---|---|
| Supabase local dev | https://supabase.com/docs/guides/local-development | 2026-08-02 |
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security | 2026-08-02 |
| Supabase Auth redirect URLs | https://supabase.com/docs/guides/auth/redirect-urls | 2026-08-02 |
| Supabase Stripe webhooks | https://supabase.com/docs/guides/functions/examples/stripe-webhooks | 2026-08-02 |
| Stripe testing | https://docs.stripe.com/testing | 2026-08-02 |
| Stripe CLI | https://docs.stripe.com/stripe-cli | 2026-08-02 |
| GitHub Pages 404 | https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site | 2026-08-02 |
| Reddit r/Supabase (pitfalls) | https://www.reddit.com/r/Supabase/ | 2026-08-02 |
