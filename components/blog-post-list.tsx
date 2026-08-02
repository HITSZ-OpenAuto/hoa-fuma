import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { PostListItem } from '@/lib/posts-summary';

export const untaggedFilter = '未分类';

export function BlogPostList({
  items,
  activeTag,
}: {
  items: PostListItem[];
  activeTag?: string;
}) {
  const tags = [...new Set(items.flatMap((item) => item.tags))].sort((a, b) =>
    a.localeCompare(b, 'zh-CN')
  );
  const filteredItems = items.filter((item) => {
    if (activeTag === untaggedFilter) return item.tags.length === 0;
    if (activeTag) return item.tags.includes(activeTag);
    return true;
  });

  return (
    <>
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
          {[
            { label: '全部', value: '', href: '/blog' },
            ...tags.map((tag) => ({
              label: tag,
              value: tag,
              href: `/blog/tags/${encodeURIComponent(tag)}`,
            })),
            {
              label: '未分类',
              value: untaggedFilter,
              href: `/blog/tags/${encodeURIComponent(untaggedFilter)}`,
            },
          ].map((tag) => (
            <Link
              key={tag.value}
              href={tag.href}
              aria-current={activeTag === tag.value ? 'page' : undefined}
              className={`shrink-0 rounded-full border px-3 py-1 text-sm whitespace-nowrap transition-colors ${
                activeTag === tag.value || (!activeTag && tag.value === '')
                  ? 'bg-fd-primary text-fd-primary-foreground border-transparent'
                  : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
              }`}
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="divide-y border-y">
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
