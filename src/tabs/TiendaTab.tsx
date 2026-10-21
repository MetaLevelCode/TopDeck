import { useMemo, useState } from 'react';
import { BadgeCheck, Package, Swords } from 'lucide-react';
import { DexterSprite } from '../components/Dexter';
import { EventBoard } from '../components/EventBoard';
import { ProductCard } from '../components/ProductCard';
import { GAMES, SEALED_PRODUCTS } from '../data/catalog';
import type { TabId } from '../lib/useHashTab';
import { useDexter } from '../store/dexter';
import type { Game, SealedProduct } from '../types';

type Sort = 'popular' | 'price-asc' | 'price-desc';

const PERKS = [
  { icon: Package, title: 'Envíos protegidos', text: 'Sleeve y toploader' },
  { icon: BadgeCheck, title: 'Singles revisados', text: 'Estado verificado a mano' },
  { icon: Swords, title: 'Mesas en tienda', text: 'Juega con un café' },
];

const COMPARE: Record<Sort, (a: SealedProduct, b: SealedProduct) => number> = {
  popular: (a, b) => Number(b.popular ?? false) - Number(a.popular ?? false),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

export function TiendaTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const { tip } = useDexter();
  const [game, setGame] = useState<Game | 'Todos'>('Todos');
  const [sort, setSort] = useState<Sort>('popular');

  const products = useMemo(
    () => SEALED_PRODUCTS.filter((p) => game === 'Todos' || p.game === game).sort(COMPARE[sort]),
    [game, sort],
  );

  return (
    <div className="space-y-12">
      <section className="panel relative isolate overflow-hidden">
        <img src="/img/mesa.webp" alt="" width={1600} height={893} className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-parchment-raised via-parchment-raised/90 to-parchment-raised/20" />
        <div className="grid items-end px-6 sm:px-10 md:grid-cols-[1.3fr_1fr]">
          <div className="py-10 sm:py-14">
            <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Cartas, café y <span className="text-honey-ink">buena compañía.</span>
            </h1>
            <p className="mt-3 max-w-md text-espresso-soft">
              Singles de Magic, sellados de todos los juegos y una mesa siempre libre.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  document.getElementById('sellados')?.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                  })
                }
              >
                Ver sellados
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => onNavigate('cartas')}>
                Buscar cartas
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={tip}
            aria-label="Hablar con Dexter"
            className="hidden justify-self-center md:block"
          >
            <DexterSprite className="w-56 origin-bottom animate-breathe drop-shadow-2xl lg:w-64" />
          </button>
        </div>
      </section>

      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 border-y border-espresso/15 py-3 text-sm">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-2">
            <Icon className="size-4 shrink-0 text-honey-ink" aria-hidden="true" />
            <span className="font-bold">{title}</span>
            <span className="text-espresso-soft">· {text}</span>
          </li>
        ))}
      </ul>

      <section id="sellados" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Sellados</h2>
          <label className="flex items-center gap-2 text-xs font-bold text-espresso-soft">
            Ordenar
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="field w-auto py-1.5 pr-8 text-xs"
            >
              <option value="popular">Favoritos</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </label>
        </div>

        <div role="group" aria-label="Filtrar por juego" className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {(['Todos', ...GAMES] as const).map((g) => (
            <button key={g} type="button" className="chip shrink-0" aria-pressed={game === g} onClick={() => setGame(g)}>
              {g}
            </button>
          ))}
        </div>

        {products.length > 0 ? (
          <div key={`${game}-${sort}`} className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-espresso-soft">Todavía no tenemos sellados de este juego.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Tablón de la taberna</h2>
        <EventBoard />
      </section>
    </div>
  );
}
