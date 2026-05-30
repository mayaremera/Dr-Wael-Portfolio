import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import HopeGallery from './components/HopeGallery'
import Profile from './components/Profile'
import PromoVideoSection from './components/PromoVideoSection'
import Leadership from './components/Leadership'
import Certificates from './components/Certificates'
import TherapyConcepts from './components/TherapyConcepts'
import Expertise from './components/Expertise'
import ClinicalSpecializations from './components/ClinicalSpecializations'
import Testimonials from './components/Testimonials'
import VideoSection from './components/VideoSection'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main>
        <HeroBanner />
        <Profile />
        <HopeGallery />
        <PromoVideoSection />
        <TherapyConcepts />
        <ClinicalSpecializations />
        <Expertise />
        <Testimonials />
        {/* <Leadership /> */}
        {/* <Certificates /> */}
        {/* <VideoSection /> */}
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
