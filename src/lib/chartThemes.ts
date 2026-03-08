/**
 * Chart-level color themes
 * Each theme provides a coordinated set of colors for charts
 */

export interface ChartColorTheme {
  id: string;
  name: string;
  category: 'light' | 'dark' | 'vibrant' | 'pastel';
  colors: string[];        // series/bar/slice colors
  primaryColor: string;    // main accent
  bgColor: string;         // chart background
  axisColor: string;       // axis lines
  gridColor: string;       // gridlines
  labelColor: string;      // text labels
  titleColor: string;      // title text
}

export const CHART_THEMES: ChartColorTheme[] = [
  // ── Light Themes ──
  {
    id: 'default',
    name: 'Default',
    category: 'light',
    colors: ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'],
    primaryColor: '#6366f1',
    bgColor: '',
    axisColor: '#e2e8f0',
    gridColor: '#e2e8f0',
    labelColor: '#64748b',
    titleColor: '#1e293b',
  },
  {
    id: 'clean-light',
    name: 'Clean Light',
    category: 'light',
    colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8', '#dbeafe'],
    primaryColor: '#3b82f6',
    bgColor: '#ffffff',
    axisColor: '#e2e8f0',
    gridColor: '#f1f5f9',
    labelColor: '#475569',
    titleColor: '#0f172a',
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    category: 'light',
    colors: ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    primaryColor: '#1e40af',
    bgColor: '#f8fafc',
    axisColor: '#cbd5e1',
    gridColor: '#e2e8f0',
    labelColor: '#334155',
    titleColor: '#0f172a',
  },
  {
    id: 'warm-light',
    name: 'Warm Light',
    category: 'light',
    colors: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#d97706', '#fbbf24'],
    primaryColor: '#ea580c',
    bgColor: '#fffbeb',
    axisColor: '#e5e7eb',
    gridColor: '#fef3c7',
    labelColor: '#78350f',
    titleColor: '#451a03',
  },
  {
    id: 'sage-light',
    name: 'Sage',
    category: 'light',
    colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#047857', '#a7f3d0'],
    primaryColor: '#059669',
    bgColor: '#f0fdf4',
    axisColor: '#d1d5db',
    gridColor: '#dcfce7',
    labelColor: '#166534',
    titleColor: '#052e16',
  },

  // ── Dark Themes ──
  {
    id: 'midnight',
    name: 'Midnight',
    category: 'dark',
    colors: ['#38bdf8', '#818cf8', '#a78bfa', '#34d399', '#fbbf24', '#fb923c'],
    primaryColor: '#38bdf8',
    bgColor: '#0f172a',
    axisColor: '#334155',
    gridColor: '#1e293b',
    labelColor: '#94a3b8',
    titleColor: '#e2e8f0',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    category: 'dark',
    colors: ['#60a5fa', '#f472b6', '#a78bfa', '#34d399', '#fbbf24', '#fb7185'],
    primaryColor: '#60a5fa',
    bgColor: '#18181b',
    axisColor: '#3f3f46',
    gridColor: '#27272a',
    labelColor: '#a1a1aa',
    titleColor: '#fafafa',
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    category: 'dark',
    colors: ['#22d3ee', '#06b6d4', '#67e8f9', '#2dd4bf', '#38bdf8', '#a5f3fc'],
    primaryColor: '#22d3ee',
    bgColor: '#0c4a6e',
    axisColor: '#155e75',
    gridColor: '#164e63',
    labelColor: '#7dd3fc',
    titleColor: '#e0f2fe',
  },
  {
    id: 'noir',
    name: 'Noir',
    category: 'dark',
    colors: ['#e2e8f0', '#94a3b8', '#cbd5e1', '#64748b', '#f8fafc', '#475569'],
    primaryColor: '#e2e8f0',
    bgColor: '#09090b',
    axisColor: '#27272a',
    gridColor: '#18181b',
    labelColor: '#71717a',
    titleColor: '#fafafa',
  },

  // ── Vibrant Themes ──
  {
    id: 'rainbow',
    name: 'Rainbow',
    category: 'vibrant',
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
    primaryColor: '#ef4444',
    bgColor: '',
    axisColor: '#d1d5db',
    gridColor: '#e5e7eb',
    labelColor: '#374151',
    titleColor: '#111827',
  },
  {
    id: 'neon',
    name: 'Neon',
    category: 'vibrant',
    colors: ['#f43f5e', '#a855f7', '#06b6d4', '#22c55e', '#eab308', '#ec4899'],
    primaryColor: '#f43f5e',
    bgColor: '#0a0a0a',
    axisColor: '#262626',
    gridColor: '#171717',
    labelColor: '#a3a3a3',
    titleColor: '#fafafa',
  },
  {
    id: 'tropical',
    name: 'Tropical',
    category: 'vibrant',
    colors: ['#0ea5e9', '#f97316', '#14b8a6', '#f43f5e', '#8b5cf6', '#eab308'],
    primaryColor: '#0ea5e9',
    bgColor: '#fefce8',
    axisColor: '#d1d5db',
    gridColor: '#fef9c3',
    labelColor: '#4b5563',
    titleColor: '#1f2937',
  },
  {
    id: 'sunset-fire',
    name: 'Sunset Fire',
    category: 'vibrant',
    colors: ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#f43f5e', '#fb923c'],
    primaryColor: '#dc2626',
    bgColor: '#1c1917',
    axisColor: '#44403c',
    gridColor: '#292524',
    labelColor: '#a8a29e',
    titleColor: '#fafaf9',
  },

  // ── Pastel Themes ──
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    category: 'pastel',
    colors: ['#93c5fd', '#86efac', '#fde68a', '#fca5a5', '#c4b5fd', '#fbcfe8'],
    primaryColor: '#93c5fd',
    bgColor: '#fefce8',
    axisColor: '#e5e7eb',
    gridColor: '#f3f4f6',
    labelColor: '#6b7280',
    titleColor: '#374151',
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    category: 'pastel',
    colors: ['#f9a8d4', '#c4b5fd', '#a5b4fc', '#99f6e4', '#fde68a', '#fda4af'],
    primaryColor: '#f9a8d4',
    bgColor: '#fdf4ff',
    axisColor: '#e5e7eb',
    gridColor: '#fce7f3',
    labelColor: '#6b7280',
    titleColor: '#4a044e',
  },
  {
    id: 'morning-mist',
    name: 'Morning Mist',
    category: 'pastel',
    colors: ['#a5f3fc', '#bae6fd', '#c7d2fe', '#ddd6fe', '#e0f2fe', '#ccfbf1'],
    primaryColor: '#a5f3fc',
    bgColor: '#f0f9ff',
    axisColor: '#e2e8f0',
    gridColor: '#f1f5f9',
    labelColor: '#64748b',
    titleColor: '#0c4a6e',
  },
  {
    id: 'earth-tone',
    name: 'Earth Tones',
    category: 'pastel',
    colors: ['#d6b88c', '#a3b18a', '#588157', '#bc6c25', '#dda15e', '#606c38'],
    primaryColor: '#d6b88c',
    bgColor: '#fefdf5',
    axisColor: '#d6d3d1',
    gridColor: '#e7e5e4',
    labelColor: '#57534e',
    titleColor: '#292524',
  },
];

export function getChartThemeById(id: string): ChartColorTheme {
  return CHART_THEMES.find(t => t.id === id) || CHART_THEMES[0];
}

export function getThemesByCategory(category: ChartColorTheme['category']): ChartColorTheme[] {
  return CHART_THEMES.filter(t => t.category === category);
}

export const THEME_CATEGORIES: { id: ChartColorTheme['category']; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'vibrant', label: 'Vibrant' },
  { id: 'pastel', label: 'Pastel' },
];
