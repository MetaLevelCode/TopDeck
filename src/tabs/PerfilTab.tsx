import { useState, useMemo, useCallback } from 'react';
import type { FormEvent } from 'react';
import {
  Trophy,
  Swords,
  Award,
  Share2,
  Download,
  Eye,
  BarChart2,
  ShoppingBag,
  Check,
  Search,
  Shield,
  Dices,
  BookOpen,
  SlidersHorizontal,
  History,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Dialog } from '../components/Dialog';
import { formatUSD } from '../lib/format';
import { useCart } from '../store/cart';
import { useDexter } from '../store/dexter';
import { useSession } from '../store/session';

/* ==========================================================================
   TIPOS & MODELOS DE DATOS DEL PERFIL DEL DUELISTA
   ========================================================================== */

export interface TcgGameData {
  id: string;
  name: string;
  badge: string;
  dotColor: string;
  record: string;
  winRate: string;
  totalGames: string;
  playPercent: number;
  drawPercent: number;
  tacticalNote: string;
  matchups: Array<{ label: string; wr: string; favorable: boolean }>;
  formats: string[];
  activeDecksCount: number;
}

export interface DeckMissingCard {
  id: string;
  name: string;
  set: string;
  priceUsd: number;
  image: string;
}

export interface TournamentDeck {
  id: string;
  rank: number;
  medal?: 'gold' | 'silver' | 'bronze';
  medalLabel?: string;
  format: string;
  moxfieldId: string;
  name: string;
  cardName: string;
  roleSubtitle: string;
  artUrl: string;
  foilBadge?: string;
  strategy: string;
  record: { wins: number; losses: number };
  winRate: string;
  lastTournament: {
    result: string;
    event: string;
  };
  vaultValueUsd: number;
  missingCards?: DeckMissingCard[];
  deckListPreview?: {
    commander?: string;
    creatures: string[];
    spells: string[];
    artifacts: string[];
    lands: string[];
  };
  statsByMatchup?: Array<{ archetype: string; wr: string; note: string }>;
  sideboard?: string[];
}

export interface MatchRecord {
  id: string;
  date: string;
  formatTag: string;
  tournament: string;
  deck: string;
  opponent: string;
  result: string;
  isWin: boolean;
  prizeAndElo: string;
}

// 4 Juegos TCG oficiales
const TCG_GAMES: TcgGameData[] = [
  {
    id: 'mtg',
    name: 'Magic: The Gathering',
    badge: '92W - 34L',
    dotColor: '#F97316',
    record: '92W - 34L',
    winRate: '73.0%',
    totalGames: '126 partidas oficiales',
    playPercent: 64,
    drawPercent: 78,
    tacticalNote: 'Resiliencia en Draw',
    matchups: [
      { label: 'vs Control', wr: '80% W', favorable: true },
      { label: 'vs Aggro', wr: '71% W', favorable: true },
      { label: 'vs Combo', wr: '62% W', favorable: true },
    ],
    formats: ['Commander', 'Modern', 'Pioneer'],
    activeDecksCount: 6,
  },
  {
    id: 'pokemon',
    name: 'Pokémon TCG',
    badge: '28W - 16L',
    dotColor: '#EAB308',
    record: '28W - 16L',
    winRate: '63.6%',
    totalGames: '44 partidas oficiales',
    playPercent: 68,
    drawPercent: 59,
    tacticalNote: 'Consistencia Turno 1',
    matchups: [
      { label: 'vs Charizard ex', wr: '75% W', favorable: true },
      { label: 'vs Lugia VSTAR', wr: '66% W', favorable: true },
      { label: 'vs Gardevoir', wr: '50% W', favorable: false },
    ],
    formats: ['Standard', 'GLC'],
    activeDecksCount: 3,
  },
  {
    id: 'onepiece',
    name: 'One Piece CG',
    badge: '18W - 8L',
    dotColor: '#EF4444',
    record: '18W - 8L',
    winRate: '69.2%',
    totalGames: '26 partidas oficiales',
    playPercent: 70,
    drawPercent: 68,
    tacticalNote: 'Presión de DON!! Temprana',
    matchups: [
      { label: 'vs Sakazuki', wr: '75% W', favorable: true },
      { label: 'vs Law (Red/Purple)', wr: '70% W', favorable: true },
      { label: 'vs Enel (Yellow)', wr: '60% W', favorable: true },
    ],
    formats: ['Standard OP'],
    activeDecksCount: 2,
  },
  {
    id: 'yugioh',
    name: 'Yu-Gi-Oh!',
    badge: '4W - 4L',
    dotColor: '#A855F7',
    record: '4W - 4L',
    winRate: '50.0%',
    totalGames: '8 partidas oficiales',
    playPercent: 60,
    drawPercent: 40,
    tacticalNote: 'Interrupciones Handtraps',
    matchups: [
      { label: 'vs Snake-Eye', wr: '50% W', favorable: false },
      { label: 'vs Tenpai Dragon', wr: '50% W', favorable: false },
      { label: 'vs Yubel', wr: '50% W', favorable: false },
    ],
    formats: ['Advanced TCG'],
    activeDecksCount: 1,
  },
];

// Mazos clasificados
const TOURNAMENT_DECKS: TournamentDeck[] = [
  {
    id: 'deck-1',
    rank: 1,
    medal: 'gold',
    medalLabel: '1er Lugar / Medalla de Oro',
    format: 'Commander / EDH',
    moxfieldId: 'mox-8912',
    name: 'Dimir Ritual Chamber // Unholy Control',
    cardName: 'Unholy Annex // Ritual Chamber',
    roleSubtitle: 'Comandante & Motor Principal',
    artUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiPJKqCR_Xi8UZ79FcCNbEKDiLQx1k-353j2VG_iZmF-t-7SGc-WiqASxNOFpNnBQltkFtXi8cAQhM_RgBNlKPlRVR71WxHvJiniZwnAYxEWo5IdPAsnNpjJXWowtjs-1ccodgvuxgYJzy8BWYudVwqmI-BZmS003G2fjZFhE7RkbXSW3soTQLVDUEXXUAxY0SJKE8UKU2DxY0MTqakjGNKvUX2RKH3rXZKRKBg13og6dNp0bTBSpq',
    foilBadge: 'Foil MVP',
    strategy:
      'Estrategia de descarte sistemático, robo sostenido de salas y finishers demoníacos 6/6 con evasión aérea.',
    record: { wins: 38, losses: 8 },
    winRate: '82.6%',
    lastTournament: {
      result: '1er Lugar - Torneo FNM Taberna (3 - 0)',
      event: 'FNM Taberna Top Deck',
    },
    vaultValueUsd: 420,
    missingCards: [
      {
        id: 'missing-1',
        name: 'Unholy Annex // Ritual Chamber (Borderless Foil)',
        set: 'Duskmourn: House of Horror',
        priceUsd: 24.5,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAiPJKqCR_Xi8UZ79FcCNbEKDiLQx1k-353j2VG_iZmF-t-7SGc-WiqASxNOFpNnBQltkFtXi8cAQhM_RgBNlKPlRVR71WxHvJiniZwnAYxEWo5IdPAsnNpjJXWowtjs-1ccodgvuxgYJzy8BWYudVwqmI-BZmS003G2fjZFhE7RkbXSW3soTQLVDUEXXUAxY0SJKE8UKU2DxY0MTqakjGNKvUX2RKH3rXZKRKBg13og6dNp0bTBSpq',
      },
      {
        id: 'missing-2',
        name: 'Demonic Tutor (Retro Frame Foil)',
        set: 'Dominaria Remastered',
        priceUsd: 38.0,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuATo-E0CydYl8URZDGsO40Tc98kBdwunfNB1hVukobHKnx86JMTS1t9hEdF-gnq-u3QiSZdyavTpaw2uu0jssmfjsxsJczZY4We1gy_B2YiIgur0mBaKu4ulPiOHVHxSremZR2d2PhhZDLPVSkKPZgSuMQflIAW410G2JYAGaIyd61QwQjBQn5uPpIsJz2HkKWfYYnAdvOJMOSLSyBQixKwHCqHShx7kT_aZSzL9dGs-SJW3d3cz3Et',
      },
      {
        id: 'missing-3',
        name: 'Polluted Delta (Modern Horizons 3)',
        set: 'Modern Horizons 3',
        priceUsd: 14.0,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBi03lxcctMx9PNz-8KSyDW_qiZ1rCE2aVAx3rsZRnDC45gQSKglo6WfdflzBSqbj1Zl7y4f2Cpfaji0u1OEvuMikNWWkFMV7_OKE-u1aNnI3ffTPoe5oOkfNuKtEcARyWugqwFPW9Ea2kbfhAdttEzfH47oVoEB5-fwe5zdTxjEDclk99lHTl-d1AD6Vb7dj5J-DT2qmLfAtbN9yzWzl_DfAGftoBq4cgKCmv_KRIPgBE0ai_Whdy3',
      },
    ],
    deckListPreview: {
      commander: 'Unholy Annex // Ritual Chamber',
      creatures: [
        'Orcish Bowmasters',
        'Dauthi Voidwalker',
        'Sheoldred, the Apocalypse',
        'Braids, Arisen Nightmare',
        'Archon of Cruelty',
        'Talion, the Kindly Lord',
      ],
      spells: [
        'Force of Will',
        'Mana Drain',
        'Demonic Tutor',
        'Vampiric Tutor',
        'Toxic Deluge',
        'Cyclonic Rift',
      ],
      artifacts: [
        'Sol Ring',
        'Arcane Signet',
        'Rhystic Study',
        'Necropotence',
        'The One Ring',
        'Grim Monolith',
      ],
      lands: [
        'Underground Sea',
        'Watery Grave',
        'Polluted Delta',
        'Morphic Pool',
        'Urborg, Tomb of Yawgmoth',
        'Ancient Tomb',
      ],
    },
    statsByMatchup: [
      { archetype: 'vs Aggro / Go-wide', wr: '85%', note: 'Toxic Deluge y Sheoldred dominan la mesa' },
      { archetype: 'vs Spellslinger Combo', wr: '78%', note: 'Orcish Bowmasters frena los robos masivos' },
      { archetype: 'vs Big Mana / Green Ramp', wr: '82%', note: 'Descarte temprano y robo sostenido' },
    ],
  },
  {
    id: 'deck-2',
    rank: 2,
    medal: 'silver',
    medalLabel: '2do Lugar / Medalla de Plata',
    format: 'Modern',
    moxfieldId: 'mox-4421',
    name: "Urza's Saga Affinity & Retro Relics",
    cardName: "Urza's Saga / Chrome Mox",
    roleSubtitle: 'Motor de Artefactos Modern',
    artUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBi03lxcctMx9PNz-8KSyDW_qiZ1rCE2aVAx3rsZRnDC45gQSKglo6WfdflzBSqbj1Zl7y4f2Cpfaji0u1OEvuMikNWWkFMV7_OKE-u1aNnI3ffTPoe5oOkfNuKtEcARyWugqwFPW9Ea2kbfhAdttEzfH47oVoEB5-fwe5zdTxjEDclk99lHTl-d1AD6Vb7dj5J-DT2qmLfAtbN9yzWzl_DfAGftoBq4cgKCmv_KRIPgBE0ai_Whdy3',
    strategy:
      'Tempo ultra rápido con criaturas artefacto de coste cero y crecimiento exponencial de constructos 8/8.',
    record: { wins: 26, losses: 11 },
    winRate: '70.2%',
    lastTournament: {
      result: 'Top 4 - Clasificatorio Regional Modern',
      event: 'Regional Modern Championship',
    },
    vaultValueUsd: 680,
    sideboard: [
      '3x Chalice of the Void',
      "2x Tormod's Crypt",
      '3x Engineered Explosives',
      '2x Pithing Needle',
      '3x Metallic Rebuke',
      '2x Damping Sphere',
    ],
    deckListPreview: {
      creatures: [
        '4x Ornithopter',
        '4x Memnite',
        '4x Frogmite',
        '4x Sojourner’s Companion',
        '4x Thought Monitor',
      ],
      spells: ['4x Thoughtcast', '4x Galvanic Blast', '4x Metallic Rebuke'],
      artifacts: [
        '4x Springleaf Drum',
        '4x Cranial Plating',
        '4x Shadowspear',
        '1x Retrofitter Foundry',
      ],
      lands: ["4x Urza's Saga", '4x Darksteel Citadel', '4x Mistvault Bridge', '4x Razortide Bridge'],
    },
    statsByMatchup: [
      { archetype: 'vs Izzet Murktide', wr: '72%', note: 'Constructos superan en tamaño a Murktide' },
      { archetype: 'vs Amulet Titan', wr: '58%', note: 'Carrera de daño pura en turnos 3-4' },
      { archetype: 'vs Boros Energy', wr: '68%', note: 'Shadowspear otorga lifelink decisivo' },
    ],
  },
  {
    id: 'deck-3',
    rank: 3,
    medal: 'bronze',
    medalLabel: '3er Lugar / Medalla de Bronce',
    format: 'Pioneer',
    moxfieldId: 'mox-3109',
    name: 'Mono Black Necro-Dominance',
    cardName: 'Demonic Tutor / Necro',
    roleSubtitle: 'Finisher Mono Black Pioneer',
    artUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATo-E0CydYl8URZDGsO40Tc98kBdwunfNB1hVukobHKnx86JMTS1t9hEdF-gnq-u3QiSZdyavTpaw2uu0jssmfjsxsJczZY4We1gy_B2YiIgur0mBaKu4ulPiOHVHxSremZR2d2PhhZDLPVSkKPZgSuMQflIAW410G2JYAGaIyd61QwQjBQn5uPpIsJz2HkKWfYYnAdvOJMOSLSyBQixKwHCqHShx7kT_aZSzL9dGs-SJW3d3cz3Et',
    strategy:
      'Pérdida de vida convertida en ventaja de cartas implacable y removal absoluto de criaturas rivales.',
    record: { wins: 19, losses: 9 },
    winRate: '67.8%',
    lastTournament: {
      result: '2do Lugar - Liga Nocturna Pioneer',
      event: 'Liga Nocturna Pioneer BOG',
    },
    vaultValueUsd: 345,
    missingCards: [
      {
        id: 'missing-mb-1',
        name: 'Thoughtseize (Retro Frame Foil)',
        set: 'Time Spiral Remastered',
        priceUsd: 22.0,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuATo-E0CydYl8URZDGsO40Tc98kBdwunfNB1hVukobHKnx86JMTS1t9hEdF-gnq-u3QiSZdyavTpaw2uu0jssmfjsxsJczZY4We1gy_B2YiIgur0mBaKu4ulPiOHVHxSremZR2d2PhhZDLPVSkKPZgSuMQflIAW410G2JYAGaIyd61QwQjBQn5uPpIsJz2HkKWfYYnAdvOJMOSLSyBQixKwHCqHShx7kT_aZSzL9dGs-SJW3d3cz3Et',
      },
      {
        id: 'missing-mb-2',
        name: 'Fatal Push (FNM Promo)',
        set: 'Friday Night Magic',
        priceUsd: 8.5,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAiPJKqCR_Xi8UZ79FcCNbEKDiLQx1k-353j2VG_iZmF-t-7SGc-WiqASxNOFpNnBQltkFtXi8cAQhM_RgBNlKPlRVR71WxHvJiniZwnAYxEWo5IdPAsnNpjJXWowtjs-1ccodgvuxgYJzy8BWYudVwqmI-BZmS003G2fjZFhE7RkbXSW3soTQLVDUEXXUAxY0SJKE8UKU2DxY0MTqakjGNKvUX2RKH3rXZKRKBg13og6dNp0bTBSpq',
      },
    ],
    deckListPreview: {
      creatures: [
        '4x Bloodsoaked Champion',
        '4x Knight of the Ebon Legion',
        '4x Graveyard Trespasser',
        '2x Sheoldred, the Apocalypse',
      ],
      spells: ['4x Thoughtseize', '4x Fatal Push', '3x Go for the Throat', '2x Extinction Event'],
      artifacts: ['3x Sorin, Imperious Bloodlord', '4x Necrodominance'],
      lands: ['4x Castle Locthwain', '4x Mutavault', '14x Swamp', '2x Hive of the Eye Tyrant'],
    },
    statsByMatchup: [
      { archetype: 'vs Rakdos Midrange', wr: '65%', note: 'Extracción de valor superior con Necro' },
      { archetype: 'vs Phoenix', wr: '74%', note: 'Trespasser limpia el cementerio en cada ataque' },
      { archetype: 'vs Lotus Field', wr: '60%', note: 'Thoughtseize en turno 1 frena el arranque' },
    ],
  },
  {
    id: 'deck-4',
    rank: 4,
    format: 'Commander',
    moxfieldId: 'mox-2180',
    name: 'Golgari Aristocrats & Sacrifice',
    cardName: 'Korvold / Chatterfang',
    roleSubtitle: 'Commander Casual / Mid-Power',
    artUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4_WCzTEjivEXmINnn73GZ45Gv0vVY_C3o1sJkBYHt05eABMUmFvbO_2m6FYxhr-lUpzCg0PNrd616SxOLnAB1mk2cTx02IvOLxcKJo2_IibNvYC6n5XVrB6etX-Cx3tO6Ud7HQzB0l7wqSDo1S7a0Kyh4WhhaTBTSaJuJjWMBi-NUWd_H6RCHFNEjV5pmdXXs2pg8mPRwbBiVddnlu23TTyDSvESSIYefBhgmMP5eKpE7icT6n3vo',
    strategy:
      'Enjambre de tokens, drenaje pasivo de vidas y motores de sacrificio infinitos para mesas multijugador.',
    record: { wins: 9, losses: 6 },
    winRate: '60.0%',
    lastTournament: {
      result: 'Casual Pod 4 Jugadores (Victoria)',
      event: 'Viernes de Pods Taberna',
    },
    vaultValueUsd: 290,
    deckListPreview: {
      commander: 'Chatterfang, Squirrel General',
      creatures: [
        'Zulaport Cutthroat',
        'Blood Artist',
        'Pitiless Plunderer',
        'Scute Swarm',
        'Avenger of Zendikar',
      ],
      spells: ['Culling Ritual', 'Assassin’s Trophy', 'Heroic Intervention', 'Demonic Tutor'],
      artifacts: ['Skullclamp', 'Ashnod’s Altar', 'Phyrexian Altar', 'Bastion of Remembrance'],
      lands: ['Overgrown Tomb', 'Undergrowth Stadium', 'Boseiju, Who Endures', '12x Forest', '10x Swamp'],
    },
    statsByMatchup: [
      { archetype: 'vs Pods de 4 Jugadores', wr: '60%', note: 'Drenaje constante a toda la mesa a la vez' },
      { archetype: 'vs Control Boardwipes', wr: '70%', note: 'Heroic Intervention protege el enjambre' },
    ],
  },
];

// Historial de 5 + 2 partidas sancionadas
const MATCH_LOG: MatchRecord[] = [
  {
    id: 'match-1',
    date: '11/09/2026',
    formatTag: 'FNM',
    tournament: 'Torneo Nocturno Taberna',
    deck: 'Dimir Ritual Chamber',
    opponent: 'Carlos V. (Boros Burn)',
    result: '3 - 0 W',
    isWin: true,
    prizeAndElo: '+25 Pts (1er Lugar + Sobre Foil)',
  },
  {
    id: 'match-2',
    date: '04/09/2026',
    formatTag: 'MOD',
    tournament: 'Clasificatorio Regional',
    deck: "Urza's Saga Affinity",
    opponent: 'Mateo R. (Izzet Murktide)',
    result: '2 - 1 W',
    isWin: true,
    prizeAndElo: '+18 Pts (Pase a Top 4)',
  },
  {
    id: 'match-3',
    date: '28/08/2026',
    formatTag: 'MOD',
    tournament: 'Clasificatorio Regional',
    deck: "Urza's Saga Affinity",
    opponent: 'David K. (Amulet Titan)',
    result: '1 - 2 L',
    isWin: false,
    prizeAndElo: '-8 Pts ELO',
  },
  {
    id: 'match-4',
    date: '21/08/2026',
    formatTag: 'EDH',
    tournament: 'Liga Commander cEDH',
    deck: 'Dimir Ritual Chamber',
    opponent: 'Pod 4 (Kraum, Tymna, Yuriko)',
    result: '1 - 0 W',
    isWin: true,
    prizeAndElo: '+30 Pts (Victoria de Pod)',
  },
  {
    id: 'match-5',
    date: '14/08/2026',
    formatTag: 'PIO',
    tournament: 'Liga Nocturna Pioneer',
    deck: 'Mono Black Necro',
    opponent: 'Esteban L. (Rakdos Midrange)',
    result: '2 - 0 W',
    isWin: true,
    prizeAndElo: '+15 Pts (2do Puesto General)',
  },
  {
    id: 'match-6',
    date: '07/08/2026',
    formatTag: 'FNM',
    tournament: 'Torneo Nocturno Taberna',
    deck: 'Dimir Ritual Chamber',
    opponent: 'Andrea S. (Mono Green Tron)',
    result: '2 - 0 W',
    isWin: true,
    prizeAndElo: '+15 Pts (Top 2 Clasificado)',
  },
  {
    id: 'match-7',
    date: '31/07/2026',
    formatTag: 'EDH',
    tournament: 'Viernes Casual Pod',
    deck: 'Golgari Aristocrats',
    opponent: 'Pod 4 (Atraxa, Urza, Prosper)',
    result: '1 - 0 W',
    isWin: true,
    prizeAndElo: '+12 Pts (Puntos de Taberna)',
  },
];

/* ==========================================================================
   COMPONENTE: PERFIL TAB (ADAPTADO AL ESTILO TOP DECK)
   ========================================================================== */

export function PerfilTab() {
  const { user, signIn, signOut } = useSession();
  const { add, setOpen } = useCart();
  const { say } = useDexter();

  // Estados interactivos
  const [selectedGameId, setSelectedGameId] = useState<string>('mtg');
  const [deckSearchQuery, setDeckSearchQuery] = useState<string>('');
  const [showFullHistory, setShowFullHistory] = useState<boolean>(false);
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);

  // Modales
  const [inspectDeck, setInspectDeck] = useState<TournamentDeck | null>(null);
  const [statsDeck, setStatsDeck] = useState<TournamentDeck | null>(null);
  const [sideboardDeck, setSideboardDeck] = useState<TournamentDeck | null>(null);
  const [isImportModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [isSessionModalOpen, setSessionModalOpen] = useState<boolean>(false);
  const [customNameInput, setCustomNameInput] = useState<string>('');

  // Juego activo seleccionado
  const currentGame = useMemo(
    () => TCG_GAMES.find((g) => g.id === selectedGameId) ?? TCG_GAMES[0],
    [selectedGameId],
  );

  // Mazos filtrados
  const filteredDecks = useMemo(() => {
    const q = deckSearchQuery.trim().toLowerCase();
    if (!q) return TOURNAMENT_DECKS;
    return TOURNAMENT_DECKS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.format.toLowerCase().includes(q) ||
        d.cardName.toLowerCase().includes(q) ||
        d.strategy.toLowerCase().includes(q),
    );
  }, [deckSearchQuery]);

  // Nombre y datos del duelista
  const duelistName = user ? user.name : 'Andrés Mejía';
  const duelistHandle = user ? `@${user.name.toLowerCase().replace(/\s+/g, '_')}` : '@andres_planeswalker';
  const duelistId = 'TD-8842';

  // Copiar ficha DCI / Perfil
  const handleShareProfile = useCallback(() => {
    const url = `${window.location.origin}/#perfil?id=${duelistId}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedFeedback(true);
    say('¡Ficha oficial del duelista copiada al portapapeles!', 'smile', 3500);
    setTimeout(() => setCopiedFeedback(false), 2400);
  }, [duelistId, say]);

  // Añadir todas las cartas faltantes de un mazo al morral
  const handleBuyMissing = useCallback(
    (deck: TournamentDeck) => {
      if (!deck.missingCards || deck.missingCards.length === 0) {
        say('Este mazo ya está completo en tu colección personal.', 'smile');
        return;
      }
      deck.missingCards.forEach((card) => {
        add({
          id: `missing-${card.id}`,
          name: card.name,
          price: card.priceUsd,
          kind: 'single',
          subtitle: `${deck.name} (${card.set})`,
          image: card.image,
          game: 'Magic',
        });
      });
      say(`¡${deck.missingCards.length} cartas de «${deck.name}» añadidas al morral!`, 'smile', 4000);
      setOpen(true);
    },
    [add, say, setOpen],
  );

  // Manejo de cambio de sesión / nombre
  const handleSaveSession = (e: FormEvent) => {
    e.preventDefault();
    if (customNameInput.trim()) {
      signIn(customNameInput.trim());
      setSessionModalOpen(false);
      setCustomNameInput('');
    }
  };

  return (
    <div className="space-y-8 text-espresso">
      {/* ====================================================================
          1. HERO / FICHA OFICIAL DEL DUELISTA (ESTILO TABERNA TOP DECK)
          ==================================================================== */}
      <section
        className="panel relative overflow-hidden p-6 sm:p-8"
        aria-label="Ficha Oficial del Duelista"
      >
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* Avatar del Jugador con marco de Taberna */}
          <div className="flex flex-col items-center justify-center lg:col-span-4">
            <div className="relative w-full max-w-[260px] overflow-hidden rounded-xl border border-espresso/10 bg-parchment-well p-2 shadow-lift">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-honey/40 bg-parchment-well">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsF8Fr-Ep6TTMcZfAPSz3jHNSwglKG-3yIXbintNVH1VurfFygzES3tiTDHz0Oe7YpIrXU0UfJYfo7BtvkkbNxStIvyx8pw-5MtT1sgWt0YHiqkGjJbwhWxVddNlOPUNHW9d0c22G0ne9NS2402z2htbnjjnltk_N2dV_95xHcONS0Uu3nSsZp450vDelNg0yLof0xrtfKPXH-sLUhIXyyCK0TKH3LomhQpRzYnbp4f9olyJnBl460_kVOktR24dt_Fw"
                  alt={`Retrato oficial de ${duelistName} en Taberna Top Deck`}
                  className="size-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="eager"
                />

                {/* Badge Flotante "MVP" */}
                <div className="absolute right-2 top-2 rounded border border-honey bg-parchment-well px-2.5 py-0.5 text-xs font-bold text-honey-ink shadow-sm backdrop-blur-sm">
                  ★ MVP
                </div>

                {/* Banner de Victoria 3-0 en la base */}
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-md border border-espresso/10 bg-parchment-well px-2.5 py-1 text-xs backdrop-blur-sm">
                  <span className="flex items-center gap-1.5 font-bold text-moss-ink">
                    <Trophy className="size-3.5 text-honey-ink" aria-hidden="true" />
                    <span>Récord: 3 - 0</span>
                  </span>
                  <span className="text-[11px] font-medium text-espresso-soft">FNM Taberna</span>
                </div>
              </div>

              {/* Etiqueta de Folio Coleccionista */}
              <div className="mt-2 text-center">
                <span className="text-xs font-bold text-espresso-soft">
                  Retrato Oficial de Taberna #044
                </span>
              </div>
            </div>
          </div>

          {/* Ficha de Datos, Títulos y Métricas Globales */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-8">
            <div>
              {/* Badges de Identidad */}
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded border border-honey/60 bg-honey/15 px-3 py-1 text-xs font-bold text-honey-ink">
                  Gremio Top Deck Gold
                </span>
                <span className="rounded border border-espresso/10 bg-parchment-well px-3 py-1 text-xs font-bold text-espresso-soft">
                  ID: {duelistId}
                </span>
                {user ? (
                  <button
                    type="button"
                    onClick={signOut}
                    className="btn btn-secondary btn-sm py-1 text-xs text-ember-ink hover:text-ember"
                  >
                    Cerrar sesión ({user.name})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSessionModalOpen(true)}
                    className="btn btn-secondary btn-sm py-1 text-xs text-espresso-soft hover:text-espresso"
                  >
                    Personalizar duelista
                  </button>
                )}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {duelistName}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-espresso-soft">
                <span className="font-bold text-honey-ink">{duelistHandle}</span>
                <span>•</span>
                <span>"Campeón de Taberna · Rango Mítico"</span>
              </p>
            </div>

            {/* Cuadrícula de Estadísticas Globales */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-xl border border-espresso/10 bg-parchment-well p-3 text-center transition-transform hover:-translate-y-0.5">
                <div className="text-xs font-bold text-espresso-soft">Victorias</div>
                <div className="font-display text-2xl font-extrabold text-espresso">142</div>
                <div className="text-[11px] font-bold text-moss-ink">+12 este mes</div>
              </div>

              <div className="rounded-xl border border-espresso/10 bg-parchment-well p-3 text-center transition-transform hover:-translate-y-0.5">
                <div className="text-xs font-bold text-espresso-soft">Winrate</div>
                <div className="font-display text-2xl font-extrabold text-honey-ink">68.4%</div>
                <div className="text-[11px] text-espresso-mute">Global TCG</div>
              </div>

              <div className="rounded-xl border border-espresso/10 bg-parchment-well p-3 text-center transition-transform hover:-translate-y-0.5">
                <div className="text-xs font-bold text-espresso-soft">Torneos</div>
                <div className="font-display text-2xl font-extrabold text-espresso">24</div>
                <div className="text-[11px] text-espresso-mute">Oficiales</div>
              </div>

              <div className="rounded-xl border border-espresso/10 bg-parchment-well p-3 text-center transition-transform hover:-translate-y-0.5">
                <div className="text-xs font-bold text-espresso-soft">Trofeos</div>
                <div className="flex items-center justify-center gap-1 font-display text-2xl font-extrabold text-honey-ink">
                  <span>7</span>
                  <Trophy className="size-4 text-honey-ink" aria-hidden="true" />
                </div>
                <div className="text-[11px] font-bold text-honey-ink">1er Puesto</div>
              </div>

              <div className="col-span-2 rounded-xl border border-honey/40 bg-honey/10 p-3 text-center transition-transform hover:-translate-y-0.5 sm:col-span-1">
                <div className="text-xs font-bold text-honey-ink">ELO Taberna</div>
                <div className="font-display text-2xl font-extrabold text-espresso">1845</div>
                <div className="text-[11px] font-bold text-honey-ink">Top 3 Local</div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleShareProfile}
                className="btn btn-secondary btn-sm"
                title="Compartir ficha oficial del duelista"
              >
                {copiedFeedback ? (
                  <>
                    <Check className="size-4 text-moss-ink" aria-hidden="true" />
                    <span className="text-moss-ink">¡Copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-4 text-honey-ink" aria-hidden="true" />
                    <span>Compartir ficha</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setImportModalOpen(true)}
                className="btn btn-secondary btn-sm"
                title="Importar mazo desde Moxfield o lista de texto"
              >
                <Download className="size-4 text-honey-ink" aria-hidden="true" />
                <span>Importar mazo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. SELECTOR DE JUEGOS TCG & MÉTRICAS DETALLADAS DE DESEMPEÑO
          ==================================================================== */}
      <section className="space-y-4" aria-label="Métricas por TCG">
        {/* Selector de Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {TCG_GAMES.map((game) => {
            const isSelected = game.id === selectedGameId;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => {
                  setSelectedGameId(game.id);
                  say(`Cambiando a métricas de ${game.name}.`, 'thoughtful', 2200);
                }}
                aria-pressed={isSelected}
                className="chip flex items-center gap-2"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: game.dotColor }}
                  aria-hidden="true"
                />
                <span>{game.name}</span>
                <span className="ml-1 rounded bg-parchment-well px-1.5 py-0.5 text-[11px] font-mono text-espresso">
                  {game.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel de Métricas Detalladas del Juego */}
        <div className="panel p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* 1. Win Rate Torneos */}
            <div className="flex flex-col justify-between rounded-xl border border-espresso/10 bg-parchment-well p-4">
              <div className="flex items-center justify-between text-xs font-bold text-espresso-soft">
                <span>Win Rate Torneos</span>
                <BarChart2 className="size-4 text-honey-ink" aria-hidden="true" />
              </div>
              <div className="my-3">
                <span className="font-display text-2xl font-extrabold text-espresso">
                  {currentGame.winRate}
                </span>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-parchment-raised">
                  <div
                    className="h-full rounded-full bg-honey transition-all duration-500"
                    style={{ width: `${currentGame.winRate}` }}
                  />
                </div>
              </div>
              <div className="text-xs text-espresso-soft">{currentGame.totalGames}</div>
            </div>

            {/* 2. On Play / Draw */}
            <div className="flex flex-col justify-between rounded-xl border border-espresso/10 bg-parchment-well p-4">
              <div className="flex items-center justify-between text-xs font-bold text-espresso-soft">
                <span>On Play / Draw</span>
                <Dices className="size-4 text-moss-ink" aria-hidden="true" />
              </div>
              <div className="my-3 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-espresso">Play: {currentGame.playPercent}%</span>
                  <span className="text-honey-ink">Draw: {currentGame.drawPercent}%</span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-parchment-raised">
                  <div
                    className="h-full bg-espresso"
                    style={{ width: `${currentGame.playPercent}%` }}
                    title={`Play: ${currentGame.playPercent}%`}
                  />
                  <div
                    className="h-full bg-honey"
                    style={{ width: `${100 - currentGame.playPercent}%` }}
                    title={`Draw: ${currentGame.drawPercent}%`}
                  />
                </div>
              </div>
              <div className="text-xs font-bold text-moss-ink">{currentGame.tacticalNote}</div>
            </div>

            {/* 3. Matchups Favorables */}
            <div className="flex flex-col justify-between rounded-xl border border-espresso/10 bg-parchment-well p-4">
              <div className="flex items-center justify-between text-xs font-bold text-espresso-soft">
                <span>Matchups Favorables</span>
                <Shield className="size-4 text-honey-ink" aria-hidden="true" />
              </div>
              <div className="my-2 space-y-1.5 text-xs">
                {currentGame.matchups.map((m) => (
                  <div key={m.label} className="flex justify-between">
                    <span className="text-espresso-soft">{m.label}</span>
                    <span className={`font-bold ${m.favorable ? 'text-moss-ink' : 'text-honey-ink'}`}>
                      {m.wr}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-espresso-mute">Meta Regional Bogotá</div>
            </div>

            {/* 4. Formatos Insignia */}
            <div className="flex flex-col justify-between rounded-xl border border-espresso/10 bg-parchment-well p-4">
              <div className="flex items-center justify-between text-xs font-bold text-espresso-soft">
                <span>Formatos Insignia</span>
                <BookOpen className="size-4 text-honey-ink" aria-hidden="true" />
              </div>
              <div className="my-2 flex flex-wrap gap-1.5">
                {currentGame.formats.map((fmt, idx) => (
                  <span
                    key={fmt}
                    className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                      idx === 0
                        ? 'border border-honey/40 bg-honey/20 text-honey-ink'
                        : 'border border-espresso/10 bg-parchment-raised text-espresso-soft'
                    }`}
                  >
                    {fmt}
                  </span>
                ))}
              </div>
              <div className="text-xs font-bold text-honey-ink">
                {currentGame.activeDecksCount} mazos activos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. MIS MAZOS DE TORNEO (RANKING POR VICTORIAS)
          ==================================================================== */}
      <section className="space-y-4" aria-label="Ranking de Mazos de Torneo">
        {/* Cabecera & Buscador */}
        <div className="panel flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="size-5 text-honey-ink" aria-hidden="true" />
              <h2 className="text-xl font-extrabold sm:text-2xl">
                Mis Mazos de Torneo
              </h2>
            </div>
            <p className="mt-1 text-sm text-espresso-soft">
              Ranking oficial según victorias acumuladas en torneos sancionados y partidas de taberna.
            </p>
          </div>

          {/* Campo de búsqueda */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-espresso-soft" aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar por carta, formato..."
              value={deckSearchQuery}
              onChange={(e) => setDeckSearchQuery(e.target.value)}
              className="field pl-9 pr-8"
            />
            {deckSearchQuery && (
              <button
                type="button"
                onClick={() => setDeckSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-espresso-soft hover:text-espresso"
                title="Limpiar búsqueda"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Lista de Mazos */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDecks.length === 0 ? (
            <div className="panel p-8 text-center text-espresso-soft">
              <p className="text-base font-bold text-espresso">
                No se encontraron mazos con «{deckSearchQuery}»
              </p>
              <button
                type="button"
                onClick={() => setDeckSearchQuery('')}
                className="btn btn-secondary btn-sm mt-3"
              >
                Limpiar filtro
              </button>
            </div>
          ) : (
            filteredDecks.map((deck) => {
              const isGold = deck.medal === 'gold';
              const isSilver = deck.medal === 'silver';
              const isBronze = deck.medal === 'bronze';

              const medalBorder = isGold
                ? 'border-l-4 border-l-honey'
                : isSilver
                  ? 'border-l-4 border-l-slate-400'
                  : isBronze
                    ? 'border-l-4 border-l-amber-700'
                    : 'border-l-4 border-l-espresso/15';

              return (
                <article
                  key={deck.id}
                  className={`panel ${medalBorder} relative p-5 transition-all duration-200 hover:border-honey/60 sm:p-6`}
                >
                  {/* Etiqueta de Medalla */}
                  {deck.medalLabel && (
                    <div className="mb-3 flex items-center gap-1.5 sm:hidden">
                      <span
                        className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                          isGold
                            ? 'bg-honey-tint text-honey-ink border border-honey/50'
                            : isSilver
                              ? 'bg-slate-100 text-slate-600 border border-slate-400/40'
                              : 'bg-amber-700/10 text-amber-800 border border-amber-700/40'
                        }`}
                      >
                        {deck.medalLabel}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                    {/* Miniatura / Carta Insignia */}
                    <div className="flex flex-col items-center lg:col-span-3">
                      <div className="group relative aspect-[5/7] w-full max-w-[200px] overflow-hidden rounded-xl border border-espresso/10 bg-parchment-well shadow-lift">
                        <img
                          src={deck.artUrl}
                          alt={deck.cardName}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 border-t border-espresso/10 bg-parchment-well py-1 text-center text-xs font-bold text-espresso backdrop-blur-sm">
                          {deck.cardName}
                        </div>
                        {deck.foilBadge && (
                          <div className="absolute left-2 top-2 rounded border border-honey bg-parchment-well px-2 py-0.5 text-[10px] font-bold text-honey-ink backdrop-blur-sm">
                            {deck.foilBadge}
                          </div>
                        )}
                      </div>
                      <span className="mt-2 text-xs font-bold text-espresso-soft">{deck.roleSubtitle}</span>
                    </div>

                    {/* Datos del Mazo y Estadísticas */}
                    <div className="space-y-3 lg:col-span-6">
                      <div>
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="rounded border border-honey bg-honey/20 px-2.5 py-0.5 text-xs font-bold text-honey-ink">
                            Rank #{deck.rank}
                          </span>
                          <span className="rounded border border-espresso/10 bg-parchment-well px-2.5 py-0.5 text-xs font-bold text-espresso-soft">
                            {deck.format}
                          </span>
                          <span className="font-mono text-xs text-espresso-mute">ID: #{deck.moxfieldId}</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-espresso transition-colors hover:text-honey-ink">
                          {deck.name}
                        </h3>
                        <p className="mt-1 text-sm text-espresso-soft">{deck.strategy}</p>
                      </div>

                      {/* Registro de Victorias */}
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-espresso/10 bg-parchment-well p-3.5">
                        <div>
                          <div className="text-xs font-bold text-espresso-soft">Récord de Taberna:</div>
                          <div className="font-display text-lg font-extrabold text-espresso">
                            {deck.record.wins} Victorias - {deck.record.losses} Derrotas
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="rounded border border-moss/40 bg-moss/15 px-3 py-1 font-display text-sm font-extrabold text-moss-ink">
                            {deck.winRate} Win Rate
                          </span>
                        </div>
                      </div>

                      {/* Último Torneo & Valor */}
                      <div className="flex flex-wrap items-center justify-between border-t border-espresso/10 pt-2 text-xs text-espresso-soft">
                        <span className="flex items-center gap-1.5 font-bold text-espresso">
                          <Award className="size-4 text-honey-ink" aria-hidden="true" />
                          <span>{deck.lastTournament.result}</span>
                        </span>
                        <span>
                          Valor Vault: <strong className="font-bold text-moss-ink">{formatUSD(deck.vaultValueUsd)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex flex-col gap-2.5 lg:col-span-3">
                      <button
                        type="button"
                        onClick={() => {
                          setInspectDeck(deck);
                          say(`Inspeccionando lista de «${deck.name}».`, 'thoughtful', 2500);
                        }}
                        className="btn btn-primary btn-sm w-full"
                      >
                        <Eye className="size-4" aria-hidden="true" />
                        <span>Ver lista completa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStatsDeck(deck);
                          say(`Abriendo estadísticas avanzadas de «${deck.name}».`, 'smile', 2500);
                        }}
                        className="btn btn-secondary btn-sm w-full"
                      >
                        <BarChart2 className="size-4 text-honey-ink" aria-hidden="true" />
                        <span>Stats en torneo</span>
                      </button>

                      {deck.missingCards && deck.missingCards.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleBuyMissing(deck)}
                          className="btn btn-green btn-sm w-full"
                        >
                          <ShoppingBag className="size-4" aria-hidden="true" />
                          <span>Comprar faltantes ({deck.missingCards.length})</span>
                        </button>
                      )}

                      {deck.sideboard && (
                        <button
                          type="button"
                          onClick={() => setSideboardDeck(deck)}
                          className="btn btn-secondary btn-sm w-full"
                        >
                          <SlidersHorizontal className="size-4 text-honey-ink" aria-hidden="true" />
                          <span>Sideboard Guide ({deck.sideboard.length})</span>
                        </button>
                      )}

                      <span className="text-center text-[11px] text-espresso-mute">
                        Sincronizado vía Moxfield API
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* ====================================================================
          4. HISTORIAL RECIENTE DE PARTIDAS DE TORNEO (MATCH LOG)
          ==================================================================== */}
      <section className="panel space-y-4 p-5 sm:p-6" aria-label="Historial de Partidas">
        <div className="flex flex-col justify-between gap-2 border-b border-espresso/10 pb-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <History className="size-5 text-honey-ink" aria-hidden="true" />
            <h2 className="text-lg font-extrabold sm:text-xl">
              Historial Reciente de Partidas (Match Log)
            </h2>
          </div>
          <span className="text-xs text-espresso-soft">
            Últimas {showFullHistory ? MATCH_LOG.length : 5} rondas sancionadas en Taberna Top Deck
          </span>
        </div>

        {/* Tabla Responsiva */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-espresso/10 text-xs font-bold text-espresso-soft">
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Torneo</th>
                <th className="py-2.5 px-3">Mazo</th>
                <th className="py-2.5 px-3">Oponente / Arquetipo</th>
                <th className="py-2.5 px-3 text-center">Resultado</th>
                <th className="py-2.5 px-3 text-right">Premio / ELO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/10">
              {(showFullHistory ? MATCH_LOG : MATCH_LOG.slice(0, 5)).map((match) => (
                <tr key={match.id} className="transition-colors hover:bg-parchment-well">
                  <td className="py-3 px-3 font-bold text-espresso">{match.date}</td>
                  <td className="py-3 px-3">
                    <span className="mr-1.5 rounded border border-espresso/10 bg-parchment-well px-2 py-0.5 text-xs font-bold text-honey-ink">
                      {match.formatTag}
                    </span>
                    <span className="text-espresso">{match.tournament}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-moss-ink">{match.deck}</td>
                  <td className="py-3 px-3 text-espresso-soft">{match.opponent}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block rounded px-2.5 py-0.5 text-xs font-bold ${
                        match.isWin
                          ? 'border border-moss/40 bg-moss/20 text-moss-ink'
                          : 'border border-ember/40 bg-ember/15 text-ember-ink'
                      }`}
                    >
                      {match.result}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-bold ${
                      match.isWin ? 'text-moss-ink' : 'text-ember-ink'
                    }`}
                  >
                    {match.prizeAndElo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toggle para ver más */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-espresso-soft">
          <span>
            Mostrando {showFullHistory ? MATCH_LOG.length : 5} de 142 partidas registradas
          </span>
          <button
            type="button"
            onClick={() => setShowFullHistory((prev) => !prev)}
            className="btn btn-secondary btn-sm flex items-center gap-1.5"
          >
            <span>{showFullHistory ? 'Colapsar historial' : 'Ver historial completo'}</span>
            {showFullHistory ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>
      </section>

      {/* ====================================================================
          MODALES: LISTA COMPLETA, STATS, SIDEBOARD, IMPORTADOR, SESIÓN
          ==================================================================== */}

      {/* MODAL 1: VER LISTA COMPLETA DE MAZO */}
      <Dialog
        open={inspectDeck !== null}
        onClose={() => setInspectDeck(null)}
        label="Lista completa del mazo"
      >
        {inspectDeck && (
          <div className="panel relative flex max-h-[calc(100dvh-2rem)] w-[min(48rem,calc(100vw-2rem))] flex-col gap-4 overflow-y-auto p-6 sm:p-7">
            <button
              type="button"
              onClick={() => setInspectDeck(null)}
              aria-label="Cerrar modal"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg border border-espresso/10 bg-parchment-well text-espresso-soft transition-colors hover:text-honey-ink active:scale-95"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="border-b border-espresso/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded border border-honey bg-honey/20 px-2.5 py-0.5 text-xs font-bold text-honey-ink">
                  {inspectDeck.format}
                </span>
                <span className="font-mono text-xs text-espresso-soft">ID: #{inspectDeck.moxfieldId}</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold text-espresso">{inspectDeck.name}</h2>
              <p className="mt-1 text-sm text-espresso-soft">{inspectDeck.strategy}</p>
            </div>

            {/* Resumen de Rendimiento */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-espresso/10 bg-parchment-well p-3">
                <div className="text-xs text-espresso-soft">Win Rate</div>
                <div className="font-display text-xl font-extrabold text-moss-ink">{inspectDeck.winRate}</div>
              </div>
              <div className="rounded-xl border border-espresso/10 bg-parchment-well p-3">
                <div className="text-xs text-espresso-soft">Partidas Oficiales</div>
                <div className="font-display text-xl font-extrabold text-espresso">
                  {inspectDeck.record.wins + inspectDeck.record.losses}
                </div>
              </div>
              <div className="rounded-xl border border-espresso/10 bg-parchment-well p-3">
                <div className="text-xs text-espresso-soft">Valor Vault</div>
                <div className="font-display text-xl font-extrabold text-honey-ink">
                  {formatUSD(inspectDeck.vaultValueUsd)}
                </div>
              </div>
            </div>

            {/* Listado de Cartas */}
            {inspectDeck.deckListPreview && (
              <div className="space-y-4 text-sm">
                {inspectDeck.deckListPreview.commander && (
                  <div>
                    <h4 className="mb-1 text-xs font-bold text-honey-ink">
                      ★ Comandante / Motor Principal (1)
                    </h4>
                    <p className="rounded-lg border border-honey/40 bg-honey/10 p-2.5 font-bold text-espresso">
                      1x {inspectDeck.deckListPreview.commander}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="mb-1 text-xs font-bold text-moss-ink">
                    Criaturas Clave ({inspectDeck.deckListPreview.creatures.length})
                  </h4>
                  <ul className="grid grid-cols-1 gap-1.5 rounded-lg border border-espresso/10 bg-parchment-well p-3 sm:grid-cols-2">
                    {inspectDeck.deckListPreview.creatures.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-espresso">
                        <span className="size-1.5 rounded-full bg-moss" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-1 text-xs font-bold text-honey-ink">
                    Hechizos & Removals ({inspectDeck.deckListPreview.spells.length})
                  </h4>
                  <ul className="grid grid-cols-1 gap-1.5 rounded-lg border border-espresso/10 bg-parchment-well p-3 sm:grid-cols-2">
                    {inspectDeck.deckListPreview.spells.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-espresso">
                        <span className="size-1.5 rounded-full bg-honey" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {inspectDeck.deckListPreview.artifacts && (
                  <div>
                    <h4 className="mb-1 text-xs font-bold text-espresso-soft">
                      Artefactos & Aceleración ({inspectDeck.deckListPreview.artifacts.length})
                    </h4>
                    <ul className="grid grid-cols-1 gap-1.5 rounded-lg border border-espresso/10 bg-parchment-well p-3 sm:grid-cols-2">
                      {inspectDeck.deckListPreview.artifacts.map((a) => (
                        <li key={a} className="flex items-center gap-2 text-espresso">
                          <span className="size-1.5 rounded-full bg-espresso-soft" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Cartas Faltantes */}
            {inspectDeck.missingCards && inspectDeck.missingCards.length > 0 && (
              <div className="mt-2 rounded-xl border border-honey/40 bg-honey/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-honey-ink">
                    Cartas Faltantes en tu Colección ({inspectDeck.missingCards.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleBuyMissing(inspectDeck);
                      setInspectDeck(null);
                    }}
                    className="btn btn-green btn-sm"
                  >
                    + Añadir todas al morral
                  </button>
                </div>
                <div className="mt-2 space-y-1.5">
                  {inspectDeck.missingCards.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-lg border border-espresso/10 bg-parchment-well p-2.5 text-xs"
                    >
                      <div>
                        <div className="font-bold text-espresso">{m.name}</div>
                        <div className="text-[11px] text-espresso-soft">{m.set}</div>
                      </div>
                      <div className="font-bold text-moss-ink">{formatUSD(m.priceUsd)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Dialog>

      {/* MODAL 2: STATS EN TORNEO */}
      <Dialog
        open={statsDeck !== null}
        onClose={() => setStatsDeck(null)}
        label="Estadísticas de torneo del mazo"
      >
        {statsDeck && (
          <div className="panel relative flex max-h-[calc(100dvh-2rem)] w-[min(38rem,calc(100vw-2rem))] flex-col gap-4 overflow-y-auto p-6 sm:p-7">
            <button
              type="button"
              onClick={() => setStatsDeck(null)}
              aria-label="Cerrar modal"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg border border-espresso/10 bg-parchment-well text-espresso-soft transition-colors hover:text-honey-ink active:scale-95"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <h3 className="text-xl font-extrabold text-espresso">
              Stats en Torneo: {statsDeck.name}
            </h3>
            <p className="text-xs text-espresso-soft">
              Rendimiento registrado contra el metajuego regional en eventos competitivos.
            </p>

            <div className="my-2 space-y-2.5">
              {statsDeck.statsByMatchup?.map((stat) => (
                <div
                  key={stat.archetype}
                  className="rounded-xl border border-espresso/10 bg-parchment-well p-3.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-espresso">{stat.archetype}</span>
                    <span className="rounded border border-moss/40 bg-moss/20 px-2 py-0.5 font-bold text-moss-ink">
                      {stat.wr} WR
                    </span>
                  </div>
                  <p className="mt-1 text-espresso-soft">{stat.note}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-espresso/10 pt-3 text-right">
              <button
                type="button"
                onClick={() => setStatsDeck(null)}
                className="btn btn-secondary btn-sm"
              >
                Cerrar reporte
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* MODAL 3: SIDEBOARD GUIDE */}
      <Dialog
        open={sideboardDeck !== null}
        onClose={() => setSideboardDeck(null)}
        label="Guía de Sideboard"
      >
        {sideboardDeck && (
          <div className="panel relative flex max-h-[calc(100dvh-2rem)] w-[min(38rem,calc(100vw-2rem))] flex-col gap-4 overflow-y-auto p-6 sm:p-7">
            <button
              type="button"
              onClick={() => setSideboardDeck(null)}
              aria-label="Cerrar modal"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg border border-espresso/10 bg-parchment-well text-espresso-soft transition-colors hover:text-honey-ink active:scale-95"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <h3 className="text-xl font-extrabold text-espresso">
              Sideboard Guide: {sideboardDeck.name}
            </h3>
            <p className="text-xs text-espresso-soft">
              Configuración de 15 cartas de banquillo para partidas 2 y 3.
            </p>

            <div className="my-2 space-y-1.5">
              {sideboardDeck.sideboard?.map((card) => (
                <div
                  key={card}
                  className="flex items-center justify-between rounded-lg border border-espresso/10 bg-parchment-well p-2.5 text-xs font-bold text-espresso"
                >
                  <span>{card}</span>
                  <span className="rounded border border-espresso/10 bg-parchment-raised px-2 py-0.5 text-[11px] text-honey-ink">
                    Banquillo
                  </span>
                </div>
              ))}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setSideboardDeck(null)}
                className="btn btn-primary btn-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* MODAL 4: IMPORTADOR DE MAZOS */}
      <Dialog
        open={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        label="Importar mazo a la ficha"
      >
        <div className="panel relative flex max-h-[calc(100dvh-2rem)] w-[min(38rem,calc(100vw-2rem))] flex-col gap-4 overflow-y-auto p-6 sm:p-7">
          <button
            type="button"
            onClick={() => setImportModalOpen(false)}
            aria-label="Cerrar modal"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg border border-espresso/10 bg-parchment-well text-espresso-soft transition-colors hover:text-honey-ink active:scale-95"
          >
            <X className="size-4" aria-hidden="true" />
          </button>

          <h3 className="text-xl font-extrabold text-espresso">Importar Mazo de Torneo</h3>
          <p className="text-xs text-espresso-soft">
            Pega una URL de Moxfield o Archidekt, o ingresa la lista de cartas en texto plano.
          </p>

          <div className="my-2 space-y-3">
            <div>
              <label className="block text-xs font-bold text-espresso-soft">
                Enlace de Moxfield / Archidekt
              </label>
              <input
                type="url"
                placeholder="https://www.moxfield.com/decks/..."
                className="field mt-1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-espresso-soft">
                O pega la lista de cartas (MTGO / Arena)
              </label>
              <textarea
                rows={4}
                placeholder="1 Unholy Annex // Ritual Chamber&#10;4 Thoughtseize&#10;4 Orcish Bowmasters..."
                className="field mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setImportModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                setImportModalOpen(false);
                say('¡Mazo importado y verificado contra el catálogo de la taberna!', 'smile', 3500);
              }}
              className="btn btn-primary btn-sm"
            >
              Sincronizar ahora
            </button>
          </div>
        </div>
      </Dialog>

      {/* MODAL 5: SESIÓN / PERSONALIZACIÓN DE DUELISTA */}
      <Dialog
        open={isSessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        label="Personalizar Duelista"
      >
        <form
          onSubmit={handleSaveSession}
          className="panel relative flex max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] flex-col gap-4 p-6 sm:p-7"
        >
          <button
            type="button"
            onClick={() => setSessionModalOpen(false)}
            aria-label="Cerrar modal"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg border border-espresso/10 bg-parchment-well text-espresso-soft transition-colors hover:text-honey-ink active:scale-95"
          >
            <X className="size-4" aria-hidden="true" />
          </button>

          <h3 className="text-xl font-extrabold text-espresso">Identidad de Duelista</h3>
          <p className="text-xs text-espresso-soft">
            Ingresa tu apodo o nombre de duelista para personalizar tu ficha en la taberna.
          </p>

          <div className="my-2">
            <label className="block text-xs font-bold text-espresso-soft">Nombre o Apodo</label>
            <input
              type="text"
              required
              value={customNameInput}
              onChange={(e) => setCustomNameInput(e.target.value)}
              placeholder="Ej: Andrés Mejía"
              className="field mt-1"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setSessionModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Guardar ficha
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
