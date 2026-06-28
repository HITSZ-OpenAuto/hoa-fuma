import { readFileSync } from 'node:fs';
import type { SortedResult } from 'fumadocs-core/search';
import { createContentHighlighter } from 'fumadocs-core/search';
import { frontmatter } from 'fumadocs-core/content/md/frontmatter';
import {
  docsDirs,
  fileToSlugs,
  getMarkdownFiles,
  type DocsYear,
} from '@/lib/docs-content';

type DocsFrontmatter = {
  title?: string;
  description?: string;
};

type SearchEntry = {
  title: string;
  description: string;
  content: string;
  breadcrumbs: string[];
  url: string;
};

let cachedEntries: SearchEntry[] | undefined;

function pathToName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function cleanMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>*_~#`{}[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getEntries(): SearchEntry[] {
  if (cachedEntries) return cachedEntries;

  cachedEntries = Object.entries(docsDirs).flatMap(([year, dir]) =>
    getMarkdownFiles(dir).map((file) => {
      const raw = readFileSync(file, 'utf8');
      const parsed = frontmatter(raw);
      const data = parsed.data as DocsFrontmatter;
      const slugs = fileToSlugs(year as DocsYear, file);
      const lastSlug = slugs.at(-1);

      return {
        title:
          data.title ?? (lastSlug ? pathToName(lastSlug) : pathToName(year)),
        description: data.description ?? '',
        content: cleanMarkdown(parsed.content),
        breadcrumbs: slugs.slice(0, -1),
        url: `/docs/${slugs.join('/')}`,
      };
    })
  );

  return cachedEntries;
}

function getSnippet(content: string, terms: string[]): string {
  const lower = content.toLowerCase();
  const matchIndex = terms
    .map((term) => lower.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (matchIndex === undefined) return content.slice(0, 180);

  const start = Math.max(0, matchIndex - 80);
  const end = Math.min(content.length, matchIndex + 180);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < content.length ? '...' : '';
  return `${prefix}${content.slice(start, end)}${suffix}`;
}

function scoreEntry(entry: SearchEntry, terms: string[]): number {
  const title = entry.title.toLowerCase();
  const description = entry.description.toLowerCase();
  const content = entry.content.toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (title.includes(term)) score += 100;
    if (description.includes(term)) score += 40;
    if (content.includes(term)) score += 10;
    if (entry.url.toLowerCase().includes(term)) score += 20;
  }

  return score;
}

export function searchDocs(query: string, limit = 60): SortedResult[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) return [];

  const highlighter = createContentHighlighter(query);

  const results = getEntries()
    .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .flatMap(({ entry }): SortedResult[] => {
      const titleResult: SortedResult = {
        id: entry.url,
        type: 'page',
        content: highlighter.highlightMarkdown(entry.title),
        breadcrumbs: entry.breadcrumbs,
        url: entry.url,
      };
      const snippet = getSnippet(
        `${entry.description} ${entry.content}`.trim(),
        terms
      );

      if (!snippet) return [titleResult];

      return [
        titleResult,
        {
          id: `${entry.url}-content`,
          type: 'text',
          content: highlighter.highlightMarkdown(snippet),
          breadcrumbs: entry.breadcrumbs,
          url: entry.url,
        },
      ];
    });

  return results.slice(0, limit);
}
