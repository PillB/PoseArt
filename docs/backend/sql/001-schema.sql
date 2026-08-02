-- =============================================================================
-- PoseArt — 001-schema.sql
-- =============================================================================
-- Propósito:
--   Definir el esquema completo de la base de datos PostgreSQL de PoseArt.
--   Este archivo crea TODAS las tablas, índices, constraints, triggers y
--   funciones auxiliares. Las políticas RLS viven en `002-rls.sql`.
--
-- Documentación de referencia:
--   - docs/backend/03-DATA-MODEL.md  (justificación de cada tabla)
--   - docs/backend/04-AUTH-AND-RLS.md (políticas de seguridad)
--
-- Orden de ejecución:
--   1. Este archivo (001-schema.sql)
--   2. 002-rls.sql
--   3. 003-seed-development.sql (solo en DEV)
--
-- Idempotencia:
--   Este archivo NO es idempotente. Se ejecuta UNA vez por base de datos.
--   Para re-ejecutar, dropea el esquema completo primero:
--     DROP SCHEMA public CASCADE; CREATE SCHEMA public;
--   (NO lo hagas en producción.)
--
-- Motor:
--   PostgreSQL 15+ (gestionado por Supabase).
--   Requiere la extensión pgcrypto para gen_random_uuid(). Supabase ya la
--   tiene habilitada por defecto; si no, ejecuta: CREATE EXTENSION IF NOT
--   EXISTS pgcrypto;
--
-- Convención de signos del renderer:
--   Ver docs/backend/03-DATA-MODEL.md apéndice A. Los campos `joints` se
--   guardan como JSON crudo sin reinterpretar signos.
-- =============================================================================

-- Aseguramos la extensión pgcrypto (gen_random_uuid).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- 0. Funciones auxiliares
-- =============================================================================

-- set_updated_at: actualiza updated_at = now() en cada UPDATE.
-- Se reutiliza en todas las tablas que tengan columna updated_at.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- 1. Identidad y acceso
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1.1 profiles
-- -----------------------------------------------------------------------------
-- Extiende auth.users con datos de la app. 1:1 con auth.users.
-- No incluye `role` (va en user_roles) ni `is_pro` (se deriva de entitlements).
CREATE TABLE public.profiles (
    id                    uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username              text        NOT NULL UNIQUE CHECK (char_length(username) BETWEEN 3 AND 32),
    display_name          text,
    avatar_url            text,
    selected_goal         text        CHECK (selected_goal IN ('figure','portrait','boudoir','fashion','couple','other')),
    onboarding_completed  boolean     NOT NULL DEFAULT false,
    onboarding_completed_at timestamptz,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger para auto-crear perfil al registrar usuario en auth.users.
-- Inserta con username = email (el usuario lo cambiará en onboarding).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        -- username temporal: parte local del email, truncado a 32 chars
        COALESCE(split_part(NEW.email, '@', 1), 'user' || replace(NEW.id::text, '-', '')),
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;

    -- Rol por defecto: usuario
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'usuario')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 1.2 user_roles
-- -----------------------------------------------------------------------------
-- Un rol por usuario en el MVP. Multirol se soporta añadiendo otra tabla en
-- el futuro; por ahora PK en user_id.
CREATE TABLE public.user_roles (
    user_id      uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role         text        NOT NULL CHECK (role IN ('usuario','creador','moderador','administrador')),
    granted_by   uuid        REFERENCES auth.users(id),
    granted_at   timestamptz NOT NULL DEFAULT now(),
    reason       text
);

CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- -----------------------------------------------------------------------------
-- 1.3 admin_audit_log
-- -----------------------------------------------------------------------------
-- Tabla inmutable de auditoría. Solo INSERT, nunca UPDATE/DELETE (forzado por RLS).
CREATE TABLE public.admin_audit_log (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id     uuid        NOT NULL REFERENCES auth.users(id),
    action       text        NOT NULL,
    target_type  text        NOT NULL,
    target_id    uuid,
    before       jsonb,
    after        jsonb,
    reason       text,
    ip           inet,
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_log_actor ON public.admin_audit_log(actor_id, created_at DESC);
CREATE INDEX idx_admin_audit_log_target ON public.admin_audit_log(target_type, target_id);

-- =============================================================================
-- 2. Facturación y suscripciones
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 2.1 billing_customers
-- -----------------------------------------------------------------------------
CREATE TABLE public.billing_customers (
    user_id              uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id   text        NOT NULL UNIQUE,
    created_at           timestamptz NOT NULL DEFAULT now(),
    updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_billing_customers_set_updated_at
    BEFORE UPDATE ON public.billing_customers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_billing_customers_stripe ON public.billing_customers(stripe_customer_id);

-- -----------------------------------------------------------------------------
-- 2.2 subscriptions
-- -----------------------------------------------------------------------------
-- Estado ACTUAL de la suscripción. Es cache derivado de subscription_events.
-- Los campos first_subscription_started_at y lifetime_subscribed_days se
-- conservan incluso si la suscripción se cancela.
CREATE TABLE public.subscriptions (
    id                                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id            text        NOT NULL UNIQUE,
    stripe_price_id                   text        NOT NULL,
    status                            text        NOT NULL CHECK (status IN ('active','past_due','canceled','paused','trialing')),
    current_period_start              timestamptz NOT NULL,
    current_period_end                timestamptz NOT NULL,
    cancel_at_period_end              boolean     NOT NULL DEFAULT false,
    canceled_at                       timestamptz,
    -- Cache derivado de subscription_events (ver 03-DATA-MODEL.md §4):
    current_subscription_started_at   timestamptz NOT NULL,
    first_subscription_started_at     timestamptz,
    lifetime_subscribed_days          integer     NOT NULL DEFAULT 0 CHECK (lifetime_subscribed_days >= 0),
    current_subscription_streak_days  integer     NOT NULL DEFAULT 0 CHECK (current_subscription_streak_days >= 0),
    created_at                        timestamptz NOT NULL DEFAULT now(),
    updated_at                        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_subscriptions_set_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- -----------------------------------------------------------------------------
-- 2.3 subscription_events
-- -----------------------------------------------------------------------------
-- Append-only. Es la FUENTE DE VERDAD para reconstruir subscriptions.
CREATE TABLE public.subscription_events (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id       uuid        NOT NULL REFERENCES public.subscriptions(id) ON DELETE RESTRICT,
    stripe_event_id       text        NOT NULL UNIQUE,
    event_type            text        NOT NULL,
    effective_at          timestamptz NOT NULL,
    payload               jsonb       NOT NULL,
    created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscription_events_sub ON public.subscription_events(subscription_id, effective_at);
CREATE INDEX idx_subscription_events_type ON public.subscription_events(event_type);

-- -----------------------------------------------------------------------------
-- 2.4 invoices
-- -----------------------------------------------------------------------------
CREATE TABLE public.invoices (
    id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_invoice_id        text        NOT NULL UNIQUE,
    stripe_subscription_id   text,
    amount_due               integer     NOT NULL,
    currency                 text        NOT NULL CHECK (char_length(currency) = 3),
    status                   text        NOT NULL CHECK (status IN ('draft','open','paid','uncollectible','void')),
    paid_at                  timestamptz,
    hosted_invoice_url       text,
    created_at               timestamptz NOT NULL DEFAULT now(),
    updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_invoices_set_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_invoices_user ON public.invoices(user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 2.5 payment_events
-- -----------------------------------------------------------------------------
CREATE TABLE public.payment_events (
    id                          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_event_id             text        NOT NULL UNIQUE,
    stripe_payment_intent_id    text,
    stripe_charge_id            text,
    event_type                  text        NOT NULL,
    amount                      integer     NOT NULL,
    currency                    text        NOT NULL CHECK (char_length(currency) = 3),
    status                      text        NOT NULL,
    payload                     jsonb       NOT NULL,
    created_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_events_user ON public.payment_events(user_id, created_at DESC);
CREATE INDEX idx_payment_events_type ON public.payment_events(event_type);

-- -----------------------------------------------------------------------------
-- 2.6 webhook_events
-- -----------------------------------------------------------------------------
-- Tabla de idempotencia. Una fila por evento de Stripe recibido.
CREATE TABLE public.webhook_events (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id       text        NOT NULL UNIQUE,
    event_type            text        NOT NULL,
    received_at           timestamptz NOT NULL DEFAULT now(),
    processed_at          timestamptz,
    status                text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processed','failed','ignored')),
    payload               jsonb       NOT NULL,
    error                 text
);

CREATE INDEX idx_webhook_events_status ON public.webhook_events(status, received_at);

-- (entitlements se define más abajo, en sección 5.6, porque referencia products)
-- Mientras tanto, continúa con poses.

-- =============================================================================
-- 3. Contenido: poses
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 3.1 poses
-- -----------------------------------------------------------------------------
-- "Concepto" de una pose. Metadatos + puntero a versión actual.
-- owner_id NULL = oficial global. owner_id = X = privada de X.
CREATE TABLE public.poses (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                  text        NOT NULL UNIQUE,
    name                  text        NOT NULL,
    category              text        NOT NULL CHECK (category IN ('standing','seated','lying','boudoir','fashion','couple','other')),
    owner_id              uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
    visibility            text        NOT NULL DEFAULT 'private' CHECK (visibility IN ('public','private')),
    current_version_id    uuid,        -- FK a pose_versions(id) se añade más abajo (dependencia circular)
    archived_at           timestamptz,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_poses_set_updated_at
    BEFORE UPDATE ON public.poses
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_poses_visibility_owner ON public.poses(visibility, owner_id);
CREATE INDEX idx_poses_owner ON public.poses(owner_id);
CREATE INDEX idx_poses_category ON public.poses(category) WHERE archived_at IS NULL;

-- -----------------------------------------------------------------------------
-- 3.2 pose_versions
-- -----------------------------------------------------------------------------
-- Append-only. Una vez creada, INMUTABLE (RLS niega UPDATE/DELETE).
-- Las compras referencian pose_versions.id, no poses.id.
CREATE TABLE public.pose_versions (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    pose_id           uuid        NOT NULL REFERENCES public.poses(id) ON DELETE CASCADE,
    version_number    integer     NOT NULL,
    joints            jsonb       NOT NULL,
    renderer_params   jsonb       NOT NULL DEFAULT '{}'::jsonb,
    changelog         text,
    created_by        uuid        NOT NULL REFERENCES auth.users(id),
    created_at        timestamptz NOT NULL DEFAULT now(),
    UNIQUE (pose_id, version_number)
);

CREATE INDEX idx_pose_versions_pose ON public.pose_versions(pose_id, version_number DESC);

-- Cerramos la dependencia circular: poses.current_version_id → pose_versions.id
ALTER TABLE public.poses
    ADD CONSTRAINT fk_poses_current_version
    FOREIGN KEY (current_version_id) REFERENCES public.pose_versions(id) ON DELETE SET NULL;

-- =============================================================================
-- 4. Contenido: tours
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 4.1 tours
-- -----------------------------------------------------------------------------
CREATE TABLE public.tours (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                  text        NOT NULL UNIQUE,
    name                  text        NOT NULL,
    description           text,
    owner_id              uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
    visibility            text        NOT NULL DEFAULT 'private' CHECK (visibility IN ('public','private')),
    current_version_id    uuid,        -- FK a tour_versions(id) se añade más abajo
    archived_at           timestamptz,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_tours_set_updated_at
    BEFORE UPDATE ON public.tours
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_tours_visibility_owner ON public.tours(visibility, owner_id);
CREATE INDEX idx_tours_owner ON public.tours(owner_id);

-- -----------------------------------------------------------------------------
-- 4.2 tour_versions
-- -----------------------------------------------------------------------------
CREATE TABLE public.tour_versions (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id         uuid        NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
    version_number  integer     NOT NULL,
    changelog       text,
    created_by      uuid        NOT NULL REFERENCES auth.users(id),
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tour_id, version_number)
);

CREATE INDEX idx_tour_versions_tour ON public.tour_versions(tour_id, version_number DESC);

ALTER TABLE public.tours
    ADD CONSTRAINT fk_tours_current_version
    FOREIGN KEY (current_version_id) REFERENCES public.tour_versions(id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- 4.3 tour_sections
-- -----------------------------------------------------------------------------
CREATE TABLE public.tour_sections (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_version_id   uuid        NOT NULL REFERENCES public.tour_versions(id) ON DELETE CASCADE,
    name              text        NOT NULL,
    description       text,
    sort_order        integer     NOT NULL DEFAULT 0,
    created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tour_sections_version ON public.tour_sections(tour_version_id, sort_order);

-- -----------------------------------------------------------------------------
-- 4.4 tour_items
-- -----------------------------------------------------------------------------
-- Referencia pose_versions.id (NO poses.id). ON DELETE RESTRICT: no borrar
-- versión de pose si se usa en un tour (protege integridad de tours comprados).
CREATE TABLE public.tour_items (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_section_id   uuid        NOT NULL REFERENCES public.tour_sections(id) ON DELETE CASCADE,
    pose_version_id   uuid        NOT NULL REFERENCES public.pose_versions(id) ON DELETE RESTRICT,
    sort_order        integer     NOT NULL DEFAULT 0,
    hold_seconds      integer     CHECK (hold_seconds IS NULL OR hold_seconds > 0),
    created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tour_items_section ON public.tour_items(tour_section_id, sort_order);

-- =============================================================================
-- 5. Marketplace
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 5.1 creator_profiles
-- -----------------------------------------------------------------------------
CREATE TABLE public.creator_profiles (
    user_id        uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    creator_name   text        NOT NULL UNIQUE,
    bio            text,
    avatar_url     text,
    links          jsonb       NOT NULL DEFAULT '[]'::jsonb,
    verified_at    timestamptz,
    archived_at    timestamptz,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_creator_profiles_set_updated_at
    BEFORE UPDATE ON public.creator_profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 5.2 products
-- -----------------------------------------------------------------------------
CREATE TABLE public.products (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                text        NOT NULL UNIQUE,
    creator_id          uuid        REFERENCES public.creator_profiles(user_id) ON DELETE SET NULL,
    name                text        NOT NULL,
    description         text,
    kind                text        NOT NULL CHECK (kind IN ('pack','tour','subscription')),
    price_cents         integer     NOT NULL CHECK (price_cents >= 0),
    currency            text        NOT NULL DEFAULT 'USD' CHECK (char_length(currency) = 3),
    stripe_price_id     text,
    publication_status  text        NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft','in_review','published','rejected','archived')),
    published_at        timestamptz,
    archived_at         timestamptz,
    cover_image_url     text,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_products_set_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_products_status_kind ON public.products(publication_status, kind) WHERE archived_at IS NULL;
CREATE INDEX idx_products_creator ON public.products(creator_id);

-- -----------------------------------------------------------------------------
-- 5.3 product_items
-- -----------------------------------------------------------------------------
-- Referencias a versiones concretas (pose_versions o tour_versions).
-- CHECK constraint garantiza que solo uno de los dos FK es no-NULL según item_type.
CREATE TABLE public.product_items (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id        uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    item_type         text        NOT NULL CHECK (item_type IN ('pose_version','tour_version')),
    pose_version_id   uuid        REFERENCES public.pose_versions(id) ON DELETE RESTRICT,
    tour_version_id   uuid        REFERENCES public.tour_versions(id) ON DELETE RESTRICT,
    sort_order        integer     NOT NULL DEFAULT 0,
    created_at        timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT chk_product_item_type_fk CHECK (
        (item_type = 'pose_version'  AND pose_version_id IS NOT NULL AND tour_version_id IS NULL) OR
        (item_type = 'tour_version'  AND tour_version_id IS NOT NULL AND pose_version_id IS NULL)
    )
);

CREATE INDEX idx_product_items_product ON public.product_items(product_id, sort_order);
CREATE INDEX idx_product_items_pose_version ON public.product_items(pose_version_id);
CREATE INDEX idx_product_items_tour_version ON public.product_items(tour_version_id);

-- -----------------------------------------------------------------------------
-- 5.4 product_publications
-- -----------------------------------------------------------------------------
-- Histórico de transiciones de publication_status.
CREATE TABLE public.product_publications (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id   uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    from_status  text        NOT NULL,
    to_status    text        NOT NULL,
    actor_id     uuid        NOT NULL REFERENCES auth.users(id),
    actor_role   text        NOT NULL,
    notes        text,
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_publications_product ON public.product_publications(product_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 5.5 reviews
-- -----------------------------------------------------------------------------
CREATE TABLE public.reviews (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id   uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating       smallint    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment      text,
    hidden_at    timestamptz,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    UNIQUE (product_id, user_id)
);

CREATE TRIGGER trg_reviews_set_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_reviews_product ON public.reviews(product_id) WHERE hidden_at IS NULL;

-- -----------------------------------------------------------------------------
-- 5.6 entitlements
-- -----------------------------------------------------------------------------
-- ESTA es la tabla que la app consulta para saber si el usuario es Pro o si
-- tiene acceso a un producto concreto. Se define aquí porque referencia
-- products(id). Las FK a subscriptions.id y purchases.id son lógicas (no se
-- materializan con CONSTRAINT porque source_id apunta a una u otra según
-- el valor de source).
CREATE TABLE public.entitlements (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source        text        NOT NULL CHECK (source IN ('subscription','purchase','gift','admin_grant')),
    source_id     uuid,        -- FK lógica (subscriptions.id o purchases.id)
    product_id    uuid        REFERENCES public.products(id),
    scope         text        NOT NULL CHECK (scope IN ('all_pro_content','single_product','creator_catalog')),
    starts_at     timestamptz NOT NULL DEFAULT now(),
    ends_at       timestamptz,
    active        boolean     NOT NULL DEFAULT true,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_entitlements_set_updated_at
    BEFORE UPDATE ON public.entitlements
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_entitlements_user_active ON public.entitlements(user_id, active);
CREATE INDEX idx_entitlements_user_product ON public.entitlements(user_id, product_id, active);
CREATE INDEX idx_entitlements_active_ends ON public.entitlements(active, ends_at);

-- =============================================================================
-- 6. Comercio
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 6.1 orders
-- -----------------------------------------------------------------------------
CREATE TABLE public.orders (
    id                            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_checkout_session_id    text        NOT NULL UNIQUE,
    stripe_payment_intent_id      text,
    status                        text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded','partially_refunded')),
    currency                      text        NOT NULL CHECK (char_length(currency) = 3),
    total_cents                   integer     NOT NULL CHECK (total_cents >= 0),
    paid_at                       timestamptz,
    created_at                    timestamptz NOT NULL DEFAULT now(),
    updated_at                    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_orders_set_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX idx_orders_user_created ON public.orders(user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 6.2 order_items
-- -----------------------------------------------------------------------------
-- product_snapshot congela metadatos visibles (name, description, cover) en
-- el momento de compra para que el histórico no cambie si el creador edita.
CREATE TABLE public.order_items (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id          uuid        NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id        uuid        NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_snapshot  jsonb       NOT NULL,
    price_cents       integer     NOT NULL CHECK (price_cents >= 0),
    currency          text        NOT NULL CHECK (char_length(currency) = 3),
    created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

-- -----------------------------------------------------------------------------
-- 6.3 purchases
-- -----------------------------------------------------------------------------
-- Una compra = un order_item que llegó a status='paid'.
-- snapshot_items congela los IDs exactos de pose_versions/tour_versions que
-- el usuario compró. Es el contrato de compra.
CREATE TABLE public.purchases (
    id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                 uuid        NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    order_item_id            uuid        NOT NULL UNIQUE REFERENCES public.order_items(id) ON DELETE RESTRICT,
    user_id                  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id               uuid        NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    snapshot_items           jsonb       NOT NULL,
    price_cents              integer     NOT NULL CHECK (price_cents >= 0),
    currency                 text        NOT NULL CHECK (char_length(currency) = 3),
    purchased_at             timestamptz NOT NULL DEFAULT now(),
    refunded_at              timestamptz,
    refunded_amount_cents    integer     NOT NULL DEFAULT 0 CHECK (refunded_amount_cents >= 0)
);

CREATE INDEX idx_purchases_user ON public.purchases(user_id, purchased_at DESC);
CREATE INDEX idx_purchases_user_product ON public.purchases(user_id, product_id);
CREATE INDEX idx_purchases_product ON public.purchases(product_id);

-- -----------------------------------------------------------------------------
-- 6.4 refunds
-- -----------------------------------------------------------------------------
CREATE TABLE public.refunds (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id         uuid        NOT NULL REFERENCES public.purchases(id) ON DELETE RESTRICT,
    user_id             uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_cents        integer     NOT NULL CHECK (amount_cents > 0),
    currency            text        NOT NULL CHECK (char_length(currency) = 3),
    reason              text,
    stripe_refund_id    text        NOT NULL UNIQUE,
    refunded_by         uuid        NOT NULL REFERENCES auth.users(id),
    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_refunds_purchase ON public.refunds(purchase_id);
CREATE INDEX idx_refunds_user ON public.refunds(user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 6.5 creator_earnings (DEFINIDO PERO NO IMPLEMENTADO EN MVP)
-- -----------------------------------------------------------------------------
-- Esta tabla se documenta en 03-DATA-MODEL.md §3.5.5 pero NO se crea en MVP.
-- Requiere Stripe Connect (onboarding KYC de creadores, obligaciones fiscales).
-- Cuando se implemente, descomentar el bloque siguiente y añadir RLS en 002-rls.sql.
--
-- CREATE TABLE public.creator_earnings (
--     id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
--     purchase_id              uuid        NOT NULL REFERENCES public.purchases(id) ON DELETE RESTRICT,
--     creator_id               uuid        NOT NULL REFERENCES public.creator_profiles(user_id) ON DELETE CASCADE,
--     gross_cents              integer     NOT NULL,
--     platform_fee_cents       integer     NOT NULL,
--     creator_earnings_cents   integer     NOT NULL,
--     currency                 text        NOT NULL CHECK (char_length(currency) = 3),
--     status                   text        NOT NULL DEFAULT 'accruing' CHECK (status IN ('accruing','due','paid','canceled')),
--     paid_at                  timestamptz,
--     created_at               timestamptz NOT NULL DEFAULT now()
-- );
-- CREATE INDEX idx_creator_earnings_creator ON public.creator_earnings(creator_id, status);
-- CREATE INDEX idx_creator_earnings_purchase ON public.creator_earnings(purchase_id);

-- =============================================================================
-- 7. Datos de usuario
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 7.1 favorites
-- -----------------------------------------------------------------------------
-- PK compuesta (user_id, pose_id): una fila por par.
CREATE TABLE public.favorites (
    user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pose_id     uuid        NOT NULL REFERENCES public.poses(id) ON DELETE CASCADE,
    created_at  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, pose_id)
);

CREATE INDEX idx_favorites_pose ON public.favorites(pose_id);

-- -----------------------------------------------------------------------------
-- 7.2 user_preferences
-- -----------------------------------------------------------------------------
-- Reemplaza poseart_sessionOptions del localStorage.
CREATE TABLE public.user_preferences (
    user_id                uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    timer_seconds          integer     CHECK (timer_seconds IS NULL OR (timer_seconds BETWEEN 5 AND 600)),
    sensitivity            real        CHECK (sensitivity IS NULL OR (sensitivity BETWEEN 0 AND 1)),
    auto_capture           boolean     NOT NULL DEFAULT false,
    show_skeleton_overlay  boolean     NOT NULL DEFAULT true,
    extra                  jsonb       NOT NULL DEFAULT '{}'::jsonb,
    updated_at             timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_user_preferences_set_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 7.3 pose_sessions
-- -----------------------------------------------------------------------------
CREATE TABLE public.pose_sessions (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tour_id           uuid        REFERENCES public.tours(id) ON DELETE SET NULL,
    tour_version_id   uuid        REFERENCES public.tour_versions(id) ON DELETE SET NULL,
    started_at        timestamptz NOT NULL DEFAULT now(),
    ended_at          timestamptz,
    duration_seconds  integer     CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    captured_count    integer     NOT NULL DEFAULT 0 CHECK (captured_count >= 0),
    avg_score         real        CHECK (avg_score IS NULL OR (avg_score BETWEEN 0 AND 1)),
    created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pose_sessions_user_started ON public.pose_sessions(user_id, started_at DESC);
CREATE INDEX idx_pose_sessions_tour ON public.pose_sessions(tour_id);

-- -----------------------------------------------------------------------------
-- 7.4 session_pose_results
-- -----------------------------------------------------------------------------
CREATE TABLE public.session_pose_results (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id        uuid        NOT NULL REFERENCES public.pose_sessions(id) ON DELETE CASCADE,
    pose_version_id   uuid        NOT NULL REFERENCES public.pose_versions(id) ON DELETE RESTRICT,
    score             real        CHECK (score IS NULL OR (score BETWEEN 0 AND 1)),
    duration_seconds  integer     CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    attempted_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_results_session ON public.session_pose_results(session_id, attempted_at);
CREATE INDEX idx_session_results_pose_version ON public.session_pose_results(pose_version_id);

-- -----------------------------------------------------------------------------
-- 7.5 captures
-- -----------------------------------------------------------------------------
-- Metadatos de fotos. La foto misma puede ir a Storage privado (storage_path)
-- o quedarse en localStorage (storage_path IS NULL, modo legacy).
CREATE TABLE public.captures (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id        uuid        REFERENCES public.pose_sessions(id) ON DELETE SET NULL,
    pose_version_id   uuid        NOT NULL REFERENCES public.pose_versions(id) ON DELETE RESTRICT,
    storage_path      text,
    is_favorite       boolean     NOT NULL DEFAULT false,
    filters           jsonb       NOT NULL DEFAULT '{}'::jsonb,
    score             real        CHECK (score IS NULL OR (score BETWEEN 0 AND 1)),
    captured_at       timestamptz NOT NULL DEFAULT now(),
    deleted_at        timestamptz
);

CREATE INDEX idx_captures_user_captured ON public.captures(user_id, captured_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_captures_session ON public.captures(session_id);

-- -----------------------------------------------------------------------------
-- 7.6 user_progress
-- -----------------------------------------------------------------------------
-- Agregados cacheados. Reconstruible desde pose_sessions.
CREATE TABLE public.user_progress (
    user_id                  uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_sessions           integer     NOT NULL DEFAULT 0 CHECK (total_sessions >= 0),
    total_captures           integer     NOT NULL DEFAULT 0 CHECK (total_captures >= 0),
    total_minutes_practiced  integer     NOT NULL DEFAULT 0 CHECK (total_minutes_practiced >= 0),
    current_streak_days      integer     NOT NULL DEFAULT 0 CHECK (current_streak_days >= 0),
    longest_streak_days      integer     NOT NULL DEFAULT 0 CHECK (longest_streak_days >= 0),
    last_session_at          timestamptz,
    updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_user_progress_set_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 7.7 bug_reports
-- -----------------------------------------------------------------------------
CREATE TABLE public.bug_reports (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
    pose_version_id   uuid        REFERENCES public.pose_versions(id) ON DELETE SET NULL,
    joints_snapshot   jsonb,
    description       text        NOT NULL,
    user_agent        text,
    app_version       text,
    status            text        NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','wont_fix')),
    created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bug_reports_status ON public.bug_reports(status, created_at DESC);
CREATE INDEX idx_bug_reports_user ON public.bug_reports(user_id);

-- -----------------------------------------------------------------------------
-- 7.8 support_messages
-- -----------------------------------------------------------------------------
CREATE TABLE public.support_messages (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject      text        NOT NULL,
    body         text        NOT NULL,
    category     text        CHECK (category IN ('billing','bug','feature_request','other')),
    status       text        NOT NULL DEFAULT 'open' CHECK (status IN ('open','answered','closed')),
    assigned_to  uuid        REFERENCES auth.users(id),
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_support_messages_set_updated_at
    BEFORE UPDATE ON public.support_messages
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_support_messages_status ON public.support_messages(status, created_at DESC);
CREATE INDEX idx_support_messages_user ON public.support_messages(user_id, created_at DESC);

-- =============================================================================
-- 8. Comentarios finales
-- =============================================================================
-- - Este archivo NO activa RLS. RLS está en 002-rls.sql.
-- - Este archivo NO inserta datos. Seed está en 003-seed-development.sql.
-- - La tabla creator_earnings se deja comentada (MVP no implementa Connect).
-- - Los triggers de updated_at se crean aquí; los de negocio (p. ej. actualizar
--   user_progress al insertar pose_sessions) se añaden en scripts posteriores.
-- - Los tipos ENUM no se usan (usamos CHECK constraints) para que las
--   migraciones futuras sean más sencillas (no hay que hacer ALTER TYPE).
-- =============================================================================

-- Fin de 001-schema.sql
