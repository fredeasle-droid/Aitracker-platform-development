import { jakarta } from './font'

export default function SurebetsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`sb-root ${jakarta.variable}`}>{children}</div>
}
