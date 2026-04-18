import Navbar from '../components/common/Navbar'
import HeroSection from '../components/landing/HeroSection'
import DecisionMatrix from '../components/landing/DecisionMatrix'
import LiveInterpretation from '../components/landing/LiveInterpretation'
import CTASection from '../components/landing/CTASection'

const LandingPage = () => {
  return (
    <main className="font-sans antialiased bg-[#FAFAFA] text-brand-slate selection:bg-brand-copper selection:text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <DecisionMatrix />
      <LiveInterpretation />
      <CTASection />
    </main>
  )
}

export default LandingPage