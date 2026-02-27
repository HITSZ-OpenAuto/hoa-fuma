import { news } from '@/lib/source';

export type NewsItem =
  | {
      type: 'series';
      slug: string;
      title: string;
      description: string;
      date: Date | null;
    }
  | {
      type: 'post';
      slug: string;
      title: string;
      description: string | undefined;
      date: Date;
      url: string;
    };

let cachedItems: NewsItem[] | null = null;

export function getNewsItems(): NewsItem[] {
  if (cachedItems) {
    return cachedItems;
  }

  const pages = news.getPages();
  const seriesMap = new Map<
    string,
    {
      index?: (typeof pages)[number];
      posts: (typeof pages)[number][];
    }
  >();

  for (const page of pages) {
    const seriesSlug = page.slugs[0];
    if (!seriesSlug) continue;
    const series = seriesMap.get(seriesSlug) ?? { posts: [] };
    if (page.slugs.length === 1) {
      series.index = page;
    } else {
      series.posts.push(page);
    }
    seriesMap.set(seriesSlug, series);
  }

  const seriesItems: NewsItem[] = [...seriesMap.entries()]
    .filter(([, entry]) => entry.posts.length > 0)
    .map(([slug, entry]) => {
      const dates = [
        entry.index?.data.date,
        ...entry.posts.map((post) => post.data.date),
      ]
        .filter(Boolean)
        .map((date) => new Date(date as string | Date).getTime());
      const latestDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;
      return {
        type: 'series' as const,
        slug,
        title: entry.index?.data.title ?? slug,
        description: entry.index?.data.description ?? '',
        date: latestDate,
      };
    });

  const seriesSlugs = new Set(seriesItems.map((item) => item.slug));
  const postItems: NewsItem[] = pages
    .filter(
      (page) => page.slugs.length === 1 && !seriesSlugs.has(page.slugs[0])
    )
    .map((post) => ({
      type: 'post' as const,
      slug: post.slugs[0],
      title: post.data.title,
      description: post.data.description,
      date: new Date(post.data.date),
      url: post.url,
    }));

  cachedItems = [...seriesItems, ...postItems].sort((a, b) => {
    const aDate = a.date?.getTime() ?? 0;
    const bDate = b.date?.getTime() ?? 0;
    return bDate - aDate;
  });

  return [...cachedItems];
}
