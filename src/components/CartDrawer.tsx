import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatPrice } from '../lib/format';
import { useCart } from '../store/cart';
import { useDexter } from '../store/dexter';
import { Dialog } from './Dialog';
import { ProductArt } from './ProductArt';

type Status = 'idle' | 'paying' | 'done';

const iconButton =
  'grid size-8 place-items-center rounded-lg text-ui-latte transition-colors active:scale-95 hover:text-accent-clay';

export function CartDrawer() {
  const { items, count, total, isOpen, setOpen, changeQuantity, remove, clear } = useCart();
  const { say } = useDexter();
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<number>();

  // Closing the drawer forgets the receipt and cancels a payment still in flight.
  useEffect(() => {
    if (isOpen) return;
    window.clearTimeout(timer.current);
    setStatus('idle');
  }, [isOpen]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const checkout = () => {
    setStatus('paying');
    timer.current = window.setTimeout(() => {
      clear();
      setStatus('done');
      say('¡Pedido sellado! Tus cartas salen hoy mismo.', 'smile', 5000);
      void import('canvas-confetti').then(({ default: confetti }) =>
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#C55A3F', '#4A7C59', '#689F77', '#F1E8D9'],
        }),
      );
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onClose={() => setOpen(false)} label="Morral" variant="drawer">
      <div className="flex h-full flex-col border-l-2 border-ui-cocoa bg-base-mocha">
        <header className="flex items-center justify-between gap-3 border-b-2 border-ui-cocoa px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold leading-tight">Tu morral</h2>
            <p className="text-xs text-ui-latte">
              {count} {count === 1 ? 'objeto' : 'objetos'}
            </p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar morral" className={iconButton}>
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {status === 'done' ? (
            <div className="grid h-full place-content-center justify-items-center gap-3 text-center">
              <CheckCircle2 className="size-14 text-accent-sage" aria-hidden="true" />
              <h3 className="text-xl font-extrabold">¡Pedido listo!</h3>
              <p className="max-w-[16rem] text-sm text-ui-latte">
                Lo empacamos con sleeve, toploader y el sello de la taberna.
              </p>
              <button type="button" className="btn btn-primary mt-2" onClick={() => setOpen(false)}>
                Seguir explorando
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="grid h-full place-content-center justify-items-center gap-2 text-center text-ui-latte">
              <ShoppingBag className="size-12 text-ui-cocoa" aria-hidden="true" />
              <p className="font-bold text-ui-parchment">Tu morral está vacío</p>
              <p className="text-sm">Añade cartas o sellados para empezar.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 rounded-jrpg border border-ui-cocoa/70 bg-base-dark/60 p-2.5">
                  {item.image ? (
                    <img src={item.image} alt="" width={48} height={67} className="h-16 w-12 rounded object-cover" />
                  ) : (
                    <ProductArt game={item.game ?? 'Magic'} className="size-12 shrink-0 rounded" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    {item.subtitle && <p className="truncate text-xs text-ui-latte">{item.subtitle}</p>}
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-lg border border-ui-cocoa/70">
                        <button
                          type="button"
                          className={iconButton}
                          onClick={() => changeQuantity(item.id, -1)}
                          aria-label={`Quitar una unidad de ${item.name}`}
                        >
                          <Minus className="size-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className={iconButton}
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label={`Añadir una unidad de ${item.name}`}
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-accent-sage">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={iconButton}
                    onClick={() => remove(item.id)}
                    aria-label={`Quitar ${item.name} del morral`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {status !== 'done' && items.length > 0 && (
          <footer className="border-t-2 border-ui-cocoa px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            <p className="mb-3 flex items-baseline justify-between">
              <span className="text-sm font-bold text-ui-latte">Total</span>
              <span className="font-display text-2xl font-extrabold">{formatPrice(total)}</span>
            </p>
            <div className="flex gap-3">
              <button type="button" className="btn btn-secondary" onClick={clear} disabled={status === 'paying'}>
                Vaciar
              </button>
              <button type="button" className="btn btn-primary flex-1" onClick={checkout} disabled={status === 'paying'}>
                {status === 'paying' ? 'Procesando…' : 'Finalizar pedido'}
              </button>
            </div>
          </footer>
        )}
      </div>
    </Dialog>
  );
}
