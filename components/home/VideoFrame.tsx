"use client";

import { useLocale } from "@/components/locale-provider";
import { Maximize, Pause, Play, Volume2 } from "lucide-react";

export type Layout = {
  playX: number; trackFrom: number; trackTo: number; progress: number; volumeX: number; timeX: number; fullX: number; barY: number;
};

export function VideoControls({ time, l, playing = false }: { time: string; l: Layout; playing?: boolean }) {
  const { tx } = useLocale();
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 bottom-0 h-[44px] bg-gradient-to-t from-background-deep/95 via-background-deep/50 to-transparent" />
      {playing ? (
        <Pause className="absolute h-[11px] w-[11px] -translate-y-1/2 fill-current" style={{ left: l.playX, top: l.barY }} />
      ) : (
        <Play className="absolute h-[11px] w-[11px] -translate-y-1/2 fill-current" style={{ left: l.playX, top: l.barY }} />
      )}
      <div className="absolute h-[2px] -translate-y-1/2 rounded-full bg-foreground/35" style={{ left: l.trackFrom, top: l.barY, width: l.trackTo - l.trackFrom }}>
        <div className="absolute inset-y-0 left-0 rounded-full bg-foreground" style={{ width: l.progress }} />
        <span className="absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" style={{ left: l.progress }} />
        <span className="absolute left-0 top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-primary-glow" />
      </div>
      <Volume2 className="absolute h-[12px] w-[12px] -translate-y-1/2 fill-current" style={{ left: l.volumeX, top: l.barY }} />
      <span className="absolute -translate-y-1/2 text-[7.5px]" style={{ left: l.timeX, top: l.barY }}>{tx(time)}</span>
      <Maximize className="absolute h-[11px] w-[11px] -translate-y-1/2" style={{ left: l.fullX, top: l.barY }} />
    </div>
  );
}
