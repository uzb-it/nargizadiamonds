'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/types';
import { INSTAGRAM, MAPS, TELEGRAM } from '@/lib/i18n';
import { useLang } from './providers';

export function Footer() {
  const { t } = useLang();
  const path = usePathname();
  if (path.startsWith('/admin')) return null;
  return (
    <footer className="ftr">
      <div className="wrap ftr__grid">
        <div className="ftr__brand">
          <Link href="/" className="brand brand--light"><span className="brand__main">NARGIZA</span><span className="brand__sub">DIAMONDS</span></Link>
          <p>{t('footer.about')}</p>
        </div>
        <div>
          <p className="ftr__h">{t('footer.shop')}</p>
          {CATEGORIES.map((c) => <Link key={c} href={`/catalog?category=${c}`}>{t(`cat.${c}`)}</Link>)}
        </div>
        <div>
          <p className="ftr__h">{t('footer.maison')}</p>
          <Link href="/about">{t('nav.maison')}</Link>
          <Link href="/boutique">{t('nav.boutique')}</Link>
          <Link href="/wholesale">{t('nav.wholesale')}</Link>
          <Link href="/favorites">{t('nav.favorites')}</Link>
        </div>
        <div>
          <p className="ftr__h">{t('footer.contacts')}</p>
          <a href={TELEGRAM} target="_blank" rel="noopener">Telegram · @nargiza_goldd</a>
          <a href={INSTAGRAM} target="_blank" rel="noopener">Instagram · @nargizadiamons</a>
          <a href={MAPS} target="_blank" rel="noopener">{t('boutique.address')}</a>
        </div>
      </div>
      <div className="wrap ftr__bottom">
        <span>© 2026 Nargiza Diamonds. {t('footer.rights')}</span>
        <span>Hong Kong · 750</span>
      </div>
    </footer>
  );
}
