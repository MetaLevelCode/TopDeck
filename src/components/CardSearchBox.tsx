import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { autocompleteNames } from '../lib/scryfall';
import { useDebouncedValue } from '../lib/useDebouncedValue';

const LIST_ID = 'card-suggestions';
/** Suggestions are cheap, so they follow typing closely; results wait longer (see CartasTab). */
const SUGGEST_DELAY_MS = 150;

interface CardSearchBoxProps {
  value: string;
  onChange: (text: string) => void;
  /** Enter or the button: search now instead of waiting for the pause. */
  onSubmit: () => void;
  /** A suggested name was chosen. */
  onPick: (name: string) => void;
}

/** Search field with Scryfall name suggestions, following the ARIA combobox pattern. */
export function CardSearchBox({ value, onChange, onSubmit, onPick }: CardSearchBoxProps) {
  const [open, setOpen] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const typed = useDebouncedValue(value, SUGGEST_DELAY_MS);
  const showList = open && names.length > 0;

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    autocompleteNames(typed, controller.signal)
      .then((list) => {
        setNames(list);
        setActive(-1);
      })
      .catch(() => {
        /* aborted by newer typing, or offline: keep the last suggestions */
      });
    return () => controller.abort();
  }, [typed, open]);

  const pick = (name: string) => {
    setOpen(false);
    onPick(name);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!showList) return setOpen(true);
      const last = names.length - 1;
      setActive((i) => (e.key === 'ArrowDown' ? (i >= last ? 0 : i + 1) : i <= 0 ? last : i - 1));
    } else if (e.key === 'Enter' && showList && active >= 0) {
      e.preventDefault();
      pick(names[active]);
    } else if (e.key === 'Escape' && showList) {
      // Only close the list; a second Escape lets the search field clear itself.
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        setOpen(false);
        onSubmit();
      }}
      className="relative flex-1"
    >
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-espresso-soft"
        aria-hidden="true"
      />
      <input
        type="search"
        name="card-search"
        role="combobox"
        aria-label="Buscar carta por nombre"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={LIST_ID}
        aria-activedescendant={showList && active >= 0 ? `${LIST_ID}-${active}` : undefined}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpen(false)}
        placeholder="Busca cartas, mecánicas o tipos: Sol Ring, landfall, goblin…"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="search"
        className="field py-2.5 pl-10 pr-3 text-sm sm:pr-24"
      />
      {/* Phones search with the keyboard's own search key, so the button only shows where there is room. */}
      <button type="submit" className="btn btn-primary btn-sm absolute bottom-1.5 right-1.5 top-1.5 hidden px-4 sm:flex">
        Buscar
      </button>

      {/* Shown on almost every keystroke, so it appears instantly rather than animating. */}
      <ul
        id={LIST_ID}
        role="listbox"
        aria-label="Cartas sugeridas"
        hidden={!showList}
        className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-80 overflow-y-auto overscroll-contain rounded-xl border border-parchment-line bg-parchment-raised p-1 shadow-float"
      >
        {names.map((name, i) => (
          <li
            key={name}
            id={`${LIST_ID}-${i}`}
            role="option"
            aria-selected={i === active}
            // Keeps focus in the field so the blur doesn't close the list before the click lands.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pick(name)}
            className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-espresso hover:bg-parchment-well aria-selected:bg-honey/20"
          >
            {name}
          </li>
        ))}
      </ul>
    </form>
  );
}
