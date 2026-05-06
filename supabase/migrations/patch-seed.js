const fs = require('fs');
const path = require('path');

const REAL_UUID = 'YOUR_REAL_UUID'; // <-- PUT YOUR REAL UUID HERE

const inputFile = path.join(__dirname, 'supabase', 'migrations', '010_seed_content.sql');
const outputFile = path.join(__dirname, 'supabase', 'migrations', '010_seed_content_patched.sql');

let sql = fs.readFileSync(inputFile, 'utf8');

// 1) Remove auth.users insert block (matches your exact marker/comment)
sql = sql.replace(
  /-- ─── Seed auth users \(bypasses trigger; runs as postgres\)[\s\S]+?on conflict \(id\) do nothing;\n\n/,
  ''
);

// 2) Remove profiles insert block
sql = sql.replace(
  /-- ─── Seed profiles[\s\S]+?on conflict \(id\) do nothing;\n\n/,
  ''
);

// 3) Replace *all* occurrences of fake seed UUIDs with REAL_UUID
sql = sql.replace(/'00000000-seed-[^']+'/g, `'${REAL_UUID}'`);

fs.writeFileSync(outputFile, sql, 'utf8');
console.log('✅ Patched seed file written to:', outputFile);