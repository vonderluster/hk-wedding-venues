export type Sentiment = "positive" | "neutral" | "negative";

export type ForumSource =
  | "baby-kingdom"
  | "esdlife"
  | "weddinghk"
  | "heychoices"
  | "bespoke-wedding";

export interface ForumReview {
  author: string;
  date: string;
  source: ForumSource;
  threadId: string;
  threadUrl: string;
  originalText: string;
  englishTranslation: string;
  summary: string;
  keywords: string[];
  sentiment: Sentiment;
}

export interface VenueForumReviews {
  venueId: string;
  reviews: ForumReview[];
  topKeywords: string[];
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  lastScrapedAt: string;
}

export const SOURCE_LABELS: Record<ForumSource, string> = {
  "baby-kingdom": "Baby-Kingdom",
  esdlife: "ESDlife",
  weddinghk: "WeddingHK",
  heychoices: "Hey Choices",
  "bespoke-wedding": "Bespoke Wedding",
};

export const forumReviewsByVenueId: Record<string, VenueForumReviews> = {
  mira: {
    venueId: "mira",
    lastScrapedAt: "2026-04-24",
    topKeywords: [
      "pillar-free rectangular hall",
      "HK$150K minimum spend",
      "upper-floor ballroom preferred",
      "high ceiling / purple theme",
      "expensive for mid-range budgets",
    ],
    sentimentBreakdown: { positive: 2, neutral: 3, negative: 1 },
    reviews: [
      {
        author: "Googlehehe",
        date: "2018-02-27",
        source: "baby-kingdom",
        threadId: "21171235",
        threadUrl:
          "https://www.baby-kingdom.com/forum.php?mod=viewthread&tid=21171235",
        originalText:
          "你預15000左右一圍。紫色為主 長方形廳 無柱。係幾好既。",
        englishTranslation:
          "Budget around HK$15,000 per table. Purple-themed, rectangular hall with no pillars. Quite nice.",
        summary:
          "Rectangular, pillar-free purple-themed hall; roughly HK$15,000 per table.",
        keywords: ["pillar-free", "rectangular hall", "purple theme", "HK$15K/table"],
        sentiment: "positive",
      },
      {
        author: "Nbs",
        date: "2018-02-27",
        source: "baby-kingdom",
        threadId: "21171235",
        threadUrl:
          "https://www.baby-kingdom.com/forum.php?mod=viewthread&tid=21171235",
        originalText:
          "我喺mira hotel 擺 11 圍的，不過唔係 3/F function room, 無記錯係高層d既，一個大場分開兩部分，不錯的。你去問問，會有人帶你睇and 介紹。我好滿意架。",
        englishTranslation:
          "I hosted 11 tables at The Mira, not in the 3/F function room but on a higher floor. It's one large hall split into two sections — not bad. Staff will show you around and explain. I was very satisfied.",
        summary:
          "Hosted 11 tables on an upper-floor hall (divisible into two sections); helpful staff tours; overall very satisfied.",
        keywords: [
          "upper-floor ballroom",
          "divisible hall",
          "helpful staff",
          "11 tables",
          "very satisfied",
        ],
        sentiment: "positive",
      },
      {
        author: "Nbs",
        date: "2018-02-27",
        source: "baby-kingdom",
        threadId: "21171235",
        threadUrl:
          "https://www.baby-kingdom.com/forum.php?mod=viewthread&tid=21171235",
        originalText: "2016 年 1 月 minimum charge 係 15 萬 (細場)。",
        englishTranslation:
          "As of January 2016, the minimum charge for the smaller hall was HK$150,000.",
        summary: "Small-hall minimum spend was HK$150,000 as of Jan 2016.",
        keywords: ["HK$150K minimum", "small hall", "2016 pricing"],
        sentiment: "neutral",
      },
      {
        author: "darlingxd",
        date: "2018-02-28",
        source: "baby-kingdom",
        threadId: "21171235",
        threadUrl:
          "https://www.baby-kingdom.com/forum.php?mod=viewthread&tid=21171235",
        originalText:
          "其實我都中意樓上18樓 樓底高好多靚好多 但系個budget就太貴",
        englishTranslation:
          "I actually prefer the 18/F upstairs — much higher ceiling, much prettier — but it's too expensive for our budget.",
        summary:
          "18/F ballroom is far prettier with high ceilings, but priced above many budgets.",
        keywords: ["18/F ballroom", "high ceiling", "prettier upstairs", "over budget"],
        sentiment: "neutral",
      },
      {
        author: "darlingxd",
        date: "2018-02-28",
        source: "baby-kingdom",
        threadId: "21171235",
        threadUrl:
          "https://www.baby-kingdom.com/forum.php?mod=viewthread&tid=21171235",
        originalText: "美麗華我都覺得太貴喇 所以吾考慮",
        englishTranslation:
          "I also find The Mira too expensive, so I'm not considering it.",
        summary: "Ruled out The Mira as too expensive.",
        keywords: ["too expensive", "ruled out"],
        sentiment: "negative",
      },
      {
        author: "darlingxd",
        date: "2018-02-28",
        source: "baby-kingdom",
        threadId: "21171235",
        threadUrl:
          "https://www.baby-kingdom.com/forum.php?mod=viewthread&tid=21171235",
        originalText: "我去問過樓下function room星期五六日 最小要15萬",
        englishTranslation:
          "I asked about the lower-floor function room — Friday/Saturday/Sunday minimum is HK$150,000.",
        summary:
          "Weekend minimum spend for the lower function room is HK$150,000.",
        keywords: ["weekend minimum", "HK$150K", "lower function room"],
        sentiment: "neutral",
      },
    ],
  },
};
