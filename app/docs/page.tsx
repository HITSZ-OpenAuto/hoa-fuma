import { getAvailableYears, getFirstCourseUrl } from '@/lib/docs';
import { source } from '@/lib/source';
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
  if (pathname.startsWith('/docs/')) {
    const segments = pathname.split('/').filter(Boolean).slice(1);
    if (segments.length >= 1 && source.getPage(segments)) {
      redirect(pathname);
    }
  }

  redirect(getFirstCourseUrl(years[0]));
}
