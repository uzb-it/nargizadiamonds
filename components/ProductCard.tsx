'use client';

import Link from 'next/link';
import type { Product, ProductSummary } from '@/lib/types';
import { money, pname } from '@/lib/format';
import { ProductArt } from './ProductArt';
import { useLang } from './providers';

export function ProductMedia({ p, index = 0, className }: { p: Pick<Product, 'images' | 'art' | 'metal' | 'stone' | 'name_ru'>; index?: number; className?: string }) {
  const raw = p.images[index];
  const src = raw?.startsWith('/') ? process.env.NEXT_PUBLIC_BASE_PATH + raw : raw;
  if (src) return <img className={'media ' + (className ?? '')} src={src} alt={p.name_ru} loading="lazy" decoding="async" />;
  return <ProductArt art={p.art} metal={p.metal} stone={p.stone} className={className} />;
}

export function Price({ value }: { value: number | null }) {
  const { t } = useLang();
  return <>{value === null ? t('price.request') : money(value)}</>;
}

export function ProductCard({ p }: { p: ProductSummary }) {
  const { t } = useLang();
  return (
    <Link href={`/product/${p.slug}`} className="pcard">
      <div className="pcard__media">
        <ProductMedia p={p} className="pcard__img" />
        {p.images[1] && <ProductMedia p={p} index={1} className="pcard__img pcard__img--alt" />}
        {p.featured && <span className="pcard__badge">Бестселлер</span>}
      </div>
      <div className="pcard__info">
        <h3 className="pcard__name">{pname(p)}</h3>
        <p className="pcard__meta">{t(`metal.${p.metal}`)}{p.carat ? ` · ${p.carat} ct` : ''}</p>
        <p className="pcard__price"><Price value={p.price} /></p>
      </div>
    </Link>
  );
}
