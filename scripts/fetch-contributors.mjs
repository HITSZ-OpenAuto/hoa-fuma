#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const outputFile = path.join(projectRoot, 'lib/data/contributors.json');

const GITHUB_ORG = 'HITSZ-OpenAuto';

async function fetchContributors() {
  console.log(`[Contributor Graph] Fetching contributors for org: ${GITHUB_ORG}...`);
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'HOA-Contributor-Fetcher',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const reposRes = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=30&sort=pushed`,
      { headers }
    );

    if (!reposRes.ok) {
      console.warn(`[Warning] GitHub API returned ${reposRes.status}. Using existing contributors.json`);
      return;
    }

    const repos = await reposRes.json();
    const contributorMap = new Map();

    for (const repo of repos) {
      if (repo.fork) continue;
      const contribRes = await fetch(
        `https://api.github.com/repos/${GITHUB_ORG}/${repo.name}/contributors?per_page=30`,
        { headers }
      );
      if (!contribRes.ok) continue;

      const contribs = await contribRes.json();
      if (!Array.isArray(contribs)) continue;

      for (const c of contribs) {
        if (c.type !== 'User' || c.login.includes('[bot]')) continue;
        const existing = contributorMap.get(c.login) || {
          login: c.login,
          name: c.login,
          avatarUrl: c.avatar_url,
          htmlUrl: c.html_url,
          contributions: 0,
          repos: [],
        };
        existing.contributions += c.contributions;
        if (!existing.repos.includes(repo.name)) {
          existing.repos.push(repo.name);
        }
        contributorMap.set(c.login, existing);
      }
    }

    const contributorsList = Array.from(contributorMap.values()).sort(
      (a, b) => b.contributions - a.contributions
    );

    if (contributorsList.length > 0) {
      await fs.writeFile(
        outputFile,
        JSON.stringify(contributorsList, null, 2),
        'utf-8'
      );
      console.log(`[Success] Successfully saved ${contributorsList.length} contributors to lib/data/contributors.json`);
    } else {
      console.log(`[Info] No new contributor data fetched. Retaining current file.`);
    }
  } catch (err) {
    console.error(`[Error] Failed to fetch contributors:`, err.message);
  }
}

fetchContributors();
