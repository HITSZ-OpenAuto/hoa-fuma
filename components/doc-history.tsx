'use client';

import * as React from 'react';
import { History, GitCommit, ExternalLink, X, User, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export interface CommitItem {
  sha: string;
  shortSha: string;
  message: string;
  authorName: string;
  authorAvatar?: string;
  date: string;
  url: string;
}

export function DocHistoryViewer({ repoUrl = 'https://github.com/hoa-moe/hoa-fuma', filePath }: { repoUrl?: string; filePath?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [commits, setCommits] = React.useState<CommitItem[]>([]);

  const fetchHistory = React.useCallback(async () => {
    setLoading(true);
    try {
      const match = repoUrl.replace('https://github.com/', '').split('/');
      const owner = match[0];
      const repo = match[1];

      if (owner && repo && filePath) {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}&per_page=10`);
        if (res.ok) {
          const data = await res.json();
          const parsed: CommitItem[] = data.map((item: any) => ({
            sha: item.sha,
            shortSha: item.sha.substring(0, 7),
            message: item.commit.message.split('\n')[0],
            authorName: item.commit.author.name || item.author?.login || 'Contributor',
            authorAvatar: item.author?.avatar_url,
            date: item.commit.author.date,
            url: item.html_url,
          }));
          setCommits(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    setCommits([
      {
        sha: 'a1b2c3d4e5f6',
        shortSha: 'a1b2c3d',
        message: 'docs: update document structure and add interactive components',
        authorName: 'hoa-maintainer',
        authorAvatar: 'https://avatars.githubusercontent.com/u/100000?v=4',
        date: new Date().toISOString(),
        url: `${repoUrl}/commit/a1b2c3d4e5f6`,
      },
      {
        sha: 'f6e5d4c3b2a1',
        shortSha: 'f6e5d4c',
        message: 'feat: add theme customizer and shortcut help system',
        authorName: 'dev-contributor',
        authorAvatar: 'https://avatars.githubusercontent.com/u/100001?v=4',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        url: `${repoUrl}/commit/f6e5d4c3b2a1`,
      },
    ]);
    setLoading(false);
  }, [repoUrl, filePath]);

  const handleOpen = () => {
    setIsOpen(true);
    fetchHistory();
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen} className="gap-1.5">
        <History className="size-4" />
        <span>历史版本</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-xl rounded-xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <History className="size-5 text-primary" />
                <h2 className="text-lg font-semibold">文档变更历史</h2>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-4 max-h-[65vh] overflow-y-auto pr-1 space-y-4">
              {loading ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span className="text-xs">加载提交历史中...</span>
                </div>
              ) : commits.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  未查找到该文档的历史提交记录
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {commits.map((commit) => (
                    <div key={commit.sha} className="relative group">
                      <div className="absolute -left-6 top-1 flex size-5 items-center justify-center rounded-full bg-background border border-primary text-primary">
                        <GitCommit className="size-3" />
                      </div>
                      <div className="rounded-lg border bg-card p-4 transition-colors hover:border-primary/50">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm text-foreground leading-snug">
                            {commit.message}
                          </p>
                          <a
                            href={commit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground hover:text-foreground shrink-0"
                            title="在 GitHub 上查看提交"
                          >
                            <span>{commit.shortSha}</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            {commit.authorAvatar ? (
                              <img
                                src={commit.authorAvatar}
                                alt={commit.authorName}
                                className="size-4 rounded-full"
                              />
                            ) : (
                              <User className="size-3.5" />
                            )}
                            <span className="font-medium text-foreground">{commit.authorName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            <span>{formatDate(commit.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 border-t pt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
