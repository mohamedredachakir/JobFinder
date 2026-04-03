# JobFinder Complete

Projet full stack conforme au cahier des charges: backend Java 8 Spring Boot, frontend Angular 16, PostgreSQL, Redis, Docker, CI/CD.

## Structure
- backend: API REST Spring Boot
- frontend: SPA Angular
- docker: Dockerfiles backend/frontend
- docs: manuel + export Swagger
- tests: JMeter + Cypress

## Lancement
1. cp .env.example .env
2. Renseigner les cles API
3. ./deploy.sh

## Endpoints principaux
- /api/auth/*
- /api/jobs/*
- /api/favorites/*
- /api/applications/*
- /api/alerts/*
- /api/users/*

## Swagger
- http://localhost:8080/swagger-ui/index.html
# JobFinder
