import { Feed } from 'feed';
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

export function getRSS(kind: FeedKind) {
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
    feed.addItem({
      id: `${baseUrl}${page.url}`,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
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
