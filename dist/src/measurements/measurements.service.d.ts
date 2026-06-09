import { Repository } from 'typeorm';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { Measurement } from './measurement.entity';
import { MeasurementsGateway } from './measurements.gateway';
export declare class MeasurementsService {
    private readonly measurements;
    private readonly gateway;
    constructor(measurements: Repository<Measurement>, gateway: MeasurementsGateway);
    create(dto: CreateMeasurementDto): Promise<Measurement>;
    findAll(): Promise<Measurement[]>;
    findLatest(): Promise<Measurement>;
    deleteAll(): Promise<{
        deleted: boolean;
    }>;
}
