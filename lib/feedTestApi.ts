import { GameEvent, MarketOdds, OddOutcome } from "@/types/surebet";
import { scanForSurebets } from "@/lib/surebetEngine";

const API_KEY = process.env.SPORTS_GAME_ODDS_API_KEY || "";
const BASE_URL = "https://api.sportsgameodds.com/v2";

export async function fetchFootballFeed() {
  try {
    const leaguesResponse = await fetch(`${BASE_URL}/leagues?apiKey=${API_KEY}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!leaguesResponse.ok) {
      throw new Error(`Fejl ved hentning af liga-oversigt: ${leaguesResponse.statusText}`);
    }

    const leaguesJson = await leaguesResponse.json();
    const leaguesArray = leaguesJson.leagues || leaguesJson.data || leaguesJson;

    if (!Array.isArray(leaguesArray)) return null;

    const soccerLeagueIDs = leaguesArray
      .filter((l: any) => {
        const sportName = String(l.sport || l.sportName || "").toLowerCase();
        return sportName.includes("soccer") || sportName.includes("football");
      })
      .map((l: any) => l.leagueID || l.id)
      .filter(Boolean);

    if (!soccerLeagueIDs.length) return null;

    const eventsUrl =
      `${BASE_URL}/events?leagueID=${soccerLeagueIDs.join(",")}&oddsAvailable=true&apiKey=${API_KEY}`;

    const eventsResponse = await fetch(eventsUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!eventsResponse.ok) {
      throw new Error(`Fejl ved hentning af events: ${eventsResponse.statusText}`);
    }

    return await eventsResponse.json();
  } catch (error) {
    console.error("Fejl i fetchFootballFeed:", error);
    return null;
  }
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function normalizeOutcome(raw: any): OddOutcome | null {
  const price = asNumber(raw?.price ?? raw?.odds ?? raw?.decimalOdds ?? raw?.decimal);
  const name = raw?.name ?? raw?.outcome ?? raw?.label ?? raw?.selection ?? raw?.title;
  if (!name || price === null || price <= 1) return null;

  return {
    bookmakerId: String(raw?.bookmakerId ?? raw?.bookmakerID ?? raw?.bookmaker?.id ?? raw?.sportsbookId ?? ""),
    bookmakerName: String(raw?.bookmakerName ?? raw?.bookmaker?.name ?? raw?.bookmaker ?? "Ukendt Bookmaker"),
    price,
    name: String(name),
    id: raw?.id ?? raw?.outcomeId,
    selectionId: raw?.selectionId,
    line: raw?.line ?? raw?.handicap ?? raw?.point ?? null,
    handicap: raw?.handicap ?? null,
    point: raw?.point ?? null,
    marketId: raw?.marketId,
    marketType: raw?.marketType,
    period: raw?.period ?? raw?.segment,
    team: raw?.team,
    player: raw?.player,
    raw,
  };
}

function normalizeMarket(raw: any, fallbackName = "Ukendt marked"): MarketOdds[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.flatMap(item => normalizeMarket(item, fallbackName));
  }

  const marketName = String(
    raw?.marketName ?? raw?.name ?? raw?.market?.name ?? raw?.title ?? fallbackName
  );

  const sourceOutcomes =
    raw?.outcomes ??
    raw?.selections ??
    raw?.results ??
    raw?.prices ??
    raw?.odds ??
    [];

  if (Array.isArray(sourceOutcomes)) {
    const outcomes = sourceOutcomes.map(normalizeOutcome).filter(Boolean) as OddOutcome[];
    if (outcomes.length >= 2) {
      return [{
        marketName,
        marketId: raw?.marketId ?? raw?.market?.id,
        marketType: raw?.marketType ?? raw?.market?.type,
        period: raw?.period ?? raw?.segment,
        line: raw?.line ?? raw?.handicap ?? raw?.point ?? null,
        outcomes,
        atomicStates: Array.isArray(raw?.atomicStates) ? raw.atomicStates.map(String) : undefined,
      }];
    }
  }

  // Some feeds expose markets as an object keyed by market name.
  if (raw && typeof raw === "object") {
    const nested: MarketOdds[] = [];
    for (const [key, value] of Object.entries(raw)) {
      if (["name", "marketName", "id", "marketId", "type"].includes(key)) continue;
      if (value && typeof value === "object") {
        nested.push(...normalizeMarket(value, key));
      }
    }
    return nested;
  }

  return [];
}

function normalizeEvents(payload: any): GameEvent[] {
  const rawEvents = payload?.events ?? payload?.data ?? payload;
  if (!Array.isArray(rawEvents)) return [];

  return rawEvents.map((ev: any, index: number) => {
    const rawMarkets = ev?.markets ?? ev?.oddsMarkets ?? ev?.odds ?? ev?.bookmakers ?? [];
    const markets = normalizeMarket(rawMarkets);

    return {
      id: String(ev?.id ?? ev?.eventID ?? ev?.eventId ?? index),
      homeTeam: String(ev?.homeTeam ?? ev?.home_team ?? ev?.homeParticipant ?? ev?.participants?.home ?? "Hjemmehold"),
      awayTeam: String(ev?.awayTeam ?? ev?.away_team ?? ev?.awayParticipant ?? ev?.participants?.away ?? "Udehold"),
      commenceTime: String(ev?.commenceTime ?? ev?.commence_time ?? ev?.startDate ?? ev?.startTime ?? new Date().toISOString()),
      league: String(ev?.leagueName ?? ev?.league?.name ?? ev?.league ?? "Diverse"),
      sport: String(ev?.sportName ?? ev?.sport?.name ?? ev?.sport ?? "Sport"),
      markets,
      raw: ev,
    };
  });
}

/**
 * Backwards-compatible entry point used by the existing Feed Test UI.
 * It now uses the new football feed and the generic all-market engine.
 */
export async function getFeedTestOpportunities(bankroll = 1000) {
  const payload = await fetchFootballFeed();
  if (!payload) return [];

  const events = normalizeEvents(payload);
  console.log(`Feed: ${events.length} events, ${events.reduce((n, e) => n + e.markets.length, 0)} markets`);

  return scanForSurebets(events, bankroll);
}
