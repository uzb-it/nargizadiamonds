import { listProducts } from '@/lib/db';
import { CatalogClient } from './CatalogClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Каталог' };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  // remount on real navigation (e.g. header menu → another category) so filters follow the URL
  return <CatalogClient key={new URLSearchParams(sp as Record<string, string>).toString()} products={listProducts()} initial={sp} />;
}
