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
let Cotizacion = class Cotizacion {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idDireccionFlotillas', type: 'varchar', length: 2, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idDireccionFlotillas", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCliente', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "idCliente", void 0);
__decorate([
    typeorm_1.Column({ name: 'idClienteContacto', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "idClienteContacto", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreCliente', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombreCliente", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCondicion', type: 'varchar', length: 2, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idCondicion", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreCondicion', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombreCondicion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idEmpresa', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "idEmpresa", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreEmpresa', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombreEmpresa", void 0);
__decorate([
    typeorm_1.Column({ name: 'idMarca', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idMarca", void 0);
__decorate([
    typeorm_1.Column({ name: 'idSucursal', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "idSucursal", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreSucursal', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombreSucursal", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuario', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "idUsuario", void 0);
__decorate([
    typeorm_1.Column({ name: 'unidades', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "unidades", void 0);
__decorate([
    typeorm_1.Column({ name: 'idLicitacion', type: 'varchar', length: 15, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idLicitacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idFinanciera', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "idFinanciera", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreFinanciera', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombreFinanciera", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreTipoVenta', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombreTipoVenta", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreMoneda', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombreMoneda", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreIva', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombreIva", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreContacto', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cotizacion.prototype, "nombreContacto", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCfdi', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idCfdi", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCfdiAdicionales', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idCfdiAdicionales", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoOrden', type: 'varchar', length: 2, enum: ['FI', 'CU'] }),
    __metadata("design:type", String)
], Cotizacion.prototype, "tipoOrden", void 0);
__decorate([
    typeorm_1.Column({ name: 'status', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Cotizacion.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ name: 'step', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "step", void 0);
__decorate([
    typeorm_1.Column({ name: 'costoTotal', type: 'money' }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "costoTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'precioTotal', type: 'money' }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "precioTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadBruta', type: 'money' }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "utilidadBruta", void 0);
__decorate([
    typeorm_1.Column({ name: 'numeroOrden', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "numeroOrden", void 0);
__decorate([
    typeorm_1.Column({ name: 'idTipoVenta', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idTipoVenta", void 0);
__decorate([
    typeorm_1.Column({ name: 'idMonedaVenta', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idMonedaVenta", void 0);
__decorate([
    typeorm_1.Column({ name: 'idIva', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "idIva", void 0);
__decorate([
    typeorm_1.Column({ name: 'tasaIva', type: 'decimal' }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "tasaIva", void 0);
__decorate([
    typeorm_1.Column({ name: 'ivaTotal', type: 'decimal' }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "ivaTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'porcentajeUtilidad', type: 'decimal' }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "porcentajeUtilidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], Cotizacion.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'procesadoBpro', type: 'int', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "procesadoBpro", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoCargoUnidad', type: 'varchar', length: 50, default: 'Suma' }),
    __metadata("design:type", String)
], Cotizacion.prototype, "tipoCargoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'clienteOriginal', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "clienteOriginal", void 0);
__decorate([
    typeorm_1.Column({ name: 'notificacion', type: 'bit', nullable: true }),
    __metadata("design:type", Boolean)
], Cotizacion.prototype, "notificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'imprimeFactura', type: 'bit', default: false }),
    __metadata("design:type", Boolean)
], Cotizacion.prototype, "imprimeFactura", void 0);
__decorate([
    typeorm_1.Column({ name: 'idClienteFacturaAdicionales', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "idClienteFacturaAdicionales", void 0);
__decorate([
    typeorm_1.Column({ name: 'numeroOCAdicionales', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Cotizacion.prototype, "numeroOCAdicionales", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionGrupoUnidad, (gruposUnidades) => gruposUnidades.cotizacion),
    typeorm_1.JoinColumn({ name: 'idCotizacion' }),
    __metadata("design:type", Array)
], Cotizacion.prototype, "gruposUnidades", void 0);
Cotizacion = __decorate([
    typeorm_1.Entity({ name: 'Cotizacion' })
], Cotizacion);
exports.Cotizacion = Cotizacion;
//# sourceMappingURL=cotizacion.model.js.map