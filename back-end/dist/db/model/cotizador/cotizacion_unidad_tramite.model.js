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
let CotizacionUnidadTramite = class CotizacionUnidadTramite {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionUnidadTramite.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTramite.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idDetalleUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTramite.prototype, "idDetalleUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionUnidadTramite.prototype, "idEncPaqueteTramite", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionUnidadTramite.prototype, "idTramite", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionUnidadTramite.prototype, "idSubtramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTramite.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadTramite.prototype, "nombreTramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadTramite.prototype, "nombreSubtramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 450, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadTramite.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadTramite.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadTramite.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadTramite.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionUnidadTramite.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadTramite.prototype, "procesado", void 0);
__decorate([
    typeorm_1.Column({ name: 'cancelado', type: 'bit', nullable: true }),
    __metadata("design:type", Boolean)
], CotizacionUnidadTramite.prototype, "cancelado", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionDetalleUnidad, (detalleUnidad) => detalleUnidad.tramites),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", _1.CotizacionDetalleUnidad)
], CotizacionUnidadTramite.prototype, "unidad", void 0);
CotizacionUnidadTramite = __decorate([
    typeorm_1.Entity({ name: 'CotizacionUnidadTramite' })
], CotizacionUnidadTramite);
exports.CotizacionUnidadTramite = CotizacionUnidadTramite;
//# sourceMappingURL=cotizacion_unidad_tramite.model.js.map