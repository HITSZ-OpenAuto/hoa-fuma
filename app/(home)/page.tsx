import { Cormorant_Garamond } from 'next/font/google';
import { RecentRepos } from '@/components/recent-repos';
import { LatestPosts } from '@/components/latest-posts';

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
      <section className="flex min-h-svh items-center justify-center text-center">
        <h1
          className={`${display.className} max-w-[12ch] text-[clamp(3rem,6vw,5.4rem)] leading-[1.12] tracking-[0.01em] text-balance`}
        >
          <span className="block">HITSZ</span>
          <span className="block italic">OpenAuto</span>
        </h1>
      </section>

      <RecentRepos repos={recentRepos} title="最近更新的仓库" />

      <LatestPosts />

      <footer className="text-muted-foreground pb-6 text-left text-xs">
        © 2026 HITSZ OpenAuto
      </footer>
    </div>
  );
}
