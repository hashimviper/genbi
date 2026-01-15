import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DonutChartWidgetProps {
  data: Record<string, unknown>[];
  labelField: string;
  valueField: string;
  showPercentage?: boolean;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function DonutChartWidget({ data, labelField, valueField, showPercentage = true }: DonutChartWidgetProps) {
  const total = data.reduce((sum, item) => sum + (Number(item[valueField]) || 0), 0);

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={valueField}
            nameKey={labelField}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            strokeWidth={0}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
            formatter={(value: number) => [
              showPercentage ? `${value} (${((value / total) * 100).toFixed(1)}%)` : value,
              ''
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px' }}
            formatter={(value) => (
              <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-2xl font-bold text-foreground">{total.toLocaleString()}</span>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
}
