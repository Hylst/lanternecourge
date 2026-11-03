import React from 'react';
import {
  HotspotId,
  HOTSPOTS_META,
  INVENTORY_CATALOG,
  ItemId,
} from '../data/manorData';
import { ItemIcon } from './ItemIcon';
import { Sparkles, HelpCircle, Compass, CheckCircle2 } from 'lucide-react';

export interface NarrativeChoice {
  id: string;
  label: string;
  highlight?: 'amber' | 'verdigris' | 'crimson' | 'default';
  onClick: () => void;
}

interface NarrativeLedgerDockProps {
  activeHotspot: HotspotId | null;
  narrativeTitle: string;
  narrativeText: string;
  narrativeSubtext?: string | null;
  choices: NarrativeChoice[];
  inventory: ItemId[];
  selectedItem: ItemId | null;
  onSelectItem: (item: ItemId | null) => void;
  onRequestHint: () => void;
  onQuickTravelHotspot: (id: HotspotId) => void;
  visitedHotspots: HotspotId[];
}

export const NarrativeLedgerDock: React.FC<NarrativeLedgerDockProps> = ({
  activeHotspot,
  narrativeTitle,
  narrativeText,
  narrativeSubtext,
  choices,
  inventory,
  selectedItem,
  onSelectItem,
  onRequestHint,
  onQuickTravelHotspot,
  visitedHotspots,
}) => {
  const allPossibleSlots: ItemId[] = [
    'tisonnier',
    'cle_argent',
    'cle_horloger',
    'feuillet_code',
    'medaillon_corbeau',
    'cle_sortie',
  ];

  return (
    <div className="relative z-30 w-full h-[230px] sm:h-[240px] bg-gradient-to-t from-[#0D0A10] via-[#161119]/98 to-[#1C161E]/95 border-t-2 border-[#FF8C28]/35 shadow-[0_-16px_42px_rgba(0,0,0,0.92)] px-4 sm:px-6 py-3 flex flex-col justify-between">
      <div className="max-w-7xl w-full mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEFT / CENTER COLUMN: NARRATIVE LEDGER & INTERACTIVE CHOICES (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#110E14]/85 rounded-xl border border-[#FF8C28]/25 p-3.5 sm:px-5 sm:py-3.5 overflow-y-auto">
          <div>
            {/* Header Bar with Hotspot Title & Hint Button */}
            <div className="flex items-center justify-between gap-2 border-b border-[#FF8C28]/20 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#FF7A00] flex-shrink-0" />
                <h2 className="font-display text-sm sm:text-base text-[#FFD166] tracking-wider uppercase">
                  {narrativeTitle}
                </h2>
              </div>

              <button
                onClick={onRequestHint}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#3E8E7E]/15 hover:bg-[#3E8E7E]/30 border border-[#3E8E7E]/45 text-[#8FE3D3] text-xs font-medium transition-colors cursor-pointer"
                title="Demander un indice au murmure de la lanterne"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Murmure d’Indice</span>
              </button>
            </div>

            {/* Literary Narrative Passage */}
            <p className="gothic-dropcap text-[#EFE6D5] text-base sm:text-[17.5px] leading-[1.58] font-serif-literary max-w-[68ch]">
              {narrativeText}
            </p>

            {narrativeSubtext && (
              <p className="mt-2 text-sm italic text-[#FFD166]/90 font-serif-literary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0" />
                <span>{narrativeSubtext}</span>
              </p>
            )}
          </div>

          {/* Interactive Action Choices + Quick Room Bar */}
          <div className="mt-3 pt-2 border-t border-[#FF8C28]/15 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {choices.map((choice) => {
                const styleClass =
                  choice.highlight === 'amber'
                    ? 'bg-gradient-to-r from-[#D94E1F] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#FFD166] text-[#070609] font-bold shadow-[0_0_15px_rgba(255,122,0,0.45)]'
                    : choice.highlight === 'verdigris'
                    ? 'bg-[#3E8E7E]/25 hover:bg-[#3E8E7E]/40 text-[#8FE3D3] border border-[#3E8E7E]/60 font-semibold'
                    : choice.highlight === 'crimson'
                    ? 'bg-[#9E2A2B]/30 hover:bg-[#9E2A2B]/50 text-[#FFD166] border border-[#9E2A2B]/70'
                    : 'bg-[#1C161E] hover:bg-[#FF7A00]/20 text-[#EFE6D5] border border-[#FF8C28]/35';

                return (
                  <button
                    key={choice.id}
                    onClick={choice.onClick}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${styleClass}`}
                  >
                    <span>❖</span>
                    <span>{choice.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Exploration Pills for accessibility & text-adventure players */}
            <div className="hidden xl:flex items-center gap-1 ml-auto">
              {HOTSPOTS_META.map((spot) => {
                const isVisited = visitedHotspots.includes(spot.id);
                const isCurrent = activeHotspot === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => onQuickTravelHotspot(spot.id)}
                    title={`Examiner : ${spot.title}`}
                    className={`px-2 py-0.5 rounded text-[11px] transition-all cursor-pointer border ${
                      isCurrent
                        ? 'bg-[#FF7A00]/30 border-[#FFD166] text-[#FFD166] font-semibold'
                        : isVisited
                        ? 'bg-[#1C161E]/80 border-[#5E5246]/40 text-[#A69580] hover:text-[#EFE6D5]'
                        : 'bg-[#070609]/60 border-[#FF8C28]/25 text-[#EFE6D5]/80 hover:border-[#FF7A00]'
                    }`}
                  >
                    {spot.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LA SACOCHE D'INVENTAIRE (4 Cols, 6 Slots) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-between bg-[#110E14]/85 rounded-xl border border-[#FF8C28]/25 p-3.5">
          <div className="flex items-center justify-between border-b border-[#FF8C28]/20 pb-1.5">
            <span className="font-display text-xs uppercase tracking-widest text-[#FFD166]">
              Sacoche d’Exploration ({inventory.length}/6)
            </span>
            {selectedItem && (
              <button
                onClick={() => onSelectItem(null)}
                className="text-[11px] text-[#FF7A00] hover:underline cursor-pointer"
              >
                Désélectionner
              </button>
            )}
          </div>

          {/* 6 Diegetic Inventory Slots */}
          <div className="grid grid-cols-6 gap-2 my-2">
            {allPossibleSlots.map((slotId) => {
              const owned = inventory.includes(slotId);
              const isSelected = selectedItem === slotId;
              const itemMeta = INVENTORY_CATALOG[slotId];

              return (
                <button
                  key={slotId}
                  disabled={!owned}
                  onClick={() => {
                    if (!owned) return;
                    onSelectItem(isSelected ? null : slotId);
                  }}
                  title={owned ? `${itemMeta.name}  :  ${itemMeta.usageHint}` : 'Emplacement vide'}
                  className={`relative aspect-square rounded-lg flex flex-col items-center justify-center p-1.5 transition-all ${
                    !owned
                      ? 'bg-[#070609]/60 border border-[#5E5246]/25 opacity-40 cursor-default'
                      : isSelected
                      ? 'bg-[#FF7A00]/25 border-2 border-[#FFD166] shadow-[0_0_14px_rgba(255,209,102,0.55)] scale-105 cursor-pointer'
                      : 'bg-[#1C161E] hover:bg-[#FF7A00]/15 border border-[#FF8C28]/45 cursor-pointer'
                  }`}
                >
                  {owned ? (
                    <>
                      <ItemIcon itemId={slotId} className="w-7 h-7" />
                      {isSelected && (
                        <CheckCircle2 className="w-3 h-3 text-[#FFD166] absolute top-1 right-1" />
                      )}
                    </>
                  ) : (
                    <span className="text-[#5E5246] text-xs font-mono-code">•</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Item Inspector Footer */}
          <div className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#070609]/80 border border-[#FF8C28]/20 flex flex-col justify-center">
            {selectedItem ? (
              <div>
                <div className="text-xs font-bold text-[#FFD166] truncate">
                  {INVENTORY_CATALOG[selectedItem].name}
                </div>
                <div className="text-[11px] text-[#A69580] truncate">
                  {INVENTORY_CATALOG[selectedItem].usageHint}
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-[#A69580] italic">
                Cliquez sur un objet dans la pièce ou sélectionnez un outil de votre sacoche.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
