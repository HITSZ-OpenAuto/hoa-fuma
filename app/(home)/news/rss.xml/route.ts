import { getRSS } from '@/lib/rss';

export const revalidate = false;

export async function GET() {
  return new Response(await getRSS('news'), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
