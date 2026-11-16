import { cookies } from 'next/headers';
import { HOA_LAST_PATH_COOKIE } from '@/lib/constants';

export { getAvailableYears, getYearPageTree } from '@/lib/docs-tree';

export async function getLastDocsPath(): Promise<string> {
  const value = (await cookies()).get(HOA_LAST_PATH_COOKIE)?.value;
  if (!value) return '';

  try {
    const pathname = decodeURIComponent(value);
    return pathname.startsWith('/docs/') ? pathname : '';
  } catch {
    return '';
  }
}
