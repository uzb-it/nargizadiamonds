import { NextResponse } from 'next/server';
import { createOrder, getProductById } from '@/lib/db';
import { notifyTelegram } from '@/lib/notify';
import type { Lang } from '@/lib/types';

const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }

  const type = body.type === 'wholesale' ? 'wholesale' : 'order';
  const name = clip(body.name, 80), phone = clip(body.phone, 30);
  if (name.length < 2 || phone.replace(/\D/g, '').length < 9) return NextResponse.json({ error: 'name/phone' }, { status: 400 });

  // prices are taken from the database, never from the client
  const items = (Array.isArray(body.items) ? body.items : []).slice(0, 30).flatMap((raw) => {
    const it = raw as { id?: number; qty?: number; size?: number | null };
    const p = getProductById(Number(it.id));
    if (!p) return [];
    const qty = Math.max(1, Math.min(9, Number(it.qty) || 1));
    const size = it.size && p.sizes.includes(Number(it.size)) ? Number(it.size) : null;
    return [{ id: p.id, name: p.name_ru, price: p.price, qty, size }];
  });
  if (type === 'order' && items.length === 0) return NextResponse.json({ error: 'empty' }, { status: 400 });

  const order = {
    type: type as 'order' | 'wholesale',
    name, phone,
    delivery: type === 'order' ? (body.delivery === 'courier' ? 'courier' : 'pickup') : clip(body.company, 120),
    address: clip(body.address, 200),
    comment: clip(body.comment, 1000) + (type === 'wholesale' && body.volume ? `\nОбъём: $${clip(body.volume, 20)}` : ''),
    items,
    total: items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0),
    lang: (body.lang === 'uz' ? 'uz' : 'ru') as Lang,
  };
  const id = createOrder(order);
  await notifyTelegram(id, order);
  return NextResponse.json({ id });
}
