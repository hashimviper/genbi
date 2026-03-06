import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartWidgetProps {
  data: Record<string, unknown>[];
  xAxis: string;
  yAxis: string;
  primaryColor?: string;
  labelColor?: string;
  chartBgColor?: string;
  axisColor?: string;
  gridColor?: string;
}

export function AreaChartWidget({ data, xAxis, yAxis, primaryColor, labelColor, chartBgColor, axisColor, gridColor }: AreaChartWidgetProps) {
  const stroke = primaryColor || 'hsl(var(--chart-3))';
  const labelFill = labelColor || 'hsl(var(--muted-foreground))';
  const axFill = axisColor || 'hsl(var(--border))';
  const gridStroke = gridColor || 'hsl(var(--border))';
  const gradientId = useMemo(() => `areaGrad-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={chartBgColor ? { backgroundColor: chartBgColor } : undefined}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey={yAxis}
          stroke={stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
