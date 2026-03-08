import { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, Send, X, Sparkles, ChevronRight, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataColumn, ChartType, DashboardWidget } from '@/types/dashboard';
import { ChatMessage, generateBotResponse, getQuickPrompts, AnalysisInstance } from '@/lib/analyticsAdvisor';
import { autoConfigureWidget, generateSmartTitle, resetFieldTracker } from '@/lib/fieldMapping';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsChatbotProps {
  columns: DataColumn[];
  data: Record<string, unknown>[];
  datasetId: string;
  onAddWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
}

const SUITABILITY_COLORS: Record<string, string> = {
  'highly-recommended': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'recommended': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'possible': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

const SUITABILITY_LABELS: Record<string, string> = {
  'highly-recommended': '★ Best Fit',
  'recommended': '● Recommended',
  'possible': '○ Possible',
};

const ANALYSIS_ICONS: Record<string, string> = {
  trend: '📈', comparison: '📊', composition: '🧩', distribution: '📐',
  relationship: '🔗', ranking: '🏆', 'part-to-whole': '🧩', deviation: '⚡',
  flow: '🔄', performance: '🎯',
};

export function AnalyticsChatbot({ columns, data, datasetId, onAddWidget }: AnalyticsChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = useMemo(() => getQuickPrompts(columns), [columns]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `👋 **Welcome to Analytics Advisor!**\n\nI've analyzed your dataset with **${columns.length} fields** and **${data.length.toLocaleString()} records**. I can recommend the most effective chart types for different analytical perspectives.\n\n🔍 Ask me about trends, comparisons, rankings, distributions, correlations, or any specific field in your data.`,
        timestamp: new Date(),
      };
      setMessages([welcome]);
    }
  }, [isOpen, columns.length, data.length]);

  const handleSend = (text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate brief thinking delay
    setTimeout(() => {
      const response = generateBotResponse(query, columns, data);
      const botMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.content,
        recommendations: response.recommendations,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCreateChart = (instance: AnalysisInstance, chartType: string) => {
    const type = chartType as ChartType;
    const autoConfig = autoConfigureWidget(type, columns, data);

    // Override with the recommended fields
    if (instance.fields.dimension) {
      if (['bar', 'line', 'area', 'scatter', 'combo', 'stackedBar'].includes(type)) {
        autoConfig.xAxis = instance.fields.dimension;
      } else {
        autoConfig.labelField = instance.fields.dimension;
      }
    }
    if (instance.fields.measure) {
      if (['bar', 'line', 'area', 'scatter', 'combo', 'stackedBar'].includes(type)) {
        autoConfig.yAxis = instance.fields.measure;
      } else {
        autoConfig.valueField = instance.fields.measure;
      }
    }

    const widget: Omit<DashboardWidget, 'id'> = {
      type,
      config: {
        id: '',
        type,
        title: generateSmartTitle(
          type,
          autoConfig.xAxis as string || '',
          autoConfig.yAxis as string || '',
          autoConfig.labelField as string || '',
          autoConfig.valueField as string || ''
        ),
        datasetId,
        xAxis: (autoConfig.xAxis as string) || '',
        yAxis: (autoConfig.yAxis as string) || '',
        labelField: (autoConfig.labelField as string) || '',
        valueField: (autoConfig.valueField as string) || '',
        aggregation: (autoConfig.aggregation as 'sum') || 'sum',
        width: 1,
        height: 1,
        position: { x: 0, y: 0 },
      },
      gridPosition: { x: 0, y: 0, w: 6, h: 4 },
    };

    onAddWidget(widget);

    const confirmMsg: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: `✅ **${chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart created!** — "${instance.title}" has been added to your dashboard. You can configure it further by clicking on the widget.`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, confirmMsg]);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg gradient-bg hover:opacity-90 p-0"
        title="Analytics Advisor"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 gradient-bg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-white" />
          <div>
            <h3 className="text-sm font-semibold text-white">Analytics Advisor</h3>
            <p className="text-[10px] text-white/70">Powered by rule-based intelligence</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-7 w-7 p-0 text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[90%] rounded-2xl px-4 py-2.5 text-sm',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              )}>
                {/* Render markdown-like bold */}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-1' : ''}>
                      {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={j}>{part.slice(2, -2)}</strong>
                          : part.startsWith('*') && part.endsWith('*')
                            ? <em key={j}>{part.slice(1, -1)}</em>
                            : part
                      )}
                    </p>
                  ))}
                </div>

                {/* Recommendation Cards */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {msg.recommendations.map((rec, idx) => (
                      <div key={idx} className="rounded-xl border border-border/50 bg-background/80 p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{ANALYSIS_ICONS[rec.type] || '📊'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{rec.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{rec.description}</p>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {rec.recommendedCharts.filter(c => c.available).map((chart, ci) => (
                            <div key={ci} className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn('text-[9px] px-1.5 py-0 shrink-0', SUITABILITY_COLORS[chart.suitability])}
                              >
                                {SUITABILITY_LABELS[chart.suitability]}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground flex-1 truncate">{chart.reason}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 px-2 text-[9px] text-primary hover:bg-primary/10 shrink-0"
                                onClick={() => handleCreateChart(rec, chart.chartType)}
                              >
                                + {chart.chartType}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-border/30">
          <p className="text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Quick questions
          </p>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[10px] px-2 py-1 rounded-full border border-border/50 bg-muted/50 text-foreground hover:bg-primary/10 hover:border-primary/30 transition-colors truncate max-w-full"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your data..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <Button
            size="sm"
            className="h-8 w-8 p-0 rounded-full gradient-bg"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
