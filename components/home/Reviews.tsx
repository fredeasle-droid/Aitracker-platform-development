"use client";

import { useLocale } from "@/components/locale-provider";
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { REVIEWS, REVIEW_SECONDS, type Review } from "./data";

/** Index of the review after `i`, wrapping back to the first one after the last. */
export function nextReview(i: number, count = REVIEWS.length) {
  return (i + 1) % count;
}

/** Cycles through the reviews every few seconds; pauses while the pointer rests on them and
 *  resumes with the time that was left, so an on-screen timer bar stays in step. */
export function useReviewRotation() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const remaining = useRef(REVIEW_SECONDS * 1000);
  // Each new review gets the full time (runs before the timer effect below).
  useEffect(() => {
    remaining.current = REVIEW_SECONDS * 1000;
  }, [index]);
  useEffect(() => {
    if (paused) return;
    const started = performance.now();
    const t = setTimeout(() => setIndex((i) => nextReview(i)), remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [index, paused]);
  return {
    index,
    paused,
    review: REVIEWS[index] ?? REVIEWS[0]!,
    next: () => setIndex((i) => nextReview(i)),
    prev: () => setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length),
    go: setIndex,
    hold: { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false) },
  };
}

export function ReviewAvatar({ review, className = "" }: { review: Review; className?: string }) {
  const { tx } = useLocale();
  return <img src={review.avatar} alt={tx(review.name)} loading="lazy" width={192} height={192} className={`rounded-full object-cover ${className}`} />;
}

/** The customer's photo for the current review; fades in each time the review changes. */
export function ReviewPhoto({ review, className = "" }: { review: Review; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        key={review.name}
        src={review.photo}
        alt={`${review.name}, BetTrackerAI-kunde`}
        loading="lazy"
        width={1280}
        height={800}
        style={{ objectPosition: review.focus }}
        className="h-full w-full object-cover animate-in fade-in duration-700"
      />
    </div>
  );
}

export function Stars({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className="flex gap-px" aria-label={`${n} ud af 5 stjerner`}>
      {Array.from({ length: 5 }, (_, k) => (
        <Star key={k} className={`${className} ${k < n ? "fill-gold text-gold" : "text-muted-foreground/50"}`} />
      ))}
    </span>
  );
}

export function ReviewDots({ index, go, className = "", dot = "h-[6px] w-[6px]" }: { index: number; go: (i: number) => void; className?: string; dot?: string }) {
  return (
    <div className={`flex items-center gap-[5px] ${className}`}>
      {REVIEWS.map((r, k) => (
        <button
          key={r.name}
          type="button"
          onClick={() => go(k)}
          aria-label={`Vis anmeldelse fra ${r.name}`}
          aria-current={k === index}
          className={`${dot} rounded-full transition-colors ${k === index ? "bg-primary-glow" : "bg-foreground/25 hover:bg-foreground/50"}`}
        />
      ))}
    </div>
  );
}

/** Scrolls to the visible "Se hvordan BetTrackerAI virker" video and starts it. */
export function playExplainerVideo() {
  const video = Array.from(document.querySelectorAll<HTMLVideoElement>("video[data-explainer]")).find((v) => v.offsetParent !== null);
  if (!video) return;
  video.scrollIntoView({ behavior: "smooth", block: "center" });
  void video.play();
}
