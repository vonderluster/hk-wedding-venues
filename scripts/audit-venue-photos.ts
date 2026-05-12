/**
 * Generate a single-page HTML report at public/venue-photos/_audit.html that
 * shows every venue's local photos side-by-side, with file size, source URL
 * (from _manifest.json if present), and quick-fix snippets you can paste into
 * scripts/fetch-venue-photos.ts to ban a bad URL or override with a good one.
 *
 * Run after a scrape:
 *   npx tsx scripts/audit-venue-photos.ts
 *   open public/venue-photos/_audit.html   # or just double-click it
 *
 * Use this when the live site shows a wrong-looking hero photo. Find the
 * venue in the report, see the source URL, copy the deny pattern, paste into
 * BLOCKED_URL_PATTERNS in fetch-venue-photos.ts, delete the offending file,
 * and re-run the scraper for that venue:
 *   rm public/venue-photos/<venue-id>-*.{jpg,png,webp,avif}
 *   npx tsx scripts/fetch-venue-photos.ts --venue=<venue-id>
 */

import { promises as fs } from "node:fs";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { venues } from "../src/data/venues";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PHOTOS_DIR = path.join(ROOT, "public", "venue-photos");
const MANIFEST_FILE = path.join(PHOTOS_DIR, "_manifest.json");
const OUTPUT_FILE = path.join(PHOTOS_DIR, "_audit.html");

interface ManifestEntry {
  url: string;
  bytes: number;
  ts: string;
}
type Manifest = Record<string, ManifestEntry>;

async function loadManifest(): Promise<Manifest> {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_FILE, "utf8")) as Manifest;
  } catch {
    return {};
  }
}

function findVenuePhotos(venueId: string): string[] {
  const out: string[] = [];
  for (const i of [1, 2]) {
    for (const ext of ["jpg", "png", "webp", "avif", "JPG"]) {
      const fname = `${venueId}-${i}.${ext}`;
      const p = path.join(PHOTOS_DIR, fname);
      if (existsSync(p)) out.push(fname);
    }
  }
  return out;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function suspicionFlags(
  fname: string,
  bytes: number,
  url?: string,
): string[] {
  const flags: string[] = [];
  if (bytes < 50_000) flags.push("⚠ small file (<50 KB)");
  if (url) {
    const lower = url.toLowerCase();
    const badHints = [
      "logo",
      "icon",
      "poster",
      "flyer",
      "floorplan",
      "floor-plan",
      "diagram",
      "schematic",
      "thumb",
      "campaign",
      "fundraiser",
      "charity",
      "event",
      "race",
      "regatta",
    ];
    for (const h of badHints) {
      if (lower.includes(h)) flags.push(`⚠ URL contains "${h}"`);
    }
  }
  if (!url) flags.push("ℹ no source URL recorded (pre-manifest scrape)");
  return flags;
}

async function main() {
  const manifest = await loadManifest();
  const rows: string[] = [];

  let totalVenues = 0;
  let venuesWithPhotos = 0;
  let totalPhotos = 0;
  let suspiciousCount = 0;

  for (const v of venues) {
    totalVenues++;
    const files = findVenuePhotos(v.id);
    if (files.length === 0) {
      rows.push(`
<tr class="no-photo">
  <td class="vid">${escape(v.id)}</td>
  <td class="vname">${escape(v.name)}<br/><small>${escape(v.district)}</small></td>
  <td colspan="2" class="empty">No local photos — falls back to stylized icon hero. Add to OFFICIAL_PAGES or OVERRIDE_IMAGES in scripts/fetch-venue-photos.ts and re-run.</td>
</tr>`);
      continue;
    }
    venuesWithPhotos++;
    totalPhotos += files.length;

    for (let i = 0; i < files.length; i++) {
      const fname = files[i];
      const relForWeb = `./${fname}`;
      const rel = `/venue-photos/${fname}`;
      const filePath = path.join(PHOTOS_DIR, fname);
      const bytes = statSync(filePath).size;
      const m = manifest[rel];
      const flags = suspicionFlags(fname, bytes, m?.url);
      const isSuspicious = flags.some((f) => f.startsWith("⚠"));
      if (isSuspicious) suspiciousCount++;

      const blockedHint = m?.url
        ? (() => {
            // Suggest one or two short tokens from the URL that could go in
            // BLOCKED_URL_PATTERNS. Take meaningful path/filename segments.
            try {
              const u = new URL(m.url);
              const parts = u.pathname.split(/[\/_-]/).filter((s) => s.length > 3);
              return parts.slice(-3).join(", ");
            } catch {
              return "";
            }
          })()
        : "";

      rows.push(`
<tr class="${isSuspicious ? "suspicious" : ""}">
  ${i === 0 ? `<td class="vid" rowspan="${files.length}">${escape(v.id)}</td><td class="vname" rowspan="${files.length}">${escape(v.name)}<br/><small>${escape(v.district)}</small></td>` : ""}
  <td class="photo"><a href="${escape(relForWeb)}" target="_blank"><img src="${escape(relForWeb)}" loading="lazy" /></a></td>
  <td class="meta">
    <div class="fname"><code>${escape(fname)}</code></div>
    <div class="size">${fmtSize(bytes)}</div>
    ${m ? `<div class="src"><strong>Source:</strong> <a href="${escape(m.url)}" target="_blank">${escape(m.url.length > 80 ? m.url.slice(0, 77) + "..." : m.url)}</a></div>` : '<div class="src no-src">(no manifest entry — was scraped before manifest tracking)</div>'}
    ${flags.length > 0 ? `<div class="flags">${flags.map((f) => `<span class="flag">${escape(f)}</span>`).join(" ")}</div>` : ""}
    ${isSuspicious ? `<details class="fix"><summary>Mark this as bad</summary>
      <pre>// To ban this URL pattern, add to BLOCKED_URL_PATTERNS in
// scripts/fetch-venue-photos.ts:
"${v.id}": [${blockedHint
            .split(", ")
            .filter(Boolean)
            .map((t) => `"${t}"`)
            .join(", ")}],

// Then delete and re-scrape:
rm public/venue-photos/${v.id}-*.{jpg,png,webp,avif}
npx tsx scripts/fetch-venue-photos.ts --venue=${v.id}</pre>
    </details>` : ""}
  </td>
</tr>`);
    }
  }

  const html = `<!doctype html>
<meta charset="utf-8" />
<title>Venue photo audit</title>
<style>
  body { font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
         max-width: 1200px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; }
  h1 { margin: 0 0 0.5rem; font-weight: 600; }
  .summary { background: #f4ede1; border: 1px solid #d9cdbf; padding: 1rem 1.25rem;
             border-radius: 8px; margin-bottom: 1.5rem; }
  .summary strong { color: #5c4a35; }
  .legend { font-size: 13px; color: #555; }
  .legend .swatch { display: inline-block; width: 12px; height: 12px;
                    vertical-align: middle; border-radius: 2px; margin-right: 4px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { padding: 0.75rem; border-bottom: 1px solid #eee; vertical-align: top;
           text-align: left; }
  tr.suspicious { background: #fff4e6; }
  tr.suspicious .photo { box-shadow: inset 4px 0 0 #d97706; }
  tr.no-photo { background: #f8f8f8; color: #666; font-style: italic; }
  td.vid { font-family: ui-monospace, monospace; font-size: 12px; color: #888;
           width: 180px; }
  td.vname { width: 200px; font-weight: 500; }
  td.vname small { color: #888; font-weight: 400; }
  td.photo { width: 180px; }
  td.photo img { max-width: 160px; max-height: 120px; border-radius: 4px;
                 border: 1px solid #ddd; object-fit: cover; }
  td.meta { font-size: 13px; }
  td.meta .fname code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
  td.meta .size { color: #666; margin: 4px 0; }
  td.meta .src { margin: 4px 0; word-break: break-all; }
  td.meta .src a { color: #5c4a35; }
  td.meta .flags { margin-top: 6px; }
  td.meta .flag { display: inline-block; background: #fef3c7; color: #92400e;
                  padding: 2px 8px; border-radius: 10px; margin-right: 4px;
                  margin-bottom: 4px; font-size: 12px; }
  td.empty { color: #888; font-style: italic; }
  details.fix { margin-top: 8px; }
  details.fix summary { cursor: pointer; color: #5c4a35; font-weight: 500; }
  details.fix pre { background: #1a1a1a; color: #f4ede1; padding: 12px;
                    border-radius: 4px; font-size: 12px; overflow-x: auto;
                    margin-top: 8px; }
</style>

<h1>Venue photo audit</h1>
<div class="summary">
  <div><strong>${venuesWithPhotos}</strong> / ${totalVenues} venues have at least one local photo (${totalPhotos} photos total).</div>
  <div><strong>${suspiciousCount}</strong> photo${suspiciousCount === 1 ? "" : "s"} flagged for review (small file, or source URL contains poster/floorplan/etc.).</div>
  <div class="legend" style="margin-top: 8px;">
    <span class="swatch" style="background: #fff4e6; border: 1px solid #d97706;"></span> Suspicious — click "Mark this as bad" to copy a fix snippet.
    <span style="margin-left: 1rem;" class="swatch" style="background: #f8f8f8;"></span> No local photo — falls back to icon hero.
  </div>
  <div class="legend" style="margin-top: 8px;">Generated ${new Date().toISOString()}. Re-run <code>npx tsx scripts/audit-venue-photos.ts</code> after the next scrape.</div>
</div>

<table>
  <thead>
    <tr><th>venue.id</th><th>Name / district</th><th>Photo</th><th>Source &amp; flags</th></tr>
  </thead>
  <tbody>
    ${rows.join("\n")}
  </tbody>
</table>
`;

  await fs.writeFile(OUTPUT_FILE, html);
  console.log(`\nWrote ${path.relative(ROOT, OUTPUT_FILE)}`);
  console.log(
    `  - ${venuesWithPhotos}/${totalVenues} venues have photos (${totalPhotos} total)`,
  );
  console.log(`  - ${suspiciousCount} flagged for review`);
  console.log(`\nOpen with: open ${path.relative(process.cwd(), OUTPUT_FILE)}\n`);
}

// Run only when invoked directly.
const isMainModule =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMainModule) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
