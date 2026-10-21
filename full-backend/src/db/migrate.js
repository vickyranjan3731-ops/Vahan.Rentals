import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🚀 Running database migration on Turso DB...');
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ schema.sql file not found at:', schemaPath);
    process.exit(1);
  }

  const rawSql = fs.readFileSync(schemaPath, 'utf8');

  // Strip line comments (-- comment) and block comments (/* comment */)
  const cleanSql = rawSql
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--.*$/gm, '');

  // Split SQL commands by semicolon
  const statements = cleanSql
    .split(';')
    .map(st => st.trim())
    .filter(st => st.length > 0);

  console.log(`📋 Found ${statements.length} SQL statements to execute.`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await db.execute(stmt);
      console.log(`  ✅ [${i + 1}/${statements.length}] Executed statement successfully.`);
    } catch (err) {
      console.error(`  ❌ [${i + 1}/${statements.length}] Error executing statement:`, err.message);
      console.error('Statement was:\n', stmt);
      throw err;
    }
  }

  console.log('🎉 Turso DB Migration completed successfully! All tables & indexes are ready.');
}

// Run if called directly
runMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
