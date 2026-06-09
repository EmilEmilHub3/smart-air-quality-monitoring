import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Measurement } from './measurement.entity';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MeasurementsGateway {
  @WebSocketServer()
  server: Server;

  sendNewMeasurement(measurement: Measurement) {
    this.server.emit('measurement:new', measurement);
  }
}
