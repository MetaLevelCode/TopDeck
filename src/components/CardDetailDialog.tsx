import { useState } from 'react';
import {
  Ban,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { formatCOP, formatUSD } from '../lib/format';
import {
  cardArtLabels,
  cardCondition,
  cardImage,
  cardLangLabel,
  cardPrice,
  cardPriceCOP,
  cardRarityLabel,
  cardStock,
  finishLabel,
  pricedFinish,
  rarityTone,
} from '../lib/scryfall';
import { useCart } from '../store/cart';
import type { ScryfallCard } from '../types';
import { Card3D } from './Card3D';
import { Dialog } from './Dialog';

interface CardDetailDialogProps {
  card: ScryfallCard | null;
  onClose: () => void;
}

const TRACKED_FORMATS = [
  { key: 'commander', label: 'Commander (EDH)' },
  { key: 'modern', label: 'Modern' },
  { key: 'standard', label: 'Standard' },
  { key: 'pioneer', label: 'Pioneer' },
  { key: 'legacy', label: 'Legacy' },
  { key: 'pauper', label: 'Pauper' },
] as const;

function parseManaCost(manaCost?: string): string[] {
  if (!manaCost) return [];
  const matches = manaCost.match(/\{([^}]+)\}/g);
  return matches ? matches.map((m) => m.replace(/[{}]/g, '')) : [];
}

function ManaBadge({ symbol }: { symbol: string }) {
  const symbolUpper = symbol.toUpperCase();
  const colors: Record<string, { bg: string; text: string }> = {
    W: { bg: 'bg-[#FFFBD5]', text: 'text-[#1A120E]' },
    U: { bg: 'bg-[#0E68AB]', text: 'text-white' },
    B: { bg: 'bg-[#211E19]', text: 'text-[#F1E8D9]' },
    R: { bg: 'bg-[#D3202A]', text: 'text-white' },
    G: { bg: 'bg-[#00733E]', text: 'text-white' },
    C: { bg: 'bg-[#78716C]', text: 'text-white' },
  };
  const config = colors[symbolUpper];
  const bgClass = config ? config.bg : 'bg-parchment-deep';
  const textClass = config ? config.text : 'text-espresso';

  return (
    <span
      className={`inline-flex size-5.5 items-center justify-center rounded-full font-mono text-[11px] font-black shadow-xs border border-espresso/30 ${bgClass} ${textClass}`}
      title={`Maná ${symbol}`}
    >
      {symbol}
    </span>
  );
}

export function CardDetailDialog({ card, onClose }: CardDetailDialogProps) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [preferFoil, setPreferFoil] = useState(false);
  const [formatView, setFormatView] = useState<'all' | 'illegal' | 'legal'>('all');

  if (!card) return null;

  const image = cardImage(card, 'large');
  const prefer = preferFoil ? 'foil' : 'nonfoil';
  const finish = pricedFinish(card, prefer);
  const usdPrice = cardPrice(card, prefer);
  const copPrice = cardPriceCOP(card, prefer);
  const stock = cardStock(card);
  const lang = cardLangLabel(card);
  const rarity = cardRarityLabel(card.rarity);
  const condition = cardCondition(card);
  const hasFoilOption = Boolean(card.prices.usd_foil);
  const hasNonFoilOption = Boolean(card.prices.usd);
  const manaSymbols = parseManaCost(card.mana_cost);

  // Compute format legalities counts
  const legalitiesList = TRACKED_FORMATS.map(({ key, label }) => {
    const rawStatus = card.legalities?.[key];
    const isLegal = rawStatus === 'legal';
    const isBanned = rawStatus === 'banned';
    return {
      key,
      label,
      rawStatus,
      isLegal,
      isBanned,
    };
  });

  const legalCount = legalitiesList.filter((f) => f.isLegal).length;
  const illegalCount = legalitiesList.length - legalCount;

  const filteredFormats = legalitiesList.filter((f) => {
    if (formatView === 'legal') return f.isLegal;
    if (formatView === 'illegal') return !f.isLegal;
    return true;
  });

  const handleAddToCart = () => {
    if (usdPrice === null || finish === null || stock <= 0) return;
    add(
      {
        // One cart line per printing and finish, matching the quick add on the tiles.
        id: `${card.id}-${finish}`,
        name: card.name,
        price: usdPrice,
        kind: 'single',
        subtitle: `${card.set_name} · ${finishLabel(finish)} · ${lang}`,
        image: cardImage(card, 'small'),
      },
      qty,
    );
    onClose();
  };

  return (
    <Dialog open={card !== null} onClose={onClose} label={card.name}>
      <div className="panel relative flex max-h-[calc(100dvh-1.5rem)] w-[min(54rem,calc(100vw-1.5rem))] flex-col gap-6 overflow-y-auto overscroll-contain p-5 sm:flex-row sm:p-7">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle"
          className="absolute right-3.5 top-3.5 z-20 grid size-8 place-items-center rounded-lg border border-espresso/10 bg-parchment-well text-espresso-soft transition-colors hover:text-honey-ink active:scale-95"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        {/* 1. Left Column: Pristine Card Showcase */}
        <div className="mx-auto flex w-60 shrink-0 flex-col items-center gap-3 sm:w-68">
          <Card3D
            front={image}
            back={card.card_faces?.[1]?.image_uris?.large}
            alt={card.name}
            className={preferFoil ? 'ring-2 ring-honey shadow-[0_0_28px_rgba(242,159,56,0.45)]' : ''}
          />

          {/* Sleek Segmented Finish Toggle (No Foil vs Foil) */}
          {hasFoilOption && hasNonFoilOption && (
            <div className="flex w-full rounded-xl border border-espresso/10 bg-parchment-well p-1 text-xs">
              <button
                type="button"
                onClick={() => setPreferFoil(false)}
                className={`flex-1 rounded-md py-1.5 font-bold transition-all ${
                  !preferFoil
                    ? 'bg-honey text-espresso shadow-sm scale-101'
                    : 'text-espresso-soft hover:text-espresso'
                }`}
              >
                No Foil
              </button>
              <button
                type="button"
                onClick={() => setPreferFoil(true)}
                className={`flex items-center justify-center gap-1.5 flex-1 rounded-md py-1.5 font-bold transition-all ${
                  preferFoil
                    ? 'bg-gradient-to-r from-honey to-honey-deep text-espresso shadow-sm scale-101'
                    : 'text-espresso-soft hover:text-espresso'
                }`}
              >
                <Sparkles className="size-3" aria-hidden="true" />
                <span>Foil</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Right Column: Card Intelligence & Format Legality */}
        <div className="flex flex-1 flex-col gap-3.5 sm:pt-0">
          {/* Header Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2 pr-8 text-xs">
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold border bg-parchment-raised ${rarityTone(card.rarity)}`}
            >
              {rarity}
            </span>
            <span className="font-semibold text-espresso-soft">
              {card.set_name} {card.set && `[${card.set.toUpperCase()}]`}
            </span>
            <span className="text-espresso-mute font-mono text-xs">
              #{card.collector_number ?? '00'}
            </span>
            <span className="rounded bg-parchment-well px-1.5 py-0.5 font-mono text-[10px] text-moss-ink font-bold border border-espresso/10">
              {lang}
            </span>
            {cardArtLabels(card).map((label) => (
              <span key={label} className="rounded border border-honey/60 bg-honey-tint px-1.5 py-0.5 text-[10px] font-bold text-honey-ink">
                {label}
              </span>
            ))}
          </div>

          {/* Card Title & Mana Cost */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-espresso/10 pb-2">
            <h2 className="font-display text-2xl font-black text-espresso sm:text-3xl leading-tight">
              {card.name}
            </h2>
            {manaSymbols.length > 0 && (
              <div className="flex items-center gap-1">
                {manaSymbols.map((sym, i) => (
                  <ManaBadge key={i} symbol={sym} />
                ))}
              </div>
            )}
          </div>

          {/* Type Line */}
          <p className="text-xs sm:text-sm font-semibold text-espresso-soft -mt-1">
            {card.type_line}
          </p>

          {/* Oracle Rules Text */}
          {card.oracle_text && (
            <div className="whitespace-pre-line rounded-lg border border-espresso/10 bg-parchment-well p-3 text-xs sm:text-sm leading-relaxed text-espresso shadow-inner">
              {card.oracle_text}
            </div>
          )}

          {/* Flavor Text Lore */}
          {card.flavor_text && (
            <p className="border-l-2 border-honey/60 pl-3 font-serif text-sm font-medium italic text-espresso-soft">
              «{card.flavor_text}»
            </p>
          )}

          {/* Specs Micro-Strip: Condición, Stock, Ilustrador */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-lg border border-espresso/10 bg-parchment-well p-2.5 text-xs">
            <div>
              <span className="text-espresso-mute block text-[9px] font-bold">
                Condición
              </span>
              <span className="font-bold text-moss-ink">{condition}</span>
            </div>
            <div>
              <span className="text-espresso-mute block text-[9px] font-bold">
                Disponibilidad
              </span>
              <span className={stock > 0 ? 'font-bold text-moss-ink' : 'font-bold text-ember-ink'}>
                {stock > 0 ? `${stock} unidades en almacén` : 'Agotado'}
              </span>
            </div>
            {card.artist && (
              <div className="col-span-2 sm:col-span-1">
                <span className="text-espresso-mute block text-[9px] font-bold">
                  Ilustrador
                </span>
                <span className="text-espresso font-semibold truncate block">
                  {card.artist}
                </span>
              </div>
            )}
          </div>

          {/* 3. Redesigned Format Legality Section (High Contrast, Clear Illegals) */}
          <div className="rounded-lg border border-espresso/10 bg-parchment-well p-3 space-y-2">
            {/* Header & Quick Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-espresso/10 pb-2">
              <span className="text-xs font-bold text-espresso-soft">
                Legalidad en Formatos
              </span>

              {/* View Toggle: Todos / Solo Ilegales / Solo Legales */}
              <div className="flex items-center gap-1 rounded bg-parchment-well p-0.5 text-[10px] font-bold border border-espresso/10">
                <button
                  type="button"
                  onClick={() => setFormatView('all')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    formatView === 'all'
                      ? 'bg-espresso/10 text-espresso'
                      : 'text-espresso-soft hover:text-espresso'
                  }`}
                >
                  Todos ({legalitiesList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFormatView('illegal')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                    formatView === 'illegal'
                      ? 'bg-ember/15 text-ember-ink font-extrabold'
                      : 'text-ember-ink hover:bg-ember/10'
                  }`}
                >
                  <X className="size-2.5" />
                  <span>Ilegales ({illegalCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormatView('legal')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                    formatView === 'legal'
                      ? 'bg-moss/15 text-moss-ink font-extrabold'
                      : 'text-moss-ink hover:bg-moss/10'
                  }`}
                >
                  <Check className="size-2.5" />
                  <span>Legales ({legalCount})</span>
                </button>
              </div>
            </div>

            {/* Formats Grid: High Contrast Visual Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-0.5">
              {filteredFormats.map(({ key, label, isLegal, isBanned }) => (
                <div
                  key={key}
                  className={`flex items-center justify-between rounded-md px-2.5 py-1.5 border text-xs transition-colors ${
                    isLegal
                      ? 'border-moss/30 bg-moss/10 text-espresso'
                      : isBanned
                      ? 'border-ember/50 bg-ember/15 text-espresso'
                      : 'border-ember/25 bg-ember/5 text-espresso'
                  }`}
                >
                  <span className="font-semibold truncate pr-1">{label}</span>

                  {isLegal ? (
                    <span className="flex shrink-0 items-center gap-1 rounded bg-moss/15 px-1.5 py-0.5 font-mono text-[9px] font-black text-moss-ink">
                      <Check className="size-2.5 stroke-[3]" aria-hidden="true" />
                      Legal
                    </span>
                  ) : isBanned ? (
                    <span className="flex shrink-0 items-center gap-1 rounded bg-ember px-1.5 py-0.5 font-mono text-[9px] font-black text-parchment-raised">
                      <Ban className="size-2.5 stroke-[3]" aria-hidden="true" />
                      Banned
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1 rounded bg-ember/15 px-1.5 py-0.5 font-mono text-[9px] font-black text-ember-ink">
                      <X className="size-2.5 stroke-[3]" aria-hidden="true" />
                      No Legal
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Purchase Footer */}
          <div className="mt-auto flex flex-col gap-3 border-t border-espresso/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Price Tags */}
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-extrabold tabular-nums text-espresso sm:text-3xl">
                {copPrice !== null ? formatCOP(copPrice) : 'Sin precio'}
              </span>
              {usdPrice !== null && (
                <span className="font-mono text-xs text-espresso-soft mt-0.5">
                  Equivalente a {formatUSD(usdPrice)}
                </span>
              )}
            </div>

            {/* Stepper & Add to Morral */}
            <div className="flex items-center gap-2.5">
              {stock > 1 && (
                <div className="flex items-center rounded-xl border border-espresso/10 bg-parchment-well">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="grid size-8 place-items-center text-espresso-soft hover:text-honey-ink active:scale-95 disabled:opacity-30"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-bold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(stock, q + 1))}
                    disabled={qty >= stock}
                    className="grid size-8 place-items-center text-espresso-soft hover:text-honey-ink active:scale-95 disabled:opacity-30"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              )}

              <button
                type="button"
                className="btn btn-primary"
                disabled={usdPrice === null || stock <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="size-4" aria-hidden="true" />
                <span>Añadir al morral</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
