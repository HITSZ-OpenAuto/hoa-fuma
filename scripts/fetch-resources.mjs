#!/usr/bin/env node
/**
 * 同步站外资料源 → 站内快照 + 轻量文件镜像
 *
 * 产出：
 *   lib/resources/<id>.json        资源清单快照（随仓库提交，站点直接读取）
 *   public/resources/<id>/<path>   轻量文件镜像（站内可直接下载）
 *
 * 设计原则：
 *   - 仓库/服务器存储有限：只有小于阈值的文件才落到站内，重文件只留原站链接；
 *   - 凭据只从环境变量读取（见 .env.example），绝不写入仓库或快照；
 *   - 某个源失败不影响另一个源，也不会抹掉已有快照。
 *
 * 用法：
 *   node scripts/fetch-resources.mjs                 # 同步全部
 *   node scripts/fetch-resources.mjs --source wentian
 *   node scripts/fetch-resources.mjs --dry-run       # 只抓清单，不写文件
 *
 * 环境变量：
 *   ALIST_BASE_URL           E立方资料栈地址（如 http://10.249.44.116:5244）
 *   ALIST_USERNAME           E立方资料栈账号
 *   ALIST_PASSWORD           E立方资料栈密码
 *   RESOURCE_MIRROR_MAX_BYTES   单文件镜像上限，默认 5 MiB
 *   RESOURCE_MIRROR_TOTAL_BYTES  单个来源镜像总量上限，默认 64 MiB
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';

const ROOT = process.cwd();
const SNAPSHOT_DIR = join(ROOT, 'lib', 'resources');
const MIRROR_DIR = join(ROOT, 'public', 'resources');

/** 读取 .env.local / .env，让 `make resources` 免去手动 export */
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
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

loadEnvFiles();

const MAX_FILE = Number(
  process.env.RESOURCE_MIRROR_MAX_BYTES ?? 5 * 1024 * 1024
);
const MAX_TOTAL = Number(
  process.env.RESOURCE_MIRROR_TOTAL_BYTES ?? 64 * 1024 * 1024
);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const only = args.includes('--source')
  ? args[args.indexOf('--source') + 1]
  : null;

const SKIP_FILES = /^(LICENSE|README\.md|\.gitignore|\.gitattributes)$/i;

function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}

function extensionOf(name) {
  const ext = extname(name);
  return ext ? ext.slice(1).toLowerCase() : '';
}

function groupOf(path) {
  const idx = path.indexOf('/');
  return idx === -1 ? '' : path.slice(0, idx);
}

/** 取所有路径的公共目录前缀，用于去掉存储根目录（如 /home/cxy/alist-srv） */
function commonDirPrefix(paths) {
  if (paths.length === 0) return '';

  const dirs = paths.map((path) => path.split('/').slice(0, -1));
  let prefix = dirs[0];

  for (const segments of dirs.slice(1)) {
    let i = 0;
    while (
      i < prefix.length &&
      i < segments.length &&
      prefix[i] === segments[i]
    ) {
      i += 1;
    }
    prefix = prefix.slice(0, i);
  }

  return prefix.join('/');
}

function normalizeApiPath(path) {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

async function fetchWithTimeout(url, init = {}, timeout = 30_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'User-Agent': 'hoa-resource-sync (+https://hoa.moe)',
        ...init.headers,
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function writeMirror(id, path, bytes) {
  const target = join(MIRROR_DIR, id, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
}

/* ────────────────────────── Gitee：问天讲师团 ────────────────────────── */

const GITEE_REPO = 'jacobbbbb/lecturer-group';
const GITEE_REF = 'master';
const GITEE_API = 'https://gitee.com/api/v5';

async function giteeJson(url) {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Gitee API ${res.status}: ${url}`);
  return res.json();
}

function giteeRawUrl(path) {
  const encoded = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://gitee.com/${GITEE_REPO}/raw/${GITEE_REF}/${encoded}`;
}

function giteeBlobUrl(path) {
  const encoded = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://gitee.com/${GITEE_REPO}/blob/${GITEE_REF}/${encoded}`;
}

async function giteeLastCommit(path) {
  try {
    const commits = await giteeJson(
      `${GITEE_API}/repos/${GITEE_REPO}/commits?path=${encodeURIComponent(path)}&per_page=1`
    );
    const commit = commits?.[0];
    return {
      modified: commit?.commit?.committer?.date ?? '',
      sha: commit?.sha ?? '',
    };
  } catch {
    return { modified: '', sha: '' };
  }
}

async function syncGitee() {
  const tree = await giteeJson(
    `${GITEE_API}/repos/${GITEE_REPO}/git/trees/${GITEE_REF}?recursive=1`
  );

  const blobs = (tree.tree ?? []).filter(
    (node) => node.type === 'blob' && !SKIP_FILES.test(node.path)
  );

  const files = [];
  let mirroredBytes = 0;

  for (const blob of blobs) {
    const size = blob.size ?? 0;
    const { modified } = await giteeLastCommit(blob.path);
    const entry = {
      path: blob.path,
      name: blob.path.split('/').pop() ?? blob.path,
      group: groupOf(blob.path),
      size,
      modified,
      extension: extensionOf(blob.path),
      mirrored: false,
      downloadUrl: giteeBlobUrl(blob.path),
      externalUrl: giteeBlobUrl(blob.path),
    };

    const canMirror =
      size > 0 && size <= MAX_FILE && mirroredBytes + size <= MAX_TOTAL;

    if (canMirror && !dryRun) {
      try {
        const res = await fetchWithTimeout(giteeRawUrl(blob.path), {}, 60_000);
        if (res.ok) {
          const bytes = Buffer.from(await res.arrayBuffer());
          await writeMirror('wentian', blob.path, bytes);
          entry.mirrored = true;
          entry.downloadUrl = `/resources/wentian/${blob.path
            .split('/')
            .map((segment) => encodeURIComponent(segment))
            .join('/')}`;
          mirroredBytes += bytes.byteLength;
          console.log(
            `  ✓ 镜像 ${blob.path} (${formatSize(bytes.byteLength)})`
          );
        } else {
          console.warn(`  ! 镜像跳过 ${blob.path}：原站返回 ${res.status}`);
        }
      } catch (error) {
        console.warn(`  ! 镜像跳过 ${blob.path}：${error.message}`);
      }
    } else if (size > MAX_FILE) {
      console.log(`  · 大文件不镜像 ${blob.path} (${formatSize(size)})`);
    }

    files.push(entry);
  }

  return {
    id: 'wentian',
    title: '哈尔滨 问天讲师团',
    subtitle: '哈尔滨工业大学未来技术学院 · 学业支持资料库',
    summary:
      '问天讲师团整理的课程复习资料，收录离散数学、理论力学B、机械工程制图、C 语言等科目的讲座讲义、题型总结与录播视频。',
    origin: `https://gitee.com/${GITEE_REPO}`,
    originLabel: 'Gitee 仓库',
    access: '公开仓库，站内与外网均可访问；大文件跳转原站下载。',
    license: '木兰宽松许可证 第 2 版（Mulan PSL v2）',
    licenseUrl: giteeBlobUrl('LICENSE'),
    notice:
      '资料由问天讲师团成员原创整理，转载或二次整理时请注明来源：问天讲师团（哈尔滨工业大学未来技术学院）。',
    generatedAt: new Date().toISOString(),
    files: files.sort((a, b) => a.path.localeCompare(b.path, 'zh-Hans-CN')),
  };
}

/* ─────────────────────── Alist：深圳 E立方工作室 ─────────────────────── */

async function alistPost(base, token, path, body) {
  const res = await fetchWithTimeout(
    `${base}${path}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    },
    20_000
  );
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Alist 返回非 JSON（${res.status}）：${text.slice(0, 120)}`
    );
  }
}

async function alistList(base, token, path) {
  const data = await alistPost(base, token, '/api/fs/list', {
    path,
    password: '',
    page: 1,
    per_page: 0,
    refresh: false,
  });
  if (data.code !== 200) {
    throw new Error(data.message ?? 'Alist 列目录失败');
  }
  return data.data?.content ?? [];
}

async function syncAlist() {
  const base = process.env.ALIST_BASE_URL;
  const username = process.env.ALIST_USERNAME;
  const password = process.env.ALIST_PASSWORD;

  if (!base || !username || !password) {
    console.warn(
      '跳过 E立方：未配置 ALIST_BASE_URL / ALIST_USERNAME / ALIST_PASSWORD（该资料栈在校内网，需在校园网环境同步）'
    );
    return null;
  }

  const login = await alistPost(base, '', '/api/auth/login', {
    username,
    password,
  });
  if (login.code !== 200 || !login.data?.token) {
    throw new Error(`Alist 登录失败：${login.message ?? '未知错误'}`);
  }
  const token = login.data.token;

  const files = [];
  const notes = [];
  let mirroredBytes = 0;
  const collected = [];

  async function walk(path) {
    let items;
    try {
      items = await alistList(base, token, path);
    } catch (error) {
      notes.push(
        `「${path.split('/').pop() || '根目录'}」暂时无法读取（资料栈目录索引异常），完整内容请前往资料栈查看。`
      );
      console.warn(`  ! ${path || '/'} 读取失败：${error.message}`);
      return;
    }

    for (const item of items) {
      if (item.is_dir) {
        await walk(item.path);
        continue;
      }
      collected.push(item);
    }
  }

  await walk('');

  // 去掉存储根目录前缀（如 /home/cxy/alist-srv），只保留站内可见的相对路径
  const prefix = commonDirPrefix(
    collected.map((item) => normalizeApiPath(item.path))
  );

  for (const item of collected) {
    const relPath = normalizeApiPath(item.path)
      .slice(prefix.length)
      .replace(/^\//, '');
    const size = item.size ?? 0;
    const entry = {
      path: relPath,
      name: item.name,
      group: groupOf(relPath),
      size,
      modified: item.modified ?? '',
      extension: extensionOf(item.name),
      mirrored: false,
      downloadUrl: `${base}${item.path}`,
      externalUrl: `${base}${item.path}`,
    };

    const canMirror =
      size > 0 && size <= MAX_FILE && mirroredBytes + size <= MAX_TOTAL;

    if (canMirror && !dryRun && item.sign) {
      const raw = `${base}/d/${encodeURIComponent(item.name)}?sign=${encodeURIComponent(item.sign)}`;
      try {
        const res = await fetchWithTimeout(raw, {}, 60_000);
        if (res.ok) {
          const bytes = Buffer.from(await res.arrayBuffer());
          await writeMirror('e-cube', relPath, bytes);
          entry.mirrored = true;
          entry.downloadUrl = `/resources/e-cube/${relPath
            .split('/')
            .map((segment) => encodeURIComponent(segment))
            .join('/')}`;
          mirroredBytes += bytes.byteLength;
          console.log(`  ✓ 镜像 ${relPath} (${formatSize(bytes.byteLength)})`);
        } else {
          console.warn(`  ! 镜像跳过 ${relPath}：原站返回 ${res.status}`);
        }
      } catch (error) {
        console.warn(`  ! 镜像跳过 ${relPath}：${error.message}`);
      }
    }

    files.push(entry);
  }

  return {
    id: 'e-cube',
    title: '深圳 E立方工作室',
    subtitle: '信息学部「E立方」学风涵养工作室 × HITSZ 开源技术协会',
    summary:
      'E立方学风涵养工作室资料栈，围绕创新创业、学业辅导、生涯规划三大板块，沉淀工作室历年活动的方案、讲义、录播与经验分享。',
    origin: base,
    originLabel: '资料栈（校内网）',
    access:
      '资料栈部署在校内网，需校园网或学校 VPN 访问；账号凭据通过内部渠道分发，本站不公开。',
    license: '工作室内部资料，转载请注明来源并保留原作者署名。',
    licenseUrl: '',
    notice:
      '资料栈由「E立方」学风涵养工作室与 HITSZ 开源技术协会共同筹备维护，反馈与建议可通过工作室问卷提交。',
    generatedAt: new Date().toISOString(),
    notes,
    files: files.sort((a, b) => a.path.localeCompare(b.path, 'zh-Hans-CN')),
  };
}

/* ────────────────────────────── 主流程 ────────────────────────────── */

const SOURCES = {
  wentian: {
    label: '哈尔滨 问天讲师团',
    run: syncGitee,
    fallback: {
      id: 'wentian',
      title: '哈尔滨 问天讲师团',
      subtitle: '哈尔滨工业大学未来技术学院 · 学业支持资料库',
      summary: '问天讲师团整理的课程复习资料与讲座录播。',
      origin: `https://gitee.com/${GITEE_REPO}`,
      originLabel: 'Gitee 仓库',
      access: '公开仓库，站内与外网均可访问。',
      license: '木兰宽松许可证 第 2 版（Mulan PSL v2）',
      licenseUrl: giteeBlobUrl('LICENSE'),
      notice:
        '转载或二次整理时请注明来源：问天讲师团（哈尔滨工业大学未来技术学院）。',
    },
  },
  'e-cube': {
    label: '深圳 E立方工作室',
    run: syncAlist,
    fallback: {
      id: 'e-cube',
      title: '深圳 E立方工作室',
      subtitle: '信息学部「E立方」学风涵养工作室 × HITSZ 开源技术协会',
      summary:
        'E立方学风涵养工作室资料栈：创新创业、学业辅导、生涯规划三大板块。',
      origin: process.env.ALIST_BASE_URL ?? '',
      originLabel: '资料栈（校内网）',
      access:
        '资料栈部署在校内网，需校园网或学校 VPN 访问；账号凭据通过内部渠道分发，本站不公开。',
      license: '工作室内部资料，转载请注明来源并保留原作者署名。',
      licenseUrl: '',
      notice: '资料栈由「E立方」学风涵养工作室与 HITSZ 开源技术协会共同维护。',
    },
  },
};

async function persist(id, snapshot) {
  const target = join(SNAPSHOT_DIR, `${id}.json`);
  await mkdir(SNAPSHOT_DIR, { recursive: true });
  await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(
    `→ ${target.replace(`${ROOT}/`, '')}（${snapshot.files.length} 个文件，更新于 ${snapshot.generatedAt}）`
  );
}

async function main() {
  const ids = only ? [only] : Object.keys(SOURCES);
  const unknown = ids.filter((id) => !SOURCES[id]);
  if (unknown.length > 0) {
    console.error(`未知来源：${unknown.join(', ')}`);
    process.exit(1);
  }

  for (const id of ids) {
    const source = SOURCES[id];
    console.log(`\n[${source.label}]`);

    let snapshot = null;
    try {
      snapshot = await source.run();
    } catch (error) {
      console.error(`  ! 同步失败：${error.message}`);
    }

    if (!snapshot) {
      // 保留旧快照，只在没有历史数据时写入兜底元信息
      const target = join(SNAPSHOT_DIR, `${id}.json`);
      if (!existsSync(target)) {
        await persist(id, {
          ...source.fallback,
          generatedAt: new Date().toISOString(),
          files: [],
          notes: ['首次同步未成功，已写入占位元信息。'],
        });
      } else {
        console.log('  · 沿用已有快照（本次未更新）');
      }
      continue;
    }

    if (!dryRun) {
      await persist(id, snapshot);
    } else {
      console.log(`  · dry-run：${snapshot.files.length} 个文件，未写入`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
