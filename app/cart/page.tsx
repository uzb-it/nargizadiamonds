'use client';

import Link from 'next/link';
import { money, pname } from '@/lib/format';
import { useLang, useStore } from '@/components/providers';
import { CartLineMedia } from '@/components/CartDrawer';

export default function CartPage() {
  const { cart, remove, setQty, total } = useStore();
  const { lang, t } = useLang();
  const hasRequest = cart.some((x) => x.price === null);

  return (
    <div className="page">
      <div className="wrap">
        <div className="phead"><h1 className="h1">{t('cart.title')}</h1></div>
        {cart.length === 0 ? (
          <div className="empty">{t('cart.empty')}<div style={{ marginTop: 28 }}><Link href="/catalog" className="btn btn--dark">{t('cart.continue')}</Link></div></div>
        ) : (
          <div className="cartpage">
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {cart.map((it) => (
                <div key={it.id + '-' + it.size} className="line">
                  <Link href={`/product/${it.slug}`} className="line__img"><CartLineMedia item={it} /></Link>
                  <div className="line__info">
                    <p className="line__name">{pname(it, lang)}</p>
                    <p className="muted">{t(`metal.${it.metal}`)} 750{it.size ? ` · ${t('cart.size')} ${it.size}` : ''}</p>
                    <button className="link-btn" onClick={() => remove(it.id, it.size)}>{t('cart.remove')}</button>
                  </div>
                  <div style={{ display: 'grid', justifyItems: 'end', gap: 12 }}>
                    <div className="qty">
                      <button onClick={() => setQty(it.id, it.size, it.qty - 1)} aria-label="-">−</button>
                      <span>{it.qty}</span>
                      <button onClick={() => setQty(it.id, it.size, it.qty + 1)} aria-label="+">+</button>
                    </div>
                    <p className="line__price">{it.price === null ? t('price.request') : money(it.price * it.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
            <aside className="summary">
              <h2>{t('checkout.summary')}</h2>
              <div className="row-between total"><span>{t('cart.total')}</span><b>{money(total)}</b></div>
              <p className="note">{hasRequest ? t('cart.note') + ' ' : ''}{t('checkout.agree')}</p>
              <Link href="/checkout" className="btn btn--dark btn--block">{t('cart.checkout')}</Link>
              <Link href="/catalog" className="btn btn--line btn--block" style={{ marginTop: 8 }}>{t('cart.continue')}</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
