import type { Folder } from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';

export function isRootFolder(node: unknown): node is Folder {
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
