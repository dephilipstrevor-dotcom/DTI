import { Link } from 'react-router-dom'
import AIMentorQuote from './AIMentorQuote'

const CTASection = () => {
  return (
    <section id="outcomes" className="py-32 bg-brand-dark text-center relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <AIMentorQuote />
        
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Your Global Career Path. <br /> Calculated, not Guessed.
        </h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto text-sm">
          Deploy the engine to mathematically map your future. No agents. No bias.
        </p>
        
        <Link
          to="/auth"
          className="group inline-block bg-white text-brand-dark font-bold tracking-widest uppercase text-xs px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
        >
          Access Engine <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
        </Link>
      </div>
    </section>
  )
}

export default CTASection