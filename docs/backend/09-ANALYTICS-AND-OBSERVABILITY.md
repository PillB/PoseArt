# 09 — Analytics y observabilidad

> **Propósito:** Definir qué medimos, cómo lo medimos, qué no medimos nunca, y cómo detectamos errores en producción.
>
> **Tiempo estimado:** 1-2 horas de setup + revisión semanal de 15 min.
> **Resultado esperado:** PostHog recibe eventos canonizados, Sentry captura errores JS, ambos respetan el consentimiento del usuario y nunca envían PII.

---

## Cómo leer este documento

Cada paso tiene los campos habituales (Objetivo, Por qué hace falta, Prerrequisitos, Dónde ejecutar, Acción exacta, Resultado esperado, Cómo verificar, Errores comunes, Cómo revertir, Fuente oficial).

### Marcadores visuales

| Marcador | Significado |
|---|---|
| 🟣 **PANEL** | Panel de proveedor (PostHog, Sentry). |
| 🟢 **TERMINAL** | Terminal local. |
| 📝 **EDITOR** | Editor de código. |
| 🌐 **HOSTING** | Panel del hosting. |
| 🧪 **TEST** | Entorno de pruebas. |
| 🚀 **PROD** | Producción. |

> ⚠️ **Aviso:** Los planes gratuitos y límites citados son los vigentes a fecha de agosto 2026 según la documentación pública de cada proveedor. Verifícalos antes.

---

## Índice

1. [PostHog: crear proyecto y obtener key](#1-posthog-crear-proyecto-y-obtener-key)
2. [PostHog: integrar SDK en el navegador](#2-posthog-integrar-sdk-en-el-navegador)
3. [Sentry: crear proyecto y obtener DSN](#3-sentry-crear-proyecto-y-obtener-dsn)
4. [Sentry: integrar SDK en el navegador](#4-sentry-integrar-sdk-en-el-navegador)
5. [Banner de consentimiento (RGPD)](#5-banner-de-consentimiento-rgpd)
6. [Taxonomía de eventos](#6-taxonomía-de-eventos)
7. [Reglas de privacidad obligatorias](#7-reglas-de-privacidad-obligatorias)
8. [Funnels y retención](#8-funnels-y-retención)
9. [Identidad de usuario y sesiones](#9-identidad-de-usuario-y-sesiones)
10. [Verificación end-to-end](#10-verificación-end-to-end)

---

## 1. PostHog: crear proyecto y obtener key

- **Objetivo:** Tener un proyecto PostHog y su Project API Key pública (para el navegador).
- **Por qué hace falta:** Sin esto no puedes enviar eventos.
- **Prerrequisitos:** Email válido.
- **Dónde ejecutar:** 🟣 **PANEL** — https://app.posthog.com/signup (o self-hosted si ya tienes uno).
- **Acción exacta:**
  1. Regístrate. Plan Cloud Free: 1M eventos/mes, sin tarjeta de crédito.
  2. Crea organización → crea proyecto → llámalo `poseart-prod`. Crea también `poseart-dev` para desarrollo (así no contaminas datos de prod con eventos de dev).
  3. En **Project Settings → Project API key** copia el valor (`phc_...`). Es pública, segura en el navegador.
  4. En **Project Settings → User & Team API keys** puedes crear claves de server (NO para el navegador). Sólo úsalas en Edge Functions.
- **Resultado esperado:** Tienes dos claves por entorno: `phc_prod_...` y `phc_dev_...`.
- **Cómo verificar:** En la terminal:
  ```bash
  curl -X POST https://app.posthog.com/capture/ \
    -H "Content-Type: application/json" \
    -d '{
      "api_key":"<phc_...>",
      "event":"test_event",
      "distinct_id":"test-cli",
      "properties":{"hello":"world"}
    }'
  ```
  Debe responder `{"status":"ok"}`. En el panel → **Activity → Live events** verás `test_event` en segundos.
- **Errores comunes:**
  - Confundes Project API Key (pública) con Personal API Key (privada). La pública empieza por `phc_`.
  - Eventos no llegan → comprueba que el `host` coincide (`https://app.posthog.com` para Cloud).
- **Cómo revertir:** Project Settings → Danger Zone → Delete project.
- **Fuente oficial:** https://posthog.com/docs/getting-started/install

> ⚠️ **No verificado:** los límites del plan gratuito (1M eventos/mes) pueden haber cambiado. Verifica en https://posthog.com/pricing antes de planificar volumetría.

---

## 2. PostHog: integrar SDK en el navegador

- **Objetivo:** Inicializar PostHog en PoseArt y empezar a capturar automáticamente pageviews y sesiones.
- **Por qué hace falta:** Sin SDK, tienes que enviar eventos a mano con `fetch` (muy propenso a errores).
- **Prerrequisitos:** Key del Paso 1. Variables `VITE_POSTHOG_KEY` y `VITE_POSTHOG_HOST` en tu `.env`.
- **Dónde ejecutar:** 📝 **EDITOR**.
- **Acción exacta:**
  1. Añade el script de PostHog en `index.html` (head), antes de cualquier otro script de la app:
     ```html
     <script>
       !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1])}t[s]=t[s]||function(e){g(this,e);var t=Array.prototype.slice.call(arguments);t[0]=t[0].split(".");var i=t[0][0],s=t[0][1],a=t[1]||{};void 0===t[2]&&void 0===a.identify?Object.assign(a,{$set:s}):void 0!==t[2]&&Object.assign(a,{$set_once:s});a.$lib="web";a.$lib_version="1.0.0";t=t.slice(1);var n=a.featureFlags;a.featureFlags=void 0;a._i.push([i,t,a,void 0!==n?n:{}])},e.__SV=1)}(document,window.posthog||[]);
       posthog.init(window.__ENV__?.POSTHOG_KEY || '__POSTHOG_PLACEHOLDER__', {
         api_host: window.__ENV__?.POSTHOG_HOST || 'https://app.posthog.com',
         autocapture: false,
         capture_pageview: true,
         persistence: 'localStorage+cookie',
         disable_session_recording: true,
         opt_out_capturing_by_default: true
       });
     </script>
     ```
     Notas importantes:
     - `autocapture: false` → no capturamos todos los clics automáticamente (privacidad + tamaño del payload).
     - `capture_pageview: true` → sí capturamos pageviews (son ligeros y útiles).
     - `opt_out_capturing_by_default: true` → por defecto NO se envían eventos hasta que el usuario dé consentimiento explícito. Esto es la postura correcta por defecto en Europa (RGPD).
     - `disable_session_recording: true` → no grabamos sesiones de pantalla (si lo activas, los usuarios podrían exponer PII visual).
- **Resultado esperado:** En DevTools → Network verás peticiones a `https://app.posthog.com/e/` (decide) y `/i/` (capture).
- **Cómo verificar:**
  1. En el panel PostHog → Activity → Live events. Debe aparecer `pageview` cuando recargas la app.
  2. En la consola del navegador: `posthog.get_distinct_id()` devuelve un string.
- **Errores comunes:**
  - `posthog is not defined` → el script no cargó (verifica que `__ENV__` existe y no hay errores previos en el HTML).
  - Eventos no llegan pero no hay error → confirma `opt_out_capturing_by_default`. Llama a `posthog.opt_in_capturing()` tras consentimiento.
- **Cómo revertir:** Elimina el script y reinicia la app.
- **Fuente oficial:** https://posthog.com/docs/libraries/js

---

## 3. Sentry: crear proyecto y obtener DSN

- **Objetivo:** Tener un proyecto Sentry y su DSN público (para el navegador).
- **Por qué hace falta:** Sin Sentry, los errores JS de producción son invisibles.
- **Prerrequisitos:** Email válido.
- **Dónde ejecutar:** 🟣 **PANEL** — https://sentry.io/signup/
- **Acción exacta:**
  1. Regístrate. Plan Developer Free: 5 000 errores/mes.
  2. Crea organización → crea proyecto → plataforma **JavaScript** → nombre `poseart-prod`.
  3. Crea otro proyecto `poseart-dev` para desarrollo (evita ruido).
  4. Copia el **DSN** (`https://<key>@o<org>.ingest.sentry.io/<project>`). Es público, seguro en el navegador.
- **Resultado esperado:** Tienes dos DSN: uno para prod, uno para dev.
- **Cómo verificar:** En la terminal, envía un evento de test:
  ```bash
  curl -X POST "<DSN_URL>/envelope/" \
    -H "Content-Type: application/octet-stream" \
    --data-binary '{"event_id":"00000000000000000000000000000001","sent_at":"2026-08-01T00:00:00Z"}
{"type":"event"}
{"message":"test from cli","level":"info","event_id":"00000000000000000000000000000001","timestamp":1722600000.0}
'
  ```
  En el panel Sentry → Issues debe aparecer el evento en segundos.
- **Errores comunes:**
  - DSN mal copiado (falta la parte `@o<org>.ingest.sentry.io`).
  - El plan gratuito limita a 5 000 errores/mes. Si lo superas, Sentry deja de capturar hasta el mes siguiente. Configura `sampleRate` para muestrear si esperas picos.
- **Cómo revertir:** Project Settings → Delete Project.
- **Fuente oficial:** https://docs.sentry.io/platforms/javascript/

> ⚠️ **No verificado:** el límite de 5 000 errores/mes puede haber cambiado. Verifica en https://sentry.io/pricing.

---

## 4. Sentry: integrar SDK en el navegador

- **Objetivo:** Inicializar Sentry y capturar errores automáticamente.
- **Por qué hace falta:** Detectar errores en producción que tú no ves (porque no eres el usuario).
- **Prerrequisitos:** DSN del Paso 3.
- **Dónde ejecutar:** 📝 **EDITOR**.
- **Acción exacta:**
  1. Sentry recomienda un bundler para tree-shaking, pero como PoseArt no tiene build step, usa el **Loader CDN**:
     ```html
     <script
       src="https://browser.sentry-cdn.com/8.x.x/bundle.min.js"
       integrity="sha384-<HASH>"
       crossorigin="anonymous">
     </script>
     <script>
       if (window.__ENV__?.SENTRY_DSN) {
         Sentry.init({
           dsn: window.__ENV__.SENTRY_DSN,
           environment: window.__ENV__?.ENV_NAME || 'dev',
           release: window.__ENV__?.APP_VERSION || 'unknown',
           tracesSampleRate: 0.1,
           sampleRate: 1.0,
           beforeSend: function(event) {
             // Filtra PII antes de enviar
             if (event.request) {
               delete event.request.headers;
               delete event.request.cookies;
               delete event.request.data;
             }
             if (event.user) {
               delete event.user.ip_address;
               // NO borres `id` si está seteado al user_id (útil para debug).
             }
             return event;
           },
           denyUrls: [
             /extensions\//i,   // errores de extensiones del navegador
             /^chrome:\/\//i,
             /^moz-extension:\/\//i
           ]
         });
       }
     </script>
     ```
  2. Sustituye `8.x.x` por la versión actual publicada en https://github.com/getsentry/sentry-javascript/releases y `<HASH>` por el SRI hash correspondiente (lo calculas con `openssl dgst -sha384 -binary bundle.min.js | openssl base64 -A`).
- **Resultado esperado:** En DevTools → Network verás peticiones a `o<org>.ingest.sentry.io`.
- **Cómo verificar:**
  1. En la consola del navegador:
     ```javascript
     setTimeout(() => { throw new Error('Sentry test poseart'); }, 1000);
     ```
  2. En el panel Sentry → Issues debe aparecer "Sentry test poseart".
- **Errores comunes:**
  - El SRI hash no coincide → el navegador bloquea el script. Recalcula el hash o quita `integrity` (no recomendado en producción).
  - Sentry no captura errores de Promesas no manejadas → con la v8 sí los captura por defecto.
  - `beforeSend` devuelve `null` para filtrar → úsalo para suprimir ruido conocido (p. ej. errores de Extensiones).
- **Cómo revertir:** Quita los dos `<script>` y reinicia.
- **Fuente oficial:** https://docs.sentry.io/platforms/javascript/install/loader/

---

## 5. Banner de consentimiento (RGPD)

- **Objetivo:** Pedir al usuario permiso explícito antes de enviar analytics.
- **Por qué hace falta:** Es obligatorio en la UE (RGPD) y recomendable en cualquier mercado. PostHog ya está configurado con `opt_out_capturing_by_default: true` (Paso 2), así que no se envía nada hasta consentir.
- **Prerrequisitos:** Pasos 2 y 4 completados.
- **Dónde ejecutar:** 📝 **EDITOR**.
- **Acción exacta:**
  1. Añade un banner en `index.html` (al final del `<body>`, antes de los scripts):
     ```html
     <div id="consent-banner" hidden>
       <p>Usamos analítica anónima para mejorar PoseArt. Sin ella no podemos saber qué poses o tours fallan.</p>
       <button id="consent-accept">Aceptar todo</button>
       <button id="consent-reject">Solo esenciales</button>
       <a href="/privacy">Más información</a>
     </div>
     ```
  2. En `js/consent.js` (nuevo archivo):
     ```javascript
     (function() {
       const STORAGE_KEY = 'poseart_consent_v1';
       const consent = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

       function applyConsent(c) {
         if (!c) return;
         if (c.analytics) {
           posthog?.opt_in_capturing();
         } else {
           posthog?.opt_out_capturing();
         }
         // Sentry se permite por defecto (errores agregados, sin PII). Si el usuario
         // rechaza todo, también lo apagamos:
         if (c.error_tracking === false && window.Sentry) {
           Sentry.getCurrentHub().getClient().getOptions().enabled = false;
         }
         posthog?.capture('consent_updated', {
           category: 'analytics',
           status: c.analytics ? 'granted' : 'denied',
           source: c.source || 'banner_initial'
         });
       }

       function showBanner() {
         document.getElementById('consent-banner').hidden = false;
       }

       function saveConsent(analytics, source) {
         const c = {
           analytics: analytics,
           error_tracking: true, // por defecto
           source: source,
           timestamp: Date.now()
         };
         localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
         applyConsent(c);
         document.getElementById('consent-banner').hidden = true;
       }

       if (!consent) {
         showBanner();
         document.getElementById('consent-accept').onclick = () => saveConsent(true,  'banner_explicit');
         document.getElementById('consent-reject').onclick = () => saveConsent(false, 'banner_explicit');
       } else {
         applyConsent(consent);
       }

       window.__poseartConsent = { saveConsent, getConsent: () => consent };
     })();
     ```
  3. Añade `<script src="js/consent.js" defer></script>` al final del `<body>`.
- **Resultado esperado:** En la primera visita, el banner aparece. Si el usuario acepta, PostHog empieza a capturar; si rechaza, no captura nada.
- **Cómo verificar:**
  1. Limpia el almacenamiento (DevTools → Application → Clear storage).
  2. Recarga → el banner aparece.
  3. Pulsa "Aceptar todo" → en PostHog Live Events aparece `consent_updated` con `status: granted`.
  4. Repite con "Solo esenciales" → aparece `consent_updated` con `status: denied` y ningún evento de producto se envía.
- **Errores comunes:**
  - El banner aparece por debajo del contenido → usa `position: fixed; z-index: 9999`.
  - `posthog` es `undefined` al cargar `consent.js` → carga `consent.js` DESPUÉS del script de PostHog (usa `defer` o ponlo al final).
- **Cómo revertir:** Borra `js/consent.js` y el banner del HTML.
- **Fuente oficial:** https://posthog.com/docs/privacy/consent

---

## 6. Taxonomía de eventos

La taxonomía canónica vive en `docs/backend/examples/event-taxonomy.json`. Aquí un resumen en tabla. **Si necesitas un evento nuevo, edítalo primero en el JSON, no en el código.**

| # | Evento | Momento de emisión | Propiedades clave | Identidad | Consent. | Funnel / métrica |
|---|---|---|---|---|---|---|
| 1 | `consent_updated` | Cambia cualquier preferencia | category, status, source | anon o user | siempre | Consent rate |
| 2 | `signup_started` | Submit del form de registro | entry_point, method | anonymous_id | analytics | Signup 1/3 |
| 3 | `signup_completed` | Supabase Auth responde OK | method, email_verified_at_signup, duration_ms | user_id (con $identify) | analytics | Signup 2/3, signups/day |
| 4 | `onboarding_completed` | Última pantalla confirmada | selected_goal, duration_ms, steps_completed | user_id | analytics | Signup 3/3, activation rate |
| 5 | `pose_viewed` | Detalle de pose abierto y renderizado | pose_id, pose_category, pose_difficulty, pose_origin, source | user o anon | analytics | Engagement |
| 6 | `session_started` | Cámara activa con éxito | pose_id, overlay_mode, timer_seconds, auto_capture, sensitivity, tour_id? | user_id | analytics | Activation → first session |
| 7 | `session_completed` | Sesión termina (cualquier razón) | pose_id, duration_seconds, captured_count, best_score, avg_score, exit_reason, tour_id? | user_id | analytics | Avg session duration |
| 8 | `tour_created` | Tour nuevo/editado persistido | tour_id, section_count, pose_count, is_new, visibility | user_id | analytics | Tours/user |
| 9 | `tour_started` | Inicia reproducción de tour | tour_id, tour_origin, section_count, pose_count | user_id | analytics | Tour completion rate |
| 10 | `product_viewed` | Detalle de producto cargado | product_id, product_price_cents, product_currency, product_category, already_owned, source | user o anon | analytics | Purchase funnel 1/4 |
| 11 | `paywall_viewed` | Aparece pantalla paywall | trigger, target_feature, target_product_id?, plan_offered | user_id | analytics | Purchase funnel (paywall) |
| 12 | `checkout_started` | Edge Function responde OK con session_id | product_id, product_price_cents, plan_type, checkout_session_id | user_id | analytics | Purchase funnel 2/4, checkout CR |
| 13 | `purchase_completed` | Webhook `checkout.session.completed` procesado | product_id, plan_type, stripe_checkout_session_id, stripe_event_id, is_first_purchase | user_id | analytics | Purchase funnel 3/4, MRR/ARPU |
| 14 | `subscription_started` | Webhook `customer.subscription.created` con status active | plan_type, stripe_subscription_id, stripe_event_id, is_upgrade, previous_plan_type? | user_id | analytics | Net new subs/month |
| 15 | `subscription_cancelled` | Webhook `subscription.updated` cancel_at_period_end o `subscription.deleted` | stripe_subscription_id, cancellation_type, cancellation_reason_bucket, plan_type | user_id | analytics | Churn rate |
| 16 | `bug_report_submitted` | Bug report persistido en DB | bug_report_id, pose_id, bug_category_bucket, has_description | user_id | analytics | Bugs/100 sessions |

> **Cada evento envía automáticamente** (gestionado por el SDK):
> - `$session_id` (sesión de PostHog).
> - `$current_url`, `$host`, `$pathname`, `$referrer`, `$lib`, `$lib_version`.
> - `$device_id`, `$device_type`, `$os`, `$browser`, `$browser_version`.
>
> No añadas estas propiedades a mano en `properties`.

---

## 7. Reglas de privacidad obligatorias

### 7.1 Lista negra de propiedades (NUNCA enviar)

| Categoría | Propiedades prohibidas |
|---|---|
| **Autenticación** | `password`, `password_hash`, `current_password`, `new_password`, `token`, `access_token`, `refresh_token`, `jwt`, `session_token` |
| **Claves del servidor** | `supabase_service_role_key`, `stripe_secret_key` |
| **Pago** | `stripe_customer_id_default_source`, `card_number`, `card_cvc`, `card_expiry`, `bank_account`, `customer_card_last4`, `customer_billing_address` |
| **Identificadores sensibles** | `ssn`, `government_id`, `user_email_full`, `user_phone_full`, `ip_address` |
| **Datos biométricos/corporales** | `geolocation_lat`, `geolocation_lng`, `device_fingerprint_raw` |
| **Contenido del usuario** | `description_free_text`, `personal_notes`, `free_text_input`, `tour_full_definition`, `joints_snapshot` |
| **Medios** | `photo_data_url`, `image_base64`, `image_blob`, `screenshot_data_url`, `captured_thumbnails`, `image_data_url` |

### 7.2 Implementación técnica del filtro

Define una función wrapper en `js/analytics.js`:

```javascript
const FORBIDDEN_KEYS = new Set([
  'password','token','access_token','refresh_token','jwt','session_token',
  'supabase_service_role_key','stripe_secret_key','card_number','card_cvc',
  'card_expiry','user_email_full','user_phone_full','ip_address','image_base64',
  'image_data_url','photo_data_url','screenshot_data_url','description_free_text',
  'joints_snapshot'
]);

function sanitizeProperties(props, depth = 0) {
  if (depth > 3 || !props || typeof props !== 'object') return null;
  const clean = {};
  for (const [k, v] of Object.entries(props)) {
    if (FORBIDDEN_KEYS.has(k)) {
      console.warn(`[analytics] dropped forbidden property: ${k}`);
      continue;
    }
    if (typeof v === 'string' && v.length > 256) v = v.slice(0, 256);
    if (Array.isArray(v) && v.length > 50) v = v.slice(0, 50);
    clean[k] = (typeof v === 'object' && v !== null) ? sanitizeProperties(v, depth + 1) : v;
  }
  return clean;
}

export function track(eventName, props = {}) {
  if (!window.posthog) return;
  const clean = sanitizeProperties(props);
  window.posthog.capture(eventName, clean);
}
```

Toda la app debe usar `track(...)`, nunca `posthog.capture(...)` directo.

- **Cómo verificar:** Busca en `js/` usos de `posthog.capture` directos y reemplázalos por `track`. Añade un test (ver `11-TESTING-AND-SECURITY-CHECKLIST.md`).
- **Fuente oficial:** https://posthog.com/docs/data/pii

---

## 8. Funnels y retención

### 8.1 Funnel signup → onboarding → primera sesión → primer pose → paywall → checkout → compra

| Paso | Evento | Evento anterior requerido | Conversión objetivo |
|---|---|---|---|
| 1 | `signup_started` | — | 100% (baseline) |
| 2 | `signup_completed` | `signup_started` | ≥ 80% |
| 3 | `onboarding_completed` | `signup_completed` | ≥ 70% |
| 4 | `session_started` | `onboarding_completed` | ≥ 60% |
| 5 | `session_completed` | `session_started` | ≥ 80% (del que empezó) |
| 6 | `pose_viewed` (post-session) | `session_completed` | ≥ 70% |
| 7 | `paywall_viewed` | cualquier evento engagement | 10-30% |
| 8 | `checkout_started` | `paywall_viewed` | ≥ 30% |
| 9 | `purchase_completed` | `checkout_started` | ≥ 70% (webhook exitoso) |

> **Conversión global objetivo:** ≥ 5% signup_started → purchase_completed.

### 8.2 Retención

| Métrica | Definición | Objetivo |
|---|---|---|
| **D1 retention** | % de usuarios que vuelven el día siguiente al `signup_completed` | ≥ 40% |
| **D7 retention** | % que vuelve en la 2ª semana | ≥ 25% |
| **D30 retention** | % que vuelve en el 2º mes | ≥ 15% |
| **WAU** | Distinct IDs con evento engagement en últimos 7 días | (crecimiento) |
| **Conversion to paid** | % de signup_completed con `purchase_completed` o `subscription_started` en 30 días | ≥ 5% |

### 8.3 Configurar funnels en PostHog

- **Dónde ejecutar:** 🟣 **PANEL** — PostHog → **Insights → New insight → Funnel**.
- **Acción exacta:**
  1. Selecciona los eventos en orden (ver tabla 8.1).
  2. Filters por `environment = production` (propiedad personalizada que añades en `beforeSend`).
  3. Save as "Signup to Purchase funnel".
- **Resultado esperado:** Gráfico con tasas de conversión por paso.
- **Fuente oficial:** https://posthog.com/docs/data/insights

---

## 9. Identidad de usuario y sesiones

| Estado del usuario | Identidad usada | Cuándo se cambia |
|---|---|---|
| Visitante nuevo (sin login) | `anonymous_id` generado por PostHog | Primera carga |
| Tras `signup_completed` | `user_id` (UUID Supabase) | Llama `posthog.identify(user_id)` en el callback de Supabase Auth `onAuthStateChange` con `SIGNED_IN`. |
| Tras `logout` | `anonymous_id` nuevo | Llama `posthog.reset()` en `SIGNED_OUT`. |
| Login con cuenta existente | `user_id` | `identify` vincula el `anonymous_id` previo con el `user_id` conocido (historial completo). |

- **Implementación:**
  ```javascript
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      posthog.identify(session.user.id, {
        // Sólo propiedades seguras
        signup_method: session.user.app_metadata.provider || 'email',
        is_pro: false  // se actualiza cuando el webhook de Stripe lo confirme
      });
    } else if (event === 'SIGNED_OUT') {
      posthog.reset();
    }
  });
  ```
- **Propiedades de persona (person properties):** mantenlas mínimas. Sólo `signup_method`, `is_pro`, `plan_type`, `last_active_at`. **NUNCA** `email`, `name`, `phone`.
- **Fuente oficial:** https://posthog.com/docs/identify-users

---

## 10. Verificación end-to-end

- **Objetivo:** Confirmar que todo el flujo (consentimiento → captura → funnel) funciona.
- **Dónde ejecutar:** 🧪 **TEST** — navegador en incógnito.
- **Acción exacta:**
  1. Limpia el almacenamiento del navegador.
  2. Recarga `http://localhost:8095/`.
  3. Acepta consentimiento.
  4. Regístrate con `test+analytics@poseart.local`.
  5. Completa el onboarding.
  6. Abre una pose, inicia sesión de cámara, completa la sesión.
  7. En PostHog → **Activity → Live events** verifica que aparecen en orden:
     - `consent_updated` (granted)
     - `pageview` (varios)
     - `signup_started`
     - `signup_completed`
     - `onboarding_completed`
     - `pose_viewed`
     - `session_started`
     - `session_completed`
  8. En PostHog → **Persons** busca el `user_id` del test. Debe mostrar todos los eventos en su timeline.
  9. Provoca un error en la consola: `setTimeout(() => { throw new Error('Analytics e2e test'); }, 500);`
  10. En Sentry → Issues debe aparecer el error.
- **Resultado esperado:** Todos los eventos aparecen en orden y el error llega a Sentry.
- **Errores comunes:**
  - Eventos duplicados → comprueba que no llamas `posthog.init` dos veces (puede pasar si tienes scripts duplicados).
  - `user_id` no se propaga a eventos posteriores → falta `posthog.identify` en el callback de Auth.
  - Eventos llegan pero en el funnel no aparecen → revisa el orden de pasos y los filtros en PostHog.
- **Cómo revertir:** N/A (no hay cambios destructivos).
- **Fuente oficial:** https://posthog.com/docs/getting-started/ingest-live-events

---

## Mantenimiento periódico

| Tarea | Frecuencia | Quién |
|---|---|---|
| Revisar funnel signup → purchase | Semanal | Growth |
| Revisar top errores en Sentry | Diario en prod, semanal en dev | Dev |
| Revisar eventos no canonizados (no en taxonomy) | Mensual | Dev |
| Auditar `FORBIDDEN_KEYS` frente a nuevas propiedades | Por cada release | Dev |
| Verificar sample rate de Sentry vs cuota | Mensual | Dev |
| Revisar propiedades de persona que puedan contener PII | Mensual | Growth + Dev |
| Limpiar `persons` con datos erróneos (raro) | Bajo demanda | Dev |

---

## Siguientes pasos

- `11-TESTING-AND-SECURITY-CHECKLIST.md` — Pruebas para verificar que el sistema de analytics no filtra PII.
- `12-OPERATIONS-PRIVACY-AND-BACKUPS.md` — Rotación de claves de PostHog/Sentry y políticas de retención de eventos.

---

## Actualización: Analytics Instrumentation Stub (2026-08-02)

### js/analytics.js ya creado

Se ha creado `js/analytics.js` (146 líneas) que proporciona una interfaz unificada de analytics lista para conectar a PostHog.

**Características:**
- **No-op seguro:** Si `window.POSTHOG_KEY` no está definido, todas las llamadas son silenciosas (seguro para F&F preview)
- **PostHog-ready:** Cuando se establece la key, carga el SDK de PostHog automáticamente
- **Privacy:** Lista `FORBIDDEN_KEYS` sanitiza propiedades (passwords, tokens, fotos, datos de pago)
- **Consent:** Gestión de consentimiento basada en localStorage (GDPR Art. 7)
- **Debug:** En localhost muestra logs en consola; almacena últimos 100 eventos en localStorage

### Eventos ya instrumentados

6 eventos están instrumentados en `js/app.js`:

| Evento | Momento | Propiedades |
|---|---|---|
| `login_completed` | Login exitoso | `{ user: 'tester' }` |
| `onboarding_completed` | Selección de persona | `{ goal: 'photographer' }` |
| `onboarding_completed` | Skip onboarding | `{ goal: 'exploring', skipped: true }` |
| `session_started` | Inicio de sesión de cámara | `{ pose_id: 'scurve-stand' }` |
| `checkout_started` | Click en compra | `{ pack_id: 'mp-boudoir-classic' }` |

### Cómo activar

1. Crear cuenta en PostHog (gratis: 1M eventos/mes)
2. Obtener API key del proyecto
3. Añadir antes de `<script src="js/analytics.js">` en index.html:
   ```html
   <script>window.POSTHOG_KEY = 'phc_tu_key_aqui';</script>
   ```
4. Añadir banner de consentimiento
5. Deploy — analytics empezará a trackear automáticamente

### API disponible

```javascript
PoseArtAnalytics.init()                              // Inicializar (DOMContentLoaded)
PoseArtAnalytics.track('event_name', { prop: 'val' }) // Trackear evento
PoseArtAnalytics.identify(userId, { traits })         // Identificar usuario
PoseArtAnalytics.reset()                              // Reset (on logout)
PoseArtAnalytics.setConsent(true/false)               // Gestionar consentimiento
PoseArtAnalytics.hasConsent()                         // Verificar consentimiento
PoseArtAnalytics.isActive()                           // Verificar si está activo
```
