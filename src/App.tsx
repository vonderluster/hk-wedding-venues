import { useMemo, useRef, useState } from "react";
import {
  venues as allVenues,
  VENUE_TYPES,
  SCENERY,
  FACILITIES,
  DISTRICTS,
  GUESTS_PER_TABLE,
  type VenueType,
  type Scenery,
  type Facility,
  type District,
  type Venue,
} from "./data/venues";
import VenueCard, { formatPrice } from "./components/VenueCard";
import MapView from "./components/MapView";
import CompareDrawer from "./components/CompareDrawer";
import UserReviews from "./components/UserReviews";
import AIRecommender from "./components/AIRecommender";
import VibePicker, { type VibeFilters } from "./components/VibePicker";
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
  const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
  const [scenery, setScenery] = useState<Scenery[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("rating");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [page, setPage] = useState<"vibe" | "finder">("finder");

  const handleVibeComplete = ({ venueTypes: vt, scenery: sc, minTables: mt }: VibeFilters) => {
    setVenueTypes(vt);
    setScenery(sc);
    setMinTables(mt);
    setPage("finder");
  };

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
      if (venueTypes.length && !venueTypes.some((t) => v.venueTypes.includes(t)))
        return false;
      if (scenery.length && !scenery.some((s) => v.scenery.includes(s)))
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
  }, [priceMax, minTables, venueTypes, scenery, facilities, districts, search, sort]);

  const selected = allVenues.find((v) => v.id === selectedId) ?? null;
  const compared = allVenues.filter((v) => compareIds.includes(v.id));

  const resetFilters = () => {
    setPriceMax(PRICE_MAX);
    setMinTables(0);
    setVenueTypes([]);
    setScenery([]);
    setFacilities([]);
    setDistricts([]);
    setSearch("");
  };

  const activeFilterCount = [
    priceMax < PRICE_MAX,
    minTables > 0,
    venueTypes.length > 0,
    scenery.length > 0,
    facilities.length > 0,
    districts.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="bg-white border-b border-[#D9CDBF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {/* Brand + tabs + desktop controls — all one row */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-display text-xl sm:text-2xl text-blush-700 leading-none shrink-0">
              Something Borrowed
            </h1>
            <nav className="flex gap-1 ml-2 shrink-0">
              <button
                onClick={() => setPage("vibe")}
                className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition border ${
                  page === "vibe"
                    ? "bg-blush-600 text-white border-blush-600"
                    : "bg-white text-slate-500 border-[#D9CDBF] hover:text-blush-700 hover:border-blush-300"
                }`}
              >
                ✦ Vibe
              </button>
              <button
                onClick={() => setPage("finder")}
                className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition border ${
                  page === "finder"
                    ? "bg-blush-600 text-white border-blush-600"
                    : "bg-white text-slate-500 border-[#D9CDBF] hover:text-blush-700 hover:border-blush-300"
                }`}
              >
                Finder
              </button>
            </nav>
            {/* Desktop: search + sort + compare pushed right */}
            {page === "finder" && (
              <div className="hidden sm:flex items-center gap-2 ml-auto">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search venues…"
                  className="w-44 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="border border-[#D9CDBF] rounded-lg px-3 py-1.5 text-sm bg-white shrink-0"
                >
                  <option value="rating">Top rated</option>
                  <option value="price-asc">Price: low → high</option>
                  <option value="price-desc">Price: high → low</option>
                  <option value="capacity">Largest first</option>
                </select>
                <button
                  onClick={() => setCompareOpen(true)}
                  disabled={compareIds.length === 0}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-blush-600 text-white text-sm font-medium disabled:bg-slate-300 hover:bg-blush-700 transition"
                >
                  Compare ({compareIds.length})
                </button>
              </div>
            )}
          </div>
          {/* Mobile: search bar below brand row (finder only) */}
          {page === "finder" && (
            <div className="sm:hidden flex gap-2 mt-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search venues…"
                className="flex-1 min-w-0 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>
          )}
        </div>
      </header>

      {page === "vibe" ? (
        <VibePicker onComplete={handleVibeComplete} />
      ) : (<>

      {/* Mobile: Filters | Map action bar */}
      <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-[#D9CDBF] flex">
        <button
          onClick={() => setFilterSheetOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-700 border-r border-[#D9CDBF] active:bg-blush-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blush-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setMapVisible((v) => !v)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium active:bg-slate-50 ${mapVisible ? "text-blush-700" : "text-slate-700"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 13l4.553 2.276A1 1 0 0021 21.382V10.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 7" />
          </svg>
          {mapVisible ? "Hide map" : "Map"}
        </button>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-12 gap-4 sm:gap-6">
        {/* Filters sidebar — desktop only */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5">
          <div className="bg-cream rounded-2xl border border-[#D9CDBF] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-slate-800">Filters</h2>
              <button onClick={resetFilters} className="text-xs text-blush-600 hover:underline">
                Reset
              </button>
            </div>
            <div>

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

            <FilterSection title="Venue type">
              <CheckboxGroup
                items={VENUE_TYPES}
                selected={venueTypes}
                onToggle={(v) => toggle(venueTypes, v, setVenueTypes)}
              />
            </FilterSection>

            <FilterSection title="Scenery">
              <CheckboxGroup
                items={SCENERY}
                selected={scenery}
                onToggle={(v) => toggle(scenery, v, setScenery)}
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
            </div>{/* end collapsible */}
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          <AIRecommender venues={allVenues} onSelect={setSelectedId} />

          <div className={`${mapVisible ? "block" : "hidden"} lg:block h-[280px] lg:h-[360px] bg-white rounded-2xl border border-[#D9CDBF] overflow-hidden`}>
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
                onCompare={(id) => {
                  const isAdding = !compareIds.includes(id);
                  setCompareIds((prev) =>
                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                  );
                  if (isAdding && compareIds.length >= 1) setCompareOpen(true);
                }}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center p-10 bg-white rounded-2xl border border-[#D9CDBF]">
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
          onCompare={(id) => {
            const isAdding = !compareIds.includes(id);
            setCompareIds((prev) =>
              prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
            );
            if (isAdding && compareIds.length >= 1) setCompareOpen(true);
          }}
          onClose={() => setSelectedId(null)}
          onFilterByVenueType={(t) => { setVenueTypes([t]); setSelectedId(null); }}
          onFilterByScenery={(s) => { setScenery([s]); setSelectedId(null); }}
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

      {/* Mobile filter bottom sheet */}
      {filterSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-[1003] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterSheetOpen(false)} />
          <div className="relative bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#D9CDBF] shrink-0">
              <span className="font-display text-slate-900">
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </span>
              <div className="flex items-center gap-4">
                <button onClick={resetFilters} className="text-sm text-blush-600 hover:underline">
                  Reset
                </button>
                <button
                  onClick={() => setFilterSheetOpen(false)}
                  className="px-4 py-1.5 bg-blush-600 text-white text-sm font-medium rounded-lg hover:bg-blush-700 transition"
                >
                  Done
                </button>
              </div>
            </div>
            {/* Sheet content */}
            <div className="overflow-auto flex-1 px-5 py-4 space-y-1">
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
              <FilterSection title="Venue type">
                <CheckboxGroup
                  items={VENUE_TYPES}
                  selected={venueTypes}
                  onToggle={(v) => toggle(venueTypes, v, setVenueTypes)}
                />
              </FilterSection>
              <FilterSection title="Scenery">
                <CheckboxGroup
                  items={SCENERY}
                  selected={scenery}
                  onToggle={(v) => toggle(scenery, v, setScenery)}
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
          </div>
        </div>
      )}

      <footer className="border-t border-[#D9CDBF] bg-cream/60 py-4 text-center text-xs text-slate-500">
        Something Borrowed · Demo data · {new Date().getFullYear()}
      </footer>

      </>)}
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
                : "bg-cream text-[#5C4A35] border-[#D9CDBF] hover:border-blush-400"
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
  onFilterByVenueType,
  onFilterByScenery,
}: {
  venue: Venue;
  compared: boolean;
  onCompare: (id: string) => void;
  onClose: () => void;
  onFilterByVenueType: (t: VenueType) => void;
  onFilterByScenery: (s: Scenery) => void;
}) {
  const [lightbox, setLightbox] = useState<{ url: string; caption: string } | null>(null);
  const [ugcCount, setUgcCount] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);
  const transportRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const heroImg = venue.images[0];
  const thumbImgs = venue.images.slice(1, 5);
  const forumCount = forumReviewsByVenueId[venue.id]?.reviews.length ?? venue.reviews.length;
  const reviewCount = forumCount + ugcCount;

  const capacityLabel =
    venue.tables[1] === 0
      ? "Ceremony-only"
      : venue.tables[0] > 1
      ? `${venue.tables[0]}–${venue.tables[1]} tables · up to ${venue.tables[1] * GUESTS_PER_TABLE} guests`
      : `Up to ${venue.tables[1]} tables · up to ${venue.tables[1] * GUESTS_PER_TABLE} guests`;

  return (
    <>
      <div className="fixed inset-0 z-[1001] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-3">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-6xl max-h-[92vh] sm:max-h-[94vh] overflow-hidden flex flex-col">

          {/* ── Top: photo grid + info card ── */}
          {/* Container has no fixed height — photo grid is 400px, info card is auto */}
          <div className="flex flex-col sm:flex-row shrink-0 relative">

            {/* Mobile: single hero image */}
            <div
              className="sm:hidden h-52 bg-cover bg-center bg-slate-200 cursor-zoom-in shrink-0"
              style={{ backgroundImage: heroImg ? `url(${heroImg.url})` : undefined }}
              onClick={() => heroImg && setLightbox(heroImg)}
            />

            {/* Desktop: photo grid — fixed 400px, aligned to top */}
            <div className="hidden sm:block flex-1 overflow-hidden rounded-tl-2xl relative self-start h-[400px]">
              <div
                className="grid h-full gap-0.5"
                style={{ gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "1fr 1fr" }}
              >
                {/* Hero — spans both rows */}
                <div
                  className="row-span-2 bg-cover bg-center bg-slate-200 cursor-zoom-in"
                  style={{ backgroundImage: heroImg ? `url(${heroImg.url})` : undefined }}
                  onClick={() => heroImg && setLightbox(heroImg)}
                />
                {/* Up to 4 thumbnails */}
                {Array.from({ length: 4 }).map((_, i) => {
                  const img = thumbImgs[i];
                  return (
                    <div
                      key={i}
                      className={`bg-cover bg-center bg-slate-100 ${img ? "cursor-zoom-in" : ""}`}
                      style={{ backgroundImage: img ? `url(${img.url})` : undefined }}
                      onClick={() => img && setLightbox(img)}
                    />
                  );
                })}
              </div>
              {/* "View all photos" button */}
              <button
                onClick={() => scrollTo(photosRef)}
                className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-white shadow-sm transition"
              >
                View all {venue.images.length} photos ↓
              </button>
            </div>{/* end desktop photo grid */}

            {/* Info card — auto height, no scroll */}
            <div className="w-full sm:w-80 shrink-0 border-t sm:border-t-0 sm:border-l border-[#D9CDBF] flex flex-col p-4 sm:p-5 gap-3 sm:gap-4 sm:rounded-tr-2xl">
              <div>
                <h2 className="font-display text-xl text-slate-900 leading-tight">
                  {venue.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{venue.district} · {venue.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-blush-700 font-semibold text-lg">★ {venue.rating}</span>
                <span className="text-sm text-slate-500">{venue.reviewCount.toLocaleString()} reviews</span>
              </div>

              <div className="space-y-2.5 text-sm text-slate-700">
                <div className="flex gap-2.5 items-start">
                  <span className="shrink-0 text-slate-400">💰</span>
                  <span>{formatPrice(venue.pricePerHead)}</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="shrink-0 text-slate-400">🪑</span>
                  <span>{capacityLabel}</span>
                </div>
                <div className="flex gap-2 items-start flex-wrap">
                  <span className="shrink-0 text-slate-400 mt-0.5">🏷</span>
                  {venue.venueTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => { onFilterByVenueType(t); onClose(); }}
                      className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-blush-100 hover:text-blush-700 transition"
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {venue.scenery.length > 0 && (
                  <div className="flex gap-2 items-start flex-wrap">
                    <span className="shrink-0 text-slate-400 mt-0.5">🌿</span>
                    {venue.scenery.map((s) => (
                      <button
                        key={s}
                        onClick={() => { onFilterByScenery(s); onClose(); }}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-blush-100 hover:text-blush-700 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {venue.socialMedia && (
                <div className="flex gap-3 items-center">
                  {venue.socialMedia.instagram && (
                    <a
                      href={venue.socialMedia.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="text-slate-400 hover:text-pink-500 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {venue.socialMedia.facebook && (
                    <a
                      href={venue.socialMedia.facebook}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="text-slate-400 hover:text-blue-600 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}

              <div className="mt-auto space-y-2">
                {venue.enquiryUrl && (
                  <a
                    href={venue.enquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-2.5 rounded-lg font-medium text-sm text-center bg-blush-600 text-white hover:bg-blush-700 transition"
                  >
                    Enquire Now ↗
                  </a>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:left-3 sm:right-auto bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-white shadow z-10"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* ── Section nav ── */}
          <div className="border-b border-[#D9CDBF] flex items-center shrink-0">
            {/* Tabs — scrollable on small screens */}
            <div className="flex overflow-x-auto overflow-y-hidden flex-1 px-2 sm:px-5">
              {[
                { label: "About", ref: aboutRef },
                { label: "Transport", ref: transportRef },
                { label: `Reviews (${reviewCount})`, ref: reviewsRef },
                { label: `Photos (${venue.images.length})`, ref: photosRef },
              ].map(({ label, ref }) => (
                <button
                  key={label}
                  onClick={() => scrollTo(ref)}
                  className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-blush-700 border-b-2 border-transparent hover:border-blush-500 transition -mb-px whitespace-nowrap shrink-0"
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Compare — always pinned right, never scrolls away */}
            <div className="shrink-0 px-3 py-2 border-l border-slate-100">
              <button
                onClick={() => onCompare(venue.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border whitespace-nowrap ${
                  compared
                    ? "bg-blush-600 text-white border-blush-600 hover:bg-blush-700"
                    : "bg-white text-blush-700 border-blush-300 hover:bg-blush-50"
                }`}
              >
                {compared ? "✓" : "+"}
              </button>
            </div>
          </div>

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-auto scrollbar-hide">
            {/* About */}
            <div ref={aboutRef} className="p-4 sm:p-6 space-y-4 border-b border-[#E0D4C4]">
              <h3 className="font-display text-lg font-semibold text-slate-900">About</h3>
              <Blurb text={venue.blurb} sourceUrl={venue.hkwvdbUrl} className="text-slate-700" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Price per head" value={formatPrice(venue.pricePerHead)} />
                <Info label="Capacity" value={capacityLabel} />
                <Info label="Venue type" value={venue.venueTypes.join(", ")} />
                {venue.scenery.length > 0 && (
                  <Info label="Scenery" value={venue.scenery.join(", ")} />
                )}
                <Info label="Dietary options" value={venue.dietaryOptions.join(", ")} />
                <Info label="Facilities" value={venue.facilities.join(", ")} />
              </div>
            </div>

            {/* Transport */}
            <div ref={transportRef} className="p-4 sm:p-6 border-b border-[#E0D4C4]">
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">Getting There</h3>
              <div className="space-y-4">
                {venue.transport.mtr && (
                  <div className="flex gap-3">
                    <span className="text-xl shrink-0">🚇</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {venue.transport.mtr.station} MTR
                        {venue.transport.mtr.exit && (
                          <span className="ml-1.5 text-xs font-normal text-slate-500">(Exit {venue.transport.mtr.exit})</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {venue.transport.mtr.line} · {venue.transport.mtr.walkMins} min walk
                      </div>
                    </div>
                  </div>
                )}
                {venue.transport.ferry && (
                  <div className="flex gap-3">
                    <span className="text-xl shrink-0">⛴️</span>
                    <div className="text-sm text-slate-700">{venue.transport.ferry}</div>
                  </div>
                )}
                {venue.transport.bus && venue.transport.bus.length > 0 && (
                  <div className="flex gap-3">
                    <span className="text-xl shrink-0">🚌</span>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Bus routes</div>
                      <div className="flex flex-wrap gap-1.5">
                        {venue.transport.bus.map((r) => (
                          <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-100">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {venue.transport.minibus && venue.transport.minibus.length > 0 && (
                  <div className="flex gap-3">
                    <span className="text-xl shrink-0">🚐</span>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Minibus</div>
                      <div className="flex flex-wrap gap-1.5">
                        {venue.transport.minibus.map((r) => (
                          <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-800 border border-green-100">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {venue.transport.shuttle && (
                  <div className="flex gap-3">
                    <span className="text-xl shrink-0">🚌</span>
                    <div className="text-sm text-slate-700">{venue.transport.shuttle}</div>
                  </div>
                )}
                {venue.transport.notes && (
                  <p className="text-xs text-slate-500 bg-[#F3EBE0] rounded-lg px-3 py-2 border border-[#E0D4C4]">
                    💡 {venue.transport.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div ref={reviewsRef} className="p-4 sm:p-6 border-b border-[#E0D4C4]">
              <ForumReviewsSection venueId={venue.id} fallback={venue.reviews} />
              <UserReviews venueId={venue.id} onCountChange={setUgcCount} />
            </div>

            {/* Photos */}
            <div ref={photosRef} className="p-4 sm:p-6">
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">
                Photos ({venue.images.length})
              </h3>
              <Gallery venue={venue} onLightbox={setLightbox} />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[1100] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-3xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={lightbox.url}
              alt={lightbox.caption}
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
            {lightbox.caption && (
              <p className="mt-3 text-center text-sm text-white/70">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Gallery({
  venue,
  onLightbox,
}: {
  venue: Venue;
  onLightbox: (img: { url: string; caption: string }) => void;
}) {
  const groups: { label: string; kind: "exterior" | "interior" | "facility" }[] = [
    { label: "Exterior", kind: "exterior" },
    { label: "Interior", kind: "interior" },
    { label: "Facilities", kind: "facility" },
  ];

  return (
    <div className="space-y-4">
      {groups.map(({ label, kind }) => {
        const imgs = venue.images.filter((i) => i.kind === kind);
        if (imgs.length === 0) return null;
        return (
          <div key={kind}>
            <h4 className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
              {label}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {imgs.map((img) => (
                <figure
                  key={img.url}
                  className="rounded-lg overflow-hidden border border-[#D9CDBF] bg-[#EDE6DA] cursor-zoom-in"
                  onClick={() => onLightbox(img)}
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

// Strips inline "(hkwvdb.com)" style citations and replaces with a superscript link.
function Blurb({ text, sourceUrl, className = "" }: { text: string; sourceUrl?: string; className?: string }) {
  const clean = text.replace(/\s*\([^)]*(?:hkwvdb|\.com|\.hk)[^)]*\)/gi, "").trimEnd();
  return (
    <p className={className}>
      {clean}
      {sourceUrl && (
        <sup>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            title="Source: hkwvdb.com"
            className="ml-0.5 text-blush-500 hover:text-blush-700 text-[10px] font-sans"
          >
            [src]
          </a>
        </sup>
      )}
    </p>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#F3EBE0] rounded-lg p-3 border border-[#E0D4C4]">
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
    className: "bg-[#EDE6DA] text-[#5C4A35] border-[#D9CDBF]",
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
              className="border border-[#D9CDBF] rounded-lg p-3 bg-[#F3EBE0]"
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
                  : "bg-cream text-[#5C4A35] border-[#D9CDBF] hover:border-blush-400 disabled:opacity-40"
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
    <div className="border border-[#D9CDBF] rounded-lg p-3 bg-white">
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
