import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import IntakeForm from '../components/intake/IntakeForm'

const IntakePage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#020617] pt-24 pb-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-6 mb-6">
            <div className="hidden lg:block">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-all duration-200 group"
              >
                <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
                <span>Back to dashboard</span>
              </Link>
            </div>
            <div className="lg:col-span-2 flex items-center justify-between">
              <Link 
                to="/dashboard" 
                className="lg:hidden inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-all duration-200 group"
              >
                <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
                <span>Back</span>
              </Link>
            </div>
          </div>

          {/* Page Header */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-6 mb-8">
            <div className="hidden lg:block"></div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-copper/10 border border-brand-copper/30 mb-4">
                <span className="w-2 h-2 rounded-full bg-brand-copper animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-copper">Intake Engine v1.0</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Configure Your <span className="text-brand-copper">Parameters</span>
              </h1>
              <p className="text-[#94a3b8] text-sm max-w-2xl leading-relaxed">
                Feed the system your hard constraints. The engine will mathematically eliminate unviable routes and surface only what's feasible.
              </p>
            </div>
            <div className="hidden lg:block"></div>
          </div>

          <IntakeForm />
        </div>
      </div>
    </>
  )
}

export default IntakePage