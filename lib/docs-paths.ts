import { relative, sep } from 'node:path';
import {
  docsDirs,
  getDocsYearDir,
  getMarkdownFiles,
  isSafePathSegment,
  type DocsYear,
} from '@/lib/docs-content';

export type DocsPathEntry = {
  slugs: string[];
};

let docsPathEntries: DocsPathEntry[] | undefined;
let docsPathSet: Set<string> | undefined;

function fileToSlugs(year: DocsYear, file: string): string[] {
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
      entries.push({ slugs: fileToSlugs(year as DocsYear, file) });
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

  const yearDir = getDocsYearDir(year);
  if (!yearDir || rest.some((segment) => !isSafePathSegment(segment))) {
    return false;
  }

  return getDocsPathSet().has(segments.join('/'));
}
