import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { isProductionOddsJamBridgeRequest } from '@/lib/oddsjam-bridge-origin'
import { createOddsJamIngestToken, isOwnerEmail } from '@/lib/oddsjam-token'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (!isProductionOddsJamBridgeRequest(request)) {
    return Response.json({ error: 'Use the production BetTracker domain for OddsJam.' }, { status: 403 })
  }
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return Response.json({ error: 'Log ind på BetTracker først.' }, { status: 401 })
  if (!isOwnerEmail(session.user.email)) return Response.json({ error: 'Kun ejere kan hente OddsJam-scriptet.' }, { status: 403 })

  const origin = new URL(request.url).origin
  const endpoint = `${origin}/api/ingest/oddsjam`
  const token = createOddsJamIngestToken(session.user.id)
  const host = new URL(origin).hostname

  const script = `// ==UserScript==
// @name         BetTracker OddsJam direct bridge
// @version      2.0
// @match        https://oddsjam.com/betting-tools/arbitrage*
// @match        https://www.oddsjam.com/betting-tools/arbitrage*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      ${host}
// ==/UserScript==
(() => {
  const ENDPOINT = ${JSON.stringify(endpoint)};
  const TOKEN = ${JSON.stringify(token)};
  const MAX_ROWS = 100;
  let lastFingerprint = '';
  let lastSentAt = 0;
  let sending = false;
  let scannedCount = 0;
  let statusText = 'Starter…';
  const panel = document.createElement('div');
  panel.setAttribute('role', 'status');
  panel.setAttribute('aria-live', 'polite');
  panel.style.cssText = 'position:fixed;top:190px;right:14px;z-index:2147483647;width:230px;border:1px solid #159ed0;border-radius:10px;background:#062d40;color:#fff;padding:12px 14px;font:13px/1.45 system-ui;box-shadow:0 4px 14px #0008';
  const panelTitle = document.createElement('strong');
  panelTitle.textContent = 'BetTracker OddsJam';
  panelTitle.style.cssText = 'display:block;font-size:14px;margin-bottom:4px';
  const countLine = document.createElement('span');
  const statusLine = document.createElement('span');
  statusLine.style.color = '#b8d9e8';
  panel.append(panelTitle, countLine, document.createElement('br'), statusLine);
  const updatePanel = () => {
    countLine.textContent = 'Synlige rækker: ' + scannedCount;
    statusLine.textContent = statusText;
  };
  updatePanel();
  document.documentElement.append(panel);

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
      const oddsCount = Array.from(current.querySelectorAll('*')).filter((item) => item.children.length === 0 && /^\\d+\\.\\d{2}$/.test((item.textContent || '').trim())).length;
      if (oddsCount === 1 && text.length > 4 && text.length < 180 && /\\b(?:over|under|yes|no|draw|home|away)\\b/i.test(text)) return text;
    }
    return (node.parentElement?.innerText || '').trim().slice(0, 160);
  };
  const nearestLegLabels = (node, row, prices) => {
    let current = node.parentElement;
    let bestLabels = [];
    for (let depth = 0; current && current !== row && depth < 7; depth++, current = current.parentElement) {
      const text = (current.innerText || '').trim();
      if (text.length > 220) break;
      const containedPrices = prices.filter((price) => current.contains(price));
      if (containedPrices.length !== 1) continue;
      const labels = attrs(current);
      if (labels.length) bestLabels = labels;
      if (labels.length && /\\b(?:over|under|yes|no|draw|home|away)\\b/i.test(text)) return labels;
    }
    return bestLabels;
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
      return { odds, text: nearestLegText(node, row), labels: nearestLegLabels(node, row, prices) };
    }).filter(Boolean).slice(0, 2);
    return { text, labels: attrs(row), legs, capturedAt: Date.now(), timezoneOffset: new Date().getTimezoneOffset() };
  };
  const rowKey = (row) => [
    row.text.replace(/\\s+/g, ' ').trim(),
    row.labels.join('|'),
    row.legs.map((leg) => [leg.odds, leg.text, leg.labels.join('|')].join(':')).join(';'),
  ].join('::');
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
      const key = rowKey(row);
      if (!row.text || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, MAX_ROWS);
  };
  const time = () => new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
  const send = (rows) => {
    sending = true;
    statusText = 'Sender…';
    updatePanel();
    GM_xmlhttpRequest({
      method: 'POST',
      url: ENDPOINT,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + TOKEN },
      data: JSON.stringify({ rows }),
      timeout: 25000,
      onload: (response) => {
        sending = false;
        let result = {};
        try { result = JSON.parse(response.responseText || '{}'); } catch {}
        if (response.status >= 200 && response.status < 300) {
          lastSentAt = Date.now();
          statusText = time() + ' – ' + (result.summary || ('Sendt ' + rows.length + ' rækker'));
        } else {
          lastFingerprint = '';
          statusText = 'Fejl ' + response.status + ': ' + String(result.error || 'kunne ikke sende').slice(0, 120);
        }
        updatePanel();
      },
      onerror: () => { sending = false; lastFingerprint = ''; statusText = 'Netværksfejl – prøver igen'; updatePanel(); },
      ontimeout: () => { sending = false; lastFingerprint = ''; statusText = 'Timeout – prøver igen'; updatePanel(); },
    });
  };
  const scan = () => {
    if (!location.pathname.includes('/betting-tools/arbitrage') || sending) return;
    const rows = collectRows();
    scannedCount = rows.length;
    if (!rows.length) { statusText = 'Ingen synlige rækker fundet'; updatePanel(); return; }
    updatePanel();
    const fingerprint = JSON.stringify(rows.map(rowKey));
    if (fingerprint === lastFingerprint && Date.now() - lastSentAt < 45000) return;
    lastFingerprint = fingerprint;
    send(rows);
  };
  setTimeout(scan, 3000);
  setInterval(scan, 15000);
})();
`
  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Content-Disposition': 'attachment; filename="bettracker-oddsjam.user.js"',
      'Cache-Control': 'no-store, private',
    },
  })
}
