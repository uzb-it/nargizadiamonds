'use client';

import dynamic from 'next/dynamic';

/** three.js is loaded in its own chunk, after the page is interactive. */
export const Diamond = dynamic(() => import('./Diamond3D').then((m) => m.Diamond3D), { ssr: false });
