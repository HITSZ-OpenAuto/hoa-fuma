import { source } from '@/lib/source';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const HOA_LAST_PATH_COOKIE = 'hoa-last-path';
const SPECIAL_CATEGORIES = ['cross-specialty', 'general-knowledge'];

export default async function Page() {
  const lastPath = (await cookies()).get(HOA_LAST_PATH_COOKIE)?.value;
  const pathname = lastPath ? decodeURIComponent(lastPath) : '';

  if (pathname.startsWith('/docs/')) {
    const segments = pathname.split('/').filter(Boolean).slice(1);

    // Check if it's a valid special category path
    if (segments.length >= 1 && SPECIAL_CATEGORIES.includes(segments[0])) {
      if (source.getPage(segments)) {
        redirect(pathname);
      }
      // If specific page not found, redirect to category root
      redirect(`/docs/${segments[0]}`);
    }

    // Check if it's a valid year-based path
    if (segments.length >= 1 && /^\d{4}$/.test(segments[0])) {
      if (source.getPage(segments)) {
        redirect(pathname);
      }
    }
  }

  redirect('/docs/2025');
}
