'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ChartBase } from '@/components/charts';
import { useCharts } from '@/hooks/useCharts';
import { useLaunchStats } from '@/hooks/useLaunchStats';

export default function DashboardPage() {
  // Estadísticas optimizadas con caché
  const { stats, loading: statsLoading } = useLaunchStats();
  
  // charts - usando hook optimizado que carga todo de una vez
  const { data: chartsData, loading: chartsLoading } = useCharts.dashboard();

  const loading = statsLoading || chartsLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando datos..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard SpaceX</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats?.total || 0}</p>
              <p className="text-gray-600">Total Lanzamientos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-green-600">{stats?.success || 0}</p>
              <p className="text-gray-600">Exitosos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-red-600">{stats?.failed || 0}</p>
              <p className="text-gray-600">Fallidos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-purple-600">{stats?.success_rate || 0}%</p>
              <p className="text-gray-600">Tasa de Éxito</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas de Estadísticas de Lanzamientos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartBase
            type="doughnut"
            data={chartsData?.successRate}
            title="Tasa de Éxito General"
            subtitle={chartsLoading ? "Cargando datos reales..." : "Distribución de resultados de lanzamientos"}
            height={350}
          />
          <ChartBase
            type="line"
            data={chartsData?.launchesByYear}
            title="Frecuencia de Lanzamientos por Año"
            height={350}
          />
          
          <ChartBase
            type="pie"
            data={chartsData?.rocketUsage}
            title="Uso de Cohetes"
            subtitle="Distribución del uso de diferentes tipos de cohetes"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
