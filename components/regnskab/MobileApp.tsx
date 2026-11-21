"use client";
import { useRef, useState } from "react";
import { Camera, ImagePlus, Landmark, PenLine } from "lucide-react";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/regnskab/ui/drawer";
import type { CouponReading } from "@/lib/regnskab/coupon";
import type { Activity, BankrollRow, ChartRange, Summary, Surebet, SurebetStatus } from "@/lib/regnskab/surebet";
import { BottomNav, type MobileTab } from "./MobileShell";
import { MobileOverview } from "./MobileOverview";
import { MobileBets } from "./MobileBets";
import { MobileBankroll } from "./MobileBankroll";
import { MobileImport, useCouponScan } from "./MobileImport";

export function MobileApp(props: {
  summary: Summary;
  surebets: Surebet[];
  bankroll: BankrollRow[];
  activity: Activity[];
  range: ChartRange;
  onRangeChange: (r: ChartRange) => void;
  today: string;
  showChart: boolean;
  onAdd: () => void;
  onAddDeposit: () => void;
  onAnalysed: (images: [string, string], reading: CouponReading) => void;
  onStatus: (id: string, status: SurebetStatus, winner?: 0 | 1) => void;
  onDelete: (id: string) => void;
}) {
  const [tab, setTab] = useState<MobileTab>("overblik");
  const [newOpen, setNewOpen] = useState(false);

  const go = (t: MobileTab) => {
    setTab(t);
    window.scrollTo({ top: 0 });
  };

  const openCount = props.surebets.filter((s) => s.status === "Åben").length;
  const inPlay = props.bankroll.reduce((s, r) => s + r.active, 0);

  const scan = useCouponScan(props.onAnalysed);
  const camRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const scanCard = <MobileImport scan={scan} />;

  // After picking from the + button, show the scan card so the user sees what is missing or being read.
  const showScan = (files: FileList | null) => {
    if (!files?.length) return;
    scan.addFiles(files);
    setTab("overblik");
    setTimeout(() => document.getElementById("mobile-import")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };

  // File pickers must open inside the tap itself, so these choices click the hidden inputs directly.
  const choices = [
    {
      icon: Camera,
      title: "Tag billede af kupon",
      text: "Fotografér kuponen – AI sætter den ind i beregneren",
      run: () => camRef.current?.click(),
    },
    {
      icon: ImagePlus,
      title: "Upload screenshots",
      text: "Vælg begge kuponer på én gang",
      run: () => uploadRef.current?.click(),
    },
    { icon: PenLine, title: "Tilføj manuelt", text: "Skriv kamp, odds og indsats selv", run: props.onAdd },
    { icon: Landmark, title: "Nyt indskud", text: "Registrér penge sat ind hos en bookmaker", run: props.onAddDeposit },
  ];

  return (
    <div className="grid-bg min-h-dvh pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <main className="flex flex-col gap-4 px-4 pt-4">
        {tab === "overblik" && (
          <MobileOverview
            summary={props.summary}
            surebets={props.surebets}
            bankroll={props.bankroll}
            activity={props.activity}
            range={props.range}
            onRangeChange={props.onRangeChange}
            today={props.today}
            showChart={props.showChart}
            openCount={openCount}
            inPlay={inPlay}
            onGoBets={() => go("bets")}
            onGoBankroll={() => go("bankroll")}
            onAdd={props.onAdd}
            onAddDeposit={props.onAddDeposit}
            onStatus={props.onStatus}
            onDelete={props.onDelete}
            scanCard={scanCard}
          />
        )}
        {tab === "bets" && (
          <MobileBets
            rows={props.surebets}
            onAdd={props.onAdd}
            scanCard={scanCard}
            onStatus={props.onStatus}
            onDelete={props.onDelete}
          />
        )}
        {tab === "bankroll" && <MobileBankroll rows={props.bankroll} onAdd={props.onAddDeposit} />}
      </main>

      <input
        ref={camRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          showScan(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          showScan(e.target.files);
          e.target.value = "";
        }}
      />

      <BottomNav tab={tab} onTab={go} onNew={() => setNewOpen(true)} />

      <Drawer open={newOpen} onOpenChange={setNewOpen}>
        <DrawerContent className="rg-glass border-border">
          <DrawerHeader className="text-left">
            <DrawerTitle className="font-display text-xl">Hvad vil du tilføje?</DrawerTitle>
            <DrawerDescription>Vælg hvordan du vil registrere.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-2 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            {choices.map((c) => (
              <button
                key={c.title}
                type="button"
                onClick={() => {
                  c.run();
                  setNewOpen(false);
                }}
                className="flex items-center gap-4 rounded-2xl border border-border bg-secondary/50 p-4 text-left active:bg-accent"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl rg-bg-gradient-primary text-primary-foreground rg-glow-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{c.title}</span>
                  <span className="block text-xs text-muted-foreground">{c.text}</span>
                </span>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
