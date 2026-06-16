# Smart Air Backend

NestJS backend for Smart Air Quality Monitoring System.

Backenden modtager målinger fra Raspberry Pi'en, gemmer data i MySQL, sender realtidsopdateringer til Flutter-applikationen og håndterer caching, messaging og monitoring.

## Teknologier

- NestJS
- TypeScript
- MySQL
- TypeORM
- JWT Authentication
- Redis Cache
- Redis Streams
- RabbitMQ
- WebSocket
- Prometheus
- Grafana

## Funktioner

- Login og autentificering
- API Key beskyttelse af Raspberry Pi endpoint
- Gemning af målinger
- Historik over målinger
- Realtidsopdateringer via WebSocket
- Redis Cache (Cache-Aside Pattern)
- Redis Streams
- RabbitMQ Pub/Sub
- Metrics til Prometheus

## Start projektet

Installer dependencies:

```bash
npm install
```

Start Docker services:

```bash
docker compose up -d
```

Start backend:

```bash
npm run start:dev
```

Swagger:

```text
http://localhost:3000/api
```

## Arkitektur

```text
Raspberry Pi
     │
     ▼
NestJS Backend
     │
 ┌───┼────────────┐
 ▼   ▼            ▼
MySQL Redis   RabbitMQ
     │
     ▼
Flutter App
```
