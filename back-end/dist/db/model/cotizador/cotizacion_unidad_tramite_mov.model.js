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
let CotizacionUnidadTramiteMov = class CotizacionUnidadTramiteMov {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTramiteMov.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCotizacion', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionUnidadTramiteMov.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idGrupoUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTramiteMov.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idDetalleUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTramiteMov.prototype, "idDetalleUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionUnidadTramiteMov.prototype, "idEncPaqueteTramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionUnidadTramiteMov.prototype, "idTramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionUnidadTramiteMov.prototype, "idSubtramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTramiteMov.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadTramiteMov.prototype, "nombreTramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadTramiteMov.prototype, "nombreSubtramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 450, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadTramiteMov.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadTramiteMov.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadTramiteMov.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoMovimiento', type: 'char', length: 1, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadTramiteMov.prototype, "tipoMovimiento", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadTramiteMov.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionUnidadTramiteMov.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'estatusBPRO', type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], CotizacionUnidadTramiteMov.prototype, "estatusBPRO", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionDetalleUnidad, (detalleUnidad) => detalleUnidad.tramitesMov),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", _1.CotizacionDetalleUnidad)
], CotizacionUnidadTramiteMov.prototype, "unidad", void 0);
CotizacionUnidadTramiteMov = __decorate([
    typeorm_1.Entity({ name: 'CotizacionUnidadTramiteMov' })
], CotizacionUnidadTramiteMov);
exports.CotizacionUnidadTramiteMov = CotizacionUnidadTramiteMov;
//# sourceMappingURL=cotizacion_unidad_tramite_mov.model.js.map