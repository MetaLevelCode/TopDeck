import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, Palette, SlidersHorizontal, X } from 'lucide-react';
import {
  ART_OPTIONS,
  CARD_TYPES,
  COLOR_OPTIONS,
  DEFAULT_FILTERS,
  FINISH_OPTIONS,
  FORMAT_OPTIONS,
  LANG_OPTIONS,
  POPULAR_SETS,
  RARITY_OPTIONS,
  SORT_OPTIONS,
  fetchArtistNames,
} from '../lib/scryfall';
import type { CardFilters } from '../lib/scryfall';
import { useDebouncedValue } from '../lib/useDebouncedValue';

/** Same pause as the card search: the artist filter applies once typing stops. */
const ARTIST_DELAY_MS = 400;

const LABEL = 'block text-xs font-bold text-espresso-soft';

interface CardFilterPanelProps {
  filters: CardFilters;
  onChange: (updated: CardFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
  /** Printings matching the current search, across every page. */
  totalCards?: number;
  /** Shown left of the Filtros button. */
  children?: ReactNode;
}

type ListKey = 'rarity' | 'color' | 'cardType' | 'art';
type Chip = { key: string; label: string; clear: Partial<CardFilters> };

const labelOf = (options: readonly { id: string; label: string }[], id: string) =>
  options.find((o) => o.id === id)?.label ?? id;

/** Artist name box with Scryfall's illustrator list as native suggestions. */
function ArtistFilter({ value, onCommit }: { value: string; onCommit: (artist: string) => void }) {
  const [text, setText] = useState(value);
  const [names, setNames] = useState<string[]>([]);
  const settled = useDebouncedValue(text.trim(), ARTIST_DELAY_MS);

  useEffect(() => {
    if (settled !== value) onCommit(settled);
    // Only a newly settled name commits; `value` changing on its own must not re-commit.
  }, [settled]);

  // A reset or a removed chip clears the box too.
  useEffect(() => {
    if (value === '') setText('');
  }, [value]);

  return (
    <>
      <input
        id="filter-artist"
        type="text"
        list="artist-names"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => void fetchArtistNames().then(setNames)}
        onBlur={() => text.trim() !== value && onCommit(text.trim())}
        placeholder="Ej: Rebecca Guay, John Avon…"
        autoComplete="off"
        className="field py-2 text-sm"
      />
      <datalist id="artist-names">
        {names.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </>
  );
}

export function CardFilterPanel({ filters, onChange, isOpen, onToggle, totalCards, children }: CardFilterPanelProps) {
  const set = (patch: Partial<CardFilters>) => onChange({ ...filters, ...patch });
  const listOf = (key: ListKey) => (filters[key] ?? []) as string[];
  const toggle = (key: ListKey, id: string) => {
    const list = listOf(key);
    set({ [key]: list.includes(id) ? list.filter((item) => item !== id) : [...list, id] } as Partial<CardFilters>);
  };
  const handleReset = () => onChange({ ...DEFAULT_FILTERS, sort: filters.sort ?? DEFAULT_FILTERS.sort });

  // Every active filter as a removable chip; the count on the button is their number.
  const listChips = (key: ListKey, options: readonly { id: string; label: string }[], prefix = ''): Chip[] =>
    listOf(key).map((id) => ({
      key: `${key}-${id}`,
      label: `${prefix}${labelOf(options, id)}`,
      clear: { [key]: listOf(key).filter((item) => item !== id) } as Partial<CardFilters>,
    }));
  const active: Chip[] = [
    ...(filters.set ? [{ key: 'set', label: `Set: ${labelOf(POPULAR_SETS.map((s) => ({ id: s.code, label: s.label })), filters.set)}`, clear: { set: '' } }] : []),
    ...(filters.format ? [{ key: 'format', label: `Formato: ${labelOf(FORMAT_OPTIONS, filters.format)}`, clear: { format: '' } }] : []),
    ...listChips('art', ART_OPTIONS),
    ...(filters.finish && filters.finish !== 'all' ? [{ key: 'finish', label: labelOf(FINISH_OPTIONS, filters.finish), clear: { finish: 'all' as const } }] : []),
    ...(filters.artist ? [{ key: 'artist', label: `Ilus. ${filters.artist}`, clear: { artist: '' } }] : []),
    ...listChips('rarity', RARITY_OPTIONS),
    ...listChips('color', COLOR_OPTIONS, 'Color: '),
    ...listChips('cardType', CARD_TYPES),
    ...(filters.lang && filters.lang !== 'all' ? [{ key: 'lang', label: `Idioma: ${labelOf(LANG_OPTIONS, filters.lang)}`, clear: { lang: 'all' } }] : []),
    ...(filters.inStockOnly ? [{ key: 'stock', label: 'Solo en almacén', clear: { inStockOnly: false } }] : []),
  ];
  const activeCount = active.length;

  return (
    <div className="space-y-3">
      <div className="flex items-stretch gap-2">
        {children}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="catalog-filter-dropdown"
          aria-label="Filtros y orden"
          className={`btn btn-secondary shrink-0 px-3.5 ${isOpen || activeCount > 0 ? 'border-honey bg-honey-tint text-honey-ink' : ''}`}
        >
          <SlidersHorizontal className="size-4 text-honey-ink" aria-hidden="true" />
          <span className="hidden sm:inline">Filtros</span>
          {activeCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-honey text-[11px] font-extrabold tabular-nums text-espresso">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={`size-4 transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <section
          id="catalog-filter-dropdown"
          aria-label="Filtros avanzados de cartas"
          className="panel pop relative mt-2 flex flex-col gap-5 p-4 shadow-lift sm:p-5"
        >
          <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
            <div>
              <h3 className="text-lg">Filtros de Magic: The Gathering</h3>
              <p className="text-xs text-espresso-soft">Afina la búsqueda entre todas las impresiones</p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="grid size-8 place-items-center rounded-lg border border-espresso/10 bg-parchment-well text-espresso-soft transition-colors hover:text-honey-ink"
              aria-label="Cerrar panel de filtros"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* Collecting first: what the printing looks like and who painted it. */}
          <div className="grid gap-5 rounded-xl border border-honey/40 bg-honey-tint/60 p-3.5 sm:grid-cols-2">
            <div className="space-y-3">
              <span className={`${LABEL} flex items-center gap-1.5`}>
                <Palette className="size-3.5 text-honey-ink" aria-hidden="true" />
                Arte y acabado
              </span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Arte">
                {ART_OPTIONS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="chip"
                    aria-pressed={listOf('art').includes(a.id)}
                    onClick={() => toggle('art', a.id)}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1 rounded-lg border border-espresso/10 bg-parchment-well p-1 text-xs sm:grid-cols-4" role="group" aria-label="Acabado">
                {FINISH_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={(filters.finish ?? 'all') === opt.id}
                    onClick={() => set({ finish: opt.id })}
                    className="rounded-md px-2 py-1.5 font-bold text-espresso-soft transition-colors hover:text-espresso aria-pressed:bg-honey aria-pressed:text-espresso aria-pressed:shadow-rest"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="filter-artist" className={LABEL}>
                Artista
              </label>
              <ArtistFilter value={filters.artist ?? ''} onCommit={(artist) => set({ artist })} />
              <p className="text-xs text-espresso-soft">Todas las cartas que ilustró, en cada una de sus impresiones.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label htmlFor="filter-sort-select" className={LABEL}>
                Ordenar por
              </label>
              <select
                id="filter-sort-select"
                value={filters.sort ?? DEFAULT_FILTERS.sort}
                onChange={(e) => set({ sort: e.target.value as CardFilters['sort'] })}
                className="field py-2 text-xs"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="filter-set-select" className={LABEL}>
                Set / Edición
              </label>
              <select
                id="filter-set-select"
                value={filters.set ?? ''}
                onChange={(e) => set({ set: e.target.value })}
                className="field py-2 text-xs"
              >
                {POPULAR_SETS.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="filter-format-select" className={LABEL}>
                Formato de juego
              </label>
              <select
                id="filter-format-select"
                value={filters.format ?? ''}
                onChange={(e) => set({ format: e.target.value })}
                className="field py-2 text-xs"
              >
                {FORMAT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="filter-lang-select" className={LABEL}>
                Idioma de la carta
              </label>
              <select
                id="filter-lang-select"
                value={filters.lang ?? 'all'}
                onChange={(e) => set({ lang: e.target.value })}
                className="field py-2 text-xs"
              >
                {LANG_OPTIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg border border-espresso/10 bg-parchment-well p-2 text-xs font-bold text-espresso hover:border-honey">
                <input
                  type="checkbox"
                  checked={Boolean(filters.inStockOnly)}
                  onChange={(e) => set({ inStockOnly: e.target.checked })}
                  className="size-4 rounded accent-honey"
                />
                <span>Solo disponibles en almacén</span>
              </label>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <span className={LABEL}>Color / identidad de maná</span>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggle('color', c.id)}
                    aria-pressed={listOf('color').includes(c.id)}
                    className="chip"
                  >
                    <span
                      className="flex size-4 items-center justify-center rounded-full font-mono text-[9px] font-black"
                      style={{ backgroundColor: c.colorCode, color: c.textCode }}
                    >
                      {c.symbol}
                    </span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <span className={LABEL}>Rareza</span>
              <div className="flex flex-wrap gap-1.5">
                {RARITY_OPTIONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggle('rarity', r.id)}
                    aria-pressed={listOf('rarity').includes(r.id)}
                    className="chip"
                  >
                    <span className={`size-2 rounded-full ${r.dot}`} />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-4">
              <span className={LABEL}>Tipo de carta</span>
              <div className="flex flex-wrap gap-1.5">
                {CARD_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggle('cardType', t.id)}
                    aria-pressed={listOf('cardType').includes(t.id)}
                    className="chip"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-espresso/10 pt-3 text-xs">
            <span className="font-semibold tabular-nums text-espresso-soft">
              {totalCards !== undefined
                ? `${totalCards.toLocaleString('es-CO')} ${totalCards === 1 ? 'impresión coincide' : 'impresiones coinciden'}`
                : 'Buscando…'}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm">
                Restablecer
              </button>
              <button type="button" onClick={onToggle} className="btn btn-primary btn-sm">
                Ver resultados
              </button>
            </div>
          </div>
        </section>
      )}

      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="mr-1 text-[11px] font-bold text-espresso-soft">Filtros aplicados:</span>
          {active.map((chip) => (
            <span key={chip.key} className="chip border-honey/70 bg-honey-tint text-honey-ink">
              {chip.label}
              <button
                type="button"
                onClick={() => set(chip.clear)}
                aria-label={`Quitar filtro: ${chip.label}`}
                className="hover:text-ember-ink"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <button type="button" onClick={handleReset} className="ml-2 text-xs font-bold text-honey-ink hover:underline">
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}
