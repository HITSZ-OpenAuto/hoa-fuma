import { findNeighbour, type Root } from 'fumadocs-core/page-tree';
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import { PageFooter } from 'fumadocs-ui/layouts/docs/page';

export function PostNavigation({ tree, url }: { tree: Root; url: string }) {
  const items = findNeighbour(tree, url, { separateRoot: false });

  if (!items.previous && !items.next) return null;

  return (
    <TreeContextProvider tree={tree}>
      <PageFooter items={items} className="mt-12" />
    </TreeContextProvider>
  );
}
