import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface OverviewChartProps {
    data?: { period: string; totalVolume: number }[];
}

export function OverviewChart({ data = [] }: OverviewChartProps) {
  // If no data, use empty or placeholder but better to show empty state handled in parent
  const chartData = data.map(d => ({
    name: d.period.split('-W')[1] ? `W${d.period.split('-W')[1]}` : d.period,
    total: d.totalVolume
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData.length > 0 ? chartData : [{ name: 'N/A', total: 0 }]}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
       <Tooltip 
           cursor={{fill: 'hsl(var(--muted)/0.5)'}}
           contentStyle={{ 
             borderRadius: '8px', 
             border: '1px solid hsl(var(--border))', 
             background: 'hsl(var(--card))', 
             color: 'hsl(var(--card-foreground))',
             boxShadow: '0 4px 12px rgba(0,0,0,0.5)' 
           }}
       />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
