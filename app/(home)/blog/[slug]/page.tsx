import { notFound } from 'next/navigation';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import Image from 'next/image';
import Link from 'next/link';
import { blog } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { PathUtils } from 'fumadocs-core/source';

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;
  const toc = page.data.toc;

  return (
    <article className="mx-auto flex w-full max-w-200 flex-col px-4 py-8">
      <h1 className="mb-4 text-3xl font-semibold">{page.data.title}</h1>
      <p className="text-fd-muted-foreground mb-8">{page.data.description}</p>

      <div className="text-fd-muted-foreground mb-8 flex flex-row items-center gap-2 text-sm">
        <p>
          {new Date(
            page.data.date ??
              PathUtils.basename(page.path, PathUtils.extname(page.path))
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <span>·</span>
        {page.data.authorLink ? (
          <Link
            href={page.data.authorLink}
            className="text-fd-foreground flex flex-row items-center gap-2 font-medium hover:underline"
          >
            {page.data.authorAvatar && (
              <Image
                src={page.data.authorAvatar}
                alt={page.data.author}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            {page.data.author}
          </Link>
        ) : (
          <div className="flex flex-row items-center gap-2">
            {page.data.authorAvatar && (
              <Image
                src={page.data.authorAvatar}
                alt={page.data.author}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <p className="text-fd-foreground font-medium">{page.data.author}</p>
          </div>
        )}
      </div>

      <div className="prose min-w-0 flex-1">
        <InlineTOC items={toc} />
        <Mdx components={getMDXComponents()} />
      </div>
    </article>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
