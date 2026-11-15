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
  let pendingCatalog = [];
  let flushTimer = null;
  const scanCatalog = () => {
    const found = new Map();
    document.querySelectorAll('[data-bookmaker], [data-bookmaker-name], [role="option"]').forEach((node) => {
      const element = node;
      const name = element.getAttribute('data-bookmaker') || element.getAttribute('data-bookmaker-name') || element.textContent?.trim();
      if (!name || name.length < 2 || name.length > 80) return;
      const owner = element.closest('[data-country], [data-category], [role="dialog"]') || element;
      const country = owner.getAttribute?.('data-country') || undefined;
      const category = owner.getAttribute?.('data-category') || undefined;
      found.set(country + '|' + category + '|' + name, { name, country, category });
    });
    pendingCatalog = [...found.values()];
  };
  const toB64 = (buffer) => { const bytes = new Uint8Array(buffer); let text = ''; for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(text); };
  const open = () => { if (!popup || popup.closed) popup = window.open(BRIDGE, 'bettracker-bridge', 'width=460,height=360'); };
  const send = () => { scanCatalog(); if (!pending.length && !pendingCatalog.length) return; open(); if (popup && !popup.closed) { popup.postMessage({ type: 'bettracker', token: TOKEN, messages: pending.splice(0, MAX), catalog: pendingCatalog.splice(0) }, new URL(BRIDGE).origin); } };
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
  setInterval(() => { if (location.pathname.includes('/arbitrage')) location.reload(); }, 60000);
  setTimeout(open, 2500);
})();
`
  return new Response(script, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Content-Disposition': 'attachment; filename="bettracker-bethero.user.js"' } })
}
