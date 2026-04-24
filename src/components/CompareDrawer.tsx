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
        : `${v.tables[0]}–${v.tables[1]} tables (up to ${
            v.tables[1] * GUESTS_PER_TABLE
          } guests)`,
  },
  { label: "Dietary options", render: (v) => v.dietaryOptions.join(", ") },
  { label: "Setting", render: (v) => v.settings.join(", ") },
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
    <div className="fixed inset-0 z-[1000] bg-black/40 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col">
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
              <thead className="bg-blush-50 sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium text-slate-600 w-36">
                    Attribute
                  </th>
                  {venues.map((v) => (
                    <th
                      key={v.id}
                      className="text-left p-3 font-display font-semibold text-slate-900 min-w-[220px]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span>{v.name}</span>
                        <button
                          onClick={() => onRemove(v.id)}
                          className="text-xs text-slate-400 hover:text-red-600"
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
