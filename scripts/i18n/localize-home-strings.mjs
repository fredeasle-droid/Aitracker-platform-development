// Rewrites the few home-page strings that still carried Danish market facts, for every non-Danish locale.
// Usage: node --env-file-if-exists=/vercel/share/.env.project scripts/i18n/localize-home-strings.mjs [locale...]
import fs from 'node:fs'
import { generateText } from 'ai'
import { MARKET_FACTS } from './market-facts.mjs'

const MODEL = 'anthropic/claude-sonnet-5.5'
const DIR = 'lib/home-i18n'
const HELP = JSON.parse(fs.readFileSync('lib/responsible-help.json', 'utf8'))
const DANISH = /Danmark|Dänemark|Denmark|Dinamarca|Danemark|Danimarca|Danske Spil|StopSpillet|ROFUS|70 22 28 25|\bdansk|dänisch|Danish|danois|danes[ae]s?\b|danese|duńsk|tanska|Deens|Danimarka|Dánsk|dánsk|δανικ|dán\b|dánsk|dansk/i

const intent = (locale) => {
  const h = HELP[locale]
  return {
    'Dansk support': 'Short card title (2-3 words) meaning "Fast support" / "Support that answers quickly".',
    'Spørg løs i chatten – vi svarer altid på dansk.': 'One short sentence: "Ask anything in the chat – we answer right away." Do not mention any language or country.',
    'vi svarer på dansk.': 'Short ending phrase, lowercase start, ending with a full stop: "we answer in your language." (It follows "Ask away –".)',
    'Vores AI sammenligner odds på tværs af danske og internationale bookmakere hvert sekund, så du aldrig går glip af et surebet.':
      'One sentence: "Our AI compares odds across a wide range of bookmakers every second, so you never miss a surebet." No country, no bookmaker names.',
    'Vi sammenligner odds fra danske og internationale bookmakere, bl.a. Danske Spil, bet365, Unibet, LeoVegas, Betano og Pinnacle.':
      'One sentence answering which bookmakers are compared: "We compare odds from a wide range of bookmakers and update them continuously." No country, no bookmaker names.',
    'Du skal være fyldt 18 år. Spil altid ansvarligt – har du brug for hjælp, kan du ringe til StopSpillet på 70 22 28 25 eller udelukke dig selv fra spil via ROFUS.nu.':
      `FAQ answer to "How old do you have to be?": state the minimum age ${h.minAge}, then point to local help using exactly these facts and nothing else: "${h.text}${h.links.length ? ' ' + h.links.map((l) => l.label).join(', ') : ''}". 2 sentences, no invented phone numbers or sites.`,
  }
}

async function rewrite(locale) {
  const f = MARKET_FACTS[locale]
  const tasks = intent(locale)
  const keys = Object.keys(tasks)
  const prompt = `Write UI copy in ${f.language} for BetTrackerAI (a surebet scanner) for readers in ${f.country}. Use the informal "you" form if the language has one, matching a friendly product tone.
For each item return the finished text only. Never mention Denmark, Danish, or Danish services.
Return ONLY a JSON array of ${keys.length} strings in this order:
${keys.map((k, i) => `${i + 1}. ${tasks[k]}`).join('\n')}`
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const { text } = await generateText({ model: MODEL, prompt, maxOutputTokens: 3000 })
      const arr = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1))
      if (!Array.isArray(arr) || arr.length !== keys.length || arr.some((s) => typeof s !== 'string' || !s.trim())) throw new Error('bad shape')
      const bad = arr.find((s) => DANISH.test(s))
      if (bad) throw new Error(`danish left: ${bad}`)
      return Object.fromEntries(keys.map((k, i) => [k, arr[i].trim()]))
    } catch (err) {
      console.log(`[${locale}] attempt ${attempt} failed: ${err.message}`)
    }
  }
  throw new Error(`[${locale}] gave up`)
}

const only = process.argv.slice(2)
const locales = fs.readdirSync(DIR).map((f) => f.replace('.json', '')).filter((l) => !only.length || only.includes(l))
let failed = 0
for (let i = 0; i < locales.length; i += 6) {
  await Promise.all(
    locales.slice(i, i + 6).map(async (locale) => {
      try {
        const values = await rewrite(locale)
        const file = `${DIR}/${locale}.json`
        const json = JSON.parse(fs.readFileSync(file, 'utf8'))
        Object.assign(json, values)
        fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n')
        console.log(`[${locale}] ok`)
      } catch (err) {
        failed++
        console.log(err.message)
      }
    }),
  )
}
console.log(failed ? `done with ${failed} failures` : 'all done')
