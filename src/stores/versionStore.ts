import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dashboard } from '@/types/dashboard';

export interface DashboardSnapshot {
  id: string;
  dashboardId: string;
  name: string;
  snapshot: Dashboard;
  createdAt: string;
}

interface VersionState {
  snapshots: DashboardSnapshot[];
  saveSnapshot: (dashboard: Dashboard, name: string) => void;
  restoreSnapshot: (snapshotId: string) => Dashboard | null;
  deleteSnapshot: (snapshotId: string) => void;
  getSnapshotsForDashboard: (dashboardId: string) => DashboardSnapshot[];
}

export const useVersionStore = create<VersionState>()(
  persist(
    (set, get) => ({
      snapshots: [],

      saveSnapshot: (dashboard, name) => {
        const snapshot: DashboardSnapshot = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2),
          dashboardId: dashboard.id,
          name,
          snapshot: JSON.parse(JSON.stringify(dashboard)),
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          snapshots: [...state.snapshots, snapshot].slice(-50), // max 50 snapshots
        }));
      },

      restoreSnapshot: (snapshotId) => {
        const snap = get().snapshots.find(s => s.id === snapshotId);
        return snap ? JSON.parse(JSON.stringify(snap.snapshot)) : null;
      },

      deleteSnapshot: (snapshotId) => {
        set(state => ({
          snapshots: state.snapshots.filter(s => s.id !== snapshotId),
        }));
      },

      getSnapshotsForDashboard: (dashboardId) => {
        return get().snapshots.filter(s => s.dashboardId === dashboardId);
      },
    }),
    { name: 'visorybi-versions' }
  )
);
