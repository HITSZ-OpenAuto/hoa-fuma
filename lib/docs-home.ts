import { readdirSync } from 'node:fs';
import majorMapping from '@/lib/data/major_mapping.json';
import { computeYearMajorMap, type MajorEntry } from '@/lib/docs-utils';
import { docsDirs } from '@/lib/docs-content';

let yearMajorMap: Record<string, { id: string; name: string }[]> | undefined;

export function getYearMajorMap() {
  if (yearMajorMap) return yearMajorMap;

  const pages: { slugs: string[] }[] = [];

  for (const [year, yearDir] of Object.entries(docsDirs)) {
    for (const majorEntry of readdirSync(yearDir, { withFileTypes: true })) {
      if (!majorEntry.isDirectory()) continue;
      pages.push({ slugs: [year, majorEntry.name] });
    }
  }

  const mapping = majorMapping as unknown as Record<
    string,
    Record<string, MajorEntry>
  >;

  yearMajorMap = computeYearMajorMap(pages, mapping);
  return yearMajorMap;
}
