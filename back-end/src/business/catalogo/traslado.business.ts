import { getConnection } from 'typeorm';
import { Traslado } from '../../db/model/catalogo';
import { Cotizacion } from './../../db/model/cotizador';

export class TrasladoBusiness {
    getTraslado() {
        return new Promise<Traslado[]>(async (resolve, reject) => {
            const connection = getConnection();
            const trasladoRepository = connection.getRepository(Traslado);
            await trasladoRepository.find({
                relations: [
                    'ubicacionOrigen',
                    'ubicacionDestino',
                ],
                where: {activo: 1},
            })
            .then((traslado: Traslado[]) => {
                resolve(traslado);
            })
            .catch(reject);
        });
    }

    saveTraslados(data: Traslado[]) {
        return new Promise<Traslado>(async (resolve, reject) => {
            for (const ele of data) {
                const connection = getConnection();
                await connection.transaction('SERIALIZABLE', async (manager) => {
                    const trasladoRepository = await manager.getRepository(Traslado);
                    if (ele.idTraslado != undefined) {
                        await trasladoRepository.save(ele).then((res: Traslado) => {
                            resolve(res);
                        }, (err) => {
                            reject(err);
                        });
                    } else {
                        let maxId = (await trasladoRepository.createQueryBuilder().select('MAX(Traslado.idTraslado)', 'max').getRawOne() as { max: number }).max;
                        maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                        ele.idTraslado = maxId;
                        await trasladoRepository.save(ele).then(
                            (res) => {
                                resolve(res);
                            },
                            (err) => {
                                reject(err);
                            },
                        );
                    }
                });
            }
        });
    }

    removeTraslado(idTraslado: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const trasladoRepository = await manager.getRepository(Traslado);
                await trasladoRepository.delete({ idTraslado }).then(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    },
                );
            });
        });
    }

    // OCT 99 20201204 TRASLADOS POSTERIORES
    postGuardaTrasladoPosterior(traslado: any) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

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
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_GuardaTrasladoPosterior @idCotizacion = '${idCotizacion}'`);
                    /*+ `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idAccesorioNuevo  = '${idAccesorioNuevo}`
                    + `', @idParte   = '${idParte}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                    + `', @imprimeFactura  = '${imprimeFactura}`
                    + `', @idCfdi  = '${idCfdi}'`);*/
                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 20201204 LISTA VINES TRASLADOS
    getListaVinesTraslados(idCotizacion: string) {
        console.log(idCotizacion);
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ListaVinesTraslados @idCotizacion = '${idCotizacion}'`);

                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 20201214 lista unidades configuradas para armar traslados posteriores
    getListaUnidadesConfiguradas(idCotizacion: string) {
        console.log(idCotizacion);
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ListadoUnidadesConfiguradas @idCotizacion = '${idCotizacion}'`);

                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 20201215 lista traslados por cotizacion en posteriores
    getListadoTrasladosCotizacion(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_listadoTrasladosCotizacion @idCotizacion = '${idCotizacion}'`);

                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 20201214 Obtiene datos de traslado posterior
    getDatosTraslado(idCotizacion: string, idCotizacionTraslado: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_DatosTraslado @idCotizacion = '${idCotizacion}`
                + `', @idCotizacionTraslado  = '${idCotizacionTraslado}'`);

                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 20201214 LISTA UNIDADES VINES TRASLADOS
    getListaUnidadesTraslados(idCotizacion: string) {
        console.log(idCotizacion);
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ListaVinesTraslados @idCotizacion = '${idCotizacion}`);

                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 20201204 TRASLADOS POSTERIORES
    postInsertaTrasladosMovs(traslado: any) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();

            await connectionVRC.transaction('SERIALIZABLE', async (manager) => {
            const cotizacionRepository = manager.getRepository(Cotizacion);
            const cotizacion = await cotizacionRepository.findOne({ idCotizacion: traslado.idCotizacion });
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            const utilidadTotal = (((traslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)) - traslado.costoTotal) / ((traslado.precioTotal == 0) ? 1 : (traslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)))) * 100;

            try {

                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_InsertaTrasladoMov @idCotizacionTrasladoPadre = '${traslado.idCotizacionTrasladoPadre}`
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

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
        });
    }

    // OCT 99 20210106 Elimina traslados posteriores de MOV antes de haber enviado a BPRO
    eliminaTrasladoPosteriorMov(traslado: any) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();
            console.log('>>>>>traslado', traslado);

            const idCotizacionTraslado = traslado.idCotizacionTraslado;

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_EliminarTrasladoPosteriorMov @idCotizacionTraslado = '${idCotizacionTraslado}'`);

                resolve(respuesta);

            } catch (error) {
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // CHK - 07 ene 2021 Lista traslados mov
    getListarTrasladosPosteriores(idCotizacion: string) {
        console.log('getListarTrasladosPosteriores', idCotizacion);
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ListarTrasladosPosteriores @idCotizacion = '${idCotizacion}'`);

                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 20210302 obtiene listado del traslado en modal para consultar/editar traslados POSTAD
    getListadoTrasladoDetallePost(idCotizacion: string, idCotizacionTraslado: number) {
        console.log('getListadoTrasladoDetallePost', idCotizacion);
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            console.log('getListadoTrasladoDetallePost');
            console.log('idCotizacionTraslado ' + idCotizacionTraslado);
            console.log('idCotizacion ' + idCotizacion);
            console.log('sp_Flotillas_ListadoTrasladoDetallePost');

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ListadoTrasladoDetallePost @idCotizacion = '${idCotizacion}`
                + `', @idCotizacionTraslado  = '${idCotizacionTraslado}'`);

                console.log(respuesta);

                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 20210308 obtiene listado del traslado en modal para editar traslados POSTAD
    getObtenerDatosEdicionTrasladoPost(idCotizacion: string, idCotizacionTraslado: number) {
        console.log('getObtenerDatosEdicionTrasladoPost', idCotizacion);
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            console.log('getObtenerDatosEdicionTrasladoPost');
            console.log('idCotizacionTraslado ' + idCotizacionTraslado);
            console.log('idCotizacion ' + idCotizacion);
            console.log('sp_Flotillas_ObtenerDatosEdicionTrasladoPost');

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ObtenerDatosEdicionTrasladoPost @idCotizacion = '${idCotizacion}`
                + `', @idCotizacionTraslado  = '${idCotizacionTraslado}'`);

                console.log(respuesta);

                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 20210308 edicion de traslado posterior
    postEditaTrasladosMovs(traslado: any) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();

            await connectionVRC.transaction('SERIALIZABLE', async (manager) => {
            const cotizacionRepository = manager.getRepository(Cotizacion);
            const cotizacion = await cotizacionRepository.findOne({ idCotizacion: traslado.idCotizacion });
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            console.log('postEditaTrasladosMovs');
            console.log(traslado);

            const utilidadTotal = (((traslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)) - traslado.costoTotal) / ((traslado.precioTotal == 0) ? 1 : (traslado.precioTotal / ((cotizacion.tasaIva / 100) + 1)))) * 100;

            try {

                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTrasladoPosterior @idCotizacionTraslado = '${traslado.idCotizacionTraslado }`
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

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
        });
    }

}
