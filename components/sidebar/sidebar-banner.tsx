'use client';

import { YearSelector } from '@/components/sidebar/year-selector';
import { SidebarTabsDropdown } from 'fumadocs-ui/components/sidebar/tabs/dropdown';
import { useMemo } from 'react';
import { getSidebarTabs } from 'fumadocs-ui/utils/get-sidebar-tabs';
import type * as PageTree from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap } from 'lucide-react';

const SPECIAL_CATEGORIES = [
  {
    id: 'cross-specialty',
    title: '跨专业选修',
    href: '/docs/cross-specialty',
    icon: GraduationCap,
  },
  {
    id: 'general-knowledge',
    title: '文理通识与 MOOC',
    href: '/docs/general-knowledge',
    icon: BookOpen,
  },
];

export function SidebarBanner({
  years,
  currentYear,
  tree,
}: {
  years: string[];
  currentYear: string;
  tree: PageTree.Folder;
}) {
  const pathname = usePathname();

  const tabs = useMemo(() => {
    const sidebarTabs = getSidebarTabs(tree);
    return [
      {
        title: '所有专业',
        url: `/docs/${currentYear}`,
      },
      ...sidebarTabs,
    ];
  }, [tree, currentYear]);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <YearSelector years={years} currentYear={currentYear} />
      <SidebarTabsDropdown options={tabs} />

      {/* Special Categories Section */}
      <div className="mt-4 border-t pt-4">
        <p className="text-fd-muted-foreground mb-2 px-2 text-xs font-medium">
          其他课程
        </p>
        <div className="flex flex-col gap-1">
          {SPECIAL_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg p-2 text-sm transition-colors',
                  pathname.startsWith(cat.href)
                    ? 'bg-fd-accent text-fd-accent-foreground'
                    : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                )}
              >
                <Icon className="size-4" />
                {cat.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
