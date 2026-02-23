import { DocsPathMemory } from '@/components/docs/docs-path-memory';
import { SpecialSidebarBanner } from '@/components/sidebar/special-sidebar-banner';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import type { Folder } from 'fumadocs-core/page-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout(props: { children: ReactNode }) {
  const pageTree = source.getPageTree();

  // Find the cross-specialty folder in the page tree
  const specialNode = pageTree.children.find(
    (node): node is Folder =>
      node.type === 'folder' && node.name === 'cross-specialty'
  );

  if (!specialNode) {
    return notFound();
  }

  return (
    <DocsLayout
      tree={specialNode}
      {...baseOptions()}
      sidebar={{
        tabs: false,
        banner: <SpecialSidebarBanner currentCategory="cross-specialty" />,
      }}
    >
      <DocsPathMemory />
      {props.children}
    </DocsLayout>
  );
}
