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
const cotizacion_unidad_tramite_model_1 = require("./cotizacion_unidad_tramite.model");
let CotizacionDetalleUnidad = class CotizacionDetalleUnidad {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idGrupoUnidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idDetalleUnidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "idDetalleUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCondicion', type: 'varchar', length: 2, enum: ['C0', 'C1'] }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "idCondicion", void 0);
__decorate([
    typeorm_1.Column({ name: 'vin', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "vin", void 0);
__decorate([
    typeorm_1.Column({ name: 'idIva', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "idIva", void 0);
__decorate([
    typeorm_1.Column({ name: 'tasaIva', type: 'decimal' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "tasaIva", void 0);
__decorate([
    typeorm_1.Column({ name: 'idFinanciera', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "idFinanciera", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreFinanciera', type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "nombreFinanciera", void 0);
__decorate([
    typeorm_1.Column({ name: 'colorInteriorFacturacion', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "colorInteriorFacturacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'colorExteriorFacturacion', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "colorExteriorFacturacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCfdi', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "idCfdi", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCfdiAdicionales', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "idCfdiAdicionales", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoOrden', type: 'varchar', length: 2, enum: ['FI', 'CU'], default: null }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "tipoOrden", void 0);
__decorate([
    typeorm_1.Column({ name: 'leyendaFactura', type: 'text' }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "leyendaFactura", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaHoraPromesaEntrega', type: 'datetime' }),
    __metadata("design:type", Date)
], CotizacionDetalleUnidad.prototype, "fechaHoraPromesaEntrega", void 0);
__decorate([
    typeorm_1.Column({ name: 'costoTotal', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "costoTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'precioTotal', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "precioTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadBruta', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "utilidadBruta", void 0);
__decorate([
    typeorm_1.Column({ name: 'ivaTotal', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "ivaTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'porcentajeUtilidad', type: 'decimal' }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "porcentajeUtilidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoCargoUnidad', type: 'varchar', length: 50, default: 'Suma' }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "tipoCargoUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'imprimeFactura', type: 'bit', default: false }),
    __metadata("design:type", Boolean)
], CotizacionDetalleUnidad.prototype, "imprimeFactura", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionDetalleUnidad.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'procesadoBpro', type: 'int', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], CotizacionDetalleUnidad.prototype, "procesadoBpro", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoMovimiento', type: 'varchar', length: 10, nullable: false, default: '' }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "tipoMovimiento", void 0);
__decorate([
    typeorm_1.Column({ name: 'estatus', type: 'varchar', length: 20, nullable: true, default: '' }),
    __metadata("design:type", String)
], CotizacionDetalleUnidad.prototype, "estatus", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionGrupoUnidad, (encabezado) => encabezado.detalleUnidades),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'estatus', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", _1.CotizacionGrupoUnidad)
], CotizacionDetalleUnidad.prototype, "grupoUnidad", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionUnidadAccesorio, (accesorio) => accesorio.unidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", Array)
], CotizacionDetalleUnidad.prototype, "accesorios", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionUnidadAccesorioMov, (accesorioMov) => accesorioMov.unidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", Array)
], CotizacionDetalleUnidad.prototype, "accesoriosMov", void 0);
__decorate([
    typeorm_1.OneToMany((type) => cotizacion_unidad_tramite_model_1.CotizacionUnidadTramite, (tramite) => tramite.unidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", Array)
], CotizacionDetalleUnidad.prototype, "tramites", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionUnidadTramiteMov, (tramiteMov) => tramiteMov.unidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", Array)
], CotizacionDetalleUnidad.prototype, "tramitesMov", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionUnidadServicioUnidad, (servicioUnidad) => servicioUnidad.unidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", Array)
], CotizacionDetalleUnidad.prototype, "serviciosUnidad", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionUnidadServicioUnidadMov, (servicioUnidadMov) => servicioUnidadMov.unidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", Array)
], CotizacionDetalleUnidad.prototype, "serviciosUnidadMov", void 0);
CotizacionDetalleUnidad = __decorate([
    typeorm_1.Entity({ name: 'CotizacionDetalleUnidad' })
], CotizacionDetalleUnidad);
exports.CotizacionDetalleUnidad = CotizacionDetalleUnidad;
//# sourceMappingURL=cotizacion_detalle_unidad.model.js.map