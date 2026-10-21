import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TAVERN_EVENTS } from '../data/catalog';

const AUTOPLAY_MS = 6000;

/** Tavern events, one notice at a time. Autoplay pauses on hover/focus and under reduced motion. */
export function EventBoard() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const event = TAVERN_EVENTS[index];
  const step = (delta: number) => setIndex((i) => (i + delta + TAVERN_EVENTS.length) % TAVERN_EVENTS.length);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % TAVERN_EVENTS.length), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Tablón de la taberna"
      className="mx-auto w-full max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="panel grid min-h-44 place-items-center px-6 py-8">
        <div key={event.id} className="rise flex flex-col items-center gap-2 text-center" aria-live="polite">
          <span className="text-xs font-extrabold text-moss-ink">
            {event.tag} · {event.date}
          </span>
          <h3 className="text-2xl leading-tight">{event.title}</h3>
          <p className="text-sm text-espresso-soft">{event.text}</p>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-center gap-1">
        <button type="button" onClick={() => step(-1)} aria-label="Evento anterior" className="grid size-10 place-items-center text-espresso-soft transition-colors hover:text-honey-ink active:scale-95">
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        {TAVERN_EVENTS.map((e, i) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir al evento ${i + 1}`}
            aria-current={i === index}
            className="grid size-8 place-items-center"
          >
            <span
              className={`h-2 rounded-full transition-[width,background-color] duration-200 ease-out ${
                i === index ? 'w-6 bg-honey' : 'w-2 bg-espresso/20'
              }`}
            />
          </button>
        ))}
        <button type="button" onClick={() => step(1)} aria-label="Evento siguiente" className="grid size-10 place-items-center text-espresso-soft transition-colors hover:text-honey-ink active:scale-95">
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
