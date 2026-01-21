import { create } from 'zustand';
import { Dashboard, DashboardWidget } from '@/types/dashboard';

interface UndoState {
  past: Dashboard[];
  future: Dashboard[];
  
  // Actions
  pushState: (dashboard: Dashboard) => void;
  undo: (currentDashboard: Dashboard) => Dashboard | null;
  redo: (currentDashboard: Dashboard) => Dashboard | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

const MAX_HISTORY = 50;

export const useUndoStore = create<UndoState>((set, get) => ({
  past: [],
  future: [],

  pushState: (dashboard: Dashboard) => {
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY + 1), JSON.parse(JSON.stringify(dashboard))],
      future: [], // Clear redo stack when new action is performed
    }));
  },

  undo: (currentDashboard: Dashboard) => {
    const { past } = get();
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    set({
      past: newPast,
      future: [JSON.parse(JSON.stringify(currentDashboard)), ...get().future],
    });

    return previous;
  },

  redo: (currentDashboard: Dashboard) => {
    const { future } = get();
    if (future.length === 0) return null;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: [...get().past, JSON.parse(JSON.stringify(currentDashboard))],
      future: newFuture,
    });

    return next;
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
  clear: () => set({ past: [], future: [] }),
}));
