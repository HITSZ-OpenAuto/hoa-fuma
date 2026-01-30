import { links } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { notFound } from 'next/navigation';

export default async function LinksPage() {
  const page = links.getPage([]);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold">{page.data.title}</h1>
      <MDX components={getMDXComponents()} />
    </div>
  );
}

export function generateMetadata() {
  const page = links.getPage([]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
