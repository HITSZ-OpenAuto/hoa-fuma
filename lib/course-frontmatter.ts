import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { frontmatter } from 'fumadocs-core/content/md/frontmatter';
import z from 'zod';
import type { CourseInfoData } from '@/lib/types';
import { getDocsYearDir, isSafePathSegment } from '@/lib/docs-content';

const courseInfoSchema = z.object({
  credit: z.number(),
  assessmentMethod: z.string(),
  courseNature: z.string(),
  hourDistribution: z.object({
    theory: z.number(),
    lab: z.number(),
    practice: z.number(),
    exercise: z.number(),
    computer: z.number(),
    tutoring: z.number(),
  }),
  gradingScheme: z.array(
    z.object({
      name: z.string(),
      percent: z.number(),
    })
  ),
});

const cache = new Map<string, CourseInfoData | undefined>();

function getDocsFile(segments: string[]): string | undefined {
  const [year, ...rest] = segments;
  if (!year) return undefined;
  if (rest.some((segment) => !isSafePathSegment(segment))) return undefined;

  const base = getDocsYearDir(year);
  if (!base) return undefined;
  const pathSegments = rest.length > 0 ? rest : ['index'];
  const basePath = join(base, ...pathSegments);
  const mdx = `${basePath}.mdx`;
  if (existsSync(mdx)) return mdx;

  const md = `${basePath}.md`;
  if (existsSync(md)) return md;
}

export function getDocsCourse(segments: string[]): CourseInfoData | undefined {
  const cacheKey = segments.join('/');
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const file = getDocsFile(segments);
  if (!file) {
    cache.set(cacheKey, undefined);
    return undefined;
  }

  const data = frontmatter(readFileSync(file, 'utf8')).data as {
    course?: unknown;
  };
  const result = courseInfoSchema.optional().safeParse(data.course);
  const course = result.success ? result.data : undefined;
  cache.set(cacheKey, course);
  return course;
}
