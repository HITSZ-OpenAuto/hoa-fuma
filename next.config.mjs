import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
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
        hostname: 'uptime.kuma.pet',
      },
      {
        protocol: 'https',
        hostname: 'osa.moe',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'trust.hitsz.edu.cn',
      },
      {
        protocol: 'https',
        hostname: 'p1-hera.feishucdn.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.flowus.cn',
      },
      {
        protocol: 'https',
        hostname: 'www.criwits.top',
      },
      {
        protocol: 'https',
        hostname: 'man.naosi.org',
      },
      {
        protocol: 'https',
        hostname: 'scuteee.com',
      },
      {
        protocol: 'https',
        hostname: 'penjc.github.io',
      },
      {
        protocol: 'https',
        hostname: 'www.nuaastore.app',
      },
      {
        protocol: 'https',
        hostname: 'blog.longlin.tech',
      },
      {
        protocol: 'https',
        hostname: 'longbin.tech',
      },
    ],
  },
};

export default withMDX(config);
