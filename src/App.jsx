import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import HopeGallery from './components/HopeGallery'
import DrWaelActivity from './components/DrWaelActivity'
import Profile from './components/Profile'
import PromoVideoSection from './components/PromoVideoSection'
import Leadership from './components/Leadership'
import CertificationGallery from './components/CertificationGallery'
import TherapyConcepts from './components/TherapyConcepts'
import Expertise from './components/Expertise'
import ClinicalSpecializations from './components/ClinicalSpecializations'
import Testimonials from './components/Testimonials'
import VideoSection from './components/VideoSection'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { images } from './data/content'

const HOME_PATH = '/'

function PageHeading({ eyebrow, title, description, backgroundImage }) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[300px] pt-36 sm:min-h-[340px] sm:pt-40">
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/65 to-ink/40" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/35 to-transparent" />

        <div className="relative mx-auto flex min-h-[300px] max-w-6xl flex-col justify-end px-6 pb-10 sm:min-h-[340px] sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <>
      <HeroBanner />
      <Profile />
      <Expertise />
      <TherapyConcepts />
      <PromoVideoSection />
      <ClinicalSpecializations />
      <HopeGallery />
      <DrWaelActivity />
      <Testimonials />
      <Contact />
    </>
  )
}

function PageLayout({ hero, children }) {
  return (
    <>
      <PageHeading
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        backgroundImage={hero.image}
      />
      {children}
    </>
  )
}

function VibeBand({
  label,
  title,
  description,
  primaryHref = '/contact',
  primaryLabel = 'Book Consultation',
  secondaryHref = '/services',
  secondaryLabel = 'Explore Services',
}) {
  return (
    <section className="border-t border-slate-200 bg-surface py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-r from-brand via-brand-light to-brand p-8 text-white shadow-lg shadow-brand/20 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/25 blur-2xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <p className="relative text-xs font-semibold tracking-[0.22em] text-accent uppercase">{label}</p>
          <h2 className="relative mt-3 max-w-3xl font-serif text-3xl leading-tight md:text-4xl">{title}</h2>
          <p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
            {description}
          </p>

          <div className="relative mt-7 flex flex-wrap gap-3">
            <a
              href={primaryHref}
              className="rounded-sm bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:bg-brand-muted"
            >
              {primaryLabel}
            </a>
            <a
              href={secondaryHref}
              className="rounded-sm border border-white/40 bg-black/20 px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:border-white hover:bg-black/30"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || HOME_PATH

  const pages = {
    [HOME_PATH]: <HomePage />,
    '/about-me': (
      <PageLayout
        hero={{
          eyebrow: 'About Me',
          title: 'Dr. Wael A. Al-Dakroury',
          description:
            'Learn more about Dr. Wael’s clinical journey, global leadership, and the ASHA Fellow distinction.',
          image: images.drWael,
        }}
      >
        <Profile />
        <CertificationGallery />
        <VibeBand
          label="Professional Leadership"
          title="Global Recognition with Real-World Impact"
          description="Beyond clinical care, Dr. Wael contributes to international organizations and research initiatives that shape modern speech-language practice."
          primaryHref="/contact"
          primaryLabel="Work with Dr. Wael"
          secondaryHref="/in-the-field"
          secondaryLabel="View Field Activity"
        />
        <Leadership />
      </PageLayout>
    ),
    '/services': (
      <PageLayout
        hero={{
          eyebrow: 'Services',
          title: 'Speech-Language Services',
          description:
            'Comprehensive, evidence-based support from screening and assessment to therapy and family guidance.',
          image: images.familyCounseling,
        }}
      >
        <Expertise />
        <TherapyConcepts />
        <VibeBand
          label="Integrated Care Pathway"
          title="From First Screening to Long-Term Progress"
          description="Every service is connected in one clear journey: early identification, thorough assessment, personalized therapy, and practical family coaching."
          primaryHref="/contact"
          primaryLabel="Start with Screening"
          secondaryHref="/cases"
          secondaryLabel="See Clinical Cases"
        />
        <ClinicalSpecializations />
        <Testimonials />
      </PageLayout>
    ),
    '/cases': (
      <PageLayout
        hero={{
          eyebrow: 'Clinical Cases',
          title: 'Conditions We Specialize In',
          description:
            'Explore key clinical areas where Dr. Wael provides focused, personalized intervention.',
          image: images.assessment,
        }}
      >
        <ClinicalSpecializations />
        <VibeBand
          label="Case-Based Excellence"
          title="Specialized Care for Complex Communication Needs"
          description="Each case is managed with evidence-based strategy, bilingual precision, and close collaboration with families and educational teams."
          primaryHref="/contact"
          primaryLabel="Discuss Your Case"
          secondaryHref="/services"
          secondaryLabel="Review Services"
        />
        <TherapyConcepts />
        <Testimonials />
      </PageLayout>
    ),
    '/video-gallery': (
      <PageLayout
        hero={{
          eyebrow: 'Video & Gallery',
          title: 'Insights and Moments from Practice',
          description:
            'Watch featured educational videos and view snapshots of meaningful therapy and family sessions.',
          image: images.heroBanner,
        }}
      >
        <PromoVideoSection />
        <VideoSection />
        <HopeGallery />
        <VibeBand
          label="Learning Through Media"
          title="See the Clinical Approach in Action"
          description="Educational content and gallery highlights offer a closer look at how therapy principles translate into meaningful progress for children and families."
          primaryHref="/contact"
          primaryLabel="Book a Consultation"
          secondaryHref="/about-me"
          secondaryLabel="Learn More"
        />
      </PageLayout>
    ),
    '/in-the-field': (
      <PageLayout
        hero={{
          eyebrow: 'In the Field',
          title: 'Professional Activity & Events',
          description:
            'Follow recent conferences, lectures, and clinical engagements where Dr. Wael contributes his expertise.',
          image: images.treatment,
        }}
      >
        <DrWaelActivity />
        <VibeBand
          label="Academic & Clinical Presence"
          title="Active Contributions Across Conferences and Institutions"
          description="Regular participation in lectures, leadership forums, and international committees keeps care aligned with the latest advances in the field."
          primaryHref="/contact"
          primaryLabel="Connect with Dr. Wael"
          secondaryHref="/testimonials"
          secondaryLabel="Read Testimonials"
        />
        <Leadership />
      </PageLayout>
    ),
    '/testimonials': (
      <PageLayout
        hero={{
          eyebrow: 'Testimonials',
          title: 'Voices of Trust from Families',
          description:
            'Read the experiences of families and institutions who have seen real communication progress.',
          image: images.family,
        }}
      >
        <Testimonials />
        <VibeBand
          label="Families First"
          title="Stories of Progress, Trust, and Lasting Results"
          description="From first words to stronger confidence, these voices reflect the power of individualized care and consistent family support."
          primaryHref="/contact"
          primaryLabel="Start Your Journey"
          secondaryHref="/services"
          secondaryLabel="Explore Care Options"
        />
        <HopeGallery />
      </PageLayout>
    ),
    '/contact': (
      <PageLayout
        hero={{
          eyebrow: 'Contact',
          title: 'Book a Consultation',
          description:
            'Reach out to discuss your child’s needs and schedule an appointment in English or Arabic.',
          image: images.screening,
        }}
      >
        <Contact />
        <VibeBand
          label="Your Next Step"
          title="Let’s Build the Right Plan Together"
          description="Share your concerns, ask questions, and receive clear guidance on what support your child may need next."
          primaryHref="/services"
          primaryLabel="View Services"
          secondaryHref="/cases"
          secondaryLabel="See Specializations"
        />
        <TherapyConcepts />
      </PageLayout>
    ),
  }

  const pageContent = pages[pathname]
  const isHome = pathname === HOME_PATH

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main>
        {pageContent ?? (
          <section className="mx-auto max-w-3xl px-6 py-24 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Page not found</p>
            <h1 className="mt-4 font-serif text-4xl text-ink">This page does not exist.</h1>
            <a
              href="/"
              className="mt-8 inline-block rounded-sm bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-light"
            >
              Back to Home
            </a>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
