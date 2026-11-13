import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { notFound } from 'next/navigation';
import { SidebarBanner } from '@/components/sidebar/sidebar-banner';
import { DocsPathMemory } from '@/components/docs/docs-path-memory';
import { HOA_LAST_PATH_COOKIE } from '@/lib/constants';
import { getResourcePageTree } from '@/lib/docs';
import { getYearMajorMap } from '@/lib/docs-home';
import { getAvailableYears } from '@/lib/docs-tree';
import { baseOptions } from '@/lib/layout.shared';

function decodeCookiePath(value: string | undefined): string {
  if (!value) return '';

  try {
    return decodeURIComponent(value);
  } catch {
    return '';
  }
}

/**
 * 资料页（/resources/*）沿用课程文档的目录树，
 * 这样从侧栏点进来时左侧目录不会消失，并保持用户上一次浏览的年级与专业。
 */
async function resolveContext(): Promise<{
  year?: string;
  major?: string;
}> {
  const store = await cookies();
  const lastPath = decodeCookiePath(store.get(HOA_LAST_PATH_COOKIE)?.value);
  const years = getAvailableYears();

  if (lastPath.startsWith('/docs/')) {
    const [, , year, major] = lastPath.split('/');
    if (year && years.includes(year)) {
      return { year, major };
    }
  }

  return { year: years[0] };
}

export default async function Layout(props: { children: ReactNode }) {
  const { year, major } = await resolveContext();
  if (!year) {
    return notFound();
  }

  const tree = getResourcePageTree(year, major);
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
