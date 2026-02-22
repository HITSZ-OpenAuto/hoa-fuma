import type { Folder } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import majorMapping from '@/hoa-major-data/major_mapping.json';

function getFolderFirstUrl(folder: Folder): string | undefined {
  if (folder.index?.url) return folder.index.url;
  for (const child of folder.children) {
    if (child.type === 'page' && !child.external) return child.url;
    if (child.type === 'folder') {
      const url = getFolderFirstUrl(child);
      if (url) return url;
    }
  }
  return undefined;
}

export function getAvailableYears(): string[] {
  return source
    .getPageTree()
    .children.filter(
      (node): node is typeof node & { name: string } =>
        node.type === 'folder' &&
        typeof node.name === 'string' &&
        /^\d{4}$/.test(node.name)
    )
    .map((node) => node.name)
    .sort((a, b) => b.localeCompare(a));
}

type MajorEntry = {
  name: string;
  majors?: { name: string; major_ID: string }[];
};

function resolveMajorName(
  yearData: Record<string, MajorEntry> | undefined,
  id: string
): string {
  if (!yearData) return id;
  if (yearData[id]) return yearData[id].name;
  for (const entry of Object.values(yearData)) {
    const nested = entry.majors?.find((m) => m.major_ID === id);
    if (nested) return nested.name;
  }
  return id;
}

export function getYearMajorMap(): Record<
  string,
  { id: string; name: string }[]
> {
  const pages = source.getPages();
  const yearMajorSet = new Map<string, Set<string>>();

  for (const page of pages) {
    if (page.slugs.length >= 2) {
      const year = page.slugs[0];
      const major = page.slugs[1];
      if (!yearMajorSet.has(year)) yearMajorSet.set(year, new Set());
      yearMajorSet.get(year)!.add(major);
    }
  }

  const mapping = majorMapping as Record<string, Record<string, MajorEntry>>;
  const result: Record<string, { id: string; name: string }[]> = {};

  for (const [year, majors] of yearMajorSet) {
    const yearData = mapping[year];
    result[year] = Array.from(majors).map((id) => ({
      id,
      name: resolveMajorName(yearData, id),
    }));
  }

  return result;
}
