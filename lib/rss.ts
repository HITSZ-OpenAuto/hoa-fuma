import { Feed } from 'feed';
import { createElement } from 'react';
import { prerender } from 'react-dom/static';
import { rssComponents } from '@/components/rss';
import { blog, news } from '@/lib/source/posts';

const baseUrl = 'https://hoa.moe';

const feedInfo = {
  blog: {
    title: 'HOA 博客',
    description: '了解校内最新资讯，分享学习心得',
  },
  news: {
    title: 'HOA 新闻',
    description: '最新动态与公告',
  },
} as const;

type FeedKind = keyof typeof feedInfo;

function absoluteUrl(value: string, pageUrl: string) {
  return new URL(value.replaceAll('&amp;', '&'), pageUrl)
    .toString()
    .replaceAll('&', '&amp;');
}

function absoluteContentUrls(content: string, pageUrl: string) {
  return content
    .replace(
      /\b(href|src|poster)="([^"]+)"/gi,
      (_, attribute: string, value: string) =>
        `${attribute}="${absoluteUrl(value, pageUrl)}"`
    )
    .replace(/\bsrcset="([^"]+)"/gi, (_, value: string) => {
      const candidates = value.split(',').map((candidate) => {
        const [url, ...descriptor] = candidate.trim().split(/\s+/);
        return [absoluteUrl(url, pageUrl), ...descriptor].join(' ');
      });
      return `srcset="${candidates.join(', ')}"`;
    });
}

export async function getRSS(kind: FeedKind) {
  const info = feedInfo[kind];
  const feedUrl = `${baseUrl}/${kind}/rss.xml`;
  const feed = new Feed({
    title: info.title,
    description: info.description,
    id: `${baseUrl}/${kind}`,
    link: `${baseUrl}/${kind}`,
    language: 'zh-CN',
    image: `${baseUrl}/apple-icon.png`,
    favicon: `${baseUrl}/icons/favicon-light.png`,
    copyright: 'HITSZ OpenAuto contributors',
    feedLinks: {
      rss: feedUrl,
    },
  });

  const pages = kind === 'blog' ? blog.getPages() : news.getPages();

  for (const page of pages.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  )) {
    const pageUrl = `${baseUrl}${page.url}`;
    const { prelude } = await prerender(
      createElement(page.data.body, { components: rssComponents })
    );
    const content = absoluteContentUrls(
      await new Response(prelude).text(),
      pageUrl
    );

    feed.addItem({
      id: pageUrl,
      title: page.data.title,
      description: page.data.description,
      content,
      link: pageUrl,
      date: new Date(page.data.date),
      author: page.data.authors?.map((author) => ({
        name: author.name,
        link: author.link,
        avatar: author.image,
      })),
    });
  }

  return feed.rss2();
}
