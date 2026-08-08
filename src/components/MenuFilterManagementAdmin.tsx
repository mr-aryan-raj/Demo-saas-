import React, { useState } from 'react';
import { MenuItem, CategoryType, FoodType, SpiceLevel, DietaryOption } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Flame,
  Star,
  Clock,
  Sparkles,
  Tag,
  ChefHat,
  Heart,
  TrendingUp,
  DollarSign,
  Info,
  Filter,
} from 'lucide-react';
import { apiClient } from '../services/api';

interface MenuFilterManagementAdminProps {
  menuItems: MenuItem[];
  onMenuItemsUpdated: (updatedItems: MenuItem[]) => void;
}

export const MenuFilterManagementAdmin: React.FC<MenuFilterManagementAdminProps> = ({
  menuItems,
  onMenuItemsUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    category: 'Pizza',
    description: '',
    price: 15,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    foodType: 'veg',
    spiceLevel: 'medium',
    dietaryInfo: [],
    ingredients: [],
    cuisineType: 'Italian',
    rating: 4.8,
    preparationTime: 15,
    available: true,
    isBestseller: false,
    isChefSpecial: false,
    isTodaysSpecial: false,
    isLimitedItem: false,
    isNewArrival: false,
    isCustomerFavourite: false,
  });

  const [ingredientsInput, setIngredientsInput] = useState('');

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.cuisineType && item.cuisineType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setFormData({ ...item });
    setIngredientsInput(item.ingredients ? item.ingredients.join(', ') : '');
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAddingNew(true);
    setFormData({
      id: `item-${Date.now()}`,
      name: '',
      category: 'Pizza',
      description: '',
      price: 15,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      isVeg: true,
      foodType: 'veg',
      spiceLevel: 'medium',
      dietaryInfo: [],
      ingredients: [],
      cuisineType: 'Italian',
      rating: 4.8,
      preparationTime: 15,
      available: true,
      isBestseller: false,
      isChefSpecial: false,
      isTodaysSpecial: false,
      isLimitedItem: false,
      isNewArrival: false,
      isCustomerFavourite: false,
    });
    setIngredientsInput('');
  };

  const handleToggleFlag = async (
    item: MenuItem,
    flagKey: keyof Pick<
      MenuItem,
      | 'available'
      | 'isBestseller'
      | 'isChefSpecial'
      | 'isTodaysSpecial'
      | 'isLimitedItem'
      | 'isNewArrival'
      | 'isCustomerFavourite'
    >
  ) => {
    const newValue = !item[flagKey];
    const updated = { ...item, [flagKey]: newValue };
    
    // Update local list
    const newList = menuItems.map((m) => (m.id === item.id ? updated : m));
    onMenuItemsUpdated(newList);

    try {
      await apiClient.updateMenuItem(item.id, { [flagKey]: newValue });
      showToast(`Updated "${item.name}" - ${flagKey.replace('is', '')}: ${newValue ? 'ON' : 'OFF'}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const parsedIngredients = ingredientsInput
      ? ingredientsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const finalItem: MenuItem = {
      id: formData.id || `item-${Date.now()}`,
      name: formData.name,
      category: formData.category || 'Pizza',
      description: formData.description || '',
      price: Number(formData.price),
      image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      isVeg: formData.foodType === 'veg' || formData.foodType === 'vegan' || formData.foodType === 'eggless',
      foodType: formData.foodType || 'veg',
      spiceLevel: formData.spiceLevel || 'medium',
      dietaryInfo: formData.dietaryInfo || [],
      ingredients: parsedIngredients,
      cuisineType: formData.cuisineType || 'Global',
      rating: formData.rating || 4.8,
      preparationTime: Number(formData.preparationTime) || 15,
      available: formData.available !== undefined ? formData.available : true,
      isBestseller: !!formData.isBestseller,
      isChefSpecial: !!formData.isChefSpecial,
      isTodaysSpecial: !!formData.isTodaysSpecial,
      isLimitedItem: !!formData.isLimitedItem,
      isNewArrival: !!formData.isNewArrival,
      isCustomerFavourite: !!formData.isCustomerFavourite,
      customizationGroups: formData.customizationGroups || [],
    };

    if (isAddingNew) {
      try {
        const created = await apiClient.addMenuItem(finalItem);
        onMenuItemsUpdated([created, ...menuItems]);
        showToast(`Added new item: ${created.name}`);
      } catch (err) {
        onMenuItemsUpdated([finalItem, ...menuItems]);
        showToast(`Added new item: ${finalItem.name}`);
      }
    } else if (editingItem) {
      try {
        const updated = await apiClient.updateMenuItem(editingItem.id, finalItem);
        onMenuItemsUpdated(menuItems.map((m) => (m.id === editingItem.id ? updated : m)));
        showToast(`Updated menu item: ${finalItem.name}`);
      } catch (err) {
        onMenuItemsUpdated(menuItems.map((m) => (m.id === editingItem.id ? finalItem : m)));
        showToast(`Updated menu item: ${finalItem.name}`);
      }
    }

    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish from the menu?')) return;
    const newList = menuItems.filter((m) => m.id !== id);
    onMenuItemsUpdated(newList);
    try {
      await apiClient.deleteMenuItem(id);
      showToast('Item deleted successfully!');
    } catch (err) {
      showToast('Item removed from menu');
    }
  };

  const toggleDietaryOption = (opt: DietaryOption) => {
    const current = formData.dietaryInfo || [];
    if (current.includes(opt)) {
      setFormData({ ...formData, dietaryInfo: current.filter((d) => d !== opt) });
    } else {
      setFormData({ ...formData, dietaryInfo: [...current, opt] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-zinc-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-amber-100">
              Admin Menu & Filter Controls
            </h2>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {menuItems.length} Dishes Registered
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Control food tags (Bestseller, Chef Special, Dietary, Spice levels), preparation times, availability, and item metadata.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Search & Category Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish name, description, cuisine..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-zinc-900/90 border rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-lg transition-all ${
              item.available ? 'border-zinc-800/90 hover:border-amber-500/40' : 'border-rose-900/40 opacity-75 bg-zinc-950/60'
            }`}
          >
            <div>
              {/* Item Top Info */}
              <div className="flex items-start gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-zinc-950 border border-zinc-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-serif font-bold text-amber-100 text-sm truncate">
                      {item.name}
                    </h3>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500 font-semibold">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.cuisineType || 'Global'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {item.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-zinc-800/80">
                <button
                  onClick={() => handleToggleFlag(item, 'available')}
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border transition-all ${
                    item.available
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                      : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                  }`}
                >
                  {item.available ? 'Available Now' : 'Out of Stock'}
                </button>

                <button
                  onClick={() => handleToggleFlag(item, 'isBestseller')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                    item.isBestseller
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  <span>🔥 Bestseller</span>
                </button>

                <button
                  onClick={() => handleToggleFlag(item, 'isChefSpecial')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                    item.isChefSpecial
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  <span>⭐ Chef Special</span>
                </button>

                <button
                  onClick={() => handleToggleFlag(item, 'isCustomerFavourite')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                    item.isCustomerFavourite
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  <span>❤️ Favourite</span>
                </button>

                <button
                  onClick={() => handleToggleFlag(item, 'isTodaysSpecial')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                    item.isTodaysSpecial
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  <span>🌟 Today's Special</span>
                </button>

                <button
                  onClick={() => handleToggleFlag(item, 'isNewArrival')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                    item.isNewArrival
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  <span>🆕 New</span>
                </button>

                <button
                  onClick={() => handleToggleFlag(item, 'isLimitedItem')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                    item.isLimitedItem
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                      : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  <span>⏳ Limited</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 font-mono">
                Prep: {item.preparationTime} mins
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Dish</span>
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 transition-all"
                  title="Delete Dish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {(editingItem || isAddingNew) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-amber-100">
                  {isAddingNew ? 'Add New Dish to Menu' : `Edit "${editingItem?.name}"`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs text-zinc-300">
              {/* Row 1: Name & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Truffle Paneer Pizza"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    placeholder="e.g. 19.99"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Category & Food Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Category</label>
                  <select
                    value={formData.category || 'Pizza'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Food Type</label>
                  <select
                    value={formData.foodType || 'veg'}
                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value as FoodType })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="veg">🥗 Veg</option>
                    <option value="non-veg">🍗 Non Veg</option>
                    <option value="vegan">🌱 Vegan</option>
                    <option value="eggless">🥚 Eggless</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe ingredients, mouthfeel, and cooking technique..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Row 4: Image URL & Cuisine */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Cuisine Type</label>
                  <input
                    type="text"
                    value={formData.cuisineType || ''}
                    onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                    placeholder="e.g. North Indian, Italian, Fusion"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Spice Level & Prep Time & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Spice Level</label>
                  <select
                    value={formData.spiceLevel || 'medium'}
                    onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value as SpiceLevel })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="mild">Mild 🟢</option>
                    <option value="medium">Medium 🟡</option>
                    <option value="spicy">Spicy 🌶️</option>
                    <option value="extra-spicy">Extra Spicy 🌶️🔥</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={formData.preparationTime || 15}
                    onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating || 4.8}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 6: Ingredients (Comma separated) */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1">Ingredients (Comma Separated)</label>
                <input
                  type="text"
                  value={ingredientsInput}
                  onChange={(e) => setIngredientsInput(e.target.value)}
                  placeholder="e.g. Paneer, Bell Pepper, Truffle Oil, Sourdough"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Row 7: Dietary Information Checkboxes */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1.5">Dietary Information Badges</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'high-protein', label: 'High Protein 💪' },
                    { id: 'low-calorie', label: 'Low Calorie 🥗' },
                    { id: 'gluten-free', label: 'Gluten Free 🌾' },
                    { id: 'sugar-free', label: 'Sugar Free 🍯' },
                    { id: 'healthy-choice', label: 'Healthy Choice 🌱' },
                  ].map((diet) => {
                    const isSelected = (formData.dietaryInfo || []).includes(diet.id as DietaryOption);
                    return (
                      <button
                        type="button"
                        key={diet.id}
                        onClick={() => toggleDietaryOption(diet.id as DietaryOption)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                            : 'bg-zinc-950 text-zinc-500 border border-zinc-800'
                        }`}
                      >
                        {diet.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 8: Admin Flags */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1.5">Food Highlight Badges</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'isBestseller', label: '🔥 Bestseller' },
                    { key: 'isChefSpecial', label: '⭐ Chef Special' },
                    { key: 'isCustomerFavourite', label: '❤️ Customer Favourite' },
                    { key: 'isTodaysSpecial', label: '🌟 Today\'s Special' },
                    { key: 'isNewArrival', label: '🆕 New Arrival' },
                    { key: 'isLimitedItem', label: '⚡ Limited Item' },
                  ].map((flag) => {
                    const active = !!formData[flag.key as keyof MenuItem];
                    return (
                      <button
                        type="button"
                        key={flag.key}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            [flag.key]: !active,
                          })
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                          active
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                        }`}
                      >
                        <span>{flag.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingNew(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold shadow-lg"
                >
                  {isAddingNew ? 'Create Dish' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
