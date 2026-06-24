import { useAboutContent } from '../hooks/useAboutContent'
import AcademicServices from './AcademicServices'

export default function Leadership() {
  const { isReady, academicServices } = useAboutContent()

  if (!isReady || !academicServices) return null

  const { label, title, intro } = academicServices

  return (
    <section id="leadership" className="relative overflow-hidden border-t border-slate-200 bg-surface-alt py-16 lg:py-20">
      <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-48 w-48 rounded-full bg-accent/12 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{label}</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{title}</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">{intro}</p>
        </header>

        <div className="mt-12">
          <AcademicServices embedded />
        </div>
      </div>
    </section>
  )
}
