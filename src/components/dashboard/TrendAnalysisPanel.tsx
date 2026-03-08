import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataColumn } from '@/types/dashboard';
import { analyzeDatasetFields } from '@/lib/fieldMapping';
import { formatAxisValue } from '@/lib/chartUtils';
import { cn } from '@/lib/utils';

interface TrendAnalysisPanelProps {
  columns: DataColumn[];
  data: Record<string, unknown>[];
}

interface TrendMetric {
  field: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
  sparkData: { v: number }[];
}

function computeTrends(columns: DataColumn[], data: Record<string, unknown>[]): TrendMetric[] {
  const analysis = analyzeDatasetFields(columns, data);
  const measures = analysis.measureFields.slice(0, 6);
  if (data.length < 4) return [];

  const half = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, half);
  const secondHalf = data.slice(half);

  return measures.map(field => {
    const allValues = data.map(d => Number(d[field]) || 0);
    const prevValues = firstHalf.map(d => Number(d[field]) || 0);
    const currValues = secondHalf.map(d => Number(d[field]) || 0);

    const prevAvg = prevValues.length ? prevValues.reduce((a, b) => a + b, 0) / prevValues.length : 0;
    const currAvg = currValues.length ? currValues.reduce((a, b) => a + b, 0) / currValues.length : 0;
    const change = currAvg - prevAvg;
    const changePercent = prevAvg !== 0 ? (change / prevAvg) * 100 : 0;

    // Build sparkline data (sample ~20 points)
    const step = Math.max(1, Math.floor(allValues.length / 20));
    const sparkData = allValues
      .filter((_, i) => i % step === 0)
      .map(v => ({ v }));

    return {
      field,
      current: currAvg,
      previous: prevAvg,
      change,
      changePercent,
      trend: Math.abs(changePercent) < 1 ? 'flat' : changePercent > 0 ? 'up' : 'down',
      sparkData,
    };
  });
}

export function TrendAnalysisPanel({ columns, data }: TrendAnalysisPanelProps) {
  const trends = useMemo(() => computeTrends(columns, data), [columns, data]);

  if (trends.length === 0) return null;

  const formatName = (n: string) => n.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="mb-6 glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Trend Analysis</h3>
        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">First half vs Second half</span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {trends.map((t) => (
          <div
            key={t.field}
            className={cn(
              'rounded-xl border p-3 transition-all hover:shadow-md',
              t.trend === 'up' && 'border-emerald-500/20 bg-emerald-500/5',
              t.trend === 'down' && 'border-red-500/20 bg-red-500/5',
              t.trend === 'flat' && 'border-border bg-muted/30',
            )}
          >
            <p className="text-[10px] font-medium text-muted-foreground truncate mb-1">{formatName(t.field)}</p>
            <p className="text-base font-bold text-foreground">{formatAxisValue(t.current)}</p>

            <div className="flex items-center gap-1 mt-1">
              {t.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
              {t.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500" />}
              {t.trend === 'flat' && <Minus className="h-3 w-3 text-muted-foreground" />}
              <span className={cn(
                'text-[10px] font-semibold',
                t.trend === 'up' && 'text-emerald-500',
                t.trend === 'down' && 'text-red-500',
                t.trend === 'flat' && 'text-muted-foreground',
              )}>
                {t.changePercent >= 0 ? '+' : ''}{t.changePercent.toFixed(1)}%
              </span>
            </div>

            {/* Mini sparkline */}
            <div className="mt-2 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={t.sparkData}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={t.trend === 'up' ? 'hsl(142 71% 45%)' : t.trend === 'down' ? 'hsl(0 84% 60%)' : 'hsl(var(--muted-foreground))'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
