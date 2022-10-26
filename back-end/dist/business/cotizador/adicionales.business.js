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
const catalogo_1 = require("../../db/model/catalogo");
const cotizador_1 = require("../../db/model/cotizador");
class AdicionalesBusiness {
    saveCotizacionGrupoAccesorio(idCotizacion, idGrupoUnidad, encPaquetesAccesorios) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let totalRegistros = 0;
            let existPaqueteAccesorio = [];
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionGruposAccesoriosRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoAccesorio);
                const detallePaqueteAccesorioRepository = yield manager.getRepository(catalogo_1.DetPaqueteAccesorio);
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const unidadAccesorioRepository = yield manager.getRepository(cotizador_1.CotizacionUnidadAccesorio);
                if (!encPaquetesAccesorios.length) {
                    resolve(0);
                    return;
                }
                for (const encabezadoPaqueteAccesorio of encPaquetesAccesorios) {
                    existPaqueteAccesorio = [];
                    const existCotizacionGrupoAccesorio = yield cotizacionGruposAccesoriosRepository.findOne({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: encabezadoPaqueteAccesorio.idEncPaqueteAccesorio });
                    if (!existCotizacionGrupoAccesorio) {
                        const detallesPaqueteAccesorio = yield detallePaqueteAccesorioRepository.findOne({ where: { idEncPaqueteAccesorio: encabezadoPaqueteAccesorio.idEncPaqueteAccesorio } });
                        if (detallesPaqueteAccesorio) {
                            const gruposAccesorios = new cotizador_1.CotizacionGrupoAccesorio();
                            gruposAccesorios.idCotizacion = idCotizacion;
                            gruposAccesorios.idGrupoUnidad = idGrupoUnidad;
                            gruposAccesorios.idEncPaqueteAccesorio = detallesPaqueteAccesorio.idEncPaqueteAccesorio;
                            gruposAccesorios.idDetPaqueteAccesorio = detallesPaqueteAccesorio.idDetPaqueteAccesorio;
                            gruposAccesorios.idAccesorioNuevo = detallesPaqueteAccesorio.idAccesorioNuevo;
                            gruposAccesorios.nombre = detallesPaqueteAccesorio.nombre;
                            gruposAccesorios.idTipoProveedor = detallesPaqueteAccesorio.idTipoProveedor;
                            gruposAccesorios.idProveedor = detallesPaqueteAccesorio.idProveedor;
                            gruposAccesorios.nombreProveedor = detallesPaqueteAccesorio.nombreProveedor;
                            gruposAccesorios.idParte = detallesPaqueteAccesorio.idParte;
                            gruposAccesorios.modeloAnio = detallesPaqueteAccesorio.modeloAnio;
                            gruposAccesorios.cantidad = detallesPaqueteAccesorio.cantidad;
                            gruposAccesorios.costo = detallesPaqueteAccesorio.costo;
                            gruposAccesorios.precio = detallesPaqueteAccesorio.precio;
                            gruposAccesorios.idUsuarioModificacion = encabezadoPaqueteAccesorio.idUsuarioModificacion;
                            gruposAccesorios.fechaModificacion = encabezadoPaqueteAccesorio.fechaModificacion;
                            const existGrupoAccesorio = yield cotizacionGruposAccesoriosRepository.findOne({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: gruposAccesorios.idEncPaqueteAccesorio });
                            if (!existGrupoAccesorio) {
                                yield cotizacionGruposAccesoriosRepository.save(gruposAccesorios)
                                    .catch((error) => {
                                    reject(`El paquete de accesorios que intenta seleccionar ya contiene accesorios de un paquete previamente seleccionado`);
                                });
                                totalRegistros++;
                                const unidades = yield detalleUnidadesRepository.findOne({ select: ['idDetalleUnidad'], where: { idCotizacion, idGrupoUnidad } });
                                if (unidades) {
                                    const unidadAccesorio = new cotizador_1.CotizacionUnidadAccesorio();
                                    unidadAccesorio.idCotizacion = idCotizacion;
                                    unidadAccesorio.idGrupoUnidad = idGrupoUnidad;
                                    unidadAccesorio.idDetalleUnidad = unidades.idDetalleUnidad;
                                    unidadAccesorio.idEncPaqueteAccesorio = detallesPaqueteAccesorio.idEncPaqueteAccesorio;
                                    unidadAccesorio.idDetPaqueteAccesorio = detallesPaqueteAccesorio.idDetPaqueteAccesorio;
                                    unidadAccesorio.idAccesorioNuevo = detallesPaqueteAccesorio.idAccesorioNuevo || -1;
                                    unidadAccesorio.nombre = detallesPaqueteAccesorio.nombre;
                                    unidadAccesorio.idTipoProveedor = detallesPaqueteAccesorio.idTipoProveedor;
                                    unidadAccesorio.idProveedor = detallesPaqueteAccesorio.idProveedor;
                                    unidadAccesorio.nombreProveedor = detallesPaqueteAccesorio.nombreProveedor;
                                    unidadAccesorio.idParte = detallesPaqueteAccesorio.idParte || '';
                                    unidadAccesorio.modeloAnio = detallesPaqueteAccesorio.modeloAnio;
                                    unidadAccesorio.cantidad = detallesPaqueteAccesorio.cantidad;
                                    unidadAccesorio.costo = detallesPaqueteAccesorio.costo;
                                    unidadAccesorio.precio = detallesPaqueteAccesorio.precio;
                                    unidadAccesorio.idUsuarioModificacion = encabezadoPaqueteAccesorio.idUsuarioModificacion;
                                    unidadAccesorio.fechaModificacion = encabezadoPaqueteAccesorio.fechaModificacion;
                                    yield unidadAccesorioRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: unidadAccesorio.idEncPaqueteAccesorio });
                                    const existUnidadAccesorio = yield unidadAccesorioRepository.findOne({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: unidadAccesorio.idEncPaqueteAccesorio });
                                    if (!existUnidadAccesorio) {
                                        yield unidadAccesorioRepository.save(unidadAccesorio).catch(reject);
                                    }
                                }
                            }
                            else {
                                yield cotizacionGruposAccesoriosRepository.update({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: gruposAccesorios.idEncPaqueteAccesorio }, gruposAccesorios).catch(reject);
                            }
                        }
                    }
                }
                resolve({ status: 200, message: `Se ha añadido un total de ${totalRegistros} paquetes accesorios` });
            }));
        }));
    }
    saveCotizacionGrupoAccesoriosSinPaquete(accesoriosSinPaquete) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            console.log('saveCotizacionGrupoAccesoriosSinPaquete: ');
            console.log(accesoriosSinPaquete);
            if (!accesoriosSinPaquete || accesoriosSinPaquete.length === 0) {
                resolve(0);
                return;
            }
            let totalRegistros = 0;
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const grupoAccesorioRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoAccesorio);
                const unidadAccesorioRepository = yield manager.getRepository(cotizador_1.CotizacionUnidadAccesorio);
                // await unidadAccesorioRepository.delete({
                //     idCotizacion: accesoriosSinPaquete[0].idCotizacion,
                //     idGrupoUnidad: accesoriosSinPaquete[0].idGrupoUnidad,
                //     idEncPaqueteAccesorio: null,
                //     idDetPaqueteAccesorio: null,
                // });
                // await grupoAccesorioRepository.delete({
                //     idCotizacion: accesoriosSinPaquete[0].idCotizacion,
                //     idGrupoUnidad: accesoriosSinPaquete[0].idGrupoUnidad,
                //     idEncPaqueteAccesorio: null,
                //     idDetPaqueteAccesorio: null,
                // });
                for (const accesorioSinPaquete of accesoriosSinPaquete) {
                    const grupoAccesorio = new cotizador_1.CotizacionUnidadAccesorio();
                    grupoAccesorio.idCotizacion = accesorioSinPaquete.idCotizacion;
                    grupoAccesorio.idGrupoUnidad = accesorioSinPaquete.idGrupoUnidad;
                    grupoAccesorio.idEncPaqueteAccesorio = null;
                    grupoAccesorio.idDetPaqueteAccesorio = null;
                    grupoAccesorio.idAccesorioNuevo = accesorioSinPaquete.idAccesorioNuevo || -1;
                    grupoAccesorio.nombre = accesorioSinPaquete.nombre;
                    grupoAccesorio.idTipoProveedor = accesorioSinPaquete.idTipoProveedor;
                    grupoAccesorio.nombreProveedor = accesorioSinPaquete.nombreProveedor;
                    grupoAccesorio.idProveedor = accesorioSinPaquete.idProveedor;
                    grupoAccesorio.idParte = accesorioSinPaquete.idParte || '';
                    grupoAccesorio.modeloAnio = accesorioSinPaquete.modeloAnio;
                    grupoAccesorio.cantidad = accesorioSinPaquete.cantidad;
                    grupoAccesorio.costo = accesorioSinPaquete.costo;
                    grupoAccesorio.precio = accesorioSinPaquete.precio;
                    grupoAccesorio.idUsuarioModificacion = accesorioSinPaquete.idUsuarioModificacion;
                    grupoAccesorio.fechaModificacion = accesorioSinPaquete.fechaModificacion;
                    grupoAccesorio.idAlmacen = accesorioSinPaquete.idAlmacen;
                    grupoAccesorio.Planta = accesorioSinPaquete.Planta;
                    yield grupoAccesorioRepository.save(grupoAccesorio)
                        .catch((error) => {
                        reject(`El paquete de accesorios que intenta seleccionar ya contiene accesorios de un paquete previamente seleccionado`);
                    });
                    // .catch(reject);
                    const unidades = yield detalleUnidadesRepository.find({
                        select: ['idDetalleUnidad'],
                        where: {
                            idCotizacion: accesoriosSinPaquete[0].idCotizacion,
                            idGrupoUnidad: accesoriosSinPaquete[0].idGrupoUnidad,
                        },
                    });
                    if (!unidades.length) {
                        reject(0);
                    }
                    for (const unidad of unidades) {
                        const unidadAccesorio = new cotizador_1.CotizacionUnidadAccesorio();
                        unidadAccesorio.idCotizacion = accesorioSinPaquete.idCotizacion;
                        unidadAccesorio.idGrupoUnidad = accesorioSinPaquete.idGrupoUnidad;
                        unidadAccesorio.idDetalleUnidad = unidad.idDetalleUnidad;
                        unidadAccesorio.idEncPaqueteAccesorio = null;
                        unidadAccesorio.idDetPaqueteAccesorio = null;
                        unidadAccesorio.idAccesorioNuevo = accesorioSinPaquete.idAccesorioNuevo;
                        unidadAccesorio.nombre = accesorioSinPaquete.nombre;
                        unidadAccesorio.idTipoProveedor = accesorioSinPaquete.idTipoProveedor;
                        unidadAccesorio.nombreProveedor = accesorioSinPaquete.nombreProveedor;
                        unidadAccesorio.idProveedor = accesorioSinPaquete.idProveedor;
                        unidadAccesorio.idParte = accesorioSinPaquete.idParte || '';
                        unidadAccesorio.modeloAnio = accesorioSinPaquete.modeloAnio;
                        unidadAccesorio.cantidad = accesorioSinPaquete.cantidad;
                        unidadAccesorio.costo = accesorioSinPaquete.costo;
                        unidadAccesorio.precio = accesorioSinPaquete.precio;
                        unidadAccesorio.idUsuarioModificacion = accesorioSinPaquete.idUsuarioModificacion;
                        unidadAccesorio.fechaModificacion = accesorioSinPaquete.fechaModificacion;
                        unidadAccesorio.idAlmacen = accesorioSinPaquete.idAlmacen;
                        unidadAccesorio.Planta = accesorioSinPaquete.Planta;
                        yield unidadAccesorioRepository.save(unidadAccesorio)
                            .catch((error) => {
                            console.log('error: ', error);
                            reject(0);
                        });
                        totalRegistros++;
                    }
                }
                resolve(totalRegistros);
            }));
        }));
    }
    saveCotizacionGrupoAccesoriosSinPaqueteTodos(accesoriosSinPaquete) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let totalRegistros = 0;
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const grupoAccesorioRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoAccesorio);
                const unidadAccesorioRepository = yield manager.getRepository(cotizador_1.CotizacionUnidadAccesorio);
                for (const accesorioSinPaquete of accesoriosSinPaquete) {
                    const grupoAccesorio = new cotizador_1.CotizacionUnidadAccesorio();
                    const unidades = yield detalleUnidadesRepository.find({
                        where: {
                            idCotizacion: accesorioSinPaquete.idCotizacion,
                        },
                    });
                    if (!unidades.length) {
                        reject(0);
                    }
                    for (const unidad of unidades) {
                        grupoAccesorio.idCotizacion = accesorioSinPaquete.idCotizacion;
                        grupoAccesorio.idGrupoUnidad = unidad.idGrupoUnidad;
                        grupoAccesorio.idEncPaqueteAccesorio = null;
                        grupoAccesorio.idDetPaqueteAccesorio = null;
                        grupoAccesorio.idAccesorioNuevo = accesorioSinPaquete.idAccesorioNuevo || -1;
                        grupoAccesorio.nombre = accesorioSinPaquete.nombre;
                        grupoAccesorio.idTipoProveedor = accesorioSinPaquete.idTipoProveedor;
                        grupoAccesorio.nombreProveedor = accesorioSinPaquete.nombreProveedor;
                        grupoAccesorio.idProveedor = accesorioSinPaquete.idProveedor;
                        grupoAccesorio.idParte = accesorioSinPaquete.idParte || '';
                        grupoAccesorio.modeloAnio = accesorioSinPaquete.modeloAnio;
                        grupoAccesorio.cantidad = accesorioSinPaquete.cantidad;
                        grupoAccesorio.costo = accesorioSinPaquete.costo;
                        grupoAccesorio.precio = accesorioSinPaquete.precio;
                        grupoAccesorio.idUsuarioModificacion = accesorioSinPaquete.idUsuarioModificacion;
                        grupoAccesorio.fechaModificacion = accesorioSinPaquete.fechaModificacion;
                        const getAccesorio = yield grupoAccesorioRepository.findOne({
                            idCotizacion: grupoAccesorio.idCotizacion,
                            idGrupoUnidad: grupoAccesorio.idGrupoUnidad,
                        });
                        yield grupoAccesorioRepository.save(grupoAccesorio)
                            .catch(reject);
                        // if (!getAccesorio) {
                        //     await grupoAccesorioRepository.save(grupoAccesorio)
                        //     .catch(reject);
                        // } else {
                        //     await grupoAccesorioRepository.delete({
                        //         idCotizacion: grupoAccesorio.idCotizacion,
                        //         idGrupoUnidad: grupoAccesorio.idGrupoUnidad,
                        //     })
                        //     .catch(reject);
                        //     await grupoAccesorioRepository.save(grupoAccesorio)
                        //     .catch(reject);
                        // }
                        const unidadAccesorio = new cotizador_1.CotizacionUnidadAccesorio();
                        unidadAccesorio.idCotizacion = accesorioSinPaquete.idCotizacion;
                        unidadAccesorio.idGrupoUnidad = unidad.idGrupoUnidad;
                        unidadAccesorio.idDetalleUnidad = unidad.idDetalleUnidad;
                        unidadAccesorio.idEncPaqueteAccesorio = null;
                        unidadAccesorio.idDetPaqueteAccesorio = null;
                        unidadAccesorio.idAccesorioNuevo = accesorioSinPaquete.idAccesorioNuevo;
                        unidadAccesorio.nombre = accesorioSinPaquete.nombre;
                        unidadAccesorio.idTipoProveedor = accesorioSinPaquete.idTipoProveedor;
                        unidadAccesorio.nombreProveedor = accesorioSinPaquete.nombreProveedor;
                        unidadAccesorio.idProveedor = accesorioSinPaquete.idProveedor;
                        unidadAccesorio.idParte = accesorioSinPaquete.idParte || '';
                        unidadAccesorio.modeloAnio = accesorioSinPaquete.modeloAnio;
                        unidadAccesorio.cantidad = accesorioSinPaquete.cantidad;
                        unidadAccesorio.costo = accesorioSinPaquete.costo;
                        unidadAccesorio.precio = accesorioSinPaquete.precio;
                        unidadAccesorio.idUsuarioModificacion = accesorioSinPaquete.idUsuarioModificacion;
                        unidadAccesorio.fechaModificacion = accesorioSinPaquete.fechaModificacion;
                        totalRegistros++;
                        const getUnidadAccesorio = yield unidadAccesorioRepository.findOne({
                            idCotizacion: unidadAccesorio.idCotizacion,
                            idGrupoUnidad: unidadAccesorio.idGrupoUnidad,
                            idDetalleUnidad: unidadAccesorio.idDetalleUnidad,
                        });
                        yield unidadAccesorioRepository.save(unidadAccesorio)
                            .catch(reject);
                        // if (!getUnidadAccesorio) {
                        //     await unidadAccesorioRepository.save(unidadAccesorio)
                        //     .catch(reject);
                        // } else {
                        //     await unidadAccesorioRepository.delete({
                        //         idCotizacion: unidadAccesorio.idCotizacion,
                        //         idGrupoUnidad: unidadAccesorio.idGrupoUnidad,
                        //         idDetalleUnidad: unidadAccesorio.idDetalleUnidad,
                        //     })
                        //     .catch(reject);
                        //     await unidadAccesorioRepository.save(unidadAccesorio)
                        //     .catch(reject);
                        // }
                    }
                }
                resolve(totalRegistros);
            }));
        }));
    }
    deleteCotizacionGrupoPaqueteAccesorio(idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionGrupoAccesorioRepository = yield connection.getRepository(cotizador_1.CotizacionGrupoAccesorio);
            const cotizacionUnidadAccesorioRepository = yield connection.getRepository(cotizador_1.CotizacionUnidadAccesorio);
            yield cotizacionGrupoAccesorioRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio });
            yield cotizacionUnidadAccesorioRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio });
            resolve(1);
        }));
    }
    deleteCotizacionGrupoAccesorioSinPaquete(accesorioSinPaquete) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionUnidadAccesorioRepository = yield connection.getRepository(cotizador_1.CotizacionUnidadAccesorio);
            const cotizacionGrupoAccesorioRepository = yield connection.getRepository(cotizador_1.CotizacionGrupoAccesorio);
            yield cotizacionGrupoAccesorioRepository.delete({
                idCotizacion: accesorioSinPaquete.idCotizacion,
                idGrupoUnidad: accesorioSinPaquete.idGrupoUnidad,
                idAccesorioNuevo: accesorioSinPaquete.idAccesorioNuevo,
                idParte: accesorioSinPaquete.idParte,
            });
            yield cotizacionUnidadAccesorioRepository.delete({
                idCotizacion: accesorioSinPaquete.idCotizacion,
                idGrupoUnidad: accesorioSinPaquete.idGrupoUnidad,
                idAccesorioNuevo: accesorioSinPaquete.idAccesorioNuevo,
                idParte: accesorioSinPaquete.idParte,
            });
            resolve(1);
        }));
    }
    saveCotizacionGrupoTramite(idCotizacion, idGrupoUnidad, encPaquetesTramites) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let totalRegistros = 0;
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionGrupoTramiteRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoTramite);
                const detallePaqueteTramiteRepository = yield manager.getRepository(catalogo_1.DetPaqueteTramite);
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const unidadTramiteRepository = yield manager.getRepository(cotizador_1.CotizacionUnidadTramite);
                yield cotizacionGrupoTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite: typeorm_1.Not(typeorm_1.IsNull()) });
                yield unidadTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite: typeorm_1.Not(typeorm_1.IsNull()) });
                if (!encPaquetesTramites || encPaquetesTramites.length === 0) {
                    resolve(0);
                    return;
                }
                for (const encPaqueteTramite of encPaquetesTramites) {
                    const detallesPaqueteTramite = yield detallePaqueteTramiteRepository.find({
                        where: {
                            idEncPaqueteTramite: encPaqueteTramite.idEncPaqueteTramite,
                        },
                    });
                    for (const detPaqueteTramite of detallesPaqueteTramite) {
                        const grupoTramite = new cotizador_1.CotizacionGrupoTramite();
                        grupoTramite.idCotizacion = idCotizacion;
                        grupoTramite.idGrupoUnidad = idGrupoUnidad;
                        grupoTramite.idEncPaqueteTramite = detPaqueteTramite.idEncPaqueteTramite;
                        grupoTramite.idTramite = detPaqueteTramite.idTramite;
                        grupoTramite.idSubtramite = detPaqueteTramite.idSubtramite;
                        grupoTramite.nombreTramite = detPaqueteTramite.nombreTramite;
                        grupoTramite.nombreSubtramite = detPaqueteTramite.nombreSubtramite;
                        grupoTramite.idProveedor = detPaqueteTramite.idProveedor;
                        grupoTramite.nombreProveedor = detPaqueteTramite.nombreProveedor;
                        grupoTramite.costo = detPaqueteTramite.costo;
                        grupoTramite.precio = detPaqueteTramite.precio;
                        grupoTramite.idUsuarioModificacion = encPaqueteTramite.idUsuarioModificacion;
                        grupoTramite.fechaModificacion = encPaqueteTramite.fechaModificacion;
                        yield cotizacionGrupoTramiteRepository.save(grupoTramite);
                        totalRegistros++;
                        const unidades = yield detalleUnidadesRepository.find({
                            select: ['idDetalleUnidad'],
                            where: {
                                idCotizacion,
                                idGrupoUnidad,
                            },
                        });
                        for (const unidad of unidades) {
                            const unidadTramite = new cotizador_1.CotizacionUnidadTramite();
                            unidadTramite.idCotizacion = idCotizacion;
                            unidadTramite.idGrupoUnidad = idGrupoUnidad;
                            unidadTramite.idDetalleUnidad = unidad.idDetalleUnidad;
                            unidadTramite.idEncPaqueteTramite = detPaqueteTramite.idEncPaqueteTramite;
                            unidadTramite.idTramite = detPaqueteTramite.idTramite;
                            unidadTramite.nombreTramite = detPaqueteTramite.nombreTramite;
                            unidadTramite.idSubtramite = detPaqueteTramite.idSubtramite;
                            unidadTramite.nombreSubtramite = detPaqueteTramite.nombreSubtramite;
                            unidadTramite.idProveedor = detPaqueteTramite.idProveedor;
                            unidadTramite.nombreProveedor = detPaqueteTramite.nombreProveedor;
                            unidadTramite.costo = detPaqueteTramite.costo;
                            unidadTramite.precio = detPaqueteTramite.precio;
                            unidadTramite.idUsuarioModificacion = encPaqueteTramite.idUsuarioModificacion;
                            unidadTramite.fechaModificacion = encPaqueteTramite.fechaModificacion;
                            yield unidadTramiteRepository.save(unidadTramite);
                        }
                    }
                }
                resolve(totalRegistros);
            }));
        }));
    }
    saveCotizacionGrupoTramiteTodos(idCotizacion, idGrupoUnidad, encPaquetesTramites) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            let totalRegistros = 0;
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                var e_1, _a, e_2, _b;
                const cotizacionGrupoTramiteRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoTramite);
                const detallePaqueteTramiteRepository = yield manager.getRepository(catalogo_1.DetPaqueteTramite);
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const unidadTramiteRepository = yield manager.getRepository(cotizador_1.CotizacionUnidadTramite);
                yield cotizacionGrupoTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite: typeorm_1.Not(typeorm_1.IsNull()) });
                yield unidadTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite: typeorm_1.Not(typeorm_1.IsNull()) });
                if (!encPaquetesTramites.length) {
                    reject({ status: 400, error: `Se require el encabezado de paquetes` });
                }
                const unidades = yield detalleUnidadesRepository.find({
                    where: {
                        idCotizacion,
                    },
                });
                if (!unidades.length) {
                    reject({ status: 404, error: `No se encontraron las unidades` });
                }
                try {
                    for (var encPaquetesTramites_1 = __asyncValues(encPaquetesTramites), encPaquetesTramites_1_1; encPaquetesTramites_1_1 = yield encPaquetesTramites_1.next(), !encPaquetesTramites_1_1.done;) {
                        const encPaqueteTramite = encPaquetesTramites_1_1.value;
                        index++;
                        const grupoTramite = new cotizador_1.CotizacionGrupoTramite();
                        const unidadTramite = new cotizador_1.CotizacionUnidadTramite();
                        const detallesPaqueteTramite = yield detallePaqueteTramiteRepository.find({
                            where: {
                                idEncPaqueteTramite: encPaqueteTramite.idEncPaqueteTramite,
                            },
                        });
                        try {
                            for (var unidades_1 = __asyncValues(unidades), unidades_1_1; unidades_1_1 = yield unidades_1.next(), !unidades_1_1.done;) {
                                const unidad = unidades_1_1.value;
                                const detPaqueteTramite = detallesPaqueteTramite[index];
                                grupoTramite.idCotizacion = idCotizacion;
                                grupoTramite.idGrupoUnidad = unidad.idGrupoUnidad;
                                grupoTramite.idEncPaqueteTramite = detPaqueteTramite.idEncPaqueteTramite;
                                grupoTramite.idTramite = detPaqueteTramite.idTramite;
                                grupoTramite.idSubtramite = detPaqueteTramite.idSubtramite;
                                grupoTramite.nombreTramite = detPaqueteTramite.nombreTramite;
                                grupoTramite.nombreSubtramite = detPaqueteTramite.nombreSubtramite;
                                grupoTramite.idProveedor = detPaqueteTramite.idProveedor;
                                grupoTramite.nombreProveedor = detPaqueteTramite.nombreProveedor;
                                grupoTramite.costo = detPaqueteTramite.costo;
                                grupoTramite.precio = detPaqueteTramite.precio;
                                grupoTramite.idUsuarioModificacion = encPaqueteTramite.idUsuarioModificacion;
                                grupoTramite.fechaModificacion = encPaqueteTramite.fechaModificacion;
                                yield cotizacionGrupoTramiteRepository.save(grupoTramite)
                                    .catch(reject);
                                unidadTramite.idCotizacion = idCotizacion;
                                unidadTramite.idGrupoUnidad = unidad.idGrupoUnidad;
                                unidadTramite.idDetalleUnidad = unidad.idDetalleUnidad;
                                unidadTramite.idEncPaqueteTramite = detPaqueteTramite.idEncPaqueteTramite;
                                unidadTramite.idTramite = detPaqueteTramite.idTramite;
                                unidadTramite.nombreTramite = detPaqueteTramite.nombreTramite;
                                unidadTramite.idSubtramite = detPaqueteTramite.idSubtramite;
                                unidadTramite.nombreSubtramite = detPaqueteTramite.nombreSubtramite;
                                unidadTramite.idProveedor = detPaqueteTramite.idProveedor;
                                unidadTramite.nombreProveedor = detPaqueteTramite.nombreProveedor;
                                unidadTramite.costo = detPaqueteTramite.costo;
                                unidadTramite.precio = detPaqueteTramite.precio;
                                unidadTramite.idUsuarioModificacion = encPaqueteTramite.idUsuarioModificacion;
                                unidadTramite.fechaModificacion = encPaqueteTramite.fechaModificacion;
                                yield unidadTramiteRepository.save(unidadTramite)
                                    .catch(reject);
                                totalRegistros++;
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (unidades_1_1 && !unidades_1_1.done && (_b = unidades_1.return)) yield _b.call(unidades_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (encPaquetesTramites_1_1 && !encPaquetesTramites_1_1.done && (_a = encPaquetesTramites_1.return)) yield _a.call(encPaquetesTramites_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                resolve(totalRegistros);
            }));
        }));
    }
    saveCotizacionGrupoTramitesSinPaquete(tramitesSinPaquete) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!tramitesSinPaquete || tramitesSinPaquete.length === 0) {
                resolve(0);
                return;
            }
            let totalRegistros = 0;
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const grupoTramiteRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoTramite);
                const unidadTramiteRepository = yield manager.getRepository(cotizador_1.CotizacionUnidadTramite);
                for (const tramiteSinPaquete of tramitesSinPaquete) {
                    const grupoTramite = new cotizador_1.CotizacionGrupoTramite();
                    grupoTramite.idCotizacion = tramiteSinPaquete.idCotizacion;
                    grupoTramite.idGrupoUnidad = tramiteSinPaquete.idGrupoUnidad;
                    grupoTramite.idEncPaqueteTramite = null;
                    grupoTramite.idTramite = tramiteSinPaquete.idTramite;
                    grupoTramite.idSubtramite = tramiteSinPaquete.idSubtramite;
                    grupoTramite.idProveedor = tramiteSinPaquete.idProveedor;
                    grupoTramite.nombreTramite = tramiteSinPaquete.nombreTramite;
                    grupoTramite.nombreSubtramite = tramiteSinPaquete.nombreSubtramite;
                    grupoTramite.nombreProveedor = tramiteSinPaquete.nombreProveedor;
                    grupoTramite.costo = tramiteSinPaquete.costo;
                    grupoTramite.precio = tramiteSinPaquete.precio;
                    grupoTramite.idUsuarioModificacion = tramiteSinPaquete.idUsuarioModificacion;
                    grupoTramite.fechaModificacion = tramiteSinPaquete.fechaModificacion;
                    yield grupoTramiteRepository.save(grupoTramite);
                    const unidades = yield detalleUnidadesRepository.find({
                        select: ['idDetalleUnidad'],
                        where: {
                            idCotizacion: tramitesSinPaquete[0].idCotizacion,
                            idGrupoUnidad: tramitesSinPaquete[0].idGrupoUnidad,
                        },
                    });
                    for (const unidad of unidades) {
                        const unidadTramite = new cotizador_1.CotizacionUnidadTramite();
                        unidadTramite.idCotizacion = tramiteSinPaquete.idCotizacion;
                        unidadTramite.idGrupoUnidad = tramiteSinPaquete.idGrupoUnidad;
                        unidadTramite.idDetalleUnidad = unidad.idDetalleUnidad;
                        unidadTramite.idEncPaqueteTramite = null;
                        unidadTramite.idTramite = tramiteSinPaquete.idTramite;
                        unidadTramite.idSubtramite = tramiteSinPaquete.idSubtramite;
                        unidadTramite.idProveedor = tramiteSinPaquete.idProveedor;
                        unidadTramite.nombreTramite = tramiteSinPaquete.nombreTramite;
                        unidadTramite.nombreSubtramite = tramiteSinPaquete.nombreSubtramite;
                        unidadTramite.nombreProveedor = tramiteSinPaquete.nombreProveedor;
                        unidadTramite.costo = tramiteSinPaquete.costo;
                        unidadTramite.precio = tramiteSinPaquete.precio;
                        unidadTramite.idUsuarioModificacion = tramiteSinPaquete.idUsuarioModificacion;
                        unidadTramite.fechaModificacion = tramiteSinPaquete.fechaModificacion;
                        unidadTramite.procesado = 0;
                        yield unidadTramiteRepository.save(unidadTramite);
                        totalRegistros++;
                    }
                }
                resolve(totalRegistros);
            }));
        }));
    }
    deleteCotizacionGrupoPaqueteTramite(idCotizacion, idGrupoUnidad, idEncPaqueteTramite) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionGrupoTramiteRepository = yield connection.getRepository(cotizador_1.CotizacionGrupoTramite);
            const cotizacionUnidadTramiteRepository = yield connection.getRepository(cotizador_1.CotizacionUnidadTramite);
            yield cotizacionGrupoTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite });
            yield cotizacionUnidadTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite });
            resolve(1);
        }));
    }
    deleteCotizacionGrupoTramiteSinPaquete(tramiteSinPaquete) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionUnidadTramiteRepository = yield connection.getRepository(cotizador_1.CotizacionUnidadTramite);
            const cotizacionGrupoTramiteRepository = yield connection.getRepository(cotizador_1.CotizacionGrupoTramite);
            yield cotizacionUnidadTramiteRepository.delete({
                idCotizacion: tramiteSinPaquete.idCotizacion,
                idGrupoUnidad: tramiteSinPaquete.idGrupoUnidad,
                idTramite: tramiteSinPaquete.idTramite,
            })
                .catch(reject);
            yield cotizacionGrupoTramiteRepository.delete({
                idCotizacion: tramiteSinPaquete.idCotizacion,
                idGrupoUnidad: tramiteSinPaquete.idGrupoUnidad,
                idTramite: tramiteSinPaquete.idTramite,
            })
                .catch(reject);
            resolve(1);
        }));
    }
    saveCotizacionGrupoServicioUnidad(idCotizacion, idGrupoUnidad, encPaquetesServicioUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let totalRegistros = 0;
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const cotizacionGrupoServicioUnidadRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoServicioUnidad);
                const detallePaqueteServicioUnidadRepository = yield manager.getRepository(catalogo_1.DetPaqueteServicioUnidad);
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const unidadServicioUnidadRepository = yield manager.getRepository(cotizador_1.CotizacionUnidadServicioUnidad);
                yield cotizacionGrupoServicioUnidadRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad: typeorm_1.Not(typeorm_1.IsNull()) });
                yield unidadServicioUnidadRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad: typeorm_1.Not(typeorm_1.IsNull()) });
                if (!encPaquetesServicioUnidad || encPaquetesServicioUnidad.length === 0) {
                    resolve(0);
                }
                for (const encPaqueteServicioUnidad of encPaquetesServicioUnidad) {
                    const detallesPaqueteServicioUnidad = yield detallePaqueteServicioUnidadRepository.find({
                        where: {
                            idEncPaqueteServicioUnidad: encPaqueteServicioUnidad.idEncPaqueteServicioUnidad,
                        },
                    });
                    for (const detPaqueteServicioUnidad of detallesPaqueteServicioUnidad) {
                        const grupoServicioUnidad = new cotizador_1.CotizacionGrupoServicioUnidad();
                        grupoServicioUnidad.idCotizacion = idCotizacion;
                        grupoServicioUnidad.idGrupoUnidad = idGrupoUnidad;
                        grupoServicioUnidad.idEncPaqueteServicioUnidad = detPaqueteServicioUnidad.idEncPaqueteServicioUnidad;
                        grupoServicioUnidad.idServicioUnidad = detPaqueteServicioUnidad.idServicioUnidad;
                        grupoServicioUnidad.catalogo = detPaqueteServicioUnidad.catalogo;
                        grupoServicioUnidad.anio = detPaqueteServicioUnidad.anio;
                        grupoServicioUnidad.nombre = detPaqueteServicioUnidad.nombre;
                        grupoServicioUnidad.costo = detPaqueteServicioUnidad.costo;
                        grupoServicioUnidad.precio = detPaqueteServicioUnidad.precio;
                        grupoServicioUnidad.idUsuarioModificacion = encPaqueteServicioUnidad.idUsuarioModificacion;
                        grupoServicioUnidad.fechaModificacion = encPaqueteServicioUnidad.fechaModificacion;
                        yield cotizacionGrupoServicioUnidadRepository.save(grupoServicioUnidad)
                            .catch(reject);
                        totalRegistros++;
                        const unidades = yield detalleUnidadesRepository.find({
                            select: ['idDetalleUnidad'],
                            where: {
                                idCotizacion,
                                idGrupoUnidad,
                            },
                        });
                        for (const unidad of unidades) {
                            const unidadServicioUnidad = new cotizador_1.CotizacionUnidadServicioUnidad();
                            unidadServicioUnidad.idCotizacion = idCotizacion;
                            unidadServicioUnidad.idGrupoUnidad = idGrupoUnidad;
                            unidadServicioUnidad.idDetalleUnidad = unidad.idDetalleUnidad;
                            unidadServicioUnidad.idEncPaqueteServicioUnidad = detPaqueteServicioUnidad.idEncPaqueteServicioUnidad;
                            unidadServicioUnidad.idServicioUnidad = detPaqueteServicioUnidad.idServicioUnidad;
                            unidadServicioUnidad.catalogo = detPaqueteServicioUnidad.catalogo;
                            unidadServicioUnidad.anio = detPaqueteServicioUnidad.anio;
                            unidadServicioUnidad.nombre = detPaqueteServicioUnidad.nombre;
                            unidadServicioUnidad.costo = detPaqueteServicioUnidad.costo;
                            unidadServicioUnidad.precio = detPaqueteServicioUnidad.precio;
                            unidadServicioUnidad.idUsuarioModificacion = encPaqueteServicioUnidad.idUsuarioModificacion;
                            unidadServicioUnidad.fechaModificacion = encPaqueteServicioUnidad.fechaModificacion;
                            yield unidadServicioUnidadRepository.save(unidadServicioUnidad)
                                .catch(reject);
                        }
                    }
                }
                resolve(totalRegistros);
            }));
        }));
    }
    saveCotizacionGrupoServiciosUnidadSinPaquete(serviciosUnidadSinPaquete) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!serviciosUnidadSinPaquete || serviciosUnidadSinPaquete.length === 0) {
                resolve(0);
                return;
            }
            let totalRegistros = 0;
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const detalleUnidadesRepository = yield manager.getRepository(cotizador_1.CotizacionDetalleUnidad);
                const grupoServicioUnidadRepository = yield manager.getRepository(cotizador_1.CotizacionGrupoServicioUnidad);
                const unidadServicioUnidadRepository = yield manager.getRepository(cotizador_1.CotizacionUnidadServicioUnidad);
                yield grupoServicioUnidadRepository.delete({
                    idCotizacion: serviciosUnidadSinPaquete[0].idCotizacion,
                    idGrupoUnidad: serviciosUnidadSinPaquete[0].idGrupoUnidad,
                    idEncPaqueteServicioUnidad: null,
                });
                yield unidadServicioUnidadRepository.delete({
                    idCotizacion: serviciosUnidadSinPaquete[0].idCotizacion,
                    idGrupoUnidad: serviciosUnidadSinPaquete[0].idGrupoUnidad,
                    idEncPaqueteServicioUnidad: null,
                });
                for (const tramiteSinPaquete of serviciosUnidadSinPaquete) {
                    const grupoServicioUnidad = new cotizador_1.CotizacionGrupoServicioUnidad();
                    grupoServicioUnidad.idCotizacion = tramiteSinPaquete.idCotizacion;
                    grupoServicioUnidad.idGrupoUnidad = tramiteSinPaquete.idGrupoUnidad;
                    grupoServicioUnidad.idEncPaqueteServicioUnidad = null;
                    grupoServicioUnidad.idServicioUnidad = tramiteSinPaquete.idServicioUnidad;
                    grupoServicioUnidad.catalogo = tramiteSinPaquete.catalogo;
                    grupoServicioUnidad.anio = tramiteSinPaquete.anio;
                    grupoServicioUnidad.nombre = tramiteSinPaquete.nombre;
                    grupoServicioUnidad.costo = tramiteSinPaquete.costo;
                    grupoServicioUnidad.precio = tramiteSinPaquete.precio;
                    grupoServicioUnidad.idUsuarioModificacion = tramiteSinPaquete.idUsuarioModificacion;
                    grupoServicioUnidad.fechaModificacion = tramiteSinPaquete.fechaModificacion;
                    yield grupoServicioUnidadRepository.save(grupoServicioUnidad);
                    const unidades = yield detalleUnidadesRepository.find({
                        select: ['idDetalleUnidad'],
                        where: {
                            idCotizacion: serviciosUnidadSinPaquete[0].idCotizacion,
                            idGrupoUnidad: serviciosUnidadSinPaquete[0].idGrupoUnidad,
                        },
                    });
                    for (const unidad of unidades) {
                        const unidadServicioUnidad = new cotizador_1.CotizacionUnidadServicioUnidad();
                        unidadServicioUnidad.idCotizacion = tramiteSinPaquete.idCotizacion;
                        unidadServicioUnidad.idGrupoUnidad = tramiteSinPaquete.idGrupoUnidad;
                        unidadServicioUnidad.idDetalleUnidad = unidad.idDetalleUnidad;
                        unidadServicioUnidad.idEncPaqueteServicioUnidad = null;
                        unidadServicioUnidad.idServicioUnidad = tramiteSinPaquete.idServicioUnidad;
                        unidadServicioUnidad.catalogo = tramiteSinPaquete.catalogo;
                        unidadServicioUnidad.anio = tramiteSinPaquete.anio;
                        unidadServicioUnidad.nombre = tramiteSinPaquete.nombre;
                        unidadServicioUnidad.costo = tramiteSinPaquete.costo;
                        unidadServicioUnidad.precio = tramiteSinPaquete.precio;
                        unidadServicioUnidad.idUsuarioModificacion = tramiteSinPaquete.idUsuarioModificacion;
                        unidadServicioUnidad.fechaModificacion = tramiteSinPaquete.fechaModificacion;
                        yield unidadServicioUnidadRepository.save(unidadServicioUnidad);
                        totalRegistros++;
                    }
                }
                resolve(totalRegistros);
            }));
        }));
    }
    deleteCotizacionGrupoPaqueteServicioUnidad(idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionGrupoServicioUnidadRepository = yield connection.getRepository(cotizador_1.CotizacionGrupoServicioUnidad);
            const cotizacionUnidadServicioUnidadRepository = yield connection.getRepository(cotizador_1.CotizacionUnidadServicioUnidad);
            yield cotizacionGrupoServicioUnidadRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad });
            yield cotizacionUnidadServicioUnidadRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad });
            resolve(1);
        }));
    }
    deleteCotizacionGrupoServicioUnidadSinPaquete(tramiteSinPaquete) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionUnidadServicioUnidadRepository = yield connection.getRepository(cotizador_1.CotizacionUnidadServicioUnidad);
            const cotizacionGrupoServicioUnidadRepository = yield connection.getRepository(cotizador_1.CotizacionGrupoServicioUnidad);
            yield cotizacionUnidadServicioUnidadRepository.delete({
                idCotizacion: tramiteSinPaquete.idCotizacion,
                idGrupoUnidad: tramiteSinPaquete.idGrupoUnidad,
                idServicioUnidad: tramiteSinPaquete.idServicioUnidad,
            });
            yield cotizacionGrupoServicioUnidadRepository.delete({
                idCotizacion: tramiteSinPaquete.idCotizacion,
                idGrupoUnidad: tramiteSinPaquete.idGrupoUnidad,
                idServicioUnidad: tramiteSinPaquete.idServicioUnidad,
            });
            resolve(1);
        }));
    }
    saveCotizacionUnidadTramite(cotizacionUnidadTramite) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const unidadTramiteRepository = manager.getRepository(cotizador_1.CotizacionUnidadTramite);
                // tslint:disable-next-line: prefer-for-of
                for (let index = 0; index < cotizacionUnidadTramite.length; index++) {
                    cotizacionUnidadTramite[index].procesado = 0;
                    yield unidadTramiteRepository.save(cotizacionUnidadTramite[index]);
                }
                resolve();
            }));
        }));
    }
    deleteCotizacionUnidadTramite(cotizacionUnidadTramite) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const cotizacionUnidadTramiteRepository = yield connection.getRepository(cotizador_1.CotizacionUnidadTramite);
            yield cotizacionUnidadTramiteRepository.delete({
                idCotizacion: cotizacionUnidadTramite.idCotizacion,
                idGrupoUnidad: cotizacionUnidadTramite.idGrupoUnidad,
                idTramite: cotizacionUnidadTramite.idTramite,
                idDetalleUnidad: cotizacionUnidadTramite.idDetalleUnidad,
            });
            resolve(1);
        }));
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    getListadoAccesoriosGrupos(idCotizacion, idGrupoUnidad, fuente) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ListadoAccesoriosGrupo @idCotizacion = '${idCotizacion}`
                    + `', @fuente  = '${fuente}` // 1:cotizacion,2:gestion
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}'`);
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
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    actualizaTipoOdenAccesorioGrupos(idCotizacion, idGrupoUnidad, idAccesorioNuevo, idParte, tipoOrden, tipoCargoUnidad, imprimeFactura, idCfdi) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ActualizaAccesorioTipoOrden @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idAccesorioNuevo  = '${idAccesorioNuevo}`
                    + `', @idParte   = '${idParte}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                    + `', @imprimeFactura  = '${imprimeFactura}`
                    + `', @idCfdi  = '${idCfdi}'`);
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
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    actualizaTipoOdenAccesorioGruposMovs(accesorio) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            const idCotizacion = accesorio.idCotizacion;
            const idGrupoUnidad = accesorio.idGrupoUnidad;
            const idAccesorioNuevo = accesorio.idAccesorioNuevo;
            const idParte = accesorio.idParte;
            const tipoOrden = accesorio.tipoOrden;
            const tipoCargoUnidad = accesorio.tipoCargoUnidad;
            const imprimeFactura = accesorio.imprimeFactura;
            const idCfdi = accesorio.idCfdi;
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ActualizaAccesorioTipoOrdenMov @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idAccesorioNuevo  = '${idAccesorioNuevo}`
                    + `', @idParte   = '${idParte}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                    + `', @imprimeFactura  = '${imprimeFactura}`
                    + `', @idCfdi  = '${idCfdi}'`);
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
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    getListadoTramitesGrupos(idCotizacion, idGrupoUnidad, fuente) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ListadoTramitesGrupo @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @fuente  = '${fuente}'`);
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
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    actualizaTipoOdenTramiteGrupos(idCotizacion, idGrupoUnidad, idTramite, idSubtramite, tipoOrden, idCfdi) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTramiteTipoOrden @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idTramite  = '${idTramite}`
                    + `', @idSubtramite    = '${idSubtramite}`
                    + `', @idCfdi    = '${idCfdi}`
                    + `', @tipoOrden  = '${tipoOrden}'`);
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
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
    // 20201202
    actualizaTipoOdenTramiteGruposMovs(tramite) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            const idCotizacion = tramite.idCotizacion;
            const idGrupoUnidad = tramite.idGrupoUnidad;
            const idTramite = tramite.idTramite;
            const idSubtramite = tramite.idSubtramite;
            const tipoOrden = tramite.tipoOrden;
            const idCfdi = tramite.idCfdi;
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTramiteTipoOrdenMov @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idTramite  = '${idTramite}`
                    + `', @idSubtramite    = '${idSubtramite}`
                    + `', @idCfdi    = '${idCfdi}`
                    + `', @tipoOrden  = '${tipoOrden}'`);
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
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    getListadoServiciosGrupos(idCotizacion, idGrupoUnidad, fuente) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const respuesta = yield queryRunnerVRC.query(`exec sp_Flotillas_ListadoServicios @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @fuente  = '${fuente}'`);
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
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201113
    actualizaTipoOdenServicioGrupos(idCotizacion, idGrupoUnidad, idServicioUnidad, tipoOrden, tipoCargoUnidad, idCfdi, imprimeFactura) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            try {
                const accesorios = yield queryRunnerVRC.query(`exec sp_Flotillas_ActualizaServicioTipoOrden @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idServicioUnidad  = '${idServicioUnidad}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                    + `', @imprimeFactura  = '${imprimeFactura}`
                    + `', @idCfdi  = '${idCfdi}'`);
                resolve(accesorios);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201113
    actualizaTipoOdenServicioGruposMovs(servicio) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionVRC = typeorm_1.getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            yield queryRunnerVRC.connect();
            const idCotizacion = servicio.idCotizacion;
            const idGrupoUnidad = servicio.idGrupoUnidad;
            const idServicioUnidad = servicio.idServicioUnidad;
            const tipoOrden = servicio.tipoOrden;
            const tipoCargoUnidad = servicio.tipoCargoUnidad;
            const imprimeFactura = servicio.imprimeFactura;
            const idCfdi = servicio.idCfdi;
            try {
                const accesorios = yield queryRunnerVRC.query(`exec sp_Flotillas_ActualizaServicioTipoOrdenMov @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idServicioUnidad  = '${idServicioUnidad}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                    + `', @imprimeFactura  = '${imprimeFactura}`
                    + `', @idCfdi  = '${idCfdi}'`);
                resolve(accesorios);
            }
            catch (error) {
                reject(error);
            }
            finally {
                yield queryRunnerVRC.release();
            }
        }));
    }
}
exports.AdicionalesBusiness = AdicionalesBusiness;
//# sourceMappingURL=adicionales.business.js.map