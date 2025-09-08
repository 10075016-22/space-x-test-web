import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Launch, LaunchFilters, LaunchStats, AppState } from '@/lib/types';

interface AppStore extends AppState {
  // Actions
  setLaunches: (launches: Launch[]) => void;
  addLaunch: (launch: Launch) => void;
  updateLaunch: (id: string, launch: Partial<Launch>) => void;
  removeLaunch: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<LaunchFilters>) => void;
  resetFilters: () => void;
  setStats: (stats: LaunchStats) => void;
  setSelectedLaunch: (launch: Launch | null) => void;
  
  // Computed values
  getFilteredLaunches: () => Launch[];
  getLaunchById: (id: string) => Launch | undefined;
  getUpcomingLaunches: () => Launch[];
  getSuccessfulLaunches: () => Launch[];
  getFailedLaunches: () => Launch[];
}

const defaultFilters: LaunchFilters = {
  search: '',
  success: undefined,
  upcoming: undefined,
  dateFrom: '',
  dateTo: '',
  rocket: '',
  launchpad: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      launches: [],
      loading: false,
      error: null,
      filters: defaultFilters,
      stats: null,
      selectedLaunch: null,

      // Actions
      setLaunches: (launches) => set({ launches }, false, 'setLaunches'),
      
      addLaunch: (launch) => 
        set((state) => ({ 
          launches: [launch, ...state.launches] 
        }), false, 'addLaunch'),
      
      updateLaunch: (id, updatedLaunch) =>
        set((state) => ({
          launches: state.launches.map(launch =>
            launch.id === id ? { ...launch, ...updatedLaunch } : launch
          )
        }), false, 'updateLaunch'),
      
      removeLaunch: (id) =>
        set((state) => ({
          launches: state.launches.filter(launch => launch.id !== id)
        }), false, 'removeLaunch'),
      
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      
      setError: (error) => set({ error }, false, 'setError'),
      
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }), false, 'setFilters'),
      
      resetFilters: () => set({ filters: defaultFilters }, false, 'resetFilters'),
      
      setStats: (stats) => set({ stats }, false, 'setStats'),
      
      setSelectedLaunch: (launch) => set({ selectedLaunch: launch }, false, 'setSelectedLaunch'),

      // Computed values
      getFilteredLaunches: () => {
        const { launches, filters } = get();
        
        let filtered = [...launches];

        // Filter by search
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(launch =>
            launch.name.toLowerCase().includes(searchLower) ||
            launch.rocket.name.toLowerCase().includes(searchLower) ||
            launch.launchpad.name.toLowerCase().includes(searchLower) ||
            (launch.details && launch.details.toLowerCase().includes(searchLower))
          );
        }

        // Filter by success status
        if (filters.success !== undefined) {
          filtered = filtered.filter(launch => launch.success === filters.success);
        }

        // Filter by upcoming status
        if (filters.upcoming !== undefined) {
          filtered = filtered.filter(launch => launch.upcoming === filters.upcoming);
        }

        // Filter by date range
        if (filters.dateFrom) {
          filtered = filtered.filter(launch => 
            new Date(launch.date_utc) >= new Date(filters.dateFrom!)
          );
        }

        if (filters.dateTo) {
          filtered = filtered.filter(launch => 
            new Date(launch.date_utc) <= new Date(filters.dateTo!)
          );
        }

        // Filter by rocket
        if (filters.rocket) {
          filtered = filtered.filter(launch => 
            launch.rocket.id === filters.rocket
          );
        }

        // Filter by launchpad
        if (filters.launchpad) {
          filtered = filtered.filter(launch => 
            launch.launchpad.id === filters.launchpad
          );
        }

        // Sort
        filtered.sort((a, b) => {
          let aValue: number | string | Date;
          let bValue: number | string | Date;
          
          switch (filters.sortBy) {
            case 'name':
              aValue = a.name;
              bValue = b.name;
              break;
            case 'flight_number':
              aValue = a.flight_number;
              bValue = b.flight_number;
              break;
            case 'date':
            default:
              aValue = new Date(a.date_utc);
              bValue = new Date(b.date_utc);
              break;
          }

          if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getLaunchById: (id) => {
        const { launches } = get();
        return launches.find(launch => launch.id === id);
      },

      getUpcomingLaunches: () => {
        const { launches } = get();
        return launches.filter(launch => launch.upcoming);
      },

      getSuccessfulLaunches: () => {
        const { launches } = get();
        return launches.filter(launch => launch.success === true);
      },

      getFailedLaunches: () => {
        const { launches } = get();
        return launches.filter(launch => launch.success === false);
      },
    }),
    {
      name: 'spacex-app-store',
    }
  )
);

// Selectors para optimizar re-renders
export const useLaunches = () => useAppStore(state => state.launches);
export const useLoading = () => useAppStore(state => state.loading);
export const useError = () => useAppStore(state => state.error);
export const useFilters = () => useAppStore(state => state.filters);
export const useStats = () => useAppStore(state => state.stats);
export const useSelectedLaunch = () => useAppStore(state => state.selectedLaunch);

export const useFilteredLaunches = () => useAppStore(state => state.getFilteredLaunches());
export const useUpcomingLaunches = () => useAppStore(state => state.getUpcomingLaunches());
export const useSuccessfulLaunches = () => useAppStore(state => state.getSuccessfulLaunches());
export const useFailedLaunches = () => useAppStore(state => state.getFailedLaunches());

// Action selectors - usando selectores individuales para evitar bucle infinito
export const useSetLaunches = () => useAppStore(state => state.setLaunches);
export const useAddLaunch = () => useAppStore(state => state.addLaunch);
export const useUpdateLaunch = () => useAppStore(state => state.updateLaunch);
export const useRemoveLaunch = () => useAppStore(state => state.removeLaunch);
export const useSetLoading = () => useAppStore(state => state.setLoading);
export const useSetError = () => useAppStore(state => state.setError);
export const useSetFilters = () => useAppStore(state => state.setFilters);
export const useResetFilters = () => useAppStore(state => state.resetFilters);
export const useSetStats = () => useAppStore(state => state.setStats);
export const useSetSelectedLaunch = () => useAppStore(state => state.setSelectedLaunch);
