import fs from 'node:fs';
import path from 'node:path';

const ORG = 'HITSZ-OpenAuto';
const REPOS_FILE = path.join(process.cwd(), 'repos_list.txt');

type RepoItem = {
  id: string;
  name: string;
  description: string;
  href: string;
  updatedAt: string;
};

/**
 * Fetch the most recently updated repos from HITSZ-OpenAuto,
 * filtered to those in repos_list.txt.
 * Description is the latest commit message that does not start with "ci:".
 */
export async function getRecentRepos(count = 6): Promise<RepoItem[]> {
  const allowedRepos = new Set(
    fs
      .readFileSync(REPOS_FILE, 'utf-8')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  );

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Fetch repos sorted by push date (most recent first)
  const res = await fetch(
    `https://api.github.com/orgs/${ORG}/repos?sort=pushed&direction=desc&per_page=50`,
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
  for (const repo of filtered) {
    if (results.length >= count) break;

    const commitsRes = await fetch(
      `https://api.github.com/repos/${ORG}/${repo.name}/commits?per_page=10`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!commitsRes.ok) continue;

    const commits: { commit: { message: string } }[] = await commitsRes.json();

    const commit = commits.find(
      (c) =>
        !c.commit.message.startsWith('ci:') &&
        !c.commit.message.startsWith('[automated-generated-PR]') &&
        !c.commit.message.startsWith('Update') &&
        !c.commit.message.startsWith('Merge') &&
        !c.commit.message.startsWith('chore:')
    );
    const description = commit ? commit.commit.message.split('\n')[0] : '';

    results.push({
      id: repo.name,
      name: repo.name,
      description,
      href: repo.html_url,
      updatedAt: repo.pushed_at,
    });
  }

  return results;
}
