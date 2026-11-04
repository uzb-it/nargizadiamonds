/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: { unoptimized: true },
  experimental: { serverActions: { bodySizeLimit: '60mb' } },
};
export default nextConfig;
