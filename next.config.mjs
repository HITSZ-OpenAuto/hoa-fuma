import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  agentRules: false,
  output: 'standalone',
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/blog/distributive-guidance-for-21',
        destination: '/blog/course-selection-auto/distributive-guidance-for-21',
        permanent: true,
      },
      {
        source: '/blog/distributive-guidance-for-22',
        destination: '/blog/course-selection-auto/distributive-guidance-for-22',
        permanent: true,
      },
      {
        source: '/blog/writing-rules',
        destination: 'https://wiki.hoa.moe/',
        permanent: true,
      },
    ];
  },
  experimental: {
    useTypeScriptCli: true,
    workerThreads: true,
  },
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
      {
        protocol: 'https',
        hostname: 'uptime.kuma.pet',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scuteee.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'penjc.github.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nuaastore.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.longlin.tech',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'longbin.tech',
        pathname: '/**',
      },
    ],
  },
};

export default withMDX(config);
