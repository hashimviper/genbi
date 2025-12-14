import { Link } from 'react-router-dom';
import { BarChart3, Database, LayoutGrid, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Database, title: 'Import Data', description: 'CSV, Excel files supported', href: '/data' },
  { icon: Settings, title: 'Admin Panel', description: 'Configure charts & widgets', href: '/admin' },
  { icon: LayoutGrid, title: 'Build Dashboards', description: 'Drag-and-drop builder', href: '/builder' },
];

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden px-6 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" /> Offline-first Dashboard Builder
          </div>
          <h1 className="text-5xl font-bold leading-tight text-foreground">
            Transform Your Data Into
            <span className="gradient-text"> Powerful Insights</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Import, analyze, and visualize your data with professional dashboards. 
            All processing happens locally in your browser.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/data">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboards">
              <Button size="lg" variant="outline">View Dashboards</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description, href }, i) => (
            <Link
              key={title}
              to={href}
              className="glass-card group rounded-xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/50 px-6 py-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">DataViz Pro</span>
        </div>
        <p className="mt-2">All data is processed locally. Your data never leaves your browser.</p>
      </footer>
    </div>
  );
}
