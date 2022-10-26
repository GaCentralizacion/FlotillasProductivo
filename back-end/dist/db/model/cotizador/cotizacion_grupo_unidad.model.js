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
const catalogo_1 = require("../catalogo");
const cotizacion_grupo_accesorio_sin_paquete_model_1 = require("./cotizacion_grupo_accesorio_sin_paquete.model");
const cotizacion_grupo_paquete_servicio_unidad_model_1 = require("./cotizacion_grupo_paquete_servicio_unidad.model");
const cotizacion_traslado_model_1 = require("./cotizacion_traslado.model");
let CotizacionGrupoUnidad = class CotizacionGrupoUnidad {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'catalogo', type: 'varchar', length: 40, nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "catalogo", void 0);
__decorate([
    typeorm_1.Column({ name: 'anio', type: 'varchar', length: 4, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "anio", void 0);
__decorate([
    typeorm_1.Column({ name: 'clase', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "clase", void 0);
__decorate([
    typeorm_1.Column({ name: 'modelo', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "modelo", void 0);
__decorate([
    typeorm_1.Column({ name: 'versionUnidad', type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "versionUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idColorInterior', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "idColorInterior", void 0);
__decorate([
    typeorm_1.Column({ name: 'colorInterior', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "colorInterior", void 0);
__decorate([
    typeorm_1.Column({ name: 'idColorExterior', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "idColorExterior", void 0);
__decorate([
    typeorm_1.Column({ name: 'colorExterior', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "colorExterior", void 0);
__decorate([
    typeorm_1.Column({ name: 'cantidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'costo', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ name: 'precio', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCondicion', type: 'varchar', length: 2, enum: ['C0', 'C1'] }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "idCondicion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idIva', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "idIva", void 0);
__decorate([
    typeorm_1.Column({ name: 'tasaIva', type: 'decimal' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "tasaIva", void 0);
__decorate([
    typeorm_1.Column({ name: 'idFinanciera', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "idFinanciera", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreFinanciera', type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "nombreFinanciera", void 0);
__decorate([
    typeorm_1.Column({ name: 'colorInteriorFacturacion', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "colorInteriorFacturacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'colorExteriorFacturacion', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "colorExteriorFacturacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCfdi', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "idCfdi", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCfdiAdicionales', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "idCfdiAdicionales", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoOrden', type: 'varchar', length: 2, enum: ['FI', 'CU'] }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "tipoOrden", void 0);
__decorate([
    typeorm_1.Column({ name: 'leyendaFactura', type: 'text' }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "leyendaFactura", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime' }),
    __metadata("design:type", Date)
], CotizacionGrupoUnidad.prototype, "fechaHoraPromesaEntrega", void 0);
__decorate([
    typeorm_1.Column({ name: 'costoTotal', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "costoTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'precioTotal', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "precioTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadBruta', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "utilidadBruta", void 0);
__decorate([
    typeorm_1.Column({ name: 'porcentajeUtilidad', type: 'decimal' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "porcentajeUtilidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'precioTotalTotal', type: 'decimal' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "precioTotalTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'ivaTotal', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "ivaTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoCargoUnidad', type: 'varchar', length: 50, default: 'Suma' }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "tipoCargoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'bonificacion', type: 'money' }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "bonificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idBonificacion', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], CotizacionGrupoUnidad.prototype, "idBonificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'imprimeFactura', type: 'bit', default: false }),
    __metadata("design:type", Boolean)
], CotizacionGrupoUnidad.prototype, "imprimeFactura", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoUnidad.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionGrupoUnidad.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.Cotizacion, (cotizacion) => cotizacion.gruposUnidades),
    typeorm_1.JoinColumn({ name: 'idCotizacion' }),
    __metadata("design:type", _1.Cotizacion)
], CotizacionGrupoUnidad.prototype, "cotizacion", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionDetalleUnidad, (detalleUnidad) => detalleUnidad.grupoUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoUnidad.prototype, "detalleUnidades", void 0);
__decorate([
    typeorm_1.OneToMany((type) => catalogo_1.UnidadInteres, (unidadesInteres) => unidadesInteres.grupoUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoUnidad.prototype, "unidadesInteres", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionGrupoPaqueteAccesorio, (grupoPaqueteAccesorio) => grupoPaqueteAccesorio.grupoUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoUnidad.prototype, "paquetesAccesorios", void 0);
__decorate([
    typeorm_1.OneToMany((type) => cotizacion_grupo_accesorio_sin_paquete_model_1.CotizacionGrupoAccesorioSinPaquete, (grupoAccesorioSinPaquete) => grupoAccesorioSinPaquete.grupoUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoUnidad.prototype, "accesoriosSinPaquete", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionGrupoPaqueteTramite, (grupoPaqueteTramite) => grupoPaqueteTramite.grupoUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoUnidad.prototype, "paquetesTramites", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionGrupoTramiteSinPaquete, (grupoTramiteSinPaquete) => grupoTramiteSinPaquete.grupoUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoUnidad.prototype, "tramitesSinPaquete", void 0);
__decorate([
    typeorm_1.OneToMany((type) => cotizacion_grupo_paquete_servicio_unidad_model_1.CotizacionGrupoPaqueteServicioUnidad, (grupoPaqueteServicioUnidad) => grupoPaqueteServicioUnidad.grupoUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoUnidad.prototype, "paquetesServicioUnidad", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionGrupoServicioUnidadSinPaquete, (grupoServicioUnidadSinPaquete) => grupoServicioUnidadSinPaquete.grupoUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoUnidad.prototype, "serviciosUnidadSinPaquete", void 0);
__decorate([
    typeorm_1.OneToMany((type) => cotizacion_traslado_model_1.CotizacionTraslado, (cotizacionTraslado) => cotizacionTraslado.grupoUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoUnidad.prototype, "traslados", void 0);
CotizacionGrupoUnidad = __decorate([
    typeorm_1.Entity({ name: 'CotizacionGrupoUnidad' })
], CotizacionGrupoUnidad);
exports.CotizacionGrupoUnidad = CotizacionGrupoUnidad;
//# sourceMappingURL=cotizacion_grupo_unidad.model.js.map