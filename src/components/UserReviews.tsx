import { useRef, useState } from "react";
import {
  RATING_DIMENSIONS,
  getVenueReviews,
  submitReview,
  toggleHelpful,
  flagReview,
  getCurrentUser,
  signIn,
  type UserReview,
  type ReviewRatings,
  type MockUser,
} from "../data/userReviews";

interface Props {
  venueId: string;
  onCountChange?: (count: number) => void;
}

type SortKey = "helpful" | "recent" | "highest" | "lowest";

const EMPTY_RATINGS: ReviewRatings = {
  foodQuality: 0,
  service: 0,
  valueForMoney: 0,
  decor: 0,
  logistics: 0,
};

const SORT_LABELS: Record<SortKey, string> = {
  helpful: "Most helpful",
  recent: "Most recent",
  highest: "Highest rated",
  lowest: "Lowest rated",
};

function StarsFilled({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-xl" : "text-sm";
  return (
    <span className={cls} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? "text-blush-500" : "text-slate-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className={`text-xl leading-none transition ${
            (hover || value) >= i ? "text-blush-500" : "text-slate-300"
          } hover:text-blush-400`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const init =
    parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);
  return (
    <div className="w-9 h-9 rounded-full bg-blush-100 text-blush-700 text-sm font-semibold flex items-center justify-center shrink-0 uppercase select-none">
      {init}
    </div>
  );
}

function StarDistRow({ rating, count, total }: { rating: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <span className="w-3 text-right shrink-0">{rating}</span>
      <span className="text-blush-400 shrink-0">★</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-blush-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-5 text-right text-slate-400 shrink-0">{count}</span>
    </div>
  );
}

export default function UserReviews({ venueId, onCountChange }: Props) {
  const [reviews, setReviews] = useState<UserReview[]>(() => getVenueReviews(venueId));
  const [user, setUser] = useState<MockUser | null>(() => getCurrentUser());
  const [sort, setSort] = useState<SortKey>("helpful");
  const [formOpen, setFormOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const refresh = () => {
    const updated = getVenueReviews(venueId);
    setReviews(updated);
    onCountChange?.(updated.length);
  };

  const sorted = [...reviews].sort((a, b) => {
    switch (sort) {
      case "helpful":
        return b.helpfulCount - a.helpfulCount;
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "highest":
        return b.overallRating - a.overallRating;
      case "lowest":
        return a.overallRating - b.overallRating;
    }
  });

  const total = reviews.length;
  const avgOverall =
    total > 0
      ? Math.round((reviews.reduce((s, r) => s + r.overallRating, 0) / total) * 10) / 10
      : 0;

  const distrib = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.overallRating) === star).length,
  }));

  const dimAvgs = RATING_DIMENSIONS.map(({ key, label, icon }) => ({
    key,
    label,
    icon,
    avg:
      total > 0
        ? Math.round((reviews.reduce((s, r) => s + r.ratings[key], 0) / total) * 10) / 10
        : 0,
  }));

  const openWrite = () => {
    if (!user) {
      setSignInOpen(true);
    } else {
      setFormOpen(true);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-slate-900">
          Customer Reviews
          {total > 0 && (
            <span className="text-sm font-normal text-slate-500 ml-2">({total})</span>
          )}
        </h3>
        <button
          onClick={openWrite}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-blush-600 text-white hover:bg-blush-700 transition shrink-0"
        >
          Write a review
        </button>
      </div>

      {total === 0 ? (
        <div className="text-center py-10 border border-[#E0D4C4] rounded-xl">
          <p className="text-slate-500 text-sm">No customer reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          {/* Summary card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 p-4 sm:p-5 border border-[#E0D4C4] rounded-xl">
            <div>
              <div className="flex items-end gap-3 mb-3">
                <span className="font-display text-5xl font-bold text-slate-900 leading-none">
                  {avgOverall.toFixed(1)}
                </span>
                <div>
                  <StarsFilled value={avgOverall} size="lg" />
                  <p className="text-xs text-slate-500 mt-1">
                    {total} review{total !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {distrib.map(({ star, count }) => (
                  <StarDistRow key={star} rating={star} count={count} total={total} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {dimAvgs.map(({ key, label, icon, avg }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-base w-5 shrink-0">{icon}</span>
                  <span className="text-xs text-slate-600 w-28 shrink-0 truncate">{label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blush-400"
                      style={{ width: `${(avg / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-7 text-right shrink-0">
                    {avg > 0 ? avg.toFixed(1) : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs text-slate-500 mr-1">Sort:</span>
            {(["helpful", "recent", "highest", "lowest"] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${
                  sort === key
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-cream text-[#5C4A35] border-[#D9CDBF] hover:border-blush-400"
                }`}
              >
                {SORT_LABELS[key]}
              </button>
            ))}
          </div>

          {/* Review cards */}
          <div className="space-y-4">
            {sorted.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={user?.id}
                onHelpful={() => {
                  if (!user) { setSignInOpen(true); return; }
                  toggleHelpful(venueId, review.id, user.id);
                  refresh();
                }}
                onFlag={() => {
                  if (confirm("Flag this review as inappropriate?")) {
                    flagReview(venueId, review.id);
                    refresh();
                  }
                }}
              />
            ))}
          </div>
        </>
      )}

      {signInOpen && (
        <SignInModal
          onClose={() => setSignInOpen(false)}
          onSignedIn={(u) => {
            setUser(u);
            setSignInOpen(false);
            setFormOpen(true);
          }}
        />
      )}

      {formOpen && user && (
        <ReviewFormModal
          venueId={venueId}
          user={user}
          onClose={() => setFormOpen(false)}
          onSubmit={() => {
            refresh();
            setFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ReviewCard({
  review,
  currentUserId,
  onHelpful,
  onFlag,
}: {
  review: UserReview;
  currentUserId?: string;
  onHelpful: () => void;
  onFlag: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE = 300;
  const isLong = review.text.length > TRUNCATE;
  const hasVoted = !!currentUserId && review.helpfulVoterIds.includes(currentUserId);

  return (
    <div className="border border-[#D9CDBF] rounded-xl p-4 bg-white space-y-3">
      {/* Author row */}
      <div className="flex items-start gap-3">
        <Initials name={review.authorName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-900">{review.authorName}</span>
            {review.isVerified && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                ✓ Verified
              </span>
            )}
            {review.weddingYear && (
              <span className="text-[11px] text-slate-400 shrink-0">
                Married {review.weddingYear}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarsFilled value={review.overallRating} />
            <span className="text-xs text-slate-500">{review.overallRating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">
              ·{" "}
              {new Date(review.createdAt).toLocaleDateString("en-HK", {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-dimension grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
        {RATING_DIMENSIONS.map(({ key, label, icon }) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="shrink-0">{icon}</span>
            <span className="flex-1 truncate">{label}</span>
            <span className="font-medium text-slate-700 shrink-0">{review.ratings[key]}/5</span>
          </div>
        ))}
      </div>

      {/* Title + text */}
      <div>
        <p className="text-sm font-semibold text-slate-900 mb-1">{review.title}</p>
        <p className="text-sm text-slate-700 leading-relaxed">
          {isLong && !expanded ? review.text.slice(0, TRUNCATE) + "…" : review.text}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blush-600 hover:underline mt-1"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Photos */}
      {review.photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.photos.map((p) => (
            <img
              key={p.id}
              src={p.url}
              alt=""
              className="w-16 h-16 object-cover rounded-lg border border-slate-200"
            />
          ))}
        </div>
      )}

      {/* Vendor reply */}
      {review.vendorReply && (
        <div className="bg-[#F3EBE0] border border-[#D9CDBF] rounded-lg p-3 ml-3">
          <p className="text-xs font-semibold text-slate-700 mb-1">
            Response from {review.vendorReply.authorName}
          </p>
          <p className="text-sm text-slate-600">{review.vendorReply.text}</p>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {new Date(review.vendorReply.repliedAt).toLocaleDateString("en-HK", {
              year: "numeric",
              month: "short",
            })}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 pt-1.5 border-t border-[#E0D4C4]">
        <button
          onClick={onHelpful}
          className={`text-xs flex items-center gap-1.5 transition ${
            hasVoted ? "text-blush-700 font-semibold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>👍</span>
          Helpful ({review.helpfulCount})
        </button>
        <button
          onClick={onFlag}
          className="text-xs text-slate-400 hover:text-rose-600 transition ml-auto"
        >
          Flag
        </button>
      </div>
    </div>
  );
}

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[1200] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function SignInModal({
  onClose,
  onSignedIn,
}: {
  onClose: () => void;
  onSignedIn: (u: MockUser) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
    onSignedIn(signIn(name.trim(), email.trim()));
  };

  return (
    <ModalOverlay onClose={onClose}>
      <h3 className="font-display text-lg font-semibold text-slate-900 mb-1">Sign in to review</h3>
      <p className="text-sm text-slate-500 mb-4">
        No account needed — just your name and email to post a review.
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle()}
            placeholder="e.g. Sarah & James"
            className="w-full border border-[#D9CDBF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 bg-[#FAF7F1]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle()}
            placeholder="you@example.com"
            className="w-full border border-[#D9CDBF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 bg-[#FAF7F1]"
          />
        </div>
        {error && <p className="text-xs text-rose-600">{error}</p>}
        <button
          onClick={handle}
          className="w-full py-2.5 bg-blush-600 text-white rounded-lg text-sm font-medium hover:bg-blush-700 transition"
        >
          Continue →
        </button>
      </div>
    </ModalOverlay>
  );
}

function ReviewFormModal({
  venueId,
  user,
  onClose,
  onSubmit,
}: {
  venueId: string;
  user: MockUser;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [ratings, setRatings] = useState<ReviewRatings>({ ...EMPTY_RATINGS });
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [weddingYear, setWeddingYear] = useState<number | undefined>();
  const [photoUrls, setPhotoUrls] = useState<{ id: string; url: string }[]>([]);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const allRated = Object.values(ratings).every((v) => v > 0);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, 5 - photoUrls.length)
      .forEach((f) => {
        setPhotoUrls((prev) => [...prev, { id: crypto.randomUUID(), url: URL.createObjectURL(f) }]);
      });
  };

  const handleSubmit = () => {
    if (!allRated) { setError("Please rate all 5 dimensions."); return; }
    if (title.trim().length < 5) { setError("Title must be at least 5 characters."); return; }
    if (text.trim().length < 20) { setError("Review must be at least 20 characters."); return; }
    setError("");
    submitReview({
      venueId,
      authorName: user.name,
      authorId: user.id,
      isVerified: false,
      weddingYear,
      ratings,
      title: title.trim(),
      text: text.trim(),
      photos: photoUrls,
      vendorReply: undefined,
    });
    onSubmit();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-start justify-between mb-4 pr-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900">Write a Review</h3>
          <p className="text-xs text-slate-400 mt-0.5">Posting as {user.name}</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[58vh] overflow-auto pr-1">
        {/* Star pickers */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Your ratings <span className="text-rose-500">*</span>
          </p>
          <div className="space-y-2.5">
            {RATING_DIMENSIONS.map(({ key, label, icon }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-5 text-base shrink-0">{icon}</span>
                <span className="text-sm text-slate-700 w-36 shrink-0">{label}</span>
                <StarPicker
                  value={ratings[key]}
                  onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                />
                {ratings[key] > 0 && (
                  <span className="text-xs text-slate-400">{ratings[key]}/5</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wedding year */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Wedding year <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="number"
            min={2015}
            max={new Date().getFullYear() + 2}
            value={weddingYear ?? ""}
            onChange={(e) =>
              setWeddingYear(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder={`e.g. ${new Date().getFullYear()}`}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blush-300"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Review title <span className="text-rose-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarise your experience in one line"
            maxLength={100}
            className="w-full border border-[#D9CDBF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 bg-[#FAF7F1]"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Your review <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you love? What could be improved? Tips for other couples?"
            rows={5}
            className="w-full border border-[#D9CDBF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 bg-[#FAF7F1] resize-none"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Photos <span className="text-slate-400 font-normal">(optional, up to 5)</span>
          </label>
          {photoUrls.length < 5 && (
            <div
              className="border-2 border-dashed border-[#D9CDBF] rounded-lg p-4 text-center cursor-pointer hover:border-blush-300 transition"
              onClick={() => fileRef.current?.click()}
            >
              <p className="text-xs text-slate-500">Click to upload photos</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          )}
          {photoUrls.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {photoUrls.map((p) => (
                <div key={p.id} className="relative">
                  <img
                    src={p.url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoUrls((ps) => ps.filter((x) => x.id !== p.id))
                    }
                    className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-[#E0D4C4]">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg border border-[#D9CDBF] text-sm text-[#5C4A35] hover:bg-blush-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allRated}
          className="flex-1 py-2.5 rounded-lg bg-blush-600 text-white text-sm font-medium hover:bg-blush-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit review
        </button>
      </div>
    </ModalOverlay>
  );
}
