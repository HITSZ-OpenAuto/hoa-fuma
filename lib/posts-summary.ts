import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { frontmatter } from 'fumadocs-core/content/md/frontmatter';

type PostKind = 'blog' | 'news';

type PostFrontmatter = {
  title?: string;
  description?: string;
  date?: string | Date;
  weight?: number;
  authors?: { name: string; link?: string; image?: string }[];
};

export type PostSummary = {
  title: string;
  description?: string;
  date: string | Date;
  weight?: number;
  authors?: { name: string; link?: string; image?: string }[];
  url: string;
  slugs: string[];
};

const roots = {
  blog: join(process.cwd(), 'content/blog'),
  news: join(process.cwd(), 'content/news'),
} as const;

const summaries = new Map<PostKind, PostSummary[]>();

function getMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
      continue;
    }

    if (/\.mdx?$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getSlugs(root: string, file: string) {
  const withoutExt = relative(root, file).replace(/\.mdx?$/, '');
  const slugs = withoutExt.split(sep);

  if (slugs.at(-1) === 'index') {
    slugs.pop();
  }

  return slugs;
}

export function getPostSummaries(kind: PostKind): PostSummary[] {
  const cached = summaries.get(kind);
  if (cached) return cached;

  const root = roots[kind];
  const posts = getMarkdownFiles(root)
    .map((file): PostSummary | undefined => {
      const data = frontmatter(readFileSync(file, 'utf8'))
        .data as PostFrontmatter;
      const slugs = getSlugs(root, file);

      if (!data.title || !data.date || slugs.length === 0) {
        return undefined;
      }

      return {
        title: data.title,
        description: data.description,
        date: data.date,
        weight: data.weight,
        authors: data.authors,
        url: `/${kind}/${slugs.join('/')}`,
        slugs,
      };
    })
    .filter((post): post is PostSummary => Boolean(post));

  summaries.set(kind, posts);
  return posts;
}

export function getSeriesPosts(kind: PostKind, seriesSlug: string) {
  return getPostSummaries(kind)
    .filter((post) => post.slugs.length > 1 && post.slugs[0] === seriesSlug)
    .sort((a, b) => {
      const wa = a.weight ?? Infinity;
      const wb = b.weight ?? Infinity;
      if (wa !== wb) return wa - wb;

      const direction = kind === 'blog' ? 1 : -1;
      return (
        direction * (new Date(a.date).getTime() - new Date(b.date).getTime())
      );
    });
}

export function getPostListItems(kind: PostKind) {
  const pages = getPostSummaries(kind);
  const seriesMap = new Map<
    string,
    {
      index?: PostSummary;
      posts: PostSummary[];
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

  const seriesItems = [...seriesMap.entries()]
    .filter(([, entry]) => entry.posts.length > 0)
    .map(([slug, entry]) => {
      const dates = [
        entry.index?.date,
        ...entry.posts.map((post) => post.date),
      ].map((date) => new Date(date as string | Date).getTime());
      const latestDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;
      return {
        type: 'series' as const,
        slug,
        title: entry.index?.title ?? slug,
        description: entry.index?.description ?? '',
        date: latestDate,
      };
    });

  const seriesSlugs = new Set(seriesItems.map((item) => item.slug));
  const postItems = pages
    .filter(
      (page) => page.slugs.length === 1 && !seriesSlugs.has(page.slugs[0])
    )
    .map((post) => ({
      type: 'post' as const,
      slug: post.slugs[0],
      title: post.title,
      description: post.description,
      date: new Date(post.date),
      url: post.url,
    }));

  return [...seriesItems, ...postItems].sort((a, b) => {
    const aDate = a.date?.getTime() ?? 0;
    const bDate = b.date?.getTime() ?? 0;
    return bDate - aDate;
  });
}

export function getLatestStandaloneBlogPosts(count = 3) {
  const posts = getPostSummaries('blog');
  const seriesSlugs = new Set(
    posts
      .filter((post) => post.slugs.length > 1 && post.slugs[0])
      .map((post) => post.slugs[0])
  );

  return posts
    .filter(
      (post) =>
        post.slugs.length === 1 &&
        Boolean(post.slugs[0]) &&
        !seriesSlugs.has(post.slugs[0])
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
