import { useState, useEffect } from 'react';
import { ChartData } from '@/lib/types';
import { chartsService } from '@/lib/api/charts';

// Hook súper simple para una sola gráfica
export function useSimpleChart(
  endpoint: keyof typeof chartsService,
  mockData: ChartData
) {
  const [data, setData] = useState<ChartData>(mockData);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await chartsService[endpoint]();
      setData(result);
    } catch (error) {
      console.warn('Error obteniendo datos, usando mock:', error);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, refetch: fetchData };
}
