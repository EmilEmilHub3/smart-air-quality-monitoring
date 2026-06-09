import { Server } from 'socket.io';
import { Measurement } from './measurement.entity';
export declare class MeasurementsGateway {
    server: Server;
    sendNewMeasurement(measurement: Measurement): void;
}
