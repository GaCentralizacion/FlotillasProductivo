"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
const respuesta = require("../../network/response");
const catalogo_1 = require("../business/catalogo");
const cotizador_1 = require("../business/cotizador");
const repositorio_1 = require("../business/repositorio");
const cotizador_2 = require("../db/model/cotizador");
const sendGrid_helpers_1 = require("../helpers/sendGrid.helpers");
const postDetPaqueteAccesorio = __importStar(require("../schemas/catalogo/det_paquete_accesorio.schema.json"));
const postDetPaqueteServicioUnidad = __importStar(require("../schemas/catalogo/det_paquete_servicio_unidad.schema.json"));
const postDetPaqueteTramite = __importStar(require("../schemas/catalogo/det_paquete_tramite.schema.json"));
const postSaveLeyendaDetalleUnidad = __importStar(require("../schemas/catalogo/det_unidad_leyenda.schema.json"));
const postSaveLeyendaDetalleUnidadArray = __importStar(require("../schemas/catalogo/det_unidad_leyenda_array.schema.json"));
const postEncPaqueteAccesorio = __importStar(require("../schemas/catalogo/enc_paquete_accesorio.schema.json"));
const postEncPaqueteAccesorioArray = __importStar(require("../schemas/catalogo/enc_paquete_accesorio_array.schema.json"));
const postEncPaqueteServicioUnidad = __importStar(require("../schemas/catalogo/enc_paquete_servicio_unidad.schema.json"));
const postEncPaqueteServicioUnidadArray = __importStar(require("../schemas/catalogo/enc_paquete_servicio_unidad_array.schema.json"));
const postEncPaqueteTramite = __importStar(require("../schemas/catalogo/enc_paquete_tramite.schema.json"));
const postEncPaqueteTramiteArray = __importStar(require("../schemas/catalogo/enc_paquete_tramite_array.schema.json"));
const postDetPaqueteTramiteTodos = __importStar(require("../schemas/catalogo/enc_paquete_tramite_todos.schema.json"));
const postEncPaqueteTramiteTodosArray = __importStar(require("../schemas/catalogo/enc_paquete_tramite_todos_array.schema.json"));
const postUnidadInteresCreate = __importStar(require("../schemas/catalogo/unidad_interes_create.schema.json"));
const postUnidadesInteresArrayCreate = __importStar(require("../schemas/catalogo/unidad_interes_create_array.schema.json"));
const deleteUnidadInteresDelete = __importStar(require("../schemas/catalogo/unidad_interes_delete.schema.json"));
const deleteUnidadesInteresArrayDelete = __importStar(require("../schemas/catalogo/unidad_interes_delete_array.schema.json"));
const putUnidadInteresUpdate = __importStar(require("../schemas/catalogo/unidad_interes_update.schema.json"));
const putUnidadesInteresArrayUpdate = __importStar(require("../schemas/catalogo/unidad_interes_update_array.schema.json"));
const correoSchema = __importStar(require("../schemas/correo.schema.json"));
const postActualizarBonificacionSchema = __importStar(require("../schemas/cotizador/actualizar_bonificacion.schema.json"));
const postActualizarBonificacionArray = __importStar(require("../schemas/cotizador/actualizar_bonificacion_array.schema.json"));
const postActulizarImprimeFacturaSchema = __importStar(require("../schemas/cotizador/actualizar_imprime_factura.schema.json"));
const postActulizarImprimeFacturaArray = __importStar(require("../schemas/cotizador/actualizar_imprime_factura_array.schema.json"));
const cierreCotizacionSchema = __importStar(require("../schemas/cotizador/cierre_cotizacion.schema.json"));
const potClienteFacturacionSchema = __importStar(require("../schemas/cotizador/cliente_factura.schema.json"));
const potClienteFacturacionArray = __importStar(require("../schemas/cotizador/cliente_factura_array.schema.json"));
const condicionesEntregaSchema = __importStar(require("../schemas/cotizador/condiciones_entrega.schema.json"));
const postDetalleUnidad = __importStar(require("../schemas/cotizador/cotizacion_detalle_unidad.schema.json"));
const postGrupoAccesorioSinPaquete = __importStar(require("../schemas/cotizador/cotizacion_grupo_accesorio_sin_paquete.schema.json"));
const postGrupoAccesorioSinPaqueteArray = __importStar(require("../schemas/cotizador/cotizacion_grupo_accesorio_sin_paquete_array.schema.json"));
const postGrupoAccesorioSinPaqueteTodos = __importStar(require("../schemas/cotizador/cotizacion_grupo_accesorio_sin_paquete_todos.schema.json"));
const postGrupoAccesorioSinPaqueteArrayTodos = __importStar(require("../schemas/cotizador/cotizacion_grupo_accesorio_sin_paquete_todos_array.schema.json"));
const postGrupoServicioUnidadSinPaquete = __importStar(require("../schemas/cotizador/cotizacion_grupo_servicio_unidad_sin_paquete.schema.json"));
const postGrupoServicioUnidadSinPaqueteArray = __importStar(require("../schemas/cotizador/cotizacion_grupo_servicio_unidad_sin_paquete_array.schema.json"));
const postGrupoTramiteSinPaquete = __importStar(require("../schemas/cotizador/cotizacion_grupo_tramite_sin_paquete.schema.json"));
const postGrupoTramiteSinPaqueteArray = __importStar(require("../schemas/cotizador/cotizacion_grupo_tramite_sin_paquete_array.schema.json"));
const postGrupoUnidad = __importStar(require("../schemas/cotizador/cotizacion_grupo_unidad.schema.json"));
const postCotizacionTraslado = __importStar(require("../schemas/cotizador/cotizacion_traslado.schema.json"));
const postCotizacionUnidadAccesorioMov = __importStar(require("../schemas/cotizador/cotizacion_unidad_accesorio_mov.schema.json"));
const postCotizacionUnidadAccesorioMovArray = __importStar(require("../schemas/cotizador/cotizacion_unidad_accesorio_mov_array.schema.json"));
const postCotizacionUnidadServicioMov = __importStar(require("../schemas/cotizador/cotizacion_unidad_servicio_unidad_mov.schema.json"));
const postCotizacionUnidadServicioMovArray = __importStar(require("../schemas/cotizador/cotizacion_unidad_servicio_unidad_mov_array.schema.json"));
const postCotizacionUnidadTramiteMov = __importStar(require("../schemas/cotizador/cotizacion_unidad_tramite_mov.schema.json"));
const postCotizacionUnidadTramiteMovArray = __importStar(require("../schemas/cotizador/cotizacion_unidad_tramite_mov_array.schema.json"));
const postCotizacionUnidadTrasladoMov = __importStar(require("../schemas/cotizador/cotizacion_unidad_traslado_mov.schema.json"));
const postCotizacionUnidadTrasladoMovArray = __importStar(require("../schemas/cotizador/cotizacion_unidad_traslado_mov_array.schema.json"));
const putAsignarVinDetalleUnidad = __importStar(require("../schemas/cotizador/detalle_unidad_asigna_vin.schema.json"));
const putasignarVinDetalleUnidadArray = __importStar(require("../schemas/cotizador/detalle_unidad_asigna_vin_array.schema.json"));
const putDeleteStatusProcesadoBpro = __importStar(require("../schemas/cotizador/detalle_unidad_procesadoBpro.schema.json"));
const putDeleteStatusProcesadoBproArray = __importStar(require("../schemas/cotizador/detalle_unidad_procesadoBpro_array.schema.json"));
const postNotificaionEnv = __importStar(require("../schemas/cotizador/envia_notificaciones.schema.json"));
const postNotificaionEnvArray = __importStar(require("../schemas/cotizador/envia_notificaciones_array.schema.json"));
const postSumaTipoCargoUnidadSchema = __importStar(require("../schemas/cotizador/suma_tipo_cargo_unidad.schema.json"));
const postSumaTipoCargoUnidadArray = __importStar(require("../schemas/cotizador/suma_tipo_cargo_unidad_array.schema.json"));
const postUnidadGestionApartado = __importStar(require("../schemas/cotizador/unidad_gestion_apartado.schema.json"));
const postUnidadGestionApartadoArray = __importStar(require("../schemas/cotizador/unidad_gestion_apartado_array.schema.json"));
const postValidaVinAsignados = __importStar(require("../schemas/cotizador/valida_vin_asignados.schema.json"));
const postValidaVinAsignadosArray = __importStar(require("../schemas/cotizador/valida_vin_asignados_array.schema.json"));
const postIntegerArray = __importStar(require("../schemas/integer_array.schema.json"));
const base_controller_1 = require("./base.controller");
class CotizadorController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/cotizador';
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.get(`${this.basePath}/getCotizaciones`, this.getCotizaciones.bind(this));
        this.router.get(`${this.basePath}/getCotizacionesByIdLicitacion/:idLicitacion`, this.getCotizacionesByIdLicitacion.bind(this));
        this.router.get(`${this.basePath}/getCotizacionesByIdFlotillas/:idDireccionFlotillas`, this.getCotizacionesByIdFlotillas.bind(this));
        // Envio de Correo LBM*
        this.router.get(`${this.basePath}/getConsultaCorreosCompras/:idCotizacion`, this.getConsultaCorreosCompras.bind(this));
        this.router.get(`${this.basePath}/getCotizacionesByIdFlotillasByUser/:idDireccionFlotillas/:idUsuario`, this.getCotizacionesByIdFlotillasByUser.bind(this));
        this.router.get(`${this.basePath}/getCotizacionById/:idCotizacion`, this.getCotizacionesById.bind(this));
        this.router.post(`${this.basePath}/insertCotizacion/:idTipoVenta/:idContrato`, this.insertCotizacion.bind(this));
        this.router.get(`${this.basePath}/unidadInteres/getAll/:idCotizacion`, this.getUnidadesInteresPorCotizacion.bind(this));
        const postApartarUnidadesInteresCreate = ajv
            .addSchema(postUnidadInteresCreate)
            .compile(postUnidadesInteresArrayCreate).schema;
        this.router.post(`${this.basePath}/solicitarApartadoUnidadInteresCreate/:idCotizacion/:idGrupoUnidad`, validate({ body: postApartarUnidadesInteresCreate }), this.solicitarApartadoUnidadInteresCreate.bind(this));
        const putApartarUnidadesInteresUpdate = ajv
            .addSchema(putUnidadInteresUpdate)
            .compile(putUnidadesInteresArrayUpdate).schema;
        this.router.put(`${this.basePath}/solicitarApartadoUnidadInteresUpdate/:idCotizacion/:idGrupoUnidad`, validate({ body: putApartarUnidadesInteresUpdate }), this.solicitarApartadoUnidadInteresUpdate.bind(this));
        const deleteApartarUnidadesInteresDelete = ajv
            .addSchema(deleteUnidadInteresDelete)
            .compile(deleteUnidadesInteresArrayDelete).schema;
        this.router.post(`${this.basePath}/solicitarApartadoUnidadInteresDelete/:idCotizacion/:idGrupoUnidad`, validate({ body: deleteApartarUnidadesInteresDelete }), this.solicitarApartadoUnidadInteresDelete.bind(this));
        this.router.post(`${this.basePath}/eliminarSolicitudApartadoUnidadesInteres`, validate({ body: postIntegerArray }), this.eliminarSolicitudApartadoUnidadesInteres.bind(this));
        this.router.delete(`${this.basePath}/grupoUnidades/:idCotizacion/:idGrupoUnidad`, this.deleteGrupoUnidad.bind(this));
        this.router.get(`${this.basePath}/existeLicitacion/:idLicitacion`, this.existeLicitacion.bind(this));
        this.router.get(`${this.basePath}/grupoUnidades/getGrupoUnidadByIdCotizacion/:idCotizacion`, this.getGrupoUnidadByIdCotizacion.bind(this));
        // OCT99
        this.router.get(`${this.basePath}/grupoUnidades/getUnidadesInteresByIdCotizacion/:idCotizacion`, this.getUnidadesInteresByIdCotizacion.bind(this));
        // OCT99
        this.router.get(`${this.basePath}/grupoUnidades/getUnidadesCierreByIdCotizacion/:idCotizacion`, this.getUnidadesCierreByIdCotizacion.bind(this));
        // OCT99
        this.router.get(`${this.basePath}/grupoUnidades/getUnidadesInteresGrupoByIdCotizacion/:idCotizacion`, this.getUnidadesInteresGrupoByIdCotizacion.bind(this));
        // OCT99
        this.router.get(`${this.basePath}/grupoUnidades/getAdicionalesCierrebyIdCotizacionGrupoUnidad/:idCotizacion/:idCotizacionGrupoUnidad`, this.getAdicionalesCierrebyIdCotizacionGrupoUnidad.bind(this));
        // OCT99
        this.router.get(`${this.basePath}/grupoUnidades/getDetalleUnidadGrupoByIdCotizacionGrupo/:idCotizacion/:idCotizacionGrupoUnidad`, this.getDetalleUnidadGrupoByIdCotizacionGrupo.bind(this));
        // OCT99 GESTION
        this.router.get(`${this.basePath}/gestionFlotillas/getAdicionalesGestionbyIdDetalleUnidad/:idCotizacion/:idCotizacionGrupoUnidad/:idDetalleUnidad`, this.getAdicionalesGestionbyIdDetalleUnidad.bind(this));
        // OCT99 GESTION
        this.router.get(`${this.basePath}/gestionFlotillas/getAdicionalesGestionbyGrupal/:idCotizacion/:idCotizacionGrupoUnidad`, this.getAdicionalesGestionbyGrupal.bind(this));
        // OCT99 GESTION
        this.router.get(`${this.basePath}/gestionFlotillas/getCotizacionGestionByIdCotizacion/:idCotizacion`, this.getCotizacionGestionByIdCotizacion.bind(this));
        this.router.post(`${this.basePath}/detalleUnidades/save/:pantalla`, this.saveCotizacionUnidadDetalle.bind(this));
        this.router.put(`${this.basePath}/detalleUnidades/update`, validate({ body: postDetalleUnidad }), this.updateCotizacionDetalleUnidad.bind(this));
        this.router.post(`${this.basePath}/grupoUnidades/save`, validate({ body: postGrupoUnidad }), this.saveGrupoUnidad.bind(this));
        const postValidaVinAsignadosData = ajv
            .addSchema(postValidaVinAsignados)
            .compile(postValidaVinAsignadosArray).schema;
        this.router.post(`${this.basePath}/validaVinAsignados`, validate({ body: postValidaVinAsignadosData }), this.validaVinAsignados.bind(this));
        this.router.put(`${this.basePath}/updateStep/:idCotizacion/:step`, this.updateCotizacionStep.bind(this));
        this.router.put(`${this.basePath}/updateCfdiAdicionales/:idCotizacion/:idCfdiAdicionales`, this.updateCotizacionCfdiAdicionales.bind(this));
        this.router.put(`${this.basePath}/updateTipoOrden/:idCotizacion/:tipoOrden`, this.updateCotizacionTipoOrden.bind(this));
        // OCT99 20200914 actualiza tipo de orden a nivel cotizacion y grupos cuando no tengan aun valores asignados
        this.router.put(`${this.basePath}/updateCotizacionGruposTipoOrden/:idCotizacion/:tipoOrden/:idCfdiAdicionales/:tipoCargoUnidad/:imprimeFactura`, this.updateCotizacionGruposTipoOrden.bind(this));
        // OCT99 20200914 actualiza tipo de orden a nivel grupo: idGrupoUnidad
        this.router.put(`${this.basePath}/updateGruposTipoOrden/:idCotizacion/:idGrupoUnidad/:tipoOrden/:idCfdiAdicionales/:tipoCargoUnidad/:imprimeFactura`, this.updateGruposTipoOrden.bind(this));
        const postEncPaquetesAccesorio = ajv
            .addSchema(postDetPaqueteAccesorio)
            .addSchema(postEncPaqueteAccesorio)
            .compile(postEncPaqueteAccesorioArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionGrupoAccesorios/:idCotizacion/:idGrupoUnidad`, validate({ body: postEncPaquetesAccesorio }), this.saveCotizacionGrupoAccesorios.bind(this));
        const postGrupoAccesoriosSinPaquete = ajv
            .addSchema(postGrupoAccesorioSinPaquete)
            .compile(postGrupoAccesorioSinPaqueteArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionGrupoAccesoriosSinPaquete`, validate({ body: postGrupoAccesoriosSinPaquete }), this.saveCotizacionGrupoAccesoriosSinPaquete.bind(this));
        const postGrupoAccesoriosSinPaqueteTodos = ajv
            .addSchema(postGrupoAccesorioSinPaqueteTodos)
            .compile(postGrupoAccesorioSinPaqueteArrayTodos).schema;
        this.router.post(`${this.basePath}/saveCotizacionGrupoAccesoriosSinPaqueteTodos`, validate({ body: postGrupoAccesoriosSinPaqueteTodos }), this.saveCotizacionGrupoAccesoriosSinPaqueteTodos.bind(this));
        this.router.delete(`${this.basePath}/deleteCotizacionGrupoPaqueteAccesorio/:idCotizacion/:idGrupoUnidad/:idEncPaqueteAccesorio`, this.deleteCotizacionEncabezadoPaquetesAccesorio.bind(this));
        this.router.post(`${this.basePath}/deleteCotizacionGrupoAccesorioSinPaquete`, this.deleteCotizacionGrupoAccesorioSinPaquete.bind(this));
        const postEncPaquetesTramite = ajv
            .addSchema(postDetPaqueteTramite)
            .addSchema(postEncPaqueteTramite)
            .compile(postEncPaqueteTramiteArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionGrupoTramite/:idCotizacion/:idGrupoUnidad`, validate({ body: postEncPaquetesTramite }), this.saveCotizacionGrupoTramite.bind(this));
        const postEncPaquetesTramiteTodos = ajv
            .addSchema(postDetPaqueteTramiteTodos)
            .compile(postEncPaqueteTramiteTodosArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionGrupoTramiteTodos/:idCotizacion/:idGrupoUnidad`, validate({ body: postEncPaquetesTramiteTodos }), this.saveCotizacionGrupoTramiteTodos.bind(this));
        const postGrupoTramitesSinPaquete = ajv
            .addSchema(postGrupoTramiteSinPaquete)
            .compile(postGrupoTramiteSinPaqueteArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionGrupoTramitesSinPaquete`, validate({ body: postGrupoTramitesSinPaquete }), this.saveCotizacionGrupoTramitesSinPaquete.bind(this));
        this.router.delete(`${this.basePath}/deleteCotizacionGrupoPaqueteTramite/:idCotizacion/:idGrupoUnidad/:idEncPaqueteTramite`, this.deleteCotizacionEncabezadoPaquetesTramite.bind(this));
        this.router.post(`${this.basePath}/deleteCotizacionGrupoTramiteSinPaquete`, this.deleteCotizacionGrupoTramiteSinPaquete.bind(this));
        const postEncPaquetesServicioUnidad = ajv
            .addSchema(postDetPaqueteServicioUnidad)
            .addSchema(postEncPaqueteServicioUnidad)
            .compile(postEncPaqueteServicioUnidadArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionGrupoServicioUnidad/:idCotizacion/:idGrupoUnidad`, validate({ body: postEncPaquetesServicioUnidad }), this.saveCotizacionGrupoServicioUnidad.bind(this));
        const postGrupoServicioUnidadsSinPaquete = ajv
            .addSchema(postGrupoServicioUnidadSinPaquete)
            .compile(postGrupoServicioUnidadSinPaqueteArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionGrupoServiciosUnidadSinPaquete`, validate({ body: postGrupoServicioUnidadsSinPaquete }), this.saveCotizacionGrupoServiciosUnidadSinPaquete.bind(this));
        this.router.delete(`${this.basePath}/deleteCotizacionGrupoPaqueteServicioUnidad/:idCotizacion/:idGrupoUnidad/:idEncPaqueteServicioUnidad`, this.deleteCotizacionEncabezadoPaquetesServicioUnidad.bind(this));
        this.router.post(`${this.basePath}/deleteCotizacionGrupoServicioUnidadSinPaquete`, this.deleteCotizacionGrupoServicioUnidadSinPaquete.bind(this));
        this.router.post(`${this.basePath}/traslados/save/:idUbicacionOrigen/:idUbicacionDestino`, validate({ body: postCotizacionTraslado }), this.saveCotizacionTraslado.bind(this));
        this.router.delete(`${this.basePath}/traslados/:idCotizacionTraslado`, this.deleteCotizacionTraslado.bind(this));
        this.router.get(`${this.basePath}/condicionesEntrega/:idCotizacion`, this.getCondicionesEntrega.bind(this));
        this.router.put(`${this.basePath}/condicionesEntrega/:idCotizacion`, validate({ body: condicionesEntregaSchema }), this.setCondicionesEntrega.bind(this));
        this.router.delete(`${this.basePath}/condicionesEntrega/:idCotizacion`, this.deleteCondicionesEntrega.bind(this));
        this.router.post(`${this.basePath}/cerrarCotizacion`, validate({ body: cierreCotizacionSchema }), this.cerrarCotizacion.bind(this));
        this.router.post(`${this.basePath}/enviarCorreo`, validate({ body: correoSchema }), this.enviarCotizacionEmail.bind(this));
        this.router.post(`${this.basePath}/enviarEmail`, 
        // validate({ body: correoSchema }),
        this.enviarEmail.bind(this));
        this.router.get(`${this.basePath}/asignarVinesApartados/:idCotizacion`, this.asignarVinesApartados.bind(this));
        this.router.get(`${this.basePath}/enviarControlDocumental/:idCotizacion`, this.enviarControlDocumental.bind(this));
        this.router.get(`${this.basePath}/enviarProduccion/:idCotizacion`, this.enviarProduccion.bind(this));
        this.router.get(`${this.basePath}/apartarUnidadesBpro/:idCotizacion`, this.apartarUnidadesBpro.bind(this));
        this.router.get(`${this.basePath}/desapartarUnidadesBpro/:idCotizacion`, this.desapartarUnidadesBpro.bind(this));
        const postApartarUnidadesGestion = ajv
            .addSchema(postUnidadGestionApartado)
            .compile(postUnidadGestionApartadoArray).schema;
        this.router.post(`${this.basePath}/apartarUnidadesGestion`, validate({ body: postApartarUnidadesGestion }), this.apartarUnidadesGestion.bind(this));
        this.router.post(`${this.basePath}/desapartarUnidadesGestion`, validate({ body: postApartarUnidadesGestion }), this.desapartarUnidadesGestion.bind(this));
        this.router.get(`${this.basePath}/getFechaMinimaPromesaEntrega/:idCotizacion/:idGrupoUnidad`, this.getFechaMinimaPromesaEntrega.bind(this));
        this.router.get(`${this.basePath}/getFacturacionUnidades/:idCotizacion`, this.getFacturacionUnidades.bind(this));
        const postCotizacionesUnidadAccesorioMov = ajv
            .addSchema(postCotizacionUnidadAccesorioMov)
            .compile(postCotizacionUnidadAccesorioMovArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionUnidadAccesorioMovs/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, validate({ body: postCotizacionesUnidadAccesorioMov }), this.saveCotizacionUnidadAccesorioMovs.bind(this));
        // OCT 99 GESTION
        this.router.post(`${this.basePath}/saveGestionUnidadAccesorioGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, 
        // validate({ body: postCotizacionesUnidadAccesorioMov }),
        this.saveGestionUnidadAccesorioGrupal.bind(this));
        // OCT 99 GESTION
        this.router.post(`${this.basePath}/deleteGestionUnidadAccesorioGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, validate({ body: postCotizacionesUnidadAccesorioMov }), this.deleteGestionUnidadAccesorioGrupal.bind(this));
        // OCT99 BORRA ACCESORIO POR UNIDAD GESTION - POSTERIOR
        // 20201106
        this.router.post(`${this.basePath}/deleteCotizacionUnidadAccesorioMovs`, this.deleteCotizacionUnidadAccesorioMovs.bind(this));
        // OCT99 BORRA TRAMITE POR UNIDAD GESTION - POSTERIOR
        // 20201106
        this.router.post(`${this.basePath}/deleteCotizacionUnidadTramiteMovs`, this.deleteCotizacionUnidadTramiteMovs.bind(this));
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201110
        this.router.post(`${this.basePath}/actualizaTipoOdenAccesorioGrupos`, this.actualizaTipoOdenAccesorioGrupos.bind(this));
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
        // 20201202
        this.router.post(`${this.basePath}/actualizaTipoOdenAccesorioGruposMovs`, this.actualizaTipoOdenAccesorioGruposMovs.bind(this));
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201110
        this.router.get(`${this.basePath}/getListadoAccesoriosGrupos/:idCotizacion/:idGrupoUnidad/:fuente`, this.getListadoAccesoriosGrupos.bind(this));
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201110
        this.router.post(`${this.basePath}/actualizaTipoOdenTramiteGrupos`, this.actualizaTipoOdenTramiteGrupos.bind(this));
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
        // 20201202
        this.router.post(`${this.basePath}/actualizaTipoOdenTramiteGruposMovs`, this.actualizaTipoOdenTramiteGruposMovs.bind(this));
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201110
        this.router.get(`${this.basePath}/getListadoTramitesGrupos/:idCotizacion/:idGrupoUnidad/:fuente`, this.getListadoTramitesGrupos.bind(this));
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201113
        this.router.post(`${this.basePath}/actualizaTipoOdenServicioGrupos`, this.actualizaTipoOdenServicioGrupos.bind(this));
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
        // 20201202
        this.router.post(`${this.basePath}/actualizaTipoOdenServicioGruposMovs`, this.actualizaTipoOdenServicioGruposMovs.bind(this));
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201113
        this.router.get(`${this.basePath}/getListadoServiciosGrupos/:idCotizacion/:idGrupoUnidad/:fuente`, this.getListadoServiciosGrupos.bind(this));
        const postCotizacionesUnidadTramiteMov = ajv
            .addSchema(postCotizacionUnidadTramiteMov)
            .compile(postCotizacionUnidadTramiteMovArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionUnidadTramiteMovs/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, validate({ body: postCotizacionesUnidadTramiteMov }), this.saveCotizacionUnidadTramiteMovs.bind(this));
        // OCT 99 GESTION
        this.router.post(`${this.basePath}/saveCotizacionUnidadTramiteGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, validate({ body: postCotizacionesUnidadTramiteMov }), this.saveCotizacionUnidadTramiteGrupal.bind(this));
        // LBM/COAL/16092021
        this.router.post(`${this.basePath}/saveCambioDeProveedor`, this.saveCambioDeProveedor.bind(this));
        // OCT 99 GESTION
        this.router.post(`${this.basePath}/deleteCotizacionUnidadTramiteGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, validate({ body: postCotizacionesUnidadTramiteMov }), this.deleteCotizacionUnidadTramiteGrupal.bind(this));
        const postCotizacionesUnidadServicioMov = ajv
            .addSchema(postCotizacionUnidadServicioMov)
            .compile(postCotizacionUnidadServicioMovArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionUnidadServicioMovs/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, validate({ body: postCotizacionesUnidadServicioMov }), this.saveCotizacionUnidadServicioMovs.bind(this));
        // OCT 99 GESTION
        this.router.post(`${this.basePath}/saveCotizacionUnidadServicioGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, validate({ body: postCotizacionesUnidadServicioMov }), this.saveCotizacionUnidadServicioGrupal.bind(this));
        // OCT 99 GESTION
        this.router.post(`${this.basePath}/deleteCotizacionUnidadServicioGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, validate({ body: postCotizacionesUnidadServicioMov }), this.deleteCotizacionUnidadServicioGrupal.bind(this));
        const postCotizacionesUnidadTraslado = ajv
            .addSchema(postCotizacionUnidadTrasladoMov)
            .compile(postCotizacionUnidadTrasladoMovArray).schema;
        this.router.post(`${this.basePath}/saveCotizacionTrasladoMovs/:idUbicacionOrigen/:idUbicacionDestino`, this.saveCotizacionUnidadTrasladoMovs.bind(this));
        this.router.delete(`${this.basePath}/deleteCotizacionTrasladosMov/:idCotizacionTraslado`, this.deleteCotizacionTrasladoMov.bind(this));
        this.router.delete(`${this.basePath}/deleteUnidadApartadaCotizacion/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, this.deleteUnidadApartadaCotizacion.bind(this));
        const postSaveLeyendaDetalleUnidadAjv = ajv
            .addSchema(postSaveLeyendaDetalleUnidad)
            .compile(postSaveLeyendaDetalleUnidadArray).schema;
        this.router.post(`${this.basePath}/saveLeyendaDetalleUnidad`, validate({ body: postSaveLeyendaDetalleUnidadAjv }), this.saveLeyendaDetalleUnidad.bind(this));
        this.router.get(`${this.basePath}/getLeyendaDetalleUnidad/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, this.getLeyendaDetalleUnidad.bind(this));
        const putDeleteStatusProcesadoBproAjv = ajv
            .addSchema(putDeleteStatusProcesadoBpro)
            .compile(putDeleteStatusProcesadoBproArray).schema;
        this.router.put(`${this.basePath}/deleteStatusProcesadoBpro`, validate({ body: putDeleteStatusProcesadoBproAjv }), this.deleteStatusProcesadoBpro.bind(this));
        this.router.get(`${this.basePath}/getEstatusOrdCompraUnidades/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, this.getEstatusOrdCompraUnidades.bind(this));
        this.router.get(`${this.basePath}/getEstatusOrdCompraRefacciones/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, this.getEstatusOrdCompraRefacciones.bind(this));
        const putAsignarVinDetalleUnidadAjv = ajv
            .addSchema(putAsignarVinDetalleUnidad)
            .compile(putasignarVinDetalleUnidadArray).schema;
        this.router.put(`${this.basePath}/asignarVinDetalleUnidad`, validate({ body: putAsignarVinDetalleUnidadAjv }), this.asignarVinDetalleUnidad.bind(this));
        this.router.get(`${this.basePath}/getVinAsignadoBpro/:idCotizacion/:idEmpresa/:idSucursal`, this.getVinAsignadoBpro.bind(this));
        this.router.get(`${this.basePath}/conteoGlobalUnidadesInteres/:idCotizacion/:idGrupoUnidad`, this.conteoGlobalUnidadesInteres.bind(this));
        const potClienteFacturacionAjv = ajv
            .addSchema(potClienteFacturacionSchema)
            .compile(potClienteFacturacionArray).schema;
        this.router.post(`${this.basePath}/clienteFacturacion`, validate({ body: potClienteFacturacionAjv }), this.clienteFacturacion.bind(this));
        this.router.post(`${this.basePath}/adicionalesFacturacion`, this.adicionalesFacturacion.bind(this));
        const postSumaTipoCargoUnidad = ajv
            .addSchema(postSumaTipoCargoUnidadSchema)
            .compile(postSumaTipoCargoUnidadArray).schema;
        this.router.post(`${this.basePath}/sumaTipoCargoUnidad`, validate({ body: postSumaTipoCargoUnidad }), this.sumaTipoCargoUnidad.bind(this));
        this.router.get(`${this.basePath}/creditoLimiteCliente/:idCotizacion/:idCliente`, this.creditoLimiteCliente.bind(this));
        this.router.get(`${this.basePath}/documentosVencidos/:idCotizacion/:idCliente`, this.documentosVencidos.bind(this));
        this.router.get(`${this.basePath}/validaDisponibleCierre/:idCotizacion`, this.validaDisponibleCierre.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/validaDisponibilidadInventario/:idCotizacion/:idDireccionFlotillas`, this.validaDisponibilidadInventario.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/validaDisponibilidadInventarioPost/:idCotizacion/:idDireccionFlotillas`, this.validaDisponibilidadInventarioPost.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/validaDisponibilidadInventarioPostUpdate/:idCotizacion/:idDireccionFlotillas`, this.validaDisponibilidadInventarioPostUpdate.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/validaDisponibilidadFolio/:idCotizacion/:idDireccionFlotillas`, this.validaDisponibilidadFolio.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/confirmaCancelacionAccesorio/:idCotizacion/:idDireccionFlotillas`, this.confirmaCancelacionAccesorio.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/insertaBitacoraUtilidad/:idCotizacion/:idOpcion`, this.insertaBitacoraUtilidad.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/insertaBitacoraUtilidadPosteriores/:idCotizacion/:idOpcion`, this.insertaBitacoraUtilidadPosteriores.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/insertaBitacoraUtilidadAdicionales/:idCotizacion/:idOpcion`, this.insertaBitacoraUtilidadAdicionales.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/validaNotificacionUtilidad/:idCotizacion/:idOpcion`, this.validaNotificacionUtilidad.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/obtenTotalUtilidad/:idCotizacion/:idOpcion`, this.obtenTotalUtilidad.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/validaBotonUtilidad/:idUsuario`, this.validaBotonUtilidad.bind(this));
        // Cambio P10 - EHJ-COAL
        this.router.get(`${this.basePath}/obtenNotificacion/:idCotizacion`, this.obtenNotificacion.bind(this));
        // LBM-COAL
        this.router.get(`${this.basePath}/validaPerfiles/:idCotizacion`, this.validaPerfiles.bind(this));
        // LBM-COAL
        this.router.get(`${this.basePath}/validaTipoOrden/:idCotizacion`, this.validaTipoOrden.bind(this));
        // LBM-COAL
        this.router.get(`${this.basePath}/validaUnidadFacturada/:idCotizacion`, this.validaUnidadFacturada.bind(this));
        // LBM-COAL
        this.router.get(`${this.basePath}/validaLimiteCredito/:idCotizacion`, this.validaLimiteCredito.bind(this));
        this.router.get(`${this.basePath}/obtieneMargenUtilidadTraslado/:direccionFlotilla`, this.obtieneMargenUtilidadTraslado.bind(this));
        this.router.delete(`${this.basePath}/deleteUnidadInteres/:idCotizacion/:vin`, this.deleteUnidadInteres.bind(this));
        const postNotificaionEnvAjv = ajv
            .addSchema(postNotificaionEnv)
            .compile(postNotificaionEnvArray).schema;
        this.router.post(`${this.basePath}/notificaionEnviada`, validate({ body: postNotificaionEnvAjv }), this.notificaionEnv.bind(this));
        const postActualizarBonificacionAjv = ajv
            .addSchema(postActualizarBonificacionSchema)
            .compile(postActualizarBonificacionArray).schema;
        this.router.post(`${this.basePath}/actualizarBonificacion`, validate({ body: postActualizarBonificacionAjv }), this.actualizarBonificacion.bind(this));
        const postActulizarImprimeFacturaAjv = ajv
            .addSchema(postActulizarImprimeFacturaSchema)
            .compile(postActulizarImprimeFacturaArray).schema;
        this.router.post(`${this.basePath}/actulizarImprimeFactura`, validate({ body: postActulizarImprimeFacturaAjv }), this.actulizarImprimeFactura.bind(this));
        this.router.get(`${this.basePath}/getCfdiListingByAgency/:idEmpresa`, this.getCfdiListingByAgency.bind(this));
        this.router.get(`${this.basePath}/getDataContract/:idCliente/:idEmpresa/:idSucursal`, this.getDataContract.bind(this));
        this.router.get(`${this.basePath}/get1erNotificacionCotizacion/:idCotizacion`, this.get1erNotificacionCotizacion.bind(this));
        this.router.put(`${this.basePath}/udpNotificacionCotizacion1er/:idCotizacion/:estatus`, this.udpNotificacionCotizacion1er.bind(this));
        this.router.get(`${this.basePath}/CancelaUnidadOrdenCompra/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`, this.CancelaUnidadOrdenCompra.bind(this));
        // OCT99 GESTION
        this.router.get(`${this.basePath}/getValidaRegresaCotizacion/:idCotizacion`, this.getValidaRegresaCotizacion.bind(this));
        // OCT99 GESTION
        this.router.get(`${this.basePath}/getRegresaCotizacion/:idCotizacion`, this.getRegresaCotizacion.bind(this));
        // OCT99 GESTION CANCELA COTIZACION
        this.router.get(`${this.basePath}/getCancelaCotizacion/:idCotizacion`, this.getCancelaCotizacion.bind(this));
        // OCT99 GESTION CANCELA GRUPO UNIDAD
        this.router.get(`${this.basePath}/getCancelaGrupoUnidad/:idCotizacion/:idGrupoUnidad`, this.getCancelaGrupoUnidad.bind(this));
        // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR GRUPO
        this.router.get(`${this.basePath}/getResumenPreCancelaGrupoUnidad/:idCotizacion/:idGrupoUnidad`, this.getResumenPreCancelaGrupoUnidad.bind(this));
        // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR COTIZACION
        this.router.get(`${this.basePath}/getResumenPreCancelaCotizacion/:idCotizacion`, this.getResumenPreCancelaCotizacion.bind(this));
        // SISCO
        // Servicio para validar si en la cotizacion existen accesorios pendientes - SISCO
        this.router.get(`${this.basePath}/validaAccesoriosSisco/:idCotizacion/:origen`, this.validaAccesoriosSisco.bind(this));
        // SISCO
        // CHK - 03 feb 21k Valida si existe ordenes pendientes y si hay trae el XML para enviarlo - SISCO
        this.router.get(`${this.basePath}/pendienteSisco/:idCotizacion`, this.getpendienteSisco.bind(this));
        // CHK - 04 feb 21k Valida si existe ordenes pendientes y si hay trae el XML para enviarlo - SISCO
        this.router.get(`${this.basePath}/estatusSisco/:idCotizacion`, this.getestatusSisco.bind(this));
        this.router.get(`${this.basePath}/cfdiCliente/:idEmpresa/:idSucursal/:idCliente/:idCotizacion`, this.cfdiCliente.bind(this));
    }
    updateCotizacionStep(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const step = Number(request.params.step);
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.updateCotizacionStep(idCotizacion, step).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    updateCotizacionCfdiAdicionales(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idCfdiAdicionales = request.params.idCfdiAdicionales;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.updateCotizacionCfdiAdicionales(idCotizacion, idCfdiAdicionales).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    updateCotizacionTipoOrden(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const tipoOrden = request.params.tipoOrden;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.updateCotizacionTipoOrden(idCotizacion, tipoOrden).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 20200914
    updateCotizacionGruposTipoOrden(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const tipoOrden = request.params.tipoOrden;
        const idCfdiAdicionales = request.params.idCfdiAdicionales;
        const tipoCargoUnidad = request.params.tipoCargoUnidad;
        const imprimeFactura = request.params.imprimeFactura;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.updateCotizacionGruposTipoOrden(idCotizacion, tipoOrden, idCfdiAdicionales, tipoCargoUnidad, imprimeFactura).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 20200914
    updateGruposTipoOrden(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const tipoOrden = request.params.tipoOrden;
        const idGrupoUnidad = Number((request.params.idGrupoUnidad) ? request.params.idGrupoUnidad : 0);
        const idCfdiAdicionales = request.params.idCfdiAdicionales;
        const tipoCargoUnidad = request.params.tipoCargoUnidad;
        const imprimeFactura = request.params.imprimeFactura;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.updateGruposTipoOrden(idCotizacion, idGrupoUnidad, tipoOrden, idCfdiAdicionales, tipoCargoUnidad, imprimeFactura).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getCotizaciones(response) {
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getAllCotizaciones().then((cotizaciones) => {
            response.status(200).send(cotizaciones);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getCotizacionesByIdFlotillas(request, response) {
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        cotizacionBussines.getAllCotizacionesByIdFlotillas(idDireccionFlotillas).then((cotizaciones) => {
            response.status(200).send(cotizaciones);
        }, (error) => {
            respuesta.error(request, response, 'Internal error', 500, error);
        });
    }
    // Envio de Correo LBM*
    getConsultaCorreosCompras(request, response) {
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        const idCotizacion = request.params.idCotizacion;
        cotizacionBussines.getConsultaCorreosCompras(idCotizacion).then((cotizaciones) => {
            response.status(200).send(cotizaciones);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getCotizacionesByIdFlotillasByUser(request, response) {
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        const idUsuario = parseInt(request.params.idUsuario, 0);
        cotizacionBussines.getAllCotizacionesByIdFlotillasByUser(idDireccionFlotillas, idUsuario).then((cotizaciones) => {
            response.status(200).send(cotizaciones);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getCotizacionesByIdLicitacion(request, response) {
        const idLicitacion = request.params.idLicitacion;
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.getCotizacionesByIdLicitacion(idLicitacion).then((cotizaciones) => {
            response.status(200).send(cotizaciones);
        }, (error) => {
            response.status(500).send({ type: 'error', body: error });
        });
    }
    getCotizacionesById(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getCotizacionById(idCotizacion).then((cotizacion) => {
            response.status(200).send(cotizacion);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    existeLicitacion(request, response) {
        const idLicitacion = request.params.idLicitacion;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.existeLicitacion(idLicitacion).then((res) => {
            response.json({ existeLicitacion: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    insertCotizacion(request, response) {
        const idTipoVenta = request.params.idTipoVenta;
        const idContrato = request.params.idContrato;
        const idCotizacionTraslado = request.params.idContrato;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body;
        data.map((element) => {
            element.idUsuario = element.idUsuario == undefined ? idUsuario : element.idUsuario;
            element.idUsuarioModificacion = idUsuario;
            element.fechaModificacion = new Date();
        });
        cotizacionBussines.insertCotizacion(data, idTipoVenta, idContrato).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getUnidadesInteresPorCotizacion(request, response) {
        const idCotizacion = (request.params.idCotizacion);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getUnidadesInteresPorCotizacion(idCotizacion).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    solicitarApartadoUnidadInteresCreate(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        const unidadesPorApartar = request.body;
        unidadesPorApartar.map((u) => { u.idUsuarioModificacion = idUsuario; u.fechaModificacion = new Date(); });
        inventarioUnidadBusiness.solicitarApartadoUnidadInteresCreate(idCotizacion, idGrupoUnidad, unidadesPorApartar).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    solicitarApartadoUnidadInteresUpdate(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        const unidadesPorApartar = request.body;
        unidadesPorApartar.map((u) => { u.idUsuarioModificacion = idUsuario; u.fechaModificacion = new Date(); });
        inventarioUnidadBusiness.solicitarApartadoUnidadInteresUpdate(idCotizacion, idGrupoUnidad, unidadesPorApartar).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    solicitarApartadoUnidadInteresDelete(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        const unidadesPorApartar = request.body;
        unidadesPorApartar.map((u) => { u.idUsuarioModificacion = idUsuario; u.fechaModificacion = new Date(); });
        inventarioUnidadBusiness.solicitarApartadoUnidadInteresDelete(idCotizacion, idGrupoUnidad, unidadesPorApartar).then((res) => {
            response.status(200).send(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    eliminarSolicitudApartadoUnidadesInteres(request, response) {
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        const unidadesPorEliminar = request.body;
        inventarioUnidadBusiness.eliminarSolicitudApartadoUnidadesInteres(unidadesPorEliminar).then((res) => {
            response.status(200).send(res.toString());
        }, (error) => {
            response.status(500).send(error);
        });
    }
    saveGrupoUnidad(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const grupoUnidad = request.body;
        grupoUnidad.idUsuarioModificacion = idUsuario;
        grupoUnidad.fechaModificacion = new Date();
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.saveGrupoUnidad(grupoUnidad).then((grupoUnidadSaved) => {
            response.json(grupoUnidadSaved);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    validaVinAsignados(request, response) {
        const grupoVines = request.body;
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.validaVinAsignados(grupoVines)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((err) => {
            response.status(500).json(err);
        });
    }
    getGrupoUnidadByIdCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getGrupoUnidadByIdCotizacion(idCotizacion).then(
        // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
        (cotizacionGrupoUnidad) => {
            response.status(200).send(cotizacionGrupoUnidad);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT99
    getUnidadesInteresByIdCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getUnidadesInteresByIdCotizacion(idCotizacion).then(
        // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
        (cotizacionGrupoUnidad) => {
            response.status(200).send(cotizacionGrupoUnidad);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT99
    getUnidadesCierreByIdCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getUnidadesCierreByIdCotizacion(idCotizacion).then(
        // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
        (cotizacionGrupoUnidad) => {
            response.status(200).send(cotizacionGrupoUnidad);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT99
    getUnidadesInteresGrupoByIdCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getUnidadesInteresGrupoByIdCotizacion(idCotizacion).then(
        // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
        (unidadesInteres) => {
            response.status(200).send(unidadesInteres);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT99
    getAdicionalesCierrebyIdCotizacionGrupoUnidad(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionGrupoUnidad = Number(request.params.idCotizacionGrupoUnidad);
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getAdicionalesCierrebyIdCotizacionGrupoUnidad(idCotizacion, idCotizacionGrupoUnidad).then(
        // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
        (adicionales) => {
            response.status(200).send(adicionales);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT99
    getDetalleUnidadGrupoByIdCotizacionGrupo(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionGrupoUnidad = Number(request.params.idCotizacionGrupoUnidad);
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getDetalleUnidadGrupoByIdCotizacionGrupo(idCotizacion, idCotizacionGrupoUnidad).then(
        // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
        (unidadesGrupo) => {
            response.status(200).send(unidadesGrupo);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT99 GESTION
    getCotizacionGestionByIdCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getCotizacionGestionByIdCotizacion(idCotizacion).then(
        // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
        (unidadesGrupo) => {
            response.status(200).send(unidadesGrupo);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT99 GESTION
    getAdicionalesGestionbyIdDetalleUnidad(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionGrupoUnidad = Number(request.params.idCotizacionGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getAdicionalesGestionbyIdDetalleUnidad(idCotizacion, idCotizacionGrupoUnidad, idDetalleUnidad).then(
        // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
        (adicionales) => {
            response.status(200).send(adicionales);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    // OCT99 GESTION
    getAdicionalesGestionbyGrupal(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idCotizacionGrupoUnidad = Number(request.params.idCotizacionGrupoUnidad);
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.getAdicionalesGestionbyGrupal(idCotizacion, idCotizacionGrupoUnidad).then(
        // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
        (adicionales) => {
            response.status(200).send(adicionales);
        }, (err) => {
            response.status(500).send(err);
        });
    }
    saveCotizacionUnidadDetalle(request, response) {
        const idCotizacionDetalle = request.body;
        const pantalla = request.params.pantalla;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.saveGruposDetalleUnidades(idCotizacionDetalle, pantalla)
            .then((cotizacionDetalleUnidad) => {
            response.status(200).json({ affectedRows: cotizacionDetalleUnidad });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    updateCotizacionDetalleUnidad(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const detalleUnidad = request.body;
        detalleUnidad.idUsuarioModificacion = idUsuario;
        detalleUnidad.fechaModificacion = new Date();
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.updateCotizacionDetalleUnidad(detalleUnidad)
            .then((cotizacionDetalleUnidad) => {
            response.status(200).json({ affectedRows: cotizacionDetalleUnidad });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    deleteGrupoUnidad(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.deleteGrupoUnidad(idCotizacion, idGrupoUnidad).then((deletedRows) => {
            response.json({ affectedRows: deletedRows });
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    saveCotizacionGrupoAccesorios(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const encsPaqueteAccesorio = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        encsPaqueteAccesorio.map((accesorio) => { accesorio.idUsuarioModificacion = idUsuario; accesorio.fechaModificacion = new Date(); });
        adicionalesBusiness.saveCotizacionGrupoAccesorio(idCotizacion, idGrupoUnidad, encsPaqueteAccesorio)
            .then((cotizacionGrupoAccesorio) => {
            response.status(200).json({ affectedRows: cotizacionGrupoAccesorio });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    saveCotizacionGrupoAccesoriosSinPaquete(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const accesoriosSinPaquete = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        accesoriosSinPaquete.map((accesorio) => { accesorio.idUsuarioModificacion = idUsuario; accesorio.fechaModificacion = new Date(); });
        adicionalesBusiness.saveCotizacionGrupoAccesoriosSinPaquete(accesoriosSinPaquete)
            .then((cotizacionUnidadAccesorio) => {
            response.status(200).json({ affectedRows: cotizacionUnidadAccesorio });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    saveCotizacionGrupoAccesoriosSinPaqueteTodos(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const accesoriosSinPaquete = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        accesoriosSinPaquete.map((accesorio) => { accesorio.idUsuarioModificacion = idUsuario; accesorio.fechaModificacion = new Date(); });
        adicionalesBusiness.saveCotizacionGrupoAccesoriosSinPaqueteTodos(accesoriosSinPaquete)
            .then((cotizacionUnidadAccesorio) => {
            response.status(200).json({ affectedRows: cotizacionUnidadAccesorio });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    deleteCotizacionEncabezadoPaquetesAccesorio(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idEncPaqueteAccesorio = Number(request.params.idEncPaqueteAccesorio);
        adicionalesBusiness.deleteCotizacionGrupoPaqueteAccesorio(idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio)
            .then((detallePaquetesAccesorio) => {
            response.status(200).json({ affectedRows: detallePaquetesAccesorio });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    deleteCotizacionGrupoAccesorioSinPaquete(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const cotizacionGrupoAccesorioSinPaquete = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        cotizacionGrupoAccesorioSinPaquete.idUsuarioModificacion = idUsuario;
        cotizacionGrupoAccesorioSinPaquete.fechaModificacion = new Date();
        adicionalesBusiness.deleteCotizacionGrupoAccesorioSinPaquete(cotizacionGrupoAccesorioSinPaquete)
            .then((cotizacionUnidadAccesorio) => {
            response.status(200).json({ affectedRows: cotizacionUnidadAccesorio });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    saveCotizacionGrupoTramite(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const encsPaqueteTramite = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        encsPaqueteTramite.map((tramite) => { tramite.idUsuarioModificacion = idUsuario; tramite.fechaModificacion = new Date(); });
        adicionalesBusiness.saveCotizacionGrupoTramite(idCotizacion, idGrupoUnidad, encsPaqueteTramite)
            .then((res) => {
            response.status(200).json({ affectedRows: res });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    saveCotizacionGrupoTramiteTodos(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const encsPaqueteTramite = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        encsPaqueteTramite.map((tramite) => { tramite.idUsuarioModificacion = idUsuario; tramite.fechaModificacion = new Date(); });
        adicionalesBusiness.saveCotizacionGrupoTramiteTodos(idCotizacion, idGrupoUnidad, encsPaqueteTramite)
            .then((res) => {
            response.status(200).json({ affectedRows: res });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    saveCotizacionGrupoTramitesSinPaquete(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const tramitesSinPaquete = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        tramitesSinPaquete.map((tramite) => { tramite.idUsuarioModificacion = idUsuario; tramite.fechaModificacion = new Date(); });
        adicionalesBusiness.saveCotizacionGrupoTramitesSinPaquete(tramitesSinPaquete)
            .then((res) => {
            response.status(200).json({ affectedRows: res });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    deleteCotizacionEncabezadoPaquetesTramite(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idEncPaqueteTramite = Number(request.params.idEncPaqueteTramite);
        adicionalesBusiness.deleteCotizacionGrupoPaqueteTramite(idCotizacion, idGrupoUnidad, idEncPaqueteTramite)
            .then((res) => {
            response.status(200).json({ affectedRows: res });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    deleteCotizacionGrupoTramiteSinPaquete(request, response) {
        const cotizacionBussiness = new cotizador_1.AdicionalesBusiness();
        const cotizacionGrupoTramiteSinPaquete = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        cotizacionGrupoTramiteSinPaquete.idUsuarioModificacion = idUsuario;
        cotizacionGrupoTramiteSinPaquete.fechaModificacion = new Date();
        cotizacionBussiness.deleteCotizacionGrupoTramiteSinPaquete(cotizacionGrupoTramiteSinPaquete)
            .then((res) => {
            response.status(200).json({ affectedRows: res });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    saveCotizacionGrupoServicioUnidad(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const encsPaqueteServicioUnidad = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        encsPaqueteServicioUnidad.map((servicioUnidad) => { servicioUnidad.idUsuarioModificacion = idUsuario; servicioUnidad.fechaModificacion = new Date(); });
        adicionalesBusiness.saveCotizacionGrupoServicioUnidad(idCotizacion, idGrupoUnidad, encsPaqueteServicioUnidad)
            .then((res) => {
            response.status(200).json({ affectedRows: res });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    saveCotizacionGrupoServiciosUnidadSinPaquete(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const serviciosSinPaquete = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        serviciosSinPaquete.map((tramite) => { tramite.idUsuarioModificacion = idUsuario; tramite.fechaModificacion = new Date(); });
        adicionalesBusiness.saveCotizacionGrupoServiciosUnidadSinPaquete(serviciosSinPaquete)
            .then((res) => {
            response.status(200).json({ affectedRows: res });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    deleteCotizacionEncabezadoPaquetesServicioUnidad(request, response) {
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idEncPaqueteServicioUnidad = Number(request.params.idEncPaqueteServicioUnidad);
        adicionalesBusiness.deleteCotizacionGrupoPaqueteServicioUnidad(idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad)
            .then((res) => {
            response.status(200).json({ affectedRows: res });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    deleteCotizacionGrupoServicioUnidadSinPaquete(request, response) {
        const cotizacionBussiness = new cotizador_1.AdicionalesBusiness();
        const cotizacionGrupoServicioUnidadSinPaquete = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        cotizacionGrupoServicioUnidadSinPaquete.idUsuarioModificacion = idUsuario;
        cotizacionGrupoServicioUnidadSinPaquete.fechaModificacion = new Date();
        cotizacionBussiness.deleteCotizacionGrupoServicioUnidadSinPaquete(cotizacionGrupoServicioUnidadSinPaquete)
            .then((res) => {
            response.status(200).json({ affectedRows: res });
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    saveCotizacionTraslado(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const cotizacionTraslado = request.body;
        cotizacionTraslado.idUsuarioModificacion = idUsuario;
        cotizacionTraslado.fechaModificacion = new Date();
        cotizacionTraslado.activo = true;
        const idUbicacionOrigen = Number(request.params.idUbicacionOrigen);
        const idUbicacionDestino = Number(request.params.idUbicacionDestino);
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.saveCotizacionTraslado(idUbicacionOrigen, idUbicacionDestino, cotizacionTraslado).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    deleteCotizacionTraslado(request, response) {
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.deleteCotizacionTraslado(idCotizacionTraslado).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getCondicionesEntrega(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const documentoBusiness = new repositorio_1.DocumentoBusiness('cotizacion');
        documentoBusiness.get(idCotizacion + '/condicionesEntrega.html').then((fileContent) => {
            response.status(200).send(fileContent);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    setCondicionesEntrega(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const content = request.body;
        const documentoBusiness = new repositorio_1.DocumentoBusiness('cotizacion');
        documentoBusiness.set(idCotizacion + '/condicionesEntrega.html', content.fileContent).then((isCreated) => {
            response.status(200).send(isCreated);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    deleteCondicionesEntrega(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const documentoBusiness = new repositorio_1.DocumentoBusiness('cotizacion');
        documentoBusiness.delete(idCotizacion + '/condicionesEntrega.html').then((deleteResponse) => {
            response.status(200).send(deleteResponse);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    cerrarCotizacion(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const cierreCotizacionRequest = request.body;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.cerrarCotizacion(idUsuario, cierreCotizacionRequest).then((identityCotizacion) => {
            response.status(200).send({ identityCotizacion });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    enviarCotizacionEmail(request, response) {
        const correo = request.body;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.enviarCotizacionEmail(correo).then((correoEnviado) => {
            response.status(200).send({ correoEnviado });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    enviarEmail(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield sendGrid_helpers_1.sendGridEMail({ emails: request.body.emails }, {
                cotizacion: request.body.cotizacion,
                idFlotilla: request.body.idFlotilla,
                link: request.body.link,
                ordenesSisco: request.body.ordenesSisco,
            });
            if (resp.errors) {
                response.status(500).send({ estatus: 'ERROR', mensaje: resp.errors });
            }
            else {
                response.status(200).send({ estatus: 'OK', mensaje: 'Correo enviado correctamente' });
            }
        });
    }
    asignarVinesApartados(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.asignarVinesApartados(idCotizacion).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    enviarControlDocumental(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.enviarControlDocumental(idCotizacion).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    enviarProduccion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.enviarProduccion(idCotizacion).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    apartarUnidadesBpro(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.apartarUnidadesBpro(idCotizacion).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    apartarUnidadesGestion(request, response) {
        const unidades = request.body;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.apartarUnidadesGestion(unidades).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    desapartarUnidadesBpro(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.desapartarUnidadesBpro(idCotizacion).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    desapartarUnidadesGestion(request, response) {
        const unidades = request.body;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.desapartarUnidadesGestion(unidades).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getFechaMinimaPromesaEntrega(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getFechaMinimaPromesaEntrega(idCotizacion, idGrupoUnidad).then((res) => {
            response.json({ minFechaPromesaEntrega: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    getFacturacionUnidades(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getFacturacionUnidades(idCotizacion).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 GESTION
    getValidaRegresaCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getValidaRegresaCotizacion(idCotizacion).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 GESTION
    getRegresaCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getRegresaCotizacion(idCotizacion).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OC99 GESTION CANCELA COTIZACION
    getCancelaCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getCancelaCotizacion(idCotizacion).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 GESTION CANCELA GRUPO UNIDAD
    getCancelaGrupoUnidad(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getCancelaGrupoUnidad(idCotizacion, idGrupoUnidad).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR GRUPO
    getResumenPreCancelaGrupoUnidad(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getResumenPreCancelaGrupoUnidad(idCotizacion, idGrupoUnidad).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR COTIZACION
    getResumenPreCancelaCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getResumenPreCancelaCotizacion(idCotizacion).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // SISCO
    // Servicio para validar si en la cotizacion existen accesorios pendientes - SISCO
    validaAccesoriosSisco(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const origen = Number(request.params.origen);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaAccesoriosSisco(idCotizacion, origen).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    saveCotizacionUnidadAccesorioMovs(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const accesorioMovs = request.body;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const accesoriosSinPaquete = request.body;
        accesorioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadAccesorioMovs(idCotizacion, idGrupoUnidad, idDetalleUnidad, accesorioMovs).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 BORRA ACCESORIO POR UNIDAD GESTION - POSTERIOR
    // 20201106
    deleteCotizacionUnidadAccesorioMovs(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const accesorioMovs = request.body;
        const idCotizacion = accesorioMovs[0].idCotizacion;
        const idGrupoUnidad = accesorioMovs[0].idGrupoUnidad;
        const idParte = accesorioMovs[0].idParte;
        const idAccesorioNuevo = accesorioMovs[0].idAccesorioNuevo;
        const idDetalleUnidad = accesorioMovs[0].idDetalleUnidad;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.deleteCotizacionUnidadAccesorioMovs(idCotizacion, idGrupoUnidad, idParte, idAccesorioNuevo, idDetalleUnidad).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 BORRA TRAMITE POR UNIDAD GESTION - POSTERIOR
    // 20201106
    deleteCotizacionUnidadTramiteMovs(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramiteMovs = request.body;
        const idCotizacion = tramiteMovs.idCotizacion;
        const idGrupoUnidad = tramiteMovs.idGrupoUnidad;
        const idTramite = tramiteMovs.idTramite;
        const idSubTramite = tramiteMovs.idSubtramite;
        const idDetalleUnidad = tramiteMovs.idDetalleUnidad;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.deleteCotizacionUnidadTramiteMovs(idCotizacion, idGrupoUnidad, idTramite, idSubTramite, idDetalleUnidad).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    getListadoAccesoriosGrupos(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const fuente = Number(request.params.fuente); // 1:cotizacion,2:gestion
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        adicionalesBusiness.getListadoAccesoriosGrupos(idCotizacion, idGrupoUnidad, fuente).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    actualizaTipoOdenAccesorioGrupos(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const accesorio = request.body;
        const idCotizacion = accesorio.idCotizacion;
        const idGrupoUnidad = accesorio.idGrupoUnidad;
        const idAccesorioNuevo = accesorio.idAccesorioNuevo;
        const idParte = accesorio.idParte;
        const tipoOrden = accesorio.tipoOrden;
        const tipoCargoUnidad = accesorio.tipoCargoUnidad;
        const imprimeFactura = accesorio.imprimeFactura;
        const idCfdi = accesorio.idCfdi;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenAccesorioGrupos(idCotizacion, idGrupoUnidad, idAccesorioNuevo, idParte, tipoOrden, tipoCargoUnidad, imprimeFactura, idCfdi).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
    // 20201202
    actualizaTipoOdenAccesorioGruposMovs(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const accesorio = request.body;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenAccesorioGruposMovs(accesorio).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    getListadoTramitesGrupos(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const fuente = Number(request.params.fuente);
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        adicionalesBusiness.getListadoTramitesGrupos(idCotizacion, idGrupoUnidad, fuente).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    actualizaTipoOdenTramiteGrupos(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramite = request.body;
        const idCotizacion = tramite.idCotizacion;
        const idGrupoUnidad = tramite.idGrupoUnidad;
        const idTramite = tramite.idTramite;
        const idSubtramite = tramite.idSubtramite;
        const tipoOrden = tramite.tipoOrden;
        const idCfdi = tramite.idCfdi;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenTramiteGrupos(idCotizacion, idGrupoUnidad, idTramite, idSubtramite, tipoOrden, idCfdi).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
    // 20201202
    actualizaTipoOdenTramiteGruposMovs(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramite = request.body;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenTramiteGruposMovs(tramite).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201113
    getListadoServiciosGrupos(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const fuente = Number(request.params.fuente);
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        adicionalesBusiness.getListadoServiciosGrupos(idCotizacion, idGrupoUnidad, fuente).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201113
    actualizaTipoOdenServicioGrupos(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const servicio = request.body;
        const idCotizacion = servicio.idCotizacion;
        const idGrupoUnidad = servicio.idGrupoUnidad;
        const idServicioUnidad = servicio.idServicioUnidad;
        const tipoOrden = servicio.tipoOrden;
        const tipoCargoUnidad = servicio.tipoCargoUnidad;
        const imprimeFactura = servicio.imprimeFactura;
        const idCfdi = servicio.idCfdi;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenServicioGrupos(idCotizacion, idGrupoUnidad, idServicioUnidad, tipoOrden, tipoCargoUnidad, idCfdi, imprimeFactura).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
    // 20201202
    actualizaTipoOdenServicioGruposMovs(request, response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const servicio = request.body;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenServicioGruposMovs(servicio).then((res) => {
            response.json(res);
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT 99 GESTION
    saveGestionUnidadAccesorioGrupal(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const accesorioMovs = request.body;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const accesoriosSinPaquete = request.body;
        accesorioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.saveGestionUnidadAccesorioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, accesorioMovs).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT 99 GESTION
    deleteGestionUnidadAccesorioGrupal(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const accesorioMovs = request.body;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        const accesoriosSinPaquete = request.body;
        accesorioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.deleteGestionUnidadAccesorioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, accesorioMovs).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    saveCotizacionUnidadTramiteMovs(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramiteMovs = request.body;
        const unidadTramites = request.body;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        tramiteMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadTramiteMovs(tramiteMovs).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT 99 GESTION
    saveCotizacionUnidadTramiteGrupal(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramiteMovs = request.body;
        const unidadTramites = request.body;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        tramiteMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadTramiteGrupal(tramiteMovs).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    saveCambioDeProveedor(request, response) {
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        const params = request.body;
        const tipo = params.tipo;
        const idCotizacion = params.idCotizacion;
        const idTramite = params.idTramite;
        const idSubtramiteOld = params.idSubtramiteOld;
        const proveedorNew = params.proveedorNew;
        const importeNew = params.importeNew;
        const idSubtramiteNew = params.idSubtramiteNew;
        cotizacionBussines.saveCambioDeProveedor(tipo, idCotizacion, idTramite, idSubtramiteOld, parseInt(proveedorNew, 10), parseFloat(importeNew), idSubtramiteNew).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT 99 GESTION
    deleteCotizacionUnidadTramiteGrupal(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramiteMovs = request.body;
        const unidadTramites = request.body;
        const adicionalesBusiness = new cotizador_1.AdicionalesBusiness();
        tramiteMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.deleteCotizacionUnidadTramiteGrupal(tramiteMovs).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // deleteCotizacionUnidadTramite(request: express.Request, response: express.Response) {
    //     const adicionalesBusiness = new AdicionalesBusiness();
    //     const tramiteMovs: CotizacionUnidadTramiteMov[] = [];
    //     tramiteMovs.push(request.body as CotizacionUnidadTramiteMov);
    //     const unidadTramite = request.body as CotizacionUnidadTramite;
    //     const cotizacionBusiness = new CotizadorBussiness();
    //     adicionalesBusiness.deleteCotizacionUnidadTramite(unidadTramite)
    //         .then((res: any) => {
    //             cotizacionBusiness.saveCotizacionUnidadTramiteMovs(tramiteMovs).then(
    //                 (resDelTramite) => {
    //                     response.json({ affectedRows: res });
    //                 }, (error) => {
    //                     response.status(500).send(error);
    //                 },
    //             );
    //         })
    //         .catch((err: any) => response.status(500).json(err));
    // }
    saveCotizacionUnidadServicioMovs(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const servicioMovs = request.body;
        servicioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadServicioMovs(idCotizacion, idGrupoUnidad, idDetalleUnidad, servicioMovs).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT 99 GESTION
    saveCotizacionUnidadServicioGrupal(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const servicioMovs = request.body;
        servicioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadServicioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, servicioMovs).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    // OCT 99 GESTION
    deleteCotizacionUnidadServicioGrupal(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const servicioMovs = request.body;
        servicioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.deleteCotizacionUnidadServicioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, servicioMovs).then((res) => {
            response.json({ affectedRows: res });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    saveCotizacionUnidadTrasladoMovs(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        const cotizacionTraslado = request.body;
        cotizacionTraslado.idUsuarioModificacion = idUsuario;
        cotizacionTraslado.fechaModificacion = new Date();
        cotizacionTraslado.activo = true;
        const idUbicacionOrigen = Number(request.params.idUbicacionOrigen);
        const idUbicacionDestino = Number(request.params.idUbicacionDestino);
        cotizacionBussines.getCotizacionTraslado(cotizacionTraslado.idProveedor, cotizacionTraslado.idCotizacion)
            .then((ct) => {
            let movimento = null;
            if (ct) {
                movimento = 'C';
            }
            cotizacionBussines.saveCotizacionTraslado(idUbicacionOrigen, idUbicacionDestino, cotizacionTraslado).then((resT) => {
                const trasladoMovs = new cotizador_2.CotizacionUnidadTrasladoMov();
                trasladoMovs.idCotizacion = resT.idCotizacion;
                trasladoMovs.idGrupoUnidad = resT.idGrupoUnidad;
                trasladoMovs.idTraslado = resT.idTraslado;
                trasladoMovs.idCotizacionTraslado = resT.idCotizacionTraslado;
                trasladoMovs.usuarioModificacion = idUsuario;
                trasladoMovs.tipoMovimiento = movimento ? movimento : 'A';
                trasladoMovs.fechaModificacion = new Date();
                cotizacionBusiness.saveCotizacionUnidadTrasladoMovs(trasladoMovs).then((res) => {
                    // response.json({ affectedRows: res });
                    response.json({ affectedRows: resT });
                }, (error) => {
                    response.status(500).send(error);
                });
            }, (error) => {
                response.status(500).send(error);
            });
        })
            .catch((err) => response.status(500).send(err));
    }
    deleteCotizacionTrasladoMov(request, response) {
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.deleteCotizacionTrasladoMov(idCotizacionTraslado).then((res) => {
            const cotizacionMov = new cotizador_2.CotizacionUnidadTrasladoMov();
            cotizacionMov.idCotizacion = res.idCotizacion;
            cotizacionMov.idGrupoUnidad = res.idGrupoUnidad;
            cotizacionMov.idTraslado = res.idTraslado;
            cotizacionMov.idCotizacionTraslado = res.idCotizacionTraslado;
            cotizacionMov.fechaModificacion = new Date();
            cotizacionMov.tipoMovimiento = 'B';
            cotizacionMov.usuarioModificacion = res.idUsuarioModificacion;
            cotizacionBussines.saveCotizacionUnidadTrasladoMovs(cotizacionMov).then(() => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            });
        }, (error) => {
            response.status(500).send(error);
        });
    }
    deleteUnidadApartadaCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.deleteUnidadApartadaCotizacion(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((res) => {
            response.status(200).json(res);
        }, (error) => {
            response.status(500).json(error);
        });
    }
    saveLeyendaDetalleUnidad(request, response) {
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const leyendaFactura = request.body.leyendaFactura;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.saveLeyendaDetalleUnidad(idCotizacion, idGrupoUnidad, idDetalleUnidad, leyendaFactura)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getLeyendaDetalleUnidad(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getLeyendaDetalleUnidad(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    deleteStatusProcesadoBpro(request, response) {
        const detalleUnidad = request.body;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        cotizacionBusiness.deleteStatusProcesadoBpro(detalleUnidad, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getEstatusOrdCompraUnidades(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getEstatusOrdCompraUnidades(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getEstatusOrdCompraRefacciones(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const inventarioUnidadBusiness = new catalogo_1.InventarioUnidadBusiness();
        inventarioUnidadBusiness.getEstatusOrdCompraRefacciones(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    asignarVinDetalleUnidad(request, response) {
        const detalleUnidad = request.body;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        cotizacionBusiness.asignarVinDetalleUnidad(detalleUnidad, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getVinAsignadoBpro(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idEmpresa = Number(request.params.idEmpresa);
        const idSucursal = Number(request.params.idSucursal);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getVinAsignadoBpro(idCotizacion, idEmpresa, idSucursal)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    conteoGlobalUnidadesInteres(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.conteoGlobalUnidadesInteres(idCotizacion, idGrupoUnidad)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    clienteFacturacion(request, response) {
        const idCotizacion = request.body.idCotizacion;
        const idCliente = Number(request.body.idCliente);
        const nombreCliente = request.body.nombreCliente;
        const idContacto = Number(request.body.idContacto);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.clienteFacturacion(idCotizacion, idCliente, nombreCliente, idContacto)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al Actualizar el Cliente a Facturar`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Factura Adicionales
    adicionalesFacturacion(request, response) {
        const idCotizacion = request.body.idCotizacion;
        const idClienteFacturaAdicionales = Number(request.body.idClienteFacturaAdicionales);
        const numeroOCAdicionales = request.body.numeroOCAdicionales;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.adicionalesFacturacion(idCotizacion, idClienteFacturaAdicionales, numeroOCAdicionales)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al Actualizar el Cliente a Facturar Adicionales`, 500, error);
            // response.status(500).json(error);
        });
    }
    sumaTipoCargoUnidad(request, response) {
        const idCotizacion = request.body.idCotizacion;
        const tipoCargoUnidad = request.body.tipoCargoUnidad;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.sumaTipoCargoUnidad(idCotizacion, tipoCargoUnidad)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al sumar tipo cargo unidad`, 500, error);
            // response.status(500).json(error);
        });
    }
    creditoLimiteCliente(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idCliente = Number(request.params.idCliente);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.creditoLimiteCliente(idCotizacion, idCliente)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al obtener credito limite`, 500, error);
            // response.status(500).json(error);
        });
    }
    documentosVencidos(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idCliente = Number(request.params.idCliente);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.documentosVencidos(idCotizacion, idCliente)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al obterner documentos vencidos`, 500, error);
            // response.status(500).json(error);
        });
    }
    notificaionEnv(request, response) {
        const idCotizacion = request.body.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.notificaionEnv(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error Al actualizar el Status de la Notificaion`, 500, error);
            // response.status(500).json(error);
        });
    }
    actualizarBonificacion(request, response) {
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const bonificacion = Number(request.body.bonificacion);
        const idBonificacion = request.body.idBonificacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.actualizarBonificacion(idCotizacion, idGrupoUnidad, bonificacion, idBonificacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error Al actualizar la bonificacion`, 500, error);
            // response.status(500).json(error);
        });
    }
    actulizarImprimeFactura(request, response) {
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const imprimeFactura = request.body.imprimeFactura;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.actulizarImprimeFactura(idCotizacion, idGrupoUnidad, idDetalleUnidad, imprimeFactura)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error Al actualizar imprime factura`, 500, error);
            // response.status(500).json(error);
        });
    }
    getCfdiListingByAgency(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getCfdiListingByAgency(idEmpresa)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al obtener el listado de CFDIS por id empresa`, 500, error);
            // response.status(500).json(error);
        });
    }
    getDataContract(request, response) {
        const idCliente = Number(request.params.idCliente);
        const idEmpresa = Number(request.params.idEmpresa);
        const idSucursal = Number(request.params.idSucursal);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.getDataContract(idCliente, idEmpresa, idSucursal)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al obtener el catalogo de contratos`, 500, error);
            // response.status(500).json(error);
        });
    }
    validaDisponibleCierre(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaDisponibleCierre(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al consultar vin disponible`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio P10 - EHJ-COAL
    validaDisponibilidadInventario(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaDisponibilidadInventario(idCotizacion, idDireccionFlotillas)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al consultar vin disponible`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio P10 - EHJ-COAL
    validaDisponibilidadInventarioPost(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaDisponibilidadInventarioPost(idCotizacion, idDireccionFlotillas)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al consultar vin disponible`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio P10 - EHJ-COAL
    validaDisponibilidadInventarioPostUpdate(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaDisponibilidadInventarioPostUpdate(idCotizacion, idDireccionFlotillas)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al consultar vin disponible`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio P10 - EHJ-COAL
    validaDisponibilidadFolio(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaDisponibilidadFolio(idCotizacion, idDireccionFlotillas)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al consultar vin disponible`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio P10 - EHJ-COAL
    confirmaCancelacionAccesorio(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idDireccionFlotillas = request.params.idDireccionFlotillas;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.confirmaCancelacionAccesorio(idCotizacion, idDireccionFlotillas)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al consultar vin disponible`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio P07 - EHJ-COAL
    insertaBitacoraUtilidad(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.insertaBitacoraUtilidad(idCotizacion, idOpcion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al insertar utilidad`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio P07 - EHJ-COAL
    insertaBitacoraUtilidadPosteriores(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.insertaBitacoraUtilidadPosteriores(idCotizacion, idOpcion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al insertar utilidad`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio P07 - EHJ-COAL
    validaNotificacionUtilidad(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaNotificacionUtilidad(idCotizacion, idOpcion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al insertar utilidad`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio Utilidad Total de la utilidad por vuelta - EHJ-COAL
    obtenTotalUtilidad(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.obtenTotalUtilidad(idCotizacion, idOpcion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al mostrar utilidad`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Valida Permiso para el boton de utilidad - EHJ-COAL
    validaBotonUtilidad(request, response) {
        const idUsuario = Number(request.params.idUsuario);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaBotonUtilidad(idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al mostrar utilidad`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio Utilidad Total de la utilidad por vuelta - EHJ-COAL
    obtenNotificacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.obtenNotificacion(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al mostrar utilidad`, 500, error);
            // response.status(500).json(error);
        });
    }
    // Cambio P07 - EHJ-COAL
    insertaBitacoraUtilidadAdicionales(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.insertaBitacoraUtilidadAdicionales(idCotizacion, idOpcion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al insertar utilidad`, 500, error);
            // response.status(500).json(error);
        });
    }
    // LBM-COAL
    validaPerfiles(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaPerfiles(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al validar los perfiles`, 500, error);
        });
    }
    // LBM-COAL
    validaTipoOrden(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaTipoOrden(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al validar el tipo de orden`, 500, error);
        });
    }
    // LBM-COAL
    validaUnidadFacturada(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaUnidadFacturada(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al validar la facturación de la unidad`, 500, error);
        });
    }
    // LBM-COAL
    validaLimiteCredito(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.validaLimiteCredito(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al validar el limite de credito de la cotizacion`, 500, error);
        });
    }
    obtieneMargenUtilidadTraslado(request, response) {
        const direccionFlotilla = request.params.direccionFlotilla;
        const cotizacionBusiness = new cotizador_1.CotizadorBussiness();
        cotizacionBusiness.obtieneMargenUtilidadTraslado(direccionFlotilla)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al obtener Margen de Utilidad Traslado`, 500, error);
            // response.status(500).json(error);
        });
    }
    deleteUnidadInteres(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const vin = request.params.vin;
        const cotizacionBussines = new cotizador_1.CotizadorBussiness();
        cotizacionBussines.deleteUnidadInteres(idCotizacion, vin)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            respuesta.error(request, response, `Error al eliminar la unidad de unidad interes`, 500, error);
        });
    }
    get1erNotificacionCotizacion(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.NotificacionCotizacion1er(idCotizacion)
            .then((res) => {
            if (res.notificacionCot1er === null) {
                res.notificacionCot1er = 0;
            }
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).send(error);
            // respuesta.console.error(request, response, `No se encontro Notificacion`, 500, error);
        });
    }
    udpNotificacionCotizacion1er(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const estatus = Number(request.params.estatus);
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.udpNotificacionCotizacion1er(idCotizacion, estatus)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).send(error);
            //  respuesta.console.error(request, response, `No se encontro Notificacion`, 500, error);
        });
    }
    CancelaUnidadOrdenCompra(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.CancelaUnidadOrdenCompra(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((resp) => {
            response.status(200).json(resp);
        })
            .catch((error) => {
            response.status(500).send(error);
            //  respuesta.console.error(request, response, `No se encontro Notificacion`, 500, error);
        });
    }
    getpendienteSisco(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.getpendienteSisco(idCotizacion)
            .then((resp) => {
            response.status(200).json(resp);
        })
            .catch((error) => {
            response.status(500).send(error);
        });
    }
    getestatusSisco(request, response) {
        const idCotizacion = request.params.idCotizacion;
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.getestatusSisco(idCotizacion)
            .then((resp) => {
            response.status(200).json(resp);
        })
            .catch((error) => {
            response.status(500).send(error);
        });
    }
    cfdiCliente(request, response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idSucursal = Number(request.params.idSucursal);
        const idCliente = Number(request.params.idCliente);
        const idCotizacion = request.params.idCotizacion;
        const cotizadorBussiness = new cotizador_1.CotizadorBussiness();
        cotizadorBussiness.cfdiCliente(idEmpresa, idSucursal, idCliente, idCotizacion)
            .then((resp) => {
            response.status(200).json(resp);
        })
            .catch((error) => {
            response.status(500).send(error);
        });
    }
}
exports.CotizadorController = CotizadorController;
//# sourceMappingURL=cotizador.controller.js.map