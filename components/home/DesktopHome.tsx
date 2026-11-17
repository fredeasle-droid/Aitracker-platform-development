"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, BellRing, Check, Play, Trophy } from "lucide-react";
import { LiveScanner, formatAge } from "./LiveScanner";
import { ProfitCalculator } from "./ProfitCalculator";
import { ExplainerVideo } from "./ExplainerVideo";
import { WeeklyCarousel } from "./WeeklyCarousel";
import { BookmakerScanner } from "./BookmakerScanner";
import { SmsService } from "./SmsService";
import { SocialFollow } from "./SocialFollow";
import { PricingSection } from "./PricingSection";
import { ReviewAvatar, Stars } from "./Reviews";
import { ReviewsShowcase } from "./desktop/ReviewsShowcase";
import { SectionHeading, Tilt, stagger, useSpotlight } from "./desktop/effects";
import { FaqSection } from "./Faq";
import { PRICING, REVIEWS } from "./data";
import { LiveTicker } from "./LiveTicker";
import { BenefitsSection } from "./Benefits";
import { Swoosh } from "./Swoosh";
import { useHomeData } from "./home-data";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function useScanAge() {
  const { rows } = useHomeData();
  const base = rows.length ? Math.min(...rows.map((r) => r.age)) : null;
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return base === null ? null : base + elapsed;
}

export function DesktopHome({ playExplainer, explainerRef }: { playExplainer: () => void; explainerRef: React.RefObject<HTMLVideoElement | null> }) {
  const spotRef = useSpotlight<HTMLDivElement>();
  const age = useScanAge();
  const { signedIn } = useHomeData();

  return (
    <div className="desktop-shell">
      <div className="desktop-aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="scroll-progress" aria-hidden="true" />
      <div ref={spotRef} className="mock-frame">
        <div className="hero-grid pointer-events-none absolute inset-x-0 top-0 h-[640px]" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home/hero-player.jpg"
          alt="Jublende fodboldspiller på stadion"
          width={1920}
          height={640}
          className="hero-photo hero-parallax pointer-events-none absolute left-[-74px] top-[-30px] h-[calc(100vh/var(--z,var(--zf,1)))] min-h-[432px] w-[1086px] max-w-none object-cover"
        />
        <div className="hero-scrim pointer-events-none absolute left-[-74px] top-[-30px] h-[calc(100vh/var(--z,var(--zf,1)))] min-h-[432px] w-[1086px]" />

        <section className="relative flex h-[calc(100vh/var(--z,var(--zf,1))-60px)] min-h-[440px] flex-col">
          <div className="relative flex flex-1 items-center justify-between pb-[10px] pl-[34px] pr-[34px]">
            <div className="flex w-[490px] flex-col items-start">
              <span className="glass-chip rise-in flex h-[28px] items-center gap-[8px] rounded-full pl-[10px] pr-[12px] text-[9.5px] font-semibold" style={delay(120)}>
                <span className="relative flex h-[8px] w-[8px]">
                  <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-70" />
                  <span className="relative h-[8px] w-[8px] rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
                </span>
                <span className="text-success">Live Surebet Scanner Aktiv</span>
                {age !== null && (
                  <>
                    <span className="h-[12px] w-px bg-border" />
                    <span className="font-normal tabular-nums text-muted-foreground">Seneste fund: {formatAge(age)} siden</span>
                  </>
                )}
              </span>
              <h1 className="mt-[16px] text-[50px] font-bold leading-[54px]">
                <span className="rise-in block" style={delay(200)}>
                  Find de bedste
                </span>
                <span className="rise-in block" style={delay(320)}>
                  surebets –{" "}
                  <span className="relative inline-block">
                    <span className="text-gradient-brand">i realtid</span>
                    <Swoosh className="absolute -bottom-[7px] left-0 h-[10px] w-full" />
                  </span>
                </span>
              </h1>
              <p className="rise-in mt-[20px] w-[350px] text-[14px] leading-[21px] text-foreground/80" style={delay(440)}>
                Lad vores AI finde de mest profitable muligheder på tværs af bookmakere – automatisk.
              </p>
              <div className="rise-in mt-[24px] flex items-center gap-[10px]" style={delay(560)}>
                <Link href={signedIn ? "/surebets" : "/konto"} className="btn-glow cta-breathe group flex h-[42px] items-center justify-center gap-[8px] rounded-full px-[22px] text-[13px] font-semibold">
                  {signedIn ? "Se dine surebets" : `Start dine ${PRICING.trialDays} gratis dage`}
                  <ArrowRight className="h-[14px] w-[14px] transition-transform duration-300 group-hover:translate-x-[3px]" aria-hidden="true" />
                </Link>
                <button type="button" onClick={playExplainer} className="btn-ghost-glass group flex h-[42px] items-center gap-[8px] rounded-full pl-[7px] pr-[16px] text-[12px] font-medium">
                  <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-foreground/10 transition-colors duration-300 group-hover:bg-primary">
                    <Play className="ml-[1px] h-[11px] w-[11px] fill-current" aria-hidden="true" />
                  </span>
                  Se hvordan det virker
                </button>
              </div>
              <div className="rise-in mt-[22px] flex items-center gap-[12px]" style={delay(680)}>
                <a href="#anmeldelser" className="group flex items-center gap-[12px]">
                  <span className="flex">
                    {REVIEWS.slice(0, 4).map((r, k) => (
                      <ReviewAvatar key={r.name} review={r} className={`h-[26px] w-[26px] text-[10px] ring-2 ring-background-deep transition-transform duration-300 group-hover:-translate-y-[2px] ${k > 0 ? "-ml-[8px]" : ""}`} />
                    ))}
                  </span>
                  <span className="leading-[13px]">
                    <span className="flex items-center gap-[6px]">
                      <Stars n={5} className="h-[10px] w-[10px]" />
                      <span className="text-[10.5px] font-semibold">5,0</span>
                    </span>
                    <span className="mt-[2px] block text-[9.5px] text-muted-foreground transition-colors group-hover:text-primary-glow">fra vores brugeres anmeldelser</span>
                  </span>
                </a>
                <span className="h-[24px] w-px bg-border" />
                <p className="text-[9.5px] leading-[13px] text-muted-foreground">
                  Intet kort påkrævet
                  <br />
                  Kun 18+ · Spil ansvarligt
                </p>
              </div>
            </div>
            <Tilt className="rise-in" max={7}>
              <div className="pointer-events-none absolute -inset-[40px] rounded-full bg-primary/25 blur-[50px]" aria-hidden="true" />
              <LiveScanner />
            </Tilt>
          </div>

          <LiveTicker className="rise-in relative mx-[28px] mb-[18px]" />
        </section>

        <section className="reveal relative mt-[48px]">
          <SectionHeading
            className="mx-[28px]"
            eyebrow="Top marginer"
            Icon={Trophy}
            title="Ugens bedste fund"
            text="De højeste marginer, scanneren har fundet. Hold musen over et kort for at sætte farten på pause."
          />
          <div className="weekly-strip fade-x-soft relative mt-[18px] h-[192px] overflow-hidden">
            <WeeklyCarousel />
          </div>
        </section>

        <section className="reveal panel explainer-panel spotlight group/zoom relative ml-[28px] mt-[56px] h-[290px] w-[969px] overflow-hidden rounded-[22px]">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 969 290" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 225 C 200 155, 380 285, 560 215 S 860 95, 969 150" fill="none" stroke="var(--primary)" strokeOpacity="0.25" strokeWidth="1.2" />
            <path d="M0 262 C 220 195, 400 310, 600 250 S 880 135, 969 195" fill="none" stroke="var(--primary)" strokeOpacity="0.18" strokeWidth="1" />
          </svg>
          <span className="eyebrow-chip absolute left-[28px] top-[28px] inline-flex h-[24px] items-center gap-[6px] rounded-full px-[11px] text-[9.5px] font-semibold uppercase tracking-[0.16em]">
            <Play className="h-[10px] w-[10px] fill-current" aria-hidden="true" /> Bliv klogere
          </span>
          <h2 className="absolute left-[28px] top-[66px] text-[30px] font-bold leading-[36px]">
            Se hvordan
            <br />
            Bet<span className="text-gradient-brand">TrackerAI</span> virker
          </h2>
          <p className="absolute left-[28px] top-[145px] w-[290px] text-[12px] leading-[18px] text-foreground/80">
            Få en enkel og klar gennemgang af, hvordan vores surebet scanner fungerer, og hvordan du får mest ud af platformen.
          </p>
          <button onClick={playExplainer} className="btn-glow group absolute left-[28px] top-[226px] flex h-[36px] items-center justify-center gap-[8px] rounded-full pl-[6px] pr-[18px] text-[12.5px] font-semibold">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-foreground/20">
              <Play className="ml-[1px] h-[10px] w-[10px] fill-current" aria-hidden="true" />
            </span>
            Se videoen
          </button>

          <div className="absolute left-[344px] top-[30px] h-[230px] w-[432px] rounded-[14px] shadow-[var(--shadow-glow)] ring-1 ring-primary-glow/30 transition-transform duration-700 ease-out group-hover/zoom:scale-[1.015]">
            <ExplainerVideo videoRef={explainerRef} l={{ playX: 27, trackFrom: 60, trackTo: 312, progress: 38, volumeX: 347, timeX: 371, fullX: 405, barY: 209 }} />
          </div>

          <ul className="reveal-stagger absolute left-[796px] top-[44px] flex w-[160px] flex-col gap-[18px]">
            {[
              ["Avanceret AI scanner", "tusindvis af kampe"],
              ["Find surebets på tværs", "af bookmakere"],
              ["Se præcise odds,", "marginer og statistikker"],
              ["Få besked i realtid", ""],
            ].map(([a, b], k) => (
              <li key={a} style={stagger(k)} className="group/li flex items-center gap-[12px] text-[11.5px] leading-[16px]">
                <span className="icon-tile flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover/li:scale-110">
                  <Check className="h-[14px] w-[14px]" strokeWidth={3} aria-hidden="true" />
                </span>
                <span>
                  {a}
                  {b && <br />}
                  <span className="text-foreground/65">{b}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <BenefitsSection />
        <BookmakerScanner />
        <ProfitCalculator />

        <section className="reveal relative ml-[28px] mt-[80px] w-[969px]">
          <SectionHeading eyebrow="Altid opdateret" Icon={BellRing} title="Få fundene," accent="der hvor du er." text="Vælg SMS, eller følg med på de kanaler, du allerede bruger." />
          <div className="reveal-stagger mt-[22px] flex gap-[15px]">
            <div style={stagger(0)}>
              <SmsService />
            </div>
            <div style={stagger(1)}>
              <SocialFollow />
            </div>
          </div>
        </section>

        <ReviewsShowcase />
        <PricingSection />

        <div className="pb-[56px]">
          <FaqSection />
        </div>
      </div>
    </div>
  );
}
