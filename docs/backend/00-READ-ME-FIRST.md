# 00 — LÉEME PRIMERO: Guía para principiantes

> **Objetivo de este documento:** Explicarte en lenguaje sencillo qué tiene PoseArt hoy, qué le falta, y qué vas a hacer paso a paso para convertirlo en una aplicación real con usuarios, pagos y datos seguros.

---

## ¿Qué es PoseArt hoy?

PoseArt es una aplicación web hecha con **HTML, CSS y JavaScript puro** (sin React, sin Next.js, sin frameworks). Funciona como una página estática desplegada en **GitHub Pages**.

Tiene:
- Una biblioteca de **745 poses** dibujadas con un esqueleto 3D procedural.
- Una cámara con overlay de esqueleto fantasma para guiar poses en vivo.
- Un editor de poses personalizadas.
- Un motor de tours (secuencias de poses).
- Una galería de fotos capturadas.
- Un marketplace con packs de poses (gratis y pagados).
- Un sistema de progreso y favoritos.

**Pero todo eso vive solo en el navegador del usuario.** No hay servidor, no hay base de datos, no hay usuarios reales.

---

## ¿Cuál es el problema?

| Problema | Explicación sencilla |
|---|---|
| **Contraseñas visibles** | Las credenciales de prueba (`tester1` a `tester10`, contraseña `PoseArt2026!`) están escritas en el archivo `js/auth.js` codificadas en Base64. Cualquiera que abra las DevTools del navegador puede leerlas. Base64 **no es encriptación**, es solo codificación. |
| **Compras falsas** | Cuando "compras" un pack pagado, la aplicación muestra "Processing payment..." con un `setTimeout` y luego lo añade a tu lista. No hay pago real. Un usuario puede modificar `localStorage` para regalarse cualquier pack. |
| **Datos atrapados en un dispositivo** | Tus favoritos, tours, galería y progreso se guardan en `localStorage` del navegador. Si cambias de teléfono o limpias el navegador, pierdes todo. No se sincronizan entre dispositivos. |
| **Sin aislamiento entre usuarios** | Como no hay servidor, no hay forma de verificar que el usuario A no pueda ver los datos del usuario B. Cada navegador es un islote aislado. |
| **Sin fuente de verdad para "Pro"** | No existe un servidor que diga "este usuario pagó". El navegador no puede decidir eso de forma confiable. |
| **Fotos en el navegador** | Las fotos capturadas se guardan como Base64 en `localStorage`. Nunca salen del navegador (bueno para privacidad, pero limita la funcionalidad). |

---

## ¿Qué vamos a hacer?

Vamos a añadir un backend **sin reescribir tu aplicación**. Tu HTML, CSS y JavaScript siguen igual. Solo añadiremos una capa de datos que vive en un servidor.

### Arquitectura recomendada

```
┌──────────────────────────────────────────────────────────────┐
│  TU APLICACIÓN (sin cambios)                                  │
│  HTML + CSS + JS vanilla                                      │
│  Desplegada en GitHub Pages / Hostinger / Vercel              │
└──────────────┬───────────────────────────────────────────────┘
               │
               │  HTTPS (fetch)
               │
┌──────────────▼───────────────────────────────────────────────┐
│  SUPABASE (backend gestionado)                                │
│  ├── Auth (registro, login, recuperación, email verify)       │
│  ├── PostgreSQL (base de datos relacional)                    │
│  ├── Row Level Security (aislamiento entre usuarios)          │
│  ├── Storage (archivos privados, si se necesitan)             │
│  └── Edge Functions (webhooks, checkout, lógica de servidor)  │
└──────────────┬───────────────────────────────────────────────┘
               │
               │  HTTPS (API)
               │
┌──────────────▼───────────────────────────────────────────────┐
│  STRIPE (pagos)                                               │
│  ├── Checkout (página de pago hosted)                         │
│  ├── Customer Portal (gestión de suscripción)                 │
│  ├── Webhooks (notificación de eventos de pago)               │
│  └── Modo de prueba (test mode) durante toda la implementación│
└──────────────────────────────────────────────────────────────┘
```

### Servicios elegidos

| Servicio | Para qué | Coste inicial | Por qué |
|---|---|---|---|
| **Supabase** | Auth, base de datos, RLS, funciones | Gratis (500 MB DB, 50k usuarios) | Compatible con JS vanilla, PostgreSQL real, RLS nativo |
| **Stripe** | Pagos y suscripciones | Solo comisión por transacción (2.9% + 30¢) | Estándar de la industria, Checkout hosted, Customer Portal |
| **PostHog** | Analytics de producto | Gratis (1M eventos/mes) | Self-hostable, sin límites de evento, taxonomía custom |
| **Sentry** | Tracking de errores | Gratis (5k errores/mes) | Detección automática de errores JS |

> **Nota:** Estos costes son los del plan gratuito vigente a fecha de agosto 2026. Verifica los precios actuales en los sitios oficiales antes de registrarte. Ver `docs/backend/SOURCE-LEDGER.md` para las fuentes.

---

## Orden recomendado de implementación

Sigue los documentos en orden numérico. No te saltes pasos.

| Paso | Documento | Qué consigues | Tiempo estimado |
|---|---|---|---|
| 1 | `01-CURRENT-STATE-AUDIT.md` | Entender qué tienes hoy | 20 min (lectura) |
| 2 | `02-ARCHITECTURE-DECISION.md` | Confirmar la arquitectura | 20 min (lectura) |
| 3 | `05-LOCAL-SETUP.md` | Supabase CLI funcionando local | 1-2 horas |
| 4 | `03-DATA-MODEL.md` | Esquema SQL desplegado | 1 hora |
| 5 | `04-AUTH-AND-RLS.md` | Auth real + RLS activado | 2-3 horas |
| 6 | `10-LOCALSTORAGE-MIGRATION.md` | Adaptador de datos | 2 horas |
| 7 | `07-BILLING-AND-SUBSCRIPTIONS.md` | Stripe Checkout + webhooks | 3-4 horas |
| 8 | `08-MARKETPLACE-AND-PURCHASES.md` | Compras reales | 2-3 horas |
| 9 | `09-ANALYTICS-AND-OBSERVABILITY.md` | Analytics + errores | 1-2 horas |
| 10 | `06-DOMAIN-HOSTING-DEPLOYMENT.md` | Dominio + HTTPS + deploy | 1-2 horas |
| 11 | `11-TESTING-AND-SECURITY-CHECKLIST.md` | Pruebas de seguridad | 2-3 horas |
| 12 | `12-OPERATIONS-PRIVACY-AND-BACKUPS.md` | Backups + privacidad | 1 hora |

**Total estimado:** 17-25 horas de trabajo, distribuidas en varios días.

---

## Advertencias críticas

> ⚠️ **NUNCA pongas secretos en el código del navegador.**
> Las claves `anon` de Supabase y `publishable key` de Stripe son públicas y seguras en el navegador. Las claves `service_role` de Supabase y `secret_key` de Stripe **solo viven en el servidor** (Edge Functions o variables de entorno).

> ⚠️ **NUNCA guardes contraseñas tú mismo.**
> Supabase Auth las gestiona con bcrypt + salts. Tú nunca ves ni tocas la contraseña del usuario.

> ⚠️ **NUNCA confíes en el navegador para decidir quién es Pro.**
> El navegador muestra la UI. El servidor confirma el entitlement. Si el navegador dice "eres Pro" pero el servidor dice "no", gana el servidor.

> ⚠️ **NUNCA uses el retorno de Checkout como prueba de pago.**
> Stripe Checkout redirige a una URL de éxito, pero eso no prueba que el pago se completó. Solo el **webhook verificado** confirma el pago.

> ⚠️ **NO borres `localStorage` todavía.**
> La migración es gradual. Tus usuarios actuales tienen datos en `localStorage`. Hay que migrarlos al backend antes de borrarlos.

> ⚠️ **NO rompas la cámara, la galería, el editor, los tours ni el marketplace.**
> Tu aplicación funciona. Solo añadimos una capa de datos debajo. Si algo se rompe, el modo legacy (localStorage) sigue funcionando como respaldo.

---

## Datos que necesitas decidir

Antes de empezar, reúne esta información. Si no la tienes todavía, no te detengas: declara un supuesto y continúa.

| Dato | Por qué se necesita | Si no lo tienes |
|---|---|---|
| Dominio | Configurar URLs de redirección de auth y Stripe | Usa `https://pillb.github.io/PoseArt/` temporalmente |
| Hosting | Saber dónde desplegar y configurar CORS | GitHub Pages (ya funciona) |
| País de operación | Impuestos, cumplimiento legal, disponibilidad de Stripe | Decláralo cuando lo tengas |
| País de cuenta de pagos | Disponibilidad de Stripe, moneda | Verifica en stripe.com/global |
| Moneda principal | Configurar precios en Stripe | USD por defecto |
| ¿Pagos a creadores? | Decide si necesitas Stripe Connect | NO por defecto (MVP) |
| ¿Fotos en la nube? | Decide si necesitas Storage privado | NO por defecto (MVP) |

---

## ¿Qué NO va a pasar?

- **No vamos a reescribir tu app en React/Next.js.** Tu HTML+CSS+JS sigue igual.
- **No vamos a añadir microservicios ni colas de mensajes.** Un backend gestionado (Supabase) es suficiente.
- **No vamos a almacenar fotos en la nube por defecto.** Las fotos siguen en el navegador. Si más adelante quieres sincronizarlas, lo añadimos con consentimiento explícito.
- **No vamos a implementar pagos a creadores en el MVP.** La regla 70/30 se documenta como regla de negocio, pero no se programa hasta que haya obligaciones legales y fiscales claras.
- **No vamos a hacer cambios destructivos en producción.** Todo se prueba en local/staging primero.

---

## Siguiente paso

Abre `docs/backend/01-CURRENT-STATE-AUDIT.md` para ver el inventario real del repositorio.
