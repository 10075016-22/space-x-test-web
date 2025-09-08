'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  rocket: { name: string };
  launchpad: { name: string };
}

export default function LaunchesPage() {
  const [loading, setLoading] = useState(true);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simular carga de datos de tu API Python
    setTimeout(() => {
      setLaunches([
        {
          id: '1',
          name: 'Falcon 9 Test Flight',
          date_utc: '2024-01-15T10:30:00Z',
          success: true,
          rocket: { name: 'Falcon 9' },
          launchpad: { name: 'LC-39A' }
        },
        {
          id: '2',
          name: 'Starship Test',
          date_utc: '2024-01-20T14:00:00Z',
          success: false,
          rocket: { name: 'Starship' },
          launchpad: { name: 'Starbase' }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLaunches = launches.filter(launch => {
    if (filter === 'success') return launch.success === true;
    if (filter === 'failed') return launch.success === false;
    if (filter === 'pending') return launch.success === null;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando lanzamientos..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lanzamientos SpaceX</h1>
        
        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant={filter === 'success' ? 'primary' : 'outline'}
            onClick={() => setFilter('success')}
          >
            Exitosos
          </Button>
          <Button 
            variant={filter === 'failed' ? 'primary' : 'outline'}
            onClick={() => setFilter('failed')}
          >
            Fallidos
          </Button>
        </div>

        {/* Lista de lanzamientos */}
        <div className="space-y-4">
          {filteredLaunches.map((launch) => (
            <Card key={launch.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{launch.name}</h3>
                    <p className="text-gray-600">{launch.rocket.name} - {launch.launchpad.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(launch.date_utc).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    launch.success === null
                      ? 'bg-yellow-100 text-yellow-800'
                      : launch.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {launch.success === null
                      ? 'Pendiente'
                      : launch.success
                      ? 'Exitoso'
                      : 'Fallido'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
