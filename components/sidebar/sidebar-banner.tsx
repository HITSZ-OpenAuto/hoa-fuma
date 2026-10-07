'use client';

import { YearSelector } from '@/components/sidebar/year-selector';
import { StudyLevelSelector } from '@/components/sidebar/study-level-selector';
import type { StudyLevel, YearMajorMap } from '@/lib/docs-utils';
import type { SidebarTabWithProps } from 'fumadocs-ui/components/sidebar/tabs/dropdown';
import { isLayoutTabActive } from 'fumadocs-ui/layouts/shared';
import { useTreePath } from 'fumadocs-ui/contexts/tree';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { useSidebar } from 'fumadocs-ui/components/sidebar/base';
import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import { BookOpenText, Check, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getSidebarTabs } from 'fumadocs-ui/components/sidebar/tabs';
import type * as PageTree from 'fumadocs-core/page-tree';

function MajorSelector({ options }: { options: SidebarTabWithProps[] }) {
  const [open, setOpen] = useState(false);
  const { closeOnRedirect } = useSidebar();
  const pathname = usePathname();
  const path = useTreePath();
  const selected = useMemo(
    () => options.findLast((item) => isLayoutTabActive(item, path, pathname)),
    [options, path, pathname]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="bg-fd-secondary/50 text-fd-secondary-foreground hover:bg-fd-accent data-popup-open:bg-fd-accent data-popup-open:text-fd-accent-foreground flex items-center gap-2 rounded-lg border p-2 text-start transition-colors">
        <div className="text-fd-primary flex size-5 shrink-0 items-center justify-center">
          <BookOpenText className="size-4" />
        </div>
        <div>
          <p className="text-sm font-medium">专业</p>
          <p className="text-fd-muted-foreground text-[0.8125rem] leading-4">
            {selected?.title ?? '所有专业'}
          </p>
        </div>
        <ChevronsUpDown className="text-fd-muted-foreground ms-auto size-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent className="fd-scroll-container flex max-h-72 w-(--anchor-width) flex-col gap-1 p-1">
        {options.map((item) => {
          const active = selected?.url === item.url;
          if (!active && item.unlisted) return null;

          return (
            <Link
              key={item.url}
              href={item.url}
              onClick={() => {
                closeOnRedirect.current = false;
                setOpen(false);
              }}
              {...item.props}
              className={`hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-2 rounded-lg p-1.5 ${item.props?.className ?? ''}`}
            >
              <div className="size-5 shrink-0 empty:hidden">{item.icon}</div>
              <div>
                <p className="text-sm leading-none font-medium">{item.title}</p>
                {item.description ? (
                  <p className="text-fd-muted-foreground mt-1 text-[0.8125rem]">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <Check
                className={`text-fd-primary ms-auto size-3.5 shrink-0 ${active ? '' : 'invisible'}`}
              />
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export function SidebarBanner({
  yearMajorMap,
  currentYear,
  tree,
}: {
  yearMajorMap: YearMajorMap;
  currentYear: string;
  tree: PageTree.Root;
}) {
  const pathname = usePathname();
  const majors = yearMajorMap[currentYear] ?? [];
  const currentMajor = majors.find(
    (major) => major.id === pathname.split('/')[3]
  );
  const studyLevel = currentMajor?.studyLevel ?? 'undergrad';
  const yearEntries = Object.entries(yearMajorMap).sort(([a], [b]) =>
    b.localeCompare(a)
  );
  const years = yearEntries.flatMap(([year, options]) => {
    const major = options.find((option) => option.studyLevel === studyLevel);
    return major ? [{ year, url: `/docs/${year}/${major.id}` }] : [];
  });
  const levels: StudyLevel[] = ['undergrad', 'postgrad'];
  const studyLevelOptions = levels.flatMap((level) => {
    const targetYear = majors.some((major) => major.studyLevel === level)
      ? currentYear
      : yearEntries.find(([, options]) =>
          options.some((major) => major.studyLevel === level)
        )?.[0];
    const major = targetYear
      ? yearMajorMap[targetYear].find((major) => major.studyLevel === level)
      : undefined;
    return major
      ? [
          {
            level,
            url:
              level === studyLevel
                ? pathname
                : `/docs/${targetYear}/${major.id}`,
          },
        ]
      : [];
  });
  const visibleMajors = new Map(
    majors
      .filter((major) => major.studyLevel === studyLevel)
      .map((major) => [major.id, major])
  );
  const tabs = getSidebarTabs(tree).flatMap((tab) => {
    const major = visibleMajors.get(tab.url.split('/')[3]);
    return major ? [{ ...tab, title: major.name }] : [];
  });

  return (
    <div className="mt-2 flex flex-col gap-2">
      <StudyLevelSelector options={studyLevelOptions} studyLevel={studyLevel} />
      <YearSelector years={years} currentYear={currentYear} />
      <MajorSelector options={tabs} />
    </div>
  );
}
