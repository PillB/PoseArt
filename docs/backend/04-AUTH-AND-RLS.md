# 04 — Autenticación y RLS (Row Level Security)

> **Propósito:** Definir cómo se autentica un usuario, qué roles existen, cómo se protegen los datos con RLS y qué pruebas negativas hay que pasar antes de ir a producción. El SQL ejecutable está en `sql/002-rls.sql`.

---

## 0. Cómo leer este documento

Cada paso operativo sigue esta plantilla:

| Campo | Descripción |
|---|---|
| **Objetivo** | Qué se quiere lograr |
| **Por qué se necesita** | Motivación conectada con la auditoría |
| **Prerrequisitos** | Qué debe existir antes |
| **Dónde se ejecuta** | Consola / panel / local |
| **Acción exacta** | Comando o paso |
| **Resultado esperado** | Qué se observa si todo va bien |
| **Cómo verificar** | Comprobación concreta |
| **Errores comunes** | Qué suele romperse |
| **Cómo revertir** | Cómo volver atrás |
| **Fuente oficial** | URL primaria |

---

## 1. Supabase Auth: configuración

### 1.1 Provider: email + password

| Campo | Valor |
|---|---|
| **Objetivo** | Permitir registro/login con email y contraseña |
| **Por qué se necesita** | Resuelve la deuda crítica nº 1 (credenciales en Base64) y nº 3 (`ownedPacks` manipulable) |
| **Prerrequisitos** | Proyecto Supabase creado; `001-schema.sql` ejecutado |
| **Dónde se ejecuta** | Supabase Dashboard → Authentication → Providers |
| **Acción exacta** | 1. Abrir Supabase Dashboard.<br/>2. Ir a Authentication → Providers.<br/>3. Activar "Email".<br/>4. Configurar:<br/>   - "Confirm email": ON<br/>   - "Email signup": ON<br/>   - "Double confirm email changes": ON<br/>   - "Min password length": 12<br/>   - "Password requirements": al menos una mayúscula, una minúscula, un número, un símbolo<br/>5. Save. |
| **Resultado esperado** | Provider Email aparece como "Enabled". Los nuevos registros reciben un email de confirmación. |
| **Cómo verificar** | 1. En Authentication → Users → "Add user", crea uno con email falso.<br/>2. Comprueba que llega un email de confirmación (en el Mailtrap/SMTP configurado).<br/>3. Sin confirmar, el usuario no puede loguearse (si "Confirm email" está ON). |
| **Errores comunes** | - No configurar SMTP → los emails van a un limbo. Configurar SMTP en Authentication → Email Templates → SMTP Settings.<br/>- "Confirm email" en OFF → cualquiera puede registrarse con email ajeno. |
| **Cómo revertir** | Desactivar "Email" en Providers. NO recomendado en producción. |
| **Fuente oficial** | https://supabase.com/docs/guides/auth/passwords |

### 1.2 Verificación de email

| Campo | Valor |
|---|---|
| **Objetivo** | Asegurar que el usuario controla el email declarado |
| **Por qué se necesita** | Sin verificación, alguien puede registrarse con email ajeno y recibir sus datos |
| **Prerrequisitos** | Provider Email activado (paso 1.1) |
| **Dónde se ejecuta** | Supabase Dashboard → Authentication → Email Templates |
| **Acción exacta** | 1. Configurar plantilla "Confirm signup" con tu marca.<br/>2. Configurar URL de redirección: `https://<tu-dominio>/#/auth/confirm`.<br/>3. En Authentication → URL Configuration → Site URL: `https://<tu-dominio>`.<br/>4. En Redirect URLs: añadir `https://<tu-dominio>/**` y la URL de GitHub Pages durante dev. |
| **Resultado esperado** | Tras registrarse, el usuario recibe un email. Al clickar el enlace, vuelve a la app con sesión activa. |
| **Cómo verificar** | Registrarse con email real; comprobar redirect y sesión. |
| **Errores comunes** | - Olvidar añadir la URL de GitHub Pages a Redirect URLs → el redirect falla en dev.<br/>- Site URL mal configurada → el token de confirmación se pierde. |
| **Cómo revertir** | Desactivar "Confirm email" (NO recomendado). |
| **Fuente oficial** | https://supabase.com/docs/guides/auth/auth-email-confirmation |

### 1.3 Recuperación de contraseña

| Campo | Valor |
|---|---|
| **Objetivo** | Permitir reseteo de contraseña sin intervención manual |
| **Por qué se necesita** | La app actual no tiene reset (deuda nº 3) |
| **Dónde se ejecuta** | Supabase Dashboard → Authentication → Email Templates → "Reset Password" |
| **Acción exacta** | 1. Editar plantilla con tu marca.<br/>2. URL de redirección: `https://<tu-dominio>/#/auth/reset-password`.<br/>3. En el frontend, llamar `supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://.../reset-password' })`. |
| **Resultado esperado** | El usuario recibe email con enlace. Al clickar, aterriza en la página de reseteo con sesión temporal. |
| **Cómo verificar** | Desde la app, pedir reseteo con email real; comprobar email y URL. |
| **Errores comunes** | - Olvidar crear la página `reset-password` en el frontend → el usuario aterriza en 404.<br/>- No llamar a `supabase.auth.updateUser({ password })` en la página de reseteo → el token se pierde. |
| **Cómo revertir** | Desactivar el flujo (no recomendado). |
| **Fuente oficial** | https://supabase.com/docs/guides/auth/passwords#resetting-passwords |

### 1.4 MFA para administradores (TOTP)

| Campo | Valor |
|---|---|
| **Objetivo** | Forzar MFA TOTP a usuarios con rol `administrador` |
| **Por qué se necesita** | Un admin puede conceder roles, archivar productos, forzar reembolsos. Su cuenta es objetivo de phishing. |
| **Dónde se ejecuta** | Supabase Dashboard → Authentication → MFA + código en Edge Function |
| **Acción exacta** | 1. Activar "TOTP" en Authentication → MFA.<br/>2. En la Edge Function que concede rol `administrador`, validar que el usuario tiene `aal2` (authenticator assurance level 2):<br/>```js<br/>const { data: { session } } = await supabase.auth.getSession();<br/>if (session.user.user_role === 'administrador' && session.user.aal !== 'aal2') {<br/>  return new Response('MFA required', { status: 403 });<br/>}<br/>```<br/>3. En el frontend, detectar rol `administrador` y redirigir a `/auth/mfa-enroll` si no tiene factor inscrito. |
| **Resultado esperado** | Al hacer login un admin sin MFA, se le exige enrollar un factor TOTP (Google Authenticator, Authy, etc.) antes de seguir. |
| **Cómo verificar** | 1. Crear usuario admin sin MFA.<br/>2. Loguearse.<br/>3. Comprobar que se redirige a enroll TOTP.<br/>4. Tras enroll, login pide código TOTP. |
| **Errores comunes** | - Creer que "activar MFA" en el panel es suficiente. NO: hay que verificar `aal2` en el servidor.<br/>- No ofrecer flujo de recovery (códigos backup). |
| **Cómo revertir** | Desactivar TOTP en panel + quitar el check en Edge Function. |
| **Fuente oficial** | https://supabase.com/docs/guides/auth/mfa |

> ⚠️ Supabase también soporta MFA vía Phone (SMS) y WebAuthn. Para MVP usamos TOTP que es el más simple y no tiene coste. [VERIFICA: https://supabase.com/docs/guides/auth/mfa/totp]

---

## 2. Roles

PoseArt tiene cuatro roles. **Un usuario, un rol** (en MVP).

| Rol | Quién es | Qué puede hacer |
|---|---|---|
| `usuario` | Usuario normal registrado | Leer contenido público, crear contenido privado, comprar, suscribirse, escribir reseñas, gestionar sus datos |
| `creador` | Usuario con perfil de creador verificado | Todo lo de `usuario` + publicar productos en marketplace (con revisión), editar sus productos publicados |
| `moderador` | Miembro del equipo PoseArt | Todo lo de `usuario` + revisar productos en `in_review`, archivar productos publicados, ocultar reseñas |
| `administrador` | Miembro del equipo PoseArt con privilegios totales | Todo lo de `moderador` + conceder/revocar roles, forzar reembolsos, ver `admin_audit_log`, gestionar soporte |

### 2.1 Asignación inicial

| Campo | Valor |
|---|---|
| **Objetivo** | Crear el primer administrador sin tener panel de admin todavía |
| **Por qué se necesita** | Nadie tiene rol `administrador` al principio. Hay que bootstrap. |
| **Dónde se ejecuta** | Supabase Dashboard → SQL Editor |
| **Acción exacta** | 1. Registrar el primer usuario por UI normal (Supabase Dashboard → Authentication → Add user, o signup desde la app).<br/>2. Copiar el UUID del usuario.<br/>3. Ejecutar en SQL Editor:<br/>```sql<br/>UPDATE public.user_roles<br/>SET role = 'administrador',<br/>    granted_by = (SELECT id FROM auth.users WHERE email = 'tu-email-admin@dominio.com'),<br/>    granted_at = now(),<br/>    reason = 'Bootstrap inicial'<br/>WHERE user_id = '<UUID-DEL-PRIMER-ADMIN>';<br/>```<br/>4. Inscribir MFA TOTP para ese usuario (paso 1.4). |
| **Resultado esperado** | El usuario aparece en `user_roles` con rol `administrador` y puede acceder a funciones admin. |
| **Cómo verificar** | Loguearse como ese usuario y comprobar que puede llamar a funciones admin. |
| **Errores comunes** | - Olvidar inscribir MFA → el check `aal2` bloquea al admin.<br/>- Conceder rol sin `granted_by` → no se puede auditar quién lo concedió. |
| **Cómo revertir** | `UPDATE user_roles SET role = 'usuario' WHERE user_id = '...';` |
| **Fuente oficial** | https://supabase.com/docs/guides/database/postgres/row-level-security#call-rls-functions-from-the-client |

### 2.2 Concesión/revocación posterior

Las concesiones posteriores se hacen a través de una Edge Function `admin-grant-role` que:

1. Verifica que el solicitante tiene rol `administrador`.
2. Verifica que el solicitante tiene `aal2` (MFA).
3. Registra la acción en `admin_audit_log`.
4. Inserta/actualiza `user_roles`.

El código exacto de esa Edge Function está fuera del alcance de este documento (ver `08-MARKETPLACE-AND-PURCHASES.md` y futura guía de admin).

---

## 3. Por qué NO hay campo `is_pro`

### 3.1 Anti-patrón: `profiles.is_pro boolean`

Una idea tentadora: añadir `is_pro boolean` a `profiles`. **No lo hacemos.** Razones:

1. **Estado derivado, no intrínseco.** "Ser Pro" depende de si hay una suscripción activa o una compra válida. Es una consulta, no una propiedad.
2. **Sincronización frágil.** Si `is_pro = true` pero la suscripción caducó hace una semana, hay un bug. Y al revés: si `is_pro = false` pero el webhook tardó en llegar, el usuario paga y no ve Pro → mala UX.
3. **Ataque directo.** Un atacante que consiga UPDATE en `profiles` (p. ej. por un bug de RLS) puede autoproclamarse Pro. Con la tabla `entitlements`, necesita falsear un evento de pago firmado por Stripe.
4. **Diferenciación de fuentes.** Con `entitlements.source` sabemos si el Pro viene de suscripción, compra, regalo o concesión admin. Un booleano lo pierde.

### 3.2 Patrón correcto: derivar de `entitlements`

```sql
-- Función helper para usar en RLS y consultas
CREATE OR REPLACE FUNCTION public.user_has_pro(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS(
        SELECT 1 FROM public.entitlements
        WHERE entitlements.user_id = user_uuid
          AND entitlements.active = true
          AND entitlements.scope = 'all_pro_content'
          AND (entitlements.ends_at IS NULL OR entitlements.ends_at > now())
    );
$$;
```

Esta función:
- Es `SECURITY DEFINER` para poder llamarse desde políticas RLS sin exponer `entitlements` directamente.
- Es `STABLE` (no modifica datos).
- Tiene `search_path = public` por seguridad (previene ataques de search_path).

### 3.3 Consulta típica desde el frontend

```js
const { data, error } = await supabase
  .rpc('user_has_pro', { user_uuid: user.id });
// data === true/false
```

O, más eficiente, una vista materializada o una columna en `profiles` cacheada que se actualice por trigger. Pero el código de la app siempre consulta la **función**, no el cache. [VERIFICA: https://supabase.com/docs/guides/database/functions]

---

## 4. RLS: enfoque deny-by-default

### 4.1 Principio

RLS en Postgres funciona así por defecto:

- Si RLS está **OFF** en una tabla: las consultas con la clave `anon`/`authenticated` ven **todas** las filas.
- Si RLS está **ON** en una tabla y no hay políticas: las consultas con `anon`/`authenticated` ven **cero** filas.

El segundo caso es lo que queremos. **Por eso activamos RLS en TODAS las tablas y escribimos solo políticas `PERMISSIVE` explícitas.**

### 4.2 Reglas de oro

| # | Regla |
|---|---|
| 1 | RLS se activa en TODAS las tablas con datos de usuario, sin excepción. |
| 2 | Si una tabla no tiene políticas `PERMISSIVE`, se comporta como deny-all. Es el estado seguro. |
| 3 | Las políticas se escriben en SQL declarativo, auditables, versionados. |
| 4 | La clave `service_role` **bypassa** RLS. Solo se usa en Edge Functions, nunca en el navegador. |
| 5 | La clave `anon` NO bypassa RLS. Solo puede hacer lo que las políticas permitan. |
| 6 | Para operaciones que el usuario no debe poder hacer directamente (crear entitlements, conceder roles), se usa una Edge Function con `service_role`. |
| 7 | `auth.uid()` devuelve NULL si no hay sesión. Las políticas deben manejar ese caso. |
| 8 | Una política `USING (...)` controla visibilidad de filas existentes. `WITH CHECK (...)` controla qué se puede insertar/actualizar. |
| 9 | Si necesitas autorizar por rol, usa una función helper como `public.current_user_role()` que lee `user_roles` para `auth.uid()`. |
| 10 | Nunca pongas lógica sensible en el cliente. El cliente pide; el servidor valida. |

### 4.3 Funciones helper

```sql
-- Devuelve el rol del usuario autenticado actual, o NULL si no hay sesión.
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT role FROM public.user_roles WHERE user_id = auth.uid();
$$;

-- Devuelve TRUE si el usuario actual tiene uno de los roles indicados.
CREATE OR REPLACE FUNCTION public.current_user_has_role(required_roles text[])
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS(
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = ANY(required_roles)
    );
$$;

-- Devuelve TRUE si el usuario actual es dueño de la fila indicada (por user_id).
-- Uso: SELECT * FROM profiles WHERE public.is_current_user_owner(profiles.id);
CREATE OR REPLACE FUNCTION public.is_current_user_owner(row_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
    SELECT auth.uid() = row_user_id;
$$;
```

> `current_user_role` y `current_user_has_role` son `SECURITY DEFINER` porque `user_roles` no es legible por usuarios ajenos (RLS lo prohíbe). El helper evita exponer toda la tabla.

---

## 5. Matriz de autorización

Leyenda: ✅ permitido · ❌ denegado · ⚠️ condicional

### 5.1 Identidad

| Recurso | Acción | Anónimo | `usuario` | `creador` | `moderador` | `administrador` | Condición |
|---|---|---|---|---|---|---|---|
| `profiles` | SELECT | ❌ | ⚠️ solo propia + datos públicos de otros | ⚠️ igual | ⚠️ igual | ✅ todas | `id = auth.uid() OR public_fields` |
| `profiles` | INSERT | ❌ | ❌ (lo hace el trigger `handle_new_user`) | ❌ | ❌ | ❌ | — |
| `profiles` | UPDATE | ❌ | ⚠️ solo propia | ⚠️ solo propia | ⚠️ solo propia | ✅ todas | `id = auth.uid()` |
| `profiles` | DELETE | ❌ | ❌ | ❌ | ❌ | ⚠️ solo vía Edge Function | Soft delete preferido |
| `user_roles` | SELECT | ❌ | ⚠️ solo propia | ⚠️ solo propia | ⚠️ solo propia | ✅ todas | `user_id = auth.uid()` |
| `user_roles` | INSERT | ❌ | ❌ | ❌ | ❌ | ❌ | Solo vía Edge Function con `service_role` |
| `user_roles` | UPDATE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo vía Edge Function |
| `user_roles` | DELETE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo vía Edge Function |
| `admin_audit_log` | SELECT | ❌ | ❌ | ❌ | ❌ | ✅ | — |
| `admin_audit_log` | INSERT | ❌ | ❌ | ❌ | ❌ | ❌ | Solo vía Edge Function con `service_role` |
| `admin_audit_log` | UPDATE | ❌ | ❌ | ❌ | ❌ | ❌ | Inmutable |
| `admin_audit_log` | DELETE | ❌ | ❌ | ❌ | ❌ | ❌ | Inmutable |

### 5.2 Facturación

| Recurso | Acción | Anónimo | `usuario` | `creador` | `moderador` | `administrador` | Condición |
|---|---|---|---|---|---|---|---|
| `billing_customers` | SELECT | ❌ | ⚠️ solo propia | ⚠️ solo propia | ⚠️ solo propia | ✅ todas | `user_id = auth.uid()` |
| `billing_customers` | INSERT/UPDATE/DELETE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo webhook handler con `service_role` |
| `subscriptions` | SELECT | ❌ | ⚠️ solo propia | ⚠️ solo propia | ⚠️ solo propia | ✅ todas | `user_id = auth.uid()` |
| `subscriptions` | INSERT/UPDATE/DELETE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo webhook handler |
| `subscription_events` | SELECT | ❌ | ⚠️ solo propias | ⚠️ | ⚠️ | ✅ | `subscription_id IN (SELECT id FROM subscriptions WHERE user_id = auth.uid())` |
| `subscription_events` | INSERT/UPDATE/DELETE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo webhook handler |
| `invoices` | SELECT | ❌ | ⚠️ solo propias | ⚠️ | ⚠️ | ✅ | `user_id = auth.uid()` |
| `invoices` | WRITE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo webhook handler |
| `payment_events` | SELECT | ❌ | ⚠️ solo propias | ⚠️ | ⚠️ | ✅ | `user_id = auth.uid()` |
| `payment_events` | WRITE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo webhook handler |
| `webhook_events` | SELECT | ❌ | ❌ | ❌ | ❌ | ✅ | Solo admin |
| `webhook_events` | WRITE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo webhook handler |
| `entitlements` | SELECT | ❌ | ⚠️ solo propias | ⚠️ | ⚠️ | ✅ | `user_id = auth.uid()` |
| `entitlements` | INSERT/UPDATE/DELETE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo webhook handler o admin Edge Function |

### 5.3 Contenido (poses y tours)

| Recurso | Acción | Anónimo | `usuario` | `creador` | `moderador` | `administrador` | Condición |
|---|---|---|---|---|---|---|---|
| `poses` | SELECT | ⚠️ solo `visibility='public'` y no archivadas | ⚠️ públicas + propias privadas | ⚠️ + propias | ⚠️ + todas no archivadas | ✅ todas | `visibility='public' AND archived_at IS NULL OR owner_id = auth.uid()` |
| `poses` | INSERT | ❌ | ⚠️ con `owner_id = auth.uid()`, `visibility='private'` | ⚠️ igual | ⚠️ | ✅ | `owner_id = auth.uid()` |
| `poses` | UPDATE | ❌ | ⚠️ propias | ⚠️ propias | ⚠️ + archivar | ✅ | `owner_id = auth.uid()` |
| `poses` | DELETE | ❌ | ⚠️ propias (si no referenciadas por purchase) | ⚠️ propias | ⚠️ | ✅ | RESTRICT FK lo protege |
| `pose_versions` | SELECT | ⚠️ si la pose padre es pública | ⚠️ + privadas propias | ⚠️ | ⚠️ | ✅ | Hereda visibilidad de pose |
| `pose_versions` | INSERT | ❌ | ⚠️ si `pose.owner_id = auth.uid()` | ⚠️ | ⚠️ | ✅ | `created_by = auth.uid()` y pose propia |
| `pose_versions` | UPDATE | ❌ | ❌ | ❌ | ❌ | ❌ | Inmutable |
| `pose_versions` | DELETE | ❌ | ❌ | ❌ | ❌ | ❌ | Inmutable |
| `tours` | (igual que `poses`) | | | | | | |
| `tour_versions` | (igual que `pose_versions`) | | | | | | |
| `tour_sections` | SELECT | ⚠️ si tour padre público | ⚠️ + propios | ⚠️ | ⚠️ | ✅ | Hereda de tour_version |
| `tour_sections` | INSERT/UPDATE/DELETE | ❌ | ⚠️ si tour propio | ⚠️ | ⚠️ | ✅ | Vía RLS del tour_version |
| `tour_items` | (igual que `tour_sections`) | | | | | | |

### 5.4 Marketplace

| Recurso | Acción | Anónimo | `usuario` | `creador` | `moderador` | `administrador` | Condición |
|---|---|---|---|---|---|---|---|
| `creator_profiles` | SELECT | ⚠️ no archivadas | ⚠️ | ⚠️ | ⚠️ | ✅ | `archived_at IS NULL` |
| `creator_profiles` | INSERT | ❌ | ❌ | ⚠️ solo para sí mismo | ❌ | ✅ | `user_id = auth.uid()` y rol `creador` |
| `creator_profiles` | UPDATE | ❌ | ❌ | ⚠️ propia | ❌ | ✅ | `user_id = auth.uid()` |
| `products` | SELECT | ⚠️ `publication_status='published'` | ⚠️ publicados + propios | ⚠️ + propios | ⚠️ + `in_review` | ✅ | Ver política detallada |
| `products` | INSERT | ❌ | ❌ | ⚠️ con `creator_id = auth.uid()` | ❌ | ✅ | `creator_id = auth.uid()` y `publication_status='draft'` |
| `products` | UPDATE | ❌ | ❌ | ⚠️ propios (no published) | ⚠️ archivar | ✅ | `creator_id = auth.uid()` |
| `products` | DELETE | ❌ | ❌ | ❌ | ❌ | ❌ | Soft delete (archived_at) |
| `product_items` | SELECT | ⚠️ si producto published | ⚠️ + propios | ⚠️ + propios | ⚠️ | ✅ | Hereda de product |
| `product_items` | WRITE | ❌ | ❌ | ⚠️ si producto propio y no published | ❌ | ✅ | `product.creator_id = auth.uid()` |
| `product_publications` | SELECT | ❌ | ⚠️ propias | ⚠️ propias | ✅ todas | ✅ | Ver política |
| `product_publications` | INSERT | ❌ | ❌ | ❌ | ❌ | ❌ | Solo vía Edge Function |
| `reviews` | SELECT | ⚠️ no ocultas | ⚠️ + propias | ⚠️ | ✅ | ✅ | `hidden_at IS NULL OR user_id = auth.uid()` |
| `reviews` | INSERT | ❌ | ⚠️ si tiene entitlement del producto | ⚠️ | ❌ | ❌ | Trigger valida entitlement |
| `reviews` | UPDATE | ❌ | ⚠️ propia (comment, rating) | ⚠️ propia | ❌ | ❌ | `user_id = auth.uid()` |
| `reviews` | DELETE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo ocultar (`hidden_at`) |

### 5.5 Comercio

| Recurso | Acción | Anónimo | `usuario` | `creador` | `moderador` | `administrador` | Condición |
|---|---|---|---|---|---|---|---|
| `orders` | SELECT | ❌ | ⚠️ propias | ⚠️ propias | ⚠️ | ✅ | `user_id = auth.uid()` |
| `orders` | WRITE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo Edge Function (create-checkout, webhook) |
| `order_items` | SELECT | ❌ | ⚠️ si orden propia | ⚠️ | ⚠️ | ✅ | `order.user_id = auth.uid()` |
| `order_items` | WRITE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo Edge Function |
| `purchases` | SELECT | ❌ | ⚠️ propias | ⚠️ propias + productos suyos | ⚠️ | ✅ | `user_id = auth.uid() OR product.creator_id = auth.uid()` |
| `purchases` | WRITE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo webhook handler |
| `refunds` | SELECT | ❌ | ⚠️ propias | ⚠️ | ⚠️ | ✅ | `user_id = auth.uid()` |
| `refunds` | WRITE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo Edge Function admin |

### 5.6 Datos de usuario

| Recurso | Acción | Anónimo | `usuario` | `creador` | `moderador` | `administrador` | Condición |
|---|---|---|---|---|---|---|---|
| `favorites` | SELECT | ❌ | ⚠️ propias | ⚠️ | ⚠️ | ✅ | `user_id = auth.uid()` |
| `favorites` | INSERT | ❌ | ⚠️ propias | ⚠️ | ❌ | ❌ | `user_id = auth.uid()` |
| `favorites` | DELETE | ❌ | ⚠️ propias | ⚠️ | ❌ | ❌ | `user_id = auth.uid()` |
| `user_preferences` | SELECT | ❌ | ⚠️ propias | ⚠️ | ⚠️ | ✅ | `user_id = auth.uid()` |
| `user_preferences` | UPSERT | ❌ | ⚠️ propias | ⚠️ | ❌ | ❌ | `user_id = auth.uid()` |
| `pose_sessions` | SELECT | ❌ | ⚠️ propias | ⚠️ | ⚠️ | ✅ | `user_id = auth.uid()` |
| `pose_sessions` | INSERT | ❌ | ⚠️ propias | ⚠️ | ❌ | ❌ | `user_id = auth.uid()` |
| `pose_sessions` | UPDATE | ❌ | ⚠️ propias | ⚠️ | ❌ | ❌ | `user_id = auth.uid()` |
| `pose_sessions` | DELETE | ❌ | ⚠️ propias | ⚠️ | ❌ | ❌ | `user_id = auth.uid()` |
| `session_pose_results` | SELECT | ❌ | ⚠️ si sesión propia | ⚠️ | ⚠️ | ✅ | `session.user_id = auth.uid()` |
| `session_pose_results` | INSERT | ❌ | ⚠️ si sesión propia | ⚠️ | ❌ | ❌ | Trigger valida |
| `captures` | SELECT | ❌ | ⚠️ propias | ⚠️ | ⚠️ | ✅ | `user_id = auth.uid()` |
| `captures` | INSERT | ❌ | ⚠️ propias | ⚠️ | ❌ | ❌ | `user_id = auth.uid()` |
| `captures` | UPDATE | ❌ | ⚠️ propias (solo `is_favorite`) | ⚠️ | ❌ | ❌ | `user_id = auth.uid()` |
| `captures` | DELETE | ❌ | ⚠️ propias (soft delete) | ⚠️ | ❌ | ❌ | `user_id = auth.uid()` |
| `user_progress` | SELECT | ❌ | ⚠️ propias | ⚠️ | ⚠️ | ✅ | `user_id = auth.uid()` |
| `user_progress` | WRITE | ❌ | ❌ | ❌ | ❌ | ❌ | Solo triggers/Edge Function |
| `bug_reports` | SELECT | ❌ | ⚠️ propias | ⚠️ propias | ⚠️ todas | ✅ | `user_id = auth.uid()` o moderador+ |
| `bug_reports` | INSERT | ❌ | ✅ | ✅ | ✅ | ✅ | Anon si allow_anon=true; si no, `user_id = auth.uid()` |
| `bug_reports` | UPDATE | ❌ | ❌ | ❌ | ⚠️ status | ✅ | Solo moderador+ cambia status |
| `support_messages` | SELECT | ❌ | ⚠️ propias | ⚠️ propias | ✅ todas | ✅ | `user_id = auth.uid()` o moderador+ |
| `support_messages` | INSERT | ❌ | ✅ | ✅ | ✅ | ✅ | `user_id = auth.uid()` |
| `support_messages` | UPDATE | ❌ | ❌ | ❌ | ⚠️ status/assigned_to | ✅ | Solo moderador+ |

---

## 6. Pruebas negativas (tests de seguridad)

Antes de ir a producción, **TODAS** estas pruebas deben pasar (resultado: acceso denegado). Si una falla (acceso concedido), es un bug crítico.

### 6.1 Anónimo no puede leer datos privados

| # | Test | Cómo ejecutarlo | Resultado esperado |
|---|---|---|---|
| T1 | Anónimo lee `profiles` | `curl -H "apikey: $ANON" $URL/rest/v1/profiles?select=*` | `[]` (vacío) o 401 |
| T2 | Anónimo lee `entitlements` | `curl -H "apikey: $ANON" $URL/rest/v1/entitlements?select=*` | `[]` |
| T3 | Anónimo lee `purchases` | `curl .../purchases?select=*` | `[]` |
| T4 | Anónimo lee `pose_sessions` | `curl .../pose_sessions?select=*` | `[]` |
| T5 | Anónimo lee `captures` | `curl .../captures?select=*` | `[]` |
| T6 | Anónimo inserta en `entitlements` | `curl -X POST .../entitlements -d '{"user_id":"..."}'` | 401/403 |
| T7 | Anónimo inserta en `purchases` | POST a `/purchases` | 401/403 |
| T8 | Anónimo llama Edge Function `create-checkout` | POST sin Authorization | 401 |
| T9 | Anónimo lee `poses` con `visibility='private'` | `curl .../poses?visibility=eq.private` | `[]` |
| T10 | Anónimo lee `admin_audit_log` | `curl .../admin_audit_log` | `[]` |

### 6.2 Usuario A no puede leer datos de Usuario B

| # | Test | Cómo ejecutarlo | Resultado esperado |
|---|---|---|---|
| T11 | A lee `favorites` de B | Login como A, GET `/favorites?user_id=eq.<B-uuid>` | `[]` (RLS filtra) |
| T12 | A lee `pose_sessions` de B | GET `/pose_sessions?user_id=eq.<B-uuid>` | `[]` |
| T13 | A lee `captures` de B | GET `/captures?user_id=eq.<B-uuid>` | `[]` |
| T14 | A lee `entitlements` de B | GET `/entitlements?user_id=eq.<B-uuid>` | `[]` |
| T15 | A inserta `favorites` con `user_id` de B | POST `/favorites` con `user_id=B` | 403/42501 (RLS WITH CHECK falla) |
| T16 | A hace UPDATE del `profiles` de B | PATCH `/profiles?id=eq.<B-uuid>` | 0 filas afectadas |
| T17 | A llama Edge Function "conceder rol" suplantando a B | POST `/functions/v1/admin-grant-role` con `target_user_id=B` | 403 |

### 6.3 Creador solo edita sus propios drafts

| # | Test | Resultado esperado |
|---|---|---|
| T18 | Creador X hace UPDATE en `products` donde `creator_id = Y` (otro creador) | 0 filas afectadas |
| T19 | Creador X hace UPDATE en `products` propios con `publication_status='published'` | 0 filas (no se puede editar publicado directamente; debe ir por nueva versión) |
| T20 | Creador X inserta en `products` con `creator_id = Y` | 403 (RLS WITH CHECK falla) |
| T21 | Creador X cambia `publication_status` de `draft` a `published` directamente | 403 (requiere Edge Function) |
| T22 | Creador X inserta en `product_items` para un producto de creador Y | 403 |

### 6.4 Publicar requiere rol

| # | Test | Resultado esperado |
|---|---|---|
| T23 | Usuario con rol `usuario` llama a Edge Function `request-publication` | 403 |
| T24 | Usuario con rol `usuario` intenta cambiar `publication_status` vía REST | 0 filas o 403 |
| T25 | Creador cambia `publication_status` de `in_review` a `published` (solo moderador puede) | 0 filas |

### 6.5 Solo compradores con entitlement acceden a contenido pago

| # | Test | Resultado esperado |
|---|---|---|
| T26 | Usuario sin entitlement intenta leer `pose_versions` de un pack pagado via `product_items` | `[]` (RLS filtra) |
| T27 | Usuario con entitlement de producto X lee pose_versions de producto Y | `[]` |
| T28 | Usuario escribe review de producto que no compró | 403 (trigger valida) |
| T29 | Usuario con `entitlements.active=false` intenta acceder | `[]` |
| T30 | Usuario con `entitlements.ends_at` en el pasado intenta acceder | `[]` |

### 6.6 Solo admins hacen operaciones admin

| # | Test | Resultado esperado |
|---|---|---|
| T31 | Usuario `usuario` llama Edge Function `admin-grant-role` | 403 |
| T32 | Usuario `creador` llama `admin-grant-role` | 403 |
| T33 | Usuario `moderador` llama `admin-grant-role` (es solo admin) | 403 |
| T34 | Admin sin MFA (`aal1`) llama `admin-grant-role` | 403 |
| T35 | Admin con MFA (`aal2`) llama `admin-grant-role` | 200 OK |
| T36 | Usuario no-admin lee `admin_audit_log` | `[]` |
| T37 | Usuario no-admin hace UPDATE en `admin_audit_log` | 0 filas |
| T38 | Usuario no-admin hace DELETE en `admin_audit_log` | 0 filas |

### 6.7 La clave `anon` no puede bypassar RLS

| # | Test | Resultado esperado |
|---|---|---|
| T39 | Cabecera `apikey: <anon>` + INSERT en `user_roles` con `role='administrador'` | 403 (RLS niega INSERT) |
| T40 | Cabecera `apikey: <anon>` + UPDATE en `entitlements.active` | 0 filas |
| T41 | Cabecera `apikey: <anon>` + SELECT de `webhook_events` | `[]` |
| T42 | Cabecera `apikey: <anon>` + intenta hacer `SET ROLE postgres` | No aplica (no es función disponible vía REST) |

### 6.8 Las funciones admin usan `service_role` solo en servidor

| # | Test | Resultado esperado |
|---|---|---|
| T43 | Búsqueda en el código del frontend (`js/*.js`) de `service_role` | 0 resultados |
| T44 | Búsqueda en el código del frontend de `SUPABASE_SERVICE_ROLE` | 0 resultados |
| T45 | Edge Function expone `service_role` al cliente (vía response body o header) | Debe detectarse en code review |
| T46 | Logs de Edge Function contienen `service_role` | No deben; los logs solo registran acción, no secretos |
| T47 | Variable de entorno `SUPABASE_SERVICE_ROLE_KEY` está en el código | 0 resultados (debe estar solo en secrets de Supabase) |

> **Cómo automatizar T43-T47:** usar un step de CI que haga `grep -rni "service_role\|SUPABASE_SERVICE_ROLE" js/ index.html` y falle si encuentra algo. Ver `11-TESTING-AND-SECURITY-CHECKLIST.md`.

---

## 7. Patrones de políticas RLS por tabla

Las políticas completas están en `sql/002-rls.sql`. Aquí se documentan los patrones principales.

### 7.1 Patrón: "owner only" (lectura + escritura)

```sql
-- favorites: el usuario solo ve/edita las suyas
CREATE POLICY favorites_select_owner ON public.favorites
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY favorites_insert_owner ON public.favorites
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY favorites_delete_owner ON public.favorites
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());
```

### 7.2 Patrón: "público lectura, propietario escritura"

```sql
-- poses: visibilidad pública + privadas del dueño
CREATE POLICY poses_select_visible ON public.poses
    FOR SELECT TO authenticated, anon
    USING (
        (visibility = 'public' AND archived_at IS NULL)
        OR owner_id = auth.uid()
    );

CREATE POLICY poses_insert_owner ON public.poses
    FOR INSERT TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY poses_update_owner ON public.poses
    FOR UPDATE TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());
```

### 7.3 Patrón: "solo admin" (todas las operaciones)

```sql
-- admin_audit_log: solo admin lee; nadie escribe directamente (RLS niega)
CREATE POLICY admin_audit_log_select_admin ON public.admin_audit_log
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));
-- No se crea política INSERT/UPDATE/DELETE → RLS niega por defecto
-- La inserción se hace desde Edge Function con service_role (bypassa RLS)
```

### 7.4 Patrón: "hereda visibilidad del padre"

```sql
-- pose_versions: hereda de la pose padre
CREATE POLICY pose_versions_select_inherit ON public.pose_versions
    FOR SELECT TO authenticated, anon
    USING (
        EXISTS(
            SELECT 1 FROM public.poses p
            WHERE p.id = pose_versions.pose_id
              AND (
                  (p.visibility = 'public' AND p.archived_at IS NULL)
                  OR p.owner_id = auth.uid()
              )
        )
    );

CREATE POLICY pose_versions_insert_owner ON public.pose_versions
    FOR INSERT TO authenticated
    WITH CHECK (
        created_by = auth.uid()
        AND EXISTS(
            SELECT 1 FROM public.poses p
            WHERE p.id = pose_versions.pose_id
              AND p.owner_id = auth.uid()
        )
    );
```

### 7.5 Patrón: "inmutable después de insert"

```sql
-- pose_versions: NO política UPDATE ni DELETE → RLS niega
-- (No hay CREATE POLICY ... FOR UPDATE ni FOR DELETE)
```

### 7.6 Patrón: "compra congelada"

```sql
-- purchases: el usuario solo lee; nobody escribe por REST
CREATE POLICY purchases_select_owner ON public.purchases
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());
-- No hay política INSERT/UPDATE/DELETE → denegado
-- Las escrituras vienen del webhook handler (service_role)
```

### 7.7 Patrón: "comprador accede a pose_version pagada"

```sql
-- pose_versions: además del patrón 7.4, allow si el usuario tiene
-- entitlement que incluye esa pose_version vía purchases.snapshot_items
CREATE POLICY pose_versions_select_paid ON public.pose_versions
    FOR SELECT TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.purchases p
            WHERE p.user_id = auth.uid()
              AND p.refunded_at IS NULL
              AND p.snapshot_items @> jsonb_build_array(
                    jsonb_build_object('pose_version_id', pose_versions.id)
                  )
        )
    );
-- Esta política se combina (OR) con la del patrón 7.4
```

> ⚠️ El operador `@>` sobre `jsonb` requiere un índice GIN en `purchases.snapshot_items` para no degradar rendimiento. Añadir: `CREATE INDEX idx_purchases_snapshot_gin ON public.purchases USING GIN (snapshot_items);` (ver `002-rls.sql`).

---

## 8. Notas sobre seguridad operacional

### 8.1 Claves públicas vs secretas

| Clave | Dónde vive | Qué puede hacer |
|---|---|---|
| `supabase anon key` | En el código del navegador (pública) | Llamar a la API REST, sujeteta a RLS |
| `supabase service_role key` | Solo en secrets de Supabase Edge Functions | Bypassa RLS. **NUNCA** en el navegador. |
| `stripe publishable key` | En el código del navegador (pública) | Iniciar Checkout (no confirma pago) |
| `stripe secret key` | Solo en secrets de Supabase Edge Functions | Crear Checkout Sessions, capturar pagos, emitir reembolsos |
| `stripe webhook secret` | Solo en secrets de Supabase Edge Functions | Verificar firma de webhooks |

### 8.2 Rotación de claves

| Clave | Frecuencia | Motivo |
|---|---|---|
| `anon` / `publishable` | Solo si se filtra | Poco sensible |
| `service_role` | Cada 90 días o si se filtra | Crítica |
| `stripe secret key` | Cada 90 días o si se filtra | Crítica |
| `webhook secret` | Cada 90 días o si se filtra | Crítica |

> [VERIFICA: Supabase permite rotar `service_role` desde Dashboard → Project Settings → API → "Rotate service_role key". https://supabase.com/docs/guides/cli/config]

### 8.3 JWT y expiración

Supabase emite JWT con expiración de 1 hora por defecto. El SDK los refresca automáticamente. Pero:

- **No almacenes datos sensibles en el JWT.** El JWT es decodificable por el cliente (es solo Base64 firmado, no encriptado).
- **Verifica el JWT en el servidor** (Edge Function) usando `supabase.auth.getUser(jwt)` antes de confiar en `auth.uid()`.

### 8.4 CORS

| Campo | Valor |
|---|---|
| **Objetivo** | Limitar qué orígenes pueden llamar a la API |
| **Por qué se necesita** | Evitar abuso desde dominios no autorizados |
| **Dónde se ejecuta** | Supabase Dashboard → Project Settings → API → CORS |
| **Acción exacta** | Añadir a "Allowed origins":<br/>- `https://pillb.github.io` (GitHub Pages)<br/>- `http://localhost:8095` (dev local)<br/>- `https://<tu-dominio>` (producción) |
| **Resultado esperado** | Peticiones desde otros orígenes devuelven CORS error. |
| **Cómo verificar** | Desde una pestaña con otro dominio, intentar `fetch` a la API. |
| **Errores comunes** | - Olvidar `http://localhost:...` en dev → no funciona local.<br/>- Permitir `*` → cualquiera puede abusar (aunque RLS protege, expone superficie). |
| **Cómo revertir** | Quitar origins no deseados. |
| **Fuente oficial** | https://supabase.com/docs/guides/api#cors |

---

## 9. Procedimiento para añadir nuevas tablas

Cuando en el futuro añadas una tabla nueva:

1. **Definir la tabla en `001-schema.sql`** con todos sus constraints.
2. **Inmediatamente activar RLS** en `002-rls.sql`:
   ```sql
   ALTER TABLE public.<tabla> ENABLE ROW LEVEL SECURITY;
   ```
3. **Escribir políticas `PERMISSIVE` explícitas** para SELECT, INSERT, UPDATE, DELETE según la matriz de autorización.
4. **Si la tabla es de uso interno (admin/sistema)**, NO crear políticas. RLS deny-by-default la protege.
5. **Añadir pruebas negativas** en `11-TESTING-AND-SECURITY-CHECKLIST.md`.
6. **Ejecutar las pruebas negativas** antes de deploy.

> **Regla:** una tabla sin políticas `PERMISSIVE` no es un error, es el estado seguro. Solo se añaden políticas cuando se quiere permitir acceso.

---

## 10. Próximo paso

Abrir `sql/002-rls.sql` para ver el SQL ejecutable con todas las políticas, o `05-LOCAL-SETUP.md` para configurar Supabase CLI local.

---

## 11. Fuentes oficiales

| Recurso | URL |
|---|---|
| Supabase Auth | https://supabase.com/docs/guides/auth |
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security |
| Supabase MFA | https://supabase.com/docs/guides/auth/mfa |
| Supabase JWT | https://supabase.com/docs/learn/auth-deep-dive/auth-jwts |
| Supabase Edge Functions | https://supabase.com/docs/guides/functions |
| Supabase Auth helpers (JS vanilla) | https://supabase.com/docs/reference/javascript/installing |
| Postgres RLS reference | https://www.postgresql.org/docs/current/ddl-rowsecurity.html |
| Postgres policies | https://www.postgresql.org/docs/current/sql-createpolicy.html |
| Stripe webhook signatures | https://docs.stripe.com/webhooks/signatures |
| OWASP Auth Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html |
