import { DocsPathMemory } from '@/components/docs/docs-path-memory';
import { SidebarBanner } from '@/components/sidebar/sidebar-banner';
import { baseOptions } from '@/lib/layout.shared';
import { getYearPageTree, getMajorPageTree } from '@/lib/docs';
import { getYearMajorMap } from '@/lib/docs-home';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { getSidebarTabs } from 'fumadocs-ui/components/sidebar/tabs';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

export function DocsShell({
  year,
  major,
  children,
}: {
  year: string;
  major?: string;
  children: ReactNode;
}) {
  const yearTree = getYearPageTree(year);
  const tree = major ? getMajorPageTree(year, major) : yearTree;
  if (!yearTree || !tree) notFound();

  // Tab URL sets contain every course. Only send navigation metadata to the client.
  const majorTabs = getSidebarTabs(yearTree).map(
    ({ url, title, description, icon, unlisted }) => ({
      url,
      title,
      description,
      icon,
      unlisted,
    })
  );

  return (
    <DocsLayout
      tree={tree}
      {...baseOptions()}
      sidebar={{
        tabs: false,
        prefetch: false,
        banner: (
          <SidebarBanner
            yearMajorMap={getYearMajorMap()}
            currentYear={year}
            majorTabs={majorTabs}
          />
        ),
      }}
    >
      <DocsPathMemory />
      {children}
    </DocsLayout>
  );
}
