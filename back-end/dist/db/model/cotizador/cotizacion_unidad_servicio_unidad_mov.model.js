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
const _1 = require(".");
let CotizacionUnidadServicioUnidadMov = class CotizacionUnidadServicioUnidadMov {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadServicioUnidadMov.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCotizacion', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionUnidadServicioUnidadMov.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idGrupoUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadServicioUnidadMov.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idDetalleUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadServicioUnidadMov.prototype, "idDetalleUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionUnidadServicioUnidadMov.prototype, "idEncPaqueteServicioUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], CotizacionUnidadServicioUnidadMov.prototype, "idServicioUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 40, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadServicioUnidadMov.prototype, "catalogo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 4, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadServicioUnidadMov.prototype, "anio", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadServicioUnidadMov.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadServicioUnidadMov.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadServicioUnidadMov.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadServicioUnidadMov.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoMovimiento', type: 'char', length: 1, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadServicioUnidadMov.prototype, "tipoMovimiento", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadServicioUnidadMov.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionUnidadServicioUnidadMov.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'estatusBPRO', type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], CotizacionUnidadServicioUnidadMov.prototype, "estatusBPRO", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionDetalleUnidad, (detalleUnidad) => detalleUnidad.serviciosUnidadMov),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", _1.CotizacionDetalleUnidad)
], CotizacionUnidadServicioUnidadMov.prototype, "unidad", void 0);
CotizacionUnidadServicioUnidadMov = __decorate([
    typeorm_1.Entity({ name: 'CotizacionUnidadServicioUnidadMov' })
], CotizacionUnidadServicioUnidadMov);
exports.CotizacionUnidadServicioUnidadMov = CotizacionUnidadServicioUnidadMov;
//# sourceMappingURL=cotizacion_unidad_servicio_unidad_mov.model.js.map