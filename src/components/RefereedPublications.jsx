import { useMemo } from 'react'
import { useAboutContent } from '../hooks/useAboutContent'

const typeStyles = {
  Journal: {
    badge: 'bg-brand/12 text-brand border-brand/25',
    accent: 'from-brand via-brand/70 to-brand/20',
    year: 'bg-brand text-white',
    card: 'hover:border-brand/30 hover:shadow-brand/10',
  },
  Proceedings: {
    badge: 'bg-accent/12 text-accent-hover border-accent/25',
    accent: 'from-accent via-accent/70 to-accent/20',
    year: 'bg-accent text-white',
    card: 'hover:border-accent/30 hover:shadow-accent/10',
  },
  'Book Chapter': {
    badge: 'bg-brand-light/12 text-brand-light border-brand-light/25',
    accent: 'from-brand-light via-brand-light/70 to-brand-light/20',
    year: 'bg-brand-light text-white',
    card: 'hover:border-brand-light/30 hover:shadow-brand-light/10',
  },
}

function getTypeStyle(type) {
  return typeStyles[type] ?? typeStyles.Journal
}

function highlightAuthor(authors = '') {
  const nodes = []
  const regex = /Al-Dakroury\s*,\s*W\.?(?:\s*&\s*Gardner\s*,\s*H\.)?/gi
  let lastIndex = 0
  let match

  while ((match = regex.exec(authors)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`${lastIndex}-text`}>{authors.slice(lastIndex, match.index)}</span>)
    }
    nodes.push(
      <strong key={match.index} className="font-semibold text-ink">
        {match[0]}
      </strong>,
    )
    lastIndex = regex.lastIndex
  }

  if (lastIndex < authors.length) {
    nodes.push(<span key={`${lastIndex}-end`}>{authors.slice(lastIndex)}</span>)
  }

  return nodes.length ? nodes : authors
}

function PublicationEntry({ paper, index }) {
  const style = getTypeStyle(paper.type)

  return (
    <article className="relative flex gap-4 sm:gap-6 lg:gap-8">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-serif text-[0.65rem] font-semibold leading-none tabular-nums sm:h-12 sm:w-12 sm:text-xs ${style.year}`}
      >
        {paper.year}
      </div>

      <div
        className={`group relative mb-8 min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${style.card}`}
      >
        <div
          className={`pointer-events-none absolute inset-y-4 left-0 w-1 rounded-r-full bg-gradient-to-b opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${style.accent}`}
          aria-hidden="true"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-ink-muted uppercase tabular-nums sm:hidden">
            {paper.year}
          </span>
          {paper.type ? (
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[0.62rem] font-semibold tracking-[0.12em] uppercase ${style.badge}`}
            >
              {paper.type}
            </span>
          ) : null}
          <span className="font-serif text-xs tabular-nums text-brand/35">{String(index + 1).padStart(2, '0')}</span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{highlightAuthor(paper.authors)}</p>

        <h3 className="mt-2.5 font-serif text-lg leading-snug text-ink transition-colors group-hover:text-brand md:text-xl">
          {paper.title}
        </h3>

        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
          <span className="font-medium text-brand">{paper.venue}</span>
          {paper.details ? <span className="italic"> · {paper.details}</span> : null}
        </p>

        {paper.doi ? (
          <a
            href={paper.doi}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-muted/50 px-4 py-2 text-xs font-semibold tracking-wide text-brand uppercase transition-all hover:border-brand hover:bg-brand hover:text-white"
          >
            View publication
            <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>
    </article>
  )
}

export default function RefereedPublications() {
  const { refereedPublications } = useAboutContent()
  const { label, title, intro, papers } = refereedPublications

  const sortedPapers = useMemo(() => [...(papers ?? [])].sort((a, b) => b.year - a.year), [papers])

  if (sortedPapers.length === 0) return null

  return (
    <section id="publications" className="relative overflow-hidden border-t border-slate-200 bg-surface py-16 lg:py-20">
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-brand/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-12 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted md:text-base">{intro}</p>
        </header>

        <div className="relative mt-12 rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-brand-muted/30 p-5 shadow-sm shadow-brand/5 transition-shadow duration-300 hover:shadow-md hover:shadow-brand/10 sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
            aria-hidden="true"
          />

          <div className="relative">
            {sortedPapers.map((paper, index) => (
              <PublicationEntry key={paper.id} paper={paper} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
