"use client";
/** Small coloured sport icons used in the sport chips (matches the reference's emoji-style marks). */
type P = { className?: string };

export function SoccerBallIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="var(--foreground)" />
      <path d="M12 7.2 15.6 9.8 14.2 14H9.8L8.4 9.8Z" fill="var(--surface-deep)" />
      <path d="M12 1.5 14.6 3.2 12 5 9.4 3.2Z M21.6 9.2 22.3 12.6 19.6 13.1 19 10Z M2.4 9.2 5 10 4.4 13.1 1.7 12.6Z M6.6 19.6 8.9 18.4 10.4 21.2 7.6 21.6Z M17.4 19.6 16.4 21.6 13.6 21.2 15.1 18.4Z" fill="var(--surface-deep)" />
      <path d="M12 5v2.2M15.6 9.8l3.4-.8M14.2 14l1.5 4.4M9.8 14l-1.5 4.4M8.4 9.8 5 9" stroke="var(--surface-deep)" strokeWidth="1" />
    </svg>
  );
}

export function BasketballIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="var(--warning)" />
      <g fill="none" stroke="var(--surface-deep)" strokeWidth="1.3">
        <path d="M1.5 12h21M12 1.5v21" />
        <path d="M4.6 4.6c3 2.8 3 12 0 14.8M19.4 4.6c-3 2.8-3 12 0 14.8" />
      </g>
    </svg>
  );
}

export function TennisBallIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="var(--gold)" />
      <g fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeOpacity="0.9">
        <path d="M5 3.8c3.4 2.6 4.6 5.4 4.6 8.2S8.4 17.6 5 20.2" />
        <path d="M19 3.8c-3.4 2.6-4.6 5.4-4.6 8.2s1.2 5.6 4.6 8.2" />
      </g>
    </svg>
  );
}

export function PuckIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M2 10v4c0 2.2 4.5 4 10 4s10-1.8 10-4v-4" fill="var(--muted-foreground)" fillOpacity="0.55" />
      <ellipse cx="12" cy="10" rx="10" ry="4" fill="var(--muted-foreground)" />
      <ellipse cx="12" cy="10" rx="6" ry="2" fill="var(--foreground)" fillOpacity="0.25" />
    </svg>
  );
}

export function GamepadIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M7 6h10a5 5 0 0 1 4.9 4l.9 5.2a3 3 0 0 1-5.3 2.4L15.8 16H8.2l-1.7 1.6a3 3 0 0 1-5.3-2.4L2.1 10A5 5 0 0 1 7 6Z"
        fill="var(--surface-elevated)"
        stroke="var(--foreground)"
        strokeWidth="1.4"
      />
      <path d="M7.5 9v4M5.5 11h4" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="10" r="1.1" fill="var(--cyan)" />
      <circle cx="18" cy="12.2" r="1.1" fill="var(--destructive)" />
    </svg>
  );
}
