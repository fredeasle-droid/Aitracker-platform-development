import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { Logo, MobilePayIcon, TelegramIcon } from "@/components/home/icons";
import { copyrightYear } from "@/components/home/data";
import { MobileResponsibleNotice, ResponsibleNotice } from "@/components/home/ResponsibleNotice";

const linkCls = "block py-1 text-[13px] text-foreground/80 transition-colors hover:text-primary-glow";

const LINKS = [
  { href: "/", label: "Forside" },
  { href: "/surebets", label: "Surebets" },
  { href: "/stats", label: "Analytics" },
  { href: "/bonus", label: "Bonus" },
  { href: "/konto", label: "Indstillinger" },
];

const SUPPORT = [
  { href: "/#faq", label: "FAQ" },
  { href: "/beregn", label: "Surebet-beregner" },
  { href: "/telegram", label: "Telegram-alerts" },
  { href: "/login", label: "Log ind" },
];

export function GlobalFooter() {
  return (
    <>
      <footer className="bt-theme relative overflow-hidden border-t border-border bg-background-deep/60">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-glow/70 to-transparent"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr] lg:px-8">
          <div className="flex flex-col gap-3">
            <Logo big />
            <p className="text-[13px] text-muted-foreground">Scan. Find. Vind.</p>
          </div>

          <nav aria-label="Links">
            <p className="mb-2 text-[13px] font-semibold">Links</p>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Support">
            <p className="mb-2 text-[13px] font-semibold">Support</p>
            {SUPPORT.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-start gap-3">
            <p className="text-[13px] font-semibold">Kom i gang i dag</p>
            <p className="text-[13px] text-muted-foreground">Prøv BetTrackerAI gratis og få de nyeste surebets direkte på din konto.</p>
            <Link href="/konto" className="btn-glow group flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-semibold">
              Opret konto <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link href="/telegram" aria-label="Telegram" className="mt-1 text-social transition-colors hover:text-primary-glow">
              <TelegramIcon className="size-6" />
            </Link>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-5 py-5 text-[12px] text-muted-foreground sm:flex-row sm:items-center lg:px-8">
            <span>© {copyrightYear()} BetTrackerAI. Alle rettigheder forbeholdes.</span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-foreground/80">
              <span className="text-[15px] font-black italic tracking-[-0.5px]">VISA</span>
              <span className="flex" aria-label="Mastercard">
                <span className="size-[17px] rounded-full bg-destructive" />
                <span className="-ml-[7px] size-[17px] rounded-full bg-mc-orange/90" />
              </span>
              <span className="flex items-center gap-1.5">
                <MobilePayIcon className="size-[18px]" /> MobilePay
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Landmark className="size-[17px] text-gold" aria-hidden="true" /> Bankoverførsel
              </span>
            </div>
          </div>
        </div>
      </footer>
      <div className="bt-theme">
        <div className="hidden md:block">
          <ResponsibleNotice />
        </div>
        <div className="md:hidden">
          <MobileResponsibleNotice />
        </div>
      </div>
    </>
  );
}
