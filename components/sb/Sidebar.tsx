"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Home,
  BarChart3,
  Radio,
  PieChart,
  Gift,
  Star,
  Gamepad2,
  Check,
  Plus,
  ChevronDown,
  ArrowRight,
  Volleyball,
  Disc,
  Trophy,
  Calculator,
  Crown,
} from "lucide-react";
import { Logo } from "./Logo";
import { useSurebets } from "./surebets-context";
import { useBookmakerFilter } from "./bookmaker-filter";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Surebets", icon: BarChart3, href: "/surebets" },
  { label: "Live-scanning", icon: Radio, href: "/surebets#live-scanning", live: true },
  { label: "Statistik", icon: PieChart, href: "/stats" },
  { label: "Bonus", icon: Gift, href: "/bonus" },
  { label: "Mine bets", icon: Star, href: "/konto" },
];

export function FootballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 7 L15.5 9.5 L14.2 13.6 H9.8 L8.5 9.5 Z" fill="var(--background)" />
      <path d="M12 2.5 V7 M15.5 9.5 L20.5 8 M14.2 13.6 L17 18 M9.8 13.6 L7 18 M8.5 9.5 L3.5 8" stroke="var(--background)" strokeWidth="1.2" />
    </svg>
  );
}

function BasketballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M5.65 5.65a14 14 0 0 1 12.7 12.7" />
      <path d="M18.35 5.65a14 14 0 0 0-12.7 12.7" />
      <path d="M12 2v20M2 12h20" />
    </svg>
  );
}

const sportIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Fodbold: FootballIcon,
  Basketball: BasketballIcon,
  Tennis: Volleyball,
  Ishockey: Disc,
  Esport: Gamepad2,
};

const COLLAPSED_BOOKMAKERS = 8;

const calculatorNav = [
  { label: "Surebets", icon: Trophy, href: "/surebets" },
  { label: "Beregn indsats", icon: Calculator, href: null },
  { label: "Liveodds", icon: Radio, href: "/surebets" },
  { label: "Statistik", icon: BarChart3, href: "/stats" },
  { label: "Bonus", icon: Gift, href: "/bonus" },
  { label: "Mine bets", icon: Star, href: "/konto" },
];

const CALC_SPORTS = ["Fodbold", "Basketball", "Tennis", "Ishockey", "Esport"];
const PRO_BARS = [22, 34, 30, 48, 62];

function CalculatorSidebarContent() {
  const { sports } = useSurebets();
  const counts = new Map(sports.map((s) => [s.label, s.count]));
  const extra = sports.filter((s) => !CALC_SPORTS.includes(s.label)).map((s) => s.label);
  return (
    <div className="flex min-h-full flex-col">
      <div className="px-1">
        <Logo taglineText="Track · Analyse · Vind" />
      </div>

      <nav aria-label="Hovedmenu" className="mt-8 flex flex-col gap-1.5 short:mt-5 short:gap-0.5">
        {calculatorNav.map(({ label, icon: Icon, href }) =>
          href ? (
            <Link
              key={label}
              href={href}
              className="flex w-full items-center gap-4 rounded-xl px-4 py-2.5 text-[16.5px] font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent short:py-1.5"
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
              <span className="flex-1 text-left">{label}</span>
            </Link>
          ) : (
            <span
              key={label}
              aria-current="page"
              className="sb-nav-active flex w-full items-center gap-4 rounded-xl px-4 py-3 text-[16.5px] font-semibold text-primary-foreground short:py-2"
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
              <span className="flex-1 text-left">{label}</span>
            </span>
          ),
        )}
      </nav>

      <div className="mx-2 my-5 h-px bg-primary/40 short:my-3" />

      <div className="px-2 text-[13px] font-semibold tracking-wide text-cyan">SPORT</div>
      <div className="mt-3 flex flex-col gap-1 short:mt-2 short:gap-0.5">
        {[...CALC_SPORTS, ...extra].map((label) => {
          const Icon = sportIcons[label] ?? Trophy;
          return (
            <Link
              key={label}
              href="/surebets"
              className="flex w-full items-center gap-4 rounded-xl px-3 py-2 text-[16px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent short:py-1.5"
            >
              <Icon className="h-[22px] w-[22px]" />
              <span className="flex-1 text-left">{label}</span>
              <span className="min-w-8 text-right text-[16px] font-medium tabular-nums text-sidebar-foreground">
                {counts.get(label) ?? 0}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="sb-panel panel-glow relative mt-6 shrink-0 overflow-hidden p-5 short:mt-4 short:p-3 lg:mt-auto">
        <div className="pointer-events-none absolute right-4 top-4 flex h-16 items-end gap-1.5" aria-hidden>
          {PRO_BARS.map((h) => (
            <span key={h} className="w-2.5 rounded-t-sm bg-gradient-to-t from-primary/20 to-primary" style={{ height: h }} />
          ))}
        </div>
        <Crown className="relative h-9 w-9 fill-gold/30 text-gold" strokeWidth={1.8} aria-hidden />
        <div className="relative mt-4 text-[17px] font-bold leading-tight">Opgrader til Pro</div>
        <p className="relative mt-1.5 text-[13px] leading-snug text-foreground/85">Få adgang til avancerede værktøjer og analyser</p>
        <Link
          href="/konto"
          className="bg-gradient-primary relative mt-4 flex w-full items-center justify-center gap-1.5 rounded-full py-3 text-[15px] font-semibold text-primary-foreground shadow-glow"
        >
          Se fordele <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

export function SidebarContent({ page = "surebets" }: { page?: "surebets" | "beregn" }) {
  if (page === "beregn") return <CalculatorSidebarContent />;
  return <SurebetsSidebarContent />;
}

function SurebetsSidebarContent() {
  const [activeNav, setActiveNav] = useState("Surebets");
  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const bk = useBookmakerFilter();
  const { sports, sport: activeSport, setSport, bookmakers } = useSurebets();
  const listed = showAll ? bookmakers : bookmakers.slice(0, COLLAPSED_BOOKMAKERS);

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-1">
        <Logo />
      </div>

      <nav className="mt-6 space-y-1 short:mt-4 short:space-y-0.5">
        <Link
          href="/"
          className="flex w-full items-center gap-3.5 rounded-xl px-4 py-2 text-[15.5px] font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent short:py-1.5"
        >
          <Home className="h-5 w-5" strokeWidth={2.3} />
          <span className="flex-1 text-left">Forside</span>
        </Link>
        {nav.map(({ label, icon: Icon, href, live }) => {
          const active = activeNav === label;
          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                if (href.startsWith("/surebets")) setActiveNav(label);
              }}
              className={cn(
                "flex w-full items-center gap-3.5 rounded-xl px-4 py-2 text-[15.5px] font-medium transition-all short:py-1.5",
                active
                  ? "sb-nav-active py-2.5 font-bold text-primary-foreground short:py-2"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "fill-primary-foreground/30")} strokeWidth={2.3} />
              <span className="flex-1 text-left">{label}</span>
              {live && <span className="glow-dot h-2 w-2 animate-blink rounded-full bg-success" />}
            </Link>
          );
        })}
      </nav>

      <div className="my-4 h-px bg-sidebar-border short:my-3" />

      <div className="px-2 text-[11px] font-semibold tracking-[0.12em] text-cyan">SPORT</div>
      <div className="mt-3 space-y-1 short:mt-2 short:space-y-0.5">
        {sports.length === 0 && <p className="px-3 text-[12.5px] text-muted-foreground">Ingen sportsgrene lige nu.</p>}
        {sports.map(({ label, count }) => {
          const Icon = sportIcons[label] ?? Trophy;
          const active = activeSport === label;
          return (
            <button
              key={label}
              aria-pressed={active}
              onClick={() => setSport(active ? null : label)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14.5px] font-medium transition-colors short:py-1.5",
                active ? "bg-gradient-active font-bold text-foreground ring-1 ring-primary/30" : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 text-left">{label}</span>
              <span
                className={cn(
                  "min-w-7 rounded-md px-1.5 py-0.5 text-xs",
                  active ? "bg-primary/50 font-semibold text-foreground" : "font-medium text-sidebar-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="my-4 h-px bg-sidebar-border short:my-3" />

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between px-2 text-[11px] font-semibold tracking-[0.12em] text-cyan"
      >
        BOOKMAKERE
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", !open && "-rotate-90")} />
      </button>
      {open && (
        <ul className="mt-3 space-y-2 px-2 short:mt-2 short:space-y-1.5">
          {listed.map(({ id, name }) => {
            const on = bk.isOn(id);
            return (
              <li key={id}>
                <button
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => bk.toggle(id)}
                  className={cn("flex w-full items-center gap-3 text-[13px] transition-colors hover:text-foreground", on ? "text-sidebar-foreground" : "text-muted-foreground/70")}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full transition-all",
                      on ? "bg-success shadow-[0_0_8px_var(--success)]" : "border border-muted-foreground/50",
                    )}
                  >
                    <Check className={cn("h-3 w-3 text-success-foreground transition-transform", on ? "scale-100" : "scale-0")} strokeWidth={3} />
                  </span>
                  <span className={cn(!on && "line-through decoration-muted-foreground/50")}>{name}</span>
                </button>
              </li>
            );
          })}
          {bookmakers.length > COLLAPSED_BOOKMAKERS && (
            <li>
              <button onClick={() => setShowAll((v) => !v)} className="flex items-center gap-3 text-[13px] text-sidebar-foreground hover:text-foreground">
                <Plus className="h-4 w-4 text-muted-foreground" />
                {showAll ? "Vis færre" : `Vis alle (${bookmakers.length})`}
              </button>
            </li>
          )}
        </ul>
      )}

      <div className="sb-panel panel-glow mt-6 shrink-0 p-4 short:mt-4 short:p-3 lg:mt-auto">
        <div className="flex items-start gap-3">
          <Gift className="icon-glow h-9 w-9 shrink-0 fill-primary/40 text-cyan" strokeWidth={1.8} />
          <div>
            <div className="text-sm font-bold leading-tight">Få endnu bedre odds!</div>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">Opret gratis konto og få flere muligheder.</p>
          </div>
        </div>
        <button className="bg-gradient-primary mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-primary-foreground shadow-glow">
          Kom i gang <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ page = "surebets" }: { page?: "surebets" | "beregn" }) {
  return (
    <aside className={cn("sticky top-0 z-10 hidden h-screen shrink-0 lg:block", page === "beregn" ? "w-[260px]" : "w-[230px]")}>
      <div className="h-full overflow-y-auto bg-sidebar/95 px-4 pb-4 pt-6 backdrop-blur-xl short:pb-3 short:pt-4">
        <SidebarContent page={page} />
      </div>
      <SidebarCurve />
    </aside>
  );
}

/** Curved, glowing right edge of the sidebar (sweeps in from top-right to bottom-left). */
export function SidebarCurve() {
  const path = "M40 0 Q 16 380 0 1000";
  return (
    <svg
      viewBox="0 0 40 1000"
      preserveAspectRatio="none"
      className="pointer-events-none absolute left-full top-0 h-full w-10"
      aria-hidden
    >
      <defs>
        <linearGradient id="sidebar-curve-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary-glow)" stopOpacity="0.15" />
          <stop offset="18%" stopColor="var(--primary-glow)" stopOpacity="0.95" />
          <stop offset="55%" stopColor="var(--cyan)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d={`${path} L0 0 Z`} fill="var(--sidebar)" fillOpacity="0.94" />
      <path
        d={path}
        fill="none"
        stroke="url(#sidebar-curve-stroke)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        className="curve-glow"
      />
    </svg>
  );
}
