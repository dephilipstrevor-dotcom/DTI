import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { generateRoutes } from '../../utils/routeGenerator'
import ModulePanel from './ModulePanel'
import LiveHUD from './LiveHUD'
import LoadingSequence from './LoadingSequence'

const IntakeForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    degreeLevel: '',
    fieldOfStudy: '',
    cgpa: '',
    backlogs: '',
    ielts: '',
    gre: '',
    portfolio: '',
    budget: '',
    fundingSource: '',
    targetRole: '',
    workExperience: '',
    intakeTerm: ''
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    let processedValue = value
    if (type === 'number') processedValue = value === '' ? null : Number(value)
    setFormData(prev => ({ ...prev, [name]: processedValue }))
  }

  const handleExecute = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // 1. Save intake data to Supabase
    const { error: intakeError } = await supabase
      .from('intake_data')
      .upsert({ user_id: user.id, ...formData }, { onConflict: 'user_id' })

    if (intakeError) {
      console.error('Failed to save intake:', intakeError)
      setIsLoading(false)
      return
    }

    // 2. Generate real routes based on user data
    const budget = Number(formData.budget) || 1500000
    const routes = generateRoutes({ ...formData, budget })
    const routesWithUser = routes.map(r => ({ ...r, user_id: user.id }))

    // 3. Delete old routes and insert new ones
    await supabase.from('routes').delete().eq('user_id', user.id)
    const { error: routesError } = await supabase.from('routes').insert(routesWithUser)

    if (routesError) {
      console.error('Failed to save routes:', routesError)
      setIsLoading(false)
      return
    }
  }

  const handleLoadingComplete = () => navigate('/dashboard')

  const isFormValid = () => formData.cgpa && formData.budget && formData.degreeLevel && formData.fieldOfStudy

  const steps = [
    { id: 1, name: 'Academic Baseline', required: true },
    { id: 2, name: 'Competency & Aptitude', required: false },
    { id: 3, name: 'Financial Reality', required: true },
    { id: 4, name: 'Career Target', required: false }
  ]

  const getStepStatus = (stepId) => {
    if (stepId === 1) {
      if (formData.degreeLevel && formData.fieldOfStudy && formData.cgpa) return 'completed'
      if (formData.degreeLevel || formData.fieldOfStudy || formData.cgpa) return 'active'
      return 'pending'
    }
    if (stepId === 2) {
      if (formData.ielts || formData.gre || formData.portfolio) return 'completed'
      return 'pending'
    }
    if (stepId === 3) {
      if (formData.budget) return 'completed'
      return 'pending'
    }
    if (stepId === 4) {
      if (formData.targetRole || formData.workExperience || formData.intakeTerm) return 'completed'
      return 'pending'
    }
    return 'pending'
  }

  return (
    <>
      <form onSubmit={handleExecute} className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-6">
          {/* Left Sidebar - Progress Steps */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">Progress</span>
              </div>
              <div className="border-l border-white/10 pl-4 space-y-0">
                {steps.map((step) => {
                  const status = getStepStatus(step.id)
                  return (
                    <div key={step.id} className="relative py-2">
                      <div className="absolute -left-[21px] top-1/2 -translate-y-1/2">
                        {status === 'completed' ? (
                          <div className="w-4 h-4 rounded-full bg-green-500/80 flex items-center justify-center">
                            <i className="fa-solid fa-check text-[8px] text-white"></i>
                          </div>
                        ) : status === 'active' ? (
                          <div className="w-4 h-4 rounded-full bg-brand-copper flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(224,93,54,0.6)]">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-700"></div>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          status === 'active' ? 'text-white' : 
                          status === 'completed' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {step.name}
                        </p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em]">
                          {step.required ? 'Required' : 'Optional'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Center Column - Form Modules */}
          <div className="space-y-5">
            <ModulePanel title="Academic Baseline" icon={<i className="fa-solid fa-graduation-cap"></i>} defaultOpen={true}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Degree Level</label>
                  <select name="degreeLevel" value={formData.degreeLevel} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none" required>
                    <option value="">Select</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Field of Study</label>
                  <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} placeholder="Computer Science" className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">CGPA <span className="text-brand-copper">*</span></label>
                  <input type="number" name="cgpa" value={formData.cgpa} onChange={handleChange} step="0.01" min="0" max="10" placeholder="8.25" className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Backlogs</label>
                  <input type="number" name="backlogs" value={formData.backlogs} onChange={handleChange} min="0" placeholder="0" className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" />
                </div>
              </div>
            </ModulePanel>

            <ModulePanel title="Competency & Aptitude" icon={<i className="fa-solid fa-chart-line"></i>}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">IELTS Score</label>
                  <input type="number" name="ielts" value={formData.ielts} onChange={handleChange} step="0.5" min="0" max="9" placeholder="7.0" className="w-full px-4 py-2.5 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">GRE (Optional)</label>
                  <input type="number" name="gre" value={formData.gre} onChange={handleChange} min="260" max="340" placeholder="320" className="w-full px-4 py-2.5 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Portfolio/GitHub</label>
                  <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://github.com/username" className="w-full px-4 py-2.5 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" />
                </div>
              </div>
            </ModulePanel>

            <ModulePanel title="Financial Reality" icon={<i className="fa-solid fa-wallet"></i>}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Total Budget (INR) <span className="text-brand-copper">*</span></label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} min="0" step="100000" placeholder="2,500,000" className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Funding Source</label>
                  <select name="fundingSource" value={formData.fundingSource} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none">
                    <option value="">Select</option>
                    <option value="self">Self-funded</option>
                    <option value="loan">Education Loan</option>
                    <option value="scholarship">Scholarship Dependent</option>
                  </select>
                </div>
              </div>
            </ModulePanel>

            <ModulePanel title="Career Target" icon={<i className="fa-solid fa-bullseye"></i>}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Target Role/Industry</label>
                  <input type="text" name="targetRole" value={formData.targetRole} onChange={handleChange} placeholder="Systems Engineering, Defense Tech" className="w-full px-4 py-2.5 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Work Exp (yrs)</label>
                  <input type="number" name="workExperience" value={formData.workExperience} onChange={handleChange} min="0" step="0.5" placeholder="2" className="w-full px-4 py-2.5 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Intake</label>
                  <select name="intakeTerm" value={formData.intakeTerm} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none">
                    <option value="">Select</option>
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2027">Spring 2027</option>
                    <option value="Fall 2027">Fall 2027</option>
                    <option value="Fall 2028">Fall 2028</option>
                  </select>
                </div>
              </div>
            </ModulePanel>
          </div>

          {/* Right Column - Live HUD */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LiveHUD formData={formData} />
            </div>
          </div>
        </div>
      </form>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0F1C]/95 backdrop-blur-sm border-t border-white/10 py-4 px-6 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3.5 rounded-xl bg-transparent border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">
            Save Draft
          </button>
          <button
            onClick={handleExecute}
            disabled={!isFormValid()}
            className={`group relative px-12 py-4 rounded-xl font-bold text-white text-sm uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden ${
              isFormValid()
                ? 'bg-gradient-to-r from-brand-copper via-orange-500 to-brand-copper bg-[length:200%_100%] hover:bg-right shadow-[0_0_20px_rgba(224,93,54,0.5)] hover:shadow-[0_0_30px_rgba(224,93,54,0.8)] hover:scale-[1.02] cursor-pointer'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative z-10 flex items-center gap-3">
              Execute Engine
              <i className="fa-solid fa-play text-xs group-hover:translate-x-1 transition-transform"></i>
            </span>
          </button>
        </div>
      </div>

      {isLoading && <LoadingSequence onComplete={handleLoadingComplete} />}
    </>
  )
}

export default IntakeForm