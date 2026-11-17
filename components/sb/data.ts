export type BookmakerId =
  | "bet365"
  | "unibet"
  | "bwin"
  | "danskespil"
  | "nordicbet"
  | "betsson"
  | "bet25"
  | "leovegas"
  | "mrgreen"
  | "betfair"
  | "smarkets"
  | "matchbook"
  | "1xbet"
  | "stake"
  | "cloudbet";

export type BookmakerCategory = "local" | "exchange" | "crypto";

export const bookmakerCategories: { id: BookmakerCategory; name: string; hint: string }[] = [
  { id: "local", name: "Lokale bookmakere", hint: "Dansk licens" },
  { id: "exchange", name: "Spillebørs", hint: "Spil mod andre spillere" },
  { id: "crypto", name: "Crypto bookmakere", hint: "Ind- og udbetaling i krypto" },
];

export const bookmakers: { id: BookmakerId; name: string; category: BookmakerCategory }[] = [
  { id: "bet365", name: "Bet365", category: "local" },
  { id: "unibet", name: "Unibet", category: "local" },
  { id: "bwin", name: "bwin", category: "local" },
  { id: "danskespil", name: "Danske Spil", category: "local" },
  { id: "nordicbet", name: "NordicBet", category: "local" },
  { id: "betsson", name: "Betsson", category: "local" },
  { id: "bet25", name: "Bet25", category: "local" },
  { id: "leovegas", name: "LeoVegas", category: "local" },
  { id: "mrgreen", name: "Mr Green", category: "local" },
  { id: "betfair", name: "Betfair", category: "exchange" },
  { id: "smarkets", name: "Smarkets", category: "exchange" },
  { id: "matchbook", name: "Matchbook", category: "exchange" },
  { id: "1xbet", name: "1xBet", category: "crypto" },
  { id: "stake", name: "Stake", category: "crypto" },
  { id: "cloudbet", name: "Cloudbet", category: "crypto" },
];

/** One side of a surebet: what to bet, where, and at which odds. */
export type Leg = { bookmaker: BookmakerId; pick: string; odds: number };

/** `short` is used in compact lists such as the live ticker. */
export type Team = { name: string; short?: string; crest: string };

export type Surebet = {
  id: string;
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
  /** Total amount to spread across both legs, in kr. */
  stake: number;
  accent: "success" | "warning" | "primary" | "violet";
};

/** Guaranteed profit in percent of the total stake: 1 / Σ(1/odds) − 1. Negative means it is not a surebet. */
export function surebetProfitPct(odds: readonly number[]): number {
  const implied = odds.reduce((sum, o) => sum + 1 / o, 0);
  return (1 / implied - 1) * 100;
}

/** Splits the total stake so every outcome pays out the same amount; rounded to whole kr. */
export function splitStake(total: number, odds: readonly number[]): number[] {
  const implied = odds.reduce((sum, o) => sum + 1 / o, 0);
  return odds.map((o) => Math.round((total * (1 / o)) / implied));
}

export const formatKr = (n: number) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} kr.`;
export const formatPct = (p: number) => `${p.toFixed(1).replace(".", ",")}%`;

const crest = (id: number) => `https://crests.football-data.org/${id}.svg`;

export const surebets: Surebet[] = [
  {
    id: "mci-liv",
    home: { name: "Manchester City", short: "Man City", crest: crest(65) },
    away: { name: "Liverpool", crest: crest(64) },
    league: "Premier League",
    leagueShort: "PL",
    foundAgo: "7s",
    time: "I dag 17:30",
    market: "Begge hold scorer",
    legs: [
      { bookmaker: "bet365", pick: "Ja, begge scorer", odds: 1.8 },
      { bookmaker: "betfair", pick: "Nej, ikke begge", odds: 2.45 },
    ],
    stake: 500,
    accent: "success",
  },
  {
    id: "fcb-bvb",
    home: { name: "Bayern München", short: "Bayern", crest: crest(5) },
    away: { name: "Dortmund", crest: crest(4) },
    league: "Bundesliga",
    leagueShort: "BL",
    foundAgo: "13s",
    time: "I dag 18:30",
    market: "Handicap ±1,5 mål",
    legs: [
      { bookmaker: "unibet", pick: "Bayern München −1,5", odds: 2.2 },
      { bookmaker: "bet365", pick: "Dortmund +1,5", odds: 1.95 },
    ],
    stake: 750,
    accent: "warning",
  },
  {
    id: "rma-bar",
    home: { name: "Real Madrid", crest: crest(86) },
    away: { name: "Barcelona", crest: crest(81) },
    league: "La Liga",
    leagueShort: "LL",
    foundAgo: "21m",
    time: "I dag 21:00",
    market: "Over/under 2,5 mål",
    legs: [
      { bookmaker: "bet365", pick: "Over 2,5 mål", odds: 2.1 },
      { bookmaker: "unibet", pick: "Under 2,5 mål", odds: 2.02 },
    ],
    stake: 1000,
    accent: "success",
  },
  {
    id: "int-mil",
    home: { name: "Inter", crest: crest(108) },
    away: { name: "AC Milan", crest: crest(98) },
    league: "Serie A",
    leagueShort: "SA",
    foundAgo: "34m",
    time: "I dag 20:45",
    market: "Vinder uden uafgjort",
    legs: [
      { bookmaker: "bet365", pick: "Inter vinder", odds: 1.72 },
      { bookmaker: "1xbet", pick: "AC Milan vinder", odds: 2.55 },
    ],
    stake: 800,
    accent: "violet",
  },
  {
    id: "psg-om",
    home: { name: "PSG", crest: crest(524) },
    away: { name: "Marseille", crest: crest(516) },
    league: "Ligue 1",
    leagueShort: "L1",
    foundAgo: "52m",
    time: "I dag 20:45",
    market: "Over/under 3,5 mål",
    legs: [
      { bookmaker: "bet365", pick: "Over 3,5 mål", odds: 2.4 },
      { bookmaker: "bwin", pick: "Under 3,5 mål", odds: 1.78 },
    ],
    stake: 600,
    accent: "primary",
  },
  {
    id: "ars-che",
    home: { name: "Arsenal", crest: crest(57) },
    away: { name: "Chelsea", crest: crest(61) },
    league: "Premier League",
    leagueShort: "PL",
    foundAgo: "1t",
    time: "I dag 18:00",
    market: "Asiatisk handicap 0",
    legs: [
      { bookmaker: "danskespil", pick: "Arsenal 0", odds: 2.08 },
      { bookmaker: "smarkets", pick: "Chelsea 0", odds: 2.02 },
    ],
    stake: 700,
    accent: "primary",
  },
  {
    id: "juv-nap",
    home: { name: "Juventus", crest: crest(109) },
    away: { name: "Napoli", crest: crest(113) },
    league: "Serie A",
    leagueShort: "SA",
    foundAgo: "1t",
    time: "I dag 20:45",
    market: "Vinder uden uafgjort",
    legs: [
      { bookmaker: "leovegas", pick: "Juventus vinder", odds: 2.15 },
      { bookmaker: "matchbook", pick: "Napoli vinder", odds: 1.98 },
    ],
    stake: 650,
    accent: "warning",
  },
  {
    id: "aja-psv",
    home: { name: "Ajax", crest: crest(678) },
    away: { name: "PSV", crest: crest(674) },
    league: "Eredivisie",
    leagueShort: "ED",
    foundAgo: "2t",
    time: "I morgen 14:30",
    market: "Over/under 2,5 mål",
    legs: [
      { bookmaker: "stake", pick: "Over 2,5 mål", odds: 1.95 },
      { bookmaker: "betsson", pick: "Under 2,5 mål", odds: 2.12 },
    ],
    stake: 500,
    accent: "violet",
  },
];

export const teamShort = (t: Team) => t.short ?? t.name;

/** A surebet is only playable when the user can bet at every bookmaker in it, so all its legs must be selected. */
export function visibleSurebets<T extends Pick<Surebet, "legs">>(list: readonly T[], selected: readonly BookmakerId[]): T[] {
  const on = new Set(selected);
  return list.filter((b) => b.legs.every((l) => on.has(l.bookmaker)));
}
