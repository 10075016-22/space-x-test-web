import { useState } from 'react';
import { Launch, LaunchFilters, LaunchStats, Rocket, Launchpad } from '@/lib/types';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Headers por defecto
const defaultHeaders = {
  'Content-Type': 'application/json',
  ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
};

// Clase para manejar errores de API
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Función para hacer requests HTTP
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: defaultHeaders,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
        response
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Error de red o parsing
    throw new ApiError(
      'Error de conexión con el servidor',
      0
    );
  }
}

// Servicios para lanzamientos
export const launchService = {
  // Obtener todos los lanzamientos
  async getAllLaunches(filters?: LaunchFilters): Promise<Launch[]> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const endpoint = `/launches${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest<Launch[]>(endpoint);
  },

  // Obtener un lanzamiento por ID
  async getLaunchById(id: string): Promise<Launch> {
    return apiRequest<Launch>(`/launches/${id}`);
  },

  // Obtener lanzamientos próximos
  async getUpcomingLaunches(limit: number = 10): Promise<Launch[]> {
    return apiRequest<Launch[]>(`/launches/upcoming?limit=${limit}`);
  },

  // Obtener lanzamientos pasados
  async getPastLaunches(limit: number = 20): Promise<Launch[]> {
    return apiRequest<Launch[]>(`/launches/past?limit=${limit}`);
  },

  // Obtener estadísticas de lanzamientos
  async statisticsLaunches(): Promise<LaunchStats> {
    return apiRequest<LaunchStats>('/statistics');
  },

  // Buscar lanzamientos
  async searchLaunches(query: string, filters?: Partial<LaunchFilters>): Promise<Launch[]> {
    const searchParams = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    
    return apiRequest<Launch[]>(`/launches/search?${searchParams.toString()}`);
  },
};



// Servicios generales
export const generalService = {
  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return apiRequest<{ status: string; timestamp: string }>('/health');
  },

  // Obtener información de la API
  async getApiInfo(): Promise<{
    name: string;
    version: string;
    description: string;
    endpoints: string[];
  }> {
    return apiRequest<{
      name: string;
      version: string;
      description: string;
      endpoints: string[];
    }>('/info');
  },
};

// Hook personalizado para manejar el estado de carga y errores
export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}

// Función para manejar errores de API de manera consistente
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Solicitud inválida. Verifica los parámetros enviados.';
      case 401:
        return 'No autorizado. Verifica tu API key.';
      case 403:
        return 'Acceso denegado. No tienes permisos para esta operación.';
      case 404:
        return 'Recurso no encontrado.';
      case 429:
        return 'Demasiadas solicitudes. Intenta de nuevo más tarde.';
      case 500:
        return 'Error interno del servidor. Intenta de nuevo más tarde.';
      case 502:
        return 'Servidor no disponible. Intenta de nuevo más tarde.';
      case 503:
        return 'Servicio temporalmente no disponible.';
      default:
        return `Error del servidor: ${error.status}`;
    }
  }
  
  return 'Error de conexión. Verifica tu conexión a internet.';
}

// Función para retry automático en caso de fallos
export async function withRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}

export { ApiError };
