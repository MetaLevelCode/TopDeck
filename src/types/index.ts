export type DexterMood = 'idle' | 'smile' | 'thoughtful' | 'angry';

export type Game = 'Magic' | 'Pokémon' | 'Yu-Gi-Oh!' | 'Lorcana' | 'One Piece';

export type ProductCategory =
  | 'Booster Box'
  | 'Elite Trainer Box'
  | 'Commander Deck'
  | 'Bundle'
  | 'Collector Booster';

export interface SealedProduct {
  id: string;
  name: string;
  game: Game;
  category: ProductCategory;
  price: number;
  stock: number;
  popular?: boolean;
}

export interface TavernEvent {
  id: string;
  tag: string;
  date: string;
  title: string;
  text: string;
}

export interface ScryfallImageUris {
  small?: string;
  normal?: string;
  large?: string;
}

export interface ScryfallCard {
  id: string;
  name: string;
  mana_cost?: string;
  cmc?: number;
  type_line: string;
  oracle_text?: string;
  flavor_text?: string;
  rarity: string;
  set: string;
  set_name: string;
  collector_number?: string;
  lang?: string;
  finishes?: string[];
  /** e.g. `showcase`, `extendedart`, `etched`. */
  frame_effects?: string[];
  border_color?: string;
  colors?: string[];
  color_identity?: string[];
  legalities?: Record<string, string>;
  artist?: string;
  released_at?: string;
  prices: {
    usd?: string | null;
    usd_foil?: string | null;
    usd_etched?: string | null;
    eur?: string | null;
  };
  image_uris?: ScryfallImageUris;
  card_faces?: Array<{
    name: string;
    mana_cost?: string;
    type_line?: string;
    oracle_text?: string;
    image_uris?: ScryfallImageUris;
  }>;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  kind: 'single' | 'sealed';
  subtitle?: string;
  /** Card scan. Sealed products have no photo yet and render generated art from `game`. */
  image?: string;
  game?: Game;
}

export interface UserProfile {
  name: string;
  joinedAt: string;
}
