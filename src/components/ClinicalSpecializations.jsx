import { useState } from 'react'
import { clinicalSpecializations } from '../data/content'

const filters = ['All', 'Autism', 'ADHD', 'Language', 'Speech', 'Apraxia', 'Fluency']

export default function ClinicalSpecializations() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? clinicalSpecializations
      : clinicalSpecializations.filter((item) => item.category === activeFilter)

  return (
    <section id="cases" className="border-t border-slate-200 bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-brand uppercase">
            Clinical Cases
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium text-ink md:text-4xl">
            Clinical specializations
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-muted">
            Evidence-based care across a wide range of pediatric communication
            disorders — delivered in English and Arabic.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors ${
                activeFilter === filter
                  ? 'bg-brand text-white'
                  : 'border border-slate-200 bg-white text-ink-muted hover:border-brand hover:text-brand'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="rounded-sm border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-brand/25 hover:shadow-md"
            >
              <span className="inline-block rounded-full bg-brand-muted px-3 py-0.5 text-xs font-semibold text-brand">
                {item.category}
              </span>
              <h3 className="mt-4 font-serif text-xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
