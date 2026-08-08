import React, { useState } from 'react';
import { CustomerReview } from '../types';
import { Star, MessageSquare, CheckCircle2, Award, Heart, ThumbsUp, Sparkles, Filter, Image as ImageIcon } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onRequestWriteReview?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onRequestWriteReview,
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all' | 'featured'>('all');

  const visibleReviews = reviews.filter((r) => {
    if (r.isHidden) return false;
    if (filterRating === 'featured') return r.isFeatured;
    if (filterRating !== 'all') return r.overallRating === filterRating;
    return true;
  });

  // Calculate average stats
  const totalReviews = reviews.filter((r) => !r.isHidden).length;
  const avgRating = totalReviews > 0
    ? (reviews.filter((r) => !r.isHidden).reduce((acc, curr) => acc + curr.overallRating, 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <section className="space-y-8 animate-fade-in py-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VERIFIED GUEST FEEDBACK</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-amber-100">Customer Reviews & Ratings</h2>
          <p className="text-xs text-zinc-400 max-w-xl">
            Real feedback from our verified table guests, order-by-order ratings, and artisanal dish highlights.
          </p>
        </div>

        {/* Rating Summary Pill */}
        <div className="flex items-center gap-4 bg-zinc-900/90 border border-amber-500/30 p-4 rounded-2xl z-10">
          <div className="text-center">
            <span className="font-serif text-4xl font-bold text-amber-300">{avgRating}</span>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 font-mono">{totalReviews} Verified Reviews</p>
          </div>

          {onRequestWriteReview && (
            <button
              onClick={onRequestWriteReview}
              className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-zinc-500 font-medium px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Filter:</span>
          </span>

          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterRating === 'all'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            All Reviews ({totalReviews})
          </button>

          <button
            onClick={() => setFilterRating('featured')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 ${
              filterRating === 'featured'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-amber-300 hover:text-white bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Featured Reviews</span>
          </button>

          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-2.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 ${
                filterRating === star
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-white bg-zinc-900'
              }`}
            >
              <span>{star} Stars</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            className={`bg-zinc-900/80 border rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all hover:border-amber-500/40 ${
              review.isFeatured ? 'border-amber-500/40 bg-gradient-to-b from-zinc-900 to-zinc-950' : 'border-zinc-800'
            }`}
          >
            <div className="space-y-3">
              {/* Header: Customer info & stars */}
              <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-amber-100 text-base">{review.customerName}</h3>
                    {review.isFeatured && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Verified Order {review.orderId}</span> • <span>{review.createdAt}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= review.overallRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-1 font-mono">{review.overallRating}.0</span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-zinc-200 leading-relaxed font-sans italic">
                "{review.comment}"
              </p>

              {/* Dish Ratings */}
              {review.itemRatings && review.itemRatings.length > 0 && (
                <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-wider">
                    Dishes Rated:
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {review.itemRatings.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-1 rounded-lg flex items-center gap-1"
                      >
                        <span className="font-medium text-amber-100">{item.menuItemName}:</span>
                        <span className="text-amber-400 font-bold flex items-center">
                          {item.rating} <Star className="w-2.5 h-2.5 fill-amber-400 inline ml-0.5" />
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Food Image Attachment if exists */}
              {review.foodImageUrl && (
                <div className="relative group rounded-2xl overflow-hidden border border-zinc-800 max-h-48">
                  <img
                    src={review.foodImageUrl}
                    alt="Customer Dish"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-amber-300 font-mono flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Customer Photo</span>
                  </div>
                </div>
              )}
            </div>

            {/* Official Admin Reply */}
            {review.adminReply && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-200 space-y-1 mt-2">
                <div className="flex items-center gap-1.5 font-serif font-bold text-amber-300">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>DineFlow Chef Response</span>
                </div>
                <p className="text-[11px] text-zinc-300 italic">{review.adminReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
