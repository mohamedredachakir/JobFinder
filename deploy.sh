#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example. Fill API keys before production run."
fi

docker compose down --remove-orphans
docker compose up --build -d

echo "JobFinder deployed"
echo "Frontend: http://localhost:4200"
echo "Backend:  http://localhost:8080"
echo "Swagger:  http://localhost:8080/swagger-ui/index.html"
