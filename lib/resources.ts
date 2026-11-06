import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type ResourceFile = {
  /** 资料在仓库（或原站）内的相对路径 */
  path: string;
  name: string;
  size: number;
  /** Unix 时间戳（秒） */
  time: number;
  /** 站内直链，或未入库文件的原地址 */
  url: string;
  /** true 表示该文件不在仓库内，点击跳原地址 */
  external: boolean;
  note?: string;
};

export type ResourceContact = {
  /** QQ 群号 */
  qq?: string;
  /** 反馈问卷地址 */
  feedback?: string;
  /** 站内展示的二维码图片（仓库内相对路径） */
  images?: { label: string; path: string }[];
};

export type ResourceSnapshot = {
  id: string;
  org: string;
  repo: string;
  title: string;
  subtitle: string;
  summary: string;
  origin: string;
  originLabel: string;
  access: string;
  license: string;
  licenseUrl?: string;
  notice?: string;
  contact?: ResourceContact | null;
  repoUrl: string;
  /** 网盘计划入口 */
  netdiskUrl: string;
  generatedAt: string;
  /** 清单是否来自仓库树兜底（worktree 分支不可用时） */
  fromFallback?: boolean;
  files: ResourceFile[];
};

const resourcesDir = join(process.cwd(), 'lib/data/resources');

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

export function formatTimestamp(time: number): string {
  if (!time) return '';

  const date = new Date(time * 1000);
  if (Number.isNaN(date.getTime())) return '';

  // 资料来源均在境内，统一按北京时间展示
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replace(/\//g, '-');
}

/** 资料仓内文件的站内直链（与课程页一致，走 gh.hoa.moe 网关） */
export function getResourceFileUrl(
  snapshot: ResourceSnapshot,
  path: string
): string {
  const encoded = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `https://gh.hoa.moe/github.com/${snapshot.org}/${snapshot.repo}/raw/main/${encoded}`;
}
