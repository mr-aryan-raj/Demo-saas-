import React, { useState } from 'react';
import { CustomerReview, MenuItem } from '../types';
import { Star, MessageSquare, Sparkles, Eye, EyeOff, Award, Download, Heart, AlertCircle, CheckCircle2, ThumbsUp, Send } from 'lucide-react';
import { apiClient } from '../services/api';

interface ReviewManagementAdminProps {
  reviews: CustomerReview[];
  menuItems: MenuItem[];
  onReviewUpdated: (updatedReview: CustomerReview) => void;
}

export const ReviewManagementAdmin: React.FC<ReviewManagementAdminProps> = ({
  reviews,
  menuItems,
  onReviewUpdated,
}) => {
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);

  // Stats calculation
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.overallRating, 0) / totalReviews).toFixed(1)
    : '5.0';
  const positiveReviews = reviews.filter((r) => r.overallRating >= 4).length;
  const negativeReviews = reviews.filter((r) => r.overallRating <= 2).length;

  // Food level analytics calculation
  const itemRatingMap: { [name: string]: { total: number; count: number } } = {};
  reviews.forEach((r) => {
    if (r.itemRatings) {
      r.itemRatings.forEach((ir) => {
        if (!itemRatingMap[ir.menuItemName]) {
          itemRatingMap[ir.menuItemName] = { total: 0, count: 0 };
        }
        itemRatingMap[ir.menuItemName].total += ir.rating;
        itemRatingMap[ir.menuItemName].count += 1;
      });
    }
  });

  const foodStats = Object.entries(itemRatingMap)
    .map(([name, stat]) => ({
      name,
      avg: Number((stat.total / stat.count).toFixed(1)),
      count: stat.count,
    }))
    .sort((a, b) => b.avg - a.avg);

  const mostLovedFood = foodStats[0] || { name: 'Woodfired Truffle Mushroom Pizza', avg: 5.0 };
  const lowestRatedFood = foodStats.length > 1 ? foodStats[foodStats.length - 1] : { name: 'Standard Soda', avg: 4.0 };

  const handleReplySubmit = async (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;

    try {
      const updated = await apiClient.replyToReview(reviewId, text);
      onReviewUpdated(updated);
      setReplyingId(null);
    } catch (err) {
      alert('Error saving reply');
    }
  };

  const handleToggleFeature = async (reviewId: string) => {
    try {
      const updated = await apiClient.toggleFeatureReview(reviewId);
      onReviewUpdated(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleHide = async (reviewId: string) => {
    try {
      const updated = await apiClient.toggleHideReview(reviewId);
      onReviewUpdated(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportReviews = () => {
    const headers = ['Review ID', 'Customer Name', 'Order ID', 'Overall Stars', 'Comment', 'Date', 'Admin Reply'];
    const rows = reviews.map((r) => [
      `"${r.id}"`,
      `"${r.customerName}"`,
      `"${r.orderId}"`,
      r.overallRating,
      `"${r.comment.replace(/"/g, '""')}"`,
      `"${r.createdAt}"`,
      `"${(r.adminReply || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DineFlow_Customer_Reviews.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-400">Total Customer Reviews</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-amber-200">{totalReviews}</span>
            <span className="text-xs text-amber-400 font-mono">Avg ⭐ {avgRating}</span>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-400">Positive Reviews (4-5 ⭐)</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-emerald-300">{positiveReviews}</span>
            <span className="text-xs text-emerald-400 font-mono">
              {totalReviews > 0 ? ((positiveReviews / totalReviews) * 100).toFixed(0) : 100}%
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-rose-500/30 rounded-2xl p-4 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-400">Negative Reviews (1-2 ⭐)</span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-rose-300">{negativeReviews}</span>
            <span className="text-xs text-rose-400 font-mono">Action Required</span>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-400">Export Reviews</span>
          <button
            onClick={handleExportReviews}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 mt-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* Dish-Level Analytics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900/90 border border-amber-500/20 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase font-mono">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>Most Loved Dish</span>
          </div>
          <p className="font-serif text-base font-bold text-amber-100">{mostLovedFood.name}</p>
          <p className="text-xs text-zinc-400 font-mono">Average Dish Rating: ⭐ {mostLovedFood.avg}/5.0</p>
        </div>

        <div className="bg-zinc-900/90 border border-amber-500/20 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase font-mono">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Lowest Rated Dish</span>
          </div>
          <p className="font-serif text-base font-bold text-amber-100">{lowestRatedFood.name}</p>
          <p className="text-xs text-zinc-400 font-mono">Average Dish Rating: ⭐ {lowestRatedFood.avg}/5.0</p>
        </div>
      </div>

      {/* Reviews List & Moderation */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center justify-between">
          <span>Customer Feedback Feed ({reviews.length})</span>
          <span className="text-xs text-zinc-400 font-mono">Reply • Feature • Hide Controls</span>
        </h3>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-zinc-950 border rounded-2xl p-4 space-y-3 ${
                rev.isHidden
                  ? 'border-rose-500/30 opacity-60'
                  : rev.isFeatured
                  ? 'border-amber-500/50 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950'
                  : 'border-zinc-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-amber-100 text-sm">{rev.customerName}</span>
                    <span className="text-xs font-mono text-zinc-400">Order: {rev.orderId}</span>
                    {rev.isFeatured && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                        Featured
                      </span>
                    )}
                    {rev.isHidden && (
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">{rev.createdAt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30 text-amber-300 text-xs font-bold">
                    <span>{rev.overallRating}.0</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>

                  <button
                    onClick={() => handleToggleFeature(rev.id)}
                    className={`p-1.5 rounded-lg border text-xs font-mono transition-all ${
                      rev.isFeatured
                        ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-amber-300'
                    }`}
                    title="Feature on Website"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleHide(rev.id)}
                    className={`p-1.5 rounded-lg border text-xs font-mono transition-all ${
                      rev.isHidden
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-rose-300'
                    }`}
                    title={rev.isHidden ? 'Unhide' : 'Hide Inappropriate Review'}
                  >
                    {rev.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-xs text-zinc-200 italic">"{rev.comment}"</p>

              {/* Reply Section */}
              {rev.adminReply ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-200">
                  <p className="font-bold text-[10px] uppercase font-mono text-amber-400">Official Chef Reply:</p>
                  <p className="italic">{rev.adminReply}</p>
                </div>
              ) : (
                <div className="pt-2">
                  {replyingId === rev.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Write official response..."
                        value={replyText[rev.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => handleReplySubmit(rev.id)}
                        className="px-3 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingId(rev.id)}
                      className="text-[11px] text-amber-400 hover:underline font-mono font-bold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>+ Add Chef Response</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
