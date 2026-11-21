'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, ScanLine, Trash2, X } from 'lucide-react'
import { saveCouponBets } from '@/app/actions'
import { MAX_COUPON_BETS, type CouponBet } from '@/lib/coupon'
import { cn } from '@/lib/utils'

const MAX_SIDE = 1600

async function toResizedDataUrl(file: File) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.85)
}

const fieldClass =
  'min-h-11 w-full min-w-0 rounded-lg border border-[#183252] bg-[#0a1426] px-3 text-[14px] outline-none focus:border-primary'

export function CouponUploadButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[15px] font-semibold text-primary-foreground shadow-[0_0_18px_-4px_#1677ff] transition-opacity hover:opacity-90"
      >
        <ScanLine className="size-5" aria-hidden="true" />
        Upload kupon
      </button>
      {open && <CouponDialog onClose={() => setOpen(false)} />}
    </>
  )
}

function CouponDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [reading, setReading] = useState(false)
  const [items, setItems] = useState<CouponBet[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [saving, startSaving] = useTransition()

  const readFile = useCallback(async (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Vælg et billede af din kupon')
      return
    }
    setError(null)
    setItems(null)
    setReading(true)
    try {
      const dataUrl = await toResizedDataUrl(file)
      setPreview(dataUrl)
      const res = await fetch('/api/coupon/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      })
      const json = (await res.json()) as { bets?: CouponBet[]; error?: string }
      if (!res.ok || !json.bets) throw new Error(json.error ?? 'Kunne ikke læse kuponen')
      if (json.bets.length === 0) throw new Error('Vi fandt ingen væddemål på billedet. Prøv et skarpere screenshot.')
      setItems(json.bets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke læse kuponen')
    } finally {
      setReading(false)
    }
  }, [])

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'))
      if (file) void readFile(file)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('paste', onPaste)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('paste', onPaste)
      window.removeEventListener('keydown', onKey)
    }
  }, [readFile, onClose])

  function update(index: number, patch: Partial<CouponBet>) {
    setItems((prev) => prev?.map((item, i) => (i === index ? { ...item, ...patch } : item)) ?? null)
  }

  function save() {
    if (!items) return
    setError(null)
    startSaving(async () => {
      const res = await saveCouponBets(items)
      if (!res.ok) {
        setError(res.error)
        return
      }
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="coupon-title">
      <button type="button" aria-label="Luk" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-3xl border border-border bg-card sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <div>
            <h2 id="coupon-title" className="text-lg font-bold">
              Upload din kupon
            </h2>
            <p className="text-pretty text-[14px] text-[#b3c0d9]">
              Tag et screenshot eller billede af din kupon, så udfylder vi dine væddemål automatisk.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Luk" className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-accent">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          {!items && (
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
                'flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors',
                dragging ? 'border-primary bg-primary/10' : 'border-[#1d4a80]',
              )}
            >
              {reading ? (
                <>
                  {preview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Din kupon" className="max-h-48 rounded-lg object-contain" />
                  )}
                  <p className="flex items-center gap-2 text-[15px] font-medium" role="status">
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                    Læser din kupon...
                  </p>
                </>
              ) : (
                <>
                  <Camera className="size-10 text-[#5ea2ff]" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-pretty text-[15px] font-semibold">Træk et billede hertil, indsæt med Ctrl+V eller vælg en fil</p>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="min-h-12 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Vælg billede eller tag foto
                  </button>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-label="Vælg billede af kupon"
                onChange={(e) => {
                  void readFile(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
            </div>
          )}

          {items && (
            <div className="flex flex-col gap-3">
              <p className="text-[14px] text-[#b3c0d9]">
                Tjek at det passer, og ret hvis noget er forkert. {items.length} væddemål fundet.
              </p>
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
                        <select
                          className={fieldClass}
                          value={item.status}
                          onChange={(e) => update(index, { status: e.target.value as CouponBet['status'] })}
                        >
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
                          value={item.odds ?? ''}
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
                          value={item.stake || ''}
                          onChange={(e) => {
                            const n = Number(e.target.value.replace(',', '.'))
                            update(index, { stake: Number.isFinite(n) ? n : 0 })
                          }}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev?.filter((_, i) => i !== index) ?? null)}
                      className="mt-2 flex min-h-11 items-center gap-2 text-[13px] font-medium text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" /> Fjern
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setItems(null)
                    setPreview(null)
                  }}
                  className="min-h-12 flex-1 rounded-xl border border-[#1d4a80] font-semibold text-[#5ea2ff]"
                >
                  Ny kupon
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
            </div>
          )}

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
