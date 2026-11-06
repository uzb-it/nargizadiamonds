import 'server-only';
import { Pool, type PoolClient } from 'pg';
import path from 'node:path';
import type { Order, OrderStatus, Product, ProductSummary } from './types';
import { SCHEMA } from './schema';
import { SEED_PRODUCTS } from './seed';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

const g = globalThis as unknown as { __ndPool?: Pool; __ndReady?: Promise<void> };

function pool(): Pool {
  if (g.__ndPool) return g.__ndPool;
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  return (g.__ndPool = new Pool({ connectionString: process.env.DATABASE_URL }));
}

const INSERT = `INSERT INTO products (slug, name_ru, name_uz, desc_ru, desc_uz, category, metal, stone,
  carat, price, images, art, featured, in_stock, sizes)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`;

async function seed(c: PoolClient) {
  for (const p of SEED_PRODUCTS) {
    await c.query(INSERT, [p.slug, p.name_ru, p.name_uz, p.desc_ru, p.desc_uz, p.category, p.metal, p.stone,
      p.carat, p.price, '[]', p.art, !!p.featured, true, JSON.stringify(p.sizes)]);
  }
}

// Build workers start at the same time, so the schema and seed run under a lock.
async function setup() {
  const c = await pool().connect();
  try {
    await c.query('BEGIN');
    await c.query('SELECT pg_advisory_xact_lock(7007)');
    await c.query(SCHEMA);
    const { rows } = await c.query('SELECT COUNT(*)::int AS c FROM products');
    if (rows[0].c === 0) await seed(c);
    await c.query('COMMIT');
  } catch (e) {
    await c.query('ROLLBACK');
    throw e;
  } finally {
    c.release();
  }
}

function ready(): Promise<void> {
  return (g.__ndReady ??= setup().catch((e) => { g.__ndReady = undefined; throw e; }));
}

type Row = Record<string, unknown>;

async function query(sql: string, params: unknown[] = []): Promise<Row[]> {
  await ready();
  return (await pool().query(sql, params)).rows;
}

const iso = (v: unknown) => (v as Date).toISOString();

function toProduct(r: Row): Product {
  return { ...(r as unknown as Product), created_at: iso(r.created_at) };
}

export async function listProducts(): Promise<Product[]> {
  return (await query('SELECT * FROM products ORDER BY featured DESC, id ASC')).map(toProduct);
}

const SUMMARY = `SELECT id, slug, name_ru, category, metal, stone, carat, price, images, art, featured, in_stock FROM products`;

function toSummary(r: Row): ProductSummary {
  return { ...(r as unknown as ProductSummary), images: (r.images as string[]).slice(0, 2) };
}

/** Whole catalogue without long texts: served once as /products.json for the catalogue page and search. */
export async function listProductSummaries(): Promise<ProductSummary[]> {
  return (await query(`${SUMMARY} ORDER BY featured DESC, id ASC`)).map(toSummary);
}

/** The few products the home page and search suggestions show; goes into the HTML of every page. */
export async function listHomeProducts(): Promise<ProductSummary[]> {
  const rows = (await Promise.all([
    `${SUMMARY} WHERE featured ORDER BY id ASC LIMIT 12`,
    `${SUMMARY} WHERE price <= 1500 ORDER BY featured DESC, id ASC LIMIT 4`,
    `${SUMMARY} WHERE stone != 'diamond' ORDER BY featured DESC, id ASC LIMIT 4`,
  ].map((sql) => query(sql)))).flat();
  const byId = new Map(rows.map((r) => [r.id as number, toSummary(r)]));
  return [...byId.values()].sort((a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id);
}

export async function listRelated(p: Pick<Product, 'id' | 'category'>): Promise<ProductSummary[]> {
  const rows = await query(`${SUMMARY} WHERE id != $1 ORDER BY category = $2 DESC, featured DESC, id ASC LIMIT 4`, [p.id, p.category]);
  return rows.map(toSummary);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const [r] = await query('SELECT * FROM products WHERE slug = $1', [slug]);
  return r ? toProduct(r) : null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const [r] = await query('SELECT * FROM products WHERE id = $1', [id]);
  return r ? toProduct(r) : null;
}

export type ProductInput = Omit<Product, 'id' | 'created_at'>;

export async function saveProduct(input: ProductInput, id?: number): Promise<number> {
  const vals = [input.slug, input.name_ru, input.name_uz, input.desc_ru, input.desc_uz, input.category, input.metal,
    input.stone, input.carat, input.price, JSON.stringify(input.images), input.art, input.featured,
    input.in_stock, JSON.stringify(input.sizes)];
  if (id) {
    await query(`UPDATE products SET slug=$1, name_ru=$2, name_uz=$3, desc_ru=$4, desc_uz=$5, category=$6, metal=$7, stone=$8,
      carat=$9, price=$10, images=$11, art=$12, featured=$13, in_stock=$14, sizes=$15 WHERE id=$16`, [...vals, id]);
    return id;
  }
  const [r] = await query(INSERT, vals);
  return r.id as number;
}

export async function deleteProduct(id: number) {
  await query('DELETE FROM products WHERE id = $1', [id]);
}

function toOrder(r: Row): Order {
  return { ...(r as unknown as Order), created_at: iso(r.created_at) };
}

export async function createOrder(o: Omit<Order, 'id' | 'created_at' | 'status'>): Promise<number> {
  const [r] = await query(`INSERT INTO orders (type, name, phone, delivery, address, comment, items, total, lang)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, [o.type, o.name, o.phone, o.delivery, o.address, o.comment,
    JSON.stringify(o.items), o.total, o.lang]);
  return r.id as number;
}

export async function listOrders(): Promise<Order[]> {
  return (await query('SELECT * FROM orders ORDER BY id DESC')).map(toOrder);
}

export async function setOrderStatus(id: number, status: OrderStatus) {
  await query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
}
