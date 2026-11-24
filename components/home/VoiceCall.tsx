"use client";

import { useLocale } from "@/components/locale-provider";
import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, MessageSquareText, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { VoiceConversation } from "@elevenlabs/client";

async function getVoiceCallToken(): Promise<{ token: string }> {
  const res = await fetch("/api/voice-call/token", { method: "POST" });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(`${res.status} ${body?.error ?? "Call could not start"}`);
  }
  return (await res.json()) as { token: string };
}

type Caption = { role: "user" | "assistant"; text: string };
type CallStatus = "idle" | "connecting" | "connected" | "stopping" | "closed";

/** Short Danish text for a failed call. */
function callErrorText(error: string | null) {
  if (!error) return null;
  if (/permission|denied|notallowed|notfound|microphone|device/i.test(error)) {
    return "Vi fik ikke adgang til din mikrofon. Tillad mikrofonen i browseren og prøv igen.";
  }
  if (/credit|limit|quota|402|403|429|not set up/i.test(error)) return "Opkald er ikke tilgængelige lige nu. Skriv i chatten i stedet.";
  return "Opkaldet blev afbrudt. Prøv at ringe igen – eller skriv i chatten.";
}

/** Microphone volume (0–1) above which we count it as someone speaking. */
const VOICE_LEVEL = 0.12;

/** One voice call with support (ElevenLabs agent in the owner's voice). Keep this hook mounted for the whole section. */
export function useSupportCall() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [muted, setMutedState] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [micLevel, setMicLevel] = useState(0);
  // Whether the microphone has picked up anything that sounds like a voice during this call.
  const [micHeard, setMicHeard] = useState(false);
  const session = useRef<VoiceConversation | null>(null);
  // Bumped on every call/hang-up so a slow start never revives a call the visitor already ended.
  const attempt = useRef(0);

  const start = useCallback(async () => {
    const id = ++attempt.current;
    setStatus("connecting");
    setError(null);
    try {
      // Ask for the microphone first, straight from the click, so the browser prompt appears right away.
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      mic.getTracks().forEach((t) => t.stop());
      const { token } = await getVoiceCallToken();
      if (id !== attempt.current) return;
      const conv = await VoiceConversation.startSession({
        conversationToken: token,
        connectionType: "webrtc",
        onConnect: () => id === attempt.current && setStatus("connected"),
        onMessage: ({ message, role }) => {
          if (id !== attempt.current || !message.trim()) return;
          const who: Caption["role"] = role === "user" ? "user" : "assistant";
          if (who === "user") setMicHeard(true);
          setCaptions((prev) => [...prev, { role: who, text: message.trim() }].slice(-12));
        },
        onError: (message) => {
          console.error("Voice call error:", message);
          if (id === attempt.current) setError(message || "error");
        },
        onDisconnect: (details) => {
          if (id !== attempt.current) return;
          if (details.reason === "error") setError(details.message || "disconnected");
          session.current = null;
          setMicLevel(0);
          setStatus("closed");
        },
      });
      if (id !== attempt.current) {
        void conv.endSession();
        return;
      }
      session.current = conv;
      setStatus("connected");
    } catch (e) {
      if (id !== attempt.current) return;
      const message = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
      console.error("Voice call failed to start:", message);
      setError(message);
      setStatus("closed");
    }
  }, []);

  const stop = useCallback(() => {
    attempt.current++;
    const conv = session.current;
    session.current = null;
    setMicLevel(0);
    if (!conv) {
      setStatus((s) => (s === "idle" ? s : "closed"));
      return;
    }
    setStatus("stopping");
    void conv.endSession().finally(() => setStatus("closed"));
  }, []);

  const setMuted = useCallback((value: boolean) => {
    session.current?.setMicMuted(value);
    setMutedState(value);
  }, []);

  // Microphone meter while the call is live.
  useEffect(() => {
    if (status !== "connected" || muted) return;
    const timer = window.setInterval(() => {
      const level = session.current?.getInputVolume() ?? 0;
      setMicLevel(level);
      if (level > VOICE_LEVEL) setMicHeard(true);
    }, 120);
    return () => window.clearInterval(timer);
  }, [status, muted]);

  // Hang up if the visitor leaves the page mid-call.
  useEffect(() => () => {
    attempt.current++;
    void session.current?.endSession();
  }, []);

  const call = useCallback(() => {
    setCaptions([]);
    setMicLevel(0);
    setMicHeard(false);
    setMutedState(false);
    setOpen(true);
    void start();
  }, [start]);

  const close = useCallback(() => {
    stop();
    setOpen(false);
  }, [stop]);

  return { open, status, error, muted, setMuted, captions, micLevel, micHeard, call, close };
}

export type SupportCallState = ReturnType<typeof useSupportCall>;

function useElapsedSeconds(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    setSeconds(0);
    const started = Date.now();
    const id = window.setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  return running ? seconds : 0;
}

/** Five bars that move with the caller's voice, so they can see the microphone works. */
function MicMeter({ level, phone }: { level: number; phone: boolean }) {
  return (
    <span className={`flex items-end ${phone ? "h-4 gap-[3px]" : "h-[12px] gap-[2px]"}`} aria-hidden="true">
      {[0.08, 0.2, 0.35, 0.5, 0.7].map((step) => (
        <span key={step} className={`call-meter-bar ${phone ? "w-[3px]" : "w-[2px]"} ${level > step ? "is-on" : ""}`} style={{ height: `${30 + step * 100}%` }} />
      ))}
    </span>
  );
}

/** Call button for the chat header. */
export function CallButton({ call, phone = false }: { call: SupportCallState; phone?: boolean }) {
  const { tx } = useLocale();
  const busy = call.status === "connecting" || call.status === "connected" || call.status === "stopping";
  if (call.open) return null;
  return (
    <button
      type="button"
      onClick={call.call}
      disabled={busy}
      className={`call-btn flex shrink-0 items-center gap-[6px] rounded-full font-semibold ${phone ? "h-8 px-3 text-[12px]" : "h-[26px] px-[10px] text-[10.5px]"}`}
    >
      <Phone className={phone ? "h-3.5 w-3.5" : "h-[11px] w-[11px]"} />
      {tx("Ring op")}</button>
  );
}

/** The call screen shown inside the chat box while talking with support. */
export function CallPanel({ call, phone = false }: { call: SupportCallState; phone?: boolean }) {
  const { tx } = useLocale();
  const live = call.status === "connected";
  const ended = call.status === "closed" || call.status === "idle";
  const seconds = useElapsedSeconds(live);
  const elapsed = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  // After the greeting has had time to play, warn if the microphone has not picked up a voice yet.
  const cannotHear = live && !call.muted && !call.micHeard && seconds >= 10;
  const err = callErrorText(call.error);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [call.captions]);

  const status =
    call.status === "connecting" ? "Ringer op…"
    : live ? `I opkald · ${elapsed}`
    : call.status === "stopping" ? "Lægger på…"
    : err ? "Opkaldet blev afbrudt"
    : "Opkaldet er slut";

  const icon = phone ? "h-[18px] w-[18px]" : "h-[14px] w-[14px]";
  const round = phone ? "h-12 w-12" : "h-[36px] w-[36px]";

  return (
    <div className="flex min-h-0 flex-1 flex-col" role="region" aria-label={tx("Opkald med support")}>
      <div className={`flex items-center gap-[12px] ${phone ? "px-4 pt-4" : "px-[16px] pt-[12px]"}`}>
        <span className={`call-avatar relative flex shrink-0 items-center justify-center rounded-full ${live ? "is-live" : ""} ${phone ? "h-12 w-12" : "h-[38px] w-[38px]"}`}>
          <Headphones className={phone ? "h-5 w-5" : "h-[16px] w-[16px]"} />
        </span>
        <div className="min-w-0">
          <p className={`font-semibold ${phone ? "text-[15px]" : "text-[12.5px] leading-[16px]"}`}>{tx("Taler med support")}</p>
          <p role="status" className={`flex items-center gap-[6px] tabular-nums ${live ? "text-success" : "text-foreground/65"} ${phone ? "text-[12px]" : "text-[10px] leading-[14px]"}`}>
            {tx(status)}
            {live && !call.muted && <MicMeter level={call.micLevel} phone={phone} />}
            {live && call.muted && <span className="text-foreground/55">{tx("· mikrofon slået fra")}</span>}
          </p>
        </div>
      </div>

      <div ref={scroller} className={`call-captions min-h-0 flex-1 overflow-y-auto ${phone ? "mx-4 mt-3 space-y-2 text-[13px] leading-[19px]" : "mx-[16px] mt-[10px] space-y-[6px] text-[11px] leading-[16px]"}`}>
        {call.captions.length === 0 && !err && (
          <p className="text-foreground/55">
            {call.status === "connecting" ? tx("Tillad mikrofonen, hvis browseren spørger. Support siger hej om et øjeblik.") : tx("Sig hvad du har på hjertet – support lytter.")}
          </p>
        )}
        {call.captions.map((c, k) => (
          <p key={k} className={c.role === "user" ? "text-foreground/60" : "text-foreground"}>
            <span className={`mr-[6px] font-semibold ${c.role === "user" ? "text-foreground/45" : "text-primary-glow"}`}>{c.role === "user" ? tx("Dig") : tx("Support")}</span>
            {tx(c.text)}
          </p>
        ))}
        {cannotHear && (
          <p role="status" className="text-warning">
            {tx("Vi kan ikke høre dig endnu. Tjek at den rigtige mikrofon er valgt i browseren og ikke er slået fra – og tal så igen.")}</p>
        )}
        {err && <p role="alert" className="text-destructive">{tx(err)}</p>}
      </div>

      <div className={`flex items-center justify-center ${phone ? "gap-4 p-4" : "gap-[12px] px-[16px] py-[10px]"}`}>
        {ended ? (
          <>
            <button type="button" onClick={call.call} className={`btn-glow flex items-center gap-[6px] rounded-full font-semibold ${phone ? "h-11 px-5 text-[14px]" : "h-[32px] px-[14px] text-[11px]"}`}>
              <Phone className={icon} /> {" "}{tx("Ring igen")}</button>
            <button type="button" onClick={call.close} className={`call-ghost flex items-center gap-[6px] rounded-full font-semibold ${phone ? "h-11 px-5 text-[14px]" : "h-[32px] px-[14px] text-[11px]"}`}>
              <MessageSquareText className={icon} /> {" "}{tx("Tilbage til chat")}</button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => call.setMuted(!call.muted)}
              disabled={!live}
              aria-pressed={call.muted}
              aria-label={call.muted ? tx("Slå mikrofonen til") : tx("Slå mikrofonen fra")}
              className={`call-ghost flex items-center justify-center rounded-full disabled:opacity-40 ${round}`}
            >
              {call.muted ? <MicOff className={icon} /> : <Mic className={icon} />}
            </button>
            <button
              type="button"
              onClick={call.close}
              disabled={call.status === "stopping"}
              aria-label={tx("Læg på")}
              className={`call-end flex items-center justify-center rounded-full ${phone ? "h-12 w-16" : "h-[36px] w-[52px]"}`}
            >
              <PhoneOff className={icon} />
            </button>
          </>
        )}
      </div>
      <p className={`text-center text-foreground/45 ${phone ? "pb-3 text-[11px]" : "pb-[8px] text-[9px]"}`}>{tx("AI-stemme · kan tage fejl · intet bliver gemt")}</p>
    </div>
  );
}
