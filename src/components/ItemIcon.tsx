import React from 'react';
import { ItemId } from '../data/manorData';

interface ItemIconProps {
  itemId: ItemId;
  className?: string;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ itemId, className = 'w-8 h-8' }) => {
  switch (itemId) {
    case 'tisonnier':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          {/* Iron Poker */}
          <path
            d="M 10 38 L 34 14"
            stroke="#C2B8AD"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Curved ember hook */}
          <path
            d="M 30 18 Q 37 19 39 14 Q 40 9 34 14 L 38 9"
            stroke="#FF8C28"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Ornate wrought-iron handle */}
          <circle cx="9" cy="39" r="4" stroke="#D97724" strokeWidth="2.4" fill="#1C161E" />
          <path d="M 12 36 L 16 32" stroke="#D97724" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'cle_argent':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          {/* Ornate Silver Desk Key */}
          <circle cx="15" cy="24" r="7" stroke="#E2E8F0" strokeWidth="2.4" fill="#1E293B" />
          <circle cx="15" cy="24" r="2.8" fill="#94A3B8" />
          <path d="M 22 24 L 40 24" stroke="#E2E8F0" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M 33 24 L 33 31 M 38 24 L 38 30 M 35.5 24 L 35.5 28" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'cle_horloger':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          {/* Brass Clock Winding Key */}
          <ellipse cx="14" cy="17" rx="6" ry="5" stroke="#FFD166" strokeWidth="2.4" fill="#2A2015" />
          <ellipse cx="14" cy="31" rx="6" ry="5" stroke="#FFD166" strokeWidth="2.4" fill="#2A2015" />
          <path d="M 19 24 L 37 24" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <rect x="35" y="20" width="7" height="8" rx="1" stroke="#FFD166" strokeWidth="2" fill="#1C161E" />
        </svg>
      );

    case 'medaillon_corbeau':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          {/* Octagonal Raven Medallion */}
          <polygon
            points="17,6 31,6 42,17 42,31 31,42 17,42 6,31 6,17"
            fill="#1D1822"
            stroke="#D97724"
            strokeWidth="2.4"
          />
          <polygon
            points="19,10 29,10 38,19 38,29 29,38 19,38 10,29 10,19"
            fill="none"
            stroke="#3E8E7E"
            strokeWidth="1.2"
          />
          {/* Raven Silhouette inside */}
          <path
            d="M 14 26 Q 20 18 24 22 Q 28 18 34 26 Q 28 25 26 31 L 22 31 Q 20 25 14 26 Z"
            fill="#FFD166"
          />
          <circle cx="24" cy="18" r="2.2" fill="#FF7A00" />
        </svg>
      );

    case 'feuillet_code':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          {/* Parchment Cipher Scroll */}
          <path
            d="M 12 8 H 34 L 38 12 V 40 H 12 V 8 Z"
            fill="#2E241E"
            stroke="#D4A359"
            strokeWidth="2.2"
          />
          <path d="M 17 17 H 31 M 17 24 H 33 M 17 31 H 28" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
          <circle cx="31" cy="32" r="3" fill="#3E8E7E" />
        </svg>
      );

    case 'cle_sortie':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          {/* Master Pumpkin-Bow Exit Key */}
          <ellipse cx="15" cy="24" rx="9" ry="8" fill="#3A180C" stroke="#FF7A00" strokeWidth="2.5" />
          {/* Glowing eyes inside key bow */}
          <polygon points="12,22 14,19 15,23" fill="#FFD166" />
          <polygon points="16,23 17,19 19,22" fill="#FFD166" />
          {/* Heavy Key Shaft & Teeth */}
          <path d="M 24 24 L 43 24" stroke="#FFD166" strokeWidth="3.2" strokeLinecap="round" />
          <path
            d="M 33 24 V 33 M 37 24 V 30 M 41 24 V 34 M 33 30 H 41"
            stroke="#FF7A00"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};
