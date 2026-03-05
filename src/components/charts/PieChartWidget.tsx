import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from 'recharts';

interface PieChartWidgetProps {
  data: Record<string, unknown>[];
  labelField: string;
  valueField: string;
  colors?: string[];
  labelColor?: string;
  showDataLabels?: boolean;
  onSliceClick?: (value: unknown) => void;
}

const DEFAULT_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function PieChartWidget({ data, labelField, valueField, colors, labelColor, showDataLabels, onSliceClick }: PieChartWidgetProps) {
  const palette = colors && colors.length > 0 ? colors : DEFAULT_COLORS;
  const labelFill = labelColor || 'hsl(var(--muted-foreground))';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey={valueField}
          nameKey={labelField}
          cx="50%"
          cy="50%"
          outerRadius="70%"
          innerRadius="40%"
          strokeWidth={0}
          cursor={onSliceClick ? 'pointer' : undefined}
          onClick={(entry) => onSliceClick?.(entry?.[labelField])}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
          ))}
          {showDataLabels && (
            <LabelList dataKey={valueField} position="outside" fill={labelFill} fontSize={10} />
          )}
        </Pie>
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
      </PieChart>
    </ResponsiveContainer>
  );
}
