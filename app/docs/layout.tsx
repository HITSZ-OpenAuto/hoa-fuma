import type { ReactNode } from 'react';

// Keep the recovery boundary above [year], whose layout can also call notFound().
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
