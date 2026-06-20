import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { isYear } from '@/lib/utils';

export const docsDirs = {
  '2019': join(process.cwd(), 'content/docs/2019'),
  '2020': join(process.cwd(), 'content/docs/2020'),
  '2021': join(process.cwd(), 'content/docs/2021'),
  '2022': join(process.cwd(), 'content/docs/2022'),
  '2023': join(process.cwd(), 'content/docs/2023'),
  '2024': join(process.cwd(), 'content/docs/2024'),
  '2025': join(process.cwd(), 'content/docs/2025'),
} as const;

export type DocsYear = keyof typeof docsDirs;

export function getDocsYearDir(year: string): string | undefined {
  if (!isYear(year)) return undefined;
  return docsDirs[year as DocsYear];
}

export function isSafePathSegment(segment: string): boolean {
  return segment.length > 0 && segment !== '.' && segment !== '..';
}

export function getMarkdownFiles(dir: string): string[] {
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
