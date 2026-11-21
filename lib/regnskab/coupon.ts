import { BOOKMAKERS, type Bookmaker } from "./surebet";

/** A surebet always needs one coupon per bookmaker, so exactly two images. */
export const REQUIRED_COUPONS = 2;

export interface SurebetDraft {
  date: string;
  event: string;
  bookmakerA: Bookmaker;
  bookmakerB: Bookmaker;
  oddsA: string;
  oddsB: string;
  stake: string;
}

export const emptyDraft = (): SurebetDraft => ({
  date: new Date().toISOString().slice(0, 10),
  event: "",
  bookmakerA: "bet365",
  bookmakerB: "Unibet",
  oddsA: "",
  oddsB: "",
  stake: "1000",
});

export interface CouponSide {
  bookmaker: Bookmaker | null;
  odds: number | null;
  stake: number | null;
}

export interface CouponReading {
  event: string | null;
  date: string | null;
  sides: [CouponSide, CouponSide];
}

/** True only when both coupon images are present – the calculation is blocked until then. */
export function couponsReady(images: ReadonlyArray<string | null | undefined>): images is [string, string] {
  return images.length === REQUIRED_COUPONS && images.every((img) => typeof img === "string" && img.length > 0);
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const isDate = (v: string | null): v is string => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Turn what was read from the two coupons into form values; unread fields keep the fallback. */
export function draftFromReading(reading: CouponReading, fallback: SurebetDraft = emptyDraft()): SurebetDraft {
  const [a, b] = reading.sides;
  const bookmakerA = a.bookmaker ?? fallback.bookmakerA;
  const bookmakerB = b.bookmaker ?? (BOOKMAKERS.find((bm) => bm !== bookmakerA) ?? fallback.bookmakerB);
  const stakeA = a.stake ?? 0;
  const stakeB = b.stake ?? 0;
  return {
    date: isDate(reading.date) ? reading.date : fallback.date,
    event: reading.event?.trim() || fallback.event,
    bookmakerA,
    bookmakerB,
    oddsA: a.odds && a.odds > 1 ? String(a.odds) : fallback.oddsA,
    oddsB: b.odds && b.odds > 1 ? String(b.odds) : fallback.oddsB,
    stake: stakeA > 0 && stakeB > 0 ? String(round2(stakeA + stakeB)) : fallback.stake,
  };
}
