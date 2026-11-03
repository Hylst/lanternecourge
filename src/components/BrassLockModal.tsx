import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Lock, Unlock, X, KeyRound, ShieldAlert } from 'lucide-react';
import { RoomFlags } from '../data/manorData';
import { soundEngine } from '../utils/soundEngine';

interface BrassLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  flags: RoomFlags;
  hasMedallion: boolean;
  onPlaceMedallion: () => void;
  onUnlockSuccess: () => void;
}

export const BrassLockModal: React.FC<BrassLockModalProps> = ({
  isOpen,
  onClose,
  flags,
  hasMedallion,
  onPlaceMedallion,
  onUnlockSuccess,
}) => {
  const [dials, setDials] = useState<[number, number, number]>([0, 0, 0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const rotateDial = (index: 0 | 1 | 2, delta: number) => {
    soundEngine.playLockDial();
    setFeedback(null);
    setDials((prev) => {
      const next = [...prev] as [number, number, number];
      next[index] = (next[index] + delta + 10) % 10;
      return next;
    });
  };

  const handleTryUnlock = () => {
    const isCodeCorrect = dials[0] === 7 && dials[1] === 3 && dials[2] === 9;

    if (!flags.medallionPlaced && !hasMedallion) {
      soundEngine.playDoorLocked();
      setFeedback(
        isCodeCorrect
          ? "Le code 7-3-9 est exact ! Mais le sceau octogonal est vide : il vous faut le Médaillon du Corbeau (caché dans l'Horloge Comtoise)."
          : "Le mécanisme est bloqué. Il manque le Médaillon du Corbeau et la bonne combinaison à trois chiffres."
      );
      return;
    }

    if (!flags.medallionPlaced && hasMedallion) {
      onPlaceMedallion();
    }

    if (isCodeCorrect) {
      soundEngine.playUnlockSuccess();
      onUnlockSuccess();
    } else {
      soundEngine.playDoorLocked();
      setFeedback(
        'Les rouleaux de laiton résistent. Éclairez le Portrait (☽), la Fenêtre (🪶) et le Crâne (💀) avec votre lanterne pour lire les trois chiffres.'
      );
    }
  };

  const dialMeta = [
    { symbol: '☽', label: 'Lune (Portrait)', known: flags.portraitRuneSeen ? '7' : '?' },
    { symbol: '🪶', label: 'Plume (Fenêtre)', known: flags.windowRuneSeen ? '3' : '?' },
    { symbol: '💀', label: 'Crâne (Étagère)', known: flags.skullRuneSeen ? '9' : '?' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070609]/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#1C161E] border-2 border-[#D97724]/60 shadow-[0_24px_64px_rgba(0,0,0,0.95),0_0_40px_rgba(255,140,40,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#110E14] border-b border-[#FF8C28]/25">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#FFD166]" />
            <h2 className="font-display text-lg text-[#FFD166] tracking-wider">
              Coffre Reliquaire en Laiton
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

        <div className="p-6 space-y-5">
          {/* Raven Medallion Socket */}
          <div className="p-3.5 rounded-xl bg-[#110E14] border border-[#FF8C28]/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center border ${
                  flags.medallionPlaced
                    ? 'bg-[#3E8E7E]/20 border-[#3E8E7E] text-[#FFD166]'
                    : 'bg-[#070609] border-[#5E5246]/50 text-[#5E5246]'
                }`}
              >
                <span className="text-xl">{flags.medallionPlaced ? '🦅' : '⬡'}</span>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[#A69580]">
                  Empreinte Octogonale
                </div>
                <div className="text-sm font-semibold text-[#EFE6D5]">
                  {flags.medallionPlaced
                    ? 'Médaillon du Corbeau scellé'
                    : hasMedallion
                    ? 'Médaillon du Corbeau en votre possession'
                    : 'Empreinte vide (Cherchez dans l’Horloge)'}
                </div>
              </div>
            </div>

            {!flags.medallionPlaced && hasMedallion && (
              <button
                onClick={() => {
                  soundEngine.playKeyPickup();
                  onPlaceMedallion();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FF7A00] hover:bg-[#FFD166] text-[#070609] font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                Insérer le Médaillon
              </button>
            )}
          </div>

          {/* 3 Rotating Brass Tumblers */}
          <div className="grid grid-cols-3 gap-4">
            {([0, 1, 2] as const).map((idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-b from-[#2A2018] via-[#1A1412] to-[#2A2018] border border-[#D97724]/50 shadow-inner"
              >
                <div className="text-lg mb-0.5">{dialMeta[idx].symbol}</div>
                <div className="text-[11px] text-[#A69580] text-center mb-1.5">
                  {dialMeta[idx].label}
                </div>
                <div className="text-[11px] font-mono-code text-[#3E8E7E] mb-2">
                  Indice vu : {dialMeta[idx].known}
                </div>

                <button
                  onClick={() => rotateDial(idx, 1)}
                  className="w-full py-1.5 flex items-center justify-center rounded-t-lg bg-[#110E14] hover:bg-[#FF7A00]/25 text-[#FFD166] border border-[#D97724]/40 transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>

                <div className="w-full py-3 bg-[#070609] border-x border-[#D97724]/40 text-center font-mono-code text-3xl font-bold text-[#FFD166] tracking-widest shadow-[inset_0_0_12px_rgba(255,122,0,0.25)]">
                  {dials[idx]}
                </div>

                <button
                  onClick={() => rotateDial(idx, -1)}
                  className="w-full py-1.5 flex items-center justify-center rounded-b-lg bg-[#110E14] hover:bg-[#FF7A00]/25 text-[#FFD166] border border-[#D97724]/40 transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Feedback message */}
          {feedback && (
            <div className="p-3 rounded-lg bg-[#9E2A2B]/20 border border-[#9E2A2B]/60 text-xs sm:text-sm text-[#EFE6D5] flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF7A00] flex-shrink-0 mt-0.5" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#110E14] hover:bg-[#110E14]/80 text-[#A69580] text-sm border border-[#5E5246]/40 cursor-pointer"
            >
              Refermer
            </button>

            <button
              onClick={handleTryUnlock}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D94E1F] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#FFD166] text-[#070609] font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(255,122,0,0.45)] transition-all cursor-pointer"
            >
              {flags.safeUnlocked ? <Unlock className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
              <span>Actionner le Loquet de Laiton</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
