import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TAVERN_EVENTS } from '../data/catalog';

const AUTOPLAY_MS = 6000;

/** The "Cuadro Mágico": tavern events inside the enchanted frame. Autoplay pauses on hover/focus and under reduced motion. */
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
      <div className="relative aspect-video">
        {/* The frame's window is opaque in the artwork, so the notice is pinned on top of it. */}
        <img
          src="/img/cuadro-magico.webp"
          alt=""
          width={1400}
          height={781}
          loading="lazy"
          className="pointer-events-none absolute inset-0 size-full"
        />
        <div className="absolute inset-x-[20.5%] inset-y-[22.5%] rounded-md bg-parchment-raised shadow-[inset_0_0_24px_rgba(56,36,20,0.12)]" />
        <div
          key={event.id}
          className="rise absolute inset-x-[23%] inset-y-[26%] flex flex-col items-center justify-center gap-1 text-center sm:gap-2"
          aria-live="polite"
        >
          <span className="text-[10px] font-extrabold text-moss-ink sm:text-xs">
            {event.tag} · {event.date}
          </span>
          <h3 className="text-base leading-tight sm:text-2xl">{event.title}</h3>
          <p className="hidden text-sm text-espresso-soft sm:block">{event.text}</p>
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
