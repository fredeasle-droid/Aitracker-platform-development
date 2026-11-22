export default function StatsLoading() {
  return (
    <main className="flex w-full flex-col gap-4 px-4 py-6 lg:px-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Henter dit regnskab…</span>
      <div className="h-9 w-56 animate-pulse rounded-xl bg-card" />
      <div className="h-4 w-72 max-w-full animate-pulse rounded-lg bg-card" />
      <div className="h-64 animate-pulse rounded-3xl border border-border bg-card" />
      <div className="h-48 animate-pulse rounded-3xl border border-border bg-card" />
    </main>
  )
}
