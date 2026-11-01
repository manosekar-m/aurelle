"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, ThumbsUp, Sparkles, X } from "lucide-react";
import { ChapterData, Review } from "@/data/collection";

interface Props {
  look: ChapterData;
  accent: string;
}

export default function LookReviews({ look, accent }: Props) {
  // Local reviews state (starts with look's predefined reviews, permits user to add more)
  const [reviews, setReviews] = useState<Review[]>(look.reviews || []);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  // New review form fields
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [location, setLocation] = useState("");
  const [sizePurchased, setSizePurchased] = useState("Size S");
  const [fitFeedback, setFitFeedback] = useState<
    "True to size" | "Runs slightly small" | "Runs slightly large" | "Sculpted fit"
  >("True to size");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Statistics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  const count5 = reviews.filter((r) => r.rating === 5).length;
  const count4 = reviews.filter((r) => r.rating === 4).length;
  const count3 = reviews.filter((r) => r.rating === 3).length;
  const count2 = reviews.filter((r) => r.rating === 2).length;
  const count1 = reviews.filter((r) => r.rating === 1).length;

  // Filtered reviews
  const displayedReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const handleHelpful = (id: string, initialCount: number) => {
    if (userVoted[id]) return;
    setUserVoted((prev) => ({ ...prev, [id]: true }));
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1,
    }));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setFormError("Please provide your name or initials.");
      return;
    }
    if (!location.trim()) {
      setFormError("Please provide your city and country.");
      return;
    }
    if (!reviewTitle.trim()) {
      setFormError("Please add a title for your critique.");
      return;
    }
    if (!reviewComment.trim() || reviewComment.trim().length < 20) {
      setFormError("Please share at least 20 characters of your experience.");
      return;
    }

    const createdReview: Review = {
      id: `rev-user-${Date.now()}`,
      author: authorName.trim(),
      location: location.trim(),
      rating: newRating,
      date: "Just now",
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      sizePurchased,
      fitFeedback,
      helpfulCount: 0,
    };

    setReviews([createdReview, ...reviews]);
    setSubmitSuccess(true);
    setFormError("");
    setAuthorName("");
    setLocation("");
    setReviewTitle("");
    setReviewComment("");
    setNewRating(5);

    setTimeout(() => {
      setSubmitSuccess(false);
      setShowWriteForm(false);
    }, 2500);
  };

  const ratingLabels: Record<number, string> = {
    5: "Exceptional · Haute Couture Grade",
    4: "Exquisite · Highly Recommended",
    3: "Commendable Craft",
    2: "Fair Execution",
    1: "Below Atelier Standards",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 pb-8"
    >
      {/* ── SCORE SUMMARY CARD ── */}
      <div
        className="p-6 md:p-8 border rounded-sm relative overflow-hidden"
        style={{
          borderColor: `${accent}35`,
          background: `linear-gradient(135deg, ${accent}08 0%, rgba(5,5,5,0.7) 100%)`,
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left score */}
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span
                className="font-serif text-5xl md:text-6xl tracking-tight leading-none"
                style={{ color: accent }}
              >
                {avgRating}
              </span>
              <span className="font-sans text-xs tracking-[0.3em] text-white/40 uppercase">
                / 5.0 RATING
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className="fill-current"
                  style={{ color: accent }}
                />
              ))}
              <span className="ml-2 font-sans text-xs text-white/70 tracking-wider">
                ({totalReviews} Verified Client Critiques)
              </span>
            </div>

            <p className="font-sans text-[9px] tracking-[0.25em] text-white/50 uppercase flex items-center gap-2">
              <Check size={12} style={{ color: accent }} />
              100% OF ATELIER CLIENTS RECOMMEND THIS CREATION
            </p>
          </div>

          {/* Right action button */}
          <button
            onClick={() => setShowWriteForm(!showWriteForm)}
            className="px-5 py-3 border font-sans text-[8px] tracking-[0.35em] uppercase transition-all duration-300 hover:bg-white/5 shrink-0 flex items-center gap-2"
            style={{ borderColor: `${accent}70`, color: accent }}
          >
            <Sparkles size={12} />
            {showWriteForm ? "CLOSE FORM" : "WRITE A CLIENT REVIEW"}
          </button>
        </div>

        {/* Rating Breakdown bars */}
        <div className="mt-6 pt-6 border-t flex flex-col gap-2.5" style={{ borderColor: `${accent}18` }}>
          {[
            { stars: 5, count: count5 },
            { stars: 4, count: count4 },
            { stars: 3, count: count3 },
            { stars: 2, count: count2 },
            { stars: 1, count: count1 },
          ].map(({ stars, count }) => {
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-sans text-[9px] tracking-wider text-white/50">
                  {stars} ★
                </span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: accent }}
                  />
                </div>
                <span className="w-8 text-right font-sans text-[9px] text-white/40 tracking-wider">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Fit summary badge */}
        <div
          className="mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-4 font-sans text-[9px] tracking-[0.2em] text-white/50 uppercase"
          style={{ borderColor: `${accent}18` }}
        >
          <span>Fit Assessment: <strong className="text-white/80">98% True to Size</strong></span>
          <span>Craftsmanship: <strong className="text-white/80">Couture Standard</strong></span>
          <span>Drape & Movement: <strong className="text-white/80">Fluid & Sculptural</strong></span>
        </div>
      </div>

      {/* ── WRITE A REVIEW FORM ── */}
      <AnimatePresence>
        {showWriteForm && (
          <motion.form
            onSubmit={handleAddReview}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="border p-6 md:p-8 flex flex-col gap-6 overflow-hidden rounded-sm"
            style={{
              borderColor: `${accent}50`,
              background: "rgba(10,10,10,0.9)",
            }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: `${accent}25` }}>
              <div>
                <h4 className="font-serif text-xl text-white tracking-wider">
                  Share Your Atelier Experience
                </h4>
                <p className="font-sans text-[8px] tracking-[0.3em] text-white/40 uppercase mt-1">
                  Critique for {look.title} · {look.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWriteForm(false)}
                className="text-white/40 hover:text-white"
                aria-label="Close review form"
              >
                <X size={18} />
              </button>
            </div>

            {/* Star selector */}
            <div>
              <label className="block font-sans text-[8px] tracking-[0.4em] uppercase mb-2" style={{ color: accent }}>
                YOUR RATING *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || newRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        size={22}
                        className={filled ? "fill-current" : "stroke-white/30 fill-transparent"}
                        style={{ color: filled ? accent : "transparent" }}
                      />
                    </button>
                  );
                })}
                <span className="ml-3 font-sans text-[10px] tracking-wider text-white/60">
                  {ratingLabels[hoverRating || newRating]}
                </span>
              </div>
            </div>

            {/* Client info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-[8px] tracking-[0.4em] uppercase mb-1.5 text-white/50">
                  FULL NAME / TITLE *
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Lady Vivienne R. or Camille D."
                  className="w-full bg-transparent border-b py-2 font-sans text-xs text-white/90 placeholder:text-white/20 outline-none transition-colors focus:border-white"
                  style={{ borderColor: `${accent}40` }}
                />
              </div>

              <div>
                <label className="block font-sans text-[8px] tracking-[0.4em] uppercase mb-1.5 text-white/50">
                  CITY & COUNTRY *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Paris, France or Zurich, Switzerland"
                  className="w-full bg-transparent border-b py-2 font-sans text-xs text-white/90 placeholder:text-white/20 outline-none transition-colors focus:border-white"
                  style={{ borderColor: `${accent}40` }}
                />
              </div>
            </div>

            {/* Size & Fit selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-[8px] tracking-[0.4em] uppercase mb-1.5 text-white/50">
                  SIZE PURCHASED
                </label>
                <select
                  value={sizePurchased}
                  onChange={(e) => setSizePurchased(e.target.value)}
                  className="w-full bg-[#121212] border-b py-2 font-sans text-xs text-white/90 outline-none cursor-pointer"
                  style={{ borderColor: `${accent}40` }}
                >
                  <option value="Size XS (FR 34 / US 2)">Size XS (FR 34 / US 2)</option>
                  <option value="Size S (FR 36 / US 4)">Size S (FR 36 / US 4)</option>
                  <option value="Size M (FR 38 / US 6)">Size M (FR 38 / US 6)</option>
                  <option value="Size L (FR 40 / US 8)">Size L (FR 40 / US 8)</option>
                  <option value="Size XL (FR 42 / US 10)">Size XL (FR 42 / US 10)</option>
                  <option value="Size XXL (FR 44 / US 12)">Size XXL (FR 44 / US 12)</option>
                </select>
              </div>

              <div>
                <label className="block font-sans text-[8px] tracking-[0.4em] uppercase mb-1.5 text-white/50">
                  FIT ASSESSMENT
                </label>
                <select
                  value={fitFeedback}
                  onChange={(e) =>
                    setFitFeedback(
                      e.target.value as "True to size" | "Runs slightly small" | "Runs slightly large" | "Sculpted fit"
                    )
                  }
                  className="w-full bg-[#121212] border-b py-2 font-sans text-xs text-white/90 outline-none cursor-pointer"
                  style={{ borderColor: `${accent}40` }}
                >
                  <option value="True to size">True to size</option>
                  <option value="Sculpted fit">Sculpted fit</option>
                  <option value="Runs slightly small">Runs slightly small</option>
                  <option value="Runs slightly large">Runs slightly large</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-sans text-[8px] tracking-[0.4em] uppercase mb-1.5 text-white/50">
                CRITIQUE HEADLINE *
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Pure architectural majesty at the Palais Garnier"
                className="w-full bg-transparent border-b py-2 font-sans text-xs text-white/90 placeholder:text-white/20 outline-none transition-colors focus:border-white"
                style={{ borderColor: `${accent}40` }}
              />
            </div>

            {/* Detailed Comment */}
            <div>
              <label className="block font-sans text-[8px] tracking-[0.4em] uppercase mb-1.5 text-white/50">
                DETAILED CRITIQUE *
              </label>
              <textarea
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts on the craftsmanship, fabric reflection, silhouette, fit, and event reception..."
                className="w-full bg-transparent border py-2.5 px-3 font-sans text-xs text-white/90 placeholder:text-white/20 outline-none transition-colors focus:border-white resize-none"
                style={{ borderColor: `${accent}40` }}
              />
            </div>

            {/* Errors & Success */}
            {formError && (
              <p className="font-sans text-[9px] tracking-wider text-rose-400">
                {formError}
              </p>
            )}

            {submitSuccess && (
              <div
                className="p-3 border font-sans text-[9px] tracking-[0.2em] uppercase flex items-center gap-2"
                style={{ borderColor: accent, background: `${accent}15`, color: accent }}
              >
                <Check size={14} />
                Thank you. Your critique has been recorded into the atelier registry.
              </div>
            )}

            <button
              type="submit"
              className="py-3 px-6 font-sans text-[9px] tracking-[0.35em] uppercase text-[#050505] transition-opacity hover:opacity-85 font-medium"
              style={{ background: accent }}
            >
              SUBMIT ATELIER CRITIQUE
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── FILTER TABS ── */}
      <div className="flex items-center gap-2 border-b pb-4 flex-wrap" style={{ borderColor: `${accent}20` }}>
        <span className="font-sans text-[8px] tracking-[0.3em] text-white/40 uppercase mr-2">
          FILTER BY:
        </span>
        {[
          { label: `ALL (${totalReviews})`, value: null },
          { label: `5 STARS (${count5})`, value: 5 },
          { label: `4 STARS (${count4})`, value: 4 },
        ].map((tab) => {
          const isSelected = filterRating === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => setFilterRating(tab.value)}
              className="px-3 py-1.5 border font-sans text-[8px] tracking-[0.25em] uppercase transition-all duration-300"
              style={{
                borderColor: isSelected ? accent : "rgba(255,255,255,0.15)",
                background: isSelected ? `${accent}15` : "transparent",
                color: isSelected ? accent : "rgba(255,255,255,0.6)",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── REVIEWS LIST ── */}
      <div className="flex flex-col gap-6">
        {displayedReviews.map((rev, index) => {
          const currentHelpful = helpfulVotes[rev.id] ?? rev.helpfulCount;
          const hasVoted = userVoted[rev.id];

          return (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-6 border rounded-sm flex flex-col gap-4 relative transition-colors duration-300 hover:bg-white/[0.02]"
              style={{
                borderColor: `${accent}20`,
                background: "rgba(10,10,10,0.5)",
              }}
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Initials badge */}
                  <div
                    className="w-8 h-8 rounded-full border flex items-center justify-center font-serif text-xs"
                    style={{ borderColor: `${accent}50`, color: accent, background: `${accent}10` }}
                  >
                    {rev.author
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <h5 className="font-serif text-sm text-white tracking-wide">
                      {rev.author}
                    </h5>
                    <p className="font-sans text-[8px] tracking-[0.25em] text-white/40 uppercase">
                      {rev.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {rev.verifiedPurchase && (
                    <span
                      className="px-2.5 py-1 border font-sans text-[7px] tracking-[0.3em] uppercase flex items-center gap-1.5"
                      style={{ borderColor: `${accent}50`, color: accent }}
                    >
                      <Check size={10} />
                      VERIFIED CLIENT
                    </span>
                  )}
                  <span className="font-sans text-[8px] tracking-wider text-white/30">
                    {rev.date}
                  </span>
                </div>
              </div>

              {/* Stars & Details badges */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={s <= rev.rating ? "fill-current" : "stroke-white/20 fill-transparent"}
                      style={{ color: s <= rev.rating ? accent : "transparent" }}
                    />
                  ))}
                </div>

                <span className="text-white/20">•</span>

                <span className="font-sans text-[8px] tracking-[0.2em] text-white/50 uppercase px-2 py-0.5 border border-white/10">
                  {rev.sizePurchased}
                </span>

                <span
                  className="font-sans text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border"
                  style={{ borderColor: `${accent}30`, color: accent }}
                >
                  Fit: {rev.fitFeedback}
                </span>
              </div>

              {/* Review Title */}
              <h4 className="font-serif text-base text-white/95 tracking-wide mt-1">
                &ldquo;{rev.title}&rdquo;
              </h4>

              {/* Comment Quote */}
              <p className="font-sans text-xs text-white/70 leading-relaxed font-light">
                {rev.comment}
              </p>

              {/* Footer row: helpful vote */}
              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: `${accent}15` }}>
                <span className="font-sans text-[8px] tracking-[0.25em] text-white/30 uppercase">
                  Atelier Verified Experience
                </span>

                <button
                  onClick={() => handleHelpful(rev.id, rev.helpfulCount)}
                  className={`flex items-center gap-1.5 font-sans text-[8px] tracking-[0.25em] uppercase px-3 py-1.5 border transition-all duration-300 ${
                    hasVoted ? "cursor-default" : "hover:bg-white/5 cursor-pointer"
                  }`}
                  style={{
                    borderColor: hasVoted ? accent : "rgba(255,255,255,0.15)",
                    color: hasVoted ? accent : "rgba(255,255,255,0.5)",
                  }}
                >
                  <ThumbsUp size={11} className={hasVoted ? "fill-current" : ""} />
                  HELPFUL ({currentHelpful})
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

