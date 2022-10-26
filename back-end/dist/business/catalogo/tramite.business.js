"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_httpexceptions_1 = require("ts-httpexceptions");
const typeorm_1 = require("typeorm");
const catalogo_1 = require("../../db/model/catalogo");
class TramiteBusiness {
    getTramites(idMarca, idSucursal, idDireccionFlotillas) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_tramites @Marca='${idMarca}', @Sucursal=${idSucursal}, @idDireccionFlotillas='${idDireccionFlotillas}'`).then((resultadosTramite) => {
                const tramites = [];
                resultadosTramite.map((resultado) => {
                    tramites.push({ idTramite: resultado.IdTramite, nombre: resultado.Descripcion });
                });
                resolve(tramites);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getSubtramites(idMarca, idSucursal, idTramite) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_bpro_subtramites @Marca='${idMarca}', @Sucursal=${idSucursal}, @IdTramite='${idTramite}'`).then((resultadosSubtramite) => {
                const subtramites = [];
                resultadosSubtramite.map((resultado) => {
                    subtramites.push({ idSubtramite: resultado.IdSubTramite, nombre: resultado.Descripcion });
                });
                resolve(subtramites);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getProveedoresSubtramite(idMarca, idSucursal, idSubtramite) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_bpro_subtramitesprov @Marca='${idMarca}', @Sucursal=${idSucursal}, @IdSubtramite='${idSubtramite}'`).then((resultadosProveedorAdicional) => {
                const proveedoresAdicional = [];
                resultadosProveedorAdicional.map((resultado) => {
                    proveedoresAdicional.push({ idProveedor: resultado.IdProveedor, nombreCompleto: resultado.Proveedor.trim(), precio: resultado.Precio, costo: resultado.Costo });
                });
                resolve(proveedoresAdicional);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getPaquetesTramite(idSucursal) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const encabezadoRepository = connection.getRepository(catalogo_1.EncPaqueteTramite);
            const encabezados = yield encabezadoRepository
                .find({
                where: { idSucursal },
                relations: ['tramites'],
            });
            resolve(encabezados);
        }));
    }
    savePaqueteTramite(encPaqueteTramite) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (encPaqueteTramite.tramites == undefined || encPaqueteTramite.tramites.length == 0) {
                reject(new ts_httpexceptions_1.Exception(409, 'Debe especificar los items que componen el paquete en la propiedad \'tramites\''));
                return;
            }
            const connection = typeorm_1.getConnection();
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const encabezadoRepository = yield manager.getRepository(catalogo_1.EncPaqueteTramite);
                const detalleRepository = yield manager.getRepository(catalogo_1.DetPaqueteTramite);
                if (encPaqueteTramite.idEncPaqueteTramite == undefined) {
                    const existeEncabezado = yield encabezadoRepository
                        .findOne({
                        where: { nombre: encPaqueteTramite.nombre, descripcion: encPaqueteTramite.descripcion },
                    });
                    if (existeEncabezado != undefined) {
                        reject(new ts_httpexceptions_1.Exception(409, 'Ya existe un paquete con este nombre y descripción'));
                        return;
                    }
                }
                if (encPaqueteTramite.idEncPaqueteTramite != undefined) {
                    detalleRepository.delete({ idEncPaqueteTramite: encPaqueteTramite.idEncPaqueteTramite });
                }
                else {
                    let maxId = (yield encabezadoRepository.createQueryBuilder().select('MAX(EncPaqueteTramite.idEncPaqueteTramite)', 'max').getRawOne()).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    encPaqueteTramite.idEncPaqueteTramite = maxId;
                }
                encPaqueteTramite.tramites.map((detItem) => {
                    detItem.idEncPaqueteTramite = encPaqueteTramite.idEncPaqueteTramite;
                });
                encPaqueteTramite.fechaModificacion = new Date();
                yield encabezadoRepository.save(encPaqueteTramite).then((encSaved) => __awaiter(this, void 0, void 0, function* () {
                    for (const detItem of encPaqueteTramite.tramites) {
                        yield detalleRepository.save(detItem);
                    }
                    resolve(encSaved);
                }), reject);
            }));
        }));
    }
    deletePaqueteTramite(idEncPaqueteTramite) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const encabezadoRepository = connection.getRepository(catalogo_1.EncPaqueteTramite);
            encabezadoRepository.delete({ idEncPaqueteTramite }).then((deleteResult) => {
                resolve(deleteResult.affected);
            }, reject);
        }));
    }
}
exports.TramiteBusiness = TramiteBusiness;
//# sourceMappingURL=tramite.business.js.map