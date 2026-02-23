import { source } from '@/lib/source';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const HOA_LAST_PATH_COOKIE = 'hoa-last-path';

export default async function Page() {
  const lastPath = (await cookies()).get(HOA_LAST_PATH_COOKIE)?.value;
  const pathname = lastPath ? decodeURIComponent(lastPath) : '';
  if (pathname.startsWith('/docs/')) {
    const segments = pathname.split('/').filter(Boolean).slice(1);
    if (segments.length >= 1 && source.getPage(segments)) {
      redirect(pathname);
    }
  }

  redirect('/docs/2025');
}
