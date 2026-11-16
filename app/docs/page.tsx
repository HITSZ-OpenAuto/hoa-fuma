import { redirect } from 'next/navigation';
import { getAvailableYears, getLastDocsPath } from '@/lib/docs';
import { docsPathExists } from '@/lib/docs-paths';

function getDocsFallbackPath() {
  return `/docs/${getAvailableYears()[0]}`;
}

export default async function Page() {
  const pathname = await getLastDocsPath();

  if (pathname) {
    const segments = pathname.split('/').filter(Boolean).slice(1);
    if (segments.length >= 1 && docsPathExists(segments)) {
      redirect(pathname);
    }
  }

  redirect(getDocsFallbackPath());
}
