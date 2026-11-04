'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { money, pname } from '@/lib/format';
import { ProductArt } from './ProductArt';
import { useLang, useStore } from './providers';

export function ProductMedia({ p, index = 0, className }: { p: Pick<Product, 'images' | 'art' | 'metal' | 'stone' | 'name_ru'>; index?: number; className?: string }) {
  const raw = p.images[index];
  const src = raw?.startsWith('/') ? process.env.NEXT_PUBLIC_BASE_PATH + raw : raw;
  if (src) return <img className={'media ' + (className ?? '')} src={src} alt={p.name_ru} loading="lazy" />;
  return <ProductArt art={p.art} metal={p.metal} stone={p.stone} className={className} />;
}

export function Price({ value }: { value: number | null }) {
  const { t } = useLang();
  return <>{value === null ? t('price.request') : money(value)}</>;
}

export function FavButton({ id, className }: { id: number; className?: string }) {
  const { favorites, toggleFav } = useStore();
  const { t } = useLang();
  const on = favorites.includes(id);
  return (
    <button className={'fav ' + (on ? 'is-on ' : '') + (className ?? '')} aria-label={t('nav.favorites')} aria-pressed={on}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(id); }}>
      <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.3 4.5 6.8 4.5c2.1 0 3.5 1.2 4.2 2.4h2c.7-1.2 2.1-2.4 4.2-2.4 3.5 0 5.4 3.5 4.1 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" /></svg>
    </button>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { lang, t } = useLang();
  return (
    <Link href={`/product/${p.slug}`} className="pcard" data-cursor="view">
      <div className="pcard__media">
        <ProductMedia p={p} className="pcard__img" />
        {p.images[1] && <ProductMedia p={p} index={1} className="pcard__img pcard__img--alt" />}
        <FavButton id={p.id} className="pcard__fav" />
        {!p.in_stock && <span className="pcard__badge">{t('product.outStock')}</span>}
      </div>
      <div className="pcard__info">
        <h3 className="pcard__name">{pname(p, lang)}</h3>
        <p className="pcard__meta">{t(`metal.${p.metal}`)}{p.carat ? ` · ${p.carat} ct` : ''}</p>
        <p className="pcard__price"><Price value={p.price} /></p>
      </div>
    </Link>
  );
}
