import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { MeasurementsService } from './measurements.service';
export declare class MeasurementsController {
    private readonly measurementsService;
    constructor(measurementsService: MeasurementsService);
    create(dto: CreateMeasurementDto): Promise<import("./measurement.entity").Measurement>;
    findAll(): Promise<import("./measurement.entity").Measurement[]>;
    findLatest(): Promise<import("./measurement.entity").Measurement>;
    deleteAll(): Promise<{
        deleted: boolean;
    }>;
}
