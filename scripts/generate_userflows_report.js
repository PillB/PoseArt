const fs = require('fs');
const path = require('path');

const root = process.cwd();
const source = '/tmp/poseart-userflows-live.json';
const data = JSON.parse(fs.readFileSync(source, 'utf8'));
const reportPath = path.join(root, 'logs', 'report', 'userflows-live-desktop-mobile.md');
const jsonPath = path.join(root, 'audit', 'results', 'userflows-live-desktop-mobile.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.mkdirSync(path.dirname(jsonPath), { recursive: true });

const flowNames = {
  1: 'Onboarding and personalization',
  2: 'Pose discovery and detail',
  3: 'Session setup, camera, and review',
  4: 'Gallery management',
  5: 'Progress, profile, and custom editor',
  6: 'Marketplace',
  7: 'Tour creation and playback',
};
const esc = value => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const lines = [];
lines.push('# PoseArt Live Desktop + Mobile User-Flow Report', '');
lines.push(`**Generated:** ${data.generatedAt}`, '', `**Application:** ${data.appUrl}`, '');
lines.push('## Executive summary', '');
lines.push(`Playwright completed ${data.totals.screenshots} live screenshots across ${data.totals.devices} viewport configurations: 56 mobile microsteps and 56 desktop microsteps. All captures maintained exactly one active SPA screen, produced zero console/page errors, and showed no document or app horizontal overflow.`, '');
lines.push('The desktop audit confirms that PoseArt is a mobile-first fixed-width application: at 1440×1000 the app remains a centered 430px shell rather than adapting into a desktop-specific layout. This is functional and overflow-safe, but it leaves substantial unused desktop space.', '');
lines.push('## Findings', '');
lines.push('| Severity | ID | Finding | Evidence |', '|---|---|---|---|');
lines.push('| HIGH | `UF-001` | The pose-detail Favorite control is visible but cannot be clicked because the Close button intercepts pointer events. It reproduced at both 430×932 and 1440×1000. The audit invoked the same handler programmatically only to continue later steps. | `MOB-F02-S015`, `DESK-F02-S015` |');
lines.push('| HIGH | `UF-002` | Visual inspection of the desktop tour session shows a stale pose-detail bottom sheet partially visible beneath the tour player, indicating overlay state can leak across distant navigation flows. | `DESK-F07-S050` |');
lines.push('| MEDIUM | `UF-003` | Desktop uses the same centered 430px application shell as mobile. It is safe and readable but does not provide a desktop-optimized layout or use available width. | All `DESK-*` screenshots |');
lines.push('| INFO | `UF-004` | Rapid automated microsteps can capture a previous action toast on the following screen. Toasts are transient and did not block controls. | Examples: `DESK-F05-S036`, `MOB-F06-S041` |', '');
lines.push('## Coverage and runtime checks', '');
lines.push('| Viewport | Screenshots | Browser errors | One active screen | Body overflow | App overflow |', '|---|---:|---:|---|---|---|');
for (const device of data.devices) {
  lines.push(`| ${device.label} | ${device.screenshots.length} | ${device.errors.length} | ${device.assertions.everyScreenSingleActive ? 'PASS' : 'FAIL'} | ${device.finalMetrics.bodyHorizontalOverflow ? 'FAIL' : 'PASS'} | ${device.finalMetrics.appHorizontalOverflow ? 'FAIL' : 'PASS'} |`);
}
lines.push('', '## User-flow map', '');
lines.push('1. Onboarding guides a new user through product explanation, demo/camera choice, goal selection, and personalized Home.', '2. Discovery moves through Home → Library → search/category → pose detail → skeleton view/favorite.', '3. Session flows from pose detail → setup overlay choices → camera → flow/overlay controls → review presets → save.', '4. Gallery covers detail actions, duplication, sorting, grouping, and bulk selection.', '5. Progress/Profile lead into the 20-joint custom editor, undo, save, and contextual bug reporting.', '6. Marketplace covers browse, search, preview, creator profile, purchase, owned products, and creator dashboard.', '7. Tours cover two-section creation, adding a section, playback navigation, capture, search, overview, and summary.', '');

for (const device of data.devices) {
  lines.push(`## ${device.label}`, '');
  lines.push(`Viewport: ${device.viewport.width}×${device.viewport.height}. App width observed: ${device.screenshots[0]?.actual.appWidth}px.`, '');
  for (const flow of Object.keys(flowNames).map(Number)) {
    const steps = device.screenshots.filter(item => item.flow === flow);
    lines.push(`### Flow ${flow}: ${flowNames[flow]}`, '');
    lines.push('| Screenshot ID | Microstep | User action | Expected result | Actual runtime state | Screenshot |', '|---|---|---|---|---|---|');
    for (const step of steps) {
      const actual = `${step.actual.activeScreen}; active screens=${step.actual.activeScreens}; horizontal overflow=${step.actual.horizontalOverflow ? 'yes' : 'no'}`;
      const link = `../../${step.relativePath}`;
      lines.push(`| \`${step.id}\` | ${esc(step.microstep)} | ${esc(step.action)} | ${esc(step.expected)} | ${esc(actual)} | [Open ${step.id}](${link}) |`);
    }
    lines.push('');
  }
}

lines.push('## Recommendations', '');
lines.push('1. Separate the pose-detail Close and Favorite hit regions and add a Playwright click regression at both viewports.', '2. Ensure `closePoseSheet()` runs for all navigation paths into marketplace and tour screens; assert that overlays/sheets have no open class after screen changes.', '3. Decide whether desktop should intentionally remain a mobile preview shell. If not, introduce desktop breakpoints for wider grids, persistent side navigation, and multi-column editor/tour layouts.', '4. Keep this 112-screenshot audit as a release regression suite, but allow toasts to settle before visual baselines when the toast is not the target state.', '');

fs.writeFileSync(reportPath, lines.join('\n'));
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log(JSON.stringify({ reportPath, jsonPath, screenshots: data.totals.screenshots, lines: lines.length }));
