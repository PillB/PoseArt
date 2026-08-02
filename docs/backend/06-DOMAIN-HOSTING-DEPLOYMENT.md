# 06 — Dominio, hosting y despliegue

> **Propósito:** Explicar cómo publicar PoseArt en internet con HTTPS, dominio propio, redirecciones de auth y pagos, y secretos gestionados de forma segura.
>
> **Tiempo estimado:** 1-2 horas (depende del proveedor elegido).
> **Resultado esperado:** URL pública accesible, HTTPS verde, login redirige correctamente, webhook de Stripe llega, secretos fuera del repo.

---

## Cómo leer este documento

Cada paso tiene los campos habituales (Objetivo, Por qué hace falta, Prerrequisitos, Dónde ejecutar, Acción exacta, Resultado esperado, Cómo verificar, Errores comunes, Cómo revertir, Fuente oficial).

### Marcadores visuales

| Marcador | Significado |
|---|---|
| 🟣 **PANEL** | Panel de proveedor (Supabase, Stripe, PostHog, Sentry). |
| 🟢 **TERMINAL** | Terminal local. |
| 📝 **EDITOR** | Editor de código. |
| 🌐 **HOSTING** | Panel del hosting (GitHub, Vercel, Netlify, Cloudflare, Hostinger). |
| 🔀 **DNS** | Panel de DNS (Cloudflare, Namecheap, GoDaddy, etc.). |
| 🧪 **TEST** | Entorno de pruebas. |
| 🚀 **PROD** | Producción. |

> ⚠️ **Aviso:** Los planes y límites citados son los vigentes a fecha de agosto 2026 según la documentación pública de cada proveedor. Verifícalos antes.

---

## Índice

1. [Decisión de hosting](#1-decisión-de-hosting)
2. [Opción A: GitHub Pages (actual)](#2-opción-a-github-pages-actual)
3. [Opción B: Vercel / Netlify / Cloudflare Pages](#3-opción-b-vercel--netlify--cloudflare-pages)
4. [Opción C: Hostinger (si ya lo tienes)](#4-opción-c-hostinger-si-ya-lo-tienes)
5. [Dominio propio y DNS (CNAME)](#5-dominio-propio-y-dns-cname)
6. [HTTPS automático](#6-https-automático)
7. [URLs de redirección para Auth (Supabase)](#7-urls-de-redirección-para-auth-supabase)
8. [URLs de redirección para Stripe Checkout](#8-urls-de-redirección-para-stripe-checkout)
9. [CORS en Supabase](#9-cors-en-supabase)
10. [Variables de entorno en producción](#10-variables-de-entorno-en-producción)
11. [Desplegar Supabase Edge Functions](#11-desplegar-supabase-edge-functions)
12. [Smoke test post-deploy](#12-smoke-test-post-deploy)

---

## 1. Decisión de hosting

PoseArt es HTML+CSS+JS puro sin build step. Cualquier hosting estático sirve. La decisión depende de si ya tienes dominio / hosting o empiezas de cero.

| Proveedor | Coste | HTTPS | Dominio custom | Build step | Mejor para |
|---|---|---|---|---|---|
| **GitHub Pages** | Gratis (repo público) o $4/mes (Pro, repo privado) | ✅ Automático | ✅ | No | Si ya usas GitHub y no necesitas reescritura de URLs |
| **Cloudflare Pages** | Gratis | ✅ Automático | ✅ | Opcional | Si quieres CDN global rápido y free tier generoso |
| **Vercel** | Gratis (hobby) | ✅ Automático | ✅ | Opcional | Si planeas migrar a Next.js más adelante |
| **Netlify** | Gratis (starter) | ✅ Automático | ✅ | Opcional | Si quieres formularios y functions serverless |
| **Hostinger** | Desde ~$2-3/mes (plan shared) | ✅ Let's Encrypt | ✅ | No | Si ya pagaste hosting compartido |

> **Recomendación por defecto:** sigue con **GitHub Pages** (ya funciona). Cámbiate si necesitas dominio custom más limpio, reescritura de URLs, o quieres Edge Functions en el mismo proveedor.

---

## 2. Opción A: GitHub Pages (actual)

PoseArt ya está desplegado en `https://pillb.github.io/PoseArt/` mediante `.github/workflows/deploy.yml`. Si no necesitas dominio propio ni Edge Functions propias, sigue con esta opción.

### 2.1 Verificar que el workflow está activo

- **Objetivo:** Confirmar que cada push a `master` despliega automáticamente.
- **Por qué hace falta:** Si el workflow está desactivado o roto, los cambios no se publican.
- **Dónde ejecutar:** 🌐 **HOSTING** — GitHub → tu repo → pestaña **Actions**.
- **Acción exacta:**
  1. Entra a `https://github.com/PillB/PoseArt/actions`.
  2. Verifica que existe el workflow "Deploy PoseArt to GitHub Pages".
  3. Pulsa el último run → debe decir "✅ success" en todos los pasos.
- **Resultado esperado:** Runs recientes en verde.
- **Cómo verificar:** Haz un commit pequeño en `master` (cambia un comentario) y observa que un nuevo run se dispara.
- **Errores comunes:**
  - Run en rojo → abre el log del paso fallido. El error más común es `permissions: pages: write` ausente en el workflow (ya está en tu `deploy.yml`).
  - "Page not found" → en **Settings → Pages → Build and deployment → Source** debe estar "GitHub Actions".
- **Cómo revertir:** En **Settings → Pages** puedes cambiar el source a "Deploy from a branch" y seleccionar `master / root` como alternativa sin workflow.
- **Fuente oficial:** https://docs.github.com/es/pages/getting-started-with-github-pages/about-github-pages

### 2.2 Habilitar GitHub Pages (si no estaba)

- **Objetivo:** Activar Pages si el repo es nuevo.
- **Por qué hace falta:** Sin Pages habilitado, el workflow falla.
- **Dónde ejecutar:** 🌐 **HOSTING** — repo → **Settings → Pages**.
- **Acción exacta:**
  1. **Source:** "GitHub Actions".
  2. No hace falta elegir branch (lo gestiona el workflow).
- **Resultado esperado:** El próximo push a `master` despliega en `https://<usuario>.github.io/<repo>/`.
- **Errores comunes:** El repo debe ser público en cuenta gratis, o la cuenta debe ser Pro para repos privados con Pages.
- **Cómo revertir:** **Settings → Pages → Source: None**.
- **Fuente oficial:** https://docs.github.com/es/pages

### 2.3 Limitaciones de GitHub Pages a tener en cuenta

| Límite | Valor |
|---|---|
| Tamaño del repo | Recomendado ≤ 1 GB |
| Ancho de banda | 100 GB/mes (soft) |
| Builds | 10/hora |
| HTTPS | Automático (no puedes desactivarlo) |
| HTTP → HTTPS | Automático |
| Redirecciones 301 | No soportadas en plano. Usa `<meta http-equiv="refresh">` o JS. |
| Headers custom (CSP, HSTS) | No soportados directamente. |

> ⚠️ **No verificado:** la política de GitHub sobre redirecciones y headers puede haber cambiado. Verifica en https://docs.github.com/es/pages antes de depender de esto.

---

## 3. Opción B: Vercel / Netlify / Cloudflare Pages

### 3.1 Desplegar en Cloudflare Pages (recomendado si cambias de GitHub Pages)

- **Objetivo:** Migrar el static hosting a Cloudflare.
- **Por qué hace falta:** Cloudflare ofrece CDN global más rápido, build step opcional, y 500 builds/mes gratis.
- **Prerrequisitos:** Cuenta en Cloudflare (https://dash.cloudflare.com/sign-up).
- **Dónde ejecutar:** 🌐 **HOSTING** — Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
- **Acción exacta:**
  1. Conecta tu cuenta de GitHub y autoriza el repo `PillB/PoseArt`.
  2. Configuración del build:
     - **Framework preset:** None.
     - **Build command:** (vacío — no hay build step).
     - **Build output directory:** `/` (raíz del repo).
     - **Root directory:** `/`.
  3. Variables de entorno (ver sección 10).
  4. **Save and Deploy**.
- **Resultado esperado:** URL `https://poseart.pages.dev` (o similar) accesible.
- **Cómo verificar:** Visita la URL. La app debe cargar.
- **Errores comunes:**
  - "Build failed: output directory not found" → pon `/` no `./`.
  - Los GIFs no cargan → algunos pesan > 25 MB y Cloudflare bloquea archivos > 25 MB en plan gratis. Sube esos recursos a R2 Storage o usa un CDN externo.
- **Cómo revertir:** **Workers & Pages → (tu proyecto) → Settings → Delete**.
- **Fuente oficial:** https://developers.cloudflare.com/pages/

### 3.2 Desplegar en Vercel

- **Dónde ejecutar:** 🌐 **HOSTING** — https://vercel.com/new
- **Acción exacta:**
  1. Importa el repo desde GitHub.
  2. Framework Preset: **Other**.
  3. Build Command: (vacío).
  4. Output Directory: `./` (raíz).
  5. Environment Variables (ver sección 10).
  6. **Deploy**.
- **Resultado esperado:** URL `https://poseart.vercel.app`.
- **Errores comunes:**
  - Vercel espera un `package.json` por defecto. Si no existe, ignora el warning.
  - Si más adelante añades Vite, Vercel lo detecta automáticamente.
- **Cómo revertir:** Project Settings → Advanced → Delete Project.
- **Fuente oficial:** https://vercel.com/docs/getting-started

### 3.3 Desplegar en Netlify

- **Dónde ejecutar:** 🌐 **HOSTING** — https://app.netlify.com/start
- **Acción exacta:**
  1. "Import from Git" → selecciona el repo.
  2. Build command: (vacío).
  3. Publish directory: `.` (raíz).
  4. Advanced → Environment variables (sección 10).
  5. **Deploy site**.
- **Resultado esperado:** URL `https://<random>.netlify.app`.
- **Errores comunes:** Si tienes archivos > 25 MB, Netlify los rechaza en plan gratis.
- **Cómo revertir:** Site settings → Delete site.
- **Fuente oficial:** https://docs.netlify.com/

---

## 4. Opción C: Hostinger (si ya lo tienes)

Hostinger es hosting compartido/vPS. Funciona para PoseArt pero requiere pasos manuales.

- **Objetivo:** Subir archivos por FTP/git y servirlos con Apache/nginx.
- **Por qué hace falta:** Si ya pagaste Hostinger y no quieres añadir otro proveedor.
- **Prerrequisitos:** Plan de Hostinger activo (hPanel).
- **Dónde ejecutar:** 🌐 **HOSTING** — hPanel de Hostinger.
- **Acción exacta:**
  1. **hPanel → Files → File Manager → public_html**.
  2. Sube todos los archivos del repo (arrastra el ZIP y extrae, o usa FTP con FileZilla).
  3. Asegúrate de que `index.html` está en `public_html/index.html` (no en subcarpeta).
  4. **hPanel → Domains → SSL** → instala Let's Encrypt (gratis).
- **Resultado esperado:** `https://tudominio.com` carga la app.
- **Cómo verificar:** Visita la URL y comprueba el candado HTTPS.
- **Errores comunes:**
  - "403 Forbidden" → falta `index.html` o permisos incorrectos (carpetas 755, archivos 644).
  - MIME type erróneo para `.js` → en `.htaccess` añade `AddType application/javascript .js`.
  - Cache agresiva de Hostinger → añade `.htaccess` con `Header set Cache-Control "no-cache"` durante desarrollo.
- **Cómo revertir:** Borra los archivos de `public_html`.
- **Fuente oficial:** https://support.hostinger.com/

> ⚠️ **No verificado:** los pasos exactos de hPanel pueden cambiar. Consulta la base de conocimiento de Hostinger antes.

---

## 5. Dominio propio y DNS (CNAME)

### 5.1 Si usas GitHub Pages con dominio custom

- **Objetivo:** Servir PoseArt en `https://poseart.com` (o el dominio que tengas) en lugar de `https://pillb.github.io/PoseArt/`.
- **Por qué hace falta:** URL más limpia, mejor SEO, marca consistente.
- **Prerrequisitos:** Dominio comprado. Acceso al panel DNS del dominio.
- **Dónde ejecutar:** 🔀 **DNS** (panel del registrador o Cloudflare) + 🌐 **HOSTING** (GitHub).
- **Acción exacta:**
  1. En el panel DNS de tu dominio, crea uno de estos registros:
     - **Apex (`poseart.com`):** cuatro registros `A` apuntando a:
       - `185.199.108.153`
       - `185.199.109.153`
       - `185.199.110.153`
       - `185.199.111.153`
     - **Subdominio (`www.poseart.com`):** registro `CNAME` apuntando a `pillb.github.io.`
  2. En el repo → **Settings → Pages → Custom domain** → escribe `poseart.com` (o `www.poseart.com`).
  3. Pulsa **Save** y marca **"Enforce HTTPS"** (espera ~15 min a que emita el certificado).
- **Resultado esperado:** `https://poseart.com` carga la app.
- **Cómo verificar:**
  ```bash
  dig poseart.com +short
  ```
  Debe listar las IPs de GitHub Pages. Si ves IPs distintas, el DNS no ha propagado aún (espera 5-60 min).
- **Errores comunes:**
  - "CNAME conflict" si tu dominio tiene ya un registro A y un CNAME en la raíz → la raíz NO puede tener CNAME (sólo A). Usa los 4 registros A listados arriba.
  - HTTPS no se activa → espera hasta 1 hora. Si no se activa, en **Pages → Custom domain → Renew certificate**.
  - El dominio apunta a GitHub pero aparece 404 → el campo "Custom domain" en Settings → Pages debe coincidir exactamente con el dominio configurado en DNS.
- **Cómo revertir:** En Settings → Pages → Custom domain → **Remove**. Y borra los registros DNS.
- **Fuente oficial:** https://docs.github.com/es/pages/configuring-a-custom-domain-for-your-github-pages-site

### 5.2 Si usas Cloudflare Pages

- **Dónde ejecutar:** 🔀 **DNS** (Cloudflare).
- **Acción exacta:**
  1. Cloudflare Pages → tu proyecto → **Custom domains → Set up a custom domain**.
  2. Escribe `poseart.com` → Cloudflare configura el DNS automáticamente si el dominio está en Cloudflare.
  3. Si el dominio está en otro registrador, sigue las instrucciones (apuntar CNAME a `<project>.pages.dev`).
- **Resultado esperado:** Estado "Active" junto al dominio.
- **Errores comunes:** Modo "Proxied" (nube naranja) en Cloudflare puede romper SSL si tu origen tiene SSL inválido. Ponlo en "DNS only" (nube gris) para debug.
- **Cómo revertir:** Custom domains → Remove.
- **Fuente oficial:** https://developers.cloudflare.com/pages/configuration/custom-domains/

### 5.3 Si usas Hostinger

- **Dónde ejecutar:** 🔀 **DNS** (hPanel de Hostinger o registrador).
- **Acción exacta:** Apunta el dominio a la IP de tu hosting (hPanel → DNS Zone → A record).
- **Fuente oficial:** https://support.hostinger.com/en/articles/4409203-how-to-manage-dns-zones-in-hpanel

---

## 6. HTTPS automático

| Proveedor | Mecanismo | Acción requerida |
|---|---|---|
| GitHub Pages | Let's Encrypt gestionado por GitHub | Marcar "Enforce HTTPS" en Settings → Pages |
| Cloudflare Pages | Let's Encrypt gestionado por Cloudflare | Ninguna (se activa al añadir dominio) |
| Vercel | Let's Encrypt gestionado | Ninguna |
| Netlify | Let's Encrypt gestionado | Ninguna |
| Hostinger | Let's Encrypt vía hPanel | hPanel → SSL → Install |

- **Objetivo:** Toda la app servida por HTTPS.
- **Por qué hace falta:** Las APIs de cámara, Service Workers y cookies Secure requieren HTTPS. Stripe y Supabase también lo exigen para redirecciones.
- **Cómo verificar:** En el navegador, el icono debe ser candado verde. Simixed content (HTTP dentro de HTTPS), DevTools → Console mostrará warnings.
- **Errores comunes:**
  - Mixed content → busca en `index.html` y `js/*.js` URLs `http://` y cámbialas a `https://` (o relativas).
  - Certificado caducado → renueva desde el panel del proveedor.
- **Cómo revertir:** No recomendado. HTTPS es obligatorio para Stripe/Supabase.

---

## 7. URLs de redirección para Auth (Supabase)

- **Objetivo:** Que el flujo de login/registro/reset redirija a URLs válidas.
- **Por qué hace falta:** Supabase Auth usa redirects (email magic link, OAuth providers). Si la URL no está en la lista de permitidas, rechaza la redirección.
- **Prerrequisitos:** URL de producción conocida (sección 5).
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **Authentication → URL Configuration**.
- **Acción exacta:**
  1. **Site URL:** tu URL de producción, p. ej. `https://poseart.com` o `https://pillb.github.io/PoseArt/`.
  2. **Redirect URLs** (lista blanca), añade todas las que vayas a usar:

     ```
     http://localhost:8095
     http://localhost:8095/auth/callback
     http://127.0.0.1:8095
     https://pillb.github.io
     https://pillb.github.io/PoseArt/
     https://pillb.github.io/PoseArt/auth/callback
     https://poseart.com
     https://poseart.com/auth/callback
     https://www.poseart.com
     https://www.poseart.com/auth/callback
     https://poseart.pages.dev
     https://poseart.pages.dev/auth/callback
     ```
  3. **Save**.
- **Resultado esperado:** Login redirects funcionan desde cualquier entorno listado.
- **Cómo verificar:** Abre la app en `http://localhost:8095`, intenta login → redirige correctamente. Si no está en la lista, Supabase devuelve error `redirect_uri_mismatch`.
- **Errores comunes:**
  - Olvidas añadir la URL con y sin `www.` → algunas redirecciones OAuth fallan.
  - Para GitHub Pages, la URL **debe** incluir el path base `/PoseArt/` (con barra final).
  - Trailing slash: `https://poseart.com` y `https://poseart.com/` se consideran distintas por Supabase. Añade ambas si tu app recibe ambos.
- **Cómo revertir:** Borra las URLs no deseadas de la lista.
- **Fuente oficial:** https://supabase.com/docs/guides/auth#redirect-urls-and-site-url

---

## 8. URLs de redirección para Stripe Checkout

- **Objetivo:** Tras completar o cancelar un pago, Stripe redirige al usuario a tu app.
- **Por qué hace falta:** Sin URLs configuradas, Checkout falla al crear la sesión.
- **Prerrequisitos:** URL de producción conocida.
- **Dónde ejecutar:** 📝 **EDITOR** (en la Edge Function que crea la sesión) — NO en el panel de Stripe (las URLs se pasan por sesión).
- **Acción exacta:**
  1. En tu Edge Function `create-checkout` (ver `07-BILLING-AND-SUBSCRIPTIONS.md`), define las URLs dinámicamente:
     ```typescript
     const successUrl = `${BASE_URL}/#/billing/success?session_id={CHECKOUT_SESSION_ID}`;
     const cancelUrl  = `${BASE_URL}/#/billing/cancel`;
     ```
     donde `BASE_URL` se lee de una variable de entorno `PUBLIC_APP_URL`.
  2. **NO uses el success URL como prueba de pago.** Sólo el webhook verificado confirma. Ver `00-READ-ME-FIRST.md`.
- **Resultado esperado:** Tras Checkout, el navegador vuelve a tu app en el path de éxito o cancelación.
- **Cómo verificar:**
  1. En Stripe CLI, reenvía un evento de test:
     ```bash
     stripe trigger checkout.session.completed
     ```
  2. Tu webhook recibe el evento, lo verifica, actualiza la base de datos.
  3. El usuario, mientras tanto, fue redirigido al successUrl.
- **Errores comunes:**
  - URL con `localhost` en producción → Stripe rechaza. En dev usa Stripe CLI (que sí permite localhost para el webhook, no para el redirect del navegador).
  - Olvidar `{CHECKOUT_SESSION_ID}` en el success URL → no puedes verificar en el cliente. Aun así, **no confíes en la verificación del cliente**.
- **Cómo revertir:** Cambia las URLs en el código de la Edge Function y redeploy.
- **Fuente oficial:** https://docs.stripe.com/payments/checkout/custom-success-page

---

## 9. CORS en Supabase

- **Objetivo:** Permitir que el navegador haga peticiones a Supabase desde tu dominio.
- **Por qué hace falta:** Si CORS no está configurado, el navegador bloquea las peticiones cross-origin.
- **Dónde ejecutar:** 🟣 **PANEL** — Supabase Dashboard → **Authentication → URL Configuration**.
- **Acción exacta:**
  1. Por defecto, Supabase permite cualquier origen para la API REST si el header `apikey` está presente. La lista de "Redirect URLs" (sección 7) controla redirects de Auth, no CORS de REST.
  2. Si necesitas restringir CORS explícitamente a tus dominios, configura el archivo `config.toml` (en proyectos self-hosted). En Supabase Cloud gestionado no se expone de forma directa; en su lugar, gestiona el acceso con RLS.
- **Resultado esperado:** Las peticiones desde tu dominio funcionan sin error CORS en DevTools.
- **Cómo verificar:**
  1. Abre DevTools → Network.
  2. Recarga la app y filtra por `supabase.co`.
  3. Las peticiones deben tener `access-control-allow-origin: *` o tu dominio específico.
- **Errores comunes:**
  - "CORS error" real suele ser en realidad un error de auth (401) que el navegador etiqueta como CORS. Comprueba el status code real.
  - Si haces fetch a `/functions/v1/...` desde un dominio no listado en el secret del webhook, falla.
- **Cómo revertir:** Vuelve a la configuración por defecto.
- **Fuente oficial:** https://supabase.com/docs/guides/api/cors

---

## 10. Variables de entorno en producción

### 10.1 GitHub Pages: GitHub Secrets + workflow

- **Objetivo:** Inyectar claves en el bundle **sin** que aparezcan en el repo público.
- **Por qué hace falta:** GitHub Pages no tiene runtime env. Las claves públicas (`anon`, `pk_test_`) hay que meterlas en el HTML/JS en build time.
- **Dónde ejecutar:** 🌐 **HOSTING** — GitHub → **Settings → Secrets and variables → Actions**.
- **Acción exacta:**
  1. Crea "Repository secrets" para cada variable. **SÓLO para secretos del servidor** que se usarán dentro del workflow (p. ej. para desplegar Edge Functions). En GitHub Pages no hay servidor, así que la mayoría de secretos no se usan aquí.
  2. Para las **claves públicas del navegador** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_POSTHOG_KEY`, `VITE_SENTRY_DSN`):
     - Opción A (recomendada): crea "Repository variables" (no secrets, porque son públicas) y modifícalas en el workflow para sustituir placeholders en `index.html` o en un `config.js` generado.
     - Opción B: crea el archivo `js/config.js` con los valores y commitealo. **SÓLO** claves públicas. Jamás secretos.
  3. En el workflow, antes de `upload-pages-artifact`, genera `js/config.js`:
     ```yaml
     - name: Generate public config
       run: |
         mkdir -p js
         cat > js/config.js <<EOF
         window.__ENV__ = {
           SUPABASE_URL: "${{ vars.VITE_SUPABASE_URL }}",
           SUPABASE_ANON_KEY: "${{ vars.VITE_SUPABASE_ANON_KEY }}",
           STRIPE_PUBLISHABLE_KEY: "${{ vars.VITE_STRIPE_PUBLISHABLE_KEY }}",
           POSTHOG_KEY: "${{ vars.VITE_POSTHOG_KEY }}",
           POSTHOG_HOST: "${{ vars.VITE_POSTHOG_HOST }}",
           SENTRY_DSN: "${{ vars.VITE_SENTRY_DSN }}"
         };
         EOF
     ```
- **Resultado esperado:** En producción, `window.__ENV__` está definido con las claves. En el repo, no hay secretos commiteados.
- **Cómo verificar:** Abre la app en producción, DevTools Console:
  ```javascript
  console.log(window.__ENV__);
  ```
  Debe imprimir las claves. Si imprime `undefined`, el paso del workflow no se ejecutó.
- **Errores comunes:**
  - Pones secretos como "variables" en lugar de "secrets" → son visibles en logs del workflow. Usa "secrets" para todo lo que sea sensible.
  - Olvidas el paso de generación → `window.__ENV__` no existe y la app falla.
- **Cómo revertir:** Quita el paso del workflow y restaura `js/config.js` con valores de test.
- **Fuente oficial:** https://docs.github.com/es/actions/security-guides/using-secrets-in-github-actions

### 10.2 Vercel / Netlify / Cloudflare Pages: variables de entorno

- **Dónde ejecutar:** 🌐 **HOSTING** — panel del proveedor.
- **Acción exacta:**
  - **Vercel:** Project Settings → Environment Variables. Define cada variable y marca el entorno (Production, Preview, Development).
  - **Netlify:** Site settings → Environment variables.
  - **Cloudflare Pages:** Settings → Environment variables.
- **Resultado esperado:** Las variables están disponibles en build time.
- **Errores comunes:** Sin build step, las variables de entorno del proveedor NO se inyectan en el navegador automáticamente. Necesitas un script que las lea y genere `js/config.js` (igual que en GitHub Pages).
- **Cómo revertir:** Borra las variables del panel.
- **Fuente oficial:** https://vercel.com/docs/projects/environment-variables

### 10.3 Hostinger: `.env` o `config.php`

- En Hostinger shared hosting, las variables de entorno se setean vía `.htaccess`:
  ```apache
  SetEnv SUPABASE_URL https://tu-proyecto.supabase.co
  ```
- Como no hay runtime Node, lo normal es generar `js/config.js` en local con los valores y subirlo por FTP.
- **Fuente oficial:** https://support.hostinger.com/

---

## 11. Desplegar Supabase Edge Functions

Las Edge Functions viven en Supabase, no en tu hosting estático. Se despliegan con la CLI.

- **Objetivo:** Publicar funciones serverless (webhook de Stripe, creación de Checkout, etc.).
- **Por qué hace falta:** Son el único lugar donde puedes usar `service_role` y `STRIPE_SECRET_KEY` de forma segura.
- **Prerrequisitos:** Supabase CLI (Paso 2 de `05-LOCAL-SETUP.md`). Estar logado con `supabase login`.
- **Dónde ejecutar:** 🟢 **TERMINAL**.
- **Acción exacta:**
  1. En la raíz del repo, inicializa el proyecto Supabase local (si no existe ya):
     ```bash
     supabase init
     ```
     Esto crea `supabase/` con `config.toml` y `supabase/functions/`.
  2. Enlaza tu proyecto cloud:
     ```bash
     supabase link --project-ref <TU-PROJECT-REF>
     ```
  3. Crea una función:
     ```bash
     supabase functions new create-checkout
     ```
     Esto crea `supabase/functions/create-checkout/index.ts`.
  4. Edita el código (ver `07-BILLING-AND-SUBSCRIPTIONS.md`).
  5. Setea los secretos en Supabase:
     ```bash
     echo "<sk_test_...>" | supabase secrets set STRIPE_SECRET_KEY=-
     echo "<whsec_...>"  | supabase secrets set STRIPE_WEBHOOK_SECRET=-
     echo "<service_role>" | supabase secrets set SUPABASE_SERVICE_ROLE_KEY=-
     ```
  6. Despliega:
     ```bash
     supabase functions deploy create-checkout --no-verify-jwt
     ```
     El flag `--no-verify-jwt` se usa para la función de webhook (la llama Stripe, no un usuario con JWT). Para funciones que SÍ requieren usuario autenticado, omite el flag.
- **Resultado esperado:** La función está publicada en `https://<project-ref>.supabase.co/functions/v1/create-checkout`.
- **Cómo verificar:**
  ```bash
  supabase functions list
  ```
  Tu función aparece con `Status: deployed`.
- **Errores comunes:**
  - `Function not found` → el nombre del directorio debe coincidir con el de la función.
  - `JWT verification failed` → estás llamando a una función protegida sin token. Pasa `--no-verify-jwt` sólo a webhooks públicos.
  - Cambios no se reflejan → fallo el deploy. Re-ejecuta y lee el output.
- **Cómo revertir:**
  ```bash
  supabase functions delete create-checkout
  ```
- **Fuente oficial:** https://supabase.com/docs/guides/functions

---

## 12. Smoke test post-deploy

- **Objetivo:** Confirmar que la app en producción funciona end-to-end tras el despliegue.
- **Por qué hace falta:** Lo que funciona en local puede romper en prod por URLs, CORS, certificados o variables faltantes.
- **Dónde ejecutar:** 🚀 **PROD** + 🧪 **TEST**.
- **Acción exacta:**
  1. Visita tu URL de producción.
  2. DevTools → Console → no debe haber errores.
  3. Login con un usuario real (o el `devuser@poseart.local` si dejaste Auto Confirm).
  4. Marca un favorito → refresca → el favorito persiste.
  5. DevTools → Network → verifica que las peticiones a `supabase.co` responden 200 (no 401, no CORS).
  6. (Si Stripe está integrado) Inicia Checkout con tarjeta de test `4242 4242 4242 4242`, cualquier fecha futura, cualquier CVC. Debe redirigir al successUrl.
  7. Verifica en Supabase → `entitlements` que la fila correspondiente se creó (webhook funcionó).
  8. (Si analytics está integrado) PostHog → Live Events → aparecen tus eventos.
  9. (Si Sentry está integrado) Provoca un error intencionado en local y mira si llega a Sentry.
- **Resultado esperado:** Todo verde.
- **Errores comunes:**
  - `apikey missing` → `window.__ENV__` no se generó. Ver sección 10.
  - `redirect_uri_mismatch` en Supabase Auth → falta URL en la lista (sección 7).
  - Stripe Checkout 401 → `STRIPE_SECRET_KEY` mal configurada en Supabase Secrets.
- **Cómo revertir:** Si es crítico, en GitHub puedes hacer `git revert` del último commit y el workflow redeployará automáticamente. En Vercel/Netlify usa "Instant Rollback" en el panel.

---

## Resumen de URLs que debes tener documentadas

Crea un archivo `docs/backend/URLS.md` (o añádelo a `SOURCE-LEDGER.md`) con:

```
Producción app:        https://<tu-dominio>/
Staging app:           https://<staging>.pages.dev/  (si usas Vercel/Cloudflare preview)
Local app:             http://localhost:8095/
Supabase Dashboard:    https://supabase.com/dashboard/project/<ref>
Supabase API base:     https://<ref>.supabase.co
Supabase Edge Fn base: https://<ref>.supabase.co/functions/v1/
Stripe Dashboard:      https://dashboard.stripe.com/test/dashboard
Stripe Webhook URL:    https://<ref>.supabase.co/functions/v1/stripe-webhook
PostHog:               https://app.posthog.com/project/<id>
Sentry:                https://sentry.io/organizations/<org>/projects/poseart/
```

Mantén este archivo actualizado en cada rotación de claves o cambio de dominio.
