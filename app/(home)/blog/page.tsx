import Link from 'next/link';
import { blog } from '@/lib/source';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export default function Page() {
  const pages = blog.getPages();
  const seriesMap = new Map<
    string,
    {
      index?: (typeof pages)[number];
      posts: (typeof pages)[number][];
    }
  >();

  for (const page of pages) {
    const seriesSlug = page.slugs[0];
    if (!seriesSlug) continue;

    // Use existing object if available, otherwise create new
    let series = seriesMap.get(seriesSlug);
    if (!series) {
      series = { posts: [] };
      seriesMap.set(seriesSlug, series);
    }

    if (page.slugs.length === 1) {
      series.index = page;
    } else {
      series.posts.push(page);
    }
  }

  const seriesItems: {
    type: 'series';
    slug: string;
    title: string;
    description: string;
    date: number | null;
  }[] = [];

  const postItems: {
    type: 'post';
    slug: string;
    title: string;
    description: string;
    date: Date;
    url: string;
  }[] = [];

  for (const [slug, entry] of seriesMap) {
    if (entry.posts.length > 0) {
      // It's a series
      const dates = [
        entry.index?.data.date,
        ...entry.posts.map((post) => post.data.date),
      ]
        .filter(Boolean)
        .map((date) => new Date(date as string | Date).getTime());

      const latestDate = dates.length > 0 ? Math.max(...dates) : null;

      seriesItems.push({
        type: 'series',
        slug,
        title: entry.index?.data.title ?? slug,
        description: entry.index?.data.description ?? '',
        date: latestDate,
      });
    } else if (entry.index) {
      // It's a standalone post
      const post = entry.index;
      postItems.push({
        type: 'post',
        slug: post.slugs[0],
        title: post.data.title,
        description: post.data.description ?? '',
        date: new Date(post.data.date),
        url: post.url,
      });
    }
  }

  const items = [...seriesItems, ...postItems].sort((a, b) => {
    // Determine sort date for a
    const aDateVal = a.type === 'series' ? (a.date ?? 0) : a.date.getTime();
    // Determine sort date for b
    const bDateVal = b.type === 'series' ? (b.date ?? 0) : b.date.getTime();

    return bDateVal - aDateVal;
  });

  return (
    <main className="max-w-page mx-auto w-full px-4 pb-12 md:py-12">
      <div className="dark relative z-2 mb-4 aspect-[3.2] p-8 md:p-12">
        <Image
          src="/images/hoa-banner.png"
          loading="eager"
          alt="banner"
          className="absolute inset-0 -z-1 size-full object-cover"
        />
        <h1 className="text-landing-foreground mb-4 font-mono text-3xl font-medium">
          HOA 博客
        </h1>
        <p className="text-landing-foreground font-mono text-sm">
          了解校内最新资讯，分享学习心得
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.slug}`}
            href={item.type === 'series' ? `/blog/${item.slug}` : item.url}
            className="bg-fd-card hover:bg-fd-accent hover:text-fd-accent-foreground flex flex-col rounded-2xl border p-4 shadow-sm transition-colors"
          >
            <p className="font-medium">{item.title}</p>
            <p className="text-fd-muted-foreground text-sm">
              {item.description}
            </p>

            {item.date && (
              <p className="text-brand mt-auto pt-4 text-xs">
                {formatDate(new Date(item.date))}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
