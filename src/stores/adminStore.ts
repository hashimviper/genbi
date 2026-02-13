import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  enable3DCharts: boolean;
  toggle3DCharts: (enabled: boolean) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      enable3DCharts: false,
      toggle3DCharts: (enabled) => set({ enable3DCharts: enabled }),
    }),
    { name: 'admin-settings' }
  )
);
