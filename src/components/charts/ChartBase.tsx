'use client';

import React from 'react';
import { ChartData } from '@/lib/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import {
  Line,
  Bar,
  Doughnut,
  Pie,
  Radar,
} from 'react-chartjs-2';
import { Card } from '@/components/ui/Card';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

export type ChartType = 'line' | 'bar' | 'doughnut' | 'pie' | 'radar';

export interface ChartBaseProps {
  type: ChartType;
  data?: ChartData | null;
  title?: string;
  subtitle?: string;
  height?: number;
  className?: string;
  options?: Record<string, unknown>;
}

const defaultColors = [
  '#3B82F6', // blue-500
  '#EF4444', // red-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
];

const ChartBase: React.FC<ChartBaseProps> = ({
  type,
  data,
  title,
  subtitle,
  height = 300,
  className = '',
  options = {},
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: type === 'line' || type === 'bar' ? {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
        beginAtZero: true,
      },
    } : undefined,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Verificar que data existe antes de procesarlo
  if (!data || !data.datasets) {
    return (
      <Card className={`p-6 ${className}`} hover>
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div style={{ height: `${height}px` }} className="flex items-center justify-center">
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      </Card>
    );
  }

  // Aplicar colores por defecto si no se especifican
  const processedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || 
        (type === 'doughnut' || type === 'pie' 
          ? defaultColors.slice(0, data.labels.length)
          : defaultColors[index % defaultColors.length]),
      borderColor: dataset.borderColor || 
        (type === 'doughnut' || type === 'pie' 
          ? defaultColors.slice(0, data.labels.length)
          : defaultColors[index % defaultColors.length]),
      borderWidth: dataset.borderWidth || 2,
    })),
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={processedData} options={mergedOptions} />;
      case 'bar':
        return <Bar data={processedData} options={mergedOptions} />;
      case 'doughnut':
        return <Doughnut data={processedData} options={mergedOptions} />;
      case 'pie':
        return <Pie data={processedData} options={mergedOptions} />;
      case 'radar':
        return <Radar data={processedData} options={mergedOptions} />;
      default:
        return <div>Tipo de gráfica no soportado</div>;
    }
  };

  return (
    <Card className={`p-6 ${className}`} hover>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </Card>
  );
};

export default ChartBase;
