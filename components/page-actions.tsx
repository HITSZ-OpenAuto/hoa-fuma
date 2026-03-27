'use client';

import { siGithub } from 'simple-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function GitHubButton({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn(
        '[&_svg]:text-fd-muted-foreground gap-2 no-underline [&_svg]:size-3.5',
        className
      )}
      asChild
    >
      <a href={href} rel="noreferrer noopener" target="_blank">
        <svg fill="currentColor" role="img" viewBox="0 0 24 24">
          <title>{siGithub.title}</title>
          <path d={siGithub.path} />
        </svg>
        GitHub
      </a>
    </Button>
  );
}

export function PageActions({ githubUrl }: { githubUrl: string }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <GitHubButton href={githubUrl} />
    </div>
  );
}
