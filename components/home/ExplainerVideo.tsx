"use client";

import { useState, type RefObject } from "react";
import { Play } from "lucide-react";
const videoAsset = { url: "" };
const posterAsset = { url: "/home/explainer-video.jpg" };
import { VideoControls, type Layout } from "./VideoFrame";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function ExplainerVideo({ videoRef, l }: { videoRef: RefObject<HTMLVideoElement | null>; l: Layout }) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) void v.play();
    else v.pause();
  };

  const started = playing || t > 0;
  const progress = started && dur > 0 ? Math.min(100, (t / dur) * 100) : l.progress;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[14px]">
      <video
        ref={videoRef}
        data-explainer
        className="h-full w-full object-cover"
        src={videoAsset.url}
        poster={posterAsset.url}
        preload="metadata"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Sæt videoen på pause" : "Afspil videoen"}
        className="absolute inset-0 cursor-pointer"
      >
        {!playing && (
          <span className="absolute left-[232px] top-[118px] flex h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-background/35 backdrop-blur-[2px]">
            <Play className="ml-[3px] h-[24px] w-[24px] fill-current" />
          </span>
        )}
      </button>
      <VideoControls time={started ? fmt(t) : "0:29"} l={{ ...l, progress }} playing={playing} />
    </div>
  );
}
