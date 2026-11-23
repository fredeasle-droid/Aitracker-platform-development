import WebSocket from 'ws'
import { zstdDecompressSync } from 'node:zlib'
import { decode, encode } from '@msgpack/msgpack'
const cookie = process.env.BETHERO_COOKIE
const run = (filters) => new Promise((resolve) => {
  const rows = new Map()
  const ws = new WebSocket('wss://ws-prematch.betherosports.com/ws/surebets?format=msgpack&compress=zstd&pin=1&formulas=2&view=1&sort=profit-desc&rows=100&touch=1', { headers: { Origin: 'https://betherosports.com', 'User-Agent': 'Mozilla/5.0', Cookie: cookie } })
  ws.on('open', () => ws.send(encode({ filters, ping: Date.now(), view: { sort: 'profit-desc', rows: 100, search: null, exhaustive: false, group: null, pin_leagues: null, pin_events: null, hide: [], id: 1 } })))
  ws.on('message', (d, bin) => { try { const b = Buffer.isBuffer(d) ? d : Buffer.from(d); let m; try { m = decode(zstdDecompressSync(b)) } catch { m = decode(b) }
    const walk = (x) => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') { if (x.event && x.books_1) rows.set(x._id ?? Math.random(), x); if (x.total !== undefined) rows.total = x.total } }
    walk(m) } catch {} })
  setTimeout(() => { ws.terminate(); resolve(rows) }, 9000)
})
for (const f of [['zOUILG38'], []]) {
  const rows = await run(f)
  const books = new Map()
  for (const r of rows.values()) for (const k of ['books_1','books_2']) { const v = r[k]; const n = JSON.stringify(v).slice(0,60); books.set(n, (books.get(n)||0)+1) }
  console.log('filters', JSON.stringify(f), 'rows', rows.size, 'total', rows.total)
  console.log([...books.entries()].sort((a,b)=>b[1]-a[1]).slice(0,25).map(([k,v])=>v+' '+k).join('\n'))
}
process.exit(0)
