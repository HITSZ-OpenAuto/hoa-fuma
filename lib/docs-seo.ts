import { readFileSync } from 'node:fs';
import { getDocsPathEntries } from '@/lib/docs-paths';

type CoursePage = {
  url: string;
  year: string;
  placeholder: boolean;
};

const placeholderText =
  '当前培养方案中包含这门课程，但 HOA 暂未收录对应的 GitHub 仓库';

let coursePages: Map<string, CoursePage> | undefined;
let canonicalCourses: Map<string, string> | undefined;

function getCoursePages() {
  if (coursePages && canonicalCourses) {
    return { coursePages, canonicalCourses };
  }

  const pages = new Map<string, CoursePage>();
  const canonicals = new Map<string, string>();

  for (const { slugs, file } of getDocsPathEntries()) {
    if (slugs.length !== 4) continue;

    const [year, , , code] = slugs;
    const url = `/docs/${slugs.join('/')}`;
    const placeholder = readFileSync(file, 'utf8').includes(placeholderText);
    pages.set(url, { url, year, placeholder });
    if (placeholder) continue;

    const key = code.toUpperCase();
    const previousUrl = canonicals.get(key);
    const previous = previousUrl && pages.get(previousUrl);
    if (
      !previous ||
      year > previous.year ||
      (year === previous.year && url < previous.url)
    ) {
      canonicals.set(key, url);
    }
  }

  coursePages = pages;
  canonicalCourses = canonicals;
  return { coursePages: pages, canonicalCourses: canonicals };
}

export function getCourseCanonical(code: string): string | undefined {
  return getCoursePages().canonicalCourses.get(code.toUpperCase());
}

export function getDocsSeoPath(slugs: string[]) {
  const url = `/docs/${slugs.join('/')}`;
  if (slugs.length !== 4) return { canonical: url, indexable: true };

  const { coursePages, canonicalCourses } = getCoursePages();
  const page = coursePages.get(url);
  if (!page || page.placeholder)
    return { canonical: undefined, indexable: false };

  return {
    canonical: canonicalCourses.get(slugs[3].toUpperCase()),
    indexable: true,
  };
}
