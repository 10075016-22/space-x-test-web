# Despliegue de SpaceX Web en ECS Fargate

Este directorio contiene todos los archivos necesarios para desplegar la aplicación SpaceX Web en AWS ECS Fargate con un pipeline de CI/CD automatizado.

## Arquitectura

- **ECS Fargate**: Contenedores serverless para la aplicación
- **Application Load Balancer**: Distribución de tráfico y terminación SSL
- **ECR**: Repositorio de imágenes Docker
- **CloudWatch**: Logs y monitoreo
- **GitHub Actions**: Pipeline de CI/CD
- **SSM Parameter Store**: Gestión de secretos y configuración

## Prerrequisitos

1. **AWS CLI** instalado y configurado
2. **Cuenta de AWS** con permisos para crear recursos
3. **Repositorio en GitHub** con la aplicación
4. **Docker** instalado localmente (para testing)

## Configuración Inicial

### 1. Configurar AWS CLI

```bash
aws configure
```

Ingresa tus credenciales de AWS:
- Access Key ID
- Secret Access Key
- Region (ej: us-east-1)
- Output format (json)

### 2. Ejecutar el Script de Despliegue

```bash
cd infrastructure
chmod +x deploy.sh
./deploy.sh
```

Este script:
- Detecta automáticamente la VPC y subnets
- Crea parámetros SSM para configuración
- Despliega la infraestructura con CloudFormation
- Muestra las URLs y recursos creados

### 3. Configurar GitHub Secrets

En tu repositorio de GitHub, ve a Settings > Secrets and variables > Actions y agrega:

- `AWS_ACCESS_KEY_ID`: Tu Access Key de AWS
- `AWS_SECRET_ACCESS_KEY`: Tu Secret Key de AWS

## Estructura de Archivos

```
infrastructure/
├── cloudformation-template.yml  # Plantilla de infraestructura
├── deploy.sh                    # Script de despliegue automatizado
└── README.md                    # Este archivo
```

## Componentes Desplegados

### ECS Cluster
- Cluster Fargate con Container Insights habilitado
- Configuración optimizada para aplicaciones web

### ECS Service
- 2 instancias por defecto (configurable)
- Despliegue con rolling update
- Circuit breaker habilitado para rollback automático

### Application Load Balancer
- Distribución de tráfico HTTP/HTTPS
- Health checks en `/api/health`
- Target group con configuración optimizada

### ECR Repository
- Repositorio privado para imágenes Docker
- Política de retención de 10 imágenes
- Scan de vulnerabilidades automático

### CloudWatch Logs
- Log group `/ecs/spacex-web`
- Retención de 30 días
- Streams por contenedor

### IAM Roles
- `ecsTaskExecutionRole`: Para ejecutar tareas ECS
- `ecsTaskRole`: Para permisos de la aplicación
- Acceso a SSM Parameter Store

## Pipeline de CI/CD

El pipeline de GitHub Actions se ejecuta automáticamente en:

- **Push a main**: Despliegue completo
- **Pull Request**: Solo testing y validación

### Flujo del Pipeline

1. **Testing**: Lint, type-check, tests, build
2. **Build Docker**: Construcción de imagen optimizada
3. **Push ECR**: Subida a repositorio ECR
4. **Deploy ECS**: Actualización del servicio ECS
5. **Verificación**: Health check y estabilidad

## Monitoreo y Logs

### CloudWatch Logs
```bash
# Ver logs en tiempo real
aws logs tail /ecs/spacex-web --follow --region us-east-1
```

### Health Check
La aplicación expone un endpoint de health check en `/api/health` que retorna:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## Comandos Útiles

### Verificar Estado del Servicio
```bash
aws ecs describe-services \
  --cluster spacex-web-cluster \
  --services spacex-web-service \
  --region us-east-1
```

### Ver Logs de la Aplicación
```bash
aws logs describe-log-streams \
  --log-group-name /ecs/spacex-web \
  --region us-east-1
```

### Actualizar el Servicio
```bash
aws ecs update-service \
  --cluster spacex-web-cluster \
  --service spacex-web-service \
  --desired-count 3 \
  --region us-east-1
```

## Troubleshooting

### Problema: Servicio no inicia
1. Verificar logs en CloudWatch
2. Revisar health check endpoint
3. Validar configuración de red y seguridad

### Problema: Pipeline falla
1. Verificar secretos de GitHub
2. Revisar permisos de IAM
3. Validar configuración de ECR

### Problema: Aplicación no responde
1. Verificar Load Balancer health checks
2. Revisar configuración de target group
3. Validar conectividad de red

## Costos Estimados

Para una aplicación con 2 instancias Fargate (512 CPU, 1GB RAM):
- ECS Fargate: ~$30-40/mes
- Application Load Balancer: ~$20/mes
- ECR: ~$1/mes (para 10GB de imágenes)
- CloudWatch Logs: ~$5/mes (para 10GB de logs)

Total estimado: ~$55-65/mes

## Limpieza

Para eliminar todos los recursos:

```bash
aws cloudformation delete-stack \
  --stack-name spacex-web \
  --region us-east-1
```

**Nota**: Esto eliminará todos los recursos creados. Asegúrate de hacer backup de datos importantes.
