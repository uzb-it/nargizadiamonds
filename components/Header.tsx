'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/types';
import { useLang, useStore } from './providers';
import { SearchOverlay } from './SearchOverlay';
import { ProductArt } from './ProductArt';

const ICON = {
  search: <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>,
  heart: <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.3 4.5 6.8 4.5c2.1 0 3.5 1.2 4.2 2.4h2c.7-1.2 2.1-2.4 4.2-2.4 3.5 0 5.4 3.5 4.1 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" /></svg>,
  bag: <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>,
};

const CAT_ART: Record<string, string> = { rings: 'solitaire', earrings: 'drops', necklaces: 'tennis', bracelets: 'bracelet', brooches: 'brooch' };

export function Header() {
  const { t, lang, setLang } = useLang();
  const { count, setDrawer } = useStore();
  const path = usePathname();
  const isHome = path === '/';
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
        setScrolled(y > 30);
        if (Math.abs(y - last) > 6) { setHidden(y > 300 && y > last); last = y; }
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

  const solid = !isHome || scrolled || mega || menu;

  return (
    <>
      <div className="topbar"><span>{t('topbar')}</span></div>
      <header className={`hdr ${solid ? 'is-solid' : 'is-clear'} ${scrolled ? 'is-scrolled' : ''} ${hidden && !mega && !menu ? 'is-hidden' : ''}`}
        onMouseLeave={() => setMega(false)}>
        <div className="hdr__row">
          <div className="hdr__left">
            <button className={`burger ${menu ? 'is-open' : ''}`} aria-label="Menu" onClick={() => setMenu((v) => !v)}><span /><span /></button>
            <button className="icon-btn hide-sm" onClick={() => setSearch(true)} aria-label={t('nav.search')}>{ICON.search}<span className="hide-md">{t('nav.search')}</span></button>
          </div>
          <Link href="/" className="brand" aria-label="Nargiza Diamonds">
            <span className="brand__main">NARGIZA</span>
            <span className="brand__sub">DIAMONDS</span>
          </Link>
          <div className="hdr__right">
            <div className="lang hide-sm">
              {(['ru', 'uz'] as const).map((l) => (
                <button key={l} className={lang === l ? 'is-active' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button className="icon-btn show-sm" onClick={() => setSearch(true)} aria-label={t('nav.search')}>{ICON.search}</button>
            <Link href="/favorites" className="icon-btn" aria-label={t('nav.favorites')}>{ICON.heart}</Link>
            <button className="icon-btn" onClick={() => setDrawer(true)} aria-label={t('nav.cart')}>
              {ICON.bag}{count > 0 && <span className="badge">{count}</span>}
            </button>
          </div>
        </div>
        <nav className="hdr__nav">
          <Link href="/catalog" onMouseEnter={() => setMega(true)} className={path.startsWith('/catalog') ? 'is-active' : ''}>{t('nav.jewelry')}</Link>
          <Link href="/catalog?price=u1500" onMouseEnter={() => setMega(false)}>{t('nav.gifts')}</Link>
          <Link href="/about" onMouseEnter={() => setMega(false)} className={path === '/about' ? 'is-active' : ''}>{t('nav.maison')}</Link>
          <Link href="/boutique" onMouseEnter={() => setMega(false)} className={path === '/boutique' ? 'is-active' : ''}>{t('nav.boutique')}</Link>
          <Link href="/wholesale" onMouseEnter={() => setMega(false)} className={path === '/wholesale' ? 'is-active' : ''}>{t('nav.wholesale')}</Link>
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
              <Link href="/catalog?stone=sapphire">{t('stone.sapphire')}</Link>
            </div>
            <div className="mega__tiles">
              {(['rings', 'earrings', 'necklaces'] as const).map((c) => (
                <Link key={c} href={`/catalog?category=${c}`} className="mega__tile">
                  <div className="mega__art"><ProductArt art={CAT_ART[c]} metal={c === 'earrings' ? 'yellow' : 'white'} stone="diamond" /></div>
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
          <p className="mmenu__label">Nargiza</p>
          <Link href="/catalog?price=u1500">{t('nav.gifts')}</Link>
          <Link href="/about">{t('nav.maison')}</Link>
          <Link href="/boutique">{t('nav.boutique')}</Link>
          <Link href="/wholesale">{t('nav.wholesale')}</Link>
          <div className="lang lang--menu">
            {(['ru', 'uz'] as const).map((l) => (
              <button key={l} className={lang === l ? 'is-active' : ''} onClick={() => setLang(l)}>{l === 'ru' ? 'Русский' : 'O‘zbekcha'}</button>
            ))}
          </div>
        </div>
      </div>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
