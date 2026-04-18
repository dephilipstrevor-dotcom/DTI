const FinancialLedger = ({ route, userData }) => {
  const ledgerItems = [
    { label: 'Tuition Fees', amount: route.tier === 'safe' ? 0 : 1500000 },
    { label: 'Blocked Account / Living Costs', amount: 1000000 },
    { label: 'Semester Contribution', amount: 30000 },
    { label: 'Health Insurance', amount: 90000 }
  ]

  const totalCost = ledgerItems.reduce((sum, item) => sum + item.amount, 0)
  const partTimeIncome = 800000
  const netCost = totalCost - partTimeIncome
  const budgetDelta = netCost - userData.budget

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
              <span className="text-right font-mono text-white">
                ₹{(item.amount / 100000).toFixed(1)}L
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Cost</span>
          <span className="font-mono text-white">₹{(totalCost / 100000).toFixed(1)}L</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Est. Part-time Income</span>
          <span className="font-mono text-green-400">- ₹{(partTimeIncome / 100000).toFixed(1)}L</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-white/5">
          <span className="text-gray-300 font-medium">Net Requirement</span>
          <span className="font-mono text-white font-bold">₹{(netCost / 100000).toFixed(1)}L</span>
        </div>
      </div>

      {/* Budget Delta with proper spacing */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Budget Delta</span>
          <span className={`text-sm font-mono font-bold ${budgetDelta > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {budgetDelta > 0 ? '-' : '+'}₹{Math.abs(budgetDelta / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="w-full h-1 bg-[#1e293b] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${budgetDelta > 0 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, (userData.budget / netCost) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default FinancialLedger