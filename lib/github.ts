import fs from 'node:fs/promises';
import path from 'node:path';
import { GITHUB_ORG } from './constants';

const REPOS_FILE = path.join(process.cwd(), 'lib/data/repos_list.txt');

type RepoItem = {
  id: string;
  name: string;
  description: string;
  href: string;
  updatedAt: string;
};

export type LatestCommitInfo = {
  authorName: string;
  authorUrl: string;
  authorAvatarUrl: string;
  message: string;
  commitUrl: string;
  date: string;
};

let allowedReposCache: Set<string> | null = null;
const GITHUB_FETCH_TIMEOUT_MS = 3000;
const GITHUB_CACHE_TTL_MS = 5 * 60 * 1000;
const recentReposCache = new Map<
  number,
  { expiresAt: number; items: RepoItem[] }
>();
const latestCommitCache = new Map<
  string,
  { expiresAt: number; item: LatestCommitInfo | null }
>();

async function getAllowedRepos(): Promise<Set<string>> {
  if (!allowedReposCache) {
    const content = await fs.readFile(REPOS_FILE, 'utf-8');
    allowedReposCache = new Set(
      content
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
    );
  }
  return allowedReposCache;
}

/**
 * Fetch the most recently updated repos,
 * filtered to those in repos_list.txt.
 * Description is the latest commit message that does not start with "ci:".
 */
export async function getRecentRepos(count = 3): Promise<RepoItem[]> {
  const cached = recentReposCache.get(count);
  if (cached && cached.expiresAt > Date.now()) return cached.items;

  const allowedRepos = await getAllowedRepos();

  const headers = githubHeaders();

  try {
    const res = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?sort=pushed&direction=desc&per_page=50`,
      githubFetchOptions(headers)
    );

    if (!res.ok) {
      console.error('GitHub API error:', res.status, await res.text());
      return [];
    }

    const repos: { name: string; pushed_at: string; html_url: string }[] =
      await res.json();

    const filtered = repos.filter((r) => allowedRepos.has(r.name));

    const promises = filtered.slice(0, count * 2).map(async (repo) => {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${GITHUB_ORG}/${repo.name}/commits?per_page=30`,
        githubFetchOptions(headers)
      );
      if (!commitsRes.ok) return null;

      const commits: {
        commit: { message: string; author: { date: string } };
      }[] = await commitsRes.json();

      const commit = commits.find((c) => isUserCommit(c.commit.message));
      if (!commit) return null;

      return {
        id: repo.name,
        name: repo.name,
        description: commit.commit.message.split('\n')[0],
        href: repo.html_url,
        updatedAt: commit.commit.author.date,
      };
    });

    const results = (await Promise.all(promises)).filter(
      (item): item is RepoItem => item !== null
    );

    const items = results
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, count);

    recentReposCache.set(count, {
      expiresAt: Date.now() + GITHUB_CACHE_TTL_MS,
      items,
    });

    return items;
  } catch {
    return [];
  }
}

const IGNORED_PREFIXES = [
  'ci:',
  '[automated-generated-pr]',
  'update',
  'merge',
  'chore:',
  'docs:',
];

function isUserCommit(message: string): boolean {
  const lower = message.toLowerCase();
  return !IGNORED_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

function githubFetchOptions(headers: HeadersInit) {
  return {
    headers,
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(GITHUB_FETCH_TIMEOUT_MS),
  };
}

/**
 * Fetch the latest non-ci commit for a specific repo.
 */
export async function getLatestCommit(
  repoName: string
): Promise<LatestCommitInfo | null> {
  const cached = latestCommitCache.get(repoName);
  if (cached && cached.expiresAt > Date.now()) return cached.item;

  const headers = githubHeaders();

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_ORG}/${repoName}/commits?per_page=50`,
      githubFetchOptions(headers)
    );

    if (!res.ok) return null;

    const commits: {
      sha: string;
      html_url: string;
      commit: {
        message: string;
        author: { name: string; date: string };
      };
      author: { login: string; html_url: string; avatar_url: string } | null;
    }[] = await res.json();

    const commit = commits.find((c) => isUserCommit(c.commit.message));
    if (!commit) {
      latestCommitCache.set(repoName, {
        expiresAt: Date.now() + GITHUB_CACHE_TTL_MS,
        item: null,
      });
      return null;
    }

    const item = {
      authorName: commit.author?.login ?? commit.commit.author.name,
      authorUrl:
        commit.author?.html_url ?? `https://github.com/${commit.author?.login}`,
      authorAvatarUrl: commit.author?.avatar_url ?? '',
      message: commit.commit.message.split('\n')[0],
      commitUrl: commit.html_url,
      date: commit.commit.author.date,
    };

    latestCommitCache.set(repoName, {
      expiresAt: Date.now() + GITHUB_CACHE_TTL_MS,
      item,
    });

    return item;
  } catch {
    latestCommitCache.set(repoName, {
      expiresAt: Date.now() + GITHUB_CACHE_TTL_MS,
      item: null,
    });

    return null;
  }
}
