import type { Metal, Stone } from '@/lib/types';

/* Hand-drawn SVG jewelry used until real photos are uploaded in /admin. */

const r2 = (n: number) => Math.round(n * 10) / 10;
const M: Record<Metal, string> = { white: 'url(#ndWhite)', yellow: 'url(#ndYellow)', rose: 'url(#ndRose)' };
const S: Record<Stone, string> = { diamond: 'url(#ndDia)', sapphire: 'url(#ndSapph)', emerald: 'url(#ndEmer)', ruby: 'url(#ndRuby)' };

const glint = (x: number, y: number, s = 6) => {
  const d = r2(((x * 7 + y * 13) % 30) / 10);
  return `<path class="glint" style="animation-delay:${d}s" fill="#fff" d="M${x} ${y - s}L${x + s * .14} ${y - s * .14}L${x + s} ${y}L${x + s * .14} ${y + s * .14}L${x} ${y + s}L${x - s * .14} ${y + s * .14}L${x - s} ${y}L${x - s * .14} ${y - s * .14}Z"/>`;
};
const gem = (x: number, y: number, r: number, fill = 'url(#ndDia)') =>
  `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}" stroke="#6f7884" stroke-opacity=".55" stroke-width=".45"/>` +
  `<path d="M${r2(x - r * .5)} ${r2(y)}L${r2(x)} ${r2(y - r * .5)}L${r2(x + r * .5)} ${r2(y)}L${r2(x)} ${r2(y + r * .5)}Z" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width=".35"/>` +
  `<circle cx="${r2(x - r * .35)}" cy="${r2(y - r * .38)}" r="${r2(r * .2)}" fill="#fff"/>`;
const pear = (x: number, y: number, s: number, rot = 0, fill = 'url(#ndDia)') =>
  `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot}) scale(${s})"><path d="M0-10C6-2 7 4 0 9C-7 4-6-2 0-10Z" fill="${fill}" stroke="#6f7884" stroke-opacity=".6" stroke-width=".5"/><path d="M0-10L0 9M-5 1L5 1M-4-3L4 5M4-3L-4 5" stroke="#fff" stroke-opacity=".7" stroke-width=".35" fill="none"/></g>`;
const brilliant = (cx: number, cy: number, w: number, fill = 'url(#ndDia)') => {
  const h = w * .85, x = cx - w / 2, y = cy - h / 2;
  const p = (a: number, b: number) => `${r2(x + a * w)} ${r2(y + b * h)}`;
  return `<path d="M${p(0, .32)}L${p(.25, .03)}H${r2(x + .75 * w)}L${p(1, .32)}L${p(.5, 1)}Z" fill="${fill}" stroke="#6f7884" stroke-opacity=".6" stroke-width=".6"/>` +
    `<path d="M${p(0, .32)}H${r2(x + w)}M${p(.25, .03)}L${p(.36, .32)}L${p(.5, .03)}L${p(.64, .32)}L${p(.75, .03)}M${p(.36, .32)}L${p(.5, 1)}L${p(.64, .32)}M${p(0, .32)}L${p(.5, 1)}L${p(1, .32)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width=".5"/>`;
};
const ellipseBand = (cx: number, cy: number, rx: number, ry: number, metal: string, w: number) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${metal}" stroke-width="${w}"/>` +
  `<ellipse cx="${cx}" cy="${cy - w * .25}" rx="${rx}" ry="${ry}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${r2(w * .18)}"/>`;

type ArtFn = (m: string, s: string) => string;

const ART: Record<string, ArtFn> = {
  solitaire: (m, s) =>
    ellipseBand(100, 140, 52, 20, m, 8) +
    `<path d="M84 124 L91 98 M116 124 L109 98 M100 126 L100 102" stroke="${m}" stroke-width="4" stroke-linecap="round"/>` +
    brilliant(100, 82, 70, s) + glint(100, 60, 15) + glint(76, 86, 6),
  halo: (m, s) => {
    let o = ellipseBand(100, 142, 50, 19, m, 7);
    for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; o += gem(100 + Math.cos(a) * 30, 86 + Math.sin(a) * 30, 5); }
    return o + gem(100, 86, 22, s) + glint(100, 80, 16) + glint(132, 60, 6);
  },
  trinity: (m, s) =>
    ellipseBand(100, 142, 54, 20, m, 8) + brilliant(68, 104, 34) + brilliant(132, 104, 34) + brilliant(100, 96, 52, s) +
    glint(100, 82, 13) + glint(64, 96, 6) + glint(136, 96, 6),
  band: (m) => {
    let o = `<ellipse cx="100" cy="110" rx="72" ry="30" fill="none" stroke="${m}" stroke-width="16" opacity=".55"/>` +
      `<path d="M28 110 A72 30 0 0 0 172 110" fill="none" stroke="${m}" stroke-width="16"/>`;
    for (let i = 0; i <= 15; i++) { const a = Math.PI - (i / 15) * Math.PI; o += gem(100 + Math.cos(a) * 72, 110 + Math.sin(a) * 30, 6.4 + Math.sin(a) * 1.4); }
    return o + glint(100, 140, 12) + glint(52, 130, 7);
  },
  twist: (m) => {
    let o = `<path d="M30 110 C 60 70, 140 150, 170 110" fill="none" stroke="${m}" stroke-width="9"/>` +
      `<path d="M30 110 C 60 150, 140 70, 170 110" fill="none" stroke="${m}" stroke-width="9" opacity=".7"/>` +
      `<ellipse cx="100" cy="110" rx="70" ry="34" fill="none" stroke="${m}" stroke-width="5" opacity=".35"/>`;
    for (let i = 1; i < 12; i++) {
      const tt = i / 12, x = 30 + 140 * tt;
      const y = (1 - tt) ** 3 * 110 + 3 * (1 - tt) ** 2 * tt * 70 + 3 * (1 - tt) * tt * tt * 150 + tt ** 3 * 110;
      o += gem(x, y, 4.2);
    }
    return o + glint(100, 108, 10);
  },
  butterfly: (m, s) => {
    const fill = s === 'url(#ndDia)' ? 'url(#ndPaveSapph)' : s;
    const wing = (rot: number, sx: number, sy: number) =>
      `<g transform="translate(100 98) rotate(${rot}) scale(${sx} ${sy})"><path d="M0 0 C-10 -20 -14 -64 -2 -74 C12 -84 34 -50 18 -20 C12 -8 6 -2 0 0Z" fill="${fill}" stroke="#fff" stroke-width="3.4" stroke-dasharray=".1 4.6" stroke-linecap="round"/><path d="M0 0 C-10 -20 -14 -64 -2 -74 C12 -84 34 -50 18 -20 C12 -8 6 -2 0 0Z" fill="none" stroke="#6f7884" stroke-opacity=".4" stroke-width=".5"/></g>`;
    let o = ellipseBand(100, 152, 40, 12, m, 6);
    o += wing(-48, 1, 1) + wing(48, -1, 1) + wing(-140, .65, .65) + wing(140, -.65, .65);
    for (let i = 0; i < 6; i++) o += gem(100, 70 + i * 10, 4.2 - i * .25);
    return o + `<path d="M100 66 C 96 52, 88 46, 82 44 M100 66 C 104 52, 112 46, 118 44" stroke="${m}" stroke-width="1.4" fill="none"/>` +
      gem(82, 44, 3) + gem(118, 44, 3) + glint(60, 60, 8) + glint(146, 120, 7);
  },
  drops: (m, s) => {
    let o = '';
    [62, 138].forEach((cx, side) => {
      o += gem(cx, 30, 9, s);
      [-13, 0, 13].forEach((dx, k) => {
        const n = k === 1 ? 6 : 5;
        o += `<path d="M${cx} 40 L${cx + dx} ${48 + n * 22}" stroke="${m}" stroke-width="1.2"/>`;
        for (let i = 0; i < n; i++) o += pear(cx + dx * ((i + 1) / n), 52 + i * 22 + (k === 1 ? 6 : 0), .95 * (1 - i * .06) * (k === 1 ? 1.08 : 1), side ? 4 : -4);
      });
      o += glint(cx - 18, 70 + side * 30, 7);
    });
    return o;
  },
  hoops: (m) => {
    let o = '';
    ([[78, 100, -10], [124, 104, 12]] as const).forEach(([cx, cy, rot]) => {
      o += `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="38" ry="70" fill="none" stroke="${m}" stroke-width="15"/>`;
      for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2; o += gem(cx + Math.cos(a) * 38, cy + Math.sin(a) * 70, 5.3); }
      o += '</g>';
    });
    return o + glint(54, 48, 8) + glint(150, 150, 7);
  },
  studs: (m, s) =>
    [70, 130].map((cx) =>
      `<path d="M${cx} 108 v34" stroke="${m}" stroke-width="3" stroke-linecap="round"/>` +
      `<ellipse cx="${cx}" cy="140" rx="9" ry="4" fill="${m}"/>` +
      gem(cx, 100, 20, s) + `<path d="M${cx - 18} 92 l6 3 M${cx + 18} 92 l-6 3 M${cx - 16} 112 l6 -3 M${cx + 16} 112 l-6 -3" stroke="${m}" stroke-width="3" stroke-linecap="round"/>` +
      glint(cx - 6, 94, 11)).join(''),
  halodrop: (m, s) =>
    [64, 136].map((cx) => {
      let o = gem(cx, 40, 7) + `<path d="M${cx} 47 v26" stroke="${m}" stroke-width="2"/>`;
      for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; o += gem(cx + Math.cos(a) * 24, 108 + Math.sin(a) * 30, 4.4); }
      return o + pear(cx, 108, 2.4, 0, s) + glint(cx, 100, 10);
    }).join(''),
  tennis: (m) => {
    let o = `<path d="M22 30 C 30 140, 170 140, 178 30" fill="none" stroke="${m}" stroke-width="3"/>`;
    for (let i = 0; i <= 34; i++) {
      const tt = i / 34;
      const x = (1 - tt) ** 3 * 22 + 3 * (1 - tt) ** 2 * tt * 30 + 3 * (1 - tt) * tt ** 2 * 170 + tt ** 3 * 178;
      const y = (1 - tt) ** 3 * 30 + 3 * (1 - tt) ** 2 * tt * 140 + 3 * (1 - tt) * tt ** 2 * 140 + tt ** 3 * 30;
      o += gem(x, y, 3.4 + Math.sin(tt * Math.PI) * 2.6);
    }
    return o + gem(100, 128, 10) + glint(100, 128, 14) + glint(40, 80, 6);
  },
  pendant: (m, s) => {
    let o = `<path d="M30 20 C 40 100, 160 100, 170 20" fill="none" stroke="${m}" stroke-width="1.6"/>`;
    o += `<circle cx="100" cy="82" r="4" fill="none" stroke="${m}" stroke-width="2"/>`;
    if (s !== 'url(#ndDia)') for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; o += gem(100 + Math.cos(a) * 19, 118 + Math.sin(a) * 25, 3.6); }
    return o + pear(100, 118, s !== 'url(#ndDia)' ? 1.9 : 2.6, 0, s) + glint(100, 110, 12) + glint(130, 70, 5);
  },
  bracelet: (m) => {
    let o = `<ellipse cx="100" cy="104" rx="76" ry="44" fill="none" stroke="${m}" stroke-width="10" opacity=".45"/>`;
    for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2; const front = Math.sin(a) > 0; o += front ? gem(100 + Math.cos(a) * 76, 104 + Math.sin(a) * 44, 6.2) : ''; }
    o += `<rect x="168" y="96" width="10" height="16" rx="3" fill="${m}"/>`;
    return o + glint(100, 148, 12) + glint(40, 128, 7);
  },
  bangle: (m) => {
    let o = `<ellipse cx="100" cy="104" rx="70" ry="42" fill="none" stroke="${m}" stroke-width="20" opacity=".55"/>` +
      `<path d="M30 104 A70 42 0 0 0 170 104" fill="none" stroke="${m}" stroke-width="20"/>` +
      `<path d="M30 100 A70 42 0 0 0 170 100" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>`;
    for (let i = 3; i <= 9; i++) { const a = Math.PI - (i / 12) * Math.PI; o += gem(100 + Math.cos(a) * 70, 104 + Math.sin(a) * 42, 5.2); }
    return o + glint(100, 146, 11);
  },
  brooch: (m, s) => {
    let o = `<path d="M100 104 C 96 140, 80 160, 62 182" stroke="${m}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M86 150 C 70 140, 58 146, 52 156 C 66 160, 78 158, 86 150Z" fill="${m}"/>`;
    for (let i = 0; i < 6; i++) {
      o += `<g transform="rotate(${i * 60} 100 78)"><ellipse cx="100" cy="46" rx="16" ry="28" fill="url(#ndDia)" stroke="#fff" stroke-width="3" stroke-dasharray=".1 5" stroke-linecap="round"/><ellipse cx="100" cy="46" rx="16" ry="28" fill="none" stroke="#6f7884" stroke-opacity=".4" stroke-width=".5"/></g>`;
    }
    return o + gem(100, 78, 13, s) + glint(100, 78, 16) + glint(58, 40, 7);
  },
};

export const ART_KEYS = Object.keys(ART);

export function ProductArt({ art, metal, stone, className }: { art: string; metal: Metal; stone: Stone; className?: string }) {
  const fn = ART[art] ?? ART.solitaire;
  return (
    <svg className={'art ' + (className ?? '')} viewBox="0 0 200 200" aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: fn(M[metal], S[stone]) }} />
  );
}

/** Shared gradients — rendered once in the root layout. */
export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="ndYellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4dc9a" /><stop offset=".35" stopColor="#c19a45" /><stop offset=".6" stopColor="#f6e2a6" /><stop offset="1" stopColor="#8d6a25" />
        </linearGradient>
        <linearGradient id="ndWhite" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5f6f8" /><stop offset=".4" stopColor="#9da3ab" /><stop offset=".7" stopColor="#e6e9ed" /><stop offset="1" stopColor="#6c727a" />
        </linearGradient>
        <linearGradient id="ndRose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6d0c0" /><stop offset=".4" stopColor="#c58c76" /><stop offset=".7" stopColor="#f3cbb9" /><stop offset="1" stopColor="#8f5a48" />
        </linearGradient>
        <radialGradient id="ndDia" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#ffffff" /><stop offset=".4" stopColor="#e3ecf4" /><stop offset=".75" stopColor="#a6b4c3" /><stop offset="1" stopColor="#eef3f8" />
        </radialGradient>
        <radialGradient id="ndSapph" cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor="#8ea2ff" /><stop offset=".5" stopColor="#1f2c96" /><stop offset="1" stopColor="#0a1048" />
        </radialGradient>
        <radialGradient id="ndEmer" cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor="#8ff0c0" /><stop offset=".5" stopColor="#0f7a4c" /><stop offset="1" stopColor="#053b24" />
        </radialGradient>
        <radialGradient id="ndRuby" cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor="#ff9fb3" /><stop offset=".5" stopColor="#a5102f" /><stop offset="1" stopColor="#4b0414" />
        </radialGradient>
        <pattern id="ndPaveSapph" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="2.6" fill="url(#ndSapph)" /><circle cx="2.6" cy="2.6" r=".8" fill="#c8d2ff" opacity=".8" />
        </pattern>
      </defs>
    </svg>
  );
}
