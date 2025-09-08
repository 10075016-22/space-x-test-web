import { useState, useEffect } from 'react';
import { ChartData } from '@/lib/types';
import { chartsService, getChartDataWithFallback } from '@/lib/api/charts';

// Hook simple para cualquier gráfica
export function useChart(
  apiCall: () => Promise<ChartData>,
  mockData?: ChartData
) {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar obtener datos reales de la API
        const result = await apiCall();
        setData(result);
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
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// Hooks específicos para cada gráfica (opcional, para mayor comodidad)
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const useCharts = {
  successRate: () => 
    useChart(
      async () => {
        const response = await fetch(`${API_URL}/success-rate`);
        const rawData = await response.json();
        
        // Transformar al formato de Chart.js
        const chartData = {
          labels: rawData.labels,
          datasets: [{
            label: 'Distribución de Lanzamientos',
            data: rawData.statistics,
            backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
            borderColor: ['#059669', '#DC2626', '#D97706'],
            borderWidth: 2,
          }]
        };
        return chartData;
      }
    ),

   launchesByYear: () =>
     useChart(
       async () => {
         const response = await fetch(`${API_URL}/launches-by-year`);
         const rawData = await response.json();
         // Transformar al formato de Chart.js
         const chartData = {
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
         return chartData;
       }
     ),

    rocketUsage: () =>
        useChart(
          async () => {
            const response = await fetch(`${API_URL}/rocket-usage`);
            const rawData = await response.json();
            console.log({rawData})
            // Transformar al formato de Chart.js
            const chartData = {
              labels: rawData.labels,
              datasets: [{
                data: rawData.statistics,
                backgroundColor: ["#3B82F6", "#8B5CF6", "#06B6D4"],
                borderColor: ["#2563EB","#7C3AED","#0891B2"],
                fill: true,
                tension: 0.4
              }]
            };
        return chartData;
      }
    ),

  // Hook inteligente que carga todas las gráficas automáticamente
  all: () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchAllCharts = async () => {
        setLoading(true);
        setError(null);

        try {
          // Cargar todas las gráficas en paralelo
          const [
            monthlyLaunches, successRate,rocketUsage,
          ] = await Promise.allSettled([
            chartsService.getMonthlyLaunches(),
            chartsService.getSuccessRate(),
            chartsService.getRocketUsage()
          ]);

          // Procesar resultados y usar fallbacks
          setData({
            monthlyLaunches: monthlyLaunches.status === 'fulfilled' ? monthlyLaunches.value : null,
            successRate: successRate.status === 'fulfilled' ? successRate.value : null,
            rocketUsage: rocketUsage.status === 'fulfilled' ? rocketUsage.value : null,
          });

          // Verificar si hubo errores
          const errors = [
            monthlyLaunches, successRate, rocketUsage,
          ].filter(result => result.status === 'rejected');

          if (errors.length > 0) {
            setError(`${errors.length} gráficas no pudieron cargar datos reales, usando datos de ejemplo`);
          }
        } catch (err) {
          setError('Error cargando datos de gráficas');
        } finally {
          setLoading(false);
        }
      };

      fetchAllCharts();
    }, []);

    return { data, loading, error };
  },
};
