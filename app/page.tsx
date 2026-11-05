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
  rings: ['solitaire', 'white'], earrings: ['drops', 'yellow'], necklaces: ['tennis', 'white'], bracelets: ['bangle', 'yellow'], brooches: ['brooch', 'yellow'],
};

const SVC_ICONS = {
  video: <path d="M3 7h12v10H3zM15 10l6-3v10l-6-3" />,
  boutique: <><path d="M4 9h16v11H4z" /><path d="M8 9V6a4 4 0 0 1 8 0v3" /></>,
  size: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /></>,
  care: <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />,
};

export default function Home() {
  const { t } = useLang();
  const products = useProducts();
  const featured = products.filter((p) => p.featured);
  const gifts = products.filter((p) => p.price !== null && p.price <= 1500).slice(0, 4);

  return (
    <>
      {/* HERO — full-bleed campaign with the 3D diamond */}
      <section className="hero">
        <Diamond className="hero__canvas" />
        <div className="hero__inner">
          <p className="kicker" data-intro>{t('hero.kicker')}</p>
          <h1 className="hero__title" data-lines>
            <span className="ln"><span>{t('hero.title1')}</span></span>
            <span className="ln"><span><em>{t('hero.title2')}</em></span></span>
          </h1>
          <div data-intro><Link href="/catalog" className="link-u link-u--light">{t('hero.cta')}</Link></div>
        </div>
        <span className="hero__scroll" aria-hidden />
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head sec-head--center">
            <Lines className="h2" lines={[t('home.cats')]} />
            <p className="lead" data-reveal>{t('home.catsSub')}</p>
          </div>
          <div className="cats">
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/catalog?category=${c}`} className="cat" data-reveal>
                <div className="cat__media" data-curtain><ProductArt art={CAT_ART[c][0]} metal={CAT_ART[c][1]} stone="diamond" /></div>
                <p className="cat__name">{t(`cat.${c}`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL DUO */}
      <section className="duo">
        <Link href="/catalog?category=rings" className="duo__item">
          <div className="duo__media" data-curtain><ProductArt art="halo" metal="white" stone="diamond" /></div>
          <div className="duo__text">
            <span className="kicker" data-reveal>{t('home.duo1.k')}</span>
            <h3 className="h3" data-reveal>{t('home.duo1.t')}</h3>
            <p data-reveal>{t('home.duo1.d')}</p>
            <span className="link-u" data-reveal>{t('home.discover')}</span>
          </div>
        </Link>
        <Link href="/catalog?stone=sapphire,emerald,ruby" className="duo__item">
          <div className="duo__media duo__media--deep" data-curtain><ProductArt art="butterfly" metal="white" stone="sapphire" /></div>
          <div className="duo__text">
            <span className="kicker" data-reveal>{t('home.duo2.k')}</span>
            <h3 className="h3" data-reveal>{t('home.duo2.t')}</h3>
            <p data-reveal>{t('home.duo2.d')}</p>
            <span className="link-u" data-reveal>{t('home.discover')}</span>
          </div>
        </Link>
      </section>

      {/* BESTSELLERS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head sec-head--center">
            <Lines className="h2" lines={[t('home.featured')]} />
            <p className="lead" data-reveal>{t('home.featuredSub')}</p>
          </div>
          <Rail>
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </Rail>
          <div className="center" data-reveal><Link href="/catalog" className="btn btn--line">{t('nav.all')}</Link></div>
        </div>
      </section>

      {/* STORY */}
      <section className="story">
        <div className="story__media">
          <span className="story__ring" /><span className="story__ring" />
          <div data-parallax="8" className="story__art">
            <ProductArt art="halo" metal="yellow" stone="diamond" />
          </div>
        </div>
        <div className="story__text">
          <span className="kicker" data-reveal>{t('home.story.kicker')}</span>
          <Lines className="h2" lines={[t('home.story.title')]} />
          <p data-reveal>{t('home.story.text')}</p>
          <Link href="/about" className="link-u link-u--light" data-reveal>{t('home.story.cta')}</Link>
        </div>
      </section>

      {/* GIFTS */}
      <section className="section">
        <div className="wrap gifts">
          <div className="gifts__text">
            <span className="kicker" data-reveal>{t('home.gifts.kicker')}</span>
            <Lines className="h2" lines={[t('home.gifts.title')]} />
            <p className="lead" data-reveal>{t('home.gifts.text')}</p>
            <div data-reveal><Link href="/catalog?price=u1500" className="btn btn--dark">{t('home.discover')}</Link></div>
          </div>
          <div className="gifts__grid">
            {gifts.map((p) => <div key={p.id} data-reveal><ProductCard p={p} /></div>)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-sec">
        <div className="wrap">
          <div className="sec-head sec-head--center">
            <Lines className="h2" lines={[t('home.services')]} />
          </div>
          <div className="services">
            {(['video', 'boutique', 'size', 'care'] as const).map((k) => (
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
          <p data-reveal className="muted">{t('boutique.text')}</p>
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
