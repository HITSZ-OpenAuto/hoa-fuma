import { FileTreeTable } from '@/components/file-tree/table';
import {
  formatBytes,
  formatTimestamp,
  getResourceFileUrl,
  getResourceSnapshot,
  type ResourceContact,
  type ResourceFile,
} from '@/lib/resources';
import type { FileNode } from '@/lib/types';

function extensionOf(name: string): string {
  const index = name.lastIndexOf('.');
  return index === -1 ? '' : name.slice(index + 1).toLowerCase();
}

/** 把扁平的文件清单还原成目录树（与课程页 <Files> 的结构一致） */
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
          defaultOpen: index === 0,
          children: [],
        };
        level.push(folder);
      }

      level = folder.children ?? [];
    });
  }

  return root;
}

function ContactCard({
  contact,
  snapshot,
}: {
  contact: ResourceContact;
  snapshot: NonNullable<ReturnType<typeof getResourceSnapshot>>;
}) {
  return (
    <div className="not-prose border-fd-border bg-fd-muted/30 mt-4 rounded-lg border p-4">
      <p className="text-sm font-medium">反馈与交流</p>

      <div className="mt-3 flex flex-wrap items-start gap-6">
        <dl className="space-y-1 text-sm">
          {contact.qq && (
            <div className="flex gap-2">
              <dt className="text-fd-muted-foreground">QQ 群</dt>
              <dd className="font-medium">{contact.qq}</dd>
            </div>
          )}
          {contact.feedback && (
            <div className="flex gap-2">
              <dt className="text-fd-muted-foreground">问卷</dt>
              <dd>
                <a
                  href={contact.feedback}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  用户反馈问卷
                </a>
              </dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-fd-muted-foreground">原站</dt>
            <dd>
              <a
                href={snapshot.origin}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {snapshot.originLabel}
              </a>
            </dd>
          </div>
        </dl>

        {contact.images && contact.images.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {contact.images.map((image) => (
              <figure key={image.path} className="w-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getResourceFileUrl(snapshot, image.path)}
                  alt={image.label}
                  width={128}
                  height={128}
                  loading="lazy"
                  className="bg-fd-background rounded-md border object-cover"
                />
                <figcaption className="text-fd-muted-foreground mt-1 text-center text-xs">
                  {image.label}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
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
  const totalSize = snapshot.files.reduce((sum, file) => sum + file.size, 0);
  const externalCount = snapshot.files.filter((file) => file.external).length;

  return (
    <div className="not-prose my-4 space-y-3">
      <div className="text-fd-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span>
          共 {snapshot.files.length} 个文件
          {totalSize > 0 && ` · 约 ${formatBytes(totalSize)}`}
        </span>
        <span>
          清单更新于 {formatTimestamp(Date.parse(snapshot.generatedAt) / 1000)}
        </span>
        <a
          href={snapshot.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          前往仓库
        </a>
      </div>

      {externalCount > 0 && (
        <p className="text-fd-muted-foreground text-sm">
          标注「原站」的文件体积较大或为讲座录像，未纳入仓库镜像，点击后跳转资料栈原地址下载（需校园网访问）。
        </p>
      )}

      <FileTreeTable data={nodes} url={snapshot.netdiskUrl || undefined} />

      {snapshot.contact && (
        <ContactCard contact={snapshot.contact} snapshot={snapshot} />
      )}
    </div>
  );
}
