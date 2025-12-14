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
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: FileText, label: 'Templates', href: '/templates' },
  { icon: LayoutDashboard, label: 'Dashboard Builder', href: '/builder' },
  { icon: FolderOpen, label: 'My Dashboards', href: '/dashboards' },
  { icon: Database, label: 'Data Sources', href: '/data' },
  { icon: Settings, label: 'Admin Panel', href: '/admin' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <Link to="/" className="flex h-16 items-center gap-3 border-b border-border px-4 hover:bg-sidebar-accent/50 transition-colors">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <span className="font-bold text-foreground">GenBI</span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="border-t border-border p-3">
          <Link to="/templates">
            <Button className="w-full gap-2" size="sm">
              <Plus className="h-4 w-4" />
              New Dashboard
            </Button>
          </Link>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground"
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
