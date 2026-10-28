'use client'

import { useState } from 'react'

export function SnippetBox({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        readOnly
        rows={4}
        aria-label="Kode til browserens konsol"
        value={code}
        onFocus={(event) => event.currentTarget.select()}
        className="w-full resize-y rounded-xl border border-[#38506b] bg-[#081725] p-3 font-mono text-xs leading-5 text-white outline-none focus:border-[#138cff]"
      />
      <button
        type="button"
        onClick={copy}
        className="flex min-h-12 items-center justify-center rounded-xl bg-[#138cff] text-base font-bold text-white"
      >
        {copied ? 'Kopieret' : 'Kopiér koden'}
      </button>
    </div>
  )
}
