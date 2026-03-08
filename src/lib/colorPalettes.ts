/**
 * Dashboard Color Palette System
 * Pre-built palettes for charts
 */

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  bg: string;
  text: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'corporate',
    name: 'Corporate',
    colors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#1e40af'],
    bg: '#f8fafc',
    text: '#1e293b',
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
    bg: '#ffffff',
    text: '#111827',
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: ['#93c5fd', '#86efac', '#fde68a', '#fca5a5', '#c4b5fd', '#fbcfe8'],
    bg: '#fefce8',
    text: '#374151',
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c'],
    bg: '#0f172a',
    text: '#e2e8f0',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#0284c7', '#0891b2'],
    bg: '#f0f9ff',
    text: '#0c4a6e',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#f43f5e', '#fb7185', '#f97316', '#fbbf24', '#a855f6', '#ec4899'],
    bg: '#fffbeb',
    text: '#7c2d12',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    colors: ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'],
    bg: '#ffffff',
    text: '#111827',
  },
  {
    id: 'nature',
    name: 'Nature',
    colors: ['#166534', '#15803d', '#22c55e', '#86efac', '#365314', '#4ade80'],
    bg: '#f0fdf4',
    text: '#14532d',
  },
];

export function getPaletteById(id: string): ColorPalette {
  return COLOR_PALETTES.find(p => p.id === id) || COLOR_PALETTES[0];
}

export function getPaletteColor(palette: ColorPalette, index: number): string {
  return palette.colors[index % palette.colors.length];
}
