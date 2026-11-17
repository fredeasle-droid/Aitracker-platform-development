"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BellRing, Building2, ChevronRight, CreditCard, Gift, Headphones, MessageCircleQuestion, ShieldCheck, Target, UserCheck,
  type LucideIcon,
} from "lucide-react";
import { PRICING } from "./data";
import { FAQ_ENTRIES } from "./faq-data";
import { SupportChat, useSupportChat } from "./SupportChat";

const ICONS: LucideIcon[] = [Target, ShieldCheck, Gift, CreditCard, Building2, BellRing, UserCheck];

export const FAQ = FAQ_ENTRIES.map((e, k) => ({ ...e, Icon: ICONS[k] ?? MessageCircleQuestion }));

/** All questions and answers as structured data, so search engines see every answer. */
const FAQ_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

const num = (k: number) => String(k + 1).padStart(2, "0");

function Eyebrow({ phone = false }: { phone?: boolean }) {
  return (
    <span className={`flex w-fit items-center gap-[6px] rounded-full font-semibold ${phone ? "h-7 border border-primary/50 bg-primary/10 px-3 text-[11.5px] text-primary-glow" : "eyebrow-chip h-[24px] px-[11px] text-[9.5px] uppercase tracking-[0.16em]"}`}>
      <MessageCircleQuestion className={phone ? "h-3.5 w-3.5" : "h-[12px] w-[12px]"} />
      Ofte stillede spørgsmål
    </span>
  );
}

function SupportHeader({ phone = false }: { phone?: boolean }) {
  return (
    <header className={`flex items-center gap-[9px] border-b border-border/70 ${phone ? "px-3.5 py-2.5" : "px-[14px] py-[8px]"}`}>
      <span className={`btn-glow relative flex shrink-0 items-center justify-center rounded-full ${phone ? "h-8 w-8" : "h-[26px] w-[26px]"}`}>
        <Headphones className={phone ? "h-4 w-4" : "h-[12px] w-[12px]"} />
        <span className="online-dot absolute -bottom-px -right-px h-[7px] w-[7px] rounded-full" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`font-semibold ${phone ? "text-[13.5px] leading-[17px]" : "text-[11.5px] leading-[15px]"}`}>BetTrackerAI Support</p>
        <p className={`truncate text-foreground/60 ${phone ? "text-[11px]" : "text-[9.5px] leading-[13px]"}`}>
          <span className="text-success">Online</span> · skriv dit spørgsmål
        </p>
      </div>
    </header>
  );
}

function TrialLink({ phone = false }: { phone?: boolean }) {
  return (
    <p className={`text-foreground/65 ${phone ? "text-[12px]" : "text-[10.5px] leading-[14px]"}`}>
      Stadig i tvivl?{" "}
      <Link href="/konto" className="inline-flex items-center gap-[4px] font-semibold text-primary-glow hover:underline">
        Prøv gratis i {PRICING.trialDays} dage <ArrowRight className={phone ? "h-3.5 w-3.5" : "h-[11px] w-[11px]"} />
      </Link>
    </p>
  );
}

/** Desktop canvas section (inside .mock-frame): compact question list on the left, live support chat on the right. */
export function FaqSection() {
  const chat = useSupportChat();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="faq" className="reveal panel faq-panel relative ml-[28px] mt-[80px] w-[969px] scroll-mt-[80px] overflow-hidden rounded-[22px] px-[30px] py-[22px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }} />

      <div className="flex items-end justify-between gap-[24px]">
        <div>
          <Eyebrow />
          <h2 className="mt-[10px] text-[25px] font-bold leading-[30px]">
            Spørg løs – <span className="text-gradient-brand">vi svarer på dansk.</span>
          </h2>
        </div>
        <p className="max-w-[300px] pb-[3px] text-right text-[11px] leading-[16px] text-foreground/70">
          Vælg et spørgsmål eller skriv i chatten.
        </p>
      </div>

      <div className="mt-[14px] grid grid-cols-[1fr_440px] gap-[18px]">
        <div className="flex flex-col">
          <ul className="grid gap-[4px]">
            {FAQ.map(({ q }, k) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(k);
                    chat.askPreset(k);
                  }}
                  aria-controls="faq-chat"
                  data-active={k === active}
                  className="faq-q group flex h-[28px] w-full items-center gap-[10px] rounded-[9px] px-[12px] text-left text-[11.5px] font-semibold leading-[15px]"
                >
                  <span className="faq-num w-[18px] shrink-0 text-[10px] font-bold tabular-nums">{num(k)}</span>
                  <span className="flex-1 truncate">{q}</span>
                  <ChevronRight className="faq-arrow h-[12px] w-[12px] shrink-0" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-[10px]">
            <TrialLink />
          </div>
        </div>

        <div id="faq-chat" className="faq-chat relative flex h-[244px] flex-col overflow-hidden rounded-[14px]">
          <SupportHeader />
          <SupportChat chat={chat} />
        </div>
      </div>
    </section>
  );
}

/** Phone layout section: one chat box, with the common questions as swipeable buttons above the typing box. */
export function MobileFaq() {
  const chat = useSupportChat();
  return (
    <section id="faq-mobile" className="panel faq-panel relative scroll-mt-6 overflow-hidden rounded-[18px] p-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }} />
      <Eyebrow phone />
      <h2 className="mt-3 text-[24px] font-bold leading-[28px] tracking-[-0.3px]">
        Spørg løs – <span className="text-gradient-brand">vi svarer på dansk.</span>
      </h2>
      <p className="mt-1.5 text-[12.5px] leading-[19px] text-foreground/75">Tryk på et spørgsmål eller skriv dit eget.</p>
      <div className="faq-chat mt-4 flex h-[440px] flex-col overflow-hidden rounded-[14px]">
        <SupportHeader phone />
        <SupportChat chat={chat} phone suggestions />
      </div>
      <div className="mt-3 text-center">
        <TrialLink phone />
      </div>
    </section>
  );
}
