import { GAME_THEME } from '../data/catalog';
import type { Game } from '../types';

/** Stand-in until there are product photos: the game's colour with its name lettered on, like a box label. */
export function ProductArt({ game, className = '' }: { game: Game; className?: string }) {
  const { from, to } = GAME_THEME[game];
  return (
    <div
      aria-hidden="true"
      className={`grid aspect-square place-items-center overflow-hidden rounded-lg p-[6%] [container-type:inline-size] ${className}`}
      style={{ backgroundColor: to }}
    >
      <div className="grid size-full place-items-center rounded border-2 px-[6%] text-center" style={{ borderColor: from }}>
        <span className="font-display text-[15cqw] leading-none text-parchment-raised">{game}</span>
      </div>
    </div>
  );
}
