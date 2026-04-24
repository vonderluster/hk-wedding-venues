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
  {
    label: "Rating",
    render: (v) => `★ ${v.rating} (${v.reviewCount} reviews)`,
  },
];

export default function CompareDrawer({
  venues,
  open,
  onClose,
  onRemove,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1002] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Compare Venues ({venues.length})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {venues.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Click "+ Compare" on venue cards to add them here.
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-[#F3EBE0] sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium text-slate-600 w-28 sm:w-36">
                    Attribute
                  </th>
                  {venues.map((v) => (
                    <th
                      key={v.id}
                      className="text-left font-display font-semibold text-slate-900 min-w-[160px] sm:min-w-[220px] p-0"
                    >
                      <div
                        className="h-32 w-full bg-cover bg-center bg-slate-200"
                        style={{
                          backgroundImage: v.images[0]
                            ? `url(${v.images[0].url})`
                            : undefined,
                        }}
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
                  <tr
                    key={a.label}
                    className={i % 2 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="p-3 font-medium text-slate-600 align-top">
                      {a.label}
                    </td>
                    {venues.map((v) => (
                      <td
                        key={v.id}
                        className="p-3 text-slate-800 align-top"
                      >
                        {a.render(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
