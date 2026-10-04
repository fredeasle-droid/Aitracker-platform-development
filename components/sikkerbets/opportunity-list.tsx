"use client";

import React, { useState } from "react";
import { SurebetOpportunity } from "@/types/surebet";

interface OpportunityListProps {
  initial: SurebetOpportunity[];
}

export function OpportunityList({ initial }: OpportunityListProps) {
  const [opportunities] = useState<SurebetOpportunity[]>(initial);
  const [selectedSport, setSelectedSport] = useState<string>("ALL");
  const sports = Array.from(new Set(opportunities.map((o) => o.sport))).filter(Boolean);
  const filteredOpportunities = selectedSport === "ALL"
    ? opportunities
    : opportunities.filter((o) => o.sport.toLowerCase() === selectedSport.toLowerCase());

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-24 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl">
        <p className="text-zinc-300 font-semibold text-lg">Ingen surebets fundet i øjeblikket</p>
        <p className="text-zinc-500 text-sm mt-1 max-w-md mx-auto">
          Scanneren gennemsøger alle sportsgrene, markeder og bookmakere via SportsGameOdds, men der er p.t. ikke aktive surebets.
        </p>
      </div>
    );
  }

  return (
    <div>
      {sports.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <button onClick={() => setSelectedSport("ALL")} className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${selectedSport === "ALL" ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/10" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"}`}>
            Alle Sportsgrene ({opportunities.length})
          </button>
          {sports.map((sport) => (
            <button key={sport} onClick={() => setSelectedSport(sport)} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${selectedSport === sport ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/10" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"}`}>
              {sport}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-4">
        {filteredOpportunities.map((bet) => (
          <div key={bet.id} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl transition hover:border-zinc-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-zinc-800/80">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-md">{bet.sport}</span>
                  <span className="text-[11px] font-medium text-zinc-400">{bet.league}</span>
                  <span className="text-[11px] text-zinc-600">•</span>
                  <span className="text-[11px] text-zinc-400 uppercase font-mono">Marked: {bet.market}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{bet.match}</h2>
              </div>
              <div className="flex items-center gap-3 self-end md:self-auto">
                <div className="bg-emerald-950/60 border border-emerald-900/50 px-4 py-2 rounded-xl text-right">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">Garanteret Profit</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">+{bet.profitPercentage}%</span>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Optimal Indsatsfordeling (Samlet udbetaling: ~{bet.guaranteedReturn} kr)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {bet.legs.map((leg, idx) => (
                  <div key={idx} className="bg-zinc-950/70 border border-zinc-800/60 p-3.5 rounded-xl flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm text-zinc-200 truncate pr-2">{leg.selection}</span>
                      <span className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono shrink-0">{leg.bookmaker}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-zinc-900">
                      <div><span className="text-[10px] text-zinc-500 block uppercase">Odds</span><span className="text-base font-bold font-mono text-emerald-400">{leg.odds.toFixed(2)}</span></div>
                      <div className="text-right"><span className="text-[10px] text-zinc-500 block uppercase">Placer Beløb</span><span className="text-base font-bold font-mono text-white">{leg.stake} kr</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
