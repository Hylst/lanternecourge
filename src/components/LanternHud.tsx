import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

interface LanternHudProps {
  candleLife: number;
  matches: number;
  isBlackout: boolean;
  graceSeconds: number;
  onStrikeMatch: () => void;
  cluesFoundCount: number;
}

export const LanternHud: React.FC<LanternHudProps> = ({
  candleLife,
  matches,
  isBlackout,
  graceSeconds,
  onStrikeMatch,
  cluesFoundCount,
}) => {
  const roundedCandle = Math.max(0, Math.round(candleLife));
  const isLow = candleLife > 0 && candleLife <= 25;

  return (
    <div className="fixed top-3 left-3 z-30 flex items-start gap-3 pointer-events-auto">
      {/* Main Carved Courge & Melting Candle Card */}
      <div
        className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl backdrop-blur-md border transition-all duration-300 ${
          isBlackout
            ? 'bg-[#1a090a]/95 border-[#9E2A2B] shadow-[0_0_25px_rgba(158,42,43,0.65)]'
            : isLow
            ? 'bg-[#1C161E]/90 border-[#D94E1F]/70 shadow-[0_0_18px_rgba(217,78,31,0.35)]'
            : 'bg-[#1C161E]/88 border-[#FF8C28]/30 shadow-[0_12px_32px_rgba(0,0,0,0.85)]'
        }`}
      >
        {/* Illustrated Courge Lantern & Dynamic Melting Candle SVG */}
        <div className="relative w-14 h-16 flex-shrink-0 flex items-center justify-center">
          {/* Warm radial glow behind lantern */}
          {!isBlackout && (
            <div
              className="absolute inset-0 rounded-full blur-md transition-all duration-500"
              style={{
                background: `radial-gradient(circle, rgba(255,140,40,${0.18 + (candleLife / 100) * 0.45}) 0%, transparent 72%)`,
              }}
            />
          )}

          <svg viewBox="0 0 80 96" className="w-full h-full overflow-visible">
            {/* Brass hanging ring & handle */}
            <path
              d="M 26 16 C 26 3, 54 3, 54 16"
              fill="none"
              stroke="#B8860B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Lantern top cap */}
            <path
              d="M 24 18 L 56 18 L 50 24 L 30 24 Z"
              fill="#2A211B"
              stroke="#D97724"
              strokeWidth="1.2"
            />

            {/* Carved Pumpkin / Courge Ribbed Body */}
            <ellipse
              cx="40"
              cy="56"
              rx="28"
              ry="26"
              fill="#3A180C"
              stroke="#D94E1F"
              strokeWidth="1.8"
            />
            <ellipse
              cx="40"
              cy="56"
              rx="20"
              ry="26"
              fill="#2B1007"
              stroke="#8A3013"
              strokeWidth="1"
            />
            {/* Inner hollow chamber of the gourd */}
            <ellipse
              cx="40"
              cy="57"
              rx="16"
              ry="20"
              fill="#090608"
              stroke="#5C220E"
              strokeWidth="1"
            />

            {/* Dynamic Melting Wax Pillar inside the gourd */}
            {(() => {
              const maxCandleHeight = 22;
              const currentHeight = Math.max(2, (candleLife / 100) * maxCandleHeight);
              const candleY = 75 - currentHeight;
              const flameY = candleY - 3;

              return (
                <g>
                  {/* Wax base pool */}
                  <ellipse cx="40" cy="75" rx="11" ry="2.5" fill="#E6D5B8" opacity="0.85" />

                  {/* Candle Wax Body */}
                  <rect
                    x="35"
                    y={candleY}
                    width="10"
                    height={currentHeight}
                    rx="2"
                    fill="#F3E5AB"
                    stroke="#C5A880"
                    strokeWidth="0.8"
                  />

                  {/* Wax drips on the side */}
                  <path
                    d={`M 35 ${candleY + 1} Q 33 ${candleY + 6} 34.5 ${candleY + 9}`}
                    stroke="#FFF3D1"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M 45 ${candleY + 2} Q 46.5 ${candleY + 5} 45.5 ${candleY + 8}`}
                    stroke="#FFF3D1"
                    strokeWidth="1.3"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Candle Wick */}
                  <line
                    x1="40"
                    y1={candleY}
                    x2="40"
                    y2={candleY - 3.5}
                    stroke="#2A201D"
                    strokeWidth="1.4"
                  />

                  {/* Animated Flame (if candleLife > 0) */}
                  {!isBlackout ? (
                    <g className="animate-candle-flicker" style={{ transformOrigin: `40px ${flameY}px` }}>
                      {/* Outer halo */}
                      <circle
                        cx="40"
                        cy={flameY - 5}
                        r={6 + (candleLife / 100) * 6}
                        fill="#FF7A00"
                        opacity="0.35"
                      />
                      {/* Outer teardrop flame */}
                      <path
                        d={`M 40 ${flameY - 14 - (candleLife / 100) * 4} C 46 ${flameY - 6}, 45 ${flameY}, 40 ${flameY} C 35 ${flameY}, 34 ${flameY - 6}, 40 ${flameY - 14 - (candleLife / 100) * 4} Z`}
                        fill={isLow ? '#D94E1F' : '#FF7A00'}
                      />
                      {/* Inner bright core */}
                      <path
                        d={`M 40 ${flameY - 9 - (candleLife / 100) * 2} C 43 ${flameY - 4}, 42.5 ${flameY - 1}, 40 ${flameY - 1} C 37.5 ${flameY - 1}, 37 ${flameY - 4}, 40 ${flameY - 9 - (candleLife / 100) * 2} Z`}
                        fill="#FFD166"
                      />
                    </g>
                  ) : (
                    /* Red dying ember + smoke wisp when out */
                    <g>
                      <circle cx="40" cy={candleY - 3} r="2" fill="#9E2A2B" />
                      <path
                        d={`M 40 ${candleY - 5} Q 36 ${candleY - 14} 42 ${candleY - 22}`}
                        stroke="#A69580"
                        strokeWidth="1.2"
                        fill="none"
                        strokeDasharray="2 2"
                        opacity="0.6"
                      />
                    </g>
                  )}
                </g>
              );
            })()}

            {/* Carved Jack-o'-lantern rim silhouettes on sides */}
            <path
              d="M 16 48 L 22 44 L 21 53 Z"
              fill={isBlackout ? '#180E0B' : '#FF7A00'}
              opacity={isBlackout ? 0.5 : 0.75}
            />
            <path
              d="M 64 48 L 58 44 L 59 53 Z"
              fill={isBlackout ? '#180E0B' : '#FF7A00'}
              opacity={isBlackout ? 0.5 : 0.75}
            />

            {/* Lantern brass base */}
            <rect
              x="25"
              y="80"
              width="30"
              height="5"
              rx="2"
              fill="#2A211B"
              stroke="#B8860B"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* Status Info & Match Strike Action */}
        <div className="flex flex-col min-w-[175px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#A69580] font-semibold">
              Lanterne de Courge
            </span>
            <span
              className={`font-mono-code text-sm font-bold tabular-nums ${
                isBlackout
                  ? 'text-[#ff4d4f] animate-pulse'
                  : isLow
                  ? 'text-[#D94E1F] animate-pulse'
                  : 'text-[#FFD166]'
              }`}
            >
              {isBlackout ? 'ÉTEINTE' : `${roundedCandle}%`}
            </span>
          </div>

          {/* Wax Progress Bar */}
          <div className="w-full h-2 bg-[#070609] rounded-full overflow-hidden border border-[#FF8C28]/25 my-1.5">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${roundedCandle}%`,
                background: isLow
                  ? 'linear-gradient(90deg, #9E2A2B 0%, #D94E1F 100%)'
                  : 'linear-gradient(90deg, #D94E1F 0%, #FF7A00 60%, #FFD166 100%)',
                boxShadow: '0 0 10px rgba(255, 122, 0, 0.7)',
              }}
            />
          </div>

          {/* Matchbox Counter & Strike Button */}
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <div className="flex items-center gap-1" title="Allumettes soufrées en poche">
              <span className="text-xs text-[#EFE6D5]/90 font-medium">Allumettes :</span>
              <span className="font-mono-code text-xs font-bold px-1.5 py-0.5 rounded bg-[#070609]/90 border border-[#FF8C28]/30 text-[#FFD166]">
                {matches}
              </span>
            </div>

            <button
              onClick={onStrikeMatch}
              disabled={matches <= 0 || candleLife >= 96}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                isBlackout && matches > 0
                  ? 'bg-[#D94E1F] hover:bg-[#FF7A00] text-[#070609] font-bold animate-bounce shadow-[0_0_16px_rgba(255,122,0,0.9)]'
                  : matches > 0 && candleLife < 96
                  ? 'bg-[#FF7A00]/20 hover:bg-[#FF7A00]/35 text-[#FFD166] border border-[#FF7A00]/50 shadow-sm'
                  : 'bg-[#110E14]/60 text-[#5E5246] border border-[#5E5246]/25 cursor-not-allowed'
              }`}
              title={
                matches <= 0
                  ? 'Aucune allumette ! Fouillez le salon pour en trouver.'
                  : candleLife >= 96
                  ? 'La flamme est déjà à son maximum.'
                  : 'Craquer une allumette soufrée (+38% de lumière)'
              }
            >
              <Flame className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>{isBlackout ? `Rallumer (${graceSeconds}s)` : 'Craquer (+38%)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spectral Clues Discovered Badge */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1C161E]/85 backdrop-blur-md border border-[#3E8E7E]/35 shadow-lg text-xs">
        <Sparkles className="w-3.5 h-3.5 text-[#3E8E7E]" />
        <span className="text-[#A69580]">Chiffres Spectraux :</span>
        <span className="font-mono-code font-bold text-[#3E8E7E]">{cluesFoundCount}/3</span>
      </div>
    </div>
  );
};
