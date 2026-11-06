import { notFound } from 'next/navigation';
import { getProduct, listProducts, listRelated } from '@/lib/db';
import { ProductClient } from './ProductClient';

export async function generateStaticParams() {
  return (await listProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProduct((await params).slug);
  return { title: p ? p.name_ru : 'Nargiza Diamonds' };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  return <ProductClient p={p} related={await listRelated(p)} />;
}
