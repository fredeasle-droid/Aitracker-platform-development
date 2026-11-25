"use client";

import { useLocale } from "@/components/locale-provider";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, Headphones, Square } from "lucide-react";
import { CHAT_LIMITS, FAQ_ENTRIES } from "./faq-data";

const transport = new DefaultChatTransport({ api: "/api/support" });

const WELCOME: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [{ type: "text", text: "Hej! Jeg er BetTrackerAI's support. Vælg et spørgsmål, eller skriv lige det, du går og tænker på – så svarer jeg med det samme." }],
};

function textOf(m: UIMessage) {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

/** Short Danish message from a failed chat request (the server sends `{ error }`). */
function errorText(error: Error | undefined) {
  if (!error) return null;
  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    /* not JSON */
  }
  if (/fetch|network/i.test(error.message)) return "Ingen forbindelse. Tjek dit internet og prøv igen.";
  return error.message.length < 140 ? error.message : "Noget gik galt. Prøv igen om lidt.";
}

/** One support conversation per visit (nothing is saved). FAQ questions get their written answer instantly; anything else goes to the AI. */
export function useSupportChat() {
  const chat = useChat({ id: "faq-support", messages: [WELCOME], transport });
  const [presetTyping, setPresetTyping] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const { setMessages, stop, status, clearError } = chat;
  const askPreset = useCallback(
    (k: number) => {
      const entry = FAQ_ENTRIES[k];
      if (!entry) return;
      if (status === "submitted" || status === "streaming") void stop();
      clearError();
      window.clearTimeout(timer.current);
      const stamp = Date.now();
      setMessages((prev) => [...prev, { id: `faq-q-${stamp}`, role: "user", parts: [{ type: "text", text: entry.q }] }]);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setPresetTyping(!reduce);
      timer.current = window.setTimeout(() => {
        setPresetTyping(false);
        setMessages((prev) => [...prev, { id: `faq-a-${stamp}`, role: "assistant", parts: [{ type: "text", text: entry.a }] }]);
      }, reduce ? 0 : 650);
    },
    [setMessages, stop, status, clearError],
  );

  return { ...chat, presetTyping, askPreset };
}

export type SupportChatState = ReturnType<typeof useSupportChat>;

function Avatar({ phone }: { phone: boolean }) {
  return (
    <span className={`btn-glow relative flex shrink-0 items-center justify-center rounded-full ${phone ? "h-8 w-8" : "h-[26px] w-[26px]"}`}>
      <Headphones className={phone ? "h-4 w-4" : "h-[12px] w-[12px]"} />
    </span>
  );
}

/** The chat transcript and the box where visitors type their own question. */
export function SupportChat({ chat, phone = false, suggestions = false }: { chat: SupportChatState; phone?: boolean; suggestions?: boolean }) {
  const { tx } = useLocale();
  const { messages, status, sendMessage, stop, error, presetTyping, askPreset } = chat;
  const busy = status === "submitted" || status === "streaming";
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const last = messages[messages.length - 1];
  const waiting = presetTyping || status === "submitted" || (status === "streaming" && (!last || last.role === "user" || !textOf(last)));
  const tooLong = text.length > CHAT_LIMITS.maxChars;
  const err = errorText(error);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, waiting]);

  const submit = () => {
    const t = text.trim();
    if (!t || busy || tooLong) return;
    void sendMessage({ text: t });
    setText("");
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) void stop();
    else submit();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      submit();
    }
  };

  const textCls = phone ? "text-[13.5px] leading-[20px]" : "text-[12px] leading-[18px]";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scroller} role="log" aria-live="polite" className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${phone ? "gap-3 p-3.5" : "gap-[12px] px-[16px] py-[14px]"}`}>
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="bubble-in ml-auto max-w-[85%]">
              <p className={`bubble-user whitespace-pre-wrap break-words rounded-[14px] rounded-br-[4px] font-medium text-primary-foreground ${phone ? "px-3.5 py-2.5" : "px-[12px] py-[8px]"} ${textCls}`}>{textOf(m)}</p>
            </div>
          ) : textOf(m) ? (
            <div key={m.id} className="bubble-in flex max-w-[92%] items-end gap-[8px]">
              <Avatar phone={phone} />
              <p className={`bubble-support chat-answer whitespace-pre-wrap break-words rounded-[14px] rounded-bl-[4px] ${phone ? "px-3.5 py-2.5" : "px-[12px] py-[9px]"} ${textCls}`}>{textOf(m)}</p>
            </div>
          ) : null,
        )}
        {waiting && (
          <div className="flex items-end gap-[8px]">
            <Avatar phone={phone} />
            <span className={`bubble-support animate-pulse rounded-[14px] rounded-bl-[4px] ${phone ? "px-3.5 py-2.5 text-[13px]" : "px-[12px] py-[8px] text-[11.5px]"}`}>{tx("Support skriver…")}</span>
          </div>
        )}
        {err && (
          <p role="alert" className={`self-center rounded-full border border-destructive/50 bg-destructive/15 text-center text-foreground ${phone ? "px-3 py-1.5 text-[12px]" : "px-[10px] py-[4px] text-[10.5px]"}`}>
            {tx(err)}
          </p>
        )}
      </div>

      {suggestions && (
        <div className="faq-suggest flex gap-2 overflow-x-auto px-3 pb-1 pt-2" role="group" aria-label={tx("Populære spørgsmål")}>
          {FAQ_ENTRIES.map((e, k) => (
            <button key={e.q} type="button" onClick={() => askPreset(k)} className="faq-chip shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold">
              {tx(e.q)}
            </button>
          ))}
        </div>
      )}
      <div className={phone ? "p-3 pt-2" : "px-[12px] pb-[10px] pt-[4px]"}>
        {tooLong && <p className={`mb-1 text-destructive ${phone ? "text-[11px]" : "text-[9.5px]"}`}>{tx("Max")}{" "}{tx(CHAT_LIMITS.maxChars)} {" "}{tx("tegn")}</p>}
        <form onSubmit={onSubmit} className="chat-composer flex items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={tx("Skriv dit spørgsmål her…")}
            aria-label={tx("Skriv dit spørgsmål til support")}
            className={`min-w-0 flex-1 resize-none bg-transparent outline-none placeholder:text-foreground/50 ${phone ? "min-h-[42px] py-2.5 pl-3 pr-1 text-[14px] leading-[20px]" : "min-h-[34px] py-[8px] pl-[12px] pr-[4px] text-[11.5px] leading-[17px]"}`}
          />
          <button
            type="submit"
            aria-label={busy ? tx("Stop") : tx("Send")}
            disabled={!busy && (!text.trim() || tooLong)}
            className={`btn-glow m-1 flex shrink-0 items-center justify-center rounded-full disabled:opacity-50 ${phone ? "size-8" : "size-[26px]"}`}
          >
            {busy ? <Square className="size-3 fill-current" /> : <ArrowUp className="size-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
