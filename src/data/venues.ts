export type Setting =
  | "Indoor Ballroom"
  | "Hotel Ballroom"
  | "Outdoor Garden"
  | "Grassland"
  | "Rooftop"
  | "Seaside"
  | "Restaurant"
  | "Heritage";

export type Facility =
  | "Church"
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

export type ImageKind = "exterior" | "interior" | "facility";

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
  settings: Setting[];
  facilities: Facility[];
  rating: number;
  reviewCount: number;
  /** Dietary accommodations the venue's kitchen can prepare */
  dietaryOptions: string[];
  images: VenueImage[];
  blurb: string;
  reviews: { author: string; rating: number; text: string }[];
  /** Link to the hkwvdb.com detail page used as the source of truth (if available) */
  hkwvdbUrl?: string;
}

export const SETTINGS: Setting[] = [
  "Indoor Ballroom",
  "Hotel Ballroom",
  "Outdoor Garden",
  "Grassland",
  "Rooftop",
  "Seaside",
  "Restaurant",
  "Heritage",
];

export const FACILITIES: Facility[] = [
  "Church",
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
    settings: ["Hotel Ballroom", "Indoor Ballroom"],
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
    rating: 4.8,
    reviewCount: 86,
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/rosewood-hong-kong-hotel/178",
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
    settings: ["Hotel Ballroom", "Heritage", "Indoor Ballroom"],
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
    rating: 4.9,
    reviewCount: 132,
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
    settings: ["Seaside", "Outdoor Garden", "Heritage"],
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
    rating: 4.7,
    reviewCount: 64,
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/the-repulse-bay/56",
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
    settings: ["Heritage", "Outdoor Garden"],
    facilities: [
      "Outdoor Ceremony Area",
      "Built-in Audio",
      "In-house Catering",
      "Bridal Suite",
      "Parking",
    ],
    rating: 4.6,
    reviewCount: 41,
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
    settings: ["Restaurant", "Seaside", "Heritage"],
    facilities: [
      "Built-in Audio",
      "In-house Catering",
      "Outdoor Ceremony Area",
      "Sea View",
    ],
    rating: 4.7,
    reviewCount: 58,
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
    settings: ["Hotel Ballroom", "Outdoor Garden", "Grassland"],
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
    rating: 4.5,
    reviewCount: 102,
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/hyatt-regency-hong-kong-shatin/21",
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
    settings: ["Seaside", "Outdoor Garden", "Grassland"],
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
    rating: 4.4,
    reviewCount: 73,
    dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free"],
    images: [
      {
        url: "https://www.hkwvdb.com/venue-photo/Gold%20Coast%20Yacht%20and%20Country%20Club/27/gold-coast-yacht-and-country-club-floorplan.jpg",
        kind: "facility",
        caption: "Ballroom floor plan (hkwvdb.com)",
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/gold-coast-yacht-and-country-club/1",
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
    settings: ["Hotel Ballroom", "Seaside", "Grassland"],
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
    rating: 4.3,
    reviewCount: 88,
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/hong-kong-gold-coast-hotel-sino-group-of-hotels/18",
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
    settings: ["Seaside", "Grassland", "Outdoor Garden"],
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
    rating: 4.6,
    reviewCount: 54,
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/the-clearwater-bay-golf-and-country-club/2",
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
    settings: ["Heritage"],
    facilities: ["Church", "Built-in Audio", "Live Band Ready"],
    rating: 4.9,
    reviewCount: 38,
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
    settings: ["Hotel Ballroom", "Indoor Ballroom"],
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
    rating: 4.5,
    reviewCount: 77,
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/the-mira-hotel/41",
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
    settings: ["Seaside", "Hotel Ballroom", "Outdoor Garden"],
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
    rating: 4.5,
    reviewCount: 49,
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/auberge-discover-bay-hotel/23",
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
    settings: ["Hotel Ballroom", "Rooftop"],
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
    rating: 4.6,
    reviewCount: 91,
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/hotel-icon/37",
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
    settings: ["Hotel Ballroom", "Indoor Ballroom"],
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
    rating: 4.8,
    reviewCount: 148,
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
    hkwvdbUrl: "https://www.hkwvdb.com/zh-hk/wedding-venues-details/island-shangri-la-hotel-hong-kong/64",
  },
];
