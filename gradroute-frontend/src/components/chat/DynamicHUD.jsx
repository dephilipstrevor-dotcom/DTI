import RouteCard from '../dashboard/RouteCard'

const Card = ({ title, children }) => (
  <div className="bg-[#0F172A] border border-white/5 rounded-xl p-4">
    <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">{title}</h3>
    {children}
  </div>
)

const ModuleTag = ({ label }) => (
  <div className="text-[10px] font-mono text-orange-400 uppercase tracking-wider flex items-center gap-2">
    <span>&gt; RENDER_MODULE: {label}</span>
  </div>
)

const LedgerModule = ({ data }) => (
  <div className="space-y-3">
    <ModuleTag label="LEDGER" />
    <Card title={data.title || 'Liquidity Breakdown'}>
      <div className="space-y-2">
        {(data.items || []).map((it, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-gray-400 text-xs">{it.label}</span>
            <span className="font-mono text-white text-sm">{it.amount}</span>
          </div>
        ))}
        {data.net && (
          <div className="flex justify-between pt-2 border-t border-white/5">
            <span className="text-gray-300 text-xs">Net</span>
            <span className={`font-mono text-sm font-bold ${data.verdict === 'deficit' ? 'text-red-400' : 'text-green-400'}`}>
              {data.net}
            </span>
          </div>
        )}
      </div>
    </Card>
  </div>
)

const TimelineModule = ({ data }) => (
  <div className="space-y-3">
    <ModuleTag label="TIMELINE" />
    <Card title={data.title || 'Deployment Sequence'}>
      <ol className="space-y-2">
        {(data.steps || []).map((s, i) => (
          <li key={i} className="flex gap-3 text-xs">
            <span className="font-mono text-orange-400 w-12">M+{s.month}</span>
            <span className="text-gray-300">{s.label}</span>
          </li>
        ))}
      </ol>
    </Card>
  </div>
)

const LeverageModule = ({ data }) => {
  const monthly = (data.hourlyEUR || 0) * (data.hoursPerWeek || 0) * 4
  return (
    <div className="space-y-3">
      <ModuleTag label="LEVERAGE_SIM" />
      <Card title="Werkstudent Leverage">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-400">Deficit</span><span className="font-mono text-red-400">{data.deficit}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Hourly Rate</span><span className="font-mono text-white">€{data.hourlyEUR}/hr</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Hrs / week</span><span className="font-mono text-white">{data.hoursPerWeek}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Est. Monthly Income</span><span className="font-mono text-white">€{monthly.toLocaleString()}</span></div>
          <div className="flex justify-between pt-2 border-t border-white/5">
            <span className="text-gray-300">Months to Breakeven</span>
            <span className="font-mono text-green-400 font-bold">{data.monthsToBreakeven} mo</span>
          </div>
        </div>
        <div className="mt-3 w-full h-1 bg-[#1e293b] rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, 100 - (data.monthsToBreakeven || 0) * 5)}%` }}></div>
        </div>
      </Card>
    </div>
  )
}

const ComparisonModule = ({ data, comparisonRoutes = [] }) => {
  const wanted = (data.routes || []).slice(0, 3)
  const matched = wanted
    .map(name => comparisonRoutes.find(r => r.university?.toLowerCase().includes(name.toLowerCase())))
    .filter(Boolean)
  const list = matched.length ? matched : comparisonRoutes.slice(0, 2)
  return (
    <div className="space-y-3">
      <ModuleTag label="COMPARISON" />
      <div className="space-y-3">
        {list.map((r, i) => (
          <RouteCard
            key={r.id || i}
            route={r}
            tier={r.tier || 'moderate'}
            tint={r.tier === 'safe' ? 'bg-green-500/5' : r.tier === 'ambitious' ? 'bg-red-500/5' : 'bg-amber-500/5'}
            isBestMatch={i === 0}
            tierConfig={{ borderAccent: r.tier === 'safe' ? 'border-green-500/30' : r.tier === 'ambitious' ? 'border-red-500/30' : 'border-amber-500/30' }}
          />
        ))}
      </div>
      {data.title && <p className="text-[10px] font-mono text-gray-500">{data.title}</p>}
    </div>
  )
}

const DynamicHUD = ({ activeView, activeModule, comparisonRoutes = [] }) => {
  if (activeModule) {
    const t = activeModule.type
    const d = activeModule.data || {}
    if (t === 'ledger')     return <LedgerModule data={d} />
    if (t === 'timeline')   return <TimelineModule data={d} />
    if (t === 'leverage')   return <LeverageModule data={d} />
    if (t === 'comparison') return <ComparisonModule data={d} comparisonRoutes={comparisonRoutes} />
  }

  if (activeView === 'routes' && comparisonRoutes.length >= 1) {
    return <ComparisonModule data={{ routes: [] }} comparisonRoutes={comparisonRoutes} />
  }

  return (
    <div className="text-gray-500 text-xs font-mono text-center py-8">
      [ AWAITING QUERY ]
    </div>
  )
}

export default DynamicHUD
