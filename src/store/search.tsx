import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useDebouncedValue } from '../lib/useDebouncedValue';

/** Results wait for typing to pause, so a search isn't fired on every keystroke. */
const RESULTS_DELAY_MS = 400;

/**
 * `exact`: the name came from a suggestion (or a typo fix), so every printing of that one card is shown.
 * `typed`: what the visitor actually wrote, when the search was corrected for a typo.
 */
export interface CardQuery {
  text: string;
  exact: boolean;
  typed?: string;
}

interface SearchApi {
  /** What's in the search box. */
  input: string;
  setInput: (text: string) => void;
  query: CardQuery;
  setQuery: (query: CardQuery) => void;
  /** Enter or the button: search now instead of waiting for the pause. */
  submit: () => void;
  /** A suggested name was chosen. */
  pick: (name: string) => void;
}

const SearchContext = createContext<SearchApi | null>(null);

/** The card search lives in the header, so the box and the Cartas results share this state. */
export function SearchProvider({ initialQuery = '', children }: { initialQuery?: string; children: ReactNode }) {
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState<CardQuery>({ text: initialQuery.trim(), exact: false });
  const typed = useDebouncedValue(input.trim(), RESULTS_DELAY_MS);

  const run = useCallback(
    (text: string, exact = false) =>
      setQuery((prev) => (prev.text === text && (prev.exact || !exact) ? prev : { text, exact })),
    [],
  );

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      setQuery({ text: initialQuery.trim(), exact: false });
    }
  }, [initialQuery]);

  // The box drives the results once typing pauses; a picked name stays exact until its text changes.
  useEffect(() => run(typed), [typed, run]);

  const submit = useCallback(() => run(input.trim()), [run, input]);
  const pick = useCallback(
    (name: string) => {
      setInput(name);
      run(name, true);
    },
    [run],
  );

  const value = useMemo(() => ({ input, setInput, query, setQuery, submit, pick }), [input, query, submit, pick]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchApi {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used inside <SearchProvider>');
  return ctx;
}
