# Smart Air Quality Monitoring System

Smart Air Quality Monitoring System er et IoT-baseret overvågningssystem udviklet som eksamensprojekt på Datamatikeruddannelsens 4. semester.

Systemet indsamler luftkvalitetsdata fra en Airthings Wave sensor via en Raspberry Pi, sender målingerne til en NestJS backend og præsenterer data i en Flutter mobilapplikation.

## Funktioner

- Airthings Wave integration via Bluetooth Low Energy (BLE)
- Raspberry Pi dataindsamling
- REST API udviklet i NestJS
- JWT autentificering
- Rollebaseret autorisation
- API Key beskyttelse til Raspberry Pi
- WebSocket realtidsopdateringer
- MySQL database
- Redis cache (Cache-Aside Pattern)
- Redis Streams
- RabbitMQ Pub/Sub messaging
- Prometheus metrics
- Grafana dashboards
- Flutter mobilapplikation
- Swagger API dokumentation

---

## Systemarkitektur

```text
Airthings Wave Sensor
           │
           ▼
      Raspberry Pi
           │
           ▼
    NestJS Backend
           │
 ┌─────────┼─────────┐
 ▼         ▼         ▼
MySQL    Redis    RabbitMQ
 │                    │
 ▼                    ▼
Flutter App    Alert Consumer

           ▼
     Prometheus
           ▼
        Grafana
```

---

## Teknologier

### Backend

- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT Authentication
- WebSocket Gateway

### Messaging & Caching

- Redis
- Redis Streams
- RabbitMQ

### Monitoring

- Prometheus
- Grafana

### Frontend

- Flutter
- Dart

### IoT

- Raspberry Pi
- Python
- Bluetooth Low Energy (BLE)
- Airthings Wave

---

## Installation

### Backend

Gå til backend mappen:

```bash
cd backend
```

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

Backend kører som standard på:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/api
```

---

## Docker Services

Projektet anvender følgende containere:

| Service | Formål |
|----------|---------|
| MySQL | Databaselagring |
| Redis | Cache og Redis Streams |
| RabbitMQ | Pub/Sub messaging |
| Prometheus | Metrics indsamling |
| Grafana | Visualisering af metrics |

Start alle services:

```bash
docker compose up -d
```

Kontroller status:

```bash
docker ps
```

---

## API Endpoints

### Login

```http
POST /auth/login
```

### Opret måling

```http
POST /measurements
```

Kræver:

```http
x-api-key
```

### Hent alle målinger

```http
GET /measurements
```

### Hent seneste måling

```http
GET /measurements/latest
```

### Metrics

```http
GET /metrics
```

Anvendes af Prometheus.

---

## Redis Cache

Projektet anvender Cache-Aside Pattern.

Flow:

```text
Klient
   │
   ▼
Redis Cache
   │
 ┌─┴──────────────┐
 │ Cache Hit      │
 ▼                │
Returnér data     │
                  │
 │ Cache Miss     │
 ▼                │
MySQL             │
 ▼                │
Gem i Redis       │
 ▼                │
Returnér data ◄───┘
```

---

## RabbitMQ

RabbitMQ anvendes til asynkron kommunikation.

Flow:

```text
Raspberry Pi
      │
      ▼
 NestJS Backend
      │
      ▼
    RabbitMQ
      │
      ▼
 Alert Consumer
```

Hvis radonniveauet overstiger den definerede grænse, modtager subscribers automatisk beskeden.

---

## Redis Streams

Målinger publiceres også til Redis Streams.

Flow:

```text
NestJS Backend
       │
       ▼
 Redis Stream
       │
       ▼
 Stream Consumer
```

Dette gør det muligt at tilføje yderligere services uden at påvirke backenden.

---

## Monitoring

### Prometheus

Prometheus indsamler metrics fra:

```text
GET /metrics
```

Eksempler:

- HTTP requests
- Response tider
- Statuskoder

### Grafana

Grafana anvendes til visualisering af metrics og dashboards.

Eksempler:

- Antal requests
- Requests pr. endpoint
- Gennemsnitlige svartider
- Statuskodefordeling

---

## Flutter App

Flutter-applikationen giver adgang til:

- Login
- Seneste måling
- Historik
- Realtidsopdateringer via WebSocket

---

## Sikkerhed

Projektet anvender:

- JWT Authentication
- Role-Based Authorization
- Raspberry Pi API Key
- Password hashing
- Protected endpoints

---

## Udviklet af

Emil Rosholm

Datamatiker - 4. Semester

EASV Sønderborg

2026
