/**
 * Self-host venue photos under public/venue-photos/<venue-id>-<n>.<ext>.
 *
 * For each venue in src/data/venues.ts, this script tries a list of candidate
 * source URLs in priority order:
 *   1. Hand-picked Wikimedia Commons filenames (defined below in HAND_PICKED).
 *   2. Wikimedia / lcsd / official URLs already present in the venue's images[].
 *
 * Each successful download is saved as `public/venue-photos/<venue-id>-1.jpg`
 * (or .png based on content-type). If a 2nd valid candidate exists, it goes
 * to `<venue-id>-2.jpg`, etc. — up to MAX_PER_VENUE per venue.
 *
 * Robustness:
 *   - Sets a real User-Agent (Wikimedia rejects requests without one and
 *     returns an HTML throttle page that looks like a JPEG to a naive client).
 *   - Follows redirects (Special:FilePath returns a 302).
 *   - Verifies content-type starts with "image/" and size > MIN_VALID_BYTES.
 *   - Idempotent: skips if a valid file already exists at the target path.
 *
 * After running, also rewrites src/data/venues.ts to prepend the new local
 * paths to each venue's images array (idempotent — won't double-add).
 *
 * Usage:
 *   npx tsx scripts/fetch-venue-photos.ts                # download + rewrite
 *   npx tsx scripts/fetch-venue-photos.ts --download     # download only
 *   npx tsx scripts/fetch-venue-photos.ts --rewrite      # rewrite only
 *   npx tsx scripts/fetch-venue-photos.ts --venue=<id>   # single venue
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
const VENUES_FILE = path.join(ROOT, "src", "data", "venues.ts");
const MAX_PER_VENUE = 2;
const MIN_VALID_BYTES = 10_000;
const USER_AGENT =
  "hk-wedding-venues/1.0 (https://github.com/vonderluster/hk-wedding-venues; yyychanhk@gmail.com)";

/** Wikimedia Commons filenames (or full URLs) per venue.id, in priority order.
 *  The Special:FilePath endpoint accepts the bare filename and 302s to
 *  upload.wikimedia.org with the right hash prefix. */
const HAND_PICKED: Record<string, string[]> = {
  // Existing venues — supplement / replace
  "gold-coast-yacht": ["Gold_Coast_Dolphin_Square_in_Hong_Kong.JPG"],
  "clearwater-bay": ["The_Clearwater_Bay_Golf_&_Country_Club_201407-1.jpg"],
  mira: ["The_Mira.jpg"],
  "auberge-discovery-bay": [
    "Auberge_Discovery_Bay_Hong_Kong_(second_revised).jpg",
    "Auberge_Discovery_Bay_Hong_Kong_Lobby.jpg",
  ],
  "hotel-icon": ["Hotel_ICON_201107.jpg", "Hotel_ICON_Green_View1_201106.jpg"],
  "upper-house-lawn": ["Pacific_Place_Hong_Kong_2009.jpg"],
  "hk-country-club": ["Deep_Water_Bay_Beach_Hong_Kong.jpg"],
  "crowne-plaza-kowloon-east": ["Tseung_Kwan_O_panorama.jpg"],
  "lcsd-bauhinia-garden": ["Hong_Kong_Park_(Bauhinia_garden).jpg"],
  "lcsd-kowloon-walled-city": [
    "Kowloon_Walled_City_Park_-_Yamen_Building_(2017).jpg",
    "Kowloon_Walled_City_Park_2017.jpg",
  ],
  "lcsd-sai-kung-waterfront": ["Sai_Kung_Waterfront_Park.jpg"],
  "lcsd-tai-po-waterfront": ["Tai_Po_Waterfront_Park.jpg"],
  "lcsd-lei-yue-mun": ["Lei_Yue_Mun_Park_and_Holiday_Village.jpg"],
  "lcsd-repulse-bay-beach": ["Repulse_Bay_Beach_2014.jpg"],
  "my-seasons-my-garden": ["Caroline_Hill_Hong_Kong.jpg"],
  "the-air-the-one": ["The_ONE_(Hong_Kong).jpg"],
  "hk-disneyland-hotel": [
    "Hong_Kong_Disneyland_Hotel_2014.jpg",
    "Hong_Kong_Disneyland_Hotel.jpg",
  ],
  "grand-hyatt-poolhouse": ["Grand_Hyatt_Hong_Kong.jpg"],

  // New venues
  "mandarin-oriental-hong-kong": [
    "Mandarin_Oriental,_Hong_Kong_2018.jpg",
    "Mandarin_Oriental_Hong_Kong.jpg",
    "HK_Mandarin_Oriental_The_Hotel_2010.jpg",
  ],
  "four-seasons-hong-kong": [
    "Two_International_Finance_Centre.jpg",
    "IFC_Hong_Kong_2008.jpg",
    "International_Finance_Centre_Hong_Kong.jpg",
  ],
  "conrad-hong-kong": [
    "Pacific_Place_Hong_Kong_2009.jpg",
    "Pacific_Place_Hong_Kong.jpg",
  ],
  "ritz-carlton-hong-kong": [
    "International_Commerce_Centre_201101.jpg",
    "ICC_Hong_Kong_2010.jpg",
    "International_Commerce_Centre_Hong_Kong.jpg",
  ],
  "w-hong-kong": ["W_Hotel_Hong_Kong_2010.jpg", "W_Hong_Kong.jpg"],
  "the-murray-hong-kong": [
    "Murray_Building_2017.jpg",
    "The_Murray_Hong_Kong.jpg",
    "HK_Murray_Building_201006.jpg",
  ],
  "intercontinental-grand-stanford": [
    "Tsim_Sha_Tsui_East_Hong_Kong.jpg",
    "Mody_Road_Tsim_Sha_Tsui_East.jpg",
  ],
  "kerry-hotel-hong-kong": [
    "Kerry_Hotel_Hong_Kong.jpg",
    "Hung_Hom_Bay_Hong_Kong.jpg",
  ],
  "regent-hong-kong": [
    "InterContinental_Hong_Kong_2008.jpg",
    "Regent_Hong_Kong.jpg",
  ],
  "kowloon-shangri-la": [
    "Kowloon_Shangri-La_Hotel.jpg",
    "Tsim_Sha_Tsui_East_Hong_Kong.jpg",
  ],
  "cordis-hong-kong": [
    "HK_Mongkok_Cordis_Hong_Kong_2017.jpg",
    "Langham_Place_Hong_Kong.jpg",
    "Cordis_Hong_Kong.jpg",
  ],
  "hyatt-regency-tsim-sha-tsui": [
    "K11_(Hong_Kong).jpg",
    "Hyatt_Regency_Hong_Kong_TST.jpg",
  ],
  "the-royal-garden": ["The_Royal_Garden_Hotel_Hong_Kong.jpg"],
  "royal-hong-kong-yacht-club": [
    "Kellett_Island,_Hong_Kong.jpg",
    "Royal_Hong_Kong_Yacht_Club.jpg",
    "Causeway_Bay_typhoon_shelter.jpg",
  ],
  "aberdeen-marina-club": [
    "Aberdeen_Marina_Club.jpg",
    "Aberdeen_Harbour_Hong_Kong.jpg",
    "Aberdeen_typhoon_shelter.jpg",
  ],
  "hebe-haven-yacht-club": [
    "Hebe_Haven_Hong_Kong.jpg",
    "Pak_Sha_Wan_Hong_Kong.jpg",
    "Sai_Kung_Hong_Kong.jpg",
  ],
};

interface DownloadResult {
  ok: boolean;
  path?: string;
  ext?: string;
  bytes?: number;
  error?: string;
}

function toFilePathUrl(filenameOrUrl: string): string {
  if (filenameOrUrl.startsWith("http")) return filenameOrUrl;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    filenameOrUrl,
  )}`;
}

async function tryDownload(
  url: string,
  destNoExt: string,
): Promise<DownloadResult> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) {
      return { ok: false, error: `non-image content-type: ${ct}` };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < MIN_VALID_BYTES) {
      return { ok: false, error: `too small: ${buf.length} bytes` };
    }
    const ext = ct.includes("png")
      ? "png"
      : ct.includes("webp")
        ? "webp"
        : "jpg";
    const dest = `${destNoExt}.${ext}`;
    await fs.writeFile(dest, buf);
    return { ok: true, path: dest, ext, bytes: buf.length };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function existingValidFile(idBase: string): string | null {
  for (const ext of ["jpg", "png", "webp", "JPG"]) {
    const p = `${idBase}.${ext}`;
    if (existsSync(p)) {
      const size = statSync(p).size;
      if (size >= MIN_VALID_BYTES) return p;
    }
  }
  return null;
}

async function downloadVenue(venueId: string): Promise<string[]> {
  const venue = venues.find((v) => v.id === venueId);
  if (!venue) {
    console.log(`  [skip] no venue with id=${venueId}`);
    return [];
  }

  // Build candidate URL list: hand-picked first, then any wikimedia/lcsd URL
  // already in the venue's images array.
  const handPicked = (HAND_PICKED[venueId] ?? []).map(toFilePathUrl);
  const existingExternal = venue.images
    .map((img) => img.url)
    .filter(
      (u) =>
        (u.includes("upload.wikimedia.org") ||
          u.includes("commons.wikimedia.org") ||
          u.includes("lcsd.gov.hk") ||
          u.includes("rghk.com.hk") ||
          u.includes("fwdhouse1881.com") ||
          u.includes("countryclub.hk")) &&
        !u.startsWith("/"),
    );
  const candidates = Array.from(new Set([...handPicked, ...existingExternal]));

  if (candidates.length === 0) {
    console.log(`  [no-candidates] ${venueId}`);
    return [];
  }

  const writtenPaths: string[] = [];
  let slot = 1;
  for (const url of candidates) {
    if (slot > MAX_PER_VENUE) break;
    const idBase = path.join(PHOTOS_DIR, `${venueId}-${slot}`);
    const existing = existingValidFile(idBase);
    if (existing) {
      const rel = `/venue-photos/${path.basename(existing)}`;
      writtenPaths.push(rel);
      slot++;
      continue;
    }
    process.stdout.write(`  ${venueId} slot ${slot}: ${url} … `);
    const r = await tryDownload(url, idBase);
    if (r.ok && r.path) {
      console.log(`OK (${(r.bytes! / 1024).toFixed(1)} KB, .${r.ext})`);
      writtenPaths.push(`/venue-photos/${path.basename(r.path)}`);
      slot++;
    } else {
      console.log(`fail (${r.error})`);
    }
  }
  return writtenPaths;
}

async function rewriteVenuesTs(
  localPathsByVenue: Record<string, string[]>,
): Promise<number> {
  let src = await fs.readFile(VENUES_FILE, "utf8");
  let modified = 0;

  for (const [venueId, paths] of Object.entries(localPathsByVenue)) {
    if (paths.length === 0) continue;
    const venue = venues.find((v) => v.id === venueId);
    if (!venue) continue;

    const idMarker = `    id: "${venueId}",`;
    const idIdx = src.indexOf(idMarker);
    if (idIdx === -1) continue;
    const imagesIdx = src.indexOf("    images: [", idIdx);
    if (imagesIdx === -1) continue;
    const insertIdx = src.indexOf("\n", imagesIdx) + 1;

    // idempotency: check if the first local path is already at the top of array
    const first = paths[0];
    const peek = src.slice(insertIdx, insertIdx + 300);
    if (peek.includes(first)) continue;

    const blocks = paths
      .map(
        (p, i) =>
          `      {\n        url: "${p}",\n        kind: "${
            i === 0 ? "exterior" : "interior"
          }",\n        caption: "${venue.name}${i === 0 ? "" : " (interior)"}",\n      },\n`,
      )
      .join("");
    src = src.slice(0, insertIdx) + blocks + src.slice(insertIdx);
    modified++;
  }

  await fs.writeFile(VENUES_FILE, src);
  return modified;
}

async function main() {
  const argv = process.argv.slice(2);
  const mode = argv.includes("--rewrite")
    ? "rewrite"
    : argv.includes("--download")
      ? "download"
      : "both";
  const onlyVenue = argv.find((a) => a.startsWith("--venue="))?.split("=")[1];

  await fs.mkdir(PHOTOS_DIR, { recursive: true });

  const targetVenues = onlyVenue
    ? venues.filter((v) => v.id === onlyVenue)
    : venues;

  console.log(
    `\nfetch-venue-photos: ${targetVenues.length} venues, mode=${mode}\n`,
  );

  const localPathsByVenue: Record<string, string[]> = {};

  if (mode !== "rewrite") {
    for (const v of targetVenues) {
      const paths = await downloadVenue(v.id);
      if (paths.length > 0) localPathsByVenue[v.id] = paths;
    }
    const okCount = Object.values(localPathsByVenue).filter(
      (p) => p.length > 0,
    ).length;
    console.log(`\nDownload phase complete: ${okCount}/${targetVenues.length} venues have at least one local image.\n`);
  }

  if (mode !== "download") {
    // If we skipped download, gather what's already on disk
    if (mode === "rewrite") {
      for (const v of targetVenues) {
        const local: string[] = [];
        for (let i = 1; i <= MAX_PER_VENUE; i++) {
          const idBase = path.join(PHOTOS_DIR, `${v.id}-${i}`);
          const existing = existingValidFile(idBase);
          if (existing) local.push(`/venue-photos/${path.basename(existing)}`);
        }
        if (local.length > 0) localPathsByVenue[v.id] = local;
      }
    }
    const n = await rewriteVenuesTs(localPathsByVenue);
    console.log(`Rewrote venues.ts: prepended local paths to ${n} venue(s).`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
