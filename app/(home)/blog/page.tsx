import Link from 'next/link';
import { Rss } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getPostListItems } from '@/lib/posts-summary';

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
      <div className="divide-y border-y">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.slug}`}
            href={item.type === 'series' ? `/blog/${item.slug}` : item.url}
            className="group flex flex-col gap-3 py-5 md:flex-row md:items-start md:justify-between md:gap-8"
          >
            <div className="min-w-0">
              <h2 className="group-hover:text-brand font-medium transition-colors">
                {item.title}
              </h2>
              <p className="text-fd-muted-foreground mt-1 text-sm">
                {item.description}
              </p>
            </div>

            {item.date && (
              <time
                dateTime={item.date.toISOString()}
                className="text-brand shrink-0 text-xs md:pt-1"
              >
                {formatDate(item.date)}
              </time>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
