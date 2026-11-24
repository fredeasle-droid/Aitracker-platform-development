"use client";

import { useLocale } from "@/components/locale-provider";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BellRing, CalendarCheck, Check, Clock, Crown, MessageSquareText, Mic, Play, Quote, Radar, Star, Users } from "lucide-react";
import { useInView } from "@/lib/use-in-view";
const hero = "/home/hero-player.jpg";
const studio = { url: "/home/challenge-studio.webp" };
const host = { url: "/home/pricing-host.webp" };
const videoAsset = { url: "/home/bettrackerai-kapitel-1.mp4" };
const posterAsset = { url: "/home/bliv-klogere-poster.jpg" };
import { CalculatorIcon, LogoMark, TelegramIcon, TrophyIcon } from "../icons";
import { ScanSweep, formatAge, useLiveRows } from "../LiveScanner";
import { LiveTicker } from "../LiveTicker";
import { BENEFITS, BENEFITS_HEADING } from "../Benefits";
import { MAX, MIN, calcEndingBank, calcProfit } from "../ProfitCalculator";
import { WeeklyCarousel } from "../WeeklyCarousel";
import { Chip, splitRows, useStatTiles, useUpdating } from "../BookmakerScanner";
import { POPULAR_BOOKMAKERS, SCANNED_BOOKMAKERS_LABEL } from "../bookmakerLogos";
import { TeamCrest, useHomeData } from "../home-data";
import { POINTS } from "../SmsService";
import { CHANNELS } from "../SocialFollow";
import { Swoosh } from "../Swoosh";
import { CHALLENGE, PRICING, REVIEWS } from "../data";
import { ReviewAvatar, ReviewDots, ReviewPhoto, Stars, playExplainerVideo, useReviewRotation } from "../Reviews";
import { MobileFaq } from "../Faq";
import { ChallengeCalendarDialog } from "../ChallengeCalendarDialog";

const fmt = (n: number) => Math.round(n).toLocaleString("da-DK");

/** Every phone section is one full-width box, so all boxes share the same left and right edges. */
function Box({ children, className = "", soft = false }: { children: ReactNode; className?: string; soft?: boolean }) {
  const { tx } = useLocale();
  return <section className={`${soft ? "panel-soft" : "panel"} relative overflow-hidden rounded-[18px] p-5 ${className}`}>{tx(children)}</section>;
}

function Badge({ children }: { children: ReactNode }) {
  const { tx } = useLocale();
  return (
    <span className="inline-flex h-7 items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-3 text-[11px] font-semibold text-primary-glow">
      {tx(children)}
    </span>
  );
}

/** A new item every 5s, in step with the SMS phone and the Telegram ticker on desktop. */
function useLatestFind() {
  const { finds } = useHomeData();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (finds.length < 2) return;
    const t = setInterval(() => setK((i) => (i + 1) % finds.length), 5000);
    return () => clearInterval(t);
  }, [finds.length]);
  return finds[k % Math.max(finds.length, 1)] ?? null;
}

function Hero() {
  const { tx } = useLocale();
  return (
    <div className="relative pt-[240px]">
      <img
        src={hero}
        alt={tx("Jublende fodboldspiller på stadion")}
        width={1920}
        height={640}
        className="hero-photo-mobile pointer-events-none absolute -left-4 top-0 h-[504px] w-[calc(100%+2rem)] max-w-none object-cover object-[62%_center]"
      />
      {/* Darkens the lower photo so the headline stays readable */}
      <div className="pointer-events-none absolute inset-x-[-16px] top-[120px] h-[300px] bg-background/65 [mask-image:linear-gradient(180deg,transparent,black_45%,black_65%,transparent)]" />
      <div className="relative">
        <span className="glass-chip inline-flex h-7 items-center gap-2 rounded-full px-3 text-[11px] font-semibold text-success">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success shadow-[0_0_6px_var(--success)]" />
          {tx("Live Surebet Scanner Aktiv")}</span>
        <h1 className="mt-3 text-[38px] font-bold leading-[40px] tracking-[-1px]">
          {tx("Find de bedste surebets –")}{" "}
          <span className="relative inline-block">
            <span className="text-gradient-brand">{tx("i realtid")}</span>
            <Swoosh className="absolute -bottom-1.5 left-0 h-2.5 w-full" />
          </span>
        </h1>
        <p className="mt-4 max-w-[320px] text-[15px] leading-[22px] text-foreground/85">
          {tx("Lad vores AI finde de mest profitable muligheder på tværs af bookmakere – automatisk.")}</p>
        <Link href="/konto" className="btn-glow mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold">
          {tx("Start dine")}{" "}{tx(PRICING.trialDays)} {" "}{tx("gratis dage")}{" "}<ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={playExplainerVideo}
          className="btn-ghost-glass mt-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-medium"
        >
          <Play className="h-3.5 w-3.5 fill-current" /> {" "}{tx("Se hvordan det virker")}</button>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="flex">
            {REVIEWS.slice(0, 4).map((r, k) => (
              <ReviewAvatar key={r.name} review={r} className={`h-7 w-7 text-[10px] ring-2 ring-background-deep ${k > 0 ? "-ml-2" : ""}`} />
            ))}
          </div>
          <div className="leading-4">
            <span className="flex items-center gap-1.5">
              <Stars n={5} className="h-3 w-3" />
              <span className="text-[12px] font-semibold">5,0</span>
            </span>
            <span className="block text-[11px] text-muted-foreground">{tx("Intet kort påkrævet · Kun")}{" "}{"18+"}</span>
          </div>
        </div>
      </div>
      <LiveTicker phone className="relative mt-5" />
    </div>
  );
}

function Scanner() {
  const { tx } = useLocale();
  const rows = useLiveRows();
  const { stats } = useHomeData();
  return (
    <section className="panel live-scanner relative overflow-hidden rounded-[18px] p-4">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
        <div className="min-w-0">
          <p className="text-[15px] leading-5"><span className="font-semibold">{tx("Live scanner")}</span> {" "}{tx("– Nye fund")}</p>
          <p className="text-[11px] text-foreground/75">{tx("Opdateres automatisk")}</p>
        </div>
        <span className="ml-auto flex h-6 items-center gap-1.5 rounded-full border border-success/50 bg-success-bg/40 px-2.5 text-[10px] font-bold tracking-[0.12em] text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          {tx("LIVE")}</span>
      </div>
      <div className="relative mt-3 border-t border-border">
        <ScanSweep className="inset-0" />
        {rows.length === 0 && <p className="py-6 text-center text-[12px] text-muted-foreground">{tx("Ingen aktive surebets lige nu – scanneren leder videre.")}</p>}
        {rows.map((r) => (
          <div key={r.id} className="row-in grid h-12 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 text-[12px] last:border-b-0">
            <div className="flex min-w-0 items-center">
              <TeamCrest team={r.home} className="h-6 w-6" />
              <TeamCrest team={r.away} className="ml-1.5 h-6 w-6" />
              <span className="ml-2 truncate">{tx(r.home.name)} – {tx(r.away.name)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="pill-success flex h-6 w-[62px] items-center justify-center rounded-[6px] text-[12px] font-bold">+{r.margin.toFixed(2)}%</span>
              <span className="flex w-9 items-center gap-1 text-[10px] text-foreground/85">
                <Clock className="h-2.5 w-2.5 text-primary-glow" />
                {formatAge(r.age)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="scanner-strip -mx-4 -mb-4 mt-1 flex h-10 items-center justify-between px-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Radar className="h-3.5 w-3.5 text-primary-glow" />
          <span>{tx("Scanner")}{" "}<span className="font-semibold text-foreground">2000+</span> {" "}{tx("bookmakere")}</span>
        </span>
        <span><span className="font-semibold text-foreground">{tx(stats.surebets)}</span> {" "}{tx("aktive surebets")}</span>
      </div>
    </section>
  );
}

function Reviews() {
  const { tx } = useLocale();
  const { index, review: r, next, go, hold } = useReviewRotation();
  return (
    <Box>
      {/* Photo bleeds to the card's top and side edges; heading and name sit on it. */}
      <div className="relative -mx-5 -mt-5">
        <ReviewPhoto review={r} className="h-[236px] w-full" />
        <div className="review-scrim-top pointer-events-none absolute left-0 right-0 top-0 h-[96px]" />
        <div className="review-scrim-bottom pointer-events-none absolute bottom-0 left-0 right-0 h-[112px]" />
        <div key={r.name} className="animate-in fade-in duration-700">
          <Star className="absolute left-[16px] top-[16px] h-[22px] w-[22px] fill-gold text-gold" />
          <h3 className="absolute left-[46px] top-[18px] text-[16px] font-semibold leading-[22px]">{tx("Kunde anmeldelser")}</h3>
          <button type="button" onClick={next} className="absolute right-[14px] top-[19px] flex items-center gap-1 text-[12px] font-medium text-primary-glow">{tx("Se flere")}{" "}<ArrowRight className="h-3 w-3" /></button>
          <div className="absolute bottom-[14px] left-[16px]">
            <p className="text-[14px] font-semibold leading-[18px] text-primary-glow">{tx(r.name)}</p>
            <Stars n={r.stars} className="mt-1 h-3 w-3" />
          </div>
        </div>
      </div>
      <div key={index} className="mt-4 min-h-[112px] animate-in fade-in duration-700" {...hold}>
        <p className="flex items-center gap-2 text-[14px] font-semibold">
          <Quote className="h-4 w-4 shrink-0 rotate-180 fill-primary-glow text-primary-glow" />
          {tx(r.title)}
        </p>
        <p className="mt-2 text-[15px] leading-[22px]">“{tx(r.text)}”</p>
      </div>
      <ReviewDots index={index} go={go} dot="h-2 w-2" className="mt-3 justify-center gap-2" />
    </Box>
  );
}

function Profit() {
  const { tx } = useLocale();
  const [cap, setCap] = useState(5000);
  const profit = calcProfit(cap);
  const pct = ((cap - MIN) / (MAX - MIN)) * 100;
  return (
    <Box>
      <div className="flex items-center gap-3">
        <CalculatorIcon className="h-6 w-6 shrink-0" />
        <h3 className="text-[17px] font-semibold">{tx("Profitberegner")}</h3>
      </div>
      <p className="mt-2 text-[13px] leading-5 text-foreground/85">{tx("12,64% af startkapitalen pr. hverdag indtil banken når 10.000 kr.; derefter 1.000 kr. pr. hverdag.")}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[13px]">{tx("Startkapital")}</span>
        <span className="value-pill flex h-7 items-center rounded-[8px] px-3 text-[13px] font-semibold">{fmt(cap)} {" "}{tx("kr.")}</span>
      </div>
      <input
        type="range"
        aria-label={tx("Startkapital")}
        min={MIN}
        max={MAX}
        step={100}
        value={cap}
        onChange={(e) => setCap(+e.target.value)}
        className="range-glow mt-3 w-full"
        style={{ "--pct": `${pct}%` } as CSSProperties}
      />
      <p className="mt-4 text-[13px]">{tx("Forventet profit (30 hverdage · maks. indsats 10.000 kr./dag)")}</p>
      <div className="mt-1">
        <span className="text-[28px] font-bold leading-9 text-success">+{fmt(profit)} {" "}{tx("kr.")}</span>
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground">{fmt(cap)} {" "}{tx("kr. →")}{" "}{fmt(calcEndingBank(cap))} {" "}{tx("kr.")}</p>
    </Box>
  );
}

function Weekly() {
  const { tx } = useLocale();
  const { finds } = useHomeData();
  if (finds.length === 0) return null;
  return (
    <Box soft className="px-0">
      <div className="flex items-center gap-3 px-5">
        <TrophyIcon className="h-7 w-7 text-gold" />
        <h3 className="text-[17px] font-semibold">{tx("Ugens bedste fund")}</h3>
        <span className="ml-auto inline-flex h-6 items-center gap-1.5 rounded-full border border-success/50 bg-success/10 px-2.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden="true" />
          {tx("Live")}</span>
      </div>
      <div className="weekly-strip fade-x-soft relative mt-2 h-[190px] overflow-hidden">
        <WeeklyCarousel cardWidth={280} left={20} />
      </div>
      <p className="px-5 text-[11px] text-muted-foreground">{tx("Hold fingeren på et kort for at sætte farten på pause.")}</p>
    </Box>
  );
}

const EXPLAINER_POINTS = ["Avanceret AI scanner tusindvis af kampe", "Find surebets på tværs af bookmakere", "Se præcise odds, marginer og statistikker", "Få besked i realtid"];

function Explainer() {
  const { tx } = useLocale();
  return (
    <Box className="explainer-panel">
      <p className="flex items-center gap-3 text-[16px] font-medium text-primary-glow">
        <span className="btn-glow flex h-8 w-12 items-center justify-center rounded-full"><Play className="h-3.5 w-3.5 fill-current" /></span>
        {tx("Bliv klogere")}</p>
      <h2 className="mt-4 text-[28px] font-bold leading-[32px] tracking-[-0.35px]">
        {tx("Se hvordan Bet")}<span className="text-primary-glow">{tx("TrackerAI")}</span> {" "}{tx("virker")}</h2>
      <p className="mt-3 text-[14px] leading-[21px]">
        {tx("Få en enkel og klar gennemgang af, hvordan vores surebet scanner fungerer, og hvordan du får mest ud af platformen.")}</p>
      <video
        className="mt-4 aspect-video w-full rounded-[14px] bg-background-deep object-cover shadow-[var(--shadow-glow)]"
        src={videoAsset.url || undefined}
        poster={posterAsset.url}
        data-explainer
        preload="none"
        controls
        playsInline
      />
      <ul className="mt-4 flex flex-col gap-3">
        {EXPLAINER_POINTS.map((p) => (
          <li key={p} className="flex items-center gap-3 text-[13px] leading-[18px]">
            <span className="btn-glow flex h-7 w-7 shrink-0 items-center justify-center rounded-full"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
            {tx(p)}
          </li>
        ))}
      </ul>
    </Box>
  );
}

function Benefits() {
  const { tx } = useLocale();
  return (
    <section>
      <span className="glass-chip inline-flex h-7 items-center rounded-full px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary-glow">
        {tx(BENEFITS_HEADING.eyebrow)}
      </span>
      <h2 className="mt-3 text-[25px] font-bold leading-[30px] tracking-[-0.4px]">
        {tx(BENEFITS_HEADING.title)} <span className="text-gradient-brand">{tx(BENEFITS_HEADING.accent)}</span>
      </h2>
      <p className="mt-2 text-[13.5px] leading-5 text-muted-foreground">{tx(BENEFITS_HEADING.text)}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {BENEFITS.map(({ Icon, title, text }) => (
          <div key={title} className="benefit-card p-4">
            <span className="icon-tile flex h-10 w-10 items-center justify-center rounded-[11px]">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <p className="mt-3 text-[14px] font-semibold leading-[18px]">{tx(title)}</p>
            <p className="mt-1 text-[12px] leading-[17px] text-muted-foreground">{tx(text)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Bookmakers() {
  const { tx } = useLocale();
  const updating = useUpdating(POPULAR_BOOKMAKERS);
  const rows = splitRows(POPULAR_BOOKMAKERS);
  const tiles = useStatTiles();
  return (
    <Box className="bookmaker-panel px-0">
      <div className="px-5">
        <Badge><Radar className="h-3.5 w-3.5" strokeWidth={2.2} />{tx("Oversigt over bookmakere")}</Badge>
        <h2 className="mt-4 text-[28px] font-bold leading-[32px] tracking-[-0.5px]">
          {tx("Vi scanner")}{" "}<span className="text-gradient-brand">{tx(SCANNED_BOOKMAKERS_LABEL)}</span> {" "}{tx("bookmakere – hele tiden")}</h2>
        <p className="mt-3 text-[14px] leading-[21px] text-foreground/80">
          {tx("Vores AI sammenligner odds på tværs af danske og internationale bookmakere hvert sekund, så du aldrig går glip af et surebet.")}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {tiles.map(([v, l]) => (
            <div key={l} className="panel-soft flex h-14 min-w-0 flex-col justify-center px-3">
              <span className="truncate text-[16px] font-bold leading-5 text-primary-glow">{tx(v)}</span>
              <span className="truncate text-[10.5px] leading-[14px] text-foreground/75">{tx(l)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="fade-x mt-5 flex flex-col gap-3 overflow-hidden">
        {rows.map((row, k) => (
          <div
            key={k}
            className="marquee-half flex w-max"
            style={{ "--marquee-duration": `${row.duration}s`, animationDirection: row.reverse ? "reverse" : "normal" } as CSSProperties}
          >
            {[...row.names, ...row.names].map((n, i) => <Chip key={i} name={n} updating={updating.includes(n)} />)}
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-4 px-5 text-[11px] text-foreground/75">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />{tx("Live odds")}</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold" />{tx("Opdaterer")}</span>
      </p>
    </Box>
  );
}

function Challenge() {
  const { tx } = useLocale();
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const [open, setOpen] = useState(false);
  const pct = (CHALLENGE.day / CHALLENGE.totalDays) * 100;
  return (
    <div ref={ref}>
      <Box className="challenge-panel p-0!">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.url}
          alt={tx("Værten optager BetTrackerAI's 365 dages challenge i studiet")}
          loading="lazy"
          width={1600}
          height={900}
          className="pointer-events-none aspect-[16/9] w-full object-cover object-[60%_25%] [mask-image:linear-gradient(180deg,black_70%,transparent)]"
        />
        <div className="relative -mt-8 px-4 pb-4">
          <Badge>
            <Mic className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
            {tx("Ny serie · Følg med hver dag")}</Badge>
          <h2 className="mt-2.5 text-[18px] font-semibold leading-[24px] tracking-[-0.2px] text-foreground/80">{tx("Vi tager jer med hele vejen.")}</h2>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="btn-glow flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px]">
              <CalendarCheck className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
            </span>
            <p className="text-[46px] font-black leading-[46px] tracking-[-1.5px] text-glow">365</p>
            <div className="relative">
              <p className="-skew-x-6 text-[16px] font-black italic leading-[18px] tracking-[0.5px]">
                <span className="text-primary-glow">{tx("DAGES")}</span>
                <br />
                {tx("CHALLENGE")}</p>
              <Swoosh className="absolute -bottom-2.5 left-0 h-[8px] w-[100px]" />
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-[19px] text-foreground/85">
            {tx("Følg vores")}{" "}<span className="font-semibold text-primary-glow">{tx("365 dages")}</span> {" "}{tx("rejse med surebetting, resultater og ærlig feedback.")}</p>
          <div className="sms-card mt-3 rounded-[12px] p-2.5">
            <span className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
              {tx("Rejsen lige nu")}</span>
            <p className="mt-1 text-[16px] font-bold">
              {tx("Dag")}{" "}{tx(CHALLENGE.day)} <span className="text-[12px] font-medium text-muted-foreground">{tx("af")}{" "}{tx(CHALLENGE.totalDays)}</span>
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-[0_0_8px_var(--primary-glow)] transition-[width] duration-[1600ms] ease-out"
                style={{ width: inView ? `${pct}%` : 0 }}
              />
            </div>
          </div>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
            className="btn-glow mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold"
          >
            {tx("Følg rejsen")}{" "}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </Box>
      <ChallengeCalendarDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function Sms() {
  const { tx } = useLocale();
  const f = useLatestFind();
  return (
    <Box>
      <div className="pointer-events-none absolute -right-14 -top-10 h-56 w-56 rounded-full bg-primary/25 blur-[60px]" />
      <div className="relative flex items-center gap-3">
        <MessageSquareText className="h-6 w-6 text-primary-glow" />
        <h3 className="text-[17px] font-semibold">{tx("SMS Service")}</h3>
        <span className="btn-glow relative ml-auto flex h-9 w-9 items-center justify-center rounded-full">
          <BellRing className="bell-ring h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-background bg-success px-1 text-[9px] font-bold text-background-deep">3</span>
        </span>
      </div>
      <p className="relative mt-4 text-[17px] font-semibold text-primary-glow">{tx("Få besked med det samme")}</p>
      <p className="relative mt-1 text-[14px] leading-[21px] text-foreground/85">
        {tx("Modtag automatiske SMS, når der kommer et surebet, der matcher dine indstillinger.")}</p>
      <ul className="relative mt-3 flex flex-col gap-2">
        {POINTS.map((p) => (
          <li key={p} className="flex items-center gap-2.5 text-[13px]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success text-background-deep shadow-[0_0_8px_-1px_var(--success)]"><Check className="h-2.5 w-2.5" strokeWidth={3.5} /></span>
            {tx(p)}
          </li>
        ))}
      </ul>
      {f && (
      <div key={f.id} className="sms-in sms-card relative mt-4 rounded-[14px] p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-background-deep"><LogoMark className="h-2.5 w-3" /></span>
          <span className="text-[11px] font-bold">{tx("BetTrackerAI")}</span>
          <span className="ml-auto text-[10px] text-muted-foreground">{tx("nu")}</span>
        </div>
        <p className="mt-2 text-[12px] font-semibold">{tx("Nyt surebet fundet! 🔔")}</p>
        <p className="text-[12px] text-foreground/85">{tx(f.home.name)} – {tx(f.away.name)}</p>
        <span className="pill-success mt-2 inline-block rounded-full px-2 py-px text-[11px] font-bold">{f.margin.toFixed(2)}{tx("% margin")}</span>
      </div>
      )}
      <Link href="/konto" className="btn-glow relative mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold">
        {tx("Aktivér SMS service")}{" "}<ArrowRight className="h-4 w-4" />
      </Link>
    </Box>
  );
}

function Social() {
  const { tx } = useLocale();
  const f = useLatestFind();
  return (
    <Box>
      <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-52 rounded-full bg-discord/20 blur-[60px]" />
      <div className="relative flex items-center gap-3">
        <Users className="h-6 w-6 text-primary-glow" />
        <h3 className="text-[17px] font-semibold">{tx("Følg vores sociale medier")}</h3>
      </div>
      <p className="relative mt-4 text-[17px] font-semibold text-primary-glow">{tx("Vær først med de nyeste fund")}</p>
      <p className="relative mt-1 text-[14px] leading-[21px] text-foreground/85">{tx("Live surebets, guides og tips – på de kanaler, du allerede bruger.")}</p>
      <div className="relative mt-4 grid grid-cols-2 gap-3">
        {CHANNELS.map(({ name, desc, Icon, tile, brand }) => (
          <a
            key={name}
            href="#"
            aria-label={`Følg BetTrackerAI på ${name}`}
            style={{ "--brand": brand, "--play": "var(--youtube)" } as CSSProperties}
            className="social-tile group relative flex h-[104px] flex-col items-center overflow-hidden rounded-[14px] border pt-3 text-center"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-[11px] text-primary-foreground shadow-[0_6px_18px_-6px_var(--brand)] ${tile}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="mt-2 text-[13px] font-semibold">{tx(name)}</span>
            <span className="text-[10.5px] text-muted-foreground">{tx(desc)}</span>
            <ArrowUpRight className="absolute right-2 top-2 h-3 w-3 text-foreground/40" />
          </a>
        ))}
      </div>
      {f && (
      <div className="value-pill relative mt-4 flex h-9 items-center gap-2 overflow-hidden rounded-full pl-1.5 pr-3 text-[11.5px]">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-telegram text-primary-foreground"><TelegramIcon className="h-3 w-3" /></span>
        <span key={f.id} className="row-in flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate text-foreground/85">{tx("Nyt:")}{" "}<span className="font-semibold text-foreground">{tx(f.home.name)} – {tx(f.away.name)}</span></span>
          <span className="ml-auto shrink-0 font-bold text-success">{f.margin.toFixed(2)}%</span>
        </span>
      </div>
      )}
    </Box>
  );
}

function Pricing() {
  const { tx } = useLocale();
  const { plans } = useHomeData();
  const [selected, setSelected] = useState(plans[plans.length - 1]?.key ?? "");
  const plan = plans.find((p) => p.key === selected) ?? plans[0];
  if (!plan) return null;
  return (
    <Box className="pricing-panel p-0!">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={host.url}
        alt={tx("BetTrackerAI-værten foran platformen")}
        loading="lazy"
        width={1600}
        height={893}
        className="pointer-events-none aspect-[4/3] w-full object-cover object-[50%_15%] [mask-image:linear-gradient(180deg,black_80%,transparent)]"
      />
      <div className="relative -mt-24 px-4 pb-5 text-center">
        <h2 className="text-[19px] font-bold leading-[24px] tracking-[-0.3px]">{tx("Vi stoler så meget på vores system, at vi lader dig prøve det –")}</h2>
        <p className="relative mt-0.5 inline-block -skew-x-6 text-[30px] font-black italic leading-[38px] text-primary-glow text-glow">
          {tx("helt gratis.")}<Swoosh className="absolute -bottom-1.5 -left-2 h-[8px] w-[calc(100%+16px)]" />
        </p>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary-glow/70 to-transparent" />
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Crown className="h-6 w-6 fill-gold text-gold" strokeWidth={1.6} />
            <h3 className="text-[18px] font-bold">{tx("Priser")}</h3>
          </span>
          <div role="radiogroup" aria-label={tx("Vælg abonnement")} className="flex h-8 items-center rounded-full border border-primary/70 bg-background-deep/60 p-0.5 text-[11.5px] font-medium">
            {plans.map((p) => (
              <button key={p.key} role="radio" aria-checked={p.key === plan.key} onClick={() => setSelected(p.key)} className={`h-full rounded-full px-3 ${p.key === plan.key ? "btn-glow" : "text-foreground/85"}`}>{tx(p.name)}</button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-left text-[11px] font-medium uppercase tracking-[1.6px] text-foreground/80">{tx("BetTrackerAI")}{" "}{tx(plan.name)}</p>
        <p className="flex items-end gap-2">
          <span key={plan.price} className="row-in text-[56px] font-black leading-[58px] tracking-[-2px]">{tx(plan.price)}</span>
          <span className="mb-1.5 text-[17px] font-bold">{tx("kr./md")}</span>
        </p>
        <p className="text-left text-[13px] text-muted-foreground">{tx(plan.detail)}</p>
        <Link href="/konto" className="btn-glow mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold">
          {tx("Start dine")}{" "}{tx(PRICING.trialDays)} {" "}{tx("gratis dage")}{" "}<ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={playExplainerVideo}
          className="btn-ghost-glass mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-full text-[13px] font-medium"
        >
          <Play className="h-3.5 w-3.5 fill-current" /> {" "}{tx("Se hvordan det virker")}</button>
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="flex">
            {REVIEWS.slice(0, 4).map((r, k) => (
              <ReviewAvatar key={r.name} review={r} className={`h-7 w-7 text-[10px] ring-2 ring-background-deep ${k > 0 ? "-ml-2" : ""}`} />
            ))}
          </div>
          <div className="leading-4">
            <span className="flex items-center gap-1.5">
              <Stars n={5} className="h-3 w-3" />
              <span className="text-[12px] font-semibold">5,0</span>
            </span>
            <span className="block text-[11px] text-muted-foreground">{tx("Intet kort påkrævet · Kun")}{" "}{"18+"}</span>
          </div>
        </div>
      </div>
    </Box>
  );
}

/** Phone layout of the front page: same sections as desktop, stacked in one column of equal-width boxes. */
export function MobileHome() {
  return (
    <div className="relative">
      <div className="flex flex-col gap-5 px-4 pt-4">
        <Hero />
        <Scanner />
        <Reviews />
        <Profit />
        <Weekly />
        <Explainer />
        <Benefits />
        <Bookmakers />
        <Challenge />
        <Sms />
        <Social />
        <Pricing />
        <MobileFaq />
      </div>
    </div>
  );
}
