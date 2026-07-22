'use client';

import {
  Users,
  GitCommit,
  GitPullRequest,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
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
    <section className="bg-card/60 relative my-16 overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all md:p-10">
      {/* Background Subtle Gradient Glow */}
      <div className="bg-primary/10 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-primary/5 pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl" />

      {/* Header Info */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
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
          <div className="bg-background/80 flex items-center gap-2 rounded-lg border px-3.5 py-2 shadow-xs">
            <Users className="text-primary size-4" />
            <div className="text-left">
              <div className="text-muted-foreground text-xs">贡献者</div>
              <div className="text-sm font-bold">{contributors.length} 人</div>
            </div>
          </div>

          <div className="bg-background/80 flex items-center gap-2 rounded-lg border px-3.5 py-2 shadow-xs">
            <GitCommit className="text-primary size-4" />
            <div className="text-left">
              <div className="text-muted-foreground font-sans text-xs">
                累计 Commits
              </div>
              <div className="text-sm font-bold">{totalContributions} 次</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Graph Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Col: Leaderboard & Distribution Bars */}
        <div className="space-y-4 lg:col-span-7">
          <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
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
                  className="group bg-background/50 hover:bg-background/80 relative flex flex-col gap-2 rounded-xl border p-3 transition-all hover:shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={contributor.avatarUrl}
                        alt={contributor.login}
                        className="border-border size-7 rounded-full border object-cover"
                      />
                      <a
                        href={contributor.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary flex items-center gap-1 font-medium transition-colors hover:underline"
                      >
                        {contributor.name || contributor.login}
                        <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </div>
                    <span className="text-muted-foreground font-mono text-xs font-semibold">
                      {contributor.contributions} 次贡献
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="from-primary/80 to-primary h-full rounded-full bg-gradient-to-r transition-all duration-500"
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
            <h3 className="text-muted-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
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
                  className="group bg-background/60 hover:border-primary/40 hover:bg-background relative flex items-center gap-2 rounded-full border p-1.5 pr-3 shadow-2xs transition-all hover:scale-105"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={contributor.avatarUrl}
                    alt={contributor.login}
                    className="size-8 rounded-full border object-cover"
                  />
                  <span className="group-hover:text-primary text-xs font-medium transition-colors">
                    {contributor.login}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Become Contributor Card */}
          <div className="border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-xl border border-dashed p-5 text-left transition-colors">
            <h4 className="text-foreground text-sm font-bold">
              想加入 HITSZ-OpenAuto 贡献计划？
            </h4>
            <p className="text-muted-foreground mt-1 text-xs">
              无论完善课程笔记、分享考试经验还是提交代码重构，均欢迎提交 Pull
              Request！
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
