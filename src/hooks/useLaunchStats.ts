import { useState, useEffect, useRef } from 'react';
import { LaunchStats } from '@/lib/types';
import { launchService } from '@/lib/api/spacex';

// Caché para estadísticas
const statsCache = new Map<string, { data: LaunchStats; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos para estadísticas

export function useLaunchStats() {
  const [stats, setStats] = useState<LaunchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verificar caché
        const cacheKey = 'launch-stats';
        const cached = statsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setStats(cached.data);
          setLoading(false);
          return;
        }

        // Obtener estadísticas de la API
        const statsData = await launchService.statisticsLaunches();
        setStats(statsData);
        
        // Guardar en caché
        statsCache.set(cacheKey, { data: statsData, timestamp: Date.now() });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error obteniendo estadísticas');
        console.error('Error fetching launch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refetch = async () => {
    hasFetched.current = false;
    statsCache.delete('launch-stats');
    await fetchStats();
  };

  return { stats, loading, error, refetch };
}
