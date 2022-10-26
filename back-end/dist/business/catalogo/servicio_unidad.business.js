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
class ServicioUnidadBusiness {
    getServiciosUnidad(idSucursal, catalogo, anio) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const filtroText = ``;
            yield connection.query(`exec sp_bpro_paqueser @Sucursal=${idSucursal}, @TipoBD = '1', @IdCatalogo = '${catalogo}', @Modelo = '${anio}'`)
                .then((resultadoAccesorios) => {
                const serviciosUnidad = [];
                resultadoAccesorios.map((resultado) => {
                    serviciosUnidad.push({
                        idServicioUnidad: resultado.IdPAquete.trim(),
                        nombre: resultado.NomPaquete,
                        descripcion: resultado.Descripcion,
                        costo: resultado.Costo,
                        precio: resultado.Precio,
                    });
                });
                resolve(serviciosUnidad);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getPaquetesServicioUnidad(idSucursal, catalogo = null, anio = null) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const encabezadoRepository = connection.getRepository(catalogo_1.EncPaqueteServicioUnidad);
            const condicion = { idSucursal };
            if (catalogo != undefined) {
                condicion['catalogo'] = catalogo;
            }
            if (anio != undefined) {
                condicion['anio'] = anio;
            }
            const encabezados = yield encabezadoRepository
                .find({
                relations: ['serviciosUnidad'], where: condicion,
            });
            resolve(encabezados);
        }));
    }
    savePaqueteServicioUnidad(encPaqueteServicioUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (encPaqueteServicioUnidad.serviciosUnidad == undefined || encPaqueteServicioUnidad.serviciosUnidad.length == 0) {
                reject(new ts_httpexceptions_1.Exception(409, 'Debe especificar los items que componen el paquete en la propiedad \'serviciosUnidad\''));
            }
            const connection = typeorm_1.getConnection();
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const encabezadoRepository = yield manager.getRepository(catalogo_1.EncPaqueteServicioUnidad);
                const detalleRepository = yield manager.getRepository(catalogo_1.DetPaqueteServicioUnidad);
                if (encPaqueteServicioUnidad.idEncPaqueteServicioUnidad != undefined) {
                    detalleRepository.delete({ idEncPaqueteServicioUnidad: encPaqueteServicioUnidad.idEncPaqueteServicioUnidad });
                }
                else {
                    let maxId = (yield encabezadoRepository.createQueryBuilder().select('MAX(EncPaqueteServicioUnidad.idEncPaqueteServicioUnidad)', 'max').getRawOne()).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    encPaqueteServicioUnidad.idEncPaqueteServicioUnidad = maxId;
                }
                encPaqueteServicioUnidad.serviciosUnidad.map((detItem) => {
                    detItem.idEncPaqueteServicioUnidad = encPaqueteServicioUnidad.idEncPaqueteServicioUnidad;
                });
                encPaqueteServicioUnidad.fechaModificacion = new Date();
                yield encabezadoRepository.save(encPaqueteServicioUnidad).then((encSaved) => __awaiter(this, void 0, void 0, function* () {
                    for (const detItem of encPaqueteServicioUnidad.serviciosUnidad) {
                        detItem.catalogo = encSaved.catalogo;
                        detItem.anio = encSaved.anio;
                        yield detalleRepository.save(detItem);
                    }
                    resolve(encSaved);
                }), reject);
            }));
        }));
    }
    deletePaqueteServicioUnidad(idEncPaqueteServicioUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const encabezadoRepository = connection.getRepository(catalogo_1.EncPaqueteServicioUnidad);
            encabezadoRepository.delete({ idEncPaqueteServicioUnidad }).then((deleteResult) => {
                resolve(deleteResult.affected);
            }, reject);
        }));
    }
}
exports.ServicioUnidadBusiness = ServicioUnidadBusiness;
//# sourceMappingURL=servicio_unidad.business.js.map