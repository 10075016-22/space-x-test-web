import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Combina clases de Tailwind CSS de manera inteligente
 * Evita conflictos entre clases y mantiene la especificidad correcta
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea una fecha ISO a un formato legible
 */
export function formatDate(
  dateString: string,
  formatString: string = 'dd/MM/yyyy HH:mm'
): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Fecha inválida';
    }
    return format(date, formatString, { locale: es });
  } catch {
    return 'Fecha inválida';
  }
}

/**
 * Formatea una fecha ISO a formato relativo (hace X tiempo)
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Fecha inválida';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    } else {
      return format(date, 'dd/MM/yyyy', { locale: es });
    }
  } catch {
    return 'Fecha inválida';
  }
}

/**
 * Trunca un texto a una longitud específica
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitaliza la primera letra de una cadena
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num);
}

/**
 * Formatea un número como moneda
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Genera un ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function para optimizar búsquedas
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function para limitar la frecuencia de ejecución
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Valida si una URL es válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extrae el dominio de una URL
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * Convierte un objeto a query string
 */
export function objectToQueryString(obj: Record<string, unknown>): string {
  const params = new URLSearchParams();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return params.toString();
}

/**
 * Convierte una query string a objeto
 */
export function queryStringToObject(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const obj: Record<string, string> = {};
  
  params.forEach((value, key) => {
    obj[key] = value;
  });
  
  return obj;
}

/**
 * Calcula el porcentaje de éxito
 */
export function calculateSuccessRate(successful: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((successful / total) * 100);
}

/**
 * Obtiene el color basado en el estado de éxito
 */
export function getSuccessColor(success: boolean | null): string {
  if (success === null) return 'text-gray-500';
  return success ? 'text-green-600' : 'text-red-600';
}

/**
 * Obtiene el color de fondo basado en el estado de éxito
 */
export function getSuccessBgColor(success: boolean | null): string {
  if (success === null) return 'bg-gray-100';
  return success ? 'bg-green-100' : 'bg-red-100';
}

/**
 * Obtiene el texto del estado de éxito
 */
export function getSuccessText(success: boolean | null): string {
  if (success === null) return 'Pendiente';
  return success ? 'Exitoso' : 'Fallido';
}

/**
 * Formatea la duración en segundos a formato legible
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

/**
 * Valida si un email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Genera un color aleatorio para gráficos
 */
export function generateRandomColor(): string {
  const colors = [
    '#3B82F6', // blue-500
    '#EF4444', // red-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
    '#F97316', // orange-500
    '#6366F1', // indigo-500
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Convierte bytes a formato legible
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Sleep function para delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
