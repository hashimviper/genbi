import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';

interface BarChartWidgetProps {
  data: Record<string, unknown>[];
  xAxis: string;
  yAxis: string;
  primaryColor?: string;
  labelColor?: string;
  showDataLabels?: boolean;
  categoryColors?: Record<string, string>;
  chartBgColor?: string;
  axisColor?: string;
  gridColor?: string;
  onBarClick?: (value: unknown) => void;
}

export function BarChartWidget({ data, xAxis, yAxis, primaryColor, labelColor, showDataLabels, categoryColors, chartBgColor, axisColor, gridColor, onBarClick }: BarChartWidgetProps) {
  const fill = primaryColor || 'hsl(var(--chart-1))';
  const labelFill = labelColor || 'hsl(var(--muted-foreground))';
  const axFill = axisColor || 'hsl(var(--border))';
  const gridStroke = gridColor || 'hsl(var(--border))';
  const hasCategoryColors = categoryColors && Object.keys(categoryColors).length > 0;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={chartBgColor ? { backgroundColor: chartBgColor } : undefined}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
        <XAxis
          dataKey={xAxis}
          tick={{ fill: labelFill, fontSize: 11 }}
          axisLine={{ stroke: axFill }}
          tickLine={{ stroke: axFill }}
        />
        <YAxis
          tick={{ fill: labelFill, fontSize: 11 }}
          axisLine={{ stroke: axFill }}
          tickLine={{ stroke: axFill }}
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
          {hasCategoryColors && data.map((entry, index) => {
            const key = String(entry[xAxis] ?? '');
            return <Cell key={`cell-${index}`} fill={categoryColors![key] || fill} />;
          })}
          {showDataLabels && (
            <LabelList dataKey={yAxis} position="top" fill={labelFill} fontSize={10} />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
