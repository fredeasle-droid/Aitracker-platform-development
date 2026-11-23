self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }
  const options = {
    body: data.body || '',
    icon: '/apple-icon.png',
    badge: '/icon-light-32x32.png',
    tag: data.tag || undefined,
    renotify: Boolean(data.tag),
    timestamp: Date.now(),
    vibrate: [120, 60, 120],
    actions: [{ action: 'open', title: 'Se surebet' }],
    data: { url: data.url || '/surebets' },
  }
  if (data.image) options.image = data.image
  event.waitUntil(self.registration.showNotification(data.title || 'BetTracker', options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || '/surebets', self.location.origin)
  const url = target.origin === self.location.origin ? target.href : self.location.origin
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate(url).catch(() => {})
          return client.focus()
        }
      }
      return self.clients.openWindow(url)
    }),
  )
})
