import * as cheerio from "cheerio";

export type OddspediaOutcome = {
  label: string;
  bookmaker: string;
  odds: number;
};

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
  outcomes: OddspediaOutcome[];
  a: OddspediaOutcome;
  b: OddspediaOutcome;
  margin: number;
  favorite: boolean;
  source: "oddspedia";
  sourceUrl: string;
};

const ODDSPEDIA_URL = "https://oddspedia.com/surebets";

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function absoluteUrl(value: string) {
  try {
    return new URL(value, ODDSPEDIA_URL).toString();
  } catch {
    return ODDSPEDIA_URL;
  }
}

function parseNumber(value: string) {
  const n = Number(value.replace(",", ".").trim());
  return Number.isFinite(n) ? n : null;
}

function parseCard($: cheerio.CheerioAPI, element: cheerio.Element, index: number): OddspediaSurebet | null {
  const card = $(element);
  const text = clean(card.text());

  const profitMatch = text.match(/([\d]+(?:[.,]\d+)?)\s*%\s*GUARANTEED\s+PROFIT/i);
  if (!profitMatch) return null;

  const profit = parseNumber(profitMatch[1]);
  if (profit === null) return null;

  const eventAnchor = card
    .find("a[href]")
    .toArray()
    .map((a) => ({
      href: absoluteUrl($(a).attr("href") || ""),
      text: clean($(a).text()),
    }))
    .find((a) =>
      /\/(?:football|basketball|tennis|hockey|baseball|handball|volleyball)\//i.test(a.href)
    );

  const sourceUrl = eventAnchor?.href || ODDSPEDIA_URL;

  const imgNames = card
    .find("img[alt], img[title]")
    .toArray()
    .map((img) => clean($(img).attr("alt") || $(img).attr("title") || ""))
    .filter((name) => name && !/oddspedia|sure bet|logo|icon/i.test(name));

  const numericValues = card
    .find("*")
    .toArray()
    .map((node) => clean($(node).clone().children().remove().end().text()))
    .map(parseNumber)
    .filter((n): n is number => n !== null && n > 1 && n < 100);

  const odds: number[] = [];
  for (const value of numericValues) {
    if (!odds.includes(value)) odds.push(value);
  }

  if (odds.length < 2) return null;

  const marketMatch = text.match(/(Home\/Away|1X2|Over\/Under|Asian Handicap|European Handicap|Double Chance|Both Teams To Score)/i);
  const market = marketMatch?.[1] || "Sure Bet";

  const eventText = eventAnchor?.text || "";
  const teams = eventText
    .split(/\s+(?:vs\.?|v)\s+/i)
    .map(clean)
    .filter(Boolean);

  let homeTeam = teams[0] || "Hjemmehold";
  let awayTeam = teams[1] || "Udehold";

  if (teams.length < 2) {
    const words = eventText.split(/\s+/).filter(Boolean);
    const midpoint = Math.max(1, Math.floor(words.length / 2));
    homeTeam = words.slice(0, midpoint).join(" ") || homeTeam;
    awayTeam = words.slice(midpoint).join(" ") || awayTeam;
  }

  const bookmakers = imgNames.filter((name, i) => imgNames.indexOf(name) === i);
  const outcomes: OddspediaOutcome[] = odds.slice(0, 3).map((value, i) => ({
    label: i === 0 ? "Home" : i === 1 ? "Away" : "Draw",
    bookmaker: bookmakers[i] || "Bookmaker",
    odds: value,
  }));

  const stableKey = `${sourceUrl}|${homeTeam}|${awayTeam}|${market}`;

  return {
    id: `oddspedia-${Buffer.from(stableKey).toString("base64url").slice(0, 32)}`,
    sport: "Sport",
    country: "International",
    countryCode: "un",
    league: "Oddspedia Sure Bets",
    homeTeam,
    awayTeam,
    market,
    kickoffLabel: "",
    kickoffTs: Date.now(),
    createdTs: Date.now(),
    outcomes,
    a: outcomes[0],
    b: outcomes[1],
    margin: profit,
    favorite: false,
    source: "oddspedia",
    sourceUrl,
  };
}

export async function getFeedTestOpportunities(): Promise<OddspediaSurebet[]> {
  const response = await fetch(ODDSPEDIA_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`Oddspedia returned HTTP ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const result: OddspediaSurebet[] = [];

  $("body *").each((_, element) => {
    const text = clean($(element).text());

    if (
      !/GUARANTEED\s+PROFIT/i.test(text) ||
      text.length < 60 ||
      text.length > 3500
    ) {
      return;
    }

    const parsed = parseCard($, element, result.length);
    if (!parsed) return;

    if (!result.some((item) => item.sourceUrl === parsed.sourceUrl && item.margin === parsed.margin)) {
      result.push(parsed);
    }
  });

  return result.slice(0, 100);
}
