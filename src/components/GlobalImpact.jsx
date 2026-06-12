import { globalImpact } from '../data/content'

export default function GlobalImpact() {
  return (
    <section id="global-impact" className="border-t border-slate-200 bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-brand via-brand-light to-brand p-8 text-white shadow-xl shadow-brand/20 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/25 blur-2xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">{globalImpact.label}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{globalImpact.title}</h2>

            {globalImpact.paragraphs.map((paragraph, index) => (
              <p key={index} className="mt-5 text-sm leading-relaxed text-white/90 md:text-base">
                {paragraph}
              </p>
            ))}

            <blockquote className="mt-8 border-l-2 border-accent/60 pl-5">
              <p className="font-serif text-lg leading-relaxed text-white italic md:text-xl">{globalImpact.mission}</p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
