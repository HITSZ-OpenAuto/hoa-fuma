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

  // Find the general-knowledge folder in the page tree
  const specialNode = pageTree.children.find(
    (node): node is Folder =>
      node.type === 'folder' && node.name === 'general-knowledge'
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
        banner: <SpecialSidebarBanner currentCategory="general-knowledge" />,
      }}
    >
      <DocsPathMemory />
      {props.children}
    </DocsLayout>
  );
}
