'use client'

import type { OddspediaSurebet } from '@/lib/feedTestApi'

export function FeedTestOpportunityList({ initial }: { initial: OddspediaSurebet[] }) {
  return (
    <section className="px-4 pb-10">
      <div className="mb-4 rounded-[16px] border border-[#183252] bg-[#071426] px-3 py-2 text-xs text-[#a9b6d3]">
        Oddspedia feed · Guaranteed Profit vises direkte fra kilden · ingen egen surebet-beregning
      </div>
      <div className="grid gap-3">
        {initial.map((item) => (
          <article key={item.id} className="w-full rounded-[24px] border border-[#183252] bg-[linear-gradient(135deg,#071426_0%,#06101e_55%,#071a2a_100%)] p-3.5 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between gap-2 text-[13px] text-[#a9b6d3]">
              <span className="truncate">{item.league}</span><span>ODDSPEDIA</span>
            </div>
            <div className="mt-2 flex gap-2">
              {[item.a, item.b].map((leg, i) => (
                <div key={i} className="min-w-0 flex-1 rounded-[16px] border border-[#1a3557] bg-[#081123] p-3">
                  <p className="text-sm font-bold text-[#f3f6fc]">{i === 0 ? item.homeTeam : item.awayTeam}</p>
                  <p className="mt-1 text-xs text-[#8fa3cc]">{leg.bookmaker}</p>
                  <p className="mt-1 text-xl font-extrabold text-[#55a8ff]">{leg.odds.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between rounded-[16px] border border-[#23785f] bg-[radial-gradient(120%_120%_at_50%_0%,rgba(46,230,166,0.17),rgba(8,30,30,0.62))] px-3 py-2">
              <div><p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">Guaranteed Profit</p><p className="text-2xl font-extrabold text-emerald-300">{item.margin.toFixed(2)}%</p></div>
              <span className="rounded-full border border-[#1a3557] bg-[#0a1426] px-2 py-1 text-[11px] text-[#d5ddef]">{item.market}</span>
            </div>
          </article>
        ))}
        {initial.length === 0 && <div className="rounded-[20px] border border-[#183252] bg-[#071426] p-5 text-center text-sm text-[#a9b6d3]">Ingen aktuelle Sure Bets fundet fra Oddspedia.</div>}
      </div>
    </section>
  )
}
