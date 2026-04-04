FROM node:20-alpine AS build
WORKDIR /app
ENV CI=true
ENV NG_CLI_ANALYTICS=false
COPY frontend/package*.json ./
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set prefer-offline true \
    && npm ci --no-audit --no-fund
COPY frontend/ .
RUN npm run build -- --configuration production

FROM nginx:stable-alpine
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/jobfinder-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
