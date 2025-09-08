import { ChartData } from '@/lib/types';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Función base para hacer requests
async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Servicio unificado para todas las gráficas
export const chartsService = {
  // Estadísticas de Lanzamientos
  async getMonthlyLaunches(year?: number): Promise<ChartData> {
    const params = year ? `?year=${year}` : '';
    return apiRequest<ChartData>(`/monthly-launches${params}`);
  },

  async getSuccessRate(): Promise<ChartData> {
    return apiRequest<ChartData>('/success-rate');
  },

  async getRocketUsage(): Promise<ChartData> {
    return apiRequest<ChartData>('/rocket-usage');
  },

  // Métricas de Rendimiento
  async getLaunchFrequency(startYear?: number, endYear?: number): Promise<ChartData> {
    const params = new URLSearchParams();
    return apiRequest<ChartData>(`/launches-by-year`);
  },



  // Plataformas de Lanzamiento
  async getLaunchpadUsage(): Promise<ChartData> {
    return apiRequest<ChartData>('/launchpad-usage');
  },

  async getLaunchpadSuccess(): Promise<ChartData> {
    return apiRequest<ChartData>('/launchpad-success');
  },
};

// Función helper para usar datos mock como fallback
export async function getChartDataWithFallback<T>(
  apiCall: () => Promise<T>,
  mockData: T
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('Error obteniendo datos de API, usando datos mock:', error);
    return mockData;
  }
}
