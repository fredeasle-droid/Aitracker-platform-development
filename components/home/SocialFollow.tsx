"use client";

import { useLocale } from "@/components/locale-provider";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowUpRight, Users } from "lucide-react";
import { DiscordIcon, InstagramIcon, TelegramIcon, YoutubeIcon } from "./icons";
import { useHomeData } from "./home-data";

export const CHANNELS = [
  { name: "Telegram", desc: "Live alerts", Icon: TelegramIcon, tile: "bg-telegram", brand: "var(--telegram)" },
  { name: "YouTube", desc: "Guides & videoer", Icon: YoutubeIcon, tile: "bg-youtube", brand: "var(--youtube)" },
  { name: "Discord", desc: "Fællesskab", Icon: DiscordIcon, tile: "bg-discord", brand: "var(--discord)" },
  { name: "Instagram", desc: "Ugens fund", Icon: InstagramIcon, tile: "bg-instagram", brand: "var(--instagram)" },
] as const;

export function SocialFollow() {
  const { tx } = useLocale();
  // The ticker shows the latest post in the Telegram channel, in step with the SMS phone.
  const { finds } = useHomeData();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (finds.length < 2) return;
    const t = setInterval(() => setK((i) => (i + 1) % finds.length), 5000);
    return () => clearInterval(t);
  }, [finds.length]);
  const f = finds[k] ?? finds[0];

  return (
    <div className="panel spotlight relative h-[268px] w-[477px] overflow-hidden rounded-[20px]">
      <div className="pointer-events-none absolute -left-[60px] -bottom-[80px] h-[240px] w-[260px] rounded-full bg-primary/20 blur-[60px]" />
      <div className="pointer-events-none absolute -right-[40px] -top-[60px] h-[200px] w-[220px] rounded-full bg-discord/20 blur-[60px]" />
      <Users className="absolute left-[22px] top-[20px] h-[25px] w-[25px] text-primary-glow" strokeWidth={2} />
      <h3 className="absolute left-[56px] top-[21px] text-[17px] font-semibold leading-[22px]">{tx("Følg vores sociale medier")}</h3>

      <p className="absolute left-[22px] top-[60px] text-[16px] font-semibold leading-[21px] text-primary-glow">{tx("Vær først med de nyeste fund")}</p>
      <p className="absolute left-[22px] top-[86px] w-[433px] text-[12px] leading-[17px] text-foreground/85">
        {tx("Live surebets, guides og tips – på de kanaler, du allerede bruger.")}</p>

      <div className="absolute left-[22px] top-[116px] grid w-[433px] grid-cols-4 gap-[10px]">
        {CHANNELS.map(({ name, desc, Icon, tile, brand }) => (
          <a
            key={name}
            href="#"
            aria-label={`Følg BetTrackerAI på ${name}`}
            style={{ "--brand": brand, "--play": "var(--youtube)" } as CSSProperties}
            className="social-tile group relative flex h-[96px] flex-col items-center overflow-hidden rounded-[14px] border pt-[12px] text-center"
          >
            <span className={`flex h-[38px] w-[38px] items-center justify-center rounded-[11px] text-primary-foreground shadow-[0_6px_18px_-6px_var(--brand)] transition-transform duration-300 group-hover:scale-110 ${tile}`}>
              <Icon className="h-[20px] w-[20px]" />
            </span>
            <span className="mt-[8px] text-[12px] font-semibold leading-[15px]">{tx(name)}</span>
            <span className="text-[9.5px] leading-[13px] text-muted-foreground">{tx(desc)}</span>
            <ArrowUpRight className="absolute right-[7px] top-[7px] h-[12px] w-[12px] text-foreground/40 transition-colors group-hover:text-foreground" />
          </a>
        ))}
      </div>

      {/* Latest Telegram post */}
      <div className="value-pill absolute left-[22px] top-[224px] flex h-[30px] w-[433px] items-center gap-[8px] overflow-hidden rounded-full pl-[6px] pr-[12px] text-[10.5px]">
        <span className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-telegram text-primary-foreground">
          <TelegramIcon className="h-[11px] w-[11px]" />
        </span>
        <span className="h-[6px] w-[6px] shrink-0 animate-pulse rounded-full bg-success shadow-[0_0_6px_var(--success)]" />
        {f ? (
          <span key={k} className="row-in flex min-w-0 flex-1 items-center gap-[8px] rounded-full">
            <span className="truncate text-foreground/85">
              {tx("Nyt i kanalen:")}{" "}<span className="font-semibold text-foreground">{tx(f.home.name)} – {tx(f.away.name)}</span>
            </span>
            <span className="ml-auto shrink-0 font-bold text-success">{f.margin.toFixed(2)}%</span>
          </span>
        ) : (
          <span className="truncate text-muted-foreground">{tx("Følg kanalen for nye surebets")}</span>
        )}
      </div>
    </div>
  );
}
