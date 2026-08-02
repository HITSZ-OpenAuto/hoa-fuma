import type { Root } from 'fumadocs-core/page-tree';
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import { PageFooter } from 'fumadocs-ui/layouts/docs/page';
import { cn } from '@/lib/utils';

type Post = {
  title: string;
  description?: string;
  url: string;
};

const emptyTree: Root = {
  $id: 'post-navigation',
  name: '',
  children: [],
};

export function PostNavigation({ posts, url }: { posts: Post[]; url: string }) {
  const index = posts.findIndex((post) => post.url === url);
  if (index === -1) return null;

  const previous = posts[index - 1];
  const next = posts[index + 1];

  if (!previous && !next) return null;

  return (
    <TreeContextProvider tree={emptyTree}>
      <PageFooter
        items={{
          previous: previous && {
            name: previous.title,
            description: previous.description,
            url: previous.url,
          },
          next: next && {
            name: next.title,
            description: next.description,
            url: next.url,
          },
        }}
        className={cn(
          'mt-12 grid-cols-2',
          !previous && '[&>a]:col-start-2 @max-lg:[&>a]:col-start-1'
        )}
      />
    </TreeContextProvider>
  );
}
