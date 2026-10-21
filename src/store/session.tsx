import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../types';
import { useDexter } from './dexter';

const STORAGE_KEY = 'topdeck_user';

interface SessionApi {
  user: UserProfile | null;
  signIn: (name: string) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionApi | null>(null);

function loadUser(): UserProfile | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return parsed && typeof (parsed as UserProfile).name === 'string' ? (parsed as UserProfile) : null;
  } catch {
    return null;
  }
}

/** Front-end only session: there is no backend yet, so any name is accepted. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const { say } = useDexter();
  const [user, setUser] = useState<UserProfile | null>(loadUser);

  const signIn = useCallback(
    (name: string) => {
      const next: UserProfile = { name, joinedAt: new Date().toISOString() };
      setUser(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      say(`¡Bienvenido, ${name}! Tu silla en la taberna te espera.`);
    },
    [say],
  );

  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    say('¡Hasta la próxima aventura!', 'idle', 3000);
  }, [say]);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionApi {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
