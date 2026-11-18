"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Club logo on a soft glowing disc; falls back to initials if the image fails. */
export function Crest({ src, name, size = "md", className }: { src: string | null; name: string; size?: "sm" | "md" | "card" | "lg"; className?: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return (
    <span
      className={cn(
        "crest-disc relative inline-flex shrink-0 items-center justify-center rounded-full",
        className,
        size === "lg" ? "h-[64px] w-[64px] p-[7px]" : size === "card" ? "h-[44px] w-[44px] p-[5px]" : size === "md" ? "h-[38px] w-[38px] p-[4px]" : "h-7 w-7 p-[3px]",
      )}
    >
      {failed || !src ? (
        <span className="text-[11px] font-bold text-foreground">{initials}</span>
      ) : (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-contain drop-shadow-[0_1px_2px_var(--surface-deep)]"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
