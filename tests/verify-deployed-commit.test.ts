import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, expect, it, vi } from 'vitest';
import { verifyDeployedCommit } from '../scripts/verify-deployed-commit.mjs';

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cms-code-order-'));
const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.test', ...args],
  { cwd: directory, encoding: 'utf8', stdio: 'pipe' }).trim();
git('init');
fs.writeFileSync(path.join(directory, 'code.txt'), 'original');
git('add', '.'); git('commit', '-m', 'original');
const original = git('rev-parse', 'HEAD');
fs.writeFileSync(path.join(directory, 'code.txt'), 'updated code, unchanged content');
git('commit', '-am', 'code update');
const updated = git('rev-parse', 'HEAD');
afterAll(() => fs.rmSync(directory, { recursive: true, force: true }));
const run = (sha: string, mode = 'production', site = 'main') => ({ event: 'workflow_dispatch', head_branch: 'main',
  status: 'completed', conclusion: 'success', display_title: `CMS|11111111-1111-4111-8111-111111111111|22222222-2222-4222-8222-222222222222|${site}|1|${sha}|${mode}` });
const options = { directory, repository: 'owner/site', token: 'test-only', siteKey: 'main' };

it('permits new website code with the same snapshot and rejects retrying the older code after success', async () => {
  await expect(verifyDeployedCommit({ ...options, commitSha: updated,
    request: vi.fn().mockResolvedValue(Response.json({ workflow_runs: [run(original)] })) })).resolves.toBeUndefined();
  await expect(verifyDeployedCommit({ ...options, commitSha: original,
    request: vi.fn().mockResolvedValue(Response.json({ workflow_runs: [run(updated)] })) })).rejects.toThrow('newer or divergent');
});

it('allows an identical code retry and ignores preview, failed and other-site runs', async () => {
  await expect(verifyDeployedCommit({ ...options, commitSha: original,
    request: vi.fn().mockResolvedValue(Response.json({ workflow_runs: [run(updated, 'preview'),
      run(updated, 'production', 'other'), { ...run(updated), conclusion: 'failure' }, run(original)] })) })).resolves.toBeUndefined();
});

it('fails closed on GitHub errors or malformed responses', async () => {
  for (const response of [new Response(null, { status: 429 }), Response.json({})]) {
    await expect(verifyDeployedCommit({ ...options, commitSha: updated,
      request: vi.fn().mockResolvedValue(response) })).rejects.toThrow();
  }
});

it('searches later pages instead of guessing the latest run', async () => {
  const request = vi.fn().mockResolvedValueOnce(Response.json({ workflow_runs: Array.from({ length: 100 }, () => run(updated, 'preview')) }))
    .mockResolvedValueOnce(Response.json({ workflow_runs: [run(updated)] }));
  await expect(verifyDeployedCommit({ ...options, commitSha: original, request })).rejects.toThrow('newer or divergent');
  expect(request).toHaveBeenCalledTimes(2);
});
