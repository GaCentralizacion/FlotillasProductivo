"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = __importStar(require("nodemailer"));
const typeorm_1 = require("typeorm");
const catalogo_1 = require("../..//db/model/catalogo");
const cotizador_1 = require("../../db/model/cotizador");
const repositorio_1 = require("../repositorio");
class CotizadorBussiness {
    getAllCotizaciones() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.manager.find(cotizador_1.Cotizacion, { order: { fechaModificacion: 'DESC' } }).then((cotizaciones) => __awaiter(this, void 0, void 0, function* () {
                resolve(cotizaciones);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getCotizacionesByIdLicitacion(idLicitacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.manager.find(cotizador_1.Cotizacion, { idLicitacion }).then((cotizaciones) => __awaiter(this, void 0, void 0, function* () {
                // tslint:disable-next-line: prefer-for-of
                for (let index = 0; index < cotizaciones.length; index++) {
                    yield connection.query(`EXEC [dbo].[sp_flotillas_catalogos]
                        @idSucursal=${cotizaciones[index].idSucursal},
                        @idDireccionFlotillas=${cotizaciones[index].idDireccionFlotillas},
                        @idIva=${cotizaciones[index].idIva},
                        @idMonedaVenta=${cotizaciones[index].idMonedaVenta},
                        @idTipoVenta=${cotizaciones[index].idTipoVenta}`).then((datos) => __awaiter(this, void 0, void 0, function* () {
                        cotizaciones[index].nombreTipoVenta = datos[0].nombreTipoVenta;
                        cotizaciones[index].nombreMoneda = datos[0].nombreMoneda;
                        cotizaciones[index].nombreIva = datos[0].nombreIva;
                    }), (error) => { reject(error); });
                }
                resolve(cotizaciones);
            }), (error) => {
                reject(error);
            });
        }));
    }
    getAllCotizacionesByIdFlotillas(idDireccionFlotillas) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_ListadoCotizaEstatus @idDireccionFlotilla = '${idDireccionFlotillas}'`)
                .then((listadoCotizaciones) => __awaiter(this, void 0, void 0, function* () {
                if (!listadoCotizaciones.length) {
                    reject({ status: 404, error: `No se ha obtenido el listado de cotizaciones` });
                }
                const ordenesDeCompra = listadoCotizaciones.filter((cotizacion) => cotizacion.status === 'ORDENES DE COMPRA PENDIENTES');
                if (!ordenesDeCompra.length) {
                    // console.error(`No se ha obtenido el listado de cotizaciones con status ordenes de compra pendientes`);
                    // reject({status: 404, error: `No se ha obtenido el listado de cotizaciones con status ordenes de compra pendientes`});
                }
                else {
                    for (const ordenCompra of ordenesDeCompra) {
                        yield connection.query(`exec sp_Flotillas_OrdCompraCompletas @idCotizacion = '${ordenCompra.idCotizacion}'`)
                            .then((result) => __awaiter(this, void 0, void 0, function* () {
                            if (true) { // (result.length > 0 && result[0].Success && (result[0].Success === 1 || result[0].Success === '1'))
                                yield connection.query(`exec sp_flotillas_aestatus @idCotizacion = '${ordenCompra.idCotizacion}'`)
                                    .then((status) => __awaiter(this, void 0, void 0, function* () {
                                    if (status.length > 0 && status[0].Success && (status[0].Success === 0 || status[0].Success === '0')) {
                                        reject({ status: 400, error: `La cotizacion con id ${ordenCompra.idCotizacion} no se ha podido actualizar el status con el procedimientos aestatus` });
                                    }
                                }))
                                    .catch(reject);
                            }
                            else {
                                reject({ status: 400, error: `La cotizacion con id ${ordenCompra.idCotizacion} no se ha encontrado dentro de BPRO con el procedimientos OrdCompraCompletas` });
                            }
                        }))
                            .catch(reject);
                    }
                }
                yield connection.query(`exec sp_Flotillas_ListadoCotizaEstatus @idDireccionFlotilla = '${idDireccionFlotillas}'`)
                    .then((cotizaciones) => {
                    if (!listadoCotizaciones.length) {
                        reject({ status: 404, error: `No se ha obtenido el listado de cotizaciones 2` });
                    }
                    resolve(cotizaciones);
                })
                    .catch(reject);
            }))
                .catch(reject);
        }));
    }
    // Envio de Correo LBM*
    getConsultaCorreosCompras(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionRGC = typeorm_1.getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            yield queryRunnerRGC.connect();
            try { // sp_Prueba
                const validacion = yield queryRunnerRGC.query(`exec sp_Flotillas_ObtenCorreoCompras @idCotizacion = '${idCotizacion}'`);
                resolve(validacion);
            }
            catch (error) {
                console.log('getConsultaCorreosCompras ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerRGC.release();
            }
        }));
    }
    getAllCotizacionesByIdFlotillasByUser(idDireccionFlotillas, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.manager.find(cotizador_1.Cotizacion, { idDireccionFlotillas, idUsuario }).then((cotizaciones) => __awaiter(this, void 0, void 0, function* () {
                resolve(cotizaciones);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getStatusBproUnidad(idCotizacion, cotizacion, queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let count = 0;
                const status = yield queryRunner.query(`exec sp_Flotillas_EstatusporUnidad @idCotizacion = '${idCotizacion}'`);
                if (!status.length) {
                    resolve(cotizacion);
                }
                cotizacion.gruposUnidades.map((grupoUnidad) => {
                    return grupoUnidad.detalleUnidades.map((detalleUnidad, index) => {
                        const estatus = status[count];
                        count++;
                        if (estatus.idGrupoUnidad === detalleUnidad.idGrupoUnidad && estatus.idDetalleUnidad === detalleUnidad.idDetalleUnidad) {
                            detalleUnidad.estatus = estatus.cec_descripcion;
                            return detalleUnidad;
                        }
                        else {
                            return detalleUnidad;
                        }
                    });
                });
                resolve(cotizacion);
            }));
        });
    }
    // OC99
    getAdicionalesCierrebyIdCotizacionGrupoUnidad(idCotizacion, idGrupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const adicionales = [];
            const connectionGU = typeorm_1.getConnection();
            const queryRunnerGU = connectionGU.createQueryRunner();
            yield queryRunnerGU.connect();
            try {
                // const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunnerGU);
                const accesorios = yield queryRunnerGU.query(`exec sp_Flotillas_ObtieneAccesorios @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const tramites = yield queryRunnerGU.query(`exec sp_Flotillas_ObtieneTramites @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const servicios = yield queryRunnerGU.query(`exec sp_Flotillas_ObtieneServicios @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const accesoriosMov = yield queryRunnerGU.query(`exec Sp_flotillas_obtieneAccesoriosMov @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const tramitesMov = yield queryRunnerGU.query(`exec sp_Flotillas_ObtieneTramitesMov @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const serviciosMov = yield queryRunnerGU.query(`exec Sp_flotillas_obtieneServiciosMov @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const accesoriosSinPaquete = yield queryRunnerGU.query(`exec sp_Flotillas_ObtieneAccesorioSinPaquete @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const tramitesSinPaquete = yield queryRunnerGU.query(`exec sp_Flotillas_ObtieneTramiteSinPaquete @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const serviciosSinPaquete = yield queryRunnerGU.query(`exec sp_Flotillas_ObtieneServicioUnidadSinPaquete @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                adicionales.push(accesorios); // 0
                adicionales.push(tramites); // 1
                adicionales.push(servicios); // 2
                // MOV
                adicionales.push(accesoriosMov); // 3
                adicionales.push(tramitesMov); // 4
                adicionales.push(serviciosMov); // 5
                // SIN PAQUETE
                adicionales.push(accesoriosSinPaquete); // 6
                adicionales.push(tramitesSinPaquete); // 7
                adicionales.push(serviciosSinPaquete); // 8
                resolve(adicionales);
            }
            catch (error) {
                console.log('getAdicionalesCierrebyIdCotizacionGrupoUnidad ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerGU.release();
            }
        }));
    }
    // OC99 GESTION
    getValidaRegresaCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const adicionales = [];
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const validacion = yield queryRunnerVRC.query(`exec sp_Flotillas_ValidaRegresaCotizacion @idCotizacion = '${idCotizacion}'`);
                resolve(validacion);
            }
            catch (error) {
                console.log('getValidaRegresaCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OC99 GESTION
    getRegresaCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionRGC = typeorm_1.getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            yield queryRunnerRGC.connect();
            /*
            await connectionRGC.transaction(async (manager) => {

                // sp_Flotillas_RegresaCotizacion
                await manager.query(`exec sp_Flotillas_RegresaCotizacion @idCotizacion = '${idCotizacion}'`)
                .then(async (resp) => {
                    resolve(resp);
                }).catch(reject);
            })
            .catch((error) => {
                console.log(error);
                reject([{ Error: `Ocurrio un error al regresar la cotización.`, Success: 0 }]);
            });
            */
            try { // sp_Prueba
                const validacion = yield queryRunnerRGC.query(`exec sp_Flotillas_RegresaCotizacion @idCotizacion = '${idCotizacion}'`);
                resolve(validacion);
            }
            catch (error) {
                console.log('getRegresaCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerRGC.release();
            }
        }));
    }
    // OC99 GESTION
    getAdicionalesGestionbyIdDetalleUnidad(idCotizacion, idGrupoUnidad, idDetalleUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const adicionales = [];
            const connectionGUAG = typeorm_1.getConnection();
            const queryRunnerGUAG = connectionGUAG.createQueryRunner();
            yield queryRunnerGUAG.connect();
            try {
                // const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunnerGU);
                const accesorios = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneAccesoriosGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                const tramites = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneTramitesGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                const servicios = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneServiciosGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                const accesoriosMov = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneAccesoriosMovGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                const tramitesMov = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneTramitesMovGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                const serviciosMov = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneServiciosMovGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                /*
                const accesoriosSinPaquete = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneAccesorioSinPaquete @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const tramitesSinPaquete = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneTramiteSinPaquete @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const serviciosSinPaquete = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneServicioUnidadSinPaquete @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                */
                adicionales.push(accesorios); // 0
                adicionales.push(tramites); // 1
                adicionales.push(servicios); // 2
                // MOV
                adicionales.push(accesoriosMov); // 3
                adicionales.push(tramitesMov); // 4
                adicionales.push(serviciosMov); // 5
                /*
                // SIN PAQUETE
                adicionales.push(accesoriosSinPaquete); // 6
                adicionales.push(tramitesSinPaquete); // 7
                adicionales.push(serviciosSinPaquete); // 8
                */
                resolve(adicionales);
            }
            catch (error) {
                console.log('getAdicionalesGestionbyIdDetalleUnidad ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerGUAG.release();
            }
        }));
    }
    // OC99 GESTION
    getAdicionalesGestionbyGrupal(idCotizacion, idGrupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const adicionales = [];
            const connectionGUAG = typeorm_1.getConnection();
            const queryRunnerGUAG = connectionGUAG.createQueryRunner();
            yield queryRunnerGUAG.connect();
            try {
                // const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunnerGU);
                const accesoriosProcesados = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneAccesoriosMovGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}',@lugar = 1`);
                const tramites = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneTramitesMovGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`);
                const servicios = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneServiciosMovGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`);
                const accesoriosMovs = yield queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneAccesoriosMovGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}',@lugar = 2`);
                adicionales.push(accesoriosProcesados); // 0
                adicionales.push(tramites); // 1
                adicionales.push(servicios); // 2
                adicionales.push(accesoriosMovs); // 3
                resolve(adicionales);
            }
            catch (error) {
                console.log('getAdicionalesGestionbyGrupal ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerGUAG.release();
            }
        }));
    }
    // OC99 GESTION CANCELA COTIZACION
    getCancelaCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionRGC = typeorm_1.getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            yield queryRunnerRGC.connect();
            try {
                const validacion = yield queryRunnerRGC.query(`exec sp_Flotillas_CancelaPedidoCompleto @idCotizacion = '${idCotizacion}'`);
                resolve(validacion);
            }
            catch (error) {
                console.log('getCancelaCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerRGC.release();
            }
        }));
    }
    // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR GRUPO
    getResumenPreCancelaGrupoUnidad(idCotizacion, idGrupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionRGC = typeorm_1.getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            yield queryRunnerRGC.connect();
            try {
                const validacion = yield queryRunnerRGC.query(`exec sp_Flotillas_CuentaUnidadesFacturadas @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`);
                resolve(validacion);
            }
            catch (error) {
                console.log('getResumenPreCancelaGrupoUnidad ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerRGC.release();
            }
        }));
    }
    // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR COTIZACION
    getResumenPreCancelaCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionRGC = typeorm_1.getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            yield queryRunnerRGC.connect();
            try {
                const validacion = yield queryRunnerRGC.query(`exec sp_Flotillas_CuentaFacturadasCotizacion @idCotizacion = '${idCotizacion}'`);
                resolve(validacion);
            }
            catch (error) {
                console.log('getResumenPreCancelaCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerRGC.release();
            }
        }));
    }
    // SISCO
    // Servicio para validar si en la cotizacion existen accesorios pendientes - SISCO
    validaAccesoriosSisco(idCotizacion, origen) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionRGC = typeorm_1.getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            yield queryRunnerRGC.connect();
            try {
                const validacion = yield queryRunnerRGC.query(`exec sp_Flotillas_ValidaCompra @idCotizacion = '${idCotizacion}`
                    + `', @origen = ${origen}`); // 1:adicionales, 2: condiciones de venta
                resolve(validacion);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerRGC.release();
            }
        }));
    }
    // SISCO
    // OC99 GESTION CANCELA GRUPO UNIDAD
    getCancelaGrupoUnidad(idCotizacion, idGrupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionRGC = typeorm_1.getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            yield queryRunnerRGC.connect();
            try {
                const validacion = yield queryRunnerRGC.query(`exec sp_Flotillas_CancelaUnidadesGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`);
                resolve(validacion);
            }
            catch (error) {
                console.log('getCancelaGrupoUnidad ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerRGC.release();
            }
        }));
    }
    // OC99
    getUnidadesInteresGrupoByIdCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const connectionGUx = typeorm_1.getConnection();
            const queryRunnerGUx = connectionGUx.createQueryRunner();
            yield queryRunnerGUx.connect();
            try {
                const respuestaUp = yield this.actualizaMontosCalculos(idCotizacion, queryRunnerGUx);
                const unidadesIntereses = yield queryRunnerGUx.query(`exec sp_Flotillas_ObtieneGrupoUnidad @idCotizacion = '${idCotizacion}'`);
                resolve(unidadesIntereses);
            }
            catch (error) {
                console.log('getUnidadesInteresGrupoByIdCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerGUx.release();
            }
        }));
    }
    // OC99
    getDetalleUnidadGrupoByIdCotizacionGrupo(idCotizacion, idGrupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const connectionGUDx = typeorm_1.getConnection();
            const queryRunnerGUDx = connectionGUDx.createQueryRunner();
            yield queryRunnerGUDx.connect();
            try {
                // const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunnerGUDx);
                const unidadesGrupo = yield queryRunnerGUDx.query(`exec sp_Flotillas_ObtieneUnidades @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                resolve(unidadesGrupo);
            }
            catch (error) {
                console.log('getDetalleUnidadGrupoByIdCotizacionGrupo ERROR!!!');
                console.log(error);
                reject(error);
            }
            finally {
                yield queryRunnerGUDx.release();
            }
        }));
    }
    // OCT99
    actualizaMontosCalculos(idCotizacion, queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const count = 0;
                const respuesta = yield queryRunner.query(`exec sp_Flotillas_ActualizaUtilidadBruta @idCotizacion = '${idCotizacion}'`);
                resolve(respuesta);
            }));
        });
    }
    getCotizacionById(idCotizacion) {
        const start = Date.now();
        console.log('getCotizacionById inicio:');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const ivaTotalCotizacion = 0;
            const costoTotalUnidad = 0;
            const precioTotalUnidad = 0;
            const utilidadBrutaCotizacion = 0;
            const costoTotalCotizacion = 0;
            const precioTotalCotizacion = 0;
            const tazaIva = 0;
            const connection = typeorm_1.getConnection();
            const queryRunner = connection.createQueryRunner();
            yield queryRunner.connect();
            const cotizacionRepository = yield queryRunner.manager.getRepository(cotizador_1.Cotizacion); // connection.getRepository(Cotizacion);
            const grupoRepository = yield queryRunner.manager.getRepository(cotizador_1.CotizacionGrupoUnidad);
            const detalleRepository = yield queryRunner.manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
            const cotizacion = yield cotizacionRepository.findOne({
                relations: [
                    'gruposUnidades',
                    'gruposUnidades.detalleUnidades',
                ],
                where: { idCotizacion, 'gruposUnidades.traslados.activo': 1 },
            });
            // await queryRunner.startTransaction();
            try {
                /*
                for await (const grupoUnidad of cotizacion.gruposUnidades) {
                    grupoUnidad.precioTotalTotal = 0;
                    for await (const unidad of grupoUnidad.detalleUnidades) {
                        costoTotalUnidad = grupoUnidad.costo;
                        precioTotalUnidad = grupoUnidad.precio;
                        grupoUnidad.precioTotalTotal += unidad.precioTotal;
                        // console.log(grupoUnidad.precioTotalTotal, '¿UNIDAD?');

                        // * Nuevos calculos sin costo de unidad y precio
                        costoTotalCotizacion += unidad.accesorios
                            .reduce((a, b) => a + (b.costo * b.cantidad || 0), 0);

                        grupoUnidad.precioTotalTotal += unidad.accesorios
                            .reduce((a, b) => a + (b.precio * b.cantidad || 0), 0);

                        costoTotalCotizacion += unidad.tramites
                            .reduce((a, b) => a + (b.costo || 0), 0);

                        grupoUnidad.precioTotalTotal += unidad.tramites
                            .reduce((a, b) => a + (b.precio || 0), 0);

                        costoTotalCotizacion += unidad.serviciosUnidad
                            .reduce((a, b) => a + (b.costo || 0), 0);

                        grupoUnidad.precioTotalTotal += unidad.serviciosUnidad
                            .reduce((a, b) => a + (b.precio || 0), 0);

                        costoTotalCotizacion += grupoUnidad.traslados
                            .reduce((a, b) => a + (b.costoUnitario || 0), 0);

                        grupoUnidad.precioTotalTotal += grupoUnidad.traslados
                            .reduce((a, b) => a + (b.precioUnitario || 0), 0);

                        costoTotalCotizacion += costoTotalUnidad;

                        precioTotalCotizacion += unidad.accesorios
                            .reduce((a, b) => a + (b.precio * b.cantidad || 0), 0);

                        precioTotalCotizacion += unidad.tramites
                            .reduce((a, b) => a + (b.precio || 0), 0);

                        precioTotalCotizacion += unidad.serviciosUnidad
                            .reduce((a, b) => a + (b.precio || 0), 0);

                        precioTotalCotizacion += grupoUnidad.traslados
                            .reduce((a, b) => a + (b.precioTotal || 0), 0);

                        precioTotalCotizacion += precioTotalUnidad;

                        console.log(grupoUnidad.idGrupoUnidad, '¿ID GRUPO UNIDAD?');
                        console.log(grupoUnidad.precioTotalTotal, '¿PRECIO TOTAL TOTAL EN SUMATORIAS?');
                        tazaIva = grupoUnidad.tasaIva;
                        // ------------------------------------------/

                        unidad.costoTotal = Number(costoTotalUnidad);
                        unidad.precioTotal = Number(precioTotalUnidad);
                        unidad.ivaTotal = 0;

                        if (grupoUnidad.tasaIva > 0) {
                            unidad.ivaTotal += unidad.precioTotal - (unidad.precioTotal / (1 + (grupoUnidad.tasaIva / 100)));
                            ivaTotalCotizacion = unidad.precioTotal - (unidad.precioTotal / (1 + (grupoUnidad.tasaIva / 100)));
                        }

                        // unidad.utilidadBruta = Number((unidad.precioTotal / ((grupoUnidad.tasaIva / 100) + 1)) - unidad.costoTotal);
                        unidad.utilidadBruta = Number(unidad.precioTotal - unidad.costoTotal);

                        // Se calcula el precio unitario o subtotal
                        // grupoUnidad.precio = Number(unidad.precioTotal - unidad.ivaTotal);

                        // Se calcula porcentaje de utilidad a nivel CotizacionDetalleUnidad
                        unidad.porcentajeUtilidad = Number((unidad.utilidadBruta / unidad.costoTotal) * 100);

                        await detalleRepository.update({
                            idCotizacion: unidad.idCotizacion,
                            idGrupoUnidad: unidad.idGrupoUnidad,
                            idDetalleUnidad: unidad.idDetalleUnidad,
                        }, {
                            costoTotal: unidad.costoTotal,
                            precioTotal: unidad.precioTotal,
                            utilidadBruta: unidad.utilidadBruta,
                            porcentajeUtilidad: unidad.porcentajeUtilidad,
                            ivaTotal: unidad.ivaTotal,
                        });
                    }

                    grupoUnidad.costoTotal = grupoUnidad.detalleUnidades
                        .reduce((a, b) => a + (b.costoTotal || 0), 0);
                    grupoUnidad.precioTotal = grupoUnidad.detalleUnidades
                        .reduce((a, b) => a + (b.precioTotal || 0), 0);
                    grupoUnidad.utilidadBruta = grupoUnidad.detalleUnidades
                        .reduce((a, b) => a + (b.utilidadBruta || 0), 0);
                    grupoUnidad.ivaTotal = grupoUnidad.detalleUnidades
                        .reduce((a, b) => a + (b.ivaTotal || 0), 0);

                    // grupoUnidad.precioTotal = grupoUnidad.precioTotal + grupoUnidad.ivaTotal; // SE SUMA IVA TOTAL

                    // Se calcula porcentaje de utilidad a nivel CotizacionGrupoUnidad
                    grupoUnidad.porcentajeUtilidad = Number((grupoUnidad.utilidadBruta / grupoUnidad.costoTotal) * 100);

                    await grupoRepository.update({
                        idCotizacion: grupoUnidad.idCotizacion,
                        idGrupoUnidad: grupoUnidad.idGrupoUnidad,
                    }, {
                        costoTotal: grupoUnidad.costoTotal,
                        precioTotal: grupoUnidad.precioTotal,
                        utilidadBruta: grupoUnidad.utilidadBruta,
                        precioTotalTotal: grupoUnidad.precioTotalTotal,
                        porcentajeUtilidad: grupoUnidad.porcentajeUtilidad,
                        ivaTotal: grupoUnidad.ivaTotal,
                    });
                }

                cotizacion.costoTotal = cotizacion.gruposUnidades
                    .reduce((a, b) => a + (b.costoTotal || 0), 0);
                cotizacion.precioTotal = cotizacion.gruposUnidades
                    .reduce((a, b) => a + (b.precioTotal || 0), 0);
                cotizacion.utilidadBruta = cotizacion.gruposUnidades
                    .reduce((a, b) => a + (b.utilidadBruta || 0), 0);

                // Nuevos calculos a nivel cotizacion /
                utilidadBrutaCotizacion = Number(precioTotalCotizacion) / ((tazaIva / 100) + 1)  - Number(costoTotalCotizacion);
                // ------------------------------------/

                // Se calcula porcentaje de utilidad a nivel Cotizacion
                cotizacion.porcentajeUtilidad = Number((utilidadBrutaCotizacion / costoTotalCotizacion) * 100);

                await cotizacionRepository.update({
                    idCotizacion: cotizacion.idCotizacion,
                }, {
                    ivaTotal: Number(ivaTotalCotizacion),
                    costoTotal: Number(costoTotalCotizacion), // cotizacion.costoTotal,
                    precioTotal: Number(precioTotalCotizacion), // cotizacion.precioTotal,
                    utilidadBruta: Number(utilidadBrutaCotizacion), // cotizacion.utilidadBruta,
                    porcentajeUtilidad: cotizacion.porcentajeUtilidad,
                });
                await queryRunner.commitTransaction(); */
                const respuestaUp = yield this.actualizaMontosCalculos(idCotizacion, queryRunner);
                console.log('Respuesta Update montos:');
                console.log(respuestaUp);
                const end = Date.now();
                console.log('Total: ');
                console.log((end - start) / 1000);
                const statusDeDetalleUnidad = yield this.getStatusBproUnidad(idCotizacion, cotizacion, queryRunner);
                resolve(statusDeDetalleUnidad);
            }
            catch (error) {
                // await queryRunner.rollbackTransaction();
                reject(error);
            }
            finally {
                yield queryRunner.release();
            }
        }));
        // NO TOCAR POR FAVOR ESTA LOGICA ES LA ORIGINAL
        // return new Promise<Cotizacion>(async (resolve, reject) => {
        //     const connection = getConnection();
        //     const cotizacionRepositoryConsulta = connection.getRepository(Cotizacion);
        //     const cotizacion = await cotizacionRepositoryConsulta.findOne({
        //         relations: ['gruposUnidades',
        //             'gruposUnidades.detalleUnidades',
        //             'gruposUnidades.unidadesInteres',
        //             'gruposUnidades.paquetesAccesorios',
        //             'gruposUnidades.paquetesAccesorios.accesorios',
        //             'gruposUnidades.accesoriosSinPaquete',
        //             'gruposUnidades.paquetesTramites',
        //             'gruposUnidades.paquetesTramites.tramites',
        //             'gruposUnidades.tramitesSinPaquete',
        //             'gruposUnidades.paquetesServicioUnidad',
        //             'gruposUnidades.paquetesServicioUnidad.serviciosUnidad',
        //             'gruposUnidades.serviciosUnidadSinPaquete',
        //             'gruposUnidades.traslados',
        //             'gruposUnidades.detalleUnidades.accesorios',
        //             'gruposUnidades.detalleUnidades.accesoriosMov',
        //             'gruposUnidades.detalleUnidades.tramites',
        //             'gruposUnidades.detalleUnidades.tramitesMov',
        //             'gruposUnidades.detalleUnidades.serviciosUnidad',
        //             'gruposUnidades.detalleUnidades.serviciosUnidadMov',
        //         ],
        //         where: { idCotizacion, 'gruposUnidades.traslados.activo': 1 },
        //     });
        //     await connection.transaction(async (manager) => {
        //         const cotizacionRepository = manager.getRepository(Cotizacion);
        //         const grupoRepository = manager.getRepository(CotizacionGrupoUnidad);
        //         const detalleRepository = manager.getRepository(CotizacionDetalleUnidad);
        //         for (const grupoUnidad of cotizacion.gruposUnidades) {
        //             for (const unidad of grupoUnidad.detalleUnidades) {
        //                 let costoTotalUnidad = grupoUnidad.costo;
        //                 let precioTotalUnidad = grupoUnidad.precio;
        /*//                 costoTotalUnidad += unidad.accesorios
        //                     .reduce((a, b) => a + (b.costo * b.cantidad || 0), 0);*/
        //                 costoTotalUnidad += unidad.tramites
        //                     .reduce((a, b) => a + (b.costo || 0), 0);
        //                 costoTotalUnidad += unidad.serviciosUnidad
        //                     .reduce((a, b) => a + (b.costo || 0), 0);
        /*//                 precioTotalUnidad += unidad.accesorios
        //                     .reduce((a, b) => a + (b.precio * b.cantidad || 0), 0);*/
        //                 precioTotalUnidad += unidad.tramites
        //                     .reduce((a, b) => a + (b.precio || 0), 0);
        //                 precioTotalUnidad += unidad.serviciosUnidad
        //                     .reduce((a, b) => a + (b.precio || 0), 0);
        //                 unidad.costoTotal = Number(costoTotalUnidad.toPrecision(8));
        //                 unidad.precioTotal = Number(precioTotalUnidad.toPrecision(8));
        //                 unidad.ivaTotal = 0;
        //                 if (unidad.tasaIva > 0) {
        //                     unidad.ivaTotal = unidad.precioTotal - (unidad.precioTotal / (1 + (unidad.tasaIva / 100.0)));
        //                 }
        //                 unidad.utilidadBruta = unidad.precioTotal - unidad.costoTotal;
        //                 await detalleRepository.update({
        //                     idCotizacion: unidad.idCotizacion,
        //                     idGrupoUnidad: unidad.idGrupoUnidad,
        //                     idDetalleUnidad: unidad.idDetalleUnidad,
        //                 }, {
        //                     costoTotal: unidad.costoTotal,
        //                     precioTotal: unidad.precioTotal,
        //                     utilidadBruta: unidad.utilidadBruta,
        //                     ivaTotal: unidad.ivaTotal,
        //                 })
        //                 .catch(reject);
        //             }
        //             grupoUnidad.costoTotal = grupoUnidad.detalleUnidades
        //                 .reduce((a, b) => a + (b.costoTotal || 0), 0);
        //             grupoUnidad.precioTotal = grupoUnidad.detalleUnidades
        //                 .reduce((a, b) => a + (b.precioTotal || 0), 0);
        //             grupoUnidad.utilidadBruta = grupoUnidad.detalleUnidades
        //                 .reduce((a, b) => a + (b.utilidadBruta || 0), 0);
        //             grupoUnidad.ivaTotal = grupoUnidad.detalleUnidades
        //                 .reduce((a, b) => a + (b.ivaTotal || 0), 0);
        //             await grupoRepository.update({
        //                 idCotizacion: grupoUnidad.idCotizacion,
        //                 idGrupoUnidad: grupoUnidad.idGrupoUnidad,
        //             }, {
        //                 costoTotal: grupoUnidad.costoTotal,
        //                 precioTotal: grupoUnidad.precioTotal,
        //                 utilidadBruta: grupoUnidad.utilidadBruta,
        //                 ivaTotal: grupoUnidad.ivaTotal,
        //             })
        //             .catch(reject);
        //         }
        //         cotizacion.costoTotal = cotizacion.gruposUnidades
        //             .reduce((a, b) => a + (b.costoTotal || 0), 0);
        //         cotizacion.precioTotal = cotizacion.gruposUnidades
        //             .reduce((a, b) => a + (b.precioTotal || 0), 0);
        //         cotizacion.utilidadBruta = cotizacion.gruposUnidades
        //             .reduce((a, b) => a + (b.utilidadBruta || 0), 0);
        //         await cotizacionRepository.update({
        //             idCotizacion: cotizacion.idCotizacion,
        //         }, {
        //             costoTotal: cotizacion.costoTotal,
        //             precioTotal: cotizacion.precioTotal,
        //             utilidadBruta: cotizacion.utilidadBruta,
        //         })
        //         .catch(reject);
        //     })
        //     .catch(reject);
        //     resolve(cotizacion);
        // });
    }
    updateCotizacionStep(idCotizacion, newStep) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionRepository = yield connection.getRepository(cotizador_1.Cotizacion);
            yield cotizacionRepository.update({ idCotizacion }, { step: newStep });
            resolve(1);
        }));
    }
    updateCotizacionCfdiAdicionales(idCotizacion, idCfdiAdicionales) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionGrupoRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoUnidad);
                const cotizacionDetalleRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                yield cotizacionRepository.update({ idCotizacion }, { idCfdiAdicionales });
                yield cotizacionGrupoRepository.update({ idCotizacion }, { idCfdiAdicionales });
                yield cotizacionDetalleRepository.update({ idCotizacion }, { idCfdiAdicionales });
                resolve(1);
            }));
        }));
    }
    updateCotizacionTipoOrden(idCotizacion, tipoOrden) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionGrupoRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoUnidad);
                const cotizacionDetalleRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                yield cotizacionRepository.update({ idCotizacion }, { tipoOrden });
                yield cotizacionGrupoRepository.update({ idCotizacion }, { tipoOrden });
                yield cotizacionDetalleRepository.update({ idCotizacion }, { tipoOrden });
                if (tipoOrden == 'CU') {
                    yield cotizacionRepository.update({ idCotizacion }, { idCfdiAdicionales: null, tipoCargoUnidad: 'Suma' });
                    yield cotizacionGrupoRepository.update({ idCotizacion }, { idCfdiAdicionales: null });
                    yield cotizacionDetalleRepository.update({ idCotizacion }, { idCfdiAdicionales: null });
                }
                resolve(1);
            }));
        }));
    }
    // OCT99 20200914
    updateCotizacionGruposTipoOrden(idCotizacion, tipoOrden, idCfdiAdicionales, tipoCargoUnidad, imprimeFactura) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            tipoOrden = (tipoOrden == '99') ? '' : tipoOrden;
            idCfdiAdicionales = (idCfdiAdicionales == '99') ? '' : idCfdiAdicionales;
            try {
                const validacion = yield queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTipoOrdenEncabezado @idCotizacion = '${idCotizacion}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @idCfdiAdicionales = '${idCfdiAdicionales}`
                    + `', @tipoCargoUnidad = '${tipoCargoUnidad}`
                    + `', @imprimeFactura = ${imprimeFactura}`);
                resolve(validacion);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT99 20200914
    updateGruposTipoOrden(idCotizacion, idGrupoUnidad, tipoOrden, idCfdiAdicionales, tipoCargoUnidad, imprimeFactura) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            idCfdiAdicionales = (idCfdiAdicionales == '99') ? '' : idCfdiAdicionales;
            try {
                const validacion = yield queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTipoOrdenGrupoUnidad @idCotizacion = '${idCotizacion}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @idCfdiAdicionales = '${idCfdiAdicionales}`
                    + `', @tipoCargoUnidad = '${tipoCargoUnidad}`
                    + `', @imprimeFactura = ${imprimeFactura}`
                    + `, @idGrupoUnidad = ${idGrupoUnidad}`);
                resolve(validacion);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    existeLicitacion(idLicitacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            connection.manager.findOne(cotizador_1.Licitacion, { idLicitacion }).then((licitacionDB) => __awaiter(this, void 0, void 0, function* () {
                if (licitacionDB == undefined) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            }));
        }));
    }
    insertCotizacion(data, idTipoVenta, idContrato) {
        console.log('Marcial AC');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const respuestaCotizaciones = [];
            const connection = typeorm_1.getConnection();
            const arreglo = data;
            const idTipoVentaKey = idTipoVenta;
            const idContratoKey = idContrato;
            let toDelete = [];
            const fidLicitacion = data[0].idLicitacion;
            let licitacionPorGuardar = null;
            if (fidLicitacion != undefined) {
                yield connection.manager.find(cotizador_1.Cotizacion, { idLicitacion: fidLicitacion }).then((cotizaciones) => __awaiter(this, void 0, void 0, function* () {
                    toDelete = cotizaciones;
                }), (error) => { });
                licitacionPorGuardar = new cotizador_1.Licitacion();
                licitacionPorGuardar.idLicitacion = fidLicitacion;
                licitacionPorGuardar.idUsuarioModificacion = data[0].idUsuarioModificacion;
                licitacionPorGuardar.fechaModificacion = new Date();
            }
            for (let i = 0; i <= arreglo.length; i++) {
                let correlativo = '';
                if (arreglo[i]) {
                    yield connection.query(`SELECT dbo.fn_flotillas_consecutivo_cotizacion(${arreglo[i].idSucursal}) AS nuevoId `).then((id) => __awaiter(this, void 0, void 0, function* () {
                        let string = id[0].nuevoId;
                        string = string.split('-');
                        correlativo = string[string.length - 1];
                        arreglo[i].idCotizacion = `${string[0]}-${string[1]}-${string[2]}-${string[3]}-${Number(correlativo) + 1}`;
                        if (arreglo[i - 1] != undefined) {
                            if (arreglo[i].idCotizacion == arreglo[i - 1].idCondicion) {
                                arreglo[i].idCotizacion = `${string[0]}-${string[1]}-${string[2]}-${string[3]}-${Number(correlativo) + 2}`;
                            }
                        }
                        yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                            if (licitacionPorGuardar != undefined) {
                                const licitacionRepository = yield manager.getRepository(cotizador_1.Licitacion);
                                yield licitacionRepository.save(licitacionPorGuardar)
                                    .catch(reject);
                                licitacionPorGuardar = null;
                            }
                            const cotizacionRepository = yield manager.getRepository(cotizador_1.Cotizacion);
                            arreglo[i].clienteOriginal = arreglo[i].nombreCliente;
                            yield cotizacionRepository.save(arreglo[i]).then((res) => __awaiter(this, void 0, void 0, function* () {
                                yield respuestaCotizaciones.push(res);
                            }));
                        }));
                    }), (error) => { reject(error); });
                    const idCotizacionFix = arreglo[i].idCotizacion;
                    // console.log('>>> id cotizacion enviado :' + `'${idCotizacionFix}'`);
                    // 30 - 05 - 2020 chk se consume el sp para apartar el folio
                    // const idCotizacionBPRO =
                    yield connection.query(`exec sp_Flotillas_insertaUniversal @idCotizacion = '${idCotizacionFix}'`)
                        .then((status) => {
                        // console.log('>>>respuesta ' + status[0].Success + ' id cotizacion ' + `'${idCotizacionFix}'`);
                        if (status.length > 0 && status[0].Success && (status[0].Success === 0 || status[0].Success === '0')) {
                            reject({ status: 400, error: `La cotizacion con id ${idCotizacionFix} no se pudo apartar en bpro` });
                        }
                    })
                        .catch(reject);
                    if (idTipoVentaKey !== '-1') {
                        const idCotizacionKey = arreglo[0].idCotizacion;
                        yield connection.query(`exec sp_Flotillas_cotizacionContratoActivos @idCotizacion = '${idCotizacionKey}',@idTipoVenta='${idTipoVentaKey}',@idContrato='${idContratoKey}'`)
                            .then((respuesta) => {
                            console.log('respuesta=>', respuesta);
                        })
                            .catch(reject);
                    }
                }
            }
            if (toDelete.length > 0) {
                yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                    const cotizacionRepository = yield manager.getRepository(cotizador_1.Cotizacion);
                    yield cotizacionRepository.remove(toDelete);
                }));
            }
            resolve(respuestaCotizaciones);
        }));
    }
    saveGrupoUnidad(grupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const gruposUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoUnidad);
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                console.log('save leyenda: ');
                console.log(grupoUnidad.leyendaFactura);
                if (grupoUnidad.idGrupoUnidad == undefined) {
                    let maxId = (yield gruposUnidadesRepository.createQueryBuilder('cotizacionGrupoUnidad')
                        .where('cotizacionGrupoUnidad.idCotizacion = :idCotizacion', { idCotizacion: grupoUnidad.idCotizacion })
                        .select('MAX(cotizacionGrupoUnidad.idGrupoUnidad)', 'max')
                        .getRawOne()).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    grupoUnidad.idGrupoUnidad = maxId;
                }
                yield gruposUnidadesRepository.save(grupoUnidad).then((grupoUnidadSaved) => __awaiter(this, void 0, void 0, function* () {
                    yield detalleUnidadesRepository.update({
                        idCotizacion: grupoUnidad.idCotizacion,
                        idGrupoUnidad: grupoUnidad.idGrupoUnidad,
                    }, {
                        idIva: grupoUnidad.idIva,
                        tasaIva: grupoUnidad.tasaIva,
                        idCondicion: grupoUnidad.idCondicion,
                        idFinanciera: grupoUnidad.idFinanciera,
                        imprimeFactura: grupoUnidad.imprimeFactura,
                        tipoCargoUnidad: grupoUnidad.tipoCargoUnidad,
                        nombreFinanciera: grupoUnidad.nombreFinanciera,
                        colorInteriorFacturacion: grupoUnidad.colorInteriorFacturacion,
                        colorExteriorFacturacion: grupoUnidad.colorExteriorFacturacion,
                        idCfdi: grupoUnidad.idCfdi,
                        tipoOrden: grupoUnidad.tipoOrden,
                        // idCfdiAdicionales: grupoUnidad.idCfdiAdicionales,
                        leyendaFactura: grupoUnidad.leyendaFactura,
                        fechaHoraPromesaEntrega: grupoUnidad.fechaHoraPromesaEntrega,
                    });
                    resolve(grupoUnidad);
                }), reject);
            }));
        }));
    }
    validaVinAsignados(grupoVines) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            let cadena = '';
            const connection = typeorm_1.getConnection();
            const unidadInteresRepository = yield connection.getRepository(catalogo_1.UnidadInteres);
            try {
                for (var grupoVines_1 = __asyncValues(grupoVines), grupoVines_1_1; grupoVines_1_1 = yield grupoVines_1.next(), !grupoVines_1_1.done;) {
                    const grupoVin = grupoVines_1_1.value;
                    const existGrupoVin = yield unidadInteresRepository.find({ vin: grupoVin.vin, idCotizacion: grupoVin.idCotizacion });
                    if (existGrupoVin.length !== 0) {
                        if (existGrupoVin[0].idGrupoUnidad !== grupoVin.idGrupoUnidad) {
                            cadena += `\nNo se puede asignar vin ${grupoVin.vin}, ya se encuentra asignado a esta cotización\n`;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (grupoVines_1_1 && !grupoVines_1_1.done && (_a = grupoVines_1.return)) yield _a.call(grupoVines_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (cadena.length !== 0) {
                reject({ status: 422, error: cadena });
            }
            resolve(true);
        }));
    }
    deleteGrupoUnidad(idCotizacion, idGrupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const grupoUnidadRepository = yield connection.getRepository(cotizador_1.CotizacionGrupoUnidad);
            const unidadInteres = yield connection.getRepository(catalogo_1.UnidadInteres);
            yield grupoUnidadRepository.delete({ idCotizacion, idGrupoUnidad }).then((deleteResult) => __awaiter(this, void 0, void 0, function* () {
                yield unidadInteres.delete({ idCotizacion, idGrupoUnidad });
                resolve(deleteResult.affected);
            }), reject);
        }));
    }
    saveGruposDetalleUnidades(gruposDetalleUnidad, pantalla) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let returnValue = 0;
            const conjuntoDetalles = [];
            if (!gruposDetalleUnidad || gruposDetalleUnidad.length == 0) {
                const res = { Success: 0, Mensaje: 'No existen grupos de unidades para actualizar.' };
                resolve(res);
                return;
            }
            // OCT99 08092020 SP para guardar unidades y agregar adicionales si hay nuevas unidades
            const connection = typeorm_1.getConnection();
            console.log(gruposDetalleUnidad);
            if (pantalla == 'COTIZACION') {
                console.log('contizacion: SQL');
                yield connection.query(`exec sp_Flotillas_saveGruposDetalleUnidades @idCotizacion = '${gruposDetalleUnidad[0].idCotizacion}'`)
                    .then((doc) => {
                    // if (doc[0].Success != null && doc[0].Success === 1) {
                    //    resolve(doc);
                    // }
                    resolve(doc[0]);
                })
                    .catch(reject);
            }
            else {
                console.log('gestion: ORM');
                // const connection = getConnection();
                const cotizacionRepository = yield connection.getRepository(cotizador_1.Cotizacion);
                const cotizacion = yield cotizacionRepository.findOne({ idCotizacion: gruposDetalleUnidad[0].idCotizacion });
                for (const grupoDetalleUnidad of gruposDetalleUnidad) {
                    const cantidad = grupoDetalleUnidad.cantidad;
                    yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                        const gruposDetalleUnidadRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                        yield gruposDetalleUnidadRepository.delete({ idCotizacion: grupoDetalleUnidad.idCotizacion, idGrupoUnidad: grupoDetalleUnidad.idGrupoUnidad });
                        for (let indice = 0; indice < cantidad; indice++) {
                            if (grupoDetalleUnidad.idCotizacion && grupoDetalleUnidad.idGrupoUnidad) {
                                const detalleCotizacion = new cotizador_1.CotizacionDetalleUnidad();
                                detalleCotizacion.idDetalleUnidad = indice + 1;
                                detalleCotizacion.idCfdi = cotizacion.idCfdi;
                                detalleCotizacion.idCondicion = cotizacion.idCondicion;
                                detalleCotizacion.idFinanciera = cotizacion.idFinanciera;
                                detalleCotizacion.idCotizacion = cotizacion.idCotizacion;
                                detalleCotizacion.nombreFinanciera = cotizacion.nombreFinanciera;
                                detalleCotizacion.idGrupoUnidad = grupoDetalleUnidad.idGrupoUnidad;
                                detalleCotizacion.tipoOrden = cotizacion.tipoOrden,
                                    detalleCotizacion.imprimeFactura = cotizacion.imprimeFactura,
                                    detalleCotizacion.tipoCargoUnidad = cotizacion.tipoCargoUnidad,
                                    yield gruposDetalleUnidadRepository.save(detalleCotizacion);
                                returnValue++;
                            }
                        }
                    }));
                }
                const res2 = { Success: 1, Mensaje: 'Se actualizaron las unidades.' };
                resolve(res2);
            }
        }));
    }
    updateCotizacionDetalleUnidad(detalleUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            console.log('update leyenda:');
            console.log(detalleUnidad.leyendaFactura);
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                yield detalleUnidadesRepository.update({
                    idCotizacion: detalleUnidad.idCotizacion,
                    idGrupoUnidad: detalleUnidad.idGrupoUnidad,
                    idDetalleUnidad: detalleUnidad.idDetalleUnidad,
                }, {
                    idCondicion: detalleUnidad.idCondicion,
                    idFinanciera: detalleUnidad.idFinanciera,
                    nombreFinanciera: detalleUnidad.nombreFinanciera,
                    colorInteriorFacturacion: detalleUnidad.colorInteriorFacturacion,
                    colorExteriorFacturacion: detalleUnidad.colorExteriorFacturacion,
                    idCfdi: detalleUnidad.idCfdi,
                    tipoOrden: detalleUnidad.tipoOrden,
                    idIva: detalleUnidad.idIva,
                    tasaIva: detalleUnidad.tasaIva,
                    imprimeFactura: detalleUnidad.imprimeFactura,
                    tipoCargoUnidad: detalleUnidad.tipoCargoUnidad,
                    idCfdiAdicionales: detalleUnidad.idCfdiAdicionales,
                    leyendaFactura: detalleUnidad.leyendaFactura,
                    fechaHoraPromesaEntrega: detalleUnidad.fechaHoraPromesaEntrega,
                    idUsuarioModificacion: detalleUnidad.idUsuarioModificacion,
                    fechaModificacion: detalleUnidad.fechaModificacion,
                });
                resolve(1);
            }));
        }));
    }
    saveLeyendaDetalleUnidad(idCotizacion, idGrupoUnidad, idDetalleUnidad, leyendaFactura) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                let updated = false;
                const cotizacionRepo = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionGrupoUnidadRepo = yield manager.getRepository(cotizador_1.CotizacionGrupoUnidad);
                const cotizacionDetalleUnidadRepo = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                // const cotizacionFindOne = await cotizacionRepo.findOne({ idCotizacion });
                const cotizacionGrupoUnidadFindOne = yield cotizacionGrupoUnidadRepo.findOne({ idGrupoUnidad });
                const cotizacionDetalleUnidadFindOne = yield cotizacionDetalleUnidadRepo.findOne({ idDetalleUnidad });
                if (cotizacionGrupoUnidadFindOne) {
                    yield cotizacionGrupoUnidadRepo.update({ idGrupoUnidad }, { leyendaFactura })
                        .catch(reject);
                    yield cotizacionDetalleUnidadRepo.update({ idGrupoUnidad }, { leyendaFactura })
                        .catch(reject);
                    updated = true;
                }
                if (cotizacionDetalleUnidadFindOne) {
                    yield cotizacionDetalleUnidadRepo.update({ idDetalleUnidad }, { leyendaFactura })
                        .catch(reject);
                    updated = true;
                    updated = true;
                }
                resolve(updated);
                // const detalleUnidadesRepository = manager.getRepository(CotizacionDetalleUnidad);
                // const existLeyendaFactura = await detalleUnidadesRepository.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                // if (existLeyendaFactura) {
                //     existLeyendaFactura.leyendaFactura = leyendaFactura;
                //     await detalleUnidadesRepository.update({ idCotizacion, idGrupoUnidad, idDetalleUnidad }, existLeyendaFactura)
                //         .catch(reject);
                //     resolve({ status: 200, message: `Se ha guardado la leyenda factura sactisfactoriamente` });
                // }
            }));
        }));
    }
    getLeyendaDetalleUnidad(idCotizacion, idGrupoUnidad, idDetalleUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const detalleUnidadesRepository = manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const existLeyendaFactura = yield detalleUnidadesRepository.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                if (!existLeyendaFactura) {
                    reject({ status: 404, error: `No se encuentra la factura leyenda` });
                }
                resolve({ status: 200, message: existLeyendaFactura.leyendaFactura });
            }));
        }));
    }
    /*getGrupoUnidadByIdCotizacion(idCotizacion: string): Promise<CotizacionGrupoUnidad[]> {
        return new Promise<CotizacionGrupoUnidad[]>(async (resolve, reject) => {*/
    getGrupoUnidadByIdCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const queryRunner = connection.createQueryRunner();
            yield queryRunner.connect();
            const cotizacionRepository = yield queryRunner.manager.getRepository(cotizador_1.Cotizacion); // connection.getRepository(Cotizacion);
            const respuestaUp = yield this.actualizaMontosCalculos(idCotizacion, queryRunner);
            const cotizacion = yield cotizacionRepository.findOne({
                relations: [
                    'gruposUnidades',
                    'gruposUnidades.detalleUnidades',
                    'gruposUnidades.paquetesAccesorios',
                    'gruposUnidades.accesoriosSinPaquete',
                    'gruposUnidades.paquetesAccesorios.accesorios',
                    'gruposUnidades.paquetesServicioUnidad',
                    'gruposUnidades.paquetesTramites',
                    'gruposUnidades.paquetesTramites.tramites',
                    'gruposUnidades.paquetesServicioUnidad.serviciosUnidad',
                    'gruposUnidades.serviciosUnidadSinPaquete',
                    'gruposUnidades.tramitesSinPaquete',
                ],
                where: { idCotizacion, 'gruposUnidades.traslados.activo': 1 },
            });
            resolve(cotizacion);
        }));
    }
    // OCT99 ------- GESTION
    getCotizacionGestionByIdCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const queryRunner = connection.createQueryRunner();
            yield queryRunner.connect();
            const cotizacionRepository = yield queryRunner.manager.getRepository(cotizador_1.Cotizacion); // connection.getRepository(Cotizacion);
            const respuestaUp = yield this.actualizaMontosCalculos(idCotizacion, queryRunner);
            const cotizacion = yield cotizacionRepository.findOne({
                relations: [
                    'gruposUnidades',
                    'gruposUnidades.detalleUnidades',
                ],
                where: { idCotizacion, 'gruposUnidades.traslados.activo': 1 },
            });
            resolve(cotizacion);
        }));
    }
    getUnidadesInteresByIdCotizacion(idCotizacion) {
        const start = Date.now();
        console.log('getUnidadesInteresByIdCotizacion: INI');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const queryRunner = connection.createQueryRunner();
            yield queryRunner.connect();
            const cotizacionRepository = yield queryRunner.manager.getRepository(cotizador_1.Cotizacion); // connection.getRepository(Cotizacion);
            const respuestaUp = yield this.actualizaMontosCalculos(idCotizacion, queryRunner);
            const cotizacion = yield cotizacionRepository.findOne({
                relations: [
                    'gruposUnidades',
                    'gruposUnidades.unidadesInteres',
                    'gruposUnidades.traslados',
                ],
                where: { idCotizacion, 'gruposUnidades.traslados.activo': 1 },
            });
            console.log('getUnidadesInteresByIdCotizacion: END');
            // console.log(cotizacion);
            const end = Date.now();
            console.log('Total UNIDADES INTERES: ');
            console.log((end - start) / 1000);
            resolve(cotizacion);
        }));
    }
    getUnidadesCierreByIdCotizacion(idCotizacion) {
        const start = Date.now();
        console.log('getUnidadesCierreByIdCotizacion: INI');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const queryRunner = connection.createQueryRunner();
            yield queryRunner.connect();
            const cotizacionRepository = yield queryRunner.manager.getRepository(cotizador_1.Cotizacion); // connection.getRepository(Cotizacion);
            const respuestaUp = yield this.actualizaMontosCalculos(idCotizacion, queryRunner);
            const cotizacion = yield cotizacionRepository.findOne({
                relations: [
                    'gruposUnidades',
                    // 'gruposUnidades.unidadesInteres',
                    'gruposUnidades.traslados',
                ],
                where: { idCotizacion, 'gruposUnidades.traslados.activo': 1 },
            });
            console.log('getUnidadesInteresByIdCotizacion: END');
            // console.log(cotizacion);
            const end = Date.now();
            console.log('Total UNIDADES INTERES: ');
            console.log((end - start) / 1000);
            resolve(cotizacion);
        }));
    }
    saveCotizacionTraslado(idUbicacionOrigen, idUbicacionDestino, cotizacionTraslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!cotizacionTraslado) {
                reject(0);
            }
            const connection = typeorm_1.getConnection();
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionTrasladoRepository = manager.getRepository(cotizador_1.CotizacionTraslado);
                const trasladoRepository = manager.getRepository(catalogo_1.Traslado);
                const cotizacion = yield cotizacionRepository.findOne({ idCotizacion: cotizacionTraslado.idCotizacion });
                if (!cotizacion) {
                    reject('No existe la cotización');
                }
                const traslado = new catalogo_1.Traslado();
                traslado.idTraslado = cotizacionTraslado.idTraslado;
                traslado.idUbicacionOrigen = idUbicacionOrigen;
                traslado.idUbicacionDestino = idUbicacionDestino;
                traslado.idMarca = cotizacion.idMarca;
                traslado.idEmpresa = cotizacion.idEmpresa;
                traslado.idSucursal = cotizacion.idSucursal;
                traslado.idProveedor = cotizacionTraslado.idProveedor;
                traslado.nombreProveedor = cotizacionTraslado.nombreProveedor;
                traslado.idUbicacionDestino = idUbicacionDestino;
                traslado.utilidadTotal = (((cotizacionTraslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)) - cotizacionTraslado.costoTotal) / ((cotizacionTraslado.precioTotal == 0) ? 1 : (cotizacionTraslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)))) * 100;
                traslado.costoUnitario = cotizacionTraslado.costoUnitario;
                traslado.precioUnitario = cotizacionTraslado.precioUnitario;
                traslado.idUsuarioModificacion = cotizacionTraslado.idUsuarioModificacion;
                traslado.fechaModificacion = cotizacionTraslado.fechaModificacion;
                if (traslado.idTraslado == undefined) {
                    let maxId = (yield trasladoRepository.createQueryBuilder().select('MAX(Traslado.idTraslado)', 'max').getRawOne()).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    traslado.idTraslado = maxId;
                }
                if (cotizacionTraslado.idCotizacionTraslado == undefined) {
                    let maxId = (yield cotizacionTrasladoRepository.createQueryBuilder().select('MAX(CotizacionTraslado.idCotizacionTraslado)', 'max').getRawOne()).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    cotizacionTraslado.idCotizacionTraslado = maxId;
                }
                cotizacionTraslado.utilidadTotal = ((cotizacionTraslado.precioTotal - cotizacionTraslado.costoTotal) / ((cotizacionTraslado.precioTotal == 0) ? 1 : cotizacionTraslado.precioTotal)) * 100;
                yield trasladoRepository.save(traslado).then((savedTraslado) => __awaiter(this, void 0, void 0, function* () {
                    cotizacionTraslado.idTraslado = savedTraslado.idTraslado;
                    yield cotizacionTrasladoRepository.save(cotizacionTraslado).then((rsTraslado) => {
                        resolve(rsTraslado);
                    }).catch((errTraslado) => {
                        reject(errTraslado);
                    });
                }), reject);
            }));
        }));
    }
    deleteCotizacionTraslado(idCotizacionTraslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionTrasladoRepository = yield connection.getRepository(cotizador_1.CotizacionTraslado);
            yield cotizacionTrasladoRepository.delete({ idCotizacionTraslado }).then((deleteResult) => {
                resolve(1);
            }, reject);
        }));
    }
    deleteCotizacionTrasladoMov(idCotizacionTraslado) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionTrasladoRepository = yield connection.getRepository(cotizador_1.CotizacionTraslado);
            yield cotizacionTrasladoRepository.update({ idCotizacionTraslado }, { activo: false }).then((deleteResult) => {
                cotizacionTrasladoRepository.findOne({ idCotizacionTraslado }).then((found) => resolve(found));
            }, reject);
        }));
    }
    asignarVinesApartados(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_AsignaVines @idCotizacion='${idCotizacion}'`)
                .then((resultado) => __awaiter(this, void 0, void 0, function* () {
                // console.log(resultado, '¿RESULSET ASIGNA VINES APARTADOS?');
                resolve({ status: 200, messaje: resultado });
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                // console.log(error, '¿ERROR EN APARTA VINES?');
                reject({ status: 400, error });
            }));
        }));
    }
    asignarVinesApartadosPosterior(idCotizacion) {
        // PROCESA VINES APATARTADOS POSTERIORES BOTON PROCESAR POSTERIORES (NARANJA)
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_AsignaVinesPosterior @idCotizacion='${idCotizacion}'`)
                .then((resultado) => __awaiter(this, void 0, void 0, function* () {
                console.log(resultado, '¿RESULSET ASIGNA VINES APARTADOS?');
                yield connection.query(`exec sp_Flotillas_CambiaEstatusCotizacionUnidadPosterior @idCotizacion = '${idCotizacion}'`)
                    .then((status) => {
                    console.log(status, '¿STATUS SP CAMBIA ESTATUS COTIZACION UNIDAD POSTERIOR?');
                })
                    .catch(reject);
                resolve({ status: 200, messaje: resultado });
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                console.log(error, '¿ERROR EN APARTA VINES?');
                reject({ status: 400, error });
            }));
        }));
    }
    enviarControlDocumental(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec INS_ControlDocumental_SP @idCotizacion='${idCotizacion}'`)
                .then((resultado) => __awaiter(this, void 0, void 0, function* () {
                resolve(1);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    enviarProduccion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec INS_Produccion_SP @idCotizacion='${idCotizacion}'`)
                .then((resultado) => __awaiter(this, void 0, void 0, function* () {
                resolve(1);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    cerrarCotizacion(idUsuarioModificacion, cierreCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            // Facturacion numero de orden
            const connection = typeorm_1.getConnection();
            const cotizacionRepositoryOrden = yield connection.getRepository(cotizador_1.Cotizacion);
            if (cierreCotizacion.numeroOrden) {
                yield cotizacionRepositoryOrden.update({ idCotizacion: cierreCotizacion.idCotizacion }, { numeroOrden: cierreCotizacion.numeroOrden });
            }
            yield connection.query(`exec sp_Flotillas_Insert_Cot @idCotizacion='${cierreCotizacion.idCotizacion}'`)
                .then((resultado) => __awaiter(this, void 0, void 0, function* () {
                if (resultado.length > 0) {
                    const cotizacionRepository = yield connection.getRepository(cotizador_1.Cotizacion);
                    if (cierreCotizacion.numeroOrden) {
                        yield cotizacionRepository.update({ idCotizacion: cierreCotizacion.idCotizacion }, { numeroOrden: cierreCotizacion.numeroOrden, status: 'APROBADA', fechaModificacion: new Date(), idUsuarioModificacion });
                    }
                    else {
                        yield cotizacionRepository.update({ idCotizacion: cierreCotizacion.idCotizacion }, { status: 'APROBADA', fechaModificacion: new Date(), idUsuarioModificacion });
                    }
                    if (cierreCotizacion.numeroOrden && cierreCotizacion.orden) {
                        const documentBusiness = new repositorio_1.DocumentoBusiness('cotizacion');
                        documentBusiness.set(cierreCotizacion.idCotizacion + `/orden_cliente_${cierreCotizacion.idCotizacion}.pdf`, cierreCotizacion.orden).then((documentoGuardado) => __awaiter(this, void 0, void 0, function* () {
                            if (documentoGuardado) {
                                resolve(Number(resultado[0].identityCotizacion));
                            }
                            else {
                                reject(null);
                            }
                        }), () => {
                            reject(null);
                        });
                    }
                    else {
                        resolve(Number(resultado[0].identityCotizacion));
                    }
                }
                else {
                    reject(null);
                }
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    enviarCotizacionEmail(correo) {
        return new Promise((resolve, reject) => {
            const host = process.env.SMTP_HOST;
            const from = process.env.SMTP_FROM;
            const port = Number(process.env.SMTP_PORT);
            const secure = process.env.SMTP_SECURE == 'true';
            const user = process.env.SMTP_USER;
            const pass = process.env.SMTP_PASSWORD;
            /*
            const transport = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: {
                    user,
                    pass,
                },
            } as nodemailer.SendMailOptions);*/
            /*CHK 19 nov 2020 - si se cambia la cuenta hay que autorizarla para usarla con aplicaciones
            externas en google https://myaccount.google.com/lesssecureapps */
            const transport = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                secure: false,
                auth: {
                    user: 'flotillas@grupoandrade.com',
                    pass: 'WZ8gMX=u#',
                },
                tls: { rejectUnauthorized: false },
            });
            const adjuntos = correo.adjuntos == undefined ? [] :
                correo.adjuntos.map((a) => {
                    return {
                        filename: a.nombre,
                        content: a.contenido.split('base64,')[1],
                        encoding: 'base64',
                    };
                });
            const message = {
                from,
                to: correo.para.join(','),
                subject: correo.asunto,
                html: correo.cuerpo,
                attachments: adjuntos,
            };
            transport.sendMail(message, (error, info) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    apartarUnidadesBpro(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const unidadesInteresRepository = yield connection.getRepository(catalogo_1.UnidadInteres);
            const unidadesInteres = yield unidadesInteresRepository.find({ select: ['vin', 'idSucursal'], where: idCotizacion });
            let unidadesApartadas = 0;
            for (const unidadInteres of unidadesInteres) {
                yield connection.query(`exec sp_bpro_apartavin @Sucursal='${unidadInteres.idSucursal}', @VIN='${unidadInteres.vin}'`);
                unidadesApartadas++;
            }
            resolve(unidadesApartadas);
        }));
    }
    apartarUnidadesGestion(unidades) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let unidadesApartadas = 0;
            for (const unidad of unidades) {
                yield connection.query(`exec sp_bpro_apartavin @Sucursal='${unidad.idSucursal}', @VIN='${unidad.vin}'`);
                unidadesApartadas++;
            }
            resolve(unidadesApartadas);
        }));
    }
    desapartarUnidadesBpro(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const unidadesInteresRepository = yield connection.getRepository(catalogo_1.UnidadInteres);
            const unidadesInteres = yield unidadesInteresRepository.find({ select: ['vin'], where: idCotizacion });
            let unidadesDesapartadas = 0;
            for (const unidadInteres of unidadesInteres) {
                yield connection.query(`exec sp_bpro_despartavin @Sucursal='${unidadInteres.idSucursal}', @VIN='${unidadInteres.vin}'`);
                unidadesDesapartadas++;
            }
            resolve(unidadesDesapartadas);
        }));
    }
    desapartarUnidadesGestion(unidades) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let unidadesApartadas = 0;
            for (const unidad of unidades) {
                yield connection.query(`exec sp_bpro_despartavin @Sucursal='${unidad.idSucursal}', @VIN='${unidad.vin}'`);
                unidadesApartadas++;
            }
            resolve(unidadesApartadas);
        }));
    }
    getFechaMinimaPromesaEntrega(idCotizacion, idGrupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const repositoryTraslado = connection.getRepository(cotizador_1.CotizacionTraslado);
            let maxDate = (yield repositoryTraslado.createQueryBuilder().select('MAX(CotizacionTraslado.fechaEntrega)', 'max')
                .where('CotizacionTraslado.idCotizacion = :idCotizacion', { idCotizacion })
                .andWhere('CotizacionTraslado.idGrupoUnidad = :idGrupoUnidad', { idGrupoUnidad })
                .getRawOne()).max;
            const today = new Date();
            maxDate = (maxDate == undefined) ? new Date(today.getFullYear(), today.getMonth(), today.getDate()) : maxDate;
            resolve(maxDate);
        }));
    }
    getFacturacionUnidades(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const repositoryFacturacionUnidad = connection.getRepository(catalogo_1.FacturacionUnidad);
            let facturacionesUnidad = yield repositoryFacturacionUnidad.find({ where: { idCotizacion } });
            facturacionesUnidad = facturacionesUnidad.map((fu) => {
                fu.unidadFacturada = fu.unidadFacturada == '1' ? true : false;
                return fu;
            });
            resolve(facturacionesUnidad);
        }));
    }
    saveCotizacionUnidadAccesorioMovs(idCotizacion, idGrupoUnidad, idDetalleUnidad, accesoriosMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let accesoriosGuardados = 0;
            if (accesoriosMov.length == 0) {
                resolve(accesoriosGuardados);
                return;
            }
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const accesorioMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadAccesorioMov);
                const cotizacionDetalleUnidadRepo = manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                // await accesorioMovRepository.delete({
                //     idCotizacion,
                //     idGrupoUnidad,
                //     idDetalleUnidad,
                // });
                for (const accesorioMov of accesoriosMov) {
                    accesorioMov.fechaModificacion = new Date();
                    accesorioMov.idAccesorioNuevo = (accesorioMov.idAccesorioNuevo == null) ? -1 : accesorioMov.idAccesorioNuevo;
                    if (accesorioMov.tipoMovimiento === 'B') {
                        yield manager.query(`exec sp_Flotillas_ValidaOCAccesorio @idCotizacion = '${idCotizacion}', @idParte = '${accesorioMov.idParte}', @idAccesorioNuevo = '${accesorioMov.idAccesorioNuevo}', @cantidad = '${accesorioMov.cantidad}'`)
                            .then((resp) => __awaiter(this, void 0, void 0, function* () {
                            // console.log(resp, '¿RESPUESTA SP VALIDA ACCESORIO EN MOVS?');
                            // console.log(resp[0].Success, resp[0].Success === 0, '||', resp[0].Success === '0', (resp[0].Success === 0 || resp[0].Success === '0'));
                            if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                                yield accesorioMovRepository.save(accesorioMov)
                                    .catch(reject);
                                accesoriosGuardados++;
                            }
                            else {
                                const cotizacionDetalleUnidadFindOne = yield cotizacionDetalleUnidadRepo.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                                if (cotizacionDetalleUnidadFindOne && cotizacionDetalleUnidadFindOne.vin) {
                                    yield accesorioMovRepository.save(accesorioMov)
                                        .catch(reject);
                                    accesoriosGuardados++;
                                }
                            }
                        })).catch(reject);
                    }
                    else {
                        yield accesorioMovRepository.save(accesorioMov)
                            .catch(reject);
                        accesoriosGuardados++;
                    }
                }
                resolve(accesoriosGuardados);
            }));
        }));
    }
    // OCT99 BORRA ACCESORIO POR UNIDAD GESTION - POSTERIOR
    // 20201106
    deleteCotizacionUnidadAccesorioMovs(idCotizacion, idGrupoUnidad, idParte, idAccesorioNuevo, idDetalleUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const validacion = yield queryRunnerVRC.query(`exec sp_Flotillas_BorraAccesorioPosterior @idCotizacion = '${idCotizacion}`
                    + `', @idParte   = '${idParte}`
                    + `', @idAccesorioNuevo  = '${idAccesorioNuevo}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idDetalleUnidad  = '${idDetalleUnidad}'`);
                resolve(validacion);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT99 BORRA TRAMITE POR UNIDAD GESTION - POSTERIOR
    // 20201106
    deleteCotizacionUnidadTramiteMovs(idCotizacion, idGrupoUnidad, idTramite, idSubTramite, idDetalleUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            console.log(idCotizacion);
            console.log(idGrupoUnidad);
            console.log(idTramite);
            console.log(idSubTramite);
            console.log(idDetalleUnidad);
            try {
                const validacion = yield queryRunnerVRC.query(`exec sp_Flotillas_BorraTramitePosterior @idCotizacion = '${idCotizacion}`
                    + `', @idTramite    = '${idTramite}`
                    + `', @idSubTramite   = '${idSubTramite}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idDetalleUnidad  = '${idDetalleUnidad}'`);
                resolve(validacion);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 GESTION
    saveGestionUnidadAccesorioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, accesoriosMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let accesoriosGuardados = 0;
            if (accesoriosMov.length == 0) {
                resolve(accesoriosGuardados);
                return;
            }
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                for (const accesorioMov of accesoriosMov) {
                    accesorioMov.fechaModificacion = new Date();
                    accesorioMov.idAccesorioNuevo = (accesorioMov.idAccesorioNuevo == null) ? -1 : accesorioMov.idAccesorioNuevo;
                    console.log('saveGestionUnidadAccesorioGrupal:');
                    console.log(accesorioMov);
                    yield manager.query(`exec sp_Flotillas_GuardarAccesoriosMovGrupo @idCotizacion = '${idCotizacion}'`
                        + `, @idGrupoUnidad  = '${idGrupoUnidad}`
                        + `', @idParte = '${accesorioMov.idParte}`
                        + `', @idAccesorioNuevo = '${accesorioMov.idAccesorioNuevo}`
                        + `', @nombre = '${accesorioMov.nombre}`
                        /*
                        + `', @idTipoProveedor = '${accesorioMov.idTipoProveedor}`
                        + `', @idProveedor = '${accesorioMov.idProveedor}`
                        + `', @nombreProveedor = '${accesorioMov.nombreProveedor}`
                        */
                        + `', @modeloAnio = '${accesorioMov.modeloAnio}`
                        + `', @cantidad = '${accesorioMov.cantidad}`
                        + `', @costo = '${accesorioMov.costo}`
                        + `', @precio = '${accesorioMov.precio}`
                        + `', @tipoMovimiento = 'A`
                        + `', @idUsuario = '${accesorioMov.idUsuarioModificacion}'`)
                        .then((resp) => __awaiter(this, void 0, void 0, function* () {
                        console.log(resp);
                        if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                            accesoriosGuardados++;
                        }
                        else {
                            accesoriosGuardados++;
                        }
                    })).catch((err) => reject(err));
                }
                resolve(accesoriosGuardados);
            }));
        }));
    }
    // OCT 99 GESTION
    deleteGestionUnidadAccesorioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, accesoriosMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let accesoriosEliminados = 0;
            if (accesoriosMov.length == 0) {
                resolve(accesoriosEliminados);
                return;
            }
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                for (const accesorioMov of accesoriosMov) {
                    accesorioMov.fechaModificacion = new Date();
                    accesorioMov.idAccesorioNuevo = (accesorioMov.idAccesorioNuevo == null) ? -1 : accesorioMov.idAccesorioNuevo;
                    yield manager.query(`exec sp_Flotillas_EliminaMovimientoAccesorioGrupo @idCotizacion = '${idCotizacion}'`
                        + `, @idGrupoUnidad  = '${idGrupoUnidad}`
                        + `', @idParte = '${accesorioMov.idParte}`
                        + `', @idAccesorioNuevo = '${accesorioMov.idAccesorioNuevo}`
                        + `', @precio = '${accesorioMov.precio}`
                        + `', @tipoMovimiento = '${accesorioMov.tipoMovimiento}'`)
                        /*
                        + `', @idAccesorioNuevo = '${accesorioMov.idAccesorioNuevo}`
                        + `', @nombre = '${accesorioMov.nombre}`
                        + `', @idTipoProveedor = '${accesorioMov.idTipoProveedor}`
                        + `', @idProveedor = '${accesorioMov.idProveedor}`
                        + `', @nombreProveedor = '${accesorioMov.nombreProveedor}`
                        + `', @modeloAnio = '${accesorioMov.modeloAnio}`
                        + `', @cantidad = '${accesorioMov.cantidad}`
                        + `', @costo = '${accesorioMov.costo}`
                        + `', @precio = '${accesorioMov.precio}`
                        + `', @idUsuario = '${accesorioMov.idUsuarioModificacion}'`)*/
                        .then((resp) => __awaiter(this, void 0, void 0, function* () {
                        console.log(resp);
                        if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                            accesoriosEliminados++;
                        }
                        else {
                            accesoriosEliminados++;
                        }
                    })).catch(reject);
                }
                resolve(accesoriosEliminados);
            }));
        }));
    }
    saveCotizacionUnidadTramiteMovs(tramitesMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let tramitesGuardados = 0;
            if (tramitesMov.length == 0) {
                resolve(tramitesGuardados);
                return;
            }
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const tramiteMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadTramiteMov);
                for (const tramiteMov of tramitesMov) {
                    tramiteMov.fechaModificacion = new Date();
                    yield tramiteMovRepository.save(tramiteMov);
                    tramitesGuardados++;
                }
                resolve(tramitesGuardados);
            }));
        }));
    }
    // OCT 99 GESTION
    saveCotizacionUnidadTramiteGrupal(tramitesMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let tramitesGuardados = 0;
            if (tramitesMov.length == 0) {
                resolve(tramitesGuardados);
                return;
            }
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                for (const tramite of tramitesMov) {
                    yield manager.query(`exec sp_Flotillas_GuardarTramitesMovGrupo @idCotizacion = '${tramite.idCotizacion}`
                        + `', @idGrupoUnidad  = '${tramite.idGrupoUnidad}`
                        + `', @idTramite = '${tramite.idTramite}`
                        + `', @idSubtramite = '${tramite.idSubtramite}`
                        + `', @idProveedor = '${tramite.idProveedor}`
                        + `', @nombreTramite = '${tramite.nombreTramite}`
                        + `', @nombreSubtramite = '${tramite.nombreSubtramite}`
                        + `', @nombreProveedor = '${tramite.nombreProveedor}`
                        + `', @costo = '${tramite.costo}`
                        + `', @precio = '${tramite.precio}`
                        // + `', @tipoMovimiento = 'A`
                        + `', @idUsuario = '${tramite.idUsuarioModificacion}'`)
                        .then((resp) => __awaiter(this, void 0, void 0, function* () {
                        if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                            tramitesGuardados++;
                        }
                        else {
                            tramitesGuardados++;
                        }
                    })).catch(reject);
                }
                resolve(tramitesGuardados);
            }));
        }));
    }
    // OCT 99 GESTION
    saveCambioDeProveedor(tipo, idCotizacion, idTramite, idSubtramiteOld, proveedorNew, importeNew, idSubtramiteNew) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const validacion = yield queryRunnerVRC.query(`exec sp_Flotillas_insertaCambioProveedor @npv_tipo = '${tipo}`
                    + `', @idCotizacion    = '${idCotizacion}`
                    + `', @idTramite   = '${idTramite}`
                    + `', @npv_idsubtramOld  = '${idSubtramiteOld}`
                    + `', @npv_proveedorNew  = '${proveedorNew}`
                    + `', @npv_importeNew    = '${importeNew}`
                    + `', @npv_idsubtramNew  = '${idSubtramiteNew}'`);
                resolve(validacion);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT 99 GESTION
    deleteCotizacionUnidadTramiteGrupal(tramitesMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let tramitesEliminados = 0;
            if (tramitesMov.length == 0) {
                resolve(tramitesEliminados);
                return;
            }
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                for (const tramite of tramitesMov) {
                    yield manager.query(`exec sp_Flotillas_EliminaMovimientoTramiteGrupo @idCotizacion = '${tramite.idCotizacion}`
                        + `', @idGrupoUnidad  = '${tramite.idGrupoUnidad}`
                        + `', @idSubtramite = '${tramite.idSubtramite}`
                        + `', @precio = '${tramite.precio}`
                        + `', @tipoMovimiento = '${tramite.tipoMovimiento}'`)
                        /*
                        + `', @idTramite = '${tramite.idTramite}`
                        + `', @idProveedor = '${tramite.idProveedor}`
                        + `', @nombreTramite = '${tramite.nombreTramite}`
                        + `', @nombreSubtramite = '${tramite.nombreSubtramite}`
                        + `', @nombreProveedor = '${tramite.nombreProveedor}`
                        + `', @costo = '${tramite.costo}`
                        + `', @precio = '${tramite.precio}`
                        + `', @idUsuario = '${tramite.idUsuarioModificacion}'`)*/
                        .then((resp) => __awaiter(this, void 0, void 0, function* () {
                        if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                            tramitesEliminados++;
                        }
                        else {
                            tramitesEliminados++;
                        }
                    })).catch(reject);
                }
                resolve(tramitesEliminados);
            }));
        }));
    }
    saveCotizacionUnidadServicioMovs(idCotizacion, idGrupoUnidad, idDetalleUnidad, serviciosMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let serviciosGuardados = 0;
            if (serviciosMov.length == 0) {
                resolve(serviciosGuardados);
                return;
            }
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const servicioMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadServicioUnidadMov);
                // await servicioMovRepository.delete({
                //     idCotizacion,
                //     idGrupoUnidad,
                //     idDetalleUnidad,
                // });
                for (const servicioMov of serviciosMov) {
                    servicioMov.fechaModificacion = new Date();
                    yield servicioMovRepository.save(servicioMov);
                    serviciosGuardados++;
                }
                resolve(serviciosGuardados);
            }));
        }));
    }
    // OCT 99 GESTION
    saveCotizacionUnidadServicioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, serviciosMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let serviciosGuardados = 0;
            if (serviciosMov.length == 0) {
                resolve(serviciosGuardados);
                return;
            }
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                for (const servicio of serviciosMov) {
                    yield manager.query(`exec sp_Flotillas_GuardarServicioMovGrupo @idCotizacion = '${idCotizacion}`
                        + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                        + `', @idServicioUnidad = '${servicio.idServicioUnidad}`
                        + `', @catalogo = '${servicio.catalogo}`
                        + `', @anio = '${servicio.anio}`
                        + `', @nombre = '${servicio.nombre}`
                        + `', @descripcion = '${servicio.descripcion}`
                        + `', @costo = '${servicio.costo}`
                        + `', @precio = '${servicio.precio}`
                        + `', @tipoMovimiento = 'A`
                        + `', @idUsuario = '${servicio.idUsuarioModificacion}'`)
                        .then((resp) => __awaiter(this, void 0, void 0, function* () {
                        if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                            serviciosGuardados++;
                        }
                        else {
                            serviciosGuardados++;
                        }
                    })).catch(reject);
                }
                resolve(serviciosGuardados);
            }));
        }));
    }
    // OCT 99 GESTION
    deleteCotizacionUnidadServicioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, serviciosMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let serviciosEliminados = 0;
            if (serviciosMov.length == 0) {
                resolve(serviciosEliminados);
                return;
            }
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                for (const servicio of serviciosMov) {
                    yield manager.query(`exec sp_Flotillas_EliminaMovimientoServicioGrupo @idCotizacion = '${idCotizacion}`
                        + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                        + `', @idServicioUnidad = '${servicio.idServicioUnidad}`
                        + `', @tipoMovimiento = '${servicio.tipoMovimiento}'`)
                        /*
                        + `', @catalogo = '${servicio.catalogo}`
                        + `', @anio = '${servicio.anio}`
                        + `', @nombre = '${servicio.nombre}`
                        + `', @descripcion = '${servicio.descripcion}`
                        + `', @costo = '${servicio.costo}`
                        + `', @precio = '${servicio.precio}`
                        + `', @idUsuario = '${servicio.idUsuarioModificacion}'`)*/
                        .then((resp) => __awaiter(this, void 0, void 0, function* () {
                        if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                            serviciosEliminados++;
                        }
                        else {
                            serviciosEliminados++;
                        }
                    })).catch(reject);
                }
                resolve(serviciosEliminados);
            }));
        }));
    }
    saveCotizacionUnidadTrasladoMovs(trasladoMov) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionUnidadTrasladoMovRepo = connection.getRepository(cotizador_1.CotizacionUnidadTrasladoMov);
            cotizacionUnidadTrasladoMovRepo.save(trasladoMov)
                .then((rs) => resolve(rs))
                .catch((err) => reject(err));
        }));
    }
    deleteUnidadApartadaCotizacion(idCotizacion, idGrupoUnidad, idDetalleUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionDetalleUnidadRespository = manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const existDetalleUnidad = cotizacionDetalleUnidadRespository.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                if (!existDetalleUnidad) {
                    resolve({ status: 200, message: `No se ha encontrado el detalle de la unidad` });
                }
                yield cotizacionDetalleUnidadRespository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                resolve({ status: 200, message: `Se ha eliminado el detalle de la unidad con id detalle unidad ${idDetalleUnidad}` });
            }))
                .catch(reject);
        }));
    }
    /* chk 06 - jun - 2020 se creo esta funcion que se llama al final del deleteStatusProcesadoBpro por que no se
    ejecutaban los SP para elimnar las unidades.*/
    BorraFlotillas(existeVin, idCotizacion, sucursal, vin) {
        return new Promise((resolve, rejec) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            if (existeVin) {
                yield connection.query(`exec sp_Flotillas_EliminaUnidadCompleta @idCotizacion='${idCotizacion}', @idSucursal='${sucursal}', @vin='${vin}'`)
                    .then((resp5) => {
                    console.log(resp5, 'respuesta sp sp_Flotillas_EliminaUnidadCompleta');
                    resolve();
                })
                    .catch((Error) => {
                    rejec(Error);
                    console.log(Error, 'Error sp_Flotillas_EliminaUnidadCompleta');
                });
            }
        }));
    }
    deleteStatusProcesadoBpro(detallesUnidades, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionDetalleUnidadRepository = manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const cotizacionDetalleUnidadMovRepository = manager.getRepository(cotizador_1.CotizacionDetalleUnidadMov);
                const cotizacionUnidadTramiteMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadTramiteMov);
                const cotizacionUnidadServicioUnidadMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadServicioUnidadMov);
                const cotizacionUnidadAccesorioMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadAccesorioMov);
                // Validar que la cotización tenga el estatus APROBADA, ORDENES DE COMPRA PENDIENTES Y ORDENES DE COMPRA COMPLETADAS
                if (!detallesUnidades.length) {
                    reject({ status: 422, error: `No se han seleccionado unidades` });
                }
                for (const detalleUnidad of detallesUnidades) {
                    const idCotizacion = detalleUnidad.idCotizacion;
                    const idGrupoUnidad = detalleUnidad.idGrupoUnidad;
                    const idDetalleUnidad = detalleUnidad.idDetalleUnidad;
                    const procesadoBpro = detalleUnidad.procesadoBpro;
                    const tipoMovimiento = detalleUnidad.tipoMovimiento;
                    const existCotizacionDetalleUnidad = yield cotizacionDetalleUnidadRepository.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                    if (!existCotizacionDetalleUnidad) {
                        reject({ status: 404, message: `No se ha encontrado el detalle de la unidad` });
                    }
                    existCotizacionDetalleUnidad.fechaModificacion = new Date();
                    existCotizacionDetalleUnidad.idUsuarioModificacion = idUsuario;
                    existCotizacionDetalleUnidad.procesadoBpro = procesadoBpro;
                    existCotizacionDetalleUnidad.tipoMovimiento = tipoMovimiento;
                    const cotizacion = yield cotizacionRepository.findOne({ idCotizacion });
                    yield cotizacionDetalleUnidadRepository.update({ idCotizacion, idGrupoUnidad, idDetalleUnidad }, existCotizacionDetalleUnidad)
                        .then((resp) => {
                        // console.log(resp, 'respuesta 1 .cotizacionDetalleUnidadRepository.update');
                        resolve();
                    })
                        .catch((Error) => {
                        // console.log(Error, 'Error 1');
                        reject(Error);
                    });
                    yield cotizacionDetalleUnidadMovRepository.save(existCotizacionDetalleUnidad)
                        .then((resp1) => {
                        // console.log(resp1, 'respuesta 2. cotizacionDetalleUnidadMovRepository.save');
                        resolve();
                    })
                        .catch((Error) => {
                        // console.log(Error, 'Error 2');
                        reject(Error);
                    });
                    yield cotizacionUnidadTramiteMovRepository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad })
                        .then((resp2) => {
                        // console.log(resp2, 'respuesta 3. cotizacionUnidadTramiteMovRepository.delete');
                        resolve();
                    })
                        .catch((Error) => {
                        // console.log(Error, 'Error 3');
                        reject(Error);
                    });
                    yield cotizacionUnidadServicioUnidadMovRepository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad })
                        .then((resp3) => {
                        // console.log(resp3, 'respuesta 4. cotizacionUnidadServicioUnidadMovRepository.delete');
                        resolve();
                    })
                        .catch((Error) => {
                        // console.log(Error, 'Error 4');
                        reject(Error);
                    });
                    yield cotizacionUnidadAccesorioMovRepository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad })
                        .then((resp4) => {
                        // console.log(resp4, 'respuesta 5. cotizacionUnidadAccesorioMovRepository.delete');
                        resolve();
                    })
                        .catch((Error) => {
                        // console.log(Error, 'Error 5');
                        reject(Error);
                    });
                    // console.log('>>>> llama nueva funcion ¿vin?');
                    /*sp_Flotillas_EliminaUnidadCompleta es porque la unidad tiene VIN,
                    si no tiene vin es porque se fue a órdenes de compra y se debe ejecutar
                    sp_Flotillas_CancelaUnidadOrdenCompra*/
                    if (!existCotizacionDetalleUnidad.vin) {
                        this.CancelaUnidadOrdenCompra(idCotizacion, existCotizacionDetalleUnidad.idGrupoUnidad, existCotizacionDetalleUnidad.idDetalleUnidad);
                    }
                    else {
                        /* chk 06 - jun - 2020 sellama la nueva fucnion para ejecutar el SP de borrado*/
                        this.BorraFlotillas(existCotizacionDetalleUnidad.vin, idCotizacion, cotizacion.idSucursal, existCotizacionDetalleUnidad.vin);
                    }
                    // if (['APROBADA', 'ORDENES DE COMPRA PENDIENTES', 'ORDENES DE COMPRA COMPLETADAS'].includes(cotizacion.status)) {
                    /* } else {
                        reject({ status: 400, error: `No se realizo la eliminación de las unidades, la cotización tiene estatus ${cotizacion.status}` });
                    } */
                }
                resolve({ status: 200, message: `Se ha actualizado el status procesadoBpro sactisfactoriamente` });
            }))
                .catch(reject);
        }));
    }
    asignarVinDetalleUnidad(detallesUnidades, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                var e_2, _a;
                const cotizacionRepository = manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionDetalleUnidad = manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                if (!detallesUnidades.length) {
                    reject({ status: 422, error: `No se han seleccionado unidades` });
                }
                try {
                    for (var detallesUnidades_1 = __asyncValues(detallesUnidades), detallesUnidades_1_1; detallesUnidades_1_1 = yield detallesUnidades_1.next(), !detallesUnidades_1_1.done;) {
                        const detalleUnidad = detallesUnidades_1_1.value;
                        const idCotizacion = detalleUnidad.idCotizacion;
                        const idGrupoUnidad = detalleUnidad.idGrupoUnidad;
                        const idDetalleUnidad = detalleUnidad.idDetalleUnidad;
                        const vin = detalleUnidad.vin;
                        const existCotizacionDetalleUnidad = yield cotizacionDetalleUnidad.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                        const existCotizacon = yield cotizacionRepository.findOne({ idCotizacion });
                        if (!existCotizacionDetalleUnidad) {
                            reject({ status: 404, error: `No se han encontrado el detalle de la unidad` });
                        }
                        if (!existCotizacon) {
                            reject({ status: 404, error: `No se han encontrado la cotizacion` });
                        }
                        // existCotizacionDetalleUnidad.fechaModificacion = new Date();
                        // existCotizacionDetalleUnidad.idUsuarioModificacion = idUsuario;
                        // existCotizacionDetalleUnidad.vin = vin;
                        // await cotizacionDetalleUnidad.update({ idCotizacion, idGrupoUnidad, idDetalleUnidad }, existCotizacionDetalleUnidad).catch(reject);
                        yield connection.query(`exec sp_Flotillas_MovimientosServicio @idCotizacion = '${idCotizacion}', @idusuario = '${idUsuario}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`)
                            .then((resp) => __awaiter(this, void 0, void 0, function* () {
                            console.log(resp, '¿SP DE MOVIMIENTOS SERVICIO?');
                            if (resp[0].Success && (resp[0].Success === 1 || resp[0].Success === '1')) {
                                console.log('¿PROCESO 1?');
                                yield connection.query(`exec sp_Flotillas_MovimientosTramite @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`)
                                    .then((res) => __awaiter(this, void 0, void 0, function* () {
                                    console.log(resp, '¿SP DE MOVIMIENTOS TRAMITES?');
                                    if (res[0].Success && (res[0].Success === 1 || res[0].Success === '1')) {
                                        console.log('¿PROCESO 2?');
                                        const apartavin = yield connection.query(`exec sp_bpro_apartavin @Sucursal='${existCotizacon.idSucursal}', @VIN='${vin}'`);
                                        console.log(apartavin, '¿SP DE BPRO APARTA VIN?');
                                        if ((apartavin[0].Respuesta && apartavin[0].Respuesta === 1 || apartavin[0].Respuesta === '1')) {
                                            console.log('¿PROCESO 3?');
                                            const insertaUnidadCompra = yield connection.query(`exec sp_Flotillas_InsertaUnidadCompra @idCotizacion='${idCotizacion}', @vin='${vin}',
                                        @idUsuario='${idUsuario}', @idDetalleUnidad='${idDetalleUnidad}', @idGrupoUnidad='${idGrupoUnidad}'`);
                                            console.log(insertaUnidadCompra, '¿REGRESO DE SP INSERTA UNIDAD COMPRA?');
                                            // if (insertaUnidadCompra[0].Success && (insertaUnidadCompra[0].Success === 1 || insertaUnidadCompra[0].Success === '1')) {
                                            const condiciones = yield connection.query(`exec sp_Flotillas_ActualizaCondiciones @idCotizacion = '${idCotizacion}'`);
                                            console.log(condiciones, '¿ACTUALIZA CONDICIONES ASIGNAR VIN DETALLE UNIDAD?');
                                            // }
                                        }
                                    }
                                }))
                                    .catch((err) => reject({ status: 500, error: err }));
                            }
                            else {
                                reject({ status: 422, error: `No se puede realizar la asignación del vin` });
                            }
                        }))
                            .catch((err) => reject({ status: 500, error: err }));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (detallesUnidades_1_1 && !detallesUnidades_1_1.done && (_a = detallesUnidades_1.return)) yield _a.call(detallesUnidades_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                resolve({ status: 200, success: `Se ha actualizado el VIN sactisfactoriamente` });
            }))
                .catch((err) => reject({ status: 500, error: err }));
        }));
    }
    getCotizacionTraslado(idProveedor, idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionTraslado = connection.getRepository(cotizador_1.CotizacionTraslado);
            cotizacionTraslado.findOne({ idProveedor, idCotizacion })
                .then((rs) => resolve(rs))
                .catch((err) => reject(err));
        }));
    }
    getVinAsignadoBpro(idCotizacion, idEmpresa, idSucursal) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_bpro_inventarionuevos @Empresa = '${idEmpresa}', @Sucursal = '${idSucursal}'`)
                .then((inventarioBpro) => {
                if (!inventarioBpro.length) {
                    reject({ status: 404, error: `No se ha podido obtener el inventario` });
                }
                const vinesAsignadosBpro = inventarioBpro.filter((invetario) => invetario.idCotizacion === idCotizacion);
                if (!vinesAsignadosBpro.length) {
                    reject({ status: 404, error: `No se ha podido obtener el inventario asignado a BPRO` });
                }
                resolve(vinesAsignadosBpro);
            })
                .catch(reject);
        }));
    }
    conteoGlobalUnidadesInteres(idCotizacion, idGrupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const unidadInteresRepository = yield connection.getRepository(catalogo_1.UnidadInteres);
            const existUnidadInteres = yield unidadInteresRepository.find({ where: { idCotizacion, idGrupoUnidad } });
            if (!existUnidadInteres.length) {
                resolve(0);
            }
            resolve(existUnidadInteres.length);
        }));
    }
    clienteFacturacion(idCotizacion, idCliente, nombreCliente, idContacto) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepo = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionFindO = yield cotizacionRepo.findOne({ idCotizacion });
                if (cotizacionFindO) {
                    cotizacionFindO.idCliente = idCliente;
                    cotizacionFindO.idClienteContacto = idContacto;
                    cotizacionFindO.nombreCliente = nombreCliente;
                    yield cotizacionRepo.update({ idCotizacion }, cotizacionFindO)
                        .catch(reject);
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }));
        }));
    }
    // Facturacion Adicionales
    adicionalesFacturacion(idCotizacion, idClienteFacturaAdicionales, numeroOCAdicionales) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepo = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionFindO = yield cotizacionRepo.findOne({ idCotizacion });
                if (cotizacionFindO) {
                    cotizacionFindO.idClienteFacturaAdicionales = idClienteFacturaAdicionales;
                    cotizacionFindO.numeroOCAdicionales = numeroOCAdicionales;
                    yield cotizacionRepo.update({ idCotizacion }, cotizacionFindO)
                        .catch(reject);
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }));
        }));
    }
    sumaTipoCargoUnidad(idCotizacion, tipoCargoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionGrupoRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoUnidad);
                const cotizacionDetalleRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                yield cotizacionRepository.update({ idCotizacion }, { tipoCargoUnidad })
                    .catch(reject);
                yield cotizacionGrupoRepository.update({ idCotizacion }, { tipoCargoUnidad })
                    .catch(reject);
                yield cotizacionDetalleRepository.update({ idCotizacion }, { tipoCargoUnidad })
                    .catch(reject);
                resolve(true);
            }));
        }));
    }
    creditoLimiteCliente(idCotizacion, idCliente) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_CreditoCliente @idCotizacion = '${idCotizacion}', @idCliente = '${idCliente}'`)
                .then((credito) => {
                if (credito[0].Success != null && credito[0].Success === 1) {
                    resolve(true);
                }
                resolve(false);
            })
                .catch(reject);
        }));
    }
    documentosVencidos(idCotizacion, idCliente) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_DocumentosVencidos @idCotizacion = '${idCotizacion}', @idCliente = '${idCliente}'`)
                .then((doc) => {
                if (doc[0].Success != null && doc[0].Success === 0) {
                    resolve(false);
                }
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    notificaionEnv(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepo = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionFindO = yield cotizacionRepo.findOne({ idCotizacion });
                if (cotizacionFindO) {
                    cotizacionFindO.notificacion = true;
                    yield cotizacionRepo.update({ idCotizacion }, cotizacionFindO)
                        .catch(reject);
                    resolve(true);
                }
                else {
                    reject(false);
                }
            }));
        }));
    }
    actualizarBonificacion(idCotizacion, idGrupoUnidad, bonificacion, idBonificacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionGrupoUnidadRepo = yield manager.getRepository(cotizador_1.CotizacionGrupoUnidad);
                const cotizacionGrupoUnidadFindOne = yield cotizacionGrupoUnidadRepo.findOne({ idCotizacion, idGrupoUnidad });
                if (cotizacionGrupoUnidadFindOne) {
                    cotizacionGrupoUnidadFindOne.bonificacion = bonificacion;
                    cotizacionGrupoUnidadFindOne.idBonificacion = idBonificacion;
                    yield cotizacionGrupoUnidadRepo.update({ idCotizacion, idGrupoUnidad }, cotizacionGrupoUnidadFindOne)
                        .catch(reject);
                    resolve(true);
                }
                resolve(false);
            }))
                .catch(reject);
        }));
    }
    actulizarImprimeFactura(idCotizacion, idGrupoUnidad, idDetalleUnidad, imprimeFactura) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                let updated = false;
                const cotizacionRepo = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionGrupoUnidadRepo = yield manager.getRepository(cotizador_1.CotizacionGrupoUnidad);
                const cotizacionDetalleUnidadRepo = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const cotizacionFindOne = yield cotizacionRepo.findOne({ idCotizacion });
                const cotizacionGrupoUnidadFindOne = yield cotizacionGrupoUnidadRepo.findOne({ idCotizacion, idGrupoUnidad });
                const cotizacionDetalleUnidadFindOne = yield cotizacionDetalleUnidadRepo.findOne({ idCotizacion, idDetalleUnidad });
                const cotizacionDetalleUnidadGrupoUnidadFindOne = yield cotizacionDetalleUnidadRepo.findOne({ idCotizacion, idGrupoUnidad });
                if (cotizacionFindOne) {
                    yield cotizacionRepo.update({ idCotizacion }, { imprimeFactura })
                        .catch(reject);
                    yield cotizacionGrupoUnidadRepo.update({ idCotizacion }, { imprimeFactura })
                        .catch(reject);
                    yield cotizacionDetalleUnidadRepo.update({ idCotizacion }, { imprimeFactura })
                        .catch(reject);
                    updated = true;
                }
                if (cotizacionGrupoUnidadFindOne && cotizacionDetalleUnidadGrupoUnidadFindOne) {
                    yield cotizacionGrupoUnidadRepo.update({ idCotizacion, idGrupoUnidad }, { imprimeFactura })
                        .catch(reject);
                    yield cotizacionDetalleUnidadRepo.update({ idCotizacion, idGrupoUnidad }, { imprimeFactura })
                        .catch(reject);
                    updated = true;
                }
                if (cotizacionFindOne && cotizacionGrupoUnidadFindOne && cotizacionDetalleUnidadFindOne) {
                    yield cotizacionDetalleUnidadRepo.update({ idCotizacion, idGrupoUnidad }, { imprimeFactura })
                        .catch(reject);
                    updated = true;
                }
                // if (cotizacionFindOne) {
                //     cotizacionFindOne.imprimeFactura = imprimeFactura;
                //     await cotizacionRepo.update({ idCotizacion }, cotizacionFindOne)
                //     .catch(reject);
                //     updated = true;
                // }
                // if (cotizacionFindOne && cotizacionGrupoUnidadFindOne) {
                //     cotizacionGrupoUnidadFindOne.imprimeFactura = imprimeFactura;
                //     await cotizacionGrupoUnidadRepo.update({ idCotizacion, idGrupoUnidad }, cotizacionGrupoUnidadFindOne)
                //     .catch(reject);
                //     updated = true;
                // }
                // if (cotizacionFindOne && cotizacionDetalleUnidadFindOne) {
                //     cotizacionDetalleUnidadFindOne.imprimeFactura = imprimeFactura;
                //     await cotizacionDetalleUnidadRepo.update({ idCotizacion, idDetalleUnidad }, cotizacionDetalleUnidadFindOne)
                //     .catch(reject);
                //     updated = true;
                // }
                resolve(updated);
            }));
        }));
    }
    getCfdiListingByAgency(idEmpresa) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield manager.query(`exec SEL_USO_CFDI_SP @idEmpresa = '${idEmpresa}'`)
                    .then((cfdis) => {
                    // console.log(cfdis, '¿LISTADO DE CFDIS?');
                    resolve(cfdis);
                })
                    .catch((err) => {
                    // console.log(err, '¿ERROR DEL SERVICIO GET CDFI LISTING BY AGENCY 1?');
                    reject(err);
                });
            }))
                .catch((err) => {
                // console.log(err, '¿ERROR DEL SERVICIO GET CDFI LISTING BY AGENCY 2?');
                reject(err);
            });
        }));
    }
    getDataContract(idCliente, idEmpresa, idSucursal) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield manager.query(`exec sp_Flotillas_obtenerCatalogoContratos @idCliente='${idCliente}',@idEmpresa = '${idEmpresa}', @idSucursal = '${idSucursal}'`)
                    .then((contratos) => {
                    resolve(contratos);
                })
                    .catch((err) => {
                    reject(err);
                });
            }))
                .catch((err) => {
                reject(err);
            });
        }));
    }
    validaDisponibleCierre(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_validaDisponible @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                if (doc[0].Success != null && doc[0].Success === 0) {
                    resolve(false);
                }
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // Cambio P10 - EHJ-COAL
    validaDisponibilidadInventario(idCotizacion, idDireccionFlotillas) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_validaDisponibilidadInventario @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // Cambio P10 - EHJ-COAL
    validaDisponibilidadInventarioPost(idCotizacion, idDireccionFlotillas) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_validaDisponibilidadInventarioPost @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // Cambio P10 - EHJ-COAL
    validaDisponibilidadInventarioPostUpdate(idCotizacion, idDireccionFlotillas) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_validaDisponibilidadInventarioPostUpdate @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // Cambio P10 - EHJ-COAL
    validaDisponibilidadFolio(idCotizacion, idDireccionFlotillas) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_validaDisponibilidadFolio @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // Cambio P10 - EHJ-COAL
    confirmaCancelacionAccesorio(idCotizacion, idDireccionFlotillas) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_confirmaCancelacionAccesorio @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // Cambio P07 - EHJ-COAL
    insertaBitacoraUtilidad(idCotizacion, idOpcion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_inserta_utilidad @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // Cambio P07 - EHJ-COAL
    insertaBitacoraUtilidadPosteriores(idCotizacion, idOpcion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_inserta_utilidad_posteriores @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // Cambio P07 - EHJ-COAL
    insertaBitacoraUtilidadAdicionales(idCotizacion, idOpcion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_inserta_utilidad_adicionales @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // Cambio Utilidad Total de la utilidad por vuelta - EHJ-COAL
    validaNotificacionUtilidad(idCotizacion, idOpcion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_validaNotificacionUtilidad @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // obtiene utilidad  - EHJ-COAL
    obtenTotalUtilidad(idCotizacion, idOpcion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_obtenTotalUtilidad @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // obtiene utilidad  - EHJ-COAL
    validaBotonUtilidad(idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_flotillas_obtenUsuarioUtilidad @idUsuario = '${idUsuario}'`)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // obtiene utilidad  - EHJ-COAL
    obtenNotificacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_obtenNotificacion @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // LBM-COAL
    validaPerfiles(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_flotillas_validaPerfiles @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // LBM-COAL
    validaTipoOrden(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_ValidaTipoOrden @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // LBM-COAL
    validaUnidadFacturada(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_ValidaUnidadFacturada @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    // LBM-COAL
    validaLimiteCredito(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_validaCredito @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    obtieneMargenUtilidadTraslado(direccionFlotilla) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_ObtieneMargenUtilidadTraslado @direccionFlotilla = '${direccionFlotilla}'`)
                .then((doc) => {
                // console.log(doc);
                resolve(doc[0].MargenUtilidad);
            })
                .catch(reject);
        }));
    }
    deleteUnidadInteres(idCotizacion, vin) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            // const cotizaacionUnidadInteres = await connection.getRepository(UnidadInteres);
            const cotizacion = yield connection.getRepository(cotizador_1.Cotizacion);
            const vines = vin.split(',');
            console.log(JSON.stringify(vin));
            console.log('<<<<< vines depues del split', JSON.stringify(vines));
            vines.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                console.log('<<<<< vines malos ', element);
                // await cotizaacionUnidadInteres.delete({ idCotizacion, vin: element });
                const Del = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .delete()
                    .from('UnidadInteres')
                    .where('idCotizacion = :idCotizacion AND vin = :element', { idCotizacion, element })
                    .execute();
                console.log(Del);
            }));
            yield cotizacion.update({ idCotizacion }, { notificacion: false })
                .then((deleteResult) => {
                resolve(1);
            }, reject);
        }));
    }
    NotificacionCotizacion1er(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const notificacion = yield typeorm_1.getConnection();
            yield notificacion.query(`SELECT notificacionCot1er FROM Cotizacion WHERE idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                resolve(doc[0]);
            })
                .catch(reject);
        }));
    }
    udpNotificacionCotizacion1er(idCotizacion, estatus) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const notificacion = yield typeorm_1.getConnection();
            const Update = yield notificacion.query(`UPDATE Cotizacion SET notificacionCot1er='${estatus}' WHERE idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                resolve(1);
            })
                .catch(reject);
        }));
    }
    CancelaUnidadOrdenCompra(idCotizacion, idGrupoUnidad, idDetalleUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = yield typeorm_1.getConnection();
            yield connection.query(`EXEC sp_Flotillas_CancelaUnidadOrdenCompra @idCotizacion='${idCotizacion}', @idGrupoUnidad ='${idGrupoUnidad}', @idDetalleUnidad='${idDetalleUnidad}'`)
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                resolve(resp);
                yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                    const cotizacionDetalleGrupoUnidadRepository = manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                    // cuento cuantas unidades son diferentes de B
                    const UnidadesDelete = yield cotizacionDetalleGrupoUnidadRepository.find({ idCotizacion, idGrupoUnidad, tipoMovimiento: '' });
                    // console.log('>>>> UnidadesDelete CotizacionDetalleGrupoUnidad | Cantidad  de NO B', UnidadesDelete.length);
                    // Actualizo el total de unidades en CotizacionGrupoUnidad
                    if (UnidadesDelete.length !== 0) {
                        yield typeorm_1.getConnection()
                            .createQueryBuilder()
                            .update(cotizador_1.CotizacionGrupoUnidad)
                            .set({ cantidad: UnidadesDelete.length })
                            .where('idCotizacion = :idCotizacion AND idGrupoUnidad = :idGrupoUnidad', { idCotizacion, idGrupoUnidad })
                            .execute();
                    }
                }));
            }))
                .catch(reject);
        }));
    }
    getpendienteSisco(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = yield typeorm_1.getConnection();
            yield connection.query(`EXEC sp_Flotillas_AccesoriosSISCO_PostAd @idCotizacion='${idCotizacion}'`)
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                resolve(resp);
            }))
                .catch(reject);
        }));
    }
    getestatusSisco(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = yield typeorm_1.getConnection();
            yield connection.query(`EXEC sp_Flotillas_ValidaPendientesSISCOPosteriores @idCotizacion='${idCotizacion}'`)
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                resolve(resp);
            }))
                .catch(reject);
        }));
    }
    cfdiCliente(idEmpresa, idSucursal, idCliente, idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = yield typeorm_1.getConnection();
            yield connection.query(`EXEC SEL_CFDICLIENTE_SP @idEmpresa='${idEmpresa}',@idSucursal ='${idSucursal}', @idCliente ='${idCliente}',@idCotizacion='${idCotizacion}'`)
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                resolve(resp);
            }))
                .catch(reject);
        }));
    }
}
exports.CotizadorBussiness = CotizadorBussiness;
//# sourceMappingURL=cotizador.bussiness.js.map