'use client'

import { useEffect } from 'react'
import { signOut } from '@/lib/auth-client'

export default function LogoutPage() {
  useEffect(() => {
    signOut().finally(() => window.location.assign('/login'))
  }, [])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#050b17] text-[#f3f6fc]">
      <p role="status">Logger ud...</p>
    </main>
  )
}
