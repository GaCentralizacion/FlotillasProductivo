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
let Accesorio = class Accesorio {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 27 }),
    __metadata("design:type", String)
], Accesorio.prototype, "idParte", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], Accesorio.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Accesorio.prototype, "idAccesorioNuevo", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Accesorio.prototype, "modeloAnio", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal' }),
    __metadata("design:type", Number)
], Accesorio.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal' }),
    __metadata("design:type", Number)
], Accesorio.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], Accesorio.prototype, "existencia", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 2, nullable: true }),
    __metadata("design:type", String)
], Accesorio.prototype, "Planta", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 5, nullable: true }),
    __metadata("design:type", String)
], Accesorio.prototype, "Origen", void 0);
Accesorio = __decorate([
    typeorm_1.Entity()
], Accesorio);
exports.Accesorio = Accesorio;
//# sourceMappingURL=accesorio.model.js.map