import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { siGithub } from 'simple-icons';

export function baseOptions(
  linkPlacement: 'nav' | 'all' = 'nav'
): BaseLayoutProps {
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
        on: linkPlacement,
      },
      {
        text: '博客',
        url: '/blog',
        active: 'nested-url',
        on: linkPlacement,
      },
      {
        text: '新闻',
        url: '/news',
        active: 'nested-url',
        on: linkPlacement,
      },
      {
        text: '参与',
        url: 'https://wiki.hoa.moe',
        active: 'none',
        external: true,
        on: linkPlacement,
      },
      {
        text: '友链',
        url: '/links',
        active: 'nested-url',
        on: linkPlacement,
      },
      {
        text: '捐助',
        url: '/sponsor',
        active: 'nested-url',
        on: linkPlacement,
      },
      {
        text: '关于',
        url: '/about',
        active: 'nested-url',
        on: linkPlacement,
      },
      {
        type: 'icon',
        text: 'GitHub',
        label: 'GitHub',
        url: 'https://github.com/hitsz-openauto',
        external: true,
        icon: (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path d={siGithub.path} />
          </svg>
        ),
      },
    ],
  };
}
