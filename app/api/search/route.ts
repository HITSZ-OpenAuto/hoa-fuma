import { searchDocs } from '@/lib/search-index';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');
  const locale = url.searchParams.get('locale');
  const limit = url.searchParams.has('limit')
    ? Number(url.searchParams.get('limit'))
    : undefined;

  if (!query || (locale && locale !== 'cn')) {
    return Response.json([]);
  }
  const resultLimit =
    typeof limit === 'number' && Number.isInteger(limit) && limit > 0
      ? limit
      : 60;

  return Response.json(searchDocs(query, resultLimit), {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
