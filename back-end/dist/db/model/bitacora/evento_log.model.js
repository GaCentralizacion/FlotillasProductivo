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
const typeorm_1 = require("typeorm");
let EventoLog = class EventoLog {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'integer' }),
    __metadata("design:type", Number)
], EventoLog.prototype, "idEventoLog", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', nullable: false }),
    __metadata("design:type", Number)
], EventoLog.prototype, "idUsuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime' }),
    __metadata("design:type", Date)
], EventoLog.prototype, "fechaHora", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], EventoLog.prototype, "modulo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], EventoLog.prototype, "tabla", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], EventoLog.prototype, "evento", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], EventoLog.prototype, "datos", void 0);
EventoLog = __decorate([
    typeorm_1.Entity({ name: 'EventoLog', database: 'FlotillasBismLog' })
], EventoLog);
exports.EventoLog = EventoLog;
//# sourceMappingURL=evento_log.model.js.map