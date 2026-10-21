import type { ScryfallCard, ScryfallImageUris } from '../types';
import { usdToCop } from './format';

const API = 'https://api.scryfall.com';

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
  finish?: 'all' | Finish;
  /** Special frames; a printing matches if it has any of them. */
  art?: ArtTreatment[];
  artist?: string;
  lang?: string;
  inStockOnly?: boolean;
  sort?: 'edhrec' | 'usd-asc' | 'usd-desc' | 'name' | 'released';
}

export const DEFAULT_FILTERS: CardFilters = {
  game: 'mtg',
  set: '',
  format: '',
  rarity: [],
  color: [],
  cardType: [],
  finish: 'all',
  art: [],
  artist: '',
  lang: 'all',
  inStockOnly: false,
  sort: 'edhrec',
};

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
  { id: 'multicolor', label: 'Multicolor', symbol: 'M', colorCode: '#F29F38', textCode: '#382414' },
  { id: 'colorless', label: 'Incolora', symbol: 'C', colorCode: '#78716C', textCode: '#FFFFFF' },
] as const;

/** Rarity colours as Magic prints them (mythic ember, rare gold, uncommon silver, common ink), legible on parchment. */
export const RARITY_OPTIONS = [
  { id: 'mythic', label: 'Mítica', dot: 'bg-ember', tone: 'border-ember/40 text-ember-ink' },
  { id: 'rare', label: 'Rara', dot: 'bg-honey', tone: 'border-honey/60 text-honey-ink' },
  { id: 'uncommon', label: 'Infrecuente', dot: 'bg-slate-400', tone: 'border-slate-400/50 text-slate-600' },
  { id: 'common', label: 'Común', dot: 'bg-espresso', tone: 'border-espresso/20 text-espresso-soft' },
] as const;

export const rarityTone = (rarity: string): string =>
  RARITY_OPTIONS.find((r) => r.id === rarity)?.tone ?? 'border-espresso/20 text-espresso-soft';

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

export type Finish = 'nonfoil' | 'foil' | 'etched';

export const FINISH_OPTIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'nonfoil', label: 'No foil' },
  { id: 'foil', label: 'Foil' },
  { id: 'etched', label: 'Foil etched' },
] as const;

export const ART_OPTIONS = [
  { id: 'showcase', label: 'Showcase', query: 'frame:showcase' },
  { id: 'borderless', label: 'Borderless', query: 'border:borderless' },
] as const;

export type ArtTreatment = (typeof ART_OPTIONS)[number]['id'];

/** Art treatments a printing has, in the order the filters list them. */
export function cardArtLabels(card: ScryfallCard): string[] {
  const has = { showcase: card.frame_effects?.includes('showcase'), borderless: card.border_color === 'borderless' };
  return ART_OPTIONS.filter((a) => has[a.id]).map((a) => a.label);
}

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
  const anyOf = (terms: string[]) => (terms.length > 1 ? `(${terms.join(' or ')})` : terms[0]);

  if (filters.set) {
    parts.push(`s:${filters.set}`);
  }

  if (filters.format) {
    parts.push(`f:${filters.format}`);
  }

  if (filters.rarity && filters.rarity.length > 0) {
    parts.push(anyOf(filters.rarity.map((r) => `r:${r}`)));
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
    parts.push(anyOf(filters.cardType.map((t) => `t:${t}`)));
  }

  if (filters.finish && filters.finish !== 'all') parts.push(`is:${filters.finish}`);

  if (filters.art && filters.art.length > 0) {
    parts.push(anyOf(ART_OPTIONS.filter((a) => filters.art?.includes(a.id)).map((a) => a.query)));
  }

  // Quotes inside the name would end the phrase early, so they are dropped.
  const artist = filters.artist?.replace(/"/g, '').trim();
  if (artist) parts.push(`a:"${artist}"`);

  if (filters.lang && filters.lang !== 'all') {
    parts.push(`lang:${filters.lang}`);
  }

  // Resolve sort order
  const sortOption = SORT_OPTIONS.find((s) => s.id === filters.sort) ?? SORT_OPTIONS[0];

  const text = search.trim();
  if (text) parts.unshift(text);

  return {
    // With no text and no filters, open on Commander staples instead of the whole database.
    q: parts.join(' ') || POPULAR_QUERY,
    order: sortOption.order,
    dir: sortOption.dir,
  };
}

export interface CardPage {
  cards: ScryfallCard[];
  /** Printings matching the whole query, across every page. */
  total: number;
  /** Scryfall's link to the following page (175 cards each), `null` on the last one. */
  nextPage: string | null;
}

/** First page of every printing that matches (`unique=prints`), not one card per name. */
export function searchCards(query: string, order = 'edhrec', dir = 'auto', signal?: AbortSignal): Promise<CardPage> {
  const params = new URLSearchParams({ q: query, unique: 'prints', order });
  if (dir !== 'auto') params.set('dir', dir);
  return fetchCardPage(`${API}/cards/search?${params}`, signal);
}

/** Loads a search page by URL, so `next_page` links are followed as given. An empty page on no match (404); throws on any other failure. */
export async function fetchCardPage(url: string, signal?: AbortSignal): Promise<CardPage> {
  const res = await fetch(url, { signal });
  if (res.status === 404) return { cards: [], total: 0, nextPage: null };
  if (!res.ok) throw new Error(`Scryfall respondió con error ${res.status}`);
  const json = (await res.json()) as { data: ScryfallCard[]; total_cards: number; next_page?: string };
  return { cards: json.data, total: json.total_cards, nextPage: json.next_page ?? null };
}

/** Up to 20 card names that start like `text`. Scryfall needs two characters; failures just mean no suggestions. */
export async function autocompleteNames(text: string, signal?: AbortSignal): Promise<string[]> {
  const q = text.trim();
  if (q.length < 2) return [];
  const res = await fetch(`${API}/cards/autocomplete?q=${encodeURIComponent(q)}`, { signal });
  return res.ok ? ((await res.json()) as { data: string[] }).data : [];
}

let artistNames: Promise<string[]> | undefined;

/** Every illustrator Scryfall knows (about 2,500 names), fetched once per visit. A failed fetch is retried next time. */
export function fetchArtistNames(): Promise<string[]> {
  artistNames ??= fetch(`${API}/catalog/artist-names`)
    .then((res) => (res.ok ? (res.json() as Promise<{ data: string[] }>) : Promise.reject(res.status)))
    .then((json) => json.data)
    .catch(() => {
      artistNames = undefined;
      return [];
    });
  return artistNames;
}

export function cardImage(card: ScryfallCard, size: keyof ScryfallImageUris = 'normal'): string | undefined {
  return card.image_uris?.[size] ?? card.card_faces?.[0]?.image_uris?.[size];
}

const PRICE_KEY = { nonfoil: 'usd', foil: 'usd_foil', etched: 'usd_etched' } as const;

const usdFor = (card: ScryfallCard, finish: Finish) => Number.parseFloat(card.prices[PRICE_KEY[finish]] ?? '');

/** The finish being sold: the preferred one when it has a price, else the first finish that does (etched-only cards price only as etched). */
export function pricedFinish(card: ScryfallCard, prefer: Finish = 'nonfoil'): Finish | null {
  return ([prefer, 'nonfoil', 'foil', 'etched'] as const).find((f) => Number.isFinite(usdFor(card, f))) ?? null;
}

export const finishLabel = (finish: Finish): string => FINISH_OPTIONS.find((f) => f.id === finish)?.label ?? finish;

/** Price in USD of `pricedFinish`, or `null` when Scryfall has no market price for the printing. */
export function cardPrice(card: ScryfallCard, prefer: Finish = 'nonfoil'): number | null {
  const finish = pricedFinish(card, prefer);
  return finish ? usdFor(card, finish) : null;
}

/** Price in COP calculated from USD, or null if unpriced. */
export function cardPriceCOP(card: ScryfallCard, prefer: Finish = 'nonfoil'): number | null {
  const usd = cardPrice(card, prefer);
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
