import { useEffect, useCallback, useState } from 'react';
import { useAppStore, useSetLaunches, useSetLoading, useSetError, useSetStats, useSetSelectedLaunch } from '@/store/useAppStore';
import { launchService, handleApiError } from '@/lib/api/spacex';
import { LaunchFilters, Launch } from '@/lib/types';

export function useLaunches() {
  const { launches, loading, error, filters } = useAppStore();
  const setLaunches = useSetLaunches();
  const setLoading = useSetLoading();
  const setError = useSetError();
  const setStats = useSetStats();

  // Cargar lanzamientos
  const loadLaunches = useCallback(async (customFilters?: LaunchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const currentFilters = customFilters || filters;
      const [launchesData, statsData] = await Promise.all([
        launchService.getAllLaunches(currentFilters),
        launchService.statisticsLaunches(),
      ]);

      setLaunches(launchesData);
      setStats(statsData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error loading launches:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, setLaunches, setLoading, setError, setStats]);

  // Cargar lanzamientos al montar el componente
  useEffect(() => {
    loadLaunches();
  }, [loadLaunches]);

  // Recargar cuando cambien los filtros
  useEffect(() => {
    loadLaunches();
  }, [filters, loadLaunches]);

  return {
    launches,
    loading,
    error,
    filters,
    loadLaunches,
  };
}

export function useLaunchById(id: string) {
  const { selectedLaunch } = useAppStore();
  const setSelectedLaunch = useSetSelectedLaunch();
  const setLoading = useSetLoading();
  const setError = useSetError();

  const loadLaunch = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const launch = await launchService.getLaunchById(id);
      setSelectedLaunch(launch);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error loading launch:', err);
    } finally {
      setLoading(false);
    }
  }, [id, setLoading, setError, setSelectedLaunch]);

  useEffect(() => {
    loadLaunch();
  }, [loadLaunch]);

  return {
    launch: selectedLaunch,
    loading: false,
    error: null,
    loadLaunch,
  };
}

export function useUpcomingLaunches(limit: number = 10) {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUpcomingLaunches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await launchService.getUpcomingLaunches(limit);
      setLaunches(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error loading upcoming launches:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadUpcomingLaunches();
  }, [loadUpcomingLaunches]);

  return {
    launches,
    loading,
    error,
    loadUpcomingLaunches,
  };
}

export function useLaunchStats() {
  const { stats } = useAppStore();
  const setStats = useSetStats();
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoadingState(true);
    setErrorState(null);

    try {
      const data = await launchService.statisticsLaunches();
      setStats(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setErrorState(errorMessage);
      console.error('Error loading stats:', err);
    } finally {
      setLoadingState(false);
    }
  }, [setStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    loadStats,
  };
}
