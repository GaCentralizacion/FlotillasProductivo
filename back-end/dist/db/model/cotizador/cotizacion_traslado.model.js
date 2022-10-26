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
let CotizacionTraslado = class CotizacionTraslado {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacionTraslado', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "idCotizacionTraslado", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCotizacionTrasladoPadre', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "idCotizacionTrasladoPadre", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], CotizacionTraslado.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idGrupoUnidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idTraslado', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "idTraslado", void 0);
__decorate([
    typeorm_1.Column({ name: 'cantidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaEntrega', type: 'date', nullable: false }),
    __metadata("design:type", Date)
], CotizacionTraslado.prototype, "fechaEntrega", void 0);
__decorate([
    typeorm_1.Column({ name: 'costoUnitario', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "costoUnitario", void 0);
__decorate([
    typeorm_1.Column({ name: 'precioUnitario', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "precioUnitario", void 0);
__decorate([
    typeorm_1.Column({ name: 'costoTotal', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "costoTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'precioTotal', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "precioTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadTotal', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "utilidadTotal", void 0);
__decorate([
    typeorm_1.Column({ type: 'bit', nullable: false }),
    __metadata("design:type", Boolean)
], CotizacionTraslado.prototype, "idMedioTransporte", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "impuestoTransporte", void 0);
__decorate([
    typeorm_1.Column({ name: 'idProveedor', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreProveedor', type: 'varchar', length: 450, nullable: false }),
    __metadata("design:type", String)
], CotizacionTraslado.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionTraslado.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaModificacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionTraslado.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'activo', type: 'bit', nullable: true, default: 1 }),
    __metadata("design:type", Boolean)
], CotizacionTraslado.prototype, "activo", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCfdi', type: 'varchar', length: 25 }),
    __metadata("design:type", String)
], CotizacionTraslado.prototype, "idCfdi", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesServicioUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", _1.CotizacionGrupoUnidad)
], CotizacionTraslado.prototype, "grupoUnidad", void 0);
CotizacionTraslado = __decorate([
    typeorm_1.Entity({ name: 'CotizacionTraslado' })
], CotizacionTraslado);
exports.CotizacionTraslado = CotizacionTraslado;
//# sourceMappingURL=cotizacion_traslado.model.js.map