import {
  DocsContentPage,
  getDocsMetadata,
} from '@/components/docs/docs-content-page';

type Props = {
  params: Promise<{ year: string; major: string; slug?: string[] }>;
};

async function getContentParams(params: Props['params']) {
  const { year, major, slug = [] } = await params;
  return { year, slug: [major, ...slug] };
}

export default function Page({ params }: Props) {
  return <DocsContentPage params={getContentParams(params)} />;
}

export function generateMetadata({ params }: Props) {
  return getDocsMetadata({ params: getContentParams(params) });
}

export function generateStaticParams() {
  return [];
}
