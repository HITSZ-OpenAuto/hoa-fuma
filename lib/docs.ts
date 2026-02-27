import { source } from '@/lib/source';
import majorMapping from '@/hoa-major-data/major_mapping.json';

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
