import { ingestToken } from '@/lib/bethero-ingest'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const origin = new URL(request.url).origin
  const bridge = `${origin}/bethero-bro`
  const token = ingestToken()
  const script = `// ==UserScript==
// @name         BetTracker Bet Hero bridge
// @match        https://betherosports.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
(() => {
  const BRIDGE = ${JSON.stringify(bridge)};
  const TOKEN = ${JSON.stringify(token)};
  const MAX = 80;
  let popup = null;
  let pending = [];
  let flushTimer = null;
  const toB64 = (buffer) => { const bytes = new Uint8Array(buffer); let text = ''; for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(text); };
  const open = () => { if (!popup || popup.closed) popup = window.open(BRIDGE, 'bettracker-bridge', 'width=460,height=360'); };
  const send = () => { if (!pending.length) return; open(); if (popup && !popup.closed) { popup.postMessage({ type: 'bettracker', token: TOKEN, messages: pending.splice(0, MAX) }, new URL(BRIDGE).origin); } };
  const scheduleSend = () => { clearTimeout(flushTimer); flushTimer = setTimeout(send, 5000); };
  window.addEventListener('message', (event) => { if (event.origin === new URL(BRIDGE).origin && event.data?.type === 'bettracker-ready') send(); });
  const Native = window.WebSocket;
  window.WebSocket = class extends Native {
    constructor(url, protocols) {
      super(url, protocols);
      if (!String(url).includes('/ws/surebets')) return;
      this.addEventListener('message', (event) => { Promise.resolve(event.data instanceof Blob ? event.data.arrayBuffer() : event.data).then(data => pending.push(typeof data === 'string' ? { text: data } : { b64: toB64(data) })).then(scheduleSend); });
    }
  };
  setInterval(() => { if (location.pathname.includes('/arbitrage')) location.reload(); }, 300000);
  setTimeout(open, 2500);
})();
`
  return new Response(script, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Content-Disposition': 'attachment; filename="bettracker-bethero.user.js"' } })
}
