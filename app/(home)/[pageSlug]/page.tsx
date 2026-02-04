import type { ComponentType } from 'react';
import type { MDXComponents } from 'mdx/types';
import { notFound } from 'next/navigation';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { pages } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

export default async function Page(props: {
  params: Promise<{ pageSlug: string }>;
}) {
  const params = await props.params;
  const page = pages.getPage([params.pageSlug]);

  if (!page) notFound();

  const { body: Mdx, toc } = page.data as unknown as {
    body: ComponentType<{ components?: MDXComponents }>;
    toc?: Array<{
      title: string;
      url: string;
      depth: number;
    }>;
  };

  return (
    <article className="mx-auto flex w-full max-w-200 flex-col px-4 py-8">
      <h1 className="mb-4 text-3xl font-semibold">{page.data.title}</h1>
      {page.data.description ? (
        <p className="text-fd-muted-foreground mb-8">{page.data.description}</p>
      ) : null}

      <div className="prose min-w-0 flex-1">
        {toc && toc.length > 0 ? <InlineTOC items={toc} /> : null}
        <Mdx components={getMDXComponents()} />
      </div>
    </article>
  );
}

export function generateStaticParams(): { pageSlug: string }[] {
  return pages.getPages().map((page) => ({
    pageSlug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ pageSlug: string }>;
}) {
  const params = await props.params;
  const page = pages.getPage([params.pageSlug]);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
