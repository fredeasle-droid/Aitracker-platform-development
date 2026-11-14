export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const bridge = `${new URL(request.url).origin}/oddsjam-bro`
  const script = `// ==UserScript==
// @name         BetTracker OddsJam visible-row bridge
// @match        https://oddsjam.com/betting-tools/arbitrage*
// @match        https://www.oddsjam.com/betting-tools/arbitrage*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
(() => {
  const BRIDGE = ${JSON.stringify(bridge)};
  const BRIDGE_ORIGIN = new URL(BRIDGE).origin;
  const MAX_ROWS = 100;
  let popup = null;
  let pendingRows = [];
  let lastFingerprint = '';
  let lastSentAt = 0;
  let connected = false;

  const visible = (node) => node instanceof HTMLElement && node.getClientRects().length > 0 && getComputedStyle(node).visibility !== 'hidden';
  const attrs = (node) => {
    const found = [];
    const add = (value) => { const clean = String(value || '').trim(); if (clean && clean.length < 80 && !found.includes(clean)) found.push(clean); };
    add(node.getAttribute?.('aria-label'));
    add(node.getAttribute?.('title'));
    add(node.getAttribute?.('alt'));
    if (node.querySelectorAll) node.querySelectorAll('[aria-label], [title], img[alt]').forEach((item) => {
      add(item.getAttribute('aria-label'));
      add(item.getAttribute('title'));
      add(item.getAttribute('alt'));
    });
    return found;
  };
  const isRowText = (text) => text.length > 50 && text.length < 1800 && /\\d+(?:\\.\\d+)?%/.test(text) && /\\bvs\\.?\\b/i.test(text) && (text.match(/\\b\\d+\\.\\d{2}\\b/g) || []).length >= 2;
  const nearestLegText = (node, row) => {
    let current = node.parentElement;
    for (let depth = 0; current && current !== row && depth < 5; depth++, current = current.parentElement) {
      const text = (current.innerText || '').trim();
      if (text.length > 4 && text.length < 180 && /\\b(?:over|under|yes|no|draw|home|away)\\b/i.test(text)) return text;
    }
    return (node.parentElement?.innerText || '').trim().slice(0, 160);
  };
  const serializeRow = (row) => {
    const text = (row.innerText || '').trim();
    const prices = Array.from(row.querySelectorAll('*')).filter((node) => {
      if (!visible(node) || node.children.length > 0) return false;
      const value = (node.textContent || '').trim();
      return /^\\d+\\.\\d{2}$/.test(value) && Number(value) > 1;
    });
    const seenLegs = new Set();
    const legs = prices.map((node) => {
      const odds = Number((node.textContent || '').trim());
      const signature = odds + '|' + nearestLegText(node, row);
      if (seenLegs.has(signature)) return null;
      seenLegs.add(signature);
      let container = node.parentElement;
      for (let depth = 0; container && container !== row && depth < 4; depth++, container = container.parentElement) {
        if ((container.innerText || '').length > 220) break;
        if (/\\b(?:over|under|yes|no|draw|home|away)\\b/i.test(container.innerText || '')) break;
      }
      return { odds, text: nearestLegText(node, row), labels: attrs(container || node.parentElement || node) };
    }).filter(Boolean).slice(0, 2);
    return {
      text,
      labels: attrs(row),
      legs,
      capturedAt: Date.now(),
      timezoneOffset: new Date().getTimezoneOffset(),
    };
  };
  const collectRows = () => {
    const candidates = new Set();
    document.querySelectorAll('tr, [role="row"]').forEach((row) => {
      if (visible(row) && isRowText(row.innerText || '')) candidates.add(row);
    });
    if (!candidates.size) {
      document.querySelectorAll('body *').forEach((node) => {
        if (node.children.length || !visible(node) || !/^\\d{1,3}(?:\\.\\d{1,2})?%$/.test((node.textContent || '').trim())) return;
        let parent = node.parentElement;
        for (let depth = 0; parent && depth < 9; depth++, parent = parent.parentElement) {
          if (isRowText(parent.innerText || '')) { candidates.add(parent); break; }
        }
      });
    }
    const seen = new Set();
    return Array.from(candidates).map(serializeRow).filter((row) => {
      const key = row.text.replace(/\\s+/g, ' ').trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, MAX_ROWS);
  };
  const openBridge = () => {
    if (!popup || popup.closed) popup = window.open(BRIDGE, 'oddsjam-bettracker-bridge', 'width=460,height=480');
    return popup && !popup.closed;
  };
  const send = () => {
    if (!pendingRows.length || !openBridge()) return;
    popup.postMessage({ type: 'oddsjam-data', rows: pendingRows }, BRIDGE_ORIGIN);
    pendingRows = [];
    lastSentAt = Date.now();
  };
  const scan = () => {
    if (!location.pathname.includes('/betting-tools/arbitrage')) return;
    const rows = collectRows();
    if (!rows.length) return;
    const fingerprint = JSON.stringify(rows.map((row) => row.text));
    if (fingerprint === lastFingerprint && Date.now() - lastSentAt < 60000) return;
    lastFingerprint = fingerprint;
    pendingRows = rows;
    send();
  };
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Forbind BetTracker';
  button.setAttribute('aria-label', 'Forbind OddsJam til BetTracker');
  button.style.cssText = 'position:fixed;top:190px;right:14px;z-index:2147483647;border:1px solid #159ed0;border-radius:8px;background:#062d40;color:#fff;padding:10px 14px;font:600 13px/1.2 system-ui;cursor:pointer;box-shadow:0 4px 14px #0008';
  button.addEventListener('click', () => { if (openBridge()) { button.textContent = 'Forbinder BetTracker…'; scan(); } else { button.textContent = 'Tillad popup og klik igen'; } });
  document.documentElement.appendChild(button);
  window.addEventListener('message', (event) => {
    if (event.origin !== BRIDGE_ORIGIN || !event.data) return;
    if (event.data.type === 'oddsjam-ready') { connected = true; button.textContent = 'BetTracker forbundet'; send(); }
    if (event.data.type === 'oddsjam-result') { button.textContent = event.data.ok ? 'BetTracker forbundet' : 'BetTracker: forbindelsesfejl'; }
  });
  setTimeout(scan, 3000);
  setInterval(scan, 15000);
  setInterval(() => { if (!connected) button.textContent = 'Forbind BetTracker'; }, 30000);
})();
`
  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Content-Disposition': 'attachment; filename="bettracker-oddsjam.user.js"',
      'Cache-Control': 'no-store',
    },
  })
}
