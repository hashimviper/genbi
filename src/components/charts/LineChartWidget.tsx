import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface LineChartWidgetProps {
  data: Record<string, unknown>[];
  xAxis: string;
  yAxis: string;
  primaryColor?: string;
  labelColor?: string;
  showDataLabels?: boolean;
}

export function LineChartWidget({ data, xAxis, yAxis, primaryColor, labelColor, showDataLabels }: LineChartWidgetProps) {
  const stroke = primaryColor || 'hsl(var(--chart-2))';
  const labelFill = labelColor || 'hsl(var(--muted-foreground))';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
        <Line
          type="monotone"
          dataKey={yAxis}
          stroke={stroke}
          strokeWidth={2}
          dot={{ fill: stroke, strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        >
          {showDataLabels && (
            <LabelList dataKey={yAxis} position="top" fill={labelFill} fontSize={10} />
          )}
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}
