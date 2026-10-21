import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from full-backend/.env OR root .env
const backendEnvPath = path.resolve(__dirname, '../../.env');
const rootEnvPath = path.resolve(__dirname, '../../../.env');

if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
}
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath, override: false });
}

const url = process.env.TURSO_DATABASE_URL?.trim();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (!url || url === '') {
  console.error('\n❌ ERROR: TURSO_DATABASE_URL is not set in full-backend/.env or .env');
  console.error('👉 Please open full-backend/.env and set your Turso database credentials:');
  console.error('   TURSO_DATABASE_URL=libsql://your-db-name.turso.io');
  console.error('   TURSO_AUTH_TOKEN=your_jwt_auth_token\n');
  throw new Error('TURSO_DATABASE_URL is missing. Please add your Turso Cloud credentials to full-backend/.env');
}

console.log(`🔌 Initializing Turso Cloud Database: ${url}`);

export const db = createClient({
  url,
  authToken: authToken || undefined
});

/**
 * Helper to run a parameterized SELECT query returning rows array
 */
export async function queryRows(sql, args = []) {
  try {
    const rs = await db.execute({ sql, args });
    return rs.rows;
  } catch (error) {
    console.error('❌ DB Query Error:', error.message, 'SQL:', sql);
    throw error;
  }
}

/**
 * Helper to run a single row SELECT query
 */
export async function queryOne(sql, args = []) {
  const rows = await queryRows(sql, args);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Helper to execute INSERT, UPDATE, DELETE statements
 */
export async function executeStmt(sql, args = []) {
  try {
    const rs = await db.execute({ sql, args });
    return {
      rowsAffected: rs.rowsAffected,
      lastInsertRowid: rs.lastInsertRowid
    };
  } catch (error) {
    console.error('❌ DB Execute Error:', error.message, 'SQL:', sql);
    throw error;
  }
}

export default db;
