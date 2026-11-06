import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type ResourceFile = {
  /** 资料在来源站内的相对路径 */
  path: string;
  name: string;
  /** 顶层目录，用于分组展示 */
  group: string;
  size: number;
  modified: string;
  extension: string;
  /** 是否已在站内镜像 */
  mirrored: boolean;
  /** 站内直链（镜像文件）或原站链接 */
  downloadUrl: string;
  /** 原站页面地址 */
  externalUrl: string;
};

export type ResourceSnapshot = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  origin: string;
  originLabel: string;
  access: string;
  license: string;
  licenseUrl?: string;
  notice?: string;
  generatedAt: string;
  notes?: string[];
  files: ResourceFile[];
};

const resourcesDir = join(process.cwd(), 'lib/resources');

const cache = new Map<string, ResourceSnapshot | undefined>();

export function getResourceSnapshot(id: string): ResourceSnapshot | undefined {
  if (cache.has(id)) return cache.get(id);

  let snapshot: ResourceSnapshot | undefined;
  try {
    snapshot = JSON.parse(
      readFileSync(join(resourcesDir, `${id}.json`), 'utf8')
    ) as ResourceSnapshot;
  } catch {
    snapshot = undefined;
  }

  cache.set(id, snapshot);
  return snapshot;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}

export function formatDate(value: string): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  // 资料来源均在境内，统一按北京时间展示，避免跨时区错一天
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replace(/\//g, '-');
}
