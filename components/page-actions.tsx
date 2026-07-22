'use client';

import { useState } from 'react';
import { siGithub } from 'simple-icons';
import { Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { OnlineEditorDialog } from '@/components/docs/online-editor-dialog';

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
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditorOpen(true)}
          className="h-8 gap-1.5 text-xs"
        >
          <Edit3 className="text-fd-primary size-3.5" />
          在线编辑文档
        </Button>
        <GitHubButton href={githubUrl} />
      </div>

      <OnlineEditorDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        repoUrl={githubUrl}
      />
    </>
  );
}
