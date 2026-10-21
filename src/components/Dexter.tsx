import { MessageCircle } from 'lucide-react';
import { useDexter } from '../store/dexter';
import type { DexterMood } from '../types';

const HEADS: Record<DexterMood, string> = {
  idle: '/img/dexter-idle.webp',
  smile: '/img/dexter-smile.webp',
  thoughtful: '/img/dexter-thoughtful.webp',
  angry: '/img/dexter-angry.webp',
};
const MOODS = Object.keys(HEADS) as DexterMood[];

/** All four heads stay mounted and cross-fade, so a mood change never waits on the network. */
function Heads() {
  const { mood } = useDexter();
  return (
    <>
      {MOODS.map((m) => (
        <img
          key={m}
          src={HEADS[m]}
          alt=""
          width={600}
          height={802}
          decoding="async"
          className="absolute inset-0 size-full object-contain transition-opacity duration-150"
          style={{ opacity: m === mood ? 1 : 0 }}
        />
      ))}
    </>
  );
}

/** Full-body Dexter for the storefront hero. Head and body are separate layers (1012×1352 canvas). */
export function DexterSprite({ className = '' }: { className?: string }) {
  return (
    <div className={`relative aspect-[1012/1352] ${className}`}>
      <img src="/img/dexter-body.webp" alt="" width={600} height={802} className="absolute inset-0 size-full object-contain" />
      <Heads />
    </div>
  );
}

/** Floating helper: a round portrait that speaks in a bubble and gives a tip when pressed. */
export function DexterHelper() {
  const { speech, tip } = useDexter();
  return (
    <div className="pointer-events-none fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-3 z-30 flex items-end gap-3 md:bottom-5 md:right-5">
      <div role="status" aria-live="polite">
        {speech && (
          <p
            key={speech}
            className="pop pointer-events-auto max-w-[15rem] origin-bottom-right rounded-jrpg border-2 border-ui-cocoa bg-base-dark px-3.5 py-2.5 text-sm font-semibold leading-snug shadow-panel"
          >
            {speech}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={tip}
        aria-label="Hablar con Dexter"
        className="pointer-events-auto relative size-14 shrink-0 rounded-full border-2 border-ui-cocoa bg-base-mocha shadow-panel transition-transform duration-150 ease-out active:scale-95"
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute -left-[42%] -top-[14%] block aspect-[1012/1352] w-[140%]">
            <Heads />
          </span>
        </span>
        <MessageCircle
          className="absolute -right-1 -top-1 size-5 rounded-full bg-accent-clay p-1 text-ui-parchment"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
