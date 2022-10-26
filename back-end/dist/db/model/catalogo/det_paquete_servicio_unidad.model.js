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
const enc_paquete_servicio_unidad_model_1 = require("./enc_paquete_servicio_unidad.model");
let DetPaqueteServicioUnidad = class DetPaqueteServicioUnidad {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], DetPaqueteServicioUnidad.prototype, "idEncPaqueteServicioUnidad", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], DetPaqueteServicioUnidad.prototype, "idServicioUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 40, nullable: false }),
    __metadata("design:type", String)
], DetPaqueteServicioUnidad.prototype, "catalogo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 4, nullable: false }),
    __metadata("design:type", String)
], DetPaqueteServicioUnidad.prototype, "anio", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], DetPaqueteServicioUnidad.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], DetPaqueteServicioUnidad.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteServicioUnidad.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteServicioUnidad.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteServicioUnidad.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], DetPaqueteServicioUnidad.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => enc_paquete_servicio_unidad_model_1.EncPaqueteServicioUnidad, (encabezado) => encabezado.serviciosUnidad),
    typeorm_1.JoinColumn({ name: 'idEncPaqueteServicioUnidad' }),
    __metadata("design:type", enc_paquete_servicio_unidad_model_1.EncPaqueteServicioUnidad)
], DetPaqueteServicioUnidad.prototype, "encabezado", void 0);
DetPaqueteServicioUnidad = __decorate([
    typeorm_1.Entity({ name: 'DetPaqueteServicioUnidad' })
], DetPaqueteServicioUnidad);
exports.DetPaqueteServicioUnidad = DetPaqueteServicioUnidad;
//# sourceMappingURL=det_paquete_servicio_unidad.model.js.map