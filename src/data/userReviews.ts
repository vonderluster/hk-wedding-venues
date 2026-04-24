export interface ReviewRatings {
  foodQuality: number;
  service: number;
  valueForMoney: number;
  decor: number;
  logistics: number;
}

export interface ReviewPhoto {
  id: string;
  url: string;
}

export interface VendorReply {
  authorName: string;
  text: string;
  repliedAt: string;
}

export interface UserReview {
  id: string;
  venueId: string;
  authorName: string;
  authorId: string;
  isVerified: boolean;
  weddingYear?: number;
  overallRating: number;
  ratings: ReviewRatings;
  title: string;
  text: string;
  photos: ReviewPhoto[];
  helpfulCount: number;
  helpfulVoterIds: string[];
  vendorReply?: VendorReply;
  createdAt: string;
  status: "published" | "pending" | "flagged";
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
}

export const RATING_DIMENSIONS: { key: keyof ReviewRatings; label: string; icon: string }[] = [
  { key: "foodQuality",   label: "Food Quality",       icon: "🍽️" },
  { key: "service",       label: "Service",            icon: "🤝" },
  { key: "valueForMoney", label: "Value for Money",    icon: "💰" },
  { key: "decor",         label: "Décor & Ambience",   icon: "✨" },
  { key: "logistics",     label: "Logistics & Parking",icon: "🚗" },
];

function avg(r: ReviewRatings): number {
  const vals = Object.values(r);
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

// ── Storage helpers ────────────────────────────────────────────────────────────

const REVIEWS_KEY = "ugc_reviews_v1";
const USER_KEY    = "ugc_user_v1";

export function loadAllReviews(): Record<string, UserReview[]> {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) return seedData();
    return JSON.parse(raw) as Record<string, UserReview[]>;
  } catch {
    return seedData();
  }
}

export function saveAllReviews(data: Record<string, UserReview[]>): void {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(data));
}

export function getVenueReviews(venueId: string): UserReview[] {
  return (loadAllReviews()[venueId] ?? []).filter((r) => r.status === "published");
}

export function submitReview(review: Omit<UserReview, "id" | "helpfulCount" | "helpfulVoterIds" | "createdAt" | "status" | "overallRating">): UserReview {
  const full: UserReview = {
    ...review,
    id: crypto.randomUUID(),
    overallRating: avg(review.ratings),
    helpfulCount: 0,
    helpfulVoterIds: [],
    createdAt: new Date().toISOString(),
    status: "published",
  };
  const data = loadAllReviews();
  data[review.venueId] = [full, ...(data[review.venueId] ?? [])];
  saveAllReviews(data);
  return full;
}

export function toggleHelpful(venueId: string, reviewId: string, userId: string): void {
  const data = loadAllReviews();
  const reviews = data[venueId] ?? [];
  const r = reviews.find((x) => x.id === reviewId);
  if (!r) return;
  if (r.helpfulVoterIds.includes(userId)) {
    r.helpfulVoterIds = r.helpfulVoterIds.filter((id) => id !== userId);
    r.helpfulCount = Math.max(0, r.helpfulCount - 1);
  } else {
    r.helpfulVoterIds.push(userId);
    r.helpfulCount++;
  }
  saveAllReviews(data);
}

export function flagReview(venueId: string, reviewId: string): void {
  const data = loadAllReviews();
  const reviews = data[venueId] ?? [];
  const r = reviews.find((x) => x.id === reviewId);
  if (r) r.status = "flagged";
  saveAllReviews(data);
}

// ── Mock auth ─────────────────────────────────────────────────────────────────

export function getCurrentUser(): MockUser | null {
  try { return JSON.parse(localStorage.getItem(USER_KEY) ?? "null"); } catch { return null; }
}

export function signIn(name: string, email: string): MockUser {
  const user: MockUser = { id: `user_${btoa(email)}`, name, email };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function signOut(): void {
  localStorage.removeItem(USER_KEY);
}

// ── Seed data ─────────────────────────────────────────────────────────────────

function seedData(): Record<string, UserReview[]> {
  const data: Record<string, UserReview[]> = {
    "rosewood-hk": [
      {
        id: "seed-r1",
        venueId: "rosewood-hk",
        authorName: "Chloe & Marcus",
        authorId: "seed-u1",
        isVerified: true,
        weddingYear: 2024,
        ratings: { foodQuality: 5, service: 5, valueForMoney: 4, decor: 5, logistics: 5 },
        overallRating: 4.8,
        title: "Truly unforgettable — exceeded every expectation",
        text: "We hosted 42 tables in the Grand Ballroom and every single detail was flawless. The wedding coordinator Koey guided us through the entire process with incredible patience. The harbour view alone is worth the premium. Food was genuinely restaurant-quality, not typical banquet fare. Highly recommend the tasting session — we changed three dishes based on it.",
        photos: [],
        helpfulCount: 18,
        helpfulVoterIds: ["seed-u2", "seed-u3"],
        vendorReply: {
          authorName: "Rosewood Hong Kong Wedding Team",
          text: "Thank you so much, Chloe and Marcus! It was our absolute honour to be part of your special day. Koey and the entire team send their warmest wishes to you both.",
          repliedAt: "2024-11-20T09:00:00Z",
        },
        createdAt: "2024-11-18T14:30:00Z",
        status: "published",
      },
      {
        id: "seed-r2",
        venueId: "rosewood-hk",
        authorName: "Jason T.",
        authorId: "seed-u2",
        isVerified: true,
        weddingYear: 2024,
        ratings: { foodQuality: 4, service: 5, valueForMoney: 3, decor: 5, logistics: 4 },
        overallRating: 4.2,
        title: "Stunning venue, worth budgeting carefully",
        text: "The venue is spectacular and the service team is genuinely world-class. Price per head is on the higher end even for HK 5-star hotels, so go in with eyes open on the extras (corkage, AV hire, etc.). That said, our guests are still talking about the view.",
        photos: [],
        helpfulCount: 11,
        helpfulVoterIds: ["seed-u3"],
        createdAt: "2024-09-05T10:00:00Z",
        status: "published",
      },
    ],
    "peninsula-hk": [
      {
        id: "seed-p1",
        venueId: "peninsula-hk",
        authorName: "Agnes & Raymond",
        authorId: "seed-u3",
        isVerified: true,
        weddingYear: 2023,
        ratings: { foodQuality: 5, service: 5, valueForMoney: 4, decor: 5, logistics: 4 },
        overallRating: 4.6,
        title: "Old-world glamour, nothing else compares",
        text: "The Grand Ballroom at The Peninsula is iconic for a reason. Our guests — including those who've attended dozens of HK banquets — said the food was the best they'd ever had at a wedding. The staff-to-guest ratio is extraordinary. A small gripe: parking validation took longer than expected for the volume of guests.",
        photos: [],
        helpfulCount: 24,
        helpfulVoterIds: ["seed-u1", "seed-u2"],
        vendorReply: {
          authorName: "The Peninsula Hong Kong Events",
          text: "Agnes and Raymond, thank you for choosing The Peninsula for your celebration. We are taking your feedback on parking coordination on board. Wishing you a lifetime of happiness.",
          repliedAt: "2023-12-02T08:00:00Z",
        },
        createdAt: "2023-11-28T16:00:00Z",
        status: "published",
      },
    ],
    "island-shangri-la": [
      {
        id: "seed-is1",
        venueId: "island-shangri-la",
        authorName: "Vivienne K.",
        authorId: "seed-u4",
        isVerified: true,
        weddingYear: 2024,
        ratings: { foodQuality: 5, service: 4, valueForMoney: 4, decor: 5, logistics: 5 },
        overallRating: 4.6,
        title: "Island Ballroom is breathtaking — MTR access is a huge plus",
        text: "The direct underground link from Admiralty MTR made logistics incredibly smooth for our 500+ guests. The atrium lobby with the Great Lantern is stunning for arrival photos. Cantonese menu was excellent — lobster course was a standout. Coordinator was responsive throughout the 18-month planning process.",
        photos: [],
        helpfulCount: 15,
        helpfulVoterIds: ["seed-u1"],
        createdAt: "2024-04-10T11:00:00Z",
        status: "published",
      },
      {
        id: "seed-is2",
        venueId: "island-shangri-la",
        authorName: "Michael H.",
        authorId: "seed-u5",
        isVerified: false,
        weddingYear: 2023,
        ratings: { foodQuality: 3, service: 4, valueForMoney: 3, decor: 4, logistics: 5 },
        overallRating: 3.8,
        title: "Good but the food underwhelmed for the price",
        text: "Location and logistics are genuinely excellent — the Pacific Place connection is a real differentiator. However the food quality felt like it plateaued compared to the pricing. Service was attentive but coordination hand-offs between teams could be smoother. Overall a solid choice, just go in with calibrated expectations on the food.",
        photos: [],
        helpfulCount: 8,
        helpfulVoterIds: [],
        createdAt: "2023-08-14T09:30:00Z",
        status: "published",
      },
    ],
    "mira": [
      {
        id: "seed-m1",
        venueId: "mira",
        authorName: "Tiffany & Derek",
        authorId: "seed-u6",
        isVerified: true,
        weddingYear: 2024,
        ratings: { foodQuality: 4, service: 4, valueForMoney: 5, decor: 4, logistics: 4 },
        overallRating: 4.2,
        title: "Best value pillar-free ballroom in TST",
        text: "If you want a modern, pillar-free ballroom in Tsim Sha Tsui without paying Rosewood or Peninsula prices, The Mira is hard to beat. LED wall production values are genuinely impressive. Food is solid mid-tier HK banquet standard. Coordinator was helpful but slightly less proactive than 5-star equivalents — needed more chasing.",
        photos: [],
        helpfulCount: 9,
        helpfulVoterIds: ["seed-u2"],
        createdAt: "2024-07-22T14:00:00Z",
        status: "published",
      },
    ],
  };

  saveAllReviews(data);
  return data;
}
