"use client";
import { useId } from "react";

export function Logo({ tagline = true, compact = false }: { tagline?: boolean; compact?: boolean }) {
  const gid = `logo-g-${useId().replace(/:/g, "")}`;
  const fill = `url(#${gid})`;
  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-2.5"}`}>
      <svg
        viewBox="0 0 48 40"
        className={`${compact ? "h-7 w-8" : "h-10 w-12"} shrink-0 drop-shadow-[0_0_8px_var(--primary)]`}
        aria-hidden
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
        <rect x="2" y="26" width="7" height="12" rx="1.5" fill={fill} />
        <rect x="13" y="19" width="7" height="19" rx="1.5" fill={fill} />
        <rect x="24" y="22" width="7" height="16" rx="1.5" fill={fill} />
        <rect x="35" y="12" width="7" height="26" rx="1.5" fill={fill} />
        <path d="M3 20 L16 10 L27 15 L42 3" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M36 2 L44 2 L44 10" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="leading-none">
        <div className={`${compact ? "text-lg" : "text-[22px]"} whitespace-nowrap font-extrabold tracking-tight text-foreground`}>
          BetTracker<span className="text-cyan">AI</span>
        </div>
        {tagline && (
          <div className="mt-1.5 whitespace-nowrap text-[7.5px] font-semibold tracking-[0.07em] text-muted-foreground">
            SURE BETS • SMARTER • BETTER
          </div>
        )}
      </div>
    </div>
  );
}
