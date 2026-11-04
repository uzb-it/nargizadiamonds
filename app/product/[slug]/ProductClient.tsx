'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { pdesc, pname } from '@/lib/format';
import { TELEGRAM } from '@/lib/i18n';
import { useLang, useStore } from '@/components/providers';
import { FavButton, Price, ProductCard, ProductMedia } from '@/components/ProductCard';
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
  const { lang, t } = useLang();
  const { add } = useStore();
  const [size, setSize] = useState<number | null>(null);
  const [sizeErr, setSizeErr] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const name = pname(p, lang);

  // with photos — show them; without — three staged views of the illustration
  const shots = p.images.length ? p.images.map((_, i) => ({ kind: 'img' as const, i })) :
    [{ kind: 'tile' as const, i: 0 }, { kind: 'dark' as const, i: 0 }, { kind: 'detail' as const, i: 0 }];

  const tgText = encodeURIComponent(`${lang === 'uz' ? 'Assalomu alaykum! Qiziqtiradi' : 'Здравствуйте! Интересует'}: ${name}${size ? `, ${t('product.size')} ${size}` : ''}`);

  const onAdd = () => {
    if (p.sizes.length && size === null) { setSizeErr(true); return; }
    add(p, size);
  };

  return (
    <div className="page">
      <div className="wrap">
        <nav className="crumbs">
          <Link href="/">Nargiza</Link><span>/</span>
          <Link href={`/catalog?category=${p.category}`}>{t(`cat.${p.category}`)}</Link><span>/</span>
          <span>{name}</span>
        </nav>

        <div className="pdp" style={{ marginTop: 24 }}>
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
            <p className="kicker">{t(`cat.${p.category}`)}</p>
            <h1 className="pdp__name">{name}</h1>
            <p className="pdp__ref">REF. ND-{String(p.id).padStart(4, '0')}</p>
            <p className="pdp__price" style={{ marginTop: 18 }}><Price value={p.price} /></p>

            <div className="pdp__specs">
              <div><span>{t('product.metal')}</span>{t(`metal.${p.metal}`)} 750</div>
              <div><span>{t('product.stone')}</span>{t(`stone.${p.stone}`)}</div>
              {p.carat && <div><span>{t('product.carat')}</span>{p.carat} ct</div>}
              <div><span>{t('product.origin')}</span>{t('product.hk')}</div>
            </div>

            {p.sizes.length > 0 && (
              <>
                <p className={`sizes-label ${sizeErr ? 'is-error' : ''}`}>{t('product.size')}{sizeErr ? ` — ${t('product.sizeHint')}` : ''}</p>
                <div className="sizes">
                  {p.sizes.map((s) => (
                    <button key={s} className={size === s ? 'is-on' : ''} onClick={() => { setSize(s); setSizeErr(false); }}>{s}</button>
                  ))}
                </div>
              </>
            )}

            <div className="pdp__buy">
              {p.price === null
                ? <a className="btn btn--dark" href={`${TELEGRAM}?text=${tgText}`} target="_blank" rel="noopener">{t('product.ask')}</a>
                : <button className="btn btn--dark" onClick={onAdd}>{t('product.add')}</button>}
              <FavButton id={p.id} />
            </div>
            <a className="btn btn--line btn--block" style={{ marginTop: 8 }} href={`${TELEGRAM}?text=${tgText}`} target="_blank" rel="noopener">{t('product.consult')}</a>
            <p className={`pdp__stock ${p.in_stock ? '' : 'is-out'}`}>{p.in_stock ? t('product.inStock') : t('product.outStock')}</p>

            <Accordion items={[
              { title: t('product.details'), body: pdesc(p, lang) },
              { title: t('product.care'), body: t('product.careText') },
              { title: t('product.delivery'), body: t('product.deliveryText') },
            ]} />
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
