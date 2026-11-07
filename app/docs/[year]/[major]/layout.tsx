import { DocsShell } from '@/components/docs/docs-shell';
import type { ReactNode } from 'react';

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ year: string; major: string }>;
}) {
  const { year, major } = await params;
  return (
    <DocsShell year={year} major={major}>
      {children}
    </DocsShell>
  );
}
