import { notFound } from 'next/navigation';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { getMDXComponents } from '@/components/mdx';
import { pages } from '@/lib/source/pages';

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await props.params;
  const page = pages.getPage(slug);

  if (!page) notFound();

  const Mdx = page.data.body;

  return (
    <article className="mx-auto flex w-full max-w-200 flex-col px-4 py-8">
      <h1 className="mb-4 text-3xl font-semibold">{page.data.title}</h1>
      {page.data.description && (
        <p className="text-fd-muted-foreground mb-8">{page.data.description}</p>
      )}

      <div className="prose min-w-0 flex-1 break-words">
        {page.data.showToc !== false && page.data.toc.length > 0 && (
          <InlineTOC items={page.data.toc} className="mb-6">
            目录
          </InlineTOC>
        )}
        <Mdx components={getMDXComponents()} />
      </div>
    </article>
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return pages.getPages().map((page) => ({ slug: page.slugs }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await props.params;
  const page = pages.getPage(slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
