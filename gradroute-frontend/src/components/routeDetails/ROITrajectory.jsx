import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const ROITrajectory = () => {
  // Data points for 5 years (months 0, 12, 24, 36, 48, 60)
  const data = [
    { month: 0, netWorth: -12.0, label: 'Day 1' },
    { month: 12, netWorth: -14.5, label: 'Y1 End' },
    { month: 24, netWorth: -11.2, label: 'Graduation' },
    { month: 28, netWorth: 0, label: 'Break‑even' },
    { month: 36, netWorth: 8.5, label: 'Y3 Work' },
    { month: 48, netWorth: 28.0, label: 'Y4 Work' },
    { month: 60, netWorth: 52.0, label: 'Y5 Work' },
  ]

  const formatYAxis = (value) => `₹${value}L`
  const formatTooltip = (value) => `₹${value.toFixed(1)}L`

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
        5‑Year ROI Trajectory
      </h2>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(value) => {
                if (value === 0) return 'Day 1'
                if (value === 24) return 'Y2'
                if (value === 36) return 'Y3'
                if (value === 48) return 'Y4'
                if (value === 60) return 'Y5'
                return ''
              }}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={formatYAxis}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F172A', 
                border: '1px solid #334155',
                borderRadius: '8px',
                fontFamily: 'monospace'
              }}
              labelFormatter={(value) => `Month ${value}`}
              formatter={(value) => [formatTooltip(value), 'Net Worth']}
            />
            <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
            
            {/* Red/orange segment (negative) */}
            <Line 
              type="monotone" 
              dataKey="netWorth" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 3 }}
              activeDot={{ r: 5, fill: '#f97316' }}
              connectNulls
              // Split at zero for color change
              isAnimationActive={true}
            />
            
            {/* Green segment (positive) - overlay with conditional */}
            <Line 
              type="monotone" 
              dataKey="netWorth" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={false}
              activeDot={false}
              data={data.filter(d => d.netWorth >= 0)}
              connectNulls
            />
            
            {/* Break‑even marker */}
            <ReferenceLine 
              x={28} 
              stroke="#f97316" 
              strokeWidth={2}
              label={{ 
                value: 'BREAK‑EVEN', 
                position: 'top', 
                fill: '#f97316', 
                fontSize: 9, 
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] font-mono text-gray-500">
        <span>Investment Phase (Red)</span>
        <span className="text-green-400">Profit Phase (Green)</span>
        <span>Break‑even: Month 28</span>
      </div>
    </div>
  )
}

export default ROITrajectory