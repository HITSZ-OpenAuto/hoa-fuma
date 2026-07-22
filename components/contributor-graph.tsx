'use client';

import { Users, GitCommit, GitPullRequest, ExternalLink, Sparkles } from 'lucide-react';
import type { ContributorItem } from '@/lib/github';
import { Button } from '@/components/ui/button';

interface ContributorGraphProps {
  contributors: ContributorItem[];
}

export function ContributorGraph({ contributors }: ContributorGraphProps) {
  const totalContributions = contributors.reduce(
    (acc, curr) => acc + curr.contributions,
    0
  );
  const maxContributions = Math.max(
    ...contributors.map((c) => c.contributions),
    1
  );

  return (
    <section className="relative my-16 overflow-hidden rounded-2xl border bg-card/60 p-6 backdrop-blur-md transition-all md:p-10">
      {/* Background Subtle Gradient Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      {/* Header Info */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            <span>Contributor Graph</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            开源贡献者图表
          </h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            感谢所有为 HITSZ-OpenAuto 课程攻略及项目维护做出贡献的同学与开发者
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border bg-background/80 px-3.5 py-2 shadow-xs">
            <Users className="size-4 text-primary" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground">贡献者</div>
              <div className="text-sm font-bold">{contributors.length} 人</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border bg-background/80 px-3.5 py-2 shadow-xs">
            <GitCommit className="size-4 text-primary" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground font-sans">累计 Commits</div>
              <div className="text-sm font-bold">{totalContributions} 次</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Graph Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Col: Leaderboard & Distribution Bars */}
        <div className="space-y-4 lg:col-span-7">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <GitPullRequest className="size-4" />
            贡献排行与活跃度
          </h3>

          <div className="space-y-3">
            {contributors.slice(0, 5).map((contributor, index) => {
              const percentage = Math.round(
                (contributor.contributions / maxContributions) * 100
              );
              return (
                <div
                  key={contributor.login}
                  className="group relative flex flex-col gap-2 rounded-xl border bg-background/50 p-3 transition-all hover:bg-background/80 hover:shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={contributor.avatarUrl}
                        alt={contributor.login}
                        className="size-7 rounded-full border border-border object-cover"
                      />
                      <a
                        href={contributor.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline hover:text-primary transition-colors flex items-center gap-1"
                      >
                        {contributor.name || contributor.login}
                        <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </div>
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      {contributor.contributions} 次贡献
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Avatar Grid Wall & Contribute CTA */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-4">
              <Users className="size-4" />
              全员贡献者墙
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {contributors.map((contributor) => (
                <a
                  key={contributor.login}
                  href={contributor.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${contributor.login} (${contributor.contributions} 次贡献)`}
                  className="group relative flex items-center gap-2 rounded-full border bg-background/60 p-1.5 pr-3 transition-all hover:scale-105 hover:border-primary/40 hover:bg-background shadow-2xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={contributor.avatarUrl}
                    alt={contributor.login}
                    className="size-8 rounded-full border object-cover"
                  />
                  <span className="text-xs font-medium group-hover:text-primary transition-colors">
                    {contributor.login}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Become Contributor Card */}
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5 text-left transition-colors hover:bg-primary/10">
            <h4 className="font-bold text-sm text-foreground">想加入 HITSZ-OpenAuto 贡献计划？</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              无论完善课程笔记、分享考试经验还是提交代码重构，均欢迎提交 Pull Request！
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button size="sm" asChild className="rounded-lg text-xs">
                <a
                  href="https://github.com/HITSZ-OpenAuto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitPullRequest className="mr-1.5 size-3.5" />
                  提交贡献 PR
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
