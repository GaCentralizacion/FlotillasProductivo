import * as nodemailer from 'nodemailer';
import { HTTPException } from 'ts-httpexceptions';
import { getConnection, UpdateResult } from 'typeorm';
import { Accesorio, FacturacionUnidad, InventarioUnidad, Traslado, UnidadInteres } from '../..//db/model/catalogo';
import {
    Cotizacion, CotizacionDetalleUnidad,
    CotizacionDetalleUnidadMov,
    CotizacionGrupoUnidad,
    CotizacionTraslado,
    CotizacionUnidadAccesorio,
    CotizacionUnidadAccesorioMov,
    CotizacionUnidadServicioUnidadMov,
    CotizacionUnidadTramiteMov,
    CotizacionUnidadTrasladoMov,
    Licitacion,
} from '../../db/model/cotizador';

import { rejects } from 'assert';
import { DocumentoBusiness } from '../repositorio';
import { AdicionalesBusiness } from './adicionales.business';

export class CotizadorBussiness {

    getAllCotizaciones() {
        return new Promise<Cotizacion[]>(async (resolve, reject) => {
            const connection = getConnection();
            connection.manager.find(Cotizacion, { order: { fechaModificacion: 'DESC' } }).then(async (cotizaciones: Cotizacion[]) => {
                resolve(cotizaciones);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getCotizacionesByIdLicitacion(idLicitacion: string) {
        return new Promise<Cotizacion[]>(async (resolve, reject) => {
            const connection = getConnection();
            connection.manager.find(Cotizacion, { idLicitacion }).then(async (cotizaciones: any) => {
                // tslint:disable-next-line: prefer-for-of
                for (let index = 0; index < cotizaciones.length; index++) {
                    await connection.query(`EXEC [dbo].[sp_flotillas_catalogos]
                        @idSucursal=${cotizaciones[index].idSucursal},
                        @idDireccionFlotillas=${cotizaciones[index].idDireccionFlotillas},
                        @idIva=${cotizaciones[index].idIva},
                        @idMonedaVenta=${cotizaciones[index].idMonedaVenta},
                        @idTipoVenta=${cotizaciones[index].idTipoVenta}`).then(
                        async (datos: any) => {
                            cotizaciones[index].nombreTipoVenta = datos[0].nombreTipoVenta;
                            cotizaciones[index].nombreMoneda = datos[0].nombreMoneda;
                            cotizaciones[index].nombreIva = datos[0].nombreIva;
                        }, (error) => { reject(error); },
                    );
                }

                resolve(cotizaciones);
            },
                (error) => {
                    reject(error);
                });
        });
    }

    getAllCotizacionesByIdFlotillas(idDireccionFlotillas: string) {
        return new Promise<Cotizacion[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_ListadoCotizaEstatus @idDireccionFlotilla = '${idDireccionFlotillas}'`)
                .then(async (listadoCotizaciones) => {
                    if (!listadoCotizaciones.length) {
                        reject({ status: 404, error: `No se ha obtenido el listado de cotizaciones` });
                    }

                    const ordenesDeCompra = listadoCotizaciones.filter((cotizacion) => cotizacion.status === 'ORDENES DE COMPRA PENDIENTES');

                    if (!ordenesDeCompra.length) {
                        // console.error(`No se ha obtenido el listado de cotizaciones con status ordenes de compra pendientes`);
                        // reject({status: 404, error: `No se ha obtenido el listado de cotizaciones con status ordenes de compra pendientes`});
                    } else {
                        for (const ordenCompra of ordenesDeCompra) {
                            await connection.query(`exec sp_Flotillas_OrdCompraCompletas @idCotizacion = '${ordenCompra.idCotizacion}'`)
                                .then(async (result: any) => {
                                    if (true) { // (result.length > 0 && result[0].Success && (result[0].Success === 1 || result[0].Success === '1'))
                                        await connection.query(`exec sp_flotillas_aestatus @idCotizacion = '${ordenCompra.idCotizacion}'`)
                                            .then(async (status: any) => {
                                                if (status.length > 0 && status[0].Success && (status[0].Success === 0 || status[0].Success === '0')) {
                                                    reject({ status: 400, error: `La cotizacion con id ${ordenCompra.idCotizacion} no se ha podido actualizar el status con el procedimientos aestatus` });
                                                }
                                            })
                                            .catch(reject);
                                    } else {
                                        reject({ status: 400, error: `La cotizacion con id ${ordenCompra.idCotizacion} no se ha encontrado dentro de BPRO con el procedimientos OrdCompraCompletas` });
                                    }
                                })
                                .catch(reject);
                        }
                    }

                    await connection.query(`exec sp_Flotillas_ListadoCotizaEstatus @idDireccionFlotilla = '${idDireccionFlotillas}'`)
                        .then((cotizaciones) => {
                            if (!listadoCotizaciones.length) {
                                reject({ status: 404, error: `No se ha obtenido el listado de cotizaciones 2` });
                            }
                            resolve(cotizaciones);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    // Envio de Correo LBM*
    getConsultaCorreosCompras(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {

            const connectionRGC = getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            await queryRunnerRGC.connect();
            try { // sp_Prueba
                const validacion = await queryRunnerRGC.query(`exec sp_Flotillas_ObtenCorreoCompras @idCotizacion = '${idCotizacion}'`);

                resolve(validacion);

            } catch (error) {
                console.log('getConsultaCorreosCompras ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerRGC.release();
            }
        });
    }

    getAllCotizacionesByIdFlotillasByUser(idDireccionFlotillas: string, idUsuario: number) {
        return new Promise<Cotizacion[]>(async (resolve, reject) => {
            const connection = getConnection();

            connection.manager.find(Cotizacion, { idDireccionFlotillas, idUsuario }).then(async (cotizaciones: Cotizacion[]) => {
                resolve(cotizaciones);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    async getStatusBproUnidad(idCotizacion: string, cotizacion: any, queryRunner) {
        return new Promise<Cotizacion>(async (resolve, reject) => {
            let count = 0;
            const status = await queryRunner.query(`exec sp_Flotillas_EstatusporUnidad @idCotizacion = '${idCotizacion}'`);

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
                    } else {
                        return detalleUnidad;
                    }
                });
            });

            resolve(cotizacion);
        });
    }
    // OC99
    getAdicionalesCierrebyIdCotizacionGrupoUnidad(idCotizacion: string, idGrupoUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {

            const start = Date.now();
            const adicionales = [];

            const connectionGU = getConnection();
            const queryRunnerGU = connectionGU.createQueryRunner();
            await queryRunnerGU.connect();

            try {
                // const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunnerGU);
                const accesorios = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneAccesorios @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const tramites = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneTramites @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const servicios = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneServicios @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);

                const accesoriosMov = await queryRunnerGU.query(`exec Sp_flotillas_obtieneAccesoriosMov @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const tramitesMov = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneTramitesMov @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const serviciosMov = await queryRunnerGU.query(`exec Sp_flotillas_obtieneServiciosMov @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);

                const accesoriosSinPaquete = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneAccesorioSinPaquete @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const tramitesSinPaquete = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneTramiteSinPaquete @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                const serviciosSinPaquete = await queryRunnerGU.query(`exec sp_Flotillas_ObtieneServicioUnidadSinPaquete @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);

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

            } catch (error) {
                console.log('getAdicionalesCierrebyIdCotizacionGrupoUnidad ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerGU.release();
            }
        });
    }

    // OC99 GESTION
    getValidaRegresaCotizacion(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {

            const adicionales = [];

            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const validacion = await queryRunnerVRC.query(`exec sp_Flotillas_ValidaRegresaCotizacion @idCotizacion = '${idCotizacion}'`);

                resolve(validacion);

            } catch (error) {
                console.log('getValidaRegresaCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OC99 GESTION
    getRegresaCotizacion(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {

            const connectionRGC = getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            await queryRunnerRGC.connect();
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
                const validacion = await queryRunnerRGC.query(`exec sp_Flotillas_RegresaCotizacion @idCotizacion = '${idCotizacion}'`);

                resolve(validacion);

            } catch (error) {
                console.log('getRegresaCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerRGC.release();
            }
        });
    }

    // OC99 GESTION
    getAdicionalesGestionbyIdDetalleUnidad(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {

            const start = Date.now();
            const adicionales = [];

            const connectionGUAG = getConnection();
            const queryRunnerGUAG = connectionGUAG.createQueryRunner();
            await queryRunnerGUAG.connect();

            try {
                // const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunnerGU);
                const accesorios = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneAccesoriosGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                const tramites = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneTramitesGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                const servicios = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneServiciosGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);

                const accesoriosMov = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneAccesoriosMovGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                const tramitesMov = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneTramitesMovGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
                const serviciosMov = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneServiciosMovGestion @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`);
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

            } catch (error) {
                console.log('getAdicionalesGestionbyIdDetalleUnidad ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerGUAG.release();
            }
        });
    }

    // OC99 GESTION
    getAdicionalesGestionbyGrupal(idCotizacion: string, idGrupoUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {

            const start = Date.now();
            const adicionales = [];

            const connectionGUAG = getConnection();
            const queryRunnerGUAG = connectionGUAG.createQueryRunner();
            await queryRunnerGUAG.connect();

            try {
                // const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunnerGU);
                const accesoriosProcesados = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneAccesoriosMovGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}',@lugar = 1`);
                const tramites = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneTramitesMovGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`);
                const servicios = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneServiciosMovGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`);
                const accesoriosMovs = await queryRunnerGUAG.query(`exec sp_Flotillas_ObtieneAccesoriosMovGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}',@lugar = 2`);

                adicionales.push(accesoriosProcesados); // 0
                adicionales.push(tramites); // 1
                adicionales.push(servicios); // 2
                adicionales.push(accesoriosMovs); // 3

                resolve(adicionales);

            } catch (error) {
                console.log('getAdicionalesGestionbyGrupal ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerGUAG.release();
            }
        });
    }

    // OC99 GESTION CANCELA COTIZACION
    getCancelaCotizacion(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {

            const connectionRGC = getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            await queryRunnerRGC.connect();

            try {
                const validacion = await queryRunnerRGC.query(`exec sp_Flotillas_CancelaPedidoCompleto @idCotizacion = '${idCotizacion}'`);

                resolve(validacion);

            } catch (error) {
                console.log('getCancelaCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerRGC.release();
            }
        });
    }

    // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR GRUPO
    getResumenPreCancelaGrupoUnidad(idCotizacion: string, idGrupoUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {

            const connectionRGC = getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            await queryRunnerRGC.connect();

            try {
                const validacion = await queryRunnerRGC.query(`exec sp_Flotillas_CuentaUnidadesFacturadas @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`);
                resolve(validacion);

            } catch (error) {
                console.log('getResumenPreCancelaGrupoUnidad ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerRGC.release();
            }
        });
    }

    // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR COTIZACION
    getResumenPreCancelaCotizacion(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {

            const connectionRGC = getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            await queryRunnerRGC.connect();

            try {
                const validacion = await queryRunnerRGC.query(`exec sp_Flotillas_CuentaFacturadasCotizacion @idCotizacion = '${idCotizacion}'`);
                resolve(validacion);

            } catch (error) {
                console.log('getResumenPreCancelaCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerRGC.release();
            }
        });
    }

    // SISCO
    // Servicio para validar si en la cotizacion existen accesorios pendientes - SISCO
    validaAccesoriosSisco(idCotizacion: string, origen: number) {
        return new Promise<any>(async (resolve, reject) => {

            const connectionRGC = getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            await queryRunnerRGC.connect();

            try {
                const validacion = await queryRunnerRGC.query(`exec sp_Flotillas_ValidaCompra @idCotizacion = '${idCotizacion}`
                    + `', @origen = ${origen}`); // 1:adicionales, 2: condiciones de venta
                resolve(validacion);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerRGC.release();
            }
        });
    }
    // SISCO

    // OC99 GESTION CANCELA GRUPO UNIDAD
    getCancelaGrupoUnidad(idCotizacion: string, idGrupoUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {

            const connectionRGC = getConnection();
            const queryRunnerRGC = connectionRGC.createQueryRunner();
            await queryRunnerRGC.connect();

            try {
                const validacion = await queryRunnerRGC.query(`exec sp_Flotillas_CancelaUnidadesGrupo @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`);
                resolve(validacion);

            } catch (error) {
                console.log('getCancelaGrupoUnidad ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerRGC.release();
            }
        });
    }

    // OC99
    getUnidadesInteresGrupoByIdCotizacion(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {
            const start = Date.now();
            const connectionGUx = getConnection();
            const queryRunnerGUx = connectionGUx.createQueryRunner();
            await queryRunnerGUx.connect();

            try {
                const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunnerGUx);
                const unidadesIntereses = await queryRunnerGUx.query(`exec sp_Flotillas_ObtieneGrupoUnidad @idCotizacion = '${idCotizacion}'`);
                resolve(unidadesIntereses);

            } catch (error) {
                console.log('getUnidadesInteresGrupoByIdCotizacion ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerGUx.release();
            }
        });
    }

    // OC99
    getDetalleUnidadGrupoByIdCotizacionGrupo(idCotizacion: string, idGrupoUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {

            const start = Date.now();
            const connectionGUDx = getConnection();
            const queryRunnerGUDx = connectionGUDx.createQueryRunner();
            await queryRunnerGUDx.connect();

            try {
                // const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunnerGUDx);
                const unidadesGrupo = await queryRunnerGUDx.query(`exec sp_Flotillas_ObtieneUnidades @idCotizacion = '${idCotizacion}', @idCotizacionGrupoUnidad = '${idGrupoUnidad}'`);
                resolve(unidadesGrupo);

            } catch (error) {
                console.log('getDetalleUnidadGrupoByIdCotizacionGrupo ERROR!!!');
                console.log(error);
                reject(error);
            } finally {
                await queryRunnerGUDx.release();
            }
        });
    }

    // OCT99
    async actualizaMontosCalculos(idCotizacion: string, queryRunner) {
        return new Promise<string>(async (resolve, reject) => {
            const count = 0;
            const respuesta = await queryRunner.query(`exec sp_Flotillas_ActualizaUtilidadBruta @idCotizacion = '${idCotizacion}'`);

            resolve(respuesta);
        });
    }

    getCotizacionById(idCotizacion: string) {
        const start = Date.now();
        console.log('getCotizacionById inicio:');
        return new Promise<Cotizacion>(async (resolve, reject) => {
            const ivaTotalCotizacion = 0;
            const costoTotalUnidad = 0;
            const precioTotalUnidad = 0;
            const utilidadBrutaCotizacion = 0;
            const costoTotalCotizacion = 0;
            const precioTotalCotizacion = 0;
            const tazaIva = 0;
            const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            const cotizacionRepository = await queryRunner.manager.getRepository(Cotizacion); // connection.getRepository(Cotizacion);
            const grupoRepository = await queryRunner.manager.getRepository(CotizacionGrupoUnidad);
            const detalleRepository = await queryRunner.manager.getRepository(CotizacionDetalleUnidad);
            const cotizacion = await cotizacionRepository.findOne({
                relations: [
                    'gruposUnidades',
                    'gruposUnidades.detalleUnidades',
                    /*
                    'gruposUnidades.unidadesInteres',
                    'gruposUnidades.paquetesAccesorios',
                    'gruposUnidades.paquetesAccesorios.accesorios',
                    'gruposUnidades.accesoriosSinPaquete',
                    'gruposUnidades.paquetesTramites',
                    'gruposUnidades.paquetesTramites.tramites',
                    'gruposUnidades.tramitesSinPaquete',
                    'gruposUnidades.paquetesServicioUnidad',
                    'gruposUnidades.paquetesServicioUnidad.serviciosUnidad',
                    'gruposUnidades.serviciosUnidadSinPaquete',
                    'gruposUnidades.traslados',
                    'gruposUnidades.detalleUnidades.accesorios',
                    'gruposUnidades.detalleUnidades.accesoriosMov',
                    'gruposUnidades.detalleUnidades.tramites',
                    'gruposUnidades.detalleUnidades.tramitesMov',
                    'gruposUnidades.detalleUnidades.serviciosUnidad',
                    'gruposUnidades.detalleUnidades.serviciosUnidadMov',
                    */
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
                const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunner);
                console.log('Respuesta Update montos:');
                console.log(respuestaUp);

                const end = Date.now();
                console.log('Total: ');
                console.log((end - start) / 1000);

                const statusDeDetalleUnidad = await this.getStatusBproUnidad(idCotizacion, cotizacion, queryRunner);
                resolve(statusDeDetalleUnidad);
            } catch (error) {
                // await queryRunner.rollbackTransaction();
                reject(error);
            } finally {
                await queryRunner.release();
            }
        });

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

    updateCotizacionStep(idCotizacion: string, newStep: number) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionRepository = await connection.getRepository(Cotizacion);
            await cotizacionRepository.update({ idCotizacion }, { step: newStep });
            resolve(1);
        });
    }

    updateCotizacionCfdiAdicionales(idCotizacion: string, idCfdiAdicionales: string) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            connection.transaction(async (manager) => {
                const cotizacionRepository = await manager.getRepository(Cotizacion);
                const cotizacionGrupoRepository = await manager.getRepository(CotizacionGrupoUnidad);
                const cotizacionDetalleRepository = await manager.getRepository(CotizacionDetalleUnidad);
                await cotizacionRepository.update({ idCotizacion }, { idCfdiAdicionales });
                await cotizacionGrupoRepository.update({ idCotizacion }, { idCfdiAdicionales });
                await cotizacionDetalleRepository.update({ idCotizacion }, { idCfdiAdicionales });
                resolve(1);
            });
        });
    }

    updateCotizacionTipoOrden(idCotizacion: string, tipoOrden: string) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            connection.transaction(async (manager) => {
                const cotizacionRepository = await manager.getRepository(Cotizacion);
                const cotizacionGrupoRepository = await manager.getRepository(CotizacionGrupoUnidad);
                const cotizacionDetalleRepository = await manager.getRepository(CotizacionDetalleUnidad);
                await cotizacionRepository.update({ idCotizacion }, { tipoOrden });
                await cotizacionGrupoRepository.update({ idCotizacion }, { tipoOrden });
                await cotizacionDetalleRepository.update({ idCotizacion }, { tipoOrden });
                if (tipoOrden == 'CU') {
                    await cotizacionRepository.update({ idCotizacion }, { idCfdiAdicionales: null, tipoCargoUnidad: 'Suma' });
                    await cotizacionGrupoRepository.update({ idCotizacion }, { idCfdiAdicionales: null });
                    await cotizacionDetalleRepository.update({ idCotizacion }, { idCfdiAdicionales: null });
                }
                resolve(1);
            });
        });
    }
    // OCT99 20200914
    updateCotizacionGruposTipoOrden(idCotizacion: string, tipoOrden: string, idCfdiAdicionales: string, tipoCargoUnidad: string, imprimeFactura: boolean) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            tipoOrden = (tipoOrden == '99') ? '' : tipoOrden;
            idCfdiAdicionales = (idCfdiAdicionales == '99') ? '' : idCfdiAdicionales;

            try {
                const validacion = await queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTipoOrdenEncabezado @idCotizacion = '${idCotizacion}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @idCfdiAdicionales = '${idCfdiAdicionales}`
                    + `', @tipoCargoUnidad = '${tipoCargoUnidad}`
                    + `', @imprimeFactura = ${imprimeFactura}`);

                resolve(validacion);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 20200914
    updateGruposTipoOrden(idCotizacion: string, idGrupoUnidad: number, tipoOrden: string, idCfdiAdicionales: string, tipoCargoUnidad: string, imprimeFactura: boolean) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            idCfdiAdicionales = (idCfdiAdicionales == '99') ? '' : idCfdiAdicionales;

            try {
                const validacion = await queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTipoOrdenGrupoUnidad @idCotizacion = '${idCotizacion}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @idCfdiAdicionales = '${idCfdiAdicionales}`
                    + `', @tipoCargoUnidad = '${tipoCargoUnidad}`
                    + `', @imprimeFactura = ${imprimeFactura}`
                    + `, @idGrupoUnidad = ${idGrupoUnidad}`);
                resolve(validacion);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    existeLicitacion(idLicitacion: string) {
        return new Promise<boolean>(async (resolve, reject) => {
            const connection = getConnection();
            connection.manager.findOne(Licitacion, { idLicitacion }).then(async (licitacionDB: Licitacion) => {
                if (licitacionDB == undefined) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    insertCotizacion(data: Cotizacion[], idTipoVenta: string, idContrato: string) {
        console.log('Marcial AC');
        return new Promise<Cotizacion[]>(async (resolve, reject) => {
            const respuestaCotizaciones = [];
            const connection = getConnection();
            const arreglo: Cotizacion[] = data;
            const idTipoVentaKey: string = idTipoVenta;
            const idContratoKey: string = idContrato;
            let toDelete: Cotizacion[] = [];
            const fidLicitacion = data[0].idLicitacion;
            let licitacionPorGuardar: Licitacion = null;
            if (fidLicitacion != undefined) {
                await connection.manager.find(Cotizacion, { idLicitacion: fidLicitacion }).then(async (cotizaciones: Cotizacion[]) => {
                    toDelete = cotizaciones;
                },
                    (error) => { },
                );
                licitacionPorGuardar = new Licitacion();
                licitacionPorGuardar.idLicitacion = fidLicitacion;
                licitacionPorGuardar.idUsuarioModificacion = data[0].idUsuarioModificacion;
                licitacionPorGuardar.fechaModificacion = new Date();
            }
            for (let i = 0; i <= arreglo.length; i++) {
                let correlativo = '';
                if (arreglo[i]) {
                    await connection.query(`SELECT dbo.fn_flotillas_consecutivo_cotizacion(${arreglo[i].idSucursal}) AS nuevoId `).then(
                        async (id) => {
                            let string = id[0].nuevoId;
                            string = string.split('-');
                            correlativo = string[string.length - 1];
                            arreglo[i].idCotizacion = `${string[0]}-${string[1]}-${string[2]}-${string[3]}-${Number(correlativo) + 1}`;
                            if (arreglo[i - 1] != undefined) {
                                if (arreglo[i].idCotizacion == arreglo[i - 1].idCondicion) {
                                    arreglo[i].idCotizacion = `${string[0]}-${string[1]}-${string[2]}-${string[3]}-${Number(correlativo) + 2}`;
                                }
                            }
                            await connection.transaction(async (manager) => {
                                if (licitacionPorGuardar != undefined) {
                                    const licitacionRepository = await manager.getRepository(Licitacion);
                                    await licitacionRepository.save(licitacionPorGuardar)
                                        .catch(reject);
                                    licitacionPorGuardar = null;
                                }
                                const cotizacionRepository = await manager.getRepository(Cotizacion);
                                arreglo[i].clienteOriginal = arreglo[i].nombreCliente;
                                await cotizacionRepository.save(arreglo[i]).then(
                                    async (res) => {
                                        await respuestaCotizaciones.push(res);
                                    },
                                );
                            });
                        }, (error) => { reject(error); },
                    );
                    const idCotizacionFix = arreglo[i].idCotizacion;
                    // console.log('>>> id cotizacion enviado :' + `'${idCotizacionFix}'`);
                    // 30 - 05 - 2020 chk se consume el sp para apartar el folio
                    // const idCotizacionBPRO =
                    await connection.query(`exec sp_Flotillas_insertaUniversal @idCotizacion = '${idCotizacionFix}'`)
                        .then((status: any) => {
                            // console.log('>>>respuesta ' + status[0].Success + ' id cotizacion ' + `'${idCotizacionFix}'`);
                            if (status.length > 0 && status[0].Success && (status[0].Success === 0 || status[0].Success === '0')) {
                                reject({ status: 400, error: `La cotizacion con id ${idCotizacionFix} no se pudo apartar en bpro` });
                            }
                        })
                        .catch(reject);
                    if ( idTipoVentaKey !== '-1') {
                        const idCotizacionKey = arreglo[0].idCotizacion;
                        await connection.query(`exec sp_Flotillas_cotizacionContratoActivos @idCotizacion = '${idCotizacionKey}',@idTipoVenta='${idTipoVentaKey}',@idContrato='${idContratoKey}'`)
                                .then((respuesta: any) => {
                                    console.log('respuesta=>', respuesta);
                                })
                                .catch(reject);
                        }
                }
            }
            if (toDelete.length > 0) {
                await connection.transaction(async (manager) => {
                    const cotizacionRepository = await manager.getRepository(Cotizacion);
                    await cotizacionRepository.remove(toDelete);
                });
            }
            resolve(respuestaCotizaciones);
        });
    }

    saveGrupoUnidad(grupoUnidad: CotizacionGrupoUnidad): Promise<CotizacionGrupoUnidad> {
        return new Promise<CotizacionGrupoUnidad>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction('SERIALIZABLE', async (manager) => {
                const gruposUnidadesRepository = await manager.getRepository(CotizacionGrupoUnidad);
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                console.log('save leyenda: ');
                console.log(grupoUnidad.leyendaFactura);

                if (grupoUnidad.idGrupoUnidad == undefined) {
                    let maxId = (await gruposUnidadesRepository.createQueryBuilder('cotizacionGrupoUnidad')
                        .where('cotizacionGrupoUnidad.idCotizacion = :idCotizacion', { idCotizacion: grupoUnidad.idCotizacion })
                        .select('MAX(cotizacionGrupoUnidad.idGrupoUnidad)', 'max')
                        .getRawOne() as { max: number }).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    grupoUnidad.idGrupoUnidad = maxId;
                }
                await gruposUnidadesRepository.save(grupoUnidad).then(async (grupoUnidadSaved: CotizacionGrupoUnidad) => {
                    await detalleUnidadesRepository.update(
                        {
                            idCotizacion: grupoUnidad.idCotizacion,
                            idGrupoUnidad: grupoUnidad.idGrupoUnidad,
                        },
                        {
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
                        },
                    );
                    resolve(grupoUnidad);
                }, reject);
            });
        });
    }

    validaVinAsignados(grupoVines: any[]): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let cadena = '';
            const connection = getConnection();
            const unidadInteresRepository = await connection.getRepository(UnidadInteres);
            for await (const grupoVin of grupoVines) {
                const existGrupoVin = await unidadInteresRepository.find({ vin: grupoVin.vin, idCotizacion: grupoVin.idCotizacion });
                if (existGrupoVin.length !== 0) {
                    if (existGrupoVin[0].idGrupoUnidad !== grupoVin.idGrupoUnidad) {
                        cadena += `\nNo se puede asignar vin ${grupoVin.vin}, ya se encuentra asignado a esta cotización\n`;
                    }
                }
            }

            if (cadena.length !== 0) {
                reject({ status: 422, error: cadena });
            }
            resolve(true);
        });
    }

    deleteGrupoUnidad(idCotizacion: string, idGrupoUnidad: number): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const grupoUnidadRepository = await connection.getRepository(CotizacionGrupoUnidad);
            const unidadInteres = await connection.getRepository(UnidadInteres);
            await grupoUnidadRepository.delete({ idCotizacion, idGrupoUnidad }).then(async (deleteResult) => {
                await unidadInteres.delete({ idCotizacion, idGrupoUnidad });
                resolve(deleteResult.affected);
            }, reject);
        });
    }

    saveGruposDetalleUnidades(gruposDetalleUnidad: Array<{ idCotizacion: string, idGrupoUnidad: number, cantidad: number }>, pantalla: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let returnValue = 0;
            const conjuntoDetalles: CotizacionDetalleUnidad[] = [];

            if (!gruposDetalleUnidad || gruposDetalleUnidad.length == 0) {
                const res = { Success: 0, Mensaje: 'No existen grupos de unidades para actualizar.' };
                resolve(res);
                return;
            }

            // OCT99 08092020 SP para guardar unidades y agregar adicionales si hay nuevas unidades
            const connection = getConnection();
            console.log(gruposDetalleUnidad);
            if (pantalla == 'COTIZACION') {
                console.log('contizacion: SQL');

                await connection.query(`exec sp_Flotillas_saveGruposDetalleUnidades @idCotizacion = '${gruposDetalleUnidad[0].idCotizacion}'`)
                    .then((doc) => {

                        // if (doc[0].Success != null && doc[0].Success === 1) {
                        //    resolve(doc);
                        // }

                        resolve(doc[0]);
                    })
                    .catch(reject);
            } else {
                console.log('gestion: ORM');
                // const connection = getConnection();
                const cotizacionRepository = await connection.getRepository(Cotizacion);
                const cotizacion = await cotizacionRepository.findOne({ idCotizacion: gruposDetalleUnidad[0].idCotizacion });

                for (const grupoDetalleUnidad of gruposDetalleUnidad) {
                    const cantidad = grupoDetalleUnidad.cantidad;
                    await connection.transaction('SERIALIZABLE', async (manager) => {
                        const gruposDetalleUnidadRepository = await manager.getRepository(CotizacionDetalleUnidad);
                        await gruposDetalleUnidadRepository.delete({ idCotizacion: grupoDetalleUnidad.idCotizacion, idGrupoUnidad: grupoDetalleUnidad.idGrupoUnidad });
                        for (let indice = 0; indice < cantidad; indice++) {
                            if (grupoDetalleUnidad.idCotizacion && grupoDetalleUnidad.idGrupoUnidad) {
                                const detalleCotizacion = new CotizacionDetalleUnidad();
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

                                    await gruposDetalleUnidadRepository.save(detalleCotizacion);

                                returnValue++;
                            }
                        }
                    });
                }
                const res2 = { Success: 1, Mensaje: 'Se actualizaron las unidades.' };
                resolve(res2);
            }
        });
    }

    updateCotizacionDetalleUnidad(detalleUnidad: CotizacionDetalleUnidad): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();

            console.log('update leyenda:');
            console.log(detalleUnidad.leyendaFactura);

            await connection.transaction('SERIALIZABLE', async (manager) => {
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                await detalleUnidadesRepository.update(
                    {
                        idCotizacion: detalleUnidad.idCotizacion,
                        idGrupoUnidad: detalleUnidad.idGrupoUnidad,
                        idDetalleUnidad: detalleUnidad.idDetalleUnidad,
                    },
                    {
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
                    },
                );
                resolve(1);
            });
        });
    }

    saveLeyendaDetalleUnidad(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, leyendaFactura: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction('SERIALIZABLE', async (manager) => {
                let updated = false;
                const cotizacionRepo = await manager.getRepository(Cotizacion);
                const cotizacionGrupoUnidadRepo = await manager.getRepository(CotizacionGrupoUnidad);
                const cotizacionDetalleUnidadRepo = await manager.getRepository(CotizacionDetalleUnidad);

                // const cotizacionFindOne = await cotizacionRepo.findOne({ idCotizacion });
                const cotizacionGrupoUnidadFindOne = await cotizacionGrupoUnidadRepo.findOne({ idGrupoUnidad });
                const cotizacionDetalleUnidadFindOne = await cotizacionDetalleUnidadRepo.findOne({ idDetalleUnidad });

                if (cotizacionGrupoUnidadFindOne) {
                    await cotizacionGrupoUnidadRepo.update({ idGrupoUnidad }, { leyendaFactura })
                        .catch(reject);
                    await cotizacionDetalleUnidadRepo.update({ idGrupoUnidad }, { leyendaFactura })
                        .catch(reject);
                    updated = true;
                }

                if (cotizacionDetalleUnidadFindOne) {
                    await cotizacionDetalleUnidadRepo.update({ idDetalleUnidad }, { leyendaFactura })
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
            });
        });
    }

    getLeyendaDetalleUnidad(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction('SERIALIZABLE', async (manager) => {
                const detalleUnidadesRepository = manager.getRepository(CotizacionDetalleUnidad);
                const existLeyendaFactura = await detalleUnidadesRepository.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                if (!existLeyendaFactura) {
                    reject({ status: 404, error: `No se encuentra la factura leyenda` });
                }
                resolve({ status: 200, message: existLeyendaFactura.leyendaFactura });
            });
        });
    }

    /*getGrupoUnidadByIdCotizacion(idCotizacion: string): Promise<CotizacionGrupoUnidad[]> {
        return new Promise<CotizacionGrupoUnidad[]>(async (resolve, reject) => {*/
    getGrupoUnidadByIdCotizacion(idCotizacion: string): Promise<Cotizacion> {

        return new Promise<Cotizacion>(async (resolve, reject) => {

            const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            const cotizacionRepository = await queryRunner.manager.getRepository(Cotizacion); // connection.getRepository(Cotizacion);
            const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunner);
            const cotizacion = await cotizacionRepository.findOne({
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

        });
    }
    // OCT99 ------- GESTION
    getCotizacionGestionByIdCotizacion(idCotizacion: string): Promise<Cotizacion> {

        return new Promise<Cotizacion>(async (resolve, reject) => {

            const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            const cotizacionRepository = await queryRunner.manager.getRepository(Cotizacion); // connection.getRepository(Cotizacion);
            const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunner);
            const cotizacion = await cotizacionRepository.findOne({
                relations: [
                    'gruposUnidades',
                    'gruposUnidades.detalleUnidades',
                    // 'gruposUnidades.paquetesAccesorios',
                    // 'gruposUnidades.accesoriosSinPaquete',
                    // 'gruposUnidades.paquetesAccesorios.accesorios',
                    // 'gruposUnidades.paquetesServicioUnidad',
                    // 'gruposUnidades.paquetesTramites',
                    // 'gruposUnidades.paquetesTramites.tramites',
                    // 'gruposUnidades.paquetesServicioUnidad.serviciosUnidad',
                    // 'gruposUnidades.serviciosUnidadSinPaquete',
                    // 'gruposUnidades.tramitesSinPaquete',
                    // 'gruposUnidades.detalleUnidades.accesorios',
                    // 'gruposUnidades.detalleUnidades.accesoriosMov',
                    // 'gruposUnidades.detalleUnidades.tramites',
                    // 'gruposUnidades.detalleUnidades.tramitesMov',
                    // 'gruposUnidades.detalleUnidades.serviciosUnidad',
                    // 'gruposUnidades.detalleUnidades.serviciosUnidadMov',
                ],
                where: { idCotizacion, 'gruposUnidades.traslados.activo': 1 },
            });
            resolve(cotizacion);

        });
    }

    getUnidadesInteresByIdCotizacion(idCotizacion: string): Promise<Cotizacion> {
        const start = Date.now();
        console.log('getUnidadesInteresByIdCotizacion: INI');

        return new Promise<Cotizacion>(async (resolve, reject) => {

            const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            const cotizacionRepository = await queryRunner.manager.getRepository(Cotizacion); // connection.getRepository(Cotizacion);
            const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunner);
            const cotizacion = await cotizacionRepository.findOne({
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

        });
    }

    getUnidadesCierreByIdCotizacion(idCotizacion: string): Promise<Cotizacion> {
        const start = Date.now();
        console.log('getUnidadesCierreByIdCotizacion: INI');

        return new Promise<Cotizacion>(async (resolve, reject) => {

            const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            const cotizacionRepository = await queryRunner.manager.getRepository(Cotizacion); // connection.getRepository(Cotizacion);

            const respuestaUp = await this.actualizaMontosCalculos(idCotizacion, queryRunner);

            const cotizacion = await cotizacionRepository.findOne({
                relations: [
                    'gruposUnidades',
                    // 'gruposUnidades.unidadesInteres',
                    'gruposUnidades.traslados',
                    // 'gruposUnidades.detalleUnidades',
                ],
                where: { idCotizacion, 'gruposUnidades.traslados.activo': 1 },
            });

            console.log('getUnidadesInteresByIdCotizacion: END');
            // console.log(cotizacion);
            const end = Date.now();
            console.log('Total UNIDADES INTERES: ');
            console.log((end - start) / 1000);
            resolve(cotizacion);

        });
    }

    saveCotizacionTraslado(idUbicacionOrigen: number, idUbicacionDestino: number, cotizacionTraslado: CotizacionTraslado): Promise<any> {
        return new Promise<number>(async (resolve, reject) => {
            if (!cotizacionTraslado) {
                reject(0);
            }
            const connection = getConnection();
            await connection.transaction('SERIALIZABLE', async (manager) => {
                const cotizacionRepository = manager.getRepository(Cotizacion);
                const cotizacionTrasladoRepository = manager.getRepository(CotizacionTraslado);
                const trasladoRepository = manager.getRepository(Traslado);
                const cotizacion = await cotizacionRepository.findOne({ idCotizacion: cotizacionTraslado.idCotizacion });

                if (!cotizacion) {
                    reject('No existe la cotización');
                }
                const traslado = new Traslado();
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
                    let maxId = (await trasladoRepository.createQueryBuilder().select('MAX(Traslado.idTraslado)', 'max').getRawOne() as { max: number }).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    traslado.idTraslado = maxId;
                }
                if (cotizacionTraslado.idCotizacionTraslado == undefined) {
                    let maxId = (await cotizacionTrasladoRepository.createQueryBuilder().select('MAX(CotizacionTraslado.idCotizacionTraslado)', 'max').getRawOne() as { max: number }).max;
                    maxId = (maxId == undefined ? 0 : Number(maxId)) + 1;
                    cotizacionTraslado.idCotizacionTraslado = maxId;
                }
                cotizacionTraslado.utilidadTotal = ((cotizacionTraslado.precioTotal - cotizacionTraslado.costoTotal) / ((cotizacionTraslado.precioTotal == 0) ? 1 : cotizacionTraslado.precioTotal)) * 100;
                await trasladoRepository.save(traslado).then(async (savedTraslado) => {
                    cotizacionTraslado.idTraslado = savedTraslado.idTraslado;
                    await cotizacionTrasladoRepository.save(cotizacionTraslado).then((rsTraslado: any) => {
                        resolve(rsTraslado);
                    }).catch((errTraslado) => {
                        reject(errTraslado);
                    });
                }, reject);
            });
        });
    }

    deleteCotizacionTraslado(idCotizacionTraslado: number): Promise<CotizacionTraslado> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionTrasladoRepository = await connection.getRepository(CotizacionTraslado);
            await cotizacionTrasladoRepository.delete({ idCotizacionTraslado }).then((deleteResult) => {
                resolve(1);
            }, reject);
        });
    }

    deleteCotizacionTrasladoMov(idCotizacionTraslado: number): Promise<CotizacionTraslado> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionTrasladoRepository = await connection.getRepository(CotizacionTraslado);
            await cotizacionTrasladoRepository.update({ idCotizacionTraslado }, { activo: false }).then((deleteResult) => {
                cotizacionTrasladoRepository.findOne({ idCotizacionTraslado }).then((found) => resolve(found));
            }, reject);
        });
    }

    asignarVinesApartados(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_AsignaVines @idCotizacion='${idCotizacion}'`)
                .then(
                    async (resultado: any) => {
                        // console.log(resultado, '¿RESULSET ASIGNA VINES APARTADOS?');
                        resolve({ status: 200, messaje: resultado });
                    },
                    async (error) => {
                        // console.log(error, '¿ERROR EN APARTA VINES?');
                        reject({ status: 400, error });
                    },
                );
        });
    }

    asignarVinesApartadosPosterior(idCotizacion: string): Promise<any> {
        // PROCESA VINES APATARTADOS POSTERIORES BOTON PROCESAR POSTERIORES (NARANJA)
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_AsignaVinesPosterior @idCotizacion='${idCotizacion}'`)
                .then(
                    async (resultado: any) => {
                        console.log(resultado, '¿RESULSET ASIGNA VINES APARTADOS?');
                        await connection.query(`exec sp_Flotillas_CambiaEstatusCotizacionUnidadPosterior @idCotizacion = '${idCotizacion}'`)
                            .then((status) => {
                                console.log(status, '¿STATUS SP CAMBIA ESTATUS COTIZACION UNIDAD POSTERIOR?');
                            })
                            .catch(reject);
                        resolve({ status: 200, messaje: resultado });
                    },
                    async (error) => {
                        console.log(error, '¿ERROR EN APARTA VINES?');
                        reject({ status: 400, error });
                    },
                );
        });
    }

    enviarControlDocumental(idCotizacion: string): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec INS_ControlDocumental_SP @idCotizacion='${idCotizacion}'`)
                .then(async (resultado: any[]) => {
                    resolve(1);
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }

    enviarProduccion(idCotizacion: string): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec INS_Produccion_SP @idCotizacion='${idCotizacion}'`)
                .then(async (resultado: any[]) => {
                    resolve(1);
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }

    cerrarCotizacion(idUsuarioModificacion: number, cierreCotizacion: { idCotizacion: string, numeroOrden: string, orden: string }): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            // Facturacion numero de orden
            const connection = getConnection();

            const cotizacionRepositoryOrden = await connection.getRepository(Cotizacion);

            if (cierreCotizacion.numeroOrden) {
                await cotizacionRepositoryOrden.update({ idCotizacion: cierreCotizacion.idCotizacion }
                    , { numeroOrden: cierreCotizacion.numeroOrden });
            }

            await connection.query(`exec sp_Flotillas_Insert_Cot @idCotizacion='${cierreCotizacion.idCotizacion}'`)
                .then(async (resultado: any[]) => {
                    if (resultado.length > 0) {
                        const cotizacionRepository = await connection.getRepository(Cotizacion);
                        if (cierreCotizacion.numeroOrden) {
                            await cotizacionRepository.update({ idCotizacion: cierreCotizacion.idCotizacion }
                                , { numeroOrden: cierreCotizacion.numeroOrden, status: 'APROBADA', fechaModificacion: new Date(), idUsuarioModificacion });
                        } else {
                            await cotizacionRepository.update({ idCotizacion: cierreCotizacion.idCotizacion }
                                , { status: 'APROBADA', fechaModificacion: new Date(), idUsuarioModificacion });
                        }
                        if (cierreCotizacion.numeroOrden && cierreCotizacion.orden) {
                            const documentBusiness = new DocumentoBusiness('cotizacion');
                            documentBusiness.set(cierreCotizacion.idCotizacion + `/orden_cliente_${cierreCotizacion.idCotizacion}.pdf`, cierreCotizacion.orden).then(async (documentoGuardado: boolean) => {
                                if (documentoGuardado) {
                                    resolve(Number(resultado[0].identityCotizacion));
                                } else {
                                    reject(null);
                                }
                            }, () => {
                                reject(null);
                            });
                        } else {
                            resolve(Number(resultado[0].identityCotizacion));
                        }
                    } else {
                        reject(null);
                    }
                },
                    async (error) => {
                        reject(error);
                    },
                );
        });
    }

    enviarCotizacionEmail(correo: { para: string[], asunto: string, cuerpo: string, adjuntos: Array<{ nombre: string, contenido: string }> }) {
        return new Promise<boolean>((resolve, reject) => {
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
            } as nodemailer.SendMailOptions);

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
            } as nodemailer.SendMailOptions;
            transport.sendMail(message, (error: Error, info: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    apartarUnidadesBpro(idCotizacion: string) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const unidadesInteresRepository = await connection.getRepository(UnidadInteres);
            const unidadesInteres = await unidadesInteresRepository.find({ select: ['vin', 'idSucursal'], where: idCotizacion });
            let unidadesApartadas = 0;
            for (const unidadInteres of unidadesInteres) {
                await connection.query(`exec sp_bpro_apartavin @Sucursal='${unidadInteres.idSucursal}', @VIN='${unidadInteres.vin}'`);
                unidadesApartadas++;
            }
            resolve(unidadesApartadas);
        });
    }

    apartarUnidadesGestion(unidades: Array<{ idSucursal: string, vin: string }>) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let unidadesApartadas = 0;
            for (const unidad of unidades) {
                await connection.query(`exec sp_bpro_apartavin @Sucursal='${unidad.idSucursal}', @VIN='${unidad.vin}'`);
                unidadesApartadas++;
            }
            resolve(unidadesApartadas);
        });
    }

    desapartarUnidadesBpro(idCotizacion: string) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const unidadesInteresRepository = await connection.getRepository(UnidadInteres);
            const unidadesInteres = await unidadesInteresRepository.find({ select: ['vin'], where: idCotizacion });
            let unidadesDesapartadas = 0;
            for (const unidadInteres of unidadesInteres) {
                await connection.query(`exec sp_bpro_despartavin @Sucursal='${unidadInteres.idSucursal}', @VIN='${unidadInteres.vin}'`);
                unidadesDesapartadas++;
            }
            resolve(unidadesDesapartadas);
        });
    }

    desapartarUnidadesGestion(unidades: Array<{ idSucursal: string, vin: string }>) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let unidadesApartadas = 0;
            for (const unidad of unidades) {
                await connection.query(`exec sp_bpro_despartavin @Sucursal='${unidad.idSucursal}', @VIN='${unidad.vin}'`);
                unidadesApartadas++;
            }
            resolve(unidadesApartadas);
        });
    }

    getFechaMinimaPromesaEntrega(idCotizacion: string, idGrupoUnidad: number) {
        return new Promise<Date>(async (resolve, reject) => {
            const connection = getConnection();
            const repositoryTraslado = connection.getRepository(CotizacionTraslado);
            let maxDate = (await repositoryTraslado.createQueryBuilder().select('MAX(CotizacionTraslado.fechaEntrega)', 'max')
                .where('CotizacionTraslado.idCotizacion = :idCotizacion', { idCotizacion })
                .andWhere('CotizacionTraslado.idGrupoUnidad = :idGrupoUnidad', { idGrupoUnidad })
                .getRawOne() as { max: Date }).max;
            const today = new Date();
            maxDate = (maxDate == undefined) ? new Date(today.getFullYear(), today.getMonth(), today.getDate()) : maxDate;
            resolve(maxDate);
        });
    }

    getFacturacionUnidades(idCotizacion: string) {
        return new Promise<FacturacionUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            const repositoryFacturacionUnidad = connection.getRepository(FacturacionUnidad);
            let facturacionesUnidad = await repositoryFacturacionUnidad.find({ where: { idCotizacion } });
            facturacionesUnidad = facturacionesUnidad.map((fu) => {
                fu.unidadFacturada = (fu.unidadFacturada as any) == '1' ? true : false;
                return fu;
            });
            resolve(facturacionesUnidad);
        });
    }

    saveCotizacionUnidadAccesorioMovs(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, accesoriosMov: CotizacionUnidadAccesorioMov[]) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let accesoriosGuardados = 0;
            if (accesoriosMov.length == 0) {
                resolve(accesoriosGuardados);
                return;
            }
            await connection.transaction(async (manager) => {
                const accesorioMovRepository = manager.getRepository(CotizacionUnidadAccesorioMov);
                const cotizacionDetalleUnidadRepo = manager.getRepository(CotizacionDetalleUnidad);
                // await accesorioMovRepository.delete({
                //     idCotizacion,
                //     idGrupoUnidad,
                //     idDetalleUnidad,
                // });
                for (const accesorioMov of accesoriosMov) {
                    accesorioMov.fechaModificacion = new Date();
                    accesorioMov.idAccesorioNuevo = (accesorioMov.idAccesorioNuevo == null) ? -1 : accesorioMov.idAccesorioNuevo;
                    if (accesorioMov.tipoMovimiento === 'B') {
                        await manager.query(`exec sp_Flotillas_ValidaOCAccesorio @idCotizacion = '${idCotizacion}', @idParte = '${accesorioMov.idParte}', @idAccesorioNuevo = '${accesorioMov.idAccesorioNuevo}', @cantidad = '${accesorioMov.cantidad}'`)
                            .then(async (resp) => {
                                // console.log(resp, '¿RESPUESTA SP VALIDA ACCESORIO EN MOVS?');
                                // console.log(resp[0].Success, resp[0].Success === 0, '||', resp[0].Success === '0', (resp[0].Success === 0 || resp[0].Success === '0'));
                                if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                                    await accesorioMovRepository.save(accesorioMov)
                                        .catch(reject);
                                    accesoriosGuardados++;
                                } else {
                                    const cotizacionDetalleUnidadFindOne = await cotizacionDetalleUnidadRepo.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                                    if (cotizacionDetalleUnidadFindOne && cotizacionDetalleUnidadFindOne.vin) {
                                        await accesorioMovRepository.save(accesorioMov)
                                            .catch(reject);
                                        accesoriosGuardados++;
                                    }
                                }
                            }).catch(reject);
                    } else {
                        await accesorioMovRepository.save(accesorioMov)
                            .catch(reject);
                        accesoriosGuardados++;
                    }
                }
                resolve(accesoriosGuardados);
            });

        });
    }

    // OCT99 BORRA ACCESORIO POR UNIDAD GESTION - POSTERIOR
    // 20201106
    deleteCotizacionUnidadAccesorioMovs(idCotizacion: string, idGrupoUnidad: number, idParte: string, idAccesorioNuevo: number, idDetalleUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const validacion = await queryRunnerVRC.query(`exec sp_Flotillas_BorraAccesorioPosterior @idCotizacion = '${idCotizacion}`
                    + `', @idParte   = '${idParte}`
                    + `', @idAccesorioNuevo  = '${idAccesorioNuevo}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idDetalleUnidad  = '${idDetalleUnidad}'`);
                resolve(validacion);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 BORRA TRAMITE POR UNIDAD GESTION - POSTERIOR
    // 20201106
    deleteCotizacionUnidadTramiteMovs(idCotizacion: string, idGrupoUnidad: number, idTramite: string, idSubTramite: string, idDetalleUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            console.log(idCotizacion);
            console.log(idGrupoUnidad);
            console.log(idTramite);
            console.log(idSubTramite);
            console.log(idDetalleUnidad);

            try {
                const validacion = await queryRunnerVRC.query(`exec sp_Flotillas_BorraTramitePosterior @idCotizacion = '${idCotizacion}`
                    + `', @idTramite    = '${idTramite}`
                    + `', @idSubTramite   = '${idSubTramite}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idDetalleUnidad  = '${idDetalleUnidad}'`);
                resolve(validacion);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 GESTION
    saveGestionUnidadAccesorioGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, accesoriosMov: CotizacionUnidadAccesorioMov[]) {

        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let accesoriosGuardados = 0;
            if (accesoriosMov.length == 0) {
                resolve(accesoriosGuardados);
                return;
            }
            await connection.transaction(async (manager) => {

                for (const accesorioMov of accesoriosMov) {

                    accesorioMov.fechaModificacion = new Date();
                    accesorioMov.idAccesorioNuevo = (accesorioMov.idAccesorioNuevo == null) ? -1 : accesorioMov.idAccesorioNuevo;

                    console.log('saveGestionUnidadAccesorioGrupal:');
                    console.log(accesorioMov);

                    await manager.query(`exec sp_Flotillas_GuardarAccesoriosMovGrupo @idCotizacion = '${idCotizacion}'`
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
                        .then(async (resp) => {
                            console.log(resp);
                            if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                                accesoriosGuardados++;
                            } else {
                                accesoriosGuardados++;
                            }
                        }).catch((err) => reject(err));
                }
                resolve(accesoriosGuardados);
            });
        });
    }

    // OCT 99 GESTION
    deleteGestionUnidadAccesorioGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, accesoriosMov: CotizacionUnidadAccesorioMov[]) {

        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let accesoriosEliminados = 0;
            if (accesoriosMov.length == 0) {
                resolve(accesoriosEliminados);
                return;
            }
            await connection.transaction(async (manager) => {

                for (const accesorioMov of accesoriosMov) {
                    accesorioMov.fechaModificacion = new Date();
                    accesorioMov.idAccesorioNuevo = (accesorioMov.idAccesorioNuevo == null) ? -1 : accesorioMov.idAccesorioNuevo;

                    await manager.query(`exec sp_Flotillas_EliminaMovimientoAccesorioGrupo @idCotizacion = '${idCotizacion}'`
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
                        .then(async (resp) => {
                            console.log(resp);
                            if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                                accesoriosEliminados++;
                            } else {
                                accesoriosEliminados++;
                            }
                        }).catch(reject);
                }
                resolve(accesoriosEliminados);
            });
        });
    }

    saveCotizacionUnidadTramiteMovs(tramitesMov: CotizacionUnidadTramiteMov[]) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let tramitesGuardados = 0;
            if (tramitesMov.length == 0) {
                resolve(tramitesGuardados);
                return;
            }
            await connection.transaction(async (manager) => {
                const tramiteMovRepository = manager.getRepository(CotizacionUnidadTramiteMov);

                for (const tramiteMov of tramitesMov) {
                    tramiteMov.fechaModificacion = new Date();
                    await tramiteMovRepository.save(tramiteMov);
                    tramitesGuardados++;
                }
                resolve(tramitesGuardados);
            });

        });
    }
    // OCT 99 GESTION
    saveCotizacionUnidadTramiteGrupal(tramitesMov: CotizacionUnidadTramiteMov[]) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let tramitesGuardados = 0;
            if (tramitesMov.length == 0) {
                resolve(tramitesGuardados);
                return;
            }
            await connection.transaction(async (manager) => {

                for (const tramite of tramitesMov) {
                    await manager.query(`exec sp_Flotillas_GuardarTramitesMovGrupo @idCotizacion = '${tramite.idCotizacion}`
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
                        .then(async (resp) => {
                            if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                                tramitesGuardados++;
                            } else {
                                tramitesGuardados++;
                            }
                        }).catch(reject);
                }
                resolve(tramitesGuardados);
            });
        });
    }

    // OCT 99 GESTION
    saveCambioDeProveedor(  tipo: string, idCotizacion: string, idTramite: string, idSubtramiteOld: string,
                            proveedorNew: number, importeNew: number, idSubtramiteNew: string) {

        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();
            try {
                const validacion = await queryRunnerVRC.query(`exec sp_Flotillas_insertaCambioProveedor @npv_tipo = '${tipo}`
                    + `', @idCotizacion    = '${idCotizacion}`
                    + `', @idTramite   = '${idTramite}`
                    + `', @npv_idsubtramOld  = '${idSubtramiteOld}`
                    + `', @npv_proveedorNew  = '${proveedorNew}`
                    + `', @npv_importeNew    = '${importeNew}`
                    + `', @npv_idsubtramNew  = '${idSubtramiteNew}'`);
                resolve(validacion);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT 99 GESTION
    deleteCotizacionUnidadTramiteGrupal(tramitesMov: CotizacionUnidadTramiteMov[]) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let tramitesEliminados = 0;
            if (tramitesMov.length == 0) {
                resolve(tramitesEliminados);
                return;
            }
            await connection.transaction(async (manager) => {

                for (const tramite of tramitesMov) {
                    await manager.query(`exec sp_Flotillas_EliminaMovimientoTramiteGrupo @idCotizacion = '${tramite.idCotizacion}`
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
                        .then(async (resp) => {
                            if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                                tramitesEliminados++;
                            } else {
                                tramitesEliminados++;
                            }
                        }).catch(reject);
                }
                resolve(tramitesEliminados);
            });
        });
    }

    saveCotizacionUnidadServicioMovs(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, serviciosMov: CotizacionUnidadServicioUnidadMov[]) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let serviciosGuardados = 0;
            if (serviciosMov.length == 0) {
                resolve(serviciosGuardados);
                return;
            }
            await connection.transaction(async (manager) => {
                const servicioMovRepository = manager.getRepository(CotizacionUnidadServicioUnidadMov);
                // await servicioMovRepository.delete({
                //     idCotizacion,
                //     idGrupoUnidad,
                //     idDetalleUnidad,
                // });
                for (const servicioMov of serviciosMov) {
                    servicioMov.fechaModificacion = new Date();
                    await servicioMovRepository.save(servicioMov);
                    serviciosGuardados++;
                }
                resolve(serviciosGuardados);
            });

        });
    }

    // OCT 99 GESTION
    saveCotizacionUnidadServicioGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, serviciosMov: CotizacionUnidadServicioUnidadMov[]) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let serviciosGuardados = 0;
            if (serviciosMov.length == 0) {
                resolve(serviciosGuardados);
                return;
            }
            await connection.transaction(async (manager) => {

                for (const servicio of serviciosMov) {
                    await manager.query(`exec sp_Flotillas_GuardarServicioMovGrupo @idCotizacion = '${idCotizacion}`
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
                        .then(async (resp) => {
                            if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                                serviciosGuardados++;
                            } else {
                                serviciosGuardados++;
                            }
                        }).catch(reject);
                }
                resolve(serviciosGuardados);
            });
        });
    }

    // OCT 99 GESTION
    deleteCotizacionUnidadServicioGrupal(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number, serviciosMov: CotizacionUnidadServicioUnidadMov[]) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            let serviciosEliminados = 0;
            if (serviciosMov.length == 0) {
                resolve(serviciosEliminados);
                return;
            }
            await connection.transaction(async (manager) => {

                for (const servicio of serviciosMov) {
                    await manager.query(`exec sp_Flotillas_EliminaMovimientoServicioGrupo @idCotizacion = '${idCotizacion}`
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
                        .then(async (resp) => {
                            if (resp[0].Success != null && (resp[0].Success === 0 || resp[0].Success === '0')) {
                                serviciosEliminados++;
                            } else {
                                serviciosEliminados++;
                            }
                        }).catch(reject);
                }
                resolve(serviciosEliminados);
            });
        });
    }

    saveCotizacionUnidadTrasladoMovs(trasladoMov: CotizacionUnidadTrasladoMov) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionUnidadTrasladoMovRepo = connection.getRepository(CotizacionUnidadTrasladoMov);
            cotizacionUnidadTrasladoMovRepo.save(trasladoMov)
                .then((rs) => resolve(rs))
                .catch((err) => reject(err));
        });
    }

    deleteUnidadApartadaCotizacion(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const cotizacionDetalleUnidadRespository = manager.getRepository(CotizacionDetalleUnidad);
                const existDetalleUnidad = cotizacionDetalleUnidadRespository.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });

                if (!existDetalleUnidad) {
                    resolve({ status: 200, message: `No se ha encontrado el detalle de la unidad` });
                }

                await cotizacionDetalleUnidadRespository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                resolve({ status: 200, message: `Se ha eliminado el detalle de la unidad con id detalle unidad ${idDetalleUnidad}` });
            })
                .catch(reject);
        });
    }
    /* chk 06 - jun - 2020 se creo esta funcion que se llama al final del deleteStatusProcesadoBpro por que no se
    ejecutaban los SP para elimnar las unidades.*/
    BorraFlotillas(existeVin: any, idCotizacion: string, sucursal, vin) {
        return new Promise<any>(async (resolve, rejec) => {
            const connection = getConnection();
            if (existeVin) {
                await connection.query(`exec sp_Flotillas_EliminaUnidadCompleta @idCotizacion='${idCotizacion}', @idSucursal='${sucursal}', @vin='${vin}'`)
                    .then((resp5) => {
                        console.log(resp5, 'respuesta sp sp_Flotillas_EliminaUnidadCompleta');
                        resolve();
                    })
                    .catch((Error) => {
                        rejec(Error);
                        console.log(Error, 'Error sp_Flotillas_EliminaUnidadCompleta');
                    });
            }

        });
    }

    deleteStatusProcesadoBpro(detallesUnidades: any[], idUsuario: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const cotizacionRepository = manager.getRepository(Cotizacion);
                const cotizacionDetalleUnidadRepository = manager.getRepository(CotizacionDetalleUnidad);
                const cotizacionDetalleUnidadMovRepository = manager.getRepository(CotizacionDetalleUnidadMov);
                const cotizacionUnidadTramiteMovRepository = manager.getRepository(CotizacionUnidadTramiteMov);
                const cotizacionUnidadServicioUnidadMovRepository = manager.getRepository(CotizacionUnidadServicioUnidadMov);
                const cotizacionUnidadAccesorioMovRepository = manager.getRepository(CotizacionUnidadAccesorioMov);

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

                    const existCotizacionDetalleUnidad = await cotizacionDetalleUnidadRepository.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                    if (!existCotizacionDetalleUnidad) {
                        reject({ status: 404, message: `No se ha encontrado el detalle de la unidad` });
                    }

                    existCotizacionDetalleUnidad.fechaModificacion = new Date();
                    existCotizacionDetalleUnidad.idUsuarioModificacion = idUsuario;
                    existCotizacionDetalleUnidad.procesadoBpro = procesadoBpro;
                    existCotizacionDetalleUnidad.tipoMovimiento = tipoMovimiento;

                    const cotizacion = await cotizacionRepository.findOne({ idCotizacion });

                    await cotizacionDetalleUnidadRepository.update({ idCotizacion, idGrupoUnidad, idDetalleUnidad }, existCotizacionDetalleUnidad)
                        .then((resp) => {
                            // console.log(resp, 'respuesta 1 .cotizacionDetalleUnidadRepository.update');
                            resolve();

                        })
                        .catch((Error) => {
                            // console.log(Error, 'Error 1');
                            reject(Error);
                        });
                    await cotizacionDetalleUnidadMovRepository.save(existCotizacionDetalleUnidad)
                        .then((resp1) => {
                            // console.log(resp1, 'respuesta 2. cotizacionDetalleUnidadMovRepository.save');
                            resolve();
                        })
                        .catch((Error) => {
                            // console.log(Error, 'Error 2');
                            reject(Error);
                        });

                    await cotizacionUnidadTramiteMovRepository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad })
                        .then((resp2) => {
                            // console.log(resp2, 'respuesta 3. cotizacionUnidadTramiteMovRepository.delete');
                            resolve();
                        })
                        .catch((Error) => {
                            // console.log(Error, 'Error 3');
                            reject(Error);
                        });

                    await cotizacionUnidadServicioUnidadMovRepository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad })
                        .then((resp3) => {
                            // console.log(resp3, 'respuesta 4. cotizacionUnidadServicioUnidadMovRepository.delete');
                            resolve();
                        })
                        .catch((Error) => {
                            // console.log(Error, 'Error 4');
                            reject(Error);
                        });

                    await cotizacionUnidadAccesorioMovRepository.delete({ idCotizacion, idGrupoUnidad, idDetalleUnidad })
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

                    } else {
                        /* chk 06 - jun - 2020 sellama la nueva fucnion para ejecutar el SP de borrado*/
                        this.BorraFlotillas(existCotizacionDetalleUnidad.vin, idCotizacion, cotizacion.idSucursal, existCotizacionDetalleUnidad.vin);
                    }
                    // if (['APROBADA', 'ORDENES DE COMPRA PENDIENTES', 'ORDENES DE COMPRA COMPLETADAS'].includes(cotizacion.status)) {

                    /* } else {
                        reject({ status: 400, error: `No se realizo la eliminación de las unidades, la cotización tiene estatus ${cotizacion.status}` });
                    } */
                }
                resolve({ status: 200, message: `Se ha actualizado el status procesadoBpro sactisfactoriamente` });
            })
                .catch(reject);
        });
    }

    asignarVinDetalleUnidad(detallesUnidades: any[], idUsuario: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const cotizacionRepository = manager.getRepository(Cotizacion);
                const cotizacionDetalleUnidad = manager.getRepository(CotizacionDetalleUnidad);

                if (!detallesUnidades.length) {
                    reject({ status: 422, error: `No se han seleccionado unidades` });
                }

                for await (const detalleUnidad of detallesUnidades) {
                    const idCotizacion = detalleUnidad.idCotizacion;
                    const idGrupoUnidad = detalleUnidad.idGrupoUnidad;
                    const idDetalleUnidad = detalleUnidad.idDetalleUnidad;
                    const vin = detalleUnidad.vin;

                    const existCotizacionDetalleUnidad = await cotizacionDetalleUnidad.findOne({ idCotizacion, idGrupoUnidad, idDetalleUnidad });
                    const existCotizacon = await cotizacionRepository.findOne({ idCotizacion });

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

                    await connection.query(`exec sp_Flotillas_MovimientosServicio @idCotizacion = '${idCotizacion}', @idusuario = '${idUsuario}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`)
                        .then(async (resp) => {
                            console.log(resp, '¿SP DE MOVIMIENTOS SERVICIO?');
                            if (resp[0].Success && (resp[0].Success === 1 || resp[0].Success === '1')) {
                                console.log('¿PROCESO 1?');
                                await connection.query(`exec sp_Flotillas_MovimientosTramite @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`)
                                    .then(async (res) => {
                                        console.log(resp, '¿SP DE MOVIMIENTOS TRAMITES?');
                                        if (res[0].Success && (res[0].Success === 1 || res[0].Success === '1')) {
                                            console.log('¿PROCESO 2?');
                                            const apartavin = await connection.query(`exec sp_bpro_apartavin @Sucursal='${existCotizacon.idSucursal}', @VIN='${vin}'`);
                                            console.log(apartavin, '¿SP DE BPRO APARTA VIN?');
                                            if ((apartavin[0].Respuesta && apartavin[0].Respuesta === 1 || apartavin[0].Respuesta === '1')) {
                                                console.log('¿PROCESO 3?');
                                                const insertaUnidadCompra = await connection.query(`exec sp_Flotillas_InsertaUnidadCompra @idCotizacion='${idCotizacion}', @vin='${vin}',
                                        @idUsuario='${idUsuario}', @idDetalleUnidad='${idDetalleUnidad}', @idGrupoUnidad='${idGrupoUnidad}'`);
                                                console.log(insertaUnidadCompra, '¿REGRESO DE SP INSERTA UNIDAD COMPRA?');
                                                // if (insertaUnidadCompra[0].Success && (insertaUnidadCompra[0].Success === 1 || insertaUnidadCompra[0].Success === '1')) {
                                                const condiciones = await connection.query(`exec sp_Flotillas_ActualizaCondiciones @idCotizacion = '${idCotizacion}'`);
                                                console.log(condiciones, '¿ACTUALIZA CONDICIONES ASIGNAR VIN DETALLE UNIDAD?');
                                                // }
                                            }
                                        }
                                    })
                                    .catch((err) => reject({ status: 500, error: err }));
                            } else {
                                reject({ status: 422, error: `No se puede realizar la asignación del vin` });
                            }
                        })
                        .catch((err) => reject({ status: 500, error: err }));

                    // .then(async (res) => {
                    //     console.log(res, 'sp_bpro_apartavin');
                    //     if ((res[0].Respuesta && res[0].Respuesta === 1 || res[0].Respuesta === '1')) {
                    //         existCotizacionDetalleUnidad.fechaModificacion = new Date();
                    //         existCotizacionDetalleUnidad.idUsuarioModificacion = idUsuario;
                    //         existCotizacionDetalleUnidad.vin = vin;
                    //         console.log({ idCotizacion, idGrupoUnidad, idDetalleUnidad }, '¿DATOS DE ACTULIZACION?');
                    //         await cotizacionDetalleUnidad.update({ idCotizacion, idGrupoUnidad, idDetalleUnidad }, existCotizacionDetalleUnidad)
                    //         .then(async (updated) => {
                    //             console.log(updated, '¿ACTUALIZA?');
                    //             await connection.query(`exec sp_Flotillas_InsertaUnidadCompra @idCotizacion='${idCotizacion}', @vin='${vin}', @idGrupoUnidad='${idGrupoUnidad}'`)
                    //             .then((resp) => {
                    //                   console.log(resp, '¿RESPUESRTA AL SEGUNDO SP?');
                    //                   resolve({ status: 200, success: `Se ha actualizado el VIN sactisfactoriamente` });
                    //              })
                    //              .catch(reject);
                    //         })
                    //         .catch(reject);
                    //         // console.log('termine!');

                    //     } else {
                    //         reject({ status: 400, error: `No se pudo realizar la actualización el VIN sactisfactoriamente` });
                    //     }
                    // })
                    // .catch((err) => reject({status: 500, error: err}));
                }
                resolve({ status: 200, success: `Se ha actualizado el VIN sactisfactoriamente` });
            })
                .catch((err) => reject({ status: 500, error: err }));
        });
    }
    getCotizacionTraslado(idProveedor: number, idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionTraslado = connection.getRepository(CotizacionTraslado);
            cotizacionTraslado.findOne({ idProveedor, idCotizacion })
                .then((rs) => resolve(rs))
                .catch((err) => reject(err));
        });
    }

    getVinAsignadoBpro(idCotizacion: string, idEmpresa: number, idSucursal: number) {
        return new Promise<InventarioUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();

            await connection.query(`exec sp_bpro_inventarionuevos @Empresa = '${idEmpresa}', @Sucursal = '${idSucursal}'`)
                .then((inventarioBpro: InventarioUnidad[]) => {
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
        });
    }

    conteoGlobalUnidadesInteres(idCotizacion: string, idGrupoUnidad: number): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const unidadInteresRepository = await connection.getRepository(UnidadInteres);
            const existUnidadInteres = await unidadInteresRepository.find({ where: { idCotizacion, idGrupoUnidad } });
            if (!existUnidadInteres.length) {
                resolve(0);
            }
            resolve(existUnidadInteres.length);
        });
    }

    clienteFacturacion(idCotizacion: string, idCliente: number, nombreCliente: string, idContacto: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const cotizacionRepo = await manager.getRepository(Cotizacion);
                const cotizacionFindO = await cotizacionRepo.findOne({ idCotizacion });

                if (cotizacionFindO) {
                    cotizacionFindO.idCliente = idCliente;
                    cotizacionFindO.idClienteContacto = idContacto;
                    cotizacionFindO.nombreCliente = nombreCliente;
                    await cotizacionRepo.update({ idCotizacion }, cotizacionFindO)
                        .catch(reject);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
    // Facturacion Adicionales
    adicionalesFacturacion(idCotizacion: string, idClienteFacturaAdicionales: number, numeroOCAdicionales: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const cotizacionRepo = await manager.getRepository(Cotizacion);
                const cotizacionFindO = await cotizacionRepo.findOne({ idCotizacion });

                if (cotizacionFindO) {
                    cotizacionFindO.idClienteFacturaAdicionales = idClienteFacturaAdicionales;
                    cotizacionFindO.numeroOCAdicionales = numeroOCAdicionales;
                    await cotizacionRepo.update({ idCotizacion }, cotizacionFindO)
                        .catch(reject);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    sumaTipoCargoUnidad(idCotizacion: string, tipoCargoUnidad: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const cotizacionRepository = await manager.getRepository(Cotizacion);
                const cotizacionGrupoRepository = await manager.getRepository(CotizacionGrupoUnidad);
                const cotizacionDetalleRepository = await manager.getRepository(CotizacionDetalleUnidad);
                await cotizacionRepository.update({ idCotizacion }, { tipoCargoUnidad })
                    .catch(reject);
                await cotizacionGrupoRepository.update({ idCotizacion }, { tipoCargoUnidad })
                    .catch(reject);
                await cotizacionDetalleRepository.update({ idCotizacion }, { tipoCargoUnidad })
                    .catch(reject);
                resolve(true);
            });
        });
    }

    creditoLimiteCliente(idCotizacion: string, idCliente: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_CreditoCliente @idCotizacion = '${idCotizacion}', @idCliente = '${idCliente}'`)
                .then((credito) => {
                    if (credito[0].Success != null && credito[0].Success === 1) {
                        resolve(true);
                    }
                    resolve(false);
                })
                .catch(reject);
        });
    }

    documentosVencidos(idCotizacion: string, idCliente: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_DocumentosVencidos @idCotizacion = '${idCotizacion}', @idCliente = '${idCliente}'`)
                .then((doc) => {
                    if (doc[0].Success != null && doc[0].Success === 0) {
                        resolve(false);
                    }
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    notificaionEnv(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const cotizacionRepo = await manager.getRepository(Cotizacion);
                const cotizacionFindO = await cotizacionRepo.findOne({ idCotizacion });

                if (cotizacionFindO) {
                    cotizacionFindO.notificacion = true;
                    await cotizacionRepo.update({ idCotizacion }, cotizacionFindO)
                        .catch(reject);
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });
    }

    actualizarBonificacion(idCotizacion, idGrupoUnidad, bonificacion, idBonificacion): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const cotizacionGrupoUnidadRepo = await manager.getRepository(CotizacionGrupoUnidad);
                const cotizacionGrupoUnidadFindOne = await cotizacionGrupoUnidadRepo.findOne({ idCotizacion, idGrupoUnidad });

                if (cotizacionGrupoUnidadFindOne) {
                    cotizacionGrupoUnidadFindOne.bonificacion = bonificacion;
                    cotizacionGrupoUnidadFindOne.idBonificacion = idBonificacion;
                    await cotizacionGrupoUnidadRepo.update({ idCotizacion, idGrupoUnidad }, cotizacionGrupoUnidadFindOne)
                        .catch(reject);
                    resolve(true);
                }
                resolve(false);
            })
                .catch(reject);
        });
    }

    actulizarImprimeFactura(idCotizacion, idGrupoUnidad, idDetalleUnidad, imprimeFactura): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                let updated = false;
                const cotizacionRepo = await manager.getRepository(Cotizacion);
                const cotizacionGrupoUnidadRepo = await manager.getRepository(CotizacionGrupoUnidad);
                const cotizacionDetalleUnidadRepo = await manager.getRepository(CotizacionDetalleUnidad);

                const cotizacionFindOne = await cotizacionRepo.findOne({ idCotizacion });
                const cotizacionGrupoUnidadFindOne = await cotizacionGrupoUnidadRepo.findOne({ idCotizacion, idGrupoUnidad });
                const cotizacionDetalleUnidadFindOne = await cotizacionDetalleUnidadRepo.findOne({ idCotizacion, idDetalleUnidad });
                const cotizacionDetalleUnidadGrupoUnidadFindOne = await cotizacionDetalleUnidadRepo.findOne({ idCotizacion, idGrupoUnidad });

                if (cotizacionFindOne) {
                    await cotizacionRepo.update({ idCotizacion }, { imprimeFactura })
                        .catch(reject);
                    await cotizacionGrupoUnidadRepo.update({ idCotizacion }, { imprimeFactura })
                        .catch(reject);
                    await cotizacionDetalleUnidadRepo.update({ idCotizacion }, { imprimeFactura })
                        .catch(reject);
                    updated = true;
                }

                if (cotizacionGrupoUnidadFindOne && cotizacionDetalleUnidadGrupoUnidadFindOne) {
                    await cotizacionGrupoUnidadRepo.update({ idCotizacion, idGrupoUnidad }, { imprimeFactura })
                        .catch(reject);
                    await cotizacionDetalleUnidadRepo.update({ idCotizacion, idGrupoUnidad }, { imprimeFactura })
                        .catch(reject);
                    updated = true;
                }

                if (cotizacionFindOne && cotizacionGrupoUnidadFindOne && cotizacionDetalleUnidadFindOne) {
                    await cotizacionDetalleUnidadRepo.update({ idCotizacion, idGrupoUnidad }, { imprimeFactura })
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
            });
        });
    }

    getCfdiListingByAgency(idEmpresa: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                await manager.query(`exec SEL_USO_CFDI_SP @idEmpresa = '${idEmpresa}'`)
                    .then((cfdis) => {
                        // console.log(cfdis, '¿LISTADO DE CFDIS?');
                        resolve(cfdis);
                    })
                    .catch((err) => {
                        // console.log(err, '¿ERROR DEL SERVICIO GET CDFI LISTING BY AGENCY 1?');
                        reject(err);
                    });
            })
                .catch((err) => {
                    // console.log(err, '¿ERROR DEL SERVICIO GET CDFI LISTING BY AGENCY 2?');
                    reject(err);
                });
        });
    }

    getDataContract(idCliente: number, idEmpresa: number, idSucursal: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                await manager.query(`exec sp_Flotillas_obtenerCatalogoContratos @idCliente='${idCliente}',@idEmpresa = '${idEmpresa}', @idSucursal = '${idSucursal}'`)
                    .then((contratos) => {
                        resolve(contratos);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    validaDisponibleCierre(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_validaDisponible @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                    if (doc[0].Success != null && doc[0].Success === 0) {
                        resolve(false);
                    }
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // Cambio P10 - EHJ-COAL
    validaDisponibilidadInventario(idCotizacion: string, idDireccionFlotillas: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_validaDisponibilidadInventario @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // Cambio P10 - EHJ-COAL
    validaDisponibilidadInventarioPost(idCotizacion: string, idDireccionFlotillas: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_validaDisponibilidadInventarioPost @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // Cambio P10 - EHJ-COAL
    validaDisponibilidadInventarioPostUpdate(idCotizacion: string, idDireccionFlotillas: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_validaDisponibilidadInventarioPostUpdate @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // Cambio P10 - EHJ-COAL
     validaDisponibilidadFolio(idCotizacion: string, idDireccionFlotillas: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_validaDisponibilidadFolio @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

     // Cambio P10 - EHJ-COAL
     confirmaCancelacionAccesorio(idCotizacion: string, idDireccionFlotillas: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_confirmaCancelacionAccesorio @idCotizacion = '${idCotizacion}' , @idDireccionFlotillas = '${idDireccionFlotillas}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // Cambio P07 - EHJ-COAL
    insertaBitacoraUtilidad(idCotizacion: string, idOpcion: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_inserta_utilidad @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // Cambio P07 - EHJ-COAL
    insertaBitacoraUtilidadPosteriores(idCotizacion: string, idOpcion: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_inserta_utilidad_posteriores @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // Cambio P07 - EHJ-COAL
    insertaBitacoraUtilidadAdicionales(idCotizacion: string, idOpcion: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_inserta_utilidad_adicionales @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }
    // Cambio Utilidad Total de la utilidad por vuelta - EHJ-COAL
    validaNotificacionUtilidad(idCotizacion: string, idOpcion: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_validaNotificacionUtilidad @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // obtiene utilidad  - EHJ-COAL
    obtenTotalUtilidad(idCotizacion: string, idOpcion: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_obtenTotalUtilidad @idCotizacion = '${idCotizacion}' , @idOpcion = '${idOpcion}' `)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

     // obtiene utilidad  - EHJ-COAL
     validaBotonUtilidad(idUsuario: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_flotillas_obtenUsuarioUtilidad @idUsuario = '${idUsuario}'`)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // obtiene utilidad  - EHJ-COAL
    obtenNotificacion(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_obtenNotificacion @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    // LBM-COAL
    validaPerfiles(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_flotillas_validaPerfiles @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }
    // LBM-COAL
    validaTipoOrden(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_ValidaTipoOrden @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }
    // LBM-COAL
    validaUnidadFacturada(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_ValidaUnidadFacturada @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }
    // LBM-COAL
    validaLimiteCredito(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_validaCredito @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    obtieneMargenUtilidadTraslado(direccionFlotilla: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_ObtieneMargenUtilidadTraslado @direccionFlotilla = '${direccionFlotilla}'`)
                .then((doc) => {
                    // console.log(doc);
                    resolve(doc[0].MargenUtilidad);
                })
                .catch(reject);
        });
    }

    deleteUnidadInteres(idCotizacion: string, vin: string) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            // const cotizaacionUnidadInteres = await connection.getRepository(UnidadInteres);
            const cotizacion = await connection.getRepository(Cotizacion);
            const vines = vin.split(',');
            console.log(JSON.stringify(vin));
            console.log('<<<<< vines depues del split', JSON.stringify(vines));
            vines.forEach(async (element) => {
                console.log('<<<<< vines malos ', element);
                // await cotizaacionUnidadInteres.delete({ idCotizacion, vin: element });
                const Del = await getConnection()
                    .createQueryBuilder()
                    .delete()
                    .from('UnidadInteres')
                    .where('idCotizacion = :idCotizacion AND vin = :element', { idCotizacion, element })
                    .execute();
                console.log(Del);
            });
            await cotizacion.update({ idCotizacion }, { notificacion: false })
                .then((deleteResult) => {
                    resolve(1);
                }, reject);
        });
    }

    NotificacionCotizacion1er(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {
            const notificacion = await getConnection();
            await notificacion.query(`SELECT notificacionCot1er FROM Cotizacion WHERE idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                    resolve(doc[0]);
                })
                .catch(reject);
        });
    }

    udpNotificacionCotizacion1er(idCotizacion: string, estatus: number) {
        return new Promise<any>(async (resolve, reject) => {
            const notificacion = await getConnection();
            const Update = await notificacion.query(`UPDATE Cotizacion SET notificacionCot1er='${estatus}' WHERE idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                    resolve(1);
                })
                .catch(reject);
        });
    }

    CancelaUnidadOrdenCompra(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = await getConnection();
            await connection.query(`EXEC sp_Flotillas_CancelaUnidadOrdenCompra @idCotizacion='${idCotizacion}', @idGrupoUnidad ='${idGrupoUnidad}', @idDetalleUnidad='${idDetalleUnidad}'`)
                .then(async (resp) => {
                    resolve(resp);
                    await connection.transaction(async (manager) => {
                        const cotizacionDetalleGrupoUnidadRepository = manager.getRepository(CotizacionDetalleUnidad);
                        // cuento cuantas unidades son diferentes de B
                        const UnidadesDelete = await cotizacionDetalleGrupoUnidadRepository.find({ idCotizacion, idGrupoUnidad, tipoMovimiento: '' });
                        // console.log('>>>> UnidadesDelete CotizacionDetalleGrupoUnidad | Cantidad  de NO B', UnidadesDelete.length);

                        // Actualizo el total de unidades en CotizacionGrupoUnidad
                        if (UnidadesDelete.length !== 0) {
                            await getConnection()
                                .createQueryBuilder()
                                .update(CotizacionGrupoUnidad)
                                .set({ cantidad: UnidadesDelete.length })
                                .where('idCotizacion = :idCotizacion AND idGrupoUnidad = :idGrupoUnidad', { idCotizacion, idGrupoUnidad })
                                .execute();
                        }

                    });
                })
                .catch(reject);
        });

    }

    getpendienteSisco(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = await getConnection();
            await connection.query(`EXEC sp_Flotillas_AccesoriosSISCO_PostAd @idCotizacion='${idCotizacion}'`)
                .then(async (resp) => {
                    resolve(resp);
                })
                .catch(reject);
        });
    }

    getestatusSisco(idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = await getConnection();
            await connection.query(`EXEC sp_Flotillas_ValidaPendientesSISCOPosteriores @idCotizacion='${idCotizacion}'`)
                .then(async (resp) => {
                    resolve(resp);
                })
                .catch(reject);
        });
    }

    cfdiCliente(idEmpresa: number, idSucursal: number, idCliente: number, idCotizacion: string) {
        return new Promise<any>(async (resolve, reject) => {
            const connection = await getConnection();
            await connection.query(`EXEC SEL_CFDICLIENTE_SP @idEmpresa='${idEmpresa}',@idSucursal ='${idSucursal}', @idCliente ='${idCliente}',@idCotizacion='${idCotizacion}'`)
                .then(async (resp) => {
                    resolve(resp);
                })
                .catch(reject);
        });
    }

}
