export const PrimaryButton = ({ children, className = "", ...props }) => (
  <button
    className={`bg-brand-slate hover:bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
)

// Use this for the main CTA
export const CopperGradientButton = ({ children, className = "", ...props }) => (
  <button
    className={`px-8 py-4 bg-gradient-to-r from-brand-copper to-orange-400 hover:from-orange-500 hover:to-brand-copper text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(224,93,54,0.3)] hover:shadow-[0_0_30px_rgba(224,93,54,0.5)] text-sm uppercase tracking-wider ${className}`}
    {...props}
  >
    {children}
  </button>
)