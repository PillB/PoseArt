// Audit PR-v7 too_subtle shoulder raises
const vm = require('vm'), fs = require('fs');
let src = fs.readFileSync('js/poses-data.js', 'utf8');
src = src.replace(/^const POSE_CATEGORIES_RAW = /m, 'var POSE_CATEGORIES_RAW = globalThis.POSE_CATEGORIES_RAW = ');
src = src.replace(/^const POSES_LIBRARY = /m, 'var POSES_LIBRARY = globalThis.POSES_LIBRARY = ');
src = src.replace(/^const POSE_CATEGORIES = /m, 'var POSE_CATEGORIES = globalThis.POSE_CATEGORIES = ');
const sb = { window: {}, console, Math, Date, Object, Array, JSON }; sb.globalThis = sb; vm.createContext(sb);
vm.runInContext(src, sb, { filename: 'poses-data.js' });
const lib = sb.POSES_LIBRARY;
const text = fs.readFileSync('js/poses-data.js', 'utf8');
const lines = text.split('\n');
const suspects = [];
for (let i = 0; i < lines.length; i++) {
  if (/PR-v7.*too_subtle|PR-v7.*raise.*shoulder|PR-v7.*arms overhead.*shoulders/i.test(lines[i])) {
    let j = i;
    while (j > 0 && !/^\s*['"][^'"]+['"]\s*:\s*\{/.test(lines[j])) j--;
    const m = /^\s*['"]([^'"]+)['"]\s*:/.exec(lines[j]);
    if (m) {
      const id = m[1];
      const p = lib[id];
      if (p && p.joints) {
        const desc = (p.instructions + ' ' + (p.tip || '')).toLowerCase();
        const overhead = /\b(overhead|arms\s+up|raise\s+.*arms|lift\s+.*arms|skyward)\b/i.test(desc);
        suspects.push({ id, cat: p.category, l: p.joints.leftShoulder, r: p.joints.rightShoulder, overhead, instr: p.instructions.slice(0, 75) });
      }
    }
  }
}
console.log('PR-v7 too_subtle shoulder-raise poses: ' + suspects.length);
console.log('  with overhead desc (CORRECT): ' + suspects.filter(s => s.overhead).length);
console.log('  WITHOUT overhead desc (potential OVERSHOOT): ' + suspects.filter(s => !s.overhead).length);
for (const s of suspects.filter(s => !s.overhead)) {
  console.log('  OVERSHOOT? [' + s.cat + '] ' + s.id + ' L=' + s.l + ' R=' + s.r + ' | ' + s.instr);
}
