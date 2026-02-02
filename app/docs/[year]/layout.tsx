import { DocsPathMemory } from '@/components/docs/docs-path-memory';
import { SidebarBanner } from '@/components/sidebar/sidebar-banner';
import { baseOptions } from '@/lib/layout.shared';
import { source, getAvailableYears } from '@/lib/source';
import type { Folder } from 'fumadocs-core/page-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout(props: {
  children: ReactNode;
  params: Promise<{ year: string }>;
}) {
  const { year } = await props.params;
  const pageTree = source.getPageTree();
  const yearNode = pageTree.children.find(
    (node): node is Folder => node.type === 'folder' && node.name === year
  );

  if (!yearNode) {
    return notFound();
  }

  const years = getAvailableYears();

  return (
    <DocsLayout
      tree={yearNode}
      {...baseOptions()}
      sidebar={{
        tabs: false,
        banner: (
          <SidebarBanner years={years} currentYear={year} tree={yearNode} />
        ),
      }}
    >
      <DocsPathMemory />
      {props.children}
    </DocsLayout>
  );
}
