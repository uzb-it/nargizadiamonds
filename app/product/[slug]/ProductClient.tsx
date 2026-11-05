'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { pdesc, pname } from '@/lib/format';
import { MAPS, TELEGRAM } from '@/lib/i18n';
import { useLang } from '@/components/providers';
import { Price, ProductCard, ProductMedia } from '@/components/ProductCard';
import { ProductArt } from '@/components/ProductArt';

function Accordion({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="acc">
      {items.map((it, i) => (
        <div key={it.title} className={`acc__item ${open === i ? 'is-open' : ''}`}>
          <button className="acc__head" onClick={() => setOpen(open === i ? -1 : i)}>{it.title}<i>+</i></button>
          <div className="acc__body"><div><p>{it.body}</p></div></div>
        </div>
      ))}
    </div>
  );
}

export function ProductClient({ p, related }: { p: Product; related: Product[] }) {
  const { t } = useLang();
  const [zoom, setZoom] = useState<number | null>(null);
  const name = pname(p);

  // with photos — show them; without — three staged views of the illustration
  const shots = p.images.length ? p.images.map((_, i) => ({ kind: 'img' as const, i })) :
    [{ kind: 'tile' as const, i: 0 }, { kind: 'dark' as const, i: 0 }, { kind: 'detail' as const, i: 0 }];

  return (
    <div className="page">
      <div className="wrap">
        <nav className="crumbs">
          <Link href="/">Главная</Link><span>/</span>
          <Link href={`/catalog?category=${p.category}`}>{t(`cat.${p.category}`)}</Link><span>/</span>
          <span>{name}</span>
        </nav>

        <div className="pdp">
          <div className="pdp__gallery">
            {shots.map((s, k) => (
              <div key={k}
                className={`pdp__shot ${s.kind === 'dark' ? 'pdp__shot--dark' : ''} ${s.kind === 'detail' ? 'pdp__shot--detail' : ''}`}
                data-reveal
                onClick={() => setZoom(k)}
                onMouseMove={(e) => {
                  // zoom follows the cursor via direct style writes — no React re-render per mouse move
                  const r = e.currentTarget.getBoundingClientRect();
                  const inner = e.currentTarget.firstElementChild as HTMLElement;
                  inner.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
                  inner.style.transform = 'scale(1.6)';
                }}
                onMouseLeave={(e) => { (e.currentTarget.firstElementChild as HTMLElement).style.transform = 'none'; }}>
                <div className="pdp__zoom">
                  {s.kind === 'img' ? <ProductMedia p={p} index={s.i} /> : <ProductArt art={p.art} metal={p.metal} stone={p.stone} />}
                </div>
              </div>
            ))}
          </div>

          <div className="pdp__info">
            <p className="pdp__cat">{t(`cat.${p.category}`)}</p>
            <h1 className="pdp__name">{name}</h1>
            <p className="pdp__ref">Артикул ND-{String(p.id).padStart(4, '0')}</p>
            <p className="pdp__price"><Price value={p.price} /></p>
            <p className="pdp__sub">{t(`metal.${p.metal}`)} 750{p.carat ? ` · бриллианты ${p.carat} ct` : ''}</p>

            <div className="pdp__specs">
              <div><span>{t('product.metal')}</span>{t(`metal.${p.metal}`)} 750</div>
              <div><span>{t('product.stone')}</span>{t(`stone.${p.stone}`)}</div>
              {p.carat && <div><span>{t('product.carat')}</span>{p.carat} ct</div>}
              <div><span>{t('product.origin')}</span>{t('product.hk')}</div>
              {p.sizes.length > 0 && <div><span>{t('product.sizes')}</span>{p.sizes.join(' · ')}</div>}
            </div>

            <div className="pdp__cta">
              <Link className="btn btn--dark btn--block" href="/boutique">{t('product.visit')}</Link>
              <a className="btn btn--line btn--block" href={TELEGRAM} target="_blank" rel="noopener">{t('product.ask')}</a>
            </div>
            <p className={`pdp__stock ${p.in_stock ? '' : 'is-out'}`}>{p.in_stock ? t('product.inStock') : t('product.outStock')}</p>

            <Accordion items={[
              { title: t('product.details'), body: pdesc(p) },
              { title: t('product.boutique'), body: t('product.boutiqueText') },
              { title: t('product.care'), body: t('product.careText') },
            ]} />
            <a href={MAPS} target="_blank" rel="noopener" className="link-u pdp__route">{t('boutique.route')}</a>
          </div>
        </div>

        <section className="section">
          <div className="sec-head sec-head--center"><h2 className="h2" data-reveal>{t('product.related')}</h2></div>
          <div className="grid">{related.map((r) => <div key={r.id} data-reveal><ProductCard p={r} /></div>)}</div>
        </section>
      </div>

      <div className={`zoom ${zoom !== null ? 'is-open' : ''}`} onClick={() => setZoom(null)}>
        {zoom !== null && (shots[zoom].kind === 'img' ? <ProductMedia p={p} index={shots[zoom].i} /> : <ProductArt art={p.art} metal={p.metal} stone={p.stone} />)}
      </div>
    </div>
  );
}
