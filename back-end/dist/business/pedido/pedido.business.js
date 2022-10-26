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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const cotizador_1 = require("../../db/model/cotizador");
const cotizador_bussiness_1 = require("../cotizador/cotizador.bussiness");
class PedidoBusiness {
    constructor() {
        this.pedidoBusiness = new cotizador_bussiness_1.CotizadorBussiness();
    }
    consolidacionFlotillasBpro(idCotizacion, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_flotillas_consolidar_pedido @idCotizacion = '${idCotizacion}', @idUsuario = '${idUsuario}'`)
                .then((result) => {
                // console.log(result, '¿RESULTSET SP FLOTILLAS CONSOLIDACIÓN PEDIDO?');
                if (result[0].Success && (result[0].Success === '1' || result[0].Success === 1)) {
                    resolve(true);
                }
                reject({ error: `Error -> sp_flotillas_consolidar_pedido: ` + result[0].Error, status: 400 });
            })
                .catch(reject);
        }));
    }
    // DUMMY
    generarPedidoMovBproTraslado(idCotizacion, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = yield manager.getRepository(cotizador_1.Cotizacion);
                const existCotizacion = yield cotizacionRepository.findOne({ idCotizacion });
                if (existCotizacion) {
                    existCotizacion.idUsuario = idUsuario;
                    existCotizacion.status = 'PEDIDO GENERADO';
                    existCotizacion.fechaModificacion = new Date();
                    yield cotizacionRepository.update({ idCotizacion }, existCotizacion)
                        .catch(reject);
                    resolve(true);
                }
                resolve(false);
            }));
        }));
    }
    cancelarFacturacionUnidades(detalleUnidades, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionDetalleUnidadRepository = manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const cotizacionDetalleUnidadMovRepository = manager.getRepository(cotizador_1.CotizacionDetalleUnidadMov);
                for (const detalleUnidad of detalleUnidades) {
                    const idCotizacion = detalleUnidad.idCotizacion;
                    const idGrupoUnidad = detalleUnidad.idGrupoUnidad;
                    const idDetalleUnidad = detalleUnidad.idDetalleUnidad;
                    const procesadoBrop = detalleUnidad.procesadoBpro;
                    const tipoMovimiento = detalleUnidad.tipoMovimiento;
                    const existCotizacionDetalleUnidad = yield cotizacionDetalleUnidadRepository.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                    const existCotizacionDetalleUnidadMov = yield cotizacionDetalleUnidadMovRepository.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                    if (existCotizacionDetalleUnidad) {
                        existCotizacionDetalleUnidad.procesadoBpro = procesadoBrop;
                        existCotizacionDetalleUnidad.fechaModificacion = new Date();
                        existCotizacionDetalleUnidad.tipoMovimiento = tipoMovimiento;
                        existCotizacionDetalleUnidad.idUsuarioModificacion = idUsuario;
                        const cloneCotizacionDetalleUnidad = JSON.parse(JSON.stringify(existCotizacionDetalleUnidad));
                        delete cloneCotizacionDetalleUnidad.id;
                        if (!existCotizacionDetalleUnidadMov) {
                            yield cotizacionDetalleUnidadMovRepository.save(existCotizacionDetalleUnidad)
                                .catch(reject);
                            yield manager.query(`exec sp_Flotillas_CancelaUnidadFacturada @idCotizacion = '${idCotizacion}', @vin = '${existCotizacionDetalleUnidad.vin}'`)
                                .then((cancelado) => __awaiter(this, void 0, void 0, function* () {
                                // console.log(cancelado, '¿RESPUESTA SP FLOTILLAS CANCELA UNIDAD FACTURADA?');
                                if (cancelado.length > 0 && (cancelado[0].Success === 1 || cancelado[0].Success === '1')) {
                                    yield cotizacionDetalleUnidadRepository.update({ idCotizacion, idGrupoUnidad, idDetalleUnidad }, cloneCotizacionDetalleUnidad)
                                        .catch((error) => __awaiter(this, void 0, void 0, function* () {
                                        // console.log(error, '¿ERROR 1?');
                                        yield cotizacionDetalleUnidadMovRepository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad })
                                            .catch(reject);
                                    }));
                                    resolve(cancelado);
                                }
                                else {
                                    yield cotizacionDetalleUnidadMovRepository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad })
                                        .catch(reject);
                                    reject(cancelado);
                                }
                            }), (error) => __awaiter(this, void 0, void 0, function* () {
                                // console.log(error, '¿ERROR 2?');
                                yield cotizacionDetalleUnidadMovRepository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad })
                                    .catch(reject);
                                reject(error);
                            }));
                        }
                        else {
                            reject({ status: 400, error: `Existen movimientos por procesar` });
                        }
                    }
                    else {
                        resolve(true);
                    }
                }
            }));
        }));
    }
    validaOrdenesDeCompra(idCotizacion, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let valid = false;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionUnidadTramiteMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadTramiteMov);
                const cotizacionUnidadServicioUnidadMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadServicioUnidadMov);
                const cotizacionDetalleUnidadMovRepository = manager.getRepository(cotizador_1.CotizacionDetalleUnidadMov);
                const cotizacionUnidadAccesorioMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadAccesorioMov);
                yield Promise.all([
                    cotizacionUnidadTramiteMovRepository
                        .createQueryBuilder()
                        .where(`idCotizacion = :idCotizacion AND estatusBPRO = :estatusBPRO`, { idCotizacion, estatusBPRO: 0 })
                        .getMany(),
                    cotizacionUnidadServicioUnidadMovRepository
                        .createQueryBuilder()
                        .where(`idCotizacion = :idCotizacion AND estatusBPRO = :estatusBPRO`, { idCotizacion, estatusBPRO: 0 })
                        .getMany(),
                    cotizacionDetalleUnidadMovRepository
                        .createQueryBuilder()
                        .where(`idCotizacion = :idCotizacion AND procesadoBpro = :procesadoBpro`, { idCotizacion, procesadoBpro: 0 })
                        .getMany(),
                    cotizacionUnidadAccesorioMovRepository
                        .createQueryBuilder()
                        .where(`idCotizacion = :idCotizacion AND estatusBPRO = :estatusBPRO`, { idCotizacion, estatusBPRO: 0 })
                        .getMany(),
                ])
                    .then(([cotizacionUnidadTramiteMov, cotizacionUnidadServicioUnidadMov, cotizacionDetalleUnidadMov, cotizacionUnidadAccesorioMov,]) => {
                    if (cotizacionUnidadTramiteMov.length > 0) {
                        valid = true;
                    }
                    if (cotizacionUnidadServicioUnidadMov.length > 0) {
                        valid = true;
                    }
                    if (cotizacionDetalleUnidadMov.length > 0) {
                        valid = true;
                    }
                    if (cotizacionUnidadAccesorioMov.length > 0) {
                        valid = true;
                    }
                    resolve(valid);
                })
                    .catch(reject);
            }))
                .catch(reject);
        }));
    }
    validaExistenciaDeMovimientos(idCotizacion, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let valid = true;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionUnidadTramiteMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadTramiteMov);
                const cotizacionUnidadServicioUnidadMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadServicioUnidadMov);
                const cotizacionDetalleUnidadMovRepository = manager.getRepository(cotizador_1.CotizacionDetalleUnidadMov);
                const cotizacionUnidadAccesorioMovRepository = manager.getRepository(cotizador_1.CotizacionUnidadAccesorioMov);
                yield Promise.all([
                    cotizacionUnidadTramiteMovRepository
                        .createQueryBuilder()
                        .where(`idCotizacion = :idCotizacion`, { idCotizacion })
                        .getMany(),
                    cotizacionUnidadServicioUnidadMovRepository
                        .createQueryBuilder()
                        .where(`idCotizacion = :idCotizacion`, { idCotizacion })
                        .getMany(),
                    cotizacionDetalleUnidadMovRepository
                        .createQueryBuilder()
                        .where(`idCotizacion = :idCotizacion`, { idCotizacion })
                        .getMany(),
                    cotizacionUnidadAccesorioMovRepository
                        .createQueryBuilder()
                        .where(`idCotizacion = :idCotizacion`, { idCotizacion })
                        .getMany(),
                ])
                    .then(([cotizacionUnidadTramiteMov, cotizacionUnidadServicioUnidadMov, cotizacionDetalleUnidadMov, cotizacionUnidadAccesorioMov,]) => {
                    // console.log(cotizacionUnidadTramiteMov, '¿COTIZACION UNIDAD TRAMITE MOV?');
                    // console.log(cotizacionUnidadServicioUnidadMov, '¿COTIZACION UNIDAD SERVICIO UNIDAD MOV?');
                    // console.log(cotizacionDetalleUnidadMov, '¿COTIZACION DETALLE UNIDAD MOV?');
                    // console.log(cotizacionUnidadAccesorioMov, '¿COTIZACION UNIDAD ACCESORIO MOV?');
                    if (cotizacionUnidadTramiteMov.length === 0 &&
                        cotizacionUnidadServicioUnidadMov.length === 0 &&
                        cotizacionDetalleUnidadMov.length === 0 &&
                        cotizacionUnidadAccesorioMov.length === 0) {
                        valid = false;
                    }
                    resolve(valid);
                })
                    .catch(reject);
            }))
                .catch(reject);
        }));
    }
    cambiaStatusOrdenesDeCompraPendientes(idCotizacion, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = yield manager.getRepository(cotizador_1.Cotizacion);
                const existCotizacion = yield cotizacionRepository.findOne({ idCotizacion });
                return this.consolidacionFlotillasBpro(idCotizacion, idUsuario)
                    .then((consolidacion) => {
                    // console.log(consolidacion, '¿RESULTSET EN CAMBIA STATUS?');
                    if (consolidacion && existCotizacion) {
                        // console.log(consolidacion, existCotizacion, '¿EXISTEN?');
                        existCotizacion.idUsuario = idUsuario;
                        existCotizacion.status = 'ORDENES DE COMPRA PENDIENTES';
                        existCotizacion.fechaModificacion = new Date();
                        return cotizacionRepository.update({ idCotizacion }, existCotizacion)
                            .then((updated) => __awaiter(this, void 0, void 0, function* () {
                            // console.log(updated, '¿UPDATED?');
                            // resolve(true);
                            yield manager.query(`exec sp_Flotillas_CambiaEstatusMovimientosPosteriores @idCotizacion = '${idCotizacion}'`)
                                .then((status1) => __awaiter(this, void 0, void 0, function* () {
                                // console.log(status1, '¿RESPUESTA SP _CambiaEstatusMovimientosPosteriores?');
                                if (status1[0].Success != null && (status1[0].Success === 1 || status1[0].Success === '1')) {
                                    resolve(true);
                                }
                                reject({ status1: 422, error: `No se pudo procesar los posteriores - Cambio en Estatus` });
                            }))
                                .catch((error) => {
                                //  console.log(error, '¿ERROR SP FLOTILLAS LLAMA PROCESOS?');
                                reject({ error: `No se pudo procesar los posteriores  - Cambio en Estatus: ` + error });
                            });
                        }))
                            .catch((error) => {
                            reject({ error });
                        });
                    }
                    reject({ error: `generico`, status: 400 });
                })
                    .catch((error) => {
                    console.log('error', error);
                    reject({ error });
                });
            }))
                .catch((error) => {
                reject({ error });
            });
        }));
    }
    generacionDePedidoFlotillaBpro(idCotizacion, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionRepository = connection.getRepository(cotizador_1.Cotizacion);
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const existencia = yield this.validaExistenciaDeMovimientos(idCotizacion, idUsuario); // PASO 0 VALIDA MOVIMIENTOS
                console.log(existencia, '¿EXISTENCIA?');
                if (existencia) {
                    const pendientes = yield connection.query(`exec sp_Flotillas_ValidaPendientes @idCotizacion = '${idCotizacion}'`); // PASO 1 sp_Flotillas_ValidaPendientes 0 NO TIENE PENDIENTES Y 1 SI TIENE
                    console.log(pendientes, '¿PENDIENTES?');
                    const accesoriosCompra = yield connection.query(`exec sp_Flotillas_InsertaAccesorioCompra @idCotizacion = '${idCotizacion}'`);
                    console.log(accesoriosCompra, '¿ORDENES DE ACCESORIOS COMPRA PROCESADAS?');
                    if (accesoriosCompra[0].Success === 1 || accesoriosCompra[0].Success === '1') {
                        // pendientes[0].Success = 0; // NO EXISTEN PENDIENTES Y PUEDE REALIZAR EL PEDIDO (SOLO PRUEBAS)
                        console.log(pendientes[0], '¿PENDIENTES MODIFICADO?');
                        console.log(pendientes[0].Success, '¿PENDIENTES MODIFICADO?');
                        if ((pendientes[0].Success === 0 || pendientes[0].Success === '0')) {
                            console.log('¿ENTRA?');
                            const traslados = yield connection.query(`exec sp_Flotillas_Insert_Cotizaciontraslados @idCotizacion = '${idCotizacion}'`); // 2 sp_Flotillas_Insert_Cotizaciontraslados
                            console.log(traslados, '¿TRASLADOS?');
                            if ((traslados[0].Success === 1 || traslados[0].Success === '1')) {
                                yield connection.query(`exec sp_Flotillas_CambiaEstatus @idCotizacion = '${idCotizacion}'`) // 3 sp_Flotillas_CambiaEstatus
                                    .then((status) => __awaiter(this, void 0, void 0, function* () {
                                    console.log(status, '¿SP FLOTILLAS CAMBIA ESTATUS?');
                                    if ((status[0].Success === 1 || status[0].Success === '1')) {
                                        const pedido = yield this.generarPedidoMovBproTraslado(idCotizacion, idUsuario); // 4 DUMMY
                                        console.log(pedido, '¿PEDIDO?');
                                        if (pedido) {
                                            yield connection.query(`exec sp_Flotillas_ActualizaCondiciones @idCotizacion = '${idCotizacion}'`)
                                                .then((condiciones) => {
                                                console.log(condiciones, '¿ACTULIZA CONDICIONES GENERACION DE PEDIDO FLOTILLA BPRO 1?');
                                                if (condiciones[0].Success && (condiciones[0].Success === 1 || status[0].Success === '1')) {
                                                    resolve(true);
                                                }
                                                else {
                                                    resolve(false);
                                                }
                                            }).catch(reject);
                                        }
                                        else {
                                            resolve(pedido);
                                        }
                                    }
                                    else {
                                        resolve(false);
                                    }
                                }))
                                    .catch(reject);
                            }
                            else {
                                resolve(false);
                            }
                        }
                        else {
                            console.error(`Aun existen movimientos sin procesar en la cotizacion ${idCotizacion} en el proceso sp_Flotillas_ValidaPendientes`);
                            resolve(false);
                        }
                    }
                    else {
                        reject({ status: 400, error: `Las ordenes de compra de accesorios no estan procesadas` });
                    }
                }
                else {
                    // SIN EXISTENCIA EN MOVIMIENTOS
                    console.log('SIN EXISTENCIA EN MOVIMIENTOS');
                    const insertaAccesoriosCompra = yield connection.query(`exec sp_Flotillas_InsertaAccesorioCompra @idCotizacion = '${idCotizacion}'`);
                    console.log(insertaAccesoriosCompra, '¿INSERTA ACCESORIOS COMPRA?');
                    const pendientes = yield connection.query(`exec sp_Flotillas_ValidaPendientes @idCotizacion = '${idCotizacion}'`); // PASO 1 sp_Flotillas_ValidaPendientes 0 NO TIENE PENDIENTES Y 1 SI TIENE
                    console.log(pendientes, '¿PENDIENTES?');
                    console.log(pendientes[0], '¿PENDIENTES MODIFICADO?');
                    console.log(pendientes[0].Success, '¿PENDIENTES MODIFICADO?');
                    if ((pendientes[0].Success === 0 || pendientes[0].Success === '0')) {
                        const traslados = yield connection.query(`exec sp_Flotillas_Insert_Cotizaciontraslados @idCotizacion = '${idCotizacion}'`); // 2 sp_Flotillas_Insert_Cotizaciontraslados
                        console.log(traslados, '¿TRASLADOS SIN EXISTENCIA EN MOVIMIENTOS?');
                        if ((traslados[0].Success === 1 || traslados[0].Success === '1')) {
                            yield connection.query(`exec sp_Flotillas_CambiaEstatus @idCotizacion = '${idCotizacion}'`) // 3 sp_Flotillas_CambiaEstatus
                                .then((status) => __awaiter(this, void 0, void 0, function* () {
                                console.log(status, '¿STATUS EN SIN EXISTENCIA DE MOVIMIENTOS?');
                                if ((status[0].Success === 1 || status[0].Success === '1')) {
                                    const pedido = yield this.generarPedidoMovBproTraslado(idCotizacion, idUsuario); // 4 DUMMY
                                    console.log(pedido, '¿PEDIDO EN SIN EXISTENCIA DE MOVIMIENTOS?');
                                    if (pedido) {
                                        yield connection.query(`exec sp_Flotillas_ActualizaCondiciones @idCotizacion = '${idCotizacion}'`)
                                            .then((condiciones) => {
                                            console.log(condiciones, '¿ACTULIZA CONDICIONES GENERACION DE PEDIDO FLOTILLA BPRO 2?');
                                            if (condiciones[0].Success && (condiciones[0].Success === 1 || status[0].Success === '1')) {
                                                resolve(true);
                                            }
                                            else {
                                                resolve(false);
                                            }
                                        }).catch(reject);
                                    }
                                    else {
                                        resolve(pedido);
                                    }
                                }
                                else {
                                    resolve(false);
                                }
                            }))
                                .catch(reject);
                        }
                        else {
                            resolve(false);
                        }
                    }
                    else {
                        console.error(`Aun existen movimientos sin procesar en la cotizacion ${idCotizacion} en el proceso sp_Flotillas_ValidaPendientes`);
                        resolve(false);
                    }
                }
            }))
                .catch((error) => {
                console.log(`ERROR: Paso algo al iniciar la transacción + ${error}`);
            });
        }));
    }
    cancelacionOrdenesDeServicio(idCotizacion, vin) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_CancelaOrdenServicio @idCotizacion = '${idCotizacion}', @vin = '${vin}'`)
                .then((resp) => {
                if (resp[0].Success && (resp[0].Success === 1 || resp[0].Success === '1')) {
                    resolve({ status: 200, success: `Se ha realizado con exito la cancelación de ordenes de servicio` });
                }
                reject({ status: 400, error: `No se ha podido realizar la cancelación de ordenes de servicio` });
            })
                .catch(reject);
        }));
    }
    cancelacionDeTramites(idCotizacion, vin) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_CancelaTramite @idCotizacion = '${idCotizacion}', @vin = '${vin}'`)
                .then((resp) => {
                if (resp[0].Success && (resp[0].Success === 1 || resp[0].Success === '1')) {
                    resolve({ status: 200, success: `Se ha realizado con exito la cancelación del tramite` });
                }
                reject({ status: 400, error: `No se ha podido realizar la cancelación del tramite` });
            })
                .catch(reject);
        }));
    }
    cancelacionDeAccesorios(idCotizacion, vin) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_CancelaAccesorio @idCotizacion = '${idCotizacion}', @vin = '${vin}'`)
                .then((resp) => {
                if (resp[0].Success && (resp[0].Success === 1 || resp[0].Success === '1')) {
                    resolve({ status: 200, success: `Se ha realizado con exito la cancelación de los accesorios` });
                }
                reject({ status: 400, error: `No se ha podido realizar la cancelación de los accesorios` });
            })
                .catch(reject);
        }));
    }
    // Servicios de eliminación sin VIN
    cancelacionOrdenesDeServicioSinVin(idCotizacion, idGrupoUnidad, idDetalleUnidad, idServicioUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionUnidadServicioUnidadRepo = yield manager.getRepository(cotizador_1.CotizacionUnidadServicioUnidad);
                const cotizacionUnidadServicioUnidadFind = yield cotizacionUnidadServicioUnidadRepo.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad, idServicioUnidad });
                if (cotizacionUnidadServicioUnidadFind) {
                    yield manager.query(`exec sp_Flotillas_ValidaExistenciaOrdServ @idCotizacion = '${idCotizacion}'`)
                        .then((resp) => __awaiter(this, void 0, void 0, function* () {
                        if (resp[0].Success && (resp[0].Success === 1 || resp[0].Success === '1')) {
                            yield cotizacionUnidadServicioUnidadRepo.delete(cotizacionUnidadServicioUnidadFind)
                                .catch(reject);
                            resolve(true);
                        }
                        else {
                            resolve(true);
                        }
                    })).catch(reject);
                }
                reject({ status: 404, error: `No se ha podido procesar la cancelación del servicio, servicio no encontrado` });
            }));
        }));
    }
    cancelacionDeTramitesSinVin(idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionUnidadTramiteRepo = yield manager.getRepository(cotizador_1.CotizacionUnidadTramite);
                const cotizacionUnidadTramiteFind = yield cotizacionUnidadTramiteRepo.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite });
                if (cotizacionUnidadTramiteFind) {
                    // await manager.query(`exec sp_Flotillas_ValidaExistenciaTramites @idCotizacion = '${idCotizacion}', `)
                    yield cotizacionUnidadTramiteRepo.delete(cotizacionUnidadTramiteFind)
                        .catch(reject);
                    resolve(true);
                }
                reject({ status: 404, error: `No se ha podido procesar la cancelación del tramite, tramite no encontrado` });
            }));
        }));
    }
    cancelacionDeAccesoriosSinVin(idCotizacion, idGrupoUnidad, idDetalleUnidad, idAccesorio, idAccesorioNuevo, idParte) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionUnidadAccesorioRepo = yield manager.getRepository(cotizador_1.CotizacionUnidadAccesorio);
                const cotizacionUnidadAccesorioFind = yield cotizacionUnidadAccesorioRepo.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad, idAccesorioNuevo });
                if (cotizacionUnidadAccesorioFind) {
                    yield manager.query(`exec sp_Flotillas_ValidaOCAccesorio @idCotizacion = '${idCotizacion}', @idParte = '${idParte}', @idAccesorioNuevo = '${idAccesorioNuevo}', @cantidad = '${cotizacionUnidadAccesorioFind.cantidad}'`)
                        .then((resp) => __awaiter(this, void 0, void 0, function* () {
                        // console.log(resp, '¿RESPUESTA SP VALIDA OC ACCESORIOS?');
                        if (resp[0].Success && (resp[0].Success === 1 || resp[0].Success === '1')) {
                            yield manager.query(`exec sp_Flotillas_CancelaOCAccesorioPrePedido @idCotizacion = '${idCotizacion}', @idParte = '${idParte}', @idAccesorioNuevo = '${idAccesorioNuevo}', @cantidad = '${cotizacionUnidadAccesorioFind.cantidad}'`)
                                .then((res) => __awaiter(this, void 0, void 0, function* () {
                                // console.log(res, '¿RESPUESTA SP CANCELA ACCESORIOS?');
                                if (res[0].Success && (res[0].Success === 1 || res[0].Success === '1')) {
                                    yield cotizacionUnidadAccesorioRepo.delete(cotizacionUnidadAccesorioFind)
                                        .catch(reject);
                                    resolve(true);
                                }
                                else {
                                    reject({ status: 422, error: `El procedimiento ha retornado: ${resp}` });
                                }
                            }))
                                .catch(reject);
                        }
                        else {
                            resolve(true);
                        }
                    }))
                        .catch(reject);
                }
                else {
                    reject({ status: 404, error: `No se ha podido procesar la cancelación del accesorio, accesorio no encontrado` });
                }
            }));
        }));
    }
    guardarUnidadPosteriorAuxiliar(idCotizacion, idGrupoUnidad, cantidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionDetalleUnidadRepo = yield connection.getRepository(cotizador_1.CotizacionDetalleUnidad);
            yield this.pedidoBusiness.saveGruposDetalleUnidades([{ idCotizacion, idGrupoUnidad, cantidad }], 'GESTION')
                .catch(reject);
            const cotizacionDetalleUnidadFind = yield cotizacionDetalleUnidadRepo.find({ idCotizacion, idGrupoUnidad });
            // console.log('PARAMETROS DEL FIND ONE DE COTIZACION DETALLE UNIDAD: ', { idCotizacion, idGrupoUnidad });
            yield connection.query(`exec sp_Flotillas_AsignaVines @idCotizacion = '${idCotizacion}'`)
                .catch(reject);
            yield connection.query(`exec sp_Flotillas_InsertaUnidadBPro @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`)
                .catch(reject);
            yield connection.query(`exec sp_Flotillas_ActualizaCondiciones @idCotizacion = '${idCotizacion}'`)
                .then((condiciones) => {
                console.log(condiciones, '¿ACTULIZA CONDICIONES GUARDAR UNIDADES GESTION FLOTILLAS?');
            })
                .catch(reject);
            this.getPedidoBproStatus(idCotizacion)
                .then((status) => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a;
                // console.log(status.ucu_idpedidobpro, 'STATUS DEL GET PEDIDO BPRO STATUS');
                if (status.ucu_idpedidobpro) {
                    try {
                        for (var cotizacionDetalleUnidadFind_1 = __asyncValues(cotizacionDetalleUnidadFind), cotizacionDetalleUnidadFind_1_1; cotizacionDetalleUnidadFind_1_1 = yield cotizacionDetalleUnidadFind_1.next(), !cotizacionDetalleUnidadFind_1_1.done;) {
                            const detalleUnidad = cotizacionDetalleUnidadFind_1_1.value;
                            yield connection.query(`exec sp_Flotillas_CambiaEstatusCotizacionUnidadPosterior @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${detalleUnidad.idDetalleUnidad}'`)
                                .catch(reject);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (cotizacionDetalleUnidadFind_1_1 && !cotizacionDetalleUnidadFind_1_1.done && (_a = cotizacionDetalleUnidadFind_1.return)) yield _a.call(cotizacionDetalleUnidadFind_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    // await connection.query(`exec sp_flotillas_Insert_OrdCompraPosterior @idCotizacion = '${idCotizacion}'`)
                    // .then((ordenCompra) => console.log(ordenCompra, '¿RESULTADO DEL SP ORDEN COMPRA POSTERIOR?'))
                    // .catch(reject);
                    resolve(true);
                }
                else {
                    reject(false);
                }
            }))
                .catch(reject);
        }));
    }
    guardarUnidadGestionFlotillas(grupoUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepo = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionGrupoUnidadRepo = yield manager.getRepository(cotizador_1.CotizacionGrupoUnidad);
                const cotizacionDetalleUnidadRepo = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                // console.log(grupoUnidad, '¿ANTES DE ASIGNAR EL ID GRUPO UNIDAD?');
                if (grupoUnidad.idGrupoUnidad === undefined) {
                    let maxId = (yield cotizacionGrupoUnidadRepo.createQueryBuilder('cotizacionGrupoUnidad')
                        .where(`cotizacionGrupoUnidad.idCotizacion = :idCotizacion`, { idCotizacion: grupoUnidad.idCotizacion })
                        .select(`MAX(cotizacionGrupoUnidad.idGrupoUnidad)`, `max`)
                        .getRawOne()).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    grupoUnidad.idGrupoUnidad = maxId;
                }
                const cotizacionFindone = yield cotizacionRepo.findOne({ idCotizacion: grupoUnidad.idCotizacion });
                if (cotizacionFindone) {
                    grupoUnidad.tipoOrden = cotizacionFindone.tipoOrden;
                    grupoUnidad.imprimeFactura = cotizacionFindone.imprimeFactura;
                    grupoUnidad.tipoCargoUnidad = cotizacionFindone.tipoCargoUnidad;
                }
                yield cotizacionGrupoUnidadRepo.save(grupoUnidad)
                    .then((grupoUnidadSaved) => __awaiter(this, void 0, void 0, function* () {
                    console.log(`YA GUARDO EL GRUPO UNIDAD`);
                    yield cotizacionDetalleUnidadRepo.update({
                        idCotizacion: grupoUnidad.idCotizacion,
                        idGrupoUnidad: grupoUnidad.idGrupoUnidad,
                    }, {
                        idIva: grupoUnidad.idIva,
                        tasaIva: grupoUnidad.tasaIva,
                        idCondicion: grupoUnidad.idCondicion,
                        idFinanciera: grupoUnidad.idFinanciera,
                        nombreFinanciera: grupoUnidad.nombreFinanciera,
                        colorInteriorFacturacion: grupoUnidad.colorInteriorFacturacion,
                        colorExteriorFacturacion: grupoUnidad.colorExteriorFacturacion,
                        idCfdi: grupoUnidad.idCfdi,
                        tipoOrden: cotizacionFindone.tipoOrden,
                        imprimeFactura: cotizacionFindone.imprimeFactura,
                        tipoCargoUnidad: cotizacionFindone.tipoCargoUnidad,
                        idCfdiAdicionales: grupoUnidad.idCfdiAdicionales,
                        leyendaFactura: grupoUnidad.leyendaFactura,
                        fechaHoraPromesaEntrega: grupoUnidad.fechaHoraPromesaEntrega,
                    })
                        .catch(reject);
                    // console.log('YA ACTUALIZO EL DETALLE UNIDAD');
                    // console.log('SE DISPARA EL SERVICIO saveGruposDetalleUnidades CON LOS IDS:', [{ idCotizacion: grupoUnidad.idCotizacion, idGrupoUnidad: grupoUnidad.idGrupoUnidad, cantidad: grupoUnidad.cantidad }]);
                    this.guardarUnidadPosteriorAuxiliar(grupoUnidad.idCotizacion, grupoUnidad.idGrupoUnidad, grupoUnidad.cantidad)
                        .catch(reject);
                    resolve(grupoUnidadSaved);
                }))
                    .catch(reject);
            }));
        }));
    }
    cancelacionOrdenesDeServicioDespuesPedido(idCotizacion, vin, idServicioUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_EstatusBPRO @idCotizacion = '${idCotizacion}'`)
                .then((status) => __awaiter(this, void 0, void 0, function* () {
                // console.log(status, '¿STATUS DEL SP ESTATUS BPRO CANCELACIÓN ORDENES SERVICIOS DESPUES DEL PEDIDO?');
                // console.log(status[0].estatusBpro, status[0].estatusBpro != null, status[0].estatusBpro, '===', '13', '||', status[0].estatusBpro, '===', '13', (status[0].estatusBpro === 13 || status[0].estatusBpro === '13'));
                if (status[0].estatusBpro != null && (status[0].estatusBpro === 13 || status[0].estatusBpro === '13')) {
                    yield connection.query(`exec sp_Flotillas_CancelaOrdenServicioPosPedido @idCotizacion = '${idCotizacion}', @vin = '${vin}', @idServicioUnidad = '${idServicioUnidad}'`)
                        .then((resp) => {
                        // console.log(resp, '¿RESPUESTA DEL SP CANCELACION ORDENES SERVICIOS DESPUES DEL PEDIDO?');
                        if (resp[0].Success != null && (resp[0].Success === 1 || resp[0].Success === '1')) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    })
                        .catch(reject);
                }
                else if (status[0].estatusBpro != null && (status[0].estatusBpro === 15 || status[0].estatusBpro === '15')) {
                    yield connection.query(`exec sp_Flotillas_IngresaInstruccionServicio @idCotizacion = '${idCotizacion}', @vin = '${vin}', @idServicioUnidad  = '${idServicioUnidad}'`)
                        .then((servicio) => __awaiter(this, void 0, void 0, function* () {
                        // console.log(servicio, '¿RESPUESTA DEL SP INGRESA INSTRUCCIÓN SERVICIOS CON EL STATUS 15?');
                        if (servicio[0].Success != null && (servicio[0].Success === 1 || servicio[0].Success === 1)) {
                            resolve(true);
                        }
                        else {
                            // console.error('No se pudo realizar la cancelación del servicio');
                            reject({ status: 422, error: `No se pudo realizar la cancelación del servicio` });
                        }
                    }))
                        .catch(reject);
                }
                else {
                    // console.error('El estatus la cotización universal no corresponde al tipo de movimiento socilitado');
                    reject({ status: 422, error: `Estatus de cotización ${status} incorrecto, no puede realizar la cancelación del pedido` });
                }
            }))
                .catch(reject);
        }));
    }
    cancelacionDeTramitesDespuesPedido(idCotizacion, vin, idSubtramite) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_EstatusBPRO @idCotizacion = '${idCotizacion}'`)
                .then((status) => __awaiter(this, void 0, void 0, function* () {
                console.log(status, '¿STATUS DEL SP ESTATUS BPRO CANCELACIÓN TRAMITES DESPUES DEL PEDIDO?');
                if (status[0].estatusBpro != null && (status[0].estatusBpro === 13 || status[0].estatusBpro === '13')) {
                    yield connection.query(`exec sp_Flotillas_CancelaTramitePosPedido @idCotizacion = '${idCotizacion}', @vin = '${vin}', @idSubtramite  = '${idSubtramite}'`)
                        .then((resp) => {
                        // console.log(resp, '¿RESPUESTA DEL SP CANCELACION TRAMITES DESPUES DEL PEDIDO?');
                        if (resp[0].Success != null && (resp[0].Success === 1 || resp[0].Success === '1')) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    })
                        .catch(reject);
                }
                else if (status[0].estatusBpro != null && (status[0].estatusBpro !== 13 || status[0].estatusBpro !== '13')) {
                    yield connection.query(`exec sp_Flotillas_IngresaInstruccionTramite @idCotizacion = '${idCotizacion}', @vin = '${vin}', @idSubtramite   = '${idSubtramite}'`)
                        .then((tramite) => __awaiter(this, void 0, void 0, function* () {
                        // console.log(tramite, '¿RESPUESTA DEL SP INGRESA INSTRUCCIÓN TRAMITE CON EL STATUS 15?');
                        if (tramite[0].Success != null && (tramite[0].Success === 1 || tramite[0].Success === 1)) {
                            resolve(true);
                        }
                        else {
                            // console.error('No se pudo realizar la cancelación del tramite');
                            reject({
                                status: 422,
                                error: `No se pudo realizar la cancelación del tramite`,
                            });
                        }
                    }))
                        .catch(reject);
                }
                else {
                    // console.error('El estatus la cotización universal no corresponde al tipo de movimiento socilitado');
                    reject({
                        status: 422,
                        error: `Estatus de cotización ${status} incorrecto, no puede realizar la cancelación del pedido`,
                    });
                }
            }))
                .catch(reject);
        }));
    }
    cancelacionDeAccesoriosDespuesPedido(idCotizacion, idGrupoUnidad, idDetalleUnidad, vin, idAccesorioNuevo, idParte) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_EstatusBPRO @idCotizacion = '${idCotizacion}'`)
                .then((status) => __awaiter(this, void 0, void 0, function* () {
                // console.log(status, '¿STATUS DEL SP BPRO CANCELACIÓN ACCESORIOS DESPUES DEL PEDIDO?');
                if (status[0].estatusBpro != null && (status[0].estatusBpro === 13 || status[0].estatusBpro === '13')) {
                    yield connection.query(`exec sp_Flotillas_CancelaAccesorioPosPedido @idCotizacion = '${idCotizacion}',
                    @idGrupoUnidad = '${idGrupoUnidad}',
                    @idDetalleUnidad = '${idDetalleUnidad}',
                    @idParte = '${idParte}', @vin = '${vin}', @idAccesorioNuevo = '${idAccesorioNuevo}'`)
                        .then((resp) => {
                        // console.log(resp, '¿RESPUESTA DEL SP CANCELACION DE ACCESORIOS DESPUES DEL PEDIDO?');
                        if (resp[0].Success != null && (resp[0].Success === 1 || resp[0].Success === '1')) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    })
                        .catch(reject);
                }
                else if (status[0].estatusBpro != null && (status[0].estatusBpro !== 13 || status[0].estatusBpro !== '13')) {
                    yield connection.query(`exec sp_Flotillas_ValidaAccesorioFacturado @idCotizacion = '${idCotizacion}', @idParte = '${idParte}', @vin = '${vin}', @idAccesorioNuevo = '${idAccesorioNuevo}'`)
                        .then((facturada) => __awaiter(this, void 0, void 0, function* () {
                        // console.log(facturada, '¿RESPUESTA DEL SP FACTURACION DE ACCESORIO CON EL STATUS 15?');
                        if (facturada[0].Success != null && (facturada[0].Success === 1 || facturada[0].Success === 1)) {
                            yield connection.query(`exec sp_Flotillas_IngresaInstruccionAccesorio @idCotizacion = '${idCotizacion}', @vin = '${vin}'`)
                                .then((res) => __awaiter(this, void 0, void 0, function* () {
                                // console.log(res, '¿RESPUESTA DEL SP INGRESA INSTRUCCION ACCESORIOS CON EL STATUS 15?');
                                if (res[0].Success != null && (res[0].Success === 1 || res[0].Success === '1')) {
                                    yield connection.query(`exec sp_Flotillas_QuitaAccesorioN @idCotizacion = '${idCotizacion}',
                                    @idGrupoUnidad = '${idGrupoUnidad}',
                                    @idDetalleUnidad = '${idDetalleUnidad}',
                                    @idParte = '${idParte}',
                                    @idAccesorioNuevo = '${idAccesorioNuevo}'`)
                                        .then((quitaAccesorios) => __awaiter(this, void 0, void 0, function* () {
                                        // console.log(quitaAccesorios, '¿RESPUESTA DEL SP QUITA ACCESORIOS N  CON EL STATUS 15?');
                                        if (quitaAccesorios[0].Success != null && (quitaAccesorios[0].Success === 1 || quitaAccesorios[0].Success === '1')) {
                                            resolve(true);
                                        }
                                        else {
                                            // console.error('No se pudo realizar la cancelación del accesorio');
                                            reject({ status: 422, error: `No se pudo realizar la cancelación del accesorio` });
                                        }
                                    }))
                                        .catch(reject);
                                }
                                else {
                                    resolve(false);
                                }
                            }))
                                .catch(reject);
                        }
                        else {
                            // console.error('El accesorio no se encuentra facturado en BPRO');
                            // reject({ status: 422, error: `El accesorio no se encuentra facturado en BPRO` });
                            yield connection.query(`exec sp_Flotillas_CancelaAccesorioPosPedido @idCotizacion = '${idCotizacion}',
                                @idGrupoUnidad = '${idGrupoUnidad}',
                                @idDetalleUnidad = '${idDetalleUnidad}',
                                @idParte = '${idParte}',
                                @vin = '${vin}',
                                @idAccesorioNuevo = '${idAccesorioNuevo}'`)
                                .then((quitaAccesorios) => __awaiter(this, void 0, void 0, function* () {
                                // console.log(quitaAccesorios, '¿RESPUESTA DEL SP QUITA ACCESORIOS N  CON EL STATUS 15?');
                                if (quitaAccesorios[0].Success != null && (quitaAccesorios[0].Success === 1 || quitaAccesorios[0].Success === '1')) {
                                    resolve(true);
                                }
                                else {
                                    // console.error('No se pudo realizar la cancelación del accesorio');
                                    reject({ status: 422, error: `No se pudo realizar la cancelación del accesorio` });
                                }
                            }))
                                .catch(reject);
                        }
                    }))
                        .catch(reject);
                }
                else {
                    // console.error('El estatus la cotización universal no corresponde al tipo de movimiento socilitado');
                    reject({ status: 422, error: `Estatus de cotización ${status} incorrecto, no puede realizar la cancelación del pedido` });
                }
            }))
                .catch(reject);
        }));
    }
    cancelarAccesorioDePedidoAdicionales(idCotizacion, idGrupoUnidad, idDetalleUnidad, vin, idAccesorioNuevo, idParte) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_cancelarAccesorioDePedidoAdicionales @idCotizacion = '${idCotizacion}',
            @idGrupoUnidad = '${idGrupoUnidad}',
            @idDetalleUnidad = '${idDetalleUnidad}',
            @idParte = '${idParte}',
            @vin = '${vin}',
            @idAccesorioNuevo = '${idAccesorioNuevo}'`)
                .then((quitaAccesorios) => __awaiter(this, void 0, void 0, function* () {
                if (quitaAccesorios[0].Success != null && (quitaAccesorios[0].Success === 1 || quitaAccesorios[0].Success === '1')) {
                    resolve(true);
                }
                else {
                    // console.error('No se pudo realizar la cancelación del accesorio');
                    reject({ status: 422, error: `No se pudo realizar la cancelación del accesorio` });
                }
            }))
                .catch(reject);
        }));
    }
    cancelarAccesorioDePedidoPosterior(idCotizacion, idGrupoUnidad, idDetalleUnidad, vin, idAccesorioNuevo, idParte) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_cancelarAccesorioDePedidoPosterior @idCotizacion = '${idCotizacion}',
            @idGrupoUnidad = '${idGrupoUnidad}',
            @idDetalleUnidad = '${idDetalleUnidad}',
            @idParte = '${idParte}',
            @vin = '${vin}',
            @idAccesorioNuevo = '${idAccesorioNuevo}'`)
                .then((quitaAccesorios) => __awaiter(this, void 0, void 0, function* () {
                if (quitaAccesorios[0].Success != null && (quitaAccesorios[0].Success === 1 || quitaAccesorios[0].Success === '1')) {
                    resolve(true);
                }
                else {
                    // console.error('No se pudo realizar la cancelación del accesorio');
                    reject({ status: 422, error: `No se pudo realizar la cancelación del accesorio` });
                }
            }))
                .catch(reject);
        }));
    }
    cancelacionDePedidoDeUnidades(grupoUnidades) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var e_2, _a;
            let statusRemote = false;
            // console.log('¿ENTRA EN LA CANCELACIÓN DE PEDIDO DE UNIDADES?');
            const connection = typeorm_1.getConnection();
            try {
                for (var grupoUnidades_1 = __asyncValues(grupoUnidades), grupoUnidades_1_1; grupoUnidades_1_1 = yield grupoUnidades_1.next(), !grupoUnidades_1_1.done;) {
                    const grupoUnidad = grupoUnidades_1_1.value;
                    const idCotizacion = grupoUnidad.idCotizacion;
                    const idGrupoUnidad = grupoUnidad.idGrupoUnidad;
                    const idDetalleUnidad = grupoUnidad.idDetalleUnidad;
                    const vin = grupoUnidad.vin;
                    // console.log(`exec sp_Flotillas_CancelaUnidadPosPedido @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}', @vin = '${vin}'`, '¿SE CONSTRUYE EL QUERYSTRING?');
                    yield connection.query(`exec sp_Flotillas_CancelaUnidadFacturada @idCotizacion = '${idCotizacion}', @vin = '${vin}'`)
                        .then((facturada) => __awaiter(this, void 0, void 0, function* () {
                        // console.log(facturada, '¿RESPUESTA SP CANCELA UNIDAD FACTURADA?');
                        if (facturada[0].Success != null && (facturada[0].Success === 1 || facturada[0].Success === '1')) {
                            yield connection.query(`exec sp_Flotillas_CancelaUnidadPosPedido @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}', @vin = '${vin}'`)
                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                // console.log(resp, '¿RESPUESTA DEL SP CANCELACION DE UNIDADES DESPUES DEL PEDIDO?');
                                if (resp[0].Success != null && (resp[0].Success === 1 || resp[0].Success === '1')) {
                                    statusRemote = true;
                                }
                                else {
                                    statusRemote = false;
                                }
                            }))
                                .catch(reject);
                        }
                        else {
                            statusRemote = false;
                        }
                    }))
                        .catch(reject);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (grupoUnidades_1_1 && !grupoUnidades_1_1.done && (_a = grupoUnidades_1.return)) yield _a.call(grupoUnidades_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            resolve(statusRemote);
        }));
    }
    cancelacionDePedidoDeUnidadesAll(grupoUnidades) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var e_3, _a;
            let statusRemote = false;
            const connection = typeorm_1.getConnection();
            try {
                for (var grupoUnidades_2 = __asyncValues(grupoUnidades), grupoUnidades_2_1; grupoUnidades_2_1 = yield grupoUnidades_2.next(), !grupoUnidades_2_1.done;) {
                    const grupoUnidad = grupoUnidades_2_1.value;
                    const idCotizacion = grupoUnidad.idCotizacion;
                    const idGrupoUnidad = grupoUnidad.idGrupoUnidad;
                    const idDetalleUnidad = grupoUnidad.idDetalleUnidad;
                    const vin = grupoUnidad.vin;
                    yield connection.query(`exec sp_Flotillas_IngresaInstruccionUnidad @idCotizacion = '${idCotizacion}', @vin = '${vin}'`)
                        .then((instruccion) => __awaiter(this, void 0, void 0, function* () {
                        // console.log(instruccion, '¿INSTRUCCION DEL SP INGRESA INSTRUCCION UNIDAD ALL?');
                        if (instruccion[0].Success != null && (instruccion[0].Success === 1 || instruccion[0].Success === '1')) {
                            yield connection.query(`exec sp_Flotillas_CancelaUnidadPosPedido @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}', @vin = '${vin}'`)
                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                // console.log(resp, '¿RESPUESTA DEL SP CANCELACION DE UNIDADES DESPUES DEL PEDIDO ALL?');
                                if (resp[0].Success != null && (resp[0].Success === 1 || resp[0].Success === '1')) {
                                    statusRemote = true;
                                }
                                else {
                                    statusRemote = false;
                                }
                            }))
                                .catch(reject);
                        }
                        else {
                            reject(false);
                        }
                    }))
                        .catch(reject);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (grupoUnidades_2_1 && !grupoUnidades_2_1.done && (_a = grupoUnidades_2.return)) yield _a.call(grupoUnidades_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            resolve(statusRemote);
        }));
    }
    statusInstruccionCancelacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_ListadoInstruccionFlotillas @idCotizacion = '${idCotizacion}'`)
                .then((listado) => {
                if (!listado.length) {
                    resolve([]);
                }
                resolve(listado);
            })
                .catch(reject);
        }));
    }
    getPedidoBproStatus(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_PedidoBPRO @idCotizacion = '${idCotizacion}'`)
                .then((status) => __awaiter(this, void 0, void 0, function* () {
                if (status[0].ucu_idpedidobpro) {
                    resolve(status[0]);
                }
                resolve({});
            }))
                .catch(reject);
        }));
    }
    cambiaStatusCotizacionUnidadesPosterior(idCotizacion, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionRepository = yield manager.getRepository(cotizador_1.Cotizacion);
                // console.log('SE DISPARA EL SP: sp_Flotillas_Llamaprocesos', Date());
                yield manager.query(`exec sp_Flotillas_Llamaprocesos @idCotizacion = '${idCotizacion}', @idUsuario = '${idUsuario}'`)
                    .then((status) => __awaiter(this, void 0, void 0, function* () {
                    resolve(status);
                    // console.log(status, '¿RESPUESTA SP LLAMA PROCESOS?');
                    /*if (status[0].Success != null && (status[0].Success === 1 || status[0].Success === '1')) {
                        // resolve(true);
                        resolve(status);
                    }
                    reject({status: 422, error: `No se pudo procesar los posteriores`});
                    */
                }))
                    .catch((error) => {
                    reject({ error: `No se pudo procesar los posteriores: ` + error });
                });
            }))
                .catch((error) => {
                // console.log(error, '¿ERROR GENERAL DEL SERVICIO CAMBIA STATUS COTIZACION UNIDADES POSTERIOR?');
                reject({ error: `No se pudo procesar los posteriores.` + error });
            });
        }));
    }
    validaUnidadesFlotillasBpro(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_ValidaFlotillaBPro @idCotizacion = '${idCotizacion}'`)
                .then((validado) => {
                if (validado[0].Success && (validado[0].Success === 1 || validado[0].Success === '1')) {
                    resolve(true);
                }
                resolve(false);
            })
                .catch(reject);
        }));
    }
    cancelacionProcesada(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_EstatusInstruccionUnidad @idCotizacion = '${idCotizacion}'`)
                .then((procesado) => {
                if (!procesado.length) {
                    resolve(procesado);
                }
                else {
                    resolve(procesado);
                }
            })
                .catch(reject);
        }));
    }
    getLicitiacionBpro(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_obtenerLicitizacionBpro @idCotizacion = '${idCotizacion}'`)
                .then((licitacion) => {
                if (!licitacion.length) {
                    resolve(licitacion);
                }
                else {
                    resolve(licitacion);
                }
            })
                .catch(reject);
        }));
    }
    actualizarPedido(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_InsertaAccesorioCompra @idCotizacion = '${idCotizacion}'`)
                .then((actualiza) => __awaiter(this, void 0, void 0, function* () {
                // console.log(actualiza, `¿RESPUESTA SP INSERTA ACCESORIO COMPRA?`);
                if (actualiza[0].Success && (actualiza[0].Success === 1 || actualiza[0].Success === '1')) {
                    yield connection.query(`exec sp_Flotillas_ActualizaCondiciones @idCotizacion = '${idCotizacion}'`)
                        .then((condiciones) => __awaiter(this, void 0, void 0, function* () {
                        // sp_Flotillas_CambiaEstatusMovimientosPosteriores
                        // console.log(condiciones, '¿ACTULIZA CONDICIONES ACTULIZAR PEDIDO?');
                        if (condiciones[0].Success && (condiciones[0].Success === 1 || condiciones[0].Success === '1')) {
                            // resolve(true);
                            yield connection.query(`exec sp_Flotillas_CambiaEstatusMovimientosPosteriores @idCotizacion = '${idCotizacion}'`)
                                .then((resp) => {
                                if (resp[0].Success && (resp[0].Success === 1 || resp[0].Success === '1')) {
                                    resolve(true);
                                }
                                else {
                                    resolve(false);
                                }
                            })
                                .catch((error) => {
                                console.log('Error1', error);
                                reject(`No pudo realizar la actulización de condiciones de venta`);
                            });
                        }
                        else {
                            // resolve(false);
                            console.log('Error2', condiciones.Error);
                            reject(condiciones.Error);
                        }
                    }))
                        .catch((error) => {
                        console.log('Error3', error);
                        reject(`No pudo realizar la actulización de condiciones de venta`);
                    });
                }
                else {
                    // resolve(false);
                    reject(actualiza.Error);
                }
            }))
                .catch((error) => {
                console.log('Error4', error);
                reject(`No pudo realizar la actulización del pedido`);
            });
        }));
    }
    validaOrdenesDeCompraPendientes(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_VerificaOrdenCompraPendienteIntermedia @idCotizacion = '${idCotizacion}'`)
                .then((actualiza) => {
                // console.log(actualiza, '¿RESPUESTA SP VERIFICA ORDEN COMPRA PENDIENTE INTERMEDIA?');
                if (actualiza[0].Success && (actualiza[0].Success === 1 || actualiza[0].Success === '1')) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })
                .catch((error) => reject(`No pudo obtener ordenes el status de ordenes de compra pendientes`));
        }));
    }
    verificarEnviadoBpro(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_EnviadoBProConsulta @idCotizacion = '${idCotizacion}'`)
                .then((enviado) => {
                // console.log(enviado, '¿RESPUESTA SP ENVIADO BPRO CONSULTA?');
                if (enviado.length > 0 && (enviado[0].enviadoBPro === true)) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })
                .catch(reject);
        }));
    }
    // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
    verificaUnidadesFacturadas(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_verificaUnidadesFacturadas  @idCotizacion = '${idCotizacion}'`)
                .then((resp) => {
                resolve(resp);
            })
                .catch(reject);
        }));
    }
    // OCT 99 20210215 GESTION - Agregar accesorios en Posteriores/Adicionales 1: activa , 0: desactiva
    validaAgregarAccesoriosPostAd(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_ValidaAgregarAccesoriosPostAd @idCotizacion = '${idCotizacion}'`)
                .then((resp) => {
                resolve(resp);
            })
                .catch(reject);
        }));
    }
    // OCT 99 20210118 sino hay OC pendientes, cambia estatus de Cotizacion a ORDENES DE COMPRA COMPLETADAS
    flotillasEvalua(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_flotillas_aestatus @idCotizacion = '${idCotizacion}'`)
                .then((resp) => {
                console.log('resp: idCotizacion: ' + idCotizacion);
                console.log('resp: sp_flotillas_aestatus: ' + resp);
                resolve(true);
            })
                .catch(reject);
        }));
    }
    // OCT 99 20210118 consulta el estatus de la cotizacion
    consultaEstatusCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_flotillas_ConsultaEstatusCotizacion  @idCotizacion = '${idCotizacion}'`)
                .then((resp) => {
                console.log('resp: consultaEstatusCotizacion: ' + resp);
                resolve(resp);
            })
                .catch(reject);
        }));
    }
    actualizaPedidoPosterior(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // console.log(idCotizacion, '¿ID COTIZACION?');
                const cotizacionRepo = yield manager.getRepository(cotizador_1.Cotizacion);
                const cotizacionFind = yield cotizacionRepo.findOne({ idCotizacion });
                yield manager.query(`exec sp_Flotillas_EnviadoBProConsulta @idCotizacion = '${idCotizacion}'`)
                    .then((enviado) => __awaiter(this, void 0, void 0, function* () {
                    // console.log(enviado, `¿RESPUESTA SP ENVIADO BPRO CONSULTA EN ACTUALIZAR PEDIDO POSTERIOR?`);
                    if (enviado.length > 0 && enviado[0].enviadoBPro === true) {
                        yield this.getPedidoBproStatus(idCotizacion)
                            .then((idPedido) => __awaiter(this, void 0, void 0, function* () {
                            // console.log(idPedido, `¿RESPUESTA DEL GET PEDIDO BPRO STATUS?`);
                            if (idPedido.ucu_idpedidobpro) {
                                yield connection.query(`exec sp_Flotillas_InsertaAccesorioCompra @idCotizacion = '${idCotizacion}'`)
                                    .then((insertaAccesorios) => {
                                    console.log(insertaAccesorios, `¿RESPUESTA DEL SP INSERTA ACCESORIOS COMPRA 1?`);
                                })
                                    .catch(reject);
                                yield manager.query(`exec sp_Flotillas_EnviadoBProTrue  @idCotizacion = '${idCotizacion}'`)
                                    .then((enviadoBpro) => {
                                    console.log(enviadoBpro, `¿RESPUESTA DEL SP ENVIADO BPRO TRUE 1?`);
                                })
                                    .catch(reject);
                                resolve(true);
                            }
                            else {
                                yield connection.query(`exec sp_Flotillas_CambiaEstatus @idCotizacion = '${idCotizacion}'`)
                                    .then((cambiaStatus) => {
                                    console.log(cambiaStatus, `¿RESPUESTA DEL SP CAMBIA STATUS?`);
                                })
                                    .catch(reject);
                                yield connection.query(`exec sp_Flotillas_InsertaAccesorioCompra @idCotizacion = '${idCotizacion}'`)
                                    .then((insertaAccesorios) => {
                                    console.log(insertaAccesorios, `¿RESPUESTA DEL SP INSERTA ACCESORIOS COMPRA 2?`);
                                })
                                    .catch(reject);
                                yield manager.query(`exec sp_Flotillas_EnviadoBProTrue  @idCotizacion = '${idCotizacion}'`)
                                    .then((enviadoBpro) => {
                                    console.log(enviadoBpro, `¿RESPUESTA DEL SP ENVIADO BPRO TRUE 2?`);
                                })
                                    .catch(reject);
                                resolve(true);
                            }
                        }))
                            .catch(reject);
                    }
                    else {
                        yield manager.query(`exec sp_Flotillas_EnviadoBProTrue  @idCotizacion = '${idCotizacion}'`)
                            .then((enviadoBpro) => {
                            console.log(enviadoBpro, `¿RESPUESTA DEL SP ENVIADO BPRO TRUE 3?`);
                        })
                            .catch(reject);
                        resolve(true);
                    }
                }))
                    .catch(reject);
            }))
                .catch(reject);
        }));
    }
}
exports.PedidoBusiness = PedidoBusiness;
//# sourceMappingURL=pedido.business.js.map