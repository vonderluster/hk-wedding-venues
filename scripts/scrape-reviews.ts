/**
 * Forum review scraper pipeline.
 *
 * Flow: thread discovery -> post fetch -> venue-mention filter -> Claude enrichment
 * (translate + summarize + sentiment + keywords) -> write src/data/forumReviews.ts.
 *
 * Run: ANTHROPIC_API_KEY=sk-... npx tsx scripts/scrape-reviews.ts <venueId>
 *
 * Currently only Baby-Kingdom is wired up. Add more ForumAdapter entries to
 * extend to ESDlife / WeddingHK / Hey Choices / Bespoke Wedding.
 */

import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { venues } from "../src/data/venues";
import type {
  ForumReview,
  ForumSource,
  Sentiment,
  VenueForumReviews,
} from "../src/data/forumReviews";

interface RawPost {
  author: string;
  date: string;
  text: string;
  threadId: string;
  threadUrl: string;
  source: ForumSource;
}

interface ForumAdapter {
  source: ForumSource;
  discoverThreads(venueQueries: string[]): Promise<string[]>;
  fetchThread(url: string): Promise<RawPost[]>;
}

const MAX_REVIEWS_PER_VENUE = 50;
const CLAUDE_MODEL = "claude-opus-4-7";

const babyKingdomAdapter: ForumAdapter = {
  source: "baby-kingdom",
  async discoverThreads(venueQueries) {
    // TODO: read baby-kingdom.com sitemap (published in robots.txt) and
    // return thread URLs whose titles contain any of venueQueries.
    // robots.txt disallows /search.php so do NOT call site search.
    void venueQueries;
    return [];
  },
  async fetchThread(url) {
    // TODO: fetch url, parse HTML (each post is in <div class="pct">...</div>
    // within table rows keyed by .plhin), return RawPost[]. Respect a 2s delay
    // between requests.
    void url;
    return [];
  },
};

const ADAPTERS: ForumAdapter[] = [
  babyKingdomAdapter,
  // esdlifeAdapter,
  // weddinghkAdapter,
  // heychoicesAdapter,
  // bespokeWeddingAdapter,
];

function venueSearchQueries(venueName: string): string[] {
  const map: Record<string, string[]> = {
    "The Mira Hong Kong": ["The Mira", "Mira Hotel", "美麗華酒店", "美麗華"],
  };
  return map[venueName] ?? [venueName];
}

function mentionsVenue(text: string, queries: string[]): boolean {
  const lower = text.toLowerCase();
  return queries.some((q) => lower.includes(q.toLowerCase()));
}

interface Enrichment {
  summary: string;
  englishTranslation: string;
  keywords: string[];
  sentiment: Sentiment;
}

async function enrichPost(
  client: Anthropic,
  post: RawPost,
  venueName: string,
): Promise<Enrichment | null> {
  const systemPrompt = [
    "You classify wedding-venue forum posts from Hong Kong.",
    "Output STRICT JSON only, no prose.",
    "Schema: { summary: string (<= 25 words, concrete claim),",
    "  englishTranslation: string (faithful EN translation of original),",
    "  keywords: string[] (3-6 short EN noun phrases about features/issues),",
    "  sentiment: 'positive' | 'neutral' | 'negative' }.",
    "If the post contains no opinion/fact about the venue, respond with null.",
  ].join(" ");

  const user = [
    `Venue: ${venueName}`,
    `Post author: ${post.author}`,
    `Post text: ${post.text}`,
  ].join("\n");

  const resp = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 400,
    system: [
      { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: user }],
  });

  const block = resp.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") return null;
  const raw = block.text.trim();
  if (raw === "null") return null;
  try {
    return JSON.parse(raw) as Enrichment;
  } catch {
    console.warn(`[enrich] bad JSON for post by ${post.author}:`, raw);
    return null;
  }
}

function topKeywords(reviews: ForumReview[], n = 5): string[] {
  const counts = new Map<string, number>();
  for (const r of reviews) {
    for (const kw of r.keywords) {
      counts.set(kw, (counts.get(kw) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([kw]) => kw);
}

async function scrapeVenue(
  client: Anthropic,
  venueId: string,
): Promise<VenueForumReviews> {
  const venue = venues.find((v) => v.id === venueId);
  if (!venue) throw new Error(`Unknown venue id: ${venueId}`);

  const queries = venueSearchQueries(venue.name);
  const rawPosts: RawPost[] = [];

  for (const adapter of ADAPTERS) {
    const threadUrls = await adapter.discoverThreads(queries);
    for (const url of threadUrls) {
      const posts = await adapter.fetchThread(url);
      for (const p of posts) {
        if (mentionsVenue(p.text, queries)) rawPosts.push(p);
      }
    }
  }

  rawPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
  const limited = rawPosts.slice(0, MAX_REVIEWS_PER_VENUE);

  const reviews: ForumReview[] = [];
  for (const post of limited) {
    const enriched = await enrichPost(client, post, venue.name);
    if (!enriched) continue;
    reviews.push({
      author: post.author,
      date: post.date,
      source: post.source,
      threadId: post.threadId,
      threadUrl: post.threadUrl,
      originalText: post.text,
      englishTranslation: enriched.englishTranslation,
      summary: enriched.summary,
      keywords: enriched.keywords,
      sentiment: enriched.sentiment,
    });
  }

  const sentimentBreakdown = {
    positive: reviews.filter((r) => r.sentiment === "positive").length,
    neutral: reviews.filter((r) => r.sentiment === "neutral").length,
    negative: reviews.filter((r) => r.sentiment === "negative").length,
  };

  return {
    venueId,
    reviews,
    topKeywords: topKeywords(reviews),
    sentimentBreakdown,
    lastScrapedAt: new Date().toISOString().slice(0, 10),
  };
}

function writeForumReviewsFile(
  updated: Record<string, VenueForumReviews>,
): void {
  const path = resolve(__dirname, "../src/data/forumReviews.ts");
  const current = readFileSync(path, "utf8");
  const marker = "export const forumReviewsByVenueId";
  const before = current.slice(0, current.indexOf(marker));
  const body = `export const forumReviewsByVenueId: Record<string, VenueForumReviews> = ${JSON.stringify(
    updated,
    null,
    2,
  )};\n`;
  writeFileSync(path, before + body, "utf8");
}

async function main() {
  const venueId = process.argv[2];
  if (!venueId) {
    console.error("Usage: npx tsx scripts/scrape-reviews.ts <venueId>");
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY env var required.");
    process.exit(1);
  }
  const client = new Anthropic();
  const result = await scrapeVenue(client, venueId);
  console.log(
    `[scrape] ${venueId}: ${result.reviews.length} reviews, keywords: ${result.topKeywords.join(", ")}`,
  );
  writeForumReviewsFile({ [venueId]: result });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
