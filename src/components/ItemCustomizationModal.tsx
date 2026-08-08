import React, { useState } from 'react';
import { X, Plus, Minus, Flame, Sparkles } from 'lucide-react';
import { MenuItem, SelectedCustomization } from '../types';

interface ItemCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    customizations: SelectedCustomization[],
    unitPrice: number
  ) => void;
}

export const ItemCustomizationModal: React.FC<ItemCustomizationModalProps> = ({
  isOpen,
  onClose,
  item,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState(1);
  type OptionType = { id: string; name: string; price: number };
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, OptionType[]>>({});

  const handleOptionToggle = (
    groupId: string,
    _groupName: string,
    option: OptionType,
    required?: boolean
  ) => {
    setSelectedCustomizations((prev) => {
      const currentList: OptionType[] = prev[groupId] || [];
      if (required) {
        // Single selection for required groups (e.g. crust/spice level)
        return {
          ...prev,
          [groupId]: [option],
        };
      } else {
        // Multi selection for add-ons/extra cheese
        const exists = currentList.some((o) => o.id === option.id);
        if (exists) {
          return {
            ...prev,
            [groupId]: currentList.filter((o) => o.id !== option.id),
          };
        } else {
          return {
            ...prev,
            [groupId]: [...currentList, option],
          };
        }
      }
    });
  };

  // Calculate total extra price per unit
  let extraUnitPrice = 0;
  Object.values(selectedCustomizations).forEach((opts: OptionType[]) => {
    opts.forEach((o) => {
      extraUnitPrice += o.price;
    });
  });

  const finalUnitPrice = item.price + extraUnitPrice;
  const totalPrice = finalUnitPrice * quantity;

  const handleConfirmAddToCart = () => {
    const formattedCustomizations: SelectedCustomization[] = Object.entries(selectedCustomizations).map(
      ([groupId, opts]: [string, OptionType[]]) => {
        const group = item.customizationGroups?.find((g) => g.id === groupId);
        return {
          groupId,
          groupName: group?.name || 'Options',
          selectedOptions: opts,
        };
      }
    );

    onAddToCart(item, quantity, formattedCustomizations, finalUnitPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 text-zinc-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Header */}
        <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-zinc-800">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  item.isVeg
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}
              >
                {item.isVeg ? 'Veg 🌱' : 'Non-Veg 🍗'}
              </span>
              {item.isSpicy && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Spicy
                </span>
              )}
            </div>
            <h3 className="font-serif text-xl font-bold text-amber-100">{item.name}</h3>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-4">{item.description}</p>

        {/* Customization Options */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
          {item.customizationGroups && item.customizationGroups.length > 0 ? (
            item.customizationGroups.map((group) => (
              <div key={group.id} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    {group.name}
                  </h4>
                  {group.required && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                      Required
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {group.options.map((opt) => {
                    const isSelected = (selectedCustomizations[group.id] || []).some((o) => o.id === opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleOptionToggle(group.id, group.name, opt, group.required)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-100'
                            : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-amber-500/40'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-amber-400 border-amber-400' : 'border-zinc-600'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                          </span>
                          {opt.name}
                        </span>
                        <span className="font-mono text-amber-400 font-semibold">
                          {opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center text-xs text-zinc-400">
              No extra customizations needed for this dish. Ready to order!
            </div>
          )}
        </div>

        {/* Bottom Quantity & Add Button */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold font-mono text-sm text-amber-200">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleConfirmAddToCart}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Add to Table Cart
            </span>
            <span className="font-mono text-sm">${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
