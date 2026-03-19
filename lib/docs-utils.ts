export type MajorEntry = {
  name: string;
  majors?: { name: string; major_ID: string }[];
};

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

    let fastLookup: Map<string, string> | undefined;
    if (yearData) {
      fastLookup = new Map<string, string>();
      for (const entry of Object.values(yearData)) {
        if (entry.majors) {
          for (const m of entry.majors) {
            fastLookup.set(m.major_ID, m.name);
          }
        }
      }
      for (const [id, entry] of Object.entries(yearData)) {
        fastLookup.set(id, entry.name);
      }
    }

    result[year] = Array.from(majors).map((id) => ({
      id,
      name: fastLookup ? (fastLookup.get(id) ?? id) : id,
    }));
  }

  return result;
}
