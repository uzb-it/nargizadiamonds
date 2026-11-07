/**
 * Two build modes:
 *  - default: full store with PostgreSQL, admin panel and order API (`npm run build`).
 *  - STATIC_EXPORT=1: static site for GitHub Pages (`npm run build:pages`) — no server,
 *    orders are sent to Telegram, admin is left out (files named *.server.ts(x) are skipped).
 */
const isStatic = !!process.env.STATIC_EXPORT;
const basePath = isStatic ? process.env.PAGES_BASE_PATH ?? '/nargizadiamonds' : '';

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  'frame-src https://maps.google.com https://www.google.com',
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  // next dev needs eval and a websocket, so the policy applies to production builds only
  ...(process.env.NODE_ENV === 'production' ? [{ key: 'Content-Security-Policy', value: CSP }] : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: { unoptimized: true },
  poweredByHeader: false,
  pageExtensions: isStatic ? ['tsx', 'ts'] : ['tsx', 'ts', 'server.tsx', 'server.ts'],
  env: { NEXT_PUBLIC_STATIC: isStatic ? '1' : '', NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isStatic
    ? { output: 'export', basePath, trailingSlash: true }
    : {
      experimental: { serverActions: { bodySizeLimit: '60mb' } },
      headers: async () => [{ source: '/:path*', headers: SECURITY_HEADERS }],
    }),
};

export default nextConfig;
