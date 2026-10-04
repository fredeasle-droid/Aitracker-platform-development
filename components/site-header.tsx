import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/95">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-white">BetTracker</Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900">
            Hjem
          </Link>
          <Link href="/Feed-test" className="px-3 py-2 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            Test Feed
          </Link>
        </nav>
      </div>
    </header>
  );
}
