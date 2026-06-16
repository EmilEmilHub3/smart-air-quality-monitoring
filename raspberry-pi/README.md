# Smart Air Raspberry Pi Client

Raspberry Pi klient til Smart Air Quality Monitoring System.

Klienten læser sensordata fra en Airthings Wave sensor via Bluetooth Low Energy (BLE) og sender målingerne til backend.

## Teknologier

- Python
- Raspberry Pi
- Bluetooth Low Energy (BLE)
- Airthings Wave
- GPIO
- I2C Display
- HTTP Requests

## Funktioner

- Hent målinger fra Airthings Wave
- Send målinger til backend
- Vis status på LCD display
- LED indikatorer
- Knap input via GPIO

## Hardware

- Raspberry Pi
- Airthings Wave
- LCD Display
- LED'er
- Push Button

## Start projektet

Installer dependencies:

```bash
pip install -r requirements.txt
```

Start programmet:

```bash
python main.py
```

## Dataflow

```text
Airthings Wave
       │
       ▼
 Raspberry Pi
       │
       ▼
 NestJS Backend
       │
       ▼
     MySQL
```

## Kommunikation

### Bluetooth Low Energy

Anvendes til kommunikation med Airthings Wave sensoren.

### HTTP

Anvendes til at sende målinger til backend:

```text
POST /measurements
```

Målingerne sendes med en API Key for at beskytte endpointet.
