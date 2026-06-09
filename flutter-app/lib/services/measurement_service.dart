import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/measurement.dart';

class MeasurementService {
  final String baseUrl;
  final String token;

  MeasurementService({required this.baseUrl, required this.token});

  Future<List<Measurement>> getHistory() async {
    final response = await http.get(
      Uri.parse('$baseUrl/measurements'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode != 200) {
      throw Exception('Could not fetch measurements: ${response.statusCode}');
    }

    final List<dynamic> data = jsonDecode(response.body);

    return data
        .map((item) => Measurement.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}
