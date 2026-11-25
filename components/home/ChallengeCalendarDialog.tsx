"use client";

import { useLocale } from "@/components/locale-provider";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Percent, Send, Target, TrendingUp, X } from "lucide-react";
import { CHALLENGE } from "./data";
import { CHALLENGE_DAYS, CHALLENGE_START, TELEGRAM_URL, dayKey, type ChallengeDay } from "./challenge-results";

const WEEKDAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const monthFmt = new Intl.DateTimeFormat("da-DK", { month: "long", year: "numeric" });
const longFmt = new Intl.DateTimeFormat("da-DK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const LAST_DAY = CHALLENGE_DAYS[CHALLENGE_DAYS.length - 1]!;
const BY_KEY = new Map(CHALLENGE_DAYS.map((d) => [dayKey(d.date), d]));
const MAX_PROFIT = Math.max(...CHALLENGE_DAYS.map((d) => d.profit));
const monthIndex = (d: Date) => d.getFullYear() * 12 + d.getMonth();
const FIRST_MONTH = monthIndex(CHALLENGE_START);
const LAST_MONTH = monthIndex(LAST_DAY.date);

function fmtPct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2).replace(".", ",")}%`;
}

export function ChallengeCalendarDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tx } = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  const [month, setMonth] = useState(LAST_MONTH);
  const [selected, setSelected] = useState<ChallengeDay>(LAST_DAY);
  const [mounted, setMounted] = useState(false);

  // Portalled to <body> so the page's zoomed desktop frame doesn't scale the modal.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open, mounted]);

  const cells = useMemo(() => {
    const first = new Date(Math.floor(month / 12), month % 12, 1);
    const offset = (first.getDay() + 6) % 7;
    const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const days: (ChallengeDay | number | null)[] = Array.from({ length: offset }, () => null);
    for (let n = 1; n <= count; n++) {
      days.push(BY_KEY.get(dayKey(new Date(first.getFullYear(), first.getMonth(), n))) ?? n);
    }
    return { first, days };
  }, [month]);

  const monthTotal = useMemo(
    () => CHALLENGE_DAYS.filter((d) => monthIndex(d.date) === month).reduce((sum, d) => sum + d.profit, 0),
    [month],
  );

  const stats = [
    ["Samlet resultat", fmtPct(CHALLENGE.totalReturn), TrendingUp],
    ["Antal surebets", String(CHALLENGE.surebets), Target],
    ["Gns. margin", `${CHALLENGE.avgMargin.toFixed(2).replace(".", ",")}%`, Percent],
  ] as const;

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="challenge-dialog-title"
      className="m-auto max-h-[92dvh] w-[calc(100%-24px)] max-w-[760px] overflow-y-auto rounded-[22px] border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[2.2px] text-primary-glow">{tx("365 dages challenge")}</p>
            <h2 id="challenge-dialog-title" className="mt-1 text-[20px] font-bold leading-6 sm:text-[24px] sm:leading-7">
              {tx("Dagens resultater")}</h2>
            <p className="mt-1 text-[12.5px] text-foreground/70">
              {tx("Dag")}{" "}{tx(CHALLENGE.day)} {" "}{tx("af")}{" "}{tx(CHALLENGE.totalDays)}{tx(". Vælg en dag i kalenderen.")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tx("Luk")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:bg-foreground/10"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map(([label, value, Icon]) => (
            <div key={label} className="value-pill rounded-[12px] p-2.5 sm:p-3">
              <p className="text-[10.5px] leading-[13px] text-foreground/75">{tx(label)}</p>
              <p className="mt-1 flex items-center gap-1 text-[15px] font-bold tabular-nums sm:text-[18px]">
                <Icon className="h-3.5 w-3.5 shrink-0 text-primary-glow" strokeWidth={2.6} aria-hidden="true" />
                {tx(value)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_230px]">
          <div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMonth((m) => Math.max(FIRST_MONTH, m - 1))}
                disabled={month <= FIRST_MONTH}
                aria-label={tx("Forrige måned")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-foreground/10 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="text-[14px] font-semibold capitalize" aria-live="polite">
                {monthFmt.format(cells.first)}
                <span className="ml-2 text-[12px] font-medium text-success">{fmtPct(monthTotal)}</span>
              </p>
              <button
                type="button"
                onClick={() => setMonth((m) => Math.min(LAST_MONTH, m + 1))}
                disabled={month >= LAST_MONTH}
                aria-label={tx("Næste måned")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-foreground/10 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10.5px] font-medium uppercase tracking-wide text-foreground/60">
              {WEEKDAYS.map((w) => (
                <span key={w}>{tx(w)}</span>
              ))}
            </div>
            <div className="mt-1.5 grid grid-cols-7 gap-1">
              {cells.days.map((cell, i) => {
                if (cell === null) return <span key={`e${i}`} />;
                if (typeof cell === "number") {
                  return (
                    <span key={cell} className="flex aspect-square items-start justify-start rounded-[10px] p-1.5 text-[11px] text-foreground/30">
                      {tx(cell)}
                    </span>
                  );
                }
                const isSelected = cell.day === selected.day;
                const strength = cell.profit === 0 ? 0 : 14 + (cell.profit / MAX_PROFIT) * 46;
                return (
                  <button
                    key={cell.day}
                    type="button"
                    onClick={() => setSelected(cell)}
                    aria-pressed={isSelected}
                    aria-label={`${longFmt.format(cell.date)}: ${cell.profit === 0 ? "hviledag" : fmtPct(cell.profit)}`}
                    style={{ backgroundColor: `color-mix(in oklab, var(--success) ${strength}%, transparent)` }}
                    className={`flex aspect-square flex-col items-start justify-between rounded-[10px] border p-1.5 text-left transition-colors hover:border-primary-glow ${
                      isSelected ? "border-primary-glow ring-2 ring-primary-glow/50" : "border-transparent"
                    }`}
                  >
                    <span className="text-[11px] font-semibold leading-none">{cell.date.getDate()}</span>
                    <span className="text-[9.5px] font-bold leading-none tabular-nums sm:text-[10.5px]">
                      {cell.profit === 0 ? "–" : cell.profit.toFixed(2).replace(".", ",")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sms-card rounded-[14px] p-4" aria-live="polite">
            <p className="text-[11px] font-semibold uppercase tracking-[1.8px] text-primary-glow">{tx("Dag")}{" "}{tx(selected.day)}</p>
            <p className="mt-1 text-[14px] font-semibold capitalize leading-5">{longFmt.format(selected.date)}</p>
            {selected.profit === 0 ? (
              <p className="mt-4 text-[13px] leading-5 text-foreground/75">{tx("Hviledag. Ingen surebets lagt denne dag.")}</p>
            ) : (
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-[11px] text-foreground/70">{tx("Resultat")}</dt>
                  <dd className="text-[24px] font-bold tabular-nums text-success">{fmtPct(selected.profit)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-foreground/70">{tx("Antal surebets")}</dt>
                  <dd className="text-[18px] font-bold tabular-nums">{tx(selected.surebets)}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] leading-[18px] text-foreground/75">{tx("Vi deler resultater, tips og feedback løbende i vores Telegram-gruppe.")}</p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-[13.5px] font-semibold"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {tx("Følg på Telegram")}</a>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
