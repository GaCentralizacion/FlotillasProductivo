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
class InventarioUnidadBusiness {
    getInventarioUnidadesNuevas(idEmpresa, idSucursal) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec sp_bpro_inventarionuevos @Empresa = ' + idEmpresa + ', @Sucursal = ' + idSucursal).then((resultadoInventarioUnidades) => {
                const inventarioUnidades = [];
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
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getUnidadesBpro(idEmpresa) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec sp_bpro_catauni @Empresa = ' + idEmpresa).then((resultadoUnidadesBpro) => {
                const unidadesBpro = [];
                resultadoUnidadesBpro.map((resultado) => {
                    unidadesBpro.push({
                        idUnidadBpro: resultado.IdCatalogo,
                        linea: resultado.Carline,
                    });
                });
                resolve(unidadesBpro);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getVersionUnidades(idEmpresa, idUnidadBpro) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec sp_bpro_cataunimode @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idUnidadBpro + '\'')
                .then((resultadoVersionUnidades) => __awaiter(this, void 0, void 0, function* () {
                const versionUnidades = [];
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
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getCostoCatalago(sucursal, idCatalogo, modelo) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield connection.query(`exec sp_bpro_costocat @Sucursal = '${sucursal}', @TipoBD = '1', @IDCatalogo = '${idCatalogo}', @Modelo = '${modelo}'`)
                    .then((resp) => {
                    if (!resp.length) {
                        reject({ status: 404, error: `No se pudo recuperar los datos` });
                    }
                    resolve(resp);
                })
                    .catch(reject);
            }));
        }));
    }
    getColorUnidades(esinterior, idEmpresa, idUnidadBpro, idModelo) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const procName = esinterior ? 'sp_bpro_cataunicolint' : 'sp_bpro_cataunicolext';
            yield connection.query('exec ' + procName + ' @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idUnidadBpro + '\', @Modelo = \'' + idModelo + '\'').then((resultadoColorExteriorUnidades) => {
                const versionColorExterior = [];
                resultadoColorExteriorUnidades.map((resultado) => {
                    versionColorExterior.push({
                        idColor: resultado.ColClave,
                        nombre: resultado.ColDescripcion,
                    });
                });
                resolve(versionColorExterior);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getModelos(idEmpresa, idCatalogo, anio) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec sp_bpro_cataunian @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idCatalogo + '\', @Año = \'' + anio + '\'')
                .then((resultadoModelos) => __awaiter(this, void 0, void 0, function* () {
                const modelos = [];
                resultadoModelos.map((resultado) => {
                    modelos.push({
                        modelo: resultado.Modelo,
                        clase: resultado.Clase,
                        transmision: resultado.Transmision,
                        descripcion: resultado.Descripcion,
                    });
                });
                resolve(modelos);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getUnidadesInteresPorCotizacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const unidadesInteresRepository = yield connection.getRepository(catalogo_1.UnidadInteres);
            const unidadesInteresCotizacion = yield unidadesInteresRepository
                .find({ where: { idCotizacion } });
            resolve(unidadesInteresCotizacion);
        }));
    }
    solicitarApartadoUnidadInteresCreate(idCotizacion, idGrupoUnidad, unidadesPorApartar) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const unidadInteresRepository = yield manager.getRepository(catalogo_1.UnidadInteres);
                if (!unidadesPorApartar.length) {
                    resolve({ status: 400, message: `No se han seleccionado unidades para apartar` });
                }
                for (const unidadInteres of unidadesPorApartar) {
                    unidadInteres.idGrupoUnidad = idGrupoUnidad;
                    const existUnidadApartada = yield unidadInteresRepository.findOne({ idCotizacion, idGrupoUnidad, idInventario: unidadInteres.idInventario });
                    if (existUnidadApartada) {
                        const unidadExist = unidadesPorApartar.find((unidadApartada) => (unidadApartada.idGrupoUnidad === existUnidadApartada.idGrupoUnidad));
                        const unidadExistInteres = unidadesPorApartar.find((unidadApartada) => (unidadApartada.idGrupoUnidad === existUnidadApartada.idGrupoUnidad));
                        if (unidadExist && (idGrupoUnidad !== unidadExistInteres.idGrupoUnidad)) {
                            reject({ status: 409, error: `La unidad (${existUnidadApartada.idInventario} - ${existUnidadApartada.vin}) ya está en la cotización: ${existUnidadApartada.idCotizacion}` });
                        }
                    }
                    if (!existUnidadApartada) {
                        unidadInteres.fechaModificacion = new Date();
                        unidadInteres.idEstatusUnidadInteres = 1;
                        console.log(unidadInteres, `¿UNIDAD INTERES CREATE?`);
                        yield unidadInteresRepository.save(unidadInteres)
                            .catch(reject);
                    }
                }
                resolve({ status: 200, message: `Se aparto la unidad con exito.` });
            }));
        }));
    }
    solicitarApartadoUnidadInteresUpdate(idCotizacion, idGrupoUnidad, unidadesPorApartar) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const unidadInteresRepository = yield manager.getRepository(catalogo_1.UnidadInteres);
                if (!unidadesPorApartar.length) {
                    resolve({ status: 400, message: `No se han seleccionado unidades para actualizar apartado` });
                }
                for (const unidadInteres of unidadesPorApartar) {
                    const existUnidadApartada = yield unidadInteresRepository.findOne({ idCotizacion, idGrupoUnidad, idInventario: unidadInteres.idInventario });
                    if (existUnidadApartada) {
                        unidadInteres.fechaModificacion = new Date();
                        unidadInteres.idEstatusUnidadInteres = 1;
                        yield unidadInteresRepository.update({ idInventario: unidadInteres.idInventario }, unidadInteres)
                            .catch(reject);
                    }
                    else {
                        this.solicitarApartadoUnidadInteresCreate(idCotizacion, idGrupoUnidad, unidadesPorApartar);
                    }
                }
                resolve({ status: 200, message: `Se actualizo la unidad con exito.` });
            }));
        }));
    }
    solicitarApartadoUnidadInteresDelete(idCotizacion, idGrupoUnidad, unidadesPorApartar) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const unidadInteresRepository = yield manager.getRepository(catalogo_1.UnidadInteres);
                if (!unidadesPorApartar.length) {
                    resolve({ status: 400, message: `No se han seleccionado unidades para eliminar apartado` });
                }
                for (const unidadInteres of unidadesPorApartar) {
                    const existUnidadApartada = yield unidadInteresRepository.findOne({ idCotizacion, idGrupoUnidad, idInventario: unidadInteres.idInventario });
                    if (existUnidadApartada) {
                        yield unidadInteresRepository.delete({ idInventario: unidadInteres.idInventario, idGrupoUnidad });
                    }
                }
                resolve({ status: 200, message: `Se ha eliminado la unidad de interes con exito.` });
            }));
        }));
    }
    eliminarSolicitudApartadoUnidadesInteres(idUnidadesEliminar) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            let itemsEliminados = 0;
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const unidadInteresRepository = yield manager.getRepository(catalogo_1.UnidadInteres);
                for (const idInventarioEliminar of idUnidadesEliminar) {
                    yield unidadInteresRepository.findOne({
                        where: {
                            idInventario: idInventarioEliminar,
                            idEstatusUnidadInteres: typeorm_1.Not(1),
                        },
                    }).then((unidadExistente) => __awaiter(this, void 0, void 0, function* () {
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
                            yield manager.queryRunner.rollbackTransaction();
                            reject({ status: 409, error: `No se puede cancelar el apartado de la unidad (${unidadExistente.idInventario} - ${unidadExistente.vin}) ya que tiene el estatus de: ${estatus}` });
                        }
                    }));
                    const itemEliminado = yield unidadInteresRepository.delete({ idInventario: idInventarioEliminar });
                    itemsEliminados += itemEliminado.affected;
                }
                resolve({ status: 200, message: `Registros eliminados ${itemsEliminados}` });
            }));
        }));
    }
    getEstatusOrdCompraUnidades(idCotizacion, idGrupoUnidad, idDetalleUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let queryString = '';
            const connection = typeorm_1.getConnection();
            if (!idGrupoUnidad || idGrupoUnidad === -1) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraUnidades @idCotizacion = '${idCotizacion}'`;
            }
            else if (idGrupoUnidad && (!idDetalleUnidad || idDetalleUnidad === -1)) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraUnidades @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`;
            }
            else if (idGrupoUnidad && idDetalleUnidad) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraUnidades @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`;
            }
            yield connection.query(queryString)
                .then((OrdenesCompraUnidades) => {
                if (!OrdenesCompraUnidades.length) {
                    resolve([]);
                }
                else {
                    resolve(OrdenesCompraUnidades);
                }
            })
                .catch(reject);
        }));
    }
    getEstatusOrdCompraRefacciones(idCotizacion, idGrupoUnidad, idDetalleUnidad) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let queryString = '';
            const connection = typeorm_1.getConnection();
            if (!idGrupoUnidad || idGrupoUnidad === -1) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraRefacciones @idCotizacion = '${idCotizacion}'`;
            }
            else if (idGrupoUnidad && (!idDetalleUnidad || idDetalleUnidad === -1)) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraRefacciones @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}'`;
            }
            else if (idGrupoUnidad && idDetalleUnidad) {
                queryString = `exec sp_Flotillas_EstatusOrdCompraRefacciones @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}'`;
            }
            yield connection.query(queryString)
                .then((OrdenesCompraRefacciones) => {
                if (!OrdenesCompraRefacciones.length) {
                    resolve([]);
                }
                else {
                    resolve(OrdenesCompraRefacciones);
                }
            })
                .catch(reject);
        }));
    }
    getBonificacion(sucursal, idCatalogo, modelo) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield connection.query(`exec sp_bpro_bonif @TipoBD='1', @Sucursal = '${sucursal}', @IDCatalogo  = '${idCatalogo}', @Modelo = '${modelo}'`)
                    .then((resp) => {
                    resolve(resp);
                })
                    .catch(reject);
            }));
        }));
    }
    // Cambio bonificaciones - EHJ-COAL
    guardaBonificacion(idCotizacion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query(`exec sp_Flotillas_guardaBonificaciones @idCotizacion = '${idCotizacion}'`)
                .then((doc) => {
                resolve(doc);
            })
                .catch(reject);
        }));
    }
    getUnidadesExterno(idEmpresa) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec catalogo.SEL_CARLINE_SP @Empresa = ' + idEmpresa).then((resultadoUnidadesBpro) => {
                const unidadesBpro = [];
                resultadoUnidadesBpro.map((resultado) => {
                    unidadesBpro.push({
                        idUnidadBpro: resultado.IdCatalogo,
                        linea: resultado.Carline,
                    });
                });
                resolve(unidadesBpro);
            }, (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getVersionUnidadesExterno(idEmpresa, idUnidadBpro) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec catalogo.SEL_DETALLE_CARLINE_SP @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idUnidadBpro + '\'')
                .then((resultadoVersionUnidades) => __awaiter(this, void 0, void 0, function* () {
                const versionUnidades = [];
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
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getModeloExterno(idEmpresa, idCatalogo, anio) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('exec catalogo.SEL_UNIDAD_SP @Empresa = ' + idEmpresa + ', @Catalogo = \'' + idCatalogo + '\', @Año = \'' + anio + '\'')
                .then((resultadoModelos) => __awaiter(this, void 0, void 0, function* () {
                const modelos = [];
                resultadoModelos.map((resultado) => {
                    modelos.push({
                        modelo: resultado.Modelo,
                        clase: resultado.Clase,
                        transmision: resultado.Transmision,
                        descripcion: resultado.Descripcion,
                    });
                });
                resolve(modelos);
            }), (error) => __awaiter(this, void 0, void 0, function* () {
                reject(error);
            }));
        }));
    }
    getCostoCatalagoExterno(sucursal, idCatalogo, modelo) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield connection.query(`exec catalogo.SEL_UNIDAD_SP @Empresa = '${sucursal}', @Catalogo = '${idCatalogo}', @Año = '${modelo}'`)
                    .then((resp) => {
                    if (!resp.length) {
                        reject({ status: 404, error: `No se pudo recuperar los datos` });
                    }
                    resolve(resp);
                })
                    .catch(reject);
            }));
        }));
    }
    getCatalogoDatosFac(idFac, idTipo) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield connection.query(`exec SEL_VALIDADATOS_FAC_SP @idFac = '${idFac}', @idTipo = '${idTipo}'`)
                    .then((resp) => {
                    if (!resp.length) {
                        reject({ status: 404, error: `No se pudo recuperar los datos` });
                    }
                    resolve(resp);
                })
                    .catch(reject);
            }));
        }));
    }
    guardaDatosFacTramite(idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite, idSubtramite, precio, datosFac, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield connection.query(`exec sp_Flotillas_GuardaDatosFacTramite @idCotizacion = '${idCotizacion}'
                , @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}', @idTramite = '${idTramite}'
                , @idSubTramite = '${idSubtramite}', @precio = '${precio}', @datosFac = '${datosFac}', @idUsuario = '${idUsuario}'`)
                    .then((resp) => {
                    if (resp[0].success === 1) {
                        resolve(resp);
                    }
                    else {
                        reject({ status: 404, error: `No se pudo recuperar los datos` });
                    }
                })
                    .catch(reject);
            }));
        }));
    }
    guardaDatosFacTramiteMov(idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite, idSubtramite, precio, datosFac, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield connection.query(`exec sp_Flotillas_GuardaDatosFacTramiteMov @idCotizacion = '${idCotizacion}'
                , @idGrupoUnidad = '${idGrupoUnidad}', @idDetalleUnidad = '${idDetalleUnidad}', @idTramite = '${idTramite}'
                , @idSubTramite = '${idSubtramite}', @precio = '${precio}', @datosFac = '${datosFac}', @idUsuario = '${idUsuario}'`)
                    .then((resp) => {
                    if (resp[0].success === 1) {
                        resolve(resp);
                    }
                    else {
                        reject({ status: 404, error: `No se pudo recuperar los datos` });
                    }
                })
                    .catch(reject);
            }));
        }));
    }
    guardaDatosFacTraslado(idCotizacionTraslado, idCotizacion, idGrupoUnidad, idTraslado, datosFac, idUsuario) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield connection.query(`exec sp_Flotillas_GuardaDatosFacTraslado @idCotizacionTraslado = '${idCotizacionTraslado}'
                , @idCotizacion = '${idCotizacion}', @idGrupoUnidad = '${idGrupoUnidad}', @idTraslado = '${idTraslado}'
                , @datosFac = '${datosFac}', @idUsuario = '${idUsuario}'`)
                    .then((resp) => {
                    if (resp[0].success === 1) {
                        resolve(resp);
                    }
                    else {
                        reject({ status: 404, error: `No se pudo recuperar los datos` });
                    }
                })
                    .catch(reject);
            }));
        }));
    }
}
exports.InventarioUnidadBusiness = InventarioUnidadBusiness;
//# sourceMappingURL=inventario_unidad.business.js.map