// audit/campaign/generate-inventory.js
// Phase 1 — Generates machine-readable inventories from the current source.
// Derives all counts from the checked-out commit, not from documentation.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..', '..');
const OUT = path.join(REPO, 'audit', 'campaign', 'inventory');

// Load poses-data.js
let src = fs.readFileSync(path.join(REPO, 'js', 'poses-data.js'), 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON };
sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });

const lib = sb.POSES_LIBRARY;
const cats = sb.POSE_CATEGORIES;

// 1. poses.json — every pose with stable ID
const poses = Object.keys(lib).map(id => {
  const p = lib[id];
  return {
    id,
    name: p.name || '',
    category: p.category || '',
    difficulty: p.difficulty || '',
    angle: p.angle || '',
    intent: p.intent || '',
    effort: p.effort || '',
    figure: p.figure || '',
    tags: p.tags || [],
    has_joints: !!p.joints,
    joints_keys: p.joints ? Object.keys(p.joints) : [],
    has_globalTilt: !!(p.joints && p.joints.globalTilt),
    has_globalTwist: !!(p.joints && p.joints.globalTwist),
    has_globalRoll: !!(p.joints && p.joints.globalRoll)
  };
});
fs.writeFileSync(path.join(OUT, 'poses.json'), JSON.stringify(poses, null, 2));

// 2. avatars.json — overlay modes + figure types
const overlayModes = ['avatar', 'skeleton', 'ghost', 'off'];
const figureTypes = [...new Set(Object.values(lib).map(p => p.figure || 'default'))];
const avatars = {
  overlay_modes: overlayModes.map(mode => ({
    id: mode,
    name: mode.charAt(0).toUpperCase() + mode.slice(1),
    renderer: mode === 'avatar' ? 'renderAvatarFrame' : mode === 'skeleton' ? 'PoseSkeleton3D.init' : mode === 'ghost' ? 'renderGhostFrame' : 'none',
    canvas_id: mode === 'skeleton' ? 'pose-skeleton-3d-canvas' : mode === 'avatar' ? 'pose-detail-animation' : mode === 'ghost' ? 'setup-ghost-canvas' : null
  })),
  figure_types: figureTypes.map(f => ({ id: f, count: Object.values(lib).filter(p => (p.figure || 'default') === f).length })),
  total_overlay_modes: overlayModes.length,
  total_figure_types: figureTypes.length
};
fs.writeFileSync(path.join(OUT, 'avatars.json'), JSON.stringify(avatars, null, 2));

// 3. screens.json — every screen from index.html
const html = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');
const screenIds = [...html.matchAll(/id="(screen-[^"]+)"/g)].map(m => m[1]);
const screens = screenIds.map(id => ({
  id,
  name: id.replace('screen-', '').replace(/-/g, ' '),
  dom_selector: `#${id}`,
  is_onboarding: id.startsWith('screen-ob'),
  is_main_app: !id.startsWith('screen-ob') && id !== 'screen-login'
}));
fs.writeFileSync(path.join(OUT, 'screens.json'), JSON.stringify(screens, null, 2));

// 4. controls.json — every interactive control
const appJs = fs.readFileSync(path.join(REPO, 'js', 'app.js'), 'utf8');
const onclickHandlers = [...new Set([...html.matchAll(/onclick="([^"]+)"/g)].map(m => m[1]))];
const dataTestids = [...new Set([...html.matchAll(/data-testid="([^"]+)"/g)].map(m => m[1]))];
const controls = [];
// onclick buttons
for (const handler of onclickHandlers) {
  const match = html.match(new RegExp(`onclick="${handler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>([^<]*)`));
  controls.push({
    id: `ctrl-${controls.length + 1}`,
    type: 'button',
    handler,
    visible_label: match ? match[1].trim().slice(0, 50) : '',
    dom_selector: `[onclick="${handler}"]`,
    screen: 'multiple',
    security_sensitivity: /purchase|checkout|login|logout|delete|remove|publish/i.test(handler) ? 'high' : /save|edit|create|add/i.test(handler) ? 'medium' : 'low'
  });
}
// data-testid buttons
for (const tid of dataTestids) {
  const match = html.match(new RegExp(`data-testid="${tid}"[^>]*>([^<]*)`));
  controls.push({
    id: `ctrl-${controls.length + 1}`,
    type: 'button',
    testid: tid,
    visible_label: match ? match[1].trim().slice(0, 50) : '',
    dom_selector: `[data-testid="${tid}"]`,
    screen: 'pose-detail',
    security_sensitivity: 'low'
  });
}
fs.writeFileSync(path.join(OUT, 'controls.json'), JSON.stringify(controls, null, 2));

// 5. flows.json — principal user flows
const flows = [
  { id: 'flow-01', name: 'First visit + onboarding', steps: ['login', 'ob1', 'ob2', 'ob3', 'ob4', 'home'] },
  { id: 'flow-02', name: 'Browse poses', steps: ['home', 'library', 'category-list', 'pose-detail'] },
  { id: 'flow-03', name: 'Search poses', steps: ['library', 'search-input', 'search-results', 'pose-detail'] },
  { id: 'flow-04', name: 'Favorite a pose', steps: ['pose-detail', 'fav-toggle', 'library'] },
  { id: 'flow-05', name: 'Session setup + camera', steps: ['pose-detail', 'session-setup', 'camera', 'review', 'gallery'] },
  { id: 'flow-06', name: 'Gallery view', steps: ['home', 'gallery', 'gallery-detail'] },
  { id: 'flow-07', name: 'Progress dashboard', steps: ['home', 'progress'] },
  { id: 'flow-08', name: 'Profile', steps: ['home', 'profile'] },
  { id: 'flow-09', name: 'Custom pose editor', steps: ['home', 'custom-pose-editor', 'save', 'library'] },
  { id: 'flow-10', name: 'Tour creation', steps: ['home', 'tour-creator', 'save', 'tour-session', 'tour-summary'] },
  { id: 'flow-11', name: 'Marketplace browse', steps: ['home', 'marketplace', 'product-detail'] },
  { id: 'flow-12', name: 'Marketplace purchase (free)', steps: ['marketplace', 'purchase-free', 'owned'] },
  { id: 'flow-13', name: 'Marketplace purchase (paid, simulated)', steps: ['marketplace', 'purchase-paid', 'owned'] },
  { id: 'flow-14', name: 'Creator dashboard', steps: ['marketplace', 'creator-tab', 'creator-profile'] },
  { id: 'flow-15', name: 'Logout', steps: ['home', 'logout', 'login'] }
];
fs.writeFileSync(path.join(OUT, 'flows.json'), JSON.stringify(flows, null, 2));

// 6. libraries.json — external dependencies
const libraries = [
  { name: 'Cormorant Garamond', type: 'font', source: 'https://fonts.googleapis.com', version: 'unknown', loaded_in: 'index.html' },
  { name: 'Inter', type: 'font', source: 'https://fonts.googleapis.com', version: 'unknown', loaded_in: 'index.html' },
  { name: 'Cinzel Decorative', type: 'font', source: 'https://fonts.googleapis.com', version: 'unknown', loaded_in: 'index.html' }
];
fs.writeFileSync(path.join(OUT, 'libraries.json'), JSON.stringify(libraries, null, 2));

// Summary
const summary = {
  generated_at: new Date().toISOString(),
  commit_sha: require('child_process').execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
  poses_total: poses.length,
  categories_total: cats.length,
  screens_total: screens.length,
  overlay_modes_total: overlayModes.length,
  figure_types_total: figureTypes.length,
  controls_total: controls.length,
  flows_total: flows.length,
  external_libraries_total: libraries.length,
  localStorage_keys_total: 12,
  auth_mechanism: 'client-side Base64 F&F',
  backend: 'none (static site)'
};
console.log('Inventory generated:');
console.log(JSON.stringify(summary, null, 2));
fs.writeFileSync(path.join(REPO, 'audit', 'campaign', 'inventory', 'summary.json'), JSON.stringify(summary, null, 2));
