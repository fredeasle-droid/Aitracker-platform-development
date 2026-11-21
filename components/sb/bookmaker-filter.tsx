"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BookmakerId } from "./data";
import { useSurebets } from "./surebets-context";

const STORAGE_KEY = "bt-bookmakers-off-v3";

type Ctx = {
  selected: BookmakerId[];
  isOn: (id: BookmakerId) => boolean;
  toggle: (id: BookmakerId) => void;
  toggleMany: (ids: readonly BookmakerId[]) => void;
  selectAll: () => void;
  clear: () => void;
  allOn: boolean;
};

const BookmakerFilterContext = createContext<Ctx | null>(null);

/**
 * Shared bookmaker selection for the filter bar, side menu and surebet list; remembered in the browser.
 * Only the bookmakers switched off are stored, so new bookmakers from the scanner start out selected.
 */
export function BookmakerFilterProvider({ children }: { children: ReactNode }) {
  const { bookmakers } = useSurebets();
  const all = useMemo(() => bookmakers.map((b) => b.id), [bookmakers]);
  const [off, setOff] = useState<BookmakerId[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOff((JSON.parse(raw) as unknown[]).filter((id): id is string => typeof id === "string"));
    } catch {
      /* ignore broken storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(off));
  }, [off, loaded]);

  const toggle = useCallback((id: BookmakerId) => setOff((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])), []);

  const value = useMemo<Ctx>(() => {
    const selected = all.filter((id) => !off.includes(id));
    return {
      selected,
      isOn: (id) => !off.includes(id),
      toggle,
      toggleMany: (ids) =>
        setOff((cur) => {
          const groupAllOn = ids.every((id) => !cur.includes(id));
          return groupAllOn ? [...new Set([...cur, ...ids])] : cur.filter((id) => !ids.includes(id));
        }),
      selectAll: () => setOff([]),
      clear: () => setOff(all),
      allOn: selected.length === all.length,
    };
  }, [all, off, toggle]);
  return <BookmakerFilterContext.Provider value={value}>{children}</BookmakerFilterContext.Provider>;
}

export function useBookmakerFilter() {
  const ctx = useContext(BookmakerFilterContext);
  if (!ctx) throw new Error("useBookmakerFilter must be used inside BookmakerFilterProvider");
  return ctx;
}
