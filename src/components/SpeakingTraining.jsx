import { speakingTraining } from '../data/content'
import ContactButton from './ContactButton'

export default function SpeakingTraining() {
  return (
    <section id="speaking-training" className="border-t border-slate-200 bg-surface-alt py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{speakingTraining.label}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">{speakingTraining.title}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">{speakingTraining.intro}</p>
            <ContactButton href="/contact" className="mt-20">
              Request a Speaking Engagement
            </ContactButton>
          </div>

          <div className="rounded-sm border border-brand/15 bg-white p-6 shadow-sm lg:p-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Presentation Topics</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {speakingTraining.topics.map((topic, index) => (
                <li
                  key={topic}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-surface-alt/50 px-3.5 py-2.5 text-sm text-ink-muted transition-colors hover:border-brand/20 hover:text-ink"
                >
                  <span className="font-serif text-xs tabular-nums text-brand/70">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-medium text-ink">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
