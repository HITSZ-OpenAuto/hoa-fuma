import Image from 'next/image';
import type { LatestCommitInfo } from '@/lib/github';
import { formatDate } from '@/lib/utils';

export function LatestCommit({ commit }: { commit: LatestCommitInfo }) {
  return (
    <span className="inline-flex items-start gap-2">
      <span className="leading-relaxed">
        最近由{' '}
        <a
          href={commit.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fd-foreground inline-flex items-center gap-1 align-bottom font-medium hover:underline"
        >
          {commit.authorAvatarUrl && (
            <Image
              src={`${commit.authorAvatarUrl}&s=32`}
              alt={commit.authorName}
              width={16}
              height={16}
              className="rounded-full"
            />
          )}
          <span>{commit.authorName}</span>
        </a>{' '}
        于 {formatDate(commit.date)}更新：
        <a
          href={commit.commitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fd-foreground hover:underline"
        >
          {commit.message}
        </a>
      </span>
    </span>
  );
}
