import { useCallback, useEffect, useState } from 'react';

export const TABS = [
  { id: 'tienda', label: 'Tienda' },
  { id: 'cartas', label: 'Cartas' },
  { id: 'perfil', label: 'Perfil' },
] as const;

export type TabId = (typeof TABS)[number]['id'];

const isTab = (value: string): value is TabId => TABS.some((tab) => tab.id === value);

const readHash = (): TabId => {
  const value = window.location.hash.slice(1);
  return isTab(value) ? value : 'tienda';
};

/** Active tab mirrored in the URL hash, so back/forward and shared links work. */
export function useHashTab(): [TabId, (tab: TabId) => void] {
  const [tab, setTab] = useState<TabId>(readHash);

  useEffect(() => {
    const sync = () => setTab(readHash());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const go = useCallback((next: TabId) => {
    if (window.location.hash.slice(1) !== next) window.location.hash = next;
  }, []);

  return [tab, go];
}
