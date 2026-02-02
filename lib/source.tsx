import { docs, blogPosts, newsPosts } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { i18n } from '@/lib/i18n';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  i18n,
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export const blog = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blogPosts, []),
});

export const news = loader({
  baseUrl: '/news',
  source: toFumadocsSource(newsPosts, []),
});

export function getAvailableYears(): string[] {
  return source
    .getPageTree()
    .children.filter(
      (node): node is typeof node & { name: string } =>
        node.type === 'folder' &&
        typeof node.name === 'string' &&
        /^\d{4}$/.test(node.name)
    )
    .map((node) => node.name)
    .sort((a, b) => b.localeCompare(a));
}

type Folder = import('fumadocs-core/page-tree').Folder;

function isRootFolder(node: unknown): node is Folder {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as Folder).type === 'folder' &&
    (node as Folder).root === true
  );
}

function getFolderFirstUrl(folder: Folder): string | undefined {
  if (folder.index?.url) return folder.index.url;
  for (const child of folder.children) {
    if (child.type === 'page' && !child.external) return child.url;
    if (child.type === 'folder') {
      const url = getFolderFirstUrl(child);
      if (url) return url;
    }
  }
  return undefined;
}

export function getFirstCourseUrl(year: string): string {
  const tree = source.getPageTree();
  const yearNode = tree.children.find(
    (node): node is Folder =>
      node.type === 'folder' && String(node.name) === year
  );
  const firstRoot = yearNode ? yearNode.children.find(isRootFolder) : null;
  return firstRoot
    ? (getFolderFirstUrl(firstRoot) ?? `/docs/${year}`)
    : `/docs/${year}`;
}
