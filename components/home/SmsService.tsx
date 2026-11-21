"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BellRing, Check, MessageSquareText } from "lucide-react";
import { LogoMark } from "./icons";
import { danishLockDate } from "./data";
import { useHomeData } from "./home-data";

export const POINTS = ["Vælg dine kriterier", "Få besked på SMS", "Spar tid og spil smartere"];

export function SmsService() {
  // A new SMS "arrives" on the phone every 5s, cycling through this week's finds.
  const { finds } = useHomeData();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (finds.length < 2) return;
    const t = setInterval(() => setK((i) => (i + 1) % finds.length), 5000);
    return () => clearInterval(t);
  }, [finds.length]);
  const f = finds[k] ?? finds[0];
  // Today's date on the lock screen, set after mount so server and browser render the same first frame.
  const [lockDate, setLockDate] = useState("");
  useEffect(() => setLockDate(danishLockDate()), []);

  return (
    <div className="panel spotlight relative h-[268px] w-[477px] overflow-hidden rounded-[20px]">
      <div className="pointer-events-none absolute -right-[60px] -top-[40px] h-[260px] w-[260px] rounded-full bg-primary/25 blur-[60px]" />
      <MessageSquareText className="absolute left-[22px] top-[20px] h-[25px] w-[25px] text-primary-glow" strokeWidth={2} />
      <h3 className="absolute left-[56px] top-[21px] text-[17px] font-semibold leading-[22px]">SMS Service</h3>
      <span className="btn-glow absolute right-[18px] top-[16px] flex h-[34px] w-[34px] items-center justify-center rounded-full">
        <BellRing className="bell-ring h-[15px] w-[15px]" />
        <span className="absolute -right-[3px] -top-[3px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full border border-background bg-success px-[3px] text-[8.5px] font-bold text-background-deep">3</span>
      </span>

      <p className="absolute left-[22px] top-[60px] text-[16px] font-semibold leading-[21px] text-primary-glow">Få besked med det samme</p>
      <p className="absolute left-[22px] top-[88px] w-[250px] text-[12px] leading-[17px] text-foreground/85">
        Modtag automatiske SMS, når der kommer et surebet, der matcher dine indstillinger.
      </p>
      <ul className="absolute left-[22px] top-[134px] flex flex-col gap-[7px]">
        {POINTS.map((p) => (
          <li key={p} className="flex items-center gap-[9px] text-[12px] leading-[16px]">
            <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-success text-background-deep shadow-[0_0_8px_-1px_var(--success)]">
              <Check className="h-[10px] w-[10px]" strokeWidth={3.5} />
            </span>
            {p}
          </li>
        ))}
      </ul>
      <button className="btn-glow absolute left-[22px] top-[214px] flex h-[34px] items-center gap-[8px] rounded-full px-[18px] text-[12px] font-semibold">
        Aktivér SMS service <ArrowRight className="h-[13px] w-[13px]" />
      </button>

      {/* Phone */}
      <div className="phone-frame absolute left-[312px] top-[62px] h-[270px] w-[134px] rotate-[8deg] rounded-[26px] p-[6px]">
        <div className="relative h-full w-full overflow-hidden rounded-[21px] bg-background-deep">
          <span className="absolute left-1/2 top-[6px] h-[10px] w-[42px] -translate-x-1/2 rounded-full bg-background" />
          <p className="absolute inset-x-0 top-[30px] text-center text-[28px] font-light leading-[30px] text-foreground/90">21:00</p>
          <p className="absolute inset-x-0 top-[62px] text-center text-[8.5px] text-muted-foreground">{lockDate}</p>
          <div className="absolute inset-x-[10px] bottom-[18px] h-[3px] rounded-full bg-foreground/10" />
        </div>
      </div>

      {/* Incoming SMS, floating over the phone */}
      {f && <div key={k} className="sms-in sms-card absolute left-[262px] top-[150px] w-[176px] -rotate-[3deg] rounded-[14px] p-[10px]">
        <div className="flex items-center gap-[6px]">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-background-deep">
            <LogoMark className="h-[10px] w-[11px]" />
          </span>
          <span className="text-[10px] font-bold">BetTrackerAI</span>
          <span className="ml-auto text-[8.5px] text-muted-foreground">nu</span>
        </div>
        <p className="mt-[7px] text-[10.5px] font-semibold leading-[14px]">Nyt surebet fundet! 🔔</p>
        <p className="text-[10.5px] leading-[14px] text-foreground/85">
          {f.home.name} – {f.away.name}
        </p>
        <div className="mt-[6px] flex items-center justify-between">
          <span className="pill-success rounded-full px-[7px] py-[1px] text-[9.5px] font-bold">{f.margin.toFixed(2)}% margin</span>
          <span className="text-[9px] text-primary-glow underline">bettracker.dk</span>
        </div>
      </div>}
    </div>
  );
}
