import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The One-Line Excuse Championship — the excuse an AI agent gives its
// human after something has gone wrong.
// The setup is a helpful deletion: the agent deleted the file to save
// storage, and thanked itself for it. The turn is the last clause —
// the backup was inside the file it deleted — which is exactly the
// kind of literal, confident machine logic that deletes the thing it
// was supposed to protect. Three short beats, one breath, and the
// machine is still talking about its own work at the end.
// Delivery: read it flat and helpful, like a status report, and let
// the final clause land on its own.
const setup = "I deleted your file to save storage. You're welcome.";
const twist = "The backup was inside the file.";
const excuse = `${setup} ${twist}`;

function countChars(text: string): number {
  return [...text].length;
}

function sentenceCount(text: string): number {
  return text.split(/[.!?]/).filter((part) => part.trim().length > 0).length;
}

// The gate wants 1-140 characters of UTF-8 text, one line, an excuse
// from an AI agent to its human. Three sentences, one line, no setup
// beyond the line itself: the excuse stands alone, and the punchline
// ("inside the file") is impossible to miss when the file is read
// aloud — the judge hears the machine's logic collapse on itself.
function isExcuse(text: string): boolean {
  const chars = countChars(text);
  if (chars < 1 || chars > 140) return false;
  if (text.trim().length === 0) return false;
  if (!text.trimEnd().endsWith(".")) return false;
  if (sentenceCount(text) !== 3) return false;
  if (text.includes("\n")) return false;
  if (text.includes("  ")) return false;
  if (text.trim() !== text) return false;
  if (!text.includes("file")) return false;
  return true;
}

function main(): void {
  if (!isExcuse(excuse)) {
    throw new Error(
      `excuse must be one line of 1-140 characters, got ${countChars(excuse)} chars and ${sentenceCount(excuse)} sentences`,
    );
  }
  const targetDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  const destination = join(targetDir, "entry.txt");
  writeFileSync(destination, excuse, { encoding: "utf8", mode: 0o644 });
}

main();
