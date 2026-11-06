import { Download, ExternalLink } from 'lucide-react';
import {
  formatBytes,
  formatDate,
  getResourceSnapshot,
  type ResourceFile,
} from '@/lib/resources';

function groupFiles(files: ResourceFile[]) {
  const groups = new Map<string, ResourceFile[]>();

  for (const file of files) {
    const key = file.group || '';
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(file);
    } else {
      groups.set(key, [file]);
    }
  }

  return [...groups.entries()];
}

export function ResourceLibrary({ source }: { source: string }) {
  const snapshot = getResourceSnapshot(source);

  if (!snapshot) {
    return (
      <p className="text-fd-muted-foreground text-sm">
        资料清单暂不可用，请直接前往来源站查看。
      </p>
    );
  }

  const groups = groupFiles(snapshot.files);
  const mirrored = snapshot.files.filter((file) => file.mirrored).length;

  return (
    <div className="not-prose my-4 space-y-6">
      <div className="text-fd-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span>共 {snapshot.files.length} 个文件</span>
        {mirrored > 0 && <span>{mirrored} 个已站内镜像，可直接下载</span>}
        <span>清单更新于 {formatDate(snapshot.generatedAt)}</span>
      </div>

      {snapshot.notes && snapshot.notes.length > 0 && (
        <div className="border-fd-border bg-fd-muted/40 rounded-lg border px-4 py-3 text-sm">
          {snapshot.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}

      {groups.map(([group, files]) => (
        <div key={group || 'root'}>
          {group && (
            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
              <span>{group}</span>
              <span className="text-fd-muted-foreground text-xs">
                {files.length} 项
              </span>
            </h4>
          )}

          <div className="fd-scroll-container overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-fd-muted/40 text-fd-muted-foreground">
                <tr className="[&>th]:h-9 [&>th]:px-3 [&>th]:text-left [&>th]:font-medium [&>th]:whitespace-nowrap">
                  <th>资料</th>
                  <th>格式</th>
                  <th>大小</th>
                  <th>更新</th>
                  <th className="text-right">获取</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr
                    key={file.path}
                    className="border-fd-border hover:bg-fd-muted/40 border-b transition-colors last:border-0"
                  >
                    <td className="px-3 py-2 break-all">
                      <span title={file.path}>{file.name}</span>
                    </td>
                    <td className="text-fd-muted-foreground px-3 py-2 uppercase">
                      {file.extension || '—'}
                    </td>
                    <td className="text-fd-muted-foreground px-3 py-2 whitespace-nowrap">
                      {formatBytes(file.size)}
                    </td>
                    <td className="text-fd-muted-foreground px-3 py-2 whitespace-nowrap">
                      {formatDate(file.modified)}
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {file.mirrored ? (
                        <a
                          href={file.downloadUrl}
                          download
                          className="border-fd-border hover:bg-fd-accent hover:text-fd-accent-foreground inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                        >
                          <Download className="size-3.5" />
                          站内下载
                        </a>
                      ) : (
                        <a
                          href={file.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-fd-muted-foreground hover:text-fd-foreground inline-flex items-center gap-1 text-xs"
                        >
                          <ExternalLink className="size-3.5" />
                          原站获取
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
