'use client'

import useSWR from 'swr'

export type BookmakerOption = { id: string; name: string }

export function useBookmakerList(): BookmakerOption[] {
  const { data } = useSWR<BookmakerOption[]>('/api/bookmakers', (url: string) => fetch(url).then((r) => r.json()), {
    revalidateOnFocus: false,
  })
  return data ?? []
}
