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
const enc_paquete_tramite_model_1 = require("./enc_paquete_tramite.model");
let DetPaqueteTramite = class DetPaqueteTramite {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], DetPaqueteTramite.prototype, "idEncPaqueteTramite", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], DetPaqueteTramite.prototype, "idTramite", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], DetPaqueteTramite.prototype, "idSubtramite", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], DetPaqueteTramite.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], DetPaqueteTramite.prototype, "nombreTramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], DetPaqueteTramite.prototype, "nombreSubtramite", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 450, nullable: false }),
    __metadata("design:type", String)
], DetPaqueteTramite.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteTramite.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteTramite.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteTramite.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], DetPaqueteTramite.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => enc_paquete_tramite_model_1.EncPaqueteTramite, (encabezado) => encabezado.tramites),
    typeorm_1.JoinColumn({ name: 'idEncPaqueteTramite' }),
    __metadata("design:type", enc_paquete_tramite_model_1.EncPaqueteTramite)
], DetPaqueteTramite.prototype, "encabezado", void 0);
DetPaqueteTramite = __decorate([
    typeorm_1.Entity({ name: 'DetPaqueteTramite' })
], DetPaqueteTramite);
exports.DetPaqueteTramite = DetPaqueteTramite;
//# sourceMappingURL=det_paquete_tramite.model.js.map