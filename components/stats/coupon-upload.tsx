'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, Camera, CheckCircle2, CloudUpload, Info, Loader2, Trash2, X } from 'lucide-react'
import { saveCouponBets } from '@/app/actions'
import { MAX_COUPON_BETS, type CouponBet } from '@/lib/coupon'
import { cn } from '@/lib/utils'

const MAX_SIDE = 1600
const SLOTS = [0, 1] as const
type Slot = string | null

function bitmapToDataUrl(bitmap: ImageBitmap) {
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.85)
}

async function fileToDataUrl(file: File) {
  return bitmapToDataUrl(await createImageBitmap(file))
}

async function captureScreen() {
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
  try {
    const video = document.createElement('video')
    video.srcObject = stream
    video.muted = true
    await video.play()
    await new Promise((resolve) => setTimeout(resolve, 250))
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const bitmap = await createImageBitmap(canvas)
    return bitmapToDataUrl(bitmap)
  } finally {
    stream.getTracks().forEach((track) => track.stop())
  }
}

async function parseCoupon(image: string) {
  const res = await fetch('/api/coupon/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image }),
  })
  const json = (await res.json()) as { bets?: CouponBet[]; error?: string }
  if (!res.ok || !json.bets) throw new Error(json.error ?? 'Kunne ikke læse kuponen')
  return json.bets
}

const fieldClass =
  'min-h-11 w-full min-w-0 rounded-lg border border-[#183252] bg-[#0a1426] px-3 text-[14px] outline-none focus:border-primary'

function CouponSlot({
  index,
  image,
  disabled,
  canCapture,
  onImage,
  onError,
}: {
  index: number
  image: Slot
  disabled: boolean
  canCapture: boolean
  onImage: (value: Slot) => void
  onError: (message: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const readFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) {
      onError('Vælg et billede af din kupon')
      return
    }
    try {
      onImage(await fileToDataUrl(file))
    } catch {
      onError('Billedet kunne ikke åbnes. Prøv et andet.')
    }
  }

  const takeScreenshot = async () => {
    try {
      onImage(await captureScreen())
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') return
      onError('Skærmbilledet kunne ikke tages. Upload i stedet et billede.')
    }
  }

  if (image) {
    return (
      <div className="relative h-40 overflow-hidden rounded-xl border border-[#22d3ee]/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={`Kupon ${index + 1}`} className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#030914]/85 px-2 py-0.5 text-[11px] font-bold text-[#22d3ee]">
          <CheckCircle2 className="size-3.5" aria-hidden="true" /> KUPON {index + 1}
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onImage(null)}
          aria-label={`Fjern kupon ${index + 1}`}
          className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-[#030914]/85 transition-colors hover:bg-destructive"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        void readFile(e.dataTransfer.files[0])
      }}
      className={cn(
        'flex h-40 flex-col overflow-hidden rounded-xl border-2 border-dashed transition-colors',
        dragging ? 'border-[#22d3ee] bg-[#22d3ee]/10' : 'border-[#1d4a80] bg-primary/5',
      )}
    >
      <p className="flex h-8 items-center justify-center text-[11px] font-bold tracking-[0.14em] text-[#8aa0c4]">KUPON {index + 1}</p>
      <div className="grid flex-1 grid-cols-2 divide-x divide-[#1d4a80]">
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileRef.current?.click()}
          aria-label={`Upload billede af kupon ${index + 1}`}
          className="group flex flex-col items-center justify-center gap-1 px-2 transition-colors hover:bg-primary/10"
        >
          <CloudUpload className="size-7 text-[#5ea2ff] transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          <span className="text-[14px] font-semibold">Upload</span>
          <span className="text-[11px] text-[#8aa0c4]">JPG, PNG</span>
        </button>
        {canCapture ? (
          <button
            type="button"
            disabled={disabled}
            onClick={takeScreenshot}
            aria-label={`Tag screenshot af kupon ${index + 1}`}
            className="group flex flex-col items-center justify-center gap-1 px-2 transition-colors hover:bg-primary/10"
          >
            <Camera className="size-7 text-[#5ea2ff] transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="text-[14px] font-semibold">Screenshot</span>
            <span className="text-[11px] text-[#8aa0c4]">fra skærmen</span>
          </button>
        ) : (
          <label
            aria-label={`Tag billede af kupon ${index + 1}`}
            className="group flex cursor-pointer flex-col items-center justify-center gap-1 px-2 transition-colors hover:bg-primary/10"
          >
            <Camera className="size-7 text-[#5ea2ff]" aria-hidden="true" />
            <span className="text-[14px] font-semibold">Kamera</span>
            <span className="text-[11px] text-[#8aa0c4]">tag billede</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              disabled={disabled}
              className="sr-only"
              onChange={(e) => {
                void readFile(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </label>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          void readFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

export function CouponImport({ className }: { className?: string }) {
  const [images, setImages] = useState<[Slot, Slot]>([null, null])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [review, setReview] = useState<{ bets: CouponBet[]; images: [string, string] } | null>(null)
  const [canCapture, setCanCapture] = useState(false)
  const count = images.filter(Boolean).length
  const ready = count === 2

  useEffect(() => {
    const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setCanCapture(desktop && typeof navigator.mediaDevices?.getDisplayMedia === 'function')
  }, [])

  const setSlot = (i: 0 | 1, value: Slot) => {
    setError(null)
    setImages((prev) => (i === 0 ? [value, prev[1]] : [prev[0], value]))
  }

  const calculate = async () => {
    const [first, second] = images
    if (!first || !second) return
    setBusy(true)
    setError(null)
    try {
      const [a, b] = await Promise.all([parseCoupon(first), parseCoupon(second)])
      const bets = [...a, ...b].slice(0, MAX_COUPON_BETS)
      if (bets.length === 0) throw new Error('Vi fandt ingen væddemål på billederne. Prøv skarpere screenshots.')
      setReview({ bets, images: [first, second] })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysen mislykkedes. Prøv igen om lidt.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section aria-labelledby="coupon-import-title" className={cn('glass-panel flex flex-col rounded-2xl p-4 lg:p-5', className)}>
        <div className="flex items-start gap-3.5">
          <span className="icon-chip size-11 shrink-0 text-[#5ea2ff]">
            <CloudUpload className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="coupon-import-title" className="text-[18px] font-bold lg:text-[20px]">
              Importer dit surebet coupon
            </h2>
            <p className="mt-1 text-pretty text-[14px] text-[#b3c0d9]">
              Upload begge kuponer – én fra hver bookmaker. Når begge billeder er uploadet, læser vi dine væddemål og gemmer dem.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SLOTS.map((i) => (
            <CouponSlot
              key={i}
              index={i}
              image={images[i]}
              disabled={busy}
              canCapture={canCapture}
              onImage={(value) => setSlot(i, value)}
              onError={setError}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={!ready || busy}
          onClick={calculate}
          className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[15px] font-semibold text-primary-foreground shadow-[0_0_18px_-4px_#1677ff] transition-opacity hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
        >
          {busy ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Calculator className="size-5" aria-hidden="true" />}
          {busy ? 'Læser kuponer...' : ready ? 'Beregn surebet' : `Upload ${2 - count} kupon${2 - count === 1 ? '' : 'er'} mere`}
        </button>

        {error && (
          <p role="alert" className="mt-3 text-center text-[14px] text-destructive">
            {error}
          </p>
        )}
        <p className="mt-3 flex items-center justify-center gap-2 text-[12px] text-[#8aa0c4]" aria-live="polite">
          <Info className="size-4 text-[#5ea2ff]" aria-hidden="true" /> {count}/2 kuponer uploadet
        </p>
      </section>

      {review && (
        <ReviewDialog
          initial={review.bets}
          images={review.images}
          onClose={() => setReview(null)}
          onSaved={() => {
            setReview(null)
            setImages([null, null])
          }}
        />
      )}
    </>
  )
}

function ReviewDialog({
  initial,
  images,
  onClose,
  onSaved,
}: {
  initial: CouponBet[]
  images: [string, string]
  onClose: () => void
  onSaved: () => void
}) {
  const router = useRouter()
  const [items, setItems] = useState<CouponBet[]>(initial)
  const [error, setError] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const update = useCallback((index: number, patch: Partial<CouponBet>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }, [])

  function save() {
    setError(null)
    startSaving(async () => {
      const res = await saveCouponBets(items)
      if (!res.ok) {
        setError(res.error)
        return
      }
      router.refresh()
      onSaved()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="coupon-review-title">
      <button type="button" aria-label="Luk" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-3xl border border-border bg-card sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <div>
            <h2 id="coupon-review-title" className="text-lg font-bold">
              Tjek dine væddemål
            </h2>
            <p className="text-pretty text-[14px] text-[#b3c0d9]">
              Vi fandt {items.length} væddemål på dine to kuponer. Ret hvis noget er forkert, og gem dem.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Luk" className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-accent">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <div className="mb-3 grid grid-cols-2 gap-2">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`Kupon ${i + 1}`} className="h-24 w-full rounded-lg border border-[#183252] object-cover" />
            ))}
          </div>

          <ul className="flex flex-col gap-3">
            {items.map((item, index) => (
              <li key={index} className="rounded-2xl border border-[#183252] bg-[#07101f] p-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="col-span-2 flex flex-col gap-1 text-[12px] text-[#8aa0c4]">
                    Kamp
                    <input className={fieldClass} value={item.match} onChange={(e) => update(index, { match: e.target.value })} />
                  </label>
                  <label className="col-span-2 flex flex-col gap-1 text-[12px] text-[#8aa0c4]">
                    Spil
                    <input className={fieldClass} value={item.selection} onChange={(e) => update(index, { selection: e.target.value })} />
                  </label>
                  <label className="flex flex-col gap-1 text-[12px] text-[#8aa0c4]">
                    Bookmaker
                    <input className={fieldClass} value={item.bookmaker} onChange={(e) => update(index, { bookmaker: e.target.value })} />
                  </label>
                  <label className="flex flex-col gap-1 text-[12px] text-[#8aa0c4]">
                    Status
                    <select className={fieldClass} value={item.status} onChange={(e) => update(index, { status: e.target.value as CouponBet['status'] })}>
                      <option value="open">Åben</option>
                      <option value="won">Vundet</option>
                      <option value="lost">Tabt</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-[12px] text-[#8aa0c4]">
                    Odds
                    <input
                      className={fieldClass}
                      inputMode="decimal"
                      defaultValue={item.odds ?? ''}
                      onChange={(e) => {
                        const n = Number(e.target.value.replace(',', '.'))
                        update(index, { odds: e.target.value === '' || !Number.isFinite(n) ? null : n })
                      }}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[12px] text-[#8aa0c4]">
                    Indsats (DKK)
                    <input
                      className={fieldClass}
                      inputMode="decimal"
                      defaultValue={item.stake || ''}
                      onChange={(e) => {
                        const n = Number(e.target.value.replace(',', '.'))
                        update(index, { stake: Number.isFinite(n) ? n : 0 })
                      }}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                  className="mt-2 flex min-h-11 items-center gap-2 text-[13px] font-medium text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden="true" /> Fjern
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex gap-2">
            <button type="button" onClick={onClose} className="min-h-12 flex-1 rounded-xl border border-[#1d4a80] font-semibold text-[#5ea2ff]">
              Annuller
            </button>
            <button
              type="button"
              disabled={saving || items.length === 0 || items.length > MAX_COUPON_BETS}
              onClick={save}
              className="min-h-12 flex-[2] rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-50"
            >
              {saving ? 'Gemmer...' : `Gem ${items.length} væddemål`}
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-3 text-center text-[14px] text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
