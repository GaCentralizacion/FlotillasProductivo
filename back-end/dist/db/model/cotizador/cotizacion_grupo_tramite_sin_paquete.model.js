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
let CotizacionGrupoTramiteSinPaquete = class CotizacionGrupoTramiteSinPaquete {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionGrupoTramiteSinPaquete.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionGrupoTramiteSinPaquete.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionGrupoTramiteSinPaquete.prototype, "idTramite", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionGrupoTramiteSinPaquete.prototype, "idSubtramite", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], CotizacionGrupoTramiteSinPaquete.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoTramiteSinPaquete.prototype, "nombreTramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoTramiteSinPaquete.prototype, "nombreSubtramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 450, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoTramiteSinPaquete.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoTramiteSinPaquete.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoTramiteSinPaquete.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoTramiteSinPaquete.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionGrupoTramiteSinPaquete.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesTramites),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", _1.CotizacionGrupoUnidad)
], CotizacionGrupoTramiteSinPaquete.prototype, "grupoUnidad", void 0);
CotizacionGrupoTramiteSinPaquete = __decorate([
    typeorm_1.Entity({ name: 'CotizacionGrupoTramiteSinPaquete' })
], CotizacionGrupoTramiteSinPaquete);
exports.CotizacionGrupoTramiteSinPaquete = CotizacionGrupoTramiteSinPaquete;
//# sourceMappingURL=cotizacion_grupo_tramite_sin_paquete.model.js.map