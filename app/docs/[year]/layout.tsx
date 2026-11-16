import type { ReactNode } from 'react';
import { DocsNavigationLayout } from '@/components/docs/docs-navigation-layout';

export default async function Layout(props: {
  children: ReactNode;
  params: Promise<{ year: string }>;
}) {
  const { year } = await props.params;
  return (
    <DocsNavigationLayout year={year}>{props.children}</DocsNavigationLayout>
  );
}
