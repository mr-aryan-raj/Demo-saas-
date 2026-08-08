import React from 'react';
import { QrCode, X, Check, Users, ShieldAlert } from 'lucide-react';
import { Table } from '../types';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
  currentTable: Table | null;
  onSelectTable: (table: Table) => void;
}

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({
  isOpen,
  onClose,
  tables,
  currentTable,
  onSelectTable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl p-6 text-zinc-100 overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-100">Simulate QR Table Scan</h3>
              <p className="text-xs text-zinc-400">Select a table to test table-specific QR ordering flow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-5 text-xs text-amber-300/90 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p>
            In production, scanning the table QR sticker automatically detects the restaurant ID and table number (e.g. <code className="bg-zinc-950 px-1 py-0.5 rounded border border-amber-500/30 text-amber-400 font-mono">dineflow.com/table/05</code>).
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
          {tables.map((table) => {
            const isSelected = currentTable?.id === table.id;
            return (
              <button
                key={table.id}
                onClick={() => {
                  onSelectTable(table);
                  onClose();
                }}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center group ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 text-amber-100 ring-1 ring-amber-400'
                    : 'bg-zinc-800/80 border-zinc-700/80 hover:border-amber-500/50 hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <span className="text-2xl font-serif font-bold text-amber-200 group-hover:scale-110 transition-transform">
                  #{table.tableNumber}
                </span>
                <span className="text-xs font-medium text-zinc-400 mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {table.seats} Seats
                </span>

                <span
                  className={`mt-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    table.status === 'available'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : table.status === 'occupied'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {table.status}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors"
          >
            Confirm Active Table
          </button>
        </div>
      </div>
    </div>
  );
};
