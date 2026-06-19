import { Suspense } from 'react';
import { Mail } from 'lucide-react';
import localFont from 'next/font/local';
import { RecentRepos } from '@/components/recent-repos';
import { ScrollHint } from '@/components/scroll-hint';
import { LatestPosts } from '@/components/latest-posts';
import { HeroCards } from '@/components/hero-cards';
import { HeroButtons } from '@/components/hero-buttons';
import { Button } from '@/components/ui/button';
import { getRecentRepos } from '@/lib/github';
import { getYearMajorMap } from '@/lib/docs-home';

const wordmark = localFont({
  src: '../../public/fonts/zalando-sans-expanded-latin-500.woff2',
  adjustFontFallback: false,
});

const githubPath =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';

function HeroContent() {
  const yearMajorMap = getYearMajorMap();

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

      <HeroButtons yearMajorMap={yearMajorMap} />
    </div>
  );
}

async function RecentReposSection() {
  const recentRepos = await getRecentRepos(3);

  return <RecentRepos repos={recentRepos} title="最近更新的仓库" />;
}

export default function HomePage() {
  return (
    <div className="bg-background text-foreground relative min-h-svh">
      {/* Hero section */}
      <section className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 lg:px-16">
        <div className="mx-auto w-full max-w-6xl pb-32 lg:pt-20 lg:pb-36">
          <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-0">
            {/* Left: Content area */}
            <div className="order-2 text-center lg:order-1 lg:self-start lg:text-left">
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
        <Suspense fallback={null}>
          <RecentReposSection />
        </Suspense>
        <LatestPosts />
      </div>

      <footer className="relative py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
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
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d={githubPath} />
                </svg>
                GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-18 mb-6 w-full overflow-hidden px-6 lg:px-16">
          <span
            className={`${wordmark.className} block text-center leading-none font-medium tracking-tighter whitespace-nowrap text-black select-none dark:text-white`}
            style={{ fontSize: '14vw' }}
          >
            openauto
          </span>
        </div>

        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-muted-foreground text-xs">© 2026 HITSZ OpenAuto</p>
        </div>
      </footer>
    </div>
  );
}
