import React, { useState, useEffect } from 'react';
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
  Sparkles,
  ArrowRight,
  Database,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { dashboardTemplates } from '@/data/templates';
// Sample data is now embedded directly in templates
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

const categoryColors: Record<string, string> = {
  'Human Resources': 'badge-primary',
  'Digital Marketing': 'badge-info',
  'Sales': 'badge-success',
  'Healthcare': 'badge-accent',
  'Manufacturing': 'badge-warning',
  'Global': 'badge-info',
  'Environment': 'badge-success',
  'General': 'badge-primary',
  'Finance': 'badge-success',
  'E-commerce': 'badge-warning',
  'Project Management': 'badge-info',
};

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { createDashboard, addWidget, datasets, addDataset } = useDashboardStore();
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const [dashboardName, setDashboardName] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [useSampleData, setUseSampleData] = useState(true);

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
    // Check if this template has embedded sample data
    const hasSampleData = template.sampleData && template.sampleData.length > 0;
    setUseSampleData(hasSampleData);
    setSelectedDataset(datasets[0]?.id || '');
  };

  const handleCreateFromTemplate = () => {
    if (!selectedTemplate || !dashboardName.trim()) return;

    let datasetId = selectedDataset;

    // If using sample data from template, create the dataset
    if (useSampleData && selectedTemplate.sampleData && selectedTemplate.sampleColumns) {
      const newDataset = addDataset({
        name: `${selectedTemplate.name} Sample Data`,
        columns: selectedTemplate.sampleColumns,
        data: selectedTemplate.sampleData,
      });
      datasetId = newDataset.id;
    }

    const dashboard = createDashboard(dashboardName.trim(), selectedTemplate.description);

    // Add widgets from template with the dataset linked
    selectedTemplate.widgets.forEach((widget) => {
      const newWidget = {
        ...widget,
        config: {
          ...widget.config,
          id: uuidv4(),
          datasetId: datasetId || '',
        },
      };
      addWidget(dashboard.id, newWidget);
    });

    toast({
      title: 'Dashboard created!',
      description: `${dashboardName} is ready with ${useSampleData ? 'sample data' : 'your data'}.`,
    });

    setSelectedTemplate(null);
    navigate(`/builder?id=${dashboard.id}`);
  };

  return (
    <MainLayout>
      <div className="flex h-full flex-col p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Templates</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Choose a pre-built template to get started quickly with professional dashboards
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-background border-2 focus:border-primary transition-colors"
          />
        </div>

        {/* Templates by Category */}
        <div className="flex-1 space-y-10 overflow-auto">
          {categories.map((category) => {
            const categoryTemplates = filteredTemplates.filter((t) => t.category === category);
            if (categoryTemplates.length === 0) return null;

            return (
              <section key={category} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-xl font-bold text-foreground">{category}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category] || 'badge-primary'}`}>
                    {categoryTemplates.length} templates
                  </span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryTemplates.map((template, index) => {
                    const IconComponent = iconMap[template.icon] || FileBarChart;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className="glass-card-hover group rounded-xl overflow-hidden text-left animate-fade-in"
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        {/* Gradient Header */}
                        <div 
                          className="h-24 relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${template.color}, ${template.color}dd)` }}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
                          <div className="absolute bottom-4 left-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                              <ArrowRight className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {template.name}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {template.description}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                              {template.widgets.length} widgets
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="flex h-60 flex-col items-center justify-center text-center">
              <Search className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">No templates found</p>
              <p className="text-sm text-muted-foreground">Try searching for something else</p>
            </div>
          )}
        </div>

        {/* Create Dialog */}
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>
                Create from {selectedTemplate?.name}
              </DialogTitle>
              <DialogDescription>
                Customize your dashboard before creating it
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
                  className="bg-background"
                />
              </div>
              
              {/* Sample Data Toggle */}
              {selectedTemplate && selectedTemplate.sampleData && selectedTemplate.sampleData.length > 0 && (
                <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-4 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">Sample Data Available</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    This template includes pre-built sample data so you can see the charts in action immediately.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useSampleData}
                      onChange={(e) => setUseSampleData(e.target.checked)}
                      className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">Use sample data</span>
                  </label>
                </div>
              )}

              {!useSampleData && datasets.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="dataset">Link Your Dataset</Label>
                  <select
                    id="dataset"
                    value={selectedDataset}
                    onChange={(e) => setSelectedDataset(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              {!useSampleData && datasets.length === 0 && (
                <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                  <p className="font-medium">No datasets available</p>
                  <p className="mt-1">You can upload data after creating the dashboard.</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateFromTemplate} 
                disabled={!dashboardName.trim()} 
                className="gap-2 gradient-bg hover:opacity-90"
              >
                Create Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
