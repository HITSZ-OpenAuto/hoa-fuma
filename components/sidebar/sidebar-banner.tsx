'use client';

import { YearSelector } from '@/components/sidebar/year-selector';
import {
  isTabActive,
  type SidebarTabWithProps,
} from 'fumadocs-ui/components/sidebar/tabs/dropdown';
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
import { getSidebarTabs } from 'fumadocs-ui/utils/get-sidebar-tabs';
import type * as PageTree from 'fumadocs-core/page-tree';

function MajorSelector({ options }: { options: SidebarTabWithProps[] }) {
  const [open, setOpen] = useState(false);
  const { closeOnRedirect } = useSidebar();
  const pathname = usePathname();
  const selected = useMemo(
    () => options.findLast((item) => isTabActive(item, pathname)),
    [options, pathname]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="bg-fd-secondary/50 text-fd-secondary-foreground hover:bg-fd-accent data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground flex items-center gap-2 rounded-lg border p-2 text-start transition-colors">
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
      <PopoverContent className="fd-scroll-container flex w-(--radix-popover-trigger-width) flex-col gap-1 p-1">
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
  years,
  currentYear,
  tree,
}: {
  years: string[];
  currentYear: string;
  tree: PageTree.Root;
}) {
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
      <MajorSelector options={tabs} />
    </div>
  );
}
