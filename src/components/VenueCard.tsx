import { useState, useMemo } from "react";
import type { Venue, VenueType } from "../data/venues";
import { GUESTS_PER_TABLE } from "../data/venues";

interface Props {
  venue: Venue;
  selected: boolean;
  compared: boolean;
  /** When the user has selected a vibe, the labels of vibe choices this venue matched. */
  matchReasons?: string[];
  onSelect: (id: string) => void;
  onCompare: (id: string) => void;
}

function formatPrice(range: [number, number]) {
  if (range[0] === 0 && range[1] === 0) return "Ceremony-only";
  return `HK$${range[0].toLocaleString()} – ${range[1].toLocaleString()} / head`;
}

/** Inline SVG paths (Lucide-style, 24x24 viewBox, currentColor stroke) per venue type.
 *  Used by the fallback hero when no image URL in the venue's images array loads. */
const TYPE_ICON_PATHS: Record<VenueType, string> = {
  "Hotel/Resort":
    "M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01",
  Ballroom:
    "M12 3v3M9 5l1.5 1.5M15 5l-1.5 1.5M5 11h14l-1.5 9h-11zM12 11V8a2 2 0 1 1 2 2",
  Restaurant:
    "M3 3v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M5 13v8M19 3c-1.7 0-3 2-3 4.5S17.3 12 19 12v9",
  Heritage:
    "M3 21h18M5 21V10M19 21V10M3 10h18l-9-7zM8 21v-7M12 21v-7M16 21v-7",
  Church:
    "M12 2v6M9 5h6M5 21V11l7-4 7 4v10M9 21v-7h6v7M3 21h18",
  "Yacht & Marina":
    "M12 2v6M5 12l7-4 7 4M3 18a4 4 0 0 0 4-3 4 4 0 0 0 4 3 4 4 0 0 0 4-3 4 4 0 0 0 4 3M5 12l1.5 6h11L19 12",
  "Golf & Country Club":
    "M5 21V3l11 4-11 4M5 21h8M9 21v-7",
  "Public Park":
    "M12 2c-3 3-3 6 0 9 3-3 3-6 0-9zM12 11v10M8 21h8M5 16c1-2 3-2 4 0M15 16c1-2 3-2 4 0",
};

function FallbackHero({ venue }: { venue: Venue }) {
  const primaryType = venue.venueTypes[0] ?? "Hotel/Resort";
  const path = TYPE_ICON_PATHS[primaryType];
  return (
    <div
      className="relative h-40 w-full flex flex-col items-center justify-center text-blush-700"
      style={{
        background:
          "linear-gradient(135deg, rgba(244,229,213,0.95) 0%, rgba(231,200,170,0.85) 60%, rgba(214,175,150,0.75) 100%)",
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
      <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-blush-700/80">
        {venue.district}
      </div>
    </div>
  );
}

export default function VenueCard({
  venue,
  selected,
  compared,
  matchReasons,
  onSelect,
  onCompare,
}: Props) {
  const maxGuests = venue.tables[1] * GUESTS_PER_TABLE;

  // Try each image URL in order until one loads successfully. Track the index
  // of the candidate currently being attempted; -1 means we exhausted the list
  // and should render the stylized fallback hero.
  const candidates = useMemo(
    () => venue.images.map((img) => img.url).filter(Boolean),
    [venue.images],
  );
  const [candidateIdx, setCandidateIdx] = useState(0);
  const exhausted = candidateIdx >= candidates.length;

  return (
    <article
      onClick={() => onSelect(venue.id)}
      className={`group cursor-pointer rounded-2xl bg-white shadow-sm border transition overflow-hidden flex flex-col ${
        selected
          ? "border-blush-500 ring-2 ring-blush-300"
          : "border-slate-200 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <div className="relative h-40 w-full overflow-hidden">
        {exhausted ? (
          <FallbackHero venue={venue} />
        ) : (
          <img
            key={candidates[candidateIdx]}
            src={candidates[candidateIdx]}
            alt={venue.images[candidateIdx]?.caption ?? venue.name}
            loading="lazy"
            onError={() => setCandidateIdx((i) => i + 1)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {matchReasons && matchReasons.length > 0 && (
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-medium text-blush-700 border border-blush-200 shadow-sm">
            <span>✦</span>
            <span>
              Matches {matchReasons.slice(0, 2).join(", ")}
              {matchReasons.length > 2 ? ` +${matchReasons.length - 2}` : ""}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg text-slate-900 leading-tight">
              {venue.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {venue.district} · {venue.address}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-sm font-semibold text-blush-700">
              ★ {venue.rating}
            </div>
            <div className="text-[11px] text-slate-400">
              {venue.reviewCount} reviews
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">
          {venue.blurb.replace(/\s*\([^)]*(?:hkwvdb|\.com|\.hk)[^)]*\)/gi, "")}
        </p>
        <div className="text-xs text-slate-700 mt-1 flex flex-wrap gap-x-3 gap-y-1">
          <span>💰 {formatPrice(venue.pricePerHead)}</span>
          {venue.tables[1] > 0 && (
            <span>
              🪑{" "}
              {venue.tables[0] > 1
                ? `${venue.tables[0]}–${venue.tables[1]}`
                : `Up to ${venue.tables[1]}`}{" "}
              tables · up to {maxGuests} guests
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {venue.venueTypes.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 rounded-full bg-blush-50 text-blush-700 border border-blush-100"
            >
              {t}
            </span>
          ))}
          {venue.scenery.slice(0, 2).map((s) => (
            <span
              key={s}
              className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompare(venue.id);
            }}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
              compared
                ? "bg-blush-600 text-white border-blush-600"
                : "bg-white text-blush-700 border-blush-200 hover:bg-blush-50"
            }`}
          >
            {compared ? "✓ In comparison" : "+ Compare"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(venue.id);
            }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#D9CDBF] text-[#5C4A35] bg-white hover:bg-blush-50"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

export { formatPrice };
