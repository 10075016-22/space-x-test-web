# 🚀 SpaceX Web Application

Una aplicación web moderna y responsiva que consume datos de lanzamientos de SpaceX desde DynamoDB y los presenta en un formato visualmente atractivo con filtros, tablas, líneas de tiempo y gráficos de tendencia.

## 🏗️ Arquitectura

### Stack Tecnológico
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Estado**: Zustand (gestión de estado ligero)
- **Visualización**: Chart.js + D3.js
- **Backend**: API Python (existente)
- **Base de Datos**: DynamoDB (configurada con CDK)
- **Infraestructura**: AWS ECS Fargate + ECR
- **Contenedores**: Docker

### Estructura del Proyecto
```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard principal
│   ├── launches/          # Páginas de lanzamientos
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   ├── charts/           # Componentes de visualización
│   ├── filters/          # Componentes de filtros
│   └── layout/           # Componentes de layout
├── lib/                  # Utilidades y configuraciones
│   ├── api/              # Servicios para API Python
│   ├── utils/            # Funciones utilitarias
│   └── types/            # Tipos TypeScript
├── hooks/                # Custom hooks
├── store/                # Estado global (Zustand)
└── styles/               # Estilos globales
```

## 🚀 Getting Started

### Prerrequisitos
- Node.js 18+ 
- npm/yarn/pnpm
- Docker (para contenedores)
- AWS CLI (para despliegue)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd spacex-web
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env.local
# Editar .env.local con tus configuraciones
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📋 Estado del Proyecto

### ✅ Completado
- [x] Configuración inicial de Next.js 15 + TypeScript + Tailwind CSS
- [x] Estructura de carpetas siguiendo Clean Architecture
- [x] Tipos TypeScript completos para SpaceX API
- [x] Store de estado global con Zustand
- [x] Servicios de API con manejo de errores
- [x] Componentes UI base (Button, Card, LoadingSpinner)
- [x] Hooks personalizados para manejo de datos
- [x] Navegación responsiva
- [x] Dashboard básico con estadísticas
- [x] Configuración de Docker y docker-compose
- [x] Configuración de Next.js optimizada para producción
- [x] Documentación completa en README

### 🚧 En Progreso
- [ ] Integración con API Python existente
- [ ] Componentes de visualización (Chart.js, D3.js)
- [ ] Páginas de lanzamientos, cohetes y lanzaderas
- [ ] Sistema de filtros avanzados
- [ ] Tests unitarios y e2e

### 📅 Próximos Pasos
- [ ] Implementar visualizaciones interactivas
- [ ] Crear páginas de detalles
- [ ] Optimizar performance y SEO
- [ ] Configurar CI/CD
- [ ] Despliegue en AWS ECS

## 📊 Funcionalidades

### Dashboard Principal
- Resumen estadístico de lanzamientos
- Gráficos de tendencias por año/mes
- Últimos lanzamientos destacados
- Métricas de éxito por cohete

### Explorador de Lanzamientos
- Tabla con filtros avanzados (fecha, cohete, éxito, etc.)
- Vista de tarjetas con imágenes
- Paginación y búsqueda
- Ordenamiento por múltiples criterios

### Visualizaciones
- **Gráfico de Tendencias**: Lanzamientos por período
- **Gráfico de Éxito**: Porcentaje de éxito por cohete
- **Línea de Tiempo**: Cronología interactiva de misiones
- **Mapa de Lanzamientos**: Ubicaciones geográficas

### Detalles de Lanzamiento
- Información completa del lanzamiento
- Galería de imágenes y videos
- Información del cohete y lanzadera
- Enlaces a recursos externos

## 🐳 Docker

### Desarrollo
```bash
# Construir imagen
docker build -t spacex-web .

# Ejecutar contenedor
docker run -p 3000:3000 spacex-web
```

### Docker Compose
```bash
# Desarrollo con hot-reload
docker-compose up -d

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Despliegue en AWS

### Prerrequisitos
- AWS CLI configurado
- CDK desplegado (infraestructura existente)
- ECR repository configurado

### Proceso de Despliegue

1. **Construir imagen Docker**
```bash
docker build -t spacex-web .
```

2. **Etiquetar para ECR**
```bash
docker tag spacex-web:latest <account-id>.dkr.ecr.<region>.amazonaws.com/spacex-web:latest
```

3. **Subir a ECR**
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/spacex-web:latest
```

4. **Actualizar servicio ECS**
```bash
aws ecs update-service --cluster <cluster-name> --service <service-name> --force-new-deployment
```

### Variables de Entorno
```bash
# API Backend
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_API_KEY=your-api-key

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests e2e
npm run test:e2e
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
npm run lint:fix     # Corregir errores de linting
npm run type-check   # Verificar tipos TypeScript
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
```

## 🎨 Diseño y UX

### Principios de Diseño
- **Mobile First**: Diseño responsivo desde móvil
- **Accesibilidad**: Cumple estándares WCAG 2.1
- **Performance**: Optimización de carga y renderizado
- **Usabilidad**: Interfaz intuitiva y fácil navegación

### Paleta de Colores
- **Primario**: SpaceX Blue (#005288)
- **Secundario**: SpaceX Red (#FF6B35)
- **Neutros**: Grises para texto y fondos
- **Estados**: Verde (éxito), Rojo (error), Amarillo (advertencia)

## 🔧 Configuración de Desarrollo

### ESLint + Prettier
```bash
# Configuración automática
npm run lint:fix
npm run format
```

### TypeScript
- Configuración estricta habilitada
- Tipos para todas las props de componentes
- Interfaces para datos de API

### Tailwind CSS
- Configuración personalizada
- Componentes base reutilizables
- Responsive design utilities

## 📚 Documentación de Componentes

### Componentes Base
- `Button`: Botón reutilizable con variantes
- `Card`: Tarjeta contenedora
- `Modal`: Modal con overlay
- `LoadingSpinner`: Indicador de carga
- `DataTable`: Tabla con paginación y filtros

### Componentes de Visualización
- `LineChart`: Gráfico de líneas con Chart.js
- `BarChart`: Gráfico de barras
- `Timeline`: Línea de tiempo interactiva
- `LaunchMap`: Mapa de ubicaciones de lanzamiento

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda:
- Abre un issue en GitHub
- Revisa la documentación de componentes
- Consulta los ejemplos en `/examples`

---

**Desarrollado con ❤️ usando Next.js, TypeScript y Tailwind CSS**
