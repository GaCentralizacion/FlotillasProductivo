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
const det_paquete_servicio_unidad_model_1 = require("./det_paquete_servicio_unidad.model");
let EncPaqueteServicioUnidad = class EncPaqueteServicioUnidad {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], EncPaqueteServicioUnidad.prototype, "idEncPaqueteServicioUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], EncPaqueteServicioUnidad.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], EncPaqueteServicioUnidad.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], EncPaqueteServicioUnidad.prototype, "idMarca", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", String)
], EncPaqueteServicioUnidad.prototype, "idEmpresa", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], EncPaqueteServicioUnidad.prototype, "idSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], EncPaqueteServicioUnidad.prototype, "nombreEmpresa", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 250, nullable: false }),
    __metadata("design:type", Number)
], EncPaqueteServicioUnidad.prototype, "nombreSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 40, nullable: false }),
    __metadata("design:type", String)
], EncPaqueteServicioUnidad.prototype, "catalogo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 4, nullable: false }),
    __metadata("design:type", String)
], EncPaqueteServicioUnidad.prototype, "anio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], EncPaqueteServicioUnidad.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], EncPaqueteServicioUnidad.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.OneToMany((type) => det_paquete_servicio_unidad_model_1.DetPaqueteServicioUnidad, (detalle) => detalle.encabezado),
    typeorm_1.JoinColumn({ name: 'idEncPaqueteServicioUnidad' }),
    __metadata("design:type", Array)
], EncPaqueteServicioUnidad.prototype, "serviciosUnidad", void 0);
EncPaqueteServicioUnidad = __decorate([
    typeorm_1.Entity({ name: 'EncPaqueteServicioUnidad' })
], EncPaqueteServicioUnidad);
exports.EncPaqueteServicioUnidad = EncPaqueteServicioUnidad;
//# sourceMappingURL=enc_paquete_servicio_unidad.model.js.map