'use client';

import { useState } from 'react';

// 1. Beregningsmotor indlejret direkte
interface OddMarket {
  bookmaker: string;
  selection: string;
  odds: number;
}

interface SureBetOpportunity {
  matchName: string;
  marketType: string;
  outcomes: {
    bookmaker: string;
    selection: string;
    odds: number;
    stakePercentage: number;
    recommendedStake: number;
  }[];
  profitMargin: number;
}

function calculateSureBet(
  matchName: string,
  marketType: string,
  selections: OddMarket[],
  totalBudget: number = 1000
): SureBetOpportunity | null {
  if (!selections || selections.length < 2) return null;

  const totalImpliedProbability = selections.reduce(
    (acc, curr) => acc + (1 / curr.odds),
    0
  );

  const profitMargin = (1 - totalImpliedProbability) * 100;

  if (profitMargin > 0) {
    const outcomes = selections.map((sel) => {
      const implied = 1 / sel.odds;
      const stakePercentage = (implied / totalImpliedProbability) * 100;
      const recommendedStake = (stakePercentage / 100) * totalBudget;

      return {
        bookmaker: sel.bookmaker,
        selection: sel.selection,
        odds: sel.odds,
        stakePercentage: Number(stakePercentage.toFixed(2)),
        recommendedStake: Number(recommendedStake.toFixed(2)),
      };
    });

    return {
      matchName,
      marketType,
      outcomes,
      profitMargin: Number(profitMargin.toFixed(2)),
    };
  }

  return null;
}

// 2. Godkendte danske bookmakere
const ALLOWED_BOOKMAKERS = [
  "bet25.dk", "derby25.dk", "roed25.dk", "rød25.dk", "888.dk", 
  "888casino.dk", "888poker.dk", "888sport.dk", "betmaster.dk", 
  "betfair.com", "betfair.dk", "danskespil.dk", "nordicbet.dk", 
  "betsson.dk", "betsafe.dk", "unibet.dk", "bet365.dk", "leovegas.dk", 
  "comeon.com", "bwin.dk", "cashpoint.dk", "tipwin.dk", "betano.dk", 
  "betinia.dk", "getlucky.com", "merkurbets.dk", "campobet.dk", 
  "betoro.dk", "stake.dk", "mrvegas.dk", "vulkanbet.dk"
];

// 3. UI Komponent & Scanner-logik
export default function CompleteSureBetScanner() {
  const [results, setResults] = useState<SureBetOpportunity[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(1000);

  const runScanner = () => {
    setLoading(true);

    // Simuleret live-feed fra dine bookmakere
    const mockMatches = [
      {
        matchName: "FC København - Brøndby IF",
        marketType: "1X2",
        selections: [
          { bookmaker: "bet365.dk", selection: "1", odds: 2.10 },
          { bookmaker: "unibet.dk", selection: "X", odds: 3.50 },
          { bookmaker: "danskespil.dk", selection: "2", odds: 3.70 },
          { bookmaker: "betano.dk", selection: "2", odds: 4.15 } // Surebet her
        ]
      },
      {
        matchName: "AaB - FC Midtjylland",
        marketType: "1X2",
        selections: [
          { bookmaker: "bwin.dk", selection: "1", odds: 2.80 },
          { bookmaker: "nordicbet.dk", selection: "X", odds: 3.30 },
          { bookmaker: "betfair.dk", selection: "2", odds: 2.50 }
        ]
      }
    ];

    setTimeout(() => {
      const opportunities: SureBetOpportunity[] = [];

      for (const match of mockMatches) {
        const validSelections = match.selections.filter((s) =>
          ALLOWED_BOOKMAKERS.includes(s.bookmaker.toLowerCase())
        );

        const bestOddsMap = new Map<string, OddMarket>();

        for (const odd of validSelections) {
          const existing = bestOddsMap.get(odd.selection);
          if (!existing || odd.odds > existing.odds) {
            bestOddsMap.set(odd.selection, {
              bookmaker: odd.bookmaker,
              selection: odd.selection,
              odds: odd.odds,
            });
          }
        }

        const bestSelections = Array.from(bestOddsMap.values());
        const sureBet = calculateSureBet(match.matchName, match.marketType, bestSelections, budget);

        if (sureBet) {
          opportunities.push(sureBet);
        }
      }

      setResults(opportunities);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-slate-950 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-2 text-emerald-400">SikkerBets SureBet Scanner</h1>
      <p className="text-slate-400 mb-6">Scanner markedet på tværs af godkendte danske bookmakere.</p>

      <div className="flex gap-4 items-center mb-6">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Samlet Budget (kr.)</label>
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 px-3 py-2 rounded text-white w-36"
          />
        </div>
        <button
          onClick={runScanner}
          disabled={loading}
          className="mt-5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold transition disabled:opacity-50"
        >
          {loading ? "Scanner..." : "Kør Scanning"}
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-2">
            Fundne SureBets ({results.length}):
          </h2>

          {results.length === 0 ? (
            <p className="text-slate-400">Ingen surebets fundet i denne kørsel.</p>
          ) : (
            results.map((opp, idx) => (
              <div key={idx} className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded">
                    {opp.marketType}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-sm font-bold px-3 py-1 rounded-full">
                    +{opp.profitMargin}% Garanteret Profit
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-4">{opp.matchName}</h3>

                <div className="grid gap-3 md:grid-cols-3">
                  {opp.outcomes.map((out, oIdx) => (
                    <div key={oIdx} className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                      <div className="text-sm font-semibold text-emerald-300">{out.bookmaker}</div>
                      <div className="text-xs text-slate-400 mb-2">Udfald: {out.selection}</div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold">Odds {out.odds}</span>
                        <span className="text-xs text-emerald-400 font-semibold">{out.recommendedStake} kr.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
