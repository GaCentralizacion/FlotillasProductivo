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
let DireccionFlotillas = class DireccionFlotillas {
};
__decorate([
    typeorm_1.PrimaryColumn({ type: 'varchar', length: 2 }),
    __metadata("design:type", String)
], DireccionFlotillas.prototype, "idDireccionFlotillas", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 30, nullable: false }),
    __metadata("design:type", String)
], DireccionFlotillas.prototype, "nombre", void 0);
DireccionFlotillas = __decorate([
    typeorm_1.Entity({ name: 'DireccionFlotillas' })
], DireccionFlotillas);
exports.DireccionFlotillas = DireccionFlotillas;
//# sourceMappingURL=direccion_flotillas.model.js.map