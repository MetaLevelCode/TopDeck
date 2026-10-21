import type { CSSProperties, MouseEvent } from 'react';
import { Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { formatCOP, formatUSD } from '../lib/format';
import {
  cardImage,
  cardLangLabel,
  cardPrice,
  cardPriceCOP,
  cardRarityLabel,
  cardStock,
} from '../lib/scryfall';
import { useCart } from '../store/cart';
import type { ScryfallCard } from '../types';

interface CardTileProps {
  card: ScryfallCard;
  index: number;
  onSelect: (card: ScryfallCard) => void;
}

export function CardTile({ card, index, onSelect }: CardTileProps) {
  const { add } = useCart();
  const image = cardImage(card);
  const usdPrice = cardPrice(card);
  const copPrice = cardPriceCOP(card);
  const stock = cardStock(card);
  // Only consider foil if the printing is exclusively foil or etched
  const isFoil = Boolean(
    card.finishes?.includes('foil') &&
      (!card.finishes?.includes('nonfoil') || (card.prices.usd_foil && !card.prices.usd)),
  );
  const lang = cardLangLabel(card);
  const rarity = cardRarityLabel(card.rarity);

  const handleQuickAdd = (e: MouseEvent) => {
    e.stopPropagation();
    if (usdPrice === null || stock <= 0) return;
    add({
      id: card.id,
      name: card.name,
      price: usdPrice,
      kind: 'single',
      subtitle: `${card.set_name} · #${card.collector_number ?? '00'} · ${lang}`,
      image: cardImage(card, 'small'),
    });
  };

  const rarityMicroColor =
    {
      Mítica: 'text-amber-300 border-amber-500/40 bg-base-dark/85',
      Rara: 'text-yellow-300 border-yellow-400/40 bg-base-dark/85',
      Infrecuente: 'text-slate-200 border-slate-300/40 bg-base-dark/85',
      Común: 'text-stone-400 border-stone-500/30 bg-base-dark/85',
    }[rarity] ?? 'text-ui-latte border-ui-cocoa/40 bg-base-dark/85';

  return (
    <article
      onClick={() => onSelect(card)}
      aria-label={`Ver detalle de ${card.name}`}
      className="group rise relative flex flex-col rounded-jrpg border-2 border-ui-cocoa bg-base-mocha/90 p-2 shadow-panel transition-all duration-200 hover:-translate-y-1 hover:border-accent-clay/80 hover:shadow-[0_8px_24px_rgba(26,18,14,0.85)] cursor-pointer"
      style={{ '--i': index % 12 } as CSSProperties}
    >
      {/* 1. Large Card Image Frame (Hero of the Card) */}
      <div className="relative aspect-[488/680] w-full overflow-hidden rounded-[3.8%] bg-base-dark shadow-inner">
        {image ? (
          <img
            src={image}
            alt={card.name}
            width={488}
            height={680}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="grid size-full place-items-center p-3 text-center text-xs text-ui-latte">
            Sin ilustración
          </div>
        )}

        {/* Subtle Micro-Tags: Foil & Rarity (Restados de tamaño, no invasivos) */}
        <div className="absolute right-1.5 top-1.5 flex items-center gap-1 pointer-events-none">
          {isFoil && (
            <span
              title="Carta con acabado Foil"
              className="flex items-center gap-0.5 rounded px-1 py-0.5 font-mono text-[8px] font-bold text-amber-300 bg-base-dark/85 border border-amber-400/30 backdrop-blur-xs shadow-xs"
            >
              <Sparkles className="size-2 text-amber-300" aria-hidden="true" />
              Foil
            </span>
          )}
          <span
            className={`rounded px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs border ${rarityMicroColor}`}
          >
            {rarity}
          </span>
        </div>

        {/* Subtle hover inspect pill */}
        <div className="absolute inset-0 flex items-center justify-center bg-base-dark/45 opacity-0 backdrop-blur-[1px] transition-opacity duration-150 group-hover:opacity-100">
          <span className="flex items-center gap-1 rounded-jrpg border border-ui-cocoa bg-base-dark/95 px-3 py-1.5 text-xs font-bold text-ui-parchment shadow-panel">
            <Eye className="size-3.5 text-accent-clay" aria-hidden="true" />
            Ver carta
          </span>
        </div>
      </div>

      {/* 2. Compact & Tight Card Info (Prioritizing the image) */}
      <div className="mt-2 flex flex-1 flex-col justify-between gap-1.5 px-0.5">
        <div>
          {/* Card Name */}
          <h3
            title={card.name}
            className="truncate font-display text-sm font-extrabold text-ui-parchment transition-colors group-hover:text-accent-clay sm:text-base"
          >
            {card.name}
          </h3>

          {/* Compact Single-line Metadata: Set · #Number · Lang · NM */}
          <p
            className="mt-0.5 truncate text-[11px] font-medium text-ui-latte"
            title={`${card.set_name} · #${card.collector_number ?? '00'} · ${lang} · NM`}
          >
            <span className="text-ui-latte/90">{card.set_name}</span>
            <span className="mx-1 text-ui-cocoa">·</span>
            <span>#{card.collector_number ?? '00'}</span>
            <span className="mx-1 text-ui-cocoa">·</span>
            <span className="font-mono text-[10px] text-accent-sage">{lang}</span>
            <span className="mx-1 text-ui-cocoa">·</span>
            <span className="text-[10px] font-semibold text-accent-botanical">NM</span>
          </p>
        </div>

        {/* Pricing & Stock Row (Tight & Clean) */}
        <div className="mt-1 flex items-center justify-between gap-2 border-t border-ui-cocoa/40 pt-1.5">
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-extrabold text-ui-parchment sm:text-lg">
              {copPrice !== null ? formatCOP(copPrice) : 'Consultar'}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-ui-latte">
              {usdPrice !== null && <span>{formatUSD(usdPrice)}</span>}
              <span>·</span>
              {stock > 0 ? (
                <span className="font-sans font-semibold text-accent-sage">
                  {stock} disp.
                </span>
              ) : (
                <span className="font-sans font-semibold text-rose-400">Agotado</span>
              )}
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            disabled={usdPrice === null || stock <= 0}
            onClick={handleQuickAdd}
            aria-label={`Añadir ${card.name} al morral`}
            title="Añadir al morral de compra"
            className="btn btn-primary btn-sm size-8 shrink-0 p-0 shadow-panel transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
