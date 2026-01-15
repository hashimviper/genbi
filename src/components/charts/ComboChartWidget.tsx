import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComboChartWidgetProps {
  data: Record<string, unknown>[];
  xAxis: string;
  barField: string;
  lineField: string;
}

export function ComboChartWidget({ data, xAxis, barField, lineField }: ComboChartWidgetProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey={xAxis}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))',
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '11px' }}
          formatter={(value) => (
            <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
          )}
        />
        <Bar 
          yAxisId="left" 
          dataKey={barField} 
          fill="hsl(var(--chart-1))" 
          radius={[4, 4, 0, 0]}
          name={barField}
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey={lineField} 
          stroke="hsl(var(--chart-2))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 0, r: 4 }}
          name={lineField}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
