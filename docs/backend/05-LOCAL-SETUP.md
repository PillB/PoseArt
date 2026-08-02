# 05 — Setup local desde cero

> **Propósito:** Llevarte de "ordenador vacío" a "PoseArt corriendo en local con Supabase + Stripe en modo test" sin pasos saltados. Pensado para alguien que nunca ha usado la línea de comandos.
>
> **Tiempo estimado:** 1-2 horas.
> **Resultado esperado:** Apertura `http://localhost:8095/`, te registras, los datos se guardan en Supabase, las redirecciones de Stripe vuelven a tu local.

---

## Cómo leer este documento

Cada paso tiene **siempre** estos campos:

| Campo | Qué significa |
|---|---|
| **Objetivo** | Qué vas a conseguir. |
| **Por qué hace falta** | La razón técnica o de seguridad. |
| **Prerrequisitos** | Lo que tiene que estar hecho antes. |
| **Dónde ejecutar** | En qué sitio se hace (panel, terminal, editor). |
| **Acción exacta** | El comando o clic concreto. |
| **Resultado esperado** | Lo que deberías ver si salió bien. |
| **Cómo verificar** | Cómo confirmas que no es una ilusión. |
| **Errores comunes** | Lo que suele romperse y cómo arreglarlo. |
| **Cómo revertir** | Cómo deshacer el paso si te equivocaste. |
| **Fuente oficial** | Enlace a la documentación del proveedor. |

### Marcadores visuales

| Marcador | Significado |
|---|---|
| 🟣 **PANEL** | Panel web de un proveedor (Supabase, Stripe, etc.). |
| 🟢 **TERMINAL** | Terminal local en tu ordenador. |
| 📝 **EDITOR** | Editor de código (VS Code, etc.). |
| 🌐 **HOSTING** | Panel del hosting (GitHub, Vercel, Hostinger). |
| 🔀 **DNS** | Panel de DNS (Cloudflare, Namecheap, etc.). |
| 🧪 **TEST** | Entorno de pruebas (Stripe CLI, navegador de test). |
| 🚀 **PROD** | Producción (cuidado, cambios visibles para usuarios reales). |

> ⚠️ **Aviso:** Los planes gratuitos y límites citados son los vigentes a fecha de agosto 2026 según la documentación pública de cada proveedor. Verifícalos antes de registrarte (los planes cambian).

---

## Índice de pasos

1. [Instalar Node.js LTS](#paso-1-instalar-nodejs-lts)
2. [Instalar Supabase CLI](#paso-2-instalar-supabase-cli)
3. [Instalar Stripe CLI](#paso-3-instalar-stripe-cli)
4. [Crear proyecto Supabase (free tier)](#paso-4-crear-proyecto-supabase-free-tier)
5. [Obtener URL y `anon key` (públicas)](#paso-5-obtener-url-y-anon-key-públicas)
6. [Obtener `service_role` key (SECRETA)](#paso-6-obtener-service_role-key-secreta)
7. [Crear cuenta Stripe en modo test](#paso-7-crear-cuenta-stripe-en-modo-test)
8. [Obtener Stripe `publishable key` y `secret key`](#paso-8-obtener-stripe-publishable-key-y-secret-key)
9. [Crear archivo `.env` local (nunca se commitea)](#paso-9-crear-archivo-env-local-nunca-se-commitea)
10. [Ejecutar `001-schema.sql` en Supabase](#paso-10-ejecutar-001-schemasql-en-supabase)
11. [Ejecutar `002-rls.sql` en Supabase](#paso-11-ejecutar-002-rlssql-en-supabase)
12. [Crear usuarios de prueba en Supabase Auth](#paso-12-crear-usuarios-de-prueba-en-supabase-auth)
13. [Ejecutar `003-seed-development.sql`](#paso-13-ejecutar-003-seed-developmentsql)
14. [Arrancar servidor estático local en `:8095`](#paso-14-arrancar-servidor-estático-local-en-8095)
15. [Verificar end-to-end: registro, login, persistencia](#paso-15-verificar-end-to-end-registro-login-persistencia)

---

## Paso 0: Instalar Docker Desktop (PRERREQUISITO CRÍTICO)

- **Objetivo:** Tener Docker (o Podman) disponible para que el CLI de Supabase pueda levantar el stack local.
- **Por qué hace falta:** El CLI de Supabase (`supabase start`) necesita un container runtime para ejecutar PostgreSQL, Auth, Storage y Edge Functions localmente. **Sin Docker, `supabase start` falla con "docker: command not found".**
- **Prerrequisitos:** Ninguno (pero necesitas ~4 GB de RAM libre).
- **Dónde ejecutar:** 🟢 **TERMINAL** (verificar) + descarga desde la web oficial.
- **Acción exacta:**

  ```bash
  # Verificar si ya tienes Docker:
  docker --version
  ```

  Si no lo tienes, instálalo desde:
  - **macOS:** https://docs.docker.com/desktop/install/mac-install/
  - **Windows:** https://docs.docker.com/desktop/install/windows-install/
  - **Linux:** https://docs.docker.com/engine/install/

  Después de instalar, abre Docker Desktop y espera a que el icono de la ballena deje de animarse (indica que el motor está corriendo).

- **Resultado esperado:**
  ```bash
  $ docker --version
  Docker version 27.x.x, build xxxxxx
  ```

- **Cómo verificar:**
  ```bash
  docker info
  # Debe mostrar: Server Version: 27.x.x y información de contenedores
  ```

- **Errores comunes:**
  - **"docker: command not found"** → Docker no está instalado o no está en el PATH. Reinicia la terminal después de instalar.
  - **"Cannot connect to the Docker daemon"** → Docker Desktop no está corriendo. Ábrelo y espera.
  - **Linux: "permission denied"** → Tu usuario no está en el grupo docker: `sudo usermod -aG docker $USER` (cierra sesión y vuelve a entrar).
  - **"failed to inspect container health"** → Verifica que tienes suficiente RAM libre (mínimo 4 GB).

- **Cómo revertir:** Desinstala Docker Desktop desde el panel de aplicaciones.

- **Alternativa sin Docker:** Si no puedes instalar Docker, puedes usar el panel web de Supabase directamente. Crea un proyecto en https://supabase.com/dashboard (plan Free) y ejecuta los SQL desde el SQL Editor del panel. No tendrás Edge Functions locales, pero podrás desplegarlas al proyecto de prueba. Ve a `13-TROUBLESHOOTING-AND-FAQ.md` sección 1 para más detalles.

- **Fuente oficial:** https://supabase.com/docs/guides/local-development — "you'll need to install the Supabase CLI and a container runtime"

---

## Paso 1: Instalar Node.js LTS

- **Objetivo:** Tener `node` y `npm` disponibles en la terminal.
- **Por qué hace falta:** Aunque PoseArt no usa build step, las CLIs de Supabase y Stripe se instalan vía `npm`. Algunos scripts de migración y tests también lo necesitan.
- **Prerrequisitos:** Ninguno. Ordenador con macOS, Linux o Windows.
- **Dónde ejecutar:** 🟢 **TERMINAL** (comprobar versión) + descarga desde la web oficial (instalador).
- **Acción exacta:**
  1. Descarga el instalador LTS desde https://nodejs.org/es/download
  2. Ejecuta el instalador con opciones por defecto.
  3. Abre una terminal **nueva** (importante: las variables de entorno se cargan al abrir terminal).
- **Resultado esperado:** `node -v` imprime algo como `v22.x.x` (LTS actual).
- **Cómo verificar:**
  ```bash
  node -v
  npm -v
  ```
  Ambos comandos deben imprimir un número de versión sin errores.
- **Errores comunes:**
  - `command not found: node` → cerraste y no abriste terminal nueva, o el PATH no se actualizó. Reinicia el ordenador.
  - En macOS prefieres Homebrew: `brew install node@22`.
  - En Linux (Debian/Ubuntu): sigue https://github.com/nodesource/distributions
- **Cómo revertir:** Desinstala Node desde el panel del sistema (Windows) o `brew uninstall node` (macOS).
- **Fuente oficial:** https://nodejs.org/es/download

---

## Paso 2: Instalar Supabase CLI

- **Objetivo:** Tener el comando `supabase` disponible para gestionar migraciones, Edge Functions y backups desde la terminal.
- **Por qué hace falta:** Te permite correr migraciones locales, descargar el esquema del proyecto y desplegar Edge Functions sin usar el panel.
- **Prerrequisitos:** Node.js instalado (Paso 1) o Homebrew / Scoop.
- **Dónde ejecutar:** 🟢 **TERMINAL**.
- **Acción exacta (método npm, multiplataforma):**
  ```bash
  npm install -g supabase
  ```
  Alternativa macOS: `brew install supabase/tap/supabase`
  Alternativa Windows: `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git && scoop install supabase`
- **Resultado esperado:** `supabase -v` imprime la versión.
- **Cómo verificar:**
  ```bash
  supabase -v
  supabase --help
  ```
- **Errores comunes:**
  - `EACCES: permission denied` en macOS/Linux → NO uses `sudo`. Arregla los permisos de npm: `mkdir ~/.npm-global && npm config set prefix '~/.npm-global'` y añade `~/.npm-global/bin` al PATH.
  - Versión antigua → actualiza con `npm update -g supabase`.
- **Cómo revertir:** `npm uninstall -g supabase`.
- **Fuente oficial:** https://supabase.com/docs/guides/local-development/cli/getting-started

---

## Paso 3: Instalar Stripe CLI

- **Objetivo:** Tener el comando `stripe` para reenviar webhooks a tu local y probar pagos sin exponer tu servidor.
- **Por qué hace falta:** En desarrollo, los webhooks de Stripe no pueden llamar a `http://localhost`. La Stripe CLI abre un túnel y reenvía los eventos a tu endpoint local.
- **Prerrequisitos:** Node.js instalado o Homebrew / Scoop / apt.
- **Dónde ejecutar:** 🟢 **TERMINAL**.
- **Acción exacta (método npm):**
  ```bash
  npm install -g stripe
  ```
  Alternativa macOS: `brew install stripe/stripe-cli/stripe`
  Alternativa Windows: `scoop install stripe`
  Alternativa Linux (Debian/Ubuntu): https://github.com/stripe/stripe-cli#debianubuntu
- **Resultado esperado:** `stripe version` imprime la versión.
- **Cómo verificar:**
  ```bash
  stripe version
  stripe --help
  ```
- **Errores comunes:**
  - La primera vez que ejecutas `stripe login` se abre el navegador. Necesitas una cuenta de Stripe (Paso 7) antes de poder logarte.
- **Cómo revertir:** `npm uninstall -g stripe`.
- **Fuente oficial:** https://docs.stripe.com/stripe-cli

---

## Paso 4: Crear proyecto Supabase (free tier)

- **Objetivo:** Tener una instancia de PostgreSQL gestionada + Auth + Storage lista para usar.
- **Por qué hace falta:** Es la base del backend. Sin proyecto no hay URL ni claves.
- **Prerrequisitos:** Email válido. Supabase CLI instalada (Paso 2) es opcional pero recomendada.
- **Dónde ejecutar:** 🟣 **PANEL** — https://supabase.com/dashboard
- **Acción exacta:**
  1. Crea cuenta en https://supabase.com (puedes usar GitHub OAuth).
  2. Entra al dashboard → botón **"New project"**.
  3. Rellena:
     - **Name:** `poseart-dev` (o el que quieras).
     - **Database Password:** genera una con tu gestor de contraseñas y guárdala. La necesitarás más adelante.
     - **Region:** la más cercana a tus usuarios de prueba (no afecta al desarrollo local, pero sí a latencia).
     - **Pricing plan:** **Free** ($0, 500 MB DB, 50 000 MAU).
  4. Pulsa **"Create new project"** y espera ~2 minutos (Supabase aprovisiona la base).
- **Resultado esperado:** El dashboard muestra "Project is ready" y el nombre del proyecto en la barra superior.
- **Cómo verificar:**
  1. En el menú izquierdo: **Project Settings → General**. Anota el **"Reference ID"** (algo como `abcdefghijklmnop`).
  2. Entra a **SQL Editor** → ejecuta `SELECT now();` → debe devolver la hora actual.
- **Errores comunes:**
  - "Project provisioning failed" → cambia de región o reintenta en 5 minutos. Si persiste, contacta soporte desde el panel.
  - Olvidaste la contraseña de la base de datos → **Project Settings → Database → Reset database password**.
- **Cómo revertir:** **Project Settings → General → Delete project**. Pide confirmación escribiendo el nombre del proyecto. **Irreversible** (los datos se borran).
- **Fuente oficial:** https://supabase.com/docs/guides/getting-started

---

## Paso 5: Obtener URL y `anon key` (públicas)

- **Objetivo:** Conseguir los dos valores que usará el navegador para hablar con Supabase.
- **Por qué hace falta:** Sin estas claves la app no puede hacer ni login ni queries.
- **Prerrequisitos:** Proyecto creado (Paso 4).
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **Project Settings → API**.
- **Acción exacta:**
  1. Copia **"Project URL"** (formato: `https://abcdefghijklmnop.supabase.co`).
  2. Copia **"Project API keys → anon public"** (empieza por `eyJ...`).
- **Resultado esperado:** Tienes dos strings en el portapapeles.
- **Cómo verificar:** Pega la URL en el navegador → debe responder `{"message":"Missing authorization header"}` o similar (es decir, está viva). No uses `curl` todavía sin el header correcto.
- **Errores comunes:**
  - Confundir `anon` con `service_role`. La `anon` tiene etiqueta "public" y es la **única** segura para el navegador.
  - Confundir Project URL con Studio URL. La Project URL acaba en `.supabase.co`, la Studio URL en `.supabase.co/project/...`.
- **Cómo revertir:** N/A. Las claves `anon` no son secretas; no hace falta rotarlas si se filtran (son públicas por diseño, el control de acceso lo hace RLS). Aun así, si sospechas que alguien abusa de tu proyecto, puedes rotarlas en **Project Settings → API → Rotate "anon" key** (ver `12-OPERATIONS-PRIVACY-AND-BACKUPS.md`).
- **Fuente oficial:** https://supabase.com/docs/guides/api/api-keys

---

## Paso 6: Obtener `service_role` key (SECRETA)

- **Objetivo:** Conseguir la clave que omite RLS. Sólo se usa en Edge Functions y scripts de servidor.
- **Por qué hace falta:** Algunas operaciones (webhooks de Stripe, migraciones batch, deletes administrativos) necesitan privilegios totales. La `anon` no puede hacerlas.
- **Prerrequisitos:** Proyecto creado (Paso 4).
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **Project Settings → API**.
- **Acción exacta:**
  1. En la misma pantalla del Paso 5, busca **"Project API keys → service_role"**.
  2. Pulsa **"Reveal"** (Supabase la oculta por defecto).
  3. Cópiala y guárdala en tu gestor de contraseñas. **NUNCA** la pegues en código que vaya al navegador.
- **Resultado esperado:** Tienes un string largo que empieza por `eyJ...` (distinto del `anon`).
- **Cómo verificar:** Abre una terminal y haz una consulta con la clave:
  ```bash
  curl "https://<TU-PROJECT-REF>.supabase.co/rest/v1/profiles?select=count" \
    -H "apikey: <SERVICE_ROLE>" \
    -H "Authorization: Bearer <SERVICE_ROLE>"
  ```
  Debe responder `[]` o una lista (depende de si la tabla existe ya).
- **Errores comunes:**
  - Filtrarla por error en un commit → https://supabase.com/dashboard → **Project Settings → API → Rotate "service_role" key**. **Hazlo inmediatamente** si la filtras. Es tan crítica como la contraseña de la base de datos.
  - Confundirla con la `anon`. Comprueba en Supabase que la etiqueta dice "service_role" o "service_role secret".
- **Cómo revertir / rotar:** **Project Settings → API → Rotate "service_role" key**. Tras rotar, actualiza tu `.env` y los secretos del hosting.
- **Fuente oficial:** https://supabase.com/docs/guides/api/api-keys

---

## Paso 7: Crear cuenta Stripe en modo test

- **Objetivo:** Tener acceso a claves de prueba (`sk_test_...`, `pk_test_...`) y tarjetas de prueba.
- **Por qué hace falta:** Implementarás pagos en modo test durante toda la migración. El modo live se activa **al final**, cuando hayas probado todo.
- **Prerrequisitos:** Email y teléfono válidos. País soportado por Stripe (verifica en https://stripe.com/global).
- **Dónde ejecutar:** 🟣 **PANEL** — https://dashboard.stripe.com/register
- **Acción exacta:**
  1. Regístrate con tu email.
  2. Completa el formulario inicial (país, tipo de negocio, nombre). Puedes dejar campos fiscales vacíos; el modo test no requiere KYC completo.
  3. En el dashboard, comprueba arriba a la derecha que dice **"Test mode"** (interruptor naranja). Si no lo ves, actívalo.
- **Resultado esperado:** El dashboard se ve con badges "Test data" en todas partes y las claves empiezan por `pk_test_` y `sk_test_`.
- **Cómo verificar:** Ve a **Developers → API keys**. Debes ver dos claves: una Publishable (`pk_test_...`) y una Secret (`sk_test_...`).
- **Errores comunes:**
  - Activar "Live mode" por error → cualquier cargo sería real. Verifica el interruptor antes de probar nada.
  - Tu país no está soportado → usa un país soportado para desarrollo. Para producción necesitarás la cuenta en el país real de operación.
- **Cómo revertir:** Puedes borrar la cuenta desde **Settings → Account settings → Close account** (irreversible). Normalmente basta con quedarse en Test mode.
- **Fuente oficial:** https://docs.stripe.com/testing

---

## Paso 8: Obtener Stripe `publishable key` y `secret key`

- **Objetivo:** Tener las dos claves necesarias para integrar Checkout.
- **Por qué hace falta:** `publishable` se usa en el navegador para abrir Checkout. `secret` se usa en Edge Functions para crear la sesión de Checkout y verificar webhooks.
- **Prerrequisitos:** Cuenta Stripe en modo test (Paso 7).
- **Dónde ejecutar:** 🟣 **PANEL** — Stripe Dashboard → **Developers → API keys**.
- **Acción exacta:**
  1. Copia la **Publishable key** (`pk_test_...`). Es pública, segura en el navegador.
  2. Pulsa **"Reveal test key"** en la fila **Secret key** y copia `sk_test_...`. Es SECRETA, nunca la pongas en código del navegador ni en un commit.
  3. (Opcional, recomendado) Crea un **restricted key** en **Developers → API keys → Create restricted key** para los webhooks. Limita los permisos a los mínimos: `Checkout Sessions: Write`, `Webhooks: Read`, `Customers: Write`, `Subscriptions: Write`. Úsala en lugar de la `sk_test_` principal en producción.
- **Resultado esperado:** Tres claves en tu gestor de contraseñas: `pk_test_`, `sk_test_`, y (opcional) `rk_test_`.
- **Cómo verificar:** En la terminal:
  ```bash
  curl https://api.stripe.com/v1/products?limit=1 \
    -u "<sk_test_...>:"
  ```
  Debe responder JSON con `data: []` o una lista de productos. Si responde `401 Invalid API Key`, copia mal la clave.
- **Errores comunes:**
  - Confundir publishable con secret → la publishable empieza por `pk_test_`, la secret por `sk_test_`.
  - Filtrar `sk_test_` → aunque sea test mode, rótala en **Developers → API keys → Roll key**. Nunca dejes una clave filtrada aunque sea de test.
- **Cómo revertir:** Roll (rotar) la clave desde el botón "Roll…" al lado de cada key. La clave antigua deja de funcionar inmediatamente.
- **Fuente oficial:** https://docs.stripe.com/keys

---

## Paso 9: Crear archivo `.env` local (nunca se commitea)

- **Objetivo:** Centralizar todas las claves en un archivo que el servidor local pueda leer pero Git ignora.
- **Por qué hace falta:** Si las pegas en el código, acabarán en GitHub y serán públicas. `.env` + `.gitignore` es el patrón estándar.
- **Prerrequisitos:** Claves de los Pasos 5, 6 y 8. El repositorio clonado en local.
- **Dónde ejecutar:** 📝 **EDITOR** y 🟢 **TERMINAL**.
- **Acción exacta:**
  1. En la raíz del repo (`/home/z/my-project/PoseArt/`), crea el archivo `.env` con este contenido (sustituye los valores entre `<>`):
     ```dotenv
     # ──────────────────────────────────────────────────────────────
     # PoseArt — Variables de entorno LOCAL (NO commitear)
     # ──────────────────────────────────────────────────────────────

     # Supabase (públicas en navegador)
     VITE_SUPABASE_URL=https://<TU-PROJECT-REF>.supabase.co
     VITE_SUPABASE_ANON_KEY=<anon_key>

     # Supabase (SECRETO — sólo Edge Functions / scripts de servidor)
     SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
     SUPABASE_DB_URL=postgresql://postgres:<db_password>@db.<TU-PROJECT-REF>.supabase.co:5432/postgres

     # Stripe (público en navegador)
     VITE_STRIPE_PUBLISHABLE_KEY=<pk_test_...>

     # Stripe (SECRETO — sólo Edge Functions)
     STRIPE_SECRET_KEY=<sk_test_...>
     STRIPE_WEBHOOK_SECRET=<lo obtienes en el Paso de webhooks, ver 07-BILLING>

     # Analytics y errores (ver 09-ANALYTICS)
     VITE_POSTHOG_KEY=<posthog_project_key>
     VITE_POSTHOG_HOST=https://app.posthog.com
     VITE_SENTRY_DSN=<sentry_dsn>
     ```
     > ⚠️ **Nota sobre `VITE_`:** PoseArt no usa Vite hoy. El prefijo `VITE_` es la convención más extendida para "variables públicas del navegador". Si tu bundler es otro (o ninguno), expón estas variables en `window.__ENV__` en un `<script>` inline o sirve `config.js` generado por el hosting. Lo importante es: **las variables sin prefijo `VITE_` NUNCA deben llegar al bundle del navegador.**
  2. Asegúrate de que `.gitignore` incluye `.env`:
     ```bash
     grep -q '^\.env$' .gitignore || echo '.env' >> .gitignore
     grep -q '^\.env\.local$' .gitignore || echo '.env.local' >> .gitignore
     ```
  3. Crea `.env.example` (SÍ se commitea) con los mismos nombres pero valores vacíos, para que otros desarrolladores sepan qué variables existen.
- **Resultado esperado:** `.env` existe localmente y `git status` no lo muestra como sin confirmar (lo está ignorando).
- **Cómo verificar:**
  ```bash
  git check-ignore -v .env
  ```
  Debe imprimir algo como `.gitignore:3:.env    .env`. Si no imprime nada, el `.gitignore` no lo está ignorando.
- **Errores comunes:**
  - Lo commiteaste por error antes de añadirlo al `.gitignore` → `git rm --cached .env` y luego commit. **Aunque lo quites del index, el histórico sigue teniendo la clave.** Si era `service_role` o `sk_test_`, rótala YA.
  - Espacios o comillas alrededor de los valores → en `.env` no pongas comillas salvo que el valor tenga espacios.
  - Windows: asegúrate de que el editor guarda con saltos de línea LF (no CRLF). VS Code lo muestra abajo a la derecha.
- **Cómo revertir:** `rm .env` y vuelve a crearlo. Si lo commiteaste por error, rótala las claves expuestas (no hay marcha atrás segura para un secreto ya en Git).
- **Fuente oficial:** https://supabase.com/docs/guides/local-development/overview#environment-variables

---

## Paso 10: Ejecutar `001-schema.sql` en Supabase

- **Objetivo:** Crear todas las tablas, tipos e índices que usa PoseArt.
- **Por qué hace falta:** Sin tablas no hay dónde escribir ni leer.
- **Prerrequisitos:** Pasos 4 y 9. Archivo `docs/backend/sql/001-schema.sql` creado (si no existe todavía, créalo siguiendo `03-DATA-MODEL.md` antes de ejecutar este paso).
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **SQL Editor → New query**.
- **Acción exacta:**
  1. Abre `docs/backend/sql/001-schema.sql` en tu editor.
  2. Copia todo el contenido al SQL Editor de Supabase.
  3. Pulsa **"Run"** (Ctrl+Enter).
- **Resultado esperado:** Mensaje `Success. No rows returned.` y la lista de tablas aparece en **Table Editor** (izquierda).
- **Cómo verificar:** En el SQL Editor ejecuta:
  ```sql
  \dt
  ```
  O si prefieres SQL plano:
  ```sql
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY table_name;
  ```
  Debes ver (lista canónica de `001-schema.sql`): `profiles`, `user_roles`, `admin_audit_log`, `billing_customers`, `subscriptions`, `subscription_events`, `invoices`, `payment_events`, `webhook_events`, `poses`, `pose_versions`, `tours`, `tour_versions`, `tour_sections`, `tour_items`, `creator_profiles`, `products`, `product_items`, `product_publications`, `reviews`, `entitlements`, `orders`, `order_items`, `purchases`, `refunds`, `favorites`, `user_preferences`, `pose_sessions`, `session_pose_results`, `captures`, `user_progress`, `bug_reports`, `support_messages`.
- **Errores comunes:**
  - `relation "..." already exists` → el esquema ya estaba aplicado (parcial o totalmente). Usa `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` y re-ejecuta (SÓLO en dev, borra todos los datos).
  - `permission denied for schema public` → el usuario de la consola no es owner. Contacta soporte o usa la connection string de la DB con `psql`.
  - Sintaxis inválida en una línea → el SQL Editor muestra la línea exacta. Corrige el archivo y re-ejecuta.
- **Cómo revertir:** `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` (borra TODO). En producción NUNCA uses esto; usa migraciones down explícitas.
- **Fuente oficial:** https://supabase.com/docs/guides/database/overview

---

## Paso 11: Ejecutar `002-rls.sql` en Supabase

- **Objetivo:** Activar Row Level Security y crear las políticas por tabla.
- **Por qué hace falta:** Sin RLS, la `anon key` (pública en el navegador) podría leer y escribir cualquier fila. RLS es el control de acceso real.
- **Prerrequisitos:** Paso 10 completado. Archivo `docs/backend/sql/002-rls.sql` creado.
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **SQL Editor → New query**.
- **Acción exacta:**
  1. Copia el contenido de `002-rls.sql` al SQL Editor.
  2. Pulsa **Run**.
- **Resultado esperado:** `Success. No rows returned.`
- **Cómo verificar:**
  ```sql
  SELECT relname, relrowsecurity
  FROM pg_class
  WHERE relnamespace = 'public'::regnamespace
    AND relkind = 'r'
  ORDER BY relname;
  ```
  Todas las tablas de usuario deben mostrar `relrowsecurity = true` (algunas tablas técnicas internas de Supabase pueden no tenerlo; lo importante son las listadas en el Paso 10).
  Para ver las políticas:
  ```sql
  SELECT tablename, policyname, cmd, roles
  FROM pg_policies
  WHERE schemaname = 'public'
  ORDER BY tablename, policyname;
  ```
- **Errores comunes:**
  - `policy already exists` → el script no es idempotente. Edita para añadir `DROP POLICY IF EXISTS nombre ON tabla;` antes de cada `CREATE POLICY`.
  - RLS activado pero sin políticas → todas las queries devuelven 0 filas (la `anon` no tiene permiso explícito). Es esperado hasta que añades políticas.
  - Pones `USING (true)` en una política de UPDATE por error → cualquier usuario puede editar cualquier fila. Revisa cada política con `11-TESTING-AND-SECURITY-CHECKLIST.md`.
- **Cómo revertir:**
  ```sql
  ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
  -- (repite por cada tabla)
  ```
  Y elimina políticas con `DROP POLICY IF EXISTS ... ON ...;`.
- **Fuente oficial:** https://supabase.com/docs/guides/database/postgres/row-level-security

---

## Paso 12: Crear usuarios de prueba en Supabase Auth

- **Objetivo:** Tener 3 usuarios reales (`devuser`, `devadmin`, `devcreator`) para probar RLS y roles.
- **Por qué hace falta:** El seed (`003-seed-development.sql`) asocia filas a IDs de usuario. Sin usuarios reales, los tests de login fallan.
- **Prerrequisitos:** Paso 4. Auth habilitado por defecto en Supabase.
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **Authentication → Users → "Add user"**.
- **Acción exacta:**
  1. Pulsa **"Add user" → "Create new user"**.
  2. Crea 3 usuarios con estos datos (sustituye el email si prefieres uno real que controles):

     | Email | Contraseña | Auto Confirm |
     |---|---|---|
     | `devuser@poseart.local` | `DevUser2026!` | ✅ Sí |
     | `devadmin@poseart.local` | `DevAdmin2026!` | ✅ Sí |
     | `devcreator@poseart.local` | `DevCreator2026!` | ✅ Sí |

  3. Para cada usuario, copia el **UID** que aparece en la columna "User UID" (formato UUID).
  4. En el SQL Editor, ejecuta antes del seed (Paso 13) una sola vez:
     ```sql
     -- Reemplaza los UUID por los reales del panel de Auth
     set app.dev_user_id    to '00000000-0000-0000-0000-000000000001';
     set app.dev_admin_id   to '00000000-0000-0000-0000-000000000002';
     set app.dev_creator_id to '00000000-0000-0000-0000-000000000003';
     ```
     Estos `set` sólo duran la sesión SQL. Si cierras el SQL Editor y lo abres de nuevo, tendrás que repetir los `set` antes de ejecutar el seed.
- **Resultado esperado:** Tres usuarios en la lista de Authentication con "Confirmed: Yes" y sus UUIDs anotados.
- **Cómo verificar:** Intenta login desde la app (Paso 15) con `devuser@poseart.local` / `DevUser2026!`.
- **Errores comunes:**
  - Olvidas marcar "Auto Confirm User" → el usuario no puede hacer login hasta confirmar por email. Como `@poseart.local` no es un email real, no llegará correo. Marca Auto Confirm o confirma a mano desde la fila del usuario (botón "Confirm").
  - La contraseña no cumple la política (mínimo 8 caracteres por defecto) → Supabase rechaza el alta.
  - Email con dominio raro bloqueado por Supabase → usa un email real si tu cuenta de Supabase tiene restringidos dominios.
- **Cómo revertir:** **Authentication → Users → (fila) → Delete**.
- **Fuente oficial:** https://supabase.com/docs/guides/auth/managing-user-data

---

## Paso 13: Ejecutar `003-seed-development.sql`

- **Objetivo:** Poblar la base con poses oficiales, packs de marketplace, favoritos, sesiones, tours, entitlements y reviews de prueba.
- **Por qué hace falta:** Sin datos, los flujos de UI se ven vacíos y los tests no tienen nada que leer.
- **Prerrequisitos:** Pasos 10, 11 y 12 completados. Reemplazados los UUIDs del script seed por los reales (o configurados con `set app.*`).
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **SQL Editor**.
- **Acción exacta:**
  1. **En la misma sesión** SQL donde hiciste los `set app.dev_*_id` (Paso 12), abre `docs/backend/sql/003-seed-development.sql`.
  2. Copia todo el contenido al SQL Editor.
  3. Pulsa **Run**.
- **Resultado esperado:** `Success. No rows returned.`
- **Cómo verificar:** En el SQL Editor ejecuta la query completa de verificación que aparece al final de `003-seed-development.sql`. Los contadores esperados son:
  - `profiles`: 3, `user_roles`: 3, `creator_profiles`: 1, `user_preferences`: 3
  - `poses`: 6, `pose_versions`: 6, `favorites`: 3
  - `tours`: 1, `tour_sections`: 2, `tour_items`: 4
  - `pose_sessions`: 3, `user_progress`: 1
  - `products`: 7, `product_items`: 2
  - `billing_customers`: 2, `orders`: 1, `purchases`: 1, `entitlements`: 4, `subscriptions`: 1, `subscription_events`: 1
  - `reviews`: 2, `bug_reports`: 1, `admin_audit_log`: 1, `webhook_events`: 1
- **Errores comunes:**
  - `null value in column "user_id" violates not-null constraint` → los `set app.dev_*_id` no están activos en la sesión actual. Vuelve a ejecutar los `set` y re-corre el seed.
  - `insert or update on table "profiles" violates foreign key constraint` → los UUIDs del seed no coinciden con usuarios reales de Auth. Sustitúyelos en el bloque 0 del seed (`SET app.dev_user_id TO '<uuid-real>'`) o confirma los `set app.dev_*_id`.
  - `duplicate key value violates unique constraint "poses_slug_key"` → ya había poses sembradas con esos slugs. Ejecuta primero el bloque 99 de limpieza del seed.
- **Cómo revertir:** Descomenta el bloque 99 del propio `003-seed-development.sql` y ejecútalo. Eso borra las filas sembradas (NO borra usuarios de Auth).
- **Fuente oficial:** (interno — archivo de referencia del propio proyecto).

---

## Paso 14: Arrancar servidor estático local en `:8095`

- **Objetivo:** Servir `index.html` y los `js/` desde un HTTP local para que el navegador pueda abrir la app.
- **Por qué hace falta:** Algunas APIs del navegador (cámara, Service Workers, cookies Secure) no funcionan abriendo el HTML con `file://`. Necesitas `http://localhost`.
- **Prerrequisitos:** Python 3 instalado (en macOS/Linux ya viene; en Windows instálalo desde https://python.org).
- **Dónde ejecutar:** 🟢 **TERMINAL**.
- **Acción exacta:**
  ```bash
  cd /home/z/my-project/PoseArt
  python3 -m http.server 8095
  ```
  Deja la terminal abierta. Para parar: `Ctrl+C`.
- **Resultado esperado:** La terminal imprime `Serving HTTP on 0.0.0.0 port 8095 ...`.
- **Cómo verificar:** Abre el navegador en http://localhost:8095/ → debes ver la pantalla de onboarding o login de PoseArt.
- **Errores comunes:**
  - `Address already in use` → otro proceso ocupa el 8095. Cámbialo: `python3 -m http.server 8096` (actualiza también las URLs de redirección en Supabase y Stripe).
  - Puerto bloqueado por firewall corporativo → usa 8000 o 3000.
  - `python3: command not found` en Windows → ejecuta `py -m http.server 8095` o instala Python.
- **Cómo revertir:** `Ctrl+C` en la terminal.
- **Fuente oficial:** https://docs.python.org/3/library/http.server.html

> 📝 **Alternativa:** si ya usas VS Code, la extensión "Live Server" sirve lo mismo con auto-recarga. Úsala si te resulta más cómodo, pero mantén el puerto 8095 para que coincida con las URLs de redirección configuradas en Supabase/Stripe.

---

## Paso 15: Verificar end-to-end: registro, login, persistencia

- **Objetivo:** Confirmar que todo el stack funciona junto: navegador → Supabase Auth → Postgres → lectura desde la app.
- **Por qué hace falta:** Cada paso individual puede pasar su verificación pero romper al integrarse. Esta prueba es la única que certifica que el setup está completo.
- **Prerrequisitos:** Pasos 1-14 completos. La app ya tiene un adaptador que lee `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (si no lo tiene todavía, configura esto antes — ver `10-LOCALSTORAGE-MIGRATION.md`).
- **Dónde ejecutar:** 🧪 **TEST** — navegador (preferentemente Chrome en modo incógnito para evitar cache de service workers).
- **Acción exacta:**
  1. Abre http://localhost:8095/.
  2. Abre DevTools (F12) → pestaña **Console**.
  3. **Registro nuevo:** si la app lo permite, regístrate con `test+setup@poseart.local`. Si no, usa los usuarios del Paso 12.
  4. **Login:** entra con `devuser@poseart.local` / `DevUser2026!`.
  5. Marca una pose como favorita (p. ej. abre `Standing Confidence` y pulsa el corazón).
  6. En DevTools → **Application → Local Storage → http://localhost:8095** verifica que **NO** haya un `poseart_favorites` con tu nueva pose (debe estar en Supabase, no en localStorage).
  7. En Supabase → **Table Editor → favorites** → debe aparecer una fila con tu `user_id` y el `pose_id` (UUID tipo `a0000000-0000-0000-0000-000000000101`) de la pose que marcaste.
  8. Cierra sesión, vuelve a entrar con el mismo usuario → el favorito debe seguir ahí.
  9. Abre **otro navegador** (o incógnito) → entra con el mismo usuario → el favorito también debe aparecer (verifica sincronización entre dispositivos).
- **Resultado esperado:**
  - No hay errores en Console.
  - Las filas aparecen en Supabase Table Editor.
  - Los datos persisten tras cerrar sesión y entre navegadores.
- **Cómo verificar (RLS bonus):**
  1. Login como `devuser@poseart.local`.
  2. En DevTools → Console, ejecuta:
     ```javascript
     // Reemplaza con tu cliente Supabase global
     const { data, error } = await supabase.from('favorites').select('*');
     console.log({ count: data?.length, error });
     ```
  3. Debes ver `count: 3` (los 3 favoritos sembrados del devuser). **No debes** ver favoritos de otros usuarios.
  4. Intenta leer `profiles`:
     ```javascript
     const { data, error } = await supabase.from('profiles').select('*');
     console.log({ count: data?.length, error });
     ```
     Devuelves sólo tu propio perfil (RLS lo permite). `count: 1`. Si ves 3, la política de RLS está mal (devuelve perfiles ajenos → ver `11-TESTING-AND-SECURITY-CHECKLIST.md` ISO-01).
- **Errores comunes:**
  - `Invalid API key` en Console → revisa que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén bien inyectados.
  - `Login works but favorites don't save` → el adaptador aún escribe en localStorage. Ver `10-LOCALSTORAGE-MIGRATION.md`.
  - `CORS error` → en Supabase → **Authentication → URL Configuration → Site URL** añade `http://localhost:8095`. **Redirect URLs** también.
  - `Email not confirmed` → marca "Auto Confirm" en Supabase Auth o confirma el usuario a mano.
- **Cómo revertir:** Borra los datos de prueba:
  ```sql
  DELETE FROM favorites WHERE user_id = '<tu-test-user-id>';
  ```
  Y en el navegador: DevTools → Application → Clear storage → Clear site data.
- **Fuente oficial:** https://supabase.com/docs/guides/getting-started/quickstarts/javascript

---

## Checklist final

Marca cada casilla antes de dar el setup por terminado:

- [ ] `node -v`, `npm -v`, `supabase -v`, `stripe version` funcionan.
- [ ] Proyecto Supabase creado y "Project is ready".
- [ ] `.env` existe y `git check-ignore -v .env` lo confirma ignorado.
- [ ] `.env.example` commiteado con los mismos nombres pero valores vacíos.
- [ ] `001-schema.sql` ejecutado. `\dt` lista todas las tablas.
- [ ] `002-rls.sql` ejecutado. `relrowsecurity = true` en todas las tablas.
- [ ] 3 usuarios creados en Auth con Auto Confirm.
- [ ] `003-seed-development.sql` ejecutado. Contadores > 0.
- [ ] `python3 -m http.server 8095` corriendo. http://localhost:8095 carga la app.
- [ ] Login con `devuser@poseart.local` funciona.
- [ ] Marcar favorito → aparece en Supabase Table Editor.
- [ ] Logout + login en otro navegador → favorito persiste.
- [ ] RLS verificado: devuser NO puede leer favoritos de otros.

Si todas las casillas están marcadas, el setup local está completo. Pasa a `06-DOMAIN-HOSTING-DEPLOYMENT.md` para configurar el despliegue, o a `07-BILLING-AND-SUBSCRIPTIONS.md` si prefieres integrar Stripe primero.

---

## Siguientes pasos

- `06-DOMAIN-HOSTING-DEPLOYMENT.md` — Cómo desplegar en GitHub Pages / Vercel / Hostinger con dominio propio y HTTPS.
- `07-BILLING-AND-SUBSCRIPTIONS.md` — Integrar Stripe Checkout + webhooks.
- `09-ANALYTICS-AND-OBSERVABILITY.md` — PostHog y Sentry.
- `11-TESTING-AND-SECURITY-CHECKLIST.md` — Pruebas de seguridad obligatorias antes de producción.
