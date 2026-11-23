"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, MessageSquareText, Smartphone } from "lucide-react";

import { removePushSubscription, savePushSettings, savePushSubscription, sendTestPush, type PushSettingsInput } from "@/app/konto/push-actions";
import { saveSmsSettings, type SmsSettingsInput } from "@/app/konto/sms-actions";
import { IosInstallGuide, isIos } from "@/components/push/ios-install-guide";
import { InstallAppSection } from "@/components/push/install-app";
import type { AlertPanelData } from "@/lib/alert-panel-data";

const PRESETS = [15, 20, 25, 30];

type Tab = "push" | "sms";
type PushStatus = "checking" | "unsupported" | "blocked" | "off" | "on";
type Notice = { kind: "ok" | "error"; text: string } | null;

function urlBase64ToBytes(value: string) {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

const primaryButton =
  "flex min-h-10 w-full items-center justify-center rounded-lg bg-primary px-3 text-sm font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-60";
const ghostButton =
  "flex min-h-10 flex-1 items-center justify-center rounded-lg chip-surface border border-border-glow/60 px-3 text-[13px] font-bold text-primary-glow transition hover:brightness-125 disabled:opacity-60";

function Toggle({ checked, onChange, title, hint }: { checked: boolean; onChange: (value: boolean) => void; title: string; hint: string }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-surface-elevated/40 px-3 py-2">
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-[14px] font-semibold">{title}</span>
        <span className="text-[11.5px] text-muted-foreground">{hint}</span>
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-6 w-11 shrink-0 rounded-full bg-border transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary-glow after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-foreground after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  );
}

function MinProfit({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1 text-[12px] font-semibold text-muted-foreground">Minimum profit</legend>
      <div className="flex gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={value === p}
            onClick={() => onChange(p)}
            className={`min-h-9 flex-1 rounded-lg border text-[13px] font-bold transition ${
              value === p ? "border-primary bg-primary/15 text-primary-glow" : "border-border bg-surface-elevated/40 text-foreground/80 hover:bg-surface-elevated"
            }`}
          >
            {p}%
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function NoticeLine({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p role="status" className={`text-[12.5px] leading-5 ${notice.kind === "ok" ? "text-success" : "text-destructive"}`}>
      {notice.text}
    </p>
  );
}

function PushTab({ initial, isSubscriber }: { initial: PushSettingsInput; isSubscriber: boolean }) {
  const [settings, setSettings] = useState(initial);
  const [status, setStatus] = useState<PushStatus>("checking");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIos(isIos());
    async function detect(): Promise<PushStatus> {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "unsupported";
      if (Notification.permission === "denied") return "blocked";
      const registration = await navigator.serviceWorker.getRegistration("/sw.js");
      const existing = await registration?.pushManager.getSubscription();
      return existing ? "on" : "off";
    }
    detect()
      .then((next) => !cancelled && setStatus(next))
      .catch(() => !cancelled && setStatus("unsupported"));
    return () => {
      cancelled = true;
    };
  }, []);

  async function enable() {
    setNotice(null);
    setPending(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "blocked" : "off");
        setNotice({ kind: "error", text: 'Tryk "Tillad" i browseren for at få notifikationer.' });
        return;
      }
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const { publicKey } = (await (await fetch("/api/push/key")).json()) as { publicKey: string };
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToBytes(publicKey) }));
      const json = subscription.toJSON();
      const result = await savePushSubscription({
        endpoint: subscription.endpoint,
        p256dh: json.keys?.p256dh ?? "",
        auth: json.keys?.auth ?? "",
        userAgent: navigator.userAgent,
      });
      if (!result.ok) {
        setNotice({ kind: "error", text: result.error });
        return;
      }
      setStatus("on");
      setNotice({ kind: "ok", text: "Notifikationer er slået til på denne enhed." });
    } catch {
      setNotice({ kind: "error", text: "Kunne ikke slå notifikationer til. Prøv igen." });
    } finally {
      setPending(false);
    }
  }

  async function disable() {
    setNotice(null);
    setPending(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration("/sw.js");
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await removePushSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setStatus("off");
    } catch {
      setNotice({ kind: "error", text: "Kunne ikke slå notifikationer fra. Prøv igen." });
    } finally {
      setPending(false);
    }
  }

  async function save() {
    setNotice(null);
    setPending(true);
    try {
      const result = await savePushSettings(settings);
      setNotice(result.ok ? { kind: "ok", text: "Gemt." } : { kind: "error", text: result.error });
    } catch {
      setNotice({ kind: "error", text: "Der opstod en forbindelsesfejl. Prøv igen." });
    } finally {
      setPending(false);
    }
  }

  async function test() {
    setNotice(null);
    setPending(true);
    try {
      const result = await sendTestPush();
      setNotice(result.ok ? { kind: "ok", text: result.message ?? "Sendt." } : { kind: "error", text: result.error });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {status === "checking" && <p className="text-[13px] text-muted-foreground">Tjekker din enhed…</p>}

      {status === "unsupported" &&
        (ios ? (
          <IosInstallGuide className="rounded-lg border border-gold/40 bg-gold/10 p-3 text-foreground/90" titleClassName="text-gold" />
        ) : (
          <p className="text-[13px] leading-5 text-gold">Din browser understøtter ikke push. Prøv Chrome, Edge, Firefox eller Safari.</p>
        ))}

      {status === "blocked" && (
        <p className="text-[13px] leading-5 text-gold">Notifikationer er blokeret i din browser. Tillad dem for siden i browserens indstillinger, og genindlæs.</p>
      )}

      {status === "off" && (
        <>
          <p className="text-[13px] leading-5 text-muted-foreground">Få besked i din browser med det samme, når der er et surebet over din grænse. Gratis.</p>
          <button type="button" onClick={enable} disabled={pending} className={primaryButton}>
            {pending ? "Slår til…" : "Slå notifikationer til"}
          </button>
        </>
      )}

      {status === "on" && (
        <>
          <Toggle checked={settings.alertsEnabled} onChange={(v) => setSettings((s) => ({ ...s, alertsEnabled: v }))} title="Surebet-alarm" hint="Når vi finder et surebet over din grænse" />
          <MinProfit value={settings.minProfit} onChange={(v) => setSettings((s) => ({ ...s, minProfit: v }))} />
          {!isSubscriber && <p className="text-[12px] leading-5 text-gold">Surebet-alarmer sendes kun til medlemmer med aktivt abonnement.</p>}
          <button type="button" onClick={save} disabled={pending} className={primaryButton}>
            {pending ? "Gemmer…" : "Gem"}
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={test} disabled={pending} className={ghostButton}>
              Send test
            </button>
            <button type="button" onClick={disable} disabled={pending} className={ghostButton}>
              Slå fra her
            </button>
          </div>
        </>
      )}
      <NoticeLine notice={notice} />
    </div>
  );
}

function SmsTab({ initial, hasPhone, isSubscriber }: { initial: SmsSettingsInput; hasPhone: boolean; isSubscriber: boolean }) {
  const [settings, setSettings] = useState(initial);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  async function save() {
    setNotice(null);
    setPending(true);
    try {
      const result = await saveSmsSettings(settings);
      setNotice(result.ok ? { kind: "ok", text: settings.enabled ? "SMS-alarmer er slået til." : "Gemt." } : { kind: "error", text: result.error });
    } catch {
      setNotice({ kind: "error", text: "Der opstod en forbindelsesfejl. Prøv igen." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] leading-5 text-muted-foreground">Få en SMS, når der er et surebet over din grænse. Virker overalt, også uden app.</p>
      <Toggle checked={settings.enabled} onChange={(v) => setSettings((s) => ({ ...s, enabled: v }))} title="Send mig en SMS" hint="Højst én pr. surebet" />
      <MinProfit value={settings.minProfit} onChange={(v) => setSettings((s) => ({ ...s, minProfit: v }))} />
      {!hasPhone && (
        <p className="text-[12px] leading-5 text-gold">
          Tilføj dit mobilnummer under{" "}
          <Link href="/konto" className="font-semibold underline underline-offset-2">
            Min side
          </Link>{" "}
          for at modtage SMS.
        </p>
      )}
      {!isSubscriber && <p className="text-[12px] leading-5 text-gold">SMS-alarmer sendes kun til medlemmer med aktivt abonnement.</p>}
      <button type="button" onClick={save} disabled={pending} className={primaryButton}>
        {pending ? "Gemmer…" : "Gem"}
      </button>
      <NoticeLine notice={notice} />
    </div>
  );
}

export function AlertsPanel({ data }: { data: AlertPanelData }) {
  const [tab, setTab] = useState<Tab>("push");
  const id = useId();
  const tabs: { key: Tab; label: string; icon: typeof Bell }[] = [
    { key: "push", label: "Push", icon: Smartphone },
    { key: "sms", label: "SMS", icon: MessageSquareText },
  ];

  return (
    <div className="sb-panel edge-light relative p-5">
      <div className="flex items-center gap-2.5 text-[17px] font-bold">
        <Bell className="h-6 w-6 fill-gold text-gold drop-shadow-[0_0_8px_var(--gold)]" /> Få alarmer
      </div>

      {!data.signedIn ? (
        <>
          <p className="mt-3 text-[14px] font-medium leading-snug text-foreground/85">Bliv advaret på push eller SMS, så snart vi finder et surebet over din grænse.</p>
          <Link
            href="/konto?login=1&next=/surebets"
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg chip-surface border border-border-glow/60 py-2 text-sm font-bold text-primary-glow hover:brightness-125"
          >
            Log ind for at slå til <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      ) : (
        <>
          <div role="tablist" aria-label="Alarmtype" className="mt-3 grid grid-cols-2 gap-1 rounded-lg border border-border bg-surface-elevated/40 p-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`${id}-${key}-tab`}
                aria-selected={tab === key}
                aria-controls={`${id}-${key}-panel`}
                onClick={() => setTab(key)}
                className={`flex min-h-9 items-center justify-center gap-1.5 rounded-md text-[13px] font-bold transition ${
                  tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`${id}-${tab}-panel`} aria-labelledby={`${id}-${tab}-tab`} className="mt-3">
            {tab === "push" ? (
              <PushTab initial={data.push} isSubscriber={data.isSubscriber} />
            ) : (
              <SmsTab initial={data.sms} hasPhone={data.hasPhone} isSubscriber={data.isSubscriber} />
            )}
          </div>
          <Link href="/konto" className="mt-3 flex items-center justify-center gap-1 text-[12px] font-semibold text-muted-foreground hover:text-foreground">
            Flere indstillinger <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </>
      )}
      <InstallAppSection />
    </div>
  );
}
