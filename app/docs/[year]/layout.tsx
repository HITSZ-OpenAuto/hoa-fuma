import { DocsPathMemory } from '@/components/docs/docs-path-memory';
import { SidebarBanner } from '@/components/sidebar/sidebar-banner';
import { baseOptions } from '@/lib/layout.shared';
import { getYearPageTree } from '@/lib/docs';
import { getYearMajorMap } from '@/lib/docs-home';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout(props: {
  children: ReactNode;
  params: Promise<{ year: string }>;
}) {
  const { year } = await props.params;

  const treeAsRoot = getYearPageTree(year);
  if (!treeAsRoot) {
    return notFound();
  }

  return (
    <DocsLayout
      tree={treeAsRoot}
      {...baseOptions()}
      sidebar={{
        tabs: false,
        prefetch: false,
        banner: (
          <SidebarBanner
            key="sidebar-banner"
            yearMajorMap={getYearMajorMap()}
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
