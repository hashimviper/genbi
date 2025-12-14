import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  prefix = '',
  suffix = '',
  trend = 'neutral',
  trendValue,
  className,
}: KPICardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div
      className={cn(
        'glass-card flex flex-col justify-between rounded-xl p-5',
        className
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="mt-2">
        <span className="text-3xl font-bold text-foreground">
          {prefix}
          {formatValue(value)}
          {suffix}
        </span>
      </div>
      {trendValue && (
        <div className="mt-3 flex items-center gap-1">
          {trend === 'up' && (
            <TrendingUp className="h-4 w-4 text-chart-5" />
          )}
          {trend === 'down' && (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          {trend === 'neutral' && (
            <Minus className="h-4 w-4 text-muted-foreground" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              trend === 'up' && 'text-chart-5',
              trend === 'down' && 'text-destructive',
              trend === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
