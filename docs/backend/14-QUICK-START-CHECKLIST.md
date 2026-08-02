# 14 — QUICK START CHECKLIST

> **Propósito:** Una lista de verificación rápida para no perderte. Imprime esto o ábrelo en otra pestaña.

---

## Fase 1: Herramientas (30 min)

- [ ] Docker Desktop instalado y corriendo (`docker --version`)
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Supabase CLI instalado (`supabase --version`)
- [ ] Stripe CLI instalado (`stripe --version`)
- [ ] Git instalado (`git --version`)

> ¿Problemas? → `13-TROUBLESHOOTING-AND-FAQ.md` sección 1

---

## Fase 2: Cuentas (20 min)

- [ ] Cuenta de Supabase creada (https://supabase.com/dashboard)
- [ ] Proyecto de Supabase creado (plan Free)
- [ ] Cuenta de Stripe creada (https://dashboard.stripe.com)
- [ ] Stripe en modo test (verifica que dice "Test mode" en el dashboard)
- [ ] Cuenta de PostHog creada (https://app.posthog.com)
- [ ] Cuenta de Sentry creada (https://sentry.io)

---

## Fase 3: Configuración local (1 hora)

- [ ] `.env` creado desde `.env.example` con claves reales
- [ ] `.env` en `.gitignore` (verifica con `git status` — no debe aparecer)
- [ ] Supabase stack local corriendo (`supabase start`)
- [ ] `001-schema.sql` ejecutado (`supabase db reset` o SQL Editor del panel)
- [ ] `002-rls.sql` ejecutado
- [ ] `003-seed-development.sql` ejecutado
- [ ] Stripe webhook listener corriendo (`stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook`)
- [ ] Servidor estático corriendo (`python3 -m http.server 8095`)

> ¿Problemas? → `13-TROUBLESHOOTING-AND-FAQ.md` secciones 1, 3, 4

---

## Fase 4: Verificación de seguridad (30 min)

- [ ] `SUPABASE_SERVICE_ROLE_KEY` NO aparece en ningún archivo JS del navegador
  ```bash
  grep -r "service_role\|SERVICE_ROLE" js/ index.html
  # Debe devolver vacío
  ```
- [ ] `STRIPE_SECRET_KEY` NO aparece en ningún archivo JS del navegador
  ```bash
  grep -r "sk_test_\|sk_live_\|STRIPE_SECRET" js/ index.html
  # Debe devolver vacío
  ```
- [ ] RLS habilitada en todas las tablas
  ```sql
  SELECT relname, relrowsecurity FROM pg_class
  WHERE relname IN ('profiles','favorites','poses','tours','products','orders','entitlements')
  AND relrowsecurity = false;
  -- Debe devolver 0 filas
  ```
- [ ] Usuario A no puede leer datos del usuario B (prueba con 2 usuarios)
- [ ] Usuario no puede auto-asignarse Pro
  ```sql
  INSERT INTO entitlements (user_id, scope, source, active)
  VALUES ('tu-uuid', 'pro', 'manual', true);
  -- Debe fallar con "row-level security policy"
  ```
- [ ] Webhook rechazado con firma inválida
  ```bash
  stripe trigger checkout.session.completed
  # Con STRIPE_WEBHOOK_SECRET incorrecto → debe devolver 400
  ```

> ¿Problemas? → `11-TESTING-AND-SECURITY-CHECKLIST.md`

---

## Fase 5: Flujo de pago (30 min)

- [ ] Crear producto Pro Monthly en Stripe (test mode)
- [ ] Crear producto Pro Annual en Stripe (test mode)
- [ ] Copiar los Price IDs (`price_...`) a la Edge Function
- [ ] Usuario hace checkout con tarjeta `4242 4242 4242 4242`
- [ ] Webhook recibe `checkout.session.completed`
- [ ] Entitlement se crea en la base de datos
- [ ] Usuario ve "Pro activado" en la UI
- [ ] Usuario cancela desde Customer Portal
- [ ] Webhook recibe `customer.subscription.deleted`
- [ ] Entitlement se desactiva
- [ ] Usuario pierde acceso Pro

> ¿Problemas? → `13-TROUBLESHOOTING-AND-FAQ.md` sección 4

---

## Fase 6: Migración (30 min)

- [ ] Adaptador de datos implementado (`10-LOCALSTORAGE-MIGRATION.md`)
- [ ] Usuario con datos en localStorage puede migrar
- [ ] Después de migrar, datos aparecen en Supabase
- [ ] Datos NO se duplican al migrar dos veces
- [ ] Datos accesibles desde otro dispositivo tras login
- [ ] localStorage se conserva (no se borra automáticamente)

> ¿Problemas? → `13-TROUBLESHOOTING-AND-FAQ.md` sección 7

---

## Fase 7: Despliegue (1 hora)

- [ ] Variables de entorno configuradas en producción
- [ ] URL de redirección de Supabase Auth actualizada a producción
- [ ] URL de redirección de Stripe actualizada a producción
- [ ] CORS configurado en Supabase
- [ ] Webhook endpoint de Stripe configurado para producción
- [ ] HTTPS funcionando
- [ ] `404.html` creado para SPA routing en GitHub Pages

> ¿Problemas? → `13-TROUBLESHOOTING-AND-FAQ.md` secciones 5, 9

---

## ✅ Cuando todo esté verde

¡Felicidades! PoseArt ahora tiene:
- ✅ Registro y login reales
- ✅ Recuperación de contraseña
- ✅ Usuarios aislados (RLS)
- ✅ Suscripciones Pro con Stripe
- ✅ Compras de marketplace con verificación
- ✅ Sincronización entre dispositivos
- ✅ Analytics y error tracking
- ✅ Migración desde localStorage

**Próximos pasos opcionales:**
- OAuth social (Google, GitHub)
- Fotos en Storage privado (con consentimiento)
- Stripe Connect para pagar a creadores
- App móvil (PWA o nativa)
