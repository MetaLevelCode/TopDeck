import { MessageCircle } from 'lucide-react';
import { useDexter } from '../store/dexter';

/**
 * Dexter always wears his idle face: the old mood heads had the expression pasted inside the hat.
 * Moods still flow through `say()`, ready for redrawn heads (hat included) to come back here.
 */
function Head() {
  return (
    <img
      src="/img/dexter-idle.webp"
      alt=""
      width={600}
      height={802}
      decoding="async"
      className="absolute inset-0 size-full object-contain"
    />
  );
}

/** Full-body Dexter for the storefront hero. Head and body are separate layers (1012×1352 canvas). */
export function DexterSprite({ className = '' }: { className?: string }) {
  return (
    <div className={`relative aspect-[1012/1352] ${className}`}>
      <img src="/img/dexter-body.webp" alt="" width={600} height={802} className="absolute inset-0 size-full object-contain" />
      <Head />
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
            className="pop pointer-events-auto max-w-[15rem] origin-bottom-right rounded-xl border border-espresso/10 bg-parchment-well px-3.5 py-2.5 text-sm font-semibold leading-snug shadow-lift"
          >
            {speech}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={tip}
        aria-label="Hablar con Dexter"
        className="pointer-events-auto relative size-14 shrink-0 rounded-full border border-espresso/10 bg-parchment-raised shadow-lift transition-transform duration-150 ease-out active:scale-95"
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute -left-[42%] -top-[14%] block aspect-[1012/1352] w-[140%]">
            <Head />
          </span>
        </span>
        <MessageCircle
          className="absolute -right-1 -top-1 size-5 rounded-full bg-honey p-1 text-espresso"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
