import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const HOA_LAST_PATH_COOKIE = 'hoa-last-path';

export default async function Page() {
  const lastPath = (await cookies()).get(HOA_LAST_PATH_COOKIE)?.value;
  const pathname = lastPath ? decodeURIComponent(lastPath) : '';
  if (pathname.startsWith('/docs/')) redirect(pathname);
  redirect('/docs/2025');
}
