import { useState } from "react";
import type { Venue } from "../data/venues";
import { GUESTS_PER_TABLE } from "../data/venues";
import { formatPrice } from "./VenueCard";

interface Recommendation {
  venueId: string;
  score: number;
  reason: string;
}

interface Props {
  venues: Venue[];
  onSelect: (id: string) => void;
}

const EXAMPLE_PROMPTS = [
  "5-star hotel with harbour view, 28–35 tables",
  "Intimate garden or outdoor ceremony, under 150 guests",
  "MTR accessible, good value, Kowloon side",
  "Unique heritage or church venue, small wedding",
  "Yacht or waterfront, relaxed garden vibe",
];

const SYSTEM = (ctx: string) =>
  `You are an expert Hong Kong wedding venue consultant. \
A couple has described what they are looking for. Rank the best-matching venues from the list below.

Return ONLY a valid JSON array — no markdown, no explanation, no other text. Up to 6 items, ranked best-first:
[{"venueId":"<id>","score":<0-100>,"reason":"<one concise sentence explaining why this is a great match>"}]

Only include venues with score >= 35. If nothing fits well, return an empty array [].

Venues:
${ctx}`;

function buildContext(venues: Venue[]): string {
  return venues
    .map(
      (v) =>
        `id:${v.id} | ${v.name} | ${v.district} | ${v.venueTypes.join("/")}` +
        (v.scenery.length ? ` | views:${v.scenery.join("/")}` : "") +
        ` | ${formatPrice(v.pricePerHead)}` +
        ` | up to ${v.tables[1]} tables (${v.tables[1] * GUESTS_PER_TABLE} guests)` +
        ` | rating:${v.rating}` +
        (v.facilities.length ? ` | ${v.facilities.join(", ")}` : "") +
        (v.transport.mtr
          ? ` | ${v.transport.mtr.station} MTR ${v.transport.mtr.walkMins} min walk`
          : ""),
    )
    .join("\n");
}

function scoreColor(s: number) {
  if (s >= 80) return "bg-emerald-500";
  if (s >= 60) return "bg-amber-400";
  return "bg-orange-400";
}

function scoreLabel(s: number) {
  if (s >= 80) return "Excellent match";
  if (s >= 60) return "Good match";
  return "Partial match";
}

export default function AIRecommender({ venues, onSelect }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState("");

  const search = async (q = prompt) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: SYSTEM(buildContext(venues)),
          messages: [{ role: "user", content: q.trim() }],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message ?? data?.error ?? `Error ${res.status}`);
      }

      const text: string = data.content?.[0]?.text ?? "[]";
      const cleaned = text.replace(/```[a-z]*\n?/gi, "").trim();
      const parsed: Recommendation[] = JSON.parse(cleaned);

      setResults(
        parsed.filter((r) => venues.some((v) => v.id === r.venueId)).slice(0, 6),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const venueById = (id: string) => venues.find((v) => v.id === id);

  const handleChip = (chip: string) => {
    setPrompt(chip);
    search(chip);
  };

  return (
    <div className="bg-white border border-[#D9CDBF] rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-xl shrink-0">✨</span>
        <div>
          <p className="font-display text-base font-semibold text-slate-900 leading-none">
            AI Venue Finder
          </p>
          <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
            Describe what you're looking for — we'll rank the best matches for you
          </p>
        </div>
      </div>

      {/* Search row */}
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && search()}
          placeholder='e.g. "5-star harbour view hotel, 30 tables, budget HK$1,800/head"'
          disabled={loading}
          className="flex-1 border border-[#D9CDBF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 bg-[#FAF7F1] disabled:bg-[#F3EBE0] placeholder:text-slate-400"
        />
        <button
          onClick={() => search()}
          disabled={!prompt.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-blush-600 text-white text-sm font-medium hover:bg-blush-700 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span className="hidden sm:inline">Finding…</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Find matches</span>
              <span className="sm:hidden">→</span>
            </>
          )}
        </button>
      </div>

      {/* Example prompt chips — shown when idle */}
      {!results && !loading && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {EXAMPLE_PROMPTS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              className="text-xs px-2.5 py-1 rounded-full border border-blush-200 text-blush-700 bg-blush-50 hover:bg-blush-100 transition"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-[#E8D9C4] animate-pulse" />
          ))}
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="mt-4">
          {results.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-500">
              No strong matches found — try broadening your requirements.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{results.length}</span>{" "}
                  venue{results.length !== 1 ? "s" : ""} matched your brief
                </p>
                <button
                  onClick={() => {
                    setResults(null);
                    setPrompt("");
                  }}
                  className="text-xs text-slate-400 hover:text-slate-700 transition"
                >
                  Clear
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.map((rec, i) => {
                  const venue = venueById(rec.venueId);
                  if (!venue) return null;
                  const heroUrl = venue.images[0]?.url;
                  return (
                    <button
                      key={rec.venueId}
                      onClick={() => onSelect(rec.venueId)}
                      className="text-left rounded-xl border border-[#D9CDBF] bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition flex flex-col group"
                    >
                      {/* Thumbnail */}
                      <div
                        className="h-28 w-full bg-[#E8D9C4] bg-cover bg-center relative"
                        style={{
                          backgroundImage: heroUrl ? `url(${heroUrl})` : undefined,
                        }}
                      >
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 text-xs font-bold text-slate-700 flex items-center justify-center shadow-sm">
                          {i + 1}
                        </div>
                        <div
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-white text-[11px] font-bold ${scoreColor(rec.score)}`}
                        >
                          {rec.score}%
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3 flex flex-col gap-1 flex-1">
                        <p className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-blush-700 transition">
                          {venue.name}
                        </p>
                        <p className="text-[11px] text-slate-500">{venue.district}</p>
                        <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                          {rec.reason}
                        </p>
                        <p
                          className={`text-[11px] font-medium mt-auto pt-1 ${
                            rec.score >= 80
                              ? "text-emerald-600"
                              : rec.score >= 60
                              ? "text-amber-600"
                              : "text-orange-500"
                          }`}
                        >
                          {scoreLabel(rec.score)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
