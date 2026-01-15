import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface WaterfallChartWidgetProps {
  data: Record<string, unknown>[];
  labelField: string;
  valueField: string;
}

export function WaterfallChartWidget({ data, labelField, valueField }: WaterfallChartWidgetProps) {
  let cumulative = 0;
  
  const waterfallData = data.map((item, index) => {
    const value = Number(item[valueField]) || 0;
    const isLast = index === data.length - 1;
    
    const start = cumulative;
    cumulative += value;
    
    return {
      name: String(item[labelField] || ''),
      value: isLast ? cumulative : value,
      start: isLast ? 0 : start,
      isPositive: value >= 0,
      isLast,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis
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
        <ReferenceLine y={0} stroke="hsl(var(--border))" />
        {/* Invisible bar for positioning */}
        <Bar dataKey="start" stackId="stack" fill="transparent" />
        {/* Visible value bar */}
        <Bar dataKey="value" stackId="stack" radius={[4, 4, 0, 0]}>
          {waterfallData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={
                entry.isLast 
                  ? 'hsl(var(--chart-4))' 
                  : entry.isPositive 
                    ? 'hsl(var(--chart-5))' 
                    : 'hsl(var(--destructive))'
              } 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
