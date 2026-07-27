import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { LanguageToggle } from '@/components/language-toggle';

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
        text: '友链',
        url: '/links',
        active: 'nested-url',
      },
      {
        type: 'custom',
        children: <LanguageToggle key="language-toggle" />,
      },
    ],
    githubUrl: 'https://github.com/hitsz-openauto',
  };
}
