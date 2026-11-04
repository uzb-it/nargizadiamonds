/**
 * Two build modes:
 *  - default: full store with SQLite, admin panel and order API (`npm run build`).
 *  - STATIC_EXPORT=1: static site for GitHub Pages (`npm run build:pages`) — no server,
 *    orders are sent to Telegram, admin is left out (files named *.server.ts(x) are skipped).
 */
const isStatic = !!process.env.STATIC_EXPORT;
const basePath = isStatic ? process.env.PAGES_BASE_PATH ?? '/nargizadiamonds' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: { unoptimized: true },
  pageExtensions: isStatic ? ['tsx', 'ts'] : ['tsx', 'ts', 'server.tsx', 'server.ts'],
  env: { NEXT_PUBLIC_STATIC: isStatic ? '1' : '', NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isStatic
    ? { output: 'export', basePath, trailingSlash: true }
    : { experimental: { serverActions: { bodySizeLimit: '60mb' } } }),
};

export default nextConfig;
