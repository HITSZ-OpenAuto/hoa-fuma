export type StudyLevel = 'undergrad' | 'postgrad';

type MajorOption = {
  id: string;
  name: string;
  studyLevel: StudyLevel;
};

export type YearMajorMap = Record<string, MajorOption[]>;

export type MajorEntry = {
  name: string;
  study_level?: StudyLevel;
  majors?: { name: string; major_ID: string }[];
};

export function computeYearMajorMap(
  pages: { slugs: string[] }[],
  mapping: Record<string, Record<string, MajorEntry>>
): YearMajorMap {
  const yearMajorSet = new Map<string, Set<string>>();

  for (const page of pages) {
    if (page.slugs.length >= 2) {
      const year = page.slugs[0];
      const major = page.slugs[1];
      if (!yearMajorSet.has(year)) yearMajorSet.set(year, new Set());
      yearMajorSet.get(year)!.add(major);
    }
  }

  const result: YearMajorMap = {};

  for (const [year, majors] of yearMajorSet) {
    const yearData = mapping[year];

    let fastLookup: Map<string, Omit<MajorOption, 'id'>> | undefined;
    if (yearData) {
      fastLookup = new Map();
      for (const entry of Object.values(yearData)) {
        if (entry.majors) {
          for (const m of entry.majors) {
            fastLookup.set(m.major_ID, {
              name: m.name,
              studyLevel: entry.study_level ?? 'undergrad',
            });
          }
        }
      }
      for (const [id, entry] of Object.entries(yearData)) {
        fastLookup.set(id, {
          name: entry.name,
          studyLevel: entry.study_level ?? 'undergrad',
        });
      }
    }

    result[year] = Array.from(majors).map((id) => ({
      id,
      ...(fastLookup?.get(id) ?? { name: id, studyLevel: 'undergrad' }),
    }));
  }

  return result;
}
