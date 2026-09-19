import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'HITSZ 课程攻略共享计划',
    },
    themeSwitch: {
      mode: 'light-dark-system',
    },
    links: [
      {
        text: '文档',
        url: '/docs',
        active: 'nested-url',
        on: 'nav',
      },
      {
        text: '博客',
        url: '/blog',
        active: 'nested-url',
        on: 'nav',
      },
      {
        text: '新闻',
        url: '/news',
        active: 'nested-url',
        on: 'nav',
      },
      {
        text: '参与',
        url: 'https://wiki.hoa.moe',
        active: 'none',
        external: true,
        on: 'nav',
      },
      {
        text: '友链',
        url: '/links',
        active: 'nested-url',
        on: 'nav',
      },
      {
        text: '捐助',
        url: '/sponsor',
        active: 'nested-url',
        on: 'nav',
      },
      {
        text: '关于',
        url: '/about',
        active: 'nested-url',
        on: 'nav',
      },
    ],
    githubUrl: 'https://github.com/hitsz-openauto',
  };
}
