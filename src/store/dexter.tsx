import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DEXTER_TIPS } from '../data/catalog';
import type { DexterMood } from '../types';

interface DexterApi {
  mood: DexterMood;
  /** Current line of dialogue, or `null` when Dexter is quiet. */
  speech: string | null;
  /** Show a line and change mood; both revert to idle after `ms`. A new call replaces the previous one. */
  say: (text: string, mood?: DexterMood, ms?: number) => void;
  tip: () => void;
}

const DexterContext = createContext<DexterApi | null>(null);

export function DexterProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<DexterMood>('idle');
  const [speech, setSpeech] = useState<string | null>(null);
  const timer = useRef<number>();

  const say = useCallback((text: string, nextMood: DexterMood = 'smile', ms = 4200) => {
    window.clearTimeout(timer.current);
    setSpeech(text);
    setMood(nextMood);
    timer.current = window.setTimeout(() => {
      setSpeech(null);
      setMood('idle');
    }, ms);
  }, []);

  const tip = useCallback(() => {
    say(DEXTER_TIPS[Math.floor(Math.random() * DEXTER_TIPS.length)]);
  }, [say]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo(() => ({ mood, speech, say, tip }), [mood, speech, say, tip]);
  return <DexterContext.Provider value={value}>{children}</DexterContext.Provider>;
}

export function useDexter(): DexterApi {
  const ctx = useContext(DexterContext);
  if (!ctx) throw new Error('useDexter must be used inside <DexterProvider>');
  return ctx;
}
