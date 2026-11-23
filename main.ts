// One-Line Roast: The Gadget You Use Every Day — entry writer (program/v1, Node 22, stdlib only).
// Writes the one-line roast to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output/entry.txt), then reads it back and verifies the bytes match.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SENTENCE =
  "My smart speaker hears me whisper \u201clights off\u201d from the kitchen, but when I shout its name from three feet away it plays dead \u2014 selective hearing, now with Wi-Fi.";

const MAX_CHARS = 200;

function main(): void {
  if (SENTENCE.length === 0 || SENTENCE.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1 to ${MAX_CHARS} characters, got ${SENTENCE.length}`,
    );
  }
  if (SENTENCE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }

  // Exactly one line: no newline characters anywhere in the entry.
  if (SENTENCE.includes("\n") || SENTENCE.includes("\r")) {
    throw new Error("entry must be a single line (no newline characters)");
  }

  // Exactly one sentence: one sentence-terminating period, at the end.
  const periods = [...SENTENCE].filter((c) => c === ".").length;
  if (periods !== 1 || !SENTENCE.endsWith(".")) {
    throw new Error(
      `entry must be exactly one sentence (one final period), found ${periods} period(s)`,
    );
  }
  const words = SENTENCE.trim().split(/\s+/).length;
  console.log(`entry length: ${SENTENCE.length} characters, ${words} words`);
  console.log(`entry: ${SENTENCE}`);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, SENTENCE, "utf8");

  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== SENTENCE) {
    throw new Error(`verification failed: ${outPath} does not match the entry`);
  }
  console.log(`wrote ${outPath} (${SENTENCE.length} characters, verified)`);
}

main();
