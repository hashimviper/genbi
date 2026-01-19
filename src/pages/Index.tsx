import { Link } from 'react-router-dom';
import { 
  Database, 
  LayoutGrid, 
  Settings, 
  ArrowRight, 
  Sparkles, 
  BarChart3,
  FileText,
  Zap,
  TrendingUp,
  Shield,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { 
    icon: Database, 
    title: 'Import Data', 
    description: 'CSV & Excel files with smart auto-detection', 
    href: '/data',
    color: 'from-[hsl(200,90%,50%)] to-[hsl(155,75%,45%)]',
  },
  { 
    icon: FileText, 
    title: 'Templates', 
    description: '11+ pre-built industry templates', 
    href: '/templates',
    color: 'from-primary to-accent',
  },
  { 
    icon: Settings, 
    title: 'Admin Panel', 
    description: 'Configure charts, KPIs & widgets', 
    href: '/admin',
    color: 'from-[hsl(38,95%,55%)] to-[hsl(330,85%,60%)]',
  },
  { 
    icon: LayoutGrid, 
    title: 'Build Dashboards', 
    description: 'Intuitive drag-and-drop builder', 
    href: '/builder',
    color: 'from-[hsl(280,85%,58%)] to-[hsl(330,85%,60%)]',
  },
];

const highlights = [
  { icon: Shield, title: 'Private & Secure', description: 'Data never leaves your browser' },
  { icon: Zap, title: 'Lightning Fast', description: 'Instant local processing' },
  { icon: Cpu, title: 'Smart Analysis', description: 'Automatic data type detection' },
];

const stats = [
  { value: '11+', label: 'Industry Templates', color: 'text-primary' },
  { value: '6+', label: 'Chart Types', color: 'text-accent' },
  { value: '100%', label: 'Local Processing', color: 'text-[hsl(155,75%,45%)]' },
];

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(155,75%,45%)]/8 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-lg px-6 py-4 sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg group-hover:shadow-xl transition-shadow">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Vyzion</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/templates" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors link-underline">
              Templates
            </Link>
            <Link to="/dashboards" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors link-underline">
              Dashboards
            </Link>
            <Link to="/data">
              <Button size="sm" className="gradient-bg hover:opacity-90 shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative px-6 py-24 md:py-32 text-center">
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="h-4 w-4 animate-pulse" /> Business Intelligence Made Simple
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Transform Data Into
            <span className="block mt-2 gradient-text"> Actionable Insights</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Create stunning dashboards in minutes. Import your data, pick a template, 
            and watch Vyzion generate beautiful visualizations—all processed locally.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link to="/templates">
              <Button size="lg" className="gap-2 gradient-bg hover:opacity-90 shadow-lg hover:shadow-xl hover-scale transition-all h-12 px-8 text-base">
                Browse Templates <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/data">
              <Button size="lg" variant="outline" className="gap-2 hover-lift h-12 px-8 text-base border-2">
                <Zap className="h-4 w-4 text-primary" /> Import Data
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 flex justify-center gap-12 md:gap-20 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center group hover-scale cursor-default">
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} transition-transform`}>
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Everything You Need</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From data import to professional dashboards in just a few clicks
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, href, color }, i) => (
            <Link
              key={title}
              to={href}
              className="glass-card-hover group rounded-2xl p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Get started <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-gradient-to-b from-transparent via-primary/5 to-transparent py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }, i) => (
              <div 
                key={title} 
                className="flex items-start gap-4 animate-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(0_0%_100%/0.15),transparent_60%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white/90 mb-6">
              <TrendingUp className="h-4 w-4" /> Start building today
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Transform Your Data?</h2>
            <p className="mt-4 text-lg text-white/80">
              Start building professional dashboards with our pre-built templates
            </p>
            <Link to="/templates" className="mt-8 inline-block">
              <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg h-12 px-8">
                Explore Templates <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/50 bg-card/50 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Vyzion</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            All data processed locally. Your data never leaves your browser.
          </p>
          <div className="flex gap-6">
            <Link to="/templates" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Templates
            </Link>
            <Link to="/dashboards" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Dashboards
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
