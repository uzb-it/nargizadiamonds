'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { money, pname } from '@/lib/format';
import { useLang, useStore } from './providers';
import { ProductArt } from './ProductArt';
import type { CartItem } from '@/lib/types';

export function CartLineMedia({ item }: { item: CartItem }) {
  const src = item.image?.startsWith('/') ? process.env.NEXT_PUBLIC_BASE_PATH + item.image : item.image;
  return src ? <img className="media" src={src} alt="" /> : <ProductArt art={item.art} metal={item.metal} stone="diamond" />;
}

export function CartDrawer() {
  const { cart, drawer, setDrawer, remove, total } = useStore();
  const { lang, t } = useLang();
  const path = usePathname();

  useEffect(() => { setDrawer(false); }, [path, setDrawer]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [setDrawer]);

  return (
    <div className={`drawer ${drawer ? 'is-open' : ''}`} aria-hidden={!drawer}>
      <div className="drawer__backdrop" onClick={() => setDrawer(false)} />
      <aside className="drawer__panel">
        <div className="drawer__head">
          <p className="drawer__title">{t('cart.title')}</p>
          <button className="drawer__close" onClick={() => setDrawer(false)} aria-label={t('misc.close')}>×</button>
        </div>
        {cart.length === 0 ? (
          <div className="drawer__empty">
            <p>{t('cart.empty')}</p>
            <Link href="/catalog" className="btn btn--dark">{t('cart.continue')}</Link>
          </div>
        ) : (
          <>
            <div className="drawer__list">
              {cart.map((it) => (
                <div key={it.id + '-' + it.size} className="line">
                  <Link href={`/product/${it.slug}`} className="line__img"><CartLineMedia item={it} /></Link>
                  <div className="line__info">
                    <p className="line__name">{pname(it, lang)}</p>
                    <p className="muted">{t(`metal.${it.metal}`)}{it.size ? ` · ${t('cart.size')} ${it.size}` : ''} · ×{it.qty}</p>
                    <p className="line__price">{it.price === null ? t('price.request') : money(it.price * it.qty)}</p>
                    <button className="link-btn" onClick={() => remove(it.id, it.size)}>{t('cart.remove')}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer__foot">
              <div className="row-between"><span>{t('cart.total')}</span><b>{money(total)}</b></div>
              <Link href="/checkout" className="btn btn--dark btn--block">{t('cart.checkout')}</Link>
              <Link href="/cart" className="btn btn--line btn--block">{t('cart.view')}</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
