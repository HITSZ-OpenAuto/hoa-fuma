import { DocsPathMemory } from '@/components/docs/docs-path-memory';
import { SidebarBanner } from '@/components/sidebar/sidebar-banner';
import { baseOptions } from '@/lib/layout.shared';
import {
  getAvailableYears,
  getDocsPageTree,
  getYearPageTree,
} from '@/lib/docs';
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
        tree={getDocsPageTree()}
        {...baseOptions()}
        sidebar={{
          tabs: false,
          prefetch: false,
        }}
      >
        <DocsPathMemory />
        {props.children}
      </DocsLayout>
    );
  }

  const treeAsRoot = getYearPageTree(year);
  if (!treeAsRoot) {
    return notFound();
  }

  const years = getAvailableYears();

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
