import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAdminState } from '@/lib/admin'
import { getSessionInfo } from '@/lib/scraper-session'
import { BETHERO_SOURCE } from '@/lib/scrapers/bethero'
import { SUREBETDANMARK_SOURCE } from '@/lib/scrapers/surebetdanmark'
import { saveBetHeroCookie, saveSureBetDanmarkCookie } from './actions'
import { CookieForm } from './cookie-form'

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

  const [surebetInfo, betHeroInfo] = await Promise.all([getSessionInfo(SUREBETDANMARK_SOURCE), getSessionInfo(BETHERO_SOURCE)])

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-10 bg-[#06111d] px-5 py-10 text-white">
      <section className="flex flex-col gap-6" aria-labelledby="surebetdanmark-heading">
        <header className="flex flex-col gap-2">
          <h1 id="surebetdanmark-heading" className="text-2xl font-extrabold">Surebet Danmark-session</h1>
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

      <section className="flex flex-col gap-6 border-t border-[#243650] pt-10" aria-labelledby="bethero-heading">
        <header className="flex flex-col gap-2">
          <h2 id="bethero-heading" className="text-2xl font-extrabold">Bet Hero-session</h2>
          <p className="leading-relaxed text-[#d6deeb]">
            Indsæt cookien auth_session fra Bet Hero. Den gemmes krypteret i databasen. Cookien gemmes kun, hvis Bet Hero faktisk leverer surebets til din konto.
          </p>
        </header>
        <StatusBox info={betHeroInfo} />
        <CookieForm id="bethero-cookie" label="Cookie fra Bet Hero" placeholder="auth_session=…" action={saveBetHeroCookie} />
        <div className="text-sm leading-relaxed text-[#9fb2cc]">
          <h2 className="mb-1 font-semibold text-white">Sådan finder du den</h2>
          <p>
            Log ind på betherosports.com/arbitrage i Firefox og tryk F12. Åbn fanen Storage, vælg Cookies og betherosports.com, og find rækken auth_session. Dobbeltklik på Value, kopiér hele teksten, og indsæt den her.
          </p>
        </div>
      </section>
    </main>
  )
}
