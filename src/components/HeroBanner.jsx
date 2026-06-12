import { images, profileDetails, site } from '../data/content'
import ContactButton from './ContactButton'

export default function HeroBanner() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden lg:min-h-[95vh]">
      <img
        src={images.heroBanner}
        alt="Dr. Wael A. Al-Dakroury, speech and language pathology"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/30" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-6 pt-44 pb-16 lg:min-h-[85vh] lg:px-8 lg:pt-48 lg:pb-24">
        <p className="max-w-4xl text-sm font-medium tracking-[0.12em] text-white drop-shadow-md md:text-base">
          {site.title}
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.12] font-medium text-white drop-shadow-md md:text-5xl lg:text-6xl">
          {profileDetails.name}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white drop-shadow-md">
          Over 30 years of clinical excellence, ASHA Fellow. Helping children with
          autism, ADHD, and language disorders find their voice through compassionate,
          evidence-based care in English and Arabic.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ContactButton href="#contact" headerState={{ active: false, scrolled: false }}>
            Contact Us Now
          </ContactButton>
          <a
            href="#approach"
            className="rounded-sm border border-white/40 bg-black/20 px-7 py-3 text-sm font-medium tracking-wide text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/30"
          >
            View Services
          </a>
        </div>
      </div>
    </section>
  )
}
