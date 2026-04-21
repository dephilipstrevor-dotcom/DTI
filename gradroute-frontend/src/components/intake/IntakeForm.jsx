import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { debounce } from 'lodash'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import ModulePanel from './ModulePanel'
import LiveHUD from './LiveHUD'
import LoadingSequence from './LoadingSequence'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const IntakeForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    degreeLevel: '',
    previousDegree: '',
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
  const [hudData, setHudData] = useState({ count: 0, feasibility: 0 })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    let processedValue = value
    if (type === 'number') processedValue = value === '' ? null : Number(value)
    setFormData(prev => ({ ...prev, [name]: processedValue }))
  }

  const handleExecute = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const response = await fetch(`${API_BASE_URL}/routes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate routes')
      }
      // Success: keep loading true, LoadingSequence will call handleLoadingComplete
    } catch (error) {
      console.error('Route generation failed:', error)
      alert('Route generation failed: ' + (error?.message || 'unknown'))
      setIsLoading(false)
    }
  }

  const handleLoadingComplete = () => navigate('/dashboard')

  const isFormValid = () => formData.cgpa && formData.budget && formData.degreeLevel && formData.fieldOfStudy

  const fetchEvaluation = async (data) => {
    if (!data.degreeLevel || !data.cgpa || !data.budget) return
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch(`${API_BASE_URL}/intake/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        const result = await res.json()
        setHudData(result)
      } else {
        console.warn('Evaluation failed, keeping previous HUD state')
      }
    } catch (err) {
      console.error('Evaluation failed:', err)
    }
  }

  const debouncedEvaluate = useCallback(debounce(fetchEvaluation, 500), [])

  useEffect(() => {
    debouncedEvaluate(formData)
    return () => debouncedEvaluate.cancel()
  }, [formData, debouncedEvaluate])

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
            <div className="sticky top-32">
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
            {/* Step 1: Academic Baseline */}
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
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Previous Degree</label>
                  <input type="text" name="previousDegree" value={formData.previousDegree} onChange={handleChange} placeholder="B.E. Computer Science" className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" />
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

            {/* Step 2: Competency & Aptitude */}
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

            {/* Step 3: Financial Reality */}
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

            {/* Step 4: Career Target */}
            <ModulePanel title="Career Target" icon={<i className="fa-solid fa-bullseye"></i>}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Target Role/Industry</label>
                  <select name="targetRole" value={formData.targetRole} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none">
                    <option value="">Select your target role</option>
                    <option value="Systems Engineering">Systems Engineering</option>
                    <option value="Defense Tech">Defense Tech</option>
                    <option value="AI/ML Engineering">AI/ML Engineering</option>
                    <option value="High-Performance Computing">High-Performance Computing</option>
                    <option value="Embedded Systems">Embedded Systems</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Robotics">Robotics</option>
                  </select>
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

            {/* Action Buttons */}
            <div className="pt-6 flex items-center justify-end gap-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3.5 rounded-xl bg-transparent border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">
                Save Draft
              </button>
              <button
                onClick={handleExecute}
                disabled={!isFormValid()}
                className={`group relative px-12 py-3.5 rounded-xl font-bold text-white text-sm uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden ${
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

          {/* Right Column - Live HUD */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <LiveHUD formData={formData} hudData={hudData} />
            </div>
          </div>
        </div>
      </form>

      {isLoading && <LoadingSequence onComplete={handleLoadingComplete} />}
    </>
  )
}

export default IntakeForm