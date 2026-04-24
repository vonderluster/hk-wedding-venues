import { useState } from "react";
import type { VenueType, Scenery } from "../data/venues";

export interface VibeFilters {
  venueTypes: VenueType[];
  scenery: Scenery[];
  minTables: number;
}

interface VibeOption {
  id: string;
  label: string;
  sub: string;
  emoji: string;
  gradient: string;
  textColor: string;
}

interface SizeOption {
  id: string;
  label: string;
  sub: string;
  emoji: string;
  minTables: number;
}

const STYLE_OPTIONS: VibeOption[] = [
  {
    id: "grand",
    label: "Grand & Lavish",
    sub: "Luxury hotels, grand ballrooms",
    emoji: "✨",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
    textColor: "#e8d5b7",
  },
  {
    id: "intimate",
    label: "Intimate & Romantic",
    sub: "Cosy settings, closest friends only",
    emoji: "🕯",
    gradient: "linear-gradient(135deg, #c9897a 0%, #b07060 60%, #8a5040 100%)",
    textColor: "#fff0eb",
  },
  {
    id: "heritage",
    label: "Heritage & Classic",
    sub: "Historic buildings, timeless elegance",
    emoji: "🏛",
    gradient: "linear-gradient(135deg, #7a5c1e 0%, #9a7830 60%, #c4a050 100%)",
    textColor: "#fff8e7",
  },
  {
    id: "nautical",
    label: "Nautical & Breezy",
    sub: "Yachts, marinas, harbour views",
    emoji: "⚓",
    gradient: "linear-gradient(135deg, #03045e 0%, #0077b6 60%, #48cae4 100%)",
    textColor: "#caf0f8",
  },
  {
    id: "garden",
    label: "Garden & Whimsical",
    sub: "Lush greens, florals, open air magic",
    emoji: "🌿",
    gradient: "linear-gradient(135deg, #1b4332 0%, #40916c 60%, #74c69d 100%)",
    textColor: "#d8f3dc",
  },
  {
    id: "club",
    label: "Club & Country",
    sub: "Golf clubs, rolling greens",
    emoji: "⛳",
    gradient: "linear-gradient(135deg, #4a5820 0%, #7a8a38 60%, #b8c860 100%)",
    textColor: "#f0f8d0",
  },
];

const SETTING_OPTIONS: VibeOption[] = [
  {
    id: "seaside",
    label: "By the Sea",
    sub: "Harbour, ocean & coastal",
    emoji: "🌊",
    gradient: "linear-gradient(135deg, #005f73 0%, #0a9396 60%, #94d2bd 100%)",
    textColor: "#e0fbfc",
  },
  {
    id: "garden",
    label: "Outdoor Garden",
    sub: "Florals, open air, nature",
    emoji: "🌸",
    gradient: "linear-gradient(135deg, #2d6a4f 0%, #52b788 60%, #b7e4c7 100%)",
    textColor: "#1b4332",
  },
  {
    id: "rooftop",
    label: "Rooftop & Skyline",
    sub: "Hong Kong city views, dusk light",
    emoji: "🌆",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #533483 60%, #c94b63 100%)",
    textColor: "#ffd7e0",
  },
  {
    id: "grassland",
    label: "Open Grassland",
    sub: "Rolling hills, countryside feel",
    emoji: "🌾",
    gradient: "linear-gradient(135deg, #6a6930 0%, #a89a48 60%, #e8d878 100%)",
    textColor: "#2a2808",
  },
];

const SIZE_OPTIONS: SizeOption[] = [
  { id: "micro",   label: "Micro",    sub: "Up to 50 guests",   emoji: "💍", minTables: 0  },
  { id: "cozy",    label: "Intimate", sub: "50 – 100 guests",   emoji: "🥂", minTables: 4  },
  { id: "classic", label: "Classic",  sub: "100 – 180 guests",  emoji: "🎊", minTables: 8  },
  { id: "grand",   label: "Grand",    sub: "180+ guests",       emoji: "🎉", minTables: 15 },
];

const STYLE_TO_VENUE_TYPE: Record<string, VenueType[]> = {
  grand:    ["Hotel/Resort", "Ballroom"],
  intimate: ["Restaurant"],
  heritage: ["Heritage"],
  nautical: ["Yacht & Marina"],
  garden:   [],
  club:     ["Golf & Country Club"],
};

const SETTING_TO_SCENERY: Record<string, Scenery[]> = {
  seaside:   ["Seaside"],
  garden:    ["Outdoor Garden"],
  rooftop:   ["Rooftop"],
  grassland: ["Grassland"],
};

function VibeCard({
  option,
  selected,
  onToggle,
}: {
  option: VibeOption;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative rounded-2xl overflow-hidden text-left transition-all duration-150 ${
        selected
          ? "ring-4 ring-blush-500 shadow-lg scale-[1.02]"
          : "shadow-sm hover:shadow-md hover:scale-[1.01]"
      }`}
      style={{ background: option.gradient }}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
          <span className="text-blush-700 text-xs font-bold">✓</span>
        </div>
      )}
      <div className="p-5 sm:p-6 h-36 sm:h-40 flex flex-col justify-end">
        <div className="text-3xl mb-2">{option.emoji}</div>
        <div
          className="font-display text-base sm:text-lg leading-tight"
          style={{ color: option.textColor }}
        >
          {option.label}
        </div>
        <div
          className="text-xs mt-1 leading-snug"
          style={{ color: option.textColor, opacity: 0.75 }}
        >
          {option.sub}
        </div>
      </div>
    </button>
  );
}

export default function VibePicker({
  onComplete,
}: {
  onComplete: (filters: VibeFilters) => void;
}) {
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(new Set());
  const [selectedSettings, setSelectedSettings] = useState<Set<string>>(new Set());
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const toggleSet = (set: Set<string>, id: string): Set<string> => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  };

  const canProceed =
    selectedStyles.size > 0 || selectedSettings.size > 0 || selectedSize !== null;

  const handleComplete = () => {
    const venueTypes: VenueType[] = [];
    const scenery: Scenery[] = [];

    selectedStyles.forEach((id) => {
      STYLE_TO_VENUE_TYPE[id]?.forEach((t) => {
        if (!venueTypes.includes(t)) venueTypes.push(t);
      });
    });

    selectedSettings.forEach((id) => {
      SETTING_TO_SCENERY[id]?.forEach((s) => {
        if (!scenery.includes(s)) scenery.push(s);
      });
    });

    const size = SIZE_OPTIONS.find((s) => s.id === selectedSize);
    onComplete({ venueTypes, scenery, minTables: size?.minTables ?? 0 });
  };

  return (
    <div className="flex-1 overflow-auto scrollbar-hide">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-12 sm:py-16">

        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-[#3d2a1e] mb-3">
            What's your vibe?
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Pick what speaks to you — we'll find venues that match your dream day.
          </p>
        </div>

        {/* Style */}
        <section className="mb-10">
          <h3 className="font-display text-xl text-[#5C4A35] mb-1">Your style</h3>
          <p className="text-sm text-slate-400 mb-4">Pick all that resonate</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {STYLE_OPTIONS.map((opt) => (
              <VibeCard
                key={opt.id}
                option={opt}
                selected={selectedStyles.has(opt.id)}
                onToggle={() => setSelectedStyles(toggleSet(selectedStyles, opt.id))}
              />
            ))}
          </div>
        </section>

        {/* Setting */}
        <section className="mb-10">
          <h3 className="font-display text-xl text-[#5C4A35] mb-1">The setting</h3>
          <p className="text-sm text-slate-400 mb-4">Where does the magic happen?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SETTING_OPTIONS.map((opt) => (
              <VibeCard
                key={opt.id}
                option={opt}
                selected={selectedSettings.has(opt.id)}
                onToggle={() => setSelectedSettings(toggleSet(selectedSettings, opt.id))}
              />
            ))}
          </div>
        </section>

        {/* Size */}
        <section className="mb-14">
          <h3 className="font-display text-xl text-[#5C4A35] mb-1">Your gathering</h3>
          <p className="text-sm text-slate-400 mb-4">How many loved ones?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() =>
                  setSelectedSize(selectedSize === opt.id ? null : opt.id)
                }
                className={`rounded-2xl p-5 text-left transition-all duration-150 border-2 ${
                  selectedSize === opt.id
                    ? "border-blush-600 bg-blush-50 shadow-md scale-[1.02]"
                    : "border-[#D9CDBF] bg-white hover:border-blush-300 hover:shadow-sm"
                }`}
              >
                <div className="text-3xl mb-2">{opt.emoji}</div>
                <div className="font-display text-lg text-slate-900">{opt.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-y-3">
          <button
            onClick={handleComplete}
            disabled={!canProceed}
            className="px-12 py-4 rounded-xl bg-blush-600 text-white font-medium text-base hover:bg-blush-700 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Show me my venues →
          </button>
          {!canProceed && (
            <p className="text-sm text-slate-400">Pick at least one option above to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}
