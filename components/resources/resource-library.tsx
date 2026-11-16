import { FileTreeTable } from '@/components/file-tree/table';
import {
  formatTimestamp,
  getResourceSnapshot,
  type ResourceFile,
} from '@/lib/resources';
import type { FileNode } from '@/lib/types';

function extensionOf(name: string): string {
  const index = name.lastIndexOf('.');
  return index === -1 ? '' : name.slice(index + 1).toLowerCase();
}

function buildTree(files: ResourceFile[]): FileNode[] {
  const root: FileNode[] = [];

  for (const file of files) {
    const segments = file.path.split('/').filter(Boolean);
    let level = root;
    let prefix = '';

    segments.forEach((segment, index) => {
      prefix = prefix ? `${prefix}/${segment}` : segment;
      const isFile = index === segments.length - 1;

      if (isFile) {
        level.push({
          id: prefix,
          name: segment,
          type: 'file',
          url: file.url,
          size: file.size,
          date: formatTimestamp(file.time),
          fileType: extensionOf(segment),
          depth: index,
          note: file.external ? '原站' : undefined,
          external: file.external,
        });
        return;
      }

      let folder = level.find(
        (node) => node.type === 'folder' && node.name === segment
      );

      if (!folder) {
        folder = {
          id: prefix,
          name: segment,
          type: 'folder',
          depth: index,
          defaultOpen: index === 0 && segment !== 'docs',
          children: [],
        };
        level.push(folder);
      }

      level = folder.children ?? [];
    });
  }

  return root;
}

export function ResourceLibrary({ source }: { source: string }) {
  const snapshot = getResourceSnapshot(source);

  if (!snapshot) {
    return (
      <p className="text-fd-muted-foreground text-sm">
        资料清单尚未同步，请在仓库根目录运行 <code>make resources</code>{' '}
        后重试。
      </p>
    );
  }

  if (snapshot.files.length === 0) {
    return (
      <p className="text-fd-muted-foreground text-sm">
        资料库暂未收录文件，欢迎到{' '}
        <a
          href={snapshot.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          仓库
        </a>{' '}
        提交。
      </p>
    );
  }

  const nodes = buildTree(snapshot.files);

  return (
    <div className="not-prose my-4 space-y-3">
      <FileTreeTable data={nodes} url={snapshot.netdiskUrl || undefined} />
    </div>
  );
}
