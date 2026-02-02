import { getAvailableYears, getFirstCourseUrl } from '@/lib/docs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const DOCS_LAST_PATH_COOKIE = 'docs-last-path';

export default async function Page() {
  const years = getAvailableYears();

  if (years.length === 0) {
    redirect('/');
  }

  const lastPath = (await cookies()).get(DOCS_LAST_PATH_COOKIE)?.value;
  const pathname = lastPath ? decodeURIComponent(lastPath) : '';
  const year = pathname.split('/').filter(Boolean)[1];
  if (pathname.startsWith('/docs/') && year && years.includes(year)) {
    redirect(pathname);
  }

  redirect(getFirstCourseUrl(years[0]));
}
