import type { Venue } from "../data/venues";
import { GUESTS_PER_TABLE } from "../data/venues";
import { formatPrice } from "./VenueCard";

interface Props {
  venues: Venue[];
  open: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}

const attrs: { label: string; render: (v: Venue) => React.ReactNode }[] = [
  { label: "District", render: (v) => v.district },
  { label: "Price", render: (v) => formatPrice(v.pricePerHead) },
  {
    label: "Capacity",
    render: (v) =>
      v.tables[1] === 0
        ? "—"
        : v.tables[0] > 1
        ? `${v.tables[0]}–${v.tables[1]} tables (up to ${v.tables[1] * GUESTS_PER_TABLE} guests)`
        : `Up to ${v.tables[1]} tables (up to ${v.tables[1] * GUESTS_PER_TABLE} guests)`,
  },
  { label: "Dietary options", render: (v) => v.dietaryOptions.join(", ") },
  { label: "Venue type", render: (v) => v.venueTypes.join(", ") },
  { label: "Scenery", render: (v) => v.scenery.join(", ") || "—" },
  { label: "Facilities", render: (v) => v.facilities.join(", ") },
  { label: "Rating", render: (v) => `★ ${v.rating} (${v.reviewCount.toLocaleString()} reviews)` },
];

export default function CompareDrawer({ venues, open, onClose, onRemove }: Props) {
  if (!open) return null;

  const cols = venues.length;
  const gridCols = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="fixed inset-0 z-[1002] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[88vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b shrink-0">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Compare Venues ({venues.length})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 text-2xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {venues.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Tap "+ Compare" on venue cards to add them here.
          </div>
        ) : (
          <>
            {/* ── Mobile layout: attribute-first stacked rows ── */}
            <div className="sm:hidden flex-1 overflow-y-auto overflow-x-hidden">

              {/* Sticky venue header strip */}
              <div className={`grid ${gridCols} sticky top-0 bg-white z-10 border-b shadow-sm`}>
                {venues.map((v) => (
                  <div key={v.id} className="flex flex-col border-r last:border-r-0">
                    <div
                      className="h-24 bg-cover bg-center bg-slate-200 shrink-0"
                      style={{ backgroundImage: v.images[0] ? `url(${v.images[0].url})` : undefined }}
                    />
                    <div className="px-2 py-1.5 flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                        {v.name}
                      </span>
                      <button
                        onClick={() => onRemove(v.id)}
                        className="text-[10px] text-slate-400 hover:text-red-600 text-left mt-0.5"
                      >
                        remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attribute rows */}
              {attrs.map((a, i) => (
                <div key={a.label} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                  <p className="px-3 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {a.label}
                  </p>
                  <div className={`grid ${gridCols}`}>
                    {venues.map((v) => (
                      <div key={v.id} className="px-3 pb-2 text-sm text-slate-800 border-r last:border-r-0">
                        {a.render(v)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop layout: classic table ── */}
            <div className="hidden sm:block overflow-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-[#F3EBE0] sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-medium text-slate-600 w-36">
                      Attribute
                    </th>
                    {venues.map((v) => (
                      <th
                        key={v.id}
                        className="text-left font-display font-semibold text-slate-900 min-w-[200px] p-0"
                      >
                        <div
                          className="h-32 w-full bg-cover bg-center bg-slate-200"
                          style={{ backgroundImage: v.images[0] ? `url(${v.images[0].url})` : undefined }}
                        />
                        <div className="flex items-start justify-between gap-2 p-3">
                          <span>{v.name}</span>
                          <button
                            onClick={() => onRemove(v.id)}
                            className="text-xs text-slate-400 hover:text-red-600 shrink-0"
                          >
                            remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attrs.map((a, i) => (
                    <tr key={a.label} className={i % 2 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="p-3 font-medium text-slate-600 align-top">{a.label}</td>
                      {venues.map((v) => (
                        <td key={v.id} className="p-3 text-slate-800 align-top">
                          {a.render(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
