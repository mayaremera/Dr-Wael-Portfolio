import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import Profile from './components/Profile'
import TherapyConcepts from './components/TherapyConcepts'
import Expertise from './components/Expertise'
import ClinicalSpecializations from './components/ClinicalSpecializations'
import Certificates from './components/Certificates'
import Leadership from './components/Leadership'
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
        <TherapyConcepts />
        <Expertise />
        <ClinicalSpecializations />
        <Certificates />
        <Leadership />
        <Testimonials />
        <VideoSection />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
