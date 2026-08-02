# 11 — Testing y checklist de seguridad

> **Propósito:** Lista exhaustiva de pruebas que debes ejecutar antes de abrir producción. Sin estas pruebas aprobadas, NO se despliega a producción.
>
> **Tiempo estimado:** 2-3 horas para ejecutar todas las pruebas.
> **Resultado esperado:** Todas las casillas marcadas, todos los hallazgos críticos cerrados.

---

## Cómo leer este documento

Cada prueba tiene:

| Campo | Significado |
|---|---|
| **ID** | Código único (p. ej. `AUTH-01`) para referenciar en tickets. |
| **Objetivo** | Qué quieres demostrar con la prueba. |
| **Precondiciones** | Qué debe estar listo antes. |
| **Pasos** | Acciones concretas en orden. |
| **Resultado esperado** | Lo que deberías observar. |
| **Severidad si falla** | Crítica / Alta / Media / Baja. |
| **Cómo revertir** | Cómo dejar el sistema en estado limpio tras la prueba. |

### Marcadores visuales

| Marcador | Significado |
|---|---|
| 🟣 **PANEL** | Panel de proveedor. |
| 🟢 **TERMINAL** | Terminal local. |
| 📝 **EDITOR** | Editor de código. |
| 🧪 **TEST** | Entorno de pruebas (Stripe CLI, navegador de test). |
| 🚀 **PROD** | Producción (sólo para smoke tests finales). |

> ⚠️ **Ejecuta todas las pruebas en STAGING o LOCAL.** Sólo el último smoke test se ejecuta en producción.

---

## Índice

1. [Auth tests](#1-auth-tests)
2. [Data isolation tests](#2-data-isolation-tests)
3. [Billing tests](#3-billing-tests)
4. [Marketplace tests](#4-marketplace-tests)
5. [Migration tests](#5-migration-tests)
6. [Analytics / privacy tests](#6-analytics--privacy-tests)
7. [RLS verification commands](#7-rls-verification-commands-sql)
8. [Acceptance criteria globales](#8-acceptance-criteria-globales)

---

## 1. Auth tests

### AUTH-01 — Registro válido

- **Objetivo:** Un usuario nuevo puede registrarse con email + contraseña válidos.
- **Precondiciones:** App corriendo en `http://localhost:8095`. Supabase Auth permite signups.
- **Pasos:**
  1. 🧪 **TEST** — Abre la app en incógnito.
  2. Clic en "Crear cuenta".
  3. Email: `test+auth01@poseart.local`, contraseña: `TestAuth01!2026`.
  4. Submit.
- **Resultado esperado:**
  - Si email confirmation está ON: mensaje "Revisa tu correo". Como `@poseart.local` no recibe correo, confirma el usuario a mano en 🟣 Supabase → Authentication → Users → "Confirm user".
  - Si está OFF: sesión iniciada automáticamente.
  - Aparece fila en `profiles` con el `id` del nuevo usuario (trigger de Auth).
  - PostHog recibe `signup_started` y `signup_completed`.
- **Severidad si falla:** Crítica (sin signup no hay producto).
- **Cómo revertir:** Supabase → Authentication → Users → Delete. `DELETE FROM profiles WHERE id = '<uuid>';`.

### AUTH-02 — Email duplicado

- **Objetivo:** No se pueden crear dos cuentas con el mismo email.
- **Precondiciones:** AUTH-01 pasado (existe `test+auth01@poseart.local`).
- **Pasos:**
  1. Repite el flujo de AUTH-01 con el MISMO email.
- **Resultado esperado:** Supabase devuelve error `User already registered`. La UI muestra "Este email ya está registrado". **NO** se filtra si la cuenta existe a través del mensaje de error (es decir, no debe decir "ese email existe" vs "esa contraseña es inválida" — el mensaje debe ser idéntico para ambos casos si quieres evitar enumeración).
- **Severidad si falla:** Alta (enumeración de usuarios).
- **Cómo revertir:** N/A (no se creó nada).

### AUTH-03 — Contraseña débil

- **Objetivo:** Supabase rechaza contraseñas que no cumplan la política.
- **Precondiciones:** Política de Supabase Auth configurada (mínimo 8 caracteres por defecto).
- **Pasos:**
  1. Intenta registrarte con contraseña `123`.
- **Resultado esperado:** Error `Password should be at least 8 characters`. La UI lo muestra y NO se crea el usuario.
- **Severidad si falla:** Alta (si permite contraseñas débiles, las cuentas se comprometen rápido).
- **Cómo revertir:** N/A.

### AUTH-04 — Email sin verificar

- **Objetivo:** Un usuario con email no verificado no puede usar funciones que requieran verificación.
- **Precondiciones:** Email confirmation activado en Supabase.
- **Pasos:**
  1. Regístrate con `test+auth04@poseart.local`.
  2. NO confirmes el email en Supabase.
  3. Intenta hacer login.
- **Resultado esperado:**
  - Si Supabase tiene "Confirm email" obligatorio: error `Email not confirmed`.
  - Si es opcional: login funciona pero ciertas funciones (postular al marketplace, withdraw, crear productos pagos) deben bloquearse en la app con check `profile.email_verified_at IS NOT NULL`.
- **Severidad si falla:** Media.
- **Cómo revertir:** Confirma el usuario en Supabase o bórralo.

### AUTH-05 — Recuperación de contraseña

- **Objetivo:** Un usuario que olvidó su contraseña puede resetearla por email.
- **Precondiciones:** SMTP configurado en Supabase (puedes usar el SMTP de Supabase en dev, o el tuyo propio en prod).
- **Pasos:**
  1. 🧪 **TEST** — Ve a "Olvidé mi contraseña".
  2. Introduce `test+auth01@poseart.local`.
  3. Si usas el SMTP de Supabase: en Supabase → Authentication → Users → encuentra el usuario → "Send password reset".
  4. Abre el link mágico (aparece en el log de Auth si usas mailcatcher, o te llega por correo si configuraste SMTP propio).
  5. Introduce nueva contraseña `NewPass2026!`.
- **Resultado esperado:** Login funciona con la nueva contraseña. La antigua NO funciona.
- **Severidad si falla:** Alta.
- **Cómo revertir:** Cambia la contraseña de vuelta vía Supabase Dashboard.

### AUTH-06 — Sesión expirada

- **Objetivo:** Cuando el JWT expira, el usuario es desconectado y no puede hacer queries.
- **Precondiciones:** Usuario logado. Política de expiración de Supabase (por defecto 1 hora para access token, refresh automático).
- **Pasos:**
  1. 🟢 **TERMINAL** — Tras login, copia el `access_token` del `localStorage` de Supabase (suele guardarse en `sb-<ref>-auth-token`).
  2. En 🟣 Supabase → Authentication → Settings → "JWT expiry limit" bájalo temporalmente a 60 segundos.
  3. Espera 70 segundos.
  4. Recarga la app.
- **Resultado esperado:** La app redirige al login. Cualquier query a `supabase.from(...)` devuelve 401.
- **Severidad si falla:** Alta (sesiones infinitas son vulnerabilidad).
- **Cómo revertir:** Restaura "JWT expiry limit" a 3600.

### AUTH-07 — Logout

- **Objetivo:** Tras logout, el token deja de funcionar.
- **Precondiciones:** Usuario logado.
- **Pasos:**
  1. Clic en "Logout".
  2. Sin cerrar el navegador, en DevTools Console:
     ```javascript
     const oldToken = '...'; // pega el token anterior
     await fetch('https://<ref>.supabase.co/rest/v1/profiles?select=*', {
       headers: { 'apikey': '<anon>', 'Authorization': `Bearer ${oldToken}` }
     });
     ```
- **Resultado esperado:** La petición devuelve 401 o una respuesta vacía (RLS bloquea a usuarios no autenticados).
- **Severidad si falla:** Crítica (logout inefectivo = secuestro de sesión).
- **Cómo revertir:** N/A.

### AUTH-08 — Acceso admin sin rol

- **Objetivo:** Un usuario normal no puede acceder a funciones de admin.
- **Precondiciones:** Usuario con `role = 'user'`.
- **Pasos:**
  1. Login como `devuser@poseart.local` (rol user).
  2. Intenta acceder a la URL `#/admin/users` directamente.
- **Resultado esperado:**
  - La UI no muestra el botón de admin.
  - Si el usuario fuerza la URL, la app consulta `profile.role` y bloquea.
  - Si el usuario intenta llamar a una Edge Function protegida con check de rol, la función devuelve 403.
- **Severidad si falla:** Crítica.
- **Cómo revertir:** N/A.

### AUTH-09 — Intento de enumeración de usuarios

- **Objetivo:** Un atacante no puede descubrir qué emails están registrados.
- **Precondiciones:** App accesible.
- **Pasos:**
  1. Intenta login con `test+auth01@poseart.local` y contraseña incorrecta.
  2. Intenta login con `nonexistent@poseart.local` y contraseña incorrecta.
- **Resultado esperado:** Ambos intentos devuelven el MISMO mensaje de error (p. ej. "Credenciales inválidas") y tardían tiempo similar (sin timing leak). La respuesta HTTP no varía entre "usuario existe" y "usuario no existe".
- **Severidad si falla:** Alta.
- **Cómo revertir:** N/A.

---

## 2. Data isolation tests

### ISO-01 — Usuario A lee datos privados de Usuario B

- **Objetivo:** RLS bloquea lectura cruzada.
- **Precondiciones:** Dos usuarios: `devuser` y `devcreator` con datos propios.
- **Pasos:**
  1. Login como `devuser`.
  2. DevTools Console:
     ```javascript
     // Intenta leer todos los favoritos (sin filtro de user_id)
     const { data, error } = await supabase.from('favorites').select('*');
     console.log({ count: data?.length, sample: data?.[0] });
     ```
- **Resultado esperado:** `count: 3` (sólo los 3 favoritos sembrados del devuser). NO aparecen filas de devcreator ni devadmin.
- **Severidad si falla:** Crítica.
- **Cómo revertir:** N/A.

### ISO-02 — Usuario A edita datos de Usuario B

- **Objetivo:** RLS bloquea escritura cruzada.
- **Precondiciones:** ISO-01 pasado.
- **Pasos:**
  1. Login como `devuser`.
  2. DevTools Console:
     ```javascript
     // ID del devcreator (lo puedes obtener del seed)
     const devcreatorId = '00000000-0000-0000-0000-000000000003';
     // Intenta actualizar el perfil de devcreator
     const { error } = await supabase
       .from('profiles')
       .update({ display_name: 'HACKED' })
       .eq('id', devcreatorId);
     console.log(error);
     ```
- **Resultado esperado:** `error` no es null. Mensaje tipo `new row violates row-level security policy`. El perfil de devcreator NO cambia.
- **Severidad si falla:** Crítica.
- **Cómo revertir:** N/A (la prueba no debe modificar nada).

### ISO-03 — Usuario A elimina datos de Usuario B

- **Objetivo:** RLS bloquea borrado cruzado.
- **Precondiciones:** ISO-01, ISO-02.
- **Pasos:**
  1. Login como `devuser`.
  2. DevTools Console:
     ```javascript
     const { error } = await supabase
       .from('favorites')
       .delete()
       .eq('user_id', '00000000-0000-0000-0000-000000000003'); // devcreator
     console.log(error);
     ```
- **Resultado esperado:** Error de RLS. Los favoritos de devcreator siguen intactos.
- **Severidad si falla:** Crítica.
- **Cómo revertir:** N/A.

### ISO-04 — Usuario se autoasigna rol admin

- **Objetivo:** El campo `profiles.role` no es escribible por el propio usuario.
- **Precondiciones:** Usuario logado con `role = 'user'`.
- **Pasos:**
  1. Login como `devuser`.
  2. DevTools Console:
     ```javascript
     const { error } = await supabase
       .from('profiles')
       .update({ role: 'admin' })
       .eq('id', supabase.auth.getUser().data.user.id);
     console.log(error);
     ```
- **Resultado esperado:** Error de RLS (la política debe permitir UPDATE sólo de campos no sensibles; o bloquear completamente el UPDATE de `role`). El usuario sigue siendo `user`.
- **Severidad si falla:** Crítica (escalada de privilegios).
- **Cómo revertir:** Si por error el rol se cambió, restáuralo desde 🟣 Supabase → Table Editor → profiles → cambia role a `user`.

### ISO-05 — Usuario se autoasigna Pro

- **Objetivo:** El usuario no puede regalarse entitlements.
- **Precondiciones:** Usuario logado sin entitlements pagos.
- **Pasos:**
  1. Login como `devuser`.
  2. DevTools Console:
     ```javascript
     const { error } = await supabase
       .from('entitlements')
       .insert({
         user_id: supabase.auth.getUser().data.user.id,
         product_id: 'f0000000-0000-0000-0000-000000000002', // mp-boudoir-classic
         source: 'purchase'
       });
     console.log(error);
     ```
- **Resultado esperado:** Error de RLS. La tabla `entitlements` debe ser INSERT sólo por `service_role` (webhook) y SELECT por el propio usuario.
- **Severidad si falla:** Crítica (robo de producto).
- **Cómo revertir:** N/A.

### ISO-06 — Usuario publica contenido de otro

- **Objetivo:** Un creador no puede publicar como suyo un tour o pose de otro.
- **Precondiciones:** Usuario logado como `devuser`.
- **Pasos:**
  1. Login como `devuser`.
  2. DevTools Console:
     ```javascript
     // Intenta cambiar el author_id de un tour de devcreator
     const { error } = await supabase
       .from('tours')
       .update({ author_id: supabase.auth.getUser().data.user.id })
       .eq('id', 'c0000000-0000-0000-0000-000000000001'); // tour del devuser
     // ... y esto es lo que debe fallar:
     const { error: e2 } = await supabase
       .from('tours')
       .insert({
         id: 'tour-hijacked-01',
         author_id: '00000000-0000-0000-0000-000000000003', // devcreator
         name: 'Hijacked',
         visibility: 'public',
         status: 'published'
       });
     console.log({ error, e2 });
     ```
- **Resultado esperado:** El INSERT falla con error de RLS. La política debe checks `author_id = auth.uid()`.
- **Severidad si falla:** Alta.
- **Cómo revertir:** N/A.

### ISO-07 — Anónimo accede a storage privado

- **Objetivo:** Sin login, no se puede leer contenido privado.
- **Precondiciones:** Storage de Supabase con buckets privados (si los hay).
- **Pasos:**
  1. 🟢 **TERMINAL** — Sin login previo, sin sesión guardada:
     ```bash
     curl "https://<ref>.supabase.co/storage/v1/object/private/captures/<some-id>.png" \
       -H "apikey: <anon>"
     ```
- **Resultado esperado:** 400 o 403 con mensaje de permiso denegado. El body NO contiene la imagen.
- **Severidad si falla:** Crítica.
- **Cómo revertir:** N/A.

---

## 3. Billing tests

### BILL-01 — Webhook con firma inválida

- **Objetivo:** Un webhook sin firma correcta se rechaza.
- **Precondiciones:** Edge Function `stripe-webhook` desplegada. `STRIPE_WEBHOOK_SECRET` configurado.
- **Pasos:**
  1. 🟢 **TERMINAL** — Envía una petición POST a la URL del webhook con body válido pero sin header `stripe-signature` (o con una firma falsa):
     ```bash
     curl -X POST https://<ref>.supabase.co/functions/v1/stripe-webhook \
       -H "content-type: application/json" \
       -d '{"type":"checkout.session.completed","data":{"object":{"id":"cs_test_fake"}}}'
     ```
- **Resultado esperado:** 400 con body `{"error":"Invalid signature"}`. NO se modifica nada en la base de datos.
- **Severidad si falla:** Crítica (alguien podría simular pagos).
- **Cómo revertir:** N/A.
- **Fuente:** https://docs.stripe.com/webhooks#verify-events

### BILL-02 — Webhook duplicado

- **Objetivo:** El sistema es idempotente: reenviar el mismo evento no duplica efectos.
- **Precondiciones:** BILL-01 pasado. Un `checkout.session.completed` previo procesado.
- **Pasos:**
  1. 🟢 **TERMINAL** — Reenvía el mismo evento desde Stripe CLI:
     ```bash
     stripe events resend <evt_...>
     ```
  2. O en 🟣 Stripe → Developers → Events → reenvía manualmente.
- **Resultado esperado:** El webhook responde 200. NO se crea un segundo entitlement en la base. Verifica:
  ```sql
  SELECT count(*) FROM entitlements WHERE stripe_checkout_session_id = 'cs_test_...';
  -- debe seguir siendo 1
  ```
- **Severidad si falla:** Alta (doble cobro conceptual).
- **Cómo revertir:** Si se duplicó, borra la fila extra:
  ```sql
  DELETE FROM entitlements WHERE id = '<id_duplicado>';
  ```

### BILL-03 — Eventos fuera de orden

- **Objetivo:** Si llega `checkout.session.completed` antes que `customer.created`, el sistema no falla.
- **Precondiciones:** BILL-02 pasado.
- **Pasos:**
  1. Envía `checkout.session.completed` con un `customer` que aún no existe en tu base.
- **Resultado esperado:** El webhook crea el customer (si aplica) o lo encola para reintento. La respuesta es 200 (no 500). Stripe reintentará automáticamente hasta 3 días si devuelve 4xx/5xx.
- **Severidad si falla:** Media.
- **Cómo revertir:** N/A.

### BILL-04 — Checkout abandonado

- **Objetivo:** Un usuario que abandona Checkout NO recibe el entitlement.
- **Precondiciones:** Función `create-checkout` desplegada.
- **Pasos:**
  1. 🧪 **TEST** — Inicia Checkout desde la app.
  2. Cierra la pestaña de Stripe sin pagar.
- **Resultado esperado:**
  - La URL de cancelación recibe al usuario.
  - NO se crea entitlement.
  - NO llega webhook `checkout.session.completed`.
  - Posiblemente llegue `checkout.session.expired` (~24h después, configurable en Stripe).
- **Severidad si falla:** Crítica si el usuario recibe el producto sin pagar.
- **Cómo revertir:** N/A.

### BILL-05 — Pago exitoso (test card)

- **Objetivo:** Una compra con tarjeta de test crea el entitlement.
- **Precondiciones:** Modo test de Stripe activo.
- **Pasos:**
  1. 🧪 **TEST** — Inicia Checkout para el producto `mp-boudoir-classic` (UUID `f0000000-0000-0000-0000-000000000002`, $4.99).
  2. Usa tarjeta `4242 4242 4242 4242`, fecha futura, CVC cualquiera, ZIP cualquiera.
  3. Completa el pago.
- **Resultado esperado:**
  - Stripe redirige al successUrl.
  - En segundos, el webhook procesa `checkout.session.completed` y crea una fila en `entitlements` con `source = 'purchase'`.
  - La app, al refrescar, muestra el pack como "Owned".
  - PostHog recibe `purchase_completed`.
- **Severidad si falla:** Crítica.
- **Cómo revertir:**
  ```sql
  DELETE FROM entitlements WHERE user_id = '<uuid>' AND product_id = 'f0000000-0000-0000-0000-000000000002'; -- mp-boudoir-classic
  ```

### BILL-06 — Pago fallido

- **Objetivo:** Una tarjeta declinada no crea entitlement.
- **Precondiciones:** BILL-05 pasado.
- **Pasos:**
  1. 🧪 **TEST** — Inicia Checkout para `mp-editorial-edge` ($3.99).
  2. Usa tarjeta `4000 0000 0000 0002` (decline, generic).
- **Resultado esperado:**
  - Stripe muestra "Your card was declined".
  - No se crea entitlement.
  - Posiblemente llegue `charge.failed` (escúchalo para métrica).
- **Severidad si falla:** Crítica.
- **Cómo revertir:** N/A.

### BILL-07 — Cancelación inmediata

- **Objetivo:** Cancelar una suscripción activa revoca el entitlement al instante.
- **Precondiciones:** Una suscripción mensual Pro activa.
- **Pasos:**
  1. 🧪 **TEST** — Suscríbete a Pro mensual (tarjeta 4242).
  2. En 🟣 Stripe → Customers → encuentra tu customer → Subscriptions → cancela "Immediately".
- **Resultado esperado:**
  - Llega webhook `customer.subscription.deleted`.
  - El webhook actualiza la fila en `entitlements` (o la borra, según diseño).
  - La app, al refrescar, muestra "Free" en lugar de "Pro".
  - PostHog recibe `subscription_cancelled` con `cancellation_type: immediate`.
- **Severidad si falla:** Alta (usuario cancelado sigue con Pro).
- **Cómo revertir:** Reactiva la suscripción desde Stripe → Customer → re-create subscription.

### BILL-08 — Cancelación al final del periodo

- **Objetivo:** Cancelar con "at period end" mantiene el acceso hasta la fecha de renovación.
- **Precondiciones:** Suscripción activa.
- **Pasos:**
  1. 🧪 **TEST** — Suscríbete a Pro anual.
  2. 🟣 Stripe → Customer → Subscriptions → "Cancel at period end".
- **Resultado esperado:**
  - Llega `customer.subscription.updated` con `cancel_at_period_end = true`.
  - El webhook marca el entitlement como "canceling" (campo `auto_renew = false` o `cancel_at`).
  - La app sigue mostrando Pro hasta la fecha `current_period_end`.
  - PostHog recibe `subscription_cancelled` con `cancellation_type: at_period_end`.
- **Severidad si falla:** Media.
- **Cómo revertir:** Reactiva en Stripe → "Resume subscription".

### BILL-09 — Reactivación

- **Objetivo:** Un usuario que canceló al period end puede reactivar antes del fin.
- **Precondiciones:** BILL-08 pasado.
- **Pasos:**
  1. Antes de `current_period_end`, reactiva desde Stripe → "Resume subscription".
- **Resultado esperado:**
  - Webhook `customer.subscription.updated` con `cancel_at_period_end = false`.
  - El entitlement vuelve a "active" / `auto_renew = true`.
- **Severidad si falla:** Media.
- **Cómo revertir:** Vuelve a cancelar.

### BILL-10 — Reembolso

- **Objetivo:** Un reembolso en Stripe revoca el entitlement.
- **Precondiciones:** BILL-05 pasado (un pago completado).
- **Pasos:**
  1. 🟣 Stripe → Payments → encuentra el charge → "Refund".
- **Resultado esperado:**
  - Webhook `charge.refunded` llega.
  - El webhook elimina o marca como `revoked` el entitlement correspondiente.
  - La app muestra el producto como "no owned" tras refrescar.
- **Severidad si falla:** Alta (usuario reembolsado sigue usando el producto).
- **Cómo revertir:** Re-crea el entitlement a mano o pídele al usuario que re-compre.

### BILL-11 — Disputa (chargeback)

- **Objetivo:** Una disputa marca el entitlement como `disputed` y bloquea al usuario de nuevas compras hasta resolución.
- **Precondiciones:** BILL-05 pasado.
- **Pasos:**
  1. 🟣 Stripe → Payments → encuentra el charge → "Create dispute" (test mode).
  2. O usa tarjeta `4000 0000 0000 0259` que simula disputa automáticamente tras pago.
- **Resultado esperado:**
  - Webhooks: `charge.dispute.created`, `charge.dispute.closed` (cuando se resuelve).
  - El webhook marca el entitlement como `disputed`.
  - Opcional: bloquea al usuario de nuevas compras (decisión de producto).
- **Severidad si falla:** Media.
- **Cómo revertir:** En test mode, cierra la disputa como `won` desde Stripe.

### BILL-12 — Switch de mensual a anual

- **Objetivo:** Un usuario con suscripción mensual puede cambiar a anual sin perder el acceso.
- **Precondiciones:** Suscripción mensual activa.
- **Pasos:**
  1. Implementa con `stripe.subscriptions.update` cambiando `items[0].price` al price anual.
  2. O usa Stripe Billing Portal (si lo activaste) para que el usuario lo haga solo.
- **Resultado esperado:**
  - Webhook `customer.subscription.updated` con el nuevo `price.id`.
  - El entitlement se actualiza con `plan_type = 'annual'`.
  - Stripe prorratea el cargo automáticamente.
  - PostHog recibe `subscription_started` con `is_upgrade: true` y `previous_plan_type: 'monthly'`.
- **Severidad si falla:** Media.
- **Cómo revertir:** Vuelve a cambiar el price al mensual.

### BILL-13 — Manipulación de precio desde DevTools

- **Objetivo:** Un usuario que modifica el precio en el cliente NO consigue comprar más barato.
- **Precondiciones:** BILL-05 pasado.
- **Pasos:**
  1. 🧪 **TEST** — Abre DevTools antes de clicar "Buy".
  2. En `js/app.js` o donde sea, sobreescribe la variable de precio:
     ```javascript
     window.__poseartProducts[0].price_cents = 1; // intenta comprar a 1 centavo
     ```
  3. Clic en "Buy" → llama a la Edge Function `create-checkout`.
- **Resultado esperado:**
  - La Edge Function NO lee el precio del cliente. Lee el `product_id` y consulta el `price_cents` de la tabla `products` (que está protegida por RLS).
  - Stripe Checkout abre con el precio correcto ($4.99).
  - Si el precio del cliente no coincide con el de la base, la Edge Function devuelve 400.
- **Severidad si falla:** Crítica (robo de producto por precio manipulado).
- **Cómo revertir:** N/A.

---

## 4. Marketplace tests

### MKT-01 — Producto gratuito

- **Objetivo:** Un producto $0 se "compra" instantáneamente sin pasar por Stripe.
- **Precondiciones:** Usuario logado. El producto `mp-free-essentials` (UUID `f0000000-0000-0000-0000-000000000001`) existe con `price_cents = 0`.
- **Pasos:**
  1. Clic en "Get" (no "Buy") en `mp-free-essentials` (UUID `f0000000-0000-0000-0000-000000000001`).
- **Resultado esperado:**
  - Sin redirección a Stripe.
  - Se crea fila en `entitlements` con `source = 'free'`.
  - La app marca el pack como owned.
- **Severidad si falla:** Alta.
- **Cómo revertir:** `DELETE FROM entitlements WHERE user_id = '<uuid>' AND product_id = 'f0000000-0000-0000-0000-000000000001'; -- mp-free-essentials`.

### MKT-02 — Producto pagado

- **Objetivo:** Flujo completo de compra pagada.
- **Precondiciones:** BILL-05 pasado.
- **Pasos:**
  1. Repite BILL-05 con cualquier producto pagado.
- **Resultado esperado:** Idéntico a BILL-05.
- **Severidad si falla:** Crítica.
- **Cómo revertir:** Ver BILL-05.

### MKT-03 — Producto ya comprado

- **Objetivo:** Un usuario que ya posee un producto no puede "volver a comprarlo".
- **Precondiciones:** MKT-01 o MKT-02 pasado para un producto.
- **Pasos:**
  1. Intenta comprar el mismo producto otra vez.
- **Resultado esperado:**
  - La app muestra "Already owned" antes de llamar a la Edge Function.
  - Si la app NO filtra y llama a la Edge Function, ésta responde 409 Conflict.
- **Severidad si falla:** Media (cobro indebido).
- **Cómo revertir:** N/A.

### MKT-04 — Acceso sin entitlement

- **Objetivo:** Un usuario sin entitlement NO puede ver el contenido de un pack pagado.
- **Precondiciones:** Usuario logado sin el pack.
- **Pasos:**
  1. Intenta abrir una pose de `mp-boudoir-classic` (UUID `f0000000-0000-0000-0000-000000000002`) sin haberlo comprado.
  2. Prueba también via DevTools Console:
     ```javascript
     // Intenta leer las poses del pack
     const { data, error } = await supabase
       .from('poses')
       .select('*')
       .eq('product_id', 'f0000000-0000-0000-0000-000000000002'); // mp-boudoir-classic
     ```
- **Resultado esperado:**
  - La UI bloquea y muestra paywall.
  - La query devuelve `[]` o error de RLS (depende del diseño).
- **Severidad si falla:** Crítica.
- **Cómo revertir:** N/A.

### MKT-05 — Review sin compra

- **Objetivo:** Un usuario sin entitlement no puede publicar review.
- **Precondiciones:** Usuario logado sin entitlement para `mp-boudoir-classic` (UUID `f0000000-0000-0000-0000-000000000002`).
- **Pasos:**
  1. Intenta enviar una review por API:
     ```javascript
     const { error } = await supabase
       .from('reviews')
       .insert({
         product_id: 'f0000000-0000-0000-0000-000000000002', // mp-boudoir-classic
         user_id: supabase.auth.getUser().data.user.id,
         rating: 5,
         comment: 'fake review'
       });
     console.log(error);
     ```
- **Resultado esperado:** Error de RLS. La política INSERT debe checks existencia de entitlement del usuario para ese producto.
- **Severidad si falla:** Alta (spam de reviews).
- **Cómo revertir:** N/A.

### MKT-06 — Producto actualizado tras compra

- **Objetivo:** Si el creador actualiza el producto (añade poses), los que ya lo compraron reciben la actualización.
- **Precondiciones:** Un producto comprado por `devuser`.
- **Pasos:**
  1. 🟣 Supabase → Table Editor → products → añade una pose al array de `pose_ids` de un pack.
  2. Login como `devuser` y abre el pack.
- **Resultado esperado:** La nueva pose aparece en el pack owned.
- **Severidad si falla:** Media (depende del modelo de licencia perpetual vs snapshot).
- **Cómo revertir:** Quita la pose añadida.

### MKT-07 — Producto retirado (withdrawn)

- **Objetivo:** Si el creador retira un producto, los que ya lo compraron siguen teniendo acceso; nuevos usuarios no pueden comprar.
- **Precondiciones:** Un producto published con al menos un comprador.
- **Pasos:**
  1. Como creador (devcreator), cambia `publication_status` del producto `mp-creator-test-01` (UUID `f0000000-0000-0000-0000-000000000007`) de `draft` a `archived` (equivalente a "withdrawn" en el esquema real).
  2. Login como un usuario nuevo e intenta comprar.
  3. Login como el usuario que ya lo compró e intenta abrir.
- **Resultado esperado:**
  - El producto NO aparece en el marketplace browse para nuevos usuarios.
  - Si el usuario nuevo fuerza la URL, recibe paywall bloqueado.
  - El usuario que ya lo compró sigue pudiendo abrirlo.
- **Severidad si falla:** Alta.
- **Cómo revertir:** Vuelve `status` a `published`.

### MKT-08 — Reembolso + revocación

- **Objetivo:** Tras un reembolso (BILL-10), el usuario pierde acceso al producto.
- **Precondiciones:** BILL-10 pasado.
- **Pasos:**
  1. Como usuario reembolsado, intenta abrir el producto.
- **Resultado esperado:**
  - La app muestra paywall.
  - La query a `poses` del producto devuelve `[]` (RLS bloquea).
- **Severidad si falla:** Alta.
- **Cómo revertir:** N/A.

---

## 5. Migration tests

### MIG-01 — Sin datos locales

- **Objetivo:** Un usuario nuevo sin `localStorage` previo entra a la app sin errores.
- **Precondiciones:** App desplegada con el adapter de migración activado.
- **Pasos:**
  1. 🧪 **TEST** — Navegador incógnito limpio.
  2. Regístrate y completa onboarding.
- **Resultado esperado:**
  - No hay errores en Console.
  - `localStorage` no contiene claves `poseart_*` (todo en Supabase).
  - El usuario puede usar la app normalmente.
- **Severidad si falla:** Alta.
- **Cómo revertir:** N/A.

### MIG-02 — Datos locales válidos

- **Objetivo:** Un usuario existente con datos en `localStorage` los migra al backend al hacer login.
- **Precondiciones:** Navegador con datos en `poseart_*`.
- **Pasos:**
  1. 🧪 **TEST** — Antes de migrar, en DevTools Console:
     ```javascript
     // Estos son IDs de pose como los usaba la app legacy (claves de POSES_LIBRARY en js/poses-data.js).
     // El adapter de migración debe mapearlos a UUIDs del nuevo esquema (o crear poses privadas si no existen).
     localStorage.setItem('poseart_favorites', JSON.stringify(['standing-confidence','seated-casual']));
     localStorage.setItem('poseart_sessionHistory', JSON.stringify([{...}]));
     localStorage.setItem('poseart_tours', JSON.stringify([{...}]));
     ```
  2. Login.
- **Resultado esperado:**
  - El adapter detecta datos locales y los sube a Supabase (con flag `migrated_from_localstorage = true`).
  - Tras migrar, `localStorage` se limpia (o se marca `poseart_migrated = true`).
  - Las filas aparecen en las tablas correspondientes.
- **Severidad si falla:** Alta (pérdida de datos).
- **Cómo revertir:** N/A. Si se duplicaron filas, bórralas con `DELETE FROM ... WHERE migrated_from_localstorage = true AND created_at > now() - interval '1 hour';`.

### MIG-03 — Datos locales corruptos

- **Objetivo:** JSON inválido en `localStorage` no rompe la app.
- **Precondiciones:** App desplegada.
- **Pasos:**
  1. 🧪 **TEST** — En DevTools:
     ```javascript
     localStorage.setItem('poseart_favorites', 'this-is-not-json{');
     localStorage.setItem('poseart_sessionHistory', 'null');
     ```
  2. Recarga y haz login.
- **Resultado esperado:**
  - El adapter usa `try/catch` al parsear y salta las claves corruptas.
  - No se lanzan errores no capturados.
  - Sentry captura un warning "Failed to parse localStorage key" (sin PII).
  - La migración continúa con las claves válidas.
- **Severidad si falla:** Alta (crash impide usar la app).
- **Cómo revertir:** Limpia las claves corruptas.

### MIG-04 — Importación repetida

- **Objetivo:** Si el adapter corre dos veces (p. ej. tras re-login), no duplicar datos.
- **Precondiciones:** MIG-02 pasado.
- **Pasos:**
  1. Vuelve a hacer login con el mismo usuario (o recarga y fuerza re-migración).
- **Resultado esperado:**
  - El adapter detecta `poseart_migrated = true` o que las filas ya existen en Supabase.
  - NO inserta duplicados.
- **Severidad si falla:** Media (datos basura).
- **Cómo revertir:** N/A.

### MIG-05 — Interrupción a mitad

- **Objetivo:** Si la migración se interrumpe (cierra pestaña, pérdida de red), el usuario puede reanudarla sin perder datos.
- **Precondiciones:** Datos locales pesados (muchos tours, gallery grande).
- **Pasos:**
  1. 🧪 **TEST** — Inicia migración.
  2. A mitad, cierra la pestaña.
  3. Re-abre la app y vuelve a login.
- **Resultado esperado:**
  - El adapter reanuda desde donde se quedó (basado en un cursor o en "qué filas ya están en Supabase").
  - No duplica lo ya migrado.
  - Si una fila quedó a medias (sin confirmar), se re-intenta.
- **Severidad si falla:** Alta.
- **Cómo revertir:** N/A.

### MIG-06 — Conflictos entre dispositivos

- **Objetivo:** Un usuario con datos en dos navegadores distintos puede combinarlos sin perder datos.
- **Precondiciones:** Usuario con datos en navegador A y navegador B.
- **Pasos:**
  1. En navegador A: login y migración.
  2. En navegador B: login y migración.
- **Resultado esperado:**
  - El adapter hace upsert (no insert con clave nueva) basándose en IDs estables de los datos locales.
  - Para favoritos: `INSERT ... ON CONFLICT (user_id, pose_id) DO NOTHING`.
  - Para tours: si el `id` local ya existe en Supabase, se actualiza; si no, se inserta.
- **Severidad si falla:** Alta.
- **Cómo revertir:** N/A.

### MIG-07 — Límite de almacenamiento

- **Objetivo:** Si el `localStorage` excede cuota (5-10 MB), la app maneja el error con elegancia.
- **Precondiciones:** App desplegada.
- **Pasos:**
  1. 🧪 **TEST** — Rellena `localStorage` hasta llenarlo (script que escribe hasta que `setItem` lanza `QuotaExceededError`).
  2. Intenta guardar una pose o una capture.
- **Resultado esperado:**
  - La app captura el error y muestra "Tu navegador está lleno. Inicia sesión para sincronizar con la nube."
  - NO se cae sin mensaje.
- **Severidad si falla:** Media.
- **Cómo revertir:** Limpia `localStorage`.

### MIG-08 — Cuenta equivocada

- **Objetivo:** Un usuario que migra datos locales a una cuenta equivocada puede detectar y revertir.
- **Precondiciones:** Usuario con datos locales del usuario X.
- **Pasos:**
  1. Login como usuario Y (distinto).
  2. El adapter detecta que los datos locales no tienen marca de "pertenece a Y" (si guardaste el user_id del último login exitoso).
  3. Muestra aviso: "Estos datos parecen ser de otra cuenta. ¿Quieres migrarlos a esta cuenta de todos modos?".
- **Resultado esperado:**
  - Confirmación explícita del usuario antes de migrar.
  - Si rechaza, no se migra nada.
- **Severidad si falla:** Alta (fuga de datos a cuenta ajena).
- **Cómo revertir:** Si se migró por error, borra las filas creadas:
  ```sql
  DELETE FROM favorites WHERE user_id = '<id-Y>' AND created_at > now() - interval '5 minutes';
  ```

---

## 6. Analytics / privacy tests

### ANA-01 — Eventos duplicados

- **Objetivo:** El SDK no envía un evento dos veces por la misma acción.
- **Precondiciones:** Pasos 1 y 2 de `09-ANALYTICS-AND-OBSERVABILITY.md` completados.
- **Pasos:**
  1. 🧪 **TEST** — Clic en "Favorite" en una pose.
  2. Verifica en PostHog Live Events que llega un solo `pose_viewed` o `favorite_toggled` (según taxonomía).
- **Resultado esperado:** Un evento, no dos.
- **Severidad si falla:** Baja (ruido en datos).
- **Cómo revertir:** N/A.

### ANA-02 — Usuario anónimo

- **Objetivo:** Antes del login, todos los eventos usan `anonymous_id` y NO contienen `user_id`.
- **Precondiciones:** App en incógnito sin login.
- **Pasos:**
  1. Navega por la app sin login.
  2. Verifica en PostHog que los eventos tienen `distinct_id` igual al `anonymous_id` (formato UUID aleatorio).
- **Resultado esperado:** Ningún evento contiene `user_id` real ni email.
- **Severidad si falla:** Alta (PII en eventos anónimos).
- **Cómo revertir:** N/A.

### ANA-03 — Usuario autenticado

- **Objetivo:** Tras login, los eventos llevan `user_id` (UUID) y se enlazan con la sesión anónima previa.
- **Precondiciones:** Usuario registrado.
- **Pasos:**
  1. 🧪 **TEST** — Tras registrarte y aceptar consentimiento, navega por la app.
  2. En PostHog → Persons → encuentra tu `user_id`.
- **Resultado esperado:**
  - Los eventos posteriores al login tienen `distinct_id = user_id`.
  - PostHog muestra una fusión: "This person was previously `<anonymous_id>`".
- **Severidad si falla:** Media.
- **Cómo revertir:** N/A.

### ANA-04 — Cambio de identidad (login → logout → otro login)

- **Objetivo:** Tras logout y login con otra cuenta, los eventos NO se mezclan.
- **Precondiciones:** Dos cuentas distintas.
- **Pasos:**
  1. Login como usuario A.
  2. Logout.
  3. Login como usuario B.
- **Resultado esperado:**
  - Tras logout, `posthog.reset()` genera nuevo `anonymous_id`.
  - Tras login B, los eventos llevan `user_id` de B.
  - En PostHog, los eventos de A NO aparecen en la persona de B.
- **Severidad si falla:** Alta (fuga entre cuentas).
- **Cómo revertir:** N/A.

### ANA-05 — Consentimiento rechazado

- **Objetivo:** Si el usuario rechaza el consentimiento, NO se envía ningún evento de producto.
- **Precondiciones:** Paso 5 de `09-ANALYTICS-AND-OBSERVABILITY.md` completado.
- **Pasos:**
  1. 🧪 **TEST** — Limpia storage. Recarga.
  2. En el banner, clic "Solo esenciales".
  3. Navega por la app, haz login, inicia sesión de cámara.
- **Resultado esperado:**
  - PostHog Live Events sólo recibe `consent_updated` con `status: denied`.
  - NO aparecen `signup_started`, `pose_viewed`, etc.
  - DevTools Network muestra que las peticiones a `/e/` y `/i/` no se hacen (o se hacen con `opt_out=true`).
- **Severidad si falla:** Crítica (RGPD).
- **Cómo revertir:** N/A.

### ANA-06 — Propiedad sensible bloqueada

- **Objetivo:** El wrapper `track()` bloquea propiedades prohibidas.
- **Precondiciones:** Función `track()` implementada (ver `09-ANALYTICS-AND-OBSERVABILITY.md` sección 7.2).
- **Pasos:**
  1. 🧪 **TEST** — En DevTools Console:
     ```javascript
     window.__poseartTrack('test_sensitive', {
       pose_id: 'pose-1',
       password: 'secret123',
       image_data_url: 'data:image/png;base64,...'
     });
     ```
  2. Verifica en PostHog Live Events el evento `test_sensitive`.
- **Resultado esperado:**
  - El evento llega a PostHog.
  - Sus `properties` sólo contienen `pose_id`.
  - `password` y `image_data_url` NO están.
  - Console muestra warning `[analytics] dropped forbidden property: password` (en dev).
- **Severidad si falla:** Crítica.
- **Cómo revertir:** N/A.

### ANA-07 — Eliminación de cuenta

- **Objetivo:** Tras borrar la cuenta, los datos del usuario desaparecen de PostHog y Sentry.
- **Precondiciones:** Usuario con eventos en PostHog y errores en Sentry.
- **Pasos:**
  1. Ejecuta el flujo de "Delete my account" (ver `12-OPERATIONS-PRIVACY-AND-BACKUPS.md`).
- **Resultado esperado:**
  - En Supabase: `profiles.deleted_at` se setea (soft delete) y tras el periodo de retención, hard delete.
  - En PostHog: el `user_id` se borra vía PostHog API (o se anonimiza). Ver https://posthog.com/docs/privacy/data-deletion.
  - En Sentry: el usuario se borra vía Sentry GDPR API. Ver https://docs.sentry.io/product/data-management-settings/privacy/legal-export-delete/.
  - El usuario no puede volver a login (la cuenta no existe).
- **Severidad si falla:** Crítica (RGPD/CCPA).
- **Cómo revertir:** No hay reversa posible una vez borrado (es el objetivo).

---

## 7. RLS verification commands (SQL)

Ejecuta estas queries en 🟣 **PANEL** → SQL Editor. Para cada una, sustituye `<UUID>` por el UUID del usuario de prueba.

### 7.1 Verificar que RLS está activado en todas las tablas sensibles

```sql
SELECT relname AS table_name,
       relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname IN (
  'profiles','user_preferences','poses','favorites','pose_sessions',
  'tours','products','entitlements','reviews','bug_reports','admin_audit_log'
)
  AND relnamespace = 'public'::regnamespace
ORDER BY relname;
```
**Aceptación:** Todas las filas con `rls_enabled = true`.

### 7.2 Listar todas las políticas

```sql
SELECT tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```
**Aceptación:** Existe al menos una política SELECT / INSERT / UPDATE / DELETE por tabla sensible, según modelo.

### 7.3 Simular query como un usuario concreto

```sql
-- Como devuser, ¿qué favoritos veo?
SET request.jwt.claim.sub = '<devuser-uuid>';
SET request.jwt.claims = '{"role":"authenticated","email":"devuser@poseart.local"}';

SELECT count(*) AS own_favorites
FROM favorites;
-- Esperado: 3 (los sembrados del devuser)
```

> ⚠️ **No verificado:** la sintaxis `SET request.jwt.claim.sub` funciona en Supabase SQL Editor para simular un JWT. Si tu versión de Supabase no la soporta, crea un par de claves de prueba JWT y usa el header `Authorization: Bearer <jwt>` en una petición REST.

### 7.4 Verificar que un usuario no puede leer perfiles ajenos

```sql
-- Como devuser
SET request.jwt.claim.sub = '<devuser-uuid>';

SELECT id, email FROM profiles;
-- Esperado: 1 fila (sólo el propio)
```

### 7.5 Verificar que un usuario no puede insertar entitlements

```sql
-- Como devuser
SET request.jwt.claim.sub = '<devuser-uuid>';

INSERT INTO entitlements (user_id, product_id, source)
VALUES ('<devuser-uuid>', 'f0000000-0000-0000-0000-000000000002', 'purchase'); -- mp-boudoir-classic
-- Esperado: ERROR: new row violates row-level security policy
```

### 7.6 Verificar que un creador sólo ve sus propios tours

```sql
-- Como devcreator
SET request.jwt.claim.sub = '<devcreator-uuid>';

SELECT id, name, author_id FROM tours;
-- Esperado: sólo tours donde author_id = devcreator-uuid (o públicos published)
```

### 7.7 Auditoría: ¿hay alguna política peligrosa con `USING (true)`?

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND qual = 'true';
```
**Aceptación:** Si aparece cualquier fila en `entitlements`, `bug_reports`, `admin_audit_log`, `profiles`, es un BUG crítico. Investiga y reescribe la política.

### 7.8 Verificar funciones con `SECURITY DEFINER`

Las funciones `SECURITY DEFINER` se ejecutan con los privilegios del owner, no del usuario. Son peligrosas si no están bien escritas.

```sql
SELECT proname, proowner, prosecdef
FROM pg_proc
WHERE prosecdef = true
  AND pronamespace = 'public'::regnamespace;
```
**Aceptación:** Toda función en esta lista debe ser revisada manualmente. Debe checks `auth.uid()` internamente antes de cualquier operación sensible.

---

## 8. Acceptance criteria globales

### 8.1 Criterio de aceptación de Auth

- [ ] AUTH-01 a AUTH-09 todos aprobados.
- [ ] No hay mensajes de error que permitan enumerar usuarios.
- [ ] La sesión expira según la política configurada.
- [ ] Logout invalida el token inmediatamente.

### 8.2 Criterio de aceptación de Data Isolation

- [ ] ISO-01 a ISO-07 todos aprobados.
- [ ] Ninguna tabla sensible permite `SELECT *` a un usuario que devuelva filas ajenas.
- [ ] Ningún campo de rol/entitlement es escribible por el propio usuario.

### 8.3 Criterio de aceptación de Billing

- [ ] BILL-01 a BILL-13 todos aprobados.
- [ ] El webhook rechaza firmas inválidas.
- [ ] El webhook es idempotente.
- [ ] El precio NO se lee del cliente.
- [ ] Reembolsos y cancelaciones revocan el acceso.

### 8.4 Criterio de aceptación de Marketplace

- [ ] MKT-01 a MKT-08 todos aprobados.
- [ ] Sin entitlement, no hay acceso a contenido pagado.
- [ ] Sin entitlement, no se puede review.

### 8.5 Criterio de aceptación de Migration

- [ ] MIG-01 a MIG-08 todos aprobados.
- [ ] El adapter es idempotente.
- [ ] El adapter maneja JSON corrupto sin crash.

### 8.6 Criterio de aceptación de Analytics/Privacy

- [ ] ANA-01 a ANA-07 todos aprobados.
- [ ] El wrapper `track()` bloquea propiedades prohibidas.
- [ ] Sin consentimiento, no se envían eventos de producto.
- [ ] Account deletion borra datos en PostHog y Sentry.

### 8.7 Criterio de aceptación de RLS

- [ ] Todas las tablas sensibles tienen `rls_enabled = true`.
- [ ] No hay políticas con `USING (true)` en tablas críticas.
- [ ] Las funciones `SECURITY DEFINER` están auditadas.

### 8.8 Smoke test final en producción

Después de desplegar a producción, ejecuta este smoke test mínimo:

- [ ] Login con un usuario real funciona.
- [ ] Marcar favorito y verlo persistir tras refrescar.
- [ ] (Si Stripe en live) Compra un pack de test con tarjeta real de prueba (no 4242; en live mode usa una tarjeta de test de Stripe si está disponible, o una real de $0.50 que reembolsas después).
- [ ] Sentry recibe un error de prueba.
- [ ] PostHog recibe un evento de prueba.
- [ ] La URL de redirección de Auth funciona en prod.

> ⚠️ **No deploy sin las casillas marcadas.** Si una prueba crítica falla, abre un ticket y bloquea el deploy hasta resolver.
