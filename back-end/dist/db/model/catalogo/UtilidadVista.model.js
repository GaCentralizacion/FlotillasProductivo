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
let UtilidadVista = class UtilidadVista {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idsecuencia', type: 'int' }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "idsecuencia", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoStatus', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "tipoStatus", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoMovimiento', type: 'varchar', length: 150, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "tipoMovimiento", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreStep', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "nombreStep", void 0);
__decorate([
    typeorm_1.Column({ name: 'idArticulo', type: 'varchar', length: 27, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "idArticulo", void 0);
__decorate([
    typeorm_1.Column({ name: 'dsArticulo', type: 'varchar', length: 503, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "dsArticulo", void 0);
__decorate([
    typeorm_1.Column({ name: 'cantidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'precioUnitario', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "precioUnitario", void 0);
__decorate([
    typeorm_1.Column({ name: 'costoUnitario', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "costoUnitario", void 0);
__decorate([
    typeorm_1.Column({ name: 'precio', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ name: 'costo', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadUnitaria', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "utilidadUnitaria", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoOrden', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "tipoOrden", void 0);
__decorate([
    typeorm_1.Column({ name: 'idCFDI', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "idCFDI", void 0);
__decorate([
    typeorm_1.Column({ name: 'idGrupoUnidad', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadCot', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "utilidadCot", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadPost', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "utilidadPost", void 0);
__decorate([
    typeorm_1.Column({ name: 'utilidadAd', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "utilidadAd", void 0);
__decorate([
    typeorm_1.Column({ name: 'totalUtilidad', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", Number)
], UtilidadVista.prototype, "totalUtilidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'version', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], UtilidadVista.prototype, "version", void 0);
UtilidadVista = __decorate([
    typeorm_1.Entity({ name: 'UtilidadVista' })
], UtilidadVista);
exports.UtilidadVista = UtilidadVista;
//# sourceMappingURL=UtilidadVista.model.js.map