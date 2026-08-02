import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMDXComponents } from '@/components/mdx';
import { Breadcrumb } from '@/components/breadcrumb';
import { news } from '@/lib/source/posts';
import { formatDate } from '@/lib/utils';
import { getPostSummaries, getSeriesPosts } from '@/lib/posts-summary';

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = news.getPage(params.slug);

  if (!page) notFound();
  const seriesPosts = getSeriesPosts('news', page.slugs);
  const Mdx = page.data.body;

  if (seriesPosts.length > 0) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <Breadcrumb
          tree={news.pageTree}
          root={{ name: '新闻', url: '/news' }}
        />
        <div className="mb-6">
          <h1 className="mb-4 text-3xl font-semibold">{page.data.title}</h1>
          <p className="text-fd-muted-foreground">{page.data.description}</p>
        </div>
        <div className="divide-y border-y">
          {seriesPosts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="group flex flex-col gap-3 py-5 md:flex-row md:items-start md:justify-between md:gap-8"
            >
              <div className="min-w-0">
                <h2 className="group-hover:text-brand font-medium transition-colors">
                  {post.title}
                </h2>
                <p className="text-fd-muted-foreground mt-1 text-sm">
                  {post.description}
                </p>
              </div>
              <time
                dateTime={new Date(post.date).toISOString()}
                className="text-brand shrink-0 text-xs md:pt-1"
              >
                {formatDate(post.date)}
              </time>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  return (
    <article className="mx-auto flex w-full max-w-200 flex-col px-4 py-8">
      <Breadcrumb tree={news.pageTree} root={{ name: '新闻', url: '/news' }} />
      <h1 className="mb-4 text-3xl font-semibold">{page.data.title}</h1>
      <p className="text-fd-muted-foreground mb-8">{page.data.description}</p>

      <div className="text-fd-muted-foreground mb-8 flex flex-row items-center gap-2 text-sm">
        <p>{formatDate(page.data.date)}</p>
        {page.data.authors && page.data.authors.length > 0 && (
          <>
            <span>·</span>
            <div className="flex flex-row flex-wrap items-center">
              {page.data.authors.map((author, index) => (
                <div
                  key={index}
                  className="mx-1 flex flex-row items-center gap-1.5"
                >
                  {author.link ? (
                    <Link
                      href={author.link}
                      className="text-fd-foreground flex flex-row items-center gap-1.5 font-medium hover:underline"
                    >
                      {author.image && (
                        <Image
                          src={author.image}
                          alt={author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      {author.name}
                    </Link>
                  ) : (
                    <div className="flex flex-row items-center gap-1.5">
                      {author.image && (
                        <Image
                          src={author.image}
                          alt={author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <p className="text-fd-foreground font-medium">
                        {author.name}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="prose min-w-0 flex-1">
        <Mdx components={getMDXComponents()} />
      </div>
    </article>
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return getPostSummaries('news').map((page) => ({
    slug: page.slugs,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = news.getPage(params.slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
