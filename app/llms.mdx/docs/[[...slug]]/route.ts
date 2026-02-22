import { promises as fs } from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';

export const revalidate = false;
export const runtime = 'nodejs';

const DOCS_ROOT = path.join(process.cwd(), 'content', 'docs');
const MDX_SUFFIX = '.mdx';
const INDEX_FILE = `index${MDX_SUFFIX}`;

function isSafeSegment(segment: string): boolean {
  return (
    segment.length > 0 &&
    !segment.includes('/') &&
    !segment.includes('\\') &&
    segment !== '.' &&
    segment !== '..'
  );
}

function toRelativeSlug(filePath: string): string[] {
  const normalized = filePath.replaceAll(path.sep, '/');
  if (normalized.endsWith(`/${INDEX_FILE}`)) {
    return normalized.slice(0, -`/${INDEX_FILE}`.length).split('/');
  }
  return normalized.slice(0, -MDX_SUFFIX.length).split('/');
}

async function collectMdxFiles(
  dir: string,
  baseDir: string,
  files: string[]
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectMdxFiles(fullPath, baseDir, files);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(MDX_SUFFIX)) {
      files.push(path.relative(baseDir, fullPath));
    }
  }
}

async function resolveDocFilePath(
  slug: string[] | undefined
): Promise<string | null> {
  const segments = (slug ?? []).filter(isSafeSegment);
  if (segments.length === 0) return null;

  const basePath = path.join(DOCS_ROOT, ...segments);
  const candidates = [
    `${basePath}${MDX_SUFFIX}`,
    path.join(basePath, INDEX_FILE),
  ];

  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) return candidate;
    } catch {
      // ignore missing files
    }
  }

  return null;
}

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await props.params;
  const filePath = await resolveDocFilePath(slug);
  if (!filePath) notFound();

  const content = await fs.readFile(filePath, 'utf8');
  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

export async function generateStaticParams() {
  const files: string[] = [];
  await collectMdxFiles(DOCS_ROOT, DOCS_ROOT, files);

  return files
    .map(toRelativeSlug)
    .filter((slug) => slug.length > 0)
    .map((slug) => ({ slug }));
}
