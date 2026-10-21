import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { TavernBackdrop } from './components/TavernBackdrop';
import { Landing } from './landing/Landing';
import type { TabId } from './lib/useHashTab';

const loadTavern = () => import('./Tavern');
const Tavern = lazy(loadTavern);

const ENTERED_KEY = 'topdeck_entered';

const rememberEntry = (entered: boolean) => {
  try {
    if (entered) sessionStorage.setItem(ENTERED_KEY, '1');
    else sessionStorage.removeItem(ENTERED_KEY);
  } catch {
    /* storage unavailable: the entrance simply plays again on reload */
  }
};

const hasEntered = () => {
  try {
    // A deep link (#cartas) or an earlier visit in this session skips the entrance.
    return window.location.hash !== '' || sessionStorage.getItem(ENTERED_KEY) === '1';
  } catch {
    return window.location.hash !== '';
  }
};

export default function App() {
  const [entered, setEntered] = useState(hasEntered);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  // Fetch the site's code while the visitor is still walking up to the door.
  useEffect(() => {
    const id = window.setTimeout(loadTavern, 1500);
    return () => window.clearTimeout(id);
  }, []);

  // Each screen starts at the top (the entrance is much taller than the site).
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [entered]);

  const enter = useCallback((tab?: TabId, query?: string) => {
    rememberEntry(true);
    if (tab) window.location.hash = tab;
    if (query !== undefined) setInitialSearchQuery(query);
    setEntered(true);
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      enter('cartas', query);
    },
    [enter],
  );

  const handleGoToProfile = useCallback(() => {
    enter('perfil');
  }, [enter]);

  const exit = useCallback(() => {
    rememberEntry(false);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setInitialSearchQuery('');
    setEntered(false);
  }, []);

  return entered ? (
    <Suspense fallback={<TavernBackdrop />}>
      <Tavern onExit={exit} initialSearchQuery={initialSearchQuery} />
    </Suspense>
  ) : (
    <Landing
      onEnter={() => enter()}
      onSearch={handleSearch}
      onGoToProfile={handleGoToProfile}
    />
  );
}
