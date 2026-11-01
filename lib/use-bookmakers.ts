'use client'

import useSWR from 'swr'

export type BookmakerOption = { id: string; name: string }

export function useBookmakerList(country = 'DK'): BookmakerOption[] {
  const { data } = useSWR<BookmakerOption[]>(`/api/bookmakers?country=${country}`, (url: string) => fetch(url).then((r) => r.json()), {
    revalidateOnFocus: false,
  })
  return data ?? []
}
