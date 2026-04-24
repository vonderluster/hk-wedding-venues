import { useMemo, useState } from "react";
import {
  venues as allVenues,
  SETTINGS,
  FACILITIES,
  DISTRICTS,
  GUESTS_PER_TABLE,
  type Setting,
  type Facility,
  type District,
  type Venue,
} from "./data/venues";
import VenueCard, { formatPrice } from "./components/VenueCard";
import MapView from "./components/MapView";
import CompareDrawer from "./components/CompareDrawer";
import {
  forumReviewsByVenueId,
  SOURCE_LABELS,
  type ForumReview,
  type Sentiment,
} from "./data/forumReviews";
import "./App.css";

const PRICE_MAX = 3500;

type SortKey = "rating" | "price-asc" | "price-desc" | "capacity";

export default function App() {
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [minTables, setMinTables] = useState(0);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("rating");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggle = <T,>(list: T[], value: T, set: (v: T[]) => void) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = allVenues.filter((v) => {
      if (q && !`${v.name} ${v.district} ${v.address}`.toLowerCase().includes(q))
        return false;
      if (v.pricePerHead[1] > 0 && v.pricePerHead[0] > priceMax) return false;
      if (v.tables[1] > 0 && v.tables[1] < minTables) return false;
      if (settings.length && !settings.some((s) => v.settings.includes(s)))
        return false;
      if (facilities.length && !facilities.every((f) => v.facilities.includes(f)))
        return false;
      if (districts.length && !districts.includes(v.district)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.pricePerHead[0] - b.pricePerHead[0];
        case "price-desc":
          return b.pricePerHead[1] - a.pricePerHead[1];
        case "capacity":
          return b.tables[1] - a.tables[1];
        case "rating":
        default:
          return b.rating - a.rating;
      }
    });
    return result;
  }, [priceMax, minTables, settings, facilities, districts, search, sort]);

  const selected = allVenues.find((v) => v.id === selectedId) ?? null;
  const compared = allVenues.filter((v) => compareIds.includes(v.id));

  const resetFilters = () => {
    setPriceMax(PRICE_MAX);
    setMinTables(0);
    setSettings([]);
    setFacilities([]);
    setDistricts([]);
    setSearch("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-blush-700 leading-none">
              Something Borrowed
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Hong Kong wedding venues, compared.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search venues, districts…"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blush-300"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="rating">Top rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="capacity">Largest capacity</option>
            </select>
            <button
              onClick={() => setCompareOpen(true)}
              disabled={compareIds.length === 0}
              className="px-4 py-2 rounded-lg bg-blush-600 text-white text-sm font-medium disabled:bg-slate-300 hover:bg-blush-700 transition"
            >
              Compare ({compareIds.length})
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        {/* Filters sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-slate-800">
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs text-blush-600 hover:underline"
              >
                Reset
              </button>
            </div>

            <FilterSection title={`Max price per head: HK$${priceMax.toLocaleString()}`}>
              <input
                type="range"
                min={500}
                max={PRICE_MAX}
                step={100}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-blush-600"
              />
            </FilterSection>

            <FilterSection
              title={`Min tables: ${minTables} (${minTables * GUESTS_PER_TABLE} guests)`}
            >
              <input
                type="range"
                min={0}
                max={60}
                step={5}
                value={minTables}
                onChange={(e) => setMinTables(Number(e.target.value))}
                className="w-full accent-blush-600"
              />
            </FilterSection>

            <FilterSection title="Setting & views">
              <CheckboxGroup
                items={SETTINGS}
                selected={settings}
                onToggle={(v) => toggle(settings, v, setSettings)}
              />
            </FilterSection>

            <FilterSection title="Facilities">
              <CheckboxGroup
                items={FACILITIES}
                selected={facilities}
                onToggle={(v) => toggle(facilities, v, setFacilities)}
              />
            </FilterSection>

            <FilterSection title="HK district">
              <CheckboxGroup
                items={DISTRICTS}
                selected={districts}
                onToggle={(v) => toggle(districts, v, setDistricts)}
              />
            </FilterSection>
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          <div className="h-[360px] bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <MapView
              venues={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {filtered.length}
              </span>{" "}
              venue{filtered.length === 1 ? "" : "s"} match your criteria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((v) => (
              <VenueCard
                key={v.id}
                venue={v}
                selected={v.id === selectedId}
                compared={compareIds.includes(v.id)}
                onSelect={setSelectedId}
                onCompare={(id) =>
                  setCompareIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((x) => x !== id)
                      : [...prev, id],
                  )
                }
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center p-10 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600">No venues match these filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-3 text-blush-600 hover:underline text-sm"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {selected && (
        <VenueDetails
          venue={selected}
          compared={compareIds.includes(selected.id)}
          onCompare={(id) =>
            setCompareIds((prev) =>
              prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
            )
          }
          onClose={() => setSelectedId(null)}
        />
      )}

      <CompareDrawer
        venues={compared}
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        onRemove={(id) =>
          setCompareIds((prev) => prev.filter((x) => x !== id))
        }
      />

      <footer className="border-t border-slate-200 bg-white/60 py-4 text-center text-xs text-slate-500">
        Something Borrowed · Demo data · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-3 border-t border-slate-100 first:border-t-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

function CheckboxGroup<T extends string>({
  items,
  selected,
  onToggle,
}: {
  items: readonly T[];
  selected: T[];
  onToggle: (item: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`text-xs px-2.5 py-1 rounded-full border transition ${
              active
                ? "bg-blush-600 text-white border-blush-600"
                : "bg-white text-slate-700 border-slate-200 hover:border-blush-300"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function VenueDetails({
  venue,
  compared,
  onCompare,
  onClose,
}: {
  venue: Venue;
  compared: boolean;
  onCompare: (id: string) => void;
  onClose: () => void;
}) {
  const hero = venue.images[0];
  return (
    <div className="fixed inset-0 z-[1001] bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div
          className="h-56 w-full bg-cover bg-center bg-slate-200 relative"
          style={{
            backgroundImage: hero ? `url(${hero.url})` : undefined,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-white"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-auto space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                {venue.name}
              </h2>
              <p className="text-sm text-slate-500">
                {venue.district} · {venue.address}
              </p>
            </div>
            <div className="text-right">
              <div className="text-blush-700 font-semibold">
                ★ {venue.rating}
              </div>
              <div className="text-xs text-slate-400">
                {venue.reviewCount} reviews
              </div>
            </div>
          </div>
          <p className="text-slate-700">{venue.blurb}</p>
          {venue.hkwvdbUrl && (
            <p className="text-xs text-slate-400">
              Price, capacity & facilities sourced from{" "}
              <a
                href={venue.hkwvdbUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blush-600 hover:underline"
              >
                hkwvdb.com ↗
              </a>
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Price" value={formatPrice(venue.pricePerHead)} />
            <Info
              label="Capacity"
              value={
                venue.tables[1] === 0
                  ? "Ceremony-only"
                  : `${venue.tables[0]}–${venue.tables[1]} tables (up to ${
                      venue.tables[1] * GUESTS_PER_TABLE
                    } guests)`
              }
            />
            <Info
              label="Dietary options"
              value={venue.dietaryOptions.join(", ")}
            />
            <Info label="Setting" value={venue.settings.join(", ")} />
            <Info label="Facilities" value={venue.facilities.join(", ")} />
          </div>
          <ForumReviewsSection venueId={venue.id} fallback={venue.reviews} />
          {venue.images.length > 1 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Photos</h3>
              <Gallery venue={venue} />
            </div>
          )}
          <button
            onClick={() => onCompare(venue.id)}
            className={`w-full py-2.5 rounded-lg font-medium text-sm transition ${
              compared
                ? "bg-blush-600 text-white hover:bg-blush-700"
                : "bg-white border border-blush-600 text-blush-700 hover:bg-blush-50"
            }`}
          >
            {compared ? "✓ In comparison" : "+ Add to comparison"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Gallery({ venue }: { venue: Venue }) {
  const groups: { label: string; kind: "exterior" | "interior" | "facility" }[] =
    [
      { label: "Exterior", kind: "exterior" },
      { label: "Interior", kind: "interior" },
      { label: "Facilities", kind: "facility" },
    ];
  return (
    <div className="space-y-3">
      {groups.map(({ label, kind }) => {
        const imgs = venue.images.filter((i) => i.kind === kind);
        if (imgs.length === 0) return null;
        return (
          <div key={kind}>
            <h3 className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1.5">
              {label}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {imgs.map((img) => (
                <figure
                  key={img.url}
                  className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                >
                  <div
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: `url(${img.url})` }}
                  />
                  <figcaption className="p-1.5 text-[11px] text-slate-600 leading-tight">
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
        {label}
      </div>
      <div className="text-sm text-slate-800 mt-0.5">{value}</div>
    </div>
  );
}

const SENTIMENT_STYLE: Record<Sentiment, { label: string; className: string }> = {
  positive: {
    label: "Positive",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  neutral: {
    label: "Neutral",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  negative: {
    label: "Negative",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
};

type SentimentFilter = Sentiment | "all";

function ForumReviewsSection({
  venueId,
  fallback,
}: {
  venueId: string;
  fallback: { author: string; rating: number; text: string }[];
}) {
  const data = forumReviewsByVenueId[venueId];
  const [filter, setFilter] = useState<SentimentFilter>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!data) {
    return (
      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Recent reviews</h3>
        <p className="text-xs text-slate-500 mb-2">
          Forum reviews not yet crawled for this venue.
        </p>
        <div className="space-y-2">
          {fallback.map((r, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-lg p-3 bg-slate-50"
            >
              <div className="text-sm font-medium text-slate-800">
                {r.author} · ★ {r.rating}
              </div>
              <p className="text-sm text-slate-600 mt-1">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { reviews, topKeywords, sentimentBreakdown, lastScrapedAt } = data;
  const total = reviews.length;
  const shown = filter === "all" ? reviews : reviews.filter((r) => r.sentiment === filter);

  const filterButtons: { key: SentimentFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: total },
    { key: "positive", label: "Positive", count: sentimentBreakdown.positive },
    { key: "neutral", label: "Neutral", count: sentimentBreakdown.neutral },
    { key: "negative", label: "Negative", count: sentimentBreakdown.negative },
  ];

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-semibold text-slate-800">
          Forum reviews{" "}
          <span className="text-sm font-normal text-slate-500">({total})</span>
        </h3>
        <span className="text-[11px] text-slate-400">
          crawled {lastScrapedAt}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
          <div
            className="bg-emerald-400"
            style={{ width: `${(sentimentBreakdown.positive / total) * 100}%` }}
          />
          <div
            className="bg-slate-300"
            style={{ width: `${(sentimentBreakdown.neutral / total) * 100}%` }}
          />
          <div
            className="bg-rose-400"
            style={{ width: `${(sentimentBreakdown.negative / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-1.5">
          Most mentioned
        </div>
        <div className="flex flex-wrap gap-1.5">
          {topKeywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2 py-0.5 rounded-full bg-blush-50 text-blush-700 border border-blush-100"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {filterButtons.map((b) => {
          const active = filter === b.key;
          return (
            <button
              key={b.key}
              onClick={() => setFilter(b.key)}
              disabled={b.count === 0}
              className={`text-xs px-2.5 py-1 rounded-full border transition ${
                active
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 disabled:opacity-40"
              }`}
            >
              {b.label} · {b.count}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {shown.map((r, i) => (
          <ReviewCard
            key={`${r.threadId}-${i}`}
            review={r}
            expanded={!!expanded[`${r.threadId}-${i}`]}
            onToggle={() =>
              setExpanded((e) => ({
                ...e,
                [`${r.threadId}-${i}`]: !e[`${r.threadId}-${i}`],
              }))
            }
          />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  expanded,
  onToggle,
}: {
  review: ForumReview;
  expanded: boolean;
  onToggle: () => void;
}) {
  const style = SENTIMENT_STYLE[review.sentiment];
  return (
    <div className="border border-slate-200 rounded-lg p-3 bg-white">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-slate-800">
          {review.author}
          <span className="text-xs font-normal text-slate-500">
            {" "}
            · {review.date} · {SOURCE_LABELS[review.source]}
          </span>
        </div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full border ${style.className}`}
        >
          {style.label}
        </span>
      </div>
      <p className="text-sm text-slate-800 mt-1.5">{review.summary}</p>
      {review.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {review.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={onToggle}
          className="text-xs text-slate-500 hover:text-slate-800 underline decoration-dotted"
        >
          {expanded ? "Hide original" : "Show original + translation"}
        </button>
        <a
          href={review.threadUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-500 hover:text-slate-800 underline decoration-dotted"
        >
          Source thread ↗
        </a>
      </div>
      {expanded && (
        <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
              Original
            </div>
            <p className="text-sm text-slate-700">{review.originalText}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
              English
            </div>
            <p className="text-sm text-slate-700 italic">
              {review.englishTranslation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
