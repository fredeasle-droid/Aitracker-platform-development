import { BellRing, ExternalLink, Send, Sparkles, Trophy } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

const PERKS = [
  { icon: BellRing, text: "Push-alarmer direkte i Telegram" },
  { icon: Sparkles, text: "Unikke surebets, som ikke vises på siden" },
  { icon: Trophy, text: "Følg vores 365 dages challenge" },
];

export function TelegramPanel() {
  const { tx } = useLocale();
  const url = process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim() || "https://t.me/bettrackerai";

  return (
    <div className="sb-panel edge-light relative p-5">
      <div className="flex items-center gap-2.5 text-[17px] font-bold">
        <Send className="h-6 w-6 text-primary-glow drop-shadow-[0_0_8px_var(--primary-glow)]" aria-hidden /> {tx("Følg os på Telegram")}
      </div>

      <ul className="mt-3 flex flex-col gap-2.5">
        {PERKS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5 text-[13.5px] font-medium leading-snug text-foreground/85">
            <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-lg chip-surface border border-border-glow/60 text-primary-glow">
              <Icon className="size-3.5" />
            </span>
            {tx(text)}
          </li>
        ))}
      </ul>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-bold text-primary-foreground transition hover:brightness-110"
        >
          {tx("Åbn Telegram-kanalen")} <ExternalLink className="size-4" aria-hidden />
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-4 flex min-h-10 w-full items-center justify-center rounded-lg chip-surface border border-border-glow/60 px-3 text-sm font-bold text-primary-glow opacity-60"
        >
          {tx("Link kommer snart")}
        </button>
      )}
    </div>
  );
}
