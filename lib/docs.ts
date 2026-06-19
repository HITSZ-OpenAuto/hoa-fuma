import { source } from '@/lib/source/docs';
import majorMapping from '@/lib/data/major_mapping.json';
import { cache } from 'react';
import type { Folder, Root } from 'fumadocs-core/page-tree';
import { computeYearMajorMap, MajorEntry } from './docs-utils';

export const getDocsPageTree = cache(() => source.getPageTree());

export const getAvailableYears = cache((): string[] => {
  const years: string[] = [];
  for (const node of getDocsPageTree().children) {
    if (
      node.type === 'folder' &&
      typeof node.name === 'string' &&
      /^\d{4}$/.test(node.name)
    ) {
      years.push(node.name);
    }
  }
  return years.sort((a, b) => b.localeCompare(a));
});

export const getYearPageTree = cache((year: string): Root | undefined => {
  const yearNode = getDocsPageTree().children.find(
    (node): node is Folder => node.type === 'folder' && node.name === year
  );

  if (!yearNode) return undefined;
  return { ...yearNode, type: 'root' };
});

export const getYearMajorMap = cache(() => {
  const pages = source.getPages();
  const mapping = majorMapping as unknown as Record<
    string,
    Record<string, MajorEntry>
  >;
  return computeYearMajorMap(pages, mapping);
});
