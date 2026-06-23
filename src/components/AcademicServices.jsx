import { useState } from 'react'
import { academicServices } from '../data/academicServices'

function ServiceItem({ item }) {
  return (
    <article className="rounded-sm border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-serif text-lg leading-snug text-ink">{item.title}</h3>
        {item.period ? (
          <span className="shrink-0 rounded-full bg-surface-tint px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.1em] text-ink-muted uppercase">
            {item.period}
          </span>
        ) : null}
      </div>

      <p className="mt-1 text-sm font-medium text-brand">{item.org}</p>

      {item.description ? (
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{item.description}</p>
      ) : null}

      {item.journals?.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {item.journals.map((journal) => (
            <li
              key={journal}
              className="rounded-full border border-brand/15 bg-brand-muted/40 px-3 py-1 text-xs font-medium text-brand"
            >
              {journal}
            </li>
          ))}
        </ul>
      ) : null}

      {item.workshops?.length ? (
        <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {item.workshops.map((workshop) => (
            <li key={workshop.year} className="flex gap-3 text-sm">
              <span className="shrink-0 font-serif text-xs tabular-nums text-brand/70">{workshop.year}</span>
              <span className="text-ink-muted">{workshop.title}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {item.link ? (
        <a
          href={item.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:text-brand-light"
        >
          {item.link.label}
          <span aria-hidden="true">→</span>
        </a>
      ) : null}
    </article>
  )
}

export default function AcademicServices() {
  const { label, title, intro, categories } = academicServices
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  const activeCategory = categories.find((c) => c.id === activeId) ?? categories[0]

  return (
    <section id="academic-services" className="border-t border-slate-200 bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{title}</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">{intro}</p>
        </header>

        <div className="mt-10 lg:mt-12">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Academic service categories"
          >
            {categories.map((category) => {
              const isActive = category.id === activeId
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(category.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-200 ${
                    isActive
                      ? 'border-brand bg-brand text-white shadow-sm'
                      : 'border-slate-200 bg-white text-ink-muted hover:border-brand/30 hover:text-brand'
                  }`}
                >
                  {category.label}
                </button>
              )
            })}
          </div>

          <div
            key={activeCategory.id}
            role="tabpanel"
            className="mt-6 animate-fade-up space-y-3"
          >
            {activeCategory.items.map((item) => (
              <ServiceItem key={`${activeCategory.id}-${item.title}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
