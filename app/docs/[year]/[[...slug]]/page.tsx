import { courseBodySource, getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getLatestCommit } from '@/lib/github';
import { LatestCommit } from '@/components/latest-commit';
import { GITHUB_ORG } from '@/lib/constants';
import { PageActions } from '@/components/page-actions';
import { cache, type ComponentType } from 'react';

type ResolvedDocData = {
  body?: ComponentType<{
    components: ReturnType<typeof getMDXComponents>;
  }>;
  toc?: unknown;
} & Record<string, unknown>;

async function resolveDocData(data: object): Promise<ResolvedDocData> {
  const value = data as ResolvedDocData & {
    load?: () => Promise<Record<string, unknown>>;
  };

  if (typeof value.load === 'function') {
    return { ...value, ...(await value.load()) };
  }

  return value;
}

const getCanonicalCourseData = cache(async (courseCode: string) => {
  const canonicalPage = courseBodySource.getPage([courseCode]);
  if (!canonicalPage) return null;
  return resolveDocData(canonicalPage.data);
});

export default async function Page(props: {
  params: Promise<{ year: string; slug?: string[] }>;
}) {
  const params = await props.params;

  const page = source.getPage([params.year, ...(params.slug ?? [])]);
  if (!page) notFound();

  // For course pages, extract repo name from the last slug segment
  const repoName = page.data.course ? (params.slug?.at(-1) ?? null) : null;
  const isCoursePage = Boolean(page.data.course && repoName);

  const routeData = page.data;
  let contentData: ResolvedDocData;

  if (isCoursePage && repoName) {
    const canonicalData = await getCanonicalCourseData(repoName);
    contentData = canonicalData ?? (await resolveDocData(routeData));
  } else {
    contentData = await resolveDocData(routeData);
  }

  const MDX = contentData.body;
  const toc = contentData.toc as any;
  if (!MDX) notFound();

  const latestCommit = repoName ? await getLatestCommit(repoName) : null;

  const githubUrl = repoName
    ? `https://github.com/${GITHUB_ORG}/${repoName}`
    : null;

  return (
    <DocsPage toc={toc} full={routeData.full}>
      <DocsTitle>{routeData.title}</DocsTitle>
      <DocsDescription className="mb-0 text-base">
        {latestCommit ? (
          <LatestCommit commit={latestCommit} />
        ) : (
          routeData.description
        )}
      </DocsDescription>
      <DocsBody>
        {repoName && githubUrl && (
          <div className="mb-2">
            <PageActions githubUrl={githubUrl} />
          </div>
        )}
        <MDX
          components={getMDXComponents(
            {
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(source, page),
            },
            {
              course: routeData.course,
            }
          )}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const params = await source.generateParams();
  return params.map((param) => {
    const [year, ...slug] = param.slug;
    return { year, slug };
  });
}

export async function generateMetadata(props: {
  params: Promise<{ year: string; slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage([params.year, ...(params.slug ?? [])]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
