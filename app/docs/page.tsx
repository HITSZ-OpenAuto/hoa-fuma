import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAvailableYears } from '@/lib/docs';
import { HOA_LAST_PATH_COOKIE } from '@/lib/constants';
import { docsPathExists } from '@/lib/docs-paths';

function getDocsFallbackPath() {
  return `/docs/${getAvailableYears()[0]}`;
}

function decodeCookiePath(value: string | undefined) {
  if (!value) return '';

  try {
    return decodeURIComponent(value);
  } catch {
    return '';
  }
}

export default async function Page() {
  const lastPath = (await cookies()).get(HOA_LAST_PATH_COOKIE)?.value;
  const pathname = decodeCookiePath(lastPath);

  if (pathname.startsWith('/docs/')) {
    const segments = pathname.split('/').filter(Boolean).slice(1);
    if (segments.length >= 1 && docsPathExists(segments)) {
      redirect(pathname);
    }
  }

  redirect(getDocsFallbackPath());
}
