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
let CotizacionUnidadTrasladoMov = class CotizacionUnidadTrasladoMov {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ name: 'idCotizacionTrasladoMov', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTrasladoMov.prototype, "idCotizacionTrasladoMov", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCotizacion', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionUnidadTrasladoMov.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idGrupoUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTrasladoMov.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idTraslado', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTrasladoMov.prototype, "idTraslado", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCotizacionTraslado', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionUnidadTrasladoMov.prototype, "idCotizacionTraslado", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionUnidadTrasladoMov.prototype, "usuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionUnidadTrasladoMov.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 1, nullable: true }),
    __metadata("design:type", String)
], CotizacionUnidadTrasladoMov.prototype, "tipoMovimiento", void 0);
CotizacionUnidadTrasladoMov = __decorate([
    typeorm_1.Entity({ name: 'CotizacionUnidadTrasladoMov' })
], CotizacionUnidadTrasladoMov);
exports.CotizacionUnidadTrasladoMov = CotizacionUnidadTrasladoMov;
//# sourceMappingURL=cotizacion_unidad_traslado_mov.model.js.map