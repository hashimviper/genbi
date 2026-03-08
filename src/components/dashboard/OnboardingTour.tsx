import { useState, useEffect } from 'react';
import { X, ChevronRight, Upload, FileText, Settings, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TOUR_KEY = 'visorybi-tour-completed';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Data',
    description: 'Import CSV or Excel files. Your data stays local — nothing leaves your browser.',
    color: 'from-[hsl(200,90%,50%)] to-[hsl(155,75%,45%)]',
  },
  {
    icon: FileText,
    title: 'Pick a Template',
    description: 'Choose from 11+ industry templates or start from scratch.',
    color: 'from-primary to-accent',
  },
  {
    icon: Settings,
    title: 'Customize Widgets',
    description: 'Configure charts, colors, labels, and field mappings with the visual editor.',
    color: 'from-[hsl(38,95%,55%)] to-[hsl(330,85%,60%)]',
  },
  {
    icon: LayoutGrid,
    title: 'Export & Share',
    description: 'Export as PNG, PDF, or PPTX. Share via link with filters preserved.',
    color: 'from-[hsl(280,85%,58%)] to-[hsl(330,85%,60%)]',
  },
];

export function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    setVisible(false);
    localStorage.setItem(TOUR_KEY, 'true');
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else handleComplete();
  };

  if (!visible) return null;

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl animate-scale-in">
        <button onClick={handleComplete} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={cn('h-2 rounded-full transition-all', i === step ? 'w-8 bg-primary' : 'w-2 bg-muted')} />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={cn('flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg', current.color)}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-foreground text-center">{current.title}</h3>
        <p className="mt-3 text-sm text-muted-foreground text-center leading-relaxed">{current.description}</p>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleComplete}>Skip</Button>
            <Button size="sm" onClick={handleNext} className="gap-1">
              {step < steps.length - 1 ? <>Next <ChevronRight className="h-4 w-4" /></> : 'Get Started'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
