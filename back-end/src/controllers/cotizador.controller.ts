import express = require('express');
import { Validator } from 'express-json-validator-middleware';
import internal = require('stream');
import respuesta = require('../../network/response');
import { InventarioUnidadBusiness } from '../business/catalogo';
import { AdicionalesBusiness, CotizadorBussiness } from '../business/cotizador';
import { DocumentoBusiness } from '../business/repositorio';
import {
    EncPaqueteAccesorio, EncPaqueteServicioUnidad,
    EncPaqueteTramite, FacturacionUnidad, UnidadInteres,
} from '../db/model/catalogo';
import {
    Cotizacion, CotizacionDetalleUnidad,
    CotizacionGrupoAccesorioSinPaquete, CotizacionGrupoServicioUnidadSinPaquete, CotizacionGrupoTramiteSinPaquete,
    CotizacionGrupoUnidad, CotizacionTraslado, CotizacionUnidadAccesorioMov, CotizacionUnidadServicioUnidadMov,
    CotizacionUnidadTramite, CotizacionUnidadTramiteMov, CotizacionUnidadTrasladoMov,
} from '../db/model/cotizador';
import { sendGridEMail } from '../helpers/sendGrid.helpers';
import * as postDetPaqueteAccesorio from '../schemas/catalogo/det_paquete_accesorio.schema.json';
import * as postDetPaqueteServicioUnidad from '../schemas/catalogo/det_paquete_servicio_unidad.schema.json';
import * as postDetPaqueteTramite from '../schemas/catalogo/det_paquete_tramite.schema.json';
import * as postSaveLeyendaDetalleUnidad from '../schemas/catalogo/det_unidad_leyenda.schema.json';
import * as postSaveLeyendaDetalleUnidadArray from '../schemas/catalogo/det_unidad_leyenda_array.schema.json';
import * as postEncPaqueteAccesorio from '../schemas/catalogo/enc_paquete_accesorio.schema.json';
import * as postEncPaqueteAccesorioArray from '../schemas/catalogo/enc_paquete_accesorio_array.schema.json';
import * as postEncPaqueteServicioUnidad from '../schemas/catalogo/enc_paquete_servicio_unidad.schema.json';
import * as postEncPaqueteServicioUnidadArray from '../schemas/catalogo/enc_paquete_servicio_unidad_array.schema.json';
import * as postEncPaqueteTramite from '../schemas/catalogo/enc_paquete_tramite.schema.json';
import * as postEncPaqueteTramiteArray from '../schemas/catalogo/enc_paquete_tramite_array.schema.json';
import * as postDetPaqueteTramiteTodos from '../schemas/catalogo/enc_paquete_tramite_todos.schema.json';
import * as postEncPaqueteTramiteTodosArray from '../schemas/catalogo/enc_paquete_tramite_todos_array.schema.json';
import * as postUnidadInteresCreate from '../schemas/catalogo/unidad_interes_create.schema.json';
import * as postUnidadesInteresArrayCreate from '../schemas/catalogo/unidad_interes_create_array.schema.json';
import * as deleteUnidadInteresDelete from '../schemas/catalogo/unidad_interes_delete.schema.json';
import * as deleteUnidadesInteresArrayDelete from '../schemas/catalogo/unidad_interes_delete_array.schema.json';
import * as putUnidadInteresUpdate from '../schemas/catalogo/unidad_interes_update.schema.json';
import * as putUnidadesInteresArrayUpdate from '../schemas/catalogo/unidad_interes_update_array.schema.json';
import * as correoSchema from '../schemas/correo.schema.json';
import * as postActualizarBonificacionSchema from '../schemas/cotizador/actualizar_bonificacion.schema.json';
import * as postActualizarBonificacionArray from '../schemas/cotizador/actualizar_bonificacion_array.schema.json';
import * as postActulizarImprimeFacturaSchema from '../schemas/cotizador/actualizar_imprime_factura.schema.json';
import * as postActulizarImprimeFacturaArray from '../schemas/cotizador/actualizar_imprime_factura_array.schema.json';
import * as cierreCotizacionSchema from '../schemas/cotizador/cierre_cotizacion.schema.json';
import * as potClienteFacturacionSchema from '../schemas/cotizador/cliente_factura.schema.json';
import * as potClienteFacturacionArray from '../schemas/cotizador/cliente_factura_array.schema.json';
import * as condicionesEntregaSchema from '../schemas/cotizador/condiciones_entrega.schema.json';
import * as postDetalleUnidad from '../schemas/cotizador/cotizacion_detalle_unidad.schema.json';
import * as postGrupoAccesorioSinPaquete from '../schemas/cotizador/cotizacion_grupo_accesorio_sin_paquete.schema.json';
import * as postGrupoAccesorioSinPaqueteArray from '../schemas/cotizador/cotizacion_grupo_accesorio_sin_paquete_array.schema.json';
import * as postGrupoAccesorioSinPaqueteTodos from '../schemas/cotizador/cotizacion_grupo_accesorio_sin_paquete_todos.schema.json';
import * as postGrupoAccesorioSinPaqueteArrayTodos from '../schemas/cotizador/cotizacion_grupo_accesorio_sin_paquete_todos_array.schema.json';
import * as postGrupoServicioUnidadSinPaquete from '../schemas/cotizador/cotizacion_grupo_servicio_unidad_sin_paquete.schema.json';
import * as postGrupoServicioUnidadSinPaqueteArray from '../schemas/cotizador/cotizacion_grupo_servicio_unidad_sin_paquete_array.schema.json';
import * as postGrupoTramiteSinPaquete from '../schemas/cotizador/cotizacion_grupo_tramite_sin_paquete.schema.json';
import * as postGrupoTramiteSinPaqueteArray from '../schemas/cotizador/cotizacion_grupo_tramite_sin_paquete_array.schema.json';
import * as postGrupoUnidad from '../schemas/cotizador/cotizacion_grupo_unidad.schema.json';
import * as postCotizacionTraslado from '../schemas/cotizador/cotizacion_traslado.schema.json';
import * as postCotizacionUnidadAccesorioMov from '../schemas/cotizador/cotizacion_unidad_accesorio_mov.schema.json';
import * as postCotizacionUnidadAccesorioMovArray from '../schemas/cotizador/cotizacion_unidad_accesorio_mov_array.schema.json';
import * as postCotizacionUnidadServicioMov from '../schemas/cotizador/cotizacion_unidad_servicio_unidad_mov.schema.json';
import * as postCotizacionUnidadServicioMovArray from '../schemas/cotizador/cotizacion_unidad_servicio_unidad_mov_array.schema.json';
import * as postCotizacionUnidadTramiteMov from '../schemas/cotizador/cotizacion_unidad_tramite_mov.schema.json';
import * as postCotizacionUnidadTramiteMovArray from '../schemas/cotizador/cotizacion_unidad_tramite_mov_array.schema.json';
import * as postCotizacionUnidadTrasladoMov from '../schemas/cotizador/cotizacion_unidad_traslado_mov.schema.json';
import * as postCotizacionUnidadTrasladoMovArray from '../schemas/cotizador/cotizacion_unidad_traslado_mov_array.schema.json';
import * as postCreditoLimiteClienteSchema from '../schemas/cotizador/credito_limite_cliente.schema.json';
import * as postCreditoLimiteClienteArray from '../schemas/cotizador/credito_limite_cliente_array.schema.json';
import * as putAsignarVinDetalleUnidad from '../schemas/cotizador/detalle_unidad_asigna_vin.schema.json';
import * as putasignarVinDetalleUnidadArray from '../schemas/cotizador/detalle_unidad_asigna_vin_array.schema.json';
import * as putDeleteStatusProcesadoBpro from '../schemas/cotizador/detalle_unidad_procesadoBpro.schema.json';
import * as putDeleteStatusProcesadoBproArray from '../schemas/cotizador/detalle_unidad_procesadoBpro_array.schema.json';
import * as postDocumentosVencidosSchema from '../schemas/cotizador/documentos_vencidos.schema.json';
import * as postDocumentosVencidosArray from '../schemas/cotizador/documentos_vencidos_array.schema.json';
import * as postNotificaionEnv from '../schemas/cotizador/envia_notificaciones.schema.json';
import * as postNotificaionEnvArray from '../schemas/cotizador/envia_notificaciones_array.schema.json';
import * as postSumaTipoCargoUnidadSchema from '../schemas/cotizador/suma_tipo_cargo_unidad.schema.json';
import * as postSumaTipoCargoUnidadArray from '../schemas/cotizador/suma_tipo_cargo_unidad_array.schema.json';
import * as postUnidadGestionApartado from '../schemas/cotizador/unidad_gestion_apartado.schema.json';
import * as postUnidadGestionApartadoArray from '../schemas/cotizador/unidad_gestion_apartado_array.schema.json';
import * as postValidaVinAsignados from '../schemas/cotizador/valida_vin_asignados.schema.json';
import * as postValidaVinAsignadosArray from '../schemas/cotizador/valida_vin_asignados_array.schema.json';
import * as postIntegerArray from '../schemas/integer_array.schema.json';

import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class CotizadorController extends BaseController implements IController {
    basePath = '/cotizador';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        const validator = new Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        this.router.get(
            `${this.basePath}/getCotizaciones`, this.getCotizaciones.bind(this),
        );
        this.router.get(
            `${this.basePath}/getCotizacionesByIdLicitacion/:idLicitacion`, this.getCotizacionesByIdLicitacion.bind(this),
        );
        this.router.get(
            `${this.basePath}/getCotizacionesByIdFlotillas/:idDireccionFlotillas`, this.getCotizacionesByIdFlotillas.bind(this),
        );
        // Envio de Correo LBM*
        this.router.get(
            `${this.basePath}/getConsultaCorreosCompras/:idCotizacion`, this.getConsultaCorreosCompras.bind(this),
        );
        this.router.get(
            `${this.basePath}/getCotizacionesByIdFlotillasByUser/:idDireccionFlotillas/:idUsuario`, this.getCotizacionesByIdFlotillasByUser.bind(this),
        );
        this.router.get(
            `${this.basePath}/getCotizacionById/:idCotizacion`, this.getCotizacionesById.bind(this),
        );
        this.router.post(
            `${this.basePath}/insertCotizacion/:idTipoVenta/:idContrato`, this.insertCotizacion.bind(this),
        );
        this.router.get(
            `${this.basePath}/unidadInteres/getAll/:idCotizacion`,
            this.getUnidadesInteresPorCotizacion.bind(this),
        );
        const postApartarUnidadesInteresCreate = ajv
            .addSchema(postUnidadInteresCreate)
            .compile(postUnidadesInteresArrayCreate).schema;
        this.router.post(
            `${this.basePath}/solicitarApartadoUnidadInteresCreate/:idCotizacion/:idGrupoUnidad`,
            validate({ body: postApartarUnidadesInteresCreate }),
            this.solicitarApartadoUnidadInteresCreate.bind(this),
        );
        const putApartarUnidadesInteresUpdate = ajv
            .addSchema(putUnidadInteresUpdate)
            .compile(putUnidadesInteresArrayUpdate).schema;
        this.router.put(
            `${this.basePath}/solicitarApartadoUnidadInteresUpdate/:idCotizacion/:idGrupoUnidad`,
            validate({ body: putApartarUnidadesInteresUpdate }),
            this.solicitarApartadoUnidadInteresUpdate.bind(this),
        );
        const deleteApartarUnidadesInteresDelete = ajv
            .addSchema(deleteUnidadInteresDelete)
            .compile(deleteUnidadesInteresArrayDelete).schema;
        this.router.post(
            `${this.basePath}/solicitarApartadoUnidadInteresDelete/:idCotizacion/:idGrupoUnidad`,
            validate({ body: deleteApartarUnidadesInteresDelete }),
            this.solicitarApartadoUnidadInteresDelete.bind(this),
        );
        this.router.post(
            `${this.basePath}/eliminarSolicitudApartadoUnidadesInteres`,
            validate({ body: postIntegerArray }),
            this.eliminarSolicitudApartadoUnidadesInteres.bind(this),
        );
        this.router.delete(
            `${this.basePath}/grupoUnidades/:idCotizacion/:idGrupoUnidad`,
            this.deleteGrupoUnidad.bind(this),
        );
        this.router.get(
            `${this.basePath}/existeLicitacion/:idLicitacion`,
            this.existeLicitacion.bind(this),
        );

        this.router.get(
            `${this.basePath}/grupoUnidades/getGrupoUnidadByIdCotizacion/:idCotizacion`,
            this.getGrupoUnidadByIdCotizacion.bind(this),
        );
        // OCT99
        this.router.get(
            `${this.basePath}/grupoUnidades/getUnidadesInteresByIdCotizacion/:idCotizacion`,
            this.getUnidadesInteresByIdCotizacion.bind(this),
        );

        // OCT99
        this.router.get(
            `${this.basePath}/grupoUnidades/getUnidadesCierreByIdCotizacion/:idCotizacion`,
            this.getUnidadesCierreByIdCotizacion.bind(this),
        );

        // OCT99
        this.router.get(
            `${this.basePath}/grupoUnidades/getUnidadesInteresGrupoByIdCotizacion/:idCotizacion`,
            this.getUnidadesInteresGrupoByIdCotizacion.bind(this),
        );

        // OCT99
        this.router.get(
            `${this.basePath}/grupoUnidades/getAdicionalesCierrebyIdCotizacionGrupoUnidad/:idCotizacion/:idCotizacionGrupoUnidad`,
            this.getAdicionalesCierrebyIdCotizacionGrupoUnidad.bind(this),
        );

        // OCT99
        this.router.get(
            `${this.basePath}/grupoUnidades/getDetalleUnidadGrupoByIdCotizacionGrupo/:idCotizacion/:idCotizacionGrupoUnidad`,
            this.getDetalleUnidadGrupoByIdCotizacionGrupo.bind(this),
        );

        // OCT99 GESTION
        this.router.get(
            `${this.basePath}/gestionFlotillas/getAdicionalesGestionbyIdDetalleUnidad/:idCotizacion/:idCotizacionGrupoUnidad/:idDetalleUnidad`,
            this.getAdicionalesGestionbyIdDetalleUnidad.bind(this),
        );

        // OCT99 GESTION
        this.router.get(
            `${this.basePath}/gestionFlotillas/getAdicionalesGestionbyGrupal/:idCotizacion/:idCotizacionGrupoUnidad`,
            this.getAdicionalesGestionbyGrupal.bind(this),
        );

        // OCT99 GESTION
        this.router.get(
            `${this.basePath}/gestionFlotillas/getCotizacionGestionByIdCotizacion/:idCotizacion`,
            this.getCotizacionGestionByIdCotizacion.bind(this),
        );

        this.router.post(
            `${this.basePath}/detalleUnidades/save/:pantalla`,
            this.saveCotizacionUnidadDetalle.bind(this),
        );

        this.router.put(
            `${this.basePath}/detalleUnidades/update`,
            validate({ body: postDetalleUnidad }),
            this.updateCotizacionDetalleUnidad.bind(this),
        );

        this.router.post(
            `${this.basePath}/grupoUnidades/save`,
            validate({ body: postGrupoUnidad }),
            this.saveGrupoUnidad.bind(this),
        );

        const postValidaVinAsignadosData = ajv
            .addSchema(postValidaVinAsignados)
            .compile(postValidaVinAsignadosArray).schema;
        this.router.post(
            `${this.basePath}/validaVinAsignados`,
            validate({ body: postValidaVinAsignadosData }),
            this.validaVinAsignados.bind(this),
        );

        this.router.put(
            `${this.basePath}/updateStep/:idCotizacion/:step`,
            this.updateCotizacionStep.bind(this),
        );

        this.router.put(
            `${this.basePath}/updateCfdiAdicionales/:idCotizacion/:idCfdiAdicionales`,
            this.updateCotizacionCfdiAdicionales.bind(this),
        );

        this.router.put(
            `${this.basePath}/updateTipoOrden/:idCotizacion/:tipoOrden`,
            this.updateCotizacionTipoOrden.bind(this),
        );
        // OCT99 20200914 actualiza tipo de orden a nivel cotizacion y grupos cuando no tengan aun valores asignados
        this.router.put(
            `${this.basePath}/updateCotizacionGruposTipoOrden/:idCotizacion/:tipoOrden/:idCfdiAdicionales/:tipoCargoUnidad/:imprimeFactura`,
            this.updateCotizacionGruposTipoOrden.bind(this),
        );
        // OCT99 20200914 actualiza tipo de orden a nivel grupo: idGrupoUnidad
        this.router.put(
            `${this.basePath}/updateGruposTipoOrden/:idCotizacion/:idGrupoUnidad/:tipoOrden/:idCfdiAdicionales/:tipoCargoUnidad/:imprimeFactura`,
            this.updateGruposTipoOrden.bind(this),
        );

        const postEncPaquetesAccesorio = ajv
            .addSchema(postDetPaqueteAccesorio)
            .addSchema(postEncPaqueteAccesorio)
            .compile(postEncPaqueteAccesorioArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionGrupoAccesorios/:idCotizacion/:idGrupoUnidad`,
            validate({ body: postEncPaquetesAccesorio }),
            this.saveCotizacionGrupoAccesorios.bind(this),
        );

        const postGrupoAccesoriosSinPaquete = ajv
            .addSchema(postGrupoAccesorioSinPaquete)
            .compile(postGrupoAccesorioSinPaqueteArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionGrupoAccesoriosSinPaquete`,
            validate({ body: postGrupoAccesoriosSinPaquete }),
            this.saveCotizacionGrupoAccesoriosSinPaquete.bind(this),
        );

        const postGrupoAccesoriosSinPaqueteTodos = ajv
            .addSchema(postGrupoAccesorioSinPaqueteTodos)
            .compile(postGrupoAccesorioSinPaqueteArrayTodos).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionGrupoAccesoriosSinPaqueteTodos`,
            validate({ body: postGrupoAccesoriosSinPaqueteTodos }),
            this.saveCotizacionGrupoAccesoriosSinPaqueteTodos.bind(this),
        );

        this.router.delete(
            `${this.basePath}/deleteCotizacionGrupoPaqueteAccesorio/:idCotizacion/:idGrupoUnidad/:idEncPaqueteAccesorio`,
            this.deleteCotizacionEncabezadoPaquetesAccesorio.bind(this),
        );

        this.router.post(
            `${this.basePath}/deleteCotizacionGrupoAccesorioSinPaquete`,
            this.deleteCotizacionGrupoAccesorioSinPaquete.bind(this),
        );

        const postEncPaquetesTramite = ajv
            .addSchema(postDetPaqueteTramite)
            .addSchema(postEncPaqueteTramite)
            .compile(postEncPaqueteTramiteArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionGrupoTramite/:idCotizacion/:idGrupoUnidad`,
            validate({ body: postEncPaquetesTramite }),
            this.saveCotizacionGrupoTramite.bind(this),
        );

        const postEncPaquetesTramiteTodos = ajv
            .addSchema(postDetPaqueteTramiteTodos)
            .compile(postEncPaqueteTramiteTodosArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionGrupoTramiteTodos/:idCotizacion/:idGrupoUnidad`,
            validate({ body: postEncPaquetesTramiteTodos }),
            this.saveCotizacionGrupoTramiteTodos.bind(this),
        );

        const postGrupoTramitesSinPaquete = ajv
            .addSchema(postGrupoTramiteSinPaquete)
            .compile(postGrupoTramiteSinPaqueteArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionGrupoTramitesSinPaquete`,
            validate({ body: postGrupoTramitesSinPaquete }),
            this.saveCotizacionGrupoTramitesSinPaquete.bind(this),
        );

        this.router.delete(
            `${this.basePath}/deleteCotizacionGrupoPaqueteTramite/:idCotizacion/:idGrupoUnidad/:idEncPaqueteTramite`,
            this.deleteCotizacionEncabezadoPaquetesTramite.bind(this),
        );

        this.router.post(
            `${this.basePath}/deleteCotizacionGrupoTramiteSinPaquete`,
            this.deleteCotizacionGrupoTramiteSinPaquete.bind(this),
        );

        const postEncPaquetesServicioUnidad = ajv
            .addSchema(postDetPaqueteServicioUnidad)
            .addSchema(postEncPaqueteServicioUnidad)
            .compile(postEncPaqueteServicioUnidadArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionGrupoServicioUnidad/:idCotizacion/:idGrupoUnidad`,
            validate({ body: postEncPaquetesServicioUnidad }),
            this.saveCotizacionGrupoServicioUnidad.bind(this),
        );

        const postGrupoServicioUnidadsSinPaquete = ajv
            .addSchema(postGrupoServicioUnidadSinPaquete)
            .compile(postGrupoServicioUnidadSinPaqueteArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionGrupoServiciosUnidadSinPaquete`,
            validate({ body: postGrupoServicioUnidadsSinPaquete }),
            this.saveCotizacionGrupoServiciosUnidadSinPaquete.bind(this),
        );

        this.router.delete(
            `${this.basePath}/deleteCotizacionGrupoPaqueteServicioUnidad/:idCotizacion/:idGrupoUnidad/:idEncPaqueteServicioUnidad`,
            this.deleteCotizacionEncabezadoPaquetesServicioUnidad.bind(this),
        );

        this.router.post(
            `${this.basePath}/deleteCotizacionGrupoServicioUnidadSinPaquete`,
            this.deleteCotizacionGrupoServicioUnidadSinPaquete.bind(this),
        );

        this.router.post(
            `${this.basePath}/traslados/save/:idUbicacionOrigen/:idUbicacionDestino`,
            validate({ body: postCotizacionTraslado }),
            this.saveCotizacionTraslado.bind(this),
        );

        this.router.delete(
            `${this.basePath}/traslados/:idCotizacionTraslado`,
            this.deleteCotizacionTraslado.bind(this),
        );

        this.router.get(
            `${this.basePath}/condicionesEntrega/:idCotizacion`,
            this.getCondicionesEntrega.bind(this),
        );

        this.router.put(
            `${this.basePath}/condicionesEntrega/:idCotizacion`,
            validate({ body: condicionesEntregaSchema }),
            this.setCondicionesEntrega.bind(this),
        );

        this.router.delete(
            `${this.basePath}/condicionesEntrega/:idCotizacion`,
            this.deleteCondicionesEntrega.bind(this),
        );

        this.router.post(
            `${this.basePath}/cerrarCotizacion`,
            validate({ body: cierreCotizacionSchema }),
            this.cerrarCotizacion.bind(this),
        );

        this.router.post(
            `${this.basePath}/enviarCorreo`,
            validate({ body: correoSchema }),
            this.enviarCotizacionEmail.bind(this),
        );
        this.router.post(
            `${this.basePath}/enviarEmail`,
            // validate({ body: correoSchema }),
            this.enviarEmail.bind(this),
        );

        this.router.get(
            `${this.basePath}/asignarVinesApartados/:idCotizacion`,
            this.asignarVinesApartados.bind(this),
        );

        this.router.get(
            `${this.basePath}/enviarControlDocumental/:idCotizacion`,
            this.enviarControlDocumental.bind(this),
        );

        this.router.get(
            `${this.basePath}/enviarProduccion/:idCotizacion`,
            this.enviarProduccion.bind(this),
        );

        this.router.get(
            `${this.basePath}/apartarUnidadesBpro/:idCotizacion`,
            this.apartarUnidadesBpro.bind(this),
        );

        this.router.get(
            `${this.basePath}/desapartarUnidadesBpro/:idCotizacion`,
            this.desapartarUnidadesBpro.bind(this),
        );

        const postApartarUnidadesGestion = ajv
            .addSchema(postUnidadGestionApartado)
            .compile(postUnidadGestionApartadoArray).schema;

        this.router.post(
            `${this.basePath}/apartarUnidadesGestion`,
            validate({ body: postApartarUnidadesGestion }),
            this.apartarUnidadesGestion.bind(this),
        );

        this.router.post(
            `${this.basePath}/desapartarUnidadesGestion`,
            validate({ body: postApartarUnidadesGestion }),
            this.desapartarUnidadesGestion.bind(this),
        );

        this.router.get(
            `${this.basePath}/getFechaMinimaPromesaEntrega/:idCotizacion/:idGrupoUnidad`,
            this.getFechaMinimaPromesaEntrega.bind(this),
        );

        this.router.get(
            `${this.basePath}/getFacturacionUnidades/:idCotizacion`,
            this.getFacturacionUnidades.bind(this),
        );

        const postCotizacionesUnidadAccesorioMov = ajv
            .addSchema(postCotizacionUnidadAccesorioMov)
            .compile(postCotizacionUnidadAccesorioMovArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionUnidadAccesorioMovs/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            validate({ body: postCotizacionesUnidadAccesorioMov }),
            this.saveCotizacionUnidadAccesorioMovs.bind(this),
        );

        // OCT 99 GESTION
        this.router.post(
            `${this.basePath}/saveGestionUnidadAccesorioGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            // validate({ body: postCotizacionesUnidadAccesorioMov }),
            this.saveGestionUnidadAccesorioGrupal.bind(this),
        );

        // OCT 99 GESTION
        this.router.post(
            `${this.basePath}/deleteGestionUnidadAccesorioGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            validate({ body: postCotizacionesUnidadAccesorioMov }),
            this.deleteGestionUnidadAccesorioGrupal.bind(this),
        );

        // OCT99 BORRA ACCESORIO POR UNIDAD GESTION - POSTERIOR
        // 20201106
        this.router.post(
            `${this.basePath}/deleteCotizacionUnidadAccesorioMovs`,
            this.deleteCotizacionUnidadAccesorioMovs.bind(this),
        );
        // OCT99 BORRA TRAMITE POR UNIDAD GESTION - POSTERIOR
        // 20201106
        this.router.post(
            `${this.basePath}/deleteCotizacionUnidadTramiteMovs`,
            this.deleteCotizacionUnidadTramiteMovs.bind(this),
        );

        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201110
        this.router.post(
            `${this.basePath}/actualizaTipoOdenAccesorioGrupos`,
            this.actualizaTipoOdenAccesorioGrupos.bind(this),
        );
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
        // 20201202
        this.router.post(
            `${this.basePath}/actualizaTipoOdenAccesorioGruposMovs`,
            this.actualizaTipoOdenAccesorioGruposMovs.bind(this),
        );
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201110
        this.router.get(
            `${this.basePath}/getListadoAccesoriosGrupos/:idCotizacion/:idGrupoUnidad/:fuente`,
            this.getListadoAccesoriosGrupos.bind(this),
        );

        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201110
        this.router.post(
            `${this.basePath}/actualizaTipoOdenTramiteGrupos`,
            this.actualizaTipoOdenTramiteGrupos.bind(this),
        );
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
        // 20201202
        this.router.post(
            `${this.basePath}/actualizaTipoOdenTramiteGruposMovs`,
            this.actualizaTipoOdenTramiteGruposMovs.bind(this),
        );
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201110
        this.router.get(
            `${this.basePath}/getListadoTramitesGrupos/:idCotizacion/:idGrupoUnidad/:fuente`,
            this.getListadoTramitesGrupos.bind(this),
        );

        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201113
        this.router.post(
            `${this.basePath}/actualizaTipoOdenServicioGrupos`,
            this.actualizaTipoOdenServicioGrupos.bind(this),
        );
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
        // 20201202
        this.router.post(
            `${this.basePath}/actualizaTipoOdenServicioGruposMovs`,
            this.actualizaTipoOdenServicioGruposMovs.bind(this),
        );
        // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
        // 20201113
        this.router.get(
            `${this.basePath}/getListadoServiciosGrupos/:idCotizacion/:idGrupoUnidad/:fuente`,
            this.getListadoServiciosGrupos.bind(this),
        );

        const postCotizacionesUnidadTramiteMov = ajv
            .addSchema(postCotizacionUnidadTramiteMov)
            .compile(postCotizacionUnidadTramiteMovArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionUnidadTramiteMovs/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            validate({ body: postCotizacionesUnidadTramiteMov }),
            this.saveCotizacionUnidadTramiteMovs.bind(this),
        );
        // OCT 99 GESTION
        this.router.post(
            `${this.basePath}/saveCotizacionUnidadTramiteGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            validate({ body: postCotizacionesUnidadTramiteMov }),
            this.saveCotizacionUnidadTramiteGrupal.bind(this),
        );

        // LBM/COAL/16092021
        this.router.post(
            `${this.basePath}/saveCambioDeProveedor`,
            this.saveCambioDeProveedor.bind(this),
        );

        // OCT 99 GESTION
        this.router.post(
            `${this.basePath}/deleteCotizacionUnidadTramiteGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            validate({ body: postCotizacionesUnidadTramiteMov }),
            this.deleteCotizacionUnidadTramiteGrupal.bind(this),
        );

        const postCotizacionesUnidadServicioMov = ajv
            .addSchema(postCotizacionUnidadServicioMov)
            .compile(postCotizacionUnidadServicioMovArray).schema;
        this.router.post(
            `${this.basePath}/saveCotizacionUnidadServicioMovs/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            validate({ body: postCotizacionesUnidadServicioMov }),
            this.saveCotizacionUnidadServicioMovs.bind(this),
        );
        // OCT 99 GESTION
        this.router.post(
            `${this.basePath}/saveCotizacionUnidadServicioGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            validate({ body: postCotizacionesUnidadServicioMov }),
            this.saveCotizacionUnidadServicioGrupal.bind(this),
        );

        // OCT 99 GESTION
        this.router.post(
            `${this.basePath}/deleteCotizacionUnidadServicioGrupal/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            validate({ body: postCotizacionesUnidadServicioMov }),
            this.deleteCotizacionUnidadServicioGrupal.bind(this),
        );

        const postCotizacionesUnidadTraslado = ajv
            .addSchema(postCotizacionUnidadTrasladoMov)
            .compile(postCotizacionUnidadTrasladoMovArray).schema;

        this.router.post(
            `${this.basePath}/saveCotizacionTrasladoMovs/:idUbicacionOrigen/:idUbicacionDestino`,
            this.saveCotizacionUnidadTrasladoMovs.bind(this),
        );

        this.router.delete(
            `${this.basePath}/deleteCotizacionTrasladosMov/:idCotizacionTraslado`,
            this.deleteCotizacionTrasladoMov.bind(this),
        );

        this.router.delete(
            `${this.basePath}/deleteUnidadApartadaCotizacion/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            this.deleteUnidadApartadaCotizacion.bind(this),
        );

        const postSaveLeyendaDetalleUnidadAjv = ajv
            .addSchema(postSaveLeyendaDetalleUnidad)
            .compile(postSaveLeyendaDetalleUnidadArray).schema;
        this.router.post(
            `${this.basePath}/saveLeyendaDetalleUnidad`,
            validate({ body: postSaveLeyendaDetalleUnidadAjv }),
            this.saveLeyendaDetalleUnidad.bind(this),
        );

        this.router.get(
            `${this.basePath}/getLeyendaDetalleUnidad/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            this.getLeyendaDetalleUnidad.bind(this),
        );

        const putDeleteStatusProcesadoBproAjv = ajv
            .addSchema(putDeleteStatusProcesadoBpro)
            .compile(putDeleteStatusProcesadoBproArray).schema;
        this.router.put(
            `${this.basePath}/deleteStatusProcesadoBpro`,
            validate({ body: putDeleteStatusProcesadoBproAjv }),
            this.deleteStatusProcesadoBpro.bind(this),
        );

        this.router.get(
            `${this.basePath}/getEstatusOrdCompraUnidades/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            this.getEstatusOrdCompraUnidades.bind(this),
        );

        this.router.get(
            `${this.basePath}/getEstatusOrdCompraRefacciones/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            this.getEstatusOrdCompraRefacciones.bind(this),
        );

        const putAsignarVinDetalleUnidadAjv = ajv
            .addSchema(putAsignarVinDetalleUnidad)
            .compile(putasignarVinDetalleUnidadArray).schema;
        this.router.put(
            `${this.basePath}/asignarVinDetalleUnidad`,
            validate({ body: putAsignarVinDetalleUnidadAjv }),
            this.asignarVinDetalleUnidad.bind(this),
        );

        this.router.get(
            `${this.basePath}/getVinAsignadoBpro/:idCotizacion/:idEmpresa/:idSucursal`,
            this.getVinAsignadoBpro.bind(this),
        );

        this.router.get(
            `${this.basePath}/conteoGlobalUnidadesInteres/:idCotizacion/:idGrupoUnidad`,
            this.conteoGlobalUnidadesInteres.bind(this),
        );

        const potClienteFacturacionAjv = ajv
            .addSchema(potClienteFacturacionSchema)
            .compile(potClienteFacturacionArray).schema;
        this.router.post(
            `${this.basePath}/clienteFacturacion`,
            validate({ body: potClienteFacturacionAjv }),
            this.clienteFacturacion.bind(this),
        );

        this.router.post(`${this.basePath}/adicionalesFacturacion`,
            this.adicionalesFacturacion.bind(this),
        );

        const postSumaTipoCargoUnidad = ajv
            .addSchema(postSumaTipoCargoUnidadSchema)
            .compile(postSumaTipoCargoUnidadArray).schema;
        this.router.post(
            `${this.basePath}/sumaTipoCargoUnidad`,
            validate({ body: postSumaTipoCargoUnidad }),
            this.sumaTipoCargoUnidad.bind(this),
        );

        this.router.get(
            `${this.basePath}/creditoLimiteCliente/:idCotizacion/:idCliente`,
            this.creditoLimiteCliente.bind(this),
        );

        this.router.get(
            `${this.basePath}/documentosVencidos/:idCotizacion/:idCliente`,
            this.documentosVencidos.bind(this),
        );

        this.router.get(
            `${this.basePath}/validaDisponibleCierre/:idCotizacion`,
            this.validaDisponibleCierre.bind(this),
        );
        // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/validaDisponibilidadInventario/:idCotizacion/:idDireccionFlotillas`,
            this.validaDisponibilidadInventario.bind(this),
        );

        // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/validaDisponibilidadInventarioPost/:idCotizacion/:idDireccionFlotillas`,
            this.validaDisponibilidadInventarioPost.bind(this),
        );

         // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/validaDisponibilidadInventarioPostUpdate/:idCotizacion/:idDireccionFlotillas`,
            this.validaDisponibilidadInventarioPostUpdate.bind(this),
        );

        // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/validaDisponibilidadFolio/:idCotizacion/:idDireccionFlotillas`,
            this.validaDisponibilidadFolio.bind(this),
        );

         // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/confirmaCancelacionAccesorio/:idCotizacion/:idDireccionFlotillas`,
            this.confirmaCancelacionAccesorio.bind(this),
        );

         // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/insertaBitacoraUtilidad/:idCotizacion/:idOpcion`,
            this.insertaBitacoraUtilidad.bind(this),
        );

        // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/insertaBitacoraUtilidadPosteriores/:idCotizacion/:idOpcion`,
            this.insertaBitacoraUtilidadPosteriores.bind(this),
        );

        // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/insertaBitacoraUtilidadAdicionales/:idCotizacion/:idOpcion`,
            this.insertaBitacoraUtilidadAdicionales.bind(this),
        );

        // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/validaNotificacionUtilidad/:idCotizacion/:idOpcion`,
            this.validaNotificacionUtilidad.bind(this),
        );

        // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/obtenTotalUtilidad/:idCotizacion/:idOpcion`,
            this.obtenTotalUtilidad.bind(this),
        );

        // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/validaBotonUtilidad/:idUsuario`,
            this.validaBotonUtilidad.bind(this),
        );

          // Cambio P10 - EHJ-COAL
        this.router.get(
            `${this.basePath}/obtenNotificacion/:idCotizacion`,
            this.obtenNotificacion.bind(this),
        );

        // LBM-COAL
        this.router.get(
            `${this.basePath}/validaPerfiles/:idCotizacion`,
            this.validaPerfiles.bind(this),
        );

        // LBM-COAL
        this.router.get(
            `${this.basePath}/validaTipoOrden/:idCotizacion`,
            this.validaTipoOrden.bind(this),
        );

        // LBM-COAL
        this.router.get(
            `${this.basePath}/validaUnidadFacturada/:idCotizacion`,
            this.validaUnidadFacturada.bind(this),
        );

        // LBM-COAL
        this.router.get(
            `${this.basePath}/validaLimiteCredito/:idCotizacion`,
            this.validaLimiteCredito.bind(this),
        );

        this.router.get(
            `${this.basePath}/obtieneMargenUtilidadTraslado/:direccionFlotilla`,
            this.obtieneMargenUtilidadTraslado.bind(this),
        );

        this.router.delete(
            `${this.basePath}/deleteUnidadInteres/:idCotizacion/:vin`,
            this.deleteUnidadInteres.bind(this),
        );

        const postNotificaionEnvAjv = ajv
            .addSchema(postNotificaionEnv)
            .compile(postNotificaionEnvArray).schema;
        this.router.post(
            `${this.basePath}/notificaionEnviada`,
            validate({ body: postNotificaionEnvAjv }),
            this.notificaionEnv.bind(this),
        );

        const postActualizarBonificacionAjv = ajv
            .addSchema(postActualizarBonificacionSchema)
            .compile(postActualizarBonificacionArray).schema;
        this.router.post(
            `${this.basePath}/actualizarBonificacion`,
            validate({ body: postActualizarBonificacionAjv }),
            this.actualizarBonificacion.bind(this),
        );

        const postActulizarImprimeFacturaAjv = ajv
            .addSchema(postActulizarImprimeFacturaSchema)
            .compile(postActulizarImprimeFacturaArray).schema;
        this.router.post(
            `${this.basePath}/actulizarImprimeFactura`,
            validate({ body: postActulizarImprimeFacturaAjv }),
            this.actulizarImprimeFactura.bind(this),
        );

        this.router.get(`${this.basePath}/getCfdiListingByAgency/:idEmpresa`,
            this.getCfdiListingByAgency.bind(this),
        );

        this.router.get(`${this.basePath}/getDataContract/:idCliente/:idEmpresa/:idSucursal`,
                this.getDataContract.bind(this),
        );

        this.router.get(
            `${this.basePath}/get1erNotificacionCotizacion/:idCotizacion`,
            this.get1erNotificacionCotizacion.bind(this),
        );

        this.router.put(
            `${this.basePath}/udpNotificacionCotizacion1er/:idCotizacion/:estatus`,
            this.udpNotificacionCotizacion1er.bind(this),
        );

        this.router.get(
            `${this.basePath}/CancelaUnidadOrdenCompra/:idCotizacion/:idGrupoUnidad/:idDetalleUnidad`,
            this.CancelaUnidadOrdenCompra.bind(this),
        );
        // OCT99 GESTION
        this.router.get(
            `${this.basePath}/getValidaRegresaCotizacion/:idCotizacion`,
            this.getValidaRegresaCotizacion.bind(this),
        );

        // OCT99 GESTION
        this.router.get(
            `${this.basePath}/getRegresaCotizacion/:idCotizacion`,
            this.getRegresaCotizacion.bind(this),
        );

        // OCT99 GESTION CANCELA COTIZACION
        this.router.get(
            `${this.basePath}/getCancelaCotizacion/:idCotizacion`,
            this.getCancelaCotizacion.bind(this),
        );

        // OCT99 GESTION CANCELA GRUPO UNIDAD
        this.router.get(
            `${this.basePath}/getCancelaGrupoUnidad/:idCotizacion/:idGrupoUnidad`,
            this.getCancelaGrupoUnidad.bind(this),
        );

        // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR GRUPO
        this.router.get(
            `${this.basePath}/getResumenPreCancelaGrupoUnidad/:idCotizacion/:idGrupoUnidad`,
            this.getResumenPreCancelaGrupoUnidad.bind(this),
        );

        // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR COTIZACION
        this.router.get(
            `${this.basePath}/getResumenPreCancelaCotizacion/:idCotizacion`,
            this.getResumenPreCancelaCotizacion.bind(this),
        );

        // SISCO
        // Servicio para validar si en la cotizacion existen accesorios pendientes - SISCO
        this.router.get(
            `${this.basePath}/validaAccesoriosSisco/:idCotizacion/:origen`,
            this.validaAccesoriosSisco.bind(this),
        );

        // SISCO
        // CHK - 03 feb 21k Valida si existe ordenes pendientes y si hay trae el XML para enviarlo - SISCO
        this.router.get(
            `${this.basePath}/pendienteSisco/:idCotizacion`,
            this.getpendienteSisco.bind(this),
        );

        // CHK - 04 feb 21k Valida si existe ordenes pendientes y si hay trae el XML para enviarlo - SISCO
        this.router.get(
            `${this.basePath}/estatusSisco/:idCotizacion`,
            this.getestatusSisco.bind(this),
        );

        this.router.get(
            `${this.basePath}/cfdiCliente/:idEmpresa/:idSucursal/:idCliente/:idCotizacion`,
            this.cfdiCliente.bind(this),
        );

    }

    private updateCotizacionStep(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const step = Number(request.params.step);
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.updateCotizacionStep(idCotizacion, step).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private updateCotizacionCfdiAdicionales(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idCfdiAdicionales = request.params.idCfdiAdicionales as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.updateCotizacionCfdiAdicionales(idCotizacion, idCfdiAdicionales).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private updateCotizacionTipoOrden(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const tipoOrden = request.params.tipoOrden as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.updateCotizacionTipoOrden(idCotizacion, tipoOrden).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }
    // OCT99 20200914
    private updateCotizacionGruposTipoOrden(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const tipoOrden = request.params.tipoOrden as string;
        const idCfdiAdicionales = request.params.idCfdiAdicionales as string;
        const tipoCargoUnidad = request.params.tipoCargoUnidad as string;
        const imprimeFactura = request.params.imprimeFactura as unknown as boolean;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.updateCotizacionGruposTipoOrden(idCotizacion, tipoOrden, idCfdiAdicionales, tipoCargoUnidad, imprimeFactura).then(
            (res) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }
    // OCT99 20200914
    private updateGruposTipoOrden(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const tipoOrden = request.params.tipoOrden as string;
        const idGrupoUnidad = Number((request.params.idGrupoUnidad) ? request.params.idGrupoUnidad : 0);
        const idCfdiAdicionales = request.params.idCfdiAdicionales as string;
        const tipoCargoUnidad = request.params.tipoCargoUnidad as string;
        const imprimeFactura = request.params.imprimeFactura as unknown as boolean;

        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.updateGruposTipoOrden(idCotizacion, idGrupoUnidad, tipoOrden, idCfdiAdicionales, tipoCargoUnidad, imprimeFactura).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getCotizaciones(response: express.Response) {
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getAllCotizaciones().then(
            (cotizaciones: Cotizacion[]) => {
                response.status(200).send(cotizaciones);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getCotizacionesByIdFlotillas(request: express.Request, response: express.Response) {
        const cotizacionBussines = new CotizadorBussiness();
        const idDireccionFlotillas = request.params.idDireccionFlotillas as string;
        cotizacionBussines.getAllCotizacionesByIdFlotillas(idDireccionFlotillas).then(
            (cotizaciones: Cotizacion[]) => {
                response.status(200).send(cotizaciones);
            }, (error) => {
                respuesta.error(request, response, 'Internal error', 500, error);
            },
        );
    }
// Envio de Correo LBM*
    private getConsultaCorreosCompras(request: express.Request, response: express.Response) {
        const cotizacionBussines = new CotizadorBussiness();
        const idCotizacion = request.params.idCotizacion as string;
        cotizacionBussines.getConsultaCorreosCompras(idCotizacion).then(
            (cotizaciones: Cotizacion[]) => {
                response.status(200).send(cotizaciones);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getCotizacionesByIdFlotillasByUser(request: express.Request, response: express.Response) {
        const cotizacionBussines = new CotizadorBussiness();
        const idDireccionFlotillas = request.params.idDireccionFlotillas as string;
        const idUsuario: number = parseInt(request.params.idUsuario, 0);
        cotizacionBussines.getAllCotizacionesByIdFlotillasByUser(idDireccionFlotillas, idUsuario).then(
            (cotizaciones: Cotizacion[]) => {
                response.status(200).send(cotizaciones);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getCotizacionesByIdLicitacion(request: express.Request, response: express.Response) {
        const idLicitacion = request.params.idLicitacion as string;
        const cotizadorBussiness = new CotizadorBussiness();
        cotizadorBussiness.getCotizacionesByIdLicitacion(idLicitacion).then(
            (cotizaciones: Cotizacion[]) => {
                response.status(200).send(cotizaciones);
            }, (error) => {
                response.status(500).send({ type: 'error', body: error });
            },
        );
    }

    private getCotizacionesById(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getCotizacionById(idCotizacion).then(
            (cotizacion: Cotizacion) => {
                response.status(200).send(cotizacion);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private existeLicitacion(request: express.Request, response: express.Response) {
        const idLicitacion = request.params.idLicitacion as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.existeLicitacion(idLicitacion).then(
            (res) => {
                response.json({ existeLicitacion: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private insertCotizacion(request: express.Request, response: express.Response) {
        const idTipoVenta = request.params.idTipoVenta as string;
        const idContrato = request.params.idContrato as string;
        const idCotizacionTraslado = request.params.idContrato as string;
        const cotizacionBussines = new CotizadorBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const data = request.body as Cotizacion[];
        data.map((element) => {
            element.idUsuario = element.idUsuario == undefined ? idUsuario : element.idUsuario;
            element.idUsuarioModificacion = idUsuario;
            element.fechaModificacion = new Date();
        });
        cotizacionBussines.insertCotizacion(data, idTipoVenta, idContrato).then(
            (res) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getUnidadesInteresPorCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = (request.params.idCotizacion) as string;
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getUnidadesInteresPorCotizacion(idCotizacion).then(
            (res: UnidadInteres[]) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }
    private solicitarApartadoUnidadInteresCreate(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        const unidadesPorApartar = request.body as UnidadInteres[];

        unidadesPorApartar.map((u) => { u.idUsuarioModificacion = idUsuario; u.fechaModificacion = new Date(); });
        inventarioUnidadBusiness.solicitarApartadoUnidadInteresCreate(idCotizacion, idGrupoUnidad, unidadesPorApartar).then(
            (res: boolean) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private solicitarApartadoUnidadInteresUpdate(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        const unidadesPorApartar = request.body as UnidadInteres[];
        unidadesPorApartar.map((u) => { u.idUsuarioModificacion = idUsuario; u.fechaModificacion = new Date(); });
        inventarioUnidadBusiness.solicitarApartadoUnidadInteresUpdate(idCotizacion, idGrupoUnidad, unidadesPorApartar).then(
            (res: boolean) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private solicitarApartadoUnidadInteresDelete(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        const unidadesPorApartar = request.body as UnidadInteres[];

        unidadesPorApartar.map((u) => { u.idUsuarioModificacion = idUsuario; u.fechaModificacion = new Date(); });
        inventarioUnidadBusiness.solicitarApartadoUnidadInteresDelete(idCotizacion, idGrupoUnidad, unidadesPorApartar).then(
            (res: boolean) => {
                response.status(200).send(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private eliminarSolicitudApartadoUnidadesInteres(request: express.Request, response: express.Response) {
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        const unidadesPorEliminar = request.body as number[];
        inventarioUnidadBusiness.eliminarSolicitudApartadoUnidadesInteres(unidadesPorEliminar).then(
            (res: number) => {
                response.status(200).send(res.toString());
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private saveGrupoUnidad(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const grupoUnidad = request.body as CotizacionGrupoUnidad;
        grupoUnidad.idUsuarioModificacion = idUsuario;
        grupoUnidad.fechaModificacion = new Date();
        const cotizadorBussiness = new CotizadorBussiness();
        cotizadorBussiness.saveGrupoUnidad(grupoUnidad).then(
            (grupoUnidadSaved: CotizacionGrupoUnidad) => {
                response.json(grupoUnidadSaved);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private validaVinAsignados(request: express.Request, response: express.Response) {
        const grupoVines = request.body as any[];
        const cotizadorBussiness = new CotizadorBussiness();
        cotizadorBussiness.validaVinAsignados(grupoVines)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((err) => {
                response.status(500).json(err);
            });
    }

    private getGrupoUnidadByIdCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getGrupoUnidadByIdCotizacion(idCotizacion).then(
            // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
            (cotizacionGrupoUnidad: Cotizacion) => {
                response.status(200).send(cotizacionGrupoUnidad);
            }, (err) => {
                response.status(500).send(err);
            },
        );
    }
    // OCT99
    private getUnidadesInteresByIdCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getUnidadesInteresByIdCotizacion(idCotizacion).then(
            // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
            (cotizacionGrupoUnidad: Cotizacion) => {
                response.status(200).send(cotizacionGrupoUnidad);
            }, (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT99
    private getUnidadesCierreByIdCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getUnidadesCierreByIdCotizacion(idCotizacion).then(
            // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
            (cotizacionGrupoUnidad: Cotizacion) => {
                response.status(200).send(cotizacionGrupoUnidad);
            }, (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT99
    private getUnidadesInteresGrupoByIdCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getUnidadesInteresGrupoByIdCotizacion(idCotizacion).then(
            // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
            (unidadesInteres: any) => {
                response.status(200).send(unidadesInteres);
            }, (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT99
    private getAdicionalesCierrebyIdCotizacionGrupoUnidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idCotizacionGrupoUnidad = Number(request.params.idCotizacionGrupoUnidad);
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getAdicionalesCierrebyIdCotizacionGrupoUnidad(idCotizacion, idCotizacionGrupoUnidad).then(
            // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
            (adicionales: any) => {
                response.status(200).send(adicionales);
            }, (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT99
    private getDetalleUnidadGrupoByIdCotizacionGrupo(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idCotizacionGrupoUnidad = Number(request.params.idCotizacionGrupoUnidad);
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getDetalleUnidadGrupoByIdCotizacionGrupo(idCotizacion, idCotizacionGrupoUnidad).then(
            // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
            (unidadesGrupo: any) => {
                response.status(200).send(unidadesGrupo);
            }, (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT99 GESTION
    private getCotizacionGestionByIdCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getCotizacionGestionByIdCotizacion(idCotizacion).then(
            // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
            (unidadesGrupo: any) => {
                response.status(200).send(unidadesGrupo);
            }, (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT99 GESTION
    private getAdicionalesGestionbyIdDetalleUnidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idCotizacionGrupoUnidad = Number(request.params.idCotizacionGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getAdicionalesGestionbyIdDetalleUnidad(idCotizacion, idCotizacionGrupoUnidad, idDetalleUnidad).then(
            // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
            (adicionales: any) => {
                response.status(200).send(adicionales);
            }, (err) => {
                response.status(500).send(err);
            },
        );
    }

    // OCT99 GESTION
    private getAdicionalesGestionbyGrupal(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idCotizacionGrupoUnidad = Number(request.params.idCotizacionGrupoUnidad);
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.getAdicionalesGestionbyGrupal(idCotizacion, idCotizacionGrupoUnidad).then(
            // (cotizacionGrupoUnidad: CotizacionGrupoUnidad[]) => {
            (adicionales: any) => {
                response.status(200).send(adicionales);
            }, (err) => {
                response.status(500).send(err);
            },
        );
    }

    private saveCotizacionUnidadDetalle(request: express.Request, response: express.Response) {
        const idCotizacionDetalle = request.body;
        const pantalla = request.params.pantalla as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.saveGruposDetalleUnidades(idCotizacionDetalle, pantalla)
            .then((cotizacionDetalleUnidad: any) => {
                response.status(200).json({ affectedRows: cotizacionDetalleUnidad });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private updateCotizacionDetalleUnidad(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const detalleUnidad = request.body as CotizacionDetalleUnidad;
        detalleUnidad.idUsuarioModificacion = idUsuario;
        detalleUnidad.fechaModificacion = new Date();
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.updateCotizacionDetalleUnidad(detalleUnidad)
            .then((cotizacionDetalleUnidad: number) => {
                response.status(200).json({ affectedRows: cotizacionDetalleUnidad });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private deleteGrupoUnidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizadorBussiness = new CotizadorBussiness();
        cotizadorBussiness.deleteGrupoUnidad(idCotizacion, idGrupoUnidad).then(
            (deletedRows: number) => {
                response.json({ affectedRows: deletedRows });
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    private saveCotizacionGrupoAccesorios(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const encsPaqueteAccesorio = request.body as EncPaqueteAccesorio[];
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);

        encsPaqueteAccesorio.map((accesorio) => { accesorio.idUsuarioModificacion = idUsuario; accesorio.fechaModificacion = new Date(); });

        adicionalesBusiness.saveCotizacionGrupoAccesorio(idCotizacion, idGrupoUnidad, encsPaqueteAccesorio)
            .then((cotizacionGrupoAccesorio: number) => {
                response.status(200).json({ affectedRows: cotizacionGrupoAccesorio });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private saveCotizacionGrupoAccesoriosSinPaquete(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const accesoriosSinPaquete = request.body as CotizacionGrupoAccesorioSinPaquete[];
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

    private saveCotizacionGrupoAccesoriosSinPaqueteTodos(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const accesoriosSinPaquete = request.body as CotizacionGrupoAccesorioSinPaquete[];
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

    private deleteCotizacionEncabezadoPaquetesAccesorio(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idEncPaqueteAccesorio = Number(request.params.idEncPaqueteAccesorio);

        adicionalesBusiness.deleteCotizacionGrupoPaqueteAccesorio(idCotizacion, idGrupoUnidad, idEncPaqueteAccesorio)
            .then((detallePaquetesAccesorio: number) => {
                response.status(200).json({ affectedRows: detallePaquetesAccesorio });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private deleteCotizacionGrupoAccesorioSinPaquete(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const cotizacionGrupoAccesorioSinPaquete = request.body as CotizacionGrupoAccesorioSinPaquete;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);

        cotizacionGrupoAccesorioSinPaquete.idUsuarioModificacion = idUsuario;
        cotizacionGrupoAccesorioSinPaquete.fechaModificacion = new Date();

        adicionalesBusiness.deleteCotizacionGrupoAccesorioSinPaquete(cotizacionGrupoAccesorioSinPaquete)
            .then((cotizacionUnidadAccesorio: number) => {
                response.status(200).json({ affectedRows: cotizacionUnidadAccesorio });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private saveCotizacionGrupoTramite(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const encsPaqueteTramite = request.body as EncPaqueteTramite[];
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);

        encsPaqueteTramite.map((tramite) => { tramite.idUsuarioModificacion = idUsuario; tramite.fechaModificacion = new Date(); });

        adicionalesBusiness.saveCotizacionGrupoTramite(idCotizacion, idGrupoUnidad, encsPaqueteTramite)
            .then((res: number) => {
                response.status(200).json({ affectedRows: res });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private saveCotizacionGrupoTramiteTodos(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const encsPaqueteTramite = request.body as EncPaqueteTramite[];
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);

        encsPaqueteTramite.map((tramite) => { tramite.idUsuarioModificacion = idUsuario; tramite.fechaModificacion = new Date(); });

        adicionalesBusiness.saveCotizacionGrupoTramiteTodos(idCotizacion, idGrupoUnidad, encsPaqueteTramite)
            .then((res: number) => {
                response.status(200).json({ affectedRows: res });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private saveCotizacionGrupoTramitesSinPaquete(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const tramitesSinPaquete = request.body as CotizacionGrupoTramiteSinPaquete[];
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

    private deleteCotizacionEncabezadoPaquetesTramite(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idEncPaqueteTramite = Number(request.params.idEncPaqueteTramite);

        adicionalesBusiness.deleteCotizacionGrupoPaqueteTramite(idCotizacion, idGrupoUnidad, idEncPaqueteTramite)
            .then((res: number) => {
                response.status(200).json({ affectedRows: res });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private deleteCotizacionGrupoTramiteSinPaquete(request: express.Request, response: express.Response) {
        const cotizacionBussiness = new AdicionalesBusiness();
        const cotizacionGrupoTramiteSinPaquete = request.body as CotizacionGrupoTramiteSinPaquete;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);

        cotizacionGrupoTramiteSinPaquete.idUsuarioModificacion = idUsuario;
        cotizacionGrupoTramiteSinPaquete.fechaModificacion = new Date();

        cotizacionBussiness.deleteCotizacionGrupoTramiteSinPaquete(cotizacionGrupoTramiteSinPaquete)
            .then((res: number) => {
                response.status(200).json({ affectedRows: res });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private saveCotizacionGrupoServicioUnidad(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const encsPaqueteServicioUnidad = request.body as EncPaqueteServicioUnidad[];
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);

        encsPaqueteServicioUnidad.map((servicioUnidad) => { servicioUnidad.idUsuarioModificacion = idUsuario; servicioUnidad.fechaModificacion = new Date(); });

        adicionalesBusiness.saveCotizacionGrupoServicioUnidad(idCotizacion, idGrupoUnidad, encsPaqueteServicioUnidad)
            .then((res: number) => {
                response.status(200).json({ affectedRows: res });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private saveCotizacionGrupoServiciosUnidadSinPaquete(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const serviciosSinPaquete = request.body as CotizacionGrupoServicioUnidadSinPaquete[];
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

    private deleteCotizacionEncabezadoPaquetesServicioUnidad(request: express.Request, response: express.Response) {
        const adicionalesBusiness = new AdicionalesBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idEncPaqueteServicioUnidad = Number(request.params.idEncPaqueteServicioUnidad);

        adicionalesBusiness.deleteCotizacionGrupoPaqueteServicioUnidad(idCotizacion, idGrupoUnidad, idEncPaqueteServicioUnidad)
            .then((res: number) => {
                response.status(200).json({ affectedRows: res });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private deleteCotizacionGrupoServicioUnidadSinPaquete(request: express.Request, response: express.Response) {
        const cotizacionBussiness = new AdicionalesBusiness();
        const cotizacionGrupoServicioUnidadSinPaquete = request.body as CotizacionGrupoServicioUnidadSinPaquete;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);

        cotizacionGrupoServicioUnidadSinPaquete.idUsuarioModificacion = idUsuario;
        cotizacionGrupoServicioUnidadSinPaquete.fechaModificacion = new Date();

        cotizacionBussiness.deleteCotizacionGrupoServicioUnidadSinPaquete(cotizacionGrupoServicioUnidadSinPaquete)
            .then((res: number) => {
                response.status(200).json({ affectedRows: res });
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private saveCotizacionTraslado(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const cotizacionTraslado = request.body as CotizacionTraslado;
        cotizacionTraslado.idUsuarioModificacion = idUsuario;
        cotizacionTraslado.fechaModificacion = new Date();
        cotizacionTraslado.activo = true;
        const idUbicacionOrigen = Number(request.params.idUbicacionOrigen);
        const idUbicacionDestino = Number(request.params.idUbicacionDestino);
        const cotizacionBussines = new CotizadorBussiness();

        cotizacionBussines.saveCotizacionTraslado(idUbicacionOrigen, idUbicacionDestino, cotizacionTraslado).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private deleteCotizacionTraslado(request: express.Request, response: express.Response) {
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.deleteCotizacionTraslado(idCotizacionTraslado).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getCondicionesEntrega(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const documentoBusiness = new DocumentoBusiness('cotizacion');
        documentoBusiness.get(idCotizacion + '/condicionesEntrega.html').then(
            (fileContent: string) => {
                response.status(200).send(fileContent);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private setCondicionesEntrega(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const content = request.body as { fileContent: string };
        const documentoBusiness = new DocumentoBusiness('cotizacion');
        documentoBusiness.set(idCotizacion + '/condicionesEntrega.html', content.fileContent).then(
            (isCreated: boolean) => {
                response.status(200).send(isCreated);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private deleteCondicionesEntrega(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const documentoBusiness = new DocumentoBusiness('cotizacion');
        documentoBusiness.delete(idCotizacion + '/condicionesEntrega.html').then(
            (deleteResponse: boolean) => {
                response.status(200).send(deleteResponse);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private cerrarCotizacion(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const cierreCotizacionRequest = request.body as { idCotizacion: string, numeroOrden: string, orden: string };
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.cerrarCotizacion(idUsuario, cierreCotizacionRequest).then(
            (identityCotizacion: number) => {
                response.status(200).send({ identityCotizacion });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private enviarCotizacionEmail(request: express.Request, response: express.Response) {
        const correo = request.body as { para: string[], asunto: string, cuerpo: string, adjuntos: Array<{ nombre: string, contenido: string }> };
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.enviarCotizacionEmail(correo).then(
            (correoEnviado: boolean) => {
                response.status(200).send({ correoEnviado });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private async enviarEmail(request: express.Request, response: express.Response) {
        const resp: any = await sendGridEMail({ emails: request.body.emails }, {
            cotizacion: request.body.cotizacion,
            idFlotilla: request.body.idFlotilla,
            link: request.body.link,
            ordenesSisco: request.body.ordenesSisco,
        });

        if (resp.errors) {
            response.status(500).send({estatus: 'ERROR', mensaje: resp.errors});
        } else {
            response.status(200).send({estatus: 'OK', mensaje: 'Correo enviado correctamente'});
        }
    }

    private asignarVinesApartados(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.asignarVinesApartados(idCotizacion).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private enviarControlDocumental(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.enviarControlDocumental(idCotizacion).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private enviarProduccion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.enviarProduccion(idCotizacion).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private apartarUnidadesBpro(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.apartarUnidadesBpro(idCotizacion).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private apartarUnidadesGestion(request: express.Request, response: express.Response) {
        const unidades = request.body as Array<{ idSucursal: string, vin: string }>;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.apartarUnidadesGestion(unidades).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private desapartarUnidadesBpro(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.desapartarUnidadesBpro(idCotizacion).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private desapartarUnidadesGestion(request: express.Request, response: express.Response) {
        const unidades = request.body as Array<{ idSucursal: string, vin: string }>;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.desapartarUnidadesGestion(unidades).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getFechaMinimaPromesaEntrega(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getFechaMinimaPromesaEntrega(idCotizacion, idGrupoUnidad).then(
            (res) => {
                response.json({ minFechaPromesaEntrega: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private getFacturacionUnidades(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getFacturacionUnidades(idCotizacion).then(
            (res: FacturacionUnidad[]) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }
    // OCT99 GESTION
    private getValidaRegresaCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getValidaRegresaCotizacion(idCotizacion).then(
            (res: any) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 GESTION
    private getRegresaCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getRegresaCotizacion(idCotizacion).then(
            (res: any) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OC99 GESTION CANCELA COTIZACION
    private getCancelaCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getCancelaCotizacion(idCotizacion).then(
            (res: any) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 GESTION CANCELA GRUPO UNIDAD
    private getCancelaGrupoUnidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getCancelaGrupoUnidad(idCotizacion, idGrupoUnidad).then(
            (res: any) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR GRUPO
    private getResumenPreCancelaGrupoUnidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getResumenPreCancelaGrupoUnidad(idCotizacion, idGrupoUnidad).then(
            (res: any) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OC99 GESTION OBTIENE RESUMEN PRE CANCELACION POR COTIZACION
    private getResumenPreCancelaCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getResumenPreCancelaCotizacion(idCotizacion).then(
            (res: any) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // SISCO
    // Servicio para validar si en la cotizacion existen accesorios pendientes - SISCO
    private validaAccesoriosSisco(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const origen = Number(request.params.origen);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.validaAccesoriosSisco(idCotizacion, origen).then(
            (res: any) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private saveCotizacionUnidadAccesorioMovs(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const accesorioMovs = request.body as CotizacionUnidadAccesorioMov[];

        const adicionalesBusiness = new AdicionalesBusiness();
        const accesoriosSinPaquete = request.body as CotizacionGrupoAccesorioSinPaquete[];

        accesorioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadAccesorioMovs(idCotizacion, idGrupoUnidad, idDetalleUnidad, accesorioMovs).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 BORRA ACCESORIO POR UNIDAD GESTION - POSTERIOR
    // 20201106
    private deleteCotizacionUnidadAccesorioMovs(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const accesorioMovs = request.body as any;

        const idCotizacion = accesorioMovs[0].idCotizacion;
        const idGrupoUnidad = accesorioMovs[0].idGrupoUnidad;
        const idParte = accesorioMovs[0].idParte;
        const idAccesorioNuevo = accesorioMovs[0].idAccesorioNuevo;
        const idDetalleUnidad = accesorioMovs[0].idDetalleUnidad;

        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.deleteCotizacionUnidadAccesorioMovs(idCotizacion, idGrupoUnidad, idParte, idAccesorioNuevo, idDetalleUnidad).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 BORRA TRAMITE POR UNIDAD GESTION - POSTERIOR
    // 20201106
    private deleteCotizacionUnidadTramiteMovs(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramiteMovs = request.body as any;

        const idCotizacion = tramiteMovs.idCotizacion;
        const idGrupoUnidad = tramiteMovs.idGrupoUnidad;
        const idTramite = tramiteMovs.idTramite;
        const idSubTramite = tramiteMovs.idSubtramite;
        const idDetalleUnidad = tramiteMovs.idDetalleUnidad;

        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.deleteCotizacionUnidadTramiteMovs(idCotizacion, idGrupoUnidad, idTramite, idSubTramite, idDetalleUnidad).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    private getListadoAccesoriosGrupos(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const fuente = Number(request.params.fuente); // 1:cotizacion,2:gestion

        const adicionalesBusiness = new AdicionalesBusiness();
        adicionalesBusiness.getListadoAccesoriosGrupos(idCotizacion, idGrupoUnidad, fuente).then(
            (res) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    private actualizaTipoOdenAccesorioGrupos(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const accesorio = request.body as any;

        const idCotizacion = accesorio.idCotizacion;
        const idGrupoUnidad = accesorio.idGrupoUnidad;
        const idAccesorioNuevo = accesorio.idAccesorioNuevo;
        const idParte = accesorio.idParte;
        const tipoOrden = accesorio.tipoOrden;
        const tipoCargoUnidad = accesorio.tipoCargoUnidad;
        const imprimeFactura = accesorio.imprimeFactura;
        const idCfdi = accesorio.idCfdi;

        const adicionalesBusiness = new AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenAccesorioGrupos(idCotizacion, idGrupoUnidad,
            idAccesorioNuevo, idParte, tipoOrden, tipoCargoUnidad, imprimeFactura, idCfdi).then(
                (res) => {
                    response.json(res);
                }, (error) => {
                    response.status(500).send(error);
                },
            );
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
    // 20201202
    private actualizaTipoOdenAccesorioGruposMovs(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const accesorio = request.body as any;

        const adicionalesBusiness = new AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenAccesorioGruposMovs(accesorio).then(
            (res) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    private getListadoTramitesGrupos(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const fuente = Number(request.params.fuente);

        const adicionalesBusiness = new AdicionalesBusiness();
        adicionalesBusiness.getListadoTramitesGrupos(idCotizacion, idGrupoUnidad, fuente).then(
            (res) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201110
    private actualizaTipoOdenTramiteGrupos(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramite = request.body as any;

        const idCotizacion = tramite.idCotizacion;
        const idGrupoUnidad = tramite.idGrupoUnidad;
        const idTramite = tramite.idTramite;
        const idSubtramite = tramite.idSubtramite;
        const tipoOrden = tramite.tipoOrden;
        const idCfdi = tramite.idCfdi;

        const adicionalesBusiness = new AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenTramiteGrupos(idCotizacion, idGrupoUnidad, idTramite, idSubtramite, tipoOrden, idCfdi).then(
            (res) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
    // 20201202
    private actualizaTipoOdenTramiteGruposMovs(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramite = request.body as any;

        const adicionalesBusiness = new AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenTramiteGruposMovs(tramite).then(
            (res) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201113
    private getListadoServiciosGrupos(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const fuente = Number(request.params.fuente);

        const adicionalesBusiness = new AdicionalesBusiness();
        adicionalesBusiness.getListadoServiciosGrupos(idCotizacion, idGrupoUnidad, fuente).then(
            (res) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES
    // 20201113
    private actualizaTipoOdenServicioGrupos(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const servicio = request.body as any;

        const idCotizacion = servicio.idCotizacion;
        const idGrupoUnidad = servicio.idGrupoUnidad;
        const idServicioUnidad = servicio.idServicioUnidad;
        const tipoOrden = servicio.tipoOrden;
        const tipoCargoUnidad = servicio.tipoCargoUnidad;
        const imprimeFactura = servicio.imprimeFactura;
        const idCfdi = servicio.idCfdi;

        const adicionalesBusiness = new AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenServicioGrupos(idCotizacion, idGrupoUnidad, idServicioUnidad, tipoOrden, tipoCargoUnidad, idCfdi, imprimeFactura).then(
            (res) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT99 CONFIGURA TIPO ORDEN - ADICIONALES POSTERIORES
    // 20201202
    private actualizaTipoOdenServicioGruposMovs(request: express.Request, response: express.Response) {
        // const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const servicio = request.body as any;

        const adicionalesBusiness = new AdicionalesBusiness();
        adicionalesBusiness.actualizaTipoOdenServicioGruposMovs(servicio).then(
            (res) => {
                response.json(res);
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT 99 GESTION
    private saveGestionUnidadAccesorioGrupal(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const accesorioMovs = request.body as CotizacionUnidadAccesorioMov[];

        const adicionalesBusiness = new AdicionalesBusiness();
        const accesoriosSinPaquete = request.body as CotizacionGrupoAccesorioSinPaquete[];

        accesorioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.saveGestionUnidadAccesorioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, accesorioMovs).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT 99 GESTION
    private deleteGestionUnidadAccesorioGrupal(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const accesorioMovs = request.body as CotizacionUnidadAccesorioMov[];

        const adicionalesBusiness = new AdicionalesBusiness();
        const accesoriosSinPaquete = request.body as CotizacionGrupoAccesorioSinPaquete[];

        accesorioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.deleteGestionUnidadAccesorioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, accesorioMovs).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private saveCotizacionUnidadTramiteMovs(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramiteMovs = request.body as CotizacionUnidadTramiteMov[];
        const unidadTramites = request.body as CotizacionUnidadTramite[];
        const adicionalesBusiness = new AdicionalesBusiness();
        tramiteMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadTramiteMovs(tramiteMovs).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT 99 GESTION
    private saveCotizacionUnidadTramiteGrupal(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramiteMovs = request.body as CotizacionUnidadTramiteMov[];
        const unidadTramites = request.body as CotizacionUnidadTramite[];
        const adicionalesBusiness = new AdicionalesBusiness();
        tramiteMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadTramiteGrupal(tramiteMovs).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private saveCambioDeProveedor(request: express.Request, response: express.Response) {
        const cotizacionBussines = new CotizadorBussiness();
        const params = request.body as any;
        const tipo = params.tipo as string;
        const idCotizacion = params.idCotizacion as string;
        const idTramite = params.idTramite as string;
        const idSubtramiteOld = params.idSubtramiteOld as string;
        const proveedorNew = params.proveedorNew as string;
        const importeNew = params.importeNew as string;
        const idSubtramiteNew = params.idSubtramiteNew as string;

        cotizacionBussines.saveCambioDeProveedor(tipo, idCotizacion, idTramite, idSubtramiteOld, parseInt(proveedorNew, 10) , parseFloat(importeNew), idSubtramiteNew).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT 99 GESTION
    private deleteCotizacionUnidadTramiteGrupal(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const tramiteMovs = request.body as CotizacionUnidadTramiteMov[];
        const unidadTramites = request.body as CotizacionUnidadTramite[];
        const adicionalesBusiness = new AdicionalesBusiness();
        tramiteMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.deleteCotizacionUnidadTramiteGrupal(tramiteMovs).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
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

    private saveCotizacionUnidadServicioMovs(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const servicioMovs = request.body as CotizacionUnidadServicioUnidadMov[];
        servicioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadServicioMovs(idCotizacion, idGrupoUnidad, idDetalleUnidad, servicioMovs).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }
    // OCT 99 GESTION
    private saveCotizacionUnidadServicioGrupal(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const servicioMovs = request.body as CotizacionUnidadServicioUnidadMov[];
        servicioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.saveCotizacionUnidadServicioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, servicioMovs).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    // OCT 99 GESTION
    private deleteCotizacionUnidadServicioGrupal(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const servicioMovs = request.body as CotizacionUnidadServicioUnidadMov[];
        servicioMovs.map((am) => {
            am.idUsuarioModificacion = idUsuario;
        });
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.deleteCotizacionUnidadServicioGrupal(idCotizacion, idGrupoUnidad, idDetalleUnidad, servicioMovs).then(
            (res) => {
                response.json({ affectedRows: res });
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private saveCotizacionUnidadTrasladoMovs(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);

        const cotizacionBussines = new CotizadorBussiness();
        const cotizacionBusiness = new CotizadorBussiness();

        const cotizacionTraslado = request.body as CotizacionTraslado;
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

                cotizacionBussines.saveCotizacionTraslado(idUbicacionOrigen, idUbicacionDestino, cotizacionTraslado).then(
                    (resT: CotizacionTraslado) => {
                        const trasladoMovs = new CotizacionUnidadTrasladoMov();
                        trasladoMovs.idCotizacion = resT.idCotizacion;
                        trasladoMovs.idGrupoUnidad = resT.idGrupoUnidad;
                        trasladoMovs.idTraslado = resT.idTraslado;
                        trasladoMovs.idCotizacionTraslado = resT.idCotizacionTraslado;
                        trasladoMovs.usuarioModificacion = idUsuario;
                        trasladoMovs.tipoMovimiento = movimento ? movimento : 'A';
                        trasladoMovs.fechaModificacion = new Date();

                        cotizacionBusiness.saveCotizacionUnidadTrasladoMovs(trasladoMovs).then(
                            (res) => {
                                // response.json({ affectedRows: res });
                                response.json({ affectedRows: resT });
                            }, (error) => {
                                response.status(500).send(error);
                            },
                        );
                    }, (error) => {
                        response.status(500).send(error);
                    },
                );
            })
            .catch((err) => response.status(500).send(err));
    }

    private deleteCotizacionTrasladoMov(request: express.Request, response: express.Response) {
        const idCotizacionTraslado = Number(request.params.idCotizacionTraslado);
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.deleteCotizacionTrasladoMov(idCotizacionTraslado).then(
            (res: CotizacionTraslado) => {
                const cotizacionMov = new CotizacionUnidadTrasladoMov();
                cotizacionMov.idCotizacion = res.idCotizacion;
                cotizacionMov.idGrupoUnidad = res.idGrupoUnidad;
                cotizacionMov.idTraslado = res.idTraslado;
                cotizacionMov.idCotizacionTraslado = res.idCotizacionTraslado;
                cotizacionMov.fechaModificacion = new Date();
                cotizacionMov.tipoMovimiento = 'B';
                cotizacionMov.usuarioModificacion = res.idUsuarioModificacion;
                cotizacionBussines.saveCotizacionUnidadTrasladoMovs(cotizacionMov).then(
                    () => {
                        response.json(res);
                    }, (error) => {
                        response.status(500).send(error);
                    },
                );
            }, (error) => {
                response.status(500).send(error);
            },
        );
    }

    private deleteUnidadApartadaCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.deleteUnidadApartadaCotizacion(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((res) => {
                response.status(200).json(res);
            }, (error) => {
                response.status(500).json(error);
            });
    }

    private saveLeyendaDetalleUnidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const leyendaFactura = request.body.leyendaFactura as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.saveLeyendaDetalleUnidad(idCotizacion, idGrupoUnidad, idDetalleUnidad, leyendaFactura)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }
    private getLeyendaDetalleUnidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getLeyendaDetalleUnidad(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private deleteStatusProcesadoBpro(request: express.Request, response: express.Response) {
        const detalleUnidad = request.body as any[];
        const cotizacionBusiness = new CotizadorBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        cotizacionBusiness.deleteStatusProcesadoBpro(detalleUnidad, idUsuario)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private getEstatusOrdCompraUnidades(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getEstatusOrdCompraUnidades(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }
    private getEstatusOrdCompraRefacciones(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const inventarioUnidadBusiness = new InventarioUnidadBusiness();
        inventarioUnidadBusiness.getEstatusOrdCompraRefacciones(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }
    private asignarVinDetalleUnidad(request: express.Request, response: express.Response) {
        const detalleUnidad = request.body as any[];
        const cotizacionBusiness = new CotizadorBussiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        cotizacionBusiness.asignarVinDetalleUnidad(detalleUnidad, idUsuario)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private getVinAsignadoBpro(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion;
        const idEmpresa = Number(request.params.idEmpresa);
        const idSucursal = Number(request.params.idSucursal);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getVinAsignadoBpro(idCotizacion, idEmpresa, idSucursal)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private conteoGlobalUnidadesInteres(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.conteoGlobalUnidadesInteres(idCotizacion, idGrupoUnidad)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
    }

    private clienteFacturacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.body.idCotizacion as string;
        const idCliente = Number(request.body.idCliente);
        const nombreCliente = request.body.nombreCliente as string;
        const idContacto = Number(request.body.idContacto);
        const cotizacionBusiness = new CotizadorBussiness();
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
    private adicionalesFacturacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.body.idCotizacion as string;
        const idClienteFacturaAdicionales = Number(request.body.idClienteFacturaAdicionales);
        const numeroOCAdicionales = request.body.numeroOCAdicionales as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.adicionalesFacturacion(idCotizacion, idClienteFacturaAdicionales, numeroOCAdicionales)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al Actualizar el Cliente a Facturar Adicionales`, 500, error);
                // response.status(500).json(error);
            });
    }

    private sumaTipoCargoUnidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.body.idCotizacion as string;
        const tipoCargoUnidad = request.body.tipoCargoUnidad as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.sumaTipoCargoUnidad(idCotizacion, tipoCargoUnidad)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al sumar tipo cargo unidad`, 500, error);
                // response.status(500).json(error);
            });
    }

    private creditoLimiteCliente(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idCliente = Number(request.params.idCliente);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.creditoLimiteCliente(idCotizacion, idCliente)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al obtener credito limite`, 500, error);
                // response.status(500).json(error);
            });
    }

    private documentosVencidos(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idCliente = Number(request.params.idCliente);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.documentosVencidos(idCotizacion, idCliente)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al obterner documentos vencidos`, 500, error);
                // response.status(500).json(error);
            });
    }

    private notificaionEnv(request: express.Request, response: express.Response) {
        const idCotizacion = request.body.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.notificaionEnv(idCotizacion)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error Al actualizar el Status de la Notificaion`, 500, error);
                // response.status(500).json(error);
            });
    }

    private actualizarBonificacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const bonificacion = Number(request.body.bonificacion);
        const idBonificacion = request.body.idBonificacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.actualizarBonificacion(idCotizacion, idGrupoUnidad, bonificacion, idBonificacion)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error Al actualizar la bonificacion`, 500, error);
                // response.status(500).json(error);
            });
    }

    private actulizarImprimeFactura(request: express.Request, response: express.Response) {
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const imprimeFactura = request.body.imprimeFactura as boolean;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.actulizarImprimeFactura(idCotizacion, idGrupoUnidad, idDetalleUnidad, imprimeFactura)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error Al actualizar imprime factura`, 500, error);
                // response.status(500).json(error);
            });
    }

    private getCfdiListingByAgency(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getCfdiListingByAgency(idEmpresa)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al obtener el listado de CFDIS por id empresa`, 500, error);
                // response.status(500).json(error);
            });
    }

    private getDataContract(request: express.Request, response: express.Response) {
        const idCliente = Number(request.params.idCliente);
        const idEmpresa = Number(request.params.idEmpresa);
        const idSucursal = Number(request.params.idSucursal);
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.getDataContract(idCliente, idEmpresa, idSucursal)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al obtener el catalogo de contratos`, 500, error);
                // response.status(500).json(error);
            });
    }

    private validaDisponibleCierre(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
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
    private validaDisponibilidadInventario(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idDireccionFlotillas = request.params.idDireccionFlotillas as string;
        const cotizacionBusiness = new CotizadorBussiness();
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
    private validaDisponibilidadInventarioPost(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idDireccionFlotillas = request.params.idDireccionFlotillas as string;
        const cotizacionBusiness = new CotizadorBussiness();
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
      private validaDisponibilidadInventarioPostUpdate(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idDireccionFlotillas = request.params.idDireccionFlotillas as string;
        const cotizacionBusiness = new CotizadorBussiness();
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
    private validaDisponibilidadFolio(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idDireccionFlotillas = request.params.idDireccionFlotillas as string;
        const cotizacionBusiness = new CotizadorBussiness();
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
     private confirmaCancelacionAccesorio(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idDireccionFlotillas = request.params.idDireccionFlotillas as string;
        const cotizacionBusiness = new CotizadorBussiness();
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
    private insertaBitacoraUtilidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new CotizadorBussiness();
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
    private insertaBitacoraUtilidadPosteriores(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new CotizadorBussiness();
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
    private validaNotificacionUtilidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new CotizadorBussiness();
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
     private obtenTotalUtilidad(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new CotizadorBussiness();
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
     private validaBotonUtilidad(request: express.Request, response: express.Response) {
        const idUsuario = Number(request.params.idUsuario);
        const cotizacionBusiness = new CotizadorBussiness();
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
    private obtenNotificacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
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
     private insertaBitacoraUtilidadAdicionales(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idOpcion = Number(request.params.idOpcion);
        const cotizacionBusiness = new CotizadorBussiness();
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
    private validaPerfiles(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.validaPerfiles(idCotizacion)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al validar los perfiles`, 500, error);
            });
    }

    // LBM-COAL
    private validaTipoOrden(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.validaTipoOrden(idCotizacion)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al validar el tipo de orden`, 500, error);
            });
    }

    // LBM-COAL
    private validaUnidadFacturada(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.validaUnidadFacturada(idCotizacion)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al validar la facturación de la unidad`, 500, error);
            });
    }

    // LBM-COAL
    private validaLimiteCredito(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.validaLimiteCredito(idCotizacion)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al validar el limite de credito de la cotizacion`, 500, error);
            });
    }

    private obtieneMargenUtilidadTraslado(request: express.Request, response: express.Response) {
        const direccionFlotilla = request.params.direccionFlotilla as string;
        const cotizacionBusiness = new CotizadorBussiness();
        cotizacionBusiness.obtieneMargenUtilidadTraslado(direccionFlotilla)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al obtener Margen de Utilidad Traslado`, 500, error);
                // response.status(500).json(error);
            });
    }

    private deleteUnidadInteres(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const vin = request.params.vin as string;
        const cotizacionBussines = new CotizadorBussiness();
        cotizacionBussines.deleteUnidadInteres(idCotizacion, vin)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                respuesta.error(request, response, `Error al eliminar la unidad de unidad interes`, 500, error);
            });
    }

    private get1erNotificacionCotizacion(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizadorBussiness = new CotizadorBussiness();
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

    private udpNotificacionCotizacion1er(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const estatus = Number(request.params.estatus);
        const cotizadorBussiness = new CotizadorBussiness();
        cotizadorBussiness.udpNotificacionCotizacion1er(idCotizacion, estatus)
            .then((res) => {
                response.status(200).json(res);
            })
            .catch((error) => {
                response.status(500).send(error);
                //  respuesta.console.error(request, response, `No se encontro Notificacion`, 500, error);
            });
    }

    private CancelaUnidadOrdenCompra(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const idGrupoUnidad = Number(request.params.idGrupoUnidad);
        const idDetalleUnidad = Number(request.params.idDetalleUnidad);
        const cotizadorBussiness = new CotizadorBussiness();
        cotizadorBussiness.CancelaUnidadOrdenCompra(idCotizacion, idGrupoUnidad, idDetalleUnidad)
            .then((resp) => {
                response.status(200).json(resp);
            })
            .catch((error) => {
                response.status(500).send(error);
                //  respuesta.console.error(request, response, `No se encontro Notificacion`, 500, error);
            });
    }

    private getpendienteSisco(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizadorBussiness = new CotizadorBussiness();
        cotizadorBussiness.getpendienteSisco(idCotizacion)
            .then((resp) => {
                response.status(200).json(resp);
            })
            .catch((error) => {
                response.status(500).send(error);
            });
    }

    private getestatusSisco(request: express.Request, response: express.Response) {
        const idCotizacion = request.params.idCotizacion as string;
        const cotizadorBussiness = new CotizadorBussiness();
        cotizadorBussiness.getestatusSisco(idCotizacion)
            .then((resp) => {
                response.status(200).json(resp);
            })
            .catch((error) => {
                response.status(500).send(error);
            });
    }

    private cfdiCliente(request: express.Request, response: express.Response) {
        const idEmpresa = Number(request.params.idEmpresa);
        const idSucursal = Number(request.params.idSucursal);
        const idCliente = Number(request.params.idCliente);
        const idCotizacion = request.params.idCotizacion as string;
        const cotizadorBussiness = new CotizadorBussiness();
        cotizadorBussiness.cfdiCliente(idEmpresa, idSucursal, idCliente, idCotizacion)
            .then((resp) => {
                response.status(200).json(resp);
            })
            .catch((error) => {
                response.status(500).send(error);
            });
    }
}
