import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { expect, it } from 'vitest';

it('runs workflow-owned verifiers against an older content checkout that has no verification scripts', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cms-trusted-verifiers-'));
  const source = fileURLToPath(new URL('../scripts/', import.meta.url));
  const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.test', ...args],
    { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim();
  try {
    git('init');
    fs.mkdirSync(path.join(root, 'content'));
    fs.writeFileSync(path.join(root, 'content/published-content-v1.json'), JSON.stringify({
      schemaVersion: '1.0', siteKey: 'main', publishMode: 'production', releaseNumber: 1, releaseId: 'original',
    }));
    git('add', '.'); git('commit', '-m', 'old content before new verifiers');
    const original = git('rev-parse', 'HEAD');
    expect(fs.existsSync(path.join(root, 'scripts/verify-deployed-commit.mjs'))).toBe(false);
    const trusted = path.join(root, '.cms-workflow/scripts');
    fs.mkdirSync(trusted, { recursive: true });
    for (const file of ['verify-release-order.mjs', 'verify-deployed-commit.mjs']) {
      fs.copyFileSync(path.join(source, file), path.join(trusted, file));
    }
    // A stale content verifier would fail if it were accidentally selected.
    fs.mkdirSync(path.join(root, 'scripts'));
    fs.writeFileSync(path.join(root, 'scripts/verify-release-order.mjs'), 'throw new Error("untrusted old verifier");');
    const env = { ...process.env, COMMIT_SHA: original, SITE_KEY: 'main' };
    execFileSync(process.execPath, ['.cms-workflow/scripts/verify-release-order.mjs'], { cwd: root, env, stdio: 'pipe' });
    const moduleUrl = pathToFileURL(path.join(trusted, 'verify-deployed-commit.mjs')).href;
    execFileSync(process.execPath, ['--input-type=module', '-e',
      `const { verifyDeployedCommit } = await import(${JSON.stringify(moduleUrl)});
       await verifyDeployedCommit({ commitSha: process.env.COMMIT_SHA, siteKey: 'main', repository: 'owner/site', token: 'fixture',
         request: async () => Response.json({ workflow_runs: [] }) });`], { cwd: root, env, stdio: 'pipe' });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
