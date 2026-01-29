import { Card, Cards } from 'fumadocs-ui/components/card';
import { ScrollReveal } from '@/components/scroll-reveal';
import { formatDate } from '@/lib/utils';

type RepoItem = {
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
    <section className="mx-auto w-full max-w-5xl pb-16 text-left">
      <p className="text-muted-foreground mb-4 text-xs tracking-[0.22em] uppercase">
        {title}
      </p>
      <Cards className="grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, index) => (
          <ScrollReveal
            key={`${repo.href}-${index}`}
            delay={index * 120}
            className="h-full"
          >
            <Card
              title={repo.name}
              description={repo.description}
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
