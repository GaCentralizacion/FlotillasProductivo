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
let CotOrdencomprefaccionesdet = class CotOrdencomprefaccionesdet {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'ocrd_idordencomprefacciones', type: 'int' }),
    __metadata("design:type", Number)
], CotOrdencomprefaccionesdet.prototype, "ocrd_idordencomprefacciones", void 0);
__decorate([
    typeorm_1.Column({ name: 'ocrd_idparte', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], CotOrdencomprefaccionesdet.prototype, "ocrd_idparte", void 0);
__decorate([
    typeorm_1.Column({ name: 'ocrd_desparte', type: 'varchar', length: 250, nullable: false }),
    __metadata("design:type", Number)
], CotOrdencomprefaccionesdet.prototype, "ocrd_desparte", void 0);
__decorate([
    typeorm_1.Column({ name: 'ocrd_cantidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotOrdencomprefaccionesdet.prototype, "ocrd_cantidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'ocrd_costo', type: 'int', nullable: false }),
    __metadata("design:type", String)
], CotOrdencomprefaccionesdet.prototype, "ocrd_costo", void 0);
__decorate([
    typeorm_1.Column({ name: 'ocr_idordencomprefacciones', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotOrdencomprefaccionesdet.prototype, "ocr_idordencomprefacciones", void 0);
__decorate([
    typeorm_1.Column({ name: 'ocrd_idparteflo', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], CotOrdencomprefaccionesdet.prototype, "ocrd_idparteflo", void 0);
__decorate([
    typeorm_1.Column({ name: 'ocrd_estatus', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotOrdencomprefaccionesdet.prototype, "ocrd_estatus", void 0);
__decorate([
    typeorm_1.Column({ name: 'ocrd_fechasol', type: 'date' }),
    __metadata("design:type", Date)
], CotOrdencomprefaccionesdet.prototype, "ocrd_fechasol", void 0);
__decorate([
    typeorm_1.Column({ name: 'ocrd_fechafin', type: 'date' }),
    __metadata("design:type", Date)
], CotOrdencomprefaccionesdet.prototype, "ocrd_fechafin", void 0);
CotOrdencomprefaccionesdet = __decorate([
    typeorm_1.Entity({ name: 'cot_ordencomprefaccionesdet' })
], CotOrdencomprefaccionesdet);
exports.CotOrdencomprefaccionesdet = CotOrdencomprefaccionesdet;
//# sourceMappingURL=ordenes_de_compra_refacciones.model.js.map