import { ResponsiveContainer, Tooltip, FunnelChart, Funnel, Cell, LabelList } from 'recharts';

interface FunnelChartWidgetProps {
  data: Record<string, unknown>[];
  labelField: string;
  valueField: string;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function FunnelChartWidget({ data, labelField, valueField }: FunnelChartWidgetProps) {
  const funnelData = data
    .map((item) => ({
      name: String(item[labelField] || ''),
      value: Number(item[valueField]) || 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <FunnelChart>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))',
          }}
        />
        <Funnel
          dataKey="value"
          data={funnelData}
          isAnimationActive
        >
          <LabelList 
            position="center" 
            fill="hsl(var(--primary-foreground))" 
            stroke="none" 
            dataKey="name"
            fontSize={11}
          />
          {funnelData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}
