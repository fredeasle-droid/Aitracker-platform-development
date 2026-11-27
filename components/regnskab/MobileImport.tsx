"use client";
import { useLocale } from "@/components/locale-provider";
import { useEffect, useRef, useState } from "react";
import { Calculator, Camera, CheckCircle2, ImagePlus, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/regnskab/ui/button";
import { analyseCoupons } from "@/lib/regnskab/analyse-client";
import { couponsReady, type CouponReading } from "@/lib/regnskab/coupon";
import { downscale } from "./ImportCoupon";

type Slot = string | null;
type Pair = [Slot, Slot];

/**
 * Coupon scan state shared by every place on the phone that can add coupon pictures
 * (overview, bets tab, + button). Once both pictures are in, the reading starts by itself
 * and the result opens the surebet calculator – the same flow as the desktop import.
 */
export function useCouponScan(onAnalysed: (images: [string, string], reading: CouponReading) => void) {
  const [images, setImages] = useState<Pair>([null, null]);
  const [busy, setBusy] = useState(false);
  const tried = useRef<Pair>([null, null]);
  const setSlot = (i: 0 | 1, v: Slot) => setImages((p) => (i === 0 ? [v, p[1]] : [p[0], v]));

  // Phones may hand over HEIC or files without a type; any image the browser can draw is turned into a JPEG.
  const readFile = (i: 0 | 1, file: File | undefined) => {
    if (!file) return;
    if (file.type && !file.type.startsWith("image/")) {
      toast.error("Vælg et billede af kuponen");
      return;
    }
    const url = URL.createObjectURL(file);
    downscale(url)
      .then((v) => setSlot(i, v), () => toast.error("Billedet kunne ikke læses", { description: "Prøv et screenshot i JPG eller PNG." }))
      .finally(() => URL.revokeObjectURL(url));
  };

  /** Picking two pictures fills both coupons: the first goes to the tapped slot, the second to the other. */
  const readFiles = (i: 0 | 1, files: FileList | null) => {
    const list = Array.from(files ?? []).slice(0, 2);
    readFile(i, list[0]);
    if (list[1]) readFile(i === 0 ? 1 : 0, list[1]);
  };

  /** From the + button: fill the first empty coupon, or start a new pair when both are taken or two are picked. */
  const addFiles = (files: FileList | null) => {
    const list = Array.from(files ?? []).slice(0, 2);
    if (!list.length) return;
    if (list.length === 2 || (images[0] && images[1])) {
      setImages([null, null]);
      readFiles(0, files);
      return;
    }
    readFile(images[0] ? 1 : 0, list[0]);
  };

  const calculate = async () => {
    if (!couponsReady(images) || busy) return;
    tried.current = images;
    setBusy(true);
    try {
      const res = await analyseCoupons(images);
      if (!res.ok) return void toast.error(res.message);
      onAnalysed(images, res.reading);
      setImages([null, null]);
    } catch {
      toast.error("Analysen mislykkedes. Prøv igen om lidt.");
    } finally {
      setBusy(false);
    }
  };

  // Start reading as soon as a new pair is complete; a failed pair is not retried until the user taps again.
  useEffect(() => {
    if (couponsReady(images) && !busy && (tried.current[0] !== images[0] || tried.current[1] !== images[1])) void calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  return { images, busy, setSlot, readFile, readFiles, addFiles, calculate };
}

export type CouponScan = ReturnType<typeof useCouponScan>;

export function MobileImport({ scan }: { scan: CouponScan }) {
  const { tx } = useLocale();
  const { images, busy, setSlot, readFile, readFiles, calculate } = scan;
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)] as const;
  const camRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)] as const;
  const ready = couponsReady(images);
  const count = images.filter(Boolean).length;

  return (
    <section id="mobile-import" className="rg-glass scroll-mt-20 rounded-3xl p-4">
      <div className="flex items-center gap-2">
        <span className="icon-chip h-8 w-8">
          <Sparkles className="h-4 w-4 text-neon" />
        </span>
        <h2 className="font-display text-base font-semibold">{tx("Scan dine kuponer")}</h2>
        <span className="rounded-md border border-neon/30 bg-neon/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-neon">{tx("AI")}</span>
        <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">{tx(count)}/2</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {tx("Upload eller tag billede af begge kuponer – én fra hver bookmaker. Så læser vi dem og sætter alt ind i beregneren for dig.")}</p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {([0, 1] as const).map((i) => {
          const img = images[i];
          return (
            <div key={i} className="relative">
              {img ? (
                <div className="relative h-32 overflow-hidden rounded-2xl border border-neon/50">
                  <img src={img} alt={`Kupon ${i + 1}`} className="h-full w-full object-cover" />
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-bold text-neon">
                    <CheckCircle2 className="h-3 w-3" /> {" "}{tx("KUPON")}{" "}{i + 1}
                  </span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setSlot(i, null)}
                    aria-label={`Fjern kupon ${i + 1}`}
                    className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="h-32 overflow-hidden rounded-2xl border-2 border-dashed border-primary-glow/50 bg-primary/5">
                  <div className="flex h-8 items-center justify-center text-[11px] font-bold tracking-[0.14em] text-muted-foreground">{tx("KUPON")}{" "}{i + 1}</div>
                  <div className="grid h-[calc(100%-2rem)] grid-cols-2 divide-x divide-primary-glow/30">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => refs[i].current?.click()}
                      aria-label={`Vælg billede af kupon ${i + 1}`}
                      className="flex flex-col items-center justify-center gap-1 active:bg-primary/15"
                    >
                      <ImagePlus className="h-6 w-6 text-primary-glow" />
                      <span className="text-xs font-semibold">{tx("Upload")}</span>
                      <span className="text-[10px] text-muted-foreground">{tx("billede")}</span>
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => camRefs[i].current?.click()}
                      aria-label={`Tag billede af kupon ${i + 1}`}
                      className="flex flex-col items-center justify-center gap-1 active:bg-primary/15"
                    >
                      <Camera className="h-6 w-6 text-primary-glow" />
                      <span className="text-xs font-semibold">{tx("Kamera")}</span>
                      <span className="text-[10px] text-muted-foreground">{tx("tag billede")}</span>
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={camRefs[i]}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  readFile(i, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <input
                ref={refs[i]}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  readFiles(i, e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        disabled={!ready || busy}
        onClick={calculate}
        className="mt-3 h-12 w-full rounded-2xl rg-bg-gradient-primary text-base font-semibold text-primary-foreground rg-glow-primary disabled:opacity-40 disabled:shadow-none"
      >
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Calculator className="h-5 w-5" />}
        {busy ? tx("Læser kuponer…") : ready ? tx("Beregn surebet") : `Mangler ${2 - count} kupon${2 - count === 1 ? "" : "er"}`}
      </Button>
    </section>
  );
}
