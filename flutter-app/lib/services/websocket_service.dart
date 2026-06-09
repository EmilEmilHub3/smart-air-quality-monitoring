import 'package:socket_io_client/socket_io_client.dart' as io;
import '../models/measurement.dart';

class WebSocketService {
  final String socketUrl;
  io.Socket? _socket;

  WebSocketService({required this.socketUrl});

  void connect({
    required void Function(Measurement measurement) onMeasurement,
  }) {
    _socket = io.io(
      socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      print('Connected to Socket.IO backend');
    });

    _socket!.on('measurement:new', (data) {
      final measurement = Measurement.fromJson(Map<String, dynamic>.from(data));

      onMeasurement(measurement);
    });

    _socket!.onDisconnect((_) {
      print('Disconnected from Socket.IO backend');
    });

    _socket!.onConnectError((error) {
      print('Socket.IO connect error: $error');
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
  }
}
