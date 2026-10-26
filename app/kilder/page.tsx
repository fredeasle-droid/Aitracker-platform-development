import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAdminState } from '@/lib/admin'
import { buildConsoleSnippet, getBetHeroSnapshot } from '@/lib/bethero-ingest'
import { getSessionInfo } from '@/lib/scraper-session'
import { SUREBETDANMARK_SOURCE } from '@/lib/scrapers/surebetdanmark'
import { saveSureBetDanmarkCookie } from './actions'
import { CookieForm } from './cookie-form'
import { SnippetBox } from './snippet-box'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Kilder – BetTracker', robots: { index: false, follow: false } }

const formatTime = (date: Date | null) =>
  date ? new Intl.DateTimeFormat('da-DK', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Copenhagen' }).format(date) : 'Aldrig'

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-3 bg-[#06111d] px-5 py-10 text-white">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="leading-relaxed text-[#d6deeb]">{children}</p>
    </main>
  )
}

type SessionInfo = Awaited<ReturnType<typeof getSessionInfo>>

function StatusBox({ info }: { info: SessionInfo }) {
  return (
    <section aria-label="Status" className="flex flex-col gap-2 rounded-xl border border-[#243650] bg-[#0a1725] p-4 text-sm">
      <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Gemt</span><span>{formatTime(info?.updatedAt ?? null)}</span></div>
      <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Sidst brugt</span><span>{formatTime(info?.lastCheckedAt ?? null)}</span></div>
      <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Status</span><span className="text-right">{info?.lastStatus ?? 'Ingen session gemt'}</span></div>
    </section>
  )
}

export default async function SourcesPage() {
  const state = await getAdminState()
  if (state === 'signed-out') redirect('/konto')
  if (state === 'not-configured') return <Notice title="Kilder">Siden er låst, indtil miljøvariablen ADMIN_EMAILS er sat til din e-mail.</Notice>
  if (state === 'forbidden') return <Notice title="Ingen adgang">Din konto har ikke adgang til denne side.</Notice>

  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? ''
  const snippet = buildConsoleSnippet(`https://${host}/bethero-bro`)
  const [surebetInfo, snapshot] = await Promise.all([getSessionInfo(SUREBETDANMARK_SOURCE), getBetHeroSnapshot()])

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-8 bg-[#06111d] px-5 py-10 text-white">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f86a3]">Datakilder</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Forbindelser</h1>
        <p className="leading-relaxed text-[#d6deeb]">Administrér hver feed separat. Cookies og browserforbindelser holdes adskilt.</p>
      </header>

      <section className="flex flex-col gap-6 rounded-2xl border border-[#243650] bg-[#081725] p-5" aria-labelledby="surebetdanmark-heading">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#49d6a8]">Kilde 1</p>
          <h2 id="surebetdanmark-heading" className="text-2xl font-extrabold">Surebet Danmark</h2>
          <p className="leading-relaxed text-[#d6deeb]">
            Indsæt Cookie-headeren én gang. Den gemmes krypteret i databasen, og scanneren gemmer selv fornyede cookies, hvis siden sender dem.
          </p>
        </header>
        <StatusBox info={surebetInfo} />
        <CookieForm
          id="surebetdanmark-cookie"
          label="Cookie-værdi fra feed-kaldet"
          placeholder="sb-…-auth-token.0=…; sb-…-auth-token.1=…"
          action={saveSureBetDanmarkCookie}
        />
        <div className="text-sm leading-relaxed text-[#9fb2cc]">
          <h2 className="mb-1 font-semibold text-white">Sådan finder du den</h2>
          <p>
            Firefox på pc: åbn surebetdanmark.dk/surebets, tryk F12, vælg Network og genindlæs. Klik på et feed-kald, find Cookie under Request Headers, højreklik og vælg Copy Value.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6 rounded-2xl border border-[#243650] bg-[#081725] p-5" aria-labelledby="bethero-heading">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#49d6a8]">Kilde 2</p>
          <h2 id="bethero-heading" className="text-2xl font-extrabold">Bet Hero</h2>
          <p className="leading-relaxed text-[#d6deeb]">
            Bet Hero afviser vores server, men ikke din browser. Kør koden nedenfor på betherosports.com/arbitrage, så sender din browser surebets videre hertil. Der gemmes ingen cookie.
          </p>
        </header>
        <section aria-label="Seneste data" className="flex flex-col gap-2 rounded-xl border border-[#243650] bg-[#0a1725] p-4 text-sm">
          <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Sidst modtaget</span><span>{formatTime(snapshot?.updatedAt ?? null)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Rækker</span><span>{snapshot?.rowCount ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Status</span><span className="text-right">{snapshot ? snapshot.summary : 'Intet modtaget endnu'}</span></div>
        </section>
        <SnippetBox code={snippet} />
        <div className="text-sm leading-relaxed text-[#9fb2cc]">
          <h2 className="mb-1 font-semibold text-white">Sådan bruger du den</h2>
          <ol className="list-decimal pl-5">
            <li>Klik på Kopiér koden.</li>
            <li>Åbn betherosports.com/arbitrage i Chrome, og vær logget ind.</li>
            <li>Tryk F12 og åbn fanen Console.</li>
            <li>Skriv allow pasting, tryk Enter, indsæt koden med Ctrl+V og tryk Enter.</li>
            <li>Der åbner et lille vindue, &quot;BetTracker modtager&quot;. Lad det stå åbent. Efter ca. 10 sekunder står der en grøn linje i det. Genindlæs denne side for at se rækkerne.</li>
          </ol>
          <p className="mt-2">Koden sender nye data hvert minut, så længe begge faner er åbne.</p>
        </div>
        {snapshot?.sample && (
          <details className="text-xs text-[#9fb2cc]">
            <summary className="cursor-pointer font-semibold text-white">Eksempel på modtaget række</summary>
            <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-[#243650] bg-[#081725] p-3">{snapshot.sample}</pre>
          </details>
        )}
      </section>
    </main>
  )
}
