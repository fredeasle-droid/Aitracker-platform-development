"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BookmakerId } from "./data";
import { useSurebets } from "./surebets-context";

const STORAGE_KEY = "bt-bookmakers-v6";

type Ctx = {
  selected: BookmakerId[];
  isOn: (id: BookmakerId) => boolean;
  toggle: (id: BookmakerId) => void;
  toggleMany: (ids: readonly BookmakerId[]) => void;
  selectAll: () => void;
  clear: () => void;
  allOn: boolean;
};

type Overrides = Record<BookmakerId, boolean>;

const BookmakerFilterContext = createContext<Ctx | null>(null);

/**
 * Shared bookmaker selection for the filter bar, side menu and surebet list; remembered in the browser.
 * Only the user's changes are stored, so approved bookmakers start on and every other bookmaker starts off.
 */
export function BookmakerFilterProvider({ children }: { children: ReactNode }) {
  const { bookmakers } = useSurebets();
  const all = useMemo(() => bookmakers.map((b) => b.id), [bookmakers]);
  const defaults = useMemo(() => new Map(bookmakers.map((b) => [b.id, b.defaultOn])), [bookmakers]);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        setOverrides(Object.fromEntries(Object.entries(parsed).filter(([, v]) => typeof v === "boolean")) as Overrides);
      }
    } catch {
      /* ignore broken storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }, [overrides, loaded]);

  const isOn = useCallback((id: BookmakerId) => overrides[id] ?? defaults.get(id) ?? false, [overrides, defaults]);

  const toggle = useCallback((id: BookmakerId) => setOverrides((cur) => ({ ...cur, [id]: !isOn(id) })), [isOn]);

  const value = useMemo<Ctx>(() => {
    const selected = all.filter(isOn);
    const setAll = (ids: readonly BookmakerId[], on: boolean) =>
      setOverrides((cur) => ({ ...cur, ...Object.fromEntries(ids.map((id) => [id, on])) }));
    return {
      selected,
      isOn,
      toggle,
      toggleMany: (ids) => setAll(ids, !ids.every(isOn)),
      selectAll: () => setAll(all, true),
      clear: () => setAll(all, false),
      allOn: selected.length === all.length,
    };
  }, [all, isOn, toggle]);
  return <BookmakerFilterContext.Provider value={value}>{children}</BookmakerFilterContext.Provider>;
}

export function useBookmakerFilter() {
  const ctx = useContext(BookmakerFilterContext);
  if (!ctx) throw new Error("useBookmakerFilter must be used inside BookmakerFilterProvider");
  return ctx;
}
