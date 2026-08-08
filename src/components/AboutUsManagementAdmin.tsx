import React, { useState } from 'react';
import { RestaurantAbout, GalleryImage } from '../types';
import { Utensils, Save, Plus, Trash2, Image as ImageIcon, MapPin, Phone, Instagram, Clock, Award } from 'lucide-react';
import { apiClient } from '../services/api';

interface AboutUsManagementAdminProps {
  about: RestaurantAbout;
  onAboutUpdated: (updated: RestaurantAbout) => void;
}

export const AboutUsManagementAdmin: React.FC<AboutUsManagementAdminProps> = ({
  about,
  onAboutUpdated,
}) => {
  const [formData, setFormData] = useState<RestaurantAbout>({ ...about });
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCategory, setNewImageCategory] = useState<'ambiance' | 'dishes' | 'events' | 'chef'>('dishes');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await apiClient.updateRestaurantAbout(formData);
      onAboutUpdated(updated);
      alert('Restaurant Brand & About Us details updated successfully!');
    } catch (err) {
      alert('Error updating brand info');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageTitle || !newImageUrl) return;

    const newImg: GalleryImage = {
      id: `g-${Date.now()}`,
      title: newImageTitle,
      url: newImageUrl,
      category: newImageCategory,
    };

    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, newImg],
    }));

    setNewImageTitle('');
    setNewImageUrl('');
  };

  const handleDeleteGalleryImage = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((img) => img.id !== id),
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Story & Chef Card */}
        <div className="bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <span>Story & Executive Chef Bio</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Restaurant Story</label>
              <textarea
                value={formData.ourStory}
                onChange={(e) => setFormData({ ...formData, ourStory: e.target.value })}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Chef Name</label>
                <input
                  type="text"
                  value={formData.chefName}
                  onChange={(e) => setFormData({ ...formData, chefName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Chef Title</label>
                <input
                  type="text"
                  value={formData.chefTitle}
                  onChange={(e) => setFormData({ ...formData, chefTitle: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Chef Profile Photo URL</label>
              <input
                type="text"
                value={formData.chefImage}
                onChange={(e) => setFormData({ ...formData, chefImage: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Chef Biography</label>
              <textarea
                value={formData.chefBio}
                onChange={(e) => setFormData({ ...formData, chefBio: e.target.value })}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>Contact, Hours & Social Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-bold mb-1">Restaurant Physical Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Brand Details'}</span>
        </button>
      </form>

      {/* Gallery Image Manager */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-400" />
          <span>Manage Website Gallery Images ({formData.galleryImages.length})</span>
        </h3>

        {/* Add new photo form */}
        <form onSubmit={handleAddGalleryImage} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
          <input
            type="text"
            placeholder="Image Title (e.g. Oven Room)"
            value={newImageTitle}
            onChange={(e) => setNewImageTitle(e.target.value)}
            required
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
          <input
            type="text"
            placeholder="Unsplash / Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            required
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
          />
          <select
            value={newImageCategory}
            onChange={(e) => setNewImageCategory(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-amber-300 font-bold focus:outline-none"
          >
            <option value="dishes">Dishes</option>
            <option value="ambiance">Ambiance</option>
            <option value="chef">Chef</option>
            <option value="events">Events</option>
          </select>
          <button
            type="submit"
            className="py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        </form>

        {/* Gallery Thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {formData.galleryImages.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <img src={img.url} alt={img.title} className="w-full h-28 object-cover" />
              <div className="p-2 bg-zinc-950 text-[10px] flex items-center justify-between">
                <span className="font-bold text-amber-100 truncate pr-1">{img.title}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteGalleryImage(img.id)}
                  className="text-rose-400 hover:text-rose-300 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
