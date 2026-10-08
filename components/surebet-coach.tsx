'use client'

import { useState } from 'react'
import { Bot, ChevronDown, Send, Sparkles, User } from 'lucide-react'

const starter = 'Hej! Jeg er din Surebet-coach. Jeg kan guide dig roligt gennem dit første surebet trin for trin.'

export function SurebetCoach() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', text: starter }])

  async function ask(text = input) {
    const question = text.trim()
    if (!question || busy) return
    const next = [...messages, { role: 'user', text: question }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const response = await fetch('/api/surebet-coach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) })
      const data = await response.json()
      setMessages([...next, { role: 'assistant', text: data.text || 'Jeg kunne ikke svare lige nu. Prøv igen.' }])
    } catch {
      setMessages([...next, { role: 'assistant', text: 'Der opstod en fejl. Prøv igen om lidt.' }])
    } finally { setBusy(false) }
  }

  return <div className="fixed bottom-5 right-4 z-50 w-[calc(100%-2rem)] max-w-[380px]">
    {open && <section className="mb-3 overflow-hidden rounded-[24px] border border-[#1d4771] bg-[#081426] shadow-[0_20px_60px_-18px_rgba(0,0,0,.9)]" aria-label="Surebet-coach">
      <header className="flex items-center justify-between border-b border-[#183252] bg-[linear-gradient(120deg,#0d2d52,#101b38)] px-4 py-3">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-[#1677ff] text-white"><Bot className="size-5" /></span><div><p className="font-bold">Surebet-coach</p><p className="text-xs text-[#9eb1d2]">Din guide til det første bet</p></div></div>
        <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full text-[#b7c7e3] hover:bg-white/10" aria-label="Luk coach"><ChevronDown className="size-5" /></button>
      </header>
      <div className="max-h-[320px] space-y-3 overflow-y-auto p-4">{messages.map((message, index) => <div key={index} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-[#1677ff] text-white' : 'rounded-bl-md bg-[#102442] text-[#e6edf9]'}`}>{message.text}</div></div>)}{busy && <p className="text-sm text-[#8fa3cc]">Coach skriver...</p>}</div>
      {messages.length === 1 && <div className="flex gap-2 px-4 pb-3"><button onClick={() => ask('Hvad er et surebet?')} className="rounded-full border border-[#2a4d78] px-3 py-2 text-xs text-[#b9c9e3]">Hvad er et surebet?</button><button onClick={() => ask('Guide mig gennem mit første surebet')} className="rounded-full border border-[#2a4d78] px-3 py-2 text-xs text-[#b9c9e3]">Guide mig</button></div>}
      <form onSubmit={event => { event.preventDefault(); ask() }} className="flex gap-2 border-t border-[#183252] p-3"><input value={input} onChange={event => setInput(event.target.value)} placeholder="Spørg din coach..." className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#29466d] bg-[#050f20] px-3 text-base text-white outline-none placeholder:text-[#7185a7] focus:border-[#3a9bff]" aria-label="Skriv til surebet-coach" /><button disabled={busy} className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#1677ff] text-white disabled:opacity-50" aria-label="Send spørgsmål"><Send className="size-4" /></button></form>
    </section>}
    <button onClick={() => setOpen(!open)} className="ml-auto flex min-h-14 items-center gap-2 rounded-full border border-[#2d6fb3] bg-[linear-gradient(110deg,#1677ff,#1456ca)] px-5 font-bold text-white shadow-[0_12px_30px_-8px_#1677ff]" aria-expanded={open}><Sparkles className="size-5" /> Spørg Surebet-coachen</button>
  </div>
}
