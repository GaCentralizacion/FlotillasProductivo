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
const ubicacion_traslado_model_1 = require("./ubicacion_traslado.model");
let Traslado = class Traslado {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], Traslado.prototype, "idTraslado", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Traslado.prototype, "idUbicacionOrigen", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Traslado.prototype, "idUbicacionDestino", void 0);
__decorate([
    typeorm_1.Column({ name: 'idMarca', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Traslado.prototype, "idMarca", void 0);
__decorate([
    typeorm_1.Column({ name: 'idEmpresa', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Traslado.prototype, "idEmpresa", void 0);
__decorate([
    typeorm_1.Column({ name: 'idSucursal', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Traslado.prototype, "idSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Traslado.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 450, nullable: false }),
    __metadata("design:type", String)
], Traslado.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], Traslado.prototype, "costoUnitario", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], Traslado.prototype, "precioUnitario", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Traslado.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], Traslado.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadTotal', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], Traslado.prototype, "utilidadTotal", void 0);
__decorate([
    typeorm_1.Column({ name: 'activo', type: 'bit', nullable: true, default: 1 }),
    __metadata("design:type", Boolean)
], Traslado.prototype, "activo", void 0);
__decorate([
    typeorm_1.OneToOne((type) => ubicacion_traslado_model_1.UbicacionTraslado, (ubicacionOrigen) => ubicacionOrigen.idUbicacionTraslado),
    typeorm_1.JoinColumn({ name: 'idUbicacionOrigen' }),
    __metadata("design:type", ubicacion_traslado_model_1.UbicacionTraslado)
], Traslado.prototype, "ubicacionOrigen", void 0);
__decorate([
    typeorm_1.OneToOne((type) => ubicacion_traslado_model_1.UbicacionTraslado, (ubicacionDestino) => ubicacionDestino.idUbicacionTraslado),
    typeorm_1.JoinColumn({ name: 'idUbicacionDestino' }),
    __metadata("design:type", ubicacion_traslado_model_1.UbicacionTraslado)
], Traslado.prototype, "ubicacionDestino", void 0);
Traslado = __decorate([
    typeorm_1.Entity({ name: 'Traslado' })
], Traslado);
exports.Traslado = Traslado;
//# sourceMappingURL=traslado.model.js.map