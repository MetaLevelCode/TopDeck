import { DoorOpen } from 'lucide-react';

export function Footer({ onExit }: { onExit: () => void }) {
  return (
    <footer className="border-t border-espresso/10 bg-parchment-card/70 px-4 pb-28 pt-8 md:pb-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-xs text-espresso-soft sm:flex-row sm:text-left">
        <p>
          <span className="font-display text-sm text-espresso">TOP DECK</span> · Taberna y tienda de cartas
        </p>
        <p>Datos de cartas por Scryfall · © {new Date().getFullYear()}</p>
        <button type="button" onClick={onExit} className="chip">
          <DoorOpen className="size-3.5" aria-hidden="true" />
          Volver a la puerta
        </button>
      </div>
    </footer>
  );
}
