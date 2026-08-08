import React, { useState } from 'react';
import { Order, CustomerReview, ItemRating, ReviewCategories } from '../types';
import { Star, Upload, Sparkles, X, CheckCircle2, MessageSquare, Heart, ShieldAlert, Award } from 'lucide-react';
import { apiClient } from '../services/api';

interface ReviewModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onReviewSubmitted: (review: CustomerReview) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  order,
  onClose,
  onReviewSubmitted,
}) => {
  const [overallRating, setOverallRating] = useState(5);
  const [categories, setCategories] = useState<ReviewCategories>({
    foodQuality: 5,
    taste: 5,
    service: 5,
    waitingTime: 5,
    cleanliness: 5,
    overall: 5,
  });

  const [comment, setComment] = useState('');
  const [foodImageUrl, setFoodImageUrl] = useState<string>('');
  const [itemRatings, setItemRatings] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    order.items.forEach((item) => {
      initial[item.menuItemId] = 5;
    });
    return initial;
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCategoryChange = (key: keyof ReviewCategories, val: number) => {
    setCategories((prev) => ({ ...prev, [key]: val }));
  };

  const handleItemRatingChange = (menuItemId: string, val: number) => {
    setItemRatings((prev) => ({ ...prev, [menuItemId]: val }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoodImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedItemRatings: ItemRating[] = order.items.map((item) => ({
        menuItemId: item.menuItemId,
        menuItemName: item.name,
        rating: itemRatings[item.menuItemId] || 5,
      }));

      const reviewData: Partial<CustomerReview> = {
        orderId: order.id,
        customerId: order.customerId,
        customerName: order.customerName,
        overallRating,
        categories,
        comment,
        foodImageUrl: foodImageUrl || undefined,
        itemsOrdered: order.items.map((i) => ({ id: i.menuItemId, name: i.name })),
        itemRatings: formattedItemRatings,
      };

      const newReview = await apiClient.submitReview(reviewData);
      setSuccessMessage('Thank you! Your feedback has been submitted. +50 Loyalty Points awarded! 🎉');
      setTimeout(() => {
        onReviewSubmitted(newReview);
        onClose();
      }, 1800);
    } catch (err: any) {
      alert(err.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-zinc-100 shadow-2xl my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">How was your dining experience?</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Order <strong className="text-amber-300">{order.orderNumber}</strong> • Table {order.tableNumber}
          </p>
        </div>

        {successMessage ? (
          <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <p className="font-serif text-lg font-bold text-emerald-200">{successMessage}</p>
            <p className="text-xs text-emerald-400 font-mono">Closing window in a moment...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall 1-5 Star Rating */}
            <div className="bg-zinc-900/90 border border-amber-500/20 rounded-2xl p-4 text-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                Overall Rating
              </label>
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setOverallRating(star);
                      setCategories((prev) => ({ ...prev, overall: star }));
                    }}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= overallRating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 font-serif italic">
                {overallRating === 5 && 'Outstanding! Flawless culinary experience.'}
                {overallRating === 4 && 'Very Good! Delightful meal.'}
                {overallRating === 3 && 'Average. Room for improvement.'}
                {overallRating === 2 && 'Needs Attention.'}
                {overallRating === 1 && 'Unsatisfactory.'}
              </p>
            </div>

            {/* Category Ratings */}
            <div className="space-y-3 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
              <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Rate Key Categories</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { key: 'foodQuality' as const, label: 'Food Quality' },
                  { key: 'taste' as const, label: 'Taste & Flavor' },
                  { key: 'service' as const, label: 'Service Speed & Hospitality' },
                  { key: 'waitingTime' as const, label: 'Preparation / Waiting Time' },
                  { key: 'cleanliness' as const, label: 'Table & Hygiene Cleanliness' },
                  { key: 'overall' as const, label: 'Overall Vibe & Experience' },
                ].map((cat) => (
                  <div key={cat.key} className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-300 font-medium">{cat.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleCategoryChange(cat.key, s)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              s <= categories[cat.key] ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Food-Level Item Ratings */}
            <div className="space-y-2 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
              <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-amber-400" />
                <span>Rate Individual Ordered Dishes</span>
              </h3>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-semibold text-zinc-200 truncate">{item.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Qty: {item.quantity}</p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleItemRatingChange(item.menuItemId, star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= (itemRatings[item.menuItemId] || 5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Feedback Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1">
                Share your detailed feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you loved about the food, ambience, or service..."
                rows={3}
                required
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none resize-none"
              />
            </div>

            {/* Upload Food Image (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1">
                Upload Dish Photo (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-zinc-900 border border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl cursor-pointer text-xs text-zinc-400 hover:text-amber-200 transition-all">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>{foodImageUrl ? 'Change Dish Photo' : 'Select or Capture Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {/* Preset sample photo buttons if customer wants fast test */}
                <button
                  type="button"
                  onClick={() =>
                    setFoodImageUrl(
                      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80'
                    )
                  }
                  className="px-2.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] text-amber-400 hover:bg-zinc-800 font-mono"
                >
                  Use Sample Photo
                </button>
              </div>

              {foodImageUrl && (
                <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-amber-500/40">
                  <img src={foodImageUrl} alt="Food Upload" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFoodImageUrl('')}
                    className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-rose-400 hover:text-rose-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{loading ? 'Submitting Review...' : 'SUBMIT REVIEW & EARN +50 REWARD POINTS'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
