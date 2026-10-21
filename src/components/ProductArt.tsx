import { Gift, Layers, Package, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GAME_THEME } from '../data/catalog';
import type { Game, ProductCategory } from '../types';

const ICONS: Record<ProductCategory, LucideIcon> = {
  'Booster Box': Package,
  'Elite Trainer Box': Package,
  'Commander Deck': Layers,
  Bundle: Gift,
  'Collector Booster': Sparkles,
};

interface ProductArtProps {
  game: Game;
  category?: ProductCategory;
  /** Show the game name over the art (product cards); tiny thumbnails leave it out. */
  label?: boolean;
  className?: string;
}

/** Generated stand-in for product photos: a game-tinted tile with a category icon. */
export function ProductArt({ game, category = 'Booster Box', label = false, className = '' }: ProductArtProps) {
  const { from, to } = GAME_THEME[game];
  const Icon = ICONS[category];
  return (
    <div
      aria-hidden="true"
      className={`relative grid aspect-square place-items-center overflow-hidden rounded-lg border border-ui-cocoa/60 ${className}`}
      style={{ backgroundImage: `radial-gradient(circle at 30% 20%, ${from}, ${to})` }}
    >
      <Icon className="size-1/3 text-ui-parchment/90 drop-shadow-md" strokeWidth={1.5} />
      {label && (
        <span className="absolute bottom-2 left-2.5 text-[10px] font-bold uppercase tracking-wider text-ui-parchment/75">
          {game}
        </span>
      )}
    </div>
  );
}
