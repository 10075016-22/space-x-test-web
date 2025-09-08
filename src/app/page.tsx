'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al dashboard después de un breve delay
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 SpaceX Web
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Aplicación de monitoreo de lanzamientos SpaceX
          </p>
        </div>
        
        <LoadingSpinner size="lg" text="Cargando aplicación..." />
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Redirigiendo al dashboard...</p>
        </div>
      </div>
    </div>
  );
}
