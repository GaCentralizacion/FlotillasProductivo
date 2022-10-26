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
let MarcaTraslados = class MarcaTraslados {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idMarca', type: 'varchar', length: 100 }),
    __metadata("design:type", Number)
], MarcaTraslados.prototype, "idMarca", void 0);
__decorate([
    typeorm_1.Column({ type: 'bit', nullable: false }),
    __metadata("design:type", Boolean)
], MarcaTraslados.prototype, "MarcaCobraPrimerTraslado", void 0);
MarcaTraslados = __decorate([
    typeorm_1.Entity({ name: 'MarcaTraslados' })
], MarcaTraslados);
exports.MarcaTraslados = MarcaTraslados;
//# sourceMappingURL=marcas_traslados.model.js.map