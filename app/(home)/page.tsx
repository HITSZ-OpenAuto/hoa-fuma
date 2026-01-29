import { Cormorant_Garamond } from 'next/font/google';
import { blog } from '@/lib/source';
import { Cards, Card } from 'fumadocs-ui/components/card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { RecentRepos } from '@/components/recent-repos';
import { formatDate } from '@/lib/utils';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

export default function HomePage() {
  const pages = blog.getPages();
  const seriesSlugs = new Set<string>();

  for (const page of pages) {
    const seriesSlug = page.slugs[0];
    if (!seriesSlug) continue;
    if (page.slugs.length > 1) {
      seriesSlugs.add(seriesSlug);
    }
  }

  const latestPosts = pages
    .filter(
      (page) => page.slugs.length === 1 && !seriesSlugs.has(page.slugs[0])
    )
    .filter((page) => page.data?.date)
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    )
    .slice(0, 3);

  const recentRepos = [
    {
      name: 'HITSZ-OpenAuto/hoa-fuma',
      description: 'Placeholder repository',
      href: 'https://github.com/HITSZ-OpenAuto/hoa-fuma/',
      updatedAt: '2026-01-29',
    },
    {
      name: 'HITSZ-OpenAuto/hoa-fuma',
      description: 'Placeholder repository',
      href: 'https://github.com/HITSZ-OpenAuto/hoa-fuma/',
      updatedAt: '2026-01-25',
    },
    {
      name: 'HITSZ-OpenAuto/hoa-fuma',
      description: 'Placeholder repository',
      href: 'https://github.com/HITSZ-OpenAuto/hoa-fuma/',
      updatedAt: '2026-01-18',
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-svh px-6">
      <section className="flex min-h-svh items-center justify-center text-center">
        <h1
          className={`${display.className} max-w-[12ch] text-[clamp(3rem,6vw,5.4rem)] leading-[1.12] tracking-[0.01em] text-balance`}
        >
          <span className="block">HITSZ</span>
          <span className="block italic">OpenAuto</span>
        </h1>
      </section>

      <section className="mx-auto w-full max-w-5xl pb-8 text-left">
        <p className="text-muted-foreground mb-4 text-xs tracking-[0.22em] uppercase">
          最近文章
        </p>
        <Cards className="grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post, index) => (
            <ScrollReveal key={post.url} delay={index * 120} className="h-full">
              <Card
                title={post.data.title}
                description={post.data.description}
                href={post.url}
                className="bg-fd-card hover:bg-fd-accent hover:text-fd-accent-foreground [&>div:last-child]:text-brand flex h-full flex-col rounded-2xl border p-4 text-left shadow-sm transition-colors [&>div:last-child]:mt-auto [&>div:last-child]:pt-4 [&>div:last-child]:text-xs"
              >
                {formatDate(post.data.date)}
              </Card>
            </ScrollReveal>
          ))}
        </Cards>
      </section>

      <RecentRepos repos={recentRepos} title="最近更新的仓库" />

      <footer className="text-muted-foreground pb-6 text-left text-xs">
        © 2026 HITSZ OpenAuto
      </footer>
    </div>
  );
}
