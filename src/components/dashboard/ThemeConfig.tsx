import { useState, useRef } from 'react';
import { Palette, Upload, X, Check, Image, Paintbrush } from 'lucide-react';
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
import { cn } from '@/lib/utils';

export interface DashboardTheme {
  bgType: 'solid' | 'gradient' | 'image';
  bgColor: string;
  bgGradient: string;
  bgImageUrl?: string;
  cardOpacity: number;
  themeName: string;
}

const DEFAULT_THEME: DashboardTheme = {
  bgType: 'solid',
  bgColor: '',
  bgGradient: '',
  bgImageUrl: undefined,
  cardOpacity: 100,
  themeName: 'default',
};

const PRESET_THEMES: { name: string; label: string; bgType: DashboardTheme['bgType']; bgColor: string; bgGradient: string; preview: string }[] = [
  { name: 'default', label: 'Default', bgType: 'solid', bgColor: '', bgGradient: '', preview: 'bg-background' },
  { name: 'midnight', label: 'Midnight Blue', bgType: 'gradient', bgColor: '', bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', preview: 'bg-gradient-to-br from-slate-900 to-slate-800' },
  { name: 'ocean', label: 'Ocean Depth', bgType: 'gradient', bgColor: '', bgGradient: 'linear-gradient(135deg, #0c4a6e 0%, #164e63 50%, #134e4a 100%)', preview: 'bg-gradient-to-br from-sky-900 to-teal-900' },
  { name: 'corporate', label: 'Corporate', bgType: 'solid', bgColor: '#f8fafc', bgGradient: '', preview: 'bg-slate-50' },
  { name: 'charcoal', label: 'Charcoal', bgType: 'solid', bgColor: '#1c1c1e', bgGradient: '', preview: 'bg-zinc-900' },
  { name: 'aurora', label: 'Aurora', bgType: 'gradient', bgColor: '', bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)', preview: 'bg-gradient-to-br from-indigo-950 to-blue-900' },
  { name: 'sunset', label: 'Sunset Warm', bgType: 'gradient', bgColor: '', bgGradient: 'linear-gradient(135deg, #1a0000 0%, #2d1b00 50%, #1a0a00 100%)', preview: 'bg-gradient-to-br from-red-950 to-amber-950' },
  { name: 'forest', label: 'Forest', bgType: 'gradient', bgColor: '', bgGradient: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #022c22 100%)', preview: 'bg-gradient-to-br from-green-950 to-emerald-950' },
  { name: 'lavender', label: 'Lavender', bgType: 'gradient', bgColor: '', bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', preview: 'bg-gradient-to-br from-indigo-950 to-indigo-900' },
  { name: 'clean-white', label: 'Clean White', bgType: 'solid', bgColor: '#ffffff', bgGradient: '', preview: 'bg-white' },
  { name: 'slate', label: 'Warm Slate', bgType: 'solid', bgColor: '#1e1e2e', bgGradient: '', preview: 'bg-[#1e1e2e]' },
  { name: 'executive', label: 'Executive Dark', bgType: 'gradient', bgColor: '', bgGradient: 'linear-gradient(180deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)', preview: 'bg-gradient-to-b from-neutral-950 to-neutral-900' },
];

const SOLID_COLORS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
  '#0f172a', '#1e293b', '#334155', '#1c1c1e',
  '#0c4a6e', '#164e63', '#1e3a5f', '#0d1b2a',
  '#14532d', '#052e16', '#1a1a2e', '#2d1b00',
];

interface ThemeConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: DashboardTheme;
  onSave: (theme: DashboardTheme) => void;
}

export function ThemeConfigDialog({ open, onOpenChange, theme, onSave }: ThemeConfigDialogProps) {
  const [current, setCurrent] = useState<DashboardTheme>(theme);
  const [tab, setTab] = useState<'presets' | 'solid' | 'gradient' | 'image'>('presets');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetSelect = (preset: typeof PRESET_THEMES[0]) => {
    setCurrent({
      ...current,
      bgType: preset.bgType,
      bgColor: preset.bgColor,
      bgGradient: preset.bgGradient,
      bgImageUrl: undefined,
      themeName: preset.name,
    });
  };

  const handleColorSelect = (color: string) => {
    setCurrent({ ...current, bgType: 'solid', bgColor: color, bgGradient: '', bgImageUrl: undefined, themeName: 'custom' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCurrent({ ...current, bgType: 'image', bgImageUrl: ev.target?.result as string, themeName: 'custom-image' });
    };
    reader.readAsDataURL(file);
  };

  const handleOpenChange = (o: boolean) => {
    if (o) setCurrent(theme);
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Dashboard Theme
          </DialogTitle>
          <DialogDescription>
            Choose a background style for your dashboard canvas.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {[
            { key: 'presets' as const, label: 'Presets', icon: Paintbrush },
            { key: 'solid' as const, label: 'Solid', icon: Palette },
            { key: 'image' as const, label: 'Image', icon: Image },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                tab === key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4 py-2">
          {tab === 'presets' && (
            <div className="grid grid-cols-3 gap-2">
              {PRESET_THEMES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    'rounded-xl border-2 p-1 transition-all hover:shadow-md',
                    current.themeName === preset.name ? 'border-primary ring-2 ring-primary/20' : 'border-border/50 hover:border-primary/30'
                  )}
                >
                  <div className={cn('rounded-lg h-12 w-full', preset.preview)} />
                  <p className="text-[10px] font-medium text-foreground mt-1 text-center">{preset.label}</p>
                  {current.themeName === preset.name && (
                    <div className="flex justify-center mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {tab === 'solid' && (
            <div className="space-y-3">
              <Label>Select a color</Label>
              <div className="grid grid-cols-8 gap-2">
                {SOLID_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={cn(
                      'h-8 w-8 rounded-lg border-2 transition-all hover:scale-110',
                      current.bgColor === color && current.bgType === 'solid' ? 'border-primary ring-2 ring-primary/30' : 'border-border/50'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Label className="text-xs shrink-0">Custom:</Label>
                <Input
                  type="color"
                  value={current.bgColor || '#ffffff'}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="h-8 w-12 p-0.5 cursor-pointer"
                />
                <Input
                  value={current.bgColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  placeholder="#hex"
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>
          )}

          {tab === 'image' && (
            <div className="space-y-3">
              <Label>Upload a background image or company logo</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 overflow-hidden">
                  {current.bgImageUrl ? (
                    <img src={current.bgImageUrl} alt="Background" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Image className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-[10px] text-muted-foreground mt-1">No image selected</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" /> Upload Image
                </Button>
                {current.bgImageUrl && (
                  <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={() => setCurrent({ ...current, bgType: 'solid', bgImageUrl: undefined, themeName: 'default' })}>
                    <X className="h-3.5 w-3.5" /> Remove
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">PNG, JPG, or WEBP. Max 5MB. Will cover the full dashboard canvas.</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          )}

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-xs">Preview</Label>
            <div
              className="h-20 rounded-xl border border-border overflow-hidden flex items-center justify-center"
              style={getThemeStyle(current)}
            >
              <p className="text-xs font-medium" style={{ color: isLightBg(current) ? '#1e293b' : '#e2e8f0' }}>
                Dashboard Preview
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onSave(current); onOpenChange(false); }} className="gap-2">
            <Check className="h-4 w-4" /> Apply Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function getThemeStyle(theme: DashboardTheme): React.CSSProperties {
  if (!theme || theme.themeName === 'default') return {};
  
  switch (theme.bgType) {
    case 'solid':
      return theme.bgColor ? { backgroundColor: theme.bgColor } : {};
    case 'gradient':
      return theme.bgGradient ? { background: theme.bgGradient } : {};
    case 'image':
      return theme.bgImageUrl
        ? { backgroundImage: `url(${theme.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};
    default:
      return {};
  }
}

export function isLightBg(theme: DashboardTheme): boolean {
  if (theme.bgType === 'solid' && theme.bgColor) {
    const hex = theme.bgColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 128;
    }
  }
  if (theme.themeName === 'corporate' || theme.themeName === 'clean-white') return true;
  return false;
}
