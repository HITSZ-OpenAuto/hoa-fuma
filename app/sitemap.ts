import type { MetadataRoute } from 'next';
import { getDocsPathEntries } from '@/lib/docs-paths';
import { getDocsSeoPath } from '@/lib/docs-seo';
import { getPostSummaries } from '@/lib/posts-summary';
import { pages } from '@/lib/source/pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set(['/', '/blog', '/news', '/privacy']);

  for (const page of pages.getPages()) {
    paths.add(page.url);
  }

  for (const page of getPostSummaries('blog')) {
    paths.add(page.url);
  }

  for (const page of getPostSummaries('news')) {
    if (page.slugs[0] !== 'weekly' && page.slugs[0] !== 'daily') {
      paths.add(page.url);
    }
  }

  for (const { slugs } of getDocsPathEntries()) {
    const { canonical, indexable } = getDocsSeoPath(slugs);
    if (indexable && canonical) paths.add(canonical);
  }

  return [...paths].sort().map((path) => ({
    url: new URL(path, 'https://hoa.moe').toString(),
  }));
}
