-- =============================================================================
-- PoseArt — 003-seed-development.sql
-- =============================================================================
-- Propósito:
--   Poblar el proyecto Supabase de DESARROLLO con datos de prueba realistas
--   para que puedas verificar visualmente flujos de auth, RLS, marketplace,
--   sesiones, favoritos, tours y entitlements SIN tener que crear todo a mano.
--
-- Cuándo ejecutar:
--   - SÓLO en desarrollo local / proyecto de staging.
--   - NUNCA en producción. Si lo ejecutas en producción por error, usa el
--     bloque de limpieza (sección 99) para revertir.
--
-- Requisitos previos:
--   - Haber ejecutado `001-schema.sql` (crea tablas, tipos, triggers).
--   - Haber ejecutado `002-rls.sql` (activa RLS y políticas).
--   - Haber creado al menos 3 usuarios vía Supabase Auth (Auth → Users →
--     "Add user") y haber anotado sus UUIDs (ver sección 0 más abajo).
--
-- Idempotencia:
--   Todas las inserciones usan ON CONFLICT (pk) DO NOTHING o DO UPDATE, así
--   puedes ejecutar el script cuantas veces quieras sin duplicar filas.
--   Las inserciones con IDs autogenerados (gen_random_uuid) NO son
--   idempotentes por naturaleza; para esas filas, ejecuta primero el bloque
--   de limpieza (sección 99) si quieres re-correr el seed desde cero.
--
-- Convención de marcadores:
--   SUSTITUIR: <PON-AQUÍ-TU-VALOR>  → debes reemplazar antes de ejecutar.
--
-- Esquema de referencia:
--   Este script está alineado con `001-schema.sql` (commit del 2026-08-01).
--   Si `001-schema.sql` cambia (renombran columnas, añaden tablas), revisa
--   este script antes de ejecutarlo. Marca divergencias en
--   `docs/backend/SOURCE-LEDGER.md`.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Constantes de prueba
-- -----------------------------------------------------------------------------
-- Crea estos 3 usuarios en Supabase Auth (Dashboard → Authentication → Users
-- → "Add user"). Marca "Auto Confirm User" en los tres.
--   devuser@poseart.local    → rol: usuario
--   devadmin@poseart.local   → rol: administrador
--   devcreator@poseart.local → rol: creador  (también necesitará una fila en
--                                            creator_profiles para publicar
--                                            productos)
-- Contraseñas sugeridas para DEV (NO usar en producción):
--   devuser:    DevUser2026!
--   devadmin:   DevAdmin2026!
--   devcreator: DevCreator2026!
--
-- Reemplaza los UUIDs de abajo por los reales que te devuelva Supabase.
-- Si los dejas como están (00000...-001/002/003), el script corre pero las
-- filas no quedan vinculadas a usuarios autenticables (útil sólo para
-- probar aislamiento RLS, no para login).

SET app.dev_user_id    TO '00000000-0000-0000-0000-000000000001';
SET app.dev_admin_id   TO '00000000-0000-0000-0000-000000000002';
SET app.dev_creator_id TO '00000000-0000-0000-0000-000000000003';

-- NOTA: los SET de arriba duran lo que dura la sesión SQL. Si cierras el
-- SQL Editor y lo vuelves a abrir, tendrás que re-ejecutar los tres SET
-- antes de re-correr el resto del script.

-- -----------------------------------------------------------------------------
-- 1. Perfiles (tabla `profiles`)
-- -----------------------------------------------------------------------------
-- Nota: normalmente el trigger `handle_new_user` (definido en 001-schema.sql)
-- inserta automáticamente un perfil cuando se crea el usuario en auth.users.
-- Si creaste los usuarios con "Add user" del panel, ya tienen perfil. Este
-- bloque hace upsert por si acaso (p. ej. si el trigger falló).

INSERT INTO profiles (id, username, display_name, selected_goal, onboarding_completed, onboarding_completed_at, created_at)
VALUES
  (current_setting('app.dev_user_id', true)::uuid,
   'devuser', 'Dev User', 'figure', true, now() - interval '30 days', now() - interval '30 days'),
  (current_setting('app.dev_admin_id', true)::uuid,
   'devadmin', 'Dev Admin', 'portrait', true, now() - interval '60 days', now() - interval '60 days'),
  (current_setting('app.dev_creator_id', true)::uuid,
   'devcreator', 'Dev Creator', 'boudoir', true, now() - interval '45 days', now() - interval '45 days')
ON CONFLICT (id) DO UPDATE SET
  username              = EXCLUDED.username,
  display_name          = EXCLUDED.display_name,
  selected_goal         = EXCLUDED.selected_goal,
  onboarding_completed  = EXCLUDED.onboarding_completed,
  onboarding_completed_at = EXCLUDED.onboarding_completed_at;

-- -----------------------------------------------------------------------------
-- 2. Roles (tabla `user_roles`)
-- -----------------------------------------------------------------------------
INSERT INTO user_roles (user_id, role, granted_by, granted_at, reason)
VALUES
  (current_setting('app.dev_user_id', true)::uuid,
   'usuario', NULL, now() - interval '30 days', 'default role on signup'),
  (current_setting('app.dev_admin_id', true)::uuid,
   'administrador', current_setting('app.dev_admin_id', true)::uuid, now() - interval '60 days', 'self-granted in dev seed'),
  (current_setting('app.dev_creator_id', true)::uuid,
   'creador', current_setting('app.dev_admin_id', true)::uuid, now() - interval '45 days', 'creator onboarding completed')
ON CONFLICT (user_id) DO UPDATE SET
  role       = EXCLUDED.role,
  granted_by = EXCLUDED.granted_by,
  reason     = EXCLUDED.reason;

-- -----------------------------------------------------------------------------
-- 3. Perfil de creador (tabla `creator_profiles`)
-- -----------------------------------------------------------------------------
-- Necesario para que dev_creator pueda crear productos (FK products.creator_id
-- → creator_profiles.user_id).

INSERT INTO creator_profiles (user_id, creator_name, bio, verified_at, created_at)
VALUES
  (current_setting('app.dev_creator_id', true)::uuid,
   'Dev Creator Studio',
   'Estudio de pruebas para verificar el marketplace.',
   now() - interval '40 days',
   now() - interval '45 days')
ON CONFLICT (user_id) DO UPDATE SET
  creator_name = EXCLUDED.creator_name,
  bio          = EXCLUDED.bio;

-- -----------------------------------------------------------------------------
-- 4. Preferencias (tabla `user_preferences`)
-- -----------------------------------------------------------------------------
-- sensitivity en [0,1] (real); timer_seconds en [5,600].

INSERT INTO user_preferences (user_id, timer_seconds, sensitivity, auto_capture, show_skeleton_overlay, extra)
VALUES
  (current_setting('app.dev_user_id', true)::uuid,
   60, 0.5, true, true,  '{"overlay_mode":"ghost"}'::jsonb),
  (current_setting('app.dev_admin_id', true)::uuid,
   30, 0.8, false, true, '{"overlay_mode":"skeleton"}'::jsonb),
  (current_setting('app.dev_creator_id', true)::uuid,
   90, 0.2, true, false, '{"overlay_mode":"avatar"}'::jsonb)
ON CONFLICT (user_id) DO UPDATE SET
  timer_seconds         = EXCLUDED.timer_seconds,
  sensitivity           = EXCLUDED.sensitivity,
  auto_capture          = EXCLUDED.auto_capture,
  show_skeleton_overlay = EXCLUDED.show_skeleton_overlay,
  extra                 = EXCLUDED.extra;

-- -----------------------------------------------------------------------------
-- 5. Poses oficiales (tabla `poses` + `pose_versions`)
-- -----------------------------------------------------------------------------
-- En el esquema real, una pose es un "concepto" (fila en `poses`) más una
-- versión inmutable (fila en `pose_versions` con los joints). El campo
-- `poses.current_version_id` apunta a la versión activa.
--
-- owner_id NULL = oficial global.
-- Insertamos primero las poses (sin current_version_id), luego las versiones,
-- y por último actualizamos current_version_id.

INSERT INTO poses (id, slug, name, category, owner_id, visibility, created_at)
VALUES
  ('a0000000-0000-0000-0000-000000000101', 'standing-confidence', 'Standing Confidence', 'standing', NULL, 'public', now() - interval '90 days'),
  ('a0000000-0000-0000-0000-000000000102', 'hand-on-hip',        'Hand on Hip',         'standing', NULL, 'public', now() - interval '90 days'),
  ('a0000000-0000-0000-0000-000000000103', 'seated-casual',      'Seated Casual',       'seated',   NULL, 'public', now() - interval '90 days'),
  ('a0000000-0000-0000-0000-000000000104', 'wall-lean',          'Wall Lean',           'boudoir',  NULL, 'public', now() - interval '90 days'),
  ('a0000000-0000-0000-0000-000000000105', 'boudoir-classic',    'Boudoir Classic',     'boudoir',  NULL, 'public', now() - interval '90 days')
ON CONFLICT (id) DO UPDATE SET
  name       = EXCLUDED.name,
  category   = EXCLUDED.category,
  visibility = EXCLUDED.visibility;

-- pose_versions (referencia a poses + created_by admin)
INSERT INTO pose_versions (id, pose_id, version_number, joints, renderer_params, changelog, created_by, created_at)
VALUES
  ('b0000000-0000-0000-0000-000000000101', 'a0000000-0000-0000-0000-000000000101', 1,
   '{"spine":0,"neck":0,"shoulders_l":-15,"shoulders_r":-15,"elbows_l":10,"elbows_r":10,"hips_tilt":0,"globalTilt":0,"globalRoll":0,"globalTwist":0}'::jsonb,
   '{}'::jsonb, 'Initial seed', current_setting('app.dev_admin_id', true)::uuid, now() - interval '90 days'),
  ('b0000000-0000-0000-0000-000000000102', 'a0000000-0000-0000-0000-000000000102', 1,
   '{"spine":-5,"neck":0,"shoulders_l":-30,"shoulders_r":0,"elbows_l":0,"elbows_r":20,"hips_tilt":5,"globalTilt":0,"globalRoll":0,"globalTwist":0}'::jsonb,
   '{}'::jsonb, 'Initial seed', current_setting('app.dev_admin_id', true)::uuid, now() - interval '90 days'),
  ('b0000000-0000-0000-0000-000000000103', 'a0000000-0000-0000-0000-000000000103', 1,
   '{"spine":-10,"neck":5,"shoulders_l":-20,"shoulders_r":-20,"elbows_l":40,"elbows_r":40,"hips_tilt":80,"globalTilt":0,"globalRoll":0,"globalTwist":0}'::jsonb,
   '{}'::jsonb, 'Initial seed', current_setting('app.dev_admin_id', true)::uuid, now() - interval '90 days'),
  ('b0000000-0000-0000-0000-000000000104', 'a0000000-0000-0000-0000-000000000104', 1,
   '{"spine":-15,"neck":-5,"shoulders_l":-40,"shoulders_r":-10,"elbows_l":0,"elbows_r":30,"hips_tilt":-10,"globalTilt":-15,"globalRoll":0,"globalTwist":0}'::jsonb,
   '{}'::jsonb, 'Initial seed', current_setting('app.dev_admin_id', true)::uuid, now() - interval '90 days'),
  ('b0000000-0000-0000-0000-000000000105', 'a0000000-0000-0000-0000-000000000105', 1,
   '{"spine":-25,"neck":-10,"shoulders_l":-60,"shoulders_r":-90,"elbows_l":90,"elbows_r":45,"hips_tilt":40,"globalTilt":-20,"globalRoll":5,"globalTwist":-10}'::jsonb,
   '{}'::jsonb, 'Initial seed', current_setting('app.dev_admin_id', true)::uuid, now() - interval '90 days')
ON CONFLICT (id) DO NOTHING;

-- Cerrar dependencia circular: apuntar current_version_id a la versión creada.
UPDATE poses p
SET current_version_id = pv.id
FROM pose_versions pv
WHERE pv.pose_id = p.id
  AND pv.version_number = 1
  AND p.id IN ('a0000000-0000-0000-0000-000000000101',
               'a0000000-0000-0000-0000-000000000102',
               'a0000000-0000-0000-0000-000000000103',
               'a0000000-0000-0000-0000-000000000104',
               'a0000000-0000-0000-0000-000000000105');

-- -----------------------------------------------------------------------------
-- 6. Pose personal del dev_user (private)
-- -----------------------------------------------------------------------------
INSERT INTO poses (id, slug, name, category, owner_id, visibility, created_at)
VALUES
  ('a0000000-0000-0000-0000-000000000201', 'devuser-custom-pose', 'My Custom Pose', 'standing',
   current_setting('app.dev_user_id', true)::uuid, 'private', now() - interval '3 days')
ON CONFLICT (id) DO UPDATE SET
  name       = EXCLUDED.name,
  visibility = EXCLUDED.visibility;

INSERT INTO pose_versions (id, pose_id, version_number, joints, renderer_params, changelog, created_by, created_at)
VALUES
  ('b0000000-0000-0000-0000-000000000201', 'a0000000-0000-0000-0000-000000000201', 1,
   '{"spine":5,"neck":0,"shoulders_l":-20,"shoulders_r":-20,"elbows_l":30,"elbows_r":30,"hips_tilt":0,"globalTilt":0,"globalRoll":0,"globalTwist":0}'::jsonb,
   '{}'::jsonb, 'User-created', current_setting('app.dev_user_id', true)::uuid, now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

UPDATE poses SET current_version_id = 'b0000000-0000-0000-0000-000000000201'
WHERE id = 'a0000000-0000-0000-0000-000000000201' AND current_version_id IS NULL;

-- -----------------------------------------------------------------------------
-- 7. Favoritos del dev_user (tabla `favorites`)
-- -----------------------------------------------------------------------------
-- PK compuesta (user_id, pose_id). Reutiliza IDs de poses oficiales.

INSERT INTO favorites (user_id, pose_id, created_at)
VALUES
  (current_setting('app.dev_user_id', true)::uuid, 'a0000000-0000-0000-0000-000000000101', now() - interval '10 days'),
  (current_setting('app.dev_user_id', true)::uuid, 'a0000000-0000-0000-0000-000000000103', now() - interval '7 days'),
  (current_setting('app.dev_user_id', true)::uuid, 'a0000000-0000-0000-0000-000000000105', now() - interval '2 days')
ON CONFLICT (user_id, pose_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 8. Tour privado del dev_user (tablas `tours`, `tour_versions`, `tour_sections`, `tour_items`)
-- -----------------------------------------------------------------------------
INSERT INTO tours (id, slug, name, description, owner_id, visibility, created_at)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'devuser-warmup-tour', 'My Warm-up Tour',
   'Tour de prueba para verificar el motor de tours.',
   current_setting('app.dev_user_id', true)::uuid, 'private', now() - interval '5 days')
ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  visibility  = EXCLUDED.visibility;

INSERT INTO tour_versions (id, tour_id, version_number, changelog, created_by, created_at)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 1,
   'Initial seed', current_setting('app.dev_user_id', true)::uuid, now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

UPDATE tours SET current_version_id = 'd0000000-0000-0000-0000-000000000001'
WHERE id = 'c0000000-0000-0000-0000-000000000001' AND current_version_id IS NULL;

-- Secciones del tour
INSERT INTO tour_sections (id, tour_version_id, name, description, sort_order, created_at)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Warmup', NULL, 0, now() - interval '5 days'),
  ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Core',   NULL, 1, now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Items (referencian pose_versions, no poses)
INSERT INTO tour_items (tour_section_id, pose_version_id, sort_order, hold_seconds, created_at)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000101', 0, 30, now() - interval '5 days'),
  ('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000102', 1, 30, now() - interval '5 days'),
  ('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000103', 0, 45, now() - interval '5 days'),
  ('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000104', 1, 45, now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 9. Historial de sesiones (tabla `pose_sessions`)
-- -----------------------------------------------------------------------------
-- avg_score en [0,1]. duration_seconds >= 0.

INSERT INTO pose_sessions (id, user_id, tour_id, tour_version_id, started_at, ended_at, duration_seconds, captured_count, avg_score, created_at)
VALUES
  (gen_random_uuid(),
   current_setting('app.dev_user_id', true)::uuid,
   NULL, NULL,
   now() - interval '9 days',  now() - interval '9 days'  + interval '60 seconds',
   60, 4, 0.72, now() - interval '9 days'),
  (gen_random_uuid(),
   current_setting('app.dev_user_id', true)::uuid,
   NULL, NULL,
   now() - interval '6 days',  now() - interval '6 days'  + interval '90 seconds',
   90, 6, 0.81, now() - interval '6 days'),
  (gen_random_uuid(),
   current_setting('app.dev_user_id', true)::uuid,
   'c0000000-0000-0000-0000-000000000001',
   'd0000000-0000-0000-0000-000000000001',
   now() - interval '1 day',   now() - interval '1 day'   + interval '120 seconds',
   120, 8, 0.88, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 10. Progreso cacheado del dev_user (tabla `user_progress`)
-- -----------------------------------------------------------------------------
INSERT INTO user_progress (user_id, total_sessions, total_captures, total_minutes_practiced, current_streak_days, longest_streak_days, last_session_at, updated_at)
VALUES
  (current_setting('app.dev_user_id', true)::uuid, 3, 18, 4, 1, 5, now() - interval '1 day', now())
ON CONFLICT (user_id) DO UPDATE SET
  total_sessions          = EXCLUDED.total_sessions,
  total_captures          = EXCLUDED.total_captures,
  total_minutes_practiced = EXCLUDED.total_minutes_practiced,
  current_streak_days     = EXCLUDED.current_streak_days,
  longest_streak_days     = EXCLUDED.longest_streak_days,
  last_session_at         = EXCLUDED.last_session_at;

-- -----------------------------------------------------------------------------
-- 11. Productos del marketplace (tabla `products`)
-- -----------------------------------------------------------------------------
-- Réplica de los 6 seed packs documentados en `01-CURRENT-STATE-AUDIT.md`.
-- El admin publica los 6 oficiales; dev_creator publica uno en draft.
-- price_cents en enteros. currency 'USD' (3 chars).

INSERT INTO products (id, slug, creator_id, name, description, kind, price_cents, currency, stripe_price_id, publication_status, published_at, created_at)
VALUES
  ('f0000000-0000-0000-0000-000000000001',
   'mp-free-essentials',
   NULL, -- producto oficial, sin creator
   'Free Essentials',
   '12 poses standing para empezar.',
   'pack', 0, 'USD', NULL, 'published', now() - interval '90 days', now() - interval '90 days'),

  ('f0000000-0000-0000-0000-000000000002',
   'mp-boudoir-classic',
   NULL,
   'Boudoir Classic',
   'Set clásico de boudoir.',
   'pack', 499, 'USD', NULL, 'published', now() - interval '90 days', now() - interval '90 days'),

  ('f0000000-0000-0000-0000-000000000003',
   'mp-editorial-edge',
   NULL,
   'Editorial Edge',
   'Poses con ángulos editoriales.',
   'pack', 399, 'USD', NULL, 'published', now() - interval '90 days', now() - interval '90 days'),

  ('f0000000-0000-0000-0000-000000000004',
   'mp-fashion-runway',
   NULL,
   'Fashion Runway',
   'Poses de pasarela.',
   'pack', 299, 'USD', NULL, 'published', now() - interval '90 days', now() - interval '90 days'),

  ('f0000000-0000-0000-0000-000000000005',
   'mp-fineart-classical',
   NULL,
   'Fine Art Classical',
   'Poses inspiradas en pintura clásica.',
   'pack', 0, 'USD', NULL, 'published', now() - interval '90 days', now() - interval '90 days'),

  ('f0000000-0000-0000-0000-000000000006',
   'mp-couple-intimate',
   NULL,
   'Couple Intimate',
   'Poses para parejas.',
   'pack', 599, 'USD', NULL, 'published', now() - interval '90 days', now() - interval '90 days'),

  -- Producto del creador en estado draft
  ('f0000000-0000-0000-0000-000000000007',
   'mp-creator-test-01',
   current_setting('app.dev_creator_id', true)::uuid,
   'Creator Test Pack',
   'Pack de prueba publicado por un creador.',
   'pack', 199, 'USD', NULL, 'draft', NULL, now() - interval '2 days')
ON CONFLICT (id) DO UPDATE SET
  name                = EXCLUDED.name,
  description         = EXCLUDED.description,
  price_cents         = EXCLUDED.price_cents,
  currency            = EXCLUDED.currency,
  publication_status  = EXCLUDED.publication_status;

-- Items del primer pack (Free Essentials) — vincula 2 pose_versions oficiales.
INSERT INTO product_items (product_id, item_type, pose_version_id, tour_version_id, sort_order, created_at)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'pose_version', 'b0000000-0000-0000-0000-000000000101', NULL, 0, now() - interval '90 days'),
  ('f0000000-0000-0000-0000-000000000001', 'pose_version', 'b0000000-0000-0000-0000-000000000102', NULL, 1, now() - interval '90 days')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 12. Customer de Stripe para dev_user (tabla `billing_customers`)
-- -----------------------------------------------------------------------------
-- En producción lo crea el webhook o la Edge Function `create-checkout`.
-- Aquí lo sembramos para que las pruebas de webhook encuentren el customer.

INSERT INTO billing_customers (user_id, stripe_customer_id, created_at)
VALUES
  (current_setting('app.dev_user_id', true)::uuid,    'cus_test_devuser',    now() - interval '20 days'),
  (current_setting('app.dev_creator_id', true)::uuid, 'cus_test_devcreator', now() - interval '40 days')
ON CONFLICT (user_id) DO UPDATE SET
  stripe_customer_id = EXCLUDED.stripe_customer_id;

-- -----------------------------------------------------------------------------
-- 13. Orden + compra + entitlement (simulando un pago completado)
-- -----------------------------------------------------------------------------
-- En PRODUCCIÓN, estas filas las crea el webhook `checkout.session.completed`
-- verificado. Aquí las sembramos para que el dev_user tenga el pack boudoir
-- "comprado" y puedas probar el flujo de acceso sin pasar por Stripe.

INSERT INTO orders (id, user_id, stripe_checkout_session_id, stripe_payment_intent_id, status, currency, total_cents, paid_at, created_at)
VALUES
  ('11000000-0000-0000-0000-000000000001',
   current_setting('app.dev_user_id', true)::uuid,
   'cs_test_seed_devuser_boudoir',
   'pi_test_seed_devuser_boudoir',
   'paid', 'USD', 499, now() - interval '5 days', now() - interval '5 days')
ON CONFLICT (id) DO UPDATE SET
  status        = EXCLUDED.status,
  total_cents   = EXCLUDED.total_cents,
  paid_at       = EXCLUDED.paid_at;

INSERT INTO order_items (id, order_id, product_id, product_snapshot, price_cents, currency, created_at)
VALUES
  ('12000000-0000-0000-0000-000000000001',
   '11000000-0000-0000-0000-000000000001',
   'f0000000-0000-0000-0000-000000000002', -- mp-boudoir-classic
   '{"name":"Boudoir Classic","description":"Set clásico de boudoir.","cover_image_url":null}'::jsonb,
   499, 'USD', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO purchases (id, order_id, order_item_id, user_id, product_id, snapshot_items, price_cents, currency, purchased_at)
VALUES
  ('13000000-0000-0000-0000-000000000001',
   '11000000-0000-0000-0000-000000000001',
   '12000000-0000-0000-0000-000000000001',
   current_setting('app.dev_user_id', true)::uuid,
   'f0000000-0000-0000-0000-000000000002',
   '["b0000000-0000-0000-0000-000000000105"]'::jsonb, -- pose_versions incluidas
   499, 'USD', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Entitlements para el dev_user:
--   a) Free packs (source = 'admin_grant', scope = 'single_product')
--   b) Boudoir classic (source = 'purchase', scope = 'single_product', source_id = purchase)
--   c) Pro suscripción simulada (source = 'subscription', scope = 'all_pro_content')
INSERT INTO entitlements (id, user_id, source, source_id, product_id, scope, starts_at, ends_at, active, created_at)
VALUES
  ('14000000-0000-0000-0000-000000000001',
   current_setting('app.dev_user_id', true)::uuid,
   'admin_grant', NULL,
   'f0000000-0000-0000-0000-000000000001', -- mp-free-essentials
   'single_product', now() - interval '20 days', NULL, true, now() - interval '20 days'),

  ('14000000-0000-0000-0000-000000000002',
   current_setting('app.dev_user_id', true)::uuid,
   'admin_grant', NULL,
   'f0000000-0000-0000-0000-000000000005', -- mp-fineart-classical
   'single_product', now() - interval '15 days', NULL, true, now() - interval '15 days'),

  ('14000000-0000-0000-0000-000000000003',
   current_setting('app.dev_user_id', true)::uuid,
   'purchase', '13000000-0000-0000-0000-000000000001', -- FK lógica a purchases.id
   'f0000000-0000-0000-0000-000000000002', -- mp-boudoir-classic
   'single_product', now() - interval '5 days', NULL, true, now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Suscripción simulada para Pro
INSERT INTO subscriptions (id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, cancel_at_period_end, current_subscription_started_at, first_subscription_started_at, lifetime_subscribed_days, current_subscription_streak_days)
VALUES
  ('15000000-0000-0000-0000-000000000001',
   current_setting('app.dev_user_id', true)::uuid,
   'sub_test_devuser_pro',
   'price_test_pro_monthly',
   'active',
   now() - interval '5 days',
   now() + interval '25 days',
   false,
   now() - interval '5 days',
   now() - interval '5 days',
   5, 5)
ON CONFLICT (id) DO UPDATE SET
  status                       = EXCLUDED.status,
  current_period_end           = EXCLUDED.current_period_end,
  cancel_at_period_end         = EXCLUDED.cancel_at_period_end;

INSERT INTO entitlements (id, user_id, source, source_id, product_id, scope, starts_at, ends_at, active, created_at)
VALUES
  ('14000000-0000-0000-0000-000000000004',
   current_setting('app.dev_user_id', true)::uuid,
   'subscription',
   '15000000-0000-0000-0000-000000000001', -- FK lógica a subscriptions.id
   NULL,
   'all_pro_content',
   now() - interval '5 days',
   now() + interval '25 days',
   true,
   now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Evento de suscripción (append-only)
INSERT INTO subscription_events (id, subscription_id, stripe_event_id, event_type, effective_at, payload, created_at)
VALUES
  ('16000000-0000-0000-0000-000000000001',
   '15000000-0000-0000-0000-000000000001',
   'evt_test_seed_sub_created',
   'customer.subscription.created',
   now() - interval '5 days',
   '{"status":"active","price":"price_test_pro_monthly"}'::jsonb,
   now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 14. Reviews (tabla `reviews`)
-- -----------------------------------------------------------------------------
-- UNIQUE (product_id, user_id) → un usuario sólo review una vez por producto.
INSERT INTO reviews (id, product_id, user_id, rating, comment, created_at)
VALUES
  (gen_random_uuid(),
   'f0000000-0000-0000-0000-000000000001', -- mp-free-essentials
   current_setting('app.dev_user_id', true)::uuid,
   5, 'Perfecto para empezar.', now() - interval '10 days'),
  (gen_random_uuid(),
   'f0000000-0000-0000-0000-000000000002', -- mp-boudoir-classic
   current_setting('app.dev_user_id', true)::uuid,
   4, 'Muy buenas poses, faltan algunas avanzadas.', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 15. Bug reports (tabla `bug_reports`)
-- -----------------------------------------------------------------------------
-- `description` es NOT NULL. status CHECK en ('open','in_progress','resolved','wont_fix').
INSERT INTO bug_reports (id, user_id, pose_version_id, joints_snapshot, description, user_agent, app_version, status, created_at)
VALUES
  (gen_random_uuid(),
   current_setting('app.dev_user_id', true)::uuid,
   'b0000000-0000-0000-0000-000000000104', -- wall-lean version
   '{"spine":-15,"neck":-5}'::jsonb,
   'El codo derecho se ve torcido en la vista ¾.',
   'Mozilla/5.0 (dev seed)',
   '0.0.0-dev',
   'open',
   now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 16. Auditoría (tabla `admin_audit_log`)
-- -----------------------------------------------------------------------------
-- Sólo INSERT permitido. target_type es texto libre.
INSERT INTO admin_audit_log (id, actor_id, action, target_type, target_id, before, after, reason, ip, created_at)
VALUES
  (gen_random_uuid(),
   current_setting('app.dev_admin_id', true)::uuid,
   'seed.run',
   'schema',
   NULL,
   NULL,
   '{"script":"003-seed-development.sql","note":"manual seed"}'::jsonb,
   'Development seed',
   NULL,
   now())
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 17. Webhook events (tabla `webhook_events`) — sembrado para tests
-- -----------------------------------------------------------------------------
-- Útil para probar idempotencia: el webhook debería detectar este evento como
-- ya procesado y devolver 200 sin duplicar efectos.
INSERT INTO webhook_events (id, stripe_event_id, event_type, received_at, processed_at, status, payload, error)
VALUES
  (gen_random_uuid(),
   'evt_test_seed_devuser_boudoir',
   'checkout.session.completed',
   now() - interval '5 days',
   now() - interval '5 days',
   'processed',
   '{"id":"evt_test_seed_devuser_boudoir","type":"checkout.session.completed","data":{"object":{"id":"cs_test_seed_devuser_boudoir"}}}'::jsonb,
   NULL)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 99. Bloque de limpieza ( ejecutar SÓLO si necesites revertir el seed )
-- -----------------------------------------------------------------------------
-- DESCOMENTA para borrar los datos sembrados. NO borra usuarios de Supabase
-- Auth (eso se hace desde Dashboard → Authentication → Users).
/*
DELETE FROM webhook_events        WHERE stripe_event_id IN ('evt_test_seed_devuser_boudoir');
DELETE FROM admin_audit_log       WHERE action = 'seed.run';
DELETE FROM bug_reports           WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM reviews               WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM entitlements          WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM subscription_events   WHERE stripe_event_id = 'evt_test_seed_sub_created';
DELETE FROM subscriptions         WHERE stripe_subscription_id = 'sub_test_devuser_pro';
DELETE FROM purchases             WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM order_items           WHERE order_id IN (SELECT id FROM orders WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid));
DELETE FROM orders                WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM billing_customers     WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM product_items         WHERE product_id IN ('f0000000-0000-0000-0000-000000000001');
DELETE FROM products              WHERE id IN ('f0000000-0000-0000-0000-000000000001','f0000000-0000-0000-0000-000000000002','f0000000-0000-0000-0000-000000000003','f0000000-0000-0000-0000-000000000004','f0000000-0000-0000-0000-000000000005','f0000000-0000-0000-0000-000000000006','f0000000-0000-0000-0000-000000000007');
DELETE FROM tour_items            WHERE tour_section_id IN ('e0000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000002');
DELETE FROM tour_sections         WHERE id IN ('e0000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000002');
DELETE FROM tour_versions         WHERE id IN ('d0000000-0000-0000-0000-000000000001');
DELETE FROM tours                 WHERE id IN ('c0000000-0000-0000-0000-000000000001');
DELETE FROM pose_sessions         WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM user_progress         WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM favorites             WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM pose_versions         WHERE id LIKE 'b0000000-0000-0000-0000-%';
DELETE FROM poses                 WHERE id LIKE 'a0000000-0000-0000-0000-%';
DELETE FROM user_preferences      WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM creator_profiles      WHERE user_id = current_setting('app.dev_creator_id', true)::uuid;
DELETE FROM user_roles            WHERE user_id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
DELETE FROM profiles              WHERE id IN (current_setting('app.dev_user_id', true)::uuid, current_setting('app.dev_admin_id', true)::uuid, current_setting('app.dev_creator_id', true)::uuid);
*/

-- =============================================================================
-- Fin del script. Verifica con:
-- =============================================================================
-- SELECT 'profiles' AS t, count(*) FROM profiles
-- UNION ALL SELECT 'user_roles',         count(*) FROM user_roles
-- UNION ALL SELECT 'creator_profiles',   count(*) FROM creator_profiles
-- UNION ALL SELECT 'user_preferences',   count(*) FROM user_preferences
-- UNION ALL SELECT 'poses',              count(*) FROM poses
-- UNION ALL SELECT 'pose_versions',      count(*) FROM pose_versions
-- UNION ALL SELECT 'favorites',          count(*) FROM favorites
-- UNION ALL SELECT 'tours',              count(*) FROM tours
-- UNION ALL SELECT 'tour_sections',      count(*) FROM tour_sections
-- UNION ALL SELECT 'tour_items',         count(*) FROM tour_items
-- UNION ALL SELECT 'pose_sessions',      count(*) FROM pose_sessions
-- UNION ALL SELECT 'user_progress',      count(*) FROM user_progress
-- UNION ALL SELECT 'products',           count(*) FROM products
-- UNION ALL SELECT 'product_items',      count(*) FROM product_items
-- UNION ALL SELECT 'billing_customers',  count(*) FROM billing_customers
-- UNION ALL SELECT 'orders',             count(*) FROM orders
-- UNION ALL SELECT 'purchases',          count(*) FROM purchases
-- UNION ALL SELECT 'entitlements',       count(*) FROM entitlements
-- UNION ALL SELECT 'subscriptions',      count(*) FROM subscriptions
-- UNION ALL SELECT 'subscription_events',count(*) FROM subscription_events
-- UNION ALL SELECT 'reviews',            count(*) FROM reviews
-- UNION ALL SELECT 'bug_reports',        count(*) FROM bug_reports
-- UNION ALL SELECT 'admin_audit_log',    count(*) FROM admin_audit_log
-- UNION ALL SELECT 'webhook_events',     count(*) FROM webhook_events;
-- Valores esperados (mínimo):
--   profiles: 3, user_roles: 3, creator_profiles: 1, user_preferences: 3,
--   poses: 6, pose_versions: 6, favorites: 3, tours: 1, tour_sections: 2,
--   tour_items: 4, pose_sessions: 3, user_progress: 1, products: 7,
--   product_items: 2, billing_customers: 2, orders: 1, purchases: 1,
--   entitlements: 4, subscriptions: 1, subscription_events: 1, reviews: 2,
--   bug_reports: 1, admin_audit_log: 1, webhook_events: 1.
-- =============================================================================
