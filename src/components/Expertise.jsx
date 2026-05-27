import { expertisePillars } from '../data/content'
import { IconGlobe, IconShield, IconScience, IconHeart } from './Icons'

const iconMap = {
  globe: IconGlobe,
  shield: IconShield,
  science: IconScience,
  heart: IconHeart,
}

const stats = [
  { value: '30+', label: 'Years of practice' },
  { value: 'ASHA', label: 'Fellow 2025' },
  { value: '100%', label: 'Family-centered' },
]

export default function Expertise() {
  return (
    <section id="expertise" className="border-t border-slate-200 bg-surface-alt py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-sm bg-brand text-white lg:grid lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col justify-center p-10 lg:p-14">
            <p className="text-sm font-medium tracking-[0.2em] text-white/70 uppercase">
              Why Families Choose Dr. Wael
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-snug font-medium md:text-4xl">
              Expertise guided by compassion, not guesswork
            </h2>
            <p className="mt-6 leading-relaxed text-white/80">
              Every child is treated as a unique case — with clear answers,
              measurable progress, and parents as true partners in the journey.
            </p>

            <div className="mt-10 flex gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs tracking-wide text-white/60 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center border-t border-white/15 bg-white/5 p-10 lg:border-t-0 lg:border-l lg:p-14">
            <blockquote>
              <p className="font-serif text-2xl leading-relaxed italic md:text-3xl">
                &ldquo;Empowering every voice, one word at a time.&rdquo;
              </p>
              <footer className="mt-6 text-sm text-white/70">
                — Dr. Wael A. Al-Dakroury
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {expertisePillars.map((pillar) => {
            const Icon = iconMap[pillar.icon]
            return (
              <div
                key={pillar.title}
                className="group rounded-sm border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-muted text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-serif text-xl text-ink">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {pillar.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
