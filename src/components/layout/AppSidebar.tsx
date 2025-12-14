import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Settings,
  FolderOpen,
  Plus,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  color?: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', href: '/', color: 'text-[hsl(200,90%,50%)]' },
  { icon: FileText, label: 'Templates', href: '/templates', color: 'text-primary' },
  { icon: LayoutDashboard, label: 'Dashboard Builder', href: '/builder', color: 'text-accent' },
  { icon: FolderOpen, label: 'My Dashboards', href: '/dashboards', color: 'text-[hsl(155,75%,45%)]' },
  { icon: Database, label: 'Data Sources', href: '/data', color: 'text-[hsl(38,95%,55%)]' },
  { icon: Settings, label: 'Admin Panel', href: '/admin', color: 'text-[hsl(280,85%,58%)]' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <Link 
        to="/" 
        className="flex h-16 items-center gap-3 border-b border-border px-4 hover:bg-sidebar-accent/50 transition-all group"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
          <BarChart3 className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-foreground">GenBI</span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 animate-slide-in-left',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-1'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className={cn(
                'h-5 w-5 shrink-0 transition-colors',
                isActive ? 'text-primary' : item.color
              )} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto h-2 w-2 rounded-full gradient-bg animate-pulse-soft" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="border-t border-border p-4">
          <Link to="/templates">
            <Button className="w-full gap-2 gradient-bg hover:opacity-90 shadow-md hover:shadow-lg transition-all" size="sm">
              <Plus className="h-4 w-4" />
              New Dashboard
            </Button>
          </Link>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}
