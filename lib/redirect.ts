import { COURSE_CODE_RE } from '@/lib/constants';
import { isYear } from '@/lib/utils';
import { getDocsPathEntries } from '@/lib/docs-paths';

function parseCookiePath(cookiePath: string): {
  year?: string;
  major?: string;
} {
  try {
    const segments = cookiePath.split('/').filter(Boolean);
    const yearIdx = segments.findIndex((s) => isYear(s));
    if (yearIdx === -1) return {};

    const year = segments[yearIdx];
    const major = segments[yearIdx + 1] ?? undefined;
    return { year, major };
  } catch {
    return {};
  }
}

export function findRedirect(
  segment: string,
  cookiePath?: string
): string | null {
  const courseCode = segment.toUpperCase();
  if (!COURSE_CODE_RE.test(courseCode)) return null;

  const matches: { slugs: string[] }[] = [];

  for (const page of getDocsPathEntries()) {
    if (page.slugs.length < 4) continue;
    const pageCourseCode = page.slugs[3]?.toUpperCase();
    if (pageCourseCode !== courseCode) continue;

    matches.push(page);
  }
  if (matches.length === 0) return null;

  if (cookiePath) {
    const { year: prefYear, major: prefMajor } = parseCookiePath(cookiePath);
    if (prefYear && prefMajor) {
      const exactMatch = matches.find(
        (m) => m.slugs[0] === prefYear && m.slugs[1] === prefMajor
      );
      if (exactMatch) {
        return '/docs/' + exactMatch.slugs.join('/');
      }

      const yearMatch = matches.find((m) => m.slugs[0] === prefYear);
      if (yearMatch) {
        return '/docs/' + yearMatch.slugs.join('/');
      }

      const majorMatch = matches.find((m) => m.slugs[1] === prefMajor);
      if (majorMatch) {
        return '/docs/' + majorMatch.slugs.join('/');
      }
    }
  }

  const sorted = matches.sort((a, b) => b.slugs[0].localeCompare(a.slugs[0]));
  const best = sorted[0];
  if (best) {
    return '/docs/' + best.slugs.join('/');
  }

  return null;
}
