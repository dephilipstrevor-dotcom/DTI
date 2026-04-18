import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full px-6 py-3 flex justify-between items-center z-50">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 font-bold text-sm tracking-widest uppercase text-white">
        <div className="w-8 h-8 bg-brand-copper/20 rounded-lg flex items-center justify-center text-white relative overflow-hidden border border-brand-copper/30">
          <i className="fa-solid fa-graduation-cap absolute -top-1 text-brand-copper text-xs"></i>
          <span className="text-lg font-black mt-1">G</span>
        </div>
        <span>— GRADROUTE <span className="text-brand-copper font-black">|</span></span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-gray-300 uppercase">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/intake" className="hover:text-white transition-colors">Intake</Link>
            <Link to="/chat" className="hover:text-white transition-colors">Mentor</Link>
          </>
        ) : (
          <>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#process" className="hover:text-white transition-colors">Process</a>
            <a href="#outcomes" className="hover:text-white transition-colors">Outcomes</a>
          </>
        )}
      </div>

      {user ? (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-white"
          >
            <div className="w-8 h-8 rounded-full bg-brand-copper/20 border border-brand-copper/30 flex items-center justify-center">
              <i className="fa-solid fa-user text-brand-copper text-sm"></i>
            </div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0F172A] border border-white/10 rounded-xl shadow-xl py-1">
              <Link to="/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">Account Settings</Link>
              <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5">Sign Out</button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/auth" className="bg-brand-copper hover:bg-brand-copper/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(224,93,54,0.3)]">
          Initialize Engine <i className="fa-solid fa-arrow-right"></i>
        </Link>
      )}
    </nav>
  )
}

export default Navbar