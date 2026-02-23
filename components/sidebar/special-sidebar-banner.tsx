'use client';

import { SidebarTabsDropdown } from 'fumadocs-ui/components/sidebar/tabs/dropdown';
import { useMemo } from 'react';
import { getSidebarTabs } from 'fumadocs-ui/utils/get-sidebar-tabs';
import type * as PageTree from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const SPECIAL_CATEGORIES = [
  { id: 'cross-specialty', title: '跨专业选修', href: '/docs/cross-specialty' },
  {
    id: 'general-knowledge',
    title: '文理通识与 MOOC',
    href: '/docs/general-knowledge',
  },
];

export function SpecialSidebarBanner({
  currentCategory,
  tree,
}: {
  currentCategory: string;
  tree?: PageTree.Folder;
}) {
  const pathname = usePathname();

  const tabs = useMemo(() => {
    if (!tree) return [];
    const sidebarTabs = getSidebarTabs(tree);
    return [
      {
        title: '目录',
        url: `/docs/${currentCategory}`,
      },
      ...sidebarTabs,
    ];
  }, [tree, currentCategory]);

  return (
    <div className="mt-2 flex flex-col gap-2">
      {/* Category selector */}
      <div className="flex flex-col gap-1">
        {SPECIAL_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className={cn(
              'flex items-center gap-2 rounded-lg border p-2 text-sm font-medium transition-colors',
              pathname.startsWith(cat.href)
                ? 'bg-fd-accent text-fd-accent-foreground border-fd-accent'
                : 'bg-fd-secondary/50 text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
            )}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      {/* Sub-navigation tabs if tree is provided */}
      {tree && tabs.length > 0 && <SidebarTabsDropdown options={tabs} />}
    </div>
  );
}
