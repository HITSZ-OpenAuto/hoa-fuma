import { getPageImage, source } from '@/lib/source';
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

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = source.getPage(['general-knowledge', ...(params.slug ?? [])]);
  if (!page) notFound();

  const MDX = page.data.body;

  // For course pages, extract repo name from the last slug segment
  const repoName = page.data.course ? (params.slug?.at(-1) ?? null) : null;
  const latestCommit = repoName ? await getLatestCommit(repoName) : null;

  const githubUrl = repoName
    ? `https://github.com/${GITHUB_ORG}/${repoName}`
    : null;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0 text-base">
        {latestCommit ? (
          <LatestCommit commit={latestCommit} />
        ) : (
          page.data.description
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
              course: page.data.course,
            }
          )}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const allParams = await source.generateParams();

  // Filter for general-knowledge paths
  return allParams
    .filter((p) => p.slug[0] === 'general-knowledge')
    .map((param) => ({
      slug: param.slug.slice(1),
    }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(['general-knowledge', ...(params.slug ?? [])]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
