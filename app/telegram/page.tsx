import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { asc, desc } from 'drizzle-orm'
import { getOwnerState } from '@/lib/admin'
import { db } from '@/lib/db'
import { telegramGroups, telegramPosts } from '@/lib/db/schema'
import { getBotName, getSettings, hasBotToken } from '@/lib/telegram'
import { addGroup, addPost, deleteGroup, deletePost, findGroups, saveSchedule, sendNow, toggleGroup, togglePost } from './actions'
import { StateForm } from './state-form'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Telegram – BetTracker', robots: { index: false, follow: false } }

const formatTime = (date: Date | null) =>
  date ? new Intl.DateTimeFormat('da-DK', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Copenhagen' }).format(date) : 'Aldrig'

const inputStyle =
  'w-full rounded-xl border border-[#38506b] bg-[#081725] p-3 text-sm text-white outline-none placeholder:text-[#8da2bc] focus:border-[#138cff]'
const cardStyle = 'flex flex-col gap-5 rounded-2xl border border-[#243650] bg-[#081725] p-5'
const smallButton = 'rounded-lg border border-[#38506b] px-3 py-1.5 text-xs font-semibold text-white hover:border-[#138cff]'

function RowActions({ id, active, onToggle, onDelete }: { id: number; active: boolean; onToggle: (formData: FormData) => Promise<void>; onDelete: (formData: FormData) => Promise<void> }) {
  return (
    <div className="flex gap-2">
      <form action={onToggle}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={smallButton}>{active ? 'Sæt på pause' : 'Aktivér'}</button>
      </form>
      <form action={onDelete}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={`${smallButton} text-[#ff8290]`}>Slet</button>
      </form>
    </div>
  )
}

export default async function TelegramPage() {
  const state = await getOwnerState()
  if (state === 'signed-out') redirect('/konto')
  if (state === 'forbidden') {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-2 bg-[#06111d] px-5 py-10 text-white">
        <h1 className="text-2xl font-extrabold">Ingen adgang</h1>
        <p className="text-[#d6deeb]">Kun ejeren af BetTracker kan styre Telegram-opslag.</p>
      </main>
    )
  }

  const [settings, groups, posts, botName] = await Promise.all([
    getSettings(),
    db.select().from(telegramGroups).orderBy(asc(telegramGroups.id)),
    db.select().from(telegramPosts).orderBy(desc(telegramPosts.id)),
    hasBotToken() ? getBotName() : Promise.resolve(null),
  ])

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-8 bg-[#06111d] px-5 py-10 text-white">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f86a3]">Markedsføring</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-balance">Telegram-opslag</h1>
        <p className="leading-relaxed text-[#d6deeb]">
          Botten sender dine egne opslag til de grupper, hvor den er medlem, på de tidspunkter du vælger. Opslagene roterer, så den næste i køen sendes hver gang.
        </p>
      </header>

      <section aria-label="Bot-status" className="flex flex-col gap-2 rounded-xl border border-[#243650] bg-[#0a1725] p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-[#9fb2cc]">Bot</span>
          <span className={hasBotToken() ? 'text-[#5be39a]' : 'text-[#ff8290]'}>
            {hasBotToken() ? (botName ? `@${botName}` : 'Token gemt, men Telegram afviser den') : 'TELEGRAM_BOT_TOKEN mangler'}
          </span>
        </div>
        <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Aktive grupper</span><span>{groups.filter((group) => group.active).length}</span></div>
        <div className="flex justify-between gap-4"><span className="text-[#9fb2cc]">Aktive opslag</span><span>{posts.filter((post) => post.active).length}</span></div>
      </section>

      <section className={cardStyle} aria-labelledby="schedule-heading">
        <h2 id="schedule-heading" className="text-2xl font-extrabold">Tidsplan</h2>
        <StateForm action={saveSchedule} submitLabel="Gem tidsplan" pendingLabel="Gemmer…">
          <label htmlFor="hours" className="text-sm font-semibold">Klokkeslæt (dansk tid, fulde timer adskilt af komma)</label>
          <input id="hours" name="hours" defaultValue={settings.hours.join(',')} placeholder="10,15,20" className={inputStyle} />
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input type="checkbox" name="enabled" defaultChecked={settings.enabled} className="size-5 accent-[#138cff]" />
            Automatisk postning er slået til
          </label>
        </StateForm>
        <StateForm action={sendNow} submitLabel="Send næste opslag nu" pendingLabel="Sender…" variant="secondary" />
      </section>

      <section className={cardStyle} aria-labelledby="groups-heading">
        <h2 id="groups-heading" className="text-2xl font-extrabold">Grupper</h2>
        <p className="text-sm leading-relaxed text-[#9fb2cc]">
          En gruppeadmin skal tilføje botten som medlem. Derefter finder du gruppen her, eller indsætter chat-ID eller @brugernavn manuelt.
        </p>
        <StateForm action={findGroups} submitLabel="Find grupper botten er med i" pendingLabel="Søger…" variant="secondary" />
        <StateForm action={addGroup} submitLabel="Tilføj gruppe" pendingLabel="Tjekker…">
          <label htmlFor="chat" className="text-sm font-semibold">Chat-ID eller @brugernavn</label>
          <input id="chat" name="chat" required placeholder="@gruppenavn eller -1001234567890" className={inputStyle} />
        </StateForm>
        {groups.length === 0 ? (
          <p className="text-sm text-[#9fb2cc]">Ingen grupper endnu.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {groups.map((group) => (
              <li key={group.id} className="flex flex-col gap-3 rounded-xl border border-[#243650] bg-[#0a1725] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{group.title || group.chatId}</p>
                    <p className="text-xs text-[#9fb2cc]">{group.chatId}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${group.active ? 'bg-[#0f3a2c] text-[#5be39a]' : 'bg-[#2a3447] text-[#9fb2cc]'}`}>
                    {group.active ? 'Aktiv' : 'Pause'}
                  </span>
                </div>
                <p className="text-xs text-[#9fb2cc]">Sidst: {formatTime(group.lastPostedAt)} · {group.lastStatus ?? 'Ikke brugt endnu'}</p>
                <RowActions id={group.id} active={group.active} onToggle={toggleGroup} onDelete={deleteGroup} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={cardStyle} aria-labelledby="posts-heading">
        <h2 id="posts-heading" className="text-2xl font-extrabold">Opslag</h2>
        <StateForm action={addPost} submitLabel="Tilføj til køen" pendingLabel="Gemmer…">
          <label htmlFor="body" className="text-sm font-semibold">Tekst</label>
          <textarea id="body" name="body" required rows={6} maxLength={4096} placeholder="Skriv dit opslag…" className={`${inputStyle} resize-y leading-relaxed`} />
          <label htmlFor="imageUrl" className="text-sm font-semibold">Billed-link (valgfrit, https)</label>
          <input id="imageUrl" name="imageUrl" type="url" placeholder="https://…" className={inputStyle} />
        </StateForm>
        {posts.length === 0 ? (
          <p className="text-sm text-[#9fb2cc]">Ingen opslag endnu.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-col gap-3 rounded-xl border border-[#243650] bg-[#0a1725] p-4">
                <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed">{post.body}</p>
                <p className="text-xs text-[#9fb2cc]">
                  {post.active ? 'Aktiv' : 'Pause'} · Sidst sendt: {formatTime(post.lastPostedAt)}{post.imageUrl ? ' · med billede' : ''}
                </p>
                <RowActions id={post.id} active={post.active} onToggle={togglePost} onDelete={deletePost} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
