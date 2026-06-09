"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasurementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const measurement_entity_1 = require("./measurement.entity");
const measurements_gateway_1 = require("./measurements.gateway");
let MeasurementsService = class MeasurementsService {
    constructor(measurements, gateway) {
        this.measurements = measurements;
        this.gateway = gateway;
    }
    async create(dto) {
        const measurement = this.measurements.create(dto);
        const saved = await this.measurements.save(measurement);
        this.gateway.sendNewMeasurement(saved);
        return saved;
    }
    findAll() {
        return this.measurements.find({
            order: { createdAt: 'DESC' },
            take: 100,
        });
    }
    async findLatest() {
        const latest = await this.measurements.findOne({
            where: {},
            order: { createdAt: 'DESC' },
        });
        if (!latest) {
            throw new common_1.NotFoundException('No measurements found');
        }
        return latest;
    }
    async deleteAll() {
        await this.measurements.clear();
        return { deleted: true };
    }
};
exports.MeasurementsService = MeasurementsService;
exports.MeasurementsService = MeasurementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(measurement_entity_1.Measurement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        measurements_gateway_1.MeasurementsGateway])
], MeasurementsService);
//# sourceMappingURL=measurements.service.js.map