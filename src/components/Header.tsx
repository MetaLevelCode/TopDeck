import { Search, ShoppingBag, Store, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TABS } from '../lib/useHashTab';
import type { TabId } from '../lib/useHashTab';
import { useCart } from '../store/cart';
import { useSearch } from '../store/search';
import { CardSearchBox } from './CardSearchBox';

const TAB_ICONS: Record<TabId, LucideIcon> = { tienda: Store, cartas: Search, perfil: User };

export function Header({ tab, onNavigate }: { tab: TabId; onNavigate: (tab: TabId) => void }) {
  const { count, setOpen } = useCart();
  const { input, setInput, submit, pick } = useSearch();
  // Most visitors come to find one card: searching from any tab opens the results.
  const toResults = () => onNavigate('cartas');

  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-parchment/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-stretch gap-3 px-4 sm:gap-5">
        <a href="#tienda" className="flex shrink-0 items-center" aria-label="TOP DECK, ir a la tienda">
          <img src="/img/logo.webp" alt="" width={290} height={192} className="h-11 w-auto sm:h-12" />
        </a>

        <div className="flex min-w-0 flex-1 items-center">
          <CardSearchBox
            value={input}
            onChange={(text) => {
              setInput(text);
              if (text.trim()) toResults();
            }}
            onSubmit={() => {
              submit();
              toResults();
            }}
            onPick={(name) => {
              pick(name);
              toResults();
            }}
          />
        </div>

        <nav aria-label="Principal" className="hidden items-stretch md:flex">
          {TABS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="tab-link" aria-current={tab === id ? 'page' : undefined}>
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center">
          <button
            type="button"
            className="btn btn-secondary btn-sm relative"
            onClick={() => setOpen(true)}
            aria-label={`Abrir morral, ${count} ${count === 1 ? 'objeto' : 'objetos'}`}
          >
            <ShoppingBag className="size-4 text-honey-ink" aria-hidden="true" />
            <span className="hidden sm:inline">Morral</span>
            {count > 0 && (
              <span
                key={count}
                aria-hidden="true"
                className="pop absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded border-2 border-parchment bg-honey px-1 text-[11px] font-black leading-none"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

/** Same three destinations as the header, reachable with a thumb on phones. */
export function BottomNav({ tab }: { tab: TabId }) {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-espresso/10 bg-parchment-raised/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      {TABS.map(({ id, label }) => {
        const Icon = TAB_ICONS[id];
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={tab === id ? 'page' : undefined}
            className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold text-espresso-soft transition-transform duration-150 ease-out active:scale-95 aria-[current=page]:text-honey-ink"
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
