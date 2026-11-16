#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'lib/data/resources');

function loadEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    const path = join(ROOT, file);
    if (!existsSync(path)) continue;

    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      const value = trimmed
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
      if (key && value && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

loadEnvFiles();

const ORG = process.env.RESOURCES_ORG || 'HITSZ-OpenAuto';

const LOCAL_DIR = process.env.RESOURCES_LOCAL_DIR || undefined;

const SOURCES = [
  {
    id: 'e-cube',
    repo: 'hoa-e-cube-studio',
    title: '深圳 E立方工作室',
    subtitle: '信息学部「E立方」学风涵养工作室 × HITSZ 开源技术协会',
    fallback: {
      summary:
        'E立方学风涵养工作室资料栈，围绕创新创业、学业辅导、生涯规划三大板块，沉淀工作室历年活动的方案、讲义、录播与经验分享。',
      origin: 'http://10.249.44.116:5244',
      originLabel: '资料栈（校内网）',
      access:
        '资料栈部署在校内网，需校园网或学校 VPN 访问；账号凭据通过内部渠道分发，本站不公开。',
      license: '工作室内部资料，转载请注明来源并保留原作者署名。',
      notice:
        '资料栈由「E立方」学风涵养工作室与 HITSZ 开源技术协会共同筹备维护，反馈与建议可通过工作室问卷提交。',
    },
  },
  {
    id: 'wentian',
    repo: 'hoa-wentian-lecturer-group',
    title: '哈尔滨 问天讲师团',
    subtitle: '哈尔滨工业大学未来技术学院 · 学业支持资料库',
    fallback: {
      summary:
        '问天讲师团整理的课程复习资料，收录离散数学、理论力学B、机械工程制图、C 语言等科目的讲座讲义、题型总结与录播视频。',
      origin: `https://gitee.com/${process.env.WENTIAN_REPO ?? 'jacobbbbb/lecturer-group'}`,
      originLabel: 'Gitee 仓库',
      access: '资料已镜像到站内，可直接下载；原始仓库公开可访问。',
      license: '木兰宽松许可证 第 2 版（Mulan PSL v2）',
      notice:
        '资料由问天讲师团成员原创整理，转载或二次整理时请注明来源：问天讲师团（哈尔滨工业大学未来技术学院）。',
    },
  },
];

const IGNORED =
  /^(readme\.md|license|resources\.json|\.gitignore|\.gitattributes|\.sync-state\.json)$/i;
const IGNORED_DIR = /^(?:\.github|\.git|scripts|history)\//;

async function fetchWithTimeout(url, init = {}, timeout = 30_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'User-Agent': 'hoa-resource-sync (+https://hoa.moe)',
        Accept: 'application/vnd.github+json',
        ...init.headers,
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

function rawUrl(org, repo, ref, path) {
  const encoded = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://raw.githubusercontent.com/${org}/${repo}/${ref}/${encoded}`;
}

function downloadUrl(org, repo, path) {
  const encoded = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://gh.hoa.moe/github.com/${org}/${repo}/raw/main/${encoded}`;
}

async function fetchWorktree(org, repo) {
  const res = await fetchWithTimeout(
    rawUrl(org, repo, 'worktree', 'worktree.json')
  );
  if (!res.ok) {
    throw new Error(`worktree.json 获取失败（${res.status}）`);
  }
  return res.json();
}

async function fetchResourcesMeta(org, repo) {
  if (LOCAL_DIR) {
    const local = join(LOCAL_DIR, repo, 'resources.json');
    if (existsSync(local)) {
      return JSON.parse(readFileSync(local, 'utf8'));
    }
    return {};
  }

  try {
    const res = await fetchWithTimeout(
      rawUrl(org, repo, 'main', 'resources.json')
    );
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

async function fetchTreeFallback(org, repo) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetchWithTimeout(
    `https://api.github.com/repos/${org}/${repo}/git/trees/main?recursive=1`,
    { headers }
  );
  if (!res.ok) throw new Error(`仓库树获取失败（${res.status}）`);

  const data = await res.json();
  const entries = {};

  for (const node of data.tree ?? []) {
    if (node.type !== 'blob') continue;
    entries[node.path] = { size: node.size ?? 0, time: 0, hash: node.sha };
  }

  return entries;
}

function listLocalFiles(repo) {
  const dir = join(LOCAL_DIR, repo);
  if (!existsSync(dir)) {
    throw new Error(`本地目录不存在：${dir}`);
  }

  const output = execFileSync(
    'git',
    ['-C', dir, 'ls-tree', '-r', '-l', '-z', 'HEAD'],
    {
      encoding: 'utf8',
    }
  );
  const date = Number(
    execFileSync('git', ['-C', dir, 'log', '-1', '--format=%ct'], {
      encoding: 'utf8',
    }).trim()
  );

  const entries = {};
  for (const line of output.split('\0')) {
    const match = line.match(/^\d+ \w+ ([0-9a-f]+)\s+(\d+|-)\t(.+)$/);
    if (!match) continue;

    const [, , size, path] = match;
    entries[path] = { size: size === '-' ? 0 : Number(size), time: date };
  }

  return entries;
}

async function syncSource(source) {
  const org = ORG;
  const { id, repo } = source;

  let worktree;
  let fromFallback = false;

  if (LOCAL_DIR) {
    worktree = listLocalFiles(repo);
  } else {
    try {
      worktree = await fetchWorktree(org, repo);
    } catch (error) {
      console.warn(
        `  ! ${org}/${repo} worktree 不可用（${error.message}），改用仓库树`
      );
      worktree = await fetchTreeFallback(org, repo);
      fromFallback = true;
    }
  }

  const meta = await fetchResourcesMeta(org, repo);

  const files = [];

  for (const [path, info] of Object.entries(worktree)) {
    if (IGNORED.test(path) || IGNORED_DIR.test(path)) continue;

    files.push({
      path,
      name: path.split('/').pop(),
      size: info.size ?? 0,
      time: info.time ?? 0,
      url: downloadUrl(org, repo, path),
      external: false,
    });
  }

  for (const item of meta.external ?? []) {
    if (!item?.path || !item?.url) continue;

    files.push({
      path: item.path,
      name: item.name ?? item.path.split('/').pop(),
      size: item.size ?? 0,
      time: item.time ?? 0,
      url: item.url,
      external: true,
      note: item.note ?? '',
    });
  }

  files.sort((a, b) => a.path.localeCompare(b.path, 'zh-Hans-CN'));

  const snapshot = {
    id,
    org,
    repo,
    title: meta.title ?? source.title,
    subtitle: meta.subtitle ?? source.subtitle,
    summary: meta.summary ?? source.fallback.summary,
    origin: meta.origin ?? source.fallback.origin,
    originLabel: meta.originLabel ?? source.fallback.originLabel,
    access: meta.access ?? source.fallback.access,
    license: meta.license ?? source.fallback.license,
    licenseUrl: meta.licenseUrl ?? '',
    notice: meta.notice ?? source.fallback.notice,
    contact: meta.contact ?? null,
    repoUrl: `https://github.com/${org}/${repo}`,
    netdiskUrl: meta.netdisk
      ? (meta.netdiskUrl ?? `https://open.osa.moe/openauto/${repo}`)
      : '',
    generatedAt: new Date().toISOString(),
    fromFallback,
    files,
  };

  const target = join(OUT_DIR, `${id}.json`);
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

  const mirrored = files.filter((file) => !file.external).length;
  console.log(
    `→ ${target.replace(`${ROOT}/`, '')}（${files.length} 个文件，其中 ${mirrored} 个站内直链，${files.length - mirrored} 个跳原站）`
  );
}

async function main() {
  const only = process.argv.includes('--source')
    ? process.argv[process.argv.indexOf('--source') + 1]
    : null;

  for (const source of SOURCES) {
    if (only && only !== source.id) continue;

    console.log(`\n[${source.title}] ${ORG}/${source.repo}`);
    try {
      await syncSource(source);
    } catch (error) {
      console.error(`  ! 同步失败：${error.message}`);
      process.exitCode = 1;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
