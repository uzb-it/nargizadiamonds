'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ProductSummary } from '@/lib/types';
import { money, pname } from '@/lib/format';
import { TELEGRAM } from '@/lib/i18n';
import { useAllProducts, useLang } from '@/components/providers';
import { Price, ProductMedia } from '@/components/ProductCard';

const sku = (p: ProductSummary) => `ND-${String(p.id).padStart(4, '0')}`;

/** Meta sends a site number, an article or a page address, whichever the catalogue was filled with. */
const matches = (p: ProductSummary, id: string) =>
  String(p.id) === id || p.slug === id || sku(p).toLowerCase() === id.toLowerCase();

export function CheckoutClient() {
  const { t } = useLang();
  const sp = useSearchParams();
  const { list, failed } = useAllProducts();
  const raw = sp.get('products') ?? '';
  const coupon = sp.get('coupon');

  const items = useMemo(() => raw.split(',').flatMap((entry) => {
    const [id, qty] = entry.split(':').map((s) => s.trim());
    const p = id ? list?.find((x) => matches(x, id)) : undefined;
    return p ? [{ p, qty: Math.max(1, Number(qty) || 1) }] : [];
  }), [raw, list]);

  const missing = raw.split(',').filter((e) => e.trim()).length - items.length;
  const total = items.every((i) => i.p.price !== null) ? items.reduce((s, i) => s + i.p.price! * i.qty, 0) : null;
  const text = [t('checkout.message'), ...items.map((i) => `• ${pname(i.p)} × ${i.qty} (${sku(i.p)})`), ...(coupon ? [`${t('checkout.coupon')}: ${coupon}`] : [])].join('\n');

  return (
    <div className="page">
      <div className="wrap co">
        <div className="phead phead--center">
          <span className="kicker">Nargiza Diamonds</span>
          <h1 className="h1">{t('checkout.title')}</h1>
        </div>

        {!list ? (
          <div className="empty">{failed ? t('catalog.failed') : t('catalog.loading')}</div>
        ) : items.length === 0 ? (
          <div className="empty">{t('checkout.empty')}<div style={{ marginTop: 24 }}><Link href="/catalog" className="btn btn--line">{t('nav.all')}</Link></div></div>
        ) : (
          <>
            <div className="co__list">
              {items.map(({ p, qty }) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="search__item co__item">
                  <div className="search__img"><ProductMedia p={p} /></div>
                  <div>
                    <p className="search__name">{pname(p)}</p>
                    <p className="muted">{sku(p)} · {qty} шт.{p.in_stock ? '' : ` · ${t('product.outStock')}`}</p>
                  </div>
                  <p className="co__price"><Price value={p.price === null ? null : p.price * qty} /></p>
                </Link>
              ))}
            </div>
            {total !== null && <p className="co__total"><span>{t('checkout.total')}</span>{money(total)}</p>}
            {missing > 0 && <p className="error co__note">{t('checkout.missing')}</p>}
            {coupon && <p className="muted co__note">{t('checkout.coupon')}: {coupon}</p>}
            <p className="muted co__note">{t('checkout.text')}</p>
            <div className="pdp__cta">
              <a className="btn btn--dark btn--block" href={`${TELEGRAM}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener">{t('checkout.send')}</a>
              <Link className="btn btn--line btn--block" href="/boutique">{t('product.visit')}</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
