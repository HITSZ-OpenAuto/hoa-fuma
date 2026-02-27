import { source } from '@/lib/source';
import majorMapping from '@/hoa-major-data/major_mapping.json';
import { cache } from 'react';
import { computeYearMajorMap, MajorEntry } from './docs-utils';

export function getAvailableYears(): string[] {
  const years: string[] = [];
  for (const node of source.getPageTree().children) {
    if (
      node.type === 'folder' &&
      typeof node.name === 'string' &&
      /^\d{4}$/.test(node.name)
    ) {
      years.push(node.name);
    }
  }
  return years.sort((a, b) => b.localeCompare(a));
}

export const getYearMajorMap = cache(() => {
  const pages = source.getPages();
  const mapping = majorMapping as unknown as Record<
    string,
    Record<string, MajorEntry>
  >;
  return computeYearMajorMap(pages, mapping);
});
