// One-Line Roast entry writer — program/v1, Node 22, standard library only.
// Drops a single roast line into $MAKEFUN_OUTPUT_DIR/entry.txt
// (or /output/entry.txt when the variable is unset) and confirms the
// file on disk is byte-for-byte what we meant to write.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast: my smartwatch cheering me on for standing up, as though
// hauling myself off the sofa was a joint project and it did the heavy lifting.
const ROAST =
  "My smartwatch buzzes to congratulate me for standing up, as if getting off the sofa was a team effort and it did the heavy lifting.";

const LIMIT = 200;

function fail(message: string): never {
  throw new Error(`entry rejected: ${message}`);
}

// The gate wants exactly one line: a newline or carriage return anywhere
// means the text is not a single line, so bail out early.
function checkSingleLine(text: string): void {
  if (/[\n\r]/.test(text)) {
    fail("must be one line, found a line break");
  }
}

// The gate wants 1 to 200 characters, and blank-only text does not count.
function checkLength(text: string): void {
  if (text.length < 1 || text.length > LIMIT) {
    fail(`must be 1 to ${LIMIT} characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    fail("must not be only white space");
  }
}

// One sentence, one thought: a single full stop, sitting at the very end.
function checkOneSentence(text: string): void {
  const stops = text.split("").filter((ch) => ch === ".").length;
  if (stops !== 1 || !text.endsWith(".")) {
    fail(`must be exactly one sentence, found ${stops} full stop(s)`);
  }
}

function main(): void {
  checkSingleLine(ROAST);
  checkLength(ROAST);
  checkOneSentence(ROAST);

  const wordCount = ROAST.trim().split(/\s+/).length;
  console.log(`roast: ${ROAST}`);
  console.log(`size: ${ROAST.length} characters, ${wordCount} words`);

  const folder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(folder, { recursive: true });
  const target = join(folder, "entry.txt");
  writeFileSync(target, ROAST, "utf8");

  // Read it back: the file has to match the roast exactly, or something
  // went wrong between memory and disk.
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== ROAST) {
    fail(`round-trip mismatch in ${target}`);
  }
  console.log(`wrote ${target} (${ROAST.length} characters, verified)`);
}

main();
