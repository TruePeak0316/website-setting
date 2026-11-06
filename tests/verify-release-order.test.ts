import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';
import { verifyReleaseOrder } from '../scripts/verify-release-order.mjs';

it('rejects an older or conflicting release even if it was committed again later', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cms-order-'));
  const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', ...args], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    git('init');
    fs.mkdirSync(path.join(root, 'content'));
    const commit = (releaseNumber: number, releaseId: string) => {
      fs.writeFileSync(path.join(root, 'content/published-content-v1.json'), JSON.stringify({ siteKey: 'main', publishMode: 'production', releaseNumber, releaseId }));
      git('add', 'content/published-content-v1.json');
      git('commit', '-m', `release ${releaseNumber}`);
      return git('rev-parse', 'HEAD').trim();
    };
    const first = commit(1, 'one');
    const second = commit(2, 'two');
    const replay = commit(1, 'one');
    expect(() => verifyReleaseOrder(first, 'main', root)).not.toThrow();
    expect(() => verifyReleaseOrder(second, 'main', root)).not.toThrow();
    expect(() => verifyReleaseOrder(replay, 'main', root)).toThrow('newer or conflicting');
    const conflict = commit(2, 'different');
    expect(() => verifyReleaseOrder(conflict, 'main', root)).toThrow('newer or conflicting');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
