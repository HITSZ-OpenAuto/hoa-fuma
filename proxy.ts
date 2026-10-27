import { NextResponse, type NextRequest } from 'next/server';
import { HOA_LAST_PATH_COOKIE } from '@/lib/constants';
import { docsPathExists } from '@/lib/docs-paths';
import { findRedirect } from '@/lib/redirect';

const DOCS_NOT_FOUND_PATH = '/_docs-not-found';

function decodeSegments(path: string): string[] | null {
  try {
    return path.split('/').filter(Boolean).map(decodeURIComponent);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.endsWith('.md')) return NextResponse.next();

  const segments = decodeSegments(pathname.slice('/docs/'.length));

  if (segments?.length === 1) {
    const target = findRedirect(
      segments[0],
      request.cookies.get(HOA_LAST_PATH_COOKIE)?.value
    );
    if (target) {
      const response = NextResponse.redirect(new URL(target, request.url));
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    }
  }

  if (segments && docsPathExists(segments)) return NextResponse.next();

  return NextResponse.rewrite(new URL(DOCS_NOT_FOUND_PATH, request.url));
}

export const config = {
  matcher: '/docs/:path+',
};
