import { useEffect, useState } from 'react';
import { BottomNav, Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { DexterHelper } from './components/Dexter';
import { Footer } from './components/Footer';
import { TavernBackdrop } from './components/TavernBackdrop';
import { TABS, useHashTab } from './lib/useHashTab';
import type { TabId } from './lib/useHashTab';
import { CartProvider } from './store/cart';
import { DexterProvider, useDexter } from './store/dexter';
import { SearchProvider } from './store/search';
import { SessionProvider } from './store/session';
import { CartasTab } from './tabs/CartasTab';
import { PerfilTab } from './tabs/PerfilTab';
import { TiendaTab } from './tabs/TiendaTab';

/**
 * The traditional site shown once the door is open: header, three tabs, footer.
 * A tab mounts the first time it is visited and then stays mounted (hidden), so searches and forms survive tab switches.
 */
function Shell({ onExit }: { onExit: () => void }) {
  const [tab, go] = useHashTab();
  const { say } = useDexter();
  const [visited, setVisited] = useState<ReadonlySet<TabId>>(() => new Set([tab]));

  useEffect(() => {
    setVisited((prev) => (prev.has(tab) ? prev : new Set(prev).add(tab)));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tab]);

  useEffect(() => {
    const id = window.setTimeout(() => say('¡Bienvenido a la taberna! Soy Dexter.', 'smile', 5000), 700);
    return () => window.clearTimeout(id);
  }, [say]);

  const panels: Record<TabId, JSX.Element> = {
    tienda: <TiendaTab onNavigate={go} />,
    cartas: <CartasTab />,
    perfil: <PerfilTab />,
  };

  return (
    <>
      <TavernBackdrop />
      <div className="fade-in flex min-h-svh flex-col">
        <Header tab={tab} onNavigate={go} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:pt-8">
          {TABS.map(({ id }) =>
            visited.has(id) ? (
              <div key={id} hidden={tab !== id} className="rise">
                {panels[id]}
              </div>
            ) : null,
          )}
        </main>
        <Footer onExit={onExit} />
        <BottomNav tab={tab} />
        <DexterHelper />
        <CartDrawer />
      </div>
    </>
  );
}

export default function Tavern({ onExit, initialSearchQuery }: { onExit: () => void; initialSearchQuery?: string }) {
  return (
    <DexterProvider>
      <SessionProvider>
        <CartProvider>
          <SearchProvider initialQuery={initialSearchQuery}>
            <Shell onExit={onExit} />
          </SearchProvider>
        </CartProvider>
      </SessionProvider>
    </DexterProvider>
  );
}
