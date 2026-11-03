export type ItemId =
  | 'tisonnier'
  | 'cle_argent'
  | 'cle_horloger'
  | 'medaillon_corbeau'
  | 'feuillet_code'
  | 'cle_sortie';

export interface InventoryItem {
  id: ItemId;
  name: string;
  subtitle: string;
  description: string;
  usageHint: string;
  iconType: 'poker' | 'silver_key' | 'clock_key' | 'medallion' | 'cipher' | 'master_key';
}

export type HotspotId =
  | 'horloge'
  | 'portrait'
  | 'gueridon'
  | 'cheminee'
  | 'porte_parapluie'
  | 'fenetre'
  | 'secretaire'
  | 'etagere_crane'
  | 'coffre_laiton'
  | 'tapis'
  | 'porte_sortie';

export interface RoomFlags {
  // Matches & Wax pickups
  clockMatchTaken: boolean;
  portraitMatchesTaken: boolean;
  gueridonMatchTaken: boolean;
  gueridonWaxTaken: boolean;
  coatMatchTaken: boolean;
  windowWaxTaken: boolean;
  shelfWaxTaken: boolean;
  rugMatchTaken: boolean;

  // Clues & spectral numbers seen
  portraitRuneSeen: boolean; // ☽ = 7
  windowRuneSeen: boolean;   // 🪶 = 3
  skullRuneSeen: boolean;    // 💀 = 9
  grimoireRead: boolean;

  // Puzzle progression
  pokerTaken: boolean;
  fireplaceCleared: boolean; // Used poker on fireplace -> gets cle_argent
  deskUnlocked: boolean;     // Used cle_argent on desk -> gets cle_horloger + feuillet_code
  clockWound: boolean;       // Used cle_horloger on clock -> gets medaillon_corbeau
  medallionPlaced: boolean;  // Placed medaillon_corbeau on coffre_laiton
  safeUnlocked: boolean;     // Entered 7-3-9 on coffre_laiton -> gets cle_sortie
  doorUnlocked: boolean;     // Used cle_sortie on porte_sortie -> Victory!
}

export const INITIAL_FLAGS: RoomFlags = {
  clockMatchTaken: false,
  portraitMatchesTaken: false,
  gueridonMatchTaken: false,
  gueridonWaxTaken: false,
  coatMatchTaken: false,
  windowWaxTaken: false,
  shelfWaxTaken: false,
  rugMatchTaken: false,

  portraitRuneSeen: false,
  windowRuneSeen: false,
  skullRuneSeen: false,
  grimoireRead: false,

  pokerTaken: false,
  fireplaceCleared: false,
  deskUnlocked: false,
  clockWound: false,
  medallionPlaced: false,
  safeUnlocked: false,
  doorUnlocked: false,
};

export const INVENTORY_CATALOG: Record<ItemId, InventoryItem> = {
  tisonnier: {
    id: 'tisonnier',
    name: 'Tisonnier en Fer Forgé',
    subtitle: 'Outil de cheminée',
    description:
      'Une longue tige de fer noirci terminée par un crochet recourbé. Idéal pour fouiller les braises et les cendres sans se brûler.',
    usageHint: 'Utilisez-le sur l’Âtre de la Cheminée.',
    iconType: 'poker',
  },
  cle_argent: {
    id: 'cle_argent',
    name: "Petite Clé d'Argent",
    subtitle: 'Clé finement ciselée',
    description:
      'Retirée du coffret de fonte caché sous les cendres. Son panneton délicat porte les armoiries d’un meuble d’écriture.',
    usageHint: 'Déverrouille le tiroir secret du Secrétaire en Acajou.',
    iconType: 'silver_key',
  },
  cle_horloger: {
    id: 'cle_horloger',
    name: "Clé d'Horloger en Laiton",
    subtitle: 'Manivelle de remontoir',
    description:
      'Une clé à canon carré destinée aux grands mécanismes d’horlogerie ancienne.',
    usageHint: 'Remontez le mécanisme de l’Horloge Comtoise.',
    iconType: 'clock_key',
  },
  feuillet_code: {
    id: 'feuillet_code',
    name: 'Feuillet Chiffré de Malakor',
    subtitle: 'Ordre cabalistique',
    description:
      'Un parchemin jauni indiquant l’ordre exact des trois cadrans du reliquaire : 1° La Lune (☽)  :  2° La Plume (🪶)  :  3° Le Crâne (💀).',
    usageHint: 'Éclairez le Portrait (☽), la Fenêtre (🪶) et le Crâne (💀) pour lire les 3 chiffres.',
    iconType: 'cipher',
  },
  medaillon_corbeau: {
    id: 'medaillon_corbeau',
    name: 'Médaillon du Corbeau',
    subtitle: 'Sceau de bronze noir',
    description:
      'Un lourd médaillon octogonal frappé d’un corbeau aux ailes déployées, libéré par le carillon de minuit.',
    usageHint: 'S’insère dans l’empreinte du Coffre Reliquaire en Laiton.',
    iconType: 'medallion',
  },
  cle_sortie: {
    id: 'cle_sortie',
    name: 'Clé Maîtresse de la Sortie',
    subtitle: 'Clé du Grand Salon',
    description:
      'Une imposante clé en fer forgé ornée d’une courge grimaçante. C’est l’unique clé capable d’ouvrir la lourde porte de chêne !',
    usageHint: 'Ouvrez la Lourde Porte de Chêne à droite du salon.',
    iconType: 'master_key',
  },
};

export interface GrimoirePage {
  pageNumber: string;
  date: string;
  title: string;
  body: string[];
  sketchCaption: string;
}

export const GRIMOIRE_PAGES: GrimoirePage[] = [
  {
    pageNumber: 'Feuillet I',
    date: 'Nuit du 31 Octobre 1894',
    title: 'La Malédiction de la Courge Ardente',
    body: [
      "« Quiconque pénètre dans mon Grand Salon durant la veillée de la Toussaint ne pourra en franchir le seuil tant que les ombres gouvernent ces murs. »",
      "« Seule la lueur d'une Lanterne de Courge révèle ce que l'œil nu ignore. Mais prenez garde : le suif fond vite dans l'air glacé du manoir. Cherchez mes allumettes soufrées et les bouts de chandelle oubliés dans la pièce, ou les ténèbres vous engloutiront. »",
    ],
    sketchCaption: 'Croquis I : La flamme révèle les chiffres spectraux peints au phosphore.',
  },
  {
    pageNumber: 'Feuillet II',
    date: 'Mémoire des Cachettes',
    title: 'Les Trois Gardiens du Salon',
    body: [
      "« J'ai dissimulé la Petite Clé d'Argent au cœur des cendres de l'âtre ; nul ne saurait l'atteindre sans le Tisonnier de fer rangé dans le porte-parapluie. »",
      "« Quant à ma vieille Horloge Comtoise, elle refuse de sonner l'heure des âmes tant qu'on ne l'a pas remontée avec la Clé d'Horloger enfermée dans le tiroir de ce secrétaire. »",
    ],
    sketchCaption: 'Croquis II : Tisonnier → Cheminée → Secrétaire → Horloge Comtoise.',
  },
  {
    pageNumber: 'Feuillet III',
    date: 'Sceau du Reliquaire',
    title: 'Le Code des Trois Cadrans',
    body: [
      "« La Clé Maîtresse de la Sortie repose dans le Coffre Reliquaire en laiton. Pour l'ouvrir, scellez-le du Médaillon du Corbeau, puis alignez les trois rouleaux selon mes trois témoins : »",
      "« Premier Cadran (☽ Lune) : Le regard de mon Portrait peint. Deuxième Cadran (🪶 Plume) : Le givre de la Fenêtre en Ogive. Troisième Cadran (💀 Crâne) : Le front du Crâne d'Alchimiste. »",
    ],
    sketchCaption: 'Ordre sacré : I. Lune (☽)  •  II. Plume (🪶)  •  III. Crâne (💀)',
  },
];

export interface HotspotMeta {
  id: HotspotId;
  title: string;
  shortLabel: string;
  xPercent: number;
  yPercent: number;
}

export const HOTSPOTS_META: HotspotMeta[] = [
  { id: 'horloge', title: "L'Horloge Comtoise", shortLabel: 'Horloge', xPercent: 10, yPercent: 48 },
  { id: 'portrait', title: 'Le Portrait du Comte Malakor', shortLabel: 'Portrait (☽)', xPercent: 25, yPercent: 25 },
  { id: 'gueridon', title: 'Le Guéridon & Candélabre', shortLabel: 'Guéridon', xPercent: 22, yPercent: 68 },
  { id: 'cheminee', title: "L'Âtre de la Cheminée", shortLabel: 'Cheminée', xPercent: 40, yPercent: 56 },
  { id: 'porte_parapluie', title: 'Le Serviteur de Cheminée', shortLabel: 'Tisonnier & Manteau', xPercent: 31, yPercent: 63 },
  { id: 'fenetre', title: 'La Fenêtre en Ogive', shortLabel: 'Fenêtre (🪶)', xPercent: 54, yPercent: 30 },
  { id: 'tapis', title: 'Le Tapis Persan Usé', shortLabel: 'Tapis Persan', xPercent: 50, yPercent: 83 },
  { id: 'secretaire', title: 'Le Secrétaire & Grimoire', shortLabel: 'Secrétaire', xPercent: 68, yPercent: 58 },
  { id: 'etagere_crane', title: "L'Étagère & Le Crâne", shortLabel: 'Crâne (💀)', xPercent: 78, yPercent: 25 },
  { id: 'coffre_laiton', title: 'Le Coffre Reliquaire en Laiton', shortLabel: 'Coffre Codé', xPercent: 79, yPercent: 73 },
  { id: 'porte_sortie', title: 'La Lourde Porte de Chêne', shortLabel: 'Porte de Sortie', xPercent: 92, yPercent: 50 },
];

export function getContextualHint(flags: RoomFlags, matches: number, candleLife: number): string {
  if (candleLife < 30 && matches > 0) {
    return "« La flamme de votre courge faiblit dangereusement... Cliquez sur 'Craquer une allumette' en haut à gauche pour raviver la mèche ! »";
  }
  if (!flags.gueridonWaxTaken || !flags.portraitMatchesTaken) {
    return "« Approchez votre lanterne du Guéridon à gauche et du Portrait du Comte : vous y trouverez de la cire fraîche et des allumettes soufrées. »";
  }
  if (!flags.pokerTaken) {
    return "« Examinez le Serviteur de Cheminée (à gauche de l'âtre) pour récupérer le Tisonnier en Fer Forgé. »";
  }
  if (!flags.fireplaceCleared) {
    return "« Sélectionnez le Tisonnier dans votre sacoche (ou cliquez sur l'Âtre de la Cheminée) pour retirer le coffret caché sous les braises. »";
  }
  if (!flags.deskUnlocked) {
    return "« Vous avez la Petite Clé d'Argent ! Utilisez-la sur le Secrétaire en Acajou pour ouvrir son tiroir secret et lire le Grimoire. »";
  }
  if (!flags.clockWound) {
    return "« Utilisez la Clé d'Horloger sur l'Horloge Comtoise tout à gauche pour faire sonner minuit et obtenir le Médaillon du Corbeau. »";
  }
  if (!flags.portraitRuneSeen || !flags.windowRuneSeen || !flags.skullRuneSeen) {
    return "« Promenez le faisceau de votre lanterne sur le Portrait (☽ = 7), la Fenêtre en Ogive (🪶 = 3) et le Crâne en haut à droite (💀 = 9) pour révéler le code. »";
  }
  if (!flags.safeUnlocked) {
    return "« Cliquez sur le Coffre Reliquaire en Laiton (en bas à droite), placez-y le Médaillon du Corbeau et composez le code 7 - 3 - 9 ! »";
  }
  return "« Vous détenez la Clé Maîtresse de la Sortie ! Cliquez sur la Lourde Porte de Chêne tout à droite pour vous échapper du manoir ! »";
}
