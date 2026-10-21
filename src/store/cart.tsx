import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types';
import { useDexter } from './dexter';

const STORAGE_KEY = 'topdeck_cart_v2';

interface CartApi {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  changeQuantity: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartApi | null>(null);

function loadItems(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((i): i is CartItem => typeof i?.id === 'string' && i.quantity > 0 && Number.isFinite(i.price))
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { say } = useDexter();
  const [items, setItems] = useState<CartItem[]>(loadItems);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode): the cart just won't persist */
    }
  }, [items]);

  const add = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
      setItems((prev) =>
        prev.some((i) => i.id === item.id)
          ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
          : [...prev, { ...item, quantity }],
      );
      say(`«${item.name}» ya está en tu morral.`, 'smile', 3200);
    },
    [say],
  );

  const changeQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.id !== id) return [i];
        const quantity = i.quantity + delta;
        return quantity > 0 ? [{ ...i, quantity }] : [];
      }),
    );
  }, []);

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartApi>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      isOpen,
      setOpen,
      add,
      changeQuantity,
      remove,
      clear,
    }),
    [items, isOpen, add, changeQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
