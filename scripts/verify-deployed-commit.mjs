import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export async function verifyDeployedCommit({ commitSha, siteKey, repository, token,
  apiUrl = 'https://api.github.com', directory = process.cwd(), request = fetch }) {
  if (!/^[0-9a-f]{40}$/.test(commitSha) || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(siteKey) ||
      !/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || !token) throw new Error('Missing deployment verification identity');
  const marker = /^CMS\|[0-9a-f-]{36}\|[0-9a-f-]{36}\|([a-z0-9][a-z0-9_-]{0,63})\|[1-9][0-9]*\|([0-9a-f]{40})\|production$/i;
  for (let page = 1; page <= 10; page++) {
    const url = new URL(`/repos/${repository}/actions/workflows/deploy-pages.yml/runs`, apiUrl);
    url.search = new URLSearchParams({ branch: 'main', event: 'workflow_dispatch', status: 'success', per_page: '100', page: String(page) }).toString();
    const response = await request(url, { headers: { Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' }, signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new Error(`Cannot verify deployed website commit: HTTP ${response.status}`);
    const body = await response.json();
    if (!Array.isArray(body.workflow_runs)) throw new Error('Invalid workflow history response');
    for (const run of body.workflow_runs) {
      if (run.event !== 'workflow_dispatch' || run.head_branch !== 'main' || run.status !== 'completed' || run.conclusion !== 'success') continue;
      const match = marker.exec(run.display_title ?? '');
      if (!match || match[1] !== siteKey) continue;
      const previousSha = match[2].toLowerCase();
      try {
        execFileSync('git', ['merge-base', '--is-ancestor', previousSha, commitSha], { cwd: directory, stdio: 'pipe' });
      } catch {
        throw new Error('A newer or divergent website commit has already been deployed; publish the latest website code');
      }
      return;
    }
    if (body.workflow_runs.length < 100) return;
  }
  throw new Error('Cannot verify deployed website commit within the safe history limit');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await verifyDeployedCommit({ commitSha: process.env.COMMIT_SHA, siteKey: process.env.SITE_KEY,
    repository: process.env.GITHUB_REPOSITORY, token: process.env.GH_TOKEN,
    apiUrl: process.env.GITHUB_API_URL });
}
