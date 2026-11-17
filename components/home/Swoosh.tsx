"use client";

/** Hand-drawn style underline used under highlighted words. */
export function Swoosh({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 11 C 50 4, 120 1, 198 5" fill="none" stroke="var(--primary-glow)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
