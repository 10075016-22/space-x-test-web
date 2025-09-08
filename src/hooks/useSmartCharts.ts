import { useState, useEffect, useRef } from 'react';
import { ChartData } from '@/lib/types';
import { chartsService } from '@/lib/api/charts';

// Sistema de caché para useSmartCharts
const smartCache = new Map<string, { data: Record<string, ChartData>; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Configuración solo de las gráficas que realmente usamos
const CHARTS_CONFIG = [
  { key: 'successRate', service: 'getSuccessRate' },
  { key: 'launchesByYear', service: 'getLaunchFrequency' },
  { key: 'rocketUsage', service: 'getRocketUsage' },
];

// Hook súper inteligente que se auto-configura con caché
export function useSmartCharts() {
  const [data, setData] = useState<Record<string, ChartData> | null>(null);
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
        // Verificar caché
        const cacheKey = 'smart-charts';
        const cached = smartCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setData(cached.data);
          setLoading(false);
          return;
        }

        // Crear promesas dinámicamente basadas en la configuración
        const promises = CHARTS_CONFIG.map(async (config) => {
          try {
            const result = await (chartsService as Record<string, () => Promise<ChartData>>)[config.service]();
            return { key: config.key, data: result, success: true };
          } catch (err) {
            console.warn(`Error cargando ${config.key}:`, err);
            return { key: config.key, data: null, success: false };
          }
        });

        const results = await Promise.all(promises);
        
        // Convertir resultados a objeto
        const chartsData: Record<string, ChartData | null> = {};
        let errorCount = 0;

        results.forEach(({ key, data, success }) => {
          chartsData[key] = data;
          if (!success) errorCount++;
        });

        setData(chartsData as Record<string, ChartData>);
        smartCache.set(cacheKey, { data: chartsData as Record<string, ChartData>, timestamp: Date.now() });

        if (errorCount > 0) {
          setError(`${errorCount} gráficas no pudieron cargar datos`);
        }
      } catch (err) {
        setError('Error cargando datos de gráficas');
        console.error('Error fetching charts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCharts();
  }, []);

  return { data, loading, error };
}

// Función para agregar nuevas gráficas fácilmente
export function addChartConfig(key: string, service: string) {
  CHARTS_CONFIG.push({ key, service });
}

// Función para obtener una gráfica específica
export function useSingleChart(key: string) {
  const { data, loading, error } = useSmartCharts();
  return {
    data: data?.[key] || null,
    loading,
    error
  };
}
