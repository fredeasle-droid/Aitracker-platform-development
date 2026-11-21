"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/regnskab/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/regnskab/ui/dialog";
import { Input } from "@/components/regnskab/ui/input";
import { Label } from "@/components/regnskab/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/regnskab/ui/select";
import { BOOKMAKERS, type Bookmaker, type Deposit } from "@/lib/regnskab/surebet";
import { BookmakerBadge } from "./BookmakerBadge";

export function AddDepositDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (d: Omit<Deposit, "id">) => void;
}) {
  const [bookmaker, setBookmaker] = useState<Bookmaker>("bet365");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setAmount("");
      setError(null);
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount.replace(/\./g, "").replace(",", "."));
    if (!(value > 0)) return setError("Skriv et beløb over 0 kr.");
    onSave({ bookmaker, amount: value, date });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-primary-glow/40 sm:max-w-md sm:rounded-2xl max-md:inset-x-0 max-md:bottom-0 max-md:left-0 max-md:top-auto max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-t-3xl max-md:rounded-b-none max-md:border-x-0 max-md:border-b-0 max-md:px-5 max-md:pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-md:data-[state=open]:slide-in-from-bottom max-md:data-[state=closed]:slide-out-to-bottom">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Tilføj indskud</DialogTitle>
          <DialogDescription>Vælg bookmaker og skriv, hvor meget du har sat ind.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Bookmaker</Label>
            <Select value={bookmaker} onValueChange={(v) => setBookmaker(v as Bookmaker)}>
              <SelectTrigger className="bg-secondary/60" aria-label="Bookmaker">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass">
                {BOOKMAKERS.map((bm) => (
                  <SelectItem key={bm} value={bm}>
                    <BookmakerBadge name={bm} className="h-6" />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
            <div className="grid gap-2">
              <Label htmlFor="deposit-amount">Indskud (kr.)</Label>
              <Input
                id="deposit-amount"
                inputMode="decimal"
                placeholder="F.eks. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-secondary/60 text-lg font-semibold"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deposit-date">Dato</Label>
              <Input id="deposit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-secondary/60" />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuller
            </Button>
            <Button type="submit" className="rounded-xl bg-gradient-primary text-primary-foreground glow-primary hover:opacity-90">
              Gem indskud
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
