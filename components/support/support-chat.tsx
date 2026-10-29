'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ArrowUp, MessageCircle, RotateCcw, Square, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const SUGGESTIONS = [
  'Hvad er en SikkerBet?',
  'Hvad er forskellen på Basis og Premium?',
  'Hvordan opsiger jeg mit abonnement?',
  'Hvordan virker den gratis prøveperiode?',
]

const transport = new DefaultChatTransport({ api: '/api/support' })

export function SupportChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, stop, error, setMessages, clearError } = useChat({ transport })
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, status])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    sendMessage({ text: trimmed })
    setInput('')
  }

  function reset() {
    stop()
    clearError()
    setMessages([])
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="support-chat-panel"
        aria-label={open ? 'Luk live support' : 'Åbn live support'}
        className="fixed right-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex size-12 items-center justify-center gap-2 rounded-full bg-[#138cff] text-[15px] font-bold text-white shadow-[0_12px_30px_-10px_#138cff] transition-transform hover:scale-[1.03] lg:right-6 lg:bottom-6 lg:h-14 lg:w-auto lg:pr-5 lg:pl-4"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <MessageCircle className="size-5" aria-hidden="true" />}
        <span className="hidden lg:inline">{open ? 'Luk' : 'Support'}</span>
        {!open && <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full border-2 border-[#138cff] bg-[#16ee93] lg:static lg:size-2 lg:border-0" aria-hidden="true" />}
      </button>

      {open && (
        <section
          id="support-chat-panel"
          role="dialog"
          aria-label="BetTracker live support"
          className="fixed inset-x-3 top-20 bottom-[calc(10rem+env(safe-area-inset-bottom))] z-50 flex flex-col overflow-hidden rounded-2xl border border-[#183754] bg-[#071725] shadow-[0_30px_80px_-20px_#000] lg:inset-x-auto lg:top-auto lg:right-6 lg:bottom-24 lg:h-[600px] lg:max-h-[calc(100dvh-8rem)] lg:w-[400px]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-[#183754] bg-[#0a1d30] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#138cff]/15 text-[#4db5ff]">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-white">Live support</h2>
                <p className="flex items-center gap-1.5 text-[12px] text-[#8ea3bd]">
                  <span className="size-1.5 rounded-full bg-[#16ee93]" aria-hidden="true" />
                  AI-assistent · svarer med det samme
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="flex size-9 items-center justify-center rounded-lg text-[#8ea3bd] hover:bg-[#102744] hover:text-white"
                aria-label="Start ny samtale"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
              </button>
            )}
          </header>

          <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl rounded-tl-sm bg-[#0d2238] px-4 py-3 text-[14px] leading-relaxed text-[#e6ecf7]">
                  Hej! Jeg er BetTrackers support-assistent. Spørg mig om SikkerBets, abonnementer eller din konto.
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#4db5ff]">Populære spørgsmål</p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-xl border border-[#244563] bg-[#081725] px-3 py-2.5 text-left text-[14px] text-[#e6ecf7] hover:border-[#159cff] hover:bg-[#102744]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const text = message.parts
                  .map((part) => (part.type === 'text' ? part.text : ''))
                  .join('')
                if (!text) return null
                const mine = message.role === 'user'
                return (
                  <div
                    key={message.id}
                    className={`max-w-[85%] whitespace-pre-wrap px-4 py-2.5 text-[14px] leading-relaxed ${
                      mine
                        ? 'self-end rounded-2xl rounded-tr-sm bg-[#138cff] text-white'
                        : 'self-start rounded-2xl rounded-tl-sm bg-[#0d2238] text-[#e6ecf7]'
                    }`}
                  >
                    <span className="sr-only">{mine ? 'Dig: ' : 'Support: '}</span>
                    {text}
                  </div>
                )
              })
            )}

            {status === 'submitted' && (
              <div className="flex gap-1 self-start rounded-2xl rounded-tl-sm bg-[#0d2238] px-4 py-3.5" aria-label="Skriver">
                <span className="size-1.5 animate-bounce rounded-full bg-[#8ea3bd]" />
                <span className="size-1.5 animate-bounce rounded-full bg-[#8ea3bd] [animation-delay:150ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-[#8ea3bd] [animation-delay:300ms]" />
              </div>
            )}

            {error && (
              <p role="alert" className="rounded-xl border border-[#6b2a35] bg-[#1c0b11] px-3 py-2 text-[13px] text-[#ff9aa6]">
                Noget gik galt. Prøv igen, eller skriv til support@bettrackerai.com.
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-end gap-2 border-t border-[#183754] bg-[#0a1d30] p-3"
          >
            <label htmlFor="support-input" className="sr-only">
              Skriv din besked
            </label>
            <textarea
              id="support-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={2000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing || e.keyCode === 229) return
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="Skriv en besked..."
              className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-[#38506b] bg-[#081725] px-3 py-2.5 text-[16px] text-white outline-none placeholder:text-[#8ea3bd] focus:border-[#159cff]"
            />
            {busy ? (
              <button
                type="button"
                onClick={stop}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#344861] bg-[#0a1725] text-white hover:bg-[#102744]"
                aria-label="Stop svar"
              >
                <Square className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#138cff] text-white disabled:opacity-40"
                aria-label="Send besked"
              >
                <ArrowUp className="size-5" aria-hidden="true" />
              </button>
            )}
          </form>
          <p className="bg-[#0a1d30] px-4 pb-3 text-center text-[11px] text-[#8ea3bd]">
            AI kan tage fejl. Spil ansvarligt. 18+
          </p>
        </section>
      )}
    </>
  )
}
