"use client";
import { useEffect, useRef, useState } from "react";
import { Search, Bell, ChevronDown, Command } from "lucide-react";
import { AuthActions } from "@/components/site/global-header";
import { useLocale } from "@/components/locale-provider";
import { LOCALES, type Locale } from "@/lib/i18n";

const LOCALE_OPTIONS = Object.entries(LOCALES) as [Locale, (typeof LOCALES)[Locale]][];

function LanguageMenu() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES[locale];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={current.label}
        className="glass-pill flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition hover:brightness-125"
      >
        <span className="text-lg leading-none" aria-hidden="true">{current.flag}</span>
        {current.countryCode}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="listbox" className="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-xl border border-border-glow bg-surface-deep p-1.5 shadow-glow">
          {LOCALE_OPTIONS.map(([code, option]) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={code === locale}
              onClick={() => {
                setLocale(code);
                setOpen(false);
              }}
              className={`flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm transition hover:bg-surface ${code === locale ? "bg-surface font-bold text-foreground" : "text-foreground/85"}`}
            >
              <span className="text-lg leading-none" aria-hidden="true">{option.flag}</span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TopBar(_props: { page?: "surebets" | "beregn" }) {
  const { t } = useLocale();
  return (
    <header className="hidden flex-col gap-3 pb-3.5 pt-3 lg:flex">
      <div className="flex items-center gap-4">
      <div className="mx-auto flex w-full min-w-0 max-w-[570px] items-center gap-3 rounded-full border border-border-glow bg-surface-deep/70 px-5 py-3 shadow-glow">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          placeholder={t("sbSearchPlaceholder")}
          aria-label={t("sbSearchPlaceholder")}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
        />
        <kbd className="hidden items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-muted-foreground sm:flex">
          <Command className="h-3 w-3" /> K
        </kbd>
      </div>
      <div className="flex shrink-0 items-center gap-3.5">
        <div className="glass-pill hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold text-success sm:flex">
          <span className="glow-dot h-2.5 w-2.5 animate-blink rounded-full bg-success" /> Live
        </div>
        <LanguageMenu />
        <button className="glass-pill relative flex h-10 w-10 items-center justify-center rounded-full transition hover:brightness-125" aria-label={t("sbNotifications")}>
          <Bell className="h-5 w-5 text-foreground/85" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </button>
        <div className="bt-theme">
          <AuthActions />
        </div>
      </div>
      </div>
    </header>
  );
}
