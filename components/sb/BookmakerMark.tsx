"use client";
import type { BookmakerId } from "./data";
import { cn } from "@/lib/utils";
import { useSurebets } from "./surebets-context";
import { BookmakerLogo } from "@/components/bookmaker-logo";

/** Bookmaker logo with its name, sized to sit in a ~100px slot. Logos come from /public/bookmakers/<id>.png. */
export function BookmakerMark({ id }: { id: BookmakerId; size?: "md" | "lg" }) {
  const name = useSurebets().nameOf(id);
  return (
    <span className="flex min-w-0 items-center gap-2">
      <BookmakerLogo name={name} className="size-7 rounded-md" />
      <span className="truncate text-[13px] font-extrabold leading-tight tracking-tight text-foreground">{name}</span>
    </span>
  );
}

/** Round brand monogram for compact spots (filter button, chips). */
export function BookmakerBadge({ id, className }: { id: BookmakerId; className?: string }) {
  const name = useSurebets().nameOf(id);
  const base = cn("bk-badge inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold leading-none", className);
  const dark = (content: React.ReactNode, cls = "text-foreground") => <span className={cn(base, "bk-badge-dark", cls)}>{content}</span>;
  switch (id) {
    case "bet365":
      return (
        <span className={cn(base, "bk-bet365 tracking-[-0.06em]")}>
          <span className="bk-bet365-accent">365</span>
        </span>
      );
    case "unibet":
      return (
        <span className={cn(base, "bk-badge-dark flex-col gap-[2px]")}>
          <span className="text-[11px] text-foreground">U</span>
          <span className="flex gap-[1.5px]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="bk-unibet-dot h-[2.5px] w-[2.5px] rounded-full" />
            ))}
          </span>
        </span>
      );
    case "betfair":
      return dark(
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
          <path d="M2 10 L10 2 L18 10 L10 10 L10 18 Z" fill="currentColor" />
        </svg>,
        "bk-betfair",
      );
    case "bwin":
      return dark("bw", "italic text-foreground");
    case "1xbet":
      return dark(
        <>
          1<span className="bk-1xbet">X</span>
        </>,
        "italic text-foreground",
      );
    case "danskespil":
      return <span className={cn(base, "bk-danskespil lowercase")}>ds</span>;
    case "nordicbet":
      return dark(
        <>
          n<span className="bk-nordicbet">b</span>
        </>,
      );
    case "betsson":
      return <span className={cn(base, "bk-betsson text-[12px]")}>B</span>;
    case "bet25":
      return dark(<span className="bk-bet25">25</span>);
    case "leovegas":
      return dark("LV", "bk-leovegas");
    case "mrgreen":
      return dark("Mr", "bk-mrgreen italic");
    case "smarkets":
      return dark("s", "bk-smarkets text-[13px] lowercase");
    case "matchbook":
      return dark(
        <>
          m<span className="bk-matchbook">b</span>
        </>,
      );
    case "stake":
      return dark("S", "italic text-[12px] text-foreground");
    case "cloudbet":
      return dark(
        <svg viewBox="0 0 24 16" className="h-[10px] w-[14px]" aria-hidden>
          <path d="M6 15a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 18 4.5 5.3 5.3 0 0 1 18.5 15Z" fill="currentColor" />
        </svg>,
        "bk-cloudbet",
      );
    default:
      return dark(name.slice(0, 2).toUpperCase());
  }
}
