'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { useLocale } from '@/components/locale-provider'
import { type Locale } from '@/lib/i18n'
import { localizedInternalHref } from '@/lib/localized-href'

type Props = ComponentProps<typeof NextLink>
type Href = Props['href']

function localizeHref(locale: Locale, href: Href): Href {
  if (typeof href === 'string') return localizedInternalHref(locale, href)
  if (typeof href.pathname !== 'string') return href

  const pathname = localizedInternalHref(locale, href.pathname)
  return pathname === href.pathname ? href : { ...href, pathname }
}

export default function LocalizedLink({ href, ...props }: Props) {
  const { locale } = useLocale()
  return <NextLink href={localizeHref(locale, href)} {...props} />
}
