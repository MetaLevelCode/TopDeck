import { Search, ShoppingBag, Store, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TABS } from '../lib/useHashTab';
import type { TabId } from '../lib/useHashTab';
import { useCart } from '../store/cart';

const TAB_ICONS: Record<TabId, LucideIcon> = { tienda: Store, cartas: Search, perfil: User };

export function Header({ tab }: { tab: TabId }) {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ui-cocoa bg-base-dark/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-stretch justify-between gap-4 px-4 sm:h-16">
        <a href="#tienda" className="flex items-center gap-2.5" aria-label="Top Deck TCG, ir a la tienda">
          <img
            src="/img/favicon.png"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full border-2 border-ui-cocoa bg-base-mocha"
          />
          <span className="font-display text-lg font-extrabold leading-none">
            Top Deck <span className="text-accent-clay">TCG</span>
          </span>
        </a>

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
            <ShoppingBag className="size-4 text-accent-clay" aria-hidden="true" />
            <span className="hidden sm:inline">Morral</span>
            {count > 0 && (
              <span
                key={count}
                aria-hidden="true"
                className="pop absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full border-2 border-base-dark bg-accent-clay px-1 text-[11px] font-black leading-none"
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
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t-2 border-ui-cocoa bg-base-dark/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      {TABS.map(({ id, label }) => {
        const Icon = TAB_ICONS[id];
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={tab === id ? 'page' : undefined}
            className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold text-ui-latte transition-transform duration-150 ease-out active:scale-95 aria-[current=page]:text-accent-clay"
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
