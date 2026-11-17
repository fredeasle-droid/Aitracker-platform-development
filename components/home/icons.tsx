"use client";

import { useId } from "react";

export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 30 26" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--primary-glow)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      <rect x="0" y="15" width="7" height="11" rx="1" fill={`url(#${id})`} />
      <rect x="8.5" y="9" width="7" height="17" rx="1" fill={`url(#${id})`} />
      <rect x="22" y="1" width="7" height="25" rx="1" fill={`url(#${id})`} />
      <path d="M1 13 L10 6.5 L15.5 9.5 L21 4" stroke="var(--primary-glow)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ big }: { big?: boolean }) {
  return (
    <div className="flex items-center gap-[9px]">
      <LogoMark className={big ? "h-[27px] w-[30px]" : "h-[26px] w-[29px]"} />
      <span className={`font-bold tracking-[-0.3px] ${big ? "text-[18px]" : "text-[17px]"}`}>
        BetTracker<span className="text-primary-glow">AI</span>
      </span>
    </div>
  );
}

export function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="0.5" width="22" height="23" rx="3.5" fill="var(--primary)" />
      <rect x="4" y="3.5" width="16" height="5" rx="1.2" fill="var(--primary-glow)" />
      {[0, 1, 2, 3].map((c) =>
        [0, 1, 2].map((r) => (
          <rect key={`${c}-${r}`} x={4 + c * 4.3} y={11 + r * 3.9} width="2.8" height="2.6" rx="0.6" fill="var(--foreground)" />
        )),
      )}
    </svg>
  );
}

export function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 3 2.6 10.6c-1 .4-1 1.2 0 1.5l4.9 1.5 1.9 5.8c.2.7.6.8 1.1.3l2.8-2.6 5 3.7c.8.5 1.4.2 1.6-.8L23 4.4c.3-1.2-.4-1.8-1-1.4Zm-4 4.2-8.6 7.9-.4 3.4-1.3-4.5L18 7.2Z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="5" fill="currentColor" />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="var(--play, var(--background-deep))" />
    </svg>
  );
}

export function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.5 5.3A17 17 0 0 0 15.3 4l-.5 1a15.6 15.6 0 0 0-5.6 0l-.5-1a17 17 0 0 0-4.2 1.3C1.8 9.4 1 13.4 1.4 17.3A17 17 0 0 0 6.6 20l1.1-1.8c-.6-.2-1.2-.5-1.8-.9l.4-.3a12 12 0 0 0 11.4 0l.4.3c-.6.4-1.2.7-1.8.9l1.1 1.8a17 17 0 0 0 5.2-2.7c.5-4.5-.8-8.5-3.1-12ZM8.7 14.9c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Zm6.6 0c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MobilePayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="12" height="17" rx="2.5" transform="rotate(-14 9 11.5)" fill="none" stroke="var(--social)" strokeWidth="1.8" />
      <rect x="9" y="7" width="12" height="14" rx="2.5" fill="var(--primary)" opacity="0.85" />
      <rect x="11.5" y="10" width="7" height="2" rx="1" fill="var(--foreground)" />
    </svg>
  );
}

export function TrophyIcon({ className }: { className?: string; strokeWidth?: number | string }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <path d="M6 3.5H3.5v2.2c0 2.4 1.7 4.3 4 4.6M18 3.5h2.5v2.2c0 2.4-1.7 4.3-4 4.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 2h12v6.5a6 6 0 0 1-12 0V2Z" fill={`url(#${id})`} />
      <path d="M10.5 14h3v3.5h-3z" fill="currentColor" />
      <path d="M7.5 18h9l1 3.5h-11z" fill="currentColor" />
      <path d="M9 4.5v4" stroke="var(--background-deep)" strokeOpacity="0.25" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
