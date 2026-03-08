import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardWidget } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface PresentationModeProps {
  widgets: DashboardWidget[];
  renderWidget: (widget: DashboardWidget) => React.ReactNode;
  onClose: () => void;
  autoPlayInterval?: number; // seconds
}

export function PresentationMode({ widgets, renderWidget, onClose, autoPlayInterval = 8 }: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrentIndex(i => (i + 1) % widgets.length);
  }, [widgets.length]);

  const prev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + widgets.length) % widgets.length);
  }, [widgets.length]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(next, autoPlayInterval * 1000);
    return () => clearInterval(timer);
  }, [isPlaying, next, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, onClose]);

  if (widgets.length === 0) return null;

  const widget = widgets[currentIndex];

  return (
    <div className="fixed inset-0 z-[300] bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/30 bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">{widget.config.title}</span>
          <span className="text-xs text-muted-foreground">{currentIndex + 1} / {widgets.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="gap-1">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Widget display */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>

        <div className="w-full max-w-4xl h-[70vh] rounded-2xl border border-border bg-card shadow-xl p-6 animate-fade-in">
          <h2 className="text-lg font-bold text-foreground mb-4">{widget.config.title}</h2>
          <div className="h-[calc(100%-3rem)]">
            {renderWidget(widget)}
          </div>
        </div>

        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors">
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 px-6 py-3 justify-center">
        {widgets.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn('h-1.5 rounded-full transition-all', i === currentIndex ? 'w-8 bg-primary' : 'w-3 bg-muted hover:bg-muted-foreground/30')}
          />
        ))}
      </div>
    </div>
  );
}
