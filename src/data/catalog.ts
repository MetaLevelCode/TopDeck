import type { Game, ProductCategory, SealedProduct, TavernEvent } from '../types';

export const GAMES: readonly Game[] = ['Magic', 'Pokémon', 'Yu-Gi-Oh!', 'Lorcana', 'One Piece'];

/** Tint used by the generated product art, one per game. */
export const GAME_THEME: Record<Game, { from: string; to: string }> = {
  Magic: { from: '#C55A3F', to: '#6B2A1B' },
  'Pokémon': { from: '#D9A441', to: '#7A4F12' },
  'Yu-Gi-Oh!': { from: '#8A63B0', to: '#3D2658' },
  Lorcana: { from: '#4F86A8', to: '#1F3F57' },
  'One Piece': { from: '#3C9AA0', to: '#173F44' },
};

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  'Booster Box': 'Caja de sobres',
  'Elite Trainer Box': 'Elite Trainer Box',
  'Commander Deck': 'Mazo Commander',
  Bundle: 'Bundle',
  'Collector Booster': 'Collector Booster',
};

export const SEALED_PRODUCTS: SealedProduct[] = [
  {
    id: 'sealed-1',
    name: 'Duskmourn: House of Horror · Play Booster Box',
    game: 'Magic',
    category: 'Booster Box',
    price: 142.99,
    stock: 8,
    popular: true,
  },
  {
    id: 'sealed-2',
    name: 'Bloomburrow · Commander Deck: Peace Offering',
    game: 'Magic',
    category: 'Commander Deck',
    price: 49.99,
    stock: 12,
    popular: true,
  },
  {
    id: 'sealed-7',
    name: 'Modern Horizons 3 · Collector Booster Box',
    game: 'Magic',
    category: 'Collector Booster',
    price: 389,
    stock: 2,
    popular: true,
  },
  {
    id: 'sealed-3',
    name: 'Stellar Crown · Elite Trainer Box',
    game: 'Pokémon',
    category: 'Elite Trainer Box',
    price: 54.99,
    stock: 15,
    popular: true,
  },
  {
    id: 'sealed-8',
    name: '151 · Ultra-Premium Collection',
    game: 'Pokémon',
    category: 'Bundle',
    price: 139.99,
    stock: 5,
    popular: true,
  },
  {
    id: 'sealed-5',
    name: '25th Anniversary · Rarity Collection II',
    game: 'Yu-Gi-Oh!',
    category: 'Booster Box',
    price: 79.99,
    stock: 9,
    popular: true,
  },
  {
    id: 'sealed-6',
    name: "Ursula's Return · Illumineer's Trove",
    game: 'Lorcana',
    category: 'Bundle',
    price: 59.9,
    stock: 6,
  },
  {
    id: 'sealed-4',
    name: 'Pillars of Strength (OP-03) · Booster Box',
    game: 'One Piece',
    category: 'Booster Box',
    price: 119.5,
    stock: 0,
  },
];

export const TAVERN_EVENTS: TavernEvent[] = [
  {
    id: 'ev-1',
    tag: 'Evento semanal',
    date: 'Viernes · 7:00 PM',
    title: 'Noche de Commander',
    text: 'Mesas casuales y competitivas. Promo pack para el ganador.',
  },
  {
    id: 'ev-2',
    tag: 'Nuevo stock',
    date: 'Disponible hoy',
    title: 'Llegó Duskmourn',
    text: 'Cajas selladas y singles recién abiertos.',
  },
  {
    id: 'ev-3',
    tag: 'Comunidad',
    date: 'Sábados · 3:00 PM',
    title: 'Intercambio y café',
    text: 'Trae tu carpeta y tradea con otros duelistas.',
  },
];

export const DEXTER_TIPS = [
  '¿Buscas un Sol Ring? Pásate por la pestaña Cartas.',
  'Los sellados con pocas unidades vuelan. ¡Ojo al stock!',
  'Cada pedido sale protegido con sleeve y toploader.',
  'Los viernes hay Commander. ¡Reserva tu silla!',
];
