import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartWidgetProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  color?: string;
}

export function GaugeChartWidget({ 
  value, 
  min = 0, 
  max = 100, 
  title,
  color = 'hsl(var(--chart-1))'
}: GaugeChartWidgetProps) {
  const percentage = Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);
  
  const data = [
    { name: 'value', value: percentage },
    { name: 'remaining', value: 100 - percentage },
  ];

  const getColor = (pct: number) => {
    if (pct >= 75) return 'hsl(var(--chart-5))';
    if (pct >= 50) return 'hsl(var(--chart-3))';
    if (pct >= 25) return 'hsl(var(--chart-4))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="90%"
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={getColor(percentage)} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-3xl font-bold text-foreground">{Math.round(percentage)}%</span>
        {title && <span className="mt-1 text-sm text-muted-foreground">{title}</span>}
      </div>
      <div className="flex w-full justify-between px-4 text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
