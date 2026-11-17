"use client";

import { Headphones, ShieldCheck, Sparkles, Trophy, Zap, type LucideIcon } from "lucide-react";
import { SectionHeading, stagger } from "./desktop/effects";

type Benefit = { Icon: LucideIcon; title: string; text: string };

/** "Hvorfor BetTrackerAI?" points, shared by desktop and phone. */
export const BENEFITS: Benefit[] = [
  { Icon: Trophy, title: "Profitabel", text: "Find de bedste odds på tværs af 2000+ bookmakere – samlet ét sted." },
  { Icon: Zap, title: "Automatisk scanning", text: "AI'en tjekker 1,2 mio. odds i timen, så du kun ser de fund, der er værd at kigge på." },
  { Icon: ShieldCheck, title: "Sikker og pålidelig", text: "Ærlige tal og tydelige risici. Vi lover aldrig sikre gevinster." },
  { Icon: Headphones, title: "Dansk support", text: "Spørg løs i chatten – vi svarer altid på dansk." },
];

export const BENEFITS_HEADING = {
  eyebrow: "Hvorfor BetTrackerAI?",
  title: "Bygget til at finde fordelen",
  accent: "– ikke til at love guld.",
  text: "Den ultimative løsning til surebet betting: hurtig, overskuelig og ærlig.",
};

/** Desktop canvas version: heading row, then four cards. */
export function BenefitsSection() {
  return (
    <section className="reveal relative ml-[28px] mt-[80px] w-[969px]">
      <SectionHeading stack eyebrow={BENEFITS_HEADING.eyebrow} Icon={Sparkles} title={BENEFITS_HEADING.title} accent={BENEFITS_HEADING.accent} text={BENEFITS_HEADING.text} />
      <div className="reveal-stagger mt-[24px] grid grid-cols-4 gap-[14px]">
        {BENEFITS.map(({ Icon, title, text }, k) => (
          <div key={title} style={stagger(k)} className="benefit-card spotlight h-[172px] p-[20px]">
            <span className="absolute right-[18px] top-[16px] font-display text-[22px] font-bold leading-none tracking-[-0.04em] text-primary-glow/15">0{k + 1}</span>
            <span className="icon-tile flex h-[44px] w-[44px] items-center justify-center rounded-[13px]">
              <Icon className="h-[21px] w-[21px]" strokeWidth={2.2} />
            </span>
            <p className="mt-[20px] font-display text-[14px] font-semibold leading-[18px] tracking-[-0.02em]">{title}</p>
            <p className="mt-[7px] text-[10.5px] leading-[15.5px] text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
