import type { ReactNode } from 'react';
import { DocsNavigationLayout } from '@/components/docs/docs-navigation-layout';

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsNavigationLayout>{children}</DocsNavigationLayout>;
}
