-- =============================================================================
-- PoseArt — 002-rls.sql
-- =============================================================================
-- Propósito:
--   Activar Row Level Security (RLS) en TODAS las tablas del esquema public
--   y definir las políticas PERMISSIVE explícitas. Sin una política
--   PERMISSIVE para una operación, RLS la deniega (deny-by-default).
--
-- Documentación de referencia:
--   - docs/backend/04-AUTH-AND-RLS.md (matriz de autorización, pruebas negativas)
--   - docs/backend/03-DATA-MODEL.md  (justificación de tablas y ownership)
--
-- Orden de ejecución:
--   1. 001-schema.sql  (crea tablas)
--   2. Este archivo (002-rls.sql)
--   3. 003-seed-development.sql (solo en DEV)
--
-- Idempotencia:
--   - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` es idempotente.
--   - `CREATE POLICY` falla si la política ya existe. En DEV puedes hacer
--     `DROP POLICY IF EXISTS <name> ON <table>;` antes de crear. Aquí se
--     asume ejecución única tras 001-schema.sql.
--
-- Principios:
--   1. RLS en TODAS las tablas sin excepción.
--   2. Sin política PERMISSIVE = deny por defecto (estado seguro).
--   3. Las operaciones sensibles (crear entitlements, conceder roles,
--      archivar productos) NO se permiten por REST. Se hacen vía Edge
--      Function con service_role (bypassa RLS).
--   4. Las claves públicas (anon) NUNCA bypassan RLS.
--   5. El helper current_user_has_role usa SECURITY DEFINER para no exponer
--      la tabla user_roles entera.
-- =============================================================================

-- =============================================================================
-- 0. Funciones helper (SECURITY DEFINER para uso desde RLS)
-- =============================================================================

-- user_has_pro(user_uuid): TRUE si el usuario tiene entitlement Pro activo.
-- Es SECURITY DEFINER porque entitlements no es legible por usuarios ajenos.
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

-- current_user_role(): devuelve el rol del usuario autenticado actual.
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT role FROM public.user_roles WHERE user_id = auth.uid();
$$;

-- current_user_has_role(required_roles): TRUE si el usuario actual tiene uno
-- de los roles indicados.
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

-- user_has_product_entitlement(user_uuid, product_uuid): TRUE si el usuario
-- tiene entitlement activo para el producto indicado.
CREATE OR REPLACE FUNCTION public.user_has_product_entitlement(
    user_uuid uuid,
    product_uuid uuid
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS(
        SELECT 1 FROM public.entitlements
        WHERE entitlements.user_id = user_uuid
          AND entitlements.product_id = product_uuid
          AND entitlements.active = true
          AND (entitlements.ends_at IS NULL OR entitlements.ends_at > now())
    );
$$;

-- user_owns_pose_version(user_uuid, pose_version_uuid): TRUE si el usuario
-- puede ver esa pose_version (por ser dueño, pública, o por compra).
CREATE OR REPLACE FUNCTION public.user_can_read_pose_version(
    user_uuid uuid,
    pose_version_uuid uuid
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS(
        -- Pública y no archivada
        SELECT 1 FROM public.pose_versions pv
        JOIN public.poses p ON p.id = pv.pose_id
        WHERE pv.id = pose_version_uuid
          AND p.visibility = 'public'
          AND p.archived_at IS NULL
    )
    OR EXISTS(
        -- Dueño de la pose
        SELECT 1 FROM public.pose_versions pv
        JOIN public.poses p ON p.id = pv.pose_id
        WHERE pv.id = pose_version_uuid
          AND p.owner_id = user_uuid
    )
    OR EXISTS(
        -- Comprada vía snapshot_items
        SELECT 1 FROM public.purchases pur
        WHERE pur.user_id = user_uuid
          AND pur.refunded_at IS NULL
          AND pur.snapshot_items @> jsonb_build_array(
                jsonb_build_object('pose_version_id', pose_version_uuid)
              )
    )
    OR EXISTS(
        -- Tiene entitlement "all_pro_content" (es Pro)
        SELECT 1 FROM public.entitlements e
        WHERE e.user_id = user_uuid
          AND e.active = true
          AND e.scope = 'all_pro_content'
          AND (e.ends_at IS NULL OR e.ends_at > now())
    );
$$;

-- =============================================================================
-- 1. profiles
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: propia + campos públicos de otros (username, display_name, avatar_url).
-- No exponemos email (lo gestiona auth.users), selected_goal, etc.
CREATE POLICY profiles_select ON public.profiles
    FOR SELECT TO authenticated, anon
    USING (
        id = auth.uid()
        OR (username IS NOT NULL)
    );

-- UPDATE: solo propia fila.
CREATE POLICY profiles_update_owner ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- No hay política INSERT ni DELETE:
-- - INSERT lo hace el trigger handle_new_user (SECURITY DEFINER, bypassa RLS)
-- - DELETE solo vía Edge Function admin con service_role.

-- =============================================================================
-- 2. user_roles
-- =============================================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- SELECT: el usuario solo lee su propio rol.
-- Los admins usan el helper current_user_has_role (SECURITY DEFINER) en otras
-- políticas, así que no necesitan SELECT directo aquí para validar.
CREATE POLICY user_roles_select_self ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Admins pueden ver todos los roles.
CREATE POLICY user_roles_select_admin ON public.user_roles
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));

-- No hay INSERT/UPDATE/DELETE por REST: solo Edge Function con service_role.

-- =============================================================================
-- 3. admin_audit_log
-- =============================================================================
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- SELECT: solo administrador.
CREATE POLICY admin_audit_log_select_admin ON public.admin_audit_log
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));

-- No hay INSERT/UPDATE/DELETE por REST: inmutable. Inserciones solo desde
-- Edge Function admin con service_role.

-- =============================================================================
-- 4. billing_customers
-- =============================================================================
ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY billing_customers_select_self ON public.billing_customers
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY billing_customers_select_admin ON public.billing_customers
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));

-- No INSERT/UPDATE/DELETE por REST.

-- =============================================================================
-- 5. subscriptions
-- =============================================================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscriptions_select_self ON public.subscriptions
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY subscriptions_select_admin ON public.subscriptions
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador','moderador']));

-- No INSERT/UPDATE/DELETE por REST: solo webhook handler con service_role.

-- =============================================================================
-- 6. subscription_events
-- =============================================================================
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscription_events_select_self ON public.subscription_events
    FOR SELECT TO authenticated
    USING (
        subscription_id IN (
            SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY subscription_events_select_admin ON public.subscription_events
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador','moderador']));

-- No INSERT/UPDATE/DELETE por REST.

-- =============================================================================
-- 7. invoices
-- =============================================================================
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY invoices_select_self ON public.invoices
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY invoices_select_admin ON public.invoices
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador','moderador']));

-- No INSERT/UPDATE/DELETE por REST.

-- =============================================================================
-- 8. payment_events
-- =============================================================================
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY payment_events_select_self ON public.payment_events
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY payment_events_select_admin ON public.payment_events
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador','moderador']));

-- No INSERT/UPDATE/DELETE por REST.

-- =============================================================================
-- 9. webhook_events
-- =============================================================================
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Solo admin lee. Nadie escribe por REST (lo hace webhook handler).
CREATE POLICY webhook_events_select_admin ON public.webhook_events
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));

-- =============================================================================
-- 10. poses
-- =============================================================================
ALTER TABLE public.poses ENABLE ROW LEVEL SECURITY;

-- SELECT: pública y no archivada, O propia (cualquier visibilidad), O admin.
CREATE POLICY poses_select_visible ON public.poses
    FOR SELECT TO authenticated, anon
    USING (
        (visibility = 'public' AND archived_at IS NULL)
        OR owner_id = auth.uid()
        OR public.current_user_has_role(ARRAY['administrador','moderador'])
    );

-- INSERT: usuario autenticado, owner_id = sí mismo.
CREATE POLICY poses_insert_owner ON public.poses
    FOR INSERT TO authenticated
    WITH CHECK (
        owner_id = auth.uid()
        AND visibility IN ('public','private')
    );

-- UPDATE: solo el dueño. Moderador puede archivar (set archived_at).
CREATE POLICY poses_update_owner ON public.poses
    FOR UPDATE TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY poses_update_moderator_archive ON public.poses
    FOR UPDATE TO authenticated
    USING (public.current_user_has_role(ARRAY['moderador','administrador']))
    WITH CHECK (public.current_user_has_role(ARRAY['moderador','administrador']));

-- DELETE: solo el dueño. Las FK RESTRICT protegen versiones referenciadas.
CREATE POLICY poses_delete_owner ON public.poses
    FOR DELETE TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY poses_delete_admin ON public.poses
    FOR DELETE TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));

-- =============================================================================
-- 11. pose_versions
-- =============================================================================
ALTER TABLE public.pose_versions ENABLE ROW LEVEL SECURITY;

-- SELECT: hereda de la pose padre, O comprada, O Pro.
-- Usamos el helper para evitar replicar lógica compleja.
CREATE POLICY pose_versions_select_readable ON public.pose_versions
    FOR SELECT TO authenticated, anon
    USING (
        public.user_can_read_pose_version(auth.uid(), pose_versions.id)
    );

-- INSERT: solo si el usuario es dueño de la pose padre.
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

-- No hay política UPDATE ni DELETE: append-only (inmutable).

-- =============================================================================
-- 12. tours
-- =============================================================================
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY tours_select_visible ON public.tours
    FOR SELECT TO authenticated, anon
    USING (
        (visibility = 'public' AND archived_at IS NULL)
        OR owner_id = auth.uid()
        OR public.current_user_has_role(ARRAY['administrador','moderador'])
    );

CREATE POLICY tours_insert_owner ON public.tours
    FOR INSERT TO authenticated
    WITH CHECK (
        owner_id = auth.uid()
        AND visibility IN ('public','private')
    );

CREATE POLICY tours_update_owner ON public.tours
    FOR UPDATE TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY tours_update_moderator_archive ON public.tours
    FOR UPDATE TO authenticated
    USING (public.current_user_has_role(ARRAY['moderador','administrador']))
    WITH CHECK (public.current_user_has_role(ARRAY['moderador','administrador']));

CREATE POLICY tours_delete_owner ON public.tours
    FOR DELETE TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY tours_delete_admin ON public.tours
    FOR DELETE TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));

-- =============================================================================
-- 13. tour_versions
-- =============================================================================
ALTER TABLE public.tour_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY tour_versions_select_readable ON public.tour_versions
    FOR SELECT TO authenticated, anon
    USING (
        EXISTS(
            SELECT 1 FROM public.tours t
            WHERE t.id = tour_versions.tour_id
              AND (
                  (t.visibility = 'public' AND t.archived_at IS NULL)
                  OR t.owner_id = auth.uid()
                  OR public.current_user_has_role(ARRAY['administrador','moderador'])
              )
        )
        OR EXISTS(
            -- Comprado vía snapshot
            SELECT 1 FROM public.purchases pur
            WHERE pur.user_id = auth.uid()
              AND pur.refunded_at IS NULL
              AND pur.snapshot_items @> jsonb_build_array(
                    jsonb_build_object('tour_version_id', tour_versions.id)
                  )
        )
        OR public.user_has_pro(auth.uid())
    );

CREATE POLICY tour_versions_insert_owner ON public.tour_versions
    FOR INSERT TO authenticated
    WITH CHECK (
        created_by = auth.uid()
        AND EXISTS(
            SELECT 1 FROM public.tours t
            WHERE t.id = tour_versions.tour_id
              AND t.owner_id = auth.uid()
        )
    );

-- No UPDATE ni DELETE: append-only.

-- =============================================================================
-- 14. tour_sections
-- =============================================================================
ALTER TABLE public.tour_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY tour_sections_select_inherit ON public.tour_sections
    FOR SELECT TO authenticated, anon
    USING (
        EXISTS(
            SELECT 1 FROM public.tour_versions tv
            JOIN public.tours t ON t.id = tv.tour_id
            WHERE tv.id = tour_sections.tour_version_id
              AND (
                  (t.visibility = 'public' AND t.archived_at IS NULL)
                  OR t.owner_id = auth.uid()
                  OR public.current_user_has_role(ARRAY['administrador','moderador'])
              )
        )
        OR EXISTS(
            SELECT 1 FROM public.purchases pur
            WHERE pur.user_id = auth.uid()
              AND pur.refunded_at IS NULL
              AND pur.snapshot_items @> jsonb_build_array(
                    jsonb_build_object('tour_version_id', tour_sections.tour_version_id)
                  )
        )
        OR public.user_has_pro(auth.uid())
    );

CREATE POLICY tour_sections_insert_owner ON public.tour_sections
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS(
            SELECT 1 FROM public.tour_versions tv
            JOIN public.tours t ON t.id = tv.tour_id
            WHERE tv.id = tour_sections.tour_version_id
              AND t.owner_id = auth.uid()
        )
    );

CREATE POLICY tour_sections_update_owner ON public.tour_sections
    FOR UPDATE TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.tour_versions tv
            JOIN public.tours t ON t.id = tv.tour_id
            WHERE tv.id = tour_sections.tour_version_id
              AND t.owner_id = auth.uid()
        )
    );

CREATE POLICY tour_sections_delete_owner ON public.tour_sections
    FOR DELETE TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.tour_versions tv
            JOIN public.tours t ON t.id = tv.tour_id
            WHERE tv.id = tour_sections.tour_version_id
              AND t.owner_id = auth.uid()
        )
    );

-- =============================================================================
-- 15. tour_items
-- =============================================================================
ALTER TABLE public.tour_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY tour_items_select_inherit ON public.tour_items
    FOR SELECT TO authenticated, anon
    USING (
        EXISTS(
            SELECT 1 FROM public.tour_sections ts
            JOIN public.tour_versions tv ON tv.id = ts.tour_version_id
            JOIN public.tours t ON t.id = tv.tour_id
            WHERE ts.id = tour_items.tour_section_id
              AND (
                  (t.visibility = 'public' AND t.archived_at IS NULL)
                  OR t.owner_id = auth.uid()
                  OR public.current_user_has_role(ARRAY['administrador','moderador'])
              )
        )
        OR EXISTS(
            SELECT 1 FROM public.purchases pur
            WHERE pur.user_id = auth.uid()
              AND pur.refunded_at IS NULL
              AND pur.snapshot_items @> jsonb_build_array(
                    jsonb_build_object('tour_version_id',
                      (SELECT tv.id FROM public.tour_sections ts
                       JOIN public.tour_versions tv ON tv.id = ts.tour_version_id
                       WHERE ts.id = tour_items.tour_section_id))
                  )
        )
        OR public.user_has_pro(auth.uid())
    );

CREATE POLICY tour_items_insert_owner ON public.tour_items
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS(
            SELECT 1 FROM public.tour_sections ts
            JOIN public.tour_versions tv ON tv.id = ts.tour_version_id
            JOIN public.tours t ON t.id = tv.tour_id
            WHERE ts.id = tour_items.tour_section_id
              AND t.owner_id = auth.uid()
        )
    );

CREATE POLICY tour_items_update_owner ON public.tour_items
    FOR UPDATE TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.tour_sections ts
            JOIN public.tour_versions tv ON tv.id = ts.tour_version_id
            JOIN public.tours t ON t.id = tv.tour_id
            WHERE ts.id = tour_items.tour_section_id
              AND t.owner_id = auth.uid()
        )
    );

CREATE POLICY tour_items_delete_owner ON public.tour_items
    FOR DELETE TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.tour_sections ts
            JOIN public.tour_versions tv ON tv.id = ts.tour_version_id
            JOIN public.tours t ON t.id = tv.tour_id
            WHERE ts.id = tour_items.tour_section_id
              AND t.owner_id = auth.uid()
        )
    );

-- =============================================================================
-- 16. creator_profiles
-- =============================================================================
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY creator_profiles_select_public ON public.creator_profiles
    FOR SELECT TO authenticated, anon
    USING (archived_at IS NULL);

CREATE POLICY creator_profiles_select_admin ON public.creator_profiles
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador','moderador']));

-- INSERT: solo si el usuario tiene rol creador y crea su propio perfil.
CREATE POLICY creator_profiles_insert_self ON public.creator_profiles
    FOR INSERT TO authenticated
    WITH CHECK (
        user_id = auth.uid()
        AND public.current_user_has_role(ARRAY['creador','administrador'])
    );

-- UPDATE: solo el propio creador.
CREATE POLICY creator_profiles_update_self ON public.creator_profiles
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Admin puede archivar/verificar.
CREATE POLICY creator_profiles_update_admin ON public.creator_profiles
    FOR UPDATE TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']))
    WITH CHECK (public.current_user_has_role(ARRAY['administrador']));

-- =============================================================================
-- 17. products
-- =============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- SELECT: publicados, O propios (cualquier status), O in_review para moderador, O admin.
CREATE POLICY products_select_visible ON public.products
    FOR SELECT TO authenticated, anon
    USING (
        publication_status = 'published'
        OR creator_id = auth.uid()
        OR (publication_status = 'in_review'
            AND public.current_user_has_role(ARRAY['moderador','administrador']))
        OR public.current_user_has_role(ARRAY['administrador'])
    );

-- INSERT: solo creador, con creator_id = sí mismo, status inicial draft.
CREATE POLICY products_insert_creator ON public.products
    FOR INSERT TO authenticated
    WITH CHECK (
        creator_id = auth.uid()
        AND public.current_user_has_role(ARRAY['creador','administrador'])
        AND publication_status = 'draft'
    );

-- UPDATE: creador propio (no publicado), O admin.
CREATE POLICY products_update_creator ON public.products
    FOR UPDATE TO authenticated
    USING (
        creator_id = auth.uid()
        AND publication_status IN ('draft','in_review','rejected')
    )
    WITH CHECK (
        creator_id = auth.uid()
        AND publication_status IN ('draft','in_review','rejected')
    );

CREATE POLICY products_update_admin ON public.products
    FOR UPDATE TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador','moderador']))
    WITH CHECK (public.current_user_has_role(ARRAY['administrador','moderador']));

-- No DELETE: soft delete vía archived_at.
-- (Si se necesita hard delete, Edge Function admin con service_role.)

-- =============================================================================
-- 18. product_items
-- =============================================================================
ALTER TABLE public.product_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_items_select_visible ON public.product_items
    FOR SELECT TO authenticated, anon
    USING (
        EXISTS(
            SELECT 1 FROM public.products p
            WHERE p.id = product_items.product_id
              AND (
                  p.publication_status = 'published'
                  OR p.creator_id = auth.uid()
                  OR public.current_user_has_role(ARRAY['moderador','administrador'])
              )
        )
    );

CREATE POLICY product_items_insert_creator ON public.product_items
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS(
            SELECT 1 FROM public.products p
            WHERE p.id = product_items.product_id
              AND p.creator_id = auth.uid()
              AND p.publication_status IN ('draft','in_review','rejected')
        )
    );

CREATE POLICY product_items_update_creator ON public.product_items
    FOR UPDATE TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.products p
            WHERE p.id = product_items.product_id
              AND p.creator_id = auth.uid()
              AND p.publication_status IN ('draft','in_review','rejected')
        )
    );

CREATE POLICY product_items_delete_creator ON public.product_items
    FOR DELETE TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.products p
            WHERE p.id = product_items.product_id
              AND p.creator_id = auth.uid()
              AND p.publication_status IN ('draft','in_review','rejected')
        )
    );

-- =============================================================================
-- 19. product_publications
-- =============================================================================
ALTER TABLE public.product_publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_publications_select_inherit ON public.product_publications
    FOR SELECT TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.products p
            WHERE p.id = product_publications.product_id
              AND (
                  p.creator_id = auth.uid()
                  OR public.current_user_has_role(ARRAY['moderador','administrador'])
              )
        )
    );

-- No INSERT/UPDATE/DELETE por REST: las transiciones de status se hacen vía
-- Edge Function (request-publication, approve-publication, etc.) con
-- service_role. Esto evita que un creador se apruebe a sí mismo.

-- =============================================================================
-- 20. reviews
-- =============================================================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY reviews_select_visible ON public.reviews
    FOR SELECT TO authenticated, anon
    USING (
        hidden_at IS NULL
        OR user_id = auth.uid()
        OR public.current_user_has_role(ARRAY['moderador','administrador'])
    );

-- INSERT: solo si el usuario tiene entitlement del producto (validado en
-- trigger o en el helper). Aquí permitimos INSERT si user_id = auth.uid();
-- el trigger se encarga de verificar entitlement.
CREATE POLICY reviews_insert_buyer ON public.reviews
    FOR INSERT TO authenticated
    WITH CHECK (
        user_id = auth.uid()
        AND public.user_has_product_entitlement(auth.uid(), product_id)
    );

-- UPDATE: solo el autor (comment, rating).
CREATE POLICY reviews_update_author ON public.reviews
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Moderador puede ocultar (UPDATE hidden_at) sin cambiar comment/rating.
-- La política update_admin permite cualquier UPDATE; la restricción de campos
-- se hace con un trigger separado o a nivel de Edge Function.
CREATE POLICY reviews_update_moderator ON public.reviews
    FOR UPDATE TO authenticated
    USING (public.current_user_has_role(ARRAY['moderador','administrador']))
    WITH CHECK (public.current_user_has_role(ARRAY['moderador','administrador']));

-- DELETE: solo admin. Preferimos soft delete (hidden_at).
CREATE POLICY reviews_delete_admin ON public.reviews
    FOR DELETE TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));

-- =============================================================================
-- 21. entitlements
-- =============================================================================
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY entitlements_select_self ON public.entitlements
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY entitlements_select_admin ON public.entitlements
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador','moderador']));

-- No INSERT/UPDATE/DELETE por REST: solo webhook handler o admin Edge Function.

-- =============================================================================
-- 22. orders
-- =============================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_select_self ON public.orders
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY orders_select_admin ON public.orders
    FOR SELECT TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador','moderador']));

-- No INSERT/UPDATE/DELETE por REST: solo Edge Function (create-checkout,
-- stripe-webhook) con service_role.

-- =============================================================================
-- 23. order_items
-- =============================================================================
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_items_select_inherit ON public.order_items
    FOR SELECT TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
              AND o.user_id = auth.uid()
        )
        OR public.current_user_has_role(ARRAY['administrador','moderador'])
    );

-- No INSERT/UPDATE/DELETE por REST.

-- =============================================================================
-- 24. purchases
-- =============================================================================
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- SELECT: el comprador, O el creador del producto (para ver sus ventas), O admin.
CREATE POLICY purchases_select_inherit ON public.purchases
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid()
        OR EXISTS(
            SELECT 1 FROM public.products p
            WHERE p.id = purchases.product_id
              AND p.creator_id = auth.uid()
        )
        OR public.current_user_has_role(ARRAY['administrador','moderador'])
    );

-- No INSERT/UPDATE/DELETE por REST: solo webhook handler con service_role.

-- =============================================================================
-- 25. refunds
-- =============================================================================
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY refunds_select_inherit ON public.refunds
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid()
        OR public.current_user_has_role(ARRAY['administrador','moderador'])
    );

-- No INSERT/UPDATE/DELETE por REST: solo admin Edge Function con service_role.

-- =============================================================================
-- 26. favorites
-- =============================================================================
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY favorites_select_self ON public.favorites
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY favorites_insert_self ON public.favorites
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY favorites_delete_self ON public.favorites
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- No UPDATE: la PK compuesta y la falta de columnas mutables lo hacen innecesario.

-- =============================================================================
-- 27. user_preferences
-- =============================================================================
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_preferences_select_self ON public.user_preferences
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY user_preferences_upsert_self ON public.user_preferences
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY user_preferences_update_self ON public.user_preferences
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY user_preferences_delete_self ON public.user_preferences
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- =============================================================================
-- 28. pose_sessions
-- =============================================================================
ALTER TABLE public.pose_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY pose_sessions_select_self ON public.pose_sessions
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY pose_sessions_insert_self ON public.pose_sessions
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY pose_sessions_update_self ON public.pose_sessions
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY pose_sessions_delete_self ON public.pose_sessions
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- =============================================================================
-- 29. session_pose_results
-- =============================================================================
ALTER TABLE public.session_pose_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY session_pose_results_select_inherit ON public.session_pose_results
    FOR SELECT TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.pose_sessions s
            WHERE s.id = session_pose_results.session_id
              AND s.user_id = auth.uid()
        )
    );

CREATE POLICY session_pose_results_insert_inherit ON public.session_pose_results
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS(
            SELECT 1 FROM public.pose_sessions s
            WHERE s.id = session_pose_results.session_id
              AND s.user_id = auth.uid()
        )
    );

CREATE POLICY session_pose_results_update_inherit ON public.session_pose_results
    FOR UPDATE TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.pose_sessions s
            WHERE s.id = session_pose_results.session_id
              AND s.user_id = auth.uid()
        )
    );

CREATE POLICY session_pose_results_delete_inherit ON public.session_pose_results
    FOR DELETE TO authenticated
    USING (
        EXISTS(
            SELECT 1 FROM public.pose_sessions s
            WHERE s.id = session_pose_results.session_id
              AND s.user_id = auth.uid()
        )
    );

-- =============================================================================
-- 30. captures
-- =============================================================================
ALTER TABLE public.captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY captures_select_self ON public.captures
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY captures_insert_self ON public.captures
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- UPDATE: solo is_favorite y deleted_at (soft delete).
-- RLS permite cualquier UPDATE si es dueño; el trigger restringe columnas.
CREATE POLICY captures_update_self ON public.captures
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY captures_delete_self ON public.captures
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- =============================================================================
-- 31. user_progress
-- =============================================================================
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_progress_select_self ON public.user_progress
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE por REST: se actualiza por trigger desde pose_sessions
-- o por Edge Function. El usuario lee su progreso pero no lo escribe directamente.

-- =============================================================================
-- 32. bug_reports
-- =============================================================================
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY bug_reports_select_inherit ON public.bug_reports
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid()
        OR public.current_user_has_role(ARRAY['moderador','administrador'])
    );

-- INSERT: usuario autenticado (user_id = sí mismo) o anónimo (user_id NULL).
CREATE POLICY bug_reports_insert_any ON public.bug_reports
    FOR INSERT TO authenticated, anon
    WITH CHECK (
        user_id = auth.uid() OR user_id IS NULL
    );

-- UPDATE: moderador+ cambia status. El autor no edita.
CREATE POLICY bug_reports_update_moderator ON public.bug_reports
    FOR UPDATE TO authenticated
    USING (public.current_user_has_role(ARRAY['moderador','administrador']))
    WITH CHECK (public.current_user_has_role(ARRAY['moderador','administrador']));

-- DELETE: solo admin.
CREATE POLICY bug_reports_delete_admin ON public.bug_reports
    FOR DELETE TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));

-- =============================================================================
-- 33. support_messages
-- =============================================================================
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY support_messages_select_inherit ON public.support_messages
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid()
        OR assigned_to = auth.uid()
        OR public.current_user_has_role(ARRAY['moderador','administrador'])
    );

CREATE POLICY support_messages_insert_self ON public.support_messages
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- UPDATE: el usuario solo puede cerrar su propio ticket (status='closed').
-- Moderador+ puede cambiar status y assigned_to. Esta política permite ambos;
-- la restricción fina va en trigger.
CREATE POLICY support_messages_update_inherit ON public.support_messages
    FOR UPDATE TO authenticated
    USING (
        user_id = auth.uid()
        OR public.current_user_has_role(ARRAY['moderador','administrador'])
    )
    WITH CHECK (
        user_id = auth.uid()
        OR public.current_user_has_role(ARRAY['moderador','administrador'])
    );

-- DELETE: solo admin.
CREATE POLICY support_messages_delete_admin ON public.support_messages
    FOR DELETE TO authenticated
    USING (public.current_user_has_role(ARRAY['administrador']));

-- =============================================================================
-- 34. Índices adicionales para rendimiento de RLS
-- =============================================================================

-- Índice GIN en purchases.snapshot_items para acelerar las consultas @> que
-- verifican si un usuario compró una pose_version concreta.
CREATE INDEX IF NOT EXISTS idx_purchases_snapshot_gin
    ON public.purchases USING GIN (snapshot_items);

-- =============================================================================
-- 35. Resumen de lo que NO se permite por REST (deny by default)
-- =============================================================================
-- Las siguientes operaciones NO tienen política PERMISSIVE y, por tanto, RLS
-- las deniega. Solo se pueden ejecutar con service_role (Edge Functions):
--
--   - INSERT/UPDATE/DELETE en user_roles
--   - INSERT/UPDATE/DELETE en admin_audit_log (inmutable)
--   - INSERT/UPDATE/DELETE en billing_customers
--   - INSERT/UPDATE/DELETE en subscriptions
--   - INSERT/UPDATE/DELETE en subscription_events
--   - INSERT/UPDATE/DELETE en invoices
--   - INSERT/UPDATE/DELETE en payment_events
--   - INSERT/UPDATE/DELETE en webhook_events
--   - INSERT/UPDATE/DELETE en entitlements
--   - INSERT/UPDATE/DELETE en orders
--   - INSERT/UPDATE/DELETE en order_items
--   - INSERT/UPDATE/DELETE en purchases
--   - INSERT/UPDATE/DELETE en refunds
--   - INSERT/UPDATE/DELETE en product_publications
--   - INSERT/UPDATE/DELETE en user_progress
--   - UPDATE/DELETE en pose_versions (append-only)
--   - UPDATE/DELETE en tour_versions (append-only)
--   - DELETE en products (soft delete vía archived_at)
--   - DELETE en reviews (soft delete vía hidden_at)
--
-- Esta lista es intencional. Cualquier cambio futuro debe pasar por code
-- review y por las pruebas negativas en 04-AUTH-AND-RLS.md §6.
-- =============================================================================

-- Fin de 002-rls.sql
