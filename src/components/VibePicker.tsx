import { useState } from "react";
import type { Venue, VenueType, Scenery } from "../data/venues";

export interface VibeSelection {
  styles: string[];
  settings: string[];
  size: string | null;
}

export const EMPTY_VIBE: VibeSelection = { styles: [], settings: [], size: null };

interface VibeOption {
  id: string;
  label: string;
  sub: string;
  emoji: string;
  imageUrl: string;
}

interface SizeOption {
  id: string;
  label: string;
  sub: string;
  emoji: string;
  minTables: number;
}

export const STYLE_OPTIONS: VibeOption[] = [
  {
    id: "grand",
    label: "Grand & Lavish",
    sub: "Luxury hotels, grand ballrooms",
    emoji: "✨",
    imageUrl:
      "https://www.hkwvdb.com/venue-photo/Rosewood%20Hong%20Kong%20Hotel/photo/rosewood-hong-kong-hotel-wedding-1.jpg",
  },
  {
    id: "intimate",
    label: "Intimate & Romantic",
    sub: "Cosy settings, closest friends only",
    emoji: "🕯",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/0a/1881_Heritage_Stable_Block_201108.jpg",
  },
  {
    id: "heritage",
    label: "Heritage & Classic",
    sub: "Historic buildings, timeless elegance",
    emoji: "🏛",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/e1/The_Peninsula_Hong_Kong_%28full_view%29.jpg",
  },
  {
    id: "nautical",
    label: "Nautical & Breezy",
    sub: "Yachts, marinas, harbour views",
    emoji: "⚓",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1c/HK_GoldCoast_Marina_Magic_Shopping_Mall_201506.jpg",
  },
  {
    id: "garden",
    label: "Garden & Whimsical",
    sub: "Lush greens, florals, open air magic",
    emoji: "🌿",
    imageUrl: "https://www.fwdhouse1881.com/images/features-img-thelawn.jpg",
  },
  {
    id: "club",
    label: "Club & Country",
    sub: "Golf clubs, rolling greens",
    emoji: "⛳",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/5a/The_Clearwater_Bay_Golf_%26_Country_Club_201407-1.jpg",
  },
];

export const SETTING_OPTIONS: VibeOption[] = [
  {
    id: "seaside",
    label: "By the Sea",
    sub: "Harbour, ocean & coastal",
    emoji: "🌊",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/The_Repulse_Bay_Overview_201501.jpg",
  },
  {
    id: "garden",
    label: "Outdoor Garden",
    sub: "Florals, open air, nature",
    emoji: "🌸",
    imageUrl:
      "https://www.countryclub.hk/upload/3_private-events/3-3_venues/_twoColGridThumb/3941/1.-The-Lawn-CCW_24Augl24_0317_Hi_Res.webp",
  },
  {
    id: "rooftop",
    label: "Rooftop & Skyline",
    sub: "Hong Kong city views, dusk light",
    emoji: "🌆",
    imageUrl:
      "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/Upper-House/upper-house/hongkong/Private-Events/the-lawn/ellermann-showcase-0054.jpg",
  },
  {
    id: "grassland",
    label: "Open Grassland",
    sub: "Rolling hills, countryside feel",
    emoji: "🌾",
    imageUrl:
      "https://www.hkwvdb.com/venue-photo/Hyatt%20Regency%20Hong%20Kong%20Shatin/87/Hyatt-Regency-Hong-Kong-Shatin-05.jpg",
  },
];

export const SIZE_OPTIONS: SizeOption[] = [
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

// "Garden & Whimsical" style also matches venues with Outdoor Garden scenery,
// since the style isn't tied to a single venue type.
const STYLE_TO_SCENERY: Record<string, Scenery[]> = {
  garden: ["Outdoor Garden"],
};

const SETTING_TO_SCENERY: Record<string, Scenery[]> = {
  seaside:   ["Seaside"],
  garden:    ["Outdoor Garden"],
  rooftop:   ["Rooftop"],
  grassland: ["Grassland"],
};

export function getStyleOption(id: string): VibeOption | undefined {
  return STYLE_OPTIONS.find((o) => o.id === id);
}
export function getSettingOption(id: string): VibeOption | undefined {
  return SETTING_OPTIONS.find((o) => o.id === id);
}
export function getSizeOption(id: string): SizeOption | undefined {
  return SIZE_OPTIONS.find((o) => o.id === id);
}

export function vibeIsEmpty(vibe: VibeSelection): boolean {
  return vibe.styles.length === 0 && vibe.settings.length === 0 && vibe.size === null;
}

/** Capacity is a real constraint, so size remains a hard filter (min tables). */
export function vibeMinTables(vibe: VibeSelection): number {
  if (!vibe.size) return 0;
  return getSizeOption(vibe.size)?.minTables ?? 0;
}

/** Soft match: returns score (higher = better fit) and human-readable reasons. */
export function vibeMatchScore(
  venue: Venue,
  vibe: VibeSelection,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  for (const styleId of vibe.styles) {
    const types = STYLE_TO_VENUE_TYPE[styleId] ?? [];
    const sceneries = STYLE_TO_SCENERY[styleId] ?? [];
    const typeMatch = types.length > 0 && types.some((t) => venue.venueTypes.includes(t));
    const sceneryMatch =
      sceneries.length > 0 && sceneries.some((s) => venue.scenery.includes(s));
    if (typeMatch || sceneryMatch) {
      score += 30;
      const opt = getStyleOption(styleId);
      if (opt) reasons.push(opt.label);
    }
  }

  for (const settingId of vibe.settings) {
    const sceneries = SETTING_TO_SCENERY[settingId] ?? [];
    if (sceneries.some((s) => venue.scenery.includes(s))) {
      score += 25;
      const opt = getSettingOption(settingId);
      if (opt) reasons.push(opt.label);
    }
  }

  return { score, reasons };
}

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
      className={`relative rounded-2xl overflow-hidden text-left transition-all duration-150 bg-slate-300 ${
        selected
          ? "ring-4 ring-blush-500 shadow-lg scale-[1.02]"
          : "shadow-sm hover:shadow-md hover:scale-[1.01]"
      }`}
      style={{
        backgroundImage: `url(${option.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark gradient overlay for label legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10 pointer-events-none" />
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/95 flex items-center justify-center shadow z-10">
          <span className="text-blush-700 text-xs font-bold">✓</span>
        </div>
      )}
      <div className="relative p-5 sm:p-6 h-36 sm:h-40 flex flex-col justify-end">
        <div className="font-display text-base sm:text-lg leading-tight text-white drop-shadow-md">
          <span className="mr-1.5">{option.emoji}</span>
          {option.label}
        </div>
        <div className="text-xs mt-1 leading-snug text-white/90 drop-shadow">
          {option.sub}
        </div>
      </div>
    </button>
  );
}

export default function VibePicker({
  initial,
  onComplete,
}: {
  initial?: VibeSelection;
  onComplete: (selection: VibeSelection) => void;
}) {
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(
    new Set(initial?.styles ?? []),
  );
  const [selectedSettings, setSelectedSettings] = useState<Set<string>>(
    new Set(initial?.settings ?? []),
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(initial?.size ?? null);

  const toggleSet = (set: Set<string>, id: string): Set<string> => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  };

  const canProceed =
    selectedStyles.size > 0 || selectedSettings.size > 0 || selectedSize !== null;

  const handleComplete = () => {
    onComplete({
      styles: Array.from(selectedStyles),
      settings: Array.from(selectedSettings),
      size: selectedSize,
    });
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
            Pick what speaks to you — we'll rank Hong Kong wedding venues that match your dream day.
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
            Find our venues →
          </button>
          {!canProceed && (
            <p className="text-sm text-slate-400">Pick at least one option above to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}
