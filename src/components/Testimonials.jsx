import { testimonials } from '../data/content'

export default function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-slate-200 bg-surface-alt py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-brand uppercase">
            Testimonials
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium text-ink md:text-4xl">
            What families say
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.id}
              className="flex flex-col rounded-sm border border-slate-100 bg-white p-8 shadow-sm"
            >
              <p className="flex-1 leading-relaxed text-ink italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-slate-100 pt-4">
                <p className="font-medium text-ink">{item.name}</p>
                {item.location && (
                  <p className="mt-1 text-sm text-ink-muted">{item.location}</p>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
