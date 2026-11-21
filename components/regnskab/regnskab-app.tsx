"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Topbar } from "./Topbar";
import { KpiCards } from "./KpiCards";
import { ImportCoupon } from "./ImportCoupon";
import { ProfitChart } from "./ProfitChart";
import { SurebetsTable } from "./SurebetsTable";
import { BankrollCard } from "./BankrollCard";
import { ActivityCard } from "./ActivityCard";
import { AddSurebetDialog } from "./AddSurebetDialog";
import { AddDepositDialog } from "./AddDepositDialog";
import { MobileApp } from "./MobileApp";
import { Toaster } from "./ui/sonner";
import { useIsMobile } from "./use-mobile";
import {
  deleteSurebet,
  saveActivity,
  saveDeposit,
  saveSurebet,
  updateSurebetStatus,
  type RegnskabData,
} from "@/app/stats/regnskab-actions";
import { draftFromReading, emptyDraft, type CouponReading, type SurebetDraft } from "@/lib/regnskab/coupon";
import {
  buildBankroll,
  formatKr,
  summarize,
  type Activity,
  type Bookmaker,
  type ChartRange,
  type Deposit,
  type Surebet,
  type SurebetStatus,
} from "@/lib/regnskab/surebet";

type SaveResult = { ok: true } | { ok: false; message: string };

export function RegnskabApp({ initial }: { initial: RegnskabData }) {
  const [range, setRange] = useState<ChartRange>("30");
  const [surebets, setSurebets] = useState<Surebet[]>(initial.surebets);
  const [deposits, setDeposits] = useState<Deposit[]>(initial.deposits);
  const [activity, setActivity] = useState<Activity[]>(initial.activity);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<SurebetDraft>(() => emptyDraft());
  const [previews, setPreviews] = useState<string[] | null>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const isMobile = useIsMobile();
  // Charts need a visible box, so pick the layout's chart only once the screen size is known.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const today = new Date().toISOString().slice(0, 10);
  const bankroll = buildBankroll(deposits, surebets);
  const available = Object.fromEntries(bankroll.map((r) => [r.bookmaker, r.balance - r.active])) as Partial<Record<Bookmaker, number>>;
  const summary = summarize(surebets, bankroll, range, today);

  const persist = (result: Promise<SaveResult>) =>
    result.then((r) => {
      if (!r.ok) toast.error(r.message);
    });

  const log = (kind: Activity["kind"], text: string) => {
    const entry: Activity = { id: crypto.randomUUID(), date: today, kind, text };
    setActivity((a) => [entry, ...a]);
    void persist(saveActivity(entry));
  };

  const openAdd = () => {
    setPreviews(null);
    setDraft(emptyDraft());
    setDialogOpen(true);
  };

  const openFromCoupons = (images: [string, string], reading: CouponReading) => {
    setPreviews(images);
    setDraft(draftFromReading(reading, emptyDraft()));
    setDialogOpen(true);
  };

  const save = (s: Omit<Surebet, "id" | "status">) => {
    const row: Surebet = { ...s, id: crypto.randomUUID(), status: "Åben" };
    setSurebets((rows) => [row, ...rows]);
    void persist(saveSurebet(row));
    log("info", `Ny surebet registreret – Forventet profit: ${formatKr(s.expected - s.stake)}`);
    setDialogOpen(false);
    toast.success("Surebet gemt", { description: s.event });
  };

  const addDeposit = (d: Omit<Deposit, "id">) => {
    const row: Deposit = { ...d, id: crypto.randomUUID() };
    setDeposits((rows) => [...rows, row]);
    void persist(saveDeposit(row));
    log("info", `Indskud hos ${d.bookmaker}: ${formatKr(d.amount)}`);
    setDepositOpen(false);
    toast.success("Indskud gemt", { description: `${d.bookmaker} · ${formatKr(d.amount)}` });
  };

  const setStatus = (id: string, status: SurebetStatus, winner?: 0 | 1) => {
    const row = surebets.find((r) => r.id === id);
    if (!row || (row.status === status && row.winner === winner)) return;
    setSurebets((rows) =>
      rows.map((r) => {
        if (r.id !== id) return r;
        const { winner: _old, ...rest } = r;
        return status === "Vundet" && winner !== undefined ? { ...rest, status, winner } : { ...rest, status };
      }),
    );
    void persist(updateSurebetStatus(id, status, winner));
    if (status === "Vundet")
      log("won", `Surebet vundet hos ${winner !== undefined ? row.bookmakers[winner] : "bookmaker"} – Profit: ${formatKr(row.expected - row.stake)}`);
    if (status === "Tabt") log("lost", `Surebet tabt – Tab: ${formatKr(row.stake)}`);
    toast(`${row.event} markeret som ${status.toLowerCase()}`);
  };

  const remove = (id: string) => {
    const row = surebets.find((r) => r.id === id);
    setSurebets((rows) => rows.filter((r) => r.id !== id));
    void persist(deleteSurebet(id));
    if (row) toast("Surebet slettet", { description: row.event });
  };

  return (
    <div className="regnskab grid-bg min-h-dvh min-w-0 flex-1 bg-background text-foreground">
      <div className="md:hidden">
        <MobileApp
          summary={summary}
          surebets={surebets}
          bankroll={bankroll}
          activity={activity}
          range={range}
          onRangeChange={setRange}
          today={today}
          showChart={mounted && isMobile}
          onAdd={openAdd}
          onAddDeposit={() => setDepositOpen(true)}
          onAnalysed={openFromCoupons}
          onStatus={setStatus}
          onDelete={remove}
        />
      </div>
      <div className="mx-auto hidden max-w-[1500px] flex-col gap-5 p-4 sm:p-6 md:flex lg:p-8">
        <Topbar range={range} onRangeChange={setRange} />
        <KpiCards summary={summary} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <ImportCoupon onAnalysed={openFromCoupons} />
          {mounted && !isMobile && <ProfitChart surebets={surebets} today={today} range={range} onRangeChange={setRange} />}
        </div>
        <SurebetsTable rows={surebets} onAdd={openAdd} onStatus={setStatus} onDelete={remove} />
        <div className="grid gap-5 xl:grid-cols-2">
          <BankrollCard rows={bankroll} onAdd={() => setDepositOpen(true)} />
          <ActivityCard items={activity} />
        </div>
      </div>
      <AddSurebetDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={draft} imagePreviews={previews} available={available} onSave={save} />
      <AddDepositDialog open={depositOpen} onOpenChange={setDepositOpen} onSave={addDeposit} />
      <Toaster theme="dark" />
    </div>
  );
}
