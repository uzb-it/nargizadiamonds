'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { CATEGORIES, METALS, STONES, type Category, type Metal, type Product, type Stone } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { useLang, useProducts } from '@/components/providers';

type PriceKey = 'any' | 'u1500' | '1500-3000' | 'o3000';
type SortKey = 'featured' | 'priceAsc' | 'priceDesc' | 'new';
const PRICES: PriceKey[] = ['any', 'u1500', '1500-3000', 'o3000'];
// 4 000 items: render one page at a time, the rest on «Показать ещё»
const PAGE = 24;

const inPrice = (p: Product, k: PriceKey) => {
  if (k === 'any') return true;
  if (p.price === null) return false;
  if (k === 'u1500') return p.price <= 1500;
  if (k === '1500-3000') return p.price > 1500 && p.price <= 3000;
  return p.price > 3000;
};

/** Reads filters from the URL; remounts on real navigation (e.g. header menu → another category). */
export function CatalogEntry() {
  const sp = useSearchParams();
  const products = useProducts();
  const initial = Object.fromEntries(sp.entries());
  return <CatalogClient key={sp.toString()} products={products} initial={initial} />;
}

function CatalogClient({ products, initial }: { products: Product[]; initial: Record<string, string | undefined> }) {
  const { t } = useLang();
  const [category, setCategory] = useState<Category | 'all'>((CATEGORIES as string[]).includes(initial.category ?? '') ? initial.category as Category : 'all');
  const [metals, setMetals] = useState<Metal[]>((initial.metal?.split(',') ?? []).filter((m): m is Metal => (METALS as string[]).includes(m)));
  const [stones, setStones] = useState<Stone[]>((initial.stone?.split(',') ?? []).filter((s): s is Stone => (STONES as string[]).includes(s)));
  const [price, setPrice] = useState<PriceKey>((PRICES as string[]).includes(initial.price ?? '') ? initial.price as PriceKey : 'any');
  const [sort, setSort] = useState<SortKey>((['featured', 'priceAsc', 'priceDesc', 'new'] as string[]).includes(initial.sort ?? '') ? initial.sort as SortKey : 'featured');
  const [panel, setPanel] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const grid = useRef<HTMLDivElement>(null);

  // keep URL shareable
  useEffect(() => {
    const q = new URLSearchParams();
    if (category !== 'all') q.set('category', category);
    if (metals.length) q.set('metal', metals.join(','));
    if (stones.length) q.set('stone', stones.join(','));
    if (price !== 'any') q.set('price', price);
    if (sort !== 'featured') q.set('sort', sort);
    const s = q.toString();
    // shallow URL update: no server round-trip on every filter click
    const base = `${process.env.NEXT_PUBLIC_BASE_PATH}/catalog${process.env.NEXT_PUBLIC_STATIC ? '/' : ''}`;
    window.history.replaceState(null, '', s ? `${base}?${s}` : base);
  }, [category, metals, stones, price, sort]);

  const list = useMemo(() => {
    const out = products.filter((p) =>
      (category === 'all' || p.category === category) &&
      (!metals.length || metals.includes(p.metal)) &&
      (!stones.length || stones.includes(p.stone)) &&
      inPrice(p, price));
    const pr = (p: Product) => p.price ?? Number.MAX_SAFE_INTEGER;
    if (sort === 'priceAsc') out.sort((a, b) => pr(a) - pr(b));
    if (sort === 'priceDesc') out.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === 'new') out.sort((a, b) => b.id - a.id);
    return out;
  }, [products, category, metals, stones, price, sort]);

  // new filters start from the first page; the grid fades in again
  useEffect(() => {
    setLimit(PAGE);
    if (!grid.current?.children.length) return;
    gsap.fromTo(grid.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .9, stagger: .04, ease: 'expo.out' });
  }, [list]);

  const shown = list.slice(0, limit);
  const more = () => {
    const from = limit;
    setLimit(limit + PAGE);
    requestAnimationFrame(() => {
      const fresh = grid.current ? Array.from(grid.current.children).slice(from) : [];
      if (fresh.length) gsap.fromTo(fresh, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .9, stagger: .04, ease: 'expo.out' });
    });
  };

  useEffect(() => { document.body.classList.toggle('no-scroll', panel); }, [panel]);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = () => { setMetals([]); setStones([]); setPrice('any'); };
  const chips: { label: string; off: () => void }[] = [
    ...metals.map((m) => ({ label: t(`metal.${m}`), off: () => setMetals(toggle(metals, m)) })),
    ...stones.map((s) => ({ label: t(`stone.${s}`), off: () => setStones(toggle(stones, s)) })),
    ...(price !== 'any' ? [{ label: t(`price.${price}`), off: () => setPrice('any') }] : []),
  ];

  return (
    <div className="page">
      <div className="wrap">
        <div className="phead phead--center">
          <span className="kicker">Nargiza Diamonds</span>
          {/* plain heading: this block hydrates after the page-level scroll animations are set up */}
          <h1 className="h1">{category === 'all' ? t('catalog.title') : t(`cat.${category}`)}</h1>
          <div className="cat-tabs">
            <button className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')}>{t('nav.all')}</button>
            {CATEGORIES.map((c) => (
              <button key={c} className={category === c ? 'is-active' : ''} onClick={() => setCategory(c)}>{t(`cat.${c}`)}</button>
            ))}
          </div>
        </div>

        <div className="toolbar">
          <button className="toolbar__btn" onClick={() => setPanel(true)}>
            <svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4" /></svg>{t('catalog.filters')}{chips.length ? ` (${chips.length})` : ''}
          </button>
          <div className="chips">
            {chips.map((c) => <span key={c.label} className="chip">{c.label}<button onClick={c.off} aria-label="remove">×</button></span>)}
            {!chips.length && <span className="toolbar__count">{list.length} {t('catalog.items')}</span>}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t('catalog.sort')}>
            {(['featured', 'priceAsc', 'priceDesc', 'new'] as const).map((s) => <option key={s} value={s}>{t(`sort.${s}`)}</option>)}
          </select>
        </div>

        {list.length === 0 ? (
          <div className="empty">{t('catalog.empty')}<div style={{ marginTop: 24 }}><button className="btn btn--line" onClick={reset}>{t('catalog.reset')}</button></div></div>
        ) : (
          <>
            <div className="grid" ref={grid}>
              {shown.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
            <div className="more">
              <p>{t('catalog.shown')} {shown.length} {t('catalog.of')} {list.length}</p>
              <span className="more__bar"><i style={{ transform: `scaleX(${shown.length / list.length})` }} /></span>
              {shown.length < list.length && <button className="btn btn--line" onClick={more}>{t('catalog.more')}</button>}
            </div>
          </>
        )}
      </div>

      <div className={`filters ${panel ? 'is-open' : ''}`} aria-hidden={!panel}>
        <div className="filters__backdrop" onClick={() => setPanel(false)} />
        <aside className="filters__panel">
          <div className="drawer__head">
            <p className="drawer__title">{t('catalog.filters')}</p>
            <button className="drawer__close" onClick={() => setPanel(false)} aria-label={t('misc.close')}>×</button>
          </div>
          <div className="filters__body">
            <div className="fgroup">
              <p className="fgroup__t">{t('catalog.metal')}</p>
              {METALS.map((m) => (
                <button key={m} className={`fopt ${metals.includes(m) ? 'is-on' : ''}`} onClick={() => setMetals(toggle(metals, m))}>
                  <i /><span className={`swatch swatch--${m}`} />{t(`metal.${m}`)}
                </button>
              ))}
            </div>
            <div className="fgroup">
              <p className="fgroup__t">{t('catalog.stone')}</p>
              {STONES.map((s) => (
                <button key={s} className={`fopt ${stones.includes(s) ? 'is-on' : ''}`} onClick={() => setStones(toggle(stones, s))}>
                  <i />{t(`stone.${s}`)}
                </button>
              ))}
            </div>
            <div className="fgroup">
              <p className="fgroup__t">{t('catalog.price')}</p>
              {PRICES.map((k) => (
                <button key={k} className={`fopt ${price === k ? 'is-on' : ''}`} onClick={() => setPrice(k)}>
                  <i />{t(`price.${k}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="drawer__foot" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button className="btn btn--line" onClick={reset}>{t('catalog.reset')}</button>
            <button className="btn btn--dark" onClick={() => setPanel(false)}>{t('catalog.show')} ({list.length})</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
