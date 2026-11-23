const STEPS = [
  'Åbn BetTracker i Safari.',
  'Tryk på Del-ikonet i bunden af skærmen.',
  'Vælg "Føj til hjemmeskærm" og tryk Tilføj.',
  'Åbn BetTracker fra hjemmeskærmen og slå notifikationer til.',
]

export function isIos() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (/macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
}

export function IosInstallGuide({ className = '', titleClassName = '' }: { className?: string; titleClassName?: string }) {
  return (
    <div className={className}>
      <p className={`text-[13px] font-semibold ${titleClassName}`}>Sådan får du notifikationer på iPhone</p>
      <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-[13px] leading-5 marker:font-bold">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="mt-2 text-[12px] leading-5 opacity-80">Kræver iOS 16.4 eller nyere. Det er kun nødvendigt første gang.</p>
    </div>
  )
}
