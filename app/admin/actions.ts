'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { checkPassword, endSession, requireAdmin, startSession } from '@/lib/auth';
import { deleteProduct, getProductById, saveProduct, setOrderStatus, UPLOAD_DIR } from '@/lib/db';
import { CATEGORIES, METALS, STONES, type Category, type Metal, type OrderStatus, type Stone } from '@/lib/types';
import { slugify } from '@/lib/format';

export async function login(_: unknown, fd: FormData) {
  if (!checkPassword(String(fd.get('password') ?? ''))) return { error: 'Неверный пароль' };
  await startSession();
  redirect('/admin');
}

export async function logout() {
  await endSession();
  redirect('/admin/login');
}

export async function updateOrderStatus(fd: FormData) {
  await requireAdmin();
  const status = String(fd.get('status')) as OrderStatus;
  if (!['new', 'confirmed', 'done', 'cancelled'].includes(status)) return;
  setOrderStatus(Number(fd.get('id')), status);
  revalidatePath('/admin/orders');
}

const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

async function storeUploads(files: File[]): Promise<string[]> {
  const out: string[] = [];
  for (const f of files) {
    if (!f || typeof f === 'string' || f.size === 0) continue;
    const ext = path.extname(f.name).toLowerCase();
    if (!ALLOWED.has(ext) || f.size > 12 * 1024 * 1024) continue;
    const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await f.arrayBuffer()));
    out.push(`/media/${name}`);
  }
  return out;
}

async function removeUploads(urls: string[]) {
  await Promise.all(urls.filter((u) => u.startsWith('/media/'))
    .map((u) => fs.rm(path.join(UPLOAD_DIR, path.basename(u)), { force: true })));
}

export async function saveProductAction(_: unknown, fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get('id')) || undefined;
  const existing = id ? getProductById(id) : null;
  const str = (k: string) => String(fd.get(k) ?? '').trim();
  const name_ru = str('name_ru');
  if (!name_ru) return { error: 'Укажите название' };

  const pick = <T extends string>(v: string, list: readonly T[], d: T): T => ((list as readonly string[]).includes(v) ? v as T : d);
  const priceRaw = str('price').replace(/\s/g, '');
  const caratRaw = str('carat').replace(',', '.');
  const price = priceRaw ? Math.round(Number(priceRaw)) : null;
  const carat = caratRaw ? Number(caratRaw) : null;
  if (priceRaw && !price) return { error: 'Проверьте цену: укажите только цифры, например 1500' };
  if (caratRaw && !carat) return { error: 'Проверьте вес: укажите число, например 0.5' };
  const kept = fd.getAll('keep_images').map(String).filter((s) => existing?.images.includes(s));
  const uploaded = await storeUploads(fd.getAll('images') as File[]);

  try {
    saveProduct({
      slug: slugify(str('slug') || name_ru),
      name_ru, name_uz: existing?.name_uz || name_ru,
      desc_ru: str('desc_ru'), desc_uz: existing?.desc_uz || str('desc_ru'),
      category: pick<Category>(str('category'), CATEGORIES, 'rings'),
      metal: pick<Metal>(str('metal'), METALS, 'white'),
      stone: pick<Stone>(str('stone'), STONES, 'diamond'),
      carat, price,
      images: [...kept, ...uploaded],
      art: str('art') || 'solitaire',
      featured: fd.get('featured') === 'on',
      in_stock: fd.get('in_stock') === 'on',
      // «16,5» is a size with a decimal comma, «16,17» is two sizes
      sizes: str('sizes').replace(/(\d),(\d)(?!\d)/g, '$1.$2').split(/[\s,;]+/).map(Number).filter((n) => n > 0 && n < 40),
    }, id);
  } catch (e) {
    return { error: String(e).includes('UNIQUE') ? 'Такой адрес (slug) уже занят' : 'Ошибка сохранения' };
  }
  if (existing) await removeUploads(existing.images.filter((s) => !kept.includes(s)));
  revalidatePath('/', 'layout');
  redirect('/admin/products');
}

export async function deleteProductAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const existing = getProductById(id);
  deleteProduct(id);
  if (existing) await removeUploads(existing.images);
  revalidatePath('/', 'layout');
  redirect('/admin/products');
}
