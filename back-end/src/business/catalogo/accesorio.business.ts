import { Exception } from 'ts-httpexceptions';
import { getConnection } from 'typeorm';
import { Accesorio, AccesorioNuevo, AccesorioNuevoDireccion, DetPaqueteAccesorio, EncPaqueteAccesorio } from '../../db/model/catalogo';

export enum TipoFiltro {
    Id = 1, Nombre = 2,
}

export class AccesorioBusiness {
    getAccesorios(idCotizacion: string, idMarca: string, idSucursal: number, idParte: string, Descripcion: string): Promise<Accesorio[]> {
        return new Promise<Accesorio[]>(async (resolve, reject) => {
            const connection = getConnection();
            let queryString = ``;

            if (idCotizacion.length > 0) {
                queryString = `exec sp_Flotillas_ConsultaAccesorios @idCotizacion='${idCotizacion}', @Marca='${idMarca}', @Sucursal=${idSucursal}, @idParte = '${idParte}', @Descripcion = '${Descripcion}', @Almacen = 'NEG'`;
            } else {
                queryString = `exec sp_Flotillas_ConsultaAccesorios @idCotizacion='', @Marca='${idMarca}', @Sucursal=${idSucursal}, @idParte = '${idParte}', @Descripcion = '${Descripcion}', @Almacen = 'NEG'`;
            }

            await connection.query(queryString)
                .then((resultadoAccesorios: any[]) => {
                    const accesorios: Accesorio[] = [];
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
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }

    getAccesoriosNuevos(idSucursal: number, idUsuarioValido: number): Promise<AccesorioNuevoDireccion[]> {
        return new Promise<AccesorioNuevoDireccion[]>(async (resolve, reject) => {
            const connection = getConnection();
            const repositoryAccesoriosNuevos = connection.getRepository(AccesorioNuevoDireccion);
            await repositoryAccesoriosNuevos.find({ where: { idSucursal, idUsuarioValido } })
                .then((resultadoAccesoriosNuevos: AccesorioNuevoDireccion[]) => {
                    resolve(resultadoAccesoriosNuevos);
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }

    saveAccesorioNuevo(accesorioNuevo: AccesorioNuevo): Promise<AccesorioNuevo> {
        return new Promise<AccesorioNuevo>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction('SERIALIZABLE', async (manager) => {
                const repositoryAccesoriosNuevos = manager.getRepository(AccesorioNuevo);
                if (accesorioNuevo.idAccesorioNuevo == undefined) {
                    let maxId = (await repositoryAccesoriosNuevos.createQueryBuilder().select('MAX(AccesorioNuevo.idAccesorioNuevo)', 'max').getRawOne() as { max: number }).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    accesorioNuevo.idAccesorioNuevo = maxId;
                }
                accesorioNuevo.fechaModificacion = new Date();
                await repositoryAccesoriosNuevos.save(accesorioNuevo).then((accesorioRetorno) => {
                    resolve(accesorioRetorno);
                }, reject);
            });
        });
    }

    deleteAccesorioNuevo(idAccesorioNuevo: number): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const accesorioNuevoRepository = connection.getRepository(AccesorioNuevo);
            accesorioNuevoRepository.delete({ idAccesorioNuevo }).then((deleteResult) => {
                resolve(deleteResult.affected);
            }, reject);
        });
    }
    getPaquetesAccesorio(idSucursal: number): Promise<EncPaqueteAccesorio[]> {
        return new Promise<EncPaqueteAccesorio[]>(async (resolve, reject) => {
            const connection = getConnection();
            const encabezadoRepository = connection.getRepository(EncPaqueteAccesorio);
            const encabezados = await encabezadoRepository
                .find({
                    where: { idSucursal },
                    relations: ['accesorios'],
                });
            resolve(encabezados);
        });
    }
    savePaqueteAccesorio(encPaqueteAccesorio: EncPaqueteAccesorio): Promise<EncPaqueteAccesorio> {
        return new Promise<EncPaqueteAccesorio>(async (resolve, reject) => {
            if (encPaqueteAccesorio.accesorios == undefined || encPaqueteAccesorio.accesorios.length == 0) {
                reject(new Exception(409, 'Debe especificar los items que componen el paquete en la propiedad \'accesorios\''));
                return;
            }
            const connection = getConnection();
            await connection.transaction('SERIALIZABLE', async (manager) => {
                const encabezadoRepository = await manager.getRepository(EncPaqueteAccesorio);
                const detalleRepository = await manager.getRepository(DetPaqueteAccesorio);
                if (encPaqueteAccesorio.idEncPaqueteAccesorio == undefined) {
                    const existeEncabezado = await encabezadoRepository
                        .findOne({
                            where: { nombre: encPaqueteAccesorio.nombre, descripcion: encPaqueteAccesorio.descripcion },
                        });
                    if (existeEncabezado != undefined) {
                        reject(new Exception(409, 'Ya existe un paquete con este nombre y descripción'));
                        return;
                    }
                }
                if (encPaqueteAccesorio.idEncPaqueteAccesorio != undefined) {
                    detalleRepository.delete({ idEncPaqueteAccesorio: encPaqueteAccesorio.idEncPaqueteAccesorio });
                } else {
                    let maxId = (await encabezadoRepository.createQueryBuilder().select('MAX(EncPaqueteAccesorio.idEncPaqueteAccesorio)', 'max').getRawOne() as { max: number }).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    encPaqueteAccesorio.idEncPaqueteAccesorio = maxId;
                }
                encPaqueteAccesorio.accesorios.map((detItem) => {
                    detItem.idEncPaqueteAccesorio = encPaqueteAccesorio.idEncPaqueteAccesorio;
                });
                encPaqueteAccesorio.fechaModificacion = new Date();
                await encabezadoRepository.save(encPaqueteAccesorio).then(async (encSaved: EncPaqueteAccesorio) => {
                    for (const detItem of encPaqueteAccesorio.accesorios) {
                        detItem.idUsuarioModificacion = encPaqueteAccesorio.idUsuarioModificacion;
                        detItem.fechaModificacion = new Date();
                        if (detItem.idDetPaqueteAccesorio == undefined) {
                            let maxId = (await detalleRepository.createQueryBuilder().select('MAX(DetPaqueteAccesorio.idDetPaqueteAccesorio)', 'max')
                                .where(`DetPaqueteAccesorio.idEncPaqueteAccesorio = ${detItem.idEncPaqueteAccesorio}`).getRawOne() as { max: number }).max;
                            maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                            detItem.idDetPaqueteAccesorio = maxId;
                        }
                        await detalleRepository.save(detItem);
                    }
                    resolve(encSaved);
                }, reject);

            });
        });
    }
    deletePaqueteAccesorio(idEncPaqueteAccesorio: number): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const encabezadoRepository = connection.getRepository(EncPaqueteAccesorio);
            encabezadoRepository.delete({ idEncPaqueteAccesorio }).then((deleteResult) => {
                resolve(deleteResult.affected);
            }, reject);
        });
    }

    /*OCT99 20201002
    Metodos para integracion con SISCO
    */
    // consulta catalogo de SISCO para seleccionar
    getCatalogoAccesoriosSISCO(idSucursal: number, idUsuarioValido: number): Promise<AccesorioNuevoDireccion[]> {
        return new Promise<AccesorioNuevoDireccion[]>(async (resolve, reject) => {
            const connection = getConnection();
            const repositoryAccesoriosNuevos = connection.getRepository(AccesorioNuevoDireccion);
            await repositoryAccesoriosNuevos.find({ where: { idSucursal, idUsuarioValido } })
                .then((resultadoAccesoriosNuevos: AccesorioNuevoDireccion[]) => {
                    resolve(resultadoAccesoriosNuevos);
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }

    // obtiene los accesorios SISCO que se enviaran para crear una solicitud en SISCO
    getAccesoriosSISCO(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_AccesoriosSISCO @idCotizacion = '${idCotizacion}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }

    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 3
    guardaSolicitudAccesorioNuevo(solicitudSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_GuardaSolicitudAccesorioNuevo @idCotizacion = '${solicitudSisco.idCotizacion}`
                        + `', @partidas = '${solicitudSisco.partidas}`
                        + `', @comentario = '${solicitudSisco.comentario}`
                        + `', @idUsuario = '${solicitudSisco.idUsuario}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }

    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 1
    guardaSolicitudAccesorio(solicitudSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {

            const connectionRGC = getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            await queryRunnerRGC.connect();

            try {
                const validacion = await queryRunnerRGC.query(`exec sp_Flotillas_GuardaSolicitudAccesorio @idCotizacion = '${solicitudSisco.idCotizacion}`
                + `', @partidas = '${solicitudSisco.partidas}`
                + `', @idGrupoUnidad = '${solicitudSisco.idGrupoUnidad}`
                + `', @idUsuario = '${solicitudSisco.idUsuario}'`);
                resolve(validacion);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerRGC.release();
            }
        });
    }

    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 2
    guardaSolicitudAccesorioSISCO(solicitudSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_GuardaSolicitudAccesorioNuevoSISCO @idCotizacion = '${solicitudSisco.idCotizacion}`
                        + `', @partidas = '${solicitudSisco.partidas}`
                        + `', @comentario = '${solicitudSisco.comentario}`
                        + `', @idUsuario = '${solicitudSisco.idUsuario}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }

    // guarda respuesta de Solicitud SISCO
    guardaSISCOSolicitudFlotillas(solicitudSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_SISCOSolicitud @idCotizacion = '${solicitudSisco.idCotizacion}`
                        + `', @respuesta = '${solicitudSisco.respuesta}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }

        // CHK - 03 Feb 21k | guarda respuesta de insertar SOLICITUD en SISCO posteriores
        guardaSISCOSolicitudFlotillasPostAd(solicitudSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_SISCOSolicitud_PostAd @idCotizacion = '${solicitudSisco.idCotizacion}`
                        + `', @respuesta = '${solicitudSisco.respuesta}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }

    // elimina un accesorio tipo SISCO
    eliminaAccesorioSisco(accesorioSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();

            /*
            console.log('eliminaAccesorioSisco:');
            console.log(accesorioSisco);

            resolve([{Success: 1, Mensaje: 'OK'}]);
            */

            let respuesta;
            await connection.transaction(async (manager) => {
                await manager.query(`exec sp_Flotillas_EliminaAccesorioSISCO @idCotizacion = '${accesorioSisco.idCotizacion}`
                    + `', @idAccesorioNuevo = '${accesorioSisco.idAccesorioNuevo}`
                    + `', @idGrupoUnidad = '${accesorioSisco.idGrupoUnidad}`
                    + `', @nombreAccesorio = '${accesorioSisco.nombreAccesorio}`
                    + `', @idParte = '${accesorioSisco.idParte}'`)
                    .then(async (resp) => {
                        respuesta = resp;
                    }).catch(reject);

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
            });
        });
    }

    // sp para API que consumira SISCO para actualizar las solicitudes en flotillas
    actualizaSolicitudCotizacionAccesorio(cotizacionSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();

            let respuesta; // = {Succes: 1, Mensaje: 'Cotizacion actualizada con numero de orden: ' + cotizacionSisco.numeroOrden};

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_ActualizaSolicitudCotizacionAccesorio @partidas = '${cotizacionSisco.partidas}`
                        + `', @numeroOrden = '${cotizacionSisco.numeroOrden}`
                        + `', @observaciones = '${cotizacionSisco.observaciones}`
                        + `', @estatus = '${cotizacionSisco.estatus}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                            resolve(resp);
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }

    // OCT99 20201209 obtiene datos
    getFlotillas_Datos_SISCO(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;
            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_Datos_SISCO`)
                        .then(async (resp) => {
                            respuesta = resp;
                            resolve(resp);
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }

    /*
    OCT99: 20200128
        SISCO - POSTERIORES/ADICIONALES
    */
    // SISCO - POSTERIORES/ADICIONALES
    // obtiene los accesorios SISCO que se enviaran para crear una solicitud en SISCO
    getAccesoriosSISCOPostAd(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_AccesoriosSISCO_PostAd @idCotizacion = '${idCotizacion}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }
    // SISCO - POSTERIORES/ADICIONALES
    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 3
    guardaSolicitudAccesorioNuevoPostAd(solicitudSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_GuardaSolicitudAccesorioNuevo_PostAd @idCotizacion = '${solicitudSisco.idCotizacion}`
                        + `', @partidas = '${solicitudSisco.partidas}`
                        + `', @comentario = '${solicitudSisco.comentario}`
                        + `', @idUsuario = '${solicitudSisco.idUsuario}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }
    // SISCO - POSTERIORES/ADICIONALES
    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 1
    guardaSolicitudAccesorioPostAd(solicitudSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {

            const connectionRGC = getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            await queryRunnerRGC.connect();

            try {
                const validacion = await queryRunnerRGC.query(`exec sp_Flotillas_GuardaSolicitudAccesorio_PostAd @idCotizacion = '${solicitudSisco.idCotizacion}`
                + `', @partidas = '${solicitudSisco.partidas}`
                + `', @idGrupoUnidad = '${solicitudSisco.idGrupoUnidad}`
                + `', @idUsuario = '${solicitudSisco.idUsuario}'`);
                resolve(validacion);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerRGC.release();
            }
        });
    }
    // SISCO - POSTERIORES/ADICIONALES
    // guarda un accesorio nuevo en SISCO para ser cotizado, escenario 2
    guardaSolicitudAccesorioSISCOPostAd(solicitudSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_GuardaSolicitudAccesorioNuevoSISCO_PostAd @idCotizacion = '${solicitudSisco.idCotizacion}`
                        + `', @partidas = '${solicitudSisco.partidas}`
                        + `', @comentario = '${solicitudSisco.comentario}`
                        + `', @idUsuario = '${solicitudSisco.idUsuario}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }
    // SISCO - POSTERIORES/ADICIONALES
    // elimina un accesorio tipo SISCO
    eliminaAccesorioSiscoPostAd(accesorioSisco: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let respuesta;

            await connection.transaction(async (manager) => {
                // for (const accesorio of accesorios) {
                    await manager.query(`exec sp_Flotillas_EliminaAccesorioSISCO_PostAd @idCotizacion = '${accesorioSisco.idCotizacion}`
                        + `', @idAccesorioNuevo = '${accesorioSisco.idAccesorioNuevo}`
                        + `', @idGrupoUnidad = '${accesorioSisco.idGrupoUnidad}`
                        + `', @nombreAccesorio = '${accesorioSisco.nombreAccesorio}`
                        + `', @idParte = '${accesorioSisco.idParte}'`)
                        .then(async (resp) => {
                            respuesta = resp;
                        }).catch(reject);
                // }
                    resolve(respuesta);
            });
        });
    }
}
