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
let InventarioUnidad = class InventarioUnidad {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'IdInventario', type: 'int' }),
    __metadata("design:type", Number)
], InventarioUnidad.prototype, "idInventario", void 0);
__decorate([
    typeorm_1.Column({ name: 'TipoUnidad', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "tipoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'Año', type: 'varchar', length: 4, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "anio", void 0);
__decorate([
    typeorm_1.Column({ name: 'Modelo', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "modelo", void 0);
__decorate([
    typeorm_1.Column({ name: 'ColorInteriorC', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "idColorInterior", void 0);
__decorate([
    typeorm_1.Column({ name: 'ColorInterior', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "colorInterior", void 0);
__decorate([
    typeorm_1.Column({ name: 'ColorExteriorC', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "idColorExterior", void 0);
__decorate([
    typeorm_1.Column({ name: 'ColorExterior', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "colorExterior", void 0);
__decorate([
    typeorm_1.Column({ name: 'Clase', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "clase", void 0);
__decorate([
    typeorm_1.Column({ name: 'Catalogo', type: 'varchar', length: 40, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "catalogo", void 0);
__decorate([
    typeorm_1.Column({ name: 'PrecioUnidad', type: 'decimal', nullable: false }),
    __metadata("design:type", Number)
], InventarioUnidad.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ name: 'CostoUnidad', type: 'decimal', nullable: false }),
    __metadata("design:type", Number)
], InventarioUnidad.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ name: 'CantidadInventario', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], InventarioUnidad.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'Marca', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "marca", void 0);
__decorate([
    typeorm_1.Column({ name: 'Antiguedad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], InventarioUnidad.prototype, "antiguedad", void 0);
__decorate([
    typeorm_1.Column({ name: 'Segmento', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "segmento", void 0);
__decorate([
    typeorm_1.Column({ name: 'Descripcion', type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "descripcion", void 0);
__decorate([
    typeorm_1.Column({ name: 'Agencia', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "agencia", void 0);
__decorate([
    typeorm_1.Column({ name: 'ClasifTipoCompra', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "clasificacionTipoCompra", void 0);
__decorate([
    typeorm_1.Column({ name: 'VIN', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "vin", void 0);
__decorate([
    typeorm_1.Column({ name: 'IdEmpresa', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], InventarioUnidad.prototype, "idEmpresa", void 0);
__decorate([
    typeorm_1.Column({ name: 'IdSucursal', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], InventarioUnidad.prototype, "idSucursal", void 0);
__decorate([
    typeorm_1.Column({ name: 'Bd', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "bd", void 0);
__decorate([
    typeorm_1.Column({ name: 'TipoBase', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "tipoBase", void 0);
__decorate([
    typeorm_1.Column({ name: 'IdCottizacionGlobal', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'Situacion', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], InventarioUnidad.prototype, "estatusUnidad", void 0);
InventarioUnidad = __decorate([
    typeorm_1.Entity()
], InventarioUnidad);
exports.InventarioUnidad = InventarioUnidad;
//# sourceMappingURL=inventario_unidad.model.js.map