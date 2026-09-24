import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function normalizeLinks(source) {
  return source
    .replace(
      /(https?:\/\/hoa\.moe)?\/docs\/[a-z][a-z-]+\/([a-z][a-z0-9-]{2,30})\/?(?=[^a-z0-9/-]|$)/gi,
      (_, origin, code) => `${origin ? 'https://hoa.moe' : ''}/docs/${code}`
    )
    .replace(
      /(?:https?:\/\/hoa\.moe)?\/blog\/writing-rules\/?(?=[^a-z0-9/-]|$)/gi,
      'https://wiki.hoa.moe/'
    );
}

function processDirectory(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(path);
    } else if (/\.mdx?$/.test(entry.name)) {
      const source = readFileSync(path, 'utf8');
      const normalized = normalizeLinks(source);
      if (normalized !== source) writeFileSync(path, normalized);
    }
  }
}

for (const kind of ['news', 'docs']) {
  processDirectory(join('content', kind));
}
