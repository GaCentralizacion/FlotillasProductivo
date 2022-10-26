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
const _1 = require(".");
let CotizacionGrupoAccesorioSinPaquete = class CotizacionGrupoAccesorioSinPaquete {
    constructor() {
        this.idParte = '';
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorioSinPaquete.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idGrupoUnidad', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idAccesorioNuevo', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "idAccesorioNuevo", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombre', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorioSinPaquete.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ name: 'idTipoProveedor', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorioSinPaquete.prototype, "idTipoProveedor", void 0);
__decorate([
    typeorm_1.Column({ name: 'idProveedor', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreProveedor', type: 'varchar', length: 450, nullable: true }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorioSinPaquete.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idParte', type: 'varchar', length: 27 }),
    __metadata("design:type", Object)
], CotizacionGrupoAccesorioSinPaquete.prototype, "idParte", void 0);
__decorate([
    typeorm_1.Column({ name: 'modeloAnio', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorioSinPaquete.prototype, "modeloAnio", void 0);
__decorate([
    typeorm_1.Column({ name: 'cantidad', type: 'decimal', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'costo', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ name: 'precio', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaModificacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionGrupoAccesorioSinPaquete.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'enCompras', type: 'int', nullable: true }) // SISCO
    ,
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "enCompras", void 0);
__decorate([
    typeorm_1.Column({ name: 'observaciones', type: 'varchar', length: 250, nullable: true }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorioSinPaquete.prototype, "observaciones", void 0);
__decorate([
    typeorm_1.Column({ name: 'estatusSolicitud', type: 'int', nullable: true }) // SISCO
    ,
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "estatusSolicitud", void 0);
__decorate([
    typeorm_1.Column({ name: 'idAlmacen', type: 'varchar', length: 2, nullable: true }) // SISCO
    ,
    __metadata("design:type", String)
], CotizacionGrupoAccesorioSinPaquete.prototype, "idAlmacen", void 0);
__decorate([
    typeorm_1.Column({ name: 'Planta', type: 'varchar', length: 10, nullable: true }) // SISCO
    ,
    __metadata("design:type", String)
], CotizacionGrupoAccesorioSinPaquete.prototype, "Planta", void 0);
__decorate([
    typeorm_1.Column({ name: 'existencia', type: 'int', nullable: true }) // SISCO
    ,
    __metadata("design:type", Number)
], CotizacionGrupoAccesorioSinPaquete.prototype, "existencia", void 0);
__decorate([
    typeorm_1.Column({ name: 'nEstatus', type: 'varchar' }) // SISCO
    ,
    __metadata("design:type", String)
], CotizacionGrupoAccesorioSinPaquete.prototype, "nEstatus", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionGrupoUnidad, (grupoUnidad) => grupoUnidad.paquetesAccesorios),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }]),
    __metadata("design:type", _1.CotizacionGrupoUnidad)
], CotizacionGrupoAccesorioSinPaquete.prototype, "grupoUnidad", void 0);
CotizacionGrupoAccesorioSinPaquete = __decorate([
    typeorm_1.Entity({ name: 'CotizacionGrupoAccesorioSinPaquete' })
], CotizacionGrupoAccesorioSinPaquete);
exports.CotizacionGrupoAccesorioSinPaquete = CotizacionGrupoAccesorioSinPaquete;
//# sourceMappingURL=cotizacion_grupo_accesorio_sin_paquete.model.js.map