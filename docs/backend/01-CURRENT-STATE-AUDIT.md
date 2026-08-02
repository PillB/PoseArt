# 01 — Auditoría del estado actual

> **Propósito:** Inventariar lo que PoseArt tiene hoy en producción, cómo maneja datos, seguridad y las deudas técnicas que deben resolverse.

---

## Metadatos de inspección

| Campo | Valor |
|---|---|
| Repositorio | https://github.com/PillB/PoseArt |
| Rama inspeccionada | `master` |
| Commit SHA | `8fa836ee2f1fe0e7f63cdce26905f7e1facf1258` |
| Fecha del commit | 2026-08-01 21:40:12 -0500 |
| Despliegue | GitHub Pages — https://pillb.github.io/PoseArt/ |

### Archivos principales revisados

| Archivo | Líneas | Función |
|---|---|---|
| `index.html` | ~3,400 | Estructura SPA, pantallas, estilos inline |
| `js/auth.js` | 83 | Autenticación F&F (demo) |
| `js/app.js` | ~2,770 | Controlador principal, estado, marketplace, tours, editor |
| `js/poses-data.js` | ~7,940 | Biblioteca de 745 poses + persistencia localStorage |
| `js/pose-skeleton-3d.js` | ~1,710 | Renderer 3D del esqueleto (canvas) |
| `js/camera.js` | ~730 | Cámara, overlay, captura, autocapture |
| `js/tour-engine.js` | 125 | Motor de tours/secuencias |
| `js/pose-animations.js` | 216 | Animaciones de entrada |
| `.github/workflows/deploy.yml` | 35 | Deploy a GitHub Pages |

---

## 1. Autenticación actual

### Archivo: `js/auth.js`

**Mecanismo:** 10 credenciales pre-creadas (Friends & Family) codificadas en Base64.

```javascript
// js/auth.js (líneas 7-20)
const encodedPassword = 'UG9zZUFydDIwMjYh';  // Base64 de "PoseArt2026!"
const credentials = Object.freeze([
  { u: 'dGVzdGVyMQ==', p: encodedPassword },  // tester1
  { u: 'dGVzdGVyMg==', p: encodedPassword },  // tester2
  // ... tester3 a tester10
]);
```

**Sesión:** Se guarda en `sessionStorage` con clave `poseart_auth_session`:
```json
{ "version": 1, "user": "tester1", "authenticatedAt": 1722600000000 }
```

### Problemas de seguridad

| Problema | Severidad | Evidencia |
|---|---|---|
| Contraseñas en el código fuente público | **CRÍTICO** | `encodedPassword = 'UG9zZUFydDIwMjYh'` en `js/auth.js:8` — decodifica a `PoseArt2026!` |
| Base64 no es encriptación | **CRÍTICO** | `atob('UG9zZUFydDIwMjYh')` → `PoseArt2026!` en cualquier consola de navegador |
| Sin registro de usuarios | **ALTO** | No existe flujo de signup; los usuarios son pre-creados |
| Sin recuperación de contraseña | **ALTO** | No hay flujo de reset |
| Sin verificación de email | **ALTO** | No hay emails |
| Sin MFA | **MEDIO** | No hay segundo factor |
| Sesión manipulable | **ALTO** | Cualquiera puede escribir en `sessionStorage` un JSON válido y simular login |
| Sin roles | **MEDIO** | No hay admin/moderador/creador; todos son iguales |

### Decodificación de credenciales (prueba Red)

```bash
# Ejecutar en terminal:
echo 'UG9zZUFydDIwMjYh' | base64 -d
# Resultado: PoseArt2026!
echo 'dGVzdGVyMQ==' | base64 -d
# Resultado: tester1
```

**Estado:** Ejecutado y aprobado. Las credenciales son legibles por cualquiera.

---

## 2. Almacenamiento local

### Archivo: `js/poses-data.js` (funciones `persist` / `restore`, líneas 7780-7800)

```javascript
function persist(key, data) {
  try {
    localStorage.setItem('poseart_' + key, JSON.stringify(data));
    return true;
  } catch (e) { return false; }
}
function restore(key) {
  try { return JSON.parse(localStorage.getItem('poseart_' + key) || 'null'); }
  catch (e) { return null; }
}
```

### Claves localStorage inventariadas

| Clave (`poseart_*`) | Archivo que la usa | Tipo de dato | Tamaño típico | Sensibilidad |
|---|---|---|---|---|
| `onboardingCompleted` | app.js:322 | boolean | 4 bytes | Baja |
| `selectedGoal` | app.js:305 | string | 10 bytes | Baja |
| `sessionOptions` | app.js:77 | object (timer, sensitivity) | 50 bytes | Baja |
| `favorites` | poses-data.js:7840 | array de pose IDs | 0.5-2 KB | Baja |
| `gallery` | poses-data.js:7800 | array de {dataUrl, poseId, score, ...} | **5-50 MB** | **Alta** (fotos Base64) |
| `sessionHistory` | poses-data.js:7831 | array de sesiones (max 50) | 10-100 KB | Media |
| `editorCustomPoses` | app.js:2138 | array de poses personalizadas | 10-500 KB | Media |
| `tours` | poses-data.js:7851 | array de tours con secciones | 10-200 KB | Media |
| `marketplacePacks` | app.js:2281 | array de packs (seed + creados) | 5-50 KB | Media |
| `marketplaceReviews` | app.js:2287 | objeto {packId: [reviews]} | 1-20 KB | Baja |
| `ownedPacks` | app.js:2283 | array de pack IDs | 0.1-1 KB | **Alta** (controla acceso) |
| `publishedPacks` | app.js:2285 | array de packs publicados | 5-50 KB | Media |

### Problemas del almacenamiento local

| Problema | Severidad | Impacto |
|---|---|---|
| No se sincroniza entre dispositivos | **ALTO** | Usuario pierde datos al cambiar de dispositivo |
| No hay aislamiento entre usuarios | **CRÍTICO** | En un dispositivo compartido, cualquier usuario ve los datos de otro |
| `ownedPacks` es manipulable | **CRÍTICO** | Usuario puede regalarse packs pagados editando localStorage |
| `gallery` almacena fotos Base64 | **MEDIO** | Consume 5-50 MB de localStorage; puede exceder cuota (5-10 MB típico) |
| No hay backup ni restauración | **ALTO** | Si el navegador se limpia, se pierde todo |
| No hay control de versiones | **MEDIO** | Poses/tours personalizados no tienen historial de cambios |

---

## 3. Galería y capturas

### Archivo: `js/camera.js` (función `captureImage`, línea 597)

```javascript
captureImage(isAuto = false) {
  // ... dibuja video frame a canvas ...
  dataUrl = reviewCanvas.toDataURL('image/png');
  // ... guarda en gallery ...
  addToGallery({ id, dataUrl, poseId, poseName, score, timestamp, filters, favorite });
}
```

**Flujo de datos:**
1. Cámara captura frame → canvas → `toDataURL('image/png')` → string Base64
2. Se guarda en array `_gallery` en `localStorage` (clave `poseart_gallery`)
3. **Nunca sale del navegador** (no hay upload a servidor)

**Privacidad:** Buena por defecto — las fotos no se suben. Pero:
- No hay consentimiento explícito documentado
- No hay política de retención
- Si se habilita sync en el futuro, hay que diseñar storage privado con URLs firmadas

---

## 4. Marketplace y compras simuladas

### Archivo: `js/app.js` (función `purchasePack`, línea 2389)

```javascript
window.purchasePack = function(packId) {
  const pack = _marketplacePacks.find(p => p.id === packId);
  if (_ownedPacks.includes(packId)) { showToast('Already owned'); return; }
  if (pack.price === 0) {
    // Free pack — instant "purchase"
    _ownedPacks.push(packId);
    window.persist?.('ownedPacks', _ownedPacks);
  } else {
    // Paid pack — MOCK checkout
    showToast('Processing payment of $' + pack.price.toFixed(2) + '...');
    setTimeout(() => {
      _ownedPacks.push(packId);
      pack.sales++;
      window.persist?.('ownedPacks', _ownedPacks);
      showToast('Purchase complete! ' + pack.name + ' added ✓');
    }, 800);
  }
};
```

### Problemas del checkout simulado

| Problema | Severidad | Evidencia |
|---|---|---|
| No hay pago real | **CRÍTICO** | `setTimeout` simula procesamiento; no hay Stripe |
| Precio viene del cliente | **CRÍTICO** | `pack.price` se lee de `_marketplacePacks` en localStorage |
| Sin webhook de confirmación | **CRÍTICO** | No hay verificación de pago |
| `ownedPacks` manipulable | **CRÍTICO** | `localStorage.setItem('poseart_ownedPacks', '["mp-boudoir-classic"]')` regala cualquier pack |
| Sin idempotencia | **ALTO** | Si se llama dos veces, añade dos veces (aunque el guard check lo mitiga parcialmente) |
| Sin historial de compras | **ALTO** | No hay tabla de órdenes; solo un array de IDs |
| Sin reembolsos | **MEDIO** | No hay mecanismo |

### Datos del marketplace

**Seed packs** (app.js:2271-2277): 6 packs pre-creados con precios hardcoded:
- `mp-free-essentials` — $0 (12 poses standing)
- `mp-boudoir-classic` — $4.99
- `mp-editorial-edge` — $3.99
- `mp-fashion-runway` — $2.99
- `mp-fineart-classical` — $0
- `mp-couple-intimate` — $5.99

**Regla de negocio documentada:** 70% creador / 30% plataforma (app.js:2265). No implementada.

---

## 5. Poses personalizadas y tours

### Poses personalizadas

**Archivo:** `js/app.js` (líneas 2115-2182)

```javascript
window.saveCustomPose = function() {
  const customPose = { id: 'custom-' + Date.now(), name, joints, ... };
  _editorCustomPoses.unshift(customPose);
  window.persist?.('editorCustomPoses', _editorCustomPoses);
  POSES_LIBRARY[poseId] = customPose;
};
```

- Se guardan en `poseart_editorCustomPoses`
- Se registran en `POSES_LIBRARY` en runtime
- **Sin versionado:** si se edita una pose, se pierde la versión anterior
- **Sin publicación:** no hay flujo de "publicar al marketplace"

### Tours

**Archivo:** `js/tour-engine.js` + `js/poses-data.js` (líneas 7851-7860)

```javascript
const _tours = Array.isArray(restore('tours')) ? restore('tours') : [];
function saveTour(tour) {
  const idx = _tours.findIndex(t => t.id === tour.id);
  if (idx > -1) _tours[idx] = tour; else _tours.unshift(tour);
  persist('tours', _tours);
  return JSON.parse(JSON.stringify(tour));
}
```

- Se guardan en `poseart_tours`
- Estructura: `{ id, name, description, sections: [{ id, name, type, poseIds: [] }], createdAt, updatedAt }`
- **Sin versionado**
- Se pueden publicar al marketplace via `publishTourToMarketplace` (app.js:2492)

---

## 6. Favoritos, progreso y sesiones

### Favoritos
- `poseart_favorites`: array de pose IDs
- Funciones: `getFavorites()`, `toggleFavorite(poseId)`, `isFavorite(poseId)` (poses-data.js:7840-7848)

### Progreso
- `AppState.sessionCount`, `AppState.capturedCount` (en memoria, no persisten)
- `poseart_sessionHistory`: array de sesiones (max 50)
- Shape: `{ id, poseId, poseName, timestamp, duration, capturedCount, tourId?, sectionId? }`

### Bug reports
- `js/app.js:2221` — `submitBugReportFromEditor`
- Se guardan en `window._bugReports` (array en memoria, **no persisten**)
- Shape: `{ id, poseId, joints, timestamp, description }`

---

## 7. Despliegue

### GitHub Actions

**Archivo:** `.github/workflows/deploy.yml`

```yaml
name: Deploy PoseArt to GitHub Pages
on:
  push:
    branches: [master]
permissions:
  contents: read
  pages: write
  id-token: write
```

- Despliega automáticamente en push a `master`
- URL: https://pillb.github.io/PoseArt/
- **Sin build step** (archivos estáticos directos)
- **Sin variables de entorno** (no hay `.env` en producción)

---

## 8. Verificación de secretos comprometidos

### Búsqueda realizada

```bash
# Comando ejecutado:
grep -rni "api.key\|secret\|token\|password\|STRIPE\|SUPABASE\|sk_live\|sk_test\|service_role\|anon_key" js/*.js index.html
```

### Resultado

| Hallazgo | Severidad | Acción |
|---|---|---|
| `encodedPassword = 'UG9zZUFydDIwMjYh'` en auth.js | **CRÍTICO** | Eliminar en la migración a Supabase Auth |
| No se encontraron claves de Stripe/Supabase | N/A | No hay integración todavía |
| No se encontraron `.env` ni archivos de configuración | N/A | No hay backend |

**Estado:** Ejecutado y aprobado. El único secreto comprometido es la contraseña F&F, que se elimina al migrar a auth gestionado.

---

## 9. Mapa de datos locales a migrar

| Origen (localStorage) | Destino (PostgreSQL) | Tipo de migración |
|---|---|---|
| `poseart_onboardingCompleted` | `profiles.onboarding_completed` | Campo en perfil |
| `poseart_selectedGoal` | `profiles.selected_goal` | Campo en perfil |
| `poseart_sessionOptions` | `user_preferences` (tabla) | Registro por usuario |
| `poseart_favorites` | `favorites` (tabla) | Filas por usuario |
| `poseart_gallery` | `captures` (tabla) + Storage | **No migrar por defecto** (fotos); solo metadatos si se habilita |
| `poseart_sessionHistory` | `pose_sessions` (tabla) | Filas por usuario |
| `poseart_editorCustomPoses` | `poses` (tabla, visibility=private) | Filas por usuario |
| `poseart_tours` | `tours` (tabla, visibility=private) | Filas por usuario |
| `poseart_marketplacePacks` | `products` (tabla) | Solo los creados por el usuario; los seed son oficiales |
| `poseart_marketplaceReviews` | `reviews` (tabla) | Filas por usuario |
| `poseart_ownedPacks` | `entitlements` (tabla) | **NO migrar directamente** — requiere verificación de compra |
| `poseart_publishedPacks` | `products` (tabla, status=published) | Filas por usuario |

---

## 10. Deuda técnica resumida

| # | Deuda | Severidad | Se resuelve en |
|---|---|---|---|
| 1 | Credenciales en Base64 en código público | CRÍTICO | `04-AUTH-AND-RLS.md` |
| 2 | Compras simuladas sin pago real | CRÍTICO | `07-BILLING-AND-SUBSCRIPTIONS.md` |
| 3 | `ownedPacks` manipulable desde DevTools | CRÍTICO | `08-MARKETPLACE-AND-PURCHASES.md` |
| 4 | Sin aislamiento entre usuarios | CRÍTICO | `04-AUTH-AND-RLS.md` (RLS) |
| 5 | Sin fuente de verdad para Pro | CRÍTICO | `07-BILLING-AND-SUBSCRIPTIONS.md` (entitlements) |
| 6 | Sin sincronización entre dispositivos | ALTO | `10-LOCALSTORAGE-MIGRATION.md` |
| 7 | Sin backup ni restauración | ALTO | `12-OPERATIONS-PRIVACY-AND-BACKUPS.md` |
| 8 | Sin versionado de poses/tours | MEDIO | `03-DATA-MODEL.md` (pose_versions, tour_versions) |
| 9 | Bug reports no persisten | MEDIO | `03-DATA-MODEL.md` (bug_reports) |
| 10 | Sin analytics | MEDIO | `09-ANALYTICS-AND-OBSERVABILITY.md` |
| 11 | Sin error tracking | MEDIO | `09-ANALYTICS-AND-OBSERVABILITY.md` |
| 12 | Fotos Base64 en localStorage (cuota) | MEDIO | `10-LOCALSTORAGE-MIGRATION.md` (no migrar fotos por defecto) |

---

## 11. Diferencias entre README y código real

| README dice | Código real |
|---|---|
| "761 poses across 16 categories" | `Object.keys(POSES_LIBRARY).length` = **745 poses** |
| "780 GIFs" | Directorio `gifs/` tiene **~200 archivos** (no 780) |
| "10 F&F credentials" | Confirmado: 10 credenciales (tester1-10) |
| "Pure static files, no build step" | Confirmado: no hay `package.json` ni build |
| "Server: python3 http.server 8095" | Confirmado para desarrollo local |
| "Last Deployed Preview URL: perplexity.ai" | Ya no aplica — desplegado en GitHub Pages |

**Estado:** Verificado. El README tiene conteos desactualizados pero la arquitectura descrita es correcta.

---

## Update Log (2026-08-02)

### Security findings status update

| ID | Original severity | Current status | Change |
|---|---|---|---|
| SEC-01 | P1 | Still open | No change — requires backend |
| SEC-02 | P1 | Still open | No change — requires backend |
| SEC-03 | P1 | Still open | No change — requires backend |
| SEC-04 | P2 | **FIXED** | CSP meta tag added to index.html |
| SEC-05 | P1 | Still open | No change — requires Stripe |

### New files added since original audit

| File | Purpose | Lines |
|---|---|---|
| `js/analytics.js` | Analytics instrumentation stub (PostHog-ready, no-op safe) | 146 |
| `docs/marketing/behavioural-marketing-review.md` | Behavioural science & marketing review | 446 |
| `docs/qa/manual-interaction-specifications.md` | Black-box interaction test specs | 516 |
| `docs/qa/interactive-control-inventory.json` | 85 interactive controls inventoried | 2047 |
| `docs/qa/black-box-test-report.md` | Black-box test results | 216 |
| `audit/campaign/` | Solarize campaign artifacts (inventory, threat model, reports) | 16+ files |
| `audit_harness/` | Pose validation harness (geometry sweep, sign-fix scripts) | 21+ scripts |

### UI changes since original audit

| Change | File | Description |
|---|---|---|
| CSP meta tag | index.html | `Content-Security-Policy` header via meta tag |
| Marketplace button | index.html | "Browse Packs" button on home → `openMarketplace()` |
| Streak counter | index.html + js/app.js | "Day Streak" in quick-stats (Zeigarnik effect) |
| Login subtitle | index.html | Community description (social proof) |
| Login CTA | index.html | "Enter PoseArt →" (arrow added) |
| OB1 subtitle | index.html | "Master 745 studio-quality poses..." (value proposition) |
| OB1 CTA | index.html | "See How It Works" (curiosity-driven) |
| SEO meta tags | index.html | Open Graph + Twitter Card |
| Marketplace label | index.html | "Move like art. Pose with purpose." (brand tagline) |
| Logout cleanup | js/app.js | Clears username + password fields |
| Personalized greeting | js/app.js | Reflects onboarding persona |
| Ownership framing | js/app.js | "✓ [pack] is now in your library" |
| Empty state CTA | js/app.js | Marketplace "My Packs" → "Browse Packs" button |
| Analytics calls | js/app.js | 6 events: login, onboarding, session, checkout |

### Pose defect status

| Metric | Original (Phase 0) | Current |
|---|---|---|
| MAJOR pose defects | 100 | **0** |
| Total poses corrected | 0 | 451 |
| Sweep false-positive patterns fixed | 0 | 49 |
| Renderer sign comments corrected | 0 | 5 (globalTilt, hipAbduct, shoulderFwd, spine, neck) |
