"use client";
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function LogoMark(props: P) {
  return (
    <svg viewBox="0 0 40 36" width={40} height={36} {...props}>
      <defs>
        <linearGradient id="lg-logo" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--neon)" />
        </linearGradient>
      </defs>
      <rect x="2" y="22" width="6" height="12" rx="1.5" fill="url(#lg-logo)" />
      <rect x="11" y="16" width="6" height="18" rx="1.5" fill="url(#lg-logo)" />
      <rect x="20" y="19" width="6" height="15" rx="1.5" fill="url(#lg-logo)" />
      <rect x="29" y="10" width="6" height="24" rx="1.5" fill="url(#lg-logo)" />
      <path d="M3 17 L13 9 L21 13 L35 2" stroke="url(#lg-logo)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29 2 H35.5 V8.5" stroke="url(#lg-logo)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FootballIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5l3.4 2.5-1.3 4h-4.2l-1.3-4z" fill="currentColor" />
      <path d="M12 3v4.5M15.4 10l4.5-1.5M14.1 14l2.7 4M9.9 14l-2.7 4M8.6 10L4.1 8.5" />
    </svg>
  );
}

export function BasketballIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3v18M5.6 5.6c3.2 3.2 3.2 9.6 0 12.8M18.4 5.6c-3.2 3.2-3.2 9.6 0 12.8" />
    </svg>
  );
}

export function TennisIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M6 5.3c3.5 3.7 3.5 9.7 0 13.4M18 5.3c-3.5 3.7-3.5 9.7 0 13.4" />
    </svg>
  );
}

export function HockeyIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M17 3l-7 14H5a2 2 0 0 0 0 4h6l8-18" />
      <ellipse cx="18" cy="19" rx="3" ry="1.6" fill="currentColor" />
    </svg>
  );
}
