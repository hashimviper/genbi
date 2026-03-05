import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface BarChartWidgetProps {
  data: Record<string, unknown>[];
  xAxis: string;
  yAxis: string;
  primaryColor?: string;
  labelColor?: string;
  showDataLabels?: boolean;
  onBarClick?: (value: unknown) => void;
}

export function BarChartWidget({ data, xAxis, yAxis, primaryColor, labelColor, showDataLabels, onBarClick }: BarChartWidgetProps) {
  const fill = primaryColor || 'hsl(var(--chart-1))';
  const labelFill = labelColor || 'hsl(var(--muted-foreground))';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey={xAxis}
          tick={{ fill: labelFill, fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis
          tick={{ fill: labelFill, fontSize: 11 }}
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
        <Bar
          dataKey={yAxis}
          fill={fill}
          radius={[4, 4, 0, 0]}
          cursor={onBarClick ? 'pointer' : undefined}
          onClick={(entry) => onBarClick?.(entry?.[xAxis])}
        >
          {showDataLabels && (
            <LabelList dataKey={yAxis} position="top" fill={labelFill} fontSize={10} />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
