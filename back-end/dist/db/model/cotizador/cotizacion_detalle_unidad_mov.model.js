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
let CotizacionDetalleUnidadMov = class CotizacionDetalleUnidadMov {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idGrupoUnidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idDetalleUnidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "idDetalleUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCondicion', type: 'varchar', length: 2, enum: ['C0', 'C1'] }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "idCondicion", void 0);
__decorate([
    typeorm_1.Column({ name: 'vin', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "vin", void 0);
__decorate([
    typeorm_1.Column({ name: 'idIva', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "idIva", void 0);
__decorate([
    typeorm_1.Column({ name: 'tasaIva', type: 'decimal' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "tasaIva", void 0);
__decorate([
    typeorm_1.Column({ name: 'idFinanciera', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "idFinanciera", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreFinanciera', type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "nombreFinanciera", void 0);
__decorate([
    typeorm_1.Column({ name: 'colorInteriorFacturacion', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "colorInteriorFacturacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'colorExteriorFacturacion', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "colorExteriorFacturacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCfdi', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "idCfdi", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCfdiAdicionales', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "idCfdiAdicionales", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoOrden', type: 'varchar', length: 2, enum: ['FI', 'CU'], default: null }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "tipoOrden", void 0);
__decorate([
    typeorm_1.Column({ name: 'leyendaFactura', type: 'text' }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "leyendaFactura", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaHoraPromesaEntrega', type: 'datetime' }),
    __metadata("design:type", Date)
], CotizacionDetalleUnidadMov.prototype, "fechaHoraPromesaEntrega", void 0);
__decorate([
    typeorm_1.Column({ name: 'costoTotal', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "costoTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'precioTotal', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "precioTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadBruta', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "utilidadBruta", void 0);
__decorate([
    typeorm_1.Column({ name: 'ivaTotal', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "ivaTotal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionDetalleUnidadMov.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'procesadoBpro', type: 'int', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidadMov.prototype, "procesadoBpro", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoMovimiento', type: 'varchar', length: 10, nullable: false, default: '' }),
    __metadata("design:type", String)
], CotizacionDetalleUnidadMov.prototype, "tipoMovimiento", void 0);
CotizacionDetalleUnidadMov = __decorate([
    typeorm_1.Entity({ name: 'CotizacionDetalleUnidadMov' })
], CotizacionDetalleUnidadMov);
exports.CotizacionDetalleUnidadMov = CotizacionDetalleUnidadMov;
//# sourceMappingURL=cotizacion_detalle_unidad_mov.model.js.map