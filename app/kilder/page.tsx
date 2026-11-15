import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAdminState } from '@/lib/admin'
import { getBetHeroSnapshot } from '@/lib/bethero-ingest'
import { getSessionInfo } from '@/lib/scraper-session'
import { BETHERO_SOURCE } from '@/lib/scrapers/bethero'
import { SUREBETDANMARK_SOURCE } from '@/lib/scrapers/surebetdanmark'
import { getOddsJamSnapshot, ODDSJAM_SOURCE } from '@/lib/scrapers/oddsjam'
import { saveBetHeroCookie, saveOddsJamCookie, saveSureBetDanmarkCookie } from './actions'
import { CookieForm } from './cookie-form'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Kilder – BetTracker', robots: { index: false, follow: false } }

const formatTime = (date: Date | null) =>
  date ? new Intl.DateTimeFormat('da-DK', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Copenhagen' }).format(date) : 'Aldrig'

type SessionInfo = Awaited<ReturnType<typeof getSessionInfo>>

function StatusBox({ info, statusOverride }: { info: SessionInfo; statusOverride?: string }) {
  return (
    <section aria-label="Status" className="flex flex-col gap-2 rounded-xl border border-[#243650] bg-[#0a1725] p-4 text-sm">
      <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Gemt</span><span>{formatTime(info?.updatedAt ?? null)}</span></div>
      <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Sidst brugt</span><span>{formatTime(info?.lastCheckedAt ?? null)}</span></div>
      <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Status</span><span className="text-right">{statusOverride ?? info?.lastStatus ?? 'Ingen session gemt'}</span></div>
    </section>
  )
}

export default async function SourcesPage() {
  const state = await getAdminState()
  if (state === 'signed-out') redirect('/konto')

  const [surebetInfo, betHeroInfo, oddsJamInfo, snapshot, oddsJamSnapshot] = await Promise.all([
    getSessionInfo(SUREBETDANMARK_SOURCE),
    getSessionInfo(BETHERO_SOURCE),
    getSessionInfo(ODDSJAM_SOURCE),
    getBetHeroSnapshot(),
    getOddsJamSnapshot(),
  ])
  const bridgeIsFresh = Boolean(snapshot?.updatedAt && Date.now() - snapshot.updatedAt.getTime() < 60_000)
  const oddsJamBridgeIsFresh = Boolean(oddsJamSnapshot?.updatedAt && Date.now() - oddsJamSnapshot.updatedAt.getTime() < 180_000)

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
            Indsæt din Bet Hero-cookie én gang, ligesom for Surebet Danmark. Serveren henter derefter data hvert minut uden at du skal have noget åbent.
          </p>
        </header>
        <StatusBox info={betHeroInfo} statusOverride={bridgeIsFresh ? 'Aktiv via bridge' : undefined} />
        <section aria-label="Seneste data" className="flex flex-col gap-2 rounded-xl border border-[#243650] bg-[#0a1725] p-4 text-sm">
          <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Sidst modtaget</span><span>{formatTime(snapshot?.updatedAt ?? null)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Rækker</span><span>{snapshot?.rowCount ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Data</span><span className="text-right">{snapshot ? snapshot.summary : 'Intet modtaget endnu'}</span></div>
        </section>
        <CookieForm
          id="bethero-cookie"
          label="Cookie-værdi fra Bet Hero"
          placeholder="auth_session=…; bh_auth=1"
          action={saveBetHeroCookie}
        />
        <a href="/api/bethero/userscript" download className="flex items-center justify-center rounded-xl bg-[#1769ff] px-4 py-3 text-center font-semibold text-white transition hover:bg-[#2f7bff]">
          Hent automatisk Bet Hero-bridge
        </a>
        <div className="text-sm leading-relaxed text-[#9fb2cc]">
          <h2 className="mb-1 font-semibold text-white">Automatisk løsning</h2>
          <p>
            Hent scriptet én gang og installer det i Tampermonkey/Violentmonkey. Det åbner BetTracker automatisk, sender Bet Hero-data videre og opdaterer Bet Hero-fanen hvert 5. minut. Du skal ikke bruge Console eller kopiere cookies.
          </p>
        </div>
        {snapshot?.sample && (
          <details className="text-xs text-[#9fb2cc]">
            <summary className="cursor-pointer font-semibold text-white">Eksempel på modtaget række</summary>
            <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-[#243650] bg-[#081725] p-3">{snapshot.sample}</pre>
          </details>
        )}
      </section>

      <section className="flex flex-col gap-6 rounded-2xl border border-[#243650] bg-[#081725] p-5" aria-labelledby="oddsjam-heading">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#49d6a8]">Kilde 3</p>
          <h2 id="oddsjam-heading" className="text-2xl font-extrabold">OddsJam</h2>
          <p className="leading-relaxed text-[#d6deeb]">
            OddsJam viser arbitrage-data i din indloggede browser. Browser-broen sender synlige rækker til scanneren; den læser ikke skjulte endpoints og kræver ikke, at du kopierer en cookie.
          </p>
        </header>
        <section aria-label="OddsJam browser-feed" className="flex flex-col gap-2 rounded-xl border border-[#243650] bg-[#0a1725] p-4 text-sm">
          <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Bridge-status</span><span>{oddsJamBridgeIsFresh ? 'Aktiv' : 'Venter på browserforbindelse'}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Sidst modtaget</span><span>{formatTime(oddsJamSnapshot?.updatedAt ?? null)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Rækker</span><span>{oddsJamSnapshot?.rowCount ?? 0}</span></div>
          <p className="text-right text-[#9fb2cc]">{oddsJamSnapshot?.summary ?? 'Ingen rækker modtaget endnu'}</p>
        </section>
        <a href="/api/oddsjam/userscript" download className="flex items-center justify-center rounded-xl bg-[#1769ff] px-4 py-3 text-center font-semibold text-white transition hover:bg-[#2f7bff]">
          Hent OddsJam browser-bridge
        </a>
        <div className="text-sm leading-relaxed text-[#9fb2cc]">
          <h2 className="mb-1 font-semibold text-white">Sådan forbindes den</h2>
          <p>Installer scriptet i Tampermonkey eller Violentmonkey, genindlæs OddsJams Arbitrage-side, og klik på knappen “Forbind BetTracker”. Lad OddsJam-fanen og modtagervinduet stå åbne, så rækkerne kan opdateres.</p>
          <p className="mt-2">Kun rækker, der vises i din browser, sendes. Sikkerhedskontroller bliver ikke omgået.</p>
        </div>
        <details className="flex flex-col gap-4 text-sm text-[#9fb2cc]">
          <summary className="cursor-pointer font-semibold text-white">Valgfri cookie-test (bruges ikke af live-scanneren)</summary>
          <StatusBox info={oddsJamInfo} />
          <CookieForm
            id="oddsjam-cookie"
            label="Cookie-header fra OddsJam"
            placeholder="session=…; other_cookie=…"
            action={saveOddsJamCookie}
            submitLabel="Test side og gem cookie"
          />
          <p>Testen bekræfter kun, at siden kan åbnes. Del aldrig cookien i chatten.</p>
        </details>
      </section>
    </main>
  )
}
