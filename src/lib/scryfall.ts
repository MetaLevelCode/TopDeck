import type { ScryfallCard, ScryfallImageUris } from '../types';
import { usdToCop } from './format';

const SEARCH_URL = 'https://api.scryfall.com/cards/search';

/** Commander staples, default view when entering with no active filters. */
export const POPULAR_QUERY = 'format:commander';

export const SUGGESTIONS = [
  'Sol Ring',
  'Cyclonic Rift',
  'Mana Drain',
  'The One Ring',
  'Rhystic Study',
  'Demonic Tutor',
  'Smothering Tithe',
  'Boseiju, Who Shelters All',
];

export interface CardFilters {
  game?: string;
  set?: string;
  format?: string;
  rarity?: string[];
  color?: string[];
  cardType?: string[];
  finish?: 'all' | 'nonfoil' | 'foil';
  lang?: string;
  inStockOnly?: boolean;
  sort?: 'edhrec' | 'usd-asc' | 'usd-desc' | 'name' | 'released';
}

export const POPULAR_SETS = [
  { code: '', label: 'Todos los sets' },
  { code: 'dsk', label: 'Duskmourn: House of Horror' },
  { code: 'blb', label: 'Bloomburrow' },
  { code: 'mh3', label: 'Modern Horizons 3' },
  { code: 'otj', label: 'Outlaws of Thunder Junction' },
  { code: 'pip', label: 'Fallout' },
  { code: 'mkm', label: 'Murders at Karlov Manor' },
  { code: 'lci', label: 'The Lost Caverns of Ixalan' },
  { code: 'woe', label: 'Wilds of Eldraine' },
  { code: 'ltr', label: 'The Lord of the Rings' },
  { code: 'rvr', label: 'Ravnica Remastered' },
  { code: 'one', label: 'Phyrexia: All Will Be One' },
  { code: 'neo', label: 'Kamigawa: Neon Dynasty' },
  { code: 'sld', label: 'Secret Lair Drop' },
] as const;

export const COLOR_OPTIONS = [
  { id: 'W', label: 'Blanco', symbol: 'W', colorCode: '#F8F6D8', textCode: '#1A120E' },
  { id: 'U', label: 'Azul', symbol: 'U', colorCode: '#0E68AB', textCode: '#FFFFFF' },
  { id: 'B', label: 'Negro', symbol: 'B', colorCode: '#211E19', textCode: '#F1E8D9' },
  { id: 'R', label: 'Rojo', symbol: 'R', colorCode: '#D3202A', textCode: '#FFFFFF' },
  { id: 'G', label: 'Verde', symbol: 'G', colorCode: '#00733E', textCode: '#FFFFFF' },
  { id: 'multicolor', label: 'Multicolor', symbol: 'M', colorCode: '#C55A3F', textCode: '#FFFFFF' },
  { id: 'colorless', label: 'Incolora', symbol: 'C', colorCode: '#78716C', textCode: '#FFFFFF' },
] as const;

export const RARITY_OPTIONS = [
  { id: 'mythic', label: 'Mítica', border: 'border-amber-500/50', badge: 'bg-amber-500/15 text-amber-400' },
  { id: 'rare', label: 'Rara', border: 'border-yellow-400/50', badge: 'bg-yellow-400/15 text-yellow-300' },
  { id: 'uncommon', label: 'Infrecuente', border: 'border-slate-300/40', badge: 'bg-slate-300/15 text-slate-200' },
  { id: 'common', label: 'Común', border: 'border-stone-500/30', badge: 'bg-stone-500/15 text-stone-300' },
] as const;

export const CARD_TYPES = [
  { id: 'creature', label: 'Criatura' },
  { id: 'instant', label: 'Instantáneo' },
  { id: 'sorcery', label: 'Conjuro' },
  { id: 'enchantment', label: 'Encantamiento' },
  { id: 'artifact', label: 'Artefacto' },
  { id: 'planeswalker', label: 'Planeswalker' },
  { id: 'land', label: 'Tierra' },
  { id: 'battle', label: 'Batalla' },
] as const;

export const FORMAT_OPTIONS = [
  { id: '', label: 'Todos los formatos' },
  { id: 'commander', label: 'Commander (EDH)' },
  { id: 'modern', label: 'Modern' },
  { id: 'standard', label: 'Standard' },
  { id: 'pioneer', label: 'Pioneer' },
  { id: 'legacy', label: 'Legacy' },
  { id: 'pauper', label: 'Pauper' },
] as const;

export const FINISH_OPTIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'nonfoil', label: 'No foil' },
  { id: 'foil', label: 'Foil' },
] as const;

export const LANG_OPTIONS = [
  { id: 'all', label: 'Todos los idiomas' },
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'Inglés' },
  { id: 'ja', label: 'Japonés' },
] as const;

export const SORT_OPTIONS = [
  { id: 'edhrec', label: 'Más populares (EDHREC)', order: 'edhrec', dir: 'auto' },
  { id: 'usd-asc', label: 'Precio: menor a mayor', order: 'usd', dir: 'asc' },
  { id: 'usd-desc', label: 'Precio: mayor a menor', order: 'usd', dir: 'desc' },
  { id: 'name', label: 'Nombre: A - Z', order: 'name', dir: 'asc' },
  { id: 'released', label: 'Más recientes', order: 'released', dir: 'desc' },
] as const;

/** Builds a Scryfall query string and ordering parameters from structured filters. */
export function buildScryfallQuery(
  filters: CardFilters,
  search: string,
): { q: string; order: string; dir: string } {
  const parts: string[] = [];

  const text = search.trim();
  if (text) {
    parts.push(text);
  } else if (!filters.format && !filters.set) {
    parts.push(POPULAR_QUERY);
  }

  if (filters.set) {
    parts.push(`s:${filters.set}`);
  }

  if (filters.format) {
    parts.push(`f:${filters.format}`);
  }

  if (filters.rarity && filters.rarity.length > 0) {
    if (filters.rarity.length === 1) {
      parts.push(`r:${filters.rarity[0]}`);
    } else {
      parts.push(`(${filters.rarity.map((r) => `r:${r}`).join(' or ')})`);
    }
  }

  if (filters.color && filters.color.length > 0) {
    if (filters.color.includes('multicolor')) {
      parts.push('c:m');
    } else if (filters.color.includes('colorless')) {
      parts.push('c:c');
    } else {
      parts.push(`c:${filters.color.join('')}`);
    }
  }

  if (filters.cardType && filters.cardType.length > 0) {
    if (filters.cardType.length === 1) {
      parts.push(`t:${filters.cardType[0]}`);
    } else {
      parts.push(`(${filters.cardType.map((t) => `t:${t}`).join(' or ')})`);
    }
  }

  if (filters.finish === 'foil') parts.push('is:foil');
  if (filters.finish === 'nonfoil') parts.push('is:nonfoil');

  if (filters.lang && filters.lang !== 'all') {
    parts.push(`lang:${filters.lang}`);
  }

  // Resolve sort order
  const sortOption = SORT_OPTIONS.find((s) => s.id === filters.sort) ?? SORT_OPTIONS[0];

  return {
    q: parts.join(' ').trim() || POPULAR_QUERY,
    order: sortOption.order,
    dir: sortOption.dir,
  };
}

/** Resolves to `[]` when Scryfall has no match (404); throws on any other failure. */
export async function searchCards(
  query: string,
  order = 'edhrec',
  dir = 'auto',
  signal?: AbortSignal,
): Promise<ScryfallCard[]> {
  let url = `${SEARCH_URL}?q=${encodeURIComponent(query)}&order=${order}`;
  if (dir !== 'auto') url += `&dir=${dir}`;

  const res = await fetch(url, { signal });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Scryfall respondió con error ${res.status}`);
  const json = (await res.json()) as { data?: ScryfallCard[] };
  return json.data ?? [];
}

export function cardImage(card: ScryfallCard, size: keyof ScryfallImageUris = 'normal'): string | undefined {
  return card.image_uris?.[size] ?? card.card_faces?.[0]?.image_uris?.[size];
}

/** Price in USD, or `null` when Scryfall has no market price for the card. */
export function cardPrice(card: ScryfallCard, preferFoil = false): number | null {
  const raw = preferFoil
    ? card.prices.usd_foil ?? card.prices.usd
    : card.prices.usd ?? card.prices.usd_foil;
  const value = raw ? Number.parseFloat(raw) : Number.NaN;
  return Number.isFinite(value) ? value : null;
}

/** Price in COP calculated from USD, or null if unpriced. */
export function cardPriceCOP(card: ScryfallCard, preferFoil = false): number | null {
  const usd = cardPrice(card, preferFoil);
  return usd !== null ? usdToCop(usd) : null;
}

/** Deterministic store inventory for each card (consistent across re-renders). */
export function cardStock(card: ScryfallCard): number {
  let hash = 0;
  for (let i = 0; i < card.id.length; i++) {
    hash = (hash * 31 + card.id.charCodeAt(i)) >>> 0;
  }
  const mod = hash % 25;
  if (mod === 0) return 0; // ~4% simulated out of stock
  return (hash % 6) + 1; // 1 to 6 in stock
}

/** Card condition convention (e.g. Near Mint NM). */
export function cardCondition(_card: ScryfallCard): string {
  return 'Near Mint (NM)';
}

/** Finishes indicator matching DracoStore convention: e.g. "Foil", "No Foil", "Etched". */
export function cardFinishesLabel(card: ScryfallCard): string {
  if (card.finishes?.includes('etched')) return 'Etched';
  if (card.finishes?.includes('foil') && !card.finishes?.includes('nonfoil')) return 'Foil';
  if (card.finishes?.includes('foil')) return 'Foil';
  return 'No Foil';
}

/** Language badge (e.g. "EN", "ES", "JA"). */
export function cardLangLabel(card: ScryfallCard): string {
  return (card.lang || 'en').toUpperCase();
}

/** Formats rarity into Spanish label. */
export function cardRarityLabel(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'mythic':
      return 'Mítica';
    case 'rare':
      return 'Rara';
    case 'uncommon':
      return 'Infrecuente';
    case 'common':
      return 'Común';
    default:
      return rarity;
  }
}
