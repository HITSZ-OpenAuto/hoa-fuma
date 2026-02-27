import fs from 'node:fs/promises';
import path from 'node:path';
import { GITHUB_ORG } from './constants';

const REPOS_FILE = path.join(process.cwd(), 'repos_list.txt');

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

/**
 * Fetch the most recently updated repos,
 * filtered to those in repos_list.txt.
 * Description is the latest commit message that does not start with "ci:".
 */
export async function getRecentRepos(count = 3): Promise<RepoItem[]> {
  const content = await fs.readFile(REPOS_FILE, 'utf-8');
  const allowedRepos = new Set(
    content
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  );

  const headers = githubHeaders();

  // Fetch repos sorted by push date (most recent first)
  const res = await fetch(
    `https://api.github.com/orgs/${GITHUB_ORG}/repos?sort=pushed&direction=desc&per_page=50`,
    { headers, next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    console.error('GitHub API error:', res.status, await res.text());
    return [];
  }

  const repos: { name: string; pushed_at: string; html_url: string }[] =
    await res.json();

  // Filter to allowed repos and take enough candidates
  const filtered = repos.filter((r) => allowedRepos.has(r.name));

  // For each repo, fetch the latest non-ci commit message
  const results: RepoItem[] = [];
  for (const repo of filtered.slice(0, count * 2)) {
    const commitsRes = await fetch(
      `https://api.github.com/repos/${GITHUB_ORG}/${repo.name}/commits?per_page=30`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!commitsRes.ok) continue;

    const commits: { commit: { message: string; author: { date: string } } }[] =
      await commitsRes.json();

    const commit = commits.find((c) => isUserCommit(c.commit.message));
    if (!commit) continue;

    results.push({
      id: repo.name,
      name: repo.name,
      description: commit.commit.message.split('\n')[0],
      href: repo.html_url,
      updatedAt: commit.commit.author.date,
    });
  }

  return results
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, count);
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

/**
 * Fetch the latest non-ci commit for a specific repo.
 */
export async function getLatestCommit(
  repoName: string
): Promise<LatestCommitInfo | null> {
  const headers = githubHeaders();

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_ORG}/${repoName}/commits?per_page=50`,
    { headers, next: { revalidate: 3600 } }
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
  if (!commit) return null;

  return {
    authorName: commit.author?.login ?? commit.commit.author.name,
    authorUrl:
      commit.author?.html_url ?? `https://github.com/${commit.author?.login}`,
    authorAvatarUrl: commit.author?.avatar_url ?? '',
    message: commit.commit.message.split('\n')[0],
    commitUrl: commit.html_url,
    date: commit.commit.author.date,
  };
}
