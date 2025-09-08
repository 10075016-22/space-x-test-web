'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ChartBase } from '@/components/charts';
import { launchService } from '@/lib/api/spacex';
import { useCharts } from '@/hooks/useCharts';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    success_rate: 0
  });

  // charts
  const { data: successRate, loading: successLoading } = useCharts.successRate();
  const { data: launchFrequency } = useCharts.launchesByYear();
  const { data: rocketUsage } = useCharts.rocketUsage();
  

  useEffect(() => {
    launchService.statisticsLaunches().then((stats) => {
      console.log(stats);
      setStats(stats);
      setLoading(false);
    });
  }, []);

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
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-gray-600">Total Lanzamientos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              <p className="text-gray-600">Exitosos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-gray-600">Fallidos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.success_rate}%</p>
              <p className="text-gray-600">Tasa de Éxito</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas de Estadísticas de Lanzamientos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartBase
            type="doughnut"
            data={successRate}
            title="Tasa de Éxito General x"
            subtitle={successLoading ? "Cargando datos reales..." : "Distribución de resultados de lanzamientos"}
            height={350}
          />
          <ChartBase
            type="line"
            data={launchFrequency}
            title="Frecuencia de Lanzamientos por Año"
            height={350}
          />
          
          <ChartBase
            type="pie"
            data={rocketUsage}
            title="Uso de Cohetes"
            subtitle="Distribución del uso de diferentes tipos de cohetes"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
