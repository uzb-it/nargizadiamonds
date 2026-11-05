'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES } from '@/lib/types';
import { pname } from '@/lib/format';
import { useAllProducts, useLang, useProducts } from './providers';
import { Price, ProductMedia } from './ProductCard';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const [q, setQ] = useState('');
  const featured = useProducts();
  const { list } = useAllProducts(open);
  const all = list ?? featured;
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  // search text is built once per catalogue, not on every keystroke — stays fast with thousands of items
  const index = useMemo(() => all.map((p) => [p, [p.name_ru, t(`cat.${p.category}`), t(`metal.${p.metal}`), t(`stone.${p.stone}`)]
    .join(' ').toLowerCase()] as const), [all, t]);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return featured.filter((p) => p.featured).slice(0, 4);
    return index.filter(([, s]) => words.every((w) => s.includes(w))).slice(0, 8).map(([p]) => p);
  }, [featured, index, q]);

  return (
    <div className={`search ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="search__panel">
        <div className="search__bar">
          <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search.placeholder')} />
          <button onClick={onClose} className="search__close" aria-label={t('misc.close')}>×</button>
        </div>
        {!q && (
          <div className="search__tags">
            {CATEGORIES.map((c) => <Link key={c} href={`/catalog?category=${c}`} onClick={onClose}>{t(`cat.${c}`)}</Link>)}
          </div>
        )}
        <p className="search__label">{q ? `${results.length ? '' : t('search.none')}` : t('search.popular')}</p>
        <div className="search__results">
          {results.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} onClick={onClose} className="search__item">
              <div className="search__img"><ProductMedia p={p} /></div>
              <div><p className="search__name">{pname(p)}</p><p className="muted"><Price value={p.price} /></p></div>
            </Link>
          ))}
        </div>
      </div>
      <div className="search__backdrop" onClick={onClose} />
    </div>
  );
}
