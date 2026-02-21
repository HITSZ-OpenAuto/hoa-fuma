import Link from 'next/link';
import { Mail, Github } from 'lucide-react';
import { RecentRepos } from '@/components/recent-repos';
import { ScrollHint } from '@/components/scroll-hint';
import { LatestPosts } from '@/components/latest-posts';
import { GridBackground } from '@/components/grid-background';
import { HeroCards } from '@/components/hero-cards';
import { Button } from '@/components/ui/button';
import { getRecentRepos } from '@/lib/github';

function HeroContent() {
  return (
    <div className="space-y-6">
      <h1 className="hero-title text-[clamp(3rem,8vw,6rem)] leading-none font-bold tracking-tight">
        HITSZ
      </h1>

      <h2 className="hero-title text-[clamp(1.5rem,4vw,3rem)] leading-tight font-bold tracking-tight">
        课程攻略共享计划
      </h2>

      <p className="text-muted-foreground mx-auto max-w-md text-lg before:mr-1 before:content-['//'] lg:mx-0">
        为你的 HITSZ 求学路提供全面的课程资料与经验分享
      </p>

      {/* Button group */}
      <div className="flex flex-wrap justify-center gap-4 pt-4 lg:justify-start">
        <Button
          variant="default"
          size="lg"
          className="rounded-full transition-transform hover:scale-105"
          asChild
        >
          <Link href="/docs">查看文档</Link>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full transition-transform hover:scale-105"
          asChild
        >
          <Link href="/blog/contribution-guide">参与指南</Link>
        </Button>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const recentRepos = await getRecentRepos(6);

  return (
    <div className="bg-background text-foreground relative min-h-svh">
      {/* Grid background */}
      <GridBackground />

      {/* Hero section */}
      <section className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 lg:px-16">
        <div className="mx-auto w-full max-w-6xl pb-32 lg:pt-20 lg:pb-36">
          <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-0">
            {/* Left: Content area */}
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <HeroContent />
            </div>
            {/* Right: Cards display area */}
            <div className="order-1 flex justify-center lg:order-2 lg:justify-start">
              <HeroCards />
            </div>
          </div>
        </div>
        <ScrollHint />
      </section>

      {/* Recent updates section */}
      <div className="relative px-6">
        <RecentRepos repos={recentRepos} title="最近更新的仓库" />
        <LatestPosts />
      </div>

      {/* Footer */}
      <footer className="relative px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-8 text-center">
          {/* Contact buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              asChild
            >
              <a href="mailto:hi@hoa.moe">
                <Mail className="h-4 w-4" />
                hi@hoa.moe
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              asChild
            >
              <a
                href="https://github.com/HITSZ-OpenAuto"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>

          {/* Brand text */}
          <div className="py-8">
            <span className="text-muted-foreground/20 text-[clamp(4rem,15vw,10rem)] font-bold tracking-tighter select-none">
              OpenAuto
            </span>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-xs">© 2026 HITSZ OpenAuto</p>
        </div>
      </footer>
    </div>
  );
}
