export type Bookmaker = "bet365" | "Unibet" | "betfair" | "Danske Spil";
export const BOOKMAKERS: Bookmaker[] = ["bet365", "Unibet", "betfair", "Danske Spil"];

export type SurebetStatus = "Vundet" | "Åben" | "Tabt";

export interface Surebet {
  id: string;
  date: string; // YYYY-MM-DD
  event: string;
  bookmakers: [Bookmaker, Bookmaker];
  odds: [number, number];
  stake: number;
  expected: number;
  status: SurebetStatus;
  /** Which outcome paid out (0 = first bookmaker, 1 = second). Set when the surebet is won. */
  winner?: 0 | 1;
}

/** Money the user has deposited at a bookmaker. */
export interface Deposit {
  id: string;
  date: string;
  bookmaker: Bookmaker;
  amount: number;
}

export type ActivityKind = "won" | "info" | "lost";
export interface Activity {
  id: string;
  date: string;
  kind: ActivityKind;
  text: string;
}

/** Sum of implied probabilities. Below 1 means the two outcomes form a surebet. */
export function impliedTotal(oddsA: number, oddsB: number) {
  return 1 / oddsA + 1 / oddsB;
}

export function isSurebet(oddsA: number, oddsB: number) {
  return impliedTotal(oddsA, oddsB) < 1;
}

/** Guaranteed payout when the total stake is split so both outcomes pay the same. */
export function surebetPayout(totalStake: number, oddsA: number, oddsB: number) {
  return totalStake / impliedTotal(oddsA, oddsB);
}

/** How the total stake is split between the two bookmakers. */
export function surebetStakes(totalStake: number, oddsA: number, oddsB: number): [number, number] {
  const total = impliedTotal(oddsA, oddsB);
  return [(totalStake * (1 / oddsA)) / total, (totalStake * (1 / oddsB)) / total];
}

/** Guaranteed profit in percent of the total stake. */
export function surebetMargin(oddsA: number, oddsB: number) {
  return (1 / impliedTotal(oddsA, oddsB) - 1) * 100;
}

const krFormatter = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 0 });
export function formatKr(value: number) {
  return `${krFormatter.format(Math.round(value))} kr.`;
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export interface BankrollRow {
  bookmaker: Bookmaker;
  /** Total deposited at this bookmaker. */
  deposited: number;
  /** Deposits minus settled stakes plus payouts received (open stakes still count). */
  balance: number;
  /** Stakes placed in surebets that are still open. */
  active: number;
}

/**
 * Balance per bookmaker: each surebet takes its stake share from both bookmakers;
 * a won surebet pays stake share × odds back to the winning bookmaker.
 * Available to bet = balance − active.
 */
export function buildBankroll(deposits: Deposit[], surebets: Surebet[]): BankrollRow[] {
  const rows = new Map<Bookmaker, BankrollRow>();
  const row = (bm: Bookmaker) => {
    let r = rows.get(bm);
    if (!r) rows.set(bm, (r = { bookmaker: bm, deposited: 0, balance: 0, active: 0 }));
    return r;
  };
  for (const d of deposits) {
    const r = row(d.bookmaker);
    r.deposited += d.amount;
    r.balance += d.amount;
  }
  for (const s of surebets) {
    const legs = surebetStakes(s.stake, s.odds[0], s.odds[1]);
    ([0, 1] as const).forEach((i) => {
      const r = row(s.bookmakers[i]);
      const legStake = legs[i];
      if (s.status === "Åben") {
        r.active += legStake;
        return;
      }
      r.balance -= legStake;
      if (s.status === "Vundet" && s.winner === i) r.balance += legStake * s.odds[i];
    });
  }
  return BOOKMAKERS.filter((bm) => rows.has(bm)).map((bm) => rows.get(bm)!);
}

/** Realised result of one surebet: won pays expected minus stake, lost costs the stake, open counts 0. */
export function surebetProfit(s: Surebet) {
  if (s.status === "Vundet") return s.expected - s.stake;
  if (s.status === "Tabt") return -s.stake;
  return 0;
}

export type ChartRange = "30" | "90" | "365";

const DAY = 86_400_000;
const toDay = (iso: string) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
const toIso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** First day (inclusive) of the selected range ending on `today`. */
export function rangeStart(range: ChartRange, today: string) {
  return toIso(toDay(today) - (Number(range) - 1) * DAY);
}

export interface Summary {
  profitToday: number;
  profit: number;
  roi: number;
  bankroll: number;
}

/** Dashboard key figures, calculated only from the surebets and bankroll the user has entered. */
export function summarize(surebets: Surebet[], bankroll: BankrollRow[], range: ChartRange, today: string): Summary {
  const from = rangeStart(range, today);
  const inRange = surebets.filter((s) => s.date >= from && s.date <= today);
  const settled = inRange.filter((s) => s.status !== "Åben");
  const profit = settled.reduce((sum, s) => sum + surebetProfit(s), 0);
  const settledStake = settled.reduce((sum, s) => sum + s.stake, 0);
  return {
    profitToday: surebets.filter((s) => s.date === today).reduce((sum, s) => sum + surebetProfit(s), 0),
    profit,
    roi: settledStake > 0 ? (profit / settledStake) * 100 : 0,
    bankroll: bankroll.reduce((sum, r) => sum + r.balance, 0),
  };
}

export interface ProfitPoint {
  label: string;
  profit: number;
  investering: number;
}

const MONTHS = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

/** Cumulative profit and invested stake across the range, built from the entered surebets. */
export function buildProfitSeries(surebets: Surebet[], range: ChartRange, today: string): ProfitPoint[] {
  const days = Number(range);
  const step = range === "30" ? 1 : range === "90" ? 3 : 7;
  const count = Math.floor((days - 1) / step) + 1;
  const end = toDay(today);
  const from = rangeStart(range, today);

  return Array.from({ length: count }, (_, i) => {
    const ms = end - (count - 1 - i) * step * DAY;
    const upTo = toIso(ms);
    const included = surebets.filter((s) => s.date >= from && s.date <= upTo);
    const date = new Date(ms);
    const label =
      range === "365"
        ? `${MONTHS[date.getUTCMonth()]} ${String(date.getUTCFullYear()).slice(2)}`
        : `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
    return {
      label,
      profit: Math.round(included.reduce((sum, s) => sum + surebetProfit(s), 0)),
      investering: Math.round(included.reduce((sum, s) => sum + s.stake, 0)),
    };
  });
}
