/**
 * Scan src/data/venues.ts and emit src/data/venue-lines.json — a mapping of
 * venue.id → line number. Used by App.tsx to construct GitHub deep-links
 * that jump straight to the right row in venues.ts, e.g.
 *
 *   https://github.com/.../blob/main/src/data/venues.ts#L1234
 *
 * Runs automatically via `predev` and `prebuild` npm scripts so the JSON
 * stays in sync with venues.ts.
 *
 * Usage:
 *   npx tsx scripts/build-venue-lines.ts
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const VENUES_FILE = path.join(ROOT, "src", "data", "venues.ts");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "venue-lines.json");

async function main() {
  const src = await fs.readFile(VENUES_FILE, "utf8");
  const lines = src.split("\n");
  const map: Record<string, number> = {};
  // Match lines like:  '    id: "rosewood-hk",'
  // (4-space indent because each venue is an object literal inside the array).
  const idRe = /^\s{4}id:\s*"([^"]+)"/;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(idRe);
    if (m) map[m[1]] = i + 1; // GitHub uses 1-indexed line numbers
  }
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(map, null, 2) + "\n");
  console.log(
    `build-venue-lines: wrote ${Object.keys(map).length} ids → ${path.relative(ROOT, OUTPUT_FILE)}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
