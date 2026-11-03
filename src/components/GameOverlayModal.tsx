import React from 'react';
import { Flame, KeyRound, RotateCcw, Sparkles, Clock, Award, Skull } from 'lucide-react';

export type DifficultyMode = 'story' | 'classic' | 'nightmare';

interface GameOverlayModalProps {
  gameState: 'title' | 'playing' | 'victory' | 'gameover';
  difficulty: DifficultyMode;
  onSelectDifficulty: (diff: DifficultyMode) => void;
  onStartGame: () => void;
  candleLife: number;
  matchesLeft: number;
  elapsedSeconds: number;
  cluesCount: number;
}

export const GameOverlayModal: React.FC<GameOverlayModalProps> = ({
  gameState,
  difficulty,
  onSelectDifficulty,
  onStartGame,
  candleLife,
  matchesLeft,
  elapsedSeconds,
  cluesCount,
}) => {
  if (gameState === 'playing') return null;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}m ${rem < 10 ? '0' : ''}${rem}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070609]/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-[#1E1722] via-[#151018] to-[#0D0A10] border-2 border-[#FF8C28]/45 shadow-[0_24px_80px_rgba(0,0,0,0.98),0_0_55px_rgba(255,122,0,0.22)] p-6 sm:p-8 text-center">
        {/* Decorative Corner Flourishes */}
        <div className="pointer-events-none absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#FFD166]/45" />
        <div className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#FFD166]/45" />
        <div className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#FFD166]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#FFD166]/45" />

        {/* =============================================================== */}
        {/* 1. TITLE SCREEN                                                 */}
        {/* =============================================================== */}
        {gameState === 'title' && (
          <div className="space-y-5">
            {/* Glowing Courge Emblem */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#FF7A00]/25 blur-xl animate-pulse" />
              <svg viewBox="0 0 80 80" className="w-20 h-20 relative z-10">
                <path d="M 28 14 C 28 4, 52 4, 52 14" fill="none" stroke="#FFD166" strokeWidth="2.5" />
                <ellipse cx="40" cy="46" rx="26" ry="22" fill="#D94E1F" stroke="#FFD166" strokeWidth="2" />
                <ellipse cx="40" cy="46" rx="16" ry="22" fill="#9E2A2B" opacity="0.45" />
                <polygon points="28,40 34,33 36,42" fill="#FFD166" />
                <polygon points="44,42 46,33 52,40" fill="#FFD166" />
                <path
                  d="M 27 52 Q 40 61 53 52 Q 46 56 40 56 Q 34 56 27 52 Z"
                  fill="#FFD166"
                />
              </svg>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[#FF7A00] font-semibold mb-1">
                Manoir de Valombre • Nuit d’Halloween 1894
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-[#FFD166] tracking-wider drop-shadow-[0_2px_16px_rgba(255,122,0,0.45)]">
                La Lanterne de Courge
              </h1>
            </div>

            <p className="text-[#EFE6D5]/90 text-base sm:text-lg leading-relaxed font-serif-literary max-w-md mx-auto">
              La lourde porte du Grand Salon s’est refermée derrière vous. Votre unique alliée dans
              les ténèbres est une <span className="text-[#FFD166] font-semibold">lanterne creusée dans une courge</span>,
              dont la bougie de suif fond inexorablement.
            </p>

            {/* How to Play Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left bg-[#110E14]/90 p-3.5 rounded-xl border border-[#FF8C28]/25 text-xs">
              <div className="flex items-start gap-2">
                <Flame className="w-4 h-4 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#FFD166]">Éclairez le Salon</div>
                  <div className="text-[#A69580]">
                    Promenez votre lanterne pour révéler les objets et les 3 chiffres spectraux.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#3E8E7E] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#FFD166]">Trouvez les Allumettes</div>
                  <div className="text-[#A69580]">
                    Récoltez les allumettes soufrées et la cire pour raviver votre flamme.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <KeyRound className="w-4 h-4 text-[#D94E1F] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#FFD166]">La Clé de la Sortie</div>
                  <div className="text-[#A69580]">
                    Résolvez la chaîne d’énigmes du Comte pour ouvrir la porte de chêne.
                  </div>
                </div>
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-[#A69580]">
                Vitesse de Fonte de la Bougie
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'story' as DifficultyMode,
                    title: 'Conte Gothique',
                    desc: 'Fonte douce • Idéal pour explorer',
                  },
                  {
                    id: 'classic' as DifficultyMode,
                    title: 'Valombre',
                    desc: 'Équilibre classique tendu',
                  },
                  {
                    id: 'nightmare' as DifficultyMode,
                    title: 'Cauchemar',
                    desc: 'Bougie rapide • Courants d’air',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onSelectDifficulty(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      difficulty === opt.id
                        ? 'bg-[#FF7A00]/20 border-[#FFD166] shadow-[0_0_15px_rgba(255,122,0,0.3)]'
                        : 'bg-[#110E14]/70 border-[#5E5246]/35 hover:border-[#FF8C28]/50'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#FFD166]">{opt.title}</div>
                    <div className="text-[11px] text-[#A69580] mt-0.5 leading-tight">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onStartGame}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D94E1F] via-[#FF7A00] to-[#FFD166] hover:brightness-110 text-[#070609] font-display font-bold text-base sm:text-lg tracking-wider shadow-[0_0_28px_rgba(255,122,0,0.55)] transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Flame className="w-5 h-5 fill-current" />
              <span>Allumer la Lanterne & Explorer</span>
            </button>
          </div>
        )}

        {/* =============================================================== */}
        {/* 2. VICTORY SCREEN                                               */}
        {/* =============================================================== */}
        {gameState === 'victory' && (
          <div className="space-y-5">
            <div className="mx-auto w-20 h-20 rounded-full bg-[#3E8E7E]/20 border-2 border-[#3E8E7E] flex items-center justify-center shadow-[0_0_30px_rgba(62,142,126,0.5)]">
              <Award className="w-10 h-10 text-[#FFD166]" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[#3E8E7E] font-bold mb-1">
                Évasion Réussie • Nuit de la Toussaint
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-[#FFD166] tracking-wider">
                La Lourde Porte de Chêne Cède !
              </h1>
            </div>

            <p className="text-[#EFE6D5]/95 text-base sm:text-lg leading-relaxed font-serif-literary">
              Dans un grincement de gonds centenaires, la Clé Maîtresse fait sauter le pêne de fer.
              L’air frais d’octobre s’engouffre dans le salon tandis que vous franchissez le seuil du
              Manoir de Valombre, votre Lanterne de Courge encore tiède au creux de la main.
            </p>

            {/* Victory Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#110E14] border border-[#FF8C28]/30">
              <div>
                <div className="text-xs text-[#A69580]">Cire Restante</div>
                <div className="font-mono-code text-xl font-bold text-[#FFD166] mt-0.5">
                  {Math.round(candleLife)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-[#A69580]">Allumettes</div>
                <div className="font-mono-code text-xl font-bold text-[#FF7A00] mt-0.5">
                  {matchesLeft}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#A69580]">Temps d’Évasion</div>
                <div className="font-mono-code text-xl font-bold text-[#3E8E7E] mt-0.5 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(elapsedSeconds)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onStartGame}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D94E1F] to-[#FF7A00] hover:from-[#FF7A00] hover:to-[#FFD166] text-[#070609] font-display font-bold text-base tracking-wider shadow-[0_0_24px_rgba(255,122,0,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Rejouer une Nouvelle Nuit</span>
            </button>
          </div>
        )}

        {/* =============================================================== */}
        {/* 3. GAME OVER SCREEN                                             */}
        {/* =============================================================== */}
        {gameState === 'gameover' && (
          <div className="space-y-5">
            <div className="mx-auto w-20 h-20 rounded-full bg-[#9E2A2B]/25 border-2 border-[#9E2A2B] flex items-center justify-center shadow-[0_0_30px_rgba(158,42,43,0.65)]">
              <Skull className="w-10 h-10 text-[#D94E1F]" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[#D94E1F] font-bold mb-1">
                La Bougie S’est Consumée
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-[#EFE6D5] tracking-wider">
                Les Ténèbres Ont Triomphé
              </h1>
            </div>

            <p className="text-[#A69580] text-base sm:text-lg leading-relaxed font-serif-literary">
              La dernière goutte de suif s’est figée au fond de la courge creusée. Sans allumette
              pour raviver la mèche, les ombres glacées du Comte Malakor referment leur étreinte sur
              le Grand Salon...
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#110E14] border border-[#9E2A2B]/40">
              <div>
                <div className="text-xs text-[#A69580]">Chiffres Spectraux</div>
                <div className="font-mono-code text-lg font-bold text-[#3E8E7E] mt-0.5">
                  {cluesCount} / 3
                </div>
              </div>
              <div>
                <div className="text-xs text-[#A69580]">Survie dans le Salon</div>
                <div className="font-mono-code text-lg font-bold text-[#EFE6D5] mt-0.5">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>
            </div>

            <button
              onClick={onStartGame}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#9E2A2B] via-[#D94E1F] to-[#FF7A00] hover:brightness-110 text-[#070609] font-display font-bold text-base tracking-wider shadow-[0_0_24px_rgba(217,78,31,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5 fill-current" />
              <span>Rallumer une Nouvelle Bougie (Réessayer)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
