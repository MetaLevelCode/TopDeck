import { ChevronDown, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import {
  CARD_TYPES,
  COLOR_OPTIONS,
  FINISH_OPTIONS,
  FORMAT_OPTIONS,
  LANG_OPTIONS,
  POPULAR_SETS,
  RARITY_OPTIONS,
} from '../lib/scryfall';
import type { CardFilters } from '../lib/scryfall';

interface CardFilterPanelProps {
  filters: CardFilters;
  onChange: (updated: CardFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
  totalCards?: number;
}

export function CardFilterPanel({
  filters,
  onChange,
  isOpen,
  onToggle,
  totalCards,
}: CardFilterPanelProps) {
  // Count active filters (excluding defaults)
  let activeCount = 0;
  if (filters.set) activeCount++;
  if (filters.format) activeCount++;
  if (filters.rarity && filters.rarity.length > 0) activeCount += filters.rarity.length;
  if (filters.color && filters.color.length > 0) activeCount += filters.color.length;
  if (filters.cardType && filters.cardType.length > 0) activeCount += filters.cardType.length;
  if (filters.finish && filters.finish !== 'all') activeCount++;
  if (filters.lang && filters.lang !== 'all') activeCount++;
  if (filters.inStockOnly) activeCount++;

  const handleReset = () => {
    onChange({
      game: 'mtg',
      set: '',
      format: '',
      rarity: [],
      color: [],
      cardType: [],
      finish: 'all',
      lang: 'all',
      inStockOnly: false,
      sort: filters.sort ?? 'edhrec',
    });
  };

  const toggleArrayFilter = (
    key: 'rarity' | 'color' | 'cardType',
    val: string,
  ) => {
    const list = (filters[key] ?? []) as string[];
    const exists = list.includes(val);
    const updated = exists ? list.filter((item) => item !== val) : [...list, val];
    onChange({ ...filters, [key]: updated });
  };

  const activeRarities = filters.rarity ?? [];
  const activeColors = filters.color ?? [];
  const activeTypes = filters.cardType ?? [];

  return (
    <div className="space-y-3">
      {/* 1. FILTER TRIGGER BUTTON & ACTIVE STATUS */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls="catalog-filter-dropdown"
          className={`btn btn-secondary flex items-center gap-2 rounded-jrpg border-2 px-3.5 py-2 font-display text-xs font-bold transition-all sm:text-sm ${
            isOpen || activeCount > 0
              ? 'border-accent-clay bg-base-dark text-accent-clay shadow-panel'
              : 'border-ui-cocoa text-ui-parchment'
          }`}
        >
          <SlidersHorizontal className="size-4 text-accent-clay" aria-hidden="true" />
          <span>Filtros</span>

          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-accent-clay font-mono text-[11px] font-black text-ui-parchment shadow-sm">
              {activeCount}
            </span>
          )}

          <ChevronDown
            className={`size-4 text-ui-latte transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-accent-clay' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {/* Quick Clear Button if filters active */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-ui-latte hover:text-accent-clay transition-colors"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Limpiar filtros ({activeCount})</span>
          </button>
        )}
      </div>

      {/* 2. THE DEPLOYED FILTER PANEL (EL SELECCIONABLE DESPLEGADO) */}
      {isOpen && (
        <section
          id="catalog-filter-dropdown"
          aria-label="Filtros avanzados de cartas"
          className="panel pop relative mt-2 flex flex-col gap-5 rounded-jrpg border-2 border-ui-cocoa bg-base-mocha p-4 sm:p-5 shadow-panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ui-cocoa/50 pb-3">
            <div>
              <h3 className="font-display text-sm font-black uppercase tracking-wider text-ui-parchment sm:text-base">
                Filtros de Magic: The Gathering
              </h3>
              <p className="text-xs text-ui-latte">
                Ajusta parámetros para refinar las cartas de la taberna
              </p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="grid size-7 place-items-center rounded-lg border border-ui-cocoa bg-base-dark text-ui-latte hover:text-accent-clay"
              aria-label="Cerrar panel de filtros"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* A. SET / EDICIÓN */}
            <div className="space-y-1.5">
              <label htmlFor="filter-set-select" className="text-xs font-bold uppercase tracking-wider text-ui-latte block">
                Set / Edición
              </label>
              <select
                id="filter-set-select"
                value={filters.set ?? ''}
                onChange={(e) => onChange({ ...filters, set: e.target.value })}
                className="field rounded-jrpg border-2 border-ui-cocoa bg-base-dark py-2 text-xs text-ui-parchment"
              >
                {POPULAR_SETS.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* B. FORMATO */}
            <div className="space-y-1.5">
              <label htmlFor="filter-format-select" className="text-xs font-bold uppercase tracking-wider text-ui-latte block">
                Formato de Juego
              </label>
              <select
                id="filter-format-select"
                value={filters.format ?? ''}
                onChange={(e) => onChange({ ...filters, format: e.target.value })}
                className="field rounded-jrpg border-2 border-ui-cocoa bg-base-dark py-2 text-xs text-ui-parchment"
              >
                {FORMAT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* C. ACABADO / FOIL */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ui-latte block">
                Acabado
              </span>
              <div className="flex rounded-jrpg border-2 border-ui-cocoa bg-base-dark p-0.5 text-xs">
                {FINISH_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ ...filters, finish: opt.id })}
                    className={`flex-1 rounded py-1.5 font-bold transition-colors ${
                      (filters.finish ?? 'all') === opt.id
                        ? 'bg-accent-clay text-ui-parchment shadow-sm'
                        : 'text-ui-latte hover:text-ui-parchment'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* D. IDIOMA */}
            <div className="space-y-1.5">
              <label htmlFor="filter-lang-select" className="text-xs font-bold uppercase tracking-wider text-ui-latte block">
                Idioma de la carta
              </label>
              <select
                id="filter-lang-select"
                value={filters.lang ?? 'all'}
                onChange={(e) => onChange({ ...filters, lang: e.target.value })}
                className="field rounded-jrpg border-2 border-ui-cocoa bg-base-dark py-2 text-xs text-ui-parchment"
              >
                {LANG_OPTIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* E. COLOR / IDENTIDAD (DracoStore style with icons) */}
            <div className="space-y-2 sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ui-latte block">
                Color / Identidad de Maná
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_OPTIONS.map((c) => {
                  const selected = activeColors.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleArrayFilter('color', c.id)}
                      aria-pressed={selected}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition-all ${
                        selected
                          ? 'border-accent-clay bg-accent-clay text-ui-parchment ring-1 ring-accent-clay scale-102'
                          : 'border-ui-cocoa bg-base-dark text-ui-latte hover:border-ui-latte hover:text-ui-parchment'
                      }`}
                    >
                      <span
                        className="flex size-4 items-center justify-center rounded-full font-mono text-[9px] font-black shadow-xs"
                        style={{ backgroundColor: c.colorCode, color: c.textCode }}
                      >
                        {c.symbol}
                      </span>
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* F. RAREZA */}
            <div className="space-y-2 sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ui-latte block">
                Rareza
              </span>
              <div className="flex flex-wrap gap-1.5">
                {RARITY_OPTIONS.map((r) => {
                  const selected = activeRarities.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleArrayFilter('rarity', r.id)}
                      aria-pressed={selected}
                      className={`inline-flex items-center gap-1.5 rounded-jrpg border px-3 py-1.5 text-xs font-bold transition-all ${
                        selected
                          ? 'border-accent-clay bg-accent-clay text-ui-parchment shadow-sm'
                          : `bg-base-dark text-ui-latte hover:text-ui-parchment ${r.border}`
                      }`}
                    >
                      <span className={`size-2 rounded-full ${r.badge}`} />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* G. TIPO DE CARTA */}
            <div className="space-y-2 sm:col-span-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ui-latte block">
                Tipo de Carta
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CARD_TYPES.map((t) => {
                  const selected = activeTypes.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleArrayFilter('cardType', t.id)}
                      aria-pressed={selected}
                      className={`chip ${
                        selected ? 'border-accent-clay bg-accent-clay text-ui-parchment' : ''
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* H. DISPONIBILIDAD */}
            <div className="space-y-2 flex flex-col justify-end">
              <label className="flex items-center gap-2.5 cursor-pointer select-none rounded-jrpg border-2 border-ui-cocoa bg-base-dark p-2 text-xs font-bold text-ui-parchment hover:border-accent-clay">
                <input
                  type="checkbox"
                  checked={Boolean(filters.inStockOnly)}
                  onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
                  className="size-4 rounded accent-accent-clay"
                />
                <span>Solo disponibles en almacén</span>
              </label>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ui-cocoa/50 pt-3 text-xs">
            <span className="text-ui-latte font-semibold">
              {totalCards !== undefined
                ? `${totalCards} ${totalCards === 1 ? 'carta coincide' : 'cartas coinciden'}`
                : 'Actualización instantánea'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary btn-sm"
              >
                Restablecer
              </button>
              <button
                type="button"
                onClick={onToggle}
                className="btn btn-primary btn-sm"
              >
                Cerrar filtros
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. ACTIVE FILTERS CHIP BAR (DracoStore style active filters) */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="font-bold text-ui-latte text-[11px] uppercase tracking-wider mr-1">
            Filtros aplicados:
          </span>

          {/* Set */}
          {filters.set && (
            <span className="chip border-accent-clay/70 bg-base-dark text-accent-clay">
              <span>Set: {POPULAR_SETS.find((s) => s.code === filters.set)?.label ?? filters.set}</span>
              <button
                type="button"
                onClick={() => onChange({ ...filters, set: '' })}
                aria-label="Quitar filtro de set"
                className="hover:text-rose-400"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Format */}
          {filters.format && (
            <span className="chip border-accent-clay/70 bg-base-dark text-accent-clay">
              <span>Formato: {FORMAT_OPTIONS.find((f) => f.id === filters.format)?.label ?? filters.format}</span>
              <button
                type="button"
                onClick={() => onChange({ ...filters, format: '' })}
                aria-label="Quitar filtro de formato"
                className="hover:text-rose-400"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Rarities */}
          {activeRarities.map((r) => (
            <span key={r} className="chip border-accent-clay/70 bg-base-dark text-accent-clay">
              <span>{RARITY_OPTIONS.find((opt) => opt.id === r)?.label ?? r}</span>
              <button
                type="button"
                onClick={() => toggleArrayFilter('rarity', r)}
                aria-label={`Quitar filtro ${r}`}
                className="hover:text-rose-400"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}

          {/* Colors */}
          {activeColors.map((c) => (
            <span key={c} className="chip border-accent-clay/70 bg-base-dark text-accent-clay">
              <span>Color: {COLOR_OPTIONS.find((opt) => opt.id === c)?.label ?? c}</span>
              <button
                type="button"
                onClick={() => toggleArrayFilter('color', c)}
                aria-label={`Quitar color ${c}`}
                className="hover:text-rose-400"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}

          {/* Types */}
          {activeTypes.map((t) => (
            <span key={t} className="chip border-accent-clay/70 bg-base-dark text-accent-clay">
              <span>{CARD_TYPES.find((opt) => opt.id === t)?.label ?? t}</span>
              <button
                type="button"
                onClick={() => toggleArrayFilter('cardType', t)}
                aria-label={`Quitar tipo ${t}`}
                className="hover:text-rose-400"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}

          {/* Finish */}
          {filters.finish && filters.finish !== 'all' && (
            <span className="chip border-accent-clay/70 bg-base-dark text-accent-clay">
              <span>Acabado: {FINISH_OPTIONS.find((f) => f.id === filters.finish)?.label}</span>
              <button
                type="button"
                onClick={() => onChange({ ...filters, finish: 'all' })}
                aria-label="Quitar filtro de acabado"
                className="hover:text-rose-400"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Language */}
          {filters.lang && filters.lang !== 'all' && (
            <span className="chip border-accent-clay/70 bg-base-dark text-accent-clay">
              <span>Idioma: {LANG_OPTIONS.find((l) => l.id === filters.lang)?.label}</span>
              <button
                type="button"
                onClick={() => onChange({ ...filters, lang: 'all' })}
                aria-label="Quitar filtro de idioma"
                className="hover:text-rose-400"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Stock */}
          {filters.inStockOnly && (
            <span className="chip border-accent-clay/70 bg-base-dark text-accent-clay">
              <span>Solo en almacén</span>
              <button
                type="button"
                onClick={() => onChange({ ...filters, inStockOnly: false })}
                aria-label="Quitar filtro de stock"
                className="hover:text-rose-400"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Clear all text button */}
          <button
            type="button"
            onClick={handleReset}
            className="ml-2 text-xs font-bold text-accent-brick hover:underline"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}
