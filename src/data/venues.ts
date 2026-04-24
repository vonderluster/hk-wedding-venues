export type VenueType =
  | "Hotel/Resort"
  | "Ballroom"
  | "Restaurant"
  | "Heritage"
  | "Church"
  | "Yacht & Marina"
  | "Golf & Country Club"
  | "Public Park";

export type Scenery =
  | "Outdoor Garden"
  | "Grassland"
  | "Rooftop"
  | "Seaside";

export type Facility =
  | "Projector"
  | "TV Screen"
  | "Built-in Audio"
  | "Special Effects"
  | "Pillar-free Ballroom"
  | "Floor-to-ceiling Windows"
  | "Reception Foyer"
  | "Bridal Suite"
  | "Parking"
  | "Shuttle Service"
  | "In-house Catering"
  | "Dance Floor"
  | "Stage"
  | "Outdoor Ceremony Area"
  | "Sea View"
  | "Live Band Ready";

export type District =
  | "Central & Western"
  | "Wan Chai"
  | "Eastern"
  | "Southern"
  | "Kowloon City"
  | "Yau Tsim Mong"
  | "Sha Tin"
  | "Tai Po"
  | "Sai Kung"
  | "Tsuen Wan"
  | "Islands";

export type ImageKind = "exterior" | "interior" | "facility" | "floor-plan";

export interface TransportInfo {
  mtr?: { station: string; line: string; exit?: string; walkMins: number };
  bus?: string[];
  minibus?: string[];
  ferry?: string;
  shuttle?: string;
  notes?: string;
}

export interface VenueImage {
  url: string;
  kind: ImageKind;
  caption: string;
}

export interface Venue {
  id: string;
  name: string;
  district: District;
  address: string;
  lat: number;
  lng: number;
  /** Per-head price range in HKD (computed from hkwvdb per-table ÷ 12 where available) */
  pricePerHead: [number, number];
  /** Min / max capacity in tables (assume ~12 guests per table) */
  tables: [number, number];
  venueTypes: VenueType[];
  scenery: Scenery[];
  facilities: Facility[];
  rating: number;
  reviewCount: number;
  /** Dietary accommodations the venue's kitchen can prepare */
  dietaryOptions: string[];
  images: VenueImage[];
  blurb: string;
  reviews: { author: string; rating: number; text: string }[];
  transport: TransportInfo;
  /** Link to the hkwvdb.com detail page used as the source of truth (if available) */
  hkwvdbUrl?: string;
  /** Link to the venue's official wedding/enquiry page */
  enquiryUrl?: string;
  /** Social media profile links */
  socialMedia?: { instagram?: string; facebook?: string };
}

export const VENUE_TYPES: VenueType[] = [
  "Hotel/Resort",
  "Ballroom",
  "Restaurant",
  "Heritage",
  "Church",
  "Yacht & Marina",
  "Golf & Country Club",
  "Public Park",
];

export const SCENERY: Scenery[] = [
  "Outdoor Garden",
  "Grassland",
  "Rooftop",
  "Seaside",
];

export const FACILITIES: Facility[] = [
  "Projector",
  "TV Screen",
  "Built-in Audio",
  "Special Effects",
  "Pillar-free Ballroom",
  "Floor-to-ceiling Windows",
  "Reception Foyer",
  "Bridal Suite",
  "Stage",
  "Dance Floor",
  "Live Band Ready",
  "Outdoor Ceremony Area",
  "Sea View",
  "In-house Catering",
  "Parking",
  "Shuttle Service",
];

export const DISTRICTS: District[] = [
  "Central & Western",
  "Wan Chai",
  "Eastern",
  "Southern",
  "Kowloon City",
  "Yau Tsim Mong",
  "Sha Tin",
  "Tai Po",
  "Sai Kung",
  "Tsuen Wan",
  "Islands",
];

export const GUESTS_PER_TABLE = 12;

export const venues: Venue[] = [
  {
    id: "rosewood-hk",
    name: "Rosewood Hong Kong",
    district: "Yau Tsim Mong",
    address: "Victoria Dockside, 18 Salisbury Rd, Tsim Sha Tsui",
    lat: 22.2948,
    lng: 114.1759,
    pricePerHead: [1800, 3200],
    tables: [1, 65],
    venueTypes: ["Hotel/Resort", "Ballroom"],
    scenery: [],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Bridal Suite",
      "Parking",
      "In-house Catering",
      "Dance Floor",
      "Outdoor Ceremony Area",
      "Live Band Ready",
    ],
    rating: 4.5,
    reviewCount: 491,
    dietaryOptions: [
      "Vegetarian",
      "Vegan",
      "Halal",
      "Kosher (by request)",
      "Gluten-free",
      "Nut-free",
    ],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/Rosewood%20Hong%20Kong%20Hotel/photo/rosewood-hong-kong-hotel-wedding-1.jpg",
        kind: "interior",
        caption: "Wedding setup at Rosewood (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Rosewood%20Hong%20Kong%20Hotel/photo/rosewood-hong-kong-hotel-wedding-2.jpg",
        kind: "interior",
        caption: "Ballroom view (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Rosewood%20Hong%20Kong%20Hotel/photo/rosewood-hong-kong-hotel-wedding-3.jpg",
        kind: "interior",
        caption: "Reception floor (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Rosewood_Hong_Kong.png",
        kind: "exterior",
        caption: "Tower exterior on Victoria Dockside",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/3/32/Rosewood_Hong_Kong_Lobby_The_Skin_Speaks_A_Language_Not_Its_Own_2019.jpg",
        kind: "interior",
        caption: "Grand lobby",
      },
    ],
    blurb:
      "Five-star harbourfront glamour with floor-to-ceiling views of Victoria Harbour. Up to 65 tables in the grand ballroom.",
    reviews: [
      {
        author: "Priscilla L.",
        rating: 5,
        text: "Every detail was perfect, from the tasting menu to the bridal suite.",
      },
      {
        author: "Kenneth W.",
        rating: 4.5,
        text: "Breathtaking views. A little pricey but worth it for 30 tables.",
      },
    ],
    transport: {
      mtr: { station: "East Tsim Sha Tsui", line: "Tsuen Wan Line", exit: "P1", walkMins: 5 },
      bus: ["1", "1A", "2", "5C"],
      notes: "Direct access via Victoria Dockside waterfront promenade.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/rosewood-hong-kong-hotel/178",
    enquiryUrl: "https://www.rosewoodhotels.com/en/hong-kong/weddings",
    socialMedia: {
      instagram: "https://www.instagram.com/rosewoodhongkong/",
      facebook: "https://www.facebook.com/rosewoodhongkong/",
    },
  },
  {
    id: "peninsula-hk",
    name: "The Peninsula Hong Kong",
    district: "Yau Tsim Mong",
    address: "Salisbury Rd, Tsim Sha Tsui",
    lat: 22.2953,
    lng: 114.172,
    pricePerHead: [2000, 3500],
    tables: [15, 50],
    venueTypes: ["Hotel/Resort", "Heritage", "Ballroom"],
    scenery: [],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Bridal Suite",
      "Parking",
      "In-house Catering",
      "Dance Floor",
      "Reception Foyer",
      "Live Band Ready",
    ],
    rating: 4.6,
    reviewCount: 7486,
    dietaryOptions: [
      "Vegetarian",
      "Vegan",
      "Halal",
      "Kosher (by request)",
      "Gluten-free",
      "Nut-free",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/e/e1/The_Peninsula_Hong_Kong_%28full_view%29.jpg",
        kind: "exterior",
        caption: "Full façade in TST",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/e/ee/HK_TST_The_Peninsula_hotel.jpg",
        kind: "exterior",
        caption: "Main driveway and entrance",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/1/12/The_Peninsula.jpg",
        kind: "exterior",
        caption: "Heritage façade",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Peninsula_Hong_Kong_RR_Phantom.JPG",
        kind: "facility",
        caption: "In-house Rolls-Royce Phantom fleet for the bridal party",
      },
    ],
    blurb:
      "Timeless colonial elegance and white-glove service in the Grand Ballroom. (Not listed on hkwvdb.com — details unverified.)",
    reviews: [
      {
        author: "Agnes C.",
        rating: 5,
        text: "Old-world elegance, nothing beats the Peninsula for a traditional banquet.",
      },
    ],
    transport: {
      mtr: { station: "Tsim Sha Tsui", line: "Tsuen Wan / Kwun Tong Lines", exit: "E", walkMins: 3 },
      bus: ["1", "1A", "2", "5", "6"],
      notes: "In-house Rolls-Royce fleet available for bridal party transfers.",
    },
    enquiryUrl: "https://www.peninsula.com/en/hong-kong/events/hotel-wedding-venues",
    socialMedia: {
      instagram: "https://www.instagram.com/peninsulahongkong/",
      facebook: "https://www.facebook.com/ThePeninsulaHongKong/",
    },
  },
  {
    id: "repulse-bay",
    name: "The Repulse Bay",
    district: "Southern",
    address: "109 Repulse Bay Rd",
    lat: 22.2352,
    lng: 114.1964,
    pricePerHead: [1400, 2400],
    tables: [1, 18],
    venueTypes: ["Heritage"],
    scenery: ["Seaside", "Outdoor Garden"],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Bridal Suite",
      "Parking",
      "In-house Catering",
      "Outdoor Ceremony Area",
      "Sea View",
      "Live Band Ready",
    ],
    rating: 4.6,
    reviewCount: 46,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Nut-free"],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Repulse%20Bay/photo/The-Repulse-Bay-Hong-Kong-wedding-01.jpg",
        kind: "interior",
        caption: "Wedding reception (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Repulse%20Bay/48/the-repulse-bay-the-verandah-01.jpg",
        kind: "interior",
        caption: "The Verandah dining room (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Repulse%20Bay/49/the-repulse-bay-01.jpg",
        kind: "facility",
        caption: "The Marquee garden tent (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/The_Repulse_Bay_Overview_201501.jpg",
        kind: "exterior",
        caption: "Seaside exterior overlooking Repulse Bay",
      },
    ],
    blurb:
      "Colonial verandahs, sea-breeze ceremonies, and palm-lined gardens. The Verandah room seats up to 18 tables; the Marquee tent seats up to 16.",
    reviews: [
      {
        author: "Jen & Marcus",
        rating: 5,
        text: "Dreamy outdoor ceremony at sunset. Guests loved the beachside vibe.",
      },
      {
        author: "Florence K.",
        rating: 4,
        text: "Beautiful but be prepared for weather backup plans in summer.",
      },
    ],
    transport: {
      bus: ["6", "6A", "6X", "260"],
      minibus: ["40 (from Causeway Bay)", "40M (from Happy Valley)"],
      notes: "No MTR nearby. Taxi from Admiralty ~20 min. Venue provides parking.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/the-repulse-bay/56",
    enquiryUrl: "https://www.therepulsebay.com/en/weddings-events-venues-hong-kong/enquiry",
    socialMedia: {
      instagram: "https://www.instagram.com/therepulsebayhongkong/",
      facebook: "https://www.facebook.com/therepulsebayclub/",
    },
  },
  {
    id: "hullett-house",
    name: "Hullett House",
    district: "Yau Tsim Mong",
    address: "2A Canton Rd, 1881 Heritage",
    lat: 22.2942,
    lng: 114.1686,
    pricePerHead: [1200, 2200],
    tables: [8, 25],
    venueTypes: ["Heritage"],
    scenery: ["Outdoor Garden"],
    facilities: [
      "Outdoor Ceremony Area",
      "Built-in Audio",
      "In-house Catering",
      "Bridal Suite",
      "Parking",
    ],
    rating: 4.4,
    reviewCount: 4248,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free"],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/1881_Heritage_Complex.jpg",
        kind: "exterior",
        caption: "1881 Heritage compound",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/1881_Heritage_Stable_Block_201108.jpg",
        kind: "facility",
        caption: "Stables Grill courtyard",
      },
    ],
    transport: {
      mtr: { station: "Tsim Sha Tsui", line: "Tsuen Wan / Kwun Tong Lines", exit: "E", walkMins: 5 },
      bus: ["1", "1A", "2", "6"],
      notes: "Also accessible from East Tsim Sha Tsui MTR (Exit L6, ~5 min).",
    },
    blurb:
      "Victorian-era former Marine Police HQ, candlelit courtyards in the heart of TST. (Not listed on hkwvdb.com — details unverified.)",
    reviews: [
      {
        author: "Daisy T.",
        rating: 4.5,
        text: "Unique heritage backdrop, our photos looked like a movie.",
      },
    ],
  },
  {
    id: "verandah",
    name: "The Verandah",
    district: "Southern",
    address: "109 Repulse Bay Rd",
    lat: 22.2349,
    lng: 114.1969,
    pricePerHead: [1300, 2000],
    tables: [6, 18],
    venueTypes: ["Restaurant", "Heritage"],
    scenery: ["Seaside"],
    facilities: [
      "Built-in Audio",
      "In-house Catering",
      "Outdoor Ceremony Area",
      "Sea View",
    ],
    rating: 4.4,
    reviewCount: 687,
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-free", "Nut-free"],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/The_Repulse_Bay_The_Verandah_2015.JPG",
        kind: "interior",
        caption: "Colonial dining room",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/The_Repulse_Bay_Overview_201501.jpg",
        kind: "exterior",
        caption: "Beachside building exterior",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/5/50/The_Repulse_Bay_Shopping_Arcade_Garden_201501.jpg",
        kind: "facility",
        caption: "Adjacent garden for receptions",
      },
    ],
    blurb:
      "Intimate beachfront restaurant, perfect for smaller weddings under 20 tables. (Bookable as part of The Repulse Bay complex.)",
    reviews: [
      {
        author: "Linda H.",
        rating: 5,
        text: "Best brunch reception ever. Felt like a destination wedding.",
      },
    ],
    transport: {
      bus: ["6", "6A", "6X", "260"],
      minibus: ["40 (from Causeway Bay)", "40M (from Happy Valley)"],
      notes: "No MTR nearby. Taxi from Admiralty ~20 min. Free parking on site.",
    },
    enquiryUrl: "https://www.therepulsebay.com/en/weddings-events-venues-hong-kong/weddings-outdoor",
    socialMedia: {
      instagram: "https://www.instagram.com/theverandah.hongkong/",
      facebook: "https://www.facebook.com/theverandahrepulsebay/",
    },
  },
  {
    id: "hyatt-shatin",
    name: "Hyatt Regency Sha Tin",
    district: "Sha Tin",
    address: "18 Chak Cheung St, Sha Tin",
    lat: 22.4144,
    lng: 114.2098,
    pricePerHead: [1140, 1290],
    tables: [1, 32],
    venueTypes: ["Hotel/Resort"],
    scenery: ["Outdoor Garden", "Grassland"],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Pillar-free Ballroom",
      "Floor-to-ceiling Windows",
      "Bridal Suite",
      "Parking",
      "In-house Catering",
      "Dance Floor",
      "Outdoor Ceremony Area",
    ],
    rating: 4.2,
    reviewCount: 3953,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Nut-free"],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/Hyatt%20Regency%20Hong%20Kong%20Shatin/photo/Hyatt-Regency-Hong-Kong-wedding-1.jpg",
        kind: "interior",
        caption: "Regency Ballroom set for wedding (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hyatt%20Regency%20Hong%20Kong%20Shatin/photo/Hyatt-Regency-Hong-Kong-wedding-2.jpg",
        kind: "interior",
        caption: "Ballroom decorated (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hyatt%20Regency%20Hong%20Kong%20Shatin/87/Hyatt-Regency-Hong-Kong-Shatin-05.jpg",
        kind: "facility",
        caption: "Outdoor terrace (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/HK_TeachingHotelOfHKCU_Hyatt_4.JPG",
        kind: "exterior",
        caption: "Hotel exterior on CUHK campus",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hyatt%20Regency%20Hong%20Kong%20Shatin/87/Hyatt-Regency-Hong-Kong-floor-plan-1.jpg",
        kind: "floor-plan",
        caption: "Regency Ballroom floor plan (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hyatt%20Regency%20Hong%20Kong%20Shatin/87/Hyatt-Regency-Hong-Kong-floor-plan-3.jpg",
        kind: "floor-plan",
        caption: "Ballroom configurations (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hyatt%20Regency%20Hong%20Kong%20Shatin/88/Hyatt-Regency-Hong-Kong-floor-plan-1.jpg",
        kind: "floor-plan",
        caption: "Salon floor plan (hkwvdb.com)",
      },
    ],
    blurb:
      "Pillar-free Regency Ballroom seats up to 32 tables, with floor-to-ceiling windows and an outdoor terrace for garden ceremonies. Per-table HK$13,688–15,388 (hkwvdb.com).",
    reviews: [
      {
        author: "Terence L.",
        rating: 5,
        text: "Wide open garden for the ceremony, tons of parking for family from the NT.",
      },
    ],
    transport: {
      mtr: { station: "Che Kung Temple", line: "East Rail Line", walkMins: 10 },
      bus: ["85K", "89B"],
      shuttle: "Free shuttle from University MTR and Sha Tin town centre on request.",
      notes: "On CUHK campus — ample free parking for guests.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/hyatt-regency-hong-kong-shatin/21",
    enquiryUrl: "https://www.hyatt.com/hyatt-regency/en-US/shahr-hyatt-regency-hong-kong-sha-tin/weddings",
    socialMedia: {
      instagram: "https://www.instagram.com/hyattshatin/",
      facebook: "https://www.facebook.com/HyattRegencyShaTin/",
    },
  },
  {
    id: "gold-coast-yacht",
    name: "Gold Coast Yacht & Country Club",
    district: "Tsuen Wan",
    address: "1 Castle Peak Rd, Gold Coast",
    lat: 22.3964,
    lng: 113.9784,
    pricePerHead: [640, 1220],
    tables: [1, 26],
    venueTypes: ["Yacht & Marina"],
    scenery: ["Seaside", "Outdoor Garden", "Grassland"],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Bridal Suite",
      "In-house Catering",
      "Parking",
      "Shuttle Service",
      "Sea View",
      "Outdoor Ceremony Area",
      "Dance Floor",
    ],
    rating: 4.2,
    reviewCount: 402,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free"],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/Gold%20Coast%20Yacht%20and%20Country%20Club/photo/gold-coast-yacht-and-country-club-floorplan.jpg",
        kind: "floor-plan",
        caption: "Ballroom floor plan (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Gold%20Coast%20Yacht%20and%20Country%20Club/photo/gold-coast-yacht-and-country-club-floorplan-garden.jpg",
        kind: "floor-plan",
        caption: "Garden floor plan (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Gold%20Coast%20Yacht%20and%20Country%20Club/photo/gold-coast-yacht-and-country-club-floorplan-the-deck.jpg",
        kind: "floor-plan",
        caption: "The Deck floor plan (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/HK_GoldCoast_Marina_Magic_Shopping_Mall_201506.jpg",
        kind: "exterior",
        caption: "Gold Coast marina frontage",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/0/07/Gold_Coast_Dolphin_Square_in_Hong_Kong.JPG",
        kind: "facility",
        caption: "Dolphin Square promenade",
      },
    ],
    blurb:
      "Waterside lawns and marina views. Ballroom seats up to 26 tables; per-table HK$7,688–14,688 plus buffet options (hkwvdb.com). Free shuttle bus service.",
    reviews: [
      {
        author: "Vivian S.",
        rating: 4,
        text: "Sunset over the water was magical. A bit far, charter a coach for guests.",
      },
    ],
    transport: {
      bus: ["53 (from Tsuen Wan MTR)", "59A (from Tsuen Wan West MTR)"],
      shuttle: "Free shuttle bus for wedding guests — confirm schedule with venue.",
      notes: "Light Rail: Sam Shing or Gold Coast stop (~10 min walk). Ample parking on site.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/gold-coast-yacht-and-country-club/1",
    enquiryUrl: "https://www.gcycc.com.hk/en/celebration-meeting-venue/weddings/",
    socialMedia: {
      instagram: "https://www.instagram.com/goldcoastyachtcountryclub/",
      facebook: "https://www.facebook.com/goldcoastyachtcountryclub/",
    },
  },
  {
    id: "hong-kong-gold-coast-hotel",
    name: "Hong Kong Gold Coast Hotel",
    district: "Tsuen Wan",
    address: "1 Castle Peak Rd, Gold Coast",
    lat: 22.3978,
    lng: 113.9801,
    pricePerHead: [640, 1370],
    tables: [1, 38],
    venueTypes: ["Hotel/Resort"],
    scenery: ["Seaside", "Grassland"],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Pillar-free Ballroom",
      "Reception Foyer",
      "Bridal Suite",
      "Parking",
      "In-house Catering",
      "Dance Floor",
      "Sea View",
      "Outdoor Ceremony Area",
    ],
    rating: 4.2,
    reviewCount: 7040,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free"],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/Hong%20Kong%20Gold%20Coast%20Hotel/photo/Gold-Coast-Hotel-wedding.jpg",
        kind: "interior",
        caption: "Wedding setup (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hong%20Kong%20Gold%20Coast%20Hotel/83/Gold-Coast-Hotel-02.jpg",
        kind: "facility",
        caption: "Ballroom setup (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/4/46/Hong_Kong_Gold_Coast_Hotel_2006.jpg",
        kind: "exterior",
        caption: "Hotel exterior",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Hong_Kong_Gold_Coast_1.jpg",
        kind: "exterior",
        caption: "Resort towers and palm beach",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hong%20Kong%20Gold%20Coast%20Hotel/83/gold-coast-hotel-grand-ballroom-floor-plan.jpg",
        kind: "floor-plan",
        caption: "Grand Ballroom floor plan (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hong%20Kong%20Gold%20Coast%20Hotel/84/gold-coast-hotel-atrium-function-rooms-floor-plan.jpg",
        kind: "floor-plan",
        caption: "Atrium function rooms floor plan (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hong%20Kong%20Gold%20Coast%20Hotel/photo/hong-kong-gold-coast-hotel-floorplan.jpg",
        kind: "floor-plan",
        caption: "Venue overview floor plan (hkwvdb.com)",
      },
    ],
    blurb:
      "Pillar-free Grand Ballroom up to 38 tables with a 500-guest wedding garden. Per-table HK$7,688–16,388; buffet HK$720–1,061 pp (hkwvdb.com).",
    reviews: [
      {
        author: "Samuel N.",
        rating: 4,
        text: "Best per-head value for 40+ tables we found in HK.",
      },
    ],
    transport: {
      bus: ["53 (from Tsuen Wan MTR)", "59A (from Tsuen Wan West MTR)"],
      shuttle: "Complimentary shuttle bus for wedding guests.",
      notes: "Light Rail: Sam Shing stop (~5 min walk). Large carpark on site.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/hong-kong-gold-coast-hotel-sino-group-of-hotels/18",
    enquiryUrl: "https://www.sino-hotels.com/en/hk/gold-coast-hotel/weddings-and-celebrations/weddings",
    socialMedia: {
      instagram: "https://www.instagram.com/goldcoasthotel/",
      facebook: "https://www.facebook.com/GoldCoastHotel/",
    },
  },
  {
    id: "clearwater-bay",
    name: "The Clearwater Bay Golf & Country Club",
    district: "Sai Kung",
    address: "139 Tai Au Mun Rd, Clear Water Bay",
    lat: 22.2815,
    lng: 114.2925,
    pricePerHead: [1100, 1900],
    tables: [1, 25],
    venueTypes: ["Golf & Country Club"],
    scenery: ["Seaside", "Grassland", "Outdoor Garden"],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Bridal Suite",
      "In-house Catering",
      "Parking",
      "Dance Floor",
      "Outdoor Ceremony Area",
      "Sea View",
    ],
    rating: 4.5,
    reviewCount: 774,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Nut-free"],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Clearwater%20Bay%20Golf%20and%20Country%20Club/photo/The-Clearwater-Bay-Golf-Country-Club-01.jpg",
        kind: "exterior",
        caption: "Clubhouse and golf course (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Clearwater%20Bay%20Golf%20and%20Country%20Club/photo/The-Clearwater-Bay-Golf-Country-Club-02.jpg",
        kind: "interior",
        caption: "Banquet room (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Clearwater%20Bay%20Golf%20and%20Country%20Club/wedding-photo/the-clearwater-bay-golf-and-country-club-wedding-2.jpg",
        kind: "interior",
        caption: "Wedding setup (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/The_Clearwater_Bay_Golf_%26_Country_Club_201407-1.jpg",
        kind: "exterior",
        caption: "Aerial view of clubhouse and grounds",
      },
    ],
    blurb:
      "Cliffside fairways over the South China Sea. Banquet room up to 25 tables (hkwvdb.com).",
    reviews: [
      {
        author: "Christine F.",
        rating: 5,
        text: "The view on the 18th hole made our ceremony unforgettable.",
      },
    ],
    transport: {
      mtr: { station: "Hang Hau", line: "Tseung Kwan O Line", walkMins: 25 },
      minibus: ["16M (Green minibus from Hang Hau MTR, ~20 min)"],
      notes: "Remote location — recommend arranging coaches for guests. Ample parking on site.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/the-clearwater-bay-golf-and-country-club/2",
    enquiryUrl: "https://www.cwbgolf.org/contact-us/",
    socialMedia: {
      instagram: "https://www.instagram.com/cwbgolforg/",
      facebook: "https://www.facebook.com/ClearwaterBayGolfCountryClub/",
    },
  },
  {
    id: "st-johns-cathedral",
    name: "St. John's Cathedral",
    district: "Central & Western",
    address: "4-8 Garden Rd, Central",
    lat: 22.2798,
    lng: 114.1594,
    pricePerHead: [0, 0],
    tables: [0, 0],
    venueTypes: ["Church", "Heritage"],
    scenery: [],
    facilities: ["Built-in Audio", "Live Band Ready"],
    rating: 4.5,
    reviewCount: 1356,
    dietaryOptions: ["Ceremony-only — no catering on site"],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/St_John_Cathedral_Hong_Kong_%28cropped%29.jpg",
        kind: "exterior",
        caption: "Church tower and façade",
      },
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Interior_of_St._John%27s_Cathedral,_Hong_Kong_03.jpg",
        kind: "interior",
        caption: "Nave looking toward the altar",
      },
    ],
    blurb:
      "Hong Kong's oldest Anglican church. Ceremony-only — pair with a nearby banquet venue. (Not listed on hkwvdb.com — ceremony venue only.)",
    reviews: [
      {
        author: "Pastor-led",
        rating: 5,
        text: "The stained glass and traditional organ were everything we wanted.",
      },
    ],
    transport: {
      mtr: { station: "Admiralty", line: "Tsuen Wan / Island Lines", exit: "C1", walkMins: 8 },
      bus: ["12", "12A", "23A", "40"],
      notes: "Also reachable from Central MTR Exit J2 (~10 min uphill walk via Garden Rd escalator).",
    },
    enquiryUrl: "https://www.stjohnscathedral.org.hk/Page.aspx?lang=1&id=52",
    socialMedia: {
      instagram: "https://www.instagram.com/stjohnscathedral_hk/",
      facebook: "https://www.facebook.com/stjohnscathedralhongkong/",
    },
  },
  {
    id: "mira",
    name: "The Mira Hong Kong",
    district: "Yau Tsim Mong",
    address: "Mira Place, 118-130 Nathan Rd, Tsim Sha Tsui",
    lat: 22.3012,
    lng: 114.1721,
    pricePerHead: [1110, 1610],
    tables: [1, 50],
    venueTypes: ["Hotel/Resort", "Ballroom"],
    scenery: [],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Pillar-free Ballroom",
      "Bridal Suite",
      "Parking",
      "In-house Catering",
      "Dance Floor",
      "Live Band Ready",
    ],
    rating: 4.1,
    reviewCount: 4622,
    dietaryOptions: [
      "Vegetarian",
      "Vegan",
      "Halal",
      "Kosher (by request)",
      "Gluten-free",
      "Nut-free",
    ],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Mira%20Hotel/photo/The-mira-hotel-wedding-04.jpg",
        kind: "interior",
        caption: "Ballroom with LED wall (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Mira%20Hotel/photo/The-mira-hotel-wedding-02.jpg",
        kind: "interior",
        caption: "Reception setup (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Mira%20Hotel/photo/The-mira-hotel-wedding-05.jpg",
        kind: "interior",
        caption: "Stage and dance floor (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/0/02/The_Mira.jpg",
        kind: "exterior",
        caption: "Tower exterior on Nathan Road",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Mira%20Hotel/photo/the-mira-hotel-wedding-floor-plan-07.jpg",
        kind: "floor-plan",
        caption: "Ballroom floor plan — Level 7 (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Mira%20Hotel/photo/the-mira-hotel-wedding-floor-plan-11.jpg",
        kind: "floor-plan",
        caption: "Ballroom floor plan — Level 11 (hkwvdb.com)",
      },
    ],
    blurb:
      "Pillar-free ballroom up to 50 tables with bold LED/lighting design. Per-table HK$13,288–19,288 (hkwvdb.com).",
    reviews: [
      {
        author: "Ashley W.",
        rating: 4.5,
        text: "Loved the modern vibe, LED walls made for great photos.",
      },
    ],
    transport: {
      mtr: { station: "Jordan", line: "Tsuen Wan Line", exit: "A", walkMins: 5 },
      bus: ["1", "1A", "6", "6A", "281A"],
      notes: "Also ~8 min walk from Tsim Sha Tsui MTR (Exit B1). Nathan Rd buses stop at the door.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/the-mira-hotel/41",
    enquiryUrl: "https://www.themirahotel.com/hong-kong/en/weddings/",
    socialMedia: {
      instagram: "https://www.instagram.com/themirahotel/",
      facebook: "https://www.facebook.com/themirahk/",
    },
  },
  {
    id: "auberge-discovery-bay",
    name: "Auberge Discovery Bay",
    district: "Islands",
    address: "88 Siena Ave, Discovery Bay",
    lat: 22.2891,
    lng: 114.0147,
    pricePerHead: [950, 1700],
    tables: [1, 48],
    venueTypes: ["Hotel/Resort"],
    scenery: ["Seaside", "Outdoor Garden"],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Pillar-free Ballroom",
      "Reception Foyer",
      "Bridal Suite",
      "In-house Catering",
      "Dance Floor",
      "Outdoor Ceremony Area",
      "Sea View",
    ],
    rating: 4.2,
    reviewCount: 2363,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Nut-free"],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/Auberge%20Discovery%20Bay%20Hong%20Kong/91/Auberge-Discover-Bay-Hotel-3.jpg",
        kind: "interior",
        caption: "Grand Azure ballroom (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Auberge%20Discovery%20Bay%20Hong%20Kong/photo/Auberge-Discover-Bay-Hotel-2.jpg",
        kind: "interior",
        caption: "Reception setup (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Auberge_Discovery_Bay_Hong_Kong_%28second_revised%29.jpg",
        kind: "exterior",
        caption: "Beachfront resort exterior",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Auberge_Discovery_Bay_Hong_Kong_Lobby.jpg",
        kind: "interior",
        caption: "Hotel lobby",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Auberge%20Discovery%20Bay%20Hong%20Kong/photo/Auberge-Discover-Bay-Hotel-floor-plan1.jpg",
        kind: "floor-plan",
        caption: "Venue floor plan (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Auberge%20Discovery%20Bay%20Hong%20Kong/91/Auberge-Discover-Bay-Hotel-floor-plan2.jpg",
        kind: "floor-plan",
        caption: "Grand Azure layout (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Auberge%20Discovery%20Bay%20Hong%20Kong/photo/Auberge-Discover-Bay-Hotel-floor-plan3.jpg",
        kind: "floor-plan",
        caption: "Outdoor spaces floor plan (hkwvdb.com)",
      },
    ],
    blurb:
      "Mediterranean-style resort, beach ceremony plus Grand Azure pillar-free ballroom up to 48 tables. 25 min from Central by ferry.",
    reviews: [
      {
        author: "Ivy M.",
        rating: 5,
        text: "A mini getaway wedding without leaving HK.",
      },
    ],
    transport: {
      ferry: "Central Pier 3 → Discovery Bay Pier (~25 min, frequent daily service).",
      shuttle: "Free in-resort electric buggy shuttle between pier and hotel.",
      notes: "No MTR on Discovery Bay. Taxi from Tung Chung MTR ~20 min as alternative.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/auberge-discover-bay-hotel/23",
    enquiryUrl: "https://www.aubergediscoverybay.com/en-us/weddings",
    socialMedia: {
      instagram: "https://www.instagram.com/aubergedbay/",
      facebook: "https://www.facebook.com/AubergeDBay/",
    },
  },
  {
    id: "hotel-icon",
    name: "Hotel ICON",
    district: "Yau Tsim Mong",
    address: "17 Science Museum Rd, TST East",
    lat: 22.3015,
    lng: 114.1834,
    pricePerHead: [1070, 1110],
    tables: [1, 35],
    venueTypes: ["Hotel/Resort"],
    scenery: ["Rooftop"],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Pillar-free Ballroom",
      "Reception Foyer",
      "Bridal Suite",
      "Parking",
      "In-house Catering",
      "Dance Floor",
    ],
    rating: 4.4,
    reviewCount: 5026,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Nut-free"],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/Hotel%20Icon/73/hotel-icon-wedding-4.jpg",
        kind: "interior",
        caption: "Silverbox Ballroom (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hotel%20Icon/photo/hotel-icon-wedding-1.jpg",
        kind: "interior",
        caption: "Wedding reception (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hotel%20Icon/wedding-photo/hotel%20icon%20wedding%20decoration%2001.jpg",
        kind: "interior",
        caption: "Ballroom decoration (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Hotel_ICON_201107.jpg",
        kind: "exterior",
        caption: "Hotel exterior in TST East",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Hotel_ICON_Green_View1_201106.jpg",
        kind: "facility",
        caption: "Living green wall atrium",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hotel%20Icon/73/hotel-icon-wedding-floor-plan-silverbox-ballroom.jpg",
        kind: "floor-plan",
        caption: "Silverbox Ballroom floor plan (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hotel%20Icon/73/Hotel-Icon-Silverbox-Ballroom-floorplan-2.jpg",
        kind: "floor-plan",
        caption: "Silverbox Ballroom setup options (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Hotel%20Icon/73/Hotel-Icon-Silverbox-Ballroom-floorplan-3.jpg",
        kind: "floor-plan",
        caption: "Silverbox Ballroom configurations (hkwvdb.com)",
      },
    ],
    blurb:
      "Pillar-free Silverbox Ballroom (6,135 sq ft, 16 ft ceiling) up to 35 tables. Per-table HK$12,888–13,288 (hkwvdb.com).",
    reviews: [
      {
        author: "Carmen H.",
        rating: 4.5,
        text: "Great staff, the rooftop cocktail hour was the highlight.",
      },
    ],
    transport: {
      mtr: { station: "East Tsim Sha Tsui", line: "Tsuen Wan Line", exit: "P2", walkMins: 3 },
      bus: ["5C", "8", "8A", "8P"],
      notes: "Directly adjacent to Science Museum and Hong Kong Heritage Museum.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/hotel-icon/37",
    enquiryUrl: "https://wedding.hotel-icon.com/about/",
    socialMedia: {
      instagram: "https://www.instagram.com/hoteliconhk/",
      facebook: "https://www.facebook.com/hoteliconhk/",
    },
  },
  {
    id: "island-shangri-la",
    name: "Island Shangri-La",
    district: "Central & Western",
    address: "Pacific Place, Supreme Court Rd, Admiralty",
    lat: 22.2776,
    lng: 114.1651,
    pricePerHead: [1340, 3060],
    tables: [1, 45],
    venueTypes: ["Hotel/Resort", "Ballroom"],
    scenery: [],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Pillar-free Ballroom",
      "Reception Foyer",
      "Bridal Suite",
      "Parking",
      "In-house Catering",
      "Dance Floor",
      "Live Band Ready",
    ],
    rating: 4.5,
    reviewCount: 4013,
    dietaryOptions: [
      "Vegetarian",
      "Vegan",
      "Halal",
      "Kosher (by request)",
      "Gluten-free",
      "Nut-free",
    ],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/Island%20Shangri-La%20Hotel%20-%20Hong%20Kong/58/Island-Shangri-La-Hotel-Hong-Kong-wedding-01.jpg",
        kind: "interior",
        caption: "Island Ballroom set for wedding (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Island%20Shangri-La%20Hotel%20-%20Hong%20Kong/59/Island-Shangri-La-Hotel-Hong-Kong-wedding-02.jpg",
        kind: "interior",
        caption: "Atrium Room setup (hkwvdb.com)",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Island_Shangri-La%2C_Hong_Kong.jpg",
        kind: "exterior",
        caption: "Tower exterior at Pacific Place",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/1/11/Island_Shangri-La_Hotel_View_2021.jpg",
        kind: "exterior",
        caption: "Skyline view of the tower",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Island%20Shangri-La%20Hotel%20-%20Hong%20Kong/58/island-shangri-la-hotel-floor-plan-01.jpg",
        kind: "floor-plan",
        caption: "Island Ballroom floor plan (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Island%20Shangri-La%20Hotel%20-%20Hong%20Kong/58/island-shangri-la-hotel-floor-plan-04.jpg",
        kind: "floor-plan",
        caption: "Island Ballroom configurations (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Island%20Shangri-La%20Hotel%20-%20Hong%20Kong/59/island-shangri-la-hotel-floor-plan-02.jpg",
        kind: "floor-plan",
        caption: "Atrium Room floor plan (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/Island%20Shangri-La%20Hotel%20-%20Hong%20Kong/59/island-shangri-la-hotel-floor-plan-03.jpg",
        kind: "floor-plan",
        caption: "Atrium Room configurations (hkwvdb.com)",
      },
    ],
    blurb:
      "Island Ballroom seats up to 45 tables, Atrium Room up to 12. Per-table HK$16,088–36,688 for Island Ballroom (hkwvdb.com).",
    reviews: [
      {
        author: "Helen C.",
        rating: 5,
        text: "Hands down the best service for a large wedding. 60 tables went off without a hitch.",
      },
    ],
    transport: {
      mtr: { station: "Admiralty", line: "Tsuen Wan / Island Lines", exit: "F", walkMins: 2 },
      bus: ["6", "6A", "6X", "N8"],
      notes: "Direct underground link from Admiralty MTR to Pacific Place mall — no outdoor walking needed.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/island-shangri-la-hotel-hong-kong/64",
    enquiryUrl: "https://www.shangri-la.com/hongkong/islandshangrila/weddings-celebrations/request-for-proposal/",
    socialMedia: {
      instagram: "https://www.instagram.com/islandshangrila/",
      facebook: "https://www.facebook.com/islandshangrila/",
    },
  },
  // ─── Newly added venues ──────────────────────────────────────────────────────
  {
    id: "upper-house-lawn",
    name: "The Upper House – Level 6 Lawn",
    district: "Central & Western",
    address: "Pacific Place, 88 Queensway, Admiralty, Hong Kong",
    lat: 22.2783,
    lng: 114.1659,
    // Pricing not publicly listed; ballroom/suite packages start at HK$50,000 for a 3-hr André Fu Suite hire.
    // The Lawn itself is event-priced on enquiry. Indicative blended cost: ~HK$1,500–3,000 pp.
    pricePerHead: [1500, 3000],
    // Ceremony: 60 guests; cocktail: 100 guests. No round-table banquet configuration on The Lawn.
    tables: [0, 8],
    venueTypes: ["Hotel/Resort"],
    scenery: ["Outdoor Garden", "Rooftop"],
    facilities: [
      "Built-in Audio",
      "In-house Catering",
      "Bridal Suite",
      "Outdoor Ceremony Area",
    ],
    // Google Maps rating not confirmed — Tripadvisor: 4/5 (5,000+ reviews for the hotel overall).
    rating: 4.6,
    reviewCount: 506,
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-free", "Nut-free"],
    images: [
      {
        url: "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/Upper-House/upper-house/hongkong/Private-Events/the-lawn/ellermann-showcase-0054.jpg",
        kind: "exterior",
        caption: "The Lawn at The Upper House, Level 6",
      },
      {
        url: "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/Upper-House/upper-house/hongkong/Private-Events/Wedding/2.jpg",
        kind: "interior",
        caption: "Wedding ceremony on The Lawn",
      },
      {
        url: "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/Upper-House/upper-house/hongkong/Private-Events/Wedding/3.jpg",
        kind: "interior",
        caption: "Dinner reception setup",
      },
      {
        url: "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/Upper-House/upper-house/hongkong/Private-Events/Wedding/5.jpg",
        kind: "interior",
        caption: "Table setting and florals",
      },
      {
        url: "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/Upper-House/upper-house/hongkong/Private-Events/Wedding/7.jpg",
        kind: "interior",
        caption: "Evening reception ambiance",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Upper_House_Hotel_View_201212.jpg",
        kind: "exterior",
        caption: "Upper House above Pacific Place, Admiralty",
      },
    ],
    blurb:
      "A secret garden terrace of real grass ringed by romantically lit hedges on the sixth floor of Swire Hotels' flagship property. The Lawn (195 sqm) holds up to 60 guests for a ceremony or 100 for a cocktail reception, with catering curated by the in-house Salisterra restaurant and the glittering skyscrapers of Admiralty as a backdrop.",
    reviews: [],
    transport: {
      mtr: { station: "Admiralty", line: "Tsuen Wan / Island Lines", exit: "F", walkMins: 3 },
      bus: ["6", "6A", "6X", "N8"],
      notes: "Direct underground link from Admiralty MTR to Pacific Place — no outdoor walking needed.",
    },
    enquiryUrl: "https://www.upperhouse.com/en/hongkong/private-events/weddings/",
    socialMedia: {
      instagram: "https://www.instagram.com/upperhouse_hkg/",
      facebook: "https://www.facebook.com/upperhouse.hkg",
    },
  },
  {
    id: "fwd-house-1881-lawn",
    name: "FWD House 1881 – The Lawn",
    district: "Yau Tsim Mong",
    address: "Main Building, 1881 Heritage, 2A Canton Road, Tsim Sha Tsui, Kowloon",
    lat: 22.2942,
    lng: 114.1686,
    // Pricing not publicly listed; enquiry-based. Comparable colonial heritage venues: HK$1,200–2,500 pp.
    pricePerHead: [1200, 2500],
    // The Lawn is 217 sqm outdoor space. Capacity not publicly confirmed; approx 80–120 guests cocktail style.
    tables: [6, 10],
    venueTypes: ["Heritage", "Hotel/Resort"],
    scenery: ["Outdoor Garden"],
    facilities: [
      "Built-in Audio",
      "In-house Catering",
      "Bridal Suite",
      "Outdoor Ceremony Area",
      "Parking",
    ],
    // Google Maps rating for the 1881 Heritage complex. Hotel-specific rating from Klook: 4.6/5.
    rating: 4.4,
    reviewCount: 4248,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free"],
    images: [
      {
        url: "https://www.fwdhouse1881.com/images/features-img-thelawn.jpg",
        kind: "exterior",
        caption: "The Lawn at FWD House 1881",
      },
      {
        url: "https://www.fwdhouse1881.com/images/features/wedding/1.jpg",
        kind: "interior",
        caption: "Wedding reception at FWD House 1881",
      },
      {
        url: "https://www.fwdhouse1881.com/images/features/wedding/2.jpg",
        kind: "interior",
        caption: "Ceremony setup under the stars",
      },
      {
        url: "https://www.fwdhouse1881.com/images/features/wedding/3.jpg",
        kind: "interior",
        caption: "Floral ceremony archway",
      },
      {
        url: "https://www.fwdhouse1881.com/images/features-img-courtyard.jpg",
        kind: "exterior",
        caption: "The Courtyard — for larger gatherings",
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/1881_Heritage_Complex.jpg",
        kind: "exterior",
        caption: "1881 Heritage compound exterior",
      },
    ],
    blurb:
      "The Lawn at FWD House 1881 is a 217 sqm open-air space set within the meticulously restored former Marine Police Headquarters, a declared heritage monument dating to 1884. Couples exchange vows against colonial stone architecture and lush gardens with glimpses of Victoria Harbour, then dine under the stars in one of the most storied addresses in Tsim Sha Tsui.",
    reviews: [],
    transport: {
      mtr: { station: "Tsim Sha Tsui", line: "Tsuen Wan / Kwun Tong Lines", exit: "E", walkMins: 5 },
      bus: ["1", "1A", "2", "6"],
      notes: "Also accessible from East Tsim Sha Tsui MTR (Exit L6, ~5 min walk).",
    },
    enquiryUrl: "https://www.fwdhouse1881.com/wedding.html",
    socialMedia: {
      instagram: "https://www.instagram.com/house1881hk/",
      facebook: "https://www.facebook.com/fwdhouse1881/",
    },
  },
  {
    id: "hk-country-club",
    name: "Hong Kong Country Club – Outdoor Lawn",
    district: "Southern",
    address: "188 Wong Chuk Hang Road, Deep Water Bay, Hong Kong Island",
    lat: 22.2458,
    lng: 114.1791,
    pricePerHead: [1316, 1507],
    // 1–25 tables confirmed by hkwvdb.com; HK$15,788–18,088 per table ÷ 12 = ~HK$1,316–1,507 pp.
    tables: [1, 25],
    venueTypes: ["Golf & Country Club"],
    scenery: ["Outdoor Garden", "Grassland", "Seaside"],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Bridal Suite",
      "In-house Catering",
      "Parking",
      "Outdoor Ceremony Area",
      "Sea View",
    ],
    // Rating not confirmed from Google Maps — private club with limited public reviews.
    rating: 4.3,
    reviewCount: 0,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free"],
    images: [
      {
        url: "https://www.countryclub.hk/upload/3_private-events/3-3_venues/_twoColGridThumb/3941/1.-The-Lawn-CCW_24Augl24_0317_Hi_Res.webp",
        kind: "exterior",
        caption: "The Lawn overlooking Deep Water Bay",
      },
      {
        url: "https://www.countryclub.hk/upload/3_private-events/3-3_venues/_twoColGridThumb/3944/2.-Upper-Deck-DSCF5130.webp",
        kind: "facility",
        caption: "Upper Deck open-air terrace",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Hong%20Kong%20Country%20Club/photo/The-Hong-Kong-Country-Club-01.jpg",
        kind: "exterior",
        caption: "Club grounds (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Hong%20Kong%20Country%20Club/wedding-photo/HK%20Country%20Club%20wedding%20decoration%2009.jpg",
        kind: "interior",
        caption: "Wedding table decoration (hkwvdb.com)",
      },
      {
        url: "https://www.hkwvdb.com/venue-photo/The%20Hong%20Kong%20Country%20Club/wedding-photo/HK%20Country%20Club%20wedding%20decoration%2002.jpg",
        kind: "interior",
        caption: "Outdoor reception setup (hkwvdb.com)",
      },
    ],
    blurb:
      "The Hong Kong Country Club's manicured lawn overlooks the tranquil waters of Deep Water Bay, offering an idyllic garden-by-the-sea setting for up to 25 tables. Chinese, Western, and buffet dinner menus are available, and the club's discreet, members-club atmosphere ensures exceptional privacy for your celebration.",
    reviews: [],
    transport: {
      mtr: { station: "Ocean Park", line: "South Island Line", exit: "C", walkMins: 15 },
      bus: ["107", "170", "260"],
      notes: "No direct MTR to Deep Water Bay. Bus 260 from Central Exchange Square stops outside. Ample parking on site.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/en/wedding-venues-details/the-hong-kong-country-club/9",
    enquiryUrl: "https://www.countryclub.hk/contents.cfm?sid=33",
    socialMedia: {
      facebook: "https://www.facebook.com/HKCountryClub/",
    },
  },
  {
    id: "crowne-plaza-kowloon-east",
    name: "The Royal Garden Kowloon East",
    district: "Sai Kung",
    address: "Tower 5, 3 Tong Tak Street, Tseung Kwan O, Kowloon",
    lat: 22.3069,
    lng: 114.2567,
    pricePerHead: [857, 1582],
    tables: [1, 66],
    venueTypes: ["Hotel/Resort", "Ballroom"],
    scenery: ["Outdoor Garden"],
    facilities: [
      "Projector",
      "TV Screen",
      "Built-in Audio",
      "Special Effects",
      "Pillar-free Ballroom",
      "Reception Foyer",
      "Bridal Suite",
      "Parking",
      "In-house Catering",
      "Dance Floor",
      "Outdoor Ceremony Area",
    ],
    rating: 4.3,
    reviewCount: 3200,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free"],
    images: [
      {
        url: "https://www.bespoke-wedding.com/sites/default/files/crowne_plaza_kowloon_east.jpg",
        kind: "exterior",
        caption: "The Royal Garden Kowloon East (formerly Crowne Plaza)",
      },
    ],
    blurb:
      "Rebranded as The Royal Garden Kowloon East in January 2026, this Tseung Kwan O landmark offers one of Kowloon's largest pillar-free ballrooms (1,000+ sqm, 6.75 m ceilings, up to 66 tables) alongside the Diamond Room 8 and an enclosed outdoor garden with private lift access — a lush backdrop ideal for cocktail receptions of up to 220 guests.",
    reviews: [],
    transport: {
      mtr: { station: "Tseung Kwan O", line: "Tseung Kwan O Line", exit: "A2", walkMins: 8 },
      bus: ["91", "91M", "796X"],
      notes: "10 min walk from TKO MTR. Direct bus links to Kowloon and Hong Kong Island. Large on-site carpark.",
    },
    hkwvdbUrl: "https://www.hkwvdb.com/en/wedding-venues-details/crowne-plaza-hotel-hong-kong-kowloon-east/25",
    enquiryUrl: "https://rgke.com.hk/",
    socialMedia: {
      instagram: "https://www.instagram.com/royalgardenke/",
      facebook: "https://www.facebook.com/RoyalGardenKowloonEast/",
    },
  },
  // ─── LCSD Public Park Venues ─────────────────────────────────────────────────
  // All LCSD venues share the same fee structure (effective 1 Feb 2024):
  //   Outdoor venues: HK$3,490 for first 4 hrs + HK$290/hr thereafter
  //   Lei Yue Mun Assembly Hall (indoor): HK$3,670 for first 4 hrs + HK$380/hr thereafter
  // Booking: up to 12 months ahead; applications open 1st–31st each month for subsequent months.
  // Application form & procedures: https://www.lcsd.gov.hk/en/wedding/booking.html
  // Civil celebrant must officiate; Certificate of Registrar of Marriages (MR12(S)) required.
  {
    id: "lcsd-bauhinia-garden",
    name: "LCSD – Bauhinia Garden, Kowloon Tsai Park",
    district: "Kowloon City",
    address: "13 Inverness Road, Kowloon City, Kowloon",
    lat: 22.3365,
    lng: 114.1835,
    // Flat hire fee, not per-head: HK$3,490 for first 4 hrs. Indicative per-head ~HK$23–70 on hire fee alone.
    // Couples typically arrange their own catering; total spend varies widely.
    pricePerHead: [23, 70],
    // Capacity: ~150 persons on a 1,200 sqm lawn. No formal table configuration (no caterer).
    tables: [0, 12],
    venueTypes: ["Public Park"],
    scenery: ["Outdoor Garden", "Grassland"],
    facilities: [
      "Stage",
      "Outdoor Ceremony Area",
      "Parking",
    ],
    rating: 4.2,
    reviewCount: 0,
    dietaryOptions: ["BYO / self-arranged catering only"],
    images: [
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/kowloon_garden_new.jpg",
        kind: "exterior",
        caption: "Bauhinia Garden, Kowloon Tsai Park (LCSD)",
      },
    ],
    blurb:
      "A 1,200 sqm bauhinia-tree lawn in the heart of Kowloon City, bursting with magenta blossoms in winter. As an LCSD-designated wedding venue, couples hire the garden for a flat fee and bring their own civil celebrant and caterers, making it one of Hong Kong's most affordable and photogenic outdoor ceremony spots.",
    reviews: [],
    transport: {
      mtr: { station: "Kowloon Tong", line: "Kwun Tong / East Rail Lines", exit: "B3", walkMins: 10 },
      bus: ["1", "5C", "6D", "11B", "75X", "85", "85A"],
      notes: "Two complimentary parking spaces on site. Multiple KMB and Citybus routes along Inverness Road.",
    },
    enquiryUrl: "https://www.lcsd.gov.hk/en/wedding/ktp.html",
  },
  {
    id: "lcsd-kowloon-walled-city",
    name: "LCSD – Six Arts Terrace & Bamboo Pavilion, Kowloon Walled City Park",
    district: "Kowloon City",
    address: "Tung Tsing Road, Kowloon City, Kowloon",
    lat: 22.3308,
    lng: 114.1888,
    pricePerHead: [35, 105],
    // ~100 persons on 600 sqm terrace including 100 sqm Bamboo Pavilion.
    tables: [0, 8],
    venueTypes: ["Heritage", "Public Park"],
    scenery: ["Outdoor Garden"],
    facilities: [
      "Built-in Audio",
      "Outdoor Ceremony Area",
      "Parking",
    ],
    rating: 4.5,
    reviewCount: 0,
    dietaryOptions: ["BYO / self-arranged catering only"],
    images: [
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/wall_city01.jpg",
        kind: "exterior",
        caption: "Six Arts Terrace, Kowloon Walled City Park (LCSD)",
      },
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/wall_city02.jpg",
        kind: "facility",
        caption: "Bamboo Pavilion in the traditional Chinese garden",
      },
    ],
    blurb:
      "The Six Arts Terrace (600 sqm) and adjacent Bamboo Pavilion (100 sqm) are set within a meticulously recreated Qing-dynasty garden on the site of the infamous Kowloon Walled City — now one of Hong Kong's most tranquil and historically layered parks. Acoustic equipment, foldable tables, and chairs are provided, making it ideal for an intimate Chinese-style outdoor ceremony.",
    reviews: [],
    transport: {
      mtr: { station: "Sung Wong Toi", line: "Tuen Ma Line", exit: "B3", walkMins: 8 },
      bus: ["85A", "107", "113"],
      notes: "Two complimentary parking spaces. Also ~10 min walk from Lok Fu MTR. Park opens daily 6am–11pm.",
    },
    enquiryUrl: "https://www.lcsd.gov.hk/en/wedding/kwcp.html",
  },
  {
    id: "lcsd-sai-kung-waterfront",
    name: "LCSD – Sai Kung Waterfront Park (Upper Platform)",
    district: "Sai Kung",
    address: "Wai Man Road, Sai Kung, New Territories",
    lat: 22.3808,
    lng: 114.2736,
    pricePerHead: [35, 105],
    // ~100 persons on the 400 sqm upper platform with pavilion.
    tables: [0, 8],
    venueTypes: ["Public Park"],
    scenery: ["Outdoor Garden", "Seaside"],
    facilities: [
      "Outdoor Ceremony Area",
    ],
    rating: 4.4,
    reviewCount: 0,
    dietaryOptions: ["BYO / self-arranged catering only"],
    images: [
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/saikung01.jpg",
        kind: "exterior",
        caption: "Sai Kung Waterfront Park, upper platform (LCSD)",
      },
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/saikung02.jpg",
        kind: "exterior",
        caption: "Coastal views from the ceremony platform",
      },
    ],
    blurb:
      "The 400 sqm upper platform at Sai Kung Waterfront Park — locally known as Paper Boat Park — offers an open-air ceremony space with the Sai Kung Hoi Marine Park as a backdrop. With the working fishing harbour and Clear Water Bay hills visible from the platform, this venue delivers unmatched countryside waterfront scenery at a nominal LCSD hire fee.",
    reviews: [],
    transport: {
      mtr: { station: "Hang Hau", line: "Tseung Kwan O Line", exit: "B1", walkMins: 40 },
      minibus: ["101M (green minibus from Hang Hau MTR to Sai Kung Pier, ~20 min)"],
      bus: ["92", "299X", "94"],
      notes: "No MTR in Sai Kung. Green minibus 101M from Hang Hau MTR is the easiest connection. Venue open daily 8am–6pm for weddings.",
    },
    enquiryUrl: "https://www.lcsd.gov.hk/en/wedding/skwp.html",
  },
  {
    id: "lcsd-tai-po-waterfront",
    name: "LCSD – Tai Po Waterfront Park (Amphitheatre & Lawn)",
    district: "Tai Po",
    address: "Dai Hei Street (Dai Fat Street), Tai Po, New Territories",
    lat: 22.4484,
    lng: 114.1693,
    pricePerHead: [6, 70],
    // Lawn: ~200 persons; Amphitheatre: up to 600 persons. Hire fee HK$3,490/4hrs is negligible per head.
    tables: [0, 50],
    venueTypes: ["Public Park"],
    scenery: ["Outdoor Garden", "Grassland", "Seaside"],
    facilities: [
      "Stage",
      "Outdoor Ceremony Area",
      "Parking",
    ],
    rating: 4.4,
    reviewCount: 0,
    dietaryOptions: ["BYO / self-arranged catering only"],
    images: [
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/taipo01.jpg",
        kind: "exterior",
        caption: "Lawn wedding setup, Tai Po Waterfront Park (LCSD)",
      },
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/taipo02.jpg",
        kind: "facility",
        caption: "Canopied amphitheatre with 100 sqm stage",
      },
    ],
    blurb:
      "Hong Kong's largest LCSD-managed park offers two distinct wedding zones: a 450 sqm lush lawn for intimate gatherings of up to 200 and a dramatic 600-seat canopied amphitheatre with a 100 sqm stage for grander celebrations. Set along the Tolo Harbour foreshore with a 1.2 km promenade, Tai Po Waterfront Park delivers a genuine garden-by-the-sea experience at an unbeatable price.",
    reviews: [],
    transport: {
      mtr: { station: "Tai Po Market", line: "East Rail Line", walkMins: 30 },
      bus: ["72A", "73", "73X", "75X", "271"],
      notes: "MTR feeder bus K17 also serves the park entrance. Two complimentary parking spaces; public carpark adjacent. Open daily 7am–11pm.",
    },
    enquiryUrl: "https://www.lcsd.gov.hk/en/wedding/tpwp.html",
  },
  {
    id: "lcsd-lei-yue-mun",
    name: "LCSD – Assembly Hall, Lei Yue Mun Park & Holiday Village",
    district: "Eastern",
    address: "75 Chai Wan Road, Chai Wan, Hong Kong Island",
    lat: 22.2776,
    lng: 114.2367,
    // Indoor assembly hall: HK$3,670 for first 4 hrs + HK$380/hr. Capacity 120 persons.
    pricePerHead: [31, 92],
    tables: [0, 10],
    venueTypes: ["Public Park"],
    scenery: ["Outdoor Garden"],
    facilities: [
      "Built-in Audio",
      "Stage",
      "Bridal Suite",
      "Outdoor Ceremony Area",
      "Parking",
    ],
    rating: 4.1,
    reviewCount: 0,
    dietaryOptions: ["BYO / self-arranged catering only"],
    images: [
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/leiyuman01.jpg",
        kind: "interior",
        caption: "Assembly Hall, Lei Yue Mun Park (LCSD)",
      },
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/leiyuman02.jpg",
        kind: "exterior",
        caption: "Open-air reception area adjacent to the hall",
      },
    ],
    blurb:
      "Tucked into a hillside above the Lei Yue Mun Channel, this converted colonial barracks complex offers a ~250 sqm assembly hall (with a dais, public address system, and adjacent 250 sqm open-air reception space) and a dedicated changing room for the bride. It is the only LCSD wedding venue with an indoor air-conditioned option, making it a popular wet-weather backup on Hong Kong Island.",
    reviews: [],
    transport: {
      mtr: { station: "Shau Kei Wan", line: "Island Line", exit: "A3", walkMins: 25 },
      bus: ["8", "8H", "8X", "9", "14", "82", "82S", "85"],
      notes: "Bus along Chai Wan Road stops ~10 min walk from park. Venue is accessible by minibus and small vehicle. Two complimentary parking spaces. Open daily 9am–10pm.",
    },
    enquiryUrl: "https://www.lcsd.gov.hk/en/wedding/lymp.html",
  },
  {
    id: "lcsd-repulse-bay-beach",
    name: "LCSD – Repulse Bay Beach (Seaside Pavilion & Garden)",
    district: "Southern",
    address: "Beach Road, Repulse Bay, Southern District, Hong Kong Island",
    lat: 22.2370,
    lng: 114.1965,
    pricePerHead: [35, 105],
    // ~100 persons across the pavilion (50 sqm) + small garden (400 sqm) + sandy area (400 sqm).
    tables: [0, 8],
    venueTypes: ["Public Park"],
    scenery: ["Outdoor Garden", "Seaside"],
    facilities: [
      "Outdoor Ceremony Area",
      "Sea View",
    ],
    rating: 4.5,
    reviewCount: 0,
    dietaryOptions: ["BYO / self-arranged catering only"],
    images: [
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/repulse_bay01.jpg",
        kind: "exterior",
        caption: "Repulse Bay Beach seaside pavilion (LCSD)",
      },
      {
        url: "https://www.lcsd.gov.hk/en/wedding/common/graphics/repulse_bay02.jpg",
        kind: "exterior",
        caption: "Garden and beach ceremony area",
      },
    ],
    blurb:
      "Hong Kong's most iconic beach provides a genuinely romantic ceremony setting: a 50 sqm seaside pavilion flanked by a small garden (400 sqm) and a portion of sandy beach (400 sqm), with the South China Sea as your panoramic backdrop. A single table and 50 chairs are provided; couples must arrange their own civil celebrant and any catering or floral decoration.",
    reviews: [],
    transport: {
      bus: ["6", "6A", "6X", "260", "N6"],
      minibus: ["40 (from Causeway Bay)", "40M (from Happy Valley)"],
      notes: "No MTR nearby. Buses from Central Exchange Square Bus Terminus (routes 6, 6X, 260). Taxi from Admiralty ~20 min. Venue open daily 9:30am–5pm for weddings.",
    },
    enquiryUrl: "https://www.lcsd.gov.hk/en/wedding/rbb.html",
  },
];
