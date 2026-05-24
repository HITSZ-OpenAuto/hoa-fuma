import { DocsPathMemory } from '@/components/docs/docs-path-memory';
import { SidebarBanner } from '@/components/sidebar/sidebar-banner';
import { baseOptions } from '@/lib/layout.shared';
import { getAvailableYears } from '@/lib/docs';
import { source } from '@/lib/source';
import type { Folder, Root } from 'fumadocs-core/page-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { isYear } from '@/lib/utils';

export default async function Layout(props: {
  children: ReactNode;
  params: Promise<{ year: string }>;
}) {
  const { year } = await props.params;

  if (!isYear(year)) {
    return (
      <DocsLayout
        tree={source.getPageTree()}
        {...baseOptions()}
        sidebar={{
          tabs: false,
        }}
      >
        <DocsPathMemory />
        {props.children}
      </DocsLayout>
    );
  }

  const pageTree = source.getPageTree();
  const yearNode = pageTree.children.find(
    (node): node is Folder => node.type === 'folder' && node.name === year
  );

  if (!yearNode) {
    return notFound();
  }

  const years = getAvailableYears();
  const treeAsRoot: Root = { ...yearNode, type: 'root' };

  return (
    <DocsLayout
      tree={treeAsRoot}
      {...baseOptions()}
      sidebar={{
        tabs: false,
        banner: (
          <SidebarBanner
            key="sidebar-banner"
            years={years}
            currentYear={year}
            tree={treeAsRoot}
          />
        ),
      }}
    >
      <DocsPathMemory />
      {props.children}
    </DocsLayout>
  );
}
