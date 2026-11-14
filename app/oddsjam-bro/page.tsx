import type { Metadata } from 'next'
import { Bridge } from './bridge'

export const metadata: Metadata = { title: 'OddsJam modtager', robots: { index: false, follow: false } }

export default function BridgePage() {
  return <Bridge />
}
