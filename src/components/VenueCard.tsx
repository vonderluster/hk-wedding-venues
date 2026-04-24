import type { Venue } from "../data/venues";
import { GUESTS_PER_TABLE } from "../data/venues";

interface Props {
  venue: Venue;
  selected: boolean;
  compared: boolean;
  onSelect: (id: string) => void;
  onCompare: (id: string) => void;
}

function formatPrice(range: [number, number]) {
  if (range[0] === 0 && range[1] === 0) return "Ceremony-only";
  return `HK$${range[0].toLocaleString()} – ${range[1].toLocaleString()} / head`;
}

export default function VenueCard({
  venue,
  selected,
  compared,
  onSelect,
  onCompare,
}: Props) {
  const minGuests = venue.tables[0] * GUESTS_PER_TABLE;
  const maxGuests = venue.tables[1] * GUESTS_PER_TABLE;
  return (
    <article
      onClick={() => onSelect(venue.id)}
      className={`group cursor-pointer rounded-2xl bg-white shadow-sm border transition overflow-hidden flex flex-col ${
        selected
          ? "border-blush-500 ring-2 ring-blush-300"
          : "border-slate-200 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <div
        className="h-40 w-full bg-cover bg-center bg-slate-200"
        style={{
          backgroundImage: venue.images[0]
            ? `url(${venue.images[0].url})`
            : undefined,
        }}
      />
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900 leading-tight">
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
        <p className="text-sm text-slate-600 line-clamp-2">{venue.blurb}</p>
        <div className="text-xs text-slate-700 mt-1 flex flex-wrap gap-x-3 gap-y-1">
          <span>💰 {formatPrice(venue.pricePerHead)}</span>
          {venue.tables[1] > 0 && (
            <span>
              🪑 {venue.tables[0]}–{venue.tables[1]} tables · up to {maxGuests}{" "}
              guests
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {venue.settings.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[11px] px-2 py-0.5 rounded-full bg-blush-50 text-blush-700 border border-blush-100"
            >
              {s}
            </span>
          ))}
          {venue.facilities.includes("Church") && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
              ⛪ Church
            </span>
          )}
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
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

export { formatPrice };
