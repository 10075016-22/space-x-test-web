#!/bin/bash

# Script para desplegar la infraestructura de SpaceX Web en AWS
set -e

# Configuración
STACK_NAME="spacex-web"
REGION="us-east-1"
TEMPLATE_FILE="cloudformation-template.yml"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Iniciando despliegue de SpaceX Web en AWS${NC}"

# Verificar que AWS CLI esté instalado
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI no está instalado. Por favor instálalo primero.${NC}"
    exit 1
fi

# Verificar que estemos autenticados
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}No estás autenticado en AWS. Ejecuta 'aws configure' primero.${NC}"
    exit 1
fi

# Función para obtener VPC ID
get_vpc_id() {
    echo -e "${YELLOW}Buscando VPC por defecto...${NC}"
    VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query "Vpcs[0].VpcId" --output text --region $REGION)
    
    if [ "$VPC_ID" = "None" ] || [ -z "$VPC_ID" ]; then
        echo -e "${YELLOW}No se encontró VPC por defecto. Listando VPCs disponibles:${NC}"
        aws ec2 describe-vpcs --query "Vpcs[*].[VpcId,Tags[?Key=='Name'].Value|[0],IsDefault]" --output table --region $REGION
        read -p "Ingresa el VPC ID: " VPC_ID
    fi
    
    echo -e "${GREEN}VPC ID: $VPC_ID${NC}"
}

# Función para obtener Subnet IDs
get_subnet_ids() {
    echo -e "${YELLOW}Buscando subnets en la VPC...${NC}"
    SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[*].SubnetId" --output text --region $REGION)
    
    if [ -z "$SUBNET_IDS" ]; then
        echo -e "${RED}No se encontraron subnets en la VPC $VPC_ID${NC}"
        exit 1
    fi
    
    # Convertir a formato de lista para CloudFormation
    SUBNET_LIST=$(echo $SUBNET_IDS | tr ' ' ',')
    echo -e "${GREEN}Subnet IDs: $SUBNET_LIST${NC}"
}

# Función para crear parámetros SSM
create_ssm_parameters() {
    echo -e "${YELLOW}Creando parámetros SSM...${NC}"
    
    # Crear parámetros SSM para configuración
    aws ssm put-parameter \
        --name "/$STACK_NAME/api-url" \
        --value "https://api.spacexdata.com/v4" \
        --type "String" \
        --description "URL de la API de SpaceX" \
        --overwrite \
        --region $REGION || true
    
    aws ssm put-parameter \
        --name "/$STACK_NAME/api-key" \
        --value "your-api-key-here" \
        --type "SecureString" \
        --description "API Key para SpaceX API" \
        --overwrite \
        --region $REGION || true
    
    echo -e "${GREEN}Parámetros SSM creados${NC}"
}

# Función para desplegar CloudFormation
deploy_cloudformation() {
    echo -e "${YELLOW}Desplegando stack de CloudFormation...${NC}"
    
    aws cloudformation deploy \
        --template-file $TEMPLATE_FILE \
        --stack-name $STACK_NAME \
        --parameter-overrides \
            Environment=production \
            VpcId=$VPC_ID \
            SubnetIds=$SUBNET_LIST \
        --capabilities CAPABILITY_IAM \
        --region $REGION
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Stack desplegado exitosamente${NC}"
    else
        echo -e "${RED}Error al desplegar el stack${NC}"
        exit 1
    fi
}

# Función para obtener outputs
get_outputs() {
    echo -e "${YELLOW}Obteniendo información del despliegue...${NC}"
    
    ECR_URI=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query "Stacks[0].Outputs[?OutputKey=='ECRRepositoryURI'].OutputValue" \
        --output text \
        --region $REGION)
    
    ALB_DNS=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query "Stacks[0].Outputs[?OutputKey=='LoadBalancerDNS'].OutputValue" \
        --output text \
        --region $REGION)
    
    echo -e "${GREEN}Despliegue completado exitosamente!${NC}"
    echo -e "${GREEN}ECR Repository: $ECR_URI${NC}"
    echo -e "${GREEN}Load Balancer DNS: $ALB_DNS${NC}"
    echo -e "${GREEN}URL de la aplicación: http://$ALB_DNS${NC}"
}

# Función principal
main() {
    get_vpc_id
    get_subnet_ids
    create_ssm_parameters
    deploy_cloudformation
    get_outputs
    
    echo -e "${YELLOW}Próximos pasos:${NC}"
    echo -e "1. Configura los secretos en GitHub Actions:"
    echo -e "   - AWS_ACCESS_KEY_ID"
    echo -e "   - AWS_SECRET_ACCESS_KEY"
    echo -e "2. Haz push a la rama main para activar el pipeline"
    echo -e "3. La aplicación estará disponible en: http://$ALB_DNS"
}

# Ejecutar función principal
main
