import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug?: string[] }> }
) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return new Response(await page.data.getText('processed'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
