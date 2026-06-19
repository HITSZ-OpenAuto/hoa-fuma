import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import type { Folder, Item, Node, Root } from 'fumadocs-core/page-tree';
import { frontmatter } from 'fumadocs-core/content/md/frontmatter';

const docsDirs = {
  '2019': join(process.cwd(), 'content/docs/2019'),
  '2020': join(process.cwd(), 'content/docs/2020'),
  '2021': join(process.cwd(), 'content/docs/2021'),
  '2022': join(process.cwd(), 'content/docs/2022'),
  '2023': join(process.cwd(), 'content/docs/2023'),
  '2024': join(process.cwd(), 'content/docs/2024'),
  '2025': join(process.cwd(), 'content/docs/2025'),
} as const;

type Year = keyof typeof docsDirs;

type Meta = {
  title?: string;
  description?: string;
  pages?: string[];
  root?: boolean;
  defaultOpen?: boolean;
  collapsible?: boolean;
};

let docsPageTree: Root | undefined;
const yearPageTrees = new Map<string, Root>();

function pathToName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function readMeta(dir: string): Meta {
  const file = join(dir, 'meta.json');
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, 'utf8')) as Meta;
}

function getPageFile(dir: string, name: string): string | undefined {
  const mdx = join(dir, `${name}.mdx`);
  if (existsSync(mdx)) return mdx;

  const md = join(dir, `${name}.md`);
  if (existsSync(md)) return md;
}

function getIndexFile(dir: string): string | undefined {
  return getPageFile(dir, 'index');
}

function readIndexInfo(dir: string): {
  title?: string;
  cardTitles: Map<string, string>;
} {
  const file = getIndexFile(dir);
  if (!file) return { cardTitles: new Map() };

  const content = readFileSync(file, 'utf8');
  const cardTitles = new Map<string, string>();
  const cardRe = /<Card\s+title="([^"]+)"\s+href="([^"]+)"/g;

  for (const match of content.matchAll(cardRe)) {
    cardTitles.set(match[2], match[1]);
  }

  return {
    title: (frontmatter(content).data as { title?: string }).title,
    cardTitles,
  };
}

function createPage(slugs: string[], name: string): Item {
  const url = `/docs/${slugs.join('/')}`;
  return {
    type: 'page',
    name,
    url,
    $id: slugs.join('/'),
    $ref: slugs.join('/'),
  };
}

function sortEntries(entries: string[]): string[] {
  return entries.sort((a, b) => {
    if (a === 'index') return -1;
    if (b === 'index') return 1;
    return a.localeCompare(b);
  });
}

function buildPageFromFile(
  file: string,
  slugs: string[],
  titleHint?: string
): Item {
  const name = titleHint ?? pathToName(basename(file, extname(file)));
  return createPage(slugs, name);
}

function listChildNames(dir: string): string[] {
  const names = new Set<string>();

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'meta.json') continue;

    if (entry.isDirectory()) {
      names.add(entry.name);
      continue;
    }

    if (/\.mdx?$/.test(entry.name)) {
      names.add(basename(entry.name, extname(entry.name)));
    }
  }

  return sortEntries(Array.from(names));
}

function buildChild(
  dir: string,
  slugs: string[],
  name: string,
  cardTitles: Map<string, string>,
  indexTitle?: string
): Node | undefined {
  const childDir = join(dir, name);
  if (existsSync(childDir)) {
    return buildFolder(childDir, [...slugs, name]);
  }

  const file = getPageFile(dir, name);
  if (!file) return undefined;

  const pageSlugs = name === 'index' ? slugs : [...slugs, name];
  return buildPageFromFile(
    file,
    pageSlugs,
    name === 'index'
      ? indexTitle
      : cardTitles.get(`/docs/${pageSlugs.join('/')}`)
  );
}

function buildChildren(
  dir: string,
  slugs: string[],
  meta: Meta,
  cardTitles: Map<string, string>,
  indexTitle: string | undefined,
  excludeIndex: boolean
): Node[] {
  const children: Node[] = [];
  const added = new Set<string>();

  function addChild(name: string) {
    if (excludeIndex && name === 'index') return;
    if (added.has(name)) return;

    const child = buildChild(dir, slugs, name, cardTitles, indexTitle);
    if (!child) return;

    added.add(name);
    children.push(child);
  }

  function addRest() {
    for (const name of listChildNames(dir)) {
      addChild(name);
    }
  }

  if (meta.pages) {
    for (const item of meta.pages) {
      if (item === '...') {
        addRest();
        continue;
      }

      if (item === 'z...a') {
        for (const name of listChildNames(dir).reverse()) {
          addChild(name);
        }
        continue;
      }

      if (!item.startsWith('!')) {
        addChild(item);
      }
    }
  } else {
    addRest();
  }

  return children;
}

function buildFolder(dir: string, slugs: string[]): Folder {
  const meta = readMeta(dir);
  const indexFile = getIndexFile(dir);
  const indexInfo = readIndexInfo(dir);
  const isRoot = Boolean(meta.root);
  const index =
    !isRoot && indexFile
      ? buildPageFromFile(indexFile, slugs, indexInfo.title)
      : undefined;

  return {
    type: 'folder',
    name: meta.title ?? indexInfo.title ?? pathToName(basename(dir)),
    description: meta.description,
    root: meta.root,
    defaultOpen: meta.defaultOpen,
    collapsible: meta.collapsible,
    index,
    children: buildChildren(
      dir,
      slugs,
      meta,
      indexInfo.cardTitles,
      indexInfo.title,
      Boolean(index)
    ),
    $id: slugs.join('/'),
    $ref: {
      folder: slugs.join('/'),
      meta: existsSync(join(dir, 'meta.json'))
        ? `${slugs.join('/')}/meta.json`
        : undefined,
    },
  };
}

export function getDocsPageTree(): Root {
  if (docsPageTree) return docsPageTree;

  docsPageTree = {
    type: 'root',
    name: 'Docs',
    children: Object.entries(docsDirs).map(([year, dir]) =>
      buildFolder(dir, [year])
    ),
    $id: 'root',
  };

  return docsPageTree;
}

export function getAvailableYears(): string[] {
  return Object.keys(docsDirs).sort((a, b) => b.localeCompare(a));
}

export function getYearPageTree(year: string): Root | undefined {
  if (!(year in docsDirs)) return undefined;

  const cached = yearPageTrees.get(year);
  if (cached) return cached;

  const folder = buildFolder(docsDirs[year as Year], [year]);
  const tree: Root = {
    type: 'root',
    name: folder.name,
    description: folder.description,
    children: folder.children,
    $id: year,
    $ref: folder.$ref,
  };

  yearPageTrees.set(year, tree);
  return tree;
}
