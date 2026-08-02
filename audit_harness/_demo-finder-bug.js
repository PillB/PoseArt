// Demo the PR-comment-finder bug
const fs = require('fs');
const text = fs.readFileSync('js/poses-data.js', 'utf8');
const id = 'cross-ankle-sit';
const idPattern = new RegExp("['\"]" + id + "['\"]\\s*:\\s*\\{");
const m = idPattern.exec(text);
const poseStart = m.index;
const jIdx = text.indexOf('joints', poseStart);
console.log('First indexOf(joints) from pose start:');
console.log('  char ' + jIdx + ': ' + JSON.stringify(text.slice(jIdx - 60, jIdx + 20)));
