import { pagesSource } from '@/lib/source';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { getMDXComponents } from '@/mdx-components';

export function generateMetadata(): Metadata {
  const page = pagesSource.getPage(['about']);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export default function AboutPage() {
  const page = pagesSource.getPage(['about']);
  if (!page) notFound();
  const Mdx = page.data.body;
  const toc = page.data.toc;

  return (
    <article className="mx-auto flex w-full max-w-200 flex-col px-4 py-8">
      <h1 className="mb-4 text-3xl font-semibold">{page.data.title}</h1>
      <p className="text-fd-muted-foreground mb-8">{page.data.description}</p>
      <div className="prose min-w-0 flex-1">
        <InlineTOC items={toc} />
        <Mdx components={getMDXComponents()} />
      </div>
    </article>
  );
}
