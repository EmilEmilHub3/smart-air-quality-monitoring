# Smart Air Flutter App

Flutter mobilapplikation til Smart Air Quality Monitoring System.

Applikationen giver brugeren mulighed for at overvåge luftkvalitet, se historiske målinger og modtage realtidsopdateringer fra backend.

## Teknologier

- Flutter
- Dart
- REST API
- WebSocket
- JWT Authentication

## Funktioner

- Login
- Visning af seneste måling
- Historik over målinger
- Realtidsopdateringer via WebSocket
- JWT baseret autentificering

## Start projektet

Installer dependencies:

```bash
flutter pub get
```

Start applikationen:

```bash
flutter run
```

## Kommunikation

### REST API

Bruges til:

- Login
- Hent historik
- Hent seneste måling

### WebSocket

Bruges til:

- Realtidsopdateringer af nye målinger

## Arkitektur

```text
Flutter App
     │
     ▼
NestJS Backend
     │
 ├─ REST API
 └─ WebSocket
```
