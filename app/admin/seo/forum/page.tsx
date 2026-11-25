import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Check, ExternalLink, Trash2, Undo2, X } from 'lucide-react'
import { getOwnerState } from '@/lib/admin'
import { FORUM_KEYWORDS, getForumThreads, redditConfigured, THREAD_STATUSES, type ForumThread, type ThreadStatus } from '@/lib/seo/forum-radar'
import { AddThreadForm, CopyButton, RegenerateButton, ScanButton } from '@/components/seo/forum-controls'
import { deleteThread, regenerateDraft, setThreadStatus } from './actions'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const metadata: Metadata = { title: 'Forum-radar – BetTracker', robots: { index: false, follow: false } }

const card = 'flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 lg:p-6'
const ghostButton = 'inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:border-primary'
const TAB_LABELS: Record<ThreadStatus, string> = { new: 'Til svar', posted: 'Besvaret', skipped: 'Sprunget over' }

function StatusForm({ id, status, children }: { id: number; status: ThreadStatus; children: React.ReactNode }) {
  return (
    <form action={setThreadStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      {children}
    </form>
  )
}

function ThreadCard({ thread }: { thread: ForumThread }) {
  return (
    <li className={card}>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-primary-glow">
          {thread.community ?? 'Forum'}
          {thread.keyword && <span className="font-normal text-muted-foreground"> · fundet via &quot;{thread.keyword}&quot;</span>}
        </p>
        <a href={thread.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-pretty text-lg font-bold text-foreground hover:text-primary-glow">
          {thread.title}
          <ExternalLink className="mt-1.5 size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">(åbner i ny fane)</span>
        </a>
        {thread.body && <p className="line-clamp-3 text-pretty text-sm leading-relaxed text-muted-foreground">{thread.body}</p>}
      </div>

      {thread.draft ? (
        <div className="flex flex-col gap-2 rounded-xl bg-muted p-4">
          <p className="text-sm font-semibold text-foreground">Svarforslag</p>
          <p className="whitespace-pre-line text-pretty leading-relaxed text-foreground/90">{thread.draft}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Intet svarforslag endnu.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {thread.draft && <CopyButton text={thread.draft} />}
        <form action={regenerateDraft}>
          <input type="hidden" name="id" value={thread.id} />
          <RegenerateButton />
        </form>
        {thread.status === 'new' ? (
          <>
            <StatusForm id={thread.id} status="posted">
              <button type="submit" className={ghostButton}>
                <Check className="size-4" aria-hidden="true" />
                Jeg har svaret
              </button>
            </StatusForm>
            <StatusForm id={thread.id} status="skipped">
              <button type="submit" className={ghostButton}>
                <X className="size-4" aria-hidden="true" />
                Spring over
              </button>
            </StatusForm>
          </>
        ) : (
          <StatusForm id={thread.id} status="new">
            <button type="submit" className={ghostButton}>
              <Undo2 className="size-4" aria-hidden="true" />
              Flyt tilbage
            </button>
          </StatusForm>
        )}
        <form action={deleteThread} className="ml-auto">
          <input type="hidden" name="id" value={thread.id} />
          <button type="submit" className="flex size-11 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive">
            <Trash2 className="size-4" aria-hidden="true" />
            <span className="sr-only">Slet tråd</span>
          </button>
        </form>
      </div>
    </li>
  )
}

export default async function ForumRadarPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const state = await getOwnerState()
  if (state === 'signed-out') redirect('/konto')
  if (state === 'forbidden') {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-16">
        <h1 className="text-2xl font-bold text-foreground">Ingen adgang</h1>
        <p className="text-muted-foreground">Forum-radaren er kun for ejere af BetTracker.</p>
      </main>
    )
  }

  const requested = (await searchParams).status as ThreadStatus
  const status: ThreadStatus = THREAD_STATUSES.includes(requested) ? requested : 'new'
  const threads = await getForumThreads(status)
  const reddit = redditConfigured()

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-20 pt-6 lg:gap-8 lg:px-10 lg:pt-10">
      <header className="flex flex-col gap-4">
        <Link href="/admin/seo" className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          SEO-dashboard
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-glow">Admin</p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">Forum-radar</h1>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
              Find tråde hvor folk spørger om surebets, få et svarforslag, og post det selv fra din egen profil. Svar kun hvor du reelt kan hjælpe.
            </p>
          </div>
          <ScanButton disabled={!reddit} />
        </div>
      </header>

      {!reddit && (
        <section className={card} aria-labelledby="reddit-setup">
          <h2 id="reddit-setup" className="text-lg font-bold text-foreground">
            Slå automatisk Reddit-søgning til
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Reddit blokerer søgning uden nøgle. Med en gratis nøgle søger radaren hver morgen efter: {FORUM_KEYWORDS.join(', ')}.
          </p>
          <ol className="flex list-decimal flex-col gap-2 pl-5 leading-relaxed text-foreground/90">
            <li>Gå til reddit.com/prefs/apps logget ind på din Reddit-konto.</li>
            <li>Klik &quot;create another app&quot;, vælg typen &quot;script&quot; og skriv {'"https://bettrackerai.com"'} som redirect uri.</li>
            <li>
              Læg koden under appens navn ind som <code className="rounded bg-muted px-1.5 py-0.5 text-sm">REDDIT_CLIENT_ID</code> og &quot;secret&quot; som{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm">REDDIT_CLIENT_SECRET</code> under Vars i v0.
            </li>
          </ol>
        </section>
      )}

      <section className={card} aria-labelledby="add-thread">
        <h2 id="add-thread" className="text-lg font-bold text-foreground">
          Tilføj en tråd
        </h2>
        <AddThreadForm />
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="threads-title">
        <h2 id="threads-title" className="sr-only">
          Tråde
        </h2>
        <nav aria-label="Status" className="flex gap-2 overflow-x-auto">
          {THREAD_STATUSES.map((value) => (
            <Link
              key={value}
              href={value === 'new' ? '/admin/seo/forum' : `/admin/seo/forum?status=${value}`}
              aria-current={value === status ? 'page' : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-xl px-4 text-sm font-semibold ${
                value === status ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground hover:border-primary'
              }`}
            >
              {TAB_LABELS[value]}
            </Link>
          ))}
        </nav>
        {threads.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">Ingen tråde her endnu.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
