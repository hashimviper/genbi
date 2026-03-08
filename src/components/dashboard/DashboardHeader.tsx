import { useState, useRef } from 'react';
import { Building2, Settings2, Upload, X } from 'lucide-react';
import { VisoryBILogo } from '@/components/VisoryBILogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { DashboardBranding } from '@/types/dashboard';

interface DashboardHeaderProps {
  branding?: DashboardBranding;
  onBrandingChange: (branding: DashboardBranding) => void;
  editable?: boolean;
}

const DEFAULT_BRANDING: DashboardBranding = {
  companyName: 'VisoryBI',
  dashboardTitle: '',
  logoUrl: undefined,
};

export function DashboardHeader({ branding, onBrandingChange, editable = true }: DashboardHeaderProps) {
  const [configOpen, setConfigOpen] = useState(false);
  const current = branding || DEFAULT_BRANDING;

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/50 min-w-0 gap-2">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-sm border border-border/30 bg-background">
            {current.logoUrl ? (
              <img src={current.logoUrl} alt={current.companyName} className="h-full w-full object-contain" />
            ) : (
              <VisoryBILogo size={40} />
            )}
          </div>
          {/* Company + Title */}
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{current.companyName}</p>
            {current.dashboardTitle && (
              <p className="text-xs text-muted-foreground truncate">{current.dashboardTitle}</p>
            )}
          </div>
        </div>

        {editable && (
          <Button variant="ghost" size="sm" onClick={() => setConfigOpen(true)} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Settings2 className="h-4 w-4" /> Branding
          </Button>
        )}
      </div>

      {editable && (
        <BrandingConfigDialog
          open={configOpen}
          onOpenChange={setConfigOpen}
          branding={current}
          onSave={(b) => { onBrandingChange(b); setConfigOpen(false); }}
        />
      )}
    </>
  );
}

interface BrandingConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branding: DashboardBranding;
  onSave: (branding: DashboardBranding) => void;
}

function BrandingConfigDialog({ open, onOpenChange, branding, onSave }: BrandingConfigDialogProps) {
  const [companyName, setCompanyName] = useState(branding.companyName);
  const [dashboardTitle, setDashboardTitle] = useState(branding.dashboardTitle);
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({
      companyName: companyName.trim() || 'VisoryBI',
      dashboardTitle: dashboardTitle.trim(),
      logoUrl: logoUrl || undefined,
    });
  };

  // Sync when dialog opens
  const handleOpenChange = (o: boolean) => {
    if (o) {
      setCompanyName(branding.companyName);
      setDashboardTitle(branding.dashboardTitle);
      setLogoUrl(branding.logoUrl || '');
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Dashboard Branding
          </DialogTitle>
          <DialogDescription>
            Customize the company name, title, and logo displayed on this dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 overflow-hidden shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Logo
                </Button>
                {logoUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-destructive hover:text-destructive"
                    onClick={() => setLogoUrl('')}
                  >
                    <X className="h-3.5 w-3.5" /> Remove
                  </Button>
                )}
                <p className="text-[10px] text-muted-foreground">PNG, JPG or SVG. Max 2MB.</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. VisoryBI"
              className="bg-background"
            />
          </div>

          {/* Dashboard Title */}
          <div className="space-y-2">
            <Label htmlFor="dashboard-title">Dashboard Title</Label>
            <Input
              id="dashboard-title"
              value={dashboardTitle}
              onChange={(e) => setDashboardTitle(e.target.value)}
              placeholder="e.g. Q1 Sales Report"
              className="bg-background"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="gap-2">
            Save Branding
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
