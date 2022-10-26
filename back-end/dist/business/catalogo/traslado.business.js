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
const typeorm_1 = require("typeorm");
const catalogo_1 = require("../../db/model/catalogo");
const cotizador_1 = require("./../../db/model/cotizador");
class TrasladoBusiness {
    getTraslado() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const trasladoRepository = connection.getRepository(catalogo_1.Traslado);
            yield trasladoRepository.find({
                relations: [
                    'ubicacionOrigen',
                    'ubicacionDestino',
                ],
                where: { activo: 1 },
            })
                .then((traslado) => {
                resolve(traslado);
            })
                .catch(reject);
        }));
    }
    saveTraslados(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            for (const ele of data) {
                const connection = typeorm_1.getConnection();
                yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                    const trasladoRepository = yield manager.getRepository(catalogo_1.Traslado);
                    if (ele.idTraslado != undefined) {
                        yield trasladoRepository.save(ele).then((res) => {
                            resolve(res);
                        }, (err) => {
                            reject(err);
                        });
                    }
                    else {
                        let maxId = (yield trasladoRepository.createQueryBuilder().select('MAX(Traslado.idTraslado)', 'max').getRawOne()).max;
                        maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                        ele.idTraslado = maxId;
                        yield trasladoRepository.save(ele).then((res) => {
                            resolve(res);
                        }, (err) => {
                            reject(err);
                        });
                    }
                }));
            }
        }));
    }
    removeTraslado(idTraslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const trasladoRepository = yield manager.getRepository(catalogo_1.Traslado);
                yield trasladoRepository.delete({ idTraslado }).then((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }));
        }));
    }
    // OCT 99 20201204 TRASLADOS POSTERIORES
    postGuardaTrasladoPosterior(traslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            console.log('>>>> traslado: ', traslado);
            const idCotizacion = traslado.idCotizacion;
            /*
            const idCotizacionTraslado = traslado.idCotizacionTraslado;
            const idGrupoUnidad = traslado.idGrupoUnidad;
            const idAccesorioNuevo = traslado.idAccesorioNuevo;
            const idParte = traslado.idParte;
            const tipoOrden = traslado.tipoOrden;
            const tipoCargoUnidad = traslado.tipoCargoUnidad;
            const imprimeFactura = traslado.imprimeFactura;
            const idCfdi = traslado.idCfdi;
            */
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_GuardaTrasladoPosterior @idCotizacion = '${idCotizacion}'`);
                /*+ `', @idGrupoUnidad  = '${idGrupoUnidad}`
                + `', @idAccesorioNuevo  = '${idAccesorioNuevo}`
                + `', @idParte   = '${idParte}`
                + `', @tipoOrden  = '${tipoOrden}`
                + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                + `', @imprimeFactura  = '${imprimeFactura}`
                + `', @idCfdi  = '${idCfdi}'`);*/
                resolve(respuesta);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 20201204 LISTA VINES TRASLADOS
    getListaVinesTraslados(idCotizacion) {
        console.log(idCotizacion);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ListaVinesTraslados @idCotizacion = '${idCotizacion}'`);
                resolve(respuesta);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 20201214 lista unidades configuradas para armar traslados posteriores
    getListaUnidadesConfiguradas(idCotizacion) {
        console.log(idCotizacion);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ListadoUnidadesConfiguradas @idCotizacion = '${idCotizacion}'`);
                resolve(respuesta);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 20201215 lista traslados por cotizacion en posteriores
    getListadoTrasladosCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_listadoTrasladosCotizacion @idCotizacion = '${idCotizacion}'`);
                resolve(respuesta);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 20201214 Obtiene datos de traslado posterior
    getDatosTraslado(idCotizacion, idCotizacionTraslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_DatosTraslado @idCotizacion = '${idCotizacion}`
                    + `', @idCotizacionTraslado  = '${idCotizacionTraslado}'`);
                resolve(respuesta);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 20201214 LISTA UNIDADES VINES TRASLADOS
    getListaUnidadesTraslados(idCotizacion) {
        console.log(idCotizacion);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ListaVinesTraslados @idCotizacion = '${idCotizacion}`);
                resolve(respuesta);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 20201204 TRASLADOS POSTERIORES
    postInsertaTrasladosMovs(traslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            yield connectionVRC.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = manager.getRepository(cotizador_1.Cotizacion);
                const cotizacion = yield cotizacionRepository.findOne({ idCotizacion: traslado.idCotizacion });
                const queryRunnerVRC = connectionVRC.createQueryRunner();
                yield queryRunnerVRC.connect();
                const utilidadTotal = (((traslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)) - traslado.costoTotal) / ((traslado.precioTotal == 0) ? 1 : (traslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)))) * 100;
                try {
                    const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_InsertaTrasladoMov @idCotizacionTrasladoPadre = '${traslado.idCotizacionTrasladoPadre}`
                        + `', @idCotizacion  = '${traslado.idCotizacion}`
                        + `', @vins  = '${traslado.vins}`
                        + `', @idTraslado   = '${traslado.idTraslado}`
                        + `', @idUbicacionOrigen   = '${traslado.idUbicacionOrigen}`
                        + `', @idUbicacionDestino   = '${traslado.idUbicacionDestino}`
                        + `', @cantidad  = '${traslado.cantidad}`
                        + `', @fechaEntrega  = '${traslado.fechaEntrega}`
                        + `', @costoUnitario  = '${traslado.costoUnitario}`
                        + `', @costoTotal  = '${traslado.costoTotal}`
                        + `', @precioUnitario = '${traslado.precioUnitario}`
                        + `', @precioTotal  = '${traslado.precioTotal}`
                        + `', @idProveedor  = '${traslado.idProveedor}`
                        + `', @nombreProveedor  = '${traslado.nombreProveedor}`
                        + `', @idUsuario  = '${traslado.idUsuario}`
                        + `', @idMedioTransporte  = '${traslado.idMedioTransporte}`
                        + `', @impuestoTransporte  = '${traslado.impuestoTransporte}`
                        + `', @utilidadTotal  = '${utilidadTotal}`
                        + `', @tipoOrden  = '${traslado.tipoOrden}`
                        + `', @idCfdi  = '${traslado.idCfdi}'`);
                    resolve(respuesta);
                }
                catch (error) {
                    reject(error);
                }
                finally {
                    yield queryRunnerVRC.release();
                }
            }));
        }));
    }
    // OCT 99 20210106 Elimina traslados posteriores de MOV antes de haber enviado a BPRO
    eliminaTrasladoPosteriorMov(traslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            console.log('>>>>>traslado', traslado);
            const idCotizacionTraslado = traslado.idCotizacionTraslado;
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_EliminarTrasladoPosteriorMov @idCotizacionTraslado = '${idCotizacionTraslado}'`);
                resolve(respuesta);
            }
            catch (error) {
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // CHK - 07 ene 2021 Lista traslados mov
    getListarTrasladosPosteriores(idCotizacion) {
        console.log('getListarTrasladosPosteriores', idCotizacion);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ListarTrasladosPosteriores @idCotizacion = '${idCotizacion}'`);
                resolve(respuesta);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 20210302 obtiene listado del traslado en modal para consultar/editar traslados POSTAD
    getListadoTrasladoDetallePost(idCotizacion, idCotizacionTraslado) {
        console.log('getListadoTrasladoDetallePost', idCotizacion);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            console.log('getListadoTrasladoDetallePost');
            console.log('idCotizacionTraslado ' + idCotizacionTraslado);
            console.log('idCotizacion ' + idCotizacion);
            console.log('sp_Flotillas_ListadoTrasladoDetallePost');
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ListadoTrasladoDetallePost @idCotizacion = '${idCotizacion}`
                    + `', @idCotizacionTraslado  = '${idCotizacionTraslado}'`);
                console.log(respuesta);
                resolve(respuesta);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 20210308 obtiene listado del traslado en modal para editar traslados POSTAD
    getObtenerDatosEdicionTrasladoPost(idCotizacion, idCotizacionTraslado) {
        console.log('getObtenerDatosEdicionTrasladoPost', idCotizacion);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            console.log('getObtenerDatosEdicionTrasladoPost');
            console.log('idCotizacionTraslado ' + idCotizacionTraslado);
            console.log('idCotizacion ' + idCotizacion);
            console.log('sp_Flotillas_ObtenerDatosEdicionTrasladoPost');
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ObtenerDatosEdicionTrasladoPost @idCotizacion = '${idCotizacion}`
                    + `', @idCotizacionTraslado  = '${idCotizacionTraslado}'`);
                console.log(respuesta);
                resolve(respuesta);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 20210308 edicion de traslado posterior
    postEditaTrasladosMovs(traslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            yield connectionVRC.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = manager.getRepository(cotizador_1.Cotizacion);
                const cotizacion = yield cotizacionRepository.findOne({ idCotizacion: traslado.idCotizacion });
                const queryRunnerVRC = connectionVRC.createQueryRunner();
                yield queryRunnerVRC.connect();
                console.log('postEditaTrasladosMovs');
                console.log(traslado);
                const utilidadTotal = (((traslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)) - traslado.costoTotal) / ((traslado.precioTotal == 0) ? 1 : (traslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)))) * 100;
                try {
                    const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTrasladoPosterior @idCotizacionTraslado = '${traslado.idCotizacionTraslado}`
                        + `', @idCotizacion  = '${traslado.idCotizacion}`
                        // + `', @vins  = '${traslado.vins}`
                        + `', @idTraslado   = '${traslado.idTraslado}`
                        + `', @idUbicacionOrigen   = '${traslado.idUbicacionOrigen}`
                        + `', @idUbicacionDestino   = '${traslado.idUbicacionDestino}`
                        + `', @cantidad  = '${traslado.cantidad}`
                        + `', @fechaEntrega  = '${traslado.fechaEntrega}`
                        + `', @costoUnitario  = '${traslado.costoUnitario}`
                        + `', @costoTotal  = '${traslado.costoTotal}`
                        + `', @precioUnitario = '${traslado.precioUnitario}`
                        + `', @precioTotal  = '${traslado.precioTotal}`
                        + `', @idProveedor  = '${traslado.idProveedor}`
                        + `', @nombreProveedor  = '${traslado.nombreProveedor}`
                        + `', @idUsuario  = '${traslado.idUsuario}`
                        + `', @idMedioTransporte  = '${traslado.idMedioTransporte}`
                        + `', @impuestoTransporte  = '${traslado.impuestoTransporte}`
                        + `', @utilidadTotal  = '${utilidadTotal}`
                        + `', @tipoOrden  = '${traslado.tipoOrden}`
                        + `', @idCfdi  = '${traslado.idCfdi}'`);
                    resolve(respuesta);
                }
                catch (error) {
                    reject(error);
                }
                finally {
                    yield queryRunnerVRC.release();
                }
            }));
        }));
    }
}
exports.TrasladoBusiness = TrasladoBusiness;
//# sourceMappingURL=traslado.business.js.map