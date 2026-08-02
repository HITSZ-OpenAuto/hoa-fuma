import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPostList, untaggedFilter } from '@/components/blog-post-list';
import { getPostListItems } from '@/lib/posts-summary';

function getTags() {
  return [
    ...new Set(getPostListItems('blog').flatMap((item) => item.tags)),
    untaggedFilter,
  ];
}

function decodeTag(tag: string) {
  try {
    return decodeURIComponent(tag);
  } catch {
    return tag;
  }
}

export default async function Page(props: {
  params: Promise<{ tag: string }>;
}) {
  const params = await props.params;
  const tag = decodeTag(params.tag);
  const items = getPostListItems('blog');

  if (!getTags().includes(tag)) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-12 md:py-12">
      <div className="mb-4 py-4 md:py-6">
        <div className="text-fd-muted-foreground mb-2 flex items-center gap-2 text-sm">
          <Link href="/blog" className="hover:text-fd-foreground">
            博客
          </Link>
          <span>/</span>
        </div>
        <h1 className="text-fd-foreground font-mono text-3xl font-medium">
          {tag}
        </h1>
      </div>
      <BlogPostList items={items} activeTag={tag} />
    </main>
  );
}

export function generateStaticParams() {
  return getTags().map((tag) => ({ tag }));
}

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}) {
  const params = await props.params;
  const tag = decodeTag(params.tag);

  if (!getTags().includes(tag)) notFound();

  return {
    title: tag,
    description: `浏览标签为 ${tag} 的博客文章`,
  };
}
