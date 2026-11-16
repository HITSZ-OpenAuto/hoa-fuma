import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type ResourceFile = {
  path: string;
  name: string;
  size: number;
  time: number;
  url: string;
  external: boolean;
  note?: string;
};

type ResourceContact = {
  qq?: string;
  feedback?: string;
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
  netdiskUrl: string;
  generatedAt: string;
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

export function formatTimestamp(time: number): string {
  if (!time) return '';

  const date = new Date(time * 1000);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replace(/\//g, '-');
}

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
