import { chromium } from "playwright";

export type OddspediaSurebet = {
  id: string;
  sport: string;
  country: string;
  countryCode: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  kickoffLabel: string;
  kickoffTs: number;
  createdTs: number;
  a: { label: string; bookmaker: string; odds: number };
  b: { label: string; bookmaker: string; odds: number };
  margin: number;
  favorite: boolean;
  source: "oddspedia";
  sourceUrl: string;
};

function parseCard(text: string, index: number): OddspediaSurebet | null {
  const lines = text.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const profitLine = lines.find(x => /GUARANTEED\s+PROFIT/i.test(x));
  const profitMatch = profitLine?.match(/([\d]+(?:[.,]\d+)?)\s*%\s*GUARANTEED/i);
  if (!profitMatch) return null;
  const profit = Number(profitMatch[1].replace(",", "."));
  if (!Number.isFinite(profit)) return null;

  const odds: { odds: number; bookmaker: string }[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (/^[0-9]+(?:[.,][0-9]+)?$/.test(lines[i])) {
      const value = Number(lines[i].replace(",", "."));
      if (value > 1 && value < 100) odds.push({ odds: value, bookmaker: lines[i - 1] });
    }
  }
  if (odds.length < 2) return null;

  const matchIndex = lines.findIndex(x => /Home\/Away|1X2|Moneyline/i.test(x));
  const market = matchIndex >= 0 ? lines[matchIndex] : "Sure Bet";
  const candidates = lines.filter(x =>
    x.length > 3 &&
    !/GUARANTEED|PROFIT|Calculate|Home|Away|^\d+(?:[.,]\d+)?$|Sure Bets/i.test(x)
  );
  const match = candidates[0] || "Ukendt kamp";
  const teams = match.split(/\s{2,}|\s+vs\.?\s+/i).map(x => x.trim()).filter(Boolean);

  return {
    id: `oddspedia-${index}-${Buffer.from(match).toString("base64url").slice(0, 16)}`,
    sport: "Sport",
    country: "International",
    countryCode: "un",
    league: "Oddspedia Sure Bets",
    homeTeam: teams[0] || "Hjemmehold",
    awayTeam: teams[1] || "Udehold",
    market,
    kickoffLabel: "",
    kickoffTs: Date.now(),
    createdTs: Date.now(),
    a: { label: "Udfald 1", bookmaker: odds[0].bookmaker, odds: odds[0].odds },
    b: { label: "Udfald 2", bookmaker: odds[1].bookmaker, odds: odds[1].odds },
    margin: profit,
    favorite: false,
    source: "oddspedia",
    sourceUrl: "https://oddspedia.com/surebets",
  };
}

export async function getFeedTestOpportunities(): Promise<OddspediaSurebet[]> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto("https://oddspedia.com/surebets", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);

    const cards = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .filter(el => {
          const t = (el.innerText || "").trim();
          return /GUARANTEED\s+PROFIT/i.test(t) && /\d+(?:[.,]\d+)?\s*%/.test(t) && t.length > 40 && t.length < 2500;
        })
        .sort((a, b) => a.innerText.length - b.innerText.length);

      const result: string[] = [];
      for (const el of elements) {
        const t = el.innerText.trim();
        if (!result.some(x => x === t || x.includes(t) || t.includes(x))) result.push(t);
        if (result.length >= 100) break;
      }
      return result;
    });

    return cards.map(parseCard).filter((x): x is OddspediaSurebet => Boolean(x));
  } finally {
    await browser.close();
  }
}
