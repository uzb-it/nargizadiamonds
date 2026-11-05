'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang, useProducts } from './providers';
import { Diamond } from './Diamond';
import { ProductCard } from './ProductCard';
import { scrollToTarget } from './Motion';

const SLIDES = [
  { key: 'a', href: '/catalog' },
  { key: 'b', href: '/catalog?stone=sapphire,emerald,ruby' },
] as const;

/** Two campaign slides over the 3D stone; «История дома» opens the story of the current slide below. */
export function Hero() {
  const { t } = useLang();
  const products = useProducts();
  const [slide, setSlide] = useState(0);
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const { key, href } = SLIDES[slide];

  useEffect(() => { setAuto(!matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) scrollToTarget(panel.current!, -72); else scrollToTarget(0);
    // everything below moved: scroll-triggered reveals must recalculate their positions
    setTimeout(() => ScrollTrigger.refresh(), 900);
  };

  const story = products.filter((p) => (slide === 0 ? p.stone === 'diamond' && p.featured : p.stone !== 'diamond')).slice(0, 4);

  return (
    <>
      <section className={`hero ${auto && !open ? 'is-auto' : ''}`}>
        <Diamond className="hero__canvas" layout="hero" slide={slide} />
        <div className="hero__inner">
          <div className="hero__slides" data-intro>
            {SLIDES.map((s, i) => (
              <div key={s.key} className={`hero__slide ${i === slide ? 'is-on' : ''}`} aria-hidden={i !== slide}>
                <p className="kicker">{t(`hero.${s.key}.k`)}</p>
                {i === 0 ? <h1 className="hero__title">{t(`hero.${s.key}.t`)}</h1> : <h2 className="hero__title">{t(`hero.${s.key}.t`)}</h2>}
                <p className="hero__text">{t(`hero.${s.key}.d`)}</p>
                <Link href={s.href} className="btn btn--gold">{t(`hero.${s.key}.cta`)}</Link>
              </div>
            ))}
          </div>
          <button className={`hero__more ${open ? 'is-open' : ''}`} onClick={toggle} aria-expanded={open} data-intro>
            {t('hero.story')}<i aria-hidden />
          </button>
        </div>
        <div className="hero__count" data-intro>
          {SLIDES.map((s, i) => (
            <button key={s.key} className={i === slide ? 'is-on' : ''} onClick={() => setSlide(i)} aria-label={`${t('hero.slide')} ${i + 1}`}>0{i + 1}</button>
          ))}
          <span className="hero__line"><i key={slide} onAnimationEnd={() => setSlide((slide + 1) % SLIDES.length)} /></span>
        </div>
      </section>

      <div className={`hero-story ${open ? 'is-open' : ''}`} ref={panel} inert={!open}>
        <div className="hero-story__clip">
          <div className="wrap hero-story__inner">
            <button className="hero-story__close" onClick={toggle} aria-label={t('misc.close')}>×</button>
            <div className="hero-story__head">
              <h2 className="h2">{t(`hero.${key}.st`)}</h2>
              <div>
                <p>{t(`hero.${key}.sd`)}</p>
                <Link href={href} className="link-u">{t('home.discover')}</Link>
              </div>
            </div>
            <div className="grid">{story.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
