import type { ReactNode } from 'react'

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/** Renders plain text, turning `[label](https://url)` into external links. */
export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(LINK)) {
    const index = match.index ?? 0
    if (index > last) nodes.push(text.slice(last, index))
    nodes.push(
      <a
        key={index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary-glow underline underline-offset-2 hover:text-foreground"
      >
        {match[1]}
      </a>,
    )
    last = index + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return <>{nodes}</>
}
