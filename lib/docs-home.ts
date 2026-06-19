import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import majorMapping from '@/lib/data/major_mapping.json';
import { computeYearMajorMap, type MajorEntry } from '@/lib/docs-utils';

const docsDirs = {
  '2019': join(process.cwd(), 'content/docs/2019'),
  '2020': join(process.cwd(), 'content/docs/2020'),
  '2021': join(process.cwd(), 'content/docs/2021'),
  '2022': join(process.cwd(), 'content/docs/2022'),
  '2023': join(process.cwd(), 'content/docs/2023'),
  '2024': join(process.cwd(), 'content/docs/2024'),
  '2025': join(process.cwd(), 'content/docs/2025'),
} as const;

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
