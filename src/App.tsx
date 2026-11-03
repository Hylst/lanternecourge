import { useState, useEffect, useCallback } from 'react';
import {
  HotspotId,
  INITIAL_FLAGS,
  ItemId,
  RoomFlags,
  getContextualHint,
} from './data/manorData';
import { LanternHud } from './components/LanternHud';
import { ManorRoomCanvas } from './components/ManorRoomCanvas';
import { NarrativeChoice, NarrativeLedgerDock } from './components/NarrativeLedgerDock';
import { GrimoireModal } from './components/GrimoireModal';
import { BrassLockModal } from './components/BrassLockModal';
import { DifficultyMode, GameOverlayModal } from './components/GameOverlayModal';
import { soundEngine } from './utils/soundEngine';
import { Volume2, VolumeX, BookOpen, Eye, RotateCcw, Flame } from 'lucide-react';

export function App() {
  // Game State
  const [gameState, setGameState] = useState<'title' | 'playing' | 'victory' | 'gameover'>('title');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('classic');

  // Lantern & Resources
  const [candleLife, setCandleLife] = useState<number>(100);
  const [matches, setMatches] = useState<number>(2);
  const [isBlackout, setIsBlackout] = useState<boolean>(false);
  const [graceSeconds, setGraceSeconds] = useState<number>(8);
  const [matchFlash, setMatchFlash] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Room Progression Flags & Inventory
  const [flags, setFlags] = useState<RoomFlags>(INITIAL_FLAGS);
  const [inventory, setInventory] = useState<ItemId[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemId | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
  const [visitedHotspots, setVisitedHotspots] = useState<HotspotId[]>([]);

  // Narrative Ledger Display
  const [narrativeTitle, setNarrativeTitle] = useState<string>('Le Grand Salon de Valombre');
  const [narrativeText, setNarrativeText] = useState<string>(
    "La lourde porte de chêne vient de claquer derrière vous. Dans l'obscurité glaciale du manoir, votre unique source de lumière est cette Lanterne de Courge dont la bougie fond inexorablement. Promenez son faisceau sur les meubles du salon pour trouver des allumettes soufrées et la Clé Maîtresse de la sortie."
  );
  const [narrativeSubtext, setNarrativeSubtext] = useState<string | null>(
    'Déplacez la souris pour éclairer la pièce et cliquez sur les éléments révélés.'
  );

  // Modals & Settings
  const [isGrimoireOpen, setIsGrimoireOpen] = useState<boolean>(false);
  const [isBrassLockOpen, setIsBrassLockOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [highVisibilityMode, setHighVisibilityMode] = useState<boolean>(false);

  // Count how many spectral numbers have been discovered
  const cluesFoundCount =
    (flags.portraitRuneSeen ? 1 : 0) +
    (flags.windowRuneSeen ? 1 : 0) +
    (flags.skullRuneSeen ? 1 : 0);

  // Start / Reset Game
  const handleStartGame = useCallback(() => {
    soundEngine.playMatchStrike();
    setCandleLife(100);
    setMatches(2);
    setIsBlackout(false);
    setGraceSeconds(8);
    setElapsedSeconds(0);
    setFlags(INITIAL_FLAGS);
    setInventory([]);
    setSelectedItem(null);
    setActiveHotspot(null);
    setVisitedHotspots([]);
    setIsGrimoireOpen(false);
    setIsBrassLockOpen(false);
    setNarrativeTitle('Le Grand Salon de Valombre  :  31 Octobre 1894');
    setNarrativeText(
      "La lourde porte de chêne vient de se verrouiller derrière vous. Votre seule alliée est cette Lanterne de Courge dont la mèche grésille dans l'air d'automne. Fouillez le salon pour dénicher des allumettes, de la cire et la Clé Maîtresse avant que le suif ne soit consumé."
    );
    setNarrativeSubtext(
      'Conseil : Commencez par inspecter le Guéridon, le Portrait ou le Serviteur de cheminée.'
    );
    setGameState('playing');
  }, []);

  // Real-time Candle Melting Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const meltRatePerTick =
      difficulty === 'story' ? 0.14 : difficulty === 'classic' ? 0.24 : 0.38;

    const timer = setInterval(() => {
      setCandleLife((prev) => {
        if (prev <= 0) return 0;
        const next = Math.max(0, prev - meltRatePerTick);
        if (next === 0) {
          setIsBlackout(true);
          setGraceSeconds(8);
        }
        return next;
      });
    }, 500);

    return () => clearInterval(timer);
  }, [gameState, difficulty]);

  // Elapsed survival time counter & Blackout Grace Period countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    const secTimer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);

      if (isBlackout) {
        soundEngine.playHeartbeat();
        setGraceSeconds((g) => {
          if (matches <= 0 || g <= 1) {
            setGameState('gameover');
            return 0;
          }
          return g - 1;
        });
      }
    }, 1000);

    return () => clearInterval(secTimer);
  }, [gameState, isBlackout, matches]);

  // Strike a sulfur match to boost or relight the candle
  const handleStrikeMatch = useCallback(() => {
    if (matches <= 0) return;
    soundEngine.playMatchStrike();
    setMatchFlash(true);
    setTimeout(() => setMatchFlash(false), 650);

    setMatches((m) => Math.max(0, m - 1));
    setIsBlackout(false);
    setGraceSeconds(8);
    setCandleLife((prev) => Math.min(100, (prev <= 0 ? 12 : prev) + 38));
    setNarrativeSubtext(
      '🔥 Vous craquez une allumette soufrée ! La flamme de votre courge reprend vigueur (+38% de lumière).'
    );
  }, [matches]);

  // Add wax stub directly to candle
  const addCandleWax = (amount: number, label: string) => {
    soundEngine.playWaxBoost();
    setIsBlackout(false);
    setCandleLife((prev) => Math.min(100, prev + amount));
    setNarrativeSubtext(`🕯️ ${label} nourrit votre lanterne (+${amount}% de cire) !`);
  };

  // Discover Spectral Rune via Lantern Beam
  const handleDiscoverRune = useCallback(
    (rune: 'portrait' | 'window' | 'skull') => {
      setFlags((prev) => {
        if (rune === 'portrait' && !prev.portraitRuneSeen) {
          soundEngine.playWaxBoost();
          setNarrativeSubtext(
            '✨ La lueur de la lanterne révèle un chiffre spectral sur le Portrait : ☽ = 7 !'
          );
          return { ...prev, portraitRuneSeen: true };
        }
        if (rune === 'window' && !prev.windowRuneSeen) {
          soundEngine.playWaxBoost();
          setNarrativeSubtext(
            '✨ La lueur de la lanterne révèle un chiffre givré sur la Fenêtre : 🪶 = 3 !'
          );
          return { ...prev, windowRuneSeen: true };
        }
        if (rune === 'skull' && !prev.skullRuneSeen) {
          soundEngine.playWaxBoost();
          setNarrativeSubtext(
            '✨ La lueur de la lanterne révèle un chiffre phosphorique sur le Crâne : 💀 = 9 !'
          );
          return { ...prev, skullRuneSeen: true };
        }
        return prev;
      });
    },
    []
  );

  // Add item to satchel
  const giveItem = (item: ItemId) => {
    soundEngine.playKeyPickup();
    setInventory((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  // Inspect Hotspot & Handle Direct Item Usage
  const handleSelectHotspot = (id: HotspotId) => {
    soundEngine.playClickObject();
    setActiveHotspot(id);
    setVisitedHotspots((prev) => (prev.includes(id) ? prev : [...prev, id]));

    // Check if the player clicked a hotspot while holding the matching item
    if (selectedItem === 'tisonnier' && id === 'cheminee' && !flags.fireplaceCleared) {
      soundEngine.playKeyPickup();
      setFlags((f) => ({ ...f, fireplaceCleared: true }));
      giveItem('cle_argent');
      setSelectedItem(null);
      setNarrativeTitle("L'Âtre de la Cheminée");
      setNarrativeText(
        "À l'aide du Tisonnier en Fer Forgé, vous écartez les bûches fumantes et retirez le petit coffret de fonte. À l'intérieur brille une Petite Clé d'Argent finement ciselée !"
      );
      setNarrativeSubtext("🗝️ Objet obtenu : Petite Clé d'Argent (Ouvre le tiroir du Secrétaire).");
      return;
    }

    if (selectedItem === 'cle_argent' && id === 'secretaire' && !flags.deskUnlocked) {
      soundEngine.playUnlockSuccess();
      setFlags((f) => ({ ...f, deskUnlocked: true }));
      giveItem('cle_horloger');
      giveItem('feuillet_code');
      setMatches((m) => m + 1);
      setSelectedItem(null);
      setNarrativeTitle('Le Secrétaire en Acajou');
      setNarrativeText(
        "La Petite Clé d'Argent tourne dans la serrure avec un déclic cristallin ! Dans le double-fond du tiroir, vous découvrez la Clé d'Horloger en Laiton, le Feuillet Chiffré de Malakor et une allumette soufrée de réserve."
      );
      setNarrativeSubtext(
        "🗝️ Objets obtenus : Clé d'Horloger, Feuillet Chiffré (☽ → 🪶 → 💀) et +1 Allumette !"
      );
      return;
    }

    if (selectedItem === 'cle_horloger' && id === 'horloge' && !flags.clockWound) {
      soundEngine.playClockChime();
      setFlags((f) => ({ ...f, clockWound: true }));
      giveItem('medaillon_corbeau');
      setSelectedItem(null);
      setNarrativeTitle("L'Horloge Comtoise  :  Minuit Sonne !");
      setNarrativeText(
        "Vous insérez la Clé d'Horloger dans le cadran et remontez le ressort. Les aiguilles bondissent sur XII ! Un carillon grave résonne dans le salon et une trappe secrète s'ouvre au bas de l'horloge, révélant le Médaillon du Corbeau."
      );
      setNarrativeSubtext(
        '🦅 Objet obtenu : Médaillon du Corbeau (S’insère sur le Coffre Reliquaire en Laiton).'
      );
      return;
    }

    if (selectedItem === 'medaillon_corbeau' && id === 'coffre_laiton') {
      soundEngine.playKeyPickup();
      setFlags((f) => ({ ...f, medallionPlaced: true }));
      setSelectedItem(null);
      setIsBrassLockOpen(true);
      return;
    }

    if (selectedItem === 'cle_sortie' && id === 'porte_sortie') {
      soundEngine.playUnlockSuccess();
      setFlags((f) => ({ ...f, doorUnlocked: true }));
      setGameState('victory');
      return;
    }

    // Standard Hotspot Inspection Descriptions
    switch (id) {
      case 'horloge':
        setNarrativeTitle("L'Horloge Comtoise");
        setNarrativeText(
          flags.clockWound
            ? "Le grand balancier de laiton oscille désormais avec régularité. Les aiguilles indiquent minuit pile et le compartiment secret du socle est grand ouvert."
            : "Une haute horloge comtoise en noyer sculpté. Ses aiguilles sont figées et un orifice carré attend une Clé d'Horloger. Sur le bois est gravé : « Quand sonnera l'heure des âmes, le corbeau livrera son sceau. »"
        );
        setNarrativeSubtext(
          !flags.clockMatchTaken
            ? 'Une fente poussiéreuse au bas du socle semble contenir quelque chose.'
            : null
        );
        break;

      case 'portrait':
        setFlags((f) => ({ ...f, portraitRuneSeen: true }));
        setNarrativeTitle('Le Portrait du Comte Malakor');
        setNarrativeText(
          "Une huile sur toile représentant le maître des lieux. Sous la lueur chaude de votre courge, un symbole cabalistique peint au vernis phosphorique s'illumine au-dessus de son front : la Lune (☽) accompagnée du chiffre 7 !"
        );
        setNarrativeSubtext(
          !flags.portraitMatchesTaken
            ? 'Indice noté : ☽ = 7. De plus, le coin inférieur droit de la toile est légèrement décollé...'
            : 'Indice spectral confirmé : 1° Lune (☽) = 7.'
        );
        break;

      case 'gueridon':
        setNarrativeTitle('Le Guéridon & Le Candélabre');
        setNarrativeText(
          "Un guéridon tripode en acajou supportant un candélabre d'argent terni et une petite tabatière en porcelaine verte. Les courants d'air ont figé des larmes de cire pure sur les bobèches."
        );
        setNarrativeSubtext(
          !flags.gueridonWaxTaken || !flags.gueridonMatchTaken
            ? 'Vous pouvez récolter la cire restante et inspecter la tabatière.'
            : 'Vous avez déjà récupéré la cire et l’allumette du guéridon.'
        );
        break;

      case 'porte_parapluie':
        setNarrativeTitle('Le Serviteur de Cheminée & Le Manteau');
        setNarrativeText(
          "Près de l'âtre se dresse un porte-ustensiles en fer forgé ainsi qu'une pèlerine de velours bordeaux oubliée par un visiteur d'autrefois."
        );
        setNarrativeSubtext(
          !flags.pokerTaken
            ? 'Un robuste Tisonnier en Fer Forgé y est suspendu.'
            : 'Le support métallique est désormais vide.'
        );
        break;

      case 'cheminee':
        setNarrativeTitle("L'Âtre de la Cheminée");
        setNarrativeText(
          flags.fireplaceCleared
            ? "Les braises rougeoyantes s'éteignent doucement sous le manteau de pierre sculpté. Le coffret de fonte que vous en avez extrait gît ouvert sur les dalles."
            : "Des bûches calcinées couvent encore sous une épaisse couche de cendre chaude. Au fond du foyer, derrière la grille, vous distinguez l'éclat métallique d'un petit coffret de fonte impossible à saisir à mains nues."
        );
        setNarrativeSubtext(
          !flags.fireplaceCleared
            ? inventory.includes('tisonnier')
              ? 'Utilisez votre Tisonnier en Fer Forgé pour tirer le coffret hors des braises !'
              : 'Il vous faudrait un long outil en fer (comme un Tisonnier) pour l’atteindre.'
            : "Vous avez déjà récupéré la Petite Clé d'Argent dans les cendres."
        );
        break;

      case 'fenetre':
        setFlags((f) => ({ ...f, windowRuneSeen: true }));
        setNarrativeTitle('La Fenêtre en Ogive & Le Corbeau');
        setNarrativeText(
          "La pluie d'octobre fouette les vitraux plombés tandis qu'un grand corbeau noir vous observe en silence. En approchant votre lanterne de la vitre embuée, un dessin de Plume (🪶) et le chiffre 3 apparaissent dans le givre !"
        );
        setNarrativeSubtext(
          !flags.windowWaxTaken
            ? 'Indice noté : 🪶 = 3. Un morceau de cire d’abeille repose aussi sur le rebord de pierre.'
            : 'Indice spectral confirmé : 2° Plume (🪶) = 3.'
        );
        break;

      case 'secretaire':
        setNarrativeTitle('Le Secrétaire en Acajou & Le Grimoire');
        setNarrativeText(
          flags.deskUnlocked
            ? "Le secrétaire d'époque Napoléon III. Son tiroir à serrure d'argent est ouvert, et le Grimoire de cuir du Comte Malakor est déployé sur le buvard."
            : "Un élégant bureau en acajou. Sur le pupitre repose un épais Grimoire relié de cuir fauve. Juste en dessous, un tiroir secret est condamné par une fine serrure en argent."
        );
        setNarrativeSubtext(
          !flags.deskUnlocked && inventory.includes('cle_argent')
            ? "Vous possédez la Petite Clé d'Argent capable d'ouvrir ce tiroir !"
            : 'Consultez le Grimoire pour connaître les secrets du manoir.'
        );
        break;

      case 'etagere_crane':
        setFlags((f) => ({ ...f, skullRuneSeen: true }));
        setNarrativeTitle("L'Étagère d'Alchimie & Le Crâne");
        setNarrativeText(
          "Une étagère chargée de fioles d'élixir et d'ouvrages hermétiques. Au centre trône un crâne d'étude anatomique : sous le faisceau de votre lanterne, son os frontal révèle le symbole du Crâne (💀) suivi du chiffre 9 !"
        );
        setNarrativeSubtext(
          !flags.shelfWaxTaken
            ? 'Indice noté : 💀 = 9. Une chandelle de suif intacte est glissée derrière les livres.'
            : 'Indice spectral confirmé : 3° Crâne (💀) = 9.'
        );
        break;

      case 'coffre_laiton':
        setNarrativeTitle('Le Coffre Reliquaire en Laiton');
        setNarrativeText(
          flags.safeUnlocked
            ? "Le coffre reliquaire en laiton est grand ouvert ! Vous en avez retiré la Clé Maîtresse de la Sortie."
            : "Un lourd coffre scellé au lambris de chêne. Son couvercle comporte une empreinte octogonale destinée à un médaillon, ainsi que trois rouleaux chiffrés marqués des symboles : Lune (☽), Plume (🪶) et Crâne (💀)."
        );
        setNarrativeSubtext(
          flags.safeUnlocked
            ? 'Dirigez-vous vers la Lourde Porte de Chêne à droite !'
            : 'Cliquez sur le bouton ci-dessous pour manipuler les trois rouleaux de laiton.'
        );
        break;

      case 'tapis':
        setNarrativeTitle('Le Tapis Persan Usé');
        setNarrativeText(
          "Un grand tapis d'Orient aux motifs grenat élimés par les décennies. L'un de ses coins est replié sur le parquet de chêne, laissant apparaître des griffures anciennes et une inscription à la craie : « Le regard du Comte (☽), le souffle du Corbeau (🪶), la mémoire du Crâne (💀). »"
        );
        setNarrativeSubtext(
          !flags.rugMatchTaken
            ? 'Une boîte d’allumettes a glissé sous le rebord du tapis.'
            : 'Les griffures du parquet rappellent l’ordre des trois symboles.'
        );
        break;

      case 'porte_sortie':
        setNarrativeTitle('La Lourde Porte de Chêne (Sortie)');
        if (inventory.includes('cle_sortie')) {
          setNarrativeText(
            "L'imposante porte bardée de fer forgé qui mène hors du Manoir de Valombre ! Vous tenez dans votre main la Clé Maîtresse ornée d'une courge."
          );
          setNarrativeSubtext('Insérez la Clé Maîtresse pour déverrouiller la porte et vous échapper !');
        } else {
          soundEngine.playDoorLocked();
          setNarrativeText(
            "Vous tirez de toutes vos forces sur l'anneau de fer, mais le pêne ne bouge pas d'un millimètre. L'écusson de la serrure représente une courge grimaçante : seule la Clé Maîtresse enfermée dans le Coffre Reliquaire pourra l'ouvrir."
          );
          setNarrativeSubtext('Trouvez la Clé Maîtresse de la Sortie avant que votre bougie ne s’éteigne.');
        }
        break;
    }
  };

  // Build contextual interactive choices for the bottom Narrative Ledger
  const getHotspotChoices = (): NarrativeChoice[] => {
    const choices: NarrativeChoice[] = [];

    if (!activeHotspot) {
      choices.push(
        {
          id: 'go_gueridon',
          label: 'Inspecter le Guéridon (Cire & Allumette)',
          highlight: 'amber',
          onClick: () => handleSelectHotspot('gueridon'),
        },
        {
          id: 'go_portrait',
          label: 'Examiner le Portrait du Comte (☽)',
          onClick: () => handleSelectHotspot('portrait'),
        },
        {
          id: 'go_secretaire',
          label: 'Lire le Grimoire sur le Secrétaire',
          highlight: 'verdigris',
          onClick: () => {
            handleSelectHotspot('secretaire');
            setIsGrimoireOpen(true);
          },
        }
      );
      return choices;
    }

    switch (activeHotspot) {
      case 'horloge':
        if (!flags.clockMatchTaken) {
          choices.push({
            id: 'take_clock_match',
            label: 'Fouiller la fente du socle (+1 Allumette)',
            highlight: 'amber',
            onClick: () => {
              soundEngine.playKeyPickup();
              setFlags((f) => ({ ...f, clockMatchTaken: true }));
              setMatches((m) => m + 1);
              setNarrativeSubtext('🔥 Vous trouvez 1 Allumette soufrée cachée dans le socle de l’horloge !');
            },
          });
        }
        if (!flags.clockWound && inventory.includes('cle_horloger')) {
          choices.push({
            id: 'wind_clock',
            label: "Remonter l'horloge avec la Clé d'Horloger",
            highlight: 'amber',
            onClick: () => {
              soundEngine.playClockChime();
              setFlags((f) => ({ ...f, clockWound: true }));
              giveItem('medaillon_corbeau');
              setNarrativeText(
                "Vous tournez la Clé d'Horloger : les rouages s'éveillent et l'horloge sonne douze coups graves ! Une trappe s'ouvre à la base, dévoilant le Médaillon du Corbeau."
              );
              setNarrativeSubtext('🦅 Objet obtenu : Médaillon du Corbeau !');
            },
          });
        }
        break;

      case 'portrait':
        if (!flags.portraitMatchesTaken) {
          choices.push({
            id: 'take_portrait_matches',
            label: 'Soulever le coin déchiré de la toile (+2 Allumettes)',
            highlight: 'amber',
            onClick: () => {
              soundEngine.playKeyPickup();
              setFlags((f) => ({ ...f, portraitMatchesTaken: true }));
              setMatches((m) => m + 2);
              setNarrativeSubtext(
                '🔥 Vous découvrez une pochette de 2 Allumettes soufrées dissimulée derrière le cadre !'
              );
            },
          });
        }
        break;

      case 'gueridon':
        if (!flags.gueridonWaxTaken) {
          choices.push({
            id: 'take_gueridon_wax',
            label: 'Récolter le bout de chandelle (+30% Bougie)',
            highlight: 'amber',
            onClick: () => {
              setFlags((f) => ({ ...f, gueridonWaxTaken: true }));
              addCandleWax(30, 'Le bout de chandelle en cire pure');
            },
          });
        }
        if (!flags.gueridonMatchTaken) {
          choices.push({
            id: 'take_gueridon_match',
            label: 'Ouvrir la tabatière en porcelaine (+1 Allumette)',
            highlight: 'verdigris',
            onClick: () => {
              soundEngine.playKeyPickup();
              setFlags((f) => ({ ...f, gueridonMatchTaken: true }));
              setMatches((m) => m + 1);
              setNarrativeSubtext(
                '🔥 La tabatière contenait 1 Allumette soufrée bien au sec !'
              );
            },
          });
        }
        break;

      case 'porte_parapluie':
        if (!flags.pokerTaken) {
          choices.push({
            id: 'take_poker',
            label: 'Prendre le Tisonnier en Fer Forgé',
            highlight: 'amber',
            onClick: () => {
              setFlags((f) => ({ ...f, pokerTaken: true }));
              giveItem('tisonnier');
              setNarrativeSubtext(
                "🛠️ Objet obtenu : Tisonnier en Fer Forgé ! Utilisez-le sur l'Âtre de la Cheminée."
              );
            },
          });
        }
        if (!flags.coatMatchTaken) {
          choices.push({
            id: 'take_coat_match',
            label: 'Fouiller la poche du manteau de velours (+1 Allumette)',
            onClick: () => {
              soundEngine.playKeyPickup();
              setFlags((f) => ({ ...f, coatMatchTaken: true }));
              setMatches((m) => m + 1);
              setNarrativeSubtext(
                '🔥 Vous trouvez 1 Allumette soufrée et un billet de train daté du 31 Octobre 1894.'
              );
            },
          });
        }
        break;

      case 'cheminee':
        if (!flags.fireplaceCleared) {
          if (inventory.includes('tisonnier')) {
            choices.push({
              id: 'use_poker_fireplace',
              label: 'Extraire le coffret des braises avec le Tisonnier',
              highlight: 'amber',
              onClick: () => {
                soundEngine.playKeyPickup();
                setFlags((f) => ({ ...f, fireplaceCleared: true }));
                giveItem('cle_argent');
                setNarrativeText(
                  "Le crochet du Tisonnier agrippe l'anneau du coffret de fonte et le tire hors des braises. En l'ouvrant, vous récupérez la Petite Clé d'Argent !"
                );
                setNarrativeSubtext(
                  "🗝️ Objet obtenu : Petite Clé d'Argent (Déverrouille le tiroir du Secrétaire)."
                );
              },
            });
          } else {
            choices.push({
              id: 'touch_embers',
              label: 'Tenter de fouiller les cendres à mains nues',
              highlight: 'crimson',
              onClick: () => {
                soundEngine.playColdDraft();
                setCandleLife((c) => Math.max(5, c - 5));
                setNarrativeSubtext(
                  "Aïe ! La chaleur des braises vous repousse et le courant d'air de la cheminée fait vaciller votre bougie (-5%). Prenez le Tisonnier juste à gauche !"
                );
              },
            });
          }
        }
        break;

      case 'fenetre':
        if (!flags.windowWaxTaken) {
          choices.push({
            id: 'take_window_wax',
            label: "Prendre la cire d'abeille sur le rebord (+25% Bougie)",
            highlight: 'amber',
            onClick: () => {
              setFlags((f) => ({ ...f, windowWaxTaken: true }));
              addCandleWax(25, "Le morceau de cire d'abeille");
            },
          });
        }
        break;

      case 'secretaire':
        choices.push({
          id: 'open_grimoire',
          label: 'Feuilleter le Grimoire du Comte Malakor',
          highlight: 'verdigris',
          onClick: () => {
            soundEngine.playClickObject();
            setFlags((f) => ({ ...f, grimoireRead: true }));
            setIsGrimoireOpen(true);
          },
        });
        if (!flags.deskUnlocked && inventory.includes('cle_argent')) {
          choices.push({
            id: 'unlock_desk_drawer',
            label: "Ouvrir le tiroir avec la Petite Clé d'Argent",
            highlight: 'amber',
            onClick: () => {
              soundEngine.playUnlockSuccess();
              setFlags((f) => ({ ...f, deskUnlocked: true }));
              giveItem('cle_horloger');
              giveItem('feuillet_code');
              setMatches((m) => m + 1);
              setNarrativeText(
                "La Petite Clé d'Argent déverrouille le tiroir secret ! Vous y prenez la Clé d'Horloger en Laiton, le Feuillet Chiffré (☽ → 🪶 → 💀) ainsi qu'une allumette soufrée."
              );
              setNarrativeSubtext(
                "🗝️ Objets obtenus : Clé d'Horloger, Feuillet Chiffré et +1 Allumette !"
              );
            },
          });
        }
        break;

      case 'etagere_crane':
        if (!flags.shelfWaxTaken) {
          choices.push({
            id: 'take_shelf_wax',
            label: 'Prendre la chandelle de suif derrière les livres (+35% Bougie)',
            highlight: 'amber',
            onClick: () => {
              setFlags((f) => ({ ...f, shelfWaxTaken: true }));
              addCandleWax(35, 'La chandelle de suif intacte');
            },
          });
        }
        break;

      case 'coffre_laiton':
        if (!flags.safeUnlocked) {
          choices.push({
            id: 'open_brass_lock_modal',
            label: 'Manipuler la serrure à 3 rouleaux de laiton (☽ - 🪶 - 💀)',
            highlight: 'amber',
            onClick: () => {
              soundEngine.playClickObject();
              setIsBrassLockOpen(true);
            },
          });
        }
        break;

      case 'tapis':
        if (!flags.rugMatchTaken) {
          choices.push({
            id: 'take_rug_match',
            label: 'Ramasser la boîte sous le tapis (+1 Allumette)',
            highlight: 'amber',
            onClick: () => {
              soundEngine.playKeyPickup();
              setFlags((f) => ({ ...f, rugMatchTaken: true }));
              setMatches((m) => m + 1);
              setNarrativeSubtext(
                '🔥 Vous récupérez 1 Allumette soufrée dissimulée sous le tapis persan !'
              );
            },
          });
        }
        break;

      case 'porte_sortie':
        if (inventory.includes('cle_sortie')) {
          choices.push({
            id: 'escape_manor_now',
            label: 'Déverrouiller la Lourde Porte avec la Clé Maîtresse !',
            highlight: 'amber',
            onClick: () => {
              soundEngine.playUnlockSuccess();
              setFlags((f) => ({ ...f, doorUnlocked: true }));
              setGameState('victory');
            },
          });
        } else {
          choices.push({
            id: 'inspect_coffre_shortcut',
            label: 'Aller examiner le Coffre Reliquaire en Laiton',
            onClick: () => handleSelectHotspot('coffre_laiton'),
          });
        }
        break;
    }

    return choices;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070609] flex flex-col justify-between select-none">
      {/* =================================================================== */}
      {/* TOP-LEFT FLOATING COURGE LANTERN & MATCHBOX HUD                     */}
      {/* =================================================================== */}
      <LanternHud
        candleLife={candleLife}
        matches={matches}
        isBlackout={isBlackout}
        graceSeconds={graceSeconds}
        onStrikeMatch={handleStrikeMatch}
        cluesFoundCount={cluesFoundCount}
      />

      {/* =================================================================== */}
      {/* TOP-RIGHT FLOATING UTILITY BAR (GRIMOIRE, VISIBILITY, AUDIO)        */}
      {/* =================================================================== */}
      <div className="fixed top-3 right-3 z-30 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => {
            soundEngine.playClickObject();
            setIsGrimoireOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1C161E]/88 hover:bg-[#FF7A00]/20 text-[#FFD166] border border-[#FF8C28]/35 backdrop-blur-md shadow-lg text-xs font-semibold transition-all cursor-pointer"
          title="Consulter le Grimoire de Valombre et vos indices"
        >
          <BookOpen className="w-4 h-4 text-[#FF7A00]" />
          <span className="hidden sm:inline">Grimoire & Indices</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClickObject();
            setHighVisibilityMode((v) => !v);
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border backdrop-blur-md shadow-lg text-xs font-semibold transition-all cursor-pointer ${
            highVisibilityMode
              ? 'bg-[#FF7A00]/25 border-[#FFD166] text-[#FFD166]'
              : 'bg-[#1C161E]/88 border-[#FF8C28]/30 text-[#A69580] hover:text-[#EFE6D5]'
          }`}
          title="Basculer entre le faisceau réaliste de la lanterne et la vision éclairée"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden md:inline">
            {highVisibilityMode ? 'Vision : Salon Éclairé' : 'Vision : Faisceau Lanterne'}
          </span>
        </button>

        <button
          onClick={() => {
            const nextMute = !isMuted;
            soundEngine.muted = nextMute;
            setIsMuted(nextMute);
          }}
          className="p-2 rounded-xl bg-[#1C161E]/88 hover:bg-[#FF7A00]/20 text-[#EFE6D5] border border-[#FF8C28]/30 backdrop-blur-md shadow-lg transition-all cursor-pointer"
          title={isMuted ? 'Activer le son' : 'Couper le son'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#9E2A2B]" /> : <Volume2 className="w-4 h-4 text-[#FFD166]" />}
        </button>

        <button
          onClick={handleStartGame}
          className="p-2 rounded-xl bg-[#1C161E]/88 hover:bg-[#9E2A2B]/30 text-[#A69580] hover:text-[#EFE6D5] border border-[#FF8C28]/30 backdrop-blur-md shadow-lg transition-all cursor-pointer"
          title="Recommencer la partie"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* =================================================================== */}
      {/* EMERGENCY BLACKOUT BANNER (WHEN CANDLE REACHES 0% WITH MATCHES)     */}
      {/* =================================================================== */}
      {isBlackout && gameState === 'playing' && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl bg-[#1a0708]/95 border-2 border-[#D94E1F] shadow-[0_0_40px_rgba(217,78,31,0.85)] flex items-center gap-4 animate-bounce">
          <Flame className="w-6 h-6 text-[#FF7A00]" />
          <div className="text-left">
            <div className="font-display text-sm text-[#FFD166] uppercase tracking-wider">
              La Bougie S’est Éteinte ! ({graceSeconds}s)
            </div>
            <div className="text-xs text-[#EFE6D5]">
              Les ombres approchent... Craquez vite une allumette pour rallumer la courge !
            </div>
          </div>
          {matches > 0 && (
            <button
              onClick={handleStrikeMatch}
              className="px-4 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#FFD166] text-[#070609] font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
            >
              🔥 Craquer une Allumette
            </button>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* PRIMARY VIEWPORT: INTERACTIVE HAUNTED MANOR ROOM CANVAS             */}
      {/* =================================================================== */}
      <div className="relative flex-1 w-full overflow-hidden">
        <ManorRoomCanvas
          candleLife={candleLife}
          isBlackout={isBlackout}
          flags={flags}
          activeHotspot={activeHotspot}
          selectedItem={selectedItem}
          highVisibilityMode={highVisibilityMode}
          matchFlash={matchFlash}
          onSelectHotspot={handleSelectHotspot}
          onDiscoverRune={handleDiscoverRune}
        />
      </div>

      {/* =================================================================== */}
      {/* BOTTOM DOCK: NARRATIVE LEDGER & 6-SLOT SATCHEL INVENTORY            */}
      {/* =================================================================== */}
      <NarrativeLedgerDock
        activeHotspot={activeHotspot}
        narrativeTitle={narrativeTitle}
        narrativeText={narrativeText}
        narrativeSubtext={narrativeSubtext}
        choices={getHotspotChoices()}
        inventory={inventory}
        selectedItem={selectedItem}
        onSelectItem={(item) => {
          soundEngine.playClickObject();
          if (item === 'feuillet_code') {
            setIsGrimoireOpen(true);
          }
          setSelectedItem(item);
        }}
        onRequestHint={() => {
          soundEngine.playWaxBoost();
          const hint = getContextualHint(flags, matches, candleLife);
          setNarrativeSubtext(`🕯️ Murmure de la Courge : ${hint}`);
        }}
        onQuickTravelHotspot={handleSelectHotspot}
        visitedHotspots={visitedHotspots}
      />

      {/* =================================================================== */}
      {/* MODALS: GRIMOIRE DIARY, BRASS COMBINATION SAFE, TITLE/END OVERLAYS  */}
      {/* =================================================================== */}
      <GrimoireModal
        isOpen={isGrimoireOpen}
        onClose={() => setIsGrimoireOpen(false)}
        flags={flags}
      />

      <BrassLockModal
        isOpen={isBrassLockOpen}
        onClose={() => setIsBrassLockOpen(false)}
        flags={flags}
        hasMedallion={inventory.includes('medaillon_corbeau')}
        onPlaceMedallion={() => {
          setFlags((f) => ({ ...f, medallionPlaced: true }));
        }}
        onUnlockSuccess={() => {
          setFlags((f) => ({ ...f, safeUnlocked: true, medallionPlaced: true }));
          giveItem('cle_sortie');
          setIsBrassLockOpen(false);
          setActiveHotspot('coffre_laiton');
          setNarrativeTitle('Le Coffre Reliquaire S’ouvre !');
          setNarrativeText(
            "Sous l'alignement du code 7 - 3 - 9 et du Médaillon du Corbeau, les pênes de laiton cèdent dans un claquement solennel ! Sur un coussin de velours noir repose la Clé Maîtresse de la Sortie."
          );
          setNarrativeSubtext(
            '🗝️ Objet obtenu : Clé Maîtresse de la Sortie ! Cliquez sur la Lourde Porte de Chêne tout à droite !'
          );
        }}
      />

      <GameOverlayModal
        gameState={gameState}
        difficulty={difficulty}
        onSelectDifficulty={(d) => {
          soundEngine.playClickObject();
          setDifficulty(d);
        }}
        onStartGame={handleStartGame}
        candleLife={candleLife}
        matchesLeft={matches}
        elapsedSeconds={elapsedSeconds}
        cluesCount={cluesFoundCount}
      />
    </div>
  );
}

export default App;
