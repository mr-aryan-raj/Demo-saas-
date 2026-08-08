import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  Star,
  Clock,
  Plus,
  Filter,
  Sparkles,
  X,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  ChefHat,
  Heart,
  Check,
  Zap,
  Tag,
  ArrowUpDown,
  Utensils,
  ShoppingBag,
  Award,
} from 'lucide-react';
import {
  CategoryType,
  MenuItem,
  FoodType,
  SpiceLevel,
  DietaryOption,
  CartItem,
  Order,
} from '../types';

interface DigitalMenuProps {
  menuItems: MenuItem[];
  onOpenCustomization: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  currentTableNumber: string;
  cartItems?: CartItem[];
  orders?: Order[];
}

type SortOption =
  | 'popular'
  | 'rating'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'prep_time'
  | 'favourite';

export const DigitalMenu: React.FC<DigitalMenuProps> = ({
  menuItems,
  onOpenCustomization,
  onQuickAdd,
  currentTableNumber,
  cartItems = [],
  orders = [],
}) => {
  // Search & Basic Category State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');

  // Advanced Filter States
  const [selectedFoodType, setSelectedFoodType] = useState<FoodType | 'all'>('all');
  const [selectedPricePreset, setSelectedPricePreset] = useState<string>('all'); // 'under_200', '200_500', '500_1000', 'above_1000', 'custom'
  const [customMinPrice, setCustomMinPrice] = useState<number>(0);
  const [customMaxPrice, setCustomMaxPrice] = useState<number>(100);
  const [selectedMinRating, setSelectedMinRating] = useState<number>(0); // 0, 3.5, 4.0, 4.5
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<SpiceLevel | 'all'>('all');
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState<string>('all'); // 'available', 'bestsellers', 'todays_special', 'limited', 'favourites', 'new'
  const [selectedDietary, setSelectedDietary] = useState<DietaryOption[]>([]);

  // Sort State
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Mobile Drawer State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Categories list
  const categories: (CategoryType | 'All')[] = [
    'All',
    'Pizza',
    'Burger',
    'Main Course',
    'Chinese',
    'Indian',
    'South Indian',
    'Starters',
    'Drinks',
    'Desserts',
    'Salad',
  ];

  // Compute Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedFoodType !== 'all') count++;
    if (selectedPricePreset !== 'all') count++;
    if (selectedMinRating > 0) count++;
    if (selectedSpiceLevel !== 'all') count++;
    if (selectedAvailabilityFilter !== 'all') count++;
    if (selectedDietary.length > 0) count += selectedDietary.length;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [
    selectedCategory,
    selectedFoodType,
    selectedPricePreset,
    selectedMinRating,
    selectedSpiceLevel,
    selectedAvailabilityFilter,
    selectedDietary,
    searchQuery,
  ]);

  // Reset All Filters
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFoodType('all');
    setSelectedPricePreset('all');
    setCustomMinPrice(0);
    setCustomMaxPrice(100);
    setSelectedMinRating(0);
    setSelectedSpiceLevel('all');
    setSelectedAvailabilityFilter('all');
    setSelectedDietary([]);
    setSortBy('popular');
  };

  // Toggle Dietary
  const handleToggleDietary = (opt: DietaryOption) => {
    if (selectedDietary.includes(opt)) {
      setSelectedDietary(selectedDietary.filter((d) => d !== opt));
    } else {
      setSelectedDietary([...selectedDietary, opt]);
    }
  };

  // Main Filter & Sort Logic
  const filteredAndSortedItems = useMemo(() => {
    let result = menuItems.filter((item) => {
      // Category Match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search Match (Food Name, Category, Ingredients, Cuisine Type, Keywords)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCuisine = item.cuisineType
          ? item.cuisineType.toLowerCase().includes(query)
          : false;
        const matchesIngredients = item.ingredients
          ? item.ingredients.some((ing) => ing.toLowerCase().includes(query))
          : false;
        const matchesKeywords = item.keywords
          ? item.keywords.some((kw) => kw.toLowerCase().includes(query))
          : false;

        if (
          !matchesName &&
          !matchesCat &&
          !matchesDesc &&
          !matchesCuisine &&
          !matchesIngredients &&
          !matchesKeywords
        ) {
          return false;
        }
      }

      // Food Type Match (Veg, Non Veg, Vegan, Eggless)
      if (selectedFoodType !== 'all') {
        if (selectedFoodType === 'veg' && !(item.foodType === 'veg' || item.isVeg)) return false;
        if (selectedFoodType === 'non-veg' && item.isVeg) return false;
        if (selectedFoodType === 'vegan' && item.foodType !== 'vegan') return false;
        if (selectedFoodType === 'eggless' && item.foodType !== 'eggless') return false;
      }

      // Price Filter
      if (selectedPricePreset === 'under_200' && item.price >= 5) return false; // ~$5 / ₹200
      if (selectedPricePreset === '200_500' && (item.price < 5 || item.price > 12)) return false;
      if (selectedPricePreset === '500_1000' && (item.price < 12 || item.price > 25)) return false;
      if (selectedPricePreset === 'above_1000' && item.price <= 25) return false;
      if (selectedPricePreset === 'custom') {
        if (item.price < customMinPrice || item.price > customMaxPrice) return false;
      }

      // Rating Filter
      if (selectedMinRating > 0 && item.rating < selectedMinRating) {
        return false;
      }

      // Spice Level Filter
      if (selectedSpiceLevel !== 'all' && item.spiceLevel !== selectedSpiceLevel) {
        return false;
      }

      // Availability / Badge Filter
      if (selectedAvailabilityFilter === 'available' && !item.available) return false;
      if (selectedAvailabilityFilter === 'bestsellers' && !item.isBestseller) return false;
      if (selectedAvailabilityFilter === 'todays_special' && !item.isTodaysSpecial) return false;
      if (selectedAvailabilityFilter === 'limited' && !item.isLimitedItem) return false;
      if (selectedAvailabilityFilter === 'favourites' && !item.isCustomerFavourite) return false;
      if (selectedAvailabilityFilter === 'new' && !item.isNewArrival) return false;

      // Dietary Options Filter (Must match all selected dietary options)
      if (selectedDietary.length > 0) {
        const itemDietary = item.dietaryInfo || [];
        const hasAllDietary = selectedDietary.every((d) => itemDietary.includes(d));
        if (!hasAllDietary) return false;
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'popular') {
        if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1;
        return b.rating - a.rating;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price_desc') {
        return b.price - a.price;
      }
      if (sortBy === 'newest') {
        if (a.isNewArrival !== b.isNewArrival) return a.isNewArrival ? -1 : 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'prep_time') {
        return a.preparationTime - b.preparationTime;
      }
      if (sortBy === 'favourite') {
        if (a.isCustomerFavourite !== b.isCustomerFavourite) return a.isCustomerFavourite ? -1 : 1;
        return b.rating - a.rating;
      }
      return 0;
    });
  }, [
    menuItems,
    selectedCategory,
    searchQuery,
    selectedFoodType,
    selectedPricePreset,
    customMinPrice,
    customMaxPrice,
    selectedMinRating,
    selectedSpiceLevel,
    selectedAvailabilityFilter,
    selectedDietary,
    sortBy,
  ]);

  // Recommendation Lists
  const recommendedForYou = useMemo(() => {
    return menuItems.filter((m) => m.isBestseller || m.rating >= 4.8).slice(0, 4);
  }, [menuItems]);

  const chefsSpecials = useMemo(() => {
    return menuItems.filter((m) => m.isChefSpecial || m.isTodaysSpecial).slice(0, 4);
  }, [menuItems]);

  // Dynamic "Because You Ordered Before" recommendation logic
  const pairingsForCart = useMemo(() => {
    if (cartItems.length === 0) {
      // Default fallback pairing: Pizza/Main -> Drinks & Desserts
      return menuItems.filter((m) => m.category === 'Drinks' || m.category === 'Desserts' || m.category === 'Starters').slice(0, 3);
    }
    const cartCategories = cartItems.map((ci) => ci.menuItem.category);
    const cartNames = cartItems.map((ci) => ci.menuItem.name.toLowerCase());

    // E.g. If Paneer / Pizza in cart -> recommend Garlic Bread, Cold Drinks, Brownie
    if (cartNames.some((n) => n.includes('paneer') || n.includes('pizza'))) {
      return menuItems
        .filter(
          (m) =>
            m.name.toLowerCase().includes('garlic') ||
            m.name.toLowerCase().includes('drink') ||
            m.name.toLowerCase().includes('brownie') ||
            m.category === 'Drinks' ||
            m.category === 'Desserts'
        )
        .slice(0, 3);
    }

    // General fallback: non-cart items in Drinks/Starters
    return menuItems
      .filter((m) => !cartNames.includes(m.name.toLowerCase()) && (m.category === 'Drinks' || m.category === 'Starters' || m.category === 'Desserts'))
      .slice(0, 3);
  }, [cartItems, menuItems]);

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Table #{currentTableNumber} QR Gourmet Menu</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100 tracking-tight">
            Gourmet Menu & Culinary Discovery
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Search handcrafted pizzas, rich curries, artisanal cocktails & chef specials with smart dietary filters and instant customization.
          </p>
        </div>
      </div>

      {/* STICKY SEARCH & FILTER CONTROLS BAR */}
      <div className="sticky top-16 z-30 bg-zinc-950/90 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-zinc-800 shadow-2xl space-y-3">
        {/* Search Bar + Mobile Filter Button */}
        <div className="flex items-center gap-2">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search 'Paneer', 'Pizza', ingredients, cuisine..."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-10 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="popular" className="bg-zinc-900 text-zinc-100">🔥 Popularity</option>
              <option value="rating" className="bg-zinc-900 text-zinc-100">⭐ Top Rated</option>
              <option value="price_asc" className="bg-zinc-900 text-zinc-100">💰 Price: Low to High</option>
              <option value="price_desc" className="bg-zinc-900 text-zinc-100">💰 Price: High to Low</option>
              <option value="newest" className="bg-zinc-900 text-zinc-100">🆕 New Arrivals</option>
              <option value="prep_time" className="bg-zinc-900 text-zinc-100">⚡ Fast Prep Time</option>
              <option value="favourite" className="bg-zinc-900 text-zinc-100">❤️ Customer Favourite</option>
            </select>
          </div>

          {/* Filter Drawer Toggle Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterCount > 0
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 font-mono font-extrabold text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Food Type Chips Bar (Veg, Non Veg, Vegan, Eggless) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
          <button
            onClick={() => setSelectedFoodType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border ${
              selectedFoodType === 'all'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setSelectedFoodType(selectedFoodType === 'veg' ? 'all' : 'veg')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
              selectedFoodType === 'veg'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/80 shadow-md'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-emerald-300'
            }`}
          >
            <span>🥗 Veg</span>
          </button>
          <button
            onClick={() => setSelectedFoodType(selectedFoodType === 'non-veg' ? 'all' : 'non-veg')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
              selectedFoodType === 'non-veg'
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/80 shadow-md'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-rose-300'
            }`}
          >
            <span>🍗 Non Veg</span>
          </button>
          <button
            onClick={() => setSelectedFoodType(selectedFoodType === 'vegan' ? 'all' : 'vegan')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
              selectedFoodType === 'vegan'
                ? 'bg-teal-950/90 text-teal-300 border-teal-500/80 shadow-md'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-teal-300'
            }`}
          >
            <span>🌱 Vegan</span>
          </button>
          <button
            onClick={() => setSelectedFoodType(selectedFoodType === 'eggless' ? 'all' : 'eggless')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
              selectedFoodType === 'eggless'
                ? 'bg-yellow-950/90 text-yellow-300 border-yellow-500/80 shadow-md'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-yellow-300'
            }`}
          >
            <span>🥚 Eggless</span>
          </button>

          {/* Quick Preset Badges */}
          <button
            onClick={() =>
              setSelectedAvailabilityFilter(
                selectedAvailabilityFilter === 'bestsellers' ? 'all' : 'bestsellers'
              )
            }
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border ${
              selectedAvailabilityFilter === 'bestsellers'
                ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-md'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-amber-300'
            }`}
          >
            🔥 Bestsellers
          </button>
          <button
            onClick={() =>
              setSelectedAvailabilityFilter(
                selectedAvailabilityFilter === 'todays_special' ? 'all' : 'todays_special'
              )
            }
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border ${
              selectedAvailabilityFilter === 'todays_special'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-cyan-300'
            }`}
          >
            🌟 Today's Special
          </button>
        </div>

        {/* ACTIVE FILTERS CHIPS BAR */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pr-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase font-mono">Active:</span>

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  Category: {selectedCategory}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => setSelectedCategory('All')}
                  />
                </span>
              )}

              {selectedFoodType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  Type: {selectedFoodType.toUpperCase()}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => setSelectedFoodType('all')}
                  />
                </span>
              )}

              {selectedPricePreset !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  Price Preset
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => setSelectedPricePreset('all')}
                  />
                </span>
              )}

              {selectedMinRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  {selectedMinRating}+ ⭐
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => setSelectedMinRating(0)}
                  />
                </span>
              )}

              {selectedSpiceLevel !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  Spice: {selectedSpiceLevel}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => setSelectedSpiceLevel('all')}
                  />
                </span>
              )}

              {selectedAvailabilityFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  Badge: {selectedAvailabilityFilter}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => setSelectedAvailabilityFilter('all')}
                  />
                </span>
              )}

              {selectedDietary.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold"
                >
                  {d}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => handleToggleDietary(d)}
                  />
                </span>
              ))}
            </div>

            <button
              onClick={handleClearAllFilters}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline whitespace-nowrap ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* CATEGORY TABS HORIZONTAL SCROLL */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DYNAMIC RECOMMENDATION SECTION (Because You Ordered Before / Chef Specials) */}
      {searchQuery === '' && selectedCategory === 'All' && activeFilterCount === 0 && (
        <div className="space-y-6">
          {/* Pairings / Frequently Ordered Together */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/20 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif text-lg font-bold text-amber-100">
                  {cartItems.length > 0
                    ? `Pairs Perfectly With Items In Your Cart`
                    : `Recommended Culinary Pairings`}
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-extrabold">
                Chef's Match
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              {cartItems.length > 0
                ? `Customers who ordered ${cartItems[0].menuItem.name} frequently add these starters, drinks & desserts!`
                : `Complete your dining experience with our guest-favorite handcrafted appetizers and beverages.`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {pairingsForCart.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-950/80 border border-zinc-800/90 hover:border-amber-500/40 rounded-2xl p-3 flex items-center justify-between gap-3 group shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-zinc-900"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-amber-100 text-xs truncate group-hover:text-amber-300">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => onQuickAdd(item)}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow transition-all"
                    title="Quick Add"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS COUNT HEADER */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-zinc-300">
            {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'Dish' : 'Dishes'} Available
          </span>
        </div>

        <div className="sm:hidden flex items-center gap-1 text-xs">
          <span className="text-zinc-500 font-semibold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-zinc-900 border border-zinc-800 text-amber-300 font-bold px-2 py-1 rounded-lg focus:outline-none text-xs"
          >
            <option value="popular">🔥 Popular</option>
            <option value="rating">⭐ Rated</option>
            <option value="price_asc">💰 $ Low-High</option>
            <option value="price_desc">💰 $ High-Low</option>
            <option value="newest">🆕 New</option>
            <option value="prep_time">⚡ Prep Time</option>
          </select>
        </div>
      </div>

      {/* MENU ITEMS GRID */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-amber-100">No dishes match your filters</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Try adjusting your search query, price ranges, or dietary filters to discover our gourmet offerings.
          </p>
          <button
            onClick={handleClearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs shadow-lg hover:bg-amber-400 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedItems.map((item) => (
            <div
              key={item.id}
              className={`group relative bg-zinc-900/80 border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between ${
                item.available
                  ? 'border-zinc-800/90 hover:border-amber-500/40'
                  : 'border-zinc-800/50 opacity-60'
              }`}
            >
              {/* Top Image Box */}
              <div className="relative h-48 overflow-hidden bg-zinc-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />

                {/* Badges Top Left */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[80%]">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md backdrop-blur-md border ${
                      item.isVeg || item.foodType === 'veg'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : item.foodType === 'vegan'
                        ? 'bg-teal-950/80 text-teal-300 border-teal-500/50'
                        : item.foodType === 'eggless'
                        ? 'bg-yellow-950/80 text-yellow-300 border-yellow-500/50'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                    }`}
                  >
                    {item.foodType === 'vegan'
                      ? 'VEGAN 🌱'
                      : item.foodType === 'eggless'
                      ? 'EGGLESS 🥚'
                      : item.isVeg
                      ? 'VEG 🥗'
                      : 'NON-VEG 🍗'}
                  </span>

                  {item.isBestseller && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 shadow">
                      🔥 BESTSELLER
                    </span>
                  )}

                  {item.isChefSpecial && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-500/50">
                      ⭐ CHEF SPECIAL
                    </span>
                  )}
                </div>

                {/* Prep Time & Rating Bottom */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-300 border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </span>

                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] text-zinc-300 border border-zinc-800 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {item.preparationTime} mins
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-serif text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Ingredients & Dietary Badges */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {item.cuisineType && (
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        {item.cuisineType}
                      </span>
                    )}

                    {item.spiceLevel && item.spiceLevel !== 'mild' && (
                      <span className="text-[10px] font-semibold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-800/40 flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-orange-400" />
                        {item.spiceLevel}
                      </span>
                    )}

                    {item.dietaryInfo &&
                      item.dietaryInfo.map((d) => (
                        <span
                          key={d}
                          className="text-[9px] font-bold text-emerald-300 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40"
                        >
                          {d}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Price & Add Button Footer */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-zinc-500 font-mono">PRICE</p>
                    <p className="text-lg font-serif font-extrabold text-amber-400">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!item.available ? (
                      <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-500 font-bold text-xs">
                        Out of Stock
                      </span>
                    ) : item.customizationGroups && item.customizationGroups.length > 0 ? (
                      <button
                        onClick={() => onOpenCustomization(item)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs tracking-wider shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Customize</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onQuickAdd(item)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-1"
                        title="Quick Add"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADVANCED FILTER MODAL / SLIDE-OVER DRAWER */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-amber-100">
                  Filter Restaurant Menu
                </h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Section 1: Food Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">1. Food Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Food Types' },
                  { id: 'veg', label: '🥗 Veg' },
                  { id: 'non-veg', label: '🍗 Non Veg' },
                  { id: 'vegan', label: '🌱 Vegan' },
                  { id: 'eggless', label: '🥚 Eggless' },
                ].map((ft) => (
                  <button
                    key={ft.id}
                    onClick={() => setSelectedFoodType(ft.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left border ${
                      selectedFoodType === ft.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section 2: Category */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">2. Category</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-zinc-950 border-amber-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section 3: Price Range */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">3. Price Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under_200', label: 'Under $5 (Under ₹200)' },
                  { id: '200_500', label: '$5 - $12 (₹200-₹500)' },
                  { id: '500_1000', label: '$12 - $25 (₹500-₹1000)' },
                  { id: 'above_1000', label: 'Above $25 (Above ₹1000)' },
                  { id: 'custom', label: 'Custom Price Range' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPricePreset(p.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left border ${
                      selectedPricePreset === p.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {selectedPricePreset === 'custom' && (
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-mono">
                    <span>Min: ${customMinPrice}</span>
                    <span>Max: ${customMaxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customMaxPrice}
                    onChange={(e) => setCustomMaxPrice(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Filter Section 4: Rating Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">4. Customer Rating</label>
              <div className="flex gap-2">
                {[
                  { val: 0, label: 'Any Rating' },
                  { val: 3.5, label: '3.5+ ⭐' },
                  { val: 4.0, label: '4.0+ ⭐' },
                  { val: 4.5, label: '4.5+ ⭐' },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => setSelectedMinRating(r.val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedMinRating === r.val
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section 5: Spice Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">5. Spice Level</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Spice Levels' },
                  { id: 'mild', label: 'Mild 🟢' },
                  { id: 'medium', label: 'Medium 🟡' },
                  { id: 'spicy', label: 'Spicy 🌶️' },
                  { id: 'extra-spicy', label: 'Extra Spicy 🌶️🔥' },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => setSelectedSpiceLevel(sp.id as any)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                      selectedSpiceLevel === sp.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Section 6: Dietary Info */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">6. Dietary Options</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'high-protein', label: 'High Protein 💪' },
                  { id: 'low-calorie', label: 'Low Calorie 🥗' },
                  { id: 'gluten-free', label: 'Gluten Free 🌾' },
                  { id: 'sugar-free', label: 'Sugar Free 🍯' },
                  { id: 'healthy-choice', label: 'Healthy Choice 🌱' },
                ].map((d) => {
                  const isSel = selectedDietary.includes(d.id as DietaryOption);
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleToggleDietary(d.id as DietaryOption)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isSel
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-rose-400 font-bold underline"
              >
                Reset All Filters
              </button>

              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs shadow-lg"
              >
                Show {filteredAndSortedItems.length} Dishes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
