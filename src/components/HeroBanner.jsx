import { images } from '../data/content'

export default function HeroBanner() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden lg:min-h-[85vh]">
      <img
        src={images.heroBanner}
        alt="Child in a supportive learning environment"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-6 pt-36 pb-16 lg:min-h-[85vh] lg:px-8 lg:pb-24">
        <p className="animate-fade-up text-sm font-medium tracking-[0.25em] text-white/80 uppercase">
          Pediatric Speech & Language Pathology
        </p>
        <h1 className="animate-fade-up animation-delay-100 mt-4 max-w-3xl font-serif text-4xl leading-[1.12] font-medium text-white md:text-5xl lg:text-6xl">
          Empowering every voice,
          <br />
          <span className="text-brand-muted">one word at a time</span>
        </h1>
        <p className="animate-fade-up animation-delay-200 mt-6 max-w-xl text-lg leading-relaxed text-white/85">
          Helping children with ADHD, autism, and language disorders find their
          voice — with compassion, expertise, and over 30 years of global
          clinical leadership.
        </p>
        <div className="animate-fade-up animation-delay-300 mt-10 flex flex-wrap gap-4">
          <a
            href="#profile"
            className="rounded-sm bg-white px-7 py-3 text-sm font-semibold tracking-wide text-brand transition-colors hover:bg-brand-muted"
          >
            Meet Dr. Wael
          </a>
          <a
            href="#certificates"
            className="rounded-sm border border-white/40 px-7 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
          >
            View Credentials
          </a>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 hidden h-24 bg-gradient-to-t from-white to-transparent lg:block" />
    </section>
  )
}
