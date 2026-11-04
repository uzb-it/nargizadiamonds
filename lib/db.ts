import 'server-only';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import type { Order, OrderStatus, Product } from './types';
import { SEED_PRODUCTS } from './seed';

const DATA_DIR = path.join(process.cwd(), 'data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

const g = globalThis as unknown as { __ndDb?: DatabaseSync };

function open(): DatabaseSync {
  if (g.__ndDb) return g.__ndDb;
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, 'store.db'));
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name_ru TEXT NOT NULL, name_uz TEXT NOT NULL,
      desc_ru TEXT NOT NULL DEFAULT '', desc_uz TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL, metal TEXT NOT NULL, stone TEXT NOT NULL DEFAULT 'diamond',
      carat REAL, price INTEGER,
      images TEXT NOT NULL DEFAULT '[]', art TEXT NOT NULL DEFAULT 'solitaire',
      featured INTEGER NOT NULL DEFAULT 0, in_stock INTEGER NOT NULL DEFAULT 1,
      sizes TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL DEFAULT 'order',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      name TEXT NOT NULL, phone TEXT NOT NULL,
      delivery TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '', comment TEXT NOT NULL DEFAULT '',
      items TEXT NOT NULL DEFAULT '[]', total INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'new', lang TEXT NOT NULL DEFAULT 'ru'
    );
  `);
  const count = (db.prepare('SELECT COUNT(*) AS c FROM products').get() as { c: number }).c;
  if (count === 0) {
    const ins = db.prepare(`INSERT INTO products
      (slug, name_ru, name_uz, desc_ru, desc_uz, category, metal, stone, carat, price, images, art, featured, in_stock, sizes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, ?, 1, ?)`);
    for (const p of SEED_PRODUCTS) {
      ins.run(p.slug, p.name_ru, p.name_uz, p.desc_ru, p.desc_uz, p.category, p.metal, p.stone,
        p.carat, p.price, p.art, p.featured ? 1 : 0, JSON.stringify(p.sizes));
    }
  }
  g.__ndDb = db;
  return db;
}

type Row = Record<string, unknown>;

function toProduct(r: Row): Product {
  return {
    ...(r as unknown as Product),
    images: JSON.parse(r.images as string),
    sizes: JSON.parse(r.sizes as string),
    featured: !!r.featured,
    in_stock: !!r.in_stock,
  };
}

export function listProducts(): Product[] {
  return (open().prepare('SELECT * FROM products ORDER BY featured DESC, id ASC').all() as Row[]).map(toProduct);
}

export function getProduct(slug: string): Product | null {
  const r = open().prepare('SELECT * FROM products WHERE slug = ?').get(slug) as Row | undefined;
  return r ? toProduct(r) : null;
}

export function getProductById(id: number): Product | null {
  const r = open().prepare('SELECT * FROM products WHERE id = ?').get(id) as Row | undefined;
  return r ? toProduct(r) : null;
}

export type ProductInput = Omit<Product, 'id' | 'created_at'>;

export function saveProduct(input: ProductInput, id?: number): number {
  const db = open();
  const vals = [input.slug, input.name_ru, input.name_uz, input.desc_ru, input.desc_uz, input.category, input.metal,
    input.stone, input.carat, input.price, JSON.stringify(input.images), input.art, input.featured ? 1 : 0,
    input.in_stock ? 1 : 0, JSON.stringify(input.sizes)];
  if (id) {
    db.prepare(`UPDATE products SET slug=?, name_ru=?, name_uz=?, desc_ru=?, desc_uz=?, category=?, metal=?, stone=?,
      carat=?, price=?, images=?, art=?, featured=?, in_stock=?, sizes=? WHERE id=?`).run(...vals, id);
    return id;
  }
  const res = db.prepare(`INSERT INTO products (slug, name_ru, name_uz, desc_ru, desc_uz, category, metal, stone,
    carat, price, images, art, featured, in_stock, sizes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(...vals);
  return Number(res.lastInsertRowid);
}

export function deleteProduct(id: number) {
  open().prepare('DELETE FROM products WHERE id = ?').run(id);
}

function toOrder(r: Row): Order {
  return { ...(r as unknown as Order), items: JSON.parse(r.items as string) };
}

export function createOrder(o: Omit<Order, 'id' | 'created_at' | 'status'>): number {
  const res = open().prepare(`INSERT INTO orders (type, name, phone, delivery, address, comment, items, total, lang)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(o.type, o.name, o.phone, o.delivery, o.address, o.comment,
    JSON.stringify(o.items), o.total, o.lang);
  return Number(res.lastInsertRowid);
}

export function listOrders(): Order[] {
  return (open().prepare('SELECT * FROM orders ORDER BY id DESC').all() as Row[]).map(toOrder);
}

export function setOrderStatus(id: number, status: OrderStatus) {
  open().prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
}
