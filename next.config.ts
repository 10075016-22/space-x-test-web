import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Docker
  output: 'standalone',
  
  // Optimizaciones de imágenes
  images: {
    domains: ['images.unsplash.com', 'live.staticflickr.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Configuración de redirecciones
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Variables de entorno públicas
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Configuración experimental
  experimental: {
    optimizePackageImports: ['lucide-react', 'chart.js'],
  },
  
  // Configuración de webpack
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones para producción
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
