"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const measurement_entity_1 = require("../src/measurements/measurement.entity");
const measurements_gateway_1 = require("../src/measurements/measurements.gateway");
const measurements_service_1 = require("../src/measurements/measurements.service");
describe('MeasurementsService', () => {
    it('creates a measurement and emits websocket event', async () => {
        const repo = {
            create: jest.fn((dto) => dto),
            save: jest.fn(async (m) => ({ id: 1, ...m, createdAt: new Date() })),
        };
        const gateway = {
            sendNewMeasurement: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                measurements_service_1.MeasurementsService,
                { provide: (0, typeorm_1.getRepositoryToken)(measurement_entity_1.Measurement), useValue: repo },
                { provide: measurements_gateway_1.MeasurementsGateway, useValue: gateway },
            ],
        }).compile();
        const service = module.get(measurements_service_1.MeasurementsService);
        const result = await service.create({
            humidity: 40,
            temperature: 22,
            radonShortTermAvg: 10,
            radonLongTermAvg: 12,
        });
        expect(result.id).toBe(1);
        expect(gateway.sendNewMeasurement).toHaveBeenCalled();
    });
});
//# sourceMappingURL=measurements.service.spec.js.map