class Measurement {
  final double temperature;
  final double humidity;
  final int radonShortTermAvg;
  final int radonLongTermAvg;
  final DateTime? createdAt;

  Measurement({
    required this.temperature,
    required this.humidity,
    required this.radonShortTermAvg,
    required this.radonLongTermAvg,
    this.createdAt,
  });

  factory Measurement.fromJson(Map<String, dynamic> json) {
    return Measurement(
      temperature: (json['temperature'] as num).toDouble(),
      humidity: (json['humidity'] as num).toDouble(),
      radonShortTermAvg: json['radonShortTermAvg'] as int,
      radonLongTermAvg: json['radonLongTermAvg'] as int,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : null,
    );
  }
}
