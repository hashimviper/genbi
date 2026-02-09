import { create } from 'zustand';
import { DrillState, DrillAction, DrillHierarchy, processDrillAction, createDrillState } from '@/lib/drillDown';

interface DrillStoreState {
  // Map of widgetId -> DrillState
  drillStates: Record<string, DrillState>;
  
  // Cross-filter: global filters applied by drill actions across widgets
  crossFilters: Record<string, unknown>;
  
  // Actions
  initDrill: (widgetId: string, hierarchy: DrillHierarchy) => void;
  drillDown: (widgetId: string, value: unknown) => void;
  drillUp: (widgetId: string) => void;
  resetDrill: (widgetId: string) => void;
  resetAll: () => void;
  setCrossFilter: (field: string, value: unknown) => void;
  clearCrossFilter: (field: string) => void;
  clearAllCrossFilters: () => void;
  getDrillState: (widgetId: string) => DrillState | null;
}

export const useDrillStore = create<DrillStoreState>((set, get) => ({
  drillStates: {},
  crossFilters: {},

  initDrill: (widgetId, hierarchy) => {
    set(state => ({
      drillStates: {
        ...state.drillStates,
        [widgetId]: createDrillState(hierarchy),
      },
    }));
  },

  drillDown: (widgetId, value) => {
    const current = get().drillStates[widgetId];
    if (!current) return;
    
    const action: DrillAction = { type: 'drill-down', value };
    const newState = processDrillAction(current, action);
    
    // Set cross-filter when drilling down
    const drilledField = current.hierarchy[current.currentLevel];
    
    set(state => ({
      drillStates: {
        ...state.drillStates,
        [widgetId]: newState,
      },
      crossFilters: {
        ...state.crossFilters,
        [drilledField]: value,
      },
    }));
  },

  drillUp: (widgetId) => {
    const current = get().drillStates[widgetId];
    if (!current) return;
    
    // Remove cross-filter for the level we're leaving
    const fieldToRemove = current.hierarchy[current.currentLevel - 1];
    
    const action: DrillAction = { type: 'drill-up' };
    const newState = processDrillAction(current, action);
    
    set(state => {
      const newCrossFilters = { ...state.crossFilters };
      if (fieldToRemove) delete newCrossFilters[fieldToRemove];
      
      return {
        drillStates: {
          ...state.drillStates,
          [widgetId]: newState,
        },
        crossFilters: newCrossFilters,
      };
    });
  },

  resetDrill: (widgetId) => {
    const current = get().drillStates[widgetId];
    if (!current) return;
    
    const action: DrillAction = { type: 'reset' };
    const newState = processDrillAction(current, action);
    
    set(state => ({
      drillStates: {
        ...state.drillStates,
        [widgetId]: newState,
      },
    }));
  },

  resetAll: () => {
    set({ drillStates: {}, crossFilters: {} });
  },

  setCrossFilter: (field, value) => {
    set(state => ({
      crossFilters: { ...state.crossFilters, [field]: value },
    }));
  },

  clearCrossFilter: (field) => {
    set(state => {
      const newFilters = { ...state.crossFilters };
      delete newFilters[field];
      return { crossFilters: newFilters };
    });
  },

  clearAllCrossFilters: () => {
    set({ crossFilters: {} });
  },

  getDrillState: (widgetId) => {
    return get().drillStates[widgetId] || null;
  },
}));
