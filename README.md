# Smart Air Quality Monitoring System Backend

NestJS backend til eksamensprojektet.

## Hvad den understøtter

- REST API til målinger
- WebSocket live updates
- MySQL database
- JWT login
- Rollebaseret authorization
- API key til Raspberry Pi
- Swagger dokumentation
- Endpoints der passer til eksamensspørgsmål: NestJS endpoints, JWT, authorization, HTTP GET/POST, service-lag og WebSocket.

## Start lokalt

```bash
cp .env.example .env
npm install
docker compose up -d
npm run start:dev
```

Swagger:
```text
http://localhost:3000/api
```

## Test med curl

Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@test.dk\",\"password\":\"password\"}"
```

Send måling fra Raspberry Pi:
```bash
curl -X POST http://localhost:3000/measurements \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-this-pi-key" \
  -d "{\"humidity\":45.5,\"temperature\":22.1,\"radonShortTermAvg\":34,\"radonLongTermAvg\":29}"
```

Seneste måling:
```bash
curl http://localhost:3000/measurements/latest
```

Historik:
```bash
curl http://localhost:3000/measurements
```

## Raspberry Pi script

Kør sådan her:
```bash
python3 ~/airthings_to_backend.py SERIAL_NUMBER 60 http://DIN_BACKEND_IP:3000/measurements
```

Men tilføj API key header i dit Python script:

```python
response = requests.post(
    backend_url,
    json=payload,
    timeout=10,
    headers={"x-api-key": "change-this-pi-key"}
)
```
