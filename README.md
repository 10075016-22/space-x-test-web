# SpaceX Web

Aplicación Next.js + TypeScript con visualizaciones (Chart.js) que consume una API externa configurable (`NEXT_PUBLIC_API_URL`). Incluye cache en hooks, reducción de peticiones y CI/CD a ECS Fargate sin ALB.

## Arquitectura

### Stack
- Next.js 15 + TypeScript + Tailwind CSS
- Zustand (estado global)
- Chart.js + react-chartjs-2
- Docker + AWS ECR/ECS Fargate (sin ALB)

### Estructura
```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard principal
│   ├── launches/          # Páginas de lanzamientos
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   ├── charts/           # Componentes de visualización
│   └── layout/           # Componentes de layout
├── lib/                  # Utilidades y configuraciones
│   ├── api/              # Servicios HTTP
│   ├── utils/            # Funciones utilitarias (debounce, fecha, etc.)
│   └── types/            # Tipos TypeScript
├── hooks/                # Custom hooks (caché en memoria)
├── store/                # Estado global (Zustand)
└── styles/               # Estilos globales
```

## Desarrollo local

### Prerrequisitos
- Node.js 18+
- npm/yarn/pnpm
- Docker (opcional)
- AWS CLI (para despliegue)

### Instalación
1) Clonar e instalar
```bash
git clone <repository-url>
cd spacex-web
npm install
```

2) Variables de entorno
```bash
cp env.example .env.local
# Edita .env.local (ej. NEXT_PUBLIC_API_URL)
```

3) Levantar dev server
```bash
npm run dev
```
Abre http://localhost:3000

## Cambios recientes clave
- Hooks optimizados: `useSuccessRate`, `useLaunchesByYear`, `useRocketUsage`, `useDashboardCharts` (carga paralela + caché en memoria 5 min)
- `useSmartCharts` reducido a 3 gráficas reales
- Menos peticiones por segundo y prevención de bucles
- Lint/TypeScript estrictos; `debounce` con tipos seguros
- CI/CD en `.github/workflows/deploy.yml`

## Docker

```bash
# Build imagen
docker build -t spacex-web .

# Run
docker run -p 3000:3000 spacex-web
```
> Opcional: docker-compose puede añadirse según necesidad.

## Despliegue en AWS (sin ALB)

### Preparación inicial (una sola vez)
```bash
aws ecs create-cluster --cluster-name spacex-web-cluster --region us-east-1
aws logs create-log-group --log-group-name /ecs/spacex-web --region us-east-1 || true

# Completa infra/ecs-service.json con Subnet IDs y Security Group (TCP 3000 público)

aws ecs register-task-definition --cli-input-json file://infra/ecs-task-definition.json --region us-east-1
aws ecs create-service --cli-input-json file://infra/ecs-service.json --region us-east-1
```

### CI/CD (GitHub Actions)
Workflow en `.github/workflows/deploy.yml`. Secrets requeridos:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Cada push a `main`:
1) Lint + type-check + build
2) Build/push Docker a ECR
3) Render/register nueva Task Definition
4) Deploy del Service ECS (sin ALB)

## Variables de Entorno
```bash
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_API_KEY=your-api-key
```

## Testing
Actualmente este proyecto no incluye pruebas automatizadas. El comando `npm test` imprime un mensaje y finaliza con código 0 para no bloquear el pipeline.

Para habilitar pruebas unitarias con Jest:
1) Instalar dependencias:
```bash
npm i -D jest ts-jest @types/jest
```
2) Inicializar configuración:
```bash
npx ts-jest config:init
```
3) Actualizar `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```
4) Añadir tus tests en `**/*.test.ts`.

## Scripts
```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Producción
npm run lint         # ESLint
npm run lint:fix     # ESLint --fix
npm run type-check   # TypeScript
npm run test         # Placeholder (actualmente no ejecuta pruebas)
```

## Contribución
1. Fork
2. Rama feature: `git checkout -b feature/xyz`
3. Commit: `git commit -m "feat: ..."`
4. Push y PR

---

Hecho con Next.js, TypeScript y Tailwind CSS.
