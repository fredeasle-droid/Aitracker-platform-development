import { GameEvent, MarketOdds, OddOutcome, SurebetOpportunity, SurebetLeg } from "@/types/surebet";

type State = string;
type Coverage = Set<State>;

interface Candidate { outcome: OddOutcome; coverage: Coverage; }
interface Group { key: string; market: MarketOdds; candidates: Candidate[]; states: State[]; }

const MAX_COMBINATION_LEGS = 12;
const norm = (v: unknown) => String(v ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

function numeric(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v !== "string") return null;
  const m = v.replace(",", ".").match(/[-+]?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function unique(values: string[]): string[] { return [...new Set(values.filter(Boolean))]; }

function splitSelection(name: string): string[] {
  return unique(name.replace(/[|/,;]+/g, " ").replace(/\s+or\s+/gi, " ").replace(/\s*\+\s*/g, " ")
    .split(/\s+/).map(norm));
}

function outcomeStates(market: MarketOdds): State[] {
  if (market.atomicStates?.length) return unique(market.atomicStates.map(norm));
  const names = unique((market.outcomes ?? []).map(o => norm(o.name)));
  if (names.length < 2) return [];

  // When the feed only gives ordinary mutually-exclusive outcomes, their names
  // themselves are the atomic state space. Composite selections are resolved
  // against that space below.
  const hasComposite = names.some(n =>
    /^(1x|x1|x2|2x|12|yes\s*\+\s*no|over\s*\+\s*under)$/i.test(n));
  return hasComposite ? [] : names;
}

function coverageForOutcome(outcome: OddOutcome, states: State[]): Coverage | null {
  const raw = norm(outcome.name);
  if (!raw) return null;

  if (states.includes(raw)) return new Set([raw]);

  const covered = new Set<State>();
  for (const state of states) {
    const s = norm(state);
    if (splitSelection(raw).includes(s)) covered.add(state);
  }
  if (covered.size) return covered;

  // Composite 1X/X2/12 notation.
  if (states.includes("1") || states.includes("x") || states.includes("2")) {
    const has1 = /(^|[^a-z0-9])1([^a-z0-9]|$)/.test(raw);
    const hasX = /(^|[^a-z0-9])x([^a-z0-9]|$)/.test(raw);
    const has2 = /(^|[^a-z0-9])2([^a-z0-9]|$)/.test(raw);
    if (has1 && states.includes("1")) covered.add("1");
    if (hasX && states.includes("x")) covered.add("x");
    if (has2 && states.includes("2")) covered.add("2");
    if (covered.size) return covered;
  }

  if (states.includes("yes") || states.includes("no")) {
    if (/^(yes|y|ja|true)$/i.test(raw) && states.includes("yes")) return new Set(["yes"]);
    if (/^(no|n|nej|false)$/i.test(raw) && states.includes("no")) return new Set(["no"]);
  }

  return null;
}

function compatibleKey(market: MarketOdds): string {
  return [
    norm(market.marketId), norm(market.marketType), norm(market.marketName),
    norm(market.period), numeric(market.line ?? market.handicap ?? market.point) ?? ""
  ].join("|");
}

function bestBySelection(outcomes: OddOutcome[]): OddOutcome[] {
  const best = new Map<string, OddOutcome>();
  for (const o of outcomes) {
    if (!o.name || !Number.isFinite(o.price) || o.price <= 1) continue;
    const key = norm(o.name);
    const previous = best.get(key);
    if (!previous || o.price > previous.price) best.set(key, o);
  }
  return [...best.values()];
}

function buildGroup(market: MarketOdds): Group | null {
  const states = outcomeStates(market);
  if (states.length < 2) return null;

  const candidates: Candidate[] = [];
  for (const outcome of bestBySelection(market.outcomes ?? [])) {
    const coverage = coverageForOutcome(outcome, states);
    if (coverage && coverage.size) candidates.push({ outcome, coverage });
  }
  if (candidates.length < 2) return null;
  return { key: compatibleKey(market), market, candidates, states };
}

function searchCover(group: Group): Candidate[][] {
  const candidates = group.candidates
    .filter(c => c.coverage.size)
    .sort((a, b) => b.coverage.size - a.coverage.size || b.outcome.price - a.outcome.price);
  const full = new Set(group.states);
  const solutions: Candidate[][] = [];

  function dfs(start: number, covered: Set<State>, chosen: Candidate[]) {
    if (covered.size === full.size) { solutions.push([...chosen]); return; }
    if (chosen.length >= MAX_COMBINATION_LEGS) return;

    for (let i = start; i < candidates.length; i++) {
      const c = candidates[i];
      if (chosen.some(x => norm(x.outcome.name) === norm(c.outcome.name))) continue;
      const next = new Set(covered);
      for (const s of c.coverage) next.add(s);
      if (next.size === covered.size) continue;
      chosen.push(c);
      dfs(i + 1, next, chosen);
      chosen.pop();
    }
  }

  dfs(0, new Set<State>(), []);
  return solutions;
}

function calculate(group: Group, solution: Candidate[], bankroll: number): SurebetOpportunity | null {
  const inverseSum = solution.reduce((sum, c) => sum + 1 / c.outcome.price, 0);
  if (!(inverseSum > 0 && inverseSum < 1)) return null;

  const guaranteedReturn = bankroll / inverseSum;
  const profitPercentage = (1 / inverseSum - 1) * 100;

  const legs: SurebetLeg[] = solution.map(c => {
    const stake = bankroll * (1 / c.outcome.price) / inverseSum;
    return {
      selection: c.outcome.name,
      bookmaker: c.outcome.bookmakerName || c.outcome.bookmakerId || "Ukendt Bookmaker",
      odds: c.outcome.price,
      stake: round(stake),
      returnAmount: round(stake * c.outcome.price)
    };
  });

  const totalInvestment = round(legs.reduce((s, l) => s + l.stake, 0));
  return {
    id: group.market.marketId || group.market.marketName,
    sport: "", match: "", league: "", commenceTime: "",
    market: group.market.marketName,
    profitPercentage: round(profitPercentage),
    legs, totalInvestment, guaranteedReturn: round(guaranteedReturn)
  };
}

export function scanForSurebets(events: GameEvent[], totalBankroll = 1000): SurebetOpportunity[] {
  const results: SurebetOpportunity[] = [];

  for (const event of events ?? []) {
    const groups = new Map<string, Group>();

    for (const market of event.markets ?? []) {
      const group = buildGroup(market);
      if (!group) continue;

      const existing = groups.get(group.key);
      if (!existing) {
        groups.set(group.key, group);
      } else {
        existing.candidates.push(...group.candidates);
        const merged = bestBySelection(existing.candidates.map(c => c.outcome));
        existing.candidates = merged.map(o => ({
          outcome: o,
          coverage: coverageForOutcome(o, existing.states) || new Set<State>()
        })).filter(c => c.coverage.size);
      }
    }

    for (const group of groups.values()) {
      for (const solution of searchCover(group)) {
        const opportunity = calculate(group, solution, totalBankroll);
        if (!opportunity) continue;
        opportunity.id = `${event.id}-${group.key}-${solution.map(x => norm(x.outcome.name)).sort().join("-")}`;
        opportunity.sport = event.sport || "Generelt";
        opportunity.match = `${event.homeTeam} vs ${event.awayTeam}`;
        opportunity.league = event.league || "Ukendt Liga";
        opportunity.commenceTime = event.commenceTime;
        results.push(opportunity);
      }
    }
  }

  const dedup = new Map<string, SurebetOpportunity>();
  for (const r of results) {
    const key = `${r.match}|${r.market}|${r.legs.map(l => `${norm(l.selection)}@${l.bookmaker}`).sort().join(",")}`;
    const old = dedup.get(key);
    if (!old || r.profitPercentage > old.profitPercentage) dedup.set(key, r);
  }
  return [...dedup.values()].sort((a, b) => b.profitPercentage - a.profitPercentage);
}
