import { Feed } from 'feed';
import { parseFragment, serialize, type DefaultTreeAdapterMap } from 'parse5';
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
type HtmlNode = DefaultTreeAdapterMap['node'];

const urlAttributes = new Set(['href', 'src', 'poster']);

function absoluteUrl(value: string, pageUrl: string) {
  return new URL(value, pageUrl).toString();
}

function absoluteSrcset(value: string, pageUrl: string) {
  return value
    .split(',')
    .map((candidate) => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);
      return [absoluteUrl(url, pageUrl), ...descriptor].join(' ');
    })
    .join(', ');
}

function rewriteContentUrls(node: HtmlNode, pageUrl: string) {
  if ('attrs' in node) {
    for (const attribute of node.attrs) {
      if (urlAttributes.has(attribute.name)) {
        attribute.value = absoluteUrl(attribute.value, pageUrl);
      } else if (attribute.name === 'srcset') {
        attribute.value = absoluteSrcset(attribute.value, pageUrl);
      }
    }
  }

  if ('childNodes' in node) {
    for (const child of node.childNodes) rewriteContentUrls(child, pageUrl);
  }

  if ('content' in node) rewriteContentUrls(node.content, pageUrl);
}

function absoluteContentUrls(content: string, pageUrl: string) {
  const fragment = parseFragment(content);
  rewriteContentUrls(fragment, pageUrl);
  return serialize(fragment);
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
