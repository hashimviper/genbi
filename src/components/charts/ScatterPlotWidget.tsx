import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';

interface ScatterPlotWidgetProps {
  data: Record<string, unknown>[];
  xAxis: string;
  yAxis: string;
  sizeField?: string;
}

export function ScatterPlotWidget({ data, xAxis, yAxis, sizeField }: ScatterPlotWidgetProps) {
  const scatterData = data.map((item) => ({
    x: Number(item[xAxis]) || 0,
    y: Number(item[yAxis]) || 0,
    z: sizeField ? Number(item[sizeField]) || 1 : 1,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          dataKey="x"
          name={xAxis}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yAxis}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        {sizeField && <ZAxis type="number" dataKey="z" range={[50, 400]} name={sizeField} />}
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))',
          }}
          formatter={(value: number, name: string) => [value, name]}
        />
        <Scatter data={scatterData} fill="hsl(var(--chart-1))" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
