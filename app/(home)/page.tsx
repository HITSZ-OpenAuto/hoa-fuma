import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';
import { RecentRepos } from '@/components/recent-repos';
import { LatestPosts } from '@/components/latest-posts';
import { Button } from '@/components/ui/button';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

export default function HomePage() {
  const recentRepos = [
    {
      id: '1',
      name: 'HITSZ-OpenAuto/hoa-fuma',
      description: 'Placeholder repository',
      href: 'https://github.com/HITSZ-OpenAuto/hoa-fuma/',
      updatedAt: '2026-01-29',
    },
    {
      id: '2',
      name: 'HITSZ-OpenAuto/hoa-fuma',
      description: 'Placeholder repository',
      href: 'https://github.com/HITSZ-OpenAuto/hoa-fuma/',
      updatedAt: '2026-01-25',
    },
    {
      id: '3',
      name: 'HITSZ-OpenAuto/hoa-fuma',
      description: 'Placeholder repository',
      href: 'https://github.com/HITSZ-OpenAuto/hoa-fuma/',
      updatedAt: '2026-01-18',
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-svh px-6">
      <section className="flex min-h-svh flex-col items-center justify-center gap-12 text-center">
        <h1
          className={`${display.className} max-w-[12ch] text-[clamp(3rem,6vw,5.4rem)] leading-[1.12] tracking-[0.01em] text-balance`}
        >
          <span className="block">HITSZ</span>
          <span className="block italic">OpenAuto</span>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <Link href="/docs">
            <Button
              size="lg"
              className="bg-fd-primary text-primary-foreground hover:bg-fd-primary/80 inline-flex h-12 cursor-pointer justify-center rounded-full px-6 text-base font-medium transition-colors"
            >
              查看文档
            </Button>
          </Link>
          <Link href="/blog/contribution-guide">
            <Button
              size="lg"
              variant="secondary"
              className="bg-fd-secondary text-secondary-foreground hover:bg-fd-secondary/80 inline-flex h-12 cursor-pointer justify-center rounded-full px-6 text-base font-medium transition-colors"
            >
              参与指南
            </Button>
          </Link>
        </div>
      </section>

      <RecentRepos repos={recentRepos} title="最近更新的仓库" />

      <LatestPosts />

      <footer className="text-muted-foreground pb-6 text-left text-xs">
        © 2026 HITSZ OpenAuto
      </footer>
    </div>
  );
}
