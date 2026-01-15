import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SparklineWidgetProps {
  title: string;
  value: number | string;
  data: Record<string, unknown>[];
  valueField: string;
  prefix?: string;
  suffix?: string;
  showTrend?: boolean;
}

export function SparklineWidget({ 
  title, 
  value, 
  data, 
  valueField, 
  prefix = '', 
  suffix = '',
  showTrend = true
}: SparklineWidgetProps) {
  const sparkData = data.map((item) => ({
    value: Number(item[valueField]) || 0,
  }));

  const values = sparkData.map(d => d.value);
  const trend = values.length >= 2 
    ? values[values.length - 1] > values[0] 
      ? 'up' 
      : values[values.length - 1] < values[0] 
        ? 'down' 
        : 'neutral'
    : 'neutral';

  const trendPercentage = values.length >= 2 && values[0] !== 0
    ? (((values[values.length - 1] - values[0]) / values[0]) * 100).toFixed(1)
    : '0';

  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="glass-card flex h-full flex-col justify-between rounded-xl p-4">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      
      <div className="my-2 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
                padding: '4px 8px',
              }}
              formatter={(val: number) => [`${prefix}${val.toLocaleString()}${suffix}`, '']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={trend === 'up' ? 'hsl(var(--chart-5))' : trend === 'down' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-foreground">
          {prefix}{formatValue(value)}{suffix}
        </span>
        {showTrend && (
          <div className={cn(
            'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
            trend === 'up' && 'bg-chart-5/10 text-chart-5',
            trend === 'down' && 'bg-destructive/10 text-destructive',
            trend === 'neutral' && 'bg-muted text-muted-foreground'
          )}>
            {trend === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3" />}
            {trend === 'neutral' && <Minus className="h-3 w-3" />}
            {trend === 'up' ? '+' : ''}{trendPercentage}%
          </div>
        )}
      </div>
    </div>
  );
}
