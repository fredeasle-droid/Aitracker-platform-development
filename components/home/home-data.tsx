"use client";

import { createContext, useContext, type ReactNode } from "react";

export type HomeTeam = { name: string; crest: string | null };

export type HomeRow = {
  id: number;
  home: HomeTeam;
  away: HomeTeam;
  league: string;
  margin: number;
  /** Seconds since the surebet was found, measured on the server at render time. */
  age: number;
};

export type HomeFind = {
  id: number;
  home: HomeTeam;
  away: HomeTeam;
  league: string;
  margin: number;
  time: string;
};

export type HomeStats = {
  surebets: number;
  bookmakers: number;
  leagues: number;
  avgMargin: number;
  topMargin: number;
};

export type HomePlan = { key: string; name: string; price: number; detail: string };

export type HomeData = {
  rows: HomeRow[];
  finds: HomeFind[];
  bookmakers: string[];
  stats: HomeStats;
  plans: HomePlan[];
  signedIn: boolean;
};

export const EMPTY_HOME_DATA: HomeData = {
  rows: [],
  finds: [],
  bookmakers: [],
  stats: { surebets: 0, bookmakers: 0, leagues: 0, avgMargin: 0, topMargin: 0 },
  plans: [],
  signedIn: false,
};

const HomeDataContext = createContext<HomeData>(EMPTY_HOME_DATA);

export function HomeDataProvider({ data, children }: { data: HomeData; children: ReactNode }) {
  return <HomeDataContext.Provider value={data}>{children}</HomeDataContext.Provider>;
}

export function useHomeData() {
  return useContext(HomeDataContext);
}

/** Club crest from the team-logo table, or the first letters of the name when none is stored. */
export function TeamCrest({ team, className = "", decorative = false }: { team: HomeTeam; className?: string; decorative?: boolean }) {
  if (team.crest) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={team.crest} alt={decorative ? "" : team.name} loading="lazy" className={`object-contain ${className}`} />;
  }
  return (
    <span
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : team.name}
      aria-hidden={decorative || undefined}
      className={`flex shrink-0 items-center justify-center rounded-full border border-border bg-foreground/10 text-[9px] font-bold uppercase text-foreground/80 ${className}`}
    >
      {team.name.slice(0, 2)}
    </span>
  );
}
