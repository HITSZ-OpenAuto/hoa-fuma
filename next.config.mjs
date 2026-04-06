import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'osa.moe',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'p1-hera.feishucdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.flowus.cn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'man.naosi.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.criwits.top',
        pathname: '/**',
      },
    ],
  },
};

export default withMDX(config);
