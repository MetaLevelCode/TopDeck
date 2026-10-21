import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AlertCircle, ArrowDownUp, RefreshCw, Search, Sparkles } from 'lucide-react';
import { CardDetailDialog } from '../components/CardDetailDialog';
import { CardFilterPanel } from '../components/CardFilterPanel';
import { CardTile } from '../components/CardTile';
import {
  SORT_OPTIONS,
  SUGGESTIONS,
  buildScryfallQuery,
  cardStock,
  searchCards,
} from '../lib/scryfall';
import type { CardFilters } from '../lib/scryfall';
import { useDexter } from '../store/dexter';
import type { ScryfallCard } from '../types';

const PAGE_SIZE = 24;

const GAMES = [
  { id: 'mtg', label: 'Magic: The Gathering', active: true },
  { id: 'pokemon', label: 'Pokémon TCG', active: false },
  { id: 'yugioh', label: 'Yu-Gi-Oh!', active: false },
  { id: 'onepiece', label: 'One Piece', active: false },
  { id: 'lorcana', label: 'Disney Lorcana', active: false },
] as const;

type Results =
  | { status: 'loading' }
  | { status: 'ready'; cards: ScryfallCard[]; totalCount: number }
  | { status: 'error'; message: string };

const DEFAULT_FILTERS: CardFilters = {
  game: 'mtg',
  set: '',
  format: '',
  rarity: [],
  color: [],
  cardType: [],
  finish: 'all',
  lang: 'all',
  inStockOnly: false,
  sort: 'edhrec',
};

export function CartasTab({ initialQuery = '' }: { initialQuery?: string }) {
  const { say } = useDexter();
  const [input, setInput] = useState(initialQuery);
  const [submittedText, setSubmittedText] = useState(initialQuery);
  const [filters, setFilters] = useState<CardFilters>(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [results, setResults] = useState<Results>({ status: 'loading' });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<ScryfallCard | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      setSubmittedText(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const controller = new AbortController();
    const { q, order, dir } = buildScryfallQuery(filters, submittedText);
    const hasQueryText = submittedText.trim() !== '';

    setResults({ status: 'loading' });
    setVisible(PAGE_SIZE);

    if (hasQueryText) {
      say(`Consultando en el grimorio «${submittedText}»…`, 'thoughtful', 7000);
    }

    searchCards(q, order, dir, controller.signal)
      .then((cards) => {
        // If inStockOnly is active, filter client-side
        const filtered = filters.inStockOnly ? cards.filter((c) => cardStock(c) > 0) : cards;
        setResults({ status: 'ready', cards: filtered, totalCount: filtered.length });

        if (hasQueryText) {
          if (filtered.length > 0) {
            say(`Encontré ${filtered.length} ${filtered.length === 1 ? 'carta' : 'cartas'} en la taberna.`);
          } else {
            say('No hay cartas con esos filtros o nombre. Intenta ajustar la búsqueda.', 'angry');
          }
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setResults({
          status: 'error',
          message: error instanceof Error ? error.message : 'No pudimos contactar con el catálogo.',
        });
        say('El grimorio de cartas no responde en este momento.', 'angry');
      });

    return () => controller.abort();
  }, [submittedText, filters, attempt, say]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedText(input.trim());
  };

  const handlePickSuggestion = (name: string) => {
    setInput(name);
    setSubmittedText(name);
  };

  const handleSortChange = (newSort: CardFilters['sort']) => {
    setFilters((prev) => ({ ...prev, sort: newSort }));
  };

  const displayedCards = useMemo(() => {
    if (results.status !== 'ready') return [];
    return results.cards.slice(0, visible);
  }, [results, visible]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Game Tabs & Catalog Title */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-ui-parchment sm:text-4xl">
              Catálogo de Cartas
            </h1>
            <p className="mt-1 text-xs text-ui-latte sm:text-sm">
              Singles originales · Precios en Pesos Colombianos (COP) y Dólares (USD)
            </p>
          </div>

          {/* Currency / Stock badge */}
          <div className="flex items-center gap-2 rounded-jrpg border border-ui-cocoa bg-base-dark px-3 py-1.5 text-xs text-ui-parchment">
            <span className="size-2 rounded-full bg-accent-sage animate-pulse" />
            <span className="font-bold">Envíos a todo el país</span>
          </div>
        </div>

        {/* Game Filter Bar (DracoStore style: MTG, Pokémon, One Piece, etc.) */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {GAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => {
                if (!game.active) {
                  say(`El catálogo de ${game.label} estará disponible en el próximo envío a la taberna.`, 'thoughtful', 4000);
                }
              }}
              className={`chip shrink-0 ${
                game.active
                  ? 'border-accent-clay bg-accent-clay text-ui-parchment font-extrabold'
                  : 'text-ui-latte/70 hover:text-ui-latte'
              }`}
            >
              {game.label}
              {!game.active && <span className="text-[10px] opacity-75">(Pronto)</span>}
            </button>
          ))}
        </div>
      </header>

      {/* 2. Main Search Bar & Action Controls */}
      <div className="space-y-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Text Search Form */}
          <form role="search" onSubmit={handleSubmit} className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ui-latte"
              aria-hidden="true"
            />
            <input
              type="search"
              name="card-search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Buscar cartas por nombre (ej: Sol Ring, Atraxa, Black Lotus)..."
              aria-label="Buscar carta por nombre"
              autoComplete="off"
              enterKeyHint="search"
              className="field rounded-jrpg border-2 border-ui-cocoa bg-base-dark py-2.5 pl-10 pr-24 text-xs text-ui-parchment placeholder:text-ui-latte/70 focus:border-accent-clay sm:text-sm"
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm absolute bottom-1 right-1 top-1 px-4 text-xs"
            >
              Buscar
            </button>
          </form>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <ArrowDownUp className="size-3.5 text-accent-clay shrink-0" aria-hidden="true" />
            <select
              aria-label="Ordenar resultados"
              value={filters.sort ?? 'edhrec'}
              onChange={(e) => handleSortChange(e.target.value as CardFilters['sort'])}
              className="field rounded-jrpg border-2 border-ui-cocoa bg-base-dark py-2 pl-2.5 pr-8 text-xs font-bold text-ui-parchment focus:border-accent-clay"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. The Deployable Filter Panel (Filtros Seleccionable) */}
        <CardFilterPanel
          filters={filters}
          onChange={setFilters}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen((prev) => !prev)}
          totalCards={results.status === 'ready' ? results.totalCount : undefined}
        />

        {/* 4. Quick Staples Suggestions */}
        <div className="-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ui-latte">
            <Sparkles className="size-3 text-accent-clay" aria-hidden="true" />
            Populares:
          </span>
          {SUGGESTIONS.map((name) => (
            <button
              key={name}
              type="button"
              className="chip shrink-0 text-xs hover:border-accent-clay"
              onClick={() => handlePickSuggestion(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Results Area */}
      {/* Loading Skeleton (3 columns for large card presentation) */}
      {results.status === 'loading' && (
        <div
          aria-busy="true"
          aria-label="Cargando cartas del catálogo"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-jrpg border-2 border-ui-cocoa/40 bg-base-mocha/60 p-2"
            >
              <div className="aspect-[488/680] w-full animate-pulse rounded-[4%] bg-base-dark" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-base-dark" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-base-dark" />
              <div className="mt-auto h-5 w-full animate-pulse rounded bg-base-dark" />
            </div>
          ))}
        </div>
      )}

      {/* Error View */}
      {results.status === 'error' && (
        <div
          role="alert"
          className="panel flex flex-col items-center gap-3 px-6 py-12 text-center"
        >
          <AlertCircle className="size-10 text-accent-clay" aria-hidden="true" />
          <h3 className="font-display text-lg font-bold text-ui-parchment">
            Error al consultar el grimorio
          </h3>
          <p className="max-w-md text-sm text-ui-latte">{results.message}</p>
          <button
            type="button"
            className="btn btn-secondary mt-2 flex items-center gap-2"
            onClick={() => setAttempt((n) => n + 1)}
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Reintentar búsqueda
          </button>
        </div>
      )}

      {/* Empty Results View */}
      {results.status === 'ready' && results.cards.length === 0 && (
        <div className="panel flex flex-col items-center gap-3 py-16 text-center">
          <img
            src="/img/libro.webp"
            alt=""
            width={140}
            height={140}
            className="size-32 object-contain opacity-80"
          />
          <h3 className="font-display text-lg font-bold text-ui-parchment">
            No se encontraron cartas con esos criterios
          </h3>
          <p className="max-w-md text-xs text-ui-latte sm:text-sm">
            Prueba a quitar algunos filtros (color, rareza, set) o revisa la ortografía del nombre.
          </p>
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={() => {
              setInput('');
              setSubmittedText('');
              setFilters(DEFAULT_FILTERS);
            }}
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}

      {/* Ready Results Grid */}
      {results.status === 'ready' && results.cards.length > 0 && (
        <section aria-label="Resultados del catálogo" className="space-y-6">
          <div className="flex items-center justify-between text-xs text-ui-latte">
            <p>
              Mostrando <span className="font-bold text-ui-parchment">{displayedCards.length}</span> de{' '}
              <span className="font-bold text-ui-parchment">{results.totalCount}</span> cartas
            </p>
            {visible < results.cards.length && (
              <span className="text-accent-sage font-semibold">Página 1 de {Math.ceil(results.cards.length / PAGE_SIZE)}</span>
            )}
          </div>

          {/* Cards Grid: Exactly 3 columns for large card presentation */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {displayedCards.map((card, i) => (
              <CardTile
                key={card.id}
                card={card}
                index={i}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* Load More Button */}
          {visible < results.cards.length && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                className="btn btn-secondary px-8 py-3 text-sm font-bold shadow-panel"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                Cargar más cartas ({results.cards.length - visible} restantes)
              </button>
            </div>
          )}
        </section>
      )}

      {/* 6. Card Detail Modal (DracoStore style full modal) */}
      <CardDetailDialog card={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
