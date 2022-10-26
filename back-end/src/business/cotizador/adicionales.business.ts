import { getConnection, IsNull, Not } from 'typeorm';
import {
    DetPaqueteAccesorio,
    DetPaqueteServicioUnidad, DetPaqueteTramite, EncPaqueteAccesorio, EncPaqueteServicioUnidad, EncPaqueteTramite,
} from '../../db/model/catalogo';
import {
    CotizacionDetalleUnidad, CotizacionGrupoAccesorio, CotizacionGrupoAccesorioSinPaquete, CotizacionGrupoServicioUnidad,
    CotizacionGrupoServicioUnidadSinPaquete, CotizacionGrupoTramite, CotizacionGrupoTramiteSinPaquete, CotizacionUnidadAccesorio, CotizacionUnidadServicioUnidad, CotizacionUnidadTramite,
} from '../../db/model/cotizador';

export class AdicionalesBusiness {
    saveCotizacionGrupoAccesorio(idCotizacion: string, idGrupoUnidad: number, encPaquetesAccesorios: EncPaqueteAccesorio[]): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let totalRegistros = 0;
            let existPaqueteAccesorio = [];
            const connection = getConnection();

            await connection.transaction(async (manager) => {
                const cotizacionGruposAccesoriosRepository = await manager.getRepository(CotizacionGrupoAccesorio);
                const detallePaqueteAccesorioRepository = await manager.getRepository(DetPaqueteAccesorio);
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                const unidadAccesorioRepository = await manager.getRepository(CotizacionUnidadAccesorio);

                if (!encPaquetesAccesorios.length) {
                    resolve(0);
                    return;
                }

                for (const encabezadoPaqueteAccesorio of encPaquetesAccesorios) {
                    existPaqueteAccesorio = [];
                    const existCotizacionGrupoAccesorio = await cotizacionGruposAccesoriosRepository.findOne({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: encabezadoPaqueteAccesorio.idEncPaqueteAccesorio });
                    if (!existCotizacionGrupoAccesorio) {

                        const detallesPaqueteAccesorio = await detallePaqueteAccesorioRepository.findOne({ where: { idEncPaqueteAccesorio: encabezadoPaqueteAccesorio.idEncPaqueteAccesorio } });
                        if (detallesPaqueteAccesorio) {
                            const gruposAccesorios = new CotizacionGrupoAccesorio();
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

                            const existGrupoAccesorio = await cotizacionGruposAccesoriosRepository.findOne({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: gruposAccesorios.idEncPaqueteAccesorio });

                            if (!existGrupoAccesorio) {
                                await cotizacionGruposAccesoriosRepository.save(gruposAccesorios)
                                    .catch((error) => {
                                        reject(`El paquete de accesorios que intenta seleccionar ya contiene accesorios de un paquete previamente seleccionado`);
                                    });

                                totalRegistros++;
                                const unidades = await detalleUnidadesRepository.findOne({ select: ['idDetalleUnidad'], where: { idCotizacion, idGrupoUnidad } });

                                if (unidades) {
                                    const unidadAccesorio = new CotizacionUnidadAccesorio();
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

                                    await unidadAccesorioRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: unidadAccesorio.idEncPaqueteAccesorio });

                                    const existUnidadAccesorio = await unidadAccesorioRepository.findOne({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: unidadAccesorio.idEncPaqueteAccesorio });

                                    if (!existUnidadAccesorio) {
                                        await unidadAccesorioRepository.save(unidadAccesorio).catch(reject);
                                    }
                                }
                            } else {
                                await cotizacionGruposAccesoriosRepository.update({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio: gruposAccesorios.idEncPaqueteAccesorio }, gruposAccesorios).catch(reject);
                            }
                        }
                    }
                }
                resolve({ status: 200, message: `Se ha añadido un total de ${totalRegistros} paquetes accesorios` });
            });
        });
    }

    saveCotizacionGrupoAccesoriosSinPaquete(accesoriosSinPaquete: CotizacionGrupoAccesorioSinPaquete[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            console.log('saveCotizacionGrupoAccesoriosSinPaquete: ');
            console.log(accesoriosSinPaquete);

            if (!accesoriosSinPaquete || accesoriosSinPaquete.length === 0) {
                resolve(0);
                return;
            }
            let totalRegistros = 0;
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                const grupoAccesorioRepository = await manager.getRepository(CotizacionGrupoAccesorio);
                const unidadAccesorioRepository = await manager.getRepository(CotizacionUnidadAccesorio);
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
                    const grupoAccesorio = new CotizacionUnidadAccesorio();
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

                    await grupoAccesorioRepository.save(grupoAccesorio)
                        .catch((error) => {
                            reject(`El paquete de accesorios que intenta seleccionar ya contiene accesorios de un paquete previamente seleccionado`);
                        });
                    // .catch(reject);

                    const unidades = await detalleUnidadesRepository.find({
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
                        const unidadAccesorio = new CotizacionUnidadAccesorio();
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

                        await unidadAccesorioRepository.save(unidadAccesorio)
                        .catch((error) => {
                            console.log('error: ', error);
                            reject(0);
                        });
                        totalRegistros++;
                    }
                }
                resolve(totalRegistros);
            });
        });
    }

    saveCotizacionGrupoAccesoriosSinPaqueteTodos(accesoriosSinPaquete: CotizacionGrupoAccesorioSinPaquete[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            let totalRegistros = 0;
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                const grupoAccesorioRepository = await manager.getRepository(CotizacionGrupoAccesorio);
                const unidadAccesorioRepository = await manager.getRepository(CotizacionUnidadAccesorio);

                for (const accesorioSinPaquete of accesoriosSinPaquete) {
                    const grupoAccesorio = new CotizacionUnidadAccesorio();
                    const unidades = await detalleUnidadesRepository.find({
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

                        const getAccesorio = await grupoAccesorioRepository.findOne({
                            idCotizacion: grupoAccesorio.idCotizacion,
                            idGrupoUnidad: grupoAccesorio.idGrupoUnidad,
                        });

                        await grupoAccesorioRepository.save(grupoAccesorio)
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

                        const unidadAccesorio = new CotizacionUnidadAccesorio();
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

                        const getUnidadAccesorio = await unidadAccesorioRepository.findOne({
                            idCotizacion: unidadAccesorio.idCotizacion,
                            idGrupoUnidad: unidadAccesorio.idGrupoUnidad,
                            idDetalleUnidad: unidadAccesorio.idDetalleUnidad,
                        });

                        await unidadAccesorioRepository.save(unidadAccesorio)
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
            });
        });
    }

    deleteCotizacionGrupoPaqueteAccesorio(idCotizacion: string, idGrupoUnidad: number, idEncPaqueteAccesorio: number): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionGrupoAccesorioRepository = await connection.getRepository(CotizacionGrupoAccesorio);
            const cotizacionUnidadAccesorioRepository = await connection.getRepository(CotizacionUnidadAccesorio);

            await cotizacionGrupoAccesorioRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio });
            await cotizacionUnidadAccesorioRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio });
            resolve(1);
        });
    }

    deleteCotizacionGrupoAccesorioSinPaquete(accesorioSinPaquete: CotizacionGrupoAccesorioSinPaquete): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionUnidadAccesorioRepository = await connection.getRepository(CotizacionUnidadAccesorio);
            const cotizacionGrupoAccesorioRepository = await connection.getRepository(CotizacionGrupoAccesorio);

            await cotizacionGrupoAccesorioRepository.delete({
                idCotizacion: accesorioSinPaquete.idCotizacion,
                idGrupoUnidad: accesorioSinPaquete.idGrupoUnidad,
                idAccesorioNuevo: accesorioSinPaquete.idAccesorioNuevo,
                idParte: accesorioSinPaquete.idParte,
            });

            await cotizacionUnidadAccesorioRepository.delete({
                idCotizacion: accesorioSinPaquete.idCotizacion,
                idGrupoUnidad: accesorioSinPaquete.idGrupoUnidad,
                idAccesorioNuevo: accesorioSinPaquete.idAccesorioNuevo,
                idParte: accesorioSinPaquete.idParte,
            });
            resolve(1);
        });
    }

    saveCotizacionGrupoTramite(idCotizacion: string, idGrupoUnidad: number, encPaquetesTramites: EncPaqueteTramite[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            let totalRegistros = 0;
            const connection = getConnection();

            await connection.transaction(async (manager) => {
                const cotizacionGrupoTramiteRepository = await manager.getRepository(CotizacionGrupoTramite);
                const detallePaqueteTramiteRepository = await manager.getRepository(DetPaqueteTramite);
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                const unidadTramiteRepository = await manager.getRepository(CotizacionUnidadTramite);
                await cotizacionGrupoTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite: Not(IsNull()) });
                await unidadTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite: Not(IsNull()) });

                if (!encPaquetesTramites || encPaquetesTramites.length === 0) {
                    resolve(0);
                    return;
                }

                for (const encPaqueteTramite of encPaquetesTramites) {

                    const detallesPaqueteTramite = await detallePaqueteTramiteRepository.find({
                        where: {
                            idEncPaqueteTramite: encPaqueteTramite.idEncPaqueteTramite,
                        },
                    });
                    for (const detPaqueteTramite of detallesPaqueteTramite) {
                        const grupoTramite = new CotizacionGrupoTramite();
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
                        await cotizacionGrupoTramiteRepository.save(grupoTramite);
                        totalRegistros++;
                        const unidades = await detalleUnidadesRepository.find({
                            select: ['idDetalleUnidad'],
                            where: {
                                idCotizacion,
                                idGrupoUnidad,
                            },
                        });
                        for (const unidad of unidades) {
                            const unidadTramite = new CotizacionUnidadTramite();
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
                            await unidadTramiteRepository.save(unidadTramite);
                        }
                    }

                }
                resolve(totalRegistros);
            });
        });
    }

    saveCotizacionGrupoTramiteTodos(idCotizacion: string, idGrupoUnidad: number, encPaquetesTramites: EncPaqueteTramite[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            let index = 0;
            let totalRegistros = 0;
            const connection = getConnection();

            await connection.transaction(async (manager) => {
                const cotizacionGrupoTramiteRepository = await manager.getRepository(CotizacionGrupoTramite);
                const detallePaqueteTramiteRepository = await manager.getRepository(DetPaqueteTramite);
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                const unidadTramiteRepository = await manager.getRepository(CotizacionUnidadTramite);
                await cotizacionGrupoTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite: Not(IsNull()) });
                await unidadTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite: Not(IsNull()) });

                if (!encPaquetesTramites.length) {
                    reject({ status: 400, error: `Se require el encabezado de paquetes` });
                }

                const unidades = await detalleUnidadesRepository.find({
                    where: {
                        idCotizacion,
                    },
                });

                if (!unidades.length) {
                    reject({ status: 404, error: `No se encontraron las unidades` });
                }

                for await (const encPaqueteTramite of encPaquetesTramites) {
                    index++;
                    const grupoTramite = new CotizacionGrupoTramite();
                    const unidadTramite = new CotizacionUnidadTramite();

                    const detallesPaqueteTramite = await detallePaqueteTramiteRepository.find({
                        where: {
                            idEncPaqueteTramite: encPaqueteTramite.idEncPaqueteTramite,
                        },
                    });

                    for await (const unidad of unidades) {
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
                        await cotizacionGrupoTramiteRepository.save(grupoTramite)
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
                        await unidadTramiteRepository.save(unidadTramite)
                            .catch(reject);
                        totalRegistros++;
                    }
                }
                resolve(totalRegistros);
            });
        });
    }

    saveCotizacionGrupoTramitesSinPaquete(tramitesSinPaquete: CotizacionGrupoTramiteSinPaquete[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            if (!tramitesSinPaquete || tramitesSinPaquete.length === 0) {
                resolve(0);
                return;
            }
            let totalRegistros = 0;
            const connection = getConnection();

            await connection.transaction(async (manager) => {
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                const grupoTramiteRepository = await manager.getRepository(CotizacionGrupoTramite);
                const unidadTramiteRepository = await manager.getRepository(CotizacionUnidadTramite);

                for (const tramiteSinPaquete of tramitesSinPaquete) {
                    const grupoTramite = new CotizacionGrupoTramite();
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
                    await grupoTramiteRepository.save(grupoTramite);
                    const unidades = await detalleUnidadesRepository.find({
                        select: ['idDetalleUnidad'],
                        where: {
                            idCotizacion: tramitesSinPaquete[0].idCotizacion,
                            idGrupoUnidad: tramitesSinPaquete[0].idGrupoUnidad,
                        },
                    });
                    for (const unidad of unidades) {
                        const unidadTramite = new CotizacionUnidadTramite();
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
                        await unidadTramiteRepository.save(unidadTramite);
                        totalRegistros++;
                    }
                }
                resolve(totalRegistros);
            });
        });
    }

    deleteCotizacionGrupoPaqueteTramite(idCotizacion: string, idGrupoUnidad: number, idEncPaqueteTramite: number): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionGrupoTramiteRepository = await connection.getRepository(CotizacionGrupoTramite);
            const cotizacionUnidadTramiteRepository = await connection.getRepository(CotizacionUnidadTramite);

            await cotizacionGrupoTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite });
            await cotizacionUnidadTramiteRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteTramite });
            resolve(1);
        });
    }

    deleteCotizacionGrupoTramiteSinPaquete(tramiteSinPaquete: CotizacionGrupoTramiteSinPaquete): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionUnidadTramiteRepository = await connection.getRepository(CotizacionUnidadTramite);
            const cotizacionGrupoTramiteRepository = await connection.getRepository(CotizacionGrupoTramite);

            await cotizacionUnidadTramiteRepository.delete({
                idCotizacion: tramiteSinPaquete.idCotizacion,
                idGrupoUnidad: tramiteSinPaquete.idGrupoUnidad,
                idTramite: tramiteSinPaquete.idTramite,
            })
                .catch(reject);

            await cotizacionGrupoTramiteRepository.delete({
                idCotizacion: tramiteSinPaquete.idCotizacion,
                idGrupoUnidad: tramiteSinPaquete.idGrupoUnidad,
                idTramite: tramiteSinPaquete.idTramite,
            })
                .catch(reject);
            resolve(1);
        });
    }

    saveCotizacionGrupoServicioUnidad(idCotizacion: string, idGrupoUnidad: number, encPaquetesServicioUnidad: EncPaqueteServicioUnidad[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            let totalRegistros = 0;
            const connection = getConnection();

            await connection.transaction(async (manager) => {
                const cotizacionGrupoServicioUnidadRepository = await manager.getRepository(CotizacionGrupoServicioUnidad);
                const detallePaqueteServicioUnidadRepository = await manager.getRepository(DetPaqueteServicioUnidad);
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                const unidadServicioUnidadRepository = await manager.getRepository(CotizacionUnidadServicioUnidad);
                await cotizacionGrupoServicioUnidadRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad: Not(IsNull()) });
                await unidadServicioUnidadRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad: Not(IsNull()) });
                if (!encPaquetesServicioUnidad || encPaquetesServicioUnidad.length === 0) {
                    resolve(0);
                }

                for (const encPaqueteServicioUnidad of encPaquetesServicioUnidad) {

                    const detallesPaqueteServicioUnidad = await detallePaqueteServicioUnidadRepository.find({
                        where: {
                            idEncPaqueteServicioUnidad: encPaqueteServicioUnidad.idEncPaqueteServicioUnidad,
                        },
                    });

                    for (const detPaqueteServicioUnidad of detallesPaqueteServicioUnidad) {
                        const grupoServicioUnidad = new CotizacionGrupoServicioUnidad();
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
                        await cotizacionGrupoServicioUnidadRepository.save(grupoServicioUnidad)
                            .catch(reject);
                        totalRegistros++;
                        const unidades = await detalleUnidadesRepository.find({
                            select: ['idDetalleUnidad'],
                            where: {
                                idCotizacion,
                                idGrupoUnidad,
                            },
                        });
                        for (const unidad of unidades) {
                            const unidadServicioUnidad = new CotizacionUnidadServicioUnidad();
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
                            await unidadServicioUnidadRepository.save(unidadServicioUnidad)
                                .catch(reject);
                        }
                    }

                }
                resolve(totalRegistros);
            });
        });
    }

    saveCotizacionGrupoServiciosUnidadSinPaquete(serviciosUnidadSinPaquete: CotizacionGrupoServicioUnidadSinPaquete[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            if (!serviciosUnidadSinPaquete || serviciosUnidadSinPaquete.length === 0) {
                resolve(0);
                return;
            }
            let totalRegistros = 0;
            const connection = getConnection();

            await connection.transaction(async (manager) => {
                const detalleUnidadesRepository = await manager.getRepository(CotizacionDetalleUnidad);
                const grupoServicioUnidadRepository = await manager.getRepository(CotizacionGrupoServicioUnidad);
                const unidadServicioUnidadRepository = await manager.getRepository(CotizacionUnidadServicioUnidad);
                await grupoServicioUnidadRepository.delete({
                    idCotizacion: serviciosUnidadSinPaquete[0].idCotizacion,
                    idGrupoUnidad: serviciosUnidadSinPaquete[0].idGrupoUnidad,
                    idEncPaqueteServicioUnidad: null,
                });
                await unidadServicioUnidadRepository.delete({
                    idCotizacion: serviciosUnidadSinPaquete[0].idCotizacion,
                    idGrupoUnidad: serviciosUnidadSinPaquete[0].idGrupoUnidad,
                    idEncPaqueteServicioUnidad: null,
                });

                for (const tramiteSinPaquete of serviciosUnidadSinPaquete) {
                    const grupoServicioUnidad = new CotizacionGrupoServicioUnidad();
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

                    await grupoServicioUnidadRepository.save(grupoServicioUnidad);
                    const unidades = await detalleUnidadesRepository.find({
                        select: ['idDetalleUnidad'],
                        where: {
                            idCotizacion: serviciosUnidadSinPaquete[0].idCotizacion,
                            idGrupoUnidad: serviciosUnidadSinPaquete[0].idGrupoUnidad,
                        },
                    });
                    for (const unidad of unidades) {
                        const unidadServicioUnidad = new CotizacionUnidadServicioUnidad();
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

                        await unidadServicioUnidadRepository.save(unidadServicioUnidad);
                        totalRegistros++;
                    }
                }
                resolve(totalRegistros);
            });
        });
    }

    deleteCotizacionGrupoPaqueteServicioUnidad(idCotizacion: string, idGrupoUnidad: number, idEncPaqueteServicioUnidad: number): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionGrupoServicioUnidadRepository = await connection.getRepository(CotizacionGrupoServicioUnidad);
            const cotizacionUnidadServicioUnidadRepository = await connection.getRepository(CotizacionUnidadServicioUnidad);

            await cotizacionGrupoServicioUnidadRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad });
            await cotizacionUnidadServicioUnidadRepository.delete({ idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad });
            resolve(1);
        });
    }

    deleteCotizacionGrupoServicioUnidadSinPaquete(tramiteSinPaquete: CotizacionGrupoServicioUnidadSinPaquete): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionUnidadServicioUnidadRepository = await connection.getRepository(CotizacionUnidadServicioUnidad);
            const cotizacionGrupoServicioUnidadRepository = await connection.getRepository(CotizacionGrupoServicioUnidad);

            await cotizacionUnidadServicioUnidadRepository.delete({
                idCotizacion: tramiteSinPaquete.idCotizacion,
                idGrupoUnidad: tramiteSinPaquete.idGrupoUnidad,
                idServicioUnidad: tramiteSinPaquete.idServicioUnidad,
            });

            await cotizacionGrupoServicioUnidadRepository.delete({
                idCotizacion: tramiteSinPaquete.idCotizacion,
                idGrupoUnidad: tramiteSinPaquete.idGrupoUnidad,
                idServicioUnidad: tramiteSinPaquete.idServicioUnidad,
            });
            resolve(1);
        });
    }

    saveCotizacionUnidadTramite(cotizacionUnidadTramite: CotizacionUnidadTramite[]) {
        return new Promise(async (resolve) => {
            const connection = getConnection();

            await connection.transaction(async (manager) => {
                const unidadTramiteRepository = manager.getRepository(CotizacionUnidadTramite);
                // tslint:disable-next-line: prefer-for-of
                for (let index = 0; index < cotizacionUnidadTramite.length; index++) {
                    cotizacionUnidadTramite[index].procesado = 0;
                    await unidadTramiteRepository.save(cotizacionUnidadTramite[index]);
                }
                resolve();
            });
        });
    }

    deleteCotizacionUnidadTramite(cotizacionUnidadTramite: CotizacionUnidadTramite) {
        return new Promise<number>(async (resolve, reject) => {
            const connection = getConnection();
            const cotizacionUnidadTramiteRepository = await connection.getRepository(CotizacionUnidadTramite);

            await cotizacionUnidadTramiteRepository.delete({
                idCotizacion: cotizacionUnidadTramite.idCotizacion,
                idGrupoUnidad: cotizacionUnidadTramite.idGrupoUnidad,
                idTramite: cotizacionUnidadTramite.idTramite,
                idDetalleUnidad: cotizacionUnidadTramite.idDetalleUnidad,
            });

            resolve(1);
        });
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    getListadoAccesoriosGrupos(idCotizacion: string, idGrupoUnidad: number, fuente: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ListadoAccesoriosGrupo @idCotizacion = '${idCotizacion}`
                    + `', @fuente  = '${fuente}` // 1:cotizacion,2:gestion
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}'`);
                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    actualizaTipoOdenAccesorioGrupos(idCotizacion: string, idGrupoUnidad: number, idAccesorioNuevo: number, idParte: string,
                                     tipoOrden: string, tipoCargoUnidad: string, imprimeFactura: boolean, idCfdi: string) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ActualizaAccesorioTipoOrden @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idAccesorioNuevo  = '${idAccesorioNuevo}`
                    + `', @idParte   = '${idParte}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                    + `', @imprimeFactura  = '${imprimeFactura}`
                    + `', @idCfdi  = '${idCfdi}'`);
                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    actualizaTipoOdenAccesorioGruposMovs(accesorio: any) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            const idCotizacion = accesorio.idCotizacion;
            const idGrupoUnidad = accesorio.idGrupoUnidad;
            const idAccesorioNuevo = accesorio.idAccesorioNuevo;
            const idParte = accesorio.idParte;
            const tipoOrden = accesorio.tipoOrden;
            const tipoCargoUnidad = accesorio.tipoCargoUnidad;
            const imprimeFactura = accesorio.imprimeFactura;
            const idCfdi = accesorio.idCfdi;

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ActualizaAccesorioTipoOrdenMov @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idAccesorioNuevo  = '${idAccesorioNuevo}`
                    + `', @idParte   = '${idParte}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                    + `', @imprimeFactura  = '${imprimeFactura}`
                    + `', @idCfdi  = '${idCfdi}'`);
                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    getListadoTramitesGrupos(idCotizacion: string, idGrupoUnidad: number, fuente: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ListadoTramitesGrupo @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @fuente  = '${fuente}'`);
                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    actualizaTipoOdenTramiteGrupos(idCotizacion: string, idGrupoUnidad: number, idTramite: string, idSubtramite: string, tipoOrden: string, idCfdi: string) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTramiteTipoOrden @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idTramite  = '${idTramite}`
                    + `', @idSubtramite    = '${idSubtramite}`
                    + `', @idCfdi    = '${idCfdi}`
                    + `', @tipoOrden  = '${tipoOrden}'`);
                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
    // 20201202
    actualizaTipoOdenTramiteGruposMovs(tramite: any) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            const idCotizacion = tramite.idCotizacion;
            const idGrupoUnidad = tramite.idGrupoUnidad;
            const idTramite = tramite.idTramite;
            const idSubtramite = tramite.idSubtramite;
            const tipoOrden = tramite.tipoOrden;
            const idCfdi = tramite.idCfdi;

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ActualizaTramiteTipoOrdenMov @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idTramite  = '${idTramite}`
                    + `', @idSubtramite    = '${idSubtramite}`
                    + `', @idCfdi    = '${idCfdi}`
                    + `', @tipoOrden  = '${tipoOrden}'`);
                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    getListadoServiciosGrupos(idCotizacion: string, idGrupoUnidad: number, fuente: number) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const respuesta = await queryRunnerVRC.query(`exec sp_Flotillas_ListadoServicios @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @fuente  = '${fuente}'`);
                resolve(respuesta);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201113
    actualizaTipoOdenServicioGrupos(idCotizacion: string, idGrupoUnidad: number, idServicioUnidad: number,
                                    tipoOrden: string, tipoCargoUnidad: string, idCfdi: string, imprimeFactura: boolean) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            try {
                const accesorios = await queryRunnerVRC.query(`exec sp_Flotillas_ActualizaServicioTipoOrden @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idServicioUnidad  = '${idServicioUnidad}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                    + `', @imprimeFactura  = '${imprimeFactura}`
                    + `', @idCfdi  = '${idCfdi}'`);
                resolve(accesorios);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201113
    actualizaTipoOdenServicioGruposMovs(servicio: any) {
        return new Promise<any>(async (resolve, reject) => {
            const connectionVRC = getConnection();
            const queryRunnerVRC = connectionVRC.createQueryRunner();
            await queryRunnerVRC.connect();

            const idCotizacion = servicio.idCotizacion;
            const idGrupoUnidad = servicio.idGrupoUnidad;
            const idServicioUnidad = servicio.idServicioUnidad;
            const tipoOrden = servicio.tipoOrden;
            const tipoCargoUnidad = servicio.tipoCargoUnidad;
            const imprimeFactura = servicio.imprimeFactura;
            const idCfdi = servicio.idCfdi;

            try {
                const accesorios = await queryRunnerVRC.query(`exec sp_Flotillas_ActualizaServicioTipoOrdenMov @idCotizacion = '${idCotizacion}`
                    + `', @idGrupoUnidad  = '${idGrupoUnidad}`
                    + `', @idServicioUnidad  = '${idServicioUnidad}`
                    + `', @tipoOrden  = '${tipoOrden}`
                    + `', @tipoCargoUnidad  = '${tipoCargoUnidad}`
                    + `', @imprimeFactura  = '${imprimeFactura}`
                    + `', @idCfdi  = '${idCfdi}'`);
                resolve(accesorios);

            } catch (error) {
                reject(error);
            } finally {
                await queryRunnerVRC.release();
            }
        });
    }
}
