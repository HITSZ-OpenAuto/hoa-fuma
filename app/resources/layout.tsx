import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { notFound } from 'next/navigation';
import { SidebarBanner } from '@/components/sidebar/sidebar-banner';
import { DocsPathMemory } from '@/components/docs/docs-path-memory';
import { HOA_LAST_PATH_COOKIE } from '@/lib/constants';
import { getYearPageTree } from '@/lib/docs';
import { getYearMajorMap } from '@/lib/docs-home';
import { getAvailableYears } from '@/lib/docs-tree';
import { baseOptions } from '@/lib/layout.shared';

/**
 * 资料页（/docs/resources/*）沿用课程文档的目录树，
 * 这样从侧栏点进来时左侧目录不会消失，并保持用户上一次浏览的年级。
 */
async function resolveYear(): Promise<string | undefined> {
  const store = await cookies();
  const lastPath = store.get(HOA_LAST_PATH_COOKIE)?.value;
  const years = getAvailableYears();

  if (lastPath) {
    const year = decodeURIComponent(lastPath).split('/')[2];
    if (year && years.includes(year)) return year;
  }

  return years[0];
}

export default async function Layout(props: { children: ReactNode }) {
  const year = await resolveYear();
  if (!year) {
    return notFound();
  }

  const tree = getYearPageTree(year);
  if (!tree) {
    return notFound();
  }

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
            yearMajorMap={getYearMajorMap()}
            currentYear={year}
            tree={tree}
          />
        ),
      }}
    >
      <DocsPathMemory />
      {props.children}
    </DocsLayout>
  );
}
