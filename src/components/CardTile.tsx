import type { CSSProperties, MouseEvent } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { formatCOP, formatUSD } from '../lib/format';
import {
  cardArtLabels,
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
import type { Finish } from '../lib/scryfall';
import { useCart } from '../store/cart';
import type { ScryfallCard } from '../types';

const TAG =
  'flex items-center gap-0.5 rounded border bg-parchment-raised/95 px-1.5 py-0.5 text-[9px] font-bold shadow-rest';

interface CardTileProps {
  card: ScryfallCard;
  index: number;
  /** Finish the search is filtered to, so the price shown is the one being browsed. */
  prefer?: Finish;
  onSelect: (card: ScryfallCard) => void;
}

export function CardTile({ card, index, prefer, onSelect }: CardTileProps) {
  const { add } = useCart();
  const image = cardImage(card);
  const finish = pricedFinish(card, prefer);
  const usdPrice = cardPrice(card, prefer);
  const copPrice = cardPriceCOP(card, prefer);
  const stock = cardStock(card);
  const lang = cardLangLabel(card);

  const handleQuickAdd = (e: MouseEvent) => {
    e.stopPropagation();
    if (usdPrice === null || finish === null || stock <= 0) return;
    add({
      // One cart line per printing and finish, matching the detail dialog.
      id: `${card.id}-${finish}`,
      name: card.name,
      price: usdPrice,
      kind: 'single',
      subtitle: `${card.set_name} · #${card.collector_number ?? '00'} · ${finishLabel(finish)} · ${lang}`,
      image: cardImage(card, 'small'),
    });
  };

  return (
    <article
      onClick={() => onSelect(card)}
      aria-label={`Ver detalle de ${card.name}`}
      className="group rise relative flex cursor-pointer flex-col rounded-xl border border-espresso/10 bg-parchment-raised p-2 shadow-rest transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-honey hover:shadow-lift"
      style={{ '--i': index % 12 } as CSSProperties}
    >
      <div className="relative aspect-[488/680] w-full overflow-hidden rounded-[3.8%] bg-parchment-well shadow-inner">
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
          <div className="grid size-full place-items-center p-3 text-center text-xs text-espresso-soft">
            Sin ilustración
          </div>
        )}

        {/* What sets this printing apart: the finish being sold, special frames and rarity. */}
        <div className="pointer-events-none absolute inset-x-1.5 top-1.5 flex flex-wrap justify-end gap-1">
          {finish && finish !== 'nonfoil' && (
            <span className={`${TAG} border-honey/60 text-honey-ink`}>
              <Sparkles className="size-2.5" aria-hidden="true" />
              {finishLabel(finish)}
            </span>
          )}
          {cardArtLabels(card).map((label) => (
            <span key={label} className={`${TAG} border-espresso/20 text-espresso`}>
              {label}
            </span>
          ))}
          <span className={`${TAG} ${rarityTone(card.rarity)}`}>{cardRarityLabel(card.rarity)}</span>
        </div>
      </div>

      <div className="mt-2 flex flex-1 flex-col justify-between gap-1.5 px-0.5">
        <div>
          <h3 title={card.name} className="truncate text-sm sm:text-base">
            {/* Keyboard access to the detail; clicks anywhere on the tile bubble to the article. */}
            <button type="button" className="max-w-full truncate text-left transition-colors group-hover:text-honey-ink">
              {card.name}
            </button>
          </h3>

          <p
            className="mt-0.5 truncate text-[11px] font-medium text-espresso-soft"
            title={`${card.set_name} · #${card.collector_number ?? '00'} · ${lang} · NM`}
          >
            <span className="text-espresso-mute">{card.set_name}</span>
            <span className="mx-1 text-espresso-mute">·</span>
            <span>#{card.collector_number ?? '00'}</span>
            <span className="mx-1 text-espresso-mute">·</span>
            <span className="font-mono text-[10px] text-moss-ink">{lang}</span>
            <span className="mx-1 text-espresso-mute">·</span>
            <span className="text-[10px] font-semibold text-moss-ink">NM</span>
          </p>

          {card.artist && (
            <p className="truncate font-serif text-[13px] font-medium italic text-espresso-soft" title={card.artist}>
              Ilus. {card.artist}
            </p>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between gap-2 border-t border-espresso/10 pt-1.5">
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tabular-nums text-espresso sm:text-lg">
              {copPrice !== null ? formatCOP(copPrice) : 'Consultar'}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-espresso-soft">
              {usdPrice !== null && <span>{formatUSD(usdPrice)}</span>}
              <span>·</span>
              {stock > 0 ? (
                <span className="font-body font-semibold text-moss-ink">{stock} disp.</span>
              ) : (
                <span className="font-body font-semibold text-ember-ink">Agotado</span>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={usdPrice === null || stock <= 0}
            onClick={handleQuickAdd}
            aria-label={`Añadir ${card.name} al morral`}
            title="Añadir al morral de compra"
            className="btn btn-primary btn-sm size-8 shrink-0 p-0"
          >
            <ShoppingBag className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
