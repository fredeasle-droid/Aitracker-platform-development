"use client";
import { useRef, useState } from "react";
import { Calculator, Camera, CheckCircle2, CloudUpload, Info, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/regnskab/ui/button";
import { analyseCoupons } from "@/lib/regnskab/analyse-client";
import { couponsReady, type CouponReading } from "@/lib/regnskab/coupon";
import { cn } from "@/lib/utils";

type Slot = string | null;

/** Shrink large screenshots before sending them to keep uploads fast. */
export async function downscale(dataUrl: string, max = 1600): Promise<string> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function CouponSlot({
  index,
  image,
  disabled,
  onImage,
  onClear,
}: {
  index: number;
  image: Slot;
  disabled: boolean;
  onImage: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const readFile = (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Kun billeder i JPG eller PNG understøttes");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => downscale(String(reader.result)).then(onImage, () => toast.error("Billedet kunne ikke læses"));
    reader.readAsDataURL(file);
  };

  const takeScreenshot = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      toast.error("Din browser understøtter ikke skærmbilleder");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      await video.play();
      await new Promise((r) => setTimeout(r, 300));
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      stream.getTracks().forEach((t) => t.stop());
      onImage(await downscale(canvas.toDataURL("image/png")));
    } catch {
      toast("Skærmbillede annulleret");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-bold tracking-[0.14em]">
        <span className={image ? "text-neon" : "text-muted-foreground"}>KUPON {index + 1}</span>
        {image && <CheckCircle2 className="h-4 w-4 text-neon" />}
      </div>
      {image ? (
        <div className="relative overflow-hidden rounded-xl border border-neon/40 bg-neon/5">
          <img src={image} alt={`Kupon ${index + 1}`} className="h-36 w-full object-cover" />
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            aria-label={`Fjern kupon ${index + 1}`}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            readFile(e.dataTransfer.files[0]);
          }}
          className={cn(
            "grid h-36 grid-cols-2 rounded-xl border-2 border-dashed border-primary-glow/50 bg-primary/5 transition-all",
            dragging && "border-neon bg-neon/10 shadow-[var(--shadow-neon)]",
          )}
        >
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileRef.current?.click()}
            aria-label={`Upload billede af kupon ${index + 1}`}
            className="group flex flex-col items-center justify-center gap-1.5 rounded-l-xl px-2 transition-colors hover:bg-primary/10"
          >
            <CloudUpload className="h-7 w-7 text-primary-glow transition-transform group-hover:-translate-y-1" />
            <span className="text-sm font-semibold">Upload</span>
            <span className="text-[11px] text-muted-foreground">JPG, PNG</span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={takeScreenshot}
            aria-label={`Tag screenshot af kupon ${index + 1}`}
            className="group relative flex flex-col items-center justify-center gap-1.5 rounded-r-xl px-2 transition-colors before:absolute before:inset-y-4 before:left-0 before:w-px before:bg-primary-glow/40 hover:bg-primary/10"
          >
            <Camera className="h-7 w-7 text-primary-glow transition-transform group-hover:scale-110" />
            <span className="text-sm font-semibold">Screenshot</span>
            <span className="text-[11px] text-muted-foreground">fra skærmen</span>
          </button>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        data-testid={`coupon-file-${index + 1}`}
        onChange={(e) => {
          readFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function ImportCoupon({
  onAnalysed,
}: {
  onAnalysed: (images: [string, string], reading: CouponReading) => void;
}) {
  const [images, setImages] = useState<[Slot, Slot]>([null, null]);
  const [busy, setBusy] = useState(false);
  const ready = couponsReady(images);
  const count = images.filter(Boolean).length;

  const setSlot = (i: 0 | 1, v: Slot) => setImages((prev) => (i === 0 ? [v, prev[1]] : [prev[0], v]));

  const calculate = async () => {
    if (!couponsReady(images)) return;
    setBusy(true);
    try {
      const res = await analyseCoupons(images);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      onAnalysed(images, res.reading);
      setImages([null, null]);
    } catch {
      toast.error("Analysen mislykkedes. Prøv igen om lidt.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="glass flex flex-col rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <CloudUpload className="h-9 w-9 shrink-0 text-primary-glow drop-shadow-[0_0_10px_var(--primary-glow)]" />
        <div>
          <h2 className="font-display text-xl font-semibold">Importer dit surebet coupon</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Upload begge kuponer – én fra hver bookmaker. Når begge billeder er uploadet, beregner vi din surebet og profit.
          </p>
        </div>
      </div>

      <div className="mt-5 grid flex-1 gap-4 sm:grid-cols-2">
        {([0, 1] as const).map((i) => (
          <CouponSlot
            key={i}
            index={i}
            image={images[i]}
            disabled={busy}
            onImage={(v) => setSlot(i, v)}
            onClear={() => setSlot(i, null)}
          />
        ))}
      </div>

      <Button
        type="button"
        disabled={!ready || busy}
        onClick={calculate}
        className="mt-5 h-11 rounded-xl bg-gradient-primary text-primary-foreground glow-primary hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
        {busy ? "Analyserer kuponer…" : ready ? "Beregn surebet" : `Upload ${2 - count} kupon${2 - count === 1 ? "" : "er"} mere`}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Info className="h-4 w-4 text-primary-glow" /> {count}/2 kuponer uploadet
      </p>
    </section>
  );
}
