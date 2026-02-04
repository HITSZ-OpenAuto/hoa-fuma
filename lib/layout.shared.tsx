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
      },
      {
        text: '博客',
        url: '/blog',
        active: 'nested-url',
      },
      {
        text: '新闻',
        url: '/news',
        active: 'nested-url',
      },
      {
        text: 'Page 1',
        url: '/page1',
        active: 'url',
      },
      {
        text: 'Page 2',
        url: '/page2',
        active: 'url',
      },
    ],
    githubUrl: 'https://github.com/hitsz-openauto',
  };
}
