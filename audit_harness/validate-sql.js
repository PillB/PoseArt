// Validate SQL files with pgsql-parser
const fs = require('fs');
const { parse } = require('pgsql-parser');

const files = [
  '/home/z/my-project/PoseArt/docs/backend/sql/001-schema.sql',
  '/home/z/my-project/PoseArt/docs/backend/sql/002-rls.sql',
  '/home/z/my-project/PoseArt/docs/backend/sql/003-seed-development.sql'
];

let totalErrors = 0;
for (const file of files) {
  const sql = fs.readFileSync(file, 'utf8');
  console.log('\n=== ' + file.split('/').pop() + ' ===');
  try {
    const stmts = parse(sql);
    console.log('  Parsed OK: ' + stmts.length + ' statements');
  } catch (e) {
    totalErrors++;
    console.log('  PARSE ERROR: ' + e.message.slice(0, 200));
    const lines = sql.split('\n');
    if (e.line) console.log('  Near line ' + e.line + ': ' + (lines[e.line-1] || '').trim());
  }
}
console.log('\n=== Total parse errors: ' + totalErrors + ' ===');
process.exit(totalErrors > 0 ? 1 : 0);
