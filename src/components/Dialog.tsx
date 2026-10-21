import { useEffect, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name. */
  label: string;
  variant?: 'center' | 'drawer';
  children: ReactNode;
}

/**
 * Modal built on the native `<dialog>`: top layer, focus trap, Esc and inert background come for free.
 * Children are only mounted while open, so each opening starts from a clean state.
 */
export function Dialog({ open, onClose, label, variant = 'center', children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  // `closedby="any"` handles light dismiss natively; Safari doesn't support it yet, so click the backdrop by hand.
  const dismissOnBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if ('closedBy' in HTMLDialogElement.prototype || e.target !== e.currentTarget) return;
    const box = e.currentTarget.getBoundingClientRect();
    const inside =
      e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
    if (!inside) onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={variant === 'drawer' ? 'drawer' : undefined}
      onClose={onClose}
      onClick={dismissOnBackdrop}
      {...{ closedby: 'any' }}
    >
      {open && children}
    </dialog>
  );
}
