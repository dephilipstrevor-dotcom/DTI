const FinancialLedger = ({ route, userData }) => {
  const isLowTuition = route.tier === 'safe' || (route.country === 'Germany')
  const ledgerItems = [
    { label: 'Tuition Fees',                amount: isLowTuition ? 0 : Math.max(0, (route.total_cost || 0) - 1100000) },
    { label: 'Blocked Account / Living',    amount: 1100000 },
    { label: 'Semester Contribution',       amount: 30000 },
    { label: 'Health Insurance',            amount: 90000 }
  ]

  // Phased Ramp-Up: income tiers ramp as student integrates
  const isGermanyLike = route.country === 'Germany' || route.country === 'Netherlands'
  const phases = isGermanyLike
    ? [
        { label: 'Sem 1 — Onboarding',     monthly: 600,  hours: 10, months: 6 },
        { label: 'Sem 2 — Werkstudent',    monthly: 1600, hours: 20, months: 6 },
        { label: 'Sem 3+ — Thesis / Co-op', monthly: 2400, hours: 30, months: 6 }
      ]
    : [
        { label: 'Sem 1 — Onboarding',     monthly: 800,  hours: 10, months: 6 },
        { label: 'Sem 2 — On-campus TA/RA', monthly: 1500, hours: 20, months: 6 },
        { label: 'Sem 3+ — Internship',    monthly: 3500, hours: 40, months: 6 }
      ]

  // Convert € → ₹ rough (₹90/€) for the ledger total. US/UK are already INR-equivalent here.
  const fxRate = (route.country === 'USA' || route.country === 'UK' || route.country === 'Canada' || route.country === 'Australia' || route.country === 'Singapore') ? 84 : 90
  const phasedIncomeINR = phases.reduce((sum, p) => sum + p.monthly * p.months * fxRate, 0)

  const totalCost = ledgerItems.reduce((s, x) => s + x.amount, 0)
  const netCost = totalCost - phasedIncomeINR
  const budget = userData?.budget || route.userBudget || 1500000
  const budgetDelta = netCost - budget

  const fmt = (n) => `₹${(Math.abs(n) / 100000).toFixed(1)}L`

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
        Financial Arbitrage
      </h2>

      <div className="mb-5">
        <div className="grid grid-cols-2 text-[10px] font-mono uppercase tracking-wider text-gray-500 pb-2 border-b border-white/5">
          <span>Item</span>
          <span className="text-right">Amount (₹)</span>
        </div>
        <div className="divide-y divide-white/5">
          {ledgerItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 py-2 text-sm">
              <span className="text-gray-300">{item.label}</span>
              <span className="text-right font-mono text-white">{fmt(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phased Ramp-Up */}
      <div className="mb-5">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
          Phased Income Ramp-Up
        </h3>
        <div className="space-y-2">
          {phases.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center text-xs">
              <span className="text-gray-300">{p.label}</span>
              <span className="font-mono text-gray-500">{p.hours}h/wk</span>
              <span className="font-mono text-green-400">€{p.monthly}/mo</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Cost (18 mo)</span>
          <span className="font-mono text-white">{fmt(totalCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Phased Income Offset</span>
          <span className="font-mono text-green-400">- {fmt(phasedIncomeINR)}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-white/5">
          <span className="text-gray-300 font-medium">Net Liquidity Required</span>
          <span className="font-mono text-white font-bold">{fmt(Math.max(0, netCost))}</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Budget Delta</span>
          <span className={`text-sm font-mono font-bold ${budgetDelta > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {budgetDelta > 0 ? '-' : '+'}{fmt(budgetDelta)}
          </span>
        </div>
        <div className="w-full h-1 bg-[#1e293b] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${budgetDelta > 0 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, Math.max(5, (budget / Math.max(1, netCost)) * 100))}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default FinancialLedger
