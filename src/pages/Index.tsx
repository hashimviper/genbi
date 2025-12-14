import { Link } from 'react-router-dom';
import { 
  Database, 
  LayoutGrid, 
  Settings, 
  ArrowRight, 
  Sparkles, 
  BarChart3,
  FileText,
  Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { 
    icon: Database, 
    title: 'Import Data', 
    description: 'CSV & Excel files supported with auto-detection', 
    href: '/data' 
  },
  { 
    icon: FileText, 
    title: 'Templates', 
    description: 'Pre-built dashboards for HR, Sales, Finance & more', 
    href: '/templates' 
  },
  { 
    icon: Settings, 
    title: 'Admin Panel', 
    description: 'Configure charts, KPIs & visualizations', 
    href: '/admin' 
  },
  { 
    icon: LayoutGrid, 
    title: 'Build Dashboards', 
    description: 'Drag-and-drop dashboard builder', 
    href: '/builder' 
  },
];

const stats = [
  { value: '11+', label: 'Industry Templates' },
  { value: '6+', label: 'Chart Types' },
  { value: '100%', label: 'Local Processing' },
];

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">GenBI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/templates" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Templates
            </Link>
            <Link to="/dashboards" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboards
            </Link>
            <Link to="/data">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> Business Intelligence Made Simple
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            Transform Data Into
            <span className="gradient-text"> Actionable Insights</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Create professional dashboards in minutes. Import your data, choose a template, 
            and let GenBI generate beautiful visualizations—all processed locally.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/templates">
              <Button size="lg" className="gap-2">
                Browse Templates <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/data">
              <Button size="lg" variant="outline" className="gap-2">
                <Zap className="h-4 w-4" /> Import Data
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex justify-center gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground">Everything You Need</h2>
          <p className="mt-2 text-muted-foreground">
            From data import to professional dashboards in just a few clicks
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, href }, i) => (
            <Link
              key={title}
              to={href}
              className="glass-card group rounded-xl p-6 transition-all hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="glass-card rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="mt-3 text-muted-foreground">
            Start building professional dashboards with our pre-built templates
          </p>
          <Link to="/templates" className="mt-6 inline-block">
            <Button size="lg" className="gap-2">
              Explore Templates <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/50 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">GenBI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            All data processed locally. Your data never leaves your browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
