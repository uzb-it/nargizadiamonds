'use client';

import Link from 'next/link';
import { useLang, useProducts } from '@/components/providers';
import { CATEGORIES } from '@/lib/types';
import { MAPS, TELEGRAM } from '@/lib/i18n';
import { Diamond } from '@/components/Diamond';
import { ProductCard } from '@/components/ProductCard';
import { ProductArt } from '@/components/ProductArt';
import { Rail } from '@/components/Rail';
import { Lines } from '@/components/Motion';
import { MapEmbed } from '@/components/MapEmbed';

const CAT_ART: Record<string, [string, 'white' | 'yellow' | 'rose']> = {
  rings: ['solitaire', 'yellow'], earrings: ['drops', 'yellow'], necklaces: ['tennis', 'white'], bracelets: ['bangle', 'yellow'], brooches: ['brooch', 'yellow'],
};

const SVC_ICONS = {
  video: <path d="M3 7h12v10H3zM15 10l6-3v10l-6-3" />,
  reserve: <><path d="M4 9h16v11H4z" /><path d="M8 9V6a4 4 0 0 1 8 0v3" /></>,
  size: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /></>,
  wholesale: <><path d="M3 20h18M5 20V9l7-5 7 5v11" /><path d="M9 20v-6h6v6" /></>,
};

export default function Home() {
  const { t } = useLang();
  const products = useProducts();
  const featured = products.filter((p) => p.featured);
  const gifts = products.filter((p) => p.price !== null && p.price <= 1500).slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <Diamond className="hero__canvas" />
        <div className="hero__inner">
          <p className="kicker" data-intro>{t('hero.kicker')}</p>
          <h1 className="hero__title" data-lines>
            <span className="ln"><span>{t('hero.title1')}</span></span>
            <span className="ln"><span><em>{t('hero.title2')}</em></span></span>
          </h1>
          <div className="hero__actions" data-intro>
            <Link href="/catalog" className="btn btn--light">{t('hero.cta')}</Link>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="btn btn--ghost">{t('hero.cta2')}</a>
          </div>
        </div>
        <span className="hero__scroll">Scroll</span>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head sec-head--center">
            <span className="kicker" data-reveal>Nargiza Diamonds</span>
            <Lines className="h2" lines={[t('home.cats')]} />
            <p className="lead" data-reveal>{t('home.catsSub')}</p>
          </div>
          <div className="cats">
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/catalog?category=${c}`} className="cat" data-reveal>
                <div className="cat__media" data-curtain><ProductArt art={CAT_ART[c][0]} metal={CAT_ART[c][1]} stone="diamond" /></div>
                <p className="cat__name">{t(`cat.${c}`)} <i>→</i></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="story">
        <div className="story__media">
          <span className="story__ring" /><span className="story__ring" />
          <div data-parallax="8" style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
            <ProductArt art="halo" metal="yellow" stone="diamond" />
          </div>
        </div>
        <div className="story__text">
          <span className="kicker" data-reveal>{t('home.story.kicker')}</span>
          <Lines className="h2" lines={[t('home.story.title')]} />
          <p data-reveal>{t('home.story.text')}</p>
          <Link href="/about" className="link-u" data-reveal>{t('home.story.cta')}</Link>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="kicker" data-reveal>{t('nav.highlights')}</span>
              <Lines className="h2" lines={[t('home.featured')]} />
              <p className="lead" data-reveal>{t('home.featuredSub')}</p>
            </div>
            <Link href="/catalog" className="link-u" data-reveal>{t('nav.all')}</Link>
          </div>
          <Rail>
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </Rail>
        </div>
      </section>

      {/* GIFTS */}
      <section className="gifts">
        <div className="gifts__text">
          <span className="kicker" data-reveal>{t('home.gifts.kicker')}</span>
          <Lines className="h2" lines={[t('home.gifts.title')]} />
          <p className="lead" data-reveal>{t('home.gifts.text')}</p>
          <div data-reveal><Link href="/catalog?price=u1500" className="btn btn--dark">{t('home.discover')}</Link></div>
        </div>
        <div className="gifts__grid">
          {gifts.map((p) => <div key={p.id} data-reveal><ProductCard p={p} /></div>)}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head sec-head--center">
            <Lines className="h2" lines={[t('home.services')]} />
          </div>
          <div className="services">
            {(['video', 'reserve', 'size', 'wholesale'] as const).map((k) => (
              <div key={k} className="svc" data-reveal>
                <svg className="svc__icon" viewBox="0 0 24 24">{SVC_ICONS[k]}</svg>
                <h3>{t(`svc.${k}.t`)}</h3>
                <p>{t(`svc.${k}.d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOUTIQUE */}
      <section className="boutique">
        <div className="boutique__map" data-curtain>
          <MapEmbed />
        </div>
        <div className="boutique__info">
          <span className="kicker" data-reveal>{t('home.boutique.kicker')}</span>
          <Lines className="h2" lines={[t('home.boutique.title')]} />
          <p className="addr" data-reveal>BLACK DIAMOND<br />{t('boutique.address')}</p>
          <div className="boutique__actions" data-reveal>
            <a href={MAPS} target="_blank" rel="noopener" className="btn btn--dark">{t('boutique.route')}</a>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="btn btn--line">{t('boutique.write')}</a>
          </div>
        </div>
      </section>
    </>
  );
}
