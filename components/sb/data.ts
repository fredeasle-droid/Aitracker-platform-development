/** Normalised bookmaker key, e.g. "Danske Spil" -> "danskespil". */
export type BookmakerId = string;

export type BookmakerCategory = "local" | "exchange" | "crypto";

export const bookmakerCategories: { id: BookmakerCategory; name: string; hint: string }[] = [
  { id: "local", name: "Lokale bookmakere", hint: "Dansk licens" },
  { id: "exchange", name: "Spillebørs", hint: "Spil mod andre spillere" },
  { id: "crypto", name: "Crypto bookmakere", hint: "Ind- og udbetaling i krypto" },
];

/** `defaultOn`: selected until the user changes it. Bookmakers outside our approved list start switched off. */
export type BookmakerInfo = { id: BookmakerId; name: string; category: BookmakerCategory; defaultOn: boolean };

/** One side of a surebet: what to bet, where, and at which odds. */
export type Leg = { bookmaker: BookmakerId; pick: string; odds: number };

/** `short` is used in compact lists such as the live ticker. */
export type Team = { name: string; short?: string; crest: string | null };

/** Another bookmaker that offers the same pick on one side of the surebet, at lower odds than the leg shown. */
export type LegAlternative = { leg: 0 | 1; bookmaker: BookmakerId; odds: number };

export type Surebet = {
  /** Database id of the opportunity. */
  id: number;
  sport: string;
  home: Team;
  away: Team;
  league: string;
  /** Short league code for compact lists, e.g. "PL". */
  leagueShort: string;
  /** How long ago the scanner found it, e.g. "7s" or "21m". */
  foundAgo: string;
  time: string;
  market: string;
  legs: [Leg, Leg];
  alternatives: LegAlternative[];
  accent: "success" | "warning" | "primary" | "violet";
  favorite: boolean;
};

/** Guaranteed profit in percent of the total stake: 1 / Σ(1/odds) − 1. Negative means it is not a surebet. */
export function surebetProfitPct(odds: readonly number[]): number {
  const implied = odds.reduce((sum, o) => sum + 1 / o, 0);
  return (1 / implied - 1) * 100;
}

export const formatPct = (p: number) => `${p.toFixed(1).replace(".", ",")}%`;

export const teamShort = (t: Team) => t.short ?? t.name;

/** Compact "7 sek.", "21 min." or "3 t." label for an age in seconds. */
export function formatAgo(seconds: number): string {
  if (seconds < 60) return `${Math.max(1, Math.floor(seconds))} sek.`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min.`;
  return `${Math.floor(seconds / 3600)} t.`;
}

/** A surebet is only playable when the user can bet at every bookmaker in it, so all its legs must be selected. */
export function visibleSurebets<T extends Pick<Surebet, "legs">>(list: readonly T[], selected: readonly BookmakerId[]): T[] {
  const on = new Set(selected);
  return list.filter((b) => b.legs.every((l) => on.has(l.bookmaker)));
}
