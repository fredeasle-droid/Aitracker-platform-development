import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-jakarta' })

export default function SurebetsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`sb-root ${jakarta.variable}`}>{children}</div>
}
