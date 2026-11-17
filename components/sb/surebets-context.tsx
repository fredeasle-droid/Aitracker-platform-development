"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { surebetProfitPct, type BookmakerId, type BookmakerInfo, type Surebet } from "./data";

export type SbSport = { label: string; count: number };

export type SurebetsData = {
  surebets: Surebet[];
  bookmakers: BookmakerInfo[];
  sports: SbSport[];
  lastScanSec: number | null;
  trend: number[];
};

type Ctx = SurebetsData & {
  /** Surebets matching the chosen sport (all when none is chosen). */
  inSport: Surebet[];
  sport: string | null;
  setSport: (sport: string | null) => void;
  nameOf: (id: BookmakerId) => string;
  /** Best surebet by profit, if any exist. */
  top: { b: Surebet; pct: number } | null;
};

const SurebetsContext = createContext<Ctx | null>(null);

/** Live surebets from the server, shared by every part of the page. */
export function SurebetsProvider({ data, children }: { data: SurebetsData; children: ReactNode }) {
  const [sport, setSport] = useState<string | null>(null);
  const value = useMemo<Ctx>(() => {
    const names = new Map(data.bookmakers.map((b) => [b.id, b.name]));
    const ranked = data.surebets
      .map((b) => ({ b, pct: surebetProfitPct(b.legs.map((l) => l.odds)) }))
      .sort((x, y) => y.pct - x.pct);
    return {
      ...data,
      inSport: sport ? data.surebets.filter((b) => b.sport === sport) : data.surebets,
      sport,
      setSport,
      nameOf: (id) => names.get(id) ?? id,
      top: ranked[0] ?? null,
    };
  }, [data, sport]);
  return <SurebetsContext.Provider value={value}>{children}</SurebetsContext.Provider>;
}

export function useSurebets() {
  const ctx = useContext(SurebetsContext);
  if (!ctx) throw new Error("useSurebets must be used inside SurebetsProvider");
  return ctx;
}
