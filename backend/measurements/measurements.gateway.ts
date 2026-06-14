import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Measurement } from './measurement.entity';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MeasurementsGateway {

  /**
   * Socket.IO server-instansen som bruges til
   * at kommunikere med tilsluttede WebSocket-klienter.
   */
  @WebSocketServer()
  server: Server;

  /**
   * Sender en ny måling til alle tilsluttede klienter.
   * Anvendes til realtime-opdateringer i Flutter-applikationen.
   */
  sendNewMeasurement(measurement: Measurement) {
    this.server.emit('measurement:new', measurement);
  }
}