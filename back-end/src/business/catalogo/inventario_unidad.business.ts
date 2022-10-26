import { Exception } from 'ts-httpexceptions';
import { getConnection, Like, Not } from 'typeorm';
import { ColorUnidad, InventarioUnidad, UnidadBpro, UnidadInteresFilter, VersionUnidad } from '../../db/model/catalogo';
import { UnidadInteres } from '../../db/model/catalogo';
import { ModeloUnidad } from '../../db/model/catalogo/modelo_unidad.model';
import { Sucursal } from '../../db/model/catalogo/sucursal.model';
import { Cotizacion } from '../../db/model/cotizador/cotizacion.model';

export class InventarioUnidadBusiness {
    getInventarioUnidadesNuevas(idEmpresa: number, idSucursal: number): Promise<InventarioUnidad[]> {
        return new Promise<InventarioUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_inventarionuevos @Empresa = ' + idEmpresa + ', @Sucursal = ' + idSucursal).then((resultadoInventarioUnidades: any[]) => {
                const inventarioUnidades: InventarioUnidad[] = [];
                resultadoInventarioUnidades.map((resultado) => {
                    inventarioUnidades.push({
                        idInventario: resultado.IdInventario,
                        tipoUnidad: resultado.TipoUnidad,
                        anio: resultado.Año,
                        modelo: resultado.Modelo,
                        idColorInterior: resultado.ColorInteriorC,
                        colorInterior: resultado.ColorInterior,
                        idColorExterior: resultado.ColorExteriorC,
                        colorExterior: resultado.ColorExterior,
                        clase: resultado.Clase,
                        catalogo: resultado.Catalogo,
                        precio: resultado.PrecioUnidad,
                        costo: resultado.CostoUnidad,
                        cantidad: resultado.Cantidad,
                        marca: resultado.Marca,
                        antiguedad: resultado.Antiguedad,
                        segmento: resultado.Segmento,
                        descripcion: resultado.Descripcion,
                        agencia: resultado.Agencia,
                        clasificacionTipoCompra: resultado.ClasifTipoCompra,
                        vin: resultado.VIN,
                        idEmpresa: Number(resultado.IdEmpresa),
                        idSucursal: Number(resultado.IdSucursal),
                        bd: resultado.Bd,
                        tipoBase: resultado.TipoBase,
                        idCotizacion: resultado.IdCotizacionGlobal,
                        estatusUnidad: resultado.Situacion,
                    });
                });
                resolve(inventarioUnidades);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getUnidadesBpro(idEmpresa: number): Promise<UnidadBpro[]> {
        return new Promise<UnidadBpro[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_catauni @Empresa = ' + idEmpresa).then((resultadoUnidadesBpro: any[]) => {
                const unidadesBpro: UnidadBpro[] = [];
                resultadoUnidadesBpro.map((resultado) => {
                    unidadesBpro.push({
                        idUnidadBpro: resultado.IdCatalogo,
                        linea: resultado.Carline,
                    });
                });
                resolve(unidadesBpro);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getVersionUnidades(idEmpresa: number, idUnidadBpro: string): Promise<VersionUnidad[]> {
        return new Promise<VersionUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_cataunimode @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idUnidadBpro + '\'')
            .then(async (resultadoVersionUnidades: any[]) => {
                const versionUnidades: VersionUnidad[] = [];
                resultadoVersionUnidades.map((resultado) => {
                    versionUnidades.push({
                        idUnidadBpro: resultado.IdCatalogo,
                        nombre: resultado.Descripcion,
                        precioLista: resultado.PrecioLista,
                        monedaCompra: resultado.MonedaCosto,
                        modelo: resultado.Año,
                    });
                });
                resolve(versionUnidades);
            },
            async (error) => {
                reject(error);
            });
        });
    }

    getCostoCatalago(sucursal: number, idCatalogo: string, modelo: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                await connection.query(`exec sp_bpro_costocat @Sucursal = '${sucursal}', @TipoBD = '1', @IDCatalogo = '${idCatalogo}', @Modelo = '${modelo}'`)
                .then((resp: any[]) => {
                    if (!resp.length) {
                        reject({ status: 404, error: `No se pudo recuperar los datos` });
                    }
                    resolve(resp);
                })
                .catch(reject);
            });
        });
    }

    getColorUnidades(esinterior: boolean, idEmpresa: number, idUnidadBpro: string, idModelo: number): Promise<ColorUnidad[]> {
        return new Promise<ColorUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            const procName = esinterior ? 'sp_bpro_cataunicolint' : 'sp_bpro_cataunicolext';
            await connection.query('exec ' + procName + ' @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idUnidadBpro + '\', @Modelo = \'' + idModelo + '\'').then((resultadoColorExteriorUnidades: any[]) => {
                const versionColorExterior: ColorUnidad[] = [];
                resultadoColorExteriorUnidades.map((resultado) => {
                    versionColorExterior.push({
                        idColor: resultado.ColClave,
                        nombre: resultado.ColDescripcion,
                    });
                });
                resolve(versionColorExterior);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getModelos(idEmpresa: number, idCatalogo: string, anio: string): Promise<ModeloUnidad[]> {
        return new Promise<ModeloUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec sp_bpro_cataunian @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idCatalogo + '\', @Año = \'' + anio + '\'')
            .then(async (resultadoModelos: any[]) => {
                const modelos: ModeloUnidad[] = [];
                resultadoModelos.map((resultado) => {
                    modelos.push({
                                   modelo: resultado.Modelo,
                                   clase: resultado.Clase,
                                   transmision: resultado.Transmision,
                                   descripcion: resultado.Descripcion,
                                });
                });
                resolve(modelos);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getUnidadesInteresPorCotizacion(idCotizacion: string): Promise<UnidadInteres[]> {
        return new Promise<UnidadInteres[]>(async (resolve, reject) => {
            const connection = getConnection();
            const unidadesInteresRepository = await connection.getRepository(UnidadInteres);
            const unidadesInteresCotizacion = await unidadesInteresRepository
                .find({ where: { idCotizacion } });
            resolve(unidadesInteresCotizacion);
        });
    }

    solicitarApartadoUnidadInteresCreate(idCotizacion: string, idGrupoUnidad: number, unidadesPorApartar: UnidadInteres[]): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const unidadInteresRepository = await manager.getRepository(UnidadInteres);

                if (!unidadesPorApartar.length) {
                    resolve({status: 400, message: `No se han seleccionado unidades para apartar`});
                }

                for (const unidadInteres of unidadesPorApartar) {
                    unidadInteres.idGrupoUnidad = idGrupoUnidad;
                    const existUnidadApartada = await unidadInteresRepository.findOne({idCotizacion, idGrupoUnidad, idInventario: unidadInteres.idInventario});
                    if (existUnidadApartada ) {
                        const unidadExist = unidadesPorApartar.find((unidadApartada) => (unidadApartada.idGrupoUnidad === existUnidadApartada.idGrupoUnidad));
                        const unidadExistInteres = unidadesPorApartar.find((unidadApartada) => (unidadApartada.idGrupoUnidad === existUnidadApartada.idGrupoUnidad));
                        if (unidadExist && (idGrupoUnidad !== unidadExistInteres.idGrupoUnidad)) {
                            reject({status: 409, error: `La unidad (${existUnidadApartada.idInventario} - ${existUnidadApartada.vin}) ya está en la cotización: ${existUnidadApartada.idCotizacion}`});
                        }
                    }

                    if (!existUnidadApartada) {
                        unidadInteres.fechaModificacion = new Date();
                        unidadInteres.idEstatusUnidadInteres = 1;
                        console.log(unidadInteres, `¿UNIDAD INTERES CREATE?`);
                        await unidadInteresRepository.save(unidadInteres)
                        .catch(reject);
                    }
                }
                resolve({status: 200, message: `Se aparto la unidad con exito.`});
            });
        });
    }

    solicitarApartadoUnidadInteresUpdate(idCotizacion: string, idGrupoUnidad: number, unidadesPorApartar: UnidadInteres[]): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const unidadInteresRepository = await manager.getRepository(UnidadInteres);

                if (!unidadesPorApartar.length) {
                    resolve({status: 400, message: `No se han seleccionado unidades para actualizar apartado`});
                }

                for (const unidadInteres of unidadesPorApartar) {
                    const existUnidadApartada = await unidadInteresRepository.findOne({idCotizacion, idGrupoUnidad, idInventario: unidadInteres.idInventario});

                    if (existUnidadApartada) {
                        unidadInteres.fechaModificacion = new Date();
                        unidadInteres.idEstatusUnidadInteres = 1;
                        await unidadInteresRepository.update({idInventario: unidadInteres.idInventario}, unidadInteres)
                        .catch(reject);
                    } else {
                        this.solicitarApartadoUnidadInteresCreate(idCotizacion, idGrupoUnidad, unidadesPorApartar);
                    }
                }
                resolve({status: 200, message: `Se actualizo la unidad con exito.`});
            });
        });
    }

    solicitarApartadoUnidadInteresDelete(idCotizacion: string, idGrupoUnidad: number, unidadesPorApartar: UnidadInteres[]): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                const unidadInteresRepository = await manager.getRepository(UnidadInteres);

                if (!unidadesPorApartar.length) {
                    resolve({status: 400, message: `No se han seleccionado unidades para eliminar apartado`});
                }

                for (const unidadInteres of unidadesPorApartar) {
                    const existUnidadApartada = await unidadInteresRepository.findOne({idCotizacion, idGrupoUnidad, idInventario: unidadInteres.idInventario});

                    if (existUnidadApartada) {
                        await unidadInteresRepository.delete({idInventario: unidadInteres.idInventario, idGrupoUnidad});
                    }
                }
                resolve({status: 200, message: `Se ha eliminado la unidad de interes con exito.`});
            });
        });
    }

    eliminarSolicitudApartadoUnidadesInteres(idUnidadesEliminar: number[]): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            let itemsEliminados = 0;
            await connection.transaction(async (manager) => {
                const unidadInteresRepository = await manager.getRepository(UnidadInteres);
                for (const idInventarioEliminar of idUnidadesEliminar) {
                    await unidadInteresRepository.findOne({
                        where: {
                            idInventario: idInventarioEliminar,
                            idEstatusUnidadInteres: Not(1),
                        },
                    }).then(async (unidadExistente) => {
                        if (unidadExistente != undefined) {
                            let estatus = '';
                            switch (unidadExistente.idEstatusUnidadInteres) {
                                case 1:
                                    estatus = 'Por Solicitar';
                                    break;
                                case 2:
                                    estatus = 'Solicitado';
                                    break;
                                default:
                                    estatus = 'Apartado';
                                    break;
                            }
                            await manager.queryRunner.rollbackTransaction();
                            reject({status: 409, error: `No se puede cancelar el apartado de la unidad (${unidadExistente.idInventario} - ${unidadExistente.vin}) ya que tiene el estatus de: ${estatus}`});
                        }
                    });
                    const itemEliminado = await unidadInteresRepository.delete({ idInventario: idInventarioEliminar });
                    itemsEliminados += itemEliminado.affected;
                }
                resolve({status: 200, message: `Registros eliminados ${itemsEliminados}`});
            });
        });
    }

    getEstatusOrdCompraUnidades(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let queryString = '';
            const connection = getConnection();

            if (!idGrupoUnidad || idGrupoUnidad === -1) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraUnidades @idCotizacion = '${idCotizacion}'`;
            } else if (idGrupoUnidad && (!idDetalleUnidad || idDetalleUnidad === -1)) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraUnidades @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`;
            } else if (idGrupoUnidad && idDetalleUnidad) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraUnidades @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`;
            }

            await connection.query(queryString)
            .then((OrdenesCompraUnidades: any[]) => {
                if (!OrdenesCompraUnidades.length) {
                    resolve([]);
                } else {
                    resolve(OrdenesCompraUnidades);
                }
            })
            .catch(reject);
        });
    }

        getEstatusOrdCompraRefacciones(idCotizacion: string, idGrupoUnidad: number, idDetalleUnidad: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let queryString = '';
            const connection = getConnection();

            if (!idGrupoUnidad || idGrupoUnidad === -1) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraRefacciones @idCotizacion = '${idCotizacion}'`;
            } else if (idGrupoUnidad && (!idDetalleUnidad || idDetalleUnidad === -1)) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraRefacciones @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`;
            } else if (idGrupoUnidad && idDetalleUnidad) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraRefacciones @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`;
            }

            await connection.query(queryString)
            .then((OrdenesCompraRefacciones: any[]) => {
                if (!OrdenesCompraRefacciones.length) {
                    resolve([]);
                } else {
                    resolve(OrdenesCompraRefacciones);
                }
            })
            .catch(reject);
        });
    }

    getBonificacion(sucursal: string, idCatalogo: string, modelo: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                await connection.query(`exec sp_bpro_bonif @TipoBD='1', @Sucursal = '${sucursal}', @IDCatalogo  = '${idCatalogo}', @Modelo = '${modelo}'`)
                .then((resp: any[]) => {
                    resolve(resp);
                })
                .catch(reject);
            });
        });
    }
      // Cambio bonificaciones - EHJ-COAL
      guardaBonificacion(idCotizacion: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query(`exec sp_Flotillas_guardaBonificaciones @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                    resolve(doc);
                })
                .catch(reject);
        });
    }

    getUnidadesExterno(idEmpresa: number): Promise<UnidadBpro[]> {
        return new Promise<UnidadBpro[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec catalogo.SEL_CARLINE_SP @Empresa = ' + idEmpresa).then((resultadoUnidadesBpro: any[]) => {
                const unidadesBpro: UnidadBpro[] = [];
                resultadoUnidadesBpro.map((resultado) => {
                    unidadesBpro.push({
                        idUnidadBpro: resultado.IdCatalogo,
                        linea: resultado.Carline,
                    });
                });
                resolve(unidadesBpro);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getVersionUnidadesExterno(idEmpresa: number, idUnidadBpro: string): Promise<VersionUnidad[]> {
        return new Promise<VersionUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec catalogo.SEL_DETALLE_CARLINE_SP @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idUnidadBpro + '\'')
            .then(async (resultadoVersionUnidades: any[]) => {
                const versionUnidades: VersionUnidad[] = [];
                resultadoVersionUnidades.map((resultado) => {
                    versionUnidades.push({
                        idUnidadBpro: resultado.IdCatalogo,
                        nombre: resultado.Descripcion,
                        precioLista: resultado.PrecioLista,
                        monedaCompra: resultado.MonedaCosto,
                        modelo: resultado.Año,
                    });
                });
                resolve(versionUnidades);
            },
            async (error) => {
                reject(error);
            });
        });
    }

    getModeloExterno(idEmpresa: number, idCatalogo: string, anio: string): Promise<ModeloUnidad[]> {
        return new Promise<ModeloUnidad[]>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.query('exec catalogo.SEL_UNIDAD_SP @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idCatalogo + '\', @Año = \'' + anio + '\'')
            .then(async (resultadoModelos: any[]) => {
                const modelos: ModeloUnidad[] = [];
                resultadoModelos.map((resultado) => {
                    modelos.push({
                                   modelo: resultado.Modelo,
                                   clase: resultado.Clase,
                                   transmision: resultado.Transmision,
                                   descripcion: resultado.Descripcion,
                                });
                });
                resolve(modelos);
            },
                async (error) => {
                    reject(error);
                },
            );
        });
    }

    getCostoCatalagoExterno(sucursal: number, idCatalogo: string, modelo: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const connection = getConnection();
            await connection.transaction(async (manager) => {
                await connection.query(`exec catalogo.SEL_UNIDAD_SP @Empresa = '${sucursal}', @Catalogo = '${idCatalogo}', @Año = '${modelo}'`)
                .then((resp: any[]) => {
                    if (!resp.length) {
                        reject({ status: 404, error: `No se pudo recuperar los datos` });
                    }
                    resolve(resp);
                })
                .catch(reject);
            });
        });
    }
}
