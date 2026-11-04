'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/** Smooth scrolling + scroll-driven reveals for every page. */
export function Motion() {
  const path = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  const isAdmin = path.startsWith('/admin');
  useEffect(() => {
    if (isAdmin || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)) });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
  }, [isAdmin]);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    const ctx = gsap.context(() => {
      // [data-reveal] fade + rise
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal')) : [];
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: Math.max(0, sibs.indexOf(el)) * .08,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });
      // hero intro plays on load, not on scroll
      const intro = document.querySelectorAll('[data-intro]');
      if (intro.length) gsap.fromTo(intro, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, stagger: .12, delay: .4, ease: 'expo.out' });
      // [data-lines] text: each line rises from a mask
      gsap.utils.toArray<HTMLElement>('[data-lines]').forEach((el) => {
        const inner = el.querySelectorAll('.ln > span');
        if (!inner.length) return;
        gsap.fromTo(inner, { yPercent: 110 }, {
          yPercent: 0, duration: 1.4, stagger: .1, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
      // [data-curtain] media reveal: fade + settle, transform/opacity only (GPU-composited, no repaints)
      gsap.utils.toArray<HTMLElement>('[data-curtain]').forEach((el) => {
        const inner = el.firstElementChild;
        const st = { trigger: el, start: 'top 85%', once: true };
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out', clearProps: 'opacity', scrollTrigger: st });
        if (inner) gsap.fromTo(inner, { scale: 1.15 }, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'transform', scrollTrigger: st });
      });
      // [data-parallax] subtle drift
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amt = parseFloat(el.dataset.parallax || '12');
        gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { clearTimeout(id); ctx.revert(); };
  }, [path]);

  return null;
}

/** Splits text into masked lines (by explicit \n or by the array given). */
export function Lines({ lines, className, as: Tag = 'h2' }: { lines: string[]; className?: string; as?: 'h1' | 'h2' | 'h3' | 'p' }) {
  return (
    <Tag className={className} data-lines>
      {lines.map((l, i) => <span key={i} className="ln"><span>{l}</span></span>)}
    </Tag>
  );
}
