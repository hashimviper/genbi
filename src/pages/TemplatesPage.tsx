import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Globe,
  TrendingUp,
  Heart,
  Factory,
  Globe2,
  CloudSun,
  FileBarChart,
  DollarSign,
  ShoppingCart,
  ClipboardList,
  Search,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { dashboardTemplates } from '@/data/templates';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { DashboardTemplate } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Globe,
  TrendingUp,
  Heart,
  Factory,
  Globe2,
  CloudSun,
  FileBarChart,
  DollarSign,
  ShoppingCart,
  ClipboardList,
};

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { createDashboard, addWidget, datasets } = useDashboardStore();
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const [dashboardName, setDashboardName] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = dashboardTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(dashboardTemplates.map((t) => t.category))];

  const handleSelectTemplate = (template: DashboardTemplate) => {
    setSelectedTemplate(template);
    setDashboardName(`${template.name} Dashboard`);
    setSelectedDataset(datasets[0]?.id || '');
  };

  const handleCreateFromTemplate = () => {
    if (!selectedTemplate || !dashboardName.trim()) return;

    const dashboard = createDashboard(dashboardName.trim(), selectedTemplate.description);

    // Add widgets from template
    selectedTemplate.widgets.forEach((widget) => {
      const newWidget = {
        ...widget,
        config: {
          ...widget.config,
          id: uuidv4(),
          datasetId: selectedDataset || '',
        },
      };
      addWidget(dashboard.id, newWidget);
    });

    toast({
      title: 'Dashboard created',
      description: `${dashboardName} has been created from the ${selectedTemplate.name} template.`,
    });

    setSelectedTemplate(null);
    navigate(`/builder?id=${dashboard.id}`);
  };

  return (
    <MainLayout>
      <div className="flex h-full flex-col p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard Templates</h1>
          <p className="mt-1 text-muted-foreground">
            Choose a pre-built template to get started quickly
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Templates by Category */}
        <div className="flex-1 space-y-8 overflow-auto">
          {categories.map((category) => {
            const categoryTemplates = filteredTemplates.filter((t) => t.category === category);
            if (categoryTemplates.length === 0) return null;

            return (
              <section key={category}>
                <h2 className="mb-4 text-lg font-semibold text-foreground">{category}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryTemplates.map((template, index) => {
                    const IconComponent = iconMap[template.icon] || FileBarChart;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className="glass-card group animate-fade-in rounded-xl p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-lg transition-colors"
                          style={{ backgroundColor: `${template.color}20` }}
                        >
                          <IconComponent className="h-6 w-6" style={{ color: template.color }} />
                        </div>
                        <h3 className="mt-4 font-semibold text-foreground group-hover:text-primary">
                          {template.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                            {template.widgets.length} widgets
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              No templates found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Create Dialog */}
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create from Template</DialogTitle>
              <DialogDescription>
                Customize your dashboard before creating it from the {selectedTemplate?.name} template.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Dashboard Name</Label>
                <Input
                  id="name"
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  placeholder="My Dashboard"
                />
              </div>
              {datasets.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="dataset">Link Dataset (optional)</Label>
                  <select
                    id="dataset"
                    value={selectedDataset}
                    onChange={(e) => setSelectedDataset(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">No dataset linked</option>
                    {datasets.map((ds) => (
                      <option key={ds.id} value={ds.id}>
                        {ds.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {datasets.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No datasets available. You can upload data after creating the dashboard.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFromTemplate} disabled={!dashboardName.trim()}>
                Create Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
