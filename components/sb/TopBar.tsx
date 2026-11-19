"use client";
import { Search, Bell, ChevronDown, Command, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";
import { Logo } from "./Logo";

function DanishFlag() {
  return (
    <svg viewBox="0 0 37 28" className="h-4 w-5 rounded-[2px]" aria-hidden>
      <rect width="37" height="28" fill="var(--destructive)" />
      <rect x="12" width="4" height="28" fill="var(--foreground)" />
      <rect y="12" width="37" height="4" fill="var(--foreground)" />
    </svg>
  );
}

export function TopBar() {
  return (
    <header className="flex flex-col gap-3 pb-3.5 pt-3">
      <div className="flex items-center gap-3 lg:hidden">
        <Sheet>
          <SheetTrigger
            aria-label="Åbn menu"
            className="glass-pill flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition hover:brightness-125"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[270px] overflow-y-auto border-sidebar-border bg-sidebar px-4 pb-4 pt-6">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <div className="flex min-w-0 flex-1 justify-center">
          <Logo tagline={false} compact />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button className="glass-pill relative flex h-11 w-11 items-center justify-center rounded-full transition hover:brightness-125" aria-label="Notifikationer">
            <Bell className="h-5 w-5 text-foreground/85" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              3
            </span>
          </button>
          <div className="bg-gradient-primary flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-primary-foreground shadow-glow">
            FM
          </div>
        </div>
      </div>
      <div className="hidden items-center gap-4 lg:flex">
      <div className="mx-auto flex w-full min-w-0 max-w-[570px] items-center gap-3 rounded-full border border-border-glow bg-surface-deep/70 px-5 py-3 shadow-glow">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          placeholder="Søg efter hold, ligaer eller bookmakere..."
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
        />
        <kbd className="hidden items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-muted-foreground sm:flex">
          <Command className="h-3 w-3" /> K
        </kbd>
      </div>
      <div className="flex shrink-0 items-center gap-3.5">
        <div className="glass-pill hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold text-success sm:flex">
          <span className="glow-dot h-2.5 w-2.5 animate-blink rounded-full bg-success" /> Live
        </div>
        <button className="glass-pill hidden items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition hover:brightness-125 md:flex">
          <DanishFlag /> DK <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
        <button className="glass-pill relative flex h-10 w-10 items-center justify-center rounded-full transition hover:brightness-125" aria-label="Notifikationer">
          <Bell className="h-5 w-5 text-foreground/85" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </button>
        <div className="bg-gradient-primary flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-primary-foreground shadow-glow">
          FM
        </div>
      </div>
      </div>
    </header>
  );
}
