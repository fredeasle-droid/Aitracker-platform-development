import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { getServerLocale } from "@/lib/locale-server";
import { Landmark } from "lucide-react";
import { DiscordIcon, InstagramIcon, Logo, MobilePayIcon, TelegramIcon, YoutubeIcon } from "@/components/home/icons";
import { copyrightYear } from "@/components/home/data";
import { MobileResponsibleNotice, ResponsibleNotice } from "@/components/home/ResponsibleNotice";
import { NewsletterForm } from "@/components/site/newsletter-form";

const linkCls = "block py-[5px] text-[15px] text-foreground/80 transition-colors hover:text-primary-glow";
const headingCls = "mb-2 text-[16px] font-semibold text-foreground";

const LINKS = [
  { href: "/", label: "Forside" },
  { href: "/surebets", label: "Surebets" },
  { href: "/dagens-surebets", label: "Dagens surebets" },
  { href: "/guide", label: "Guides" },
  { href: "/stats", label: "Analytics" },
  { href: "/konto", label: "Indstillinger" },
];

const SUPPORT = [
  { href: "/om-os", label: "Om os" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt os" },
  { href: "/vilkaar", label: "Vilkår & Betingelser" },
  { href: "/privatlivspolitik", label: "Privatlivspolitik" },
];

const SOCIAL = [
  { href: "/telegram", label: "Telegram", Icon: TelegramIcon },
  { href: "#", label: "YouTube", Icon: YoutubeIcon },
  { href: "#", label: "Discord", Icon: DiscordIcon },
  { href: "#", label: "Instagram", Icon: InstagramIcon },
];

function FooterWaves() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 1600 420"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="footer-wave-top" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="var(--primary-glow)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="footer-wave-low" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="0.45" stopColor="var(--primary-glow)" stopOpacity="0.85" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.15" />
        </linearGradient>
        <filter id="footer-wave-glow" x="-5%" y="-40%" width="110%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path d="M0 22C320 70 760 86 1000 84S1480 60 1600 6" stroke="url(#footer-wave-top)" strokeWidth="2.5" filter="url(#footer-wave-glow)" />
      <path d="M0 22C320 70 760 86 1000 84S1480 60 1600 6" stroke="url(#footer-wave-top)" strokeWidth="1.2" />
      <path d="M0 300C260 292 560 296 800 340S1260 420 1600 338" stroke="url(#footer-wave-low)" strokeWidth="2.5" filter="url(#footer-wave-glow)" />
      <path d="M0 300C260 292 560 296 800 340S1260 420 1600 338" stroke="url(#footer-wave-low)" strokeWidth="1.2" />
      <path d="M520 360C860 310 1240 280 1600 306" stroke="url(#footer-wave-low)" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

const TRANSLATED_HREFS = new Set(["/", "/surebets", "/dagens-surebets", "/guide", "/faq"]);

export async function GlobalFooter() {
  const locale = await getServerLocale();
  const hrefFor = (href: string) => (TRANSLATED_HREFS.has(href) ? localePath(locale, href) : href);
  return (
    <>
      <footer className="bt-theme mt-6 bg-linear-to-b from-transparent via-background-deep/80 to-background-deep px-4 pb-8 pt-20 md:hidden">
        <Link href="/" aria-label="BetTrackerAI forside" className="block w-fit text-foreground">
          <Logo />
        </Link>
        <p className="mt-1 pl-[38px] text-[14px] text-foreground/90">Scan. Find. Vind.</p>

        <div className="mt-6 grid grid-cols-2 gap-x-6">
          <nav aria-label="Links">
            <p className="mb-2 text-[14px] font-semibold text-foreground">Links</p>
            {LINKS.map((l) => (
              <Link key={l.label} href={hrefFor(l.href)} className="block py-[5px] text-[14px] leading-[17px] text-foreground/85 transition-colors hover:text-primary-glow">
                {l.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Support">
            <p className="mb-2 text-[14px] font-semibold text-foreground">Support</p>
            {SUPPORT.map((l) => (
              <Link key={l.label} href={hrefFor(l.href)} className="block py-[5px] text-[14px] leading-[17px] text-foreground/85 transition-colors hover:text-primary-glow">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-7 text-[14px] font-semibold text-foreground">Følg os</p>
        <ul className="mt-3 flex items-center gap-5 text-social">
          {SOCIAL.map(({ href, label, Icon }) => (
            <li key={label}>
              <Link href={href} aria-label={label} className="block transition-colors hover:text-primary-glow">
                <Icon className="size-[22px]" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[16px] font-semibold text-foreground">Hold dig opdateret</p>
        <p className="mb-3 mt-1 text-[13px] text-foreground/85">Få de nyeste surebets direkte i din indbakke.</p>
        <NewsletterForm compact />

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-foreground/90">
          <span className="text-[16px] font-black italic tracking-[-0.5px]">VISA</span>
          <span className="flex" aria-label="Mastercard">
            <span className="size-[18px] rounded-full bg-destructive" />
            <span className="-ml-[6px] size-[18px] rounded-full bg-mc-orange/90" />
          </span>
          <span className="flex items-center gap-1.5 text-[13px]">
            <MobilePayIcon className="size-[18px]" /> MobilePay
          </span>
          <span className="flex items-center gap-1.5 text-[13px] font-semibold">
            <Landmark className="size-[16px] text-gold" aria-hidden="true" /> Bankoverførsel
          </span>
        </div>

        <MobileResponsibleNotice />

        <p className="mt-5 text-[12px] text-foreground/60">© {copyrightYear()} BetTrackerAI. Alle rettigheder forbeholdes.</p>
      </footer>

      <footer className="bt-theme relative mt-16 hidden overflow-hidden bg-background-deep md:block">
        <FooterWaves />

        <div className="relative mx-auto max-w-[1600px] px-5 pb-10 pt-24 lg:px-10 lg:pt-32">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.65fr_0.9fr_0.75fr_1.6fr] lg:gap-0">
            <div className="flex flex-col gap-3 lg:border-r lg:border-primary/25 lg:pr-8">
              <Logo xl />
              <p className="text-[17px] text-foreground/90 lg:pl-[65px]">Scan. Find. Vind.</p>
            </div>

            <nav aria-label="Links" className="lg:pl-12">
              <p className={headingCls}>Links</p>
              {LINKS.map((l) => (
                <Link key={l.label} href={hrefFor(l.href)} className={linkCls}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <nav aria-label="Support" className="lg:pl-6">
              <p className={headingCls}>Support</p>
              {SUPPORT.map((l) => (
                <Link key={l.label} href={hrefFor(l.href)} className={linkCls}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="lg:pl-6">
              <p className={headingCls}>Følg os</p>
              <ul className="mt-4 flex items-center gap-5 text-social">
                {SOCIAL.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <Link href={href} aria-label={label} className="block transition-colors hover:text-primary-glow">
                      <Icon className="size-7" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-primary/25 lg:pl-12">
              <p className="text-[19px] font-semibold text-foreground">Hold dig opdateret</p>
              <p className="mb-3 text-[16px] text-foreground/85">Få de nyeste surebets direkte i din indbakke.</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-5 text-[14px] text-foreground/85 sm:flex-row sm:items-center lg:mt-24">
            <span>© {copyrightYear()} BetTrackerAI. Alle rettigheder forbeholdes.</span>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-foreground/85">
              <span className="text-[24px] font-black italic tracking-[-0.5px]">VISA</span>
              <span className="flex" aria-label="Mastercard">
                <span className="size-[28px] rounded-full bg-destructive" />
                <span className="-ml-[10px] size-[28px] rounded-full bg-mc-orange/90" />
              </span>
              <span className="flex items-center gap-2 text-[17px]">
                <MobilePayIcon className="size-[28px]" /> MobilePay
              </span>
              <span className="flex items-center gap-2 text-[17px] font-semibold">
                <Landmark className="size-[26px] text-gold" aria-hidden="true" /> Bankoverførsel
              </span>
            </div>
          </div>
        </div>
      </footer>
      <div className="bt-theme hidden md:block">
        <ResponsibleNotice />
      </div>
    </>
  );
}
