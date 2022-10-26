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
let FacturacionUnidad = class FacturacionUnidad {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FacturacionUnidad.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'vin', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FacturacionUnidad.prototype, "vin", void 0);
__decorate([
    typeorm_1.Column({ name: 'unidadFacturada', type: 'bit', nullable: false }),
    __metadata("design:type", Boolean)
], FacturacionUnidad.prototype, "unidadFacturada", void 0);
FacturacionUnidad = __decorate([
    typeorm_1.Entity({ name: 'FacturacionUnidad' })
], FacturacionUnidad);
exports.FacturacionUnidad = FacturacionUnidad;
//# sourceMappingURL=facturacion_unidad.js.map