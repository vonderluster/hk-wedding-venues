/**
 * Scrapes Google Maps star rating + review count for each venue and prints
 * a JSON object ready to paste into venues.ts.
 *
 * Run: npx tsx scripts/fetch-gmaps-ratings.ts
 */

import { chromium } from "playwright";

const VENUES: { id: string; query: string }[] = [
  { id: "rosewood-hk", query: "Rosewood Hong Kong hotel" },
  { id: "peninsula-hk", query: "The Peninsula Hong Kong hotel" },
  { id: "repulse-bay", query: "The Repulse Bay Hong Kong restaurant" },
  { id: "hullett-house", query: "Hullett House 1881 Heritage Hong Kong" },
  { id: "verandah", query: "The Verandah Repulse Bay Hong Kong restaurant" },
  { id: "hyatt-shatin", query: "Hyatt Regency Sha Tin Hong Kong" },
  { id: "gold-coast-yacht", query: "Gold Coast Yacht Country Club Hong Kong" },
  { id: "hong-kong-gold-coast-hotel", query: "Hong Kong Gold Coast Hotel" },
  { id: "clearwater-bay", query: "Clearwater Bay Golf Country Club Hong Kong" },
  { id: "st-johns-cathedral", query: "St John's Cathedral Hong Kong" },
  { id: "mira", query: "The Mira Hong Kong hotel" },
  { id: "auberge-discovery-bay", query: "Auberge Discovery Bay Hong Kong" },
  { id: "hotel-icon", query: "Hotel ICON Hong Kong" },
  { id: "island-shangri-la", query: "Island Shangri-La Hong Kong" },
];

async function fetchRating(
  page: import("playwright").Page,
  query: string,
): Promise<{ rating: number; reviewCount: number } | null> {
  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });

  // Wait for the place info panel or the first result
  await page
    .waitForSelector('[class*="fontDisplayLarge"], .F7nice, [aria-label*="stars"]', {
      timeout: 8_000,
    })
    .catch(() => {});

  await page.waitForTimeout(2_000);

  // Try several selectors Google Maps uses for the rating
  const rating = await page.evaluate(() => {
    // Rating span — Google uses fontDisplayLarge or F7nice
    const selectors = [
      ".fontDisplayLarge",
      ".F7nice span",
      '[aria-label*=" stars"]',
      'span[aria-hidden="true"]',
    ];
    for (const sel of selectors) {
      for (const el of Array.from(document.querySelectorAll(sel))) {
        const txt = el.textContent?.trim() ?? "";
        const match = txt.match(/^(\d\.\d)$/);
        if (match) return parseFloat(match[1]);
      }
    }
    // aria-label on the star container
    const starEl = document.querySelector('[aria-label*="stars"]');
    if (starEl) {
      const m = starEl.getAttribute("aria-label")?.match(/([\d.]+)\s*stars?/i);
      if (m) return parseFloat(m[1]);
    }
    return null;
  });

  const reviewCount = await page.evaluate(() => {
    // Review count button — aria-label like "1,234 reviews"
    const btn = document.querySelector(
      '[aria-label*="reviews"], [data-value*="reviews"]',
    );
    if (btn) {
      const m =
        btn.getAttribute("aria-label")?.match(/([\d,]+)\s*reviews?/i) ??
        btn.textContent?.match(/([\d,]+)\s*reviews?/i);
      if (m) return parseInt(m[1].replace(/,/g, ""), 10);
    }
    // Fallback: any text node that looks like "(1,234)"
    const all = Array.from(document.querySelectorAll("span, button")).map(
      (el) => el.textContent ?? "",
    );
    for (const t of all) {
      const m = t.match(/^\(([\d,]+)\)$/);
      if (m) return parseInt(m[1].replace(/,/g, ""), 10);
    }
    return null;
  });

  if (rating === null) return null;
  return { rating, reviewCount: reviewCount ?? 0 };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "en-US",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  const results: Record<string, { rating: number; reviewCount: number }> = {};

  for (const venue of VENUES) {
    process.stdout.write(`Fetching ${venue.id}... `);
    try {
      const data = await fetchRating(page, venue.query);
      if (data) {
        results[venue.id] = data;
        console.log(`✓ ${data.rating} (${data.reviewCount} reviews)`);
      } else {
        console.log("✗ not found");
      }
    } catch (err) {
      console.log(`✗ error: ${(err as Error).message.slice(0, 60)}`);
    }
    await page.waitForTimeout(1_500);
  }

  await browser.close();

  console.log("\n--- Results ---");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
