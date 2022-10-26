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
const enc_paquete_accesorio_model_1 = require("./enc_paquete_accesorio.model");
let DetPaqueteAccesorio = class DetPaqueteAccesorio {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], DetPaqueteAccesorio.prototype, "idEncPaqueteAccesorio", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], DetPaqueteAccesorio.prototype, "idDetPaqueteAccesorio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], DetPaqueteAccesorio.prototype, "idAccesorioNuevo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], DetPaqueteAccesorio.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], DetPaqueteAccesorio.prototype, "idTipoProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], DetPaqueteAccesorio.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 450 }),
    __metadata("design:type", String)
], DetPaqueteAccesorio.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 27 }),
    __metadata("design:type", String)
], DetPaqueteAccesorio.prototype, "idParte", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], DetPaqueteAccesorio.prototype, "modeloAnio", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteAccesorio.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteAccesorio.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteAccesorio.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DetPaqueteAccesorio.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], DetPaqueteAccesorio.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => enc_paquete_accesorio_model_1.EncPaqueteAccesorio, (encabezado) => encabezado.accesorios),
    typeorm_1.JoinColumn({ name: 'idEncPaqueteAccesorio' }),
    __metadata("design:type", enc_paquete_accesorio_model_1.EncPaqueteAccesorio)
], DetPaqueteAccesorio.prototype, "encabezado", void 0);
DetPaqueteAccesorio = __decorate([
    typeorm_1.Entity({ name: 'DetPaqueteAccesorio' })
], DetPaqueteAccesorio);
exports.DetPaqueteAccesorio = DetPaqueteAccesorio;
//# sourceMappingURL=det_paquete_accesorio.model.js.map