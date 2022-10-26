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
const det_paquete_tramite_model_1 = require("./det_paquete_tramite.model");
let EncPaqueteTramite = class EncPaqueteTramite {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], EncPaqueteTramite.prototype, "idEncPaqueteTramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], EncPaqueteTramite.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], EncPaqueteTramite.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], EncPaqueteTramite.prototype, "idMarca", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", String)
], EncPaqueteTramite.prototype, "idEmpresa", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], EncPaqueteTramite.prototype, "idSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], EncPaqueteTramite.prototype, "nombreEmpresa", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 250, nullable: false }),
    __metadata("design:type", Number)
], EncPaqueteTramite.prototype, "nombreSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], EncPaqueteTramite.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], EncPaqueteTramite.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.OneToMany((type) => det_paquete_tramite_model_1.DetPaqueteTramite, (detalle) => detalle.encabezado),
    typeorm_1.JoinColumn({ name: 'idEncPaqueteTramite' }),
    __metadata("design:type", Array)
], EncPaqueteTramite.prototype, "tramites", void 0);
EncPaqueteTramite = __decorate([
    typeorm_1.Entity({ name: 'EncPaqueteTramite' })
], EncPaqueteTramite);
exports.EncPaqueteTramite = EncPaqueteTramite;
//# sourceMappingURL=enc_paquete_tramite.model.js.map