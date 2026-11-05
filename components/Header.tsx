'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/types';
import { TELEGRAM } from '@/lib/i18n';
import { useLang } from './providers';
import { SearchOverlay } from './SearchOverlay';
import { ProductArt } from './ProductArt';

export const ICON = {
  search: <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>,
  pin: <svg viewBox="0 0 24 24"><path d="M12 21s-6.5-6.2-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.3" /></svg>,
  chat: <svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5z" /></svg>,
};

const CAT_ART: Record<string, [string, 'white' | 'yellow' | 'rose']> = {
  rings: ['solitaire', 'white'], earrings: ['drops', 'yellow'], necklaces: ['tennis', 'white'],
};

export function Brand({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={'brand ' + className} aria-label="Nargiza Diamonds">
      <span className="brand__main">NARGIZA</span>
      <span className="brand__sub">DIAMONDS</span>
    </Link>
  );
}

export function Header() {
  const { t } = useLang();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    let last = 0, ticking = false;
    const on = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        if (Math.abs(y - last) > 6) { setHidden(y > 360 && y > last); last = y; }
        ticking = false;
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => { setMenu(false); setMega(false); }, [path]);
  useEffect(() => { document.body.classList.toggle('no-scroll', menu); }, [menu]);

  if (path.startsWith('/admin')) return null;

  const active = (href: string) => (path === href ? 'is-active' : '');

  return (
    <>
      <div className="topbar"><span>{t('topbar')}</span></div>
      <header className={`hdr ${scrolled ? 'is-scrolled' : ''} ${hidden && !mega && !menu ? 'is-hidden' : ''}`}
        onMouseLeave={() => setMega(false)}>
        <div className="hdr__row">
          <div className="hdr__side">
            <button className={`burger ${menu ? 'is-open' : ''}`} aria-label="Меню" onClick={() => setMenu((v) => !v)}><span /><span /></button>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="hdr__link hide-sm">{ICON.chat}<span className="hide-md">{t('nav.contact')}</span></a>
            <Link href="/boutique" className="hdr__link hide-sm">{ICON.pin}<span className="hide-md">{t('nav.boutique')}</span></Link>
          </div>
          <Brand />
          <div className="hdr__side hdr__side--end">
            <button className="hdr__link" onClick={() => setSearch(true)} aria-label={t('nav.search')}>{ICON.search}<span className="hide-md">{t('nav.search')}</span></button>
          </div>
        </div>
        <nav className="hdr__nav">
          <Link href="/catalog" onMouseEnter={() => setMega(true)} className={path.startsWith('/catalog') ? 'is-active' : ''}>{t('nav.jewelry')}</Link>
          {CATEGORIES.slice(0, 4).map((c) => (
            <Link key={c} href={`/catalog?category=${c}`} onMouseEnter={() => setMega(false)}>{c === 'necklaces' ? 'Колье' : t(`cat.${c}`)}</Link>
          ))}
          <Link href="/catalog?price=u1500" onMouseEnter={() => setMega(false)}>{t('nav.gifts')}</Link>
          <Link href="/about" onMouseEnter={() => setMega(false)} className={active('/about')}>{t('nav.maison')}</Link>
        </nav>
        <div className={`mega ${mega ? 'is-open' : ''}`}>
          <div className="mega__inner">
            <div className="mega__col">
              <p className="mega__title">{t('nav.jewelry')}</p>
              <Link href="/catalog">{t('nav.all')}</Link>
              {CATEGORIES.map((c) => <Link key={c} href={`/catalog?category=${c}`}>{t(`cat.${c}`)}</Link>)}
            </div>
            <div className="mega__col">
              <p className="mega__title">{t('nav.collections')}</p>
              <Link href="/catalog?sort=featured">{t('nav.highlights')}</Link>
              <Link href="/catalog?sort=new">{t('nav.newin')}</Link>
              <Link href="/catalog?price=u1500">{t('nav.under1500')}</Link>
              <Link href="/catalog?stone=sapphire,emerald,ruby">Цветные камни</Link>
            </div>
            <div className="mega__tiles">
              {(['rings', 'earrings', 'necklaces'] as const).map((c) => (
                <Link key={c} href={`/catalog?category=${c}`} className="mega__tile">
                  <div className="mega__art"><ProductArt art={CAT_ART[c][0]} metal={CAT_ART[c][1]} stone="diamond" /></div>
                  <span>{t(`cat.${c}`)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className={`mmenu ${menu ? 'is-open' : ''}`}>
        <div className="mmenu__inner">
          <p className="mmenu__label">{t('nav.jewelry')}</p>
          <Link href="/catalog">{t('nav.all')}</Link>
          {CATEGORIES.map((c) => <Link key={c} href={`/catalog?category=${c}`}>{t(`cat.${c}`)}</Link>)}
          <Link href="/catalog?price=u1500">{t('nav.gifts')}</Link>
          <p className="mmenu__label">Nargiza Diamonds</p>
          <Link href="/about">{t('nav.maison')}</Link>
          <Link href="/boutique">{t('nav.boutique')}</Link>
          <a href={TELEGRAM} target="_blank" rel="noopener">{t('nav.contact')}</a>
        </div>
      </div>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
