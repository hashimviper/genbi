import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dashboard, DataSet, DashboardWidget } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';

interface DashboardState {
  dashboards: Dashboard[];
  datasets: DataSet[];
  currentDashboard: Dashboard | null;
  currentDataset: DataSet | null;
  
  // Dashboard actions
  createDashboard: (name: string, description?: string) => Dashboard;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => void;
  deleteDashboard: (id: string) => void;
  setCurrentDashboard: (dashboard: Dashboard | null) => void;
  addWidget: (dashboardId: string, widget: Omit<DashboardWidget, 'id'>) => void;
  updateWidget: (dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>) => void;
  removeWidget: (dashboardId: string, widgetId: string) => void;
  
  // Dataset actions
  addDataset: (dataset: Omit<DataSet, 'id' | 'createdAt'>) => DataSet;
  deleteDataset: (id: string) => void;
  setCurrentDataset: (dataset: DataSet | null) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      dashboards: [],
      datasets: [],
      currentDashboard: null,
      currentDataset: null,

      createDashboard: (name, description) => {
        const newDashboard: Dashboard = {
          id: uuidv4(),
          name,
          description,
          widgets: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          dashboards: [...state.dashboards, newDashboard],
          currentDashboard: newDashboard,
        }));
        return newDashboard;
      },

      updateDashboard: (id, updates) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
          ),
          currentDashboard:
            state.currentDashboard?.id === id
              ? { ...state.currentDashboard, ...updates, updatedAt: new Date() }
              : state.currentDashboard,
        }));
      },

      deleteDashboard: (id) => {
        set((state) => ({
          dashboards: state.dashboards.filter((d) => d.id !== id),
          currentDashboard:
            state.currentDashboard?.id === id ? null : state.currentDashboard,
        }));
      },

      setCurrentDashboard: (dashboard) => {
        set({ currentDashboard: dashboard });
      },

      addWidget: (dashboardId, widget) => {
        const newWidget: DashboardWidget = {
          ...widget,
          id: uuidv4(),
        };
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? { ...d, widgets: [...d.widgets, newWidget], updatedAt: new Date() }
              : d
          ),
          currentDashboard:
            state.currentDashboard?.id === dashboardId
              ? {
                  ...state.currentDashboard,
                  widgets: [...state.currentDashboard.widgets, newWidget],
                  updatedAt: new Date(),
                }
              : state.currentDashboard,
        }));
      },

      updateWidget: (dashboardId, widgetId, updates) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? {
                  ...d,
                  widgets: d.widgets.map((w) =>
                    w.id === widgetId ? { ...w, ...updates } : w
                  ),
                  updatedAt: new Date(),
                }
              : d
          ),
          currentDashboard:
            state.currentDashboard?.id === dashboardId
              ? {
                  ...state.currentDashboard,
                  widgets: state.currentDashboard.widgets.map((w) =>
                    w.id === widgetId ? { ...w, ...updates } : w
                  ),
                  updatedAt: new Date(),
                }
              : state.currentDashboard,
        }));
      },

      removeWidget: (dashboardId, widgetId) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? {
                  ...d,
                  widgets: d.widgets.filter((w) => w.id !== widgetId),
                  updatedAt: new Date(),
                }
              : d
          ),
          currentDashboard:
            state.currentDashboard?.id === dashboardId
              ? {
                  ...state.currentDashboard,
                  widgets: state.currentDashboard.widgets.filter(
                    (w) => w.id !== widgetId
                  ),
                  updatedAt: new Date(),
                }
              : state.currentDashboard,
        }));
      },

      addDataset: (dataset) => {
        const newDataset: DataSet = {
          ...dataset,
          id: uuidv4(),
          createdAt: new Date(),
        };
        set((state) => ({
          datasets: [...state.datasets, newDataset],
          currentDataset: newDataset,
        }));
        return newDataset;
      },

      deleteDataset: (id) => {
        set((state) => ({
          datasets: state.datasets.filter((d) => d.id !== id),
          currentDataset:
            state.currentDataset?.id === id ? null : state.currentDataset,
        }));
      },

      setCurrentDataset: (dataset) => {
        set({ currentDataset: dataset });
      },
    }),
    {
      name: 'dashboard-storage',
    }
  )
);
