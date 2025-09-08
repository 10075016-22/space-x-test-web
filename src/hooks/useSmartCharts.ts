import { useState, useEffect } from 'react';
import { ChartData } from '@/lib/types';
import { chartsService } from '@/lib/api/charts';
import mockChartData from '@/data/mockChartData.json';

// Configuración de todas las gráficas en un solo lugar
const CHARTS_CONFIG = [
  { key: 'monthlyLaunches', service: 'getMonthlyLaunches', mock: mockChartData.launchStats.monthlyLaunches },
  { key: 'successRate', service: 'getSuccessRate', mock: mockChartData.launchStats.successRate },
  { key: 'rocketUsage', service: 'getRocketUsage', mock: mockChartData.launchStats.rocketUsage },
  { key: 'launchFrequency', service: 'getLaunchFrequency', mock: mockChartData.performanceMetrics.launchFrequency },
  { key: 'reusability', service: 'getReusability', mock: mockChartData.performanceMetrics.reusability },
  { key: 'payloadCapacity', service: 'getPayloadCapacity', mock: mockChartData.performanceMetrics.payloadCapacity },
  { key: 'launchpadUsage', service: 'getLaunchpadUsage', mock: mockChartData.launchpadData.launchpadUsage },
  { key: 'launchpadSuccess', service: 'getLaunchpadSuccess', mock: mockChartData.launchpadData.launchpadSuccess },
  { key: 'payloadTypes', service: 'getPayloadTypes', mock: mockChartData.missionTypes.payloadTypes },
  { key: 'orbitTypes', service: 'getOrbitTypes', mock: mockChartData.missionTypes.orbitTypes },
  { key: 'coreReuse', service: 'getCoreReuse', mock: mockChartData.technicalMetrics.coreReuse },
  { key: 'landingSuccess', service: 'getLandingSuccess', mock: mockChartData.technicalMetrics.landingSuccess },
];

// Hook súper inteligente que se auto-configura
export function useSmartCharts() {
  const [data, setData] = useState<Record<string, ChartData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCharts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Crear promesas dinámicamente basadas en la configuración
        const promises = CHARTS_CONFIG.map(async (config) => {
          try {
            const result = await (chartsService as any)[config.service]();
            return { key: config.key, data: result, success: true };
          } catch (err) {
            console.warn(`Error cargando ${config.key}, usando datos mock:`, err);
            return { key: config.key, data: config.mock, success: false };
          }
        });

        const results = await Promise.all(promises);
        
        // Convertir resultados a objeto
        const chartsData: Record<string, ChartData> = {};
        let errorCount = 0;

        results.forEach(({ key, data, success }) => {
          chartsData[key] = data;
          if (!success) errorCount++;
        });

        setData(chartsData);

        if (errorCount > 0) {
          setError(`${errorCount} gráficas usan datos de ejemplo`);
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
export function addChartConfig(key: string, service: string, mock: ChartData) {
  CHARTS_CONFIG.push({ key, service, mock: mock as any });
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
