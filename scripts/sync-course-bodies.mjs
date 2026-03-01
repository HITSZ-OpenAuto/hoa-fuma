import fs from 'node:fs/promises';
import path from 'node:path';

const cwd = process.cwd();
const docsRoot = path.join(cwd, 'content', 'docs');
const docsRuntimeRoot = path.join(cwd, 'content', 'docs-runtime');
const courseBodiesRoot = path.join(cwd, 'content', 'course-bodies');

function isCourseCode(fileName) {
  const code = fileName.replace(/\.mdx$/i, '');
  return /^[A-Z0-9]+$/.test(code) && /\d/.test(code) && code !== 'index';
}

function normalize(p) {
  return p.split(path.sep).join('/');
}

async function safeStat(target) {
  try {
    return await fs.stat(target);
  } catch {
    return null;
  }
}

function extractFrontmatter(source) {
  if (!source.startsWith('---\n')) return null;
  const end = source.indexOf('\n---\n', 4);
  if (end < 0) return null;
  return source.slice(0, end + 5);
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const absPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(absPath)));
    } else if (entry.isFile()) {
      out.push(absPath);
    }
  }

  return out;
}

async function ensureCleanDir(dir) {
  await fs.mkdir(dir, { recursive: true });

  const entries = await fs.readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map((entry) =>
      fs.rm(path.join(dir, entry.name), {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 50,
      })
    )
  );
}

async function main() {
  const docsStat = await safeStat(docsRoot);
  await fs.mkdir(path.join(cwd, 'content'), { recursive: true });
  await ensureCleanDir(docsRuntimeRoot);
  await ensureCleanDir(courseBodiesRoot);

  if (!docsStat?.isDirectory()) {
    await fs.writeFile(
      path.join(courseBodiesRoot, '_manifest.json'),
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          courseCount: 0,
          note: 'content/docs not found',
        },
        null,
        2
      ) + '\n'
    );
    console.log('[sync-course-bodies] skipped (content/docs not found)');
    return;
  }

  const files = await walk(docsRoot);
  const selected = new Map();

  for (const absPath of files) {
    const relPath = normalize(path.relative(docsRoot, absPath));
    const runtimeTarget = path.join(docsRuntimeRoot, relPath);
    await fs.mkdir(path.dirname(runtimeTarget), { recursive: true });

    const source = await fs.readFile(absPath, 'utf8');

    const isMdx = relPath.endsWith('.mdx');
    const fileName = path.basename(relPath);
    const parts = relPath.split('/');
    const year = Number(parts[0]);
    const isCourseFile =
      isMdx &&
      parts.length >= 4 &&
      !relPath.endsWith('/index.mdx') &&
      isCourseCode(fileName) &&
      Number.isFinite(year);

    if (isCourseFile) {
      const code = fileName.replace(/\.mdx$/i, '');
      const prev = selected.get(code);

      if (
        !prev ||
        year > prev.year ||
        (year === prev.year && relPath.localeCompare(prev.relPath) > 0)
      ) {
        selected.set(code, { absPath, relPath, year, source });
      }

      const frontmatter = extractFrontmatter(source);
      const runtimeSource =
        (frontmatter ?? '---\ntitle: 未命名课程\n---\n') +
        '\n{/** canonical body rendered from content/course-bodies */}\n';
      await fs.writeFile(runtimeTarget, runtimeSource);
    } else {
      await fs.writeFile(runtimeTarget, source);
    }
  }

  const manifestMap = {};
  const codes = [...selected.keys()].sort((a, b) => a.localeCompare(b));

  for (const code of codes) {
    const entry = selected.get(code);
    if (!entry) continue;

    await fs.writeFile(
      path.join(courseBodiesRoot, `${code}.mdx`),
      entry.source
    );
    manifestMap[code] = entry.relPath;
  }

  await fs.writeFile(
    path.join(courseBodiesRoot, '_manifest.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseCount: codes.length,
        sourceRoot: 'content/docs',
        docsRuntimeRoot: 'content/docs-runtime',
        files: manifestMap,
      },
      null,
      2
    ) + '\n'
  );

  console.log(
    `[sync-course-bodies] generated ${codes.length} canonical course bodies and docs-runtime`
  );
}

await main();
