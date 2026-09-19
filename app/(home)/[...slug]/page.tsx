import { notFound } from 'next/navigation';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { getMDXComponents } from '@/components/mdx';
import { pages } from '@/lib/source/pages';
import { cn } from '@/lib/utils';

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await props.params;
  const page = pages.getPage(slug);

  if (!page) notFound();

  const Mdx = page.data.body;

  return (
    <article
      className={cn(
        'mx-auto flex w-full flex-col px-4 py-8',
        page.data.wide ? 'max-w-page' : 'max-w-200'
      )}
    >
      <h1 className="mb-4 text-3xl font-semibold">{page.data.title}</h1>
      {page.data.description && (
        <p className="text-fd-muted-foreground mb-8">{page.data.description}</p>
      )}

      <div className="prose min-w-0 flex-1 break-words">
        {page.data.toc.length > 0 && (
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
