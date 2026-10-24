import Link from 'next/link'
import { Bell, Search } from 'lucide-react'
import { BrandMark } from '@/components/icons'
import { HeaderControls } from '@/components/header-controls'

export function DesktopHeader() {
  return (
    <header className="sticky top-0 z-40 hidden h-[70px] items-center gap-8 border-b border-[#102b49] bg-[linear-gradient(180deg,#061a31_0%,#050f1f_100%)] px-6 lg:flex">
      <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="BetTracker forside">
        <BrandMark className="h-11 w-14 shrink-0" />
        <span className="flex flex-col">
          <span className="text-[32px] font-extrabold leading-none tracking-tight">
            Bet<span className="text-primary">Tracker</span>
          </span>
          <span className="mt-1 text-[10px] font-medium leading-tight text-[#a9b6d3]">
            {'SIKKERBETS · ENKLERE · STØRRE OVERBLIK'}
          </span>
        </span>
      </Link>

      <form action="/" role="search" className="mx-auto w-full max-w-[570px]">
        <label htmlFor="desktop-search" className="sr-only">
          Søg efter kampe, ligaer eller hold
        </label>
        <div className="flex h-11 items-center gap-3 rounded-full border border-[#1f4fa0] bg-[#060f20] px-4 focus-within:border-primary">
          <Search className="size-5 shrink-0 text-[#d5ddef]" aria-hidden="true" />
          <input
            id="desktop-search"
            name="q"
            type="search"
            placeholder="Søg efter kampe, ligaer eller hold..."
            className="w-full bg-transparent text-[14px] text-foreground placeholder:text-[#d5ddef] focus:outline-none"
          />
        </div>
      </form>

      <HeaderControls
        beforeAccount={
          <Link
            href="/konto"
            aria-label="Notifikationer"
            className="relative mx-2 flex size-11 items-center justify-center rounded-lg text-[#d5ddef] hover:bg-[#102744]"
          >
            <Bell className="size-6" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#ff4d5e]" aria-hidden="true" />
          </Link>
        }
      />
    </header>
  )
}
