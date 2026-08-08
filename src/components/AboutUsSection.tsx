import React, { useState } from 'react';
import { RestaurantAbout, GalleryImage } from '../types';
import { Phone, MapPin, Clock, Instagram, Award, Sparkles, Utensils, Heart, ShieldCheck, Compass, Eye, X, ChevronRight, MessageSquare } from 'lucide-react';

interface AboutUsSectionProps {
  about: RestaurantAbout;
  onRequestReservation?: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  about,
  onRequestReservation,
}) => {
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<'all' | 'ambiance' | 'dishes' | 'events' | 'chef'>('all');
  const [activeLightboxImage, setActiveLightboxImage] = useState<GalleryImage | null>(null);

  const filteredGallery = about.galleryImages.filter((img) => {
    if (selectedGalleryCategory === 'all') return true;
    return img.category === selectedGalleryCategory;
  });

  return (
    <div className="space-y-12 animate-fade-in py-4">
      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <button
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-6 right-6 p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full text-center space-y-4">
            <img
              src={activeLightboxImage.url}
              alt={activeLightboxImage.title}
              className="max-h-[75vh] mx-auto rounded-3xl object-contain border border-amber-500/30 shadow-2xl"
            />
            <h3 className="font-serif text-2xl font-bold text-amber-100">{activeLightboxImage.title}</h3>
            {activeLightboxImage.caption && (
              <p className="text-xs text-zinc-400 font-sans">{activeLightboxImage.caption}</p>
            )}
          </div>
        </div>
      )}

      {/* Hero Banner / Restaurant Story */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-zinc-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
          alt="Restaurant Story Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-20 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ESTABLISHED IN {about.sinceYear}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100 leading-tight">
            Our Story & Heritage
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed font-sans font-light">
            "{about.ourStory}"
          </p>

          {/* Direct Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`tel:${about.contactPhone}`}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>

            <a
              href={about.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-amber-500/50 text-amber-300 font-bold text-xs transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Get Directions</span>
            </a>

            <a
              href={about.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-pink-500/40 hover:border-pink-500 text-pink-300 font-bold text-xs transition-all flex items-center gap-2"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram Profile</span>
            </a>
          </div>
        </div>
      </div>

      {/* Meet Our Master Chef Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl group">
            <img
              src={about.chefImage}
              alt={about.chefName}
              className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/80 backdrop-blur-md p-4 rounded-xl border border-amber-500/30">
              <p className="font-serif font-bold text-amber-200 text-lg">{about.chefName}</p>
              <p className="text-[11px] text-amber-400 font-mono">{about.chefTitle}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Utensils className="w-4 h-4" />
            <span>Culinary Leadership</span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-amber-100">Our Executive Chef</h2>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            {about.chefBio}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
              <h4 className="font-serif text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" /> Our Mission
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{about.mission}</p>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1">
              <h4 className="font-serif text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" /> Our Vision
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{about.vision}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Awards & Achievements Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-amber-100">Awards & Achievements</h2>
          <p className="text-xs text-zinc-400 mt-1">Recognized by premier culinary guides and food critiques</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {about.awards.map((award) => (
            <div
              key={award.id}
              className="bg-zinc-900/90 border border-amber-500/20 rounded-2xl p-5 text-center space-y-2 hover:border-amber-500/50 transition-all shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-amber-200 text-sm">{award.title}</h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                {award.issuer} • <span className="text-amber-400">{award.year}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurant Gallery Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-amber-100">Restaurant Gallery & Moments</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Explore our woodfired oven hall, wine vault, and signature dishes</p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
            {(['all', 'ambiance', 'dishes', 'chef', 'events'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedGalleryCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                  selectedGalleryCategory === cat
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredGallery.map((img) => (
            <div
              key={img.id}
              onClick={() => setActiveLightboxImage(img)}
              className="group relative h-64 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 cursor-pointer shadow-xl"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <p className="font-serif font-bold text-amber-100 text-sm truncate">{img.title}</p>
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-mono">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opening Hours & Location Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Opening Hours</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-amber-100">Dining Room Operating Hours</h3>

          <div className="space-y-2 text-xs text-zinc-300 font-mono">
            {about.openingHours.map((oh, idx) => (
              <div key={idx} className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">{oh.days}</span>
                <span className="text-amber-300 font-bold">{oh.hours}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Location & Reservations</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-amber-100">Find Us & Connect</h3>

          <div className="space-y-2 text-xs text-zinc-300">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{about.address}</span>
            </p>
            <p className="flex items-center gap-2 font-mono">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{about.contactPhone}</span>
            </p>
          </div>

          <div className="pt-2">
            <a
              href={about.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold"
            >
              <span>Open in Google Maps</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
