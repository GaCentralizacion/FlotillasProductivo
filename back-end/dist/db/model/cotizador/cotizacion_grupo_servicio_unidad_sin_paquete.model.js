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
let CotizacionGrupoServicioUnidadSinPaquete = class CotizacionGrupoServicioUnidadSinPaquete {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "idServicioUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 40, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "catalogo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 4, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "anio", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesServicioUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", _1.CotizacionGrupoUnidad)
], CotizacionGrupoServicioUnidadSinPaquete.prototype, "grupoUnidad", void 0);
CotizacionGrupoServicioUnidadSinPaquete = __decorate([
    typeorm_1.Entity({ name: 'CotizacionGrupoServicioUnidadSinPaquete' })
], CotizacionGrupoServicioUnidadSinPaquete);
exports.CotizacionGrupoServicioUnidadSinPaquete = CotizacionGrupoServicioUnidadSinPaquete;
//# sourceMappingURL=cotizacion_grupo_servicio_unidad_sin_paquete.model.js.map