import { getAvailableYears } from '@/lib/docs';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  if (!getAvailableYears().includes(year)) notFound();
  return children;
}
