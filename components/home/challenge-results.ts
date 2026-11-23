import { CHALLENGE } from "./data";

/** Day 1 of the 365-day challenge. Day `CHALLENGE.day` is 2026-11-23. */
export const CHALLENGE_START = new Date(2026, 8, 28);

/**
 * Result for each challenge day, in order: [profit in % of bankroll, number of surebets placed].
 * A day with [0, 0] is a rest day. Replace these with the real figures as the challenge goes on;
 * the calendar reads everything from here. The sums match CHALLENGE (18.75 % and 247 surebets).
 */
const DAILY: ReadonlyArray<readonly [number, number]> = [
  [0.29, 8], [0.44, 10], [0.19, 7], [0.33, 1], [0.2, 8], [0.59, 4], [0.37, 4], [0.43, 7], [0, 0],
  [0.51, 3], [0.38, 7], [0.33, 4], [0.21, 7], [0.53, 3], [0.25, 8], [0.23, 4], [0.37, 1], [0, 0],
  [0.22, 6], [0.51, 1], [0.43, 8], [0.29, 6], [0.32, 3], [0.39, 6], [0.31, 2], [0.55, 6], [0, 0],
  [0.34, 8], [0.38, 2], [0.28, 8], [0.43, 4], [0.25, 4], [0.25, 1], [0.47, 7], [0.24, 4], [0, 0],
  [0.49, 8], [0.33, 3], [0.45, 7], [0.39, 4], [0.51, 8], [0.31, 8], [0.26, 2], [0.58, 7], [0, 0],
  [0.26, 1], [0.3, 7], [0.5, 2], [0.39, 7], [0.35, 3], [0.32, 2], [0.55, 2], [0.47, 6], [0, 0],
  [0.36, 2], [0.4, 3], [0.22, 3],
];

export type ChallengeDay = {
  day: number;
  date: Date;
  profit: number;
  surebets: number;
};

export const CHALLENGE_DAYS: ChallengeDay[] = DAILY.slice(0, CHALLENGE.day).map(([profit, surebets], i) => ({
  day: i + 1,
  date: new Date(CHALLENGE_START.getFullYear(), CHALLENGE_START.getMonth(), CHALLENGE_START.getDate() + i),
  profit,
  surebets,
}));

export const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim() || "https://t.me/bettrackerai";

export function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
