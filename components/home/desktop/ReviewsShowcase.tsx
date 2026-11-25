"use client";

import { useLocale } from "@/components/locale-provider";
import Link from "@/components/localized-link";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { PRICING, REVIEWS, REVIEW_SECONDS } from "../data";
import { useReviewRotation } from "../Reviews";
import { SectionHeading } from "./effects";

const avg = REVIEWS.reduce((s, r) => s + r.stars, 0) / REVIEWS.length;
const allFive = REVIEWS.filter((r) => r.stars === 5).length;
const pad = (n: number) => String(n).padStart(2, "0");
const names = REVIEWS.map((r) => r.name);
const nameList = `${names.slice(0, -1).join(", ")} og ${names[names.length - 1]}`;

function PopStars({ n, size, delay = 0 }: { n: number; size: string; delay?: number }) {
  return (
    <span className="flex gap-[3px]" aria-label={`${n} ud af 5 stjerner`}>
      {Array.from({ length: 5 }, (_, k) => (
        <Star
          key={k}
          className={`star-pop ${size} ${k < n ? "fill-gold text-gold" : "text-muted-foreground/50"}`}
          style={{ animationDelay: `${delay + k * 70}ms` }}
        />
      ))}
    </span>
  );
}

function RatingSummary() {
  const { tx } = useLocale();
  return (
    <div className="rating-card flex h-[72px] items-center gap-[14px] rounded-[16px] pl-[16px] pr-[20px]">
      <span className="font-display text-[38px] font-bold leading-none tracking-[-0.04em]">{avg.toFixed(1).replace(".", ",")}</span>
      <span className="leading-[14px]">
        <PopStars n={Math.round(avg)} size="h-[13px] w-[13px]" />
        <span className="mt-[5px] block text-[10.5px] font-medium">{tx("Gennemsnit af")}{" "}{tx(REVIEWS.length)} {" "}{tx("anmeldelser")}</span>
        <span className="block text-[9.5px] text-muted-foreground">{tx(allFive)} {" "}{tx("af")}{" "}{tx(REVIEWS.length)} {" "}{tx("gav 5 stjerner")}</span>
      </span>
    </div>
  );
}

/** Desktop "Kundeanmeldelser": big featured review with photo, the other reviews as selectable cards beside it. */
export function ReviewsShowcase() {
  const { tx } = useLocale();
  const r = useReviewRotation();
  const { review, index, paused } = r;

  return (
    <section id="anmeldelser" className="reveal relative ml-[28px] mt-[80px] w-[969px] scroll-mt-[80px]">
      <SectionHeading
        eyebrow={tx("Kundeanmeldelser")}
        Icon={Star}
        title={tx("Det siger vores brugere")}
        accent={tx("– med egne ord.")}
        aside={<RatingSummary />}
      />

      <div className="mt-[18px] grid grid-cols-[1fr_340px] gap-[18px]" {...r.hold}>
        {/* Featured review */}
        <article className="review-stage spotlight group/zoom relative h-[304px] overflow-hidden rounded-[22px]">
          <div className="review-photo-fade absolute inset-y-0 right-0 w-[350px] overflow-hidden">
            <img
              key={review.name}
              src={review.photo}
              alt={`${review.name}, BetTrackerAI-kunde`}
              loading="lazy"
              width={1280}
              height={800}
              style={{ objectPosition: review.focus }}
              className="ken-burns zoom-photo h-full w-full object-cover"
            />
            <div className="review-photo-shade absolute inset-0" />
          </div>
          <span className="glass-chip absolute right-[18px] top-[18px] flex h-[26px] items-center gap-[5px] rounded-full px-[10px] text-[10.5px] font-semibold">
            <Star className="h-[11px] w-[11px] fill-gold text-gold" />
            {tx(review.stars)}/5
          </span>

          <div key={index} className="absolute left-[32px] top-[16px] w-[300px]">
            <span className="quote-mark quote-in block font-display text-[52px] font-bold leading-[36px]" aria-hidden="true">“</span>
            <PopStars n={review.stars} size="h-[15px] w-[15px]" delay={100} />
            <h3 className="quote-in mt-[8px] font-display text-[20px] font-bold leading-[24px] tracking-[-0.03em]" style={{ "--d": "140ms" } as React.CSSProperties}>
              {tx(review.title)}
            </h3>
            <p className="quote-in mt-[6px] text-[12px] leading-[18px] text-foreground/85" style={{ "--d": "240ms" } as React.CSSProperties}>
              {tx(review.text)}
            </p>
          </div>

          <div className="absolute bottom-[18px] left-[32px] right-[24px] flex items-center">
            <img key={review.avatar} src={review.avatar} alt="" width={192} height={192} className="quote-in h-[42px] w-[42px] rounded-full object-cover ring-2 ring-primary-glow/60 ring-offset-2 ring-offset-background-deep" />
            <span className="ml-[12px] leading-[16px]">
              <span className="block text-[14px] font-semibold">{tx(review.name)}</span>
              <span className="block text-[10.5px] text-muted-foreground">{tx("BetTrackerAI-kunde")}</span>
            </span>
            <span className="ml-auto mr-[12px] font-display text-[11px] font-semibold tabular-nums text-foreground/70">
              <span className="text-foreground">{pad(index + 1)}</span> / {pad(REVIEWS.length)}
            </span>
            <button type="button" onClick={r.prev} aria-label={tx("Forrige anmeldelse")} className="nav-round flex h-[34px] w-[34px] items-center justify-center rounded-full">
              <ChevronLeft className="h-[15px] w-[15px]" />
            </button>
            <button type="button" onClick={r.next} aria-label={tx("Næste anmeldelse")} className="nav-round ml-[8px] flex h-[34px] w-[34px] items-center justify-center rounded-full">
              <ChevronRight className="h-[15px] w-[15px]" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-foreground/10">
            <span key={index} data-paused={paused} className="review-timer block h-full" style={{ animationDuration: `${REVIEW_SECONDS}s` }} />
          </div>
        </article>

        {/* All reviews */}
        <ul className="flex flex-col gap-[8px]">
          {REVIEWS.map((x, k) => {
            const active = k === index;
            return (
              <li key={x.name}>
                <button
                  type="button"
                  onClick={() => r.go(k)}
                  aria-current={active}
                  aria-label={`Vis anmeldelse fra ${x.name}`}
                  className="review-tab group relative flex h-[70px] w-full items-center gap-[12px] overflow-hidden rounded-[15px] pl-[14px] pr-[16px] text-left"
                >
                  <img
                    src={x.avatar}
                    alt=""
                    loading="lazy"
                    width={192}
                    height={192}
                    className={`h-[44px] w-[44px] shrink-0 rounded-full object-cover transition-all duration-300 ${active ? "ring-2 ring-primary-glow" : "opacity-70 saturate-50 group-hover:opacity-100 group-hover:saturate-100"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold leading-[17px]">{tx(x.name)}</span>
                      <span className="flex gap-[1px]">
                        {Array.from({ length: x.stars }, (_, s) => (
                          <Star key={s} className="h-[9px] w-[9px] fill-gold text-gold" />
                        ))}
                      </span>
                    </span>
                    <span className={`block text-[11px] font-semibold leading-[15px] ${active ? "text-primary-glow" : "text-foreground/80"}`}>{tx(x.title)}</span>
                    <span className="block truncate text-[10.5px] leading-[15px] text-muted-foreground">“{tx(x.text)}”</span>
                  </span>
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-foreground/10">
                      <span key={index} data-paused={paused} className="review-timer block h-full" style={{ animationDuration: `${REVIEW_SECONDS}s` }} />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Call to action under the reviews */}
      <div className="panel-soft mt-[14px] flex h-[56px] items-center gap-[14px] rounded-[16px] pl-[18px] pr-[12px]">
        <div className="flex">
          {REVIEWS.map((x, k) => (
            <img key={x.name} src={x.avatar} alt="" loading="lazy" width={192} height={192} className={`h-[30px] w-[30px] rounded-full object-cover ring-2 ring-background-deep ${k ? "-ml-[9px]" : ""}`} />
          ))}
        </div>
        <p className="text-[12px] leading-[16px]">
          <span className="font-semibold">{tx(nameList)}</span> <span className="text-muted-foreground">{tx("er allerede i gang. Bliv den næste.")}</span>
        </p>
        <Link href="/konto" className="btn-glow ml-auto flex h-[38px] items-center gap-[8px] rounded-full px-[20px] text-[12.5px] font-semibold">
          {tx("Start dine")}{" "}{tx(PRICING.trialDays)} {" "}{tx("gratis dage")}{" "}<ArrowRight className="h-[14px] w-[14px]" />
        </Link>
      </div>
    </section>
  );
}
