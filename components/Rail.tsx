'use client';

import { useRef } from 'react';

/** Horizontal snap carousel with arrow controls and mouse drag. */
export function Rail({ children, controls = true }: { children: React.ReactNode; controls?: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const by = (dir: number) => el.current?.scrollBy({ left: dir * el.current.clientWidth * 0.75, behavior: 'smooth' });

  return (
    <div className="rail-wrap">
      {controls && (
        <div className="rail-ctrl" style={{ justifyContent: 'flex-end', marginBottom: 20 }}>
          <button onClick={() => by(-1)} aria-label="Prev">←</button>
          <button onClick={() => by(1)} aria-label="Next">→</button>
        </div>
      )}
      <div
        ref={el}
        className="rail"
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse') return;
          drag.current = { x: e.clientX, left: el.current!.scrollLeft, moved: false };
          el.current!.style.scrollSnapType = 'none';
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 5) drag.current.moved = true;
          el.current!.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => { if (el.current) el.current.style.scrollSnapType = ''; setTimeout(() => { drag.current = null; }, 0); }}
        onPointerLeave={() => { if (el.current) el.current.style.scrollSnapType = ''; drag.current = null; }}
        onClickCapture={(e) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); } }}
      >
        {children}
      </div>
    </div>
  );
}
