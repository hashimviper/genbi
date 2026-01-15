import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface TreemapWidgetProps {
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

interface CustomContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  index?: number;
}

const CustomContent = ({ x = 0, y = 0, width = 0, height = 0, name, value, index = 0 }: CustomContentProps) => {
  const showText = width > 50 && height > 30;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={COLORS[index % COLORS.length]}
        stroke="hsl(var(--background))"
        strokeWidth={2}
        rx={4}
      />
      {showText && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            fill="hsl(var(--primary-foreground))"
            fontSize={11}
            fontWeight={600}
          >
            {String(name).slice(0, 12)}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="hsl(var(--primary-foreground))"
            fontSize={10}
            opacity={0.8}
          >
            {value?.toLocaleString()}
          </text>
        </>
      )}
    </g>
  );
};

export function TreemapWidget({ data, labelField, valueField }: TreemapWidgetProps) {
  const treemapData = data.map((item, index) => ({
    name: String(item[labelField] || ''),
    value: Number(item[valueField]) || 0,
    index,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={treemapData}
        dataKey="value"
        aspectRatio={4 / 3}
        content={<CustomContent />}
      >
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))',
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}
