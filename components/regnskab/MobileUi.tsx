"use client";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

/** Section title with an icon tile, optional count and an action on the right. */
export function SectionHeader({
  id,
  icon: Icon,
  title,
  count,
  action,
}: {
  id?: string;
  icon: LucideIcon;
  title: string;
  count?: number;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="flex items-center gap-2.5 font-display text-base font-semibold">
        <span className="icon-chip h-8 w-8">
          <Icon className="h-4 w-4 text-primary-glow" />
        </span>
        {title}
        {count !== undefined && (
          <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-bold tabular-nums text-muted-foreground">
            {count}
          </span>
        )}
      </h2>
      {action}
    </div>
  );
}

/** Small blue "Tilføj" button used in section headers. */
export function AddButton({ onClick, label = "Tilføj" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-xl bg-gradient-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground glow-primary active:scale-95"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

/** Friendly empty state with a glowing icon and an optional call to action. */
export function EmptyState({
  icon: Icon,
  title,
  text,
  actionLabel,
  onAction,
  className,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-4 py-6 text-center", className)}>
      <span className="icon-chip mb-1 h-12 w-12 rounded-2xl">
        <Icon className="h-6 w-6 text-primary-glow" />
      </span>
      <div className="font-display text-base font-semibold">{title}</div>
      <p className="max-w-[260px] text-sm text-muted-foreground">{text}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 flex items-center gap-1.5 rounded-xl border border-primary-glow/50 bg-primary/15 px-4 py-2 text-sm font-semibold text-primary-glow active:scale-95"
        >
          <Plus className="h-4 w-4" /> {actionLabel}
        </button>
      )}
    </div>
  );
}

/** Green pill with a pulsing dot, like the website's "LIVE" badges. */
export function LivePill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      {children}
    </span>
  );
}
