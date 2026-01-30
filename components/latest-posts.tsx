import { blog } from '@/lib/source';
import { Cards, Card } from 'fumadocs-ui/components/card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { formatDate } from '@/lib/utils';
import type { InferPageType } from 'fumadocs-core/source';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Post = InferPageType<typeof blog>;

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <ScrollReveal delay={index * 120} className="h-full">
      <Card
        title={post.data.title}
        description={
          <span className="line-clamp-1">{post.data.description}</span>
        }
        href={post.url}
        className="bg-fd-card hover:bg-fd-accent hover:text-fd-accent-foreground [&>div:last-child]:text-brand flex h-full flex-col rounded-2xl border p-4 text-left shadow-sm transition-colors [&>div:last-child]:mt-auto [&>div:last-child]:pt-4 [&>div:last-child]:text-xs"
      >
        {formatDate(post.data.date)}
      </Card>
    </ScrollReveal>
  );
}

export function LatestPosts() {
  const pages = blog.getPages();
  if (pages.length === 0) return null;

  const seriesSlugs = new Set<string>();
  for (const page of pages) {
    if (page.slugs.length > 1 && page.slugs[0]) {
      seriesSlugs.add(page.slugs[0]);
    }
  }

  const latestPosts = pages
    .filter((page) => {
      return (
        page.slugs.length === 1 &&
        page.data?.date &&
        !seriesSlugs.has(page.slugs[0])
      );
    })
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    )
    .slice(0, 3);

  if (latestPosts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl pb-16 text-left">
      <Link
        href="/blog"
        className="group mb-4 flex w-fit flex-row items-center gap-1"
      >
        <h2 className="text-fd-foreground decoration-brand text-sm font-medium tracking-widest underline-offset-4 group-hover:underline">
          最近文章
        </h2>
        <ArrowRight className="text-fd-muted-foreground group-hover:text-brand h-3.5 w-3.5 transition-all group-hover:translate-x-0.5" />
      </Link>
      <Cards className="grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {latestPosts.map((post, index) => (
          <PostCard key={post.url} post={post} index={index} />
        ))}
      </Cards>
    </section>
  );
}
