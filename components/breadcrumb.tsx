'use client';

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumb } from 'fumadocs-core/breadcrumb';
import type { Root } from 'fumadocs-core/page-tree';

type BreadcrumbProps = {
  tree: Root;
  root: {
    name: string;
    url: string;
  };
};

export function Breadcrumb({ tree, root }: BreadcrumbProps) {
  const pathname = usePathname();
  const items = useBreadcrumb(pathname, tree);
  const breadcrumbs = [root, ...items];

  return (
    <nav
      aria-label="面包屑导航"
      className="text-fd-muted-foreground mb-6 flex min-w-0 items-center gap-1 text-sm font-medium"
    >
      {breadcrumbs.map((item, index) => (
        <Fragment key={index}>
          {index !== 0 && (
            <ChevronRight className="size-4 shrink-0 rtl:rotate-180" />
          )}
          {item.url ? (
            <Link
              href={item.url}
              className="hover:text-fd-accent-foreground truncate"
            >
              {item.name}
            </Link>
          ) : (
            <span className="truncate">{item.name}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
