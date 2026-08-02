import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { PostListItem } from '@/lib/posts-summary';

export function BlogPostList({
  items,
  activeTag,
}: {
  items: PostListItem[];
  activeTag?: string | null;
}) {
  const tags = [...new Set(items.flatMap((item) => item.tags))].sort((a, b) =>
    a.localeCompare(b, 'zh-CN')
  );
  const filteredItems = items.filter((item) => {
    if (activeTag === null) return item.tags.length === 0;
    if (activeTag) return item.tags.includes(activeTag);
    return true;
  });
  const filters = [
    { label: '全部', value: undefined, href: '/blog' },
    ...tags.map((tag) => ({
      label: tag,
      value: tag,
      href: `/blog/tags/${encodeURIComponent(tag)}`,
    })),
    {
      label: '未分类',
      value: null,
      href: '/blog/tags',
    },
  ];
  const filterLinks = () =>
    filters.map((tag) => (
      <Link
        key={tag.href}
        href={tag.href}
        aria-current={activeTag === tag.value ? 'page' : undefined}
        className={`shrink-0 rounded-full border px-3 py-1 text-sm whitespace-nowrap transition-colors ${
          activeTag === tag.value
            ? 'bg-fd-primary text-fd-primary-foreground border-transparent'
            : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
        }`}
      >
        {tag.label}
      </Link>
    ));

  return (
    <>
      <div className="mb-4">
        <details className="group sm:hidden">
          <summary className="text-fd-muted-foreground flex cursor-pointer list-none items-center justify-between rounded-lg border px-3 py-2 text-sm [&::-webkit-details-marker]:hidden">
            <span>
              标签：{activeTag === null ? '未分类' : (activeTag ?? '全部')}
            </span>
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">{filterLinks()}</div>
        </details>
        <div className="hidden flex-wrap gap-2 sm:flex">{filterLinks()}</div>
      </div>
      <div className="divide-y border-y">
        {filteredItems.length === 0 && (
          <p className="text-fd-muted-foreground py-8 text-center text-sm">
            暂无相关文章。
          </p>
        )}
        {filteredItems.map((item) => (
          <div
            key={`${item.type}-${item.slug}`}
            className="group relative flex flex-col gap-3 py-5 md:flex-row md:items-start md:justify-between md:gap-8"
          >
            <Link
              href={item.type === 'series' ? `/blog/${item.slug}` : item.url}
              className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="sr-only">{item.title}</span>
            </Link>
            <div className="min-w-0">
              <h2 className="group-hover:text-brand font-medium transition-colors">
                {item.title}
              </h2>
              <p className="text-fd-muted-foreground mt-1 text-sm">
                {item.description}
              </p>
              {item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tags/${encodeURIComponent(tag)}`}
                      className="text-fd-muted-foreground hover:text-fd-foreground relative z-10 text-sm transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {item.date && (
              <time
                dateTime={item.date.toISOString()}
                className="text-brand shrink-0 text-xs md:pt-1"
              >
                {formatDate(item.date)}
              </time>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
