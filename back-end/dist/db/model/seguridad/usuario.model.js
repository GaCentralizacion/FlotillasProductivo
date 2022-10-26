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
let Usuario = class Usuario {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'int' }),
    __metadata("design:type", Number)
], Usuario.prototype, "idUsuario", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "userName", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 450, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "nombreCompleto", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "celular", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Usuario.prototype, "fechaRegistro", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Usuario.prototype, "ultimoLogin", void 0);
Usuario = __decorate([
    typeorm_1.Entity({ name: 'Usuario', database: 'FlotillasBism' })
], Usuario);
exports.Usuario = Usuario;
//# sourceMappingURL=usuario.model.js.map