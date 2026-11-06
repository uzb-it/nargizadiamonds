// Copies products and orders from an old SQLite file into PostgreSQL, keeping their ids.
// Usage: node --env-file=.env scripts/import-sqlite.mjs [data/store.db] [--replace]
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import { SCHEMA } from '../lib/schema.ts';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--')) ?? 'data/store.db';
const lite = new DatabaseSync(file, { readOnly: true });
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const BOOL = new Set(['featured', 'in_stock']);
const copy = async (table) => {
  const rows = lite.prepare(`SELECT * FROM ${table} ORDER BY id`).all();
  for (const r of rows) {
    const cols = Object.keys(r);
    const vals = cols.map((c) => BOOL.has(c) ? !!r[c] : c === 'created_at' ? `${r[c]}Z` : r[c]);
    await client.query(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')})`, vals);
  }
  await client.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), GREATEST((SELECT MAX(id) FROM ${table}), 1))`);
  console.log(`${table}: ${rows.length}`);
};

try {
  await client.query('BEGIN');
  await client.query(SCHEMA);
  const { rows } = await client.query('SELECT COUNT(*)::int AS c FROM products');
  if (rows[0].c > 0 && !args.includes('--replace')) throw new Error(`products already has ${rows[0].c} rows, pass --replace to overwrite them`);
  await client.query('TRUNCATE products, orders RESTART IDENTITY');
  await copy('products');
  await copy('orders');
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  console.error(e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
