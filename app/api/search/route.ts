import { source } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI('advanced', {
  tokenizer: createTokenizer(),
  indexes: (() => {
    const pages = source.getPages();
    const uniqueMap = new Map<string, (typeof pages)[number]>();

    for (const page of pages) {
      const year = parseInt(page.slugs[0]);
      if (isNaN(year)) {
        uniqueMap.set(page.url, page);
        continue;
      }

      const coursePath = page.slugs.slice(1).join('/');
      const existing = uniqueMap.get(coursePath);
      const existingYear = existing ? parseInt(existing.slugs[0]) : -1;

      if (!existing || year > existingYear) {
        uniqueMap.set(coursePath, page);
      }
    }

    return Array.from(uniqueMap.values()).map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
    }));
  })(),
});
