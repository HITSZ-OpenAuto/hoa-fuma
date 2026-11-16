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
import { resources } from '@/lib/source/resources';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const page = resources.getPage(slug ?? []);

  if (!page) notFound();

  const Mdx = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0 text-base">
        {page.data.description}
      </DocsDescription>
      <DocsBody>
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
