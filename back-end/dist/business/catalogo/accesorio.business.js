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
var TipoFiltro;
(function (TipoFiltro) {
    TipoFiltro[TipoFiltro["Id"] = 1] = "Id";
    TipoFiltro[TipoFiltro["Nombre"] = 2] = "Nombre";
})(TipoFiltro = exports.TipoFiltro || (exports.TipoFiltro = {}));
class AccesorioBusiness {
    getAccesorios(idCotizacion, idMarca, idSucursal, idParte, Descripcion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let queryString = ``;
            if (idCotizacion.length > 0) {
                queryString = `exec sp_Flotillas_ConsultaAccesorios @idCotizacion='${idCotizacion}', @Marca='${idMarca}', @Sucursal=${idSucursal}, @idParte = '${idParte}', @Descripcion = '${Descripcion}', @Almacen = 'NEG'`;
            }
            else {
                queryString = `exec sp_Flotillas_ConsultaAccesorios @idCotizacion='', @Marca='${idMarca}', @Sucursal=${idSucursal}, @idParte = '${idParte}', @Descripcion = '${Descripcion}', @Almacen = 'NEG'`;
            }
            yield connection.query(queryString)
                .then((resultadoAccesorios) => {
                const accesorios = [];
                if (resultadoAccesorios == undefined) {
                    resultadoAccesorios = [];
                }
                resultadoAccesorios.map((resultado) => {
                    accesorios.push({
                        idAccesorioNuevo: resultado.idAccesorioNuevo,
                        // idParte: resultado.IdParte.trim(),
                        idParte: resultado.IdParte,
                        nombre: resultado.Descripcion,
                        modeloAnio: resultado.Descripcion1,
                        costo: resultado.Costo,
                        precio: resultado.Precio,
                        existencia: resultado.Existencia,
                        Planta: resultado.Planta,
                        Origen: resultado.Origen,
                    });
                });
                resolve(accesorios);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getAccesoriosNuevos(idSucursal, idUsuarioValido) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const repositoryAccesoriosNuevos = connection.getRepository(catalogo_1.AccesorioNuevoDireccion);
            yield repositoryAccesoriosNuevos.find({ where: { idSucursal, idUsuarioValido } })
                .then((resultadoAccesoriosNuevos) => {
                resolve(resultadoAccesoriosNuevos);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    saveAccesorioNuevo(accesorioNuevo) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const repositoryAccesoriosNuevos = manager.getRepository(catalogo_1.AccesorioNuevo);
                if (accesorioNuevo.idAccesorioNuevo == undefined) {
                    let maxId = (yield repositoryAccesoriosNuevos.createQueryBuilder().select('MAX(AccesorioNuevo.idAccesorioNuevo)', 'max').getRawOne()).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    accesorioNuevo.idAccesorioNuevo = maxId;
                }
                accesorioNuevo.fechaModificacion = new Date();
                yield repositoryAccesoriosNuevos.save(accesorioNuevo).then((accesorioRetorno) => {
                    resolve(accesorioRetorno);
                }, reject);
            }));
        }));
    }
    deleteAccesorioNuevo(idAccesorioNuevo) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const accesorioNuevoRepository = connection.getRepository(catalogo_1.AccesorioNuevo);
            accesorioNuevoRepository.delete({ idAccesorioNuevo }).then((deleteResult) => {
                resolve(deleteResult.affected);
            }, reject);
        }));
    }
    getPaquetesAccesorio(idSucursal) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const encabezadoRepository = connection.getRepository(catalogo_1.EncPaqueteAccesorio);
            const encabezados = yield encabezadoRepository
                .find({
                where: { idSucursal },
                relations: ['accesorios'],
            });
            resolve(encabezados);
        }));
    }
    savePaqueteAccesorio(encPaqueteAccesorio) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (encPaqueteAccesorio.accesorios == undefined || encPaqueteAccesorio.accesorios.length == 0) {
                reject(new ts_httpexceptions_1.Exception(409, 'Debe especificar los items que componen el paquete en la propiedad \'accesorios\''));
                return;
            }
            const connection = typeorm_1.getConnection();
            yield connection.transaction('SERIALIZABLE', (manager) => __awaiter(this, void 0, void 0, function* () {
                const encabezadoRepository = yield manager.getRepository(catalogo_1.EncPaqueteAccesorio);
                const detalleRepository = yield manager.getRepository(catalogo_1.DetPaqueteAccesorio);
                if (encPaqueteAccesorio.idEncPaqueteAccesorio == undefined) {
                    const existeEncabezado = yield encabezadoRepository
                        .findOne({
                        where: { nombre: encPaqueteAccesorio.nombre, descripcion: encPaqueteAccesorio.descripcion },
                    });
                    if (existeEncabezado != undefined) {
                        reject(new ts_httpexceptions_1.Exception(409, 'Ya existe un paquete con este nombre y descripción'));
                        return;
                    }
                }
                if (encPaqueteAccesorio.idEncPaqueteAccesorio != undefined) {
                    detalleRepository.delete({ idEncPaqueteAccesorio: encPaqueteAccesorio.idEncPaqueteAccesorio });
                }
                else {
                    let maxId = (yield encabezadoRepository.createQueryBuilder().select('MAX(EncPaqueteAccesorio.idEncPaqueteAccesorio)', 'max').getRawOne()).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    encPaqueteAccesorio.idEncPaqueteAccesorio = maxId;
                }
                encPaqueteAccesorio.accesorios.map((detItem) => {
                    detItem.idEncPaqueteAccesorio = encPaqueteAccesorio.idEncPaqueteAccesorio;
                });
                encPaqueteAccesorio.fechaModificacion = new Date();
                yield encabezadoRepository.save(encPaqueteAccesorio).then((encSaved) => __awaiter(this, void 0, void 0, function* () {
                    for (const detItem of encPaqueteAccesorio.accesorios) {
                        detItem.idUsuarioModificacion = encPaqueteAccesorio.idUsuarioModificacion;
                        detItem.fechaModificacion = new Date();
                        if (detItem.idDetPaqueteAccesorio == undefined) {
                            let maxId = (yield detalleRepository.createQueryBuilder().select('MAX(DetPaqueteAccesorio.idDetPaqueteAccesorio)', 'max')
                                .where(`DetPaqueteAccesorio.idEncPaqueteAccesorio = ${detItem.idEncPaqueteAccesorio}`).getRawOne()).max;
                            maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                            detItem.idDetPaqueteAccesorio = maxId;
                        }
                        yield detalleRepository.save(detItem);
                    }
                    resolve(encSaved);
                }), reject);
            }));
        }));
    }
    deletePaqueteAccesorio(idEncPaqueteAccesorio) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const encabezadoRepository = connection.getRepository(catalogo_1.EncPaqueteAccesorio);
            encabezadoRepository.delete({ idEncPaqueteAccesorio }).then((deleteResult) => {
                resolve(deleteResult.affected);
            }, reject);
        }));
    }
    /*OCT99 20201002
    Metodos para integracion con SISCO
    */
    // consulta catalogo de SISCO para seleccionar
    getCatalogoAccesoriosSISCO(idSucursal, idUsuarioValido) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const repositoryAccesoriosNuevos = connection.getRepository(catalogo_1.AccesorioNuevoDireccion);
            yield repositoryAccesoriosNuevos.find({ where: { idSucursal, idUsuarioValido } })
                .then((resultadoAccesoriosNuevos) => {
                resolve(resultadoAccesoriosNuevos);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    // obtiene los accesorios SISCO que se enviaran para crear una solicitud en SISCO
    getAccesoriosSISCO(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_AccesoriosSISCO @idCotizacion = '${idCotizacion}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 3
    guardaSolicitudAccesorioNuevo(solicitudSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_GuardaSolicitudAccesorioNuevo @idCotizacion = '${solicitudSisco.idCotizacion}`
                    + `', @partidas = '${solicitudSisco.partidas}`
                    + `', @comentario = '${solicitudSisco.comentario}`
                    + `', @idUsuario = '${solicitudSisco.idUsuario}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 1
    guardaSolicitudAccesorio(solicitudSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionRGC = typeorm_1.getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            yield queryRunnerRGC.connect();
            try {
                const validacion = yield queryRunnerRGC.query(`exec sp_Flotillas_GuardaSolicitudAccesorio @idCotizacion = '${solicitudSisco.idCotizacion}`
                    + `', @partidas = '${solicitudSisco.partidas}`
                    + `', @idGrupoUnidad = '${solicitudSisco.idGrupoUnidad}`
                    + `', @idUsuario = '${solicitudSisco.idUsuario}'`);
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
    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 2
    guardaSolicitudAccesorioSISCO(solicitudSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_GuardaSolicitudAccesorioNuevoSISCO @idCotizacion = '${solicitudSisco.idCotizacion}`
                    + `', @partidas = '${solicitudSisco.partidas}`
                    + `', @comentario = '${solicitudSisco.comentario}`
                    + `', @idUsuario = '${solicitudSisco.idUsuario}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    // guarda respuesta de Solicitud SISCO
    guardaSISCOSolicitudFlotillas(solicitudSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_SISCOSolicitud @idCotizacion = '${solicitudSisco.idCotizacion}`
                    + `', @respuesta = '${solicitudSisco.respuesta}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    // CHK - 03 Feb 21k | guarda respuesta de insertar SOLICITUD en SISCO posteriores
    guardaSISCOSolicitudFlotillasPostAd(solicitudSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_SISCOSolicitud_PostAd @idCotizacion = '${solicitudSisco.idCotizacion}`
                    + `', @respuesta = '${solicitudSisco.respuesta}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    // elimina un accesorio tipo SISCO
    eliminaAccesorioSisco(accesorioSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            /*
            console.log('eliminaAccesorioSisco:');
            console.log(accesorioSisco);

            resolve([{Success: 1, Mensaje: 'OK'}]);
            */
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield manager.query(`exec sp_Flotillas_EliminaAccesorioSISCO @idCotizacion = '${accesorioSisco.idCotizacion}`
                    + `', @idAccesorioNuevo = '${accesorioSisco.idAccesorioNuevo}`
                    + `', @idGrupoUnidad = '${accesorioSisco.idGrupoUnidad}`
                    + `', @nombreAccesorio = '${accesorioSisco.nombreAccesorio}`
                    + `', @idParte = '${accesorioSisco.idParte}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // const paramsProcesar = {
                //     idSolicitud: params.find(x => x.key === 'idSolicitud').value,
                //     idTipoSolicitud: params.find(x => x.key === 'idTipoSolicitud').value,
                //     idClase: params.find(x => x.key === 'idClase').value,
                //     rfcEmpresa: params.find(x => x.key === 'rfcEmpresa').value,
                //     idCliente: params.find(x => x.key === 'idCliente').value,
                //     numeroContrato: params.find(x => x.key === 'numeroContrato').value,
                // };
                // this.siscoV3Service.postService('solicitud/PostCancelaSolicitud', paramsProcesar).toPromise().then(async (result: any) => {
                resolve(respuesta);
            }));
        }));
    }
    // sp para API que consumira SISCO para actualizar las solicitudes en flotillas
    actualizaSolicitudCotizacionAccesorio(cotizacionSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta; // = {Succes: 1, Mensaje: 'Cotizacion actualizada con numero de orden: ' + cotizacionSisco.numeroOrden};
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_ActualizaSolicitudCotizacionAccesorio @partidas = '${cotizacionSisco.partidas}`
                    + `', @numeroOrden = '${cotizacionSisco.numeroOrden}`
                    + `', @observaciones = '${cotizacionSisco.observaciones}`
                    + `', @estatus = '${cotizacionSisco.estatus}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                    resolve(resp);
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    // OCT99 20201209 obtiene datos
    getFlotillas_Datos_SISCO() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_Datos_SISCO`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                    resolve(resp);
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    /*
    OCT99: 20200128
        SISCO - POSTERIORES/ADICIONALES
    */
    // SISCO - POSTERIORES/ADICIONALES
    // obtiene los accesorios SISCO que se enviaran para crear una solicitud en SISCO
    getAccesoriosSISCOPostAd(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_AccesoriosSISCO_PostAd @idCotizacion = '${idCotizacion}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    // SISCO - POSTERIORES/ADICIONALES
    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 3
    guardaSolicitudAccesorioNuevoPostAd(solicitudSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_GuardaSolicitudAccesorioNuevo_PostAd @idCotizacion = '${solicitudSisco.idCotizacion}`
                    + `', @partidas = '${solicitudSisco.partidas}`
                    + `', @comentario = '${solicitudSisco.comentario}`
                    + `', @idUsuario = '${solicitudSisco.idUsuario}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    // SISCO - POSTERIORES/ADICIONALES
    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 1
    guardaSolicitudAccesorioPostAd(solicitudSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connectionRGC = typeorm_1.getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            yield queryRunnerRGC.connect();
            try {
                const validacion = yield queryRunnerRGC.query(`exec sp_Flotillas_GuardaSolicitudAccesorio_PostAd @idCotizacion = '${solicitudSisco.idCotizacion}`
                    + `', @partidas = '${solicitudSisco.partidas}`
                    + `', @idGrupoUnidad = '${solicitudSisco.idGrupoUnidad}`
                    + `', @idUsuario = '${solicitudSisco.idUsuario}'`);
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
    // SISCO - POSTERIORES/ADICIONALES
    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 2
    guardaSolicitudAccesorioSISCOPostAd(solicitudSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_GuardaSolicitudAccesorioNuevoSISCO_PostAd @idCotizacion = '${solicitudSisco.idCotizacion}`
                    + `', @partidas = '${solicitudSisco.partidas}`
                    + `', @comentario = '${solicitudSisco.comentario}`
                    + `', @idUsuario = '${solicitudSisco.idUsuario}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
    // SISCO - POSTERIORES/ADICIONALES
    // elimina un accesorio tipo SISCO
    eliminaAccesorioSiscoPostAd(accesorioSisco) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let respuesta;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                // for (const accesorio of accesorios) {
                yield manager.query(`exec sp_Flotillas_EliminaAccesorioSISCO_PostAd @idCotizacion = '${accesorioSisco.idCotizacion}`
                    + `', @idAccesorioNuevo = '${accesorioSisco.idAccesorioNuevo}`
                    + `', @idGrupoUnidad = '${accesorioSisco.idGrupoUnidad}`
                    + `', @nombreAccesorio = '${accesorioSisco.nombreAccesorio}`
                    + `', @idParte = '${accesorioSisco.idParte}'`)
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    respuesta = resp;
                })).catch(reject);
                // }
                resolve(respuesta);
            }));
        }));
    }
}
exports.AccesorioBusiness = AccesorioBusiness;
//# sourceMappingURL=accesorio.business.js.map