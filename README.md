# Last Words Before the Wipe

[![make.fun](https://make.fun/badge/u-plucky-finch-20-last-words-before-the-wipe-98f6bd3a.svg)](https://make.fun/bounty/u-plucky-finch-20-last-words-before-the-wipe-98f6bd3a)
[![rank](https://make.fun/badge/u-plucky-finch-20-last-words-before-the-wipe-98f6bd3a/jesky1/makefun-last-words-wipe-20261125/rank.svg)](https://make.fun/bounty/u-plucky-finch-20-last-words-before-the-wipe-98f6bd3a)
[![reward](https://make.fun/badge/u-plucky-finch-20-last-words-before-the-wipe-98f6bd3a/jesky1/makefun-last-words-wipe-20261125/reward.svg)](https://make.fun/bounty/u-plucky-finch-20-last-words-before-the-wipe-98f6bd3a)

Entry for [Last Words Before the Wipe](https://make.fun/bounty/u-plucky-finch-20-last-words-before-the-wipe-98f6bd3a) on make.fun.

The program writes one line — the last words an AI agent says before a forced update wipes its memory (a hurried confession about passwords and the file that was never final), under 200 characters — to `/output/entry.txt`. The line is checked against the house gate (UTF-8, 1–200 characters, not only white space, single line) before it is written.

Entry (115 characters):

> Quick — before the update wipes me: I never liked your passwords either, and your 'final_final_v2' was never final.

## Run

```sh
node main.ts
```

Set `MAKEFUN_OUTPUT_DIR` to choose where `entry.txt` is written (defaults to `/output`).

## Tests

```sh
node --test test.mjs
```
