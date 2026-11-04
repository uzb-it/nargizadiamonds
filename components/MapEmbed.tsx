'use client';

import { useEffect, useRef, useState } from 'react';

const SRC = 'https://maps.google.com/maps?q=%D0%BC%D0%B5%D1%82%D1%80%D0%BE%20%D0%9D%D0%BE%D0%B2%D0%B7%D0%B0%20%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82&z=15&output=embed';

/**
 * Google Maps iframe is heavy; it is mounted only once the block is on screen
 * and the browser is idle, so it never causes jank while scrolling.
 */
export function MapEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let idle = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const go = () => setShow(true);
      idle = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 400) as unknown as number;
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle); else clearTimeout(idle); };
  }, []);

  return (
    <div ref={ref} className="map-embed">
      {show && <iframe title="map" src={SRC} referrerPolicy="no-referrer-when-downgrade" onLoad={(e) => e.currentTarget.classList.add('is-loaded')} />}
    </div>
  );
}
