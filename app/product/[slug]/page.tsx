import { notFound } from 'next/navigation';
import { getProduct, listProducts } from '@/lib/db';
import { ProductClient } from './ProductClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  return { title: p ? p.name_ru : 'Nargiza Diamonds' };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const all = listProducts().filter((x) => x.id !== p.id);
  const related = [...all.filter((x) => x.category === p.category), ...all.filter((x) => x.category !== p.category)].slice(0, 4);
  return <ProductClient p={p} related={related} />;
}
