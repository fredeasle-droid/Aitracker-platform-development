"use client";
import type { BookmakerId } from "./data";
import { cn } from "@/lib/utils";
import { useSurebets } from "./surebets-context";

/** Brand wordmark, sized to sit in a ~100px slot. Bookmakers without a designed mark show their name. */
export function BookmakerMark({ id, size = "md" }: { id: BookmakerId; size?: "md" | "lg" }) {
  const name = useSurebets().nameOf(id);
  const lg = size === "lg";
  const word = (cls: string, lgPx = "text-[22px]", mdPx = "text-[19px]") =>
    cn("inline-flex items-center whitespace-nowrap font-extrabold leading-none tracking-tight", lg ? lgPx : mdPx, cls);
  switch (id) {
    case "bet365":
      return (
        <span className={cn("bk-bet365 inline-flex items-center rounded-[4px] font-extrabold leading-none tracking-tight", lg ? "h-8 px-2 text-[22px]" : "h-7 px-1.5 text-[19px]")}>
          bet<span className="bk-bet365-accent">365</span>
        </span>
      );
    case "unibet":
      return (
        <span className="inline-flex flex-col items-center leading-none">
          <span className={cn("font-extrabold tracking-wide text-foreground", lg ? "text-[22px]" : "text-[19px]")}>UNIBET</span>
          <span className="mt-0.5 flex gap-[3px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className={cn("bk-unibet-dot rounded-full", lg ? "h-[5px] w-[5px]" : "h-1 w-1")} />
            ))}
          </span>
        </span>
      );
    case "betfair":
      return (
        <span className={cn("bk-betfair inline-flex items-center gap-1 font-semibold leading-none tracking-tight", lg ? "text-[23px]" : "text-[21px]")}>
          <svg viewBox="0 0 20 20" className={lg ? "h-[18px] w-[18px]" : "h-4 w-4"} aria-hidden>
            <path d="M2 10 L10 2 L18 10 L10 10 L10 18 Z" fill="currentColor" />
          </svg>
          betfair
        </span>
      );
    case "bwin":
      return <span className={word("italic text-foreground", "text-[25px]", "text-[21px]")}>bwin</span>;
    case "1xbet":
      return (
        <span className={word("italic text-foreground", "text-[24px]", "text-[21px]")}>
          1<span className="bk-1xbet">X</span>BET
        </span>
      );
    case "danskespil":
      return (
        <span className={cn("bk-danskespil inline-flex items-center gap-1 rounded-full font-extrabold lowercase leading-none", lg ? "h-8 px-3 text-[16px]" : "h-7 px-2.5 text-[14px]")}>
          <span className="bk-danskespil-dot h-2 w-2 rounded-full" /> danske spil
        </span>
      );
    case "nordicbet":
      return (
        <span className={word("text-foreground", "text-[20px]", "text-[17px]")}>
          nordic<span className="bk-nordicbet">bet</span>
        </span>
      );
    case "betsson":
      return (
        <span className={cn("bk-betsson inline-flex items-center rounded-[4px] font-extrabold uppercase leading-none tracking-wide", lg ? "h-8 px-2 text-[17px]" : "h-7 px-1.5 text-[15px]")}>
          betsson
        </span>
      );
    case "bet25":
      return (
        <span className={word("text-foreground", "text-[24px]", "text-[21px]")}>
          Bet<span className="bk-bet25">25</span>
        </span>
      );
    case "leovegas":
      return (
        <span className={word("bk-leovegas uppercase", "text-[19px]", "text-[16px]")}>
          Leo<span className="text-foreground">Vegas</span>
        </span>
      );
    case "mrgreen":
      return (
        <span className={word("bk-mrgreen italic", "text-[22px]", "text-[19px]")}>
          Mr<span className="ml-1 text-foreground">Green</span>
        </span>
      );
    case "smarkets":
      return (
        <span className={word("bk-smarkets lowercase", "text-[22px]", "text-[19px]")}>
          smarkets
        </span>
      );
    case "matchbook":
      return (
        <span className={word("text-foreground", "text-[20px]", "text-[17px]")}>
          match<span className="bk-matchbook">book</span>
        </span>
      );
    case "stake":
      return <span className={word("italic text-foreground", "text-[25px]", "text-[22px]")}>Stake</span>;
    case "cloudbet":
      return (
        <span className={word("bk-cloudbet gap-1", "text-[21px]", "text-[18px]")}>
          <svg viewBox="0 0 24 16" className={lg ? "h-[16px] w-[22px]" : "h-[14px] w-[19px]"} aria-hidden>
            <path d="M6 15a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 18 4.5 5.3 5.3 0 0 1 18.5 15Z" fill="currentColor" />
          </svg>
          cloudbet
        </span>
      );
    default:
      return <span className={word("text-foreground", "text-[18px]", "text-[16px]")}>{name}</span>;
  }
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
