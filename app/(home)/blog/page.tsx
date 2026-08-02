import Link from 'next/link';
import { Rss } from 'lucide-react';
import { getPostListItems } from '@/lib/posts-summary';
import { BlogPostList } from '@/components/blog-post-list';

export default function Page() {
  const items = getPostListItems('blog');

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-12 md:py-12">
      <div className="mb-4 py-4 md:py-6">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-fd-foreground font-mono text-3xl font-medium">
            博客
          </h1>
          <Link
            href="/blog/rss.xml"
            aria-label="订阅博客 RSS"
            title="订阅博客 RSS"
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            <Rss className="size-5" />
          </Link>
        </div>
        <p className="text-fd-muted-foreground font-mono text-sm">
          了解校内最新资讯，分享学习心得
        </p>
      </div>
      <BlogPostList items={items} />
    </main>
  );
}
