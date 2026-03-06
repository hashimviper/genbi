import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Area,
} from 'recharts';
import { useMemo } from 'react';

interface LineChartWidgetProps {
  data: Record<string, unknown>[];
  xAxis: string;
  yAxis: string;
  primaryColor?: string;
  labelColor?: string;
  showDataLabels?: boolean;
  lineThickness?: number;
  areaFill?: boolean;
  chartBgColor?: string;
  axisColor?: string;
  gridColor?: string;
}

export function LineChartWidget({ data, xAxis, yAxis, primaryColor, labelColor, showDataLabels, lineThickness, areaFill, chartBgColor, axisColor, gridColor }: LineChartWidgetProps) {
  const stroke = primaryColor || 'hsl(var(--chart-2))';
  const labelFill = labelColor || 'hsl(var(--muted-foreground))';
  const axFill = axisColor || 'hsl(var(--border))';
  const gridStroke = gridColor || 'hsl(var(--border))';
  const thickness = lineThickness || 2;
  const gradientId = useMemo(() => `lineGrad-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={chartBgColor ? { backgroundColor: chartBgColor } : undefined}>
        {areaFill && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
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
        {areaFill && (
          <Area type="monotone" dataKey={yAxis} stroke="none" fill={`url(#${gradientId})`} />
        )}
        <Line
          type="monotone"
          dataKey={yAxis}
          stroke={stroke}
          strokeWidth={thickness}
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
