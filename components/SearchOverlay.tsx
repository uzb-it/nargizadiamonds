'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { pname } from '@/lib/format';
import { useLang, useProducts } from './providers';
import { Price, ProductMedia } from './ProductCard';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t } = useLang();
  const [q, setQ] = useState('');
  const all = useProducts();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return all.filter((p) => p.featured).slice(0, 4);
    return all.filter((p) => [p.name_ru, p.name_uz, t(`cat.${p.category}`), t(`metal.${p.metal}`), t(`stone.${p.stone}`)]
      .join(' ').toLowerCase().includes(s)).slice(0, 8);
  }, [all, q, t]);

  return (
    <div className={`search ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="search__panel">
        <div className="search__bar">
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search.placeholder')} />
          <button onClick={onClose} className="search__close" aria-label={t('misc.close')}>×</button>
        </div>
        <div className="search__results">
          {q && results.length === 0 && <p className="muted">{t('search.none')}</p>}
          {results.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} onClick={onClose} className="search__item">
              <div className="search__img"><ProductMedia p={p} /></div>
              <div><p className="search__name">{pname(p, lang)}</p><p className="muted"><Price value={p.price} /></p></div>
            </Link>
          ))}
        </div>
      </div>
      <div className="search__backdrop" onClick={onClose} />
    </div>
  );
}
