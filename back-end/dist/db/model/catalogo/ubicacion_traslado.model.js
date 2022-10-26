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
const traslado_model_1 = require("./traslado.model");
let UbicacionTraslado = class UbicacionTraslado {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], UbicacionTraslado.prototype, "idUbicacionTraslado", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 30, nullable: false }),
    __metadata("design:type", String)
], UbicacionTraslado.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], UbicacionTraslado.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 340, nullable: false }),
    __metadata("design:type", String)
], UbicacionTraslado.prototype, "direccion", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], UbicacionTraslado.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], UbicacionTraslado.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => traslado_model_1.Traslado, (traslado) => traslado.idUbicacionOrigen),
    typeorm_1.JoinColumn({ name: 'idUbicacionTraslado' }),
    __metadata("design:type", traslado_model_1.Traslado)
], UbicacionTraslado.prototype, "trasladoOrigen", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => traslado_model_1.Traslado, (traslado) => traslado.idUbicacionDestino),
    typeorm_1.JoinColumn({ name: 'idUbicacionTraslado' }),
    __metadata("design:type", traslado_model_1.Traslado)
], UbicacionTraslado.prototype, "trasladoDestino", void 0);
UbicacionTraslado = __decorate([
    typeorm_1.Entity({ name: 'UbicacionTraslado' })
], UbicacionTraslado);
exports.UbicacionTraslado = UbicacionTraslado;
//# sourceMappingURL=ubicacion_traslado.model.js.map