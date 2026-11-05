'use client';

import { useEffect, useRef, useState } from 'react';

const SRC = 'https://maps.google.com/maps?q=41.2929277,69.2232834&z=17&hl=ru&output=embed';

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
