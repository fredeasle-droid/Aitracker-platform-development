"use client";
import { useLocale } from "@/components/locale-provider";
import { useEffect, useState } from "react";
import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";

import { Button } from "@/components/regnskab/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/regnskab/ui/dialog";
import { Input } from "@/components/regnskab/ui/input";
import { Label } from "@/components/regnskab/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/regnskab/ui/select";
import {
  BOOKMAKERS,
  formatKr,
  isSurebet,
  surebetMargin,
  surebetPayout,
  surebetStakes,
  type Bookmaker,
  type Surebet,
} from "@/lib/regnskab/surebet";
import { emptyDraft, type SurebetDraft } from "@/lib/regnskab/coupon";
import { BookmakerBadge } from "./BookmakerBadge";

export { emptyDraft, type SurebetDraft };

const toNum = (v: string) => Number(v.replace(",", "."));

export function AddSurebetDialog({
  open,
  onOpenChange,
  initial,
  imagePreviews,
  available,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: SurebetDraft;
  imagePreviews?: string[] | null;
  /** Money free to bet per bookmaker, from the bankroll. */
  available?: Partial<Record<Bookmaker, number>>;
  onSave: (s: Omit<Surebet, "id" | "status">) => void;
}) {
  const { tx } = useLocale();
  const [draft, setDraft] = useState<SurebetDraft>(initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(initial);
      setError(null);
    }
  }, [open, initial]);

  const set = <K extends keyof SurebetDraft>(k: K, v: SurebetDraft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const a = toNum(draft.oddsA);
  const b = toNum(draft.oddsB);
  const stake = toNum(draft.stake);
  const valid = a > 1 && b > 1 && stake > 0;
  const payout = valid ? surebetPayout(stake, a, b) : 0;
  const [stakeA, stakeB] = valid ? surebetStakes(stake, a, b) : [0, 0];
  const margin = valid ? surebetMargin(a, b) : 0;
  const edge = valid && isSurebet(a, b);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.event.trim()) return setError("Skriv navnet på kampen eller eventet.");
    if (!valid) return setError("Odds skal være over 1,00 og indsatsen over 0 kr.");
    if (draft.bookmakerA === draft.bookmakerB) return setError("Vælg to forskellige bookmakere.");
    onSave({
      date: draft.date,
      event: draft.event.trim(),
      bookmakers: [draft.bookmakerA, draft.bookmakerB],
      odds: [a, b],
      stake,
      expected: Math.round(payout),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rg-glass max-h-[92vh] overflow-y-auto border-primary-glow/40 sm:max-w-2xl sm:rounded-2xl max-md:inset-x-0 max-md:bottom-0 max-md:left-0 max-md:top-auto max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-t-3xl max-md:rounded-b-none max-md:border-x-0 max-md:border-b-0 max-md:px-5 max-md:pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-md:data-[state=open]:slide-in-from-bottom max-md:data-[state=closed]:slide-out-to-bottom">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {imagePreviews?.length ? tx("Kuponer analyseret") : tx("Tilføj surebet")}
          </DialogTitle>
          <DialogDescription>
            {imagePreviews?.length
              ? tx("Vi har udfyldt felterne ud fra dine 2 kuponer. Tjek dem, før du gemmer.")
              : tx("Indtast kamp, bookmakere og odds – vi beregner fordelingen og din gevinst.")}
          </DialogDescription>
        </DialogHeader>

        {imagePreviews?.length ? (
          <div className="flex items-center gap-4 rounded-xl border border-neon/30 bg-neon/5 p-3 max-md:flex-wrap max-md:gap-3">
            {imagePreviews.map((src, i) => (
              <img key={i} src={src} alt={`Kupon ${i + 1}`} className="h-20 w-28 rounded-lg object-cover" />
            ))}
            <div className="flex items-center gap-2 text-sm text-neon">
              <Sparkles className="h-4 w-4" /> {" "}{tx("Begge kuponer læst – felterne er udfyldt")}</div>
          </div>
        ) : null}

        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
            <div className="grid gap-2">
              <Label htmlFor="event">{tx("Kamp / Event")}</Label>
              <Input id="event" placeholder={tx("F.eks. Arsenal – Chelsea")} value={draft.event} onChange={(e) => set("event", e.target.value)} className="bg-secondary/60" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">{tx("Dato")}</Label>
              <Input id="date" type="date" value={draft.date} onChange={(e) => set("date", e.target.value)} className="bg-secondary/60" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {([tx("A"), tx("B")] as const).map((side) => {
              const bmKey = side === "A" ? "bookmakerA" : "bookmakerB";
              const oddsKey = side === "A" ? "oddsA" : "oddsB";
              return (
                <div key={side} className="grid gap-3 rounded-xl border border-border bg-secondary/40 p-3 md:p-4">
                  <div className="text-xs font-bold tracking-[0.14em] text-neon">{tx("UDFALD")}{" "}{side === "A" ? "1" : "2"}</div>
                  <div className="grid gap-2">
                    <Label>{tx("Bookmaker")}</Label>
                    <Select value={draft[bmKey]} onValueChange={(v) => set(bmKey, v as Bookmaker)}>
                      <SelectTrigger className="bg-secondary/60" aria-label={`Bookmaker for udfald ${side === "A" ? 1 : 2}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rg-glass">
                        {BOOKMAKERS.map((bm) => (
                          <SelectItem key={bm} value={bm}>
                            <BookmakerBadge name={bm} className="h-6" />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`odds${side}`}>{tx("Odds")}</Label>
                    <Input id={`odds${side}`} inputMode="decimal" placeholder="2.10" value={draft[oddsKey]} onChange={(e) => set(oddsKey, e.target.value)} className="bg-secondary/60 text-lg font-semibold" />
                  </div>
                  {valid && (
                    <div className="text-sm text-muted-foreground">
                      {tx("Indsats:")}{" "}<span className="font-semibold text-foreground">{formatKr(side === "A" ? stakeA : stakeB)}</span>
                    </div>
                  )}
                  {valid && available && (() => {
                    const free = available[draft[bmKey]] ?? 0;
                    const need = side === "A" ? stakeA : stakeB;
                    return need > free + 0.005 ? (
                      <div className="flex items-start gap-1.5 text-xs text-destructive">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {tx("Du har kun")}{" "}{formatKr(free)} {" "}{tx("tilgængelig hos")}{" "}{tx(draft[bmKey])}.
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">{tx("Tilgængelig:")}{" "}{formatKr(free)}</div>
                    );
                  })()}
                </div>
              );
            })}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stake">{tx("Samlet indsats (kr.)")}</Label>
            <Input id="stake" inputMode="decimal" value={draft.stake} onChange={(e) => set("stake", e.target.value)} className="bg-secondary/60 text-lg font-semibold" />
          </div>

          {valid && (
            <div
              className={
                edge
                  ? "flex items-center justify-between rounded-xl border border-success/50 bg-success/10 p-4"
                  : "flex items-center justify-between rounded-xl border border-destructive/50 bg-destructive/10 p-4"
              }
            >
              <div className="flex items-center gap-3">
                {edge ? <TrendingUp className="h-6 w-6 text-success" /> : <AlertTriangle className="h-6 w-6 text-destructive" />}
                <div>
                  <div className={edge ? "font-semibold text-success" : "font-semibold text-destructive"}>
                    {edge ? tx("Garanteret profit") : tx("Ikke en surebet")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tx("Udbetaling")}{" "}{formatKr(payout)} {" "}{tx("· margin")}{" "}{margin.toFixed(2).replace(".", ",")} %
                  </div>
                </div>
              </div>
              <div className={edge ? "font-display text-2xl font-bold text-success" : "font-display text-2xl font-bold text-destructive"}>
                {payout - stake >= 0 ? "+" : ""}
                {formatKr(payout - stake)}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{tx(error)}</p>}

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {tx("Annuller")}</Button>
            <Button type="submit" className="rounded-xl rg-bg-gradient-primary text-primary-foreground rg-glow-primary hover:opacity-90">
              {tx("Gem surebet")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
