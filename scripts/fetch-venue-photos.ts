/**
 * Self-host venue photos under public/venue-photos/<venue-id>-<n>.<ext>.
 *
 * For each venue in src/data/venues.ts, this script tries candidate sources
 * in priority order:
 *   1. Hand-picked Wikimedia Commons filenames (defined below in HAND_PICKED).
 *   2. Hand-picked official wedding/event pages scraped for og:image and
 *      hero gallery <img>/data-src/CSS background-image URLs (OFFICIAL_PAGES).
 *      Falls back to the venue.enquiryUrl if no curated page is provided.
 *   3. Wikimedia / lcsd / official URLs already present in venue.images[].
 *
 * Each successful download is saved as `public/venue-photos/<venue-id>-1.jpg`
 * (or .png/.webp based on content-type). Up to MAX_PER_VENUE per venue.
 *
 * Robustness:
 *   - Two User-Agent strings: project UA for Wikimedia (required by their
 *     policy), browser UA for hotel/marketing sites (which block bots).
 *   - Follows redirects (Special:FilePath and CDN redirects).
 *   - Verifies content-type starts with "image/" and size > MIN_VALID_BYTES.
 *   - Filters out logos, icons, sprites, placeholders, and pixel-tracking gifs.
 *   - Idempotent: skips if a valid file already exists at the target path.
 *
 * After downloading, rewrites src/data/venues.ts to prepend the new local
 * paths to each venue's images array (idempotent — won't double-add).
 *
 * Usage:
 *   npx tsx scripts/fetch-venue-photos.ts                # download + rewrite
 *   npx tsx scripts/fetch-venue-photos.ts --download     # download only
 *   npx tsx scripts/fetch-venue-photos.ts --rewrite      # rewrite only
 *   npx tsx scripts/fetch-venue-photos.ts --venue=<id>   # single venue
 *   npx tsx scripts/fetch-venue-photos.ts --skip-scrape  # only Wikimedia
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
/** Tracks which source URL each saved photo came from. Persisted to
 *  public/venue-photos/_manifest.json so you can audit what the scraper
 *  picked and add bad patterns to BLOCKED_URL_PATTERNS. */
const MANIFEST_FILE = path.join(PHOTOS_DIR, "_manifest.json");
type Manifest = Record<string, { url: string; bytes: number; ts: string }>;
const MAX_PER_VENUE = 2;
// Real venue hero photos are essentially always >50 KB. Floor-plan diagrams,
// logos, and small thumbnails tend to be <30 KB. Setting the threshold at
// 50 KB filters most of the obvious junk without losing legitimate photos.
const MIN_VALID_BYTES = 50_000;
const USER_AGENT =
  "hk-wedding-venues/1.0 (https://github.com/vonderluster/hk-wedding-venues; yyychanhk@gmail.com)";
/** Browser-like UA for marketing sites that block project / curl-style UAs. */
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";

/** Per-venue list of marketing/wedding pages to scrape. The script will also
 *  fall back to venue.enquiryUrl automatically when no entry exists here. */
const OFFICIAL_PAGES: Record<string, string[]> = {
  "w-hong-kong": [
    "https://www.marriott.com/zh-hk/hotels/hkgwh-w-hong-kong/events/",
    "https://www.weddinghk.hk/w-hong-kong-offer/",
  ],
  "mandarin-oriental-hong-kong": [
    "https://www.mandarinoriental.com/en/hong-kong/victoria-harbour/celebrate",
    "https://www.weddinghk.hk/mandarin-oriental-hong-kong-offer/",
  ],
  "four-seasons-hong-kong": [
    "https://www.fourseasons.com/hongkong/weddings/",
    "https://www.weddinghk.hk/four-seasons-hotel-hong-kong-offer/",
  ],
  "conrad-hong-kong": [
    "https://www.hilton.com/en/hotels/hkghcci-conrad-hong-kong/events/",
    "https://www.weddinghk.hk/conrad-hong-kong-offer/",
  ],
  "ritz-carlton-hong-kong": [
    "https://www.ritzcarlton.com/en/hotels/hkgkw-the-ritz-carlton-hong-kong/weddings/",
    "https://www.weddinghk.hk/the-ritz-carlton-hong-kong-offer/",
  ],
  "the-murray-hong-kong": [
    "https://www.niccolohotels.com/en/the_murray_hong_kong/celebrations.html",
    "https://www.weddinghk.hk/the-murray-hong-kong-offer/",
  ],
  "intercontinental-grand-stanford": [
    "https://hongkong.intercontinental.com/celebrate/weddings/",
    "https://www.weddinghk.hk/intercontinental-grand-stanford-hong-kong-offer/",
  ],
  "kerry-hotel-hong-kong": [
    "https://www.shangri-la.com/hongkong/kerry/weddings-celebrations/",
    "https://www.weddinghk.hk/kerry-hotel-hong-kong-offer/",
  ],
  "regent-hong-kong": [
    "https://www.regenthotels.com/regent-hong-kong/celebrations/weddings",
    "https://www.weddinghk.hk/regent-hong-kong-offer/",
  ],
  "kowloon-shangri-la": [
    "https://www.shangri-la.com/hongkong/kowloonshangrila/weddings-celebrations/",
    "https://www.weddinghk.hk/kowloon-shangri-la-offer/",
  ],
  "cordis-hong-kong": [
    "https://www.cordishotels.com/en/hong-kong/weddings/",
    "https://www.weddinghk.hk/cordis-hong-kong-offer/",
  ],
  "hyatt-regency-tsim-sha-tsui": [
    "https://www.hyatt.com/hyatt-regency/en-US/honhr-hyatt-regency-hong-kong-tsim-sha-tsui/weddings",
    "https://www.weddinghk.hk/hyatt-regency-hong-kong-tsim-sha-tsui-offer/",
  ],
  "the-royal-garden": [
    "https://www.rghk.com.hk/en/meetings-weddings/weddings.php",
    "https://www.weddinghk.hk/the-royal-garden-offer/",
  ],
  "royal-hong-kong-yacht-club": [
    "https://www.rhkyc.org.hk/dining/private-events/banquet",
  ],
  "aberdeen-marina-club": ["https://aberdeenmarinaclub.com/wedding.php"],
  "hebe-haven-yacht-club": ["https://www.hhyc.org.hk/"],
  // Existing venues — still useful to refresh
  mira: ["https://www.themirahotel.com/en/celebrate/weddings"],
  "auberge-discovery-bay": [
    "https://www.aubergediscoverybay.com/en/celebrations/weddings",
  ],
  "hotel-icon": ["https://www.hotel-icon.com/wedding"],
  "upper-house-lawn": ["https://www.upperhouse.com/en/Celebrations/Weddings"],
  "hk-country-club": ["https://www.countryclub.hk/"],
  "crowne-plaza-kowloon-east": [
    "https://www.ihg.com/crowneplaza/hotels/us/en/hong-kong/hkgke/hoteldetail",
  ],
  "hk-disneyland-hotel": [
    "https://www.hongkongdisneyland.com/hotels/hong-kong-disneyland-hotel/weddings/",
  ],
  "grand-hyatt-poolhouse": [
    "https://www.hyatt.com/grand-hyatt/en-US/hkggh-grand-hyatt-hong-kong/weddings",
  ],
};

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
  // Wikimedia requires a project UA. Marketing CDNs prefer a browser UA.
  const isWikimedia =
    url.includes("wikimedia.org") || url.includes("commons.wikimedia.org");
  const ua = isWikimedia ? USER_AGENT : BROWSER_UA;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": ua,
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",
      },
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
        : ct.includes("avif")
          ? "avif"
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

/** Resolve a possibly-relative URL against the page it was found on. */
function absoluteUrl(pageUrl: string, ref: string): string | null {
  try {
    return new URL(ref, pageUrl).href;
  } catch {
    return null;
  }
}

/** Heuristic: skip URLs that are likely logos / icons / placeholders / pixel
 *  trackers / event posters / floor-plan diagrams, and require an image-ish
 *  file extension. */
const IMG_EXT_RE = /\.(jpe?g|png|webp|avif)(\?|$|#)/i;
const SKIP_HINTS = [
  // UI furniture
  "logo",
  "favicon",
  "sprite",
  "placeholder",
  "blank",
  "transparent",
  "pixel",
  "1x1",
  "spacer",
  "icon-",
  "/icons/",
  "social",
  "/avatar",
  // Event posters / flyers / marketing collateral (NOT what we want as hero)
  "poster",
  "flyer",
  "campaign",
  "fundraiser",
  "charity",
  "promo-",
  "newsletter",
  "press-release",
  // Floor-plan diagrams and capacity charts (cropped up in Ritz-Carlton scrape)
  "floorplan",
  "floor-plan",
  "floor_plan",
  "seating-chart",
  "seating_chart",
  "diagram",
  "schematic",
  "layout-",
  "_layout",
  "/layout/",
  "capacity-chart",
  // Generic thumbnails
  "thumb-",
  "/thumb/",
  "_thumb",
  "-150x",
  "-200x",
  "-300x",
];
function looksLikeRealPhoto(url: string, venueId?: string): boolean {
  if (!IMG_EXT_RE.test(url)) return false;
  const lower = url.toLowerCase();
  if (SKIP_HINTS.some((h) => lower.includes(h))) return false;
  // Per-venue denylist for stubborn cases (event posters from a particular
  // hotel's news feed, etc.). Add patterns under BLOCKED_URL_PATTERNS below.
  if (venueId) {
    const blocked = BLOCKED_URL_PATTERNS[venueId];
    if (blocked && blocked.some((p) => lower.includes(p.toLowerCase()))) {
      return false;
    }
  }
  return true;
}

/** Per-venue URL substrings to block during scraping. Use when a venue's
 *  official site keeps offering the same wrong image (e.g. a recurring event
 *  poster on a yacht club's news feed). Add the offending word(s) here and
 *  re-run the scraper for that venue. */
const BLOCKED_URL_PATTERNS: Record<string, string[]> = {
  // Hebe Haven Yacht Club's official Facebook feed promotes the annual
  // 24-hour charity dinghy race; the scraper kept picking the event poster
  // over actual clubhouse photos.
  "hebe-haven-yacht-club": ["dinghy", "race", "regatta", "24-hour", "24hour"],
  // Ritz-Carlton's wedding page leads with table-layout diagrams.
  "ritz-carlton-hong-kong": [
    "floorplan",
    "floor-plan",
    "layout",
    "table-setup",
    "seating",
  ],
};

/** Explicit URL overrides per venue — tried BEFORE any scraping. Use this
 *  when you have a specific known-good photo URL (from the venue's media kit,
 *  a press article, a Wikimedia file, etc.) that should be the hero photo.
 *  The scraper still attempts these with the same content-type + min-size
 *  validation, so a bad URL here won't break anything. */
const OVERRIDE_IMAGES: Record<string, string[]> = {
  // Add entries like:
  //   "venue-id": [
  //     "https://example.com/path/to/hero.jpg",
  //     "https://example.com/path/to/ballroom.jpg",
  //   ],
};

/** Bonus score for URLs that hint at the kind of image we want as a hero. */
const PRIORITY_HINTS = [
  "wedding",
  "ballroom",
  "ceremony",
  "banquet",
  "celebrat",
  "hero",
  "gallery",
  "exterior",
  "facade",
  "lobby",
];
function priorityScore(url: string): number {
  const lower = url.toLowerCase();
  return PRIORITY_HINTS.reduce(
    (acc, h) => (lower.includes(h) ? acc + 1 : acc),
    0,
  );
}

/** Fetch an HTML page and pull every plausible photo URL out of it. */
async function scrapeImagesFromPage(
  pageUrl: string,
  venueId?: string,
): Promise<string[]> {
  let html: string;
  try {
    const res = await fetch(pageUrl, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,zh-HK;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      console.log(`    [scrape-fail] ${pageUrl} HTTP ${res.status}`);
      return [];
    }
    html = await res.text();
  } catch (e) {
    console.log(
      `    [scrape-fail] ${pageUrl} ${e instanceof Error ? e.message : e}`,
    );
    return [];
  }

  const found: string[] = [];

  // og:image and twitter:image — the share image, almost always a real photo.
  const metaMatches = html.matchAll(
    /<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["'][^>]+content=["']([^"']+)["']/gi,
  );
  for (const m of metaMatches) {
    const abs = absoluteUrl(pageUrl, m[1]);
    if (abs) found.push(abs);
  }
  // also reverse-order (content first, then property)
  const metaRev = html.matchAll(
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["']/gi,
  );
  for (const m of metaRev) {
    const abs = absoluteUrl(pageUrl, m[1]);
    if (abs) found.push(abs);
  }

  // <img src> and <img data-src> (the latter for lazy-loading frameworks).
  const imgMatches = html.matchAll(
    /<img[^>]+(?:src|data-src|data-lazy-src|data-original)=["']([^"']+?\.(?:jpe?g|png|webp|avif)[^"']*)["']/gi,
  );
  for (const m of imgMatches) {
    const abs = absoluteUrl(pageUrl, m[1]);
    if (abs) found.push(abs);
  }

  // srcset attribute — pick the largest declared candidate from each.
  const srcsetMatches = html.matchAll(/srcset=["']([^"']+)["']/gi);
  for (const m of srcsetMatches) {
    const candidates = m[1]
      .split(",")
      .map((s) => s.trim().split(/\s+/)[0])
      .filter(Boolean);
    for (const c of candidates) {
      const abs = absoluteUrl(pageUrl, c);
      if (abs) found.push(abs);
    }
  }

  // Inline CSS background-image: url(...)
  const bgMatches = html.matchAll(
    /background-image\s*:\s*url\(\s*["']?([^"')]+?\.(?:jpe?g|png|webp|avif)[^"')]*)["']?\s*\)/gi,
  );
  for (const m of bgMatches) {
    const abs = absoluteUrl(pageUrl, m[1]);
    if (abs) found.push(abs);
  }

  // Filter, dedupe, and sort by priority score (higher hints first).
  const filtered = Array.from(
    new Set(found.filter((u) => looksLikeRealPhoto(u, venueId))),
  );
  filtered.sort((a, b) => priorityScore(b) - priorityScore(a));
  return filtered;
}

async function loadManifest(): Promise<Manifest> {
  try {
    const raw = await fs.readFile(MANIFEST_FILE, "utf8");
    return JSON.parse(raw) as Manifest;
  } catch {
    return {};
  }
}

async function saveManifest(m: Manifest): Promise<void> {
  // Sort keys for stable diffs in git.
  const sorted: Manifest = {};
  for (const k of Object.keys(m).sort()) sorted[k] = m[k];
  await fs.writeFile(MANIFEST_FILE, JSON.stringify(sorted, null, 2) + "\n");
}

async function downloadVenue(
  venueId: string,
  skipScrape: boolean,
  manifest: Manifest,
): Promise<string[]> {
  const venue = venues.find((v) => v.id === venueId);
  if (!venue) {
    console.log(`  [skip] no venue with id=${venueId}`);
    return [];
  }

  // Short-circuit if every slot is already on disk and valid.
  let alreadyAllPresent = true;
  for (let i = 1; i <= MAX_PER_VENUE; i++) {
    if (!existingValidFile(path.join(PHOTOS_DIR, `${venueId}-${i}`))) {
      alreadyAllPresent = false;
      break;
    }
  }
  if (alreadyAllPresent) {
    const out: string[] = [];
    for (let i = 1; i <= MAX_PER_VENUE; i++) {
      const f = existingValidFile(path.join(PHOTOS_DIR, `${venueId}-${i}`));
      if (f) out.push(`/venue-photos/${path.basename(f)}`);
    }
    console.log(`  [cached] ${venueId} (${out.length} slot(s))`);
    return out;
  }

  // 1. Explicit overrides (highest priority — hand-picked known-good URLs).
  const overrides = OVERRIDE_IMAGES[venueId] ?? [];

  // 2. Scrape official wedding pages (hotel-curated, high-res).
  const scrapedUrls: string[] = [];
  if (!skipScrape) {
    const pages = OFFICIAL_PAGES[venueId] ?? [];
    if (pages.length === 0 && venue.enquiryUrl) pages.push(venue.enquiryUrl);
    for (const page of pages) {
      console.log(`  [scrape] ${venueId} ← ${page}`);
      const imgs = await scrapeImagesFromPage(page, venueId);
      if (imgs.length > 0) {
        scrapedUrls.push(...imgs.slice(0, 5)); // cap per page so we don't try 100 URLs
      }
    }
  }

  // 3. Hand-picked Wikimedia Commons filenames.
  const handPicked = (HAND_PICKED[venueId] ?? []).map(toFilePathUrl);

  // 4. Wikimedia / LCSD / official URLs already in the venue.images array.
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

  const candidates = Array.from(
    new Set([...overrides, ...scrapedUrls, ...handPicked, ...existingExternal]),
  ).filter((u) => looksLikeRealPhoto(u, venueId));

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
    const display = url.length > 90 ? url.slice(0, 87) + "..." : url;
    process.stdout.write(`  ${venueId} slot ${slot}: ${display} … `);
    const r = await tryDownload(url, idBase);
    if (r.ok && r.path) {
      console.log(`OK (${(r.bytes! / 1024).toFixed(1)} KB, .${r.ext})`);
      const rel = `/venue-photos/${path.basename(r.path)}`;
      writtenPaths.push(rel);
      manifest[rel] = {
        url,
        bytes: r.bytes!,
        ts: new Date().toISOString(),
      };
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

    // Build the prepend blocks once — used by both the empty-array and the
    // multiline-array branches below.
    const blocks = paths
      .map(
        (p, i) =>
          `      {\n        url: "${p}",\n        kind: "${
            i === 0 ? "exterior" : "interior"
          }",\n        caption: "${venue.name}${i === 0 ? "" : " (interior)"}",\n      },\n`,
      )
      .join("");

    // Case 1: single-line empty array — `    images: [],`
    // Replace it with a multi-line array containing the new blocks.
    const emptyMarker = "    images: [],";
    if (src.startsWith(emptyMarker, imagesIdx)) {
      const replacement = `    images: [\n${blocks}    ],`;
      src =
        src.slice(0, imagesIdx) +
        replacement +
        src.slice(imagesIdx + emptyMarker.length);
      modified++;
      continue;
    }

    // Case 2: multi-line array — insert after the line containing `images: [`.
    const insertIdx = src.indexOf("\n", imagesIdx) + 1;
    // Idempotency: skip if the first local path is already at the top of array.
    const first = paths[0];
    const peek = src.slice(insertIdx, insertIdx + 300);
    if (peek.includes(first)) continue;
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
  const skipScrape = argv.includes("--skip-scrape");
  const onlyVenue = argv.find((a) => a.startsWith("--venue="))?.split("=")[1];

  await fs.mkdir(PHOTOS_DIR, { recursive: true });

  const targetVenues = onlyVenue
    ? venues.filter((v) => v.id === onlyVenue)
    : venues;

  console.log(
    `\nfetch-venue-photos: ${targetVenues.length} venues, mode=${mode}${skipScrape ? ", skip-scrape" : ""}\n`,
  );

  const manifest = await loadManifest();
  const localPathsByVenue: Record<string, string[]> = {};

  if (mode !== "rewrite") {
    for (const v of targetVenues) {
      const paths = await downloadVenue(v.id, skipScrape, manifest);
      if (paths.length > 0) localPathsByVenue[v.id] = paths;
    }
    await saveManifest(manifest);
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

// Only execute when run directly (e.g. `npx tsx scripts/fetch-venue-photos.ts`).
// Importing this module — for example to type-check — must not trigger the
// download + rewrite pipeline. Compares the resolved entry path against this
// file's URL because tsx/ESM doesn't expose require.main.
const isMainModule =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMainModule) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
