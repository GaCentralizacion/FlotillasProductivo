import express from 'express';
import { Validator } from 'express-json-validator-middleware';
import { PedidoBusiness } from '../business/pedido/pedido.business';
import { CotizacionGrupoUnidad } from '../db/model/cotizador';
import postGrupoUnidad from '../schemas/cotizador/cotizacion_grupo_unidad.schema.json';
import postActualizaPedidoPosteriorSchema from '../schemas/pedido/actualiza_pedido_posterior.schema.json';
import postActualizaPedidoPosteriorArray from '../schemas/pedido/actualiza_pedido_posterior_array.schema.json';
import postActualizarPedidoSchema from '../schemas/pedido/actualizar_pedido.schema.json';
import postActualizarPedidoArray from '../schemas/pedido/actualizar_pedido_array.schema.json';
import postCambiaStatusCotizacionUnidadesPosteriorSchema from '../schemas/pedido/cambia_status_cotizacion_unidades_posterior.schema.json';
import postCambiaStatusCotizacionUnidadesPosteriorArray from '../schemas/pedido/cambia_status_cotizacion_unidades_posterior_array.schema.json';
import postCambiaStatusOrdenesDeCompraPendientesSchema from '../schemas/pedido/cambia_status_ordenes_compra_pendientes.schema.json';
import postCambiaStatusOrdenesDeCompraPendientesArray from '../schemas/pedido/cambia_status_ordenes_compra_pendientes_array.schema.json';
import postCancelacionDeAccesoriosSchema from '../schemas/pedido/cancelacion_de_accesorios.schema.json';
import postCancelacionDeAccesoriosArray from '../schemas/pedido/cancelacion_de_accesorios_array.schema.json';
import postCancelacionDeAccesoriosDespuesPedidoSchema from '../schemas/pedido/cancelacion_de_accesorios_despues_pedido.schema.json';
import postCancelacionDeAccesoriosSinVinSchema from '../schemas/pedido/cancelacion_de_accesorios_sin_vin.schema.json';
import postCancelacionDeAccesoriosSinVinArray from '../schemas/pedido/cancelacion_de_accesorios_sin_vin_array.schema.json';
import postCancelacionDePedidoDeUnidadesSchema from '../schemas/pedido/cancelacion_de_pedido_unidad.schema.json';
import postCancelacionDePedidoDeUnidadesAllSchema from '../schemas/pedido/cancelacion_de_pedido_unidad_all.schema.json';
import postCancelacionDePedidoDeUnidadesAllArray from '../schemas/pedido/cancelacion_de_pedido_unidad_all_array.schema.json';
import postCancelacionDePedidoDeUnidadesArray from '../schemas/pedido/cancelacion_de_pedido_unidad_array.schema.json';
import postCancelacionDeTramitesSchema from '../schemas/pedido/cancelacion_de_tramites.schema.json';
import postCancelacionDeTramitesArray from '../schemas/pedido/cancelacion_de_tramites_array.schema.json';
import postCancelacionOrdenesDeServicioSchema from '../schemas/pedido/cancelacion_ordenes_de_servicio.schema.json';
import postCancelacionOrdenesDeServicioArray from '../schemas/pedido/cancelacion_ordenes_de_servicio_array.schema.json';
import postCancelacionOrdenesDeServicioDespuesPedidoSchema from '../schemas/pedido/cancelacion_ordenes_de_servicios_despues_pedido.schema.json';
import postCancelacionDeAccesoriosDespuesPedidoArray from '../schemas/pedido/cancelacion_ordenes_de_servicios_despues_pedido_array.schema.json';
import postCancelacionOrdenesDeServicioDespuesPedidoArray from '../schemas/pedido/cancelacion_ordenes_de_servicios_despues_pedido_array.schema.json';
import postCancelacionOrdenesDeServicioSinVinSchema from '../schemas/pedido/cancelacion_ordenes_de_servicios_sin_vin.schema.json';
import postCancelacionOrdenesDeServicioSinVinArray from '../schemas/pedido/cancelacion_ordenes_de_servicios_sin_vin_array.schema.json';
import postCancelacionDeTramitesDespuesPedidoSchema from '../schemas/pedido/cancelacion_tramites_despues_pedido.schema.json';
import postCancelacionDeTramitesDespuesPedidoArray from '../schemas/pedido/cancelacion_tramites_despues_pedido_array.schema.json';
import postCancelacionDeTramitesSinVinSchema from '../schemas/pedido/cancelacion_tramites_sin_vin.schema.json';
import postCancelacionDeTramitesSinVinArray from '../schemas/pedido/cancelacion_tramites_sin_vin_array.schema.json';
import postCancelarAccesorioDePedidoAdicionalesSchema from '../schemas/pedido/cancelar_accesorio_de_pedido_adicionales.schema.json';
import postcancelarAccesorioDePedidoAdicionalesArray from '../schemas/pedido/cancelar_accesorio_de_pedido_adicionales_array.schema.json';
import postCancelarAccesorioDePedidoPosteriorSchema from '../schemas/pedido/cancelar_accesorio_de_pedido_posterior.schema.json';
import postcancelarAccesorioDePedidoPosteriorArray from '../schemas/pedido/cancelar_accesorio_de_pedido_posterior_array.schema.json';
import postCancelarFacturacionUnidadesSchema from '../schemas/pedido/cancelar_facturacion_unidades.schema.json';
import postCancelarFacturacionUnidadesArray from '../schemas/pedido/cancelar_facturacion_unidades_array.schema.json';
import postConsolidacionFlotillasBproSchema from '../schemas/pedido/consolidacion_flotillas_bpro.schema.json';
import postConsolidacionFlotillasBproArray from '../schemas/pedido/consolidacion_flotillas_bpro_array.schema.json';
import postGeneracionDePedidoFlotillaBproSchema from '../schemas/pedido/generacion_pedido_flotillas_bpro.schema.json';
import postGeneracionDePedidoFlotillaBproArray from '../schemas/pedido/generacion_pedido_flotillas_bpro_array.schema.json';
import postGenerarPedidoMovBproTrasladoSchema from '../schemas/pedido/generar_pedido_movbpro_traslado.schema.json';
import postGenerarPedidoMovBproTrasladoArray from '../schemas/pedido/generar_pedido_movbpro_traslado_array.schema.json';
import postValidaExistenciaDeMovimientosSchema from '../schemas/pedido/valida_existencia_movimientos.schema.json';
import postValidaExistenciaDeMovimientosArray from '../schemas/pedido/valida_existencia_movimientos_array.schema.json';
import postValidaOrdenesDeCompraSchema from '../schemas/pedido/valida_ordenes_de_compra.schema.json';
import postValidaOrdenesDeCompraArray from '../schemas/pedido/valida_ordenes_de_compra_array.schema.json';
import postVerificarEnviadoBproSchema from '../schemas/pedido/verificar_enviado_bpro.schema.json';
import postVerificarEnviadoBproArray from '../schemas/pedido/verificar_enviado_bpro_array.schema.json';

import { BaseController } from './base.controller';
import { IController } from './controller.interface';

export class PedidoController extends BaseController implements IController {
    basePath = '/pedido';
    router = express.Router();

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        const validator = new Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;

        const postConsolidacionFlotillasBpro = ajv
        .addSchema(postConsolidacionFlotillasBproSchema)
        .compile(postConsolidacionFlotillasBproArray).schema;
        this.router.post(
            `${this.basePath}/consolidacionFlotillasBpro`,
            validate({ body: postConsolidacionFlotillasBpro }),
            this.consolidacionFlotillasBpro.bind(this),
        );

        const postGenerarPedidoMovBproTraslado = ajv
        .addSchema(postGenerarPedidoMovBproTrasladoSchema)
        .compile(postGenerarPedidoMovBproTrasladoArray).schema;
        this.router.post(
            `${this.basePath}/generarPedidoMovBproTraslado`,
            validate({ body: postGenerarPedidoMovBproTraslado }),
            this.generarPedidoMovBproTraslado.bind(this),
        );

        const postCancelarFacturacionUnidades = ajv
        .addSchema(postCancelarFacturacionUnidadesSchema)
        .compile(postCancelarFacturacionUnidadesArray).schema;
        this.router.post(
            `${this.basePath}/cancelarFacturacionUnidades`,
            validate({body: postCancelarFacturacionUnidades}),
            this.cancelarFacturacionUnidades.bind(this),
        );

        const postValidaOrdenesDeCompra = ajv
        .addSchema(postValidaOrdenesDeCompraSchema)
        .compile(postValidaOrdenesDeCompraArray).schema;
        this.router.post(
            `${this.basePath}/validaOrdenesDeCompra`,
            validate({ body: postValidaOrdenesDeCompra }),
            this.validaOrdenesDeCompra.bind(this),
        );

        const postCambiaStatusOrdenesDeCompraPendientes = ajv
        .addSchema(postCambiaStatusOrdenesDeCompraPendientesSchema)
        .compile(postCambiaStatusOrdenesDeCompraPendientesArray).schema;
        this.router.post(
            `${this.basePath}/cambiaStatusOrdenesDeCompraPendientes`,
            validate({ body: postCambiaStatusOrdenesDeCompraPendientes }),
            this.cambiaStatusOrdenesDeCompraPendientes.bind(this),
        );

        const postGeneracionDePedidoFlotillaBpro = ajv
        .addSchema(postGeneracionDePedidoFlotillaBproSchema)
        .compile(postGeneracionDePedidoFlotillaBproArray).schema;
        this.router.post(
            `${this.basePath}/generacionDePedidoFlotillaBpro`,
            validate({ body: postGeneracionDePedidoFlotillaBpro }),
            this.generacionDePedidoFlotillaBpro.bind(this),
        );

        const postValidaExistenciaDeMovimientos = ajv
        .addSchema(postValidaExistenciaDeMovimientosSchema)
        .compile(postValidaExistenciaDeMovimientosArray).schema;
        this.router.post(
            `${this.basePath}/validaExistenciaDeMovimientos`,
            validate({ body: postValidaExistenciaDeMovimientos }),
            this.validaExistenciaDeMovimientos.bind(this),
        );

        const postCancelacionOrdenesDeServicio = ajv
        .addSchema(postCancelacionOrdenesDeServicioSchema)
        .compile(postCancelacionOrdenesDeServicioArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionOrdenesDeServicio`,
            validate({ body: postCancelacionOrdenesDeServicio }),
            this.cancelacionOrdenesDeServicio.bind(this),
        );

        const postCancelacionDeTramites = ajv
        .addSchema(postCancelacionDeTramitesSchema)
        .compile(postCancelacionDeTramitesArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionDeTramites`,
            validate({ body: postCancelacionDeTramites }),
            this.cancelacionDeTramites.bind(this),
        );

        const postCancelacionDeAccesorios = ajv
        .addSchema(postCancelacionDeAccesoriosSchema)
        .compile(postCancelacionDeAccesoriosArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionDeAccesorios`,
            validate({ body: postCancelacionDeAccesorios }),
            this.cancelacionDeAccesorios.bind(this),
        );

        // Cancelacion sin VIN

        const postCancelacionOrdenesDeServicioSinVin = ajv
        .addSchema(postCancelacionOrdenesDeServicioSinVinSchema)
        .compile(postCancelacionOrdenesDeServicioSinVinArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionOrdenesDeServicioDespuesPedido`,
            validate({ body: postCancelacionOrdenesDeServicioSinVin }),
            this.cancelacionOrdenesDeServicioDespuesPedido.bind(this),
        );

        const postCancelacionDeTramitesSinVin = ajv
        .addSchema(postCancelacionDeTramitesSinVinSchema)
        .compile(postCancelacionDeTramitesSinVinArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionDeTramitesSinVin`,
            validate({ body: postCancelacionDeTramitesSinVin }),
            this.cancelacionDeTramitesSinVin.bind(this),
        );

        const postCancelacionDeAccesoriosSinVin = ajv
        .addSchema(postCancelacionDeAccesoriosSinVinSchema)
        .compile(postCancelacionDeAccesoriosSinVinArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionDeAccesoriosSinVin`,
            validate({ body: postCancelacionDeAccesoriosSinVin }),
            this.cancelacionDeAccesoriosSinVin.bind(this),
        );

        this.router.post(
            `${this.basePath}/guardarUnidadGestionFlotillas`,
            validate({ body: postGrupoUnidad }),
            this.guardarUnidadGestionFlotillas.bind(this),
        );

        // Cancelación despues del pedido

        const postCancelacionOrdenesDeServicioDespuesPedido = ajv
        .addSchema(postCancelacionOrdenesDeServicioDespuesPedidoSchema)
        .compile(postCancelacionOrdenesDeServicioDespuesPedidoArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionOrdenesDeServicioDespuesPedido`,
            validate({ body: postCancelacionOrdenesDeServicioDespuesPedido }),
            this.cancelacionOrdenesDeServicioDespuesPedido.bind(this),
        );

        const postCancelacionDeTramitesDespuesPedido = ajv
        .addSchema(postCancelacionDeTramitesDespuesPedidoSchema)
        .compile(postCancelacionDeTramitesDespuesPedidoArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionDeTramitesDespuesPedido`,
            validate({ body: postCancelacionDeTramitesDespuesPedido }),
            this.cancelacionDeTramitesDespuesPedido.bind(this),
        );

        const postCancelacionDeAccesoriosDespuesPedido = ajv
        .addSchema(postCancelacionDeAccesoriosDespuesPedidoSchema)
        .compile(postCancelacionDeAccesoriosDespuesPedidoArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionDeAccesoriosDespuesPedido`,
            validate({ body: postCancelacionDeAccesoriosDespuesPedido }),
            this.cancelacionDeAccesoriosDespuesPedido.bind(this),
        );

        const postcancelarAccesorioDePedidoAdicionales = ajv
        .addSchema(postCancelarAccesorioDePedidoAdicionalesSchema)
        .compile(postcancelarAccesorioDePedidoAdicionalesArray).schema;
        this.router.post(
            `${this.basePath}/cancelarAccesorioDePedidoAdicionales`,
            validate({ body: postcancelarAccesorioDePedidoAdicionales }),
            this.cancelarAccesorioDePedidoAdicionales.bind(this),
        );

        const postcancelarAccesorioDePedidoPosterior = ajv
        .addSchema(postCancelarAccesorioDePedidoPosteriorSchema)
        .compile(postcancelarAccesorioDePedidoPosteriorArray).schema;
        this.router.post(
            `${this.basePath}/cancelarAccesorioDePedidoPosterior`,
            validate({ body: postcancelarAccesorioDePedidoPosterior }),
            this.cancelarAccesorioDePedidoPosterior.bind(this),
        );

        const postCancelacionDePedidoDeUnidades = ajv
        .addSchema(postCancelacionDePedidoDeUnidadesSchema)
        .compile(postCancelacionDePedidoDeUnidadesArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionDePedidoDeUnidades`,
            validate({ body: postCancelacionDePedidoDeUnidades }),
            this.cancelacionDePedidoDeUnidades.bind(this),
        );

        const postCancelacionDePedidoDeUnidadesAll = ajv
        .addSchema(postCancelacionDePedidoDeUnidadesAllSchema)
        .compile(postCancelacionDePedidoDeUnidadesAllArray).schema;
        this.router.post(
            `${this.basePath}/cancelacionDePedidoDeUnidadesAll`,
            validate({ body: postCancelacionDePedidoDeUnidadesAll }),
            this.cancelacionDePedidoDeUnidadesAll.bind(this),
        );

        this.router.get(
            `${this.basePath}/statusInstruccionCancelacion/:idCotizacion`,
            this.statusInstruccionCancelacion.bind(this),
        );

        this.router.get(
            `${this.basePath}/getPedidoBproStatus/:idCotizacion`,
            this.getPedidoBproStatus.bind(this),
        );

        const postCambiaStatusCotizacionUnidadesPosterior = ajv
        .addSchema(postCambiaStatusCotizacionUnidadesPosteriorSchema)
        .compile(postCambiaStatusCotizacionUnidadesPosteriorArray).schema;
        this.router.post(
            `${this.basePath}/cambiaStatusCotizacionUnidadesPosterior`,
            validate({ body: postCambiaStatusCotizacionUnidadesPosterior }),
            this.cambiaStatusCotizacionUnidadesPosterior.bind(this),
        );

        this.router.get(
            `${this.basePath}/validaUnidadesFlotillasBpro/:idCotizacion`,
            this.validaUnidadesFlotillasBpro.bind(this),
        );

        this.router.get(
            `${this.basePath}/cancelacionProcesada/:idCotizacion`,
            this.cancelacionProcesada.bind(this),
        );

        this.router.get(
            `${this.basePath}/getLicitiacionBpro/:idCotizacion`,
            this.getLicitiacionBpro.bind(this),
        );

        const postActualizarPedido = ajv
        .addSchema(postActualizarPedidoSchema)
        .compile(postActualizarPedidoArray).schema;
        this.router.post(
            `${this.basePath}/actualizarPedido`,
            validate({ body: postActualizarPedido }),
            this.actualizarPedido.bind(this),
        );

        this.router.get(
            `${this.basePath}/validaOrdenesDeCompraPendientes/:idCotizacion`,
            this.validaOrdenesDeCompraPendientes.bind(this),
        );

        const postVerificarEnviadoBpro = ajv
        .addSchema(postVerificarEnviadoBproSchema)
        .compile(postVerificarEnviadoBproArray).schema;
        this.router.post(
            `${this.basePath}/verificarEnviadoBpro`,
            validate({ body: postVerificarEnviadoBpro }),
            this.verificarEnviadoBpro.bind(this),
        );
        // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
        this.router.get(
            `${this.basePath}/verificaUnidadesFacturadas/:idCotizacion`,
            this.verificaUnidadesFacturadas.bind(this),
        );

        // OCT 99 20210215 GESTION - Agregar accesorios en Posteriores/Adicionales 1: activa , 0: desactiva
        this.router.get(
            `${this.basePath}/validaAgregarAccesoriosPostAd/:idCotizacion`,
            this.validaAgregarAccesoriosPostAd.bind(this),
        );

        // OCT 99 20210118 sino hay OC pendientes, cambia estatus de Cotizacion a ORDENES DE COMPRA COMPLETADAS
        this.router.get(
            `${this.basePath}/flotillasEvalua/:idCotizacion`,
            this.flotillasEvalua.bind(this),
        );

        // OCT 99 20210118 consulta el estatus de la cotizacion
        this.router.get(
            `${this.basePath}/consultaEstatusCotizacion/:idCotizacion`,
            this.consultaEstatusCotizacion.bind(this),
        );

        const postActualizaPedidoPosterior = ajv
        .addSchema(postActualizaPedidoPosteriorSchema)
        .compile(postActualizaPedidoPosteriorArray).schema;
        this.router.post(
            `${this.basePath}/actualizaPedidoPosterior`,
            validate({ body: postActualizaPedidoPosterior }),
            this.actualizaPedidoPosterior.bind(this),
        );
    }

    private consolidacionFlotillasBpro(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body[0].idCotizacion as string;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        pedidoBusiness.consolidacionFlotillasBpro(idCotizacion, idUsuario)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private generarPedidoMovBproTraslado(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body[0].idCotizacion as string;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        pedidoBusiness.generarPedidoMovBproTraslado(idCotizacion, idUsuario)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelarFacturacionUnidades(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const detalleUnidad = request.body as any[];
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        pedidoBusiness.cancelarFacturacionUnidades(detalleUnidad, idUsuario)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private validaOrdenesDeCompra(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = (request.body.length && request.body[0].idCotizacion) ? request.body[0].idCotizacion as string : '';
        pedidoBusiness.validaOrdenesDeCompra(idCotizacion, idUsuario)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cambiaStatusOrdenesDeCompraPendientes(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.body.idCotizacion;
        pedidoBusiness.cambiaStatusOrdenesDeCompraPendientes(idCotizacion, idUsuario)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private generacionDePedidoFlotillaBpro(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = (request.body.length && request.body[0].idCotizacion) ? request.body[0].idCotizacion as string : '';
        pedidoBusiness.generacionDePedidoFlotillaBpro(idCotizacion, idUsuario)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private validaExistenciaDeMovimientos(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = (request.body.length && request.body[0].idCotizacion) ? request.body[0].idCotizacion as string : '';
        pedidoBusiness.validaExistenciaDeMovimientos(idCotizacion, idUsuario)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionOrdenesDeServicio(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const vin = request.body.vin as string;
        const idCotizacion = request.body.idCotizacion as string;
        pedidoBusiness.cancelacionOrdenesDeServicio(idCotizacion, vin)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionDeTramites(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const vin = request.body.vin as string;
        const idCotizacion = request.body.idCotizacion as string;
        pedidoBusiness.cancelacionDeTramites(idCotizacion, vin)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionDeAccesorios(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const vin = request.body.vin as string;
        const idCotizacion = request.body.idCotizacion as string;
        pedidoBusiness.cancelacionDeAccesorios(idCotizacion, vin)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    // Eliminacion sin vin

    private cancelacionOrdenesDeServicioSinVin(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const idServicioUnidad = request.body.idServicioUnidad as string;
        pedidoBusiness.cancelacionOrdenesDeServicioSinVin(idCotizacion, idGrupoUnidad, idDetalleUnidad, idServicioUnidad)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionDeTramitesSinVin(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const idTramite = request.body.idTramite as string;
        pedidoBusiness.cancelacionDeTramitesSinVin(idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionDeAccesoriosSinVin(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const idAccesorio = request.body.idAccesorio as string;
        const idAccesorioNuevo = Number(request.body.idAccesorioNuevo);
        const idParte = request.body.idParte as string;
        pedidoBusiness.cancelacionDeAccesoriosSinVin(idCotizacion, idGrupoUnidad, idDetalleUnidad, idAccesorio, idAccesorioNuevo, idParte)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private guardarUnidadGestionFlotillas(request: express.Request, response: express.Response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const grupoUnidad = request.body as CotizacionGrupoUnidad;
        grupoUnidad.idUsuarioModificacion = idUsuario;
        grupoUnidad.fechaModificacion = new Date();
        const cotizadorBussiness = new PedidoBusiness();
        cotizadorBussiness.guardarUnidadGestionFlotillas(grupoUnidad).then(
            (grupoUnidadSaved: CotizacionGrupoUnidad) => {
                response.json(grupoUnidadSaved);
            },
            (error) => {
                this.errorHandler(response, error);
            },
        );
    }

    // Cancelación despues del pedido - Se ejecutan cuando la cotizacion tiene estatus 13

    private cancelacionOrdenesDeServicioDespuesPedido(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        const vin = request.body.vin as string;
        const idServicioUnidad = request.body.idServicioUnidad as string;
        pedidoBusiness.cancelacionOrdenesDeServicioDespuesPedido(idCotizacion, vin, idServicioUnidad)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionDeTramitesDespuesPedido(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        const vin = request.body.vin as string;
        const idSubtramite = request.body.idSubtramite as string;
        pedidoBusiness.cancelacionDeTramitesDespuesPedido(idCotizacion, vin, idSubtramite)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionDeAccesoriosDespuesPedido(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const vin = request.body.vin as string;
        const idAccesorioNuevo = Number(request.body.idAccesorioNuevo);
        const idParte = request.body.idParte as string;
        pedidoBusiness.cancelacionDeAccesoriosDespuesPedido(idCotizacion, idGrupoUnidad, idDetalleUnidad, vin, idAccesorioNuevo, idParte)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelarAccesorioDePedidoAdicionales(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const vin = request.body.vin as string;
        const idAccesorioNuevo = Number(request.body.idAccesorioNuevo);
        const idParte = request.body.idParte as string;
        pedidoBusiness.cancelarAccesorioDePedidoAdicionales(idCotizacion, idGrupoUnidad, idDetalleUnidad, vin, idAccesorioNuevo, idParte)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelarAccesorioDePedidoPosterior(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const vin = request.body.vin as string;
        const idAccesorioNuevo = Number(request.body.idAccesorioNuevo);
        const idParte = request.body.idParte as string;
        pedidoBusiness.cancelarAccesorioDePedidoPosterior(idCotizacion, idGrupoUnidad, idDetalleUnidad, vin, idAccesorioNuevo, idParte)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionDePedidoDeUnidades(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const grupoUnidades = request.body as any[];
        pedidoBusiness.cancelacionDePedidoDeUnidades(grupoUnidades)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionDePedidoDeUnidadesAll(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const grupoUnidades = request.body as any[];
        pedidoBusiness.cancelacionDePedidoDeUnidadesAll(grupoUnidades)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private statusInstruccionCancelacion(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.statusInstruccionCancelacion(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private getPedidoBproStatus(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.getPedidoBproStatus(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cambiaStatusCotizacionUnidadesPosterior(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.body.idCotizacion as string;
        pedidoBusiness.cambiaStatusCotizacionUnidadesPosterior(idCotizacion, idUsuario)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private validaUnidadesFlotillasBpro(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.validaUnidadesFlotillasBpro(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private cancelacionProcesada(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.cancelacionProcesada(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private getLicitiacionBpro(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.getLicitiacionBpro(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private actualizarPedido(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.body.idCotizacion as string;
        pedidoBusiness.actualizarPedido(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private validaOrdenesDeCompraPendientes(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.validaOrdenesDeCompraPendientes(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private verificarEnviadoBpro(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        pedidoBusiness.verificarEnviadoBpro(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
    private verificaUnidadesFacturadas(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.verificaUnidadesFacturadas(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    // OCT 99 20210215 GESTION - Agregar accesorios en Posteriores/Adicionales 1: activa , 0: desactiva
    private validaAgregarAccesoriosPostAd(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.validaAgregarAccesoriosPostAd(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
    private flotillasEvalua(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.flotillasEvalua(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
    private consultaEstatusCotizacion(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.params.idCotizacion as string;
        pedidoBusiness.consultaEstatusCotizacion(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }

    private actualizaPedidoPosterior(request: express.Request, response: express.Response) {
        const pedidoBusiness = new PedidoBusiness();
        const idCotizacion = request.body.idCotizacion as string;
        pedidoBusiness.actualizaPedidoPosterior(idCotizacion)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((error) => {
            response.status(500).json(error);
        });
    }
}
