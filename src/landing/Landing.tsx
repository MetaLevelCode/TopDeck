import { useCallback, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ChevronDown, Search, User } from 'lucide-react';
import { BACKDROP_OVERLAY } from '../components/TavernBackdrop';
import { useScrollScrub } from './useScrollScrub';

const VIDEO_SRC = '/video/door.mp4';
const POSTER_SRC = '/img/door-poster.webp';
/** Scroll distance of the whole entrance, in viewport heights. */
const TRACK_SVH = 480;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (from: number, to: number, v: number) => {
  const t = clamp01((v - from) / (to - from));
  return t * t * (3 - 2 * t);
};

function canScrub(): boolean {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !saveData;
}

interface LandingProps {
  onEnter: () => void;
  onSearch?: (query: string) => void;
  onGoToProfile?: () => void;
}

/**
 * 3D entrance scrollytelling:
 * - Hanging wooden sign "TOP DECK" is directly clickable to enter immediately.
 * - Top header provides quick search and profile access.
 * - Brand hero ("TOP DECK · Competitividad y coleccionismo") framed in the right-hand landscape.
 */
export function Landing({ onEnter, onSearch, onGoToProfile }: LandingProps) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const signRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  const [supportsScrub] = useState(canScrub);
  const [videoFailed, setVideoFailed] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const scrub = supportsScrub && !videoFailed;

  const onFrame = useCallback((p: number) => {
    const fadeOut = 1 - smoothstep(0.02, 0.14, p);

    const hero = heroRef.current;
    if (hero) {
      hero.style.opacity = String(fadeOut);
      hero.style.transform = `translate3d(0, ${(fadeOut - 1) * 36}px, 0)`;
      hero.style.visibility = fadeOut < 0.01 ? 'hidden' : 'visible';
    }

    const sign = signRef.current;
    if (sign) {
      const signFade = 1 - smoothstep(0.01, 0.12, p);
      sign.style.opacity = String(signFade);
      sign.style.visibility = signFade < 0.01 ? 'hidden' : 'visible';
    }

    const header = headerRef.current;
    if (header) {
      header.style.opacity = String(fadeOut);
      header.style.visibility = fadeOut < 0.01 ? 'hidden' : 'visible';
    }

    const caption = captionRef.current;
    if (caption) {
      const inT = smoothstep(0.3, 0.38, p);
      caption.style.opacity = String(inT * (1 - smoothstep(0.52, 0.6, p)));
      caption.style.transform = `translate3d(0, ${(1 - inT) * 14}px, 0)`;
    }

    const veil = veilRef.current;
    if (veil) veil.style.opacity = String(BACKDROP_OVERLAY * smoothstep(0.9, 0.985, p));
  }, []);

  const { glideToEnd } = useScrollScrub({
    enabled: scrub,
    trackRef,
    stageRef,
    videoRef,
    onFrame,
    onEnter,
  });

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q && onSearch) onSearch(q);
    else onEnter();
  };

  return (
    <section
      ref={trackRef}
      aria-label="Entrada a TOP DECK"
      className="relative"
      style={{ height: scrub ? `${TRACK_SVH}svh` : '100svh' }}
    >
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden bg-base-dark">
        {/* Cinematic Video Layer */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={scrub ? VIDEO_SRC : undefined}
          poster={POSTER_SRC}
          preload={scrub ? 'auto' : 'none'}
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setVideoFailed(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(26,18,14,0.45))]" />

        {/* 1. TOP HEADER (Search bar & Profile button) */}
        <header
          ref={headerRef}
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-2.5 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 will-change-[transform,opacity]"
        >
          {/* Box 1: Search Bar */}
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="group relative w-full max-w-xs sm:max-w-sm md:max-w-md"
          >
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ui-latte transition-colors group-focus-within:text-accent-clay"
              aria-hidden="true"
            />
            <input
              type="search"
              name="card-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar cartas (ej: Sol Ring, Lotus)..."
              aria-label="Buscar cartas"
              autoComplete="off"
              enterKeyHint="search"
              className="field rounded-jrpg border-2 border-ui-cocoa bg-base-dark/85 py-2 pl-10 pr-20 text-xs text-ui-parchment shadow-panel backdrop-blur-md transition-colors placeholder:text-ui-latte/70 focus:border-accent-clay sm:text-sm"
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm absolute bottom-1 right-1 top-1 px-3 text-xs"
            >
              Buscar
            </button>
          </form>

          {/* Profile Button */}
          <button
            type="button"
            onClick={onGoToProfile}
            className="btn btn-secondary btn-sm flex shrink-0 items-center gap-1.5 rounded-jrpg border-2 border-ui-cocoa bg-base-dark/85 px-3.5 py-2 shadow-panel backdrop-blur-md"
            aria-label="Ir a perfil"
          >
            <User className="size-4 text-accent-clay" aria-hidden="true" />
            <span className="hidden font-display font-bold sm:inline">Perfil</span>
          </button>
        </header>

        {/* 2. DIRECT HITBOX OVER WOODEN SIGN ("TOP DECK") */}
        <button
          ref={signRef}
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEnter();
          }}
          onFocus={(e) => e.currentTarget.blur()}
          aria-label="Entrar a TOP DECK directamente"
          title="Entrar a TOP DECK"
          className="absolute z-20 cursor-pointer select-none border-0 bg-transparent p-0 outline-none focus:outline-none focus:ring-0 will-change-[opacity]"
          style={{
            left: 'max(0px, calc(50vw - 0.375 * max(100vw, calc(100svh * 16 / 9))))',
            top: 'max(0px, calc(50svh - 0.4306 * max(100svh, calc(100vw * 9 / 16))))',
            width: 'calc(0.25 * max(100vw, calc(100svh * 16 / 9)))',
            height: 'calc(0.3472 * max(100svh, calc(100vw * 9 / 16)))',
            maxWidth: '100vw',
            maxHeight: '100svh',
          }}
        />

        {/* 3. HERO INFO BLOCK (Framed in the right-hand landscape area where the red arrow points) */}
        <div
          ref={heroRef}
          className="absolute right-4 top-[46%] z-20 flex max-w-sm -translate-y-1/2 flex-col items-start will-change-[transform,opacity] sm:right-10 sm:max-w-md sm:items-end sm:text-right md:right-16 lg:right-24"
        >
          <h1 className="font-extrabold leading-none tracking-tight text-ui-parchment text-5xl [text-shadow:0_4px_24px_rgba(26,18,14,0.95)] sm:text-6xl md:text-7xl">
            TOP DECK
          </h1>

          <p className="mt-3 font-semibold text-ui-parchment text-base [text-shadow:0_2px_12px_rgba(26,18,14,0.9)] sm:text-xl">
            Competitividad y coleccionismo
          </p>

          <button
            type="button"
            className="btn btn-primary mt-6 px-7 py-3 text-base shadow-panel"
            onClick={scrub ? glideToEnd : onEnter}
          >
            Entrar a TOP DECK
          </button>

          {scrub && (
            <p className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ui-latte [text-shadow:0_1px_8px_rgba(26,18,14,0.95)]">
              <ChevronDown className="size-4 animate-bounce text-accent-clay" aria-hidden="true" />
              Desliza para entrar a TOP DECK
            </p>
          )}
        </div>

        {/* Mid-flight caption */}
        {scrub && (
          <p
            ref={captionRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[22%] px-8 text-center font-display font-semibold italic text-ui-parchment opacity-0 will-change-[transform,opacity] text-2xl [text-shadow:0_2px_18px_rgba(26,18,14,0.9)] sm:text-4xl"
          >
            Siempre hay una mesa libre.
          </p>
        )}

        {/* Ambient Darkening Veil for seamless handoff to tavern interior */}
        <div
          ref={veilRef}
          className="pointer-events-none absolute inset-0 bg-base-dark opacity-0 will-change-[opacity]"
        />
      </div>
    </section>
  );
}
