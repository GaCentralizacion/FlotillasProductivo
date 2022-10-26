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
let AccesorioNuevoDireccion = class AccesorioNuevoDireccion {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], AccesorioNuevoDireccion.prototype, "idUsuarioValido", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], AccesorioNuevoDireccion.prototype, "idAccesorioNuevo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "idMarca", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], AccesorioNuevoDireccion.prototype, "idEmpresa", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], AccesorioNuevoDireccion.prototype, "idSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "idTipoProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "idDireccionFlotillas", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "nombreEmpresa", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 250, nullable: false }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "nombreSucursal", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 450, nullable: false }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "modeloAnio", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], AccesorioNuevoDireccion.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'money', nullable: false }),
    __metadata("design:type", Number)
], AccesorioNuevoDireccion.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], AccesorioNuevoDireccion.prototype, "idUsuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], AccesorioNuevoDireccion.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 5 }),
    __metadata("design:type", String)
], AccesorioNuevoDireccion.prototype, "Origen", void 0);
AccesorioNuevoDireccion = __decorate([
    typeorm_1.Entity({ name: 'AccesorioNuevoDireccion' })
], AccesorioNuevoDireccion);
exports.AccesorioNuevoDireccion = AccesorioNuevoDireccion;
//# sourceMappingURL=accesorio_nuevo_direccion.js.map