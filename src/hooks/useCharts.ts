import { useState, useEffect, useCallback, useRef } from 'react';
import { ChartData } from '@/lib/types';
import { chartsService } from '@/lib/api/charts';

// Sistema de caché simple
const cache = new Map<string, { data: ChartData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Hook simple para cualquier gráfica con caché
export function useChart(
  apiCall: () => Promise<ChartData>,
  cacheKey: string,
  mockData?: ChartData
) {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchData = useCallback(async () => {
    // Verificar caché primero
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Intentar obtener datos reales de la API
      const result = await apiCall();
      setData(result);
      
      // Guardar en caché
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
    } catch (err) {
      // Si falla la API, mostrar error
      setError(err instanceof Error ? err.message : 'Error obteniendo datos de la API');
      if (mockData) {
        setData(mockData);
        console.warn('API no disponible, usando datos de ejemplo:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, cacheKey, mockData]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hooks específicos para cada gráfica
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Funciones estables para evitar recreaciones
const fetchSuccessRate = async (): Promise<ChartData> => {
  const response = await fetch(`${API_URL}/success-rate`);
  const rawData = await response.json();
  
  return {
    labels: rawData.labels,
    datasets: [{
      label: 'Distribución de Lanzamientos',
      data: rawData.statistics,
      backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
      borderColor: ['#059669', '#DC2626', '#D97706'],
      borderWidth: 2,
    }]
  };
};

const fetchLaunchesByYear = async (): Promise<ChartData> => {
  const response = await fetch(`${API_URL}/launches-by-year`);
  const rawData = await response.json();
  
  return {
    labels: rawData.labels,
    datasets: [{
      label: 'Lanzamientos por Año',
      data: rawData.statistics,
      backgroundColor: "#3B82F6",
      borderColor: "#2563EB",
      fill: true,
      tension: 0.4
    }]
  };
};

const fetchRocketUsage = async (): Promise<ChartData> => {
  const response = await fetch(`${API_URL}/rocket-usage`);
  const rawData = await response.json();
  
  return {
    labels: rawData.labels,
    datasets: [{
      data: rawData.statistics,
      backgroundColor: ["#3B82F6", "#8B5CF6", "#06B6D4"],
      borderColor: ["#2563EB","#7C3AED","#0891B2"],
      fill: true,
      tension: 0.4
    }]
  };
};

export function useSuccessRate() {
  return useChart(fetchSuccessRate, 'success-rate');
}

export function useLaunchesByYear() {
  return useChart(fetchLaunchesByYear, 'launches-by-year');
}

export function useRocketUsage() {
  return useChart(fetchRocketUsage, 'rocket-usage');
}

// Hook inteligente que carga todas las gráficas automáticamente con caché
export function useAllCharts() {
  const [data, setData] = useState<Record<string, ChartData | null> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAllCharts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verificar si ya tenemos datos en caché
        const cacheKey = 'all-charts';
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setData(cached.data as Record<string, ChartData | null>);
          setLoading(false);
          return;
        }

        // Cargar todas las gráficas en paralelo
        const [
          monthlyLaunches, successRate, rocketUsage,
        ] = await Promise.allSettled([
          chartsService.getMonthlyLaunches(),
          chartsService.getSuccessRate(),
          chartsService.getRocketUsage()
        ]);

        // Procesar resultados y usar fallbacks
        const result = {
          monthlyLaunches: monthlyLaunches.status === 'fulfilled' ? monthlyLaunches.value : null,
          successRate: successRate.status === 'fulfilled' ? successRate.value : null,
          rocketUsage: rocketUsage.status === 'fulfilled' ? rocketUsage.value : null,
        };

        setData(result);

        // Guardar en caché
        cache.set(cacheKey, { data: result, timestamp: Date.now() });

        // Verificar si hubo errores
        const errors = [
          monthlyLaunches, successRate, rocketUsage,
        ].filter(result => result.status === 'rejected');

        if (errors.length > 0) {
          setError(`${errors.length} gráficas no pudieron cargar datos reales, usando datos de ejemplo`);
        }
      } catch {
        setError('Error cargando datos de gráficas');
      } finally {
        setLoading(false);
      }
    };

    fetchAllCharts();
  }, []);

  return { data, loading, error };
}

// Hook optimizado para el dashboard que carga todo de una vez
export function useDashboardCharts() {
  const [data, setData] = useState<{
    successRate: ChartData | null;
    launchesByYear: ChartData | null;
    rocketUsage: ChartData | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verificar caché
        const cacheKey = 'dashboard-charts';
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setData(cached.data as typeof data);
          setLoading(false);
          return;
        }

        // Cargar todas las gráficas en paralelo
        const [successRate, launchesByYear, rocketUsage] = await Promise.allSettled([
          fetchSuccessRate(),
          fetchLaunchesByYear(),
          fetchRocketUsage()
        ]);

        const result = {
          successRate: successRate.status === 'fulfilled' ? successRate.value : null,
          launchesByYear: launchesByYear.status === 'fulfilled' ? launchesByYear.value : null,
          rocketUsage: rocketUsage.status === 'fulfilled' ? rocketUsage.value : null,
        };

        setData(result);
        cache.set(cacheKey, { data: result, timestamp: Date.now() });

        const errors = [successRate, launchesByYear, rocketUsage]
          .filter(result => result.status === 'rejected');
        
        if (errors.length > 0) {
          setError(`${errors.length} gráficas no pudieron cargar`);
        }
      } catch {
        setError('Error cargando datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
}

// Objeto de compatibilidad para mantener la API existente
export const useCharts = {
  successRate: useSuccessRate,
  launchesByYear: useLaunchesByYear,
  rocketUsage: useRocketUsage,
  all: useAllCharts,
  dashboard: useDashboardCharts,
};
