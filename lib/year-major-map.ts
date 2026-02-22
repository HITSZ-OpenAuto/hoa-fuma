import majorMapping from '@/hoa-major-data/major_mapping.json';

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
    const nested = entry.majors?.find((major) => major.major_ID === id);
    if (nested) return nested.name;
  }
  return id;
}

export function getYearMajorMap(): Record<
  string,
  { id: string; name: string }[]
> {
  const mapping = majorMapping as Record<string, Record<string, MajorEntry>>;

  const result: Record<string, { id: string; name: string }[]> = {};
  for (const [year, yearData] of Object.entries(mapping)) {
    const majors = new Map<string, string>();

    for (const [id, entry] of Object.entries(yearData)) {
      if (entry.majors?.length) {
        for (const major of entry.majors) {
          majors.set(major.major_ID, major.name);
        }
        continue;
      }

      majors.set(id, resolveMajorName(yearData, id));
    }

    result[year] = Array.from(majors.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) => b.localeCompare(a))
  );
}
