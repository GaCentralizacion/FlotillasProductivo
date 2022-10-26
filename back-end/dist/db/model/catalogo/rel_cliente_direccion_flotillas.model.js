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
let RelClienteDireccionFlotillas = class RelClienteDireccionFlotillas {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], RelClienteDireccionFlotillas.prototype, "idCliente", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ type: 'char', length: 2 }),
    __metadata("design:type", String)
], RelClienteDireccionFlotillas.prototype, "idDireccionFlotillas", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], RelClienteDireccionFlotillas.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], RelClienteDireccionFlotillas.prototype, "fechaModificacion", void 0);
RelClienteDireccionFlotillas = __decorate([
    typeorm_1.Entity({ name: 'RelClienteDireccionFlotillas' })
], RelClienteDireccionFlotillas);
exports.RelClienteDireccionFlotillas = RelClienteDireccionFlotillas;
//# sourceMappingURL=rel_cliente_direccion_flotillas.model.js.map