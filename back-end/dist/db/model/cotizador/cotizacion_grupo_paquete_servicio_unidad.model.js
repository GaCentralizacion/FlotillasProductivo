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
let CotizacionGrupoPaqueteServicioUnidad = class CotizacionGrupoPaqueteServicioUnidad {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idGrupoUnidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "idEncPaqueteServicioUnidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "idMarca", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "idEmpresa", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "idSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "nombreEmpresa", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 250, nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "nombreSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 40, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "catalogo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 4, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "anio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesServicioUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", _1.CotizacionGrupoUnidad)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "grupoUnidad", void 0);
__decorate([
    typeorm_1.OneToMany((type) => _1.CotizacionGrupoServicioUnidad, (cotizacionGrupoServicioUnidad) => cotizacionGrupoServicioUnidad.grupoPaqueteServicioUnidad),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idEncPaqueteServicioUnidad', referencedColumnName: 'idEncPaqueteServicioUnidad' }]),
    __metadata("design:type", Array)
], CotizacionGrupoPaqueteServicioUnidad.prototype, "serviciosUnidad", void 0);
CotizacionGrupoPaqueteServicioUnidad = __decorate([
    typeorm_1.Entity({ name: 'CotizacionGrupoPaqueteServicioUnidad' })
], CotizacionGrupoPaqueteServicioUnidad);
exports.CotizacionGrupoPaqueteServicioUnidad = CotizacionGrupoPaqueteServicioUnidad;
//# sourceMappingURL=cotizacion_grupo_paquete_servicio_unidad.model.js.map