export type MajorEntry = {
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

export function computeYearMajorMap(
  pages: { slugs: string[] }[],
  mapping: Record<string, Record<string, MajorEntry>>
): Record<string, { id: string; name: string }[]> {
  const yearMajorSet = new Map<string, Set<string>>();

  for (const page of pages) {
    if (page.slugs.length >= 2) {
      const year = page.slugs[0];
      const major = page.slugs[1];
      if (!yearMajorSet.has(year)) yearMajorSet.set(year, new Set());
      yearMajorSet.get(year)!.add(major);
    }
  }

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
