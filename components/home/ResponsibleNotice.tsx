"use client";

import { Fragment } from "react";
import { useLocale } from "@/components/locale-provider";
import { localHelp } from "@/lib/responsible-help";
import { RESPONSIBLE } from "./data";

const linkCls = "font-semibold text-primary-glow underline-offset-2 hover:underline";

function DanishLinks() {
  return (
    <>
      {"Spil ansvarligt – du skal være fyldt"} {RESPONSIBLE.minAge} {"år. Brug for hjælp? Ring til StopSpillet på"}{" "}
      <a href={`tel:${RESPONSIBLE.stopSpilletPhone.replace(/\s/g, "")}`} className={linkCls}>{RESPONSIBLE.stopSpilletPhone}</a>{" "}{"eller besøg"}{" "}
      <a href={RESPONSIBLE.stopSpilletUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>StopSpillet.dk</a>{". Udeluk dig selv fra spil på"}{" "}
      <a href={RESPONSIBLE.rofusUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>ROFUS.nu</a>.
    </>
  );
}

function Links() {
  const { locale } = useLocale();
  const help = localHelp(locale);
  if (!help) return <DanishLinks />;
  return (
    <>
      {help.text}
      {help.links.map((link, i) => (
        <Fragment key={link.href}>
          {i === 0 ? " " : " · "}
          <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkCls}>{link.label}</a>
        </Fragment>
      ))}
      {help.links.length > 0 && "."}
    </>
  );
}

function AgeBadge({ className }: { className: string }) {
  const { locale } = useLocale();
  const help = localHelp(locale);
  const minAge = help?.minAge ?? RESPONSIBLE.minAge;
  return (
    <span aria-label={help?.ageLabel ?? `Kun for personer over ${minAge} år`} className={`flex shrink-0 items-center justify-center rounded-full border-2 border-destructive font-black ${className}`}>
      {minAge}+
    </span>
  );
}

/** Desktop canvas strip under the footer. */
export function ResponsibleNotice() {
  return (
    <div role="note" className="border-t border-border/50 bg-background-deep/70">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-5 py-3 text-[12px] leading-[18px] text-foreground/85 lg:px-8">
        <AgeBadge className="size-8 text-[11px]" />
        <p><Links /></p>
      </div>
    </div>
  );
}

/** Phone layout version. */
export function MobileResponsibleNotice() {
  return (
    <div role="note" className="mt-6 flex items-start gap-3 rounded-[12px] border border-border/60 bg-background-deep/60 p-3 text-[12px] leading-[18px] text-foreground/85">
      <AgeBadge className="h-9 w-9 text-[12px]" />
      <p><Links /></p>
    </div>
  );
}
