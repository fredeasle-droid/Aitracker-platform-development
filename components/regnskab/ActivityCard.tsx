"use client";
import { useState } from "react";
import { ArrowRight, Check, Clock, Info, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/regnskab/ui/dialog";
import { formatDate, type Activity } from "@/lib/regnskab/surebet";

function ActivityIcon({ kind }: { kind: Activity["kind"] }) {
  const Icon = kind === "won" ? Check : kind === "lost" ? X : Info;
  return (
    <span
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
        kind === "won" && "bg-success text-success-foreground shadow-[0_0_12px_var(--success)]",
        kind === "info" && "bg-primary text-primary-foreground shadow-[0_0_12px_var(--primary)]",
        kind === "lost" && "bg-destructive text-destructive-foreground shadow-[0_0_12px_var(--destructive)]",
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={3} />
    </span>
  );
}

function Row({ a }: { a: Activity }) {
  return (
    <li className="flex items-center gap-4 border-b border-border/60 py-2.5 last:border-0">
      <ActivityIcon kind={a.kind} />
      <span className="w-24 shrink-0 text-sm tabular-nums text-muted-foreground">{formatDate(a.date)}</span>
      <span className="text-sm">{a.text}</span>
    </li>
  );
}

export function ActivityCard({ items }: { items: Activity[] }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="rg-glass rounded-2xl p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary-glow drop-shadow-[0_0_10px_var(--primary-glow)]" />
          <h2 className="font-display text-xl font-semibold">Seneste aktivitet</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-sm font-semibold text-primary-glow transition-colors hover:text-neon"
        >
          <Plus className="h-4 w-4" /> Se alle <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <ul className="mt-3">
        {items.slice(0, 3).map((a) => (
          <Row key={a.id} a={a} />
        ))}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rg-glass max-h-[85vh] overflow-y-auto border-primary-glow/40 sm:max-w-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Al aktivitet</DialogTitle>
            <DialogDescription>{items.length} hændelser i dit surebet-regnskab</DialogDescription>
          </DialogHeader>
          <ul>
            {items.map((a) => (
              <Row key={a.id} a={a} />
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </section>
  );
}
