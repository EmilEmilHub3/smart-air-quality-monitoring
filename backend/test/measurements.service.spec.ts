import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Measurement } from '../src/measurements/measurement.entity';
import { MeasurementsGateway } from '../src/measurements/measurements.gateway';
import { MeasurementsService } from '../src/measurements/measurements.service';

describe('MeasurementsService', () => {
  it('creates a measurement and emits websocket event', async () => {
    const repo = {
      create: jest.fn((dto) => dto),
      save: jest.fn(async (m) => ({ id: 1, ...m, createdAt: new Date() })),
    };

    const gateway = {
      sendNewMeasurement: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        MeasurementsService,
        { provide: getRepositoryToken(Measurement), useValue: repo },
        { provide: MeasurementsGateway, useValue: gateway },
      ],
    }).compile();

    const service = module.get(MeasurementsService);

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
