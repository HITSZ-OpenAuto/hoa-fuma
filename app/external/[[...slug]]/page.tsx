import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { getMDXComponents, NoPrefetchLink } from '@/components/mdx';
import { LatestCommit } from '@/components/latest-commit';
import { ResourceActions } from '@/components/resources/resource-actions';
import { getLatestCommit } from '@/lib/github';
import { getResourceSnapshot } from '@/lib/resources';
import { resources } from '@/lib/source/resources';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const page = resources.getPage(slug ?? []);

  if (!page) notFound();

  const Mdx = page.data.body;
  const snapshot = getResourceSnapshot(page.slugs[0] ?? '');
  const latestCommit = snapshot
    ? await getLatestCommit(snapshot.repo, {
        org: snapshot.org,
        includeMaintenance: true,
      })
    : null;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {latestCommit && (
        <DocsDescription className="mb-0 text-base">
          <LatestCommit commit={latestCommit} />
        </DocsDescription>
      )}
      <DocsBody>
        {snapshot && (
          <div className="mb-2">
            <ResourceActions snapshot={snapshot} />
          </div>
        )}
        <Mdx
          components={getMDXComponents({
            a: createRelativeLink(resources, page, NoPrefetchLink),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return resources.getPages().map((page) => ({ slug: page.slugs }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const page = resources.getPage(slug ?? []);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
  };
}
