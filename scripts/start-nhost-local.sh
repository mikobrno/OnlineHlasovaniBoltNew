#!/bin/bash

# Spustí Nhost lokálně pomocí Docker Compose
echo "Spouštím Nhost development prostředí..."

# Kontrola, zda je nainstalován Docker
if ! command -v docker &> /dev/null
then
    echo "Docker není nainstalován. Prosím nainstalujte Docker a zkuste to znovu."
    exit 1
fi

# Vytvoření docker-compose.yml pro Nhost
cat > docker-compose.yml << EOL
version: '3.8'
services:
  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - ./data/postgres:/var/lib/postgresql/data

  hasura:
    image: hasura/graphql-engine:latest
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ADMIN_SECRET: nhost-admin-secret
      HASURA_GRAPHQL_JWT_SECRET: '{"type":"HS256","key":"your-jwt-secret-key"}'

  auth:
    image: nhost/hasura-auth:latest
    ports:
      - "4000:4000"
    environment:
      AUTH_HOST: 0.0.0.0
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
      HASURA_GRAPHQL_ADMIN_SECRET: nhost-admin-secret
      AUTH_JWT_KEY: your-jwt-secret-key
      AUTH_CLIENT_URL: http://localhost:3000
      AUTH_SMTP_HOST: smtp.mailjet.com
      AUTH_SMTP_PORT: "587"
      AUTH_SMTP_USER: \${MAILJET_API_KEY}
      AUTH_SMTP_PASS: \${MAILJET_API_SECRET}
      AUTH_SMTP_SENDER: \${MAILJET_FROM_EMAIL}
EOL

# Spuštění kontejnerů
docker-compose up -d

# Čekání na spuštění služeb
echo "Čekám na spuštění služeb..."
sleep 10

# Inicializace databáze
echo "Inicializuji databázi..."
docker-compose exec postgres psql -U postgres -f /docker-entrypoint-initdb.d/nhost_init.sql

echo "Nhost development prostředí je připraveno!"
echo "Hasura konzole: http://localhost:8080"
echo "Auth servis: http://localhost:4000"
