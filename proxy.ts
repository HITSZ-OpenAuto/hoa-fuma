import { NextResponse, type NextRequest } from 'next/server';
import { HOA_LAST_PATH_COOKIE } from '@/lib/constants';
import { findRedirect } from '@/lib/redirect';
import { isYear } from '@/lib/utils';

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean).slice(1);
  if (isYear(segments[0])) return NextResponse.next();

  const target = findRedirect(
    segments,
    request.cookies.get(HOA_LAST_PATH_COOKIE)?.value
  );
  if (!target) return NextResponse.next();

  const response = NextResponse.redirect(new URL(target, request.url));
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export const config = {
  matcher: '/docs/:path+',
};
