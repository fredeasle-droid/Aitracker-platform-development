"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bookmakers, type BookmakerId } from "./data";

const ALL = bookmakers.map((b) => b.id);
const STORAGE_KEY = "bt-bookmakers-v2";

/** Group checkbox: turns the whole group on, or off when every bookmaker in it is already on. Keeps the canonical order. */
export function toggleGroup(selected: readonly BookmakerId[], group: readonly BookmakerId[]): BookmakerId[] {
  const allOn = group.every((id) => selected.includes(id));
  const next = allOn ? selected.filter((id) => !group.includes(id)) : [...selected, ...group];
  return ALL.filter((id) => next.includes(id));
}

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

/** Shared bookmaker selection for the filter bar, side menu and surebet list; remembered in the browser. */
export function BookmakerFilterProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<BookmakerId[]>(ALL);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = (JSON.parse(raw) as string[]).filter((id): id is BookmakerId => ALL.includes(id as BookmakerId));
        setSelected(ALL.filter((id) => saved.includes(id)));
      }
    } catch {
      /* ignore broken storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected, loaded]);

  const toggle = useCallback(
    (id: BookmakerId) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : ALL.filter((x) => x === id || cur.includes(x)))),
    [],
  );
  const value = useMemo<Ctx>(
    () => ({
      selected,
      isOn: (id) => selected.includes(id),
      toggle,
      toggleMany: (ids) => setSelected((cur) => toggleGroup(cur, ids)),
      selectAll: () => setSelected(ALL),
      clear: () => setSelected([]),
      allOn: selected.length === ALL.length,
    }),
    [selected, toggle],
  );
  return <BookmakerFilterContext.Provider value={value}>{children}</BookmakerFilterContext.Provider>;
}

export function useBookmakerFilter() {
  const ctx = useContext(BookmakerFilterContext);
  if (!ctx) throw new Error("useBookmakerFilter must be used inside BookmakerFilterProvider");
  return ctx;
}
