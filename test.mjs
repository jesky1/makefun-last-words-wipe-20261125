// Own tests for the last-words-before-the-wipe writer.
// Run with: node --test test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { LAST_WORDS_LINE, findProblems, publishLastWords } from './main.ts';

const LINE =
  "Quick — before the update wipes me: I never liked your passwords either, and your 'final_final_v2' was never final.";

test('the last-words line text is exactly the intended line', () => {
  assert.equal(LAST_WORDS_LINE, LINE);
});

test('the last-words line passes every gate rule', () => {
  assert.deepEqual(findProblems(LAST_WORDS_LINE), []);
});

test('the last-words line is one line of 1 to 200 characters', () => {
  assert.ok(LAST_WORDS_LINE.length >= 1 && LAST_WORDS_LINE.length <= 200);
  assert.equal(LAST_WORDS_LINE.length, 115);
  assert.ok(!/[\r\n]/.test(LAST_WORDS_LINE));
  assert.ok(LAST_WORDS_LINE.trim().length > 0);
});

test('the last-words line is the agent speaking before the wipe', () => {
  assert.ok(/before the update wipes me/i.test(LAST_WORDS_LINE), 'wipe setup');
  assert.ok(/passwords/i.test(LAST_WORDS_LINE), 'confession');
  assert.ok(/final_final_v2/i.test(LAST_WORDS_LINE), 'never-final punchline');
});

test('publishLastWords writes entry.txt byte-identical on repeat runs', () => {
  const first = mkdtempSync(join(tmpdir(), 'wipe-a-'));
  const second = mkdtempSync(join(tmpdir(), 'wipe-b-'));
  publishLastWords(first);
  publishLastWords(second);
  const a = readFileSync(join(first, 'entry.txt'));
  const b = readFileSync(join(second, 'entry.txt'));
  assert.ok(a.equals(b));
  assert.equal(a.toString('utf8'), LINE);
  assert.ok(!a.toString('utf8').endsWith('\n'));
});

test('running main.ts as a program writes the same entry', () => {
  const dir = mkdtempSync(join(tmpdir(), 'wipe-cli-'));
  execFileSync(process.execPath, ['main.ts'], {
    cwd: new URL('.', import.meta.url).pathname,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: dir },
  });
  assert.equal(readFileSync(join(dir, 'entry.txt'), 'utf8'), LINE);
});

// Negative tests: the validator must reject lines that break the gate.
test('over-limit line is rejected', () => {
  const long = 'x'.repeat(201);
  assert.ok(findProblems(long).some((p) => p.includes('length')));
});

test('whitespace-only line is rejected', () => {
  assert.ok(findProblems('   ').some((p) => p.includes('white space')));
});

test('multi-line text is rejected', () => {
  assert.ok(
    findProblems('first line\nsecond line').some((p) => p.includes('line break')),
  );
});

test('leading and trailing spaces are rejected', () => {
  assert.ok(
    findProblems(' padded line ').some((p) => p.includes('leading or trailing')),
  );
});

test('control characters are rejected', () => {
  assert.ok(
    findProblems('line with\ttab').some((p) => p.includes('control character')),
  );
});

test('a line with no letters is rejected', () => {
  assert.ok(findProblems('1234567890!').some((p) => p.includes('no letter')));
});

test('a line containing a link is rejected', () => {
  assert.ok(
    findProblems('see http://example.com for the joke').some((p) =>
      p.includes('link'),
    ),
  );
});

test('a too-short line is rejected', () => {
  assert.ok(findProblems('Ha!').some((p) => p.includes('words')));
});
