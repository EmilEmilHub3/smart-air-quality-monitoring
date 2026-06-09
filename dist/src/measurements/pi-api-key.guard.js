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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PiApiKeyGuard = class PiApiKeyGuard {
    constructor(config) {
        this.config = config;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const providedKey = request.headers['x-api-key'];
        const expectedKey = this.config.get('PI_API_KEY');
        if (!expectedKey || providedKey !== expectedKey) {
            throw new common_1.UnauthorizedException('Invalid Raspberry Pi API key');
        }
        return true;
    }
};
exports.PiApiKeyGuard = PiApiKeyGuard;
exports.PiApiKeyGuard = PiApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PiApiKeyGuard);
//# sourceMappingURL=pi-api-key.guard.js.map