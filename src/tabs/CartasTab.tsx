import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowDownUp, RefreshCw } from 'lucide-react';
import { CardDetailDialog } from '../components/CardDetailDialog';
import { CardFilterPanel } from '../components/CardFilterPanel';
import { CardSearchBox } from '../components/CardSearchBox';
import { CardTile } from '../components/CardTile';
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  SUGGESTIONS,
  buildScryfallQuery,
  cardStock,
  fetchCardPage,
  searchCards,
} from '../lib/scryfall';
import type { CardFilters, CardPage } from '../lib/scryfall';
import { useDebouncedValue } from '../lib/useDebouncedValue';
import { useDexter } from '../store/dexter';
import type { ScryfallCard } from '../types';

/** Results wait for typing to pause, so a search isn't fired on every keystroke. */
const RESULTS_DELAY_MS = 400;

const GAMES = [
  { id: 'mtg', label: 'Magic: The Gathering', active: true },
  { id: 'pokemon', label: 'Pokémon TCG', active: false },
  { id: 'yugioh', label: 'Yu-Gi-Oh!', active: false },
  { id: 'onepiece', label: 'One Piece', active: false },
  { id: 'lorcana', label: 'Disney Lorcana', active: false },
] as const;

type Results =
  | { status: 'loading' }
  | ({ status: 'ready'; loadingMore: boolean; moreFailed: boolean } & CardPage)
  | { status: 'error'; message: string };

/** `exact` is set when the name came from a suggestion: then every printing of that one card is shown. */
type Query = { text: string; exact: boolean };

const plural = (n: number, one: string, many: string) => `${n.toLocaleString('es-CO')} ${n === 1 ? one : many}`;

export function CartasTab({ initialQuery = '' }: { initialQuery?: string }) {
  const { say } = useDexter();
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState<Query>({ text: initialQuery.trim(), exact: false });
  const [filters, setFilters] = useState<CardFilters>(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [results, setResults] = useState<Results>({ status: 'loading' });
  const [selected, setSelected] = useState<ScryfallCard | null>(null);
  // Aborting the current search also drops a "load more" still in flight for it.
  const search = useRef<AbortController>();
  const typed = useDebouncedValue(input.trim(), RESULTS_DELAY_MS);

  const runSearch = (text: string, exact = false) =>
    setQuery((prev) => (prev.text === text && (prev.exact || !exact) ? prev : { text, exact }));

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      setQuery({ text: initialQuery.trim(), exact: false });
    }
  }, [initialQuery]);

  // The box drives the results once typing pauses; a picked name stays exact until its text changes.
  useEffect(() => runSearch(typed), [typed]);

  useEffect(() => {
    const controller = new AbortController();
    search.current = controller;
    const text = query.exact ? `!"${query.text}"` : query.text;
    const { q, order, dir } = buildScryfallQuery(filters, text);

    setResults({ status: 'loading' });
    searchCards(q, order, dir, controller.signal)
      .then((page) => {
        setResults({ status: 'ready', loadingMore: false, moreFailed: false, ...page });
        if (page.total === 0) say('No hay cartas con esos filtros o nombre. Intenta ajustar la búsqueda.', 'angry');
        else if (query.exact) say(`${query.text}: ${plural(page.total, 'impresión', 'impresiones')} en el grimorio.`, 'smile');
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
  }, [query, filters, attempt, say]);

  const loadMore = () => {
    if (results.status !== 'ready' || !results.nextPage || results.loadingMore) return;
    const signal = search.current?.signal;
    setResults({ ...results, loadingMore: true, moreFailed: false });
    fetchCardPage(results.nextPage, signal)
      .then((page) => {
        if (signal?.aborted) return;
        setResults((prev) =>
          prev.status === 'ready'
            ? { ...prev, cards: [...prev.cards, ...page.cards], nextPage: page.nextPage, loadingMore: false }
            : prev,
        );
      })
      .catch(() => {
        if (signal?.aborted) return;
        setResults((prev) => (prev.status === 'ready' ? { ...prev, loadingMore: false, moreFailed: true } : prev));
      });
  };

  const pickName = (name: string) => {
    setInput(name);
    runSearch(name, true);
  };

  // shortcut: stock is simulated per card, so "only in stock" filters each loaded page here; move it to the inventory API once there is one.
  const cards = results.status === 'ready' ? results.cards : [];
  const shown = filters.inStockOnly ? cards.filter((c) => cardStock(c) > 0) : cards;
  const prefer = filters.finish === 'all' ? undefined : filters.finish;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl">Catálogo de cartas</h1>
            <p className="mt-1 text-sm text-espresso-soft">
              Todas las impresiones de cada carta · Precios en COP y USD · Envíos a todo el país
            </p>
          </div>
        </div>

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
              className={`chip shrink-0 ${game.active ? 'border-honey bg-honey font-extrabold' : 'text-espresso-soft'}`}
            >
              {game.label}
              {!game.active && <span className="text-[10px] opacity-75">(Pronto)</span>}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <CardSearchBox value={input} onChange={setInput} onSubmit={() => runSearch(input.trim())} onPick={pickName} />

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <ArrowDownUp className="size-3.5 shrink-0 text-honey-ink" aria-hidden="true" />
            <select
              aria-label="Ordenar resultados"
              value={filters.sort ?? 'edhrec'}
              onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value as CardFilters['sort'] }))}
              className="field py-2 pl-2.5 pr-8 text-xs font-bold"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CardFilterPanel
          filters={filters}
          onChange={setFilters}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen((prev) => !prev)}
          totalCards={results.status === 'ready' ? results.total : undefined}
        />

        <div className="-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-espresso-soft">
            Populares:
          </span>
          {SUGGESTIONS.map((name) => (
            <button key={name} type="button" className="chip shrink-0" onClick={() => pickName(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {results.status === 'loading' && (
        <div aria-busy="true" aria-label="Cargando cartas del catálogo" className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl border border-espresso/10 bg-parchment-raised/60 p-2">
              <div className="aspect-[488/680] w-full animate-pulse rounded-[4%] bg-parchment-well" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-parchment-well" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-parchment-well" />
              <div className="mt-auto h-5 w-full animate-pulse rounded bg-parchment-well" />
            </div>
          ))}
        </div>
      )}

      {results.status === 'error' && (
        <div role="alert" className="panel flex flex-col items-center gap-3 px-6 py-12 text-center">
          <AlertCircle className="size-10 text-ember" aria-hidden="true" />
          <h3 className="text-lg">Error al consultar el grimorio</h3>
          <p className="max-w-md text-sm text-espresso-soft">{results.message}</p>
          <button type="button" className="btn btn-secondary mt-2" onClick={() => setAttempt((n) => n + 1)}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Reintentar búsqueda
          </button>
        </div>
      )}

      {results.status === 'ready' && shown.length === 0 && (
        <div className="panel flex flex-col items-center gap-3 py-16 text-center">
          <img src="/img/libro.webp" alt="" width={140} height={140} className="size-32 object-contain opacity-80" />
          <h3 className="text-lg">No se encontraron cartas con esos criterios</h3>
          <p className="max-w-md text-sm text-espresso-soft">
            Prueba a quitar algunos filtros (arte, artista, set) o revisa la ortografía del nombre.
          </p>
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={() => {
              setInput('');
              setQuery({ text: '', exact: false });
              setFilters(DEFAULT_FILTERS);
            }}
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}

      {results.status === 'ready' && shown.length > 0 && (
        <section aria-label="Resultados del catálogo" className="space-y-6">
          <p className="text-sm text-espresso-soft" aria-live="polite">
            Mostrando <span className="font-bold tabular-nums text-espresso">{shown.length.toLocaleString('es-CO')}</span> de{' '}
            <span className="font-bold tabular-nums text-espresso">{plural(results.total, 'impresión', 'impresiones')}</span>
            {query.exact && (
              <>
                {' '}
                de <span className="font-serif font-bold italic text-espresso">{query.text}</span>
              </>
            )}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {shown.map((card, i) => (
              <CardTile key={card.id} card={card} index={i} prefer={prefer} onSelect={setSelected} />
            ))}
          </div>

          {results.nextPage && (
            <div className="flex flex-col items-center gap-2 pt-4">
              <button
                type="button"
                className="btn btn-secondary px-8 py-3"
                onClick={loadMore}
                disabled={results.loadingMore}
                aria-busy={results.loadingMore}
              >
                {results.loadingMore ? 'Cargando impresiones…' : 'Cargar más impresiones'}
              </button>
              {results.moreFailed && (
                <p role="alert" className="text-xs font-semibold text-ember-ink">
                  No pudimos traer la siguiente página. Vuelve a intentarlo.
                </p>
              )}
            </div>
          )}
        </section>
      )}

      <CardDetailDialog card={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
