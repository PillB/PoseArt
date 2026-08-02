# SOURCE-LEDGER.md — Registro de documentación oficial utilizada

> **Propósito:** Registrar cada fuente oficial consultada para las decisiones técnicas de esta documentación. Permite verificar que las recomendaciones se basan en documentación vigente, no en suposiciones.

---

## Formato de cada entrada

| Campo | Descripción |
|---|---|
| Servicio | Proveedor de la documentación |
| Título | Título de la página consultada |
| URL | Enlace directo |
| Fecha de consulta | Cuándo se verificó |
| Sección utilizada | Parte específica usada |
| Decisión que respalda | Qué decisión técnica se basa en esta fuente |
| Estado | Verificado / Parcialmente verificado / No aplicable |

---

## 1. Supabase

| Campo | Valor |
|---|---|
| Servicio | Supabase |
| Título | Supabase Documentation — Overview |
| URL | https://supabase.com/docs |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Auth, Database, Row Level Security, Edge Functions, Storage |
| Decisión que respalda | Elección de Supabase como backend gestionado (PostgreSQL + Auth + RLS) |
| Estado | Verificado (sitio activo, no marcado como deprecated) |

| Campo | Valor |
|---|---|
| Servicio | Supabase |
| Título | Row Level Security (RLS) |
| URL | https://supabase.com/docs/guides/database/postgres/row-level-security |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Policy examples, ENABLE ROW LEVEL SECURITY, CREATE POLICY |
| Decisión que respalda | Diseño de políticas RLS deny-by-default en `04-AUTH-AND-RLS.md` y `sql/002-rls.sql` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Supabase |
| Título | Auth — Getting Started |
| URL | https://supabase.com/docs/guides/auth |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Email/password auth, email verification, password reset, MFA |
| Decisión que respalda | Configuración de auth gestionado en `04-AUTH-AND-RLS.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Supabase |
| Título | Edge Functions |
| URL | https://supabase.com/docs/guides/functions |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Deno runtime, serve function, secrets management |
| Decisión que respalda | Edge Functions para create-checkout, stripe-webhook, create-portal-session en `07-BILLING-AND-SUBSCRIPTIONS.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Supabase |
| Título | Storage |
| URL | https://supabase.com/docs/guides/storage |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Private buckets, signed URLs, upload policies |
| Decisión que respalda | Storage privado para fotos (si se habilita) en `12-OPERATIONS-PRIVACY-AND-BACKUPS.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Supabase |
| Título | Pricing |
| URL | https://supabase.com/pricing |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Free tier limits (500MB database, 50,000 monthly active users) |
| Decisión que respalda | Coste inicial gratuito documentado en `00-READ-ME-FIRST.md` |
| Estado | Parcialmente verificado — los límites pueden cambiar; verifica en el sitio antes de registrarte |

| Campo | Valor |
|---|---|
| Servicio | Supabase |
| Título | CLI Quick Start |
| URL | https://supabase.com/docs/guides/local-development |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | supabase init, supabase db reset, supabase functions serve |
| Decisión que respalda | Configuración local en `05-LOCAL-SETUP.md` |
| Estado | Verificado |

---

## 2. Stripe

| Campo | Valor |
|---|---|
| Servicio | Stripe |
| Título | Stripe Documentation |
| URL | https://docs.stripe.com/ |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Checkout, Customer Portal, Webhooks, Subscriptions |
| Decisión que respalda | Elección de Stripe para pagos y suscripciones |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Stripe |
| Título | Checkout Session |
| URL | https://docs.stripe.com/checkout/quickstart |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Creating a Checkout Session server-side, success_url vs webhook |
| Decisión que respalda | Edge Function `create-checkout` en `07-BILLING-AND-SUBSCRIPTIONS.md`; regla "no confiar en success_url" |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Stripe |
| Título | Webhooks |
| URL | https://docs.stripe.com/webhooks |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Signature verification, endpoint security, idempotency |
| Decisión que respalda | Edge Function `stripe-webhook` con verificación de firma e idempotencia en `07-BILLING-AND-SUBSCRIPTIONS.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Stripe |
| Título | Customer Portal |
| URL | https://docs.stripe.com/customer-management/portal |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Creating portal sessions, configuration |
| Decisión que respalda | Edge Function `create-portal-session` en `07-BILLING-AND-SUBSCRIPTIONS.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Stripe |
| Título | Subscriptions |
| URL | https://docs.stripe.com/billing/subscriptions/overview |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Subscription states (active, past_due, canceled, incomplete, trialing), lifecycle |
| Decisión que respalda | Manejo de estados de suscripción y tabla `subscription_events` en `07-BILLING-AND-SUBSCRIPTIONS.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Stripe |
| Título | Stripe CLI |
| URL | https://docs.stripe.com/stripe-cli |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | stripe listen, stripe trigger, forwarding webhooks to localhost |
| Decisión que respalda | Pruebas locales de webhook en `05-LOCAL-SETUP.md` y `11-TESTING-AND-SECURITY-CHECKLIST.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Stripe |
| Título | Global availability |
| URL | https://stripe.com/global |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Country availability |
| Decisión que respalda | Nota sobre verificar disponibilidad en el país del propietario en `00-READ-ME-FIRST.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Stripe |
| Título | Stripe Connect |
| URL | https://docs.stripe.com/connect |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Overview, when to use Connect |
| Decisión que respalda | Decisión de NO implementar Connect en MVP en `08-MARKETPLACE-AND-PURCHASES.md` |
| Estado | Verificado |

---

## 3. PostHog

| Campo | Valor |
|---|---|
| Servicio | PostHog |
| Título | PostHog Documentation |
| URL | https://posthog.com/docs |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | JavaScript integration, event tracking, funnels, retention |
| Decisión que respalda | Elección de PostHog para analytics en `09-ANALYTICS-AND-OBSERVABILITY.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | PostHog |
| Título | Pricing |
| URL | https://posthog.com/pricing |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Free tier (1M events/month) |
| Decisión que respalda | Coste inicial gratuito en `00-READ-ME-FIRST.md` |
| Estado | Parcialmente verificado — los límites pueden cambiar |

| Campo | Valor |
|---|---|
| Servicio | PostHog |
| Título | Privacy |
| URL | https://posthog.com/docs/privacy |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Opt-out, consent, data retention |
| Decisión que respalda | Reglas de privacidad y consentimiento en `09-ANALYTICS-AND-OBSERVABILITY.md` |
| Estado | Verificado |

---

## 4. Sentry

| Campo | Valor |
|---|---|
| Servicio | Sentry |
| Título | Sentry Documentation |
| URL | https://docs.sentry.io/ |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | JavaScript SDK, error tracking, release tracking |
| Decisión que respalda | Elección de Sentry para error tracking en `09-ANALYTICS-AND-OBSERVABILITY.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | Sentry |
| Título | Pricing |
| URL | https://sentry.io/pricing/ |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Free tier (5,000 errors/month) |
| Decisión que respalda | Coste inicial gratuito en `00-READ-ME-FIRST.md` |
| Estado | Parcialmente verificado — los límites pueden cambiar |

| Campo | Valor |
|---|---|
| Servicio | Sentry |
| Título | GDPR and Privacy |
| URL | https://docs.sentry.io/security-legal-pii-control/ |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | PII scrubbing, data deletion API |
| Decisión que respalda | Manejo de PII y eliminación de cuenta en `12-OPERATIONS-PRIVACY-AND-BACKUPS.md` |
| Estado | Verificado |

---

## 5. GitHub Pages

| Campo | Valor |
|---|---|
| Servicio | GitHub Pages |
| Título | GitHub Pages Documentation |
| URL | https://docs.github.com/en/pages |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | Deployment, custom domains, HTTPS |
| Decisión que respalda | Despliegue actual y configuración de dominio en `06-DOMAIN-HOSTING-DEPLOYMENT.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | GitHub Actions |
| Título | Deploying with GitHub Actions |
| URL | https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | upload-pages-artifact action |
| Decisión que respalda | Workflow `.github/workflows/deploy.yml` existente |
| Estado | Verificado |

---

## 6. OWASP

| Campo | Valor |
|---|---|
| Servicio | OWASP |
| Título | OWASP Top 10 |
| URL | https://owasp.org/www-project-top-ten/ |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | A01 Broken Access Control, A02 Cryptographic Failures, A07 Identification and Authentication Failures |
| Decisión que respalda | Principios de seguridad (RLS, no almacenar contraseñas, deny-by-default) en `04-AUTH-AND-RLS.md` y `11-TESTING-AND-SECURITY-CHECKLIST.md` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | OWASP |
| Título | Cheat Sheet Series — HTML5 Web Storage |
| URL | https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | "Do not store session identifiers in local storage" |
| Decisión que respalda | Migración desde localStorage y uso de sessionStorage/httpOnly cookies en `10-LOCALSTORAGE-MIGRATION.md` |
| Estado | Verificado |

---

## 7. PostgreSQL

| Campo | Valor |
|---|---|
| Servicio | PostgreSQL |
| Título | PostgreSQL Documentation — Row Security Policies |
| URL | https://www.postgresql.org/docs/current/ddl-rowsecurity.html |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | CREATE POLICY, USING clause, WITH CHECK clause |
| Decisión que respalda | Sintaxis SQL en `sql/002-rls.sql` |
| Estado | Verificado |

| Campo | Valor |
|---|---|
| Servicio | PostgreSQL |
| Título | PostgreSQL Documentation — UPSERT (ON CONFLICT) |
| URL | https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT |
| Fecha de consulta | 2026-08-02 |
| Sección utilizada | INSERT ... ON CONFLICT DO NOTHING / DO UPDATE for idempotency |
| Decisión que respalda | Idempotencia en webhooks y migración en `07-BILLING-AND-SUBSCRIPTIONS.md` y `10-LOCALSTORAGE-MIGRATION.md` |
| Estado | Verificado |

---

## Resumen de estados

| Estado | Cantidad | Significado |
|---|---|---|
| Verificado | 18 | Fuente consultada, activa, no deprecated, información confirmada |
| Parcialmente verificado | 3 | Fuente activa pero límites/precios pueden cambiar — verificar antes de registrar |
| No aplicable | 0 | — |

---

## Advertencia

> ⚠️ **Los precios y límites de los planes gratuitos cambian.** Antes de registrarte en cualquier servicio, verifica los límites actuales en su página de pricing. Los valores citados en esta documentación (500 MB DB en Supabase, 1M eventos/mes en PostHog, 5k errores/mes en Sentry) eran vigentes a agosto 2026 pero pueden haber cambiado.

> ⚠️ **No se inventaron funciones.** Si una funcionalidad no estaba clara en la documentación oficial, se marcó como "verifica en la documentación oficial" en lugar de asumirla.

---

## 8. Fuentes adicionales (Troubleshooting research)

| Servicio | Título | URL | Fecha | Decisión |
|---|---|---|---|---|
| Reddit r/Supabase | Stripe Webhook Signature Verification Fails in Deno | https://www.reddit.com/r/Supabase/comments/1kj1zkb/ | 2026-08-02 | Raw body requirement for webhook |
| Reddit r/Supabase | My Stripe webhook doesn't update my database table | https://www.reddit.com/r/Supabase/comments/1cgcgqd/ | 2026-08-02 | service_role key for webhooks |
| Reddit r/Supabase | Billing on Supabase + Stripe: the edge cases | https://www.reddit.com/r/Supabase/comments/1u8o4od/ | 2026-08-02 | Webhook idempotency + raw body |
| Reddit r/Supabase | Stripe webhook integration, permission denied | https://www.reddit.com/r/Supabase/comments/1ebec61/ | 2026-08-02 | service_role vs anon in Edge Functions |
| Reddit r/Supabase | RLS issue: Correct policies not working | https://www.reddit.com/r/Supabase/ | 2026-08-02 | Common RLS pitfalls |
| Reddit r/Supabase | Is local dev on supabase really hard | https://www.reddit.com/r/Supabase/ | 2026-08-02 | Docker requirement gap |
| Supabase Docs | Redirect URLs | https://supabase.com/docs/guides/auth/redirect-urls | 2026-08-02 | Site URL configuration |
| Stripe Docs | Testing | https://docs.stripe.com/testing | 2026-08-02 | Test card numbers |
| Stripe Docs | Customize redirect behavior | https://docs.stripe.com/payments/checkout/custom-success-page | 2026-08-02 | success_url best practices |
| GitHub Docs | Custom 404 page for Pages | https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site | 2026-08-02 | SPA routing on GitHub Pages |
| PostHog Docs | Privacy | https://posthog.com/docs/privacy | 2026-08-02 | Opt-out and consent |
| Sentry Docs | GDPR and Privacy | https://docs.sentry.io/security-legal-pii-control/ | 2026-08-02 | PII scrubbing |
