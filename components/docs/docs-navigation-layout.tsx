import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPathMemory } from '@/components/docs/docs-path-memory';
import { SidebarBanner } from '@/components/sidebar/sidebar-banner';
import {
  getAvailableYears,
  getLastDocsPath,
  getYearPageTree,
} from '@/lib/docs';
import { getYearMajorMap } from '@/lib/docs-home';
import { baseOptions } from '@/lib/layout.shared';

export async function DocsNavigationLayout({
  children,
  year,
}: {
  children: ReactNode;
  year?: string;
}) {
  const years = getAvailableYears();
  const [, , rememberedYear, rememberedMajor] = year
    ? []
    : (await getLastDocsPath()).split('/');
  const hasRememberedYear = rememberedYear && years.includes(rememberedYear);
  const currentYear = year ?? (hasRememberedYear ? rememberedYear : years[0]);
  if (!currentYear) notFound();

  const yearMajorMap = getYearMajorMap();
  const majors = yearMajorMap[currentYear] ?? [];
  const currentMajor = year
    ? undefined
    : (majors.find((major) => hasRememberedYear && major.id === rememberedMajor)
        ?.id ??
      majors.find((major) => major.studyLevel === 'undergrad')?.id ??
      majors[0]?.id);
  const tree = getYearPageTree(currentYear, currentMajor);
  if (!tree) notFound();

  return (
    <DocsLayout
      tree={tree}
      {...baseOptions()}
      sidebar={{
        tabs: false,
        prefetch: false,
        banner: (
          <SidebarBanner
            key="sidebar-banner"
            yearMajorMap={yearMajorMap}
            currentYear={currentYear}
            tree={tree}
          />
        ),
      }}
    >
      <DocsPathMemory />
      {children}
    </DocsLayout>
  );
}
