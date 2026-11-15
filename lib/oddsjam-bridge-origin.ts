const productionHosts = new Set(['bettrackerai.com', 'www.bettrackerai.com'])

export function isProductionOddsJamBridgeRequest(request: Request) {
  const hostname = new URL(request.url).hostname.toLowerCase()
  return process.env.VERCEL_ENV === 'production' && productionHosts.has(hostname)
}
