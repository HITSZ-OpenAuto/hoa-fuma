import {
  DocsContentPage,
  getDocsMetadata,
} from '@/components/docs/docs-content-page';
import { DocsShell } from '@/components/docs/docs-shell';

type Props = { params: Promise<{ year: string }> };

export default async function Page({ params }: Props) {
  const { year } = await params;
  return (
    <DocsShell year={year}>
      <DocsContentPage params={params} />
    </DocsShell>
  );
}

export const generateMetadata = getDocsMetadata;
export function generateStaticParams() {
  return [];
}
