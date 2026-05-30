import { useState } from 'react'
import { clinicalSpecializations } from '../data/content'

const filters = ['All', 'Autism', 'ADHD', 'Language', 'Speech', 'Apraxia', 'Fluency']

const cardTheme = {
  stripe: 'bg-brand',
  badge: 'bg-white/20 text-white ring-white/30',
  iconWrap: 'bg-accent text-white ring-accent/40',
  body: 'border-brand/20 bg-gradient-to-br from-brand-muted/50 to-white',
  category: 'text-brand',
}

function CaseIcon({ id, className = 'h-6 w-6' }) {
  const props = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.5 }

  switch (id) {
    case 'autism':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      )
    case 'adhd':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      )
    case 'speech':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      )
    case 'apraxia':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
        </svg>
      )
    case 'fluency':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0116.5 17.25H14l-2.25 2.25V17.25H7.5a2.25 2.25 0 01-2.25-2.25v-4.5A2.25 2.25 0 017.5 8.25z" />
        </svg>
      )
    case 'bilingual':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.902m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0116.5 17.25H14l-2.25 2.25V17.25H7.5a2.25 2.25 0 01-2.25-2.25v-4.5A2.25 2.25 0 017.5 8.25z" />
        </svg>
      )
  }
}

function CaseCard({ item }) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-sm border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardTheme.body}`}
    >
      <div className="relative h-36 shrink-0 overflow-hidden sm:h-40">
        <img
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-brand/70" aria-hidden="true" />

        <div className={`absolute inset-x-0 top-0 h-1 ${cardTheme.stripe}`} aria-hidden="true" />

        <div className="absolute inset-0 flex items-end justify-between p-4">
          <span
            className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-wide uppercase ring-1 backdrop-blur-sm ${cardTheme.badge}`}
          >
            {item.category}
          </span>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg ring-2 transition-transform duration-300 group-hover:scale-110 ${cardTheme.iconWrap}`}
          >
            <CaseIcon id={item.id} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl leading-snug text-ink">{item.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{item.description}</p>
        <p className={`mt-4 text-xs font-semibold tracking-wide uppercase ${cardTheme.category}`}>
          Specialized care
        </p>
      </div>
    </article>
  )
}

export default function ClinicalSpecializations() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? clinicalSpecializations
      : clinicalSpecializations.filter((item) => item.category === activeFilter)

  return (
    <section id="cases" className="relative overflow-hidden border-t border-slate-200 bg-surface-alt py-20 lg:py-28">
      <div
        className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-brand/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Clinical Cases</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
            Clinical specializations
          </h2>
          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-brand via-brand-light to-accent" />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-brand to-brand-light text-white shadow-md shadow-brand/25'
                  : 'border border-brand/15 bg-white text-ink-muted hover:border-accent hover:text-accent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
