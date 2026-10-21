import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { CardDetailDialog } from '../components/CardDetailDialog';
import { CardFilterPanel } from '../components/CardFilterPanel';
import { CardTile } from '../components/CardTile';
import {
  DEFAULT_FILTERS,
  buildScryfallQuery,
  cardStock,
  fetchCardPage,
  rescueSearch,
  searchCards,
} from '../lib/scryfall';
import type { CardFilters, CardPage } from '../lib/scryfall';
import { useDexter } from '../store/dexter';
import { useSearch } from '../store/search';
import type { ScryfallCard } from '../types';

/** Ten rows of the three-column grid per page. */
const PAGE_SIZE = 30;

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

const plural = (n: number, one: string, many: string) => `${n.toLocaleString('es-CO')} ${n === 1 ? one : many}`;

export function CartasTab() {
  const { say } = useDexter();
  const { query, setQuery } = useSearch();
  const [filters, setFilters] = useState<CardFilters>(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [results, setResults] = useState<Results>({ status: 'loading' });
  const [selected, setSelected] = useState<ScryfallCard | null>(null);
  const [page, setPage] = useState(0);
  const resultsRef = useRef<HTMLElement>(null);
  // Aborting the current search also drops a page fetch still in flight for it.
  const search = useRef<AbortController>();
  useEffect(() => {
    const controller = new AbortController();
    search.current = controller;
    const text = query.exact ? `!"${query.text}"` : query.text;
    const { q, order, dir } = buildScryfallQuery(filters, text);

    setResults({ status: 'loading' });
    setPage(0);
    searchCards(q, order, dir, controller.signal)
      .then(async (page) => {
        // Nothing found for what was typed: try the likely typo fix once (a mechanic word, then a card name).
        if (page.total === 0 && !query.exact && !query.typed) {
          const fix = await rescueSearch(query.text, controller.signal).catch(() => null);
          if (controller.signal.aborted) return;
          if (fix) return setQuery({ ...fix, typed: query.text });
        }
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
  }, [query, filters, attempt, say, setQuery]);

  const goToPage = (next: number) => {
    if (results.status !== 'ready' || results.loadingMore) return;
    const show = () => {
      setPage(next);
      resultsRef.current?.scrollIntoView({ block: 'start' });
    };
    // Scryfall serves 175 printings per request: follow next_page only when this page would come up short.
    if (available.length >= (next + 1) * PAGE_SIZE || !results.nextPage) return show();
    const signal = search.current?.signal;
    setResults({ ...results, loadingMore: true, moreFailed: false });
    fetchCardPage(results.nextPage, signal)
      .then((more) => {
        if (signal?.aborted) return;
        setResults((prev) =>
          prev.status === 'ready'
            ? { ...prev, cards: [...prev.cards, ...more.cards], nextPage: more.nextPage, loadingMore: false }
            : prev,
        );
        show();
      })
      .catch(() => {
        if (signal?.aborted) return;
        setResults((prev) => (prev.status === 'ready' ? { ...prev, loadingMore: false, moreFailed: true } : prev));
      });
  };

  // shortcut: stock is simulated per card, so "only in stock" filters each loaded page here; move it to the inventory API once there is one.
  const cards = results.status === 'ready' ? results.cards : [];
  const available = filters.inStockOnly ? cards.filter((c) => cardStock(c) > 0) : cards;
  const shown = available.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const pageCount = results.status === 'ready' ? Math.max(1, Math.ceil(results.total / PAGE_SIZE)) : 1;
  const hasNext = available.length > (page + 1) * PAGE_SIZE || (results.status === 'ready' && results.nextPage !== null);
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
        <CardFilterPanel
          filters={filters}
          onChange={setFilters}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen((prev) => !prev)}
          totalCards={results.status === 'ready' ? results.total : undefined}
        />
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

      {results.status === 'ready' && available.length === 0 && (
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
              setQuery({ text: '', exact: false });
              setFilters(DEFAULT_FILTERS);
            }}
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}

      {results.status === 'ready' && shown.length > 0 && (
        <section ref={resultsRef} aria-label="Resultados del catálogo" className="scroll-mt-24 space-y-6">
          {query.typed && (
            <p className="text-sm text-espresso-soft">
              No encontramos «{query.typed}». Te mostramos {query.exact ? 'la carta' : 'resultados para'}{' '}
              <span className="font-serif font-bold italic text-espresso">«{query.text}»</span>.
            </p>
          )}
          <p className="text-sm text-espresso-soft" aria-live="polite">
            Mostrando{' '}
            <span className="font-bold tabular-nums text-espresso">
              {(page * PAGE_SIZE + 1).toLocaleString('es-CO')}–{(page * PAGE_SIZE + shown.length).toLocaleString('es-CO')}
            </span>{' '}
            de{' '}
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

          {(page > 0 || hasNext) && (
            <nav aria-label="Páginas de resultados" className="flex flex-col items-center gap-2 pt-4">
              <div className="flex items-center gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => goToPage(page - 1)} disabled={page === 0 || results.loadingMore}>
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Anterior
                </button>
                <span className="text-sm font-bold tabular-nums text-espresso-soft" aria-live="polite">
                  {results.loadingMore ? 'Cargando…' : `Página ${(page + 1).toLocaleString('es-CO')} de ${pageCount.toLocaleString('es-CO')}`}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => goToPage(page + 1)}
                  disabled={!hasNext || results.loadingMore}
                  aria-busy={results.loadingMore}
                >
                  Siguiente
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
              {results.moreFailed && (
                <p role="alert" className="text-xs font-semibold text-ember-ink">
                  No pudimos traer la siguiente página. Vuelve a intentarlo.
                </p>
              )}
            </nav>
          )}
        </section>
      )}

      <CardDetailDialog card={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
