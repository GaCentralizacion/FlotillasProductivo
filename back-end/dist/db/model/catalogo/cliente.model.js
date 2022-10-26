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
let Cliente = class Cliente {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Cliente.prototype, "idCliente", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 13 }),
    __metadata("design:type", String)
], Cliente.prototype, "rfc", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Cliente.prototype, "tipoPersona", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Cliente.prototype, "tipoMoral", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 450 }),
    __metadata("design:type", String)
], Cliente.prototype, "nombreCompleto", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 18 }),
    __metadata("design:type", String)
], Cliente.prototype, "curp", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 18 }),
    __metadata("design:type", String)
], Cliente.prototype, "telefono", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Cliente.prototype, "extension", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 18 }),
    __metadata("design:type", String)
], Cliente.prototype, "telefonoAlternativo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Cliente.prototype, "extensionAlternativo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 18 }),
    __metadata("design:type", String)
], Cliente.prototype, "celular", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 70 }),
    __metadata("design:type", String)
], Cliente.prototype, "correo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Cliente.prototype, "pais", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Cliente.prototype, "estado", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 40 }),
    __metadata("design:type", String)
], Cliente.prototype, "ciudad", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 60 }),
    __metadata("design:type", String)
], Cliente.prototype, "municipioAlcaldia", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Cliente.prototype, "colonia", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 70 }),
    __metadata("design:type", String)
], Cliente.prototype, "calle", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Cliente.prototype, "numeroExterior", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Cliente.prototype, "numeroInterior", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 5 }),
    __metadata("design:type", String)
], Cliente.prototype, "codigoPostal", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Cliente.prototype, "estatus", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Cliente.prototype, "tipoBase", void 0);
Cliente = __decorate([
    typeorm_1.Entity({ name: 'Cliente' })
], Cliente);
exports.Cliente = Cliente;
//# sourceMappingURL=cliente.model.js.map