import { ShoppingBag } from 'lucide-react';
import type { CSSProperties } from 'react';
import { CATEGORY_LABEL } from '../data/catalog';
import { formatPrice } from '../lib/format';
import { useCart } from '../store/cart';
import type { SealedProduct } from '../types';
import { ProductArt } from './ProductArt';

export function ProductCard({ product, index }: { product: SealedProduct; index: number }) {
  const { add } = useCart();
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <article className="panel rise flex flex-col gap-3 p-3" style={{ '--i': Math.min(index, 8) } as CSSProperties}>
      <div className="relative">
        <ProductArt game={product.game} category={product.category} label />
        {product.popular && (
          <span className="absolute right-2 top-2 rounded-full bg-base-dark/85 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-accent-sage">
            Favorito
          </span>
        )}
      </div>

      <div className="flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-accent-sage">
          {CATEGORY_LABEL[product.category]}
        </p>
        <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-snug">{product.name}</h3>
      </div>

      <div className="flex items-end justify-between gap-2 border-t border-ui-cocoa/60 pt-3">
        <div>
          <p className="font-display text-lg font-extrabold leading-none">{formatPrice(product.price)}</p>
          <p className={`mt-1 text-[11px] font-bold ${lowStock || soldOut ? 'text-accent-clay' : 'text-ui-latte'}`}>
            {soldOut ? 'Agotado' : lowStock ? `Quedan ${product.stock}` : 'En stock'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-green btn-sm"
          disabled={soldOut}
          onClick={() =>
            add({
              id: product.id,
              name: product.name,
              price: product.price,
              kind: 'sealed',
              subtitle: product.game,
              game: product.game,
            })
          }
        >
          <ShoppingBag className="size-3.5" aria-hidden="true" />
          Añadir
        </button>
      </div>
    </article>
  );
}
