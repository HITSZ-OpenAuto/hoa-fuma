import { Cards, Card } from 'fumadocs-ui/components/card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  getLatestStandaloneBlogPosts,
  type PostSummary,
} from '@/lib/posts-summary';

function PostCard({ post, index }: { post: PostSummary; index: number }) {
  return (
    <ScrollReveal delay={index * 120} className="h-full">
      <Card
        title={post.title}
        description={<span className="line-clamp-1">{post.description}</span>}
        href={post.url}
        className="home-card-hover bg-fd-card [&>div:last-child]:text-brand flex h-full flex-col rounded-2xl border p-4 text-left shadow-sm transition-colors [&>div:last-child]:mt-auto [&>div:last-child]:pt-4 [&>div:last-child]:text-xs"
      >
        {formatDate(post.date)}
      </Card>
    </ScrollReveal>
  );
}

export function LatestPosts() {
  const latestPosts = getLatestStandaloneBlogPosts(3);

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
