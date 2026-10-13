import { NextResponse, type NextRequest } from 'next/server';
import { HOA_LAST_PATH_COOKIE } from '@/lib/constants';
import { findRedirect } from '@/lib/redirect';

export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.slice('/docs/'.length);
  const target = findRedirect(
    segment,
    request.cookies.get(HOA_LAST_PATH_COOKIE)?.value
  );
  if (!target) return NextResponse.next();

  const response = NextResponse.redirect(new URL(target, request.url));
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export const config = {
  matcher: '/docs/:segment',
};
