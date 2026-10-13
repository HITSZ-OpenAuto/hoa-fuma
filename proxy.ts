import { NextRequest, NextResponse } from 'next/server';
import { isYear } from '@/lib/utils';

export function proxy(request: NextRequest) {
  const [, , first] = request.nextUrl.pathname.split('/');
  if (!first || isYear(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = request.nextUrl.pathname.replace(/^\/docs/, '/docs/legacy');
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: '/docs/:path+',
};
