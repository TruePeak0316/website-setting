import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const snapshotPath = 'content/published-content-v1.json';

export function verifyReleaseOrder(commitSha, siteKey, directory = process.cwd()) {
  const git = (...args) => execFileSync('git', args, { cwd: directory, encoding: 'utf8' });
  const read = (commit) => JSON.parse(git('show', `${commit}:${snapshotPath}`));
  const current = read(commitSha);
  if (current.siteKey !== siteKey || current.publishMode !== 'production' ||
      !Number.isSafeInteger(current.releaseNumber) || current.releaseNumber < 1) {
    throw new Error('Production snapshot identity or release number is invalid');
  }
  const commits = git('log', '--first-parent', '--format=%H', commitSha, '--', snapshotPath).trim().split('\n').filter(Boolean);
  for (const commit of commits) {
    const previous = read(commit);
    if (previous.siteKey !== siteKey || previous.publishMode !== 'production') continue;
    if (!Number.isSafeInteger(previous.releaseNumber) || previous.releaseNumber < 1) {
      throw new Error('Earlier production snapshot has no valid release number');
    }
    if (previous.releaseNumber > current.releaseNumber ||
        (previous.releaseNumber === current.releaseNumber && previous.releaseId !== current.releaseId)) {
      throw new Error('A newer or conflicting production release already exists in the branch history');
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  verifyReleaseOrder(process.env.COMMIT_SHA, process.env.SITE_KEY);
}
