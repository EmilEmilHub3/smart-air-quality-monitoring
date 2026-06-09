import 'package:flutter/material.dart';
import '../models/measurement.dart';
import '../services/websocket_service.dart';
import '../widgets/measurement_card.dart';
import 'history_screen.dart';

class DashboardScreen extends StatefulWidget {
  final String baseUrl;
  final String token;

  const DashboardScreen({
    super.key,
    required this.baseUrl,
    required this.token,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Measurement? latestMeasurement;
  WebSocketService? webSocketService;

  @override
  void initState() {
    super.initState();

    latestMeasurement = Measurement(
      temperature: 22.4,
      humidity: 48.0,
      radonShortTermAvg: 25,
      radonLongTermAvg: 30,
    );

    webSocketService = WebSocketService(socketUrl: 'http://localhost:3001');

    webSocketService!.connect(
      onMeasurement: (measurement) {
        setState(() {
          latestMeasurement = measurement;
        });
      },
    );
  }

  @override
  void dispose() {
    webSocketService?.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final measurement = latestMeasurement;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => HistoryScreen(
                    baseUrl: widget.baseUrl,
                    token: widget.token,
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: measurement == null
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                MeasurementCard(
                  title: 'Temperature',
                  value: measurement.temperature.toStringAsFixed(1),
                  unit: '°C',
                  icon: Icons.thermostat,
                ),
                MeasurementCard(
                  title: 'Humidity',
                  value: measurement.humidity.toStringAsFixed(1),
                  unit: '%',
                  icon: Icons.water_drop,
                ),
                MeasurementCard(
                  title: 'Radon short term',
                  value: measurement.radonShortTermAvg.toString(),
                  unit: 'Bq/m³',
                  icon: Icons.warning,
                ),
                MeasurementCard(
                  title: 'Radon long term',
                  value: measurement.radonLongTermAvg.toString(),
                  unit: 'Bq/m³',
                  icon: Icons.analytics,
                ),
              ],
            ),
    );
  }
}
