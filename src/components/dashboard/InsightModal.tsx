import { useMemo } from 'react';
import { X, TrendingUp, TrendingDown, BarChart3, Percent, Hash } from 'lucide-react';
import { DashboardWidget, isKPIConfig, isChartConfig } from '@/types/dashboard';

interface InsightModalProps {
  widget: DashboardWidget;
  data: Record<string, unknown>[];
  position: { x: number; y: number };
  onClose: () => void;
}

interface Insight {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

export function InsightModal({ widget, data, position, onClose }: InsightModalProps) {
  const insights = useMemo(() => {
    const result: Insight[] = [];
    const config = widget.config;

    // Determine the numeric field
    let valueField = '';
    let labelField = '';

    if (isKPIConfig(config)) {
      valueField = config.valueField;
    } else if (isChartConfig(config)) {
      valueField = config.yAxis || config.valueField || '';
      labelField = config.xAxis || config.labelField || '';
    }

    if (!valueField || data.length === 0) {
      result.push({
        icon: <Hash className="h-4 w-4" />,
        label: 'Records',
        value: `${data.length} rows`,
        color: 'text-primary',
      });
      return result;
    }

    const values = data.map((r) => Number(r[valueField]) || 0);
    const total = values.reduce((a, b) => a + b, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Find highest label
    if (labelField) {
      const maxIndex = values.indexOf(max);
      const minIndex = values.indexOf(min);
      result.push({
        icon: <TrendingUp className="h-4 w-4" />,
        label: 'Highest',
        value: `${String(data[maxIndex]?.[labelField] || 'N/A')}: ${max.toLocaleString()}`,
        color: 'text-[hsl(var(--success))]',
      });
      result.push({
        icon: <TrendingDown className="h-4 w-4" />,
        label: 'Lowest',
        value: `${String(data[minIndex]?.[labelField] || 'N/A')}: ${min.toLocaleString()}`,
        color: 'text-destructive',
      });
    }

    // Growth trend (first vs last)
    if (values.length >= 2) {
      const first = values[0];
      const last = values[values.length - 1];
      const change = first !== 0 ? ((last - first) / first) * 100 : 0;
      result.push({
        icon: change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />,
        label: 'Trend (first→last)',
        value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        color: change >= 0 ? 'text-[hsl(var(--success))]' : 'text-destructive',
      });
    }

    // Top contributor percentage
    if (total > 0 && labelField) {
      const maxContrib = (max / total) * 100;
      const maxIndex = values.indexOf(max);
      result.push({
        icon: <Percent className="h-4 w-4" />,
        label: 'Top Contribution',
        value: `${String(data[maxIndex]?.[labelField] || 'N/A')}: ${maxContrib.toFixed(1)}%`,
        color: 'text-primary',
      });
    }

    // Summary stats
    result.push({
      icon: <BarChart3 className="h-4 w-4" />,
      label: 'Summary',
      value: `Avg: ${avg.toLocaleString(undefined, { maximumFractionDigits: 1 })} | Total: ${total.toLocaleString()}`,
      color: 'text-foreground',
    });

    return result;
  }, [widget, data]);

  // Constrain position to viewport
  const style = {
    top: Math.min(position.y, window.innerHeight - 320),
    left: Math.min(position.x, window.innerWidth - 360),
  };

  return (
    <div
      className="fixed z-[100] w-[340px] rounded-xl glass-card shadow-xl border border-primary/20 animate-scale-in"
      style={style}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground truncate flex-1">
          Insights — {widget.config.title}
        </h3>
        <button
          onClick={onClose}
          className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-4 space-y-3 max-h-60 overflow-auto">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 ${insight.color}`}>{insight.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{insight.label}</p>
              <p className="text-sm font-semibold text-foreground">{insight.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground text-center">Double-click any chart for insights</p>
      </div>
    </div>
  );
}
