"use client";
import { useState } from "react";
import { ArrowLeftRight, Bitcoin, Check, ChevronDown, Info, MapPin, Minus, Search, X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { bookmakerCategories, bookmakers, surebets, visibleSurebets, type BookmakerCategory, type BookmakerId } from "./data";
import { BookmakerBadge, BookmakerMark } from "./BookmakerMark";
import { useBookmakerFilter } from "./bookmaker-filter";
import { cn } from "@/lib/utils";

const categoryIcon: Record<BookmakerCategory, typeof MapPin> = { local: MapPin, exchange: ArrowLeftRight, crypto: Bitcoin };

const countFor = (id: BookmakerId) => surebets.filter((b) => b.legs.some((l) => l.bookmaker === id)).length;

function TriggerLabel() {
  const { selected, allOn } = useBookmakerFilter();
  const shown = selected.slice(0, 3);
  const extra = selected.length - shown.length;
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {selected.length > 0 && (
        <span className="hidden -space-x-2 sm:flex">
          {shown.map((id) => (
            <BookmakerBadge key={id} id={id} className="h-6 w-6 text-[8px] ring-2 ring-surface-deep" />
          ))}
          {extra > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-elevated px-1 text-[10px] font-bold text-foreground ring-2 ring-surface-deep">+{extra}</span>
          )}
        </span>
      )}
      <span className="truncate">
        {allOn ? (
          <>
            <span className="sm:hidden">Bookmakere</span>
            <span className="hidden sm:inline">Alle bookmakere</span>
          </>
        ) : selected.length === 0 ? (
          "Ingen valgt"
        ) : (
          `${selected.length} bookmakere`
        )}
      </span>
    </span>
  );
}

/** Square checkbox with three looks: on, partly on (group), off. */
function CheckMark({ state, small }: { state: "on" | "some" | "off"; small?: boolean }) {
  const Icon = state === "some" ? Minus : Check;
  return (
    <span className={cn("bk-check flex shrink-0 items-center justify-center rounded-md", small ? "h-[18px] w-[18px]" : "h-5 w-5", state !== "off" && "bk-check-on")}>
      <Icon
        className={cn("text-primary-foreground transition duration-200", small ? "h-3 w-3" : "h-3.5 w-3.5", state === "off" ? "scale-50 opacity-0" : "scale-100 opacity-100")}
        strokeWidth={3.5}
      />
    </span>
  );
}

function Tile({ id, name }: { id: BookmakerId; name: string }) {
  const { isOn, toggle } = useBookmakerFilter();
  const on = isOn(id);
  const n = countFor(id);
  return (
    <button role="checkbox" aria-checked={on} aria-label={name} onClick={() => toggle(id)} className={cn("bk-option flex flex-col gap-2 rounded-xl p-2.5 text-left", on && "bk-option-on")}>
      <span className="flex w-full items-start justify-between gap-2">
        <span className={cn("flex h-8 min-w-0 items-center transition duration-300", !on && "opacity-40 grayscale")}>
          <BookmakerMark id={id} />
        </span>
        <CheckMark state={on ? "on" : "off"} small />
      </span>
      <span className="flex items-center gap-1.5 text-[11px] leading-none text-muted-foreground">
        <span className={cn("h-1.5 w-1.5 rounded-full", n > 0 ? "bg-success" : "bg-muted-foreground/50")} />
        {n === 0 ? "Ingen i dag" : `${n} ${n === 1 ? "surebet" : "surebets"} i dag`}
      </span>
    </button>
  );
}

function Group({ id, name, hint, ids }: { id: BookmakerCategory; name: string; hint: string; ids: BookmakerId[] }) {
  const { selected, toggleMany } = useBookmakerFilter();
  const Icon = categoryIcon[id];
  const all = bookmakers.filter((b) => b.category === id).map((b) => b.id);
  const allOnCount = all.filter((x) => selected.includes(x)).length;
  const state = allOnCount === all.length ? "on" : allOnCount === 0 ? "off" : "some";
  return (
    <section>
      <div className="bk-group-head sticky top-0 z-10 flex items-center gap-2.5 px-3 py-2">
        <span className="bk-group-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
          <Icon className="h-3.5 w-3.5 text-cyan" strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="flex items-center gap-2 text-[13px] font-bold">
            {name}
            <span className="rounded-full bg-surface-elevated px-1.5 py-px text-[10.5px] font-bold tabular-nums text-muted-foreground">
              {allOnCount}/{all.length}
            </span>
          </div>
          <div className="truncate text-[11px] text-muted-foreground">{hint}</div>
        </div>
        <button
          role="checkbox"
          aria-checked={state === "on" ? true : state === "some" ? "mixed" : false}
          aria-label={`Alle ${name.toLowerCase()}`}
          onClick={() => toggleMany(all)}
          className="flex items-center gap-2 rounded-lg px-2 py-1 text-[11.5px] font-semibold text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
        >
          {state === "on" ? "Fravælg" : "Vælg alle"}
          <CheckMark state={state} small />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1.5 px-2.5 pb-3 pt-1">
        {bookmakers
          .filter((b) => ids.includes(b.id))
          .map((b) => (
            <Tile key={b.id} id={b.id} name={b.name} />
          ))}
      </div>
    </section>
  );
}

export function BookmakerFilter() {
  const { selectAll, clear, allOn, selected } = useBookmakerFilter();
  const [q, setQ] = useState("");
  const shownCount = visibleSurebets(surebets, selected).length;
  const needle = q.trim().toLowerCase();
  const groups = bookmakerCategories
    .map((c) => ({ ...c, ids: bookmakers.filter((b) => b.category === c.id && b.name.toLowerCase().includes(needle)).map((b) => b.id) }))
    .filter((g) => g.ids.length > 0);
  return (
    <Popover onOpenChange={(o) => !o && setQ("")}>
      <PopoverTrigger
        className={cn(
          "chip-surface group flex min-w-0 flex-1 items-center justify-between gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-medium text-foreground transition sm:flex-none sm:px-3.5 data-[state=open]:border-primary-glow data-[state=open]:shadow-glow",
          allOn ? "border-border hover:border-border-glow" : "border-primary-glow/70 shadow-glow",
        )}
      >
        <TriggerLabel />
        <span className="flex items-center gap-1.5">
          {!allOn && (
            <span className="rounded-full bg-primary px-1.5 py-px text-[10.5px] font-bold text-primary-foreground">
              {selected.length}/{bookmakers.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className="bk-popover flex max-h-[min(640px,var(--radix-popover-content-available-height))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border-border-glow p-0"
      >
        <div className="edge-light shrink-0 border-b border-border px-4 pb-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[15px] font-bold">Bookmakere</div>
              <div className="mt-0.5 text-[12px] text-muted-foreground">Vælg dem, du har konto hos</div>
            </div>
            <div className="flex items-center gap-1 text-[12px] font-semibold">
              <button onClick={selectAll} disabled={allOn} className="rounded-md px-2 py-1 text-primary-glow transition hover:bg-surface-elevated disabled:opacity-40 disabled:hover:bg-transparent">
                Vælg alle
              </button>
              <span className="h-3 w-px bg-border" />
              <button
                onClick={clear}
                disabled={selected.length === 0}
                className="rounded-md px-2 py-1 text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Ryd
              </button>
            </div>
          </div>
          <label className="bk-search mt-3 flex items-center gap-2 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Søg blandt ${bookmakers.length} bookmakere...`}
              className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-hidden"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Ryd søgning" className="rounded p-0.5 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>
        </div>

        <div className="bk-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pt-1">
          {groups.map((g) => (
            <Group key={g.id} id={g.id} name={g.name} hint={g.hint} ids={g.ids} />
          ))}
          {groups.length === 0 && <div className="px-4 py-10 text-center text-[13px] text-muted-foreground">Ingen bookmakere matcher “{q}”.</div>}
          <div className="mx-2.5 mb-2.5 flex items-start gap-2 rounded-lg bg-surface-elevated/60 px-3 py-2 text-[11.5px] leading-snug text-muted-foreground">
            <Info className="mt-px h-3.5 w-3.5 shrink-0 text-cyan" />
            Et surebet vises kun, når begge dets bookmakere er valgt.
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface-deep/60 px-4 py-3">
          <span className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
            <span className={cn("h-2 w-2 rounded-full", shownCount > 0 ? "glow-dot bg-success" : "bg-muted-foreground")} />
            Viser <b className="font-bold tabular-nums text-foreground">{shownCount}</b> af {surebets.length} surebets
          </span>
          <PopoverClose className="bg-gradient-primary btn-shine relative overflow-hidden rounded-lg px-4 py-1.5 text-[13px] font-bold text-primary-foreground shadow-glow transition hover:brightness-110 active:scale-[0.98]">
            Færdig
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
