#!/usr/bin/env node
// Cut a release by pushing a CalVer tag; the tag push is what triggers CI.
//
//   node scripts/release.mjs site       -> site-vYYYY.MMDD.N      (deploy.yml)
//   node scripts/release.mjs packages   -> packages-vYYYY.MMDD.N  (release-packages.yml)
//
// N counts releases of that kind on the same UTC day, starting at 0. Versions
// have no leading zeros so they are valid semver (2026.1023.0).
import { execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';

const kind = process.argv[2];
if (kind !== 'site' && kind !== 'packages') {
	console.error('usage: release.mjs <site|packages>');
	process.exit(1);
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

if (git('status', '--porcelain')) {
	console.error('Working tree is not clean; commit or stash first.');
	process.exit(1);
}
git('fetch', '--tags', '--quiet');

const now = new Date();
const day = `${now.getUTCFullYear()}.${(now.getUTCMonth() + 1) * 100 + now.getUTCDate()}`;
const prefix = `${kind}-v${day}.`;
const existing = git('tag', '--list', `${prefix}*`).split('\n').filter(Boolean);
const n = existing.length ? Math.max(...existing.map((t) => Number(t.slice(prefix.length)))) + 1 : 0;
const tag = `${prefix}${n}`;

const head = git('log', '-1', '--format=%h %s');
const rl = createInterface({ input: process.stdin, output: process.stdout });
const answer = await rl.question(`Tag ${head}\n  as ${tag} and push it? Type the tag to confirm: `);
rl.close();
if (answer.trim() !== tag) {
	console.error('Not confirmed; nothing tagged.');
	process.exit(1);
}
git('tag', '--annotate', tag, '--message', `${kind} ${tag.slice(kind.length + 2)}`);
git('push', 'origin', tag);
console.log(`Pushed ${tag}.`);
