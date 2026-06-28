import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { isYear } from '@/lib/utils';

const docsRoot = join(process.cwd(), 'content/docs');

export const docsDirs: Record<string, string> = Object.fromEntries(
  readdirSync(docsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isYear(entry.name))
    .map((entry) => [entry.name, join(docsRoot, entry.name)])
    .sort(([a], [b]) => a.localeCompare(b))
);

export type DocsYear = string;

export function getDocsYearDir(year: string): string | undefined {
  if (!isYear(year)) return undefined;
  return docsDirs[year];
}

export function fileToSlugs(year: DocsYear, file: string): string[] {
  const withoutExt = relative(docsDirs[year], file).replace(/\.mdx?$/, '');
  const slugs = [year, ...withoutExt.split(sep)];

  if (slugs.at(-1) === 'index') {
    slugs.pop();
  }

  return slugs;
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
