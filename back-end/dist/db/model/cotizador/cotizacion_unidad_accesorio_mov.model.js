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
let CotizacionUnidadAccesorioMov = class CotizacionUnidadAccesorioMov {
    constructor() {
        this.idParte = '';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: 'id', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadAccesorioMov.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idGrupoUnidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idDetalleUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "idDetalleUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idEncPaqueteAccesorio', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "idEncPaqueteAccesorio", void 0);
__decorate([
    typeorm_1.Column({ name: 'idDetPaqueteAccesorio', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "idDetPaqueteAccesorio", void 0);
__decorate([
    typeorm_1.Column({ name: 'idAccesorioNuevo', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "idAccesorioNuevo", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombre', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadAccesorioMov.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ name: 'idTipoProveedor', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CotizacionUnidadAccesorioMov.prototype, "idTipoProveedor", void 0);
__decorate([
    typeorm_1.Column({ name: 'idProveedor', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreProveedor', type: 'varchar', length: 450, nullable: true }),
    __metadata("design:type", String)
], CotizacionUnidadAccesorioMov.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.Column({ name: 'idParte', type: 'varchar', length: 27 }),
    __metadata("design:type", Object)
], CotizacionUnidadAccesorioMov.prototype, "idParte", void 0);
__decorate([
    typeorm_1.Column({ name: 'modeloAnio', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], CotizacionUnidadAccesorioMov.prototype, "modeloAnio", void 0);
__decorate([
    typeorm_1.Column({ name: 'cantidad', type: 'decimal', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'costo', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ name: 'precio', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoMovimiento', type: 'char', length: 1, nullable: false }),
    __metadata("design:type", String)
], CotizacionUnidadAccesorioMov.prototype, "tipoMovimiento", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaModificacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionUnidadAccesorioMov.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'estatusBPRO', type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], CotizacionUnidadAccesorioMov.prototype, "estatusBPRO", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionDetalleUnidad, (unidad) => unidad.accesorios),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idDetalleUnidad', referencedColumnName: 'idDetalleUnidad' }]),
    __metadata("design:type", _1.CotizacionDetalleUnidad)
], CotizacionUnidadAccesorioMov.prototype, "unidad", void 0);
CotizacionUnidadAccesorioMov = __decorate([
    typeorm_1.Entity({ name: 'CotizacionUnidadAccesorioMov' })
], CotizacionUnidadAccesorioMov);
exports.CotizacionUnidadAccesorioMov = CotizacionUnidadAccesorioMov;
//# sourceMappingURL=cotizacion_unidad_accesorio_mov.model.js.map