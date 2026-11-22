const madsPhoto = "/home/review-mads-v2.jpg";
const madsAvatar = "/home/review-mads-avatar-v2.jpg";
const jonasPhoto = "/home/review-jonas-v2.jpg";
const jonasAvatar = "/home/review-jonas-avatar-v2.jpg";
const frederikPhoto = "/home/review-frederik-v2.jpg";
const frederikAvatar = "/home/review-frederik-avatar-v2.jpg";
const martinPhoto = "/home/review-martin-v2.jpg";
const martinAvatar = "/home/review-martin-avatar-v2.jpg";
const rm = "/home/rm.webp";
const liv = "/home/liv.webp";
const mci = "/home/mci.webp";
const ars = "/home/ars.webp";
const bar = "/home/bar.webp";
const rso = "/home/rso.webp";
const int = "/home/int.webp";
const nap = "/home/nap.webp";
const psg = "/home/psg.webp";
const om = "/home/om.webp";
const cl = "/home/cl.webp";
const pl = "/home/pl.webp";
const sa = "/home/sa.webp";
const ll = "/home/ll.webp";

export type Team = { name: string; crest: string };

export const TEAMS = {
  rm: { name: "Real Madrid", crest: rm },
  liv: { name: "Liverpool", crest: liv },
  mci: { name: "Man City", crest: mci },
  ars: { name: "Arsenal", crest: ars },
  bar: { name: "Barcelona", crest: bar },
  rso: { name: "Real Sociedad", crest: rso },
  int: { name: "Inter", crest: int },
  nap: { name: "Napoli", crest: nap },
  psg: { name: "PSG", crest: psg },
  om: { name: "Marseille", crest: om },
} satisfies Record<string, Team>;

export type TeamKey = keyof typeof TEAMS;

export const LEAGUES = {
  CL: { name: "Champions League", icon: cl },
  PL: { name: "Premier League", icon: pl },
  SA: { name: "Serie A", icon: sa },
  LL: { name: "La Liga", icon: ll },
  L1: { name: "Ligue 1", icon: cl },
} as const;

export type LeagueKey = keyof typeof LEAGUES;

/** Fixtures the live scanner cycles through (home, away, league). */
export const FIXTURES: [TeamKey, TeamKey, LeagueKey][] = [
  ["rm", "liv", "CL"],
  ["mci", "ars", "PL"],
  ["bar", "rso", "LL"],
  ["int", "nap", "SA"],
  ["psg", "om", "L1"],
  ["liv", "mci", "PL"],
  ["nap", "int", "SA"],
  ["rso", "rm", "LL"],
  ["ars", "liv", "PL"],
  ["om", "psg", "L1"],
  ["bar", "psg", "CL"],
  ["mci", "rm", "CL"],
];

export type WeeklyFind = {
  home: TeamKey;
  away: TeamKey;
  league: LeagueKey;
  margin: number;
  time: string;
  width: number;
};

export const WEEKLY_FINDS: WeeklyFind[] = [
  { home: "rm", away: "liv", league: "CL", margin: 4.12, time: "I dag, 21:00", width: 291 },
  { home: "mci", away: "ars", league: "PL", margin: 3.78, time: "I morgen, 18:30", width: 262 },
  { home: "int", away: "nap", league: "SA", margin: 3.21, time: "I morgen, 20:45", width: 268 },
  { home: "bar", away: "rm", league: "LL", margin: 3.05, time: "I morgen, 21:00", width: 268 },
];

/** BetTrackerAI Pro pricing (kr. per month). Yearly billing is the discounted plan. */
export const PRICING = { monthly: 499, yearly: 199, trialDays: 7 } as const;
export type Billing = "monthly" | "yearly";

/** Percentage saved per month by choosing yearly billing, rounded to a whole number. */
export function yearlyDiscount() {
  return Math.round((1 - PRICING.yearly / PRICING.monthly) * 100);
}

/** Current status of the 365-day surebet challenge. */
export const CHALLENGE = { day: 57, totalDays: 365, totalReturn: 18.75, surebets: 247, avgMargin: 2.46 } as const;

/** Cumulative result (%) per tracked day, drawn as the results chart. */
export const RESULT_SERIES = [
  0, 0.6, 0.4, 1.3, 1.1, 2.0, 1.7, 2.6, 3.4, 3.0, 3.9, 3.6, 4.6, 5.3, 4.9, 5.8, 6.6, 6.1, 7.2, 7.0,
  8.1, 8.8, 8.3, 9.4, 10.1, 9.6, 10.8, 11.6, 11.1, 12.3, 12.0, 13.2, 14.1, 13.6, 14.8, 15.5, 15.0,
  16.2, 17.1, 16.6, 17.8, 18.75,
];

export type Review = { name: string; title: string; stars: number; text: string; photo: string; avatar: string; focus: string };

/** Picture reviews shown in "Kunde anmeldelser": each customer has a photo and a matching round avatar.
 *  `focus` is the crop point (object-position) that keeps that customer's face in frame when the
 *  wide photo is shown as a tall column on the computer or a full-width band on the phone. */
export const REVIEWS: Review[] = [
  { name: "Martin", title: "Gode resultater", stars: 5, photo: martinPhoto, avatar: martinAvatar, focus: "47% 30%", text: "Jeg er virkelig positivt overrasket over resultaterne med BetTracker AI. Det er fedt at se, hvordan scanneren finder muligheder, og hvordan det hele kan omsættes til konkrete resultater. Et virkelig spændende system!" },
  { name: "Mads", title: "Spændende koncept", stars: 5, photo: madsPhoto, avatar: madsAvatar, focus: "33% 30%", text: "Virkelig spændende system. Det er fedt at se, hvilke muligheder scanneren finder. Nem at komme i gang med!" },
  { name: "Frederik", title: "Positiv overraskelse", stars: 5, photo: frederikPhoto, avatar: frederikAvatar, focus: "53% 28%", text: "Jeg var lidt skeptisk i starten, men systemet er virkelig interessant. Godt overblik og en spændende måde at arbejde med surebets på." },
  { name: "Jonas", title: "Nem at bruge", stars: 5, photo: jonasPhoto, avatar: jonasAvatar, focus: "50% 36%", text: "Jeg blev positivt overrasket over, hvor overskueligt systemet er. Det er spændende at følge med i." },
];

/** Seconds each review stays on screen before the next one fades in. */
export const REVIEW_SECONDS = 7;

/** Responsible-gambling details shown on every page (Danish marketing rules: 18+, StopSpillet and ROFUS). */
export const RESPONSIBLE = {
  minAge: 18,
  stopSpilletPhone: "70 22 28 25",
  stopSpilletUrl: "https://www.stopspillet.dk",
  rofusUrl: "https://www.rofus.nu",
} as const;

/** Year shown in the copyright line — always the current year. */
const DA_WEEKDAYS = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
const DA_MONTHS = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];

/** Lock-screen date on the SMS phone mockup, e.g. "Tirsdag 17. november". */
export function danishLockDate(now = new Date()) {
  return `${DA_WEEKDAYS[now.getDay()]} ${now.getDate()}. ${DA_MONTHS[now.getMonth()]}`;
}

export function copyrightYear(now = new Date()) {
  return now.getFullYear();
}
