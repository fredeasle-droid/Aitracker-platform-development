"use client";

import { useLocale } from "@/components/locale-provider";
import { useState } from "react";
import { ArrowRight, CalendarCheck, Mic } from "lucide-react";
import { useInView } from "@/lib/use-in-view";
import { CHALLENGE } from "./data";
import { Swoosh } from "./Swoosh";
import { ResultsStrip } from "./ResultsStrip";
import { ChallengeCalendarDialog } from "./ChallengeCalendarDialog";

export function ChallengeSection() {
  const { tx } = useLocale();
  const [ref, inView] = useInView<HTMLElement>(0.25);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const pct = (CHALLENGE.day / CHALLENGE.totalDays) * 100;

  return (
    <section ref={ref} className="reveal panel challenge-panel spotlight group/zoom relative ml-[28px] mt-[80px] h-[366px] w-[969px] overflow-hidden rounded-[22px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/home/challenge-studio.webp"
        alt={tx("Værten optager BetTrackerAI's 365 dages challenge i studiet")}
        loading="lazy"
        width={1600}
        height={900}
        className="photo-fade-left zoom-photo pointer-events-none absolute right-0 top-0 h-[270px] w-[620px] origin-[70%_30%] object-cover object-[60%_25%]"
      />

      <span className="eyebrow-chip absolute left-[32px] top-[22px] flex h-[24px] items-center gap-[6px] rounded-full px-[11px] text-[9.5px] font-semibold uppercase tracking-[0.16em]">
        <Mic className="h-[12px] w-[12px]" strokeWidth={2.3} aria-hidden="true" />
        {tx("Ny serie · Følg med hver dag")}</span>
      <h2 className="absolute left-[32px] top-[54px] text-[21px] font-semibold leading-[27px] text-foreground/80">
        {tx("Vi tager jer med")}<br />
        {tx("hele vejen.")}</h2>

      <span className="btn-glow absolute left-[32px] top-[116px] flex h-[58px] w-[58px] items-center justify-center rounded-[16px]">
        <CalendarCheck className="h-[30px] w-[30px]" strokeWidth={2.1} aria-hidden="true" />
      </span>
      <p className="absolute left-[102px] top-[110px] font-display text-[66px] font-extrabold leading-[70px] tracking-[-0.05em] text-glow">365</p>
      <p className="absolute left-[250px] top-[116px] -skew-x-6 text-[23px] font-black italic leading-[25px] tracking-[0.5px]">
        <span className="text-primary-glow">{tx("DAGES")}</span>
        <br />
        {tx("CHALLENGE")}</p>
      <Swoosh className="absolute left-[248px] top-[168px] h-[10px] w-[128px]" />

      <p className="absolute left-[32px] top-[186px] w-[340px] text-[12.5px] leading-[18px] text-foreground/85">
        {tx("Følg vores")}{" "}<span className="font-semibold text-primary-glow">{tx("365 dages")}</span> {" "}{tx("rejse med surebetting, resultater og ærlig feedback.")}</p>
      <button type="button" onClick={() => setCalendarOpen(true)} aria-haspopup="dialog" className="btn-glow group absolute left-[32px] top-[228px] flex h-[36px] items-center gap-[8px] rounded-full px-[20px] text-[12.5px] font-semibold">
        {tx("Følg rejsen")}{" "}<ArrowRight className="h-[13px] w-[13px] transition-transform duration-300 group-hover:translate-x-[3px]" aria-hidden="true" />
      </button>

      <div className="sms-card float-y absolute right-[22px] top-[170px] w-[214px] rounded-[14px] p-[12px]">
        <div className="flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-[6px] font-semibold">
            <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
            {tx("Rejsen lige nu")}</span>
        </div>
        <p className="mt-[7px] text-[17px] font-bold leading-[20px]">
          {tx("Dag")}{" "}{tx(CHALLENGE.day)} <span className="text-[11px] font-medium text-muted-foreground">{tx("af")}{" "}{tx(CHALLENGE.totalDays)}</span>
        </p>
        <div className="mt-[8px] h-[5px] overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-[0_0_8px_var(--primary-glow)] transition-[width] duration-[1600ms] ease-out"
            style={{ width: inView ? `${pct}%` : 0 }}
          />
        </div>
      </div>
      <ResultsStrip inView={inView} />
      <ChallengeCalendarDialog open={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </section>
  );
}
