import { chromium } from "playwright";

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

type RawCard = {
  text: string;
  href: string;
  links: string[];
  images: string[];
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function parseCard(card: RawCard, index: number): OddspediaSurebet | null {
  const lines = card.text.split(/\r?\n/).map(clean).filter(Boolean);
  const profitLine = lines.find((x) => /GUARANTEED\s+PROFIT/i.test(x));
  const profitMatch = profitLine?.match(/([\d]+(?:[.,]\d+)?)\s*%\s*GUARANTEED/i);
  if (!profitMatch) return null;

  const profit = Number(profitMatch[1].replace(",", "."));
  if (!Number.isFinite(profit)) return null;

  // Oddspedia renders bookmaker logos/names immediately before their decimal odds.
  // Read the rendered card instead of recalculating anything.
  const outcomes: OddspediaOutcome[] = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^([0-9]+(?:[.,][0-9]+)?)$/);
    if (!match) continue;

    const odds = Number(match[1].replace(",", "."));
    if (!Number.isFinite(odds) || odds <= 1 || odds >= 100) continue;

    let bookmaker = "";
    for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
      const candidate = lines[j]
        .replace(/^Image:\s*/i, "")
        .replace(/^Logo:\s*/i, "")
        .trim();
      if (
        candidate &&
        !/^(Home|Away|Draw|Over|Under|Calculate stakes|[0-9]+(?:[.,][0-9]+)?)$/i.test(candidate) &&
        !/GUARANTEED\s+PROFIT/i.test(candidate)
      ) {
        bookmaker = candidate;
        break;
      }
    }

    outcomes.push({
      label: "",
      bookmaker: bookmaker || "Ukendt bookmaker",
      odds,
    });
  }

  const uniqueOutcomes = outcomes.filter(
    (item, i, all) => all.findIndex((x) => x.odds === item.odds && x.bookmaker === item.bookmaker) === i
  );

  if (uniqueOutcomes.length < 2) return null;

  const marketIndex = lines.findIndex((x) =>
    /^(Home\/Away|1X2|Over\/Under|Asian Handicap|European Handicap|Double Chance|Both Teams To Score)/i.test(x)
  );
  const market = marketIndex >= 0 ? lines[marketIndex] : "Sure Bet";

  const resultLabels = lines.filter((x) =>
    /^(Home|Away|Draw|Over|Under|Yes|No)$/i.test(x)
  );

  uniqueOutcomes.forEach((outcome, i) => {
    outcome.label = resultLabels[i] || `Udfald ${i + 1}`;
  });

  const nonUi = lines.filter(
    (x) =>
      x.length > 2 &&
      !/^(Home|Away|Draw|Over|Under|Yes|No|Calculate stakes|Sure Bets)$/i.test(x) &&
      !/^\d+(?:[.,]\d+)?$/.test(x) &&
      !/GUARANTEED\s+PROFIT/i.test(x)
  );

  const teamsText =
    nonUi.find((x) => /\s+(?:vs\.?|v)\s+/i.test(x)) ||
    nonUi.find((x) => x.split(/\s{2,}/).length >= 2) ||
    "Ukendt kamp";

  let homeTeam = "Hjemmehold";
  let awayTeam = "Udehold";

  const vs = teamsText.split(/\s+(?:vs\.?|v)\s+/i).map(clean).filter(Boolean);
  if (vs.length >= 2) {
    homeTeam = vs[0];
    awayTeam = vs[1];
  } else {
    const parts = teamsText.split(/\s{2,}/).map(clean).filter(Boolean);
    if (parts.length >= 2) {
      homeTeam = parts[0];
      awayTeam = parts[1];
    } else {
      const words = teamsText.split(" ");
      const midpoint = Math.max(1, Math.floor(words.length / 2));
      homeTeam = words.slice(0, midpoint).join(" ");
      awayTeam = words.slice(midpoint).join(" ");
    }
  }

  const canonicalHref = card.href || "https://oddspedia.com/surebets";
  const stableKey = `${canonicalHref}|${teamsText}|${market}`;

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
    outcomes: uniqueOutcomes,
    a: uniqueOutcomes[0],
    b: uniqueOutcomes[1],
    margin: profit,
    favorite: false,
    source: "oddspedia",
    sourceUrl: canonicalHref,
  };
}

export async function getFeedTestOpportunities(): Promise<OddspediaSurebet[]> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1200 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
    });

    await page.goto("https://oddspedia.com/surebets", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const cards = await page.evaluate((): RawCard[] => {
      const profitNodes = Array.from(document.querySelectorAll<HTMLElement>("body *")).filter((el) =>
        /GUARANTEED\s+PROFIT/i.test(el.innerText || "")
      );

      const result: RawCard[] = [];

      for (const node of profitNodes) {
        let card: HTMLElement | null = node;

        // Find the smallest rendered container that still contains the full surebet.
        for (let depth = 0; depth < 7 && card?.parentElement; depth++) {
          const text = (card.innerText || "").trim();
          const anchors = Array.from(card.querySelectorAll<HTMLAnchorElement>("a[href]"));
          if (text.length >= 60 && text.length <= 3500 && anchors.length >= 1) {
            const numbers = text.match(/\b\d+(?:[.,]\d+)?\b/g) || [];
            if (numbers.length >= 2) break;
          }
          card = card.parentElement;
        }

        if (!card) continue;

        const text = (card.innerText || "").trim();
        if (text.length < 60 || text.length > 3500) continue;

        const anchors = Array.from(card.querySelectorAll<HTMLAnchorElement>("a[href]"))
          .map((a) => ({
            text: (a.innerText || "").trim(),
            href: (a.href || "").trim(),
          }))
          .filter((x) => x.href);

        const eventLink =
          anchors.find((x) => /\/football\/|\/basketball\/|\/tennis\/|\/hockey\/|\/baseball\//i.test(x.href)) ||
          anchors.find((x) => x.text && !/calculate|sure bet/i.test(x.text)) ||
          anchors[0];

        const images = Array.from(card.querySelectorAll<HTMLImageElement>("img"))
          .map((img) => img.alt || img.title || "")
          .map((x) => x.trim())
          .filter(Boolean);

        const raw: RawCard = {
          text,
          href: eventLink?.href || "https://oddspedia.com/surebets",
          links: anchors.map((x) => x.href),
          images,
        };

        if (!result.some((x) => x.href === raw.href && x.text === raw.text)) {
          result.push(raw);
        }

        if (result.length >= 100) break;
      }

      return result;
    });

    return cards
      .map((card, index) => parseCard(card, index))
      .filter((item): item is OddspediaSurebet => Boolean(item));
  } finally {
    await browser.close();
  }
}
