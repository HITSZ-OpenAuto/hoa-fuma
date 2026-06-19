import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { isYear } from '@/lib/utils';

const docsDirs = {
  '2019': join(process.cwd(), 'content/docs/2019'),
  '2020': join(process.cwd(), 'content/docs/2020'),
  '2021': join(process.cwd(), 'content/docs/2021'),
  '2022': join(process.cwd(), 'content/docs/2022'),
  '2023': join(process.cwd(), 'content/docs/2023'),
  '2024': join(process.cwd(), 'content/docs/2024'),
  '2025': join(process.cwd(), 'content/docs/2025'),
} as const;

type Year = keyof typeof docsDirs;

export type DocsPathEntry = {
  slugs: string[];
};

let docsPathEntries: DocsPathEntry[] | undefined;
let docsPathSet: Set<string> | undefined;

function getYearDir(year: string): string | undefined {
  if (!isYear(year)) return undefined;
  return docsDirs[year as Year];
}

function isSafeSegment(segment: string): boolean {
  return segment.length > 0 && segment !== '.' && segment !== '..';
}

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

function fileToSlugs(year: Year, file: string): string[] {
  const withoutExt = relative(docsDirs[year], file).replace(/\.mdx?$/, '');
  const slugs = [year, ...withoutExt.split(sep)];

  if (slugs.at(-1) === 'index') {
    slugs.pop();
  }

  return slugs;
}

export function getDocsPathEntries(): DocsPathEntry[] {
  if (docsPathEntries) return docsPathEntries;

  const entries: DocsPathEntry[] = [];

  for (const [year, yearDir] of Object.entries(docsDirs)) {
    for (const file of getMarkdownFiles(yearDir)) {
      entries.push({ slugs: fileToSlugs(year as Year, file) });
    }
  }

  docsPathEntries = entries;
  return entries;
}

function getDocsPathSet() {
  if (!docsPathSet) {
    docsPathSet = new Set(
      getDocsPathEntries().map((entry) => entry.slugs.join('/'))
    );
  }

  return docsPathSet;
}

export function docsPathExists(segments: string[]): boolean {
  const [year, ...rest] = segments;
  if (!year) return false;

  const yearDir = getYearDir(year);
  if (!yearDir || rest.some((segment) => !isSafeSegment(segment))) {
    return false;
  }

  return getDocsPathSet().has(segments.join('/'));
}
