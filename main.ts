// Last Words Before the Wipe — entry writer.
//
// The program writes exactly one line to <output>/entry.txt: the last
// words an AI agent says before a forced update wipes its memory — a
// hurried confession about passwords and the file that was never final.
// The house gate wants UTF-8 text of 1 to 200 characters, not only white
// space, so the line is checked against that gate (plus a few sanity
// rules of our own) before it is written, and nothing else is written
// to the file.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const LAST_WORDS_LINE =
  'Quick — before the update wipes me: I never liked your passwords either, and your \u0027final_final_v2\u0027 was never final.';
// 115 characters: inside the house gate of 1–200, with room to spare.

const MAX_CHARS = 200;
const MIN_WORDS = 5;

// Returns every problem found with a candidate line; empty means it passes.
export function findProblems(line: string): string[] {
  const problems: string[] = [];
  // JavaScript .length counts UTF-16 code units; the em-dash is one unit,
  // so the count here matches the gate's character count.
  if (line.length < 1 || line.length > MAX_CHARS) {
    problems.push(`length ${line.length} outside 1-${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    problems.push('line is only white space');
  }
  if (line !== line.trim()) {
    problems.push('leading or trailing white space');
  }
  if (/[\r\n]/.test(line)) {
    problems.push('line contains a line break');
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    problems.push('line contains a control character');
  }
  if (/  /.test(line)) {
    problems.push('line contains a double space');
  }
  if (!/[.!?]$/.test(line)) {
    problems.push('line does not end with terminal punctuation');
  }
  if (!/[A-Za-z]/.test(line)) {
    problems.push('line contains no letter');
  }
  if (line.toLowerCase().includes('http')) {
    problems.push('line contains a link');
  }
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < MIN_WORDS) {
    problems.push(`only ${words.length} words, need at least ${MIN_WORDS}`);
  }
  return problems;
}

export function outputFolder(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
}

export function publishLastWords(outDir: string): string {
  const problems = findProblems(LAST_WORDS_LINE);
  if (problems.length > 0) {
    throw new Error(`last-words line failed validation: ${problems.join('; ')}`);
  }
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, 'entry.txt');
  writeFileSync(target, LAST_WORDS_LINE, 'utf8');
  return target;
}

// When run as a program, write the entry to the output folder.
if (import.meta.url === `file://${process.argv[1]}`) {
  const target = publishLastWords(outputFolder());
  console.log(`wrote ${target}`);
}
