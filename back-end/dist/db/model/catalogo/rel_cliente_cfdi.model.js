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
let RelClienteCfdi = class RelClienteCfdi {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], RelClienteCfdi.prototype, "idCliente", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 3, nullable: false }),
    __metadata("design:type", String)
], RelClienteCfdi.prototype, "idCfdiUnidades", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 3, nullable: false }),
    __metadata("design:type", String)
], RelClienteCfdi.prototype, "idCfdiAccesorios", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], RelClienteCfdi.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], RelClienteCfdi.prototype, "fechaModificacion", void 0);
RelClienteCfdi = __decorate([
    typeorm_1.Entity({ name: 'RelClienteCfdi' })
], RelClienteCfdi);
exports.RelClienteCfdi = RelClienteCfdi;
//# sourceMappingURL=rel_cliente_cfdi.model.js.map