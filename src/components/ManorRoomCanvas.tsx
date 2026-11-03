import React, { useState, useRef, useEffect } from 'react';
import { HotspotId, HOTSPOTS_META, ItemId, INVENTORY_CATALOG, RoomFlags } from '../data/manorData';
import { Sparkles, Eye } from 'lucide-react';

interface ManorRoomCanvasProps {
  candleLife: number;
  isBlackout: boolean;
  flags: RoomFlags;
  activeHotspot: HotspotId | null;
  selectedItem: ItemId | null;
  highVisibilityMode: boolean;
  matchFlash: boolean;
  onSelectHotspot: (id: HotspotId) => void;
  onDiscoverRune: (rune: 'portrait' | 'window' | 'skull') => void;
}

export const ManorRoomCanvas: React.FC<ManorRoomCanvasProps> = ({
  candleLife,
  isBlackout,
  flags,
  activeHotspot,
  selectedItem,
  highVisibilityMode,
  matchFlash,
  onSelectHotspot,
  onDiscoverRune,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Pointer position in percentages (0-100) and pixels
  const [pointer, setPointer] = useState<{ x: number; y: number; pxX: number; pxY: number }>({
    x: 48,
    y: 52,
    pxX: 520,
    pxY: 320,
  });
  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotId | null>(null);
  const [flickerOffset, setFlickerOffset] = useState(0);

  // Organic candle flicker loop
  useEffect(() => {
    const interval = setInterval(() => {
      const wave = Math.sin(Date.now() / 160) * 5 + (Math.random() - 0.5) * 6;
      setFlickerOffset(wave);
    }, 75);
    return () => clearInterval(interval);
  }, []);

  // Initialize pointer center on mount/resize
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPointer({
        x: 50,
        y: 52,
        pxX: rect.width * 0.5,
        pxY: rect.height * 0.52,
      });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;
    const x = Math.max(0, Math.min(100, (pxX / rect.width) * 100));
    const y = Math.max(0, Math.min(100, (pxY / rect.height) * 100));

    setPointer({ x, y, pxX, pxY });

    // Check proximity to spectral runes when lantern is lit
    if (!isBlackout && candleLife > 5) {
      const distPortrait = Math.hypot(x - 25, y - 25);
      if (distPortrait < 11 && !flags.portraitRuneSeen) {
        onDiscoverRune('portrait');
      }
      const distWindow = Math.hypot(x - 54, y - 30);
      if (distWindow < 11 && !flags.windowRuneSeen) {
        onDiscoverRune('window');
      }
      const distSkull = Math.hypot(x - 78, y - 25);
      if (distSkull < 11 && !flags.skullRuneSeen) {
        onDiscoverRune('skull');
      }
    }
  };

  // Compute dynamic spotlight radius based on candleLife
  const baseRadius = isBlackout
    ? 36
    : Math.max(85, 85 + (candleLife / 100) * 215 + flickerOffset);

  // Check if a given percentage coordinate is inside the lantern beam
  const isIlluminated = (hx: number, hy: number) => {
    if (highVisibilityMode) return true;
    if (isBlackout) return false;
    const dist = Math.hypot(pointer.x - hx, pointer.y - hy);
    const maxPctDist = 11 + (candleLife / 100) * 18;
    return dist <= maxPctDist;
  };

  const handleHotspotClick = (id: HotspotId, hx: number, hy: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPointer({
        x: hx,
        y: hy,
        pxX: (hx / 100) * rect.width,
        pxY: (hy / 100) * rect.height,
      });
    }
    onSelectHotspot(id);
  };

  const portraitLit = isIlluminated(25, 25);
  const windowLit = isIlluminated(54, 30);
  const skullLit = isIlluminated(78, 25);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full overflow-hidden bg-[#070609] select-none cursor-none"
    >
      {/* ===================================================================== */}
      {/* ILLUSTRATED 19TH-CENTURY HAUNTED FRENCH MANOR PARLOR (SVG SCENE)      */}
      {/* ===================================================================== */}
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover"
      >
        <defs>
          {/* Wallpaper Damask & Wood Gradients */}
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#120E17" />
            <stop offset="65%" stopColor="#1B1420" />
            <stop offset="100%" stopColor="#0E0A11" />
          </linearGradient>

          <linearGradient id="wainscotGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#261A15" />
            <stop offset="50%" stopColor="#1B120E" />
            <stop offset="100%" stopColor="#100A08" />
          </linearGradient>

          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#18100D" />
            <stop offset="45%" stopColor="#231611" />
            <stop offset="100%" stopColor="#0D0807" />
          </linearGradient>

          <radialGradient id="moonlightGrad" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#3E8E7E" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#1E3545" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#070609" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#9E2A2B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Subtle Gothic Wallpaper Pattern */}
          <pattern id="gothicWallpaper" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 40 8 L 48 24 L 40 40 L 32 24 Z M 40 48 L 48 64 L 40 76 L 32 64 Z"
              fill="#271D2E"
              opacity="0.38"
            />
            <circle cx="40" cy="40" r="2" fill="#3A2A42" opacity="0.4" />
          </pattern>
        </defs>

        {/* 1. BACKGROUND WALLS & ARCHITECTURAL STRUCTURE */}
        <rect x="0" y="0" width="1600" height="540" fill="url(#wallGrad)" />
        <rect x="0" y="0" width="1600" height="540" fill="url(#gothicWallpaper)" />

        {/* Crown Molding & Ceiling Beams */}
        <rect x="0" y="0" width="1600" height="32" fill="#0D090C" />
        <line x1="0" y1="32" x2="1600" y2="32" stroke="#3D2B22" strokeWidth="4" />
        {/* Ceiling rafters */}
        {[180, 440, 700, 960, 1220, 1460].map((bx) => (
          <polygon
            key={bx}
            points={`${bx},0 ${bx + 26},0 ${bx + 10},32 ${bx - 16},32`}
            fill="#1D1410"
          />
        ))}

        {/* Gothic Wainscoting (Lower Wall Wood Paneling) */}
        <rect x="0" y="420" width="1600" height="145" fill="url(#wainscotGrad)" stroke="#3B281E" strokeWidth="3" />
        {Array.from({ length: 16 }).map((_, i) => (
          <rect
            key={i}
            x={i * 100 + 12}
            y="436"
            width="76"
            height="112"
            rx="2"
            fill="#160E0B"
            stroke="#332219"
            strokeWidth="2"
          />
        ))}

        {/* Parquet Wooden Floor */}
        <polygon points="0,565 1600,565 1600,900 0,900" fill="url(#floorGrad)" />
        {/* Perspective floorboards */}
        {[100, 260, 420, 580, 740, 900, 1060, 1220, 1380, 1520].map((fx, idx) => (
          <line
            key={idx}
            x1={fx}
            y1="565"
            x2={(fx - 800) * 1.65 + 800}
            y2="900"
            stroke="#110A07"
            strokeWidth="2.5"
          />
        ))}
        {[615, 675, 745, 825].map((fy) => (
          <line key={fy} x1="0" y1={fy} x2="1600" y2={fy} stroke="#140C09" strokeWidth="1.8" />
        ))}

        {/* Cobwebs in upper corners */}
        <g stroke="#6E6259" strokeWidth="1" opacity="0.35" fill="none">
          <path d="M 0 32 L 130 32 M 0 32 L 110 95 M 0 32 L 65 140 M 95 32 Q 80 70 0 110 M 55 32 Q 45 55 0 75" />
          <path d="M 1600 32 L 1460 32 M 1600 32 L 1490 105 M 1600 32 L 1530 155 M 1500 32 Q 1520 80 1600 120" />
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 6: LA FENÊTRE EN OGIVE & LE CORBEAU (Center-Back)             */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('fenetre', 54, 30, e)}
          onMouseEnter={() => setHoveredHotspot('fenetre')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Ambient Moonlight Cone */}
          <ellipse cx="865" cy="290" rx="220" ry="240" fill="url(#moonlightGrad)" />

          {/* Pointed Gothic Arch Window Frame */}
          <path
            d="M 765 415 L 765 195 Q 865 75 965 195 L 965 415 Z"
            fill="#0A131C"
            stroke="#3B2B23"
            strokeWidth="12"
          />
          {/* Night sky & Harvest Moon outside */}
          <circle cx="835" cy="185" r="34" fill="#EFE6D5" opacity="0.82" />
          <circle cx="848" cy="175" r="28" fill="#0A131C" opacity="0.3" />
          {/* Dead autumn tree branches outside */}
          <path
            d="M 960 330 L 895 275 L 855 285 M 895 275 L 875 230 M 770 360 L 820 315"
            stroke="#06080C"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Leaded stained glass mullions */}
          <line x1="865" y1="115" x2="865" y2="415" stroke="#261B16" strokeWidth="6" />
          <line x1="765" y1="265" x2="965" y2="265" stroke="#261B16" strokeWidth="6" />
          <line x1="765" y1="345" x2="965" y2="345" stroke="#261B16" strokeWidth="5" />

          {/* Perched Raven silhouette inside the sill */}
          <g transform="translate(888, 362)">
            <path
              d="M 0 38 C -4 20, 6 6, 18 4 C 28 2, 34 12, 30 28 L 38 44 L 18 40 Z"
              fill="#09080D"
              stroke="#2C2638"
              strokeWidth="1.5"
            />
            {/* Raven beak & gleaming eye */}
            <polygon points="6,10 -8,14 6,17" fill="#4A4238" />
            <circle cx="12" cy="11" r="2.2" fill="#FF7A00" />
          </g>

          {/* Wax piece on window sill (if not taken yet) */}
          {!flags.windowWaxTaken && (
            <g transform="translate(792, 392)">
              <rect x="0" y="0" width="22" height="14" rx="3" fill="#FFD166" stroke="#D97724" strokeWidth="1.5" />
              <circle cx="11" cy="-5" r="4" fill="#FF7A00" opacity="0.8" />
            </g>
          )}

          {/* Stone Window Sill */}
          <rect x="748" y="408" width="234" height="18" rx="3" fill="#2B2329" stroke="#473A44" strokeWidth="2" />

          {/* SPECTRAL RUNE 2: 🪶 = 3 (Visible when lantern illuminates window) */}
          <g
            style={{
              opacity: windowLit ? 0.95 : 0.04,
              transition: 'opacity 0.35s ease',
            }}
          >
            <circle cx="820" cy="305" r="28" fill="#3E8E7E" opacity="0.18" />
            <text
              x="820"
              y="302"
              textAnchor="middle"
              fill="#52B7A5"
              className="font-mono-code font-bold"
              fontSize="28"
            >
              3
            </text>
            <text x="820" y="324" textAnchor="middle" fill="#8FE3D3" fontSize="14">
              🪶 PLUME
            </text>
          </g>
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 1: L'HORLOGE COMTOISE (Left Wall Grandfather Clock)           */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('horloge', 10, 48, e)}
          onMouseEnter={() => setHoveredHotspot('horloge')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Clock Base Pedestal */}
          <rect x="92" y="510" width="136" height="135" fill="#23140E" stroke="#4A2E20" strokeWidth="3" />
          <rect x="106" y="526" width="108" height="96" fill="#180D09" stroke="#3B2318" strokeWidth="2" />

          {/* Clock Middle Pendulum Case */}
          <rect x="104" y="270" width="112" height="240" fill="#2A1810" stroke="#4D3022" strokeWidth="3" />
          {/* Glass pendulum window */}
          <rect x="122" y="290" width="76" height="195" rx="38" fill="#0B090E" stroke="#785230" strokeWidth="2.5" />

          {/* Swinging Brass Pendulum */}
          <g className={flags.clockWound ? 'animate-pendulum' : ''} style={{ transformOrigin: '160px 295px' }}>
            <line x1="160" y1="295" x2="160" y2="430" stroke="#D99B26" strokeWidth="3" />
            <circle cx="160" cy="435" r="20" fill="#FFD166" stroke="#B87314" strokeWidth="3" />
            <circle cx="160" cy="435" r="8" fill="#D97724" />
          </g>

          {/* Clock Top Hood */}
          <path
            d="M 88 270 L 88 150 Q 160 105 232 150 L 232 270 Z"
            fill="#2E1B12"
            stroke="#593726"
            strokeWidth="3"
          />
          {/* Ornate Brass Clock Face */}
          <circle cx="160" cy="205" r="48" fill="#EFE6D5" stroke="#B8860B" strokeWidth="5" />
          <circle cx="160" cy="205" r="40" fill="none" stroke="#3A2818" strokeWidth="1" strokeDasharray="4 4" />
          {/* Roman numerals hint */}
          <text x="160" y="174" textAnchor="middle" fill="#1C161E" fontSize="11" fontWeight="bold">
            XII
          </text>
          <text x="194" y="209" textAnchor="middle" fill="#1C161E" fontSize="11" fontWeight="bold">
            III
          </text>
          <text x="160" y="242" textAnchor="middle" fill="#1C161E" fontSize="11" fontWeight="bold">
            VI
          </text>
          <text x="125" y="209" textAnchor="middle" fill="#1C161E" fontSize="11" fontWeight="bold">
            IX
          </text>

          {/* Clock Hands */}
          {flags.clockWound ? (
            /* Hands aligned at Midnight (XII) */
            <g>
              <line x1="160" y1="205" x2="160" y2="170" stroke="#9E2A2B" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="160" y1="205" x2="160" y2="178" stroke="#1C161E" strokeWidth="4.5" strokeLinecap="round" />
            </g>
          ) : (
            /* Frozen hands before winding */
            <g>
              <line x1="160" y1="205" x2="135" y2="185" stroke="#1C161E" strokeWidth="4" strokeLinecap="round" />
              <line x1="160" y1="205" x2="185" y2="215" stroke="#1C161E" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
          <circle cx="160" cy="205" r="4" fill="#B8860B" />

          {/* Secret Compartment at clock base */}
          {flags.clockWound && (
            <rect x="122" y="545" width="76" height="42" rx="4" fill="#070609" stroke="#FFD166" strokeWidth="1.8" />
          )}
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 2: LE PORTRAIT DU COMTE MALAKOR (Upper Left-Center Wall)      */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('portrait', 25, 25, e)}
          onMouseEnter={() => setHoveredHotspot('portrait')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Ornate Gilded Frame */}
          <rect
            x="325"
            y="120"
            width="155"
            height="205"
            rx="6"
            fill="#2B1E16"
            stroke="#B8860B"
            strokeWidth="7"
          />
          <rect
            x="336"
            y="131"
            width="133"
            height="183"
            fill="#141118"
            stroke="#785621"
            strokeWidth="2"
          />

          {/* Portrait Illustration: Count Malakor */}
          {/* Shoulders & Victorian high-collar cloak */}
          <path d="M 345 312 Q 402 255 460 312 Z" fill="#1F1624" stroke="#3B2842" strokeWidth="2" />
          <path d="M 372 255 L 360 220 L 402 245 L 444 220 L 432 255 Z" fill="#3D171E" />
          {/* Pale Gaunt Face */}
          <ellipse cx="402" cy="205" rx="25" ry="33" fill="#9E8F80" />
          {/* Aristocratic hair & goatee */}
          <path d="M 376 195 Q 402 162 428 195 Q 422 175 402 175 Q 382 175 376 195 Z" fill="#2A2426" />
          <polygon points="397,228 407,228 402,240" fill="#2A2426" />
          {/* Eyes (Glow eerie orange/verdigris when lantern shines on him!) */}
          <circle cx="392" cy="202" r="3" fill={portraitLit ? '#FF7A00' : '#1C161E'} />
          <circle cx="412" cy="202" r="3" fill={portraitLit ? '#FF7A00' : '#1C161E'} />

          {/* Peeling bottom-right canvas corner (hiding matches!) */}
          {!flags.portraitMatchesTaken && (
            <polygon points="442,314 469,314 469,286" fill="#3B2B23" stroke="#FF7A00" strokeWidth="1.2" />
          )}

          {/* SPECTRAL RUNE 1: ☽ = 7 (Glows on portrait canvas when illuminated!) */}
          <g
            style={{
              opacity: portraitLit ? 0.96 : 0.04,
              transition: 'opacity 0.35s ease',
            }}
          >
            <circle cx="402" cy="156" r="22" fill="#3E8E7E" opacity="0.22" />
            <text
              x="402"
              y="163"
              textAnchor="middle"
              fill="#52B7A5"
              className="font-mono-code font-bold"
              fontSize="26"
            >
              ☽ 7
            </text>
          </g>
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 3: LE GUÉRIDON & LE CANDÉLABRE (Left Foreground Table)        */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('gueridon', 22, 68, e)}
          onMouseEnter={() => setHoveredHotspot('gueridon')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Tripod Carved Legs & Pedestal */}
          <path
            d="M 350 615 L 350 705 M 350 675 L 305 735 M 350 675 L 395 735 M 350 675 L 350 742"
            stroke="#3A2218"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Round Table Top */}
          <ellipse cx="350" cy="610" rx="68" ry="20" fill="#4A2C1D" stroke="#75472E" strokeWidth="3" />

          {/* Silver Candelabra */}
          <path
            d="M 330 605 L 330 555 M 310 572 Q 330 582 350 572 M 310 572 L 310 558 M 350 572 L 350 558"
            stroke="#94A3B8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="330" cy="606" rx="16" ry="5" fill="#94A3B8" />

          {/* Half-melted Wax Candle Stub on Candelabra (if not taken) */}
          {!flags.gueridonWaxTaken && (
            <rect x="326" y="535" width="8" height="20" rx="2" fill="#FFF3D1" stroke="#D97724" strokeWidth="1" />
          )}

          {/* Porcelain Snuffbox (Tabatière) on table */}
          <rect
            x="362"
            y="592"
            width="28"
            height="16"
            rx="4"
            fill="#3E8E7E"
            stroke="#FFD166"
            strokeWidth="1.8"
          />
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 5: LE SERVITEUR DE CHEMINÉE & TISONNIER (Beside Fireplace)    */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('porte_parapluie', 31, 63, e)}
          onMouseEnter={() => setHoveredHotspot('porte_parapluie')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Coat & Umbrella Iron Stand */}
          <rect x="468" y="520" width="46" height="125" rx="6" fill="#18141C" stroke="#4A3B32" strokeWidth="2.5" />
          {/* Old Velvet Coat hanging on hook */}
          <path
            d="M 465 470 Q 485 460 495 520 L 460 535 Z"
            fill="#2E151B"
            stroke="#52232D"
            strokeWidth="2"
          />
          {/* Iron Poker (Tisonnier) standing in holder (if not taken yet) */}
          {!flags.pokerTaken && (
            <g>
              <line x1="502" y1="455" x2="502" y2="635" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
              <circle cx="502" cy="452" r="7" fill="#1C161E" stroke="#FFD166" strokeWidth="2.5" />
              <path d="M 502 635 Q 514 635 514 622" stroke="#FF7A00" strokeWidth="3.5" fill="none" />
            </g>
          )}
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 4: L'ÂTRE DE LA CHEMINÉE (Stone Fireplace Center-Left)        */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('cheminee', 40, 56, e)}
          onMouseEnter={() => setHoveredHotspot('cheminee')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Monumental Carved Stone Mantelpiece */}
          <rect x="530" y="385" width="230" height="235" fill="#231F26" stroke="#3E3742" strokeWidth="4" />
          {/* Mantel Top Ledge */}
          <rect x="512" y="370" width="266" height="22" rx="3" fill="#2F2933" stroke="#4F4554" strokeWidth="3" />
          {/* Carved Gargoyle / Courge relief on mantel */}
          <circle cx="645" cy="415" r="18" fill="#1A161C" stroke="#574B5E" strokeWidth="2" />
          <polygon points="638,412 642,406 644,414" fill="#FF7A00" opacity="0.6" />
          <polygon points="646,414 648,406 652,412" fill="#FF7A00" opacity="0.6" />

          {/* Dark Firebox Arch */}
          <path
            d="M 565 620 L 565 475 Q 645 435 725 475 L 725 620 Z"
            fill="#09070A"
            stroke="#161218"
            strokeWidth="5"
          />

          {/* Smoldering Embers & Charred Logs */}
          <ellipse cx="645" cy="605" rx="75" ry="28" fill="url(#emberGlow)" />
          <path d="M 590 595 L 695 580 M 600 580 L 685 600" stroke="#261B18" strokeWidth="14" strokeLinecap="round" />
          {/* Glowing ember dots */}
          <circle cx="625" cy="596" r="4" fill="#FF7A00" className="animate-pulse" />
          <circle cx="655" cy="592" r="5" fill="#D94E1F" className="animate-pulse" />
          <circle cx="670" cy="600" r="3.5" fill="#FFD166" className="animate-pulse" />

          {/* Iron Box hidden in the embers (glinting before cleared) */}
          {!flags.fireplaceCleared && (
            <rect
              x="632"
              y="568"
              width="32"
              height="22"
              rx="3"
              fill="#1E293B"
              stroke="#FFD166"
              strokeWidth="1.8"
            />
          )}

          {/* Wrought-iron fireplace grate */}
          {[585, 610, 635, 660, 685, 705].map((gx) => (
            <line key={gx} x1={gx} y1="555" x2={gx} y2="618" stroke="#1F1B24" strokeWidth="4" />
          ))}
          <line x1="572" y1="578" x2="718" y2="578" stroke="#1F1B24" strokeWidth="4" />
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 10: LE TAPIS PERSAN USÉ (Center Floor Rug)                    */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('tapis', 50, 83, e)}
          onMouseEnter={() => setHoveredHotspot('tapis')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Perspective Trapezoid Rug */}
          <polygon
            points="520,695 1060,695 1170,855 410,855"
            fill="#3B161B"
            stroke="#8C5828"
            strokeWidth="4"
          />
          <polygon
            points="550,710 1030,710 1120,838 460,838"
            fill="#281117"
            stroke="#B8860B"
            strokeWidth="2"
          />
          {/* Geometric medallion in center of rug */}
          <ellipse cx="790" cy="772" rx="135" ry="32" fill="#4D1E24" stroke="#D97724" strokeWidth="2" />
          {/* Curled-up top-right corner of rug */}
          <polygon
            points="1025,695 1065,695 1085,730 1010,722"
            fill="#5C3A28"
            stroke="#FFD166"
            strokeWidth="1.5"
          />
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 7: LE SECRÉTAIRE EN ACAJOU & GRIMOIRE (Right-Center Desk)     */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('secretaire', 68, 58, e)}
          onMouseEnter={() => setHoveredHotspot('secretaire')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Desk Legs */}
          <rect x="1005" y="575" width="14" height="110" fill="#26130D" />
          <rect x="1175" y="575" width="14" height="110" fill="#26130D" />
          {/* Desk Body & Secret Silver-Keyed Drawer */}
          <rect
            x="995"
            y="495"
            width="204"
            height="88"
            rx="4"
            fill="#381C14"
            stroke="#5E3224"
            strokeWidth="3"
          />
          {/* Drawer Front */}
          <rect
            x="1018"
            y="515"
            width="158"
            height="48"
            rx="3"
            fill={flags.deskUnlocked ? '#140B08' : '#2B150E'}
            stroke={flags.deskUnlocked ? '#3E8E7E' : '#8A5236'}
            strokeWidth="2"
          />
          {/* Silver Keyhole Escutcheon */}
          <circle cx="1097" cy="539" r="8" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
          <path d="M 1097 536 L 1095 544 L 1099 544 Z" fill="#0F172A" />

          {/* Open Leather Grimoire on Desk Top */}
          <polygon
            points="1035,495 1095,482 1155,495 1142,455 1095,465 1048,455"
            fill="#EFE6D5"
            stroke="#B8860B"
            strokeWidth="2.5"
          />
          <line x1="1095" y1="465" x2="1095" y2="490" stroke="#785230" strokeWidth="2" />
          {/* Quill & Inkwell beside Grimoire */}
          <rect x="1164" y="476" width="14" height="18" rx="3" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M 1171 476 Q 1185 442 1198 432 Q 1180 452 1173 476 Z" fill="#EFE6D5" />
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 8: L'ÉTAGÈRE D'ALCHIMIE & LE CRÂNE (Upper Right Wall)         */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('etagere_crane', 78, 25, e)}
          onMouseEnter={() => setHoveredHotspot('etagere_crane')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Wooden Wall Shelf & Brackets */}
          <rect x="1145" y="255" width="195" height="14" rx="3" fill="#3B2318" stroke="#5E3A28" strokeWidth="2" />
          <path d="M 1165 269 L 1165 305 L 1195 269 Z" fill="#26160F" />
          <path d="M 1320 269 L 1320 305 L 1290 269 Z" fill="#26160F" />

          {/* Row of Ancient Books */}
          <rect x="1158" y="195" width="18" height="60" fill="#4A181D" stroke="#7A2830" strokeWidth="1.5" />
          <rect x="1177" y="188" width="22" height="67" fill="#1B322C" stroke="#2E574C" strokeWidth="1.5" />
          <rect x="1200" y="200" width="16" height="55" fill="#3A2818" stroke="#6E4D30" strokeWidth="1.5" />

          {/* Intact Tallow Candle hidden beside books (if not taken) */}
          {!flags.shelfWaxTaken && (
            <g>
              <rect x="1222" y="215" width="10" height="40" rx="2" fill="#FFF3D1" stroke="#D97724" strokeWidth="1.2" />
              <line x1="1227" y1="210" x2="1227" y2="215" stroke="#FFD166" strokeWidth="2" />
            </g>
          )}

          {/* Alchemist's Skull on Velvet Cushion */}
          <ellipse cx="1275" cy="252" rx="28" ry="6" fill="#4A1525" />
          <path
            d="M 1252 225 C 1252 195, 1298 195, 1298 225 C 1298 236, 1290 242, 1288 250 L 1262 250 C 1260 242, 1252 236, 1252 225 Z"
            fill="#D8CFC2"
            stroke="#6E6254"
            strokeWidth="2"
          />
          {/* Skull Eye Sockets & Nasal Cavity */}
          <circle cx="1266" cy="226" r="6" fill={skullLit ? '#3E8E7E' : '#141118'} />
          <circle cx="1284" cy="226" r="6" fill={skullLit ? '#3E8E7E' : '#141118'} />
          <polygon points="1275,231 1272,239 1278,239" fill="#141118" />

          {/* Potion Flask */}
          <path d="M 1312 255 L 1304 232 L 1312 218 L 1312 206 L 1320 206 L 1320 218 L 1328 232 L 1320 255 Z" fill="#1F4D44" stroke="#52B7A5" strokeWidth="1.5" />

          {/* SPECTRAL RUNE 3: 💀 = 9 (Glows above skull when illuminated!) */}
          <g
            style={{
              opacity: skullLit ? 0.96 : 0.04,
              transition: 'opacity 0.35s ease',
            }}
          >
            <circle cx="1275" cy="166" r="24" fill="#3E8E7E" opacity="0.22" />
            <text
              x="1275"
              y="174"
              textAnchor="middle"
              fill="#52B7A5"
              className="font-mono-code font-bold"
              fontSize="26"
            >
              💀 9
            </text>
          </g>
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 9: LE COFFRE RELIQUAIRE EN LAITON (Right Foreground Safe)     */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('coffre_laiton', 79, 73, e)}
          onMouseEnter={() => setHoveredHotspot('coffre_laiton')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Heavy Wooden & Brass Reliquary Chest on Low Pedestal */}
          <rect
            x="1205"
            y="605"
            width="135"
            height="95"
            rx="6"
            fill="#1D161A"
            stroke="#D97724"
            strokeWidth="4"
          />
          {/* Brass Corner Straps */}
          <rect x="1215" y="615" width="115" height="75" fill="#141013" stroke="#B8860B" strokeWidth="2" />

          {/* Octagonal Medallion Socket */}
          <polygon
            points="1265,622 1279,622 1286,629 1286,643 1279,650 1265,650 1258,643 1258,629"
            fill={flags.medallionPlaced ? '#3E8E7E' : '#09070A'}
            stroke="#FFD166"
            strokeWidth="2"
          />

          {/* Three Brass Tumbler Wheels */}
          {[1242, 1272, 1302].map((dx, i) => (
            <rect
              key={i}
              x={dx - 10}
              y="658"
              width="20"
              height="24"
              rx="3"
              fill="#FFD166"
              stroke="#785230"
              strokeWidth="1.5"
            />
          ))}

          {/* Glow if unlocked */}
          {flags.safeUnlocked && (
            <circle cx="1272" cy="650" r="38" fill="#FFD166" opacity="0.22" />
          )}
        </g>

        {/* ===================================================================== */}
        {/* HOTSPOT 11: LA LOURDE PORTE DE CHÊNE (Far Right Exit Door)            */}
        {/* ===================================================================== */}
        <g
          onClick={(e) => handleHotspotClick('porte_sortie', 92, 50, e)}
          onMouseEnter={() => setHoveredHotspot('porte_sortie')}
          onMouseLeave={() => setHoveredHotspot(null)}
          className="cursor-pointer"
        >
          {/* Stone Archway Frame */}
          <path
            d="M 1385 650 L 1385 175 Q 1475 95 1565 175 L 1565 650 Z"
            fill="#2B252E"
            stroke="#463C4A"
            strokeWidth="8"
          />
          {/* Heavy Oak Door Planks */}
          <path
            d="M 1400 645 L 1400 185 Q 1475 115 1550 185 L 1550 645 Z"
            fill="#26150E"
            stroke="#120906"
            strokeWidth="4"
          />
          {/* Vertical Wood Planks */}
          <line x1="1438" y1="150" x2="1438" y2="645" stroke="#160B07" strokeWidth="3" />
          <line x1="1475" y1="138" x2="1475" y2="645" stroke="#160B07" strokeWidth="3" />
          <line x1="1512" y1="150" x2="1512" y2="645" stroke="#160B07" strokeWidth="3" />

          {/* Heavy Wrought-Iron Hinges & Straps */}
          <rect x="1402" y="245" width="125" height="14" rx="3" fill="#1A181E" stroke="#3B3642" strokeWidth="1.5" />
          <rect x="1402" y="520" width="125" height="14" rx="3" fill="#1A181E" stroke="#3B3642" strokeWidth="1.5" />

          {/* Ornate Pumpkin/Skull Brass Lock Plate & Handle */}
          <rect
            x="1410"
            y="372"
            width="36"
            height="64"
            rx="6"
            fill="#B8860B"
            stroke="#FFD166"
            strokeWidth="2"
          />
          <circle cx="1428" cy="395" r="9" fill="#1C161E" />
          <polygon points="1428,398 1423,420 1433,420" fill="#070609" />
          {/* Ring handle */}
          <circle cx="1428" cy="360" r="12" fill="none" stroke="#FFD166" strokeWidth="4" />
        </g>
      </svg>

      {/* ===================================================================== */}
      {/* INTERACTIVE HOTSPOT PINS & LABELS (VISIBLE IN LANTERN BEAM)           */}
      {/* ===================================================================== */}
      {HOTSPOTS_META.map((spot) => {
        const lit = isIlluminated(spot.xPercent, spot.yPercent);
        const isSelected = activeHotspot === spot.id;
        const isHovered = hoveredHotspot === spot.id;

        return (
          <button
            key={spot.id}
            onClick={(e) => handleHotspotClick(spot.id, spot.xPercent, spot.yPercent, e)}
            onMouseEnter={() => setHoveredHotspot(spot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            style={{
              left: `${spot.xPercent}%`,
              top: `${spot.yPercent}%`,
              opacity: lit || isSelected || isHovered ? 1 : 0.14,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none transition-opacity duration-300 cursor-pointer"
          >
            {/* Pulsing interactive node */}
            <div
              className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                isSelected
                  ? 'bg-[#FF7A00]/35 border-2 border-[#FFD166] scale-125 shadow-[0_0_20px_rgba(255,209,102,0.8)]'
                  : isHovered
                  ? 'bg-[#FF7A00]/25 border-2 border-[#FF7A00] scale-115 shadow-[0_0_16px_rgba(255,122,0,0.65)]'
                  : 'bg-[#070609]/65 border border-[#FF8C28]/55 hover:border-[#FFD166]'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-transform ${
                  isSelected || isHovered ? 'bg-[#FFD166] scale-125' : 'bg-[#FF7A00]/85'
                }`}
              />
            </div>

            {/* Floating Tooltip Label when illuminated or hovered */}
            {(isHovered || isSelected) && (
              <div className="absolute left-1/2 -translate-x-1/2 -top-9 whitespace-nowrap px-2.5 py-1 rounded-md bg-[#110E14]/95 border border-[#FF8C28]/60 text-xs font-semibold text-[#FFD166] shadow-lg pointer-events-none flex items-center gap-1.5">
                {selectedItem ? (
                  <>
                    <Sparkles className="w-3 h-3 text-[#FF7A00]" />
                    <span>
                      Utiliser {INVENTORY_CATALOG[selectedItem].name} → {spot.shortLabel}
                    </span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 text-[#FF7A00]" />
                    <span>{spot.title}</span>
                  </>
                )}
              </div>
            )}
          </button>
        );
      })}

      {/* ===================================================================== */}
      {/* REAL-TIME CHIAROSCURO LANTERN SPOTLIGHT DARKNESS MASK                 */}
      {/* ===================================================================== */}
      {!highVisibilityMode && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            background: isBlackout
              ? `radial-gradient(circle 48px at ${pointer.pxX}px ${pointer.pxY}px, rgba(158, 42, 43, 0.18) 0%, rgba(7, 6, 9, 0.985) 100%)`
              : `radial-gradient(circle ${baseRadius}px at ${pointer.pxX}px ${pointer.pxY}px, rgba(255, 209, 102, 0.14) 0%, rgba(255, 122, 0, 0.10) 32%, rgba(17, 14, 20, 0.78) 68%, rgba(7, 6, 9, 0.97) 100%)`,
          }}
        />
      )}

      {/* Match Strike Screen Flash Effect */}
      {matchFlash && (
        <div
          className="pointer-events-none fixed inset-0 z-30 bg-gradient-radial from-[#FFD166]/65 via-[#FF7A00]/30 to-transparent"
          style={{ animation: 'matchStrikeFlash 0.65s ease-out forwards' }}
        />
      )}

      {/* ===================================================================== */}
      {/* CUSTOM SWAYING COURGE LANTERN CURSOR FOLLOWER                         */}
      {/* ===================================================================== */}
      <div
        className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${pointer.pxX}px`,
          top: `${pointer.pxY}px`,
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Warm outer aura */}
          {!isBlackout && (
            <div
              className="absolute w-16 h-16 rounded-full blur-md pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,165,0,0.42) 0%, transparent 70%)',
              }}
            />
          )}
          {/* Mini Courge Lantern SVG Cursor */}
          <svg viewBox="0 0 40 48" className="w-9 h-11 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            <path d="M 14 8 C 14 2, 26 2, 26 8" fill="none" stroke="#FFD166" strokeWidth="2" />
            <ellipse
              cx="20"
              cy="24"
              rx="12"
              ry="11"
              fill={isBlackout ? '#22120E' : '#D94E1F'}
              stroke="#FFD166"
              strokeWidth="1.5"
            />
            {/* Glowing carved jack-o'-lantern eyes & grin */}
            <polygon points="15,21 17,18 18,22" fill={isBlackout ? '#4A1818' : '#FFD166'} />
            <polygon points="22,22 23,18 25,21" fill={isBlackout ? '#4A1818' : '#FFD166'} />
            <path
              d="M 14 26 Q 20 31 26 26"
              stroke={isBlackout ? '#4A1818' : '#FFD166'}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
