import { useEffect, useState } from 'react'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import GalleryGrid from './components/GalleryGrid'
import DrWaelActivity from './components/DrWaelActivity'
import GlobalEventsMap from './components/GlobalEventsMap'
import Profile from './components/Profile'
import ProfessionalMembership from './components/ProfessionalMembership'
import PromoVideoSection from './components/PromoVideoSection'
import Leadership from './components/Leadership'
import SpeakingTraining from './components/SpeakingTraining'
import RefereedPublications from './components/RefereedPublications'
import ProfessionalServices from './components/ProfessionalServices'
import CertificationGallery from './components/CertificationGallery'
import CareerTimeline from './components/CareerTimeline'
import TherapyConcepts from './components/TherapyConcepts'
import Expertise from './components/Expertise'
import Testimonials from './components/Testimonials'
import VideoSection from './components/VideoSection'
import VideoLibrarySection from './components/VideoLibrarySection'
import GalleryPageHeading from './components/GalleryPageHeading'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ContactButton from './components/ContactButton'
import PageLoader from './components/PageLoader'
import Dashboard from './components/dashboard/Dashboard'
import { images } from './data/content'
import { useServicesContent } from './hooks/useServicesContent'
import { useSeo } from './hooks/useSeo'

const HOME_PATH = '/'
const PAGE_LOADER_MS = 1000

function PageHeading({ eyebrow, title, backgroundImage, imagePosition = 'center' }) {
  const positionClass =
    imagePosition === 'top'
      ? 'object-cover object-top'
      : imagePosition === 'contain'
        ? 'object-contain object-center'
        : 'object-cover object-center'

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[300px] pt-24 sm:min-h-[340px] sm:pt-28 lg:pt-36 xl:pt-40">
        <img
          src={backgroundImage}
          alt=""
          className={`absolute inset-0 h-full w-full ${positionClass}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/65 to-ink/40" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/35 to-transparent" />

        <div className="relative mx-auto flex min-h-[300px] max-w-6xl flex-col justify-end px-6 pb-10 sm:min-h-[340px] sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-white md:text-5xl">
            {title}
          </h1>
        </div>
      </div>
    </section>
  )
}

function ServicesPageHeading({ eyebrow, title, backgroundImage }) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[300px] pt-24 sm:min-h-[340px] sm:pt-28 lg:pt-36 xl:pt-40">
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        <div className="absolute inset-0 bg-linear-to-r from-ink/95 via-ink/75 to-ink/20" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/25 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-full max-w-xl bg-linear-to-r from-ink/55 to-transparent sm:max-w-2xl" />

        <div className="relative mx-auto flex min-h-[300px] max-w-6xl flex-col justify-end px-6 pb-10 sm:min-h-[340px] sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-xl leading-tight whitespace-nowrap text-white sm:text-2xl md:text-3xl lg:text-5xl">
            {title}
          </h1>
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
      <TherapyConcepts showCasesPreview />
      <PromoVideoSection />
      <DrWaelActivity />
      <Testimonials variant="showcase" />
      <Contact />
    </>
  )
}

function PageLayout({ hero, children }) {
  return (
    <>
      {hero.variant === 'gallery' ? (
        <GalleryPageHeading
          eyebrow={hero.eyebrow}
          title={hero.title}
          galleryImages={hero.galleryImages}
        />
      ) : hero.variant === 'services' ? (
        <ServicesPageHeading
          eyebrow={hero.eyebrow}
          title={hero.title}
          backgroundImage={hero.image}
        />
      ) : (
        <PageHeading
          eyebrow={hero.eyebrow}
          title={hero.title}
          backgroundImage={hero.image}
          imagePosition={hero.imagePosition}
        />
      )}
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
  const { speechLanguageServices } = useServicesContent()
  const [isPageReady, setIsPageReady] = useState(false)
  const rawPath = window.location.pathname.replace(/\/+$/, '') || HOME_PATH
  const pathname = rawPath === '/cases' ? '/services' : rawPath
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  useSeo(pathname)

  useEffect(() => {
    setIsPageReady(false)
    const timer = window.setTimeout(() => setIsPageReady(true), PAGE_LOADER_MS)
    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (rawPath === '/cases') {
      window.history.replaceState(null, '', '/services#cases')
    }
  }, [rawPath])

  if (isDashboard) {
    return <Dashboard isPageLoading={!isPageReady} />
  }

  const pages = {
    [HOME_PATH]: <HomePage />,
    '/about-me': (
      <PageLayout
        hero={{
          eyebrow: 'About Me',
          title: 'Dr. Wael A. Al-Dakroury',
          description:
            'Learn more about Dr. Wael’s clinical journey, global leadership, and the ASHA Fellow distinction.',
          image: images.aboutHero,
          imagePosition: 'center',
        }}
      >
        <Profile variant="page" />
        <CertificationGallery />
        <CareerTimeline />
        <Leadership />
        <RefereedPublications />
        <VibeBand
          label="Professional Leadership"
          title="Global Recognition with Real-World Impact"
          description="Beyond clinical care, Dr. Wael contributes to international organizations and research initiatives that shape modern speech-language practice."
          primaryHref="/contact"
          primaryLabel="Contact Dr. Wael"
          secondaryHref="/in-the-field"
          secondaryLabel="View Field Activity"
        />
      </PageLayout>
    ),
    '/services': (
      <PageLayout
        hero={{
          eyebrow: 'Services',
          title: speechLanguageServices.title,
          description: speechLanguageServices.intro,
          image: images.servicesHero,
          variant: 'services',
        }}
      >
        <TherapyConcepts fullDetail />
        <Testimonials variant="light" />
      </PageLayout>
    ),
    '/video-gallery': (
      <PageLayout
        hero={{
          eyebrow: 'Video & Gallery',
          title: 'Insights and Moments from Practice',
          variant: 'gallery',
          galleryImages: images.galleryHeading,
        }}
      >
        <VideoSection variant="light" />
        <VideoLibrarySection />
        <PromoVideoSection variant="light" ctaHref="/contact" secondaryHref="/services" />
        <GalleryGrid />
      </PageLayout>
    ),
    '/in-the-field': (
      <>
        <GlobalEventsMap />
        <SpeakingTraining />
        <DrWaelActivity variant="full" />
        <ProfessionalMembership />
        <VibeBand
          label="Academic & Clinical Presence"
          title="Active Contributions Across Conferences and Institutions"
          description="Regular participation in lectures, leadership forums, and international committees keeps care aligned with the latest advances in the field."
          primaryHref="/contact"
          primaryLabel="Connect with Dr. Wael"
          secondaryHref="/services"
          secondaryLabel="Explore Services"
        />
      </>
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
        <ProfessionalServices />
        <Contact />
        <VibeBand
          label="Your Next Step"
          title="Let’s Build the Right Plan Together"
          description="Share your concerns, ask questions, and receive clear guidance on what support your child may need next."
          primaryHref="/services"
          primaryLabel="View Services"
          secondaryHref="/about-me"
          secondaryLabel="About Dr. Wael"
        />
      </PageLayout>
    ),
  }

  const pageContent = pages[pathname]

  return (
    <div className="min-h-screen bg-surface pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
      {isPageReady ? <Header /> : null}
      <div className={!isPageReady ? 'pointer-events-none select-none' : undefined} aria-hidden={!isPageReady}>
        <main>
          {pageContent ?? (
            <section className="mx-auto max-w-3xl px-6 py-24 text-center">
              <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Page not found</p>
              <h1 className="mt-4 font-serif text-4xl text-ink">This page does not exist.</h1>
              <ContactButton href="/" className="mt-8">
                Back to Home
              </ContactButton>
            </section>
          )}
        </main>
        {isPageReady ? <Footer /> : null}
      </div>
      {!isPageReady ? <PageLoader /> : null}
    </div>
  )
}

export default App
