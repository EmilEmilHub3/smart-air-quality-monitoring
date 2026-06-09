import 'package:flutter/material.dart';
import '../models/measurement.dart';
import '../services/measurement_service.dart';

class HistoryScreen extends StatefulWidget {
  final String baseUrl;
  final String token;

  const HistoryScreen({super.key, required this.baseUrl, required this.token});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  late Future<List<Measurement>> measurementsFuture;

  @override
  void initState() {
    super.initState();

    final service = MeasurementService(
      baseUrl: widget.baseUrl,
      token: widget.token,
    );

    measurementsFuture = service.getHistory();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Measurement History')),
      body: FutureBuilder<List<Measurement>>(
        future: measurementsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return const Center(child: Text('Could not load history'));
          }

          final measurements = snapshot.data ?? [];

          if (measurements.isEmpty) {
            return const Center(child: Text('No measurements found'));
          }

          return ListView.builder(
            itemCount: measurements.length,
            itemBuilder: (context, index) {
              final measurement = measurements[index];

              return ListTile(
                leading: const Icon(Icons.air),
                title: Text(
                  '${measurement.temperature.toStringAsFixed(1)} °C | '
                  '${measurement.humidity.toStringAsFixed(1)} %',
                ),
                subtitle: Text(
                  'Radon STA: ${measurement.radonShortTermAvg} Bq/m³ | '
                  'Radon LTA: ${measurement.radonLongTermAvg} Bq/m³',
                ),
              );
            },
          );
        },
      ),
    );
  }
}
