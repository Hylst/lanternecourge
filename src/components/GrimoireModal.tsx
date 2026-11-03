import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { GRIMOIRE_PAGES, RoomFlags } from '../data/manorData';
import { soundEngine } from '../utils/soundEngine';

interface GrimoireModalProps {
  isOpen: boolean;
  onClose: () => void;
  flags: RoomFlags;
}

export const GrimoireModal: React.FC<GrimoireModalProps> = ({ isOpen, onClose, flags }) => {
  const [pageIdx, setPageIdx] = useState(0);

  if (!isOpen) return null;

  const page = GRIMOIRE_PAGES[pageIdx];

  const handlePageChange = (newIdx: number) => {
    soundEngine.playClickObject();
    setPageIdx(newIdx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070609]/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#1C161E] border-2 border-[#FF8C28]/45 shadow-[0_24px_64px_rgba(0,0,0,0.95),0_0_40px_rgba(255,122,0,0.18)] overflow-hidden">
        {/* Top Ornamental Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#110E14] border-b border-[#FF8C28]/25">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#FF7A00]" />
            <h2 className="font-display text-lg sm:text-xl text-[#FFD166] tracking-wider">
              Le Grimoire du Comte Malakor
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playClickObject();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#1C161E] hover:bg-[#D94E1F]/25 text-[#A69580] hover:text-[#EFE6D5] border border-[#FF8C28]/25 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parchment Content Body */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-[#231B24] via-[#1C161E] to-[#151018]">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.15em] text-[#A69580] mb-2">
            <span>{page.pageNumber}</span>
            <span className="text-[#FF7A00] font-semibold">{page.date}</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl text-[#EFE6D5] border-b border-[#FF8C28]/20 pb-3 mb-4">
            {page.title}
          </h3>

          <div className="space-y-4 text-[#EFE6D5]/95 text-base sm:text-lg leading-relaxed font-serif-literary">
            {page.body.map((paragraph, i) => (
              <p key={i} className={i === 0 ? 'gothic-dropcap' : 'italic text-[#EFE6D5]/85'}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Sketch / Clue Box */}
          <div className="mt-6 p-4 rounded-xl bg-[#110E14]/90 border border-[#FF8C28]/30 flex flex-col gap-3">
            <div className="text-xs uppercase tracking-widest text-[#FFD166] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3E8E7E]" />
              <span>{page.sketchCaption}</span>
            </div>

            {/* Live Tracker of Discovered Spectral Runes */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-[#1C161E] border border-[#3E8E7E]/35 text-center">
                <div className="text-xs text-[#A69580]">1° Lune (Portrait)</div>
                <div className="font-mono-code text-lg font-bold text-[#3E8E7E] mt-0.5">
                  ☽ = {flags.portraitRuneSeen ? '7' : '?'}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1C161E] border border-[#3E8E7E]/35 text-center">
                <div className="text-xs text-[#A69580]">2° Plume (Fenêtre)</div>
                <div className="font-mono-code text-lg font-bold text-[#3E8E7E] mt-0.5">
                  🪶 = {flags.windowRuneSeen ? '3' : '?'}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1C161E] border border-[#3E8E7E]/35 text-center">
                <div className="text-xs text-[#A69580]">3° Crâne (Étagère)</div>
                <div className="font-mono-code text-lg font-bold text-[#3E8E7E] mt-0.5">
                  💀 = {flags.skullRuneSeen ? '9' : '?'}
                </div>
              </div>
            </div>
          </div>

          {/* Page Navigation Controls */}
          <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#FF8C28]/20">
            <button
              onClick={() => handlePageChange(Math.max(0, pageIdx - 1))}
              disabled={pageIdx === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                pageIdx === 0
                  ? 'opacity-35 cursor-not-allowed text-[#5E5246]'
                  : 'bg-[#110E14] hover:bg-[#FF7A00]/20 text-[#FFD166] border border-[#FF8C28]/35'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Feuillet précédent</span>
            </button>

            <div className="flex items-center gap-2">
              {GRIMOIRE_PAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === pageIdx ? 'bg-[#FF7A00] scale-125' : 'bg-[#5E5246]/50 hover:bg-[#A69580]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(GRIMOIRE_PAGES.length - 1, pageIdx + 1))}
              disabled={pageIdx === GRIMOIRE_PAGES.length - 1}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                pageIdx === GRIMOIRE_PAGES.length - 1
                  ? 'opacity-35 cursor-not-allowed text-[#5E5246]'
                  : 'bg-[#110E14] hover:bg-[#FF7A00]/20 text-[#FFD166] border border-[#FF8C28]/35'
              }`}
            >
              <span>Feuillet suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
