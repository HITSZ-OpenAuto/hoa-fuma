import { Card, Cards } from 'fumadocs-ui/components/card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type RepoItem = {
  id: string;
  name: string;
  description?: string;
  href: string;
  updatedAt?: string | Date;
};

type RecentReposProps = {
  title?: string;
  repos: RepoItem[];
};

export function RecentRepos({
  title = '最近更新的仓库',
  repos,
}: RecentReposProps) {
  return (
    <section className="mx-auto w-full max-w-5xl pb-6 text-left">
      <div className="mb-4 flex flex-row items-center gap-1">
        <h2 className="text-fd-foreground text-sm font-medium tracking-widest">
          {title}
        </h2>
        <Link
          href="https://github.com/HITSZ-OpenAuto"
          className="text-fd-muted-foreground hover:text-fd-foreground group transition-colors"
        >
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <Cards className="grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, index) => (
          <ScrollReveal key={repo.id} delay={index * 120} className="h-full">
            <Card
              title={repo.name}
              description={
                <span className="line-clamp-1">{repo.description}</span>
              }
              href={repo.href}
              className="bg-fd-card hover:bg-fd-accent hover:text-fd-accent-foreground [&>div:last-child]:text-brand flex h-full flex-col rounded-2xl border p-4 text-left shadow-sm transition-colors [&>div:last-child]:mt-auto [&>div:last-child]:pt-4 [&>div:last-child]:text-xs"
            >
              {repo.updatedAt ? formatDate(repo.updatedAt) : null}
            </Card>
          </ScrollReveal>
        ))}
      </Cards>
    </section>
  );
}
