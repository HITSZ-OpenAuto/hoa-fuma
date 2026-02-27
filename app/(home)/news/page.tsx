import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { getNewsItems } from '@/lib/news';

export default function Page() {
  const items = getNewsItems();

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
          HOA 新闻
        </h1>
        <p className="text-landing-foreground font-mono text-sm">
          最新动态与公告
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.slug}`}
            href={item.type === 'series' ? `/news/${item.slug}` : item.url}
            className="bg-fd-card hover:bg-fd-accent hover:text-fd-accent-foreground flex flex-col rounded-2xl border p-4 shadow-sm transition-colors"
          >
            <p className="font-medium">{item.title}</p>
            <p className="text-fd-muted-foreground text-sm">
              {item.description}
            </p>

            {item.date && (
              <p className="text-brand mt-auto pt-4 text-xs">
                {formatDate(item.date)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
