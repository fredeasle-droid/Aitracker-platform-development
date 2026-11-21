"use client";

import { useState } from "react";
import { useInView } from "@/lib/use-in-view";
import Link from "next/link";
import { ArrowRight, Check, Crown } from "lucide-react";
const host = { url: "/home/pricing-host.webp" };
import { PRICING } from "./data";
import { useHomeData } from "./home-data";
import { Swoosh } from "./Swoosh";

const BARS = [18, 30, 26, 44, 52, 66, 84];

export function PricingSection() {
  const { plans } = useHomeData();
  const [selected, setSelected] = useState(plans[plans.length - 1]?.key ?? "");
  const plan = plans.find((p) => p.key === selected) ?? plans[0];
  const [ref, inView] = useInView<HTMLElement>(0.3);

  if (!plan) return null;
  return (
    <section ref={ref} className="reveal panel pricing-panel spotlight group/zoom relative ml-[28px] mt-[80px] h-[330px] w-[969px] overflow-hidden rounded-[22px]">
      <img
        src={host.url}
        alt="BetTrackerAI-værten foran platformen"
        loading="lazy"
        width={1600}
        height={893}
        className="photo-fade-right zoom-photo pointer-events-none absolute left-0 top-0 h-full w-[340px] origin-[40%_30%] object-cover object-[50%_20%]"
      />

      {/* Headline */}
      <div className="absolute left-[318px] top-[36px] w-[300px] text-center">
        <h2 className="text-[24px] font-bold leading-[30px]">
          Vi stoler så meget på vores system, at vi lader dig prøve det –
        </h2>
        <p className="relative mt-[4px] inline-block -skew-x-6 font-display text-[38px] font-extrabold italic leading-[44px] tracking-[-0.03em] text-primary-glow text-glow">
          helt gratis.
          <Swoosh className="absolute -bottom-[8px] left-[-8px] h-[10px] w-[calc(100%+16px)]" />
        </p>
      </div>

      <span className="absolute left-[640px] top-[30px] h-[180px] w-px bg-gradient-to-b from-transparent via-primary-glow/70 to-transparent" />

      {/* Price */}
      <div className="absolute left-[662px] top-[26px] flex items-center gap-[8px]">
        <Crown className="h-[24px] w-[24px] fill-gold text-gold" strokeWidth={1.6} />
        <h3 className="text-[18px] font-bold">Priser</h3>
      </div>
      <div role="radiogroup" aria-label="Vælg abonnement" className="absolute right-[22px] top-[24px] flex h-[30px] items-center rounded-full border border-primary/70 bg-background-deep/60 p-[2px] text-[11px] font-medium">
        {plans.map((p) => (
          <button key={p.key} role="radio" aria-checked={p.key === plan.key} onClick={() => setSelected(p.key)}
            className={`h-full rounded-full px-[12px] transition-colors ${p.key === plan.key ? "btn-glow" : "text-foreground/85 hover:text-primary-glow"}`}>{p.name}</button>
        ))}
      </div>

      <p className="absolute left-[662px] top-[76px] text-[12px] font-medium uppercase tracking-[1.6px] text-foreground/80">BetTrackerAI {plan.name}</p>
      <p className="absolute left-[658px] top-[92px] flex items-end gap-[8px]">
        <span key={plan.price} className="row-in font-display text-[84px] font-extrabold leading-[84px] tracking-[-0.06em]">{plan.price}</span>
        <span className="mb-[10px] text-[20px] font-bold">kr./md</span>
      </p>
      <p className="absolute left-[662px] top-[184px] w-[300px] text-[13px] text-muted-foreground">{plan.detail}</p>

      <div className="pointer-events-none absolute bottom-0 right-[22px] flex items-end gap-[7px]">
        {BARS.map((h, k) => (
          <span
            key={h}
            className="grow-bar w-[13px] rounded-t-[3px] bg-gradient-to-t from-primary/5 to-primary/70"
            style={{ height: h, transform: `scaleY(${inView ? 1 : 0})`, transitionDelay: `${k * 90}ms` }}
          />
        ))}
      </div>

      <Link href="/konto" className="btn-glow cta-breathe group absolute left-[338px] top-[234px] flex h-[48px] w-[440px] items-center justify-center gap-[12px] rounded-full text-[16px] font-bold">
        Start dine {PRICING.trialDays} gratis dage <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-[4px]" />
      </Link>
      <p className="absolute left-[338px] top-[294px] flex w-[440px] items-center justify-center gap-[16px] text-[10.5px] text-foreground/65">
        {["Intet kort påkrævet", `${PRICING.trialDays} dage gratis`, "Kun 18+ · Spil ansvarligt"].map((t) => (
          <span key={t} className="flex items-center gap-[5px]">
            <Check className="h-[11px] w-[11px] text-success" strokeWidth={3} />
            {t}
          </span>
        ))}
      </p>
    </section>
  );
}
