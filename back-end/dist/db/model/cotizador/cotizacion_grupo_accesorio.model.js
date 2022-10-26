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
let CotizacionGrupoAccesorio = class CotizacionGrupoAccesorio {
    constructor() {
        this.idParte = '';
    }
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idCotizacion', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorio.prototype, "idCotizacion", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idGrupoUnidad', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "idGrupoUnidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'idEncPaqueteAccesorio', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "idEncPaqueteAccesorio", void 0);
__decorate([
    typeorm_1.Column({ name: 'idDetPaqueteAccesorio', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "idDetPaqueteAccesorio", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idAccesorioNuevo', type: 'int' }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "idAccesorioNuevo", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombre', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorio.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ name: 'idTipoProveedor', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorio.prototype, "idTipoProveedor", void 0);
__decorate([
    typeorm_1.Column({ name: 'idProveedor', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "idProveedor", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreProveedor', type: 'varchar', length: 450, nullable: true }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorio.prototype, "nombreProveedor", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idParte', type: 'varchar', length: 27 }),
    __metadata("design:type", Object)
], CotizacionGrupoAccesorio.prototype, "idParte", void 0);
__decorate([
    typeorm_1.Column({ name: 'modeloAnio', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], CotizacionGrupoAccesorio.prototype, "modeloAnio", void 0);
__decorate([
    typeorm_1.Column({ name: 'cantidad', type: 'decimal', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "cantidad", void 0);
__decorate([
    typeorm_1.Column({ name: 'costo', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "costo", void 0);
__decorate([
    typeorm_1.Column({ name: 'precio', type: 'money', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "precio", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaModificacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], CotizacionGrupoAccesorio.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'enCompras', type: 'int', nullable: true }) // SISCO
    ,
    __metadata("design:type", Number)
], CotizacionGrupoAccesorio.prototype, "enCompras", void 0);
__decorate([
    typeorm_1.Column({ name: 'idAlmacen', type: 'varchar', length: 3, nullable: true }) // SISCO
    ,
    __metadata("design:type", String)
], CotizacionGrupoAccesorio.prototype, "idAlmacen", void 0);
__decorate([
    typeorm_1.Column({ name: 'Planta', type: 'varchar', length: 10, nullable: true }) // SISCO
    ,
    __metadata("design:type", String)
], CotizacionGrupoAccesorio.prototype, "Planta", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => _1.CotizacionGrupoPaqueteAccesorio, (grupoPaqueteAccesorio) => grupoPaqueteAccesorio.accesorios),
    typeorm_1.JoinColumn([{ name: 'idCotizacion', referencedColumnName: 'idCotizacion' }, { name: 'idGrupoUnidad', referencedColumnName: 'idGrupoUnidad' }, { name: 'idEncPaqueteAccesorio', referencedColumnName: 'idEncPaqueteAccesorio' }]),
    __metadata("design:type", _1.CotizacionGrupoPaqueteAccesorio)
], CotizacionGrupoAccesorio.prototype, "grupoPaqueteAccesorio", void 0);
CotizacionGrupoAccesorio = __decorate([
    typeorm_1.Entity({ name: 'CotizacionGrupoAccesorio' })
], CotizacionGrupoAccesorio);
exports.CotizacionGrupoAccesorio = CotizacionGrupoAccesorio;
//# sourceMappingURL=cotizacion_grupo_accesorio.model.js.map