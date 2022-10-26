"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
const pedido_business_1 = require("../business/pedido/pedido.business");
const cotizacion_grupo_unidad_schema_json_1 = __importDefault(require("../schemas/cotizador/cotizacion_grupo_unidad.schema.json"));
const actualiza_pedido_posterior_schema_json_1 = __importDefault(require("../schemas/pedido/actualiza_pedido_posterior.schema.json"));
const actualiza_pedido_posterior_array_schema_json_1 = __importDefault(require("../schemas/pedido/actualiza_pedido_posterior_array.schema.json"));
const actualizar_pedido_schema_json_1 = __importDefault(require("../schemas/pedido/actualizar_pedido.schema.json"));
const actualizar_pedido_array_schema_json_1 = __importDefault(require("../schemas/pedido/actualizar_pedido_array.schema.json"));
const cambia_status_cotizacion_unidades_posterior_schema_json_1 = __importDefault(require("../schemas/pedido/cambia_status_cotizacion_unidades_posterior.schema.json"));
const cambia_status_cotizacion_unidades_posterior_array_schema_json_1 = __importDefault(require("../schemas/pedido/cambia_status_cotizacion_unidades_posterior_array.schema.json"));
const cambia_status_ordenes_compra_pendientes_schema_json_1 = __importDefault(require("../schemas/pedido/cambia_status_ordenes_compra_pendientes.schema.json"));
const cambia_status_ordenes_compra_pendientes_array_schema_json_1 = __importDefault(require("../schemas/pedido/cambia_status_ordenes_compra_pendientes_array.schema.json"));
const cancelacion_de_accesorios_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_accesorios.schema.json"));
const cancelacion_de_accesorios_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_accesorios_array.schema.json"));
const cancelacion_de_accesorios_despues_pedido_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_accesorios_despues_pedido.schema.json"));
const cancelacion_de_accesorios_sin_vin_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_accesorios_sin_vin.schema.json"));
const cancelacion_de_accesorios_sin_vin_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_accesorios_sin_vin_array.schema.json"));
const cancelacion_de_pedido_unidad_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_pedido_unidad.schema.json"));
const cancelacion_de_pedido_unidad_all_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_pedido_unidad_all.schema.json"));
const cancelacion_de_pedido_unidad_all_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_pedido_unidad_all_array.schema.json"));
const cancelacion_de_pedido_unidad_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_pedido_unidad_array.schema.json"));
const cancelacion_de_tramites_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_tramites.schema.json"));
const cancelacion_de_tramites_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_de_tramites_array.schema.json"));
const cancelacion_ordenes_de_servicio_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_ordenes_de_servicio.schema.json"));
const cancelacion_ordenes_de_servicio_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_ordenes_de_servicio_array.schema.json"));
const cancelacion_ordenes_de_servicios_despues_pedido_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_ordenes_de_servicios_despues_pedido.schema.json"));
const cancelacion_ordenes_de_servicios_despues_pedido_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_ordenes_de_servicios_despues_pedido_array.schema.json"));
const cancelacion_ordenes_de_servicios_despues_pedido_array_schema_json_2 = __importDefault(require("../schemas/pedido/cancelacion_ordenes_de_servicios_despues_pedido_array.schema.json"));
const cancelacion_ordenes_de_servicios_sin_vin_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_ordenes_de_servicios_sin_vin.schema.json"));
const cancelacion_ordenes_de_servicios_sin_vin_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_ordenes_de_servicios_sin_vin_array.schema.json"));
const cancelacion_tramites_despues_pedido_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_tramites_despues_pedido.schema.json"));
const cancelacion_tramites_despues_pedido_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_tramites_despues_pedido_array.schema.json"));
const cancelacion_tramites_sin_vin_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_tramites_sin_vin.schema.json"));
const cancelacion_tramites_sin_vin_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelacion_tramites_sin_vin_array.schema.json"));
const cancelar_accesorio_de_pedido_adicionales_schema_json_1 = __importDefault(require("../schemas/pedido/cancelar_accesorio_de_pedido_adicionales.schema.json"));
const cancelar_accesorio_de_pedido_adicionales_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelar_accesorio_de_pedido_adicionales_array.schema.json"));
const cancelar_accesorio_de_pedido_posterior_schema_json_1 = __importDefault(require("../schemas/pedido/cancelar_accesorio_de_pedido_posterior.schema.json"));
const cancelar_accesorio_de_pedido_posterior_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelar_accesorio_de_pedido_posterior_array.schema.json"));
const cancelar_facturacion_unidades_schema_json_1 = __importDefault(require("../schemas/pedido/cancelar_facturacion_unidades.schema.json"));
const cancelar_facturacion_unidades_array_schema_json_1 = __importDefault(require("../schemas/pedido/cancelar_facturacion_unidades_array.schema.json"));
const consolidacion_flotillas_bpro_schema_json_1 = __importDefault(require("../schemas/pedido/consolidacion_flotillas_bpro.schema.json"));
const consolidacion_flotillas_bpro_array_schema_json_1 = __importDefault(require("../schemas/pedido/consolidacion_flotillas_bpro_array.schema.json"));
const generacion_pedido_flotillas_bpro_schema_json_1 = __importDefault(require("../schemas/pedido/generacion_pedido_flotillas_bpro.schema.json"));
const generacion_pedido_flotillas_bpro_array_schema_json_1 = __importDefault(require("../schemas/pedido/generacion_pedido_flotillas_bpro_array.schema.json"));
const generar_pedido_movbpro_traslado_schema_json_1 = __importDefault(require("../schemas/pedido/generar_pedido_movbpro_traslado.schema.json"));
const generar_pedido_movbpro_traslado_array_schema_json_1 = __importDefault(require("../schemas/pedido/generar_pedido_movbpro_traslado_array.schema.json"));
const valida_existencia_movimientos_schema_json_1 = __importDefault(require("../schemas/pedido/valida_existencia_movimientos.schema.json"));
const valida_existencia_movimientos_array_schema_json_1 = __importDefault(require("../schemas/pedido/valida_existencia_movimientos_array.schema.json"));
const valida_ordenes_de_compra_schema_json_1 = __importDefault(require("../schemas/pedido/valida_ordenes_de_compra.schema.json"));
const valida_ordenes_de_compra_array_schema_json_1 = __importDefault(require("../schemas/pedido/valida_ordenes_de_compra_array.schema.json"));
const verificar_enviado_bpro_schema_json_1 = __importDefault(require("../schemas/pedido/verificar_enviado_bpro.schema.json"));
const verificar_enviado_bpro_array_schema_json_1 = __importDefault(require("../schemas/pedido/verificar_enviado_bpro_array.schema.json"));
const base_controller_1 = require("./base.controller");
class PedidoController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.basePath = '/pedido';
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        const validator = new express_json_validator_middleware_1.Validator({ allErros: true });
        const validate = validator.validate;
        const ajv = validator.ajv;
        const postConsolidacionFlotillasBpro = ajv
            .addSchema(consolidacion_flotillas_bpro_schema_json_1.default)
            .compile(consolidacion_flotillas_bpro_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/consolidacionFlotillasBpro`, validate({ body: postConsolidacionFlotillasBpro }), this.consolidacionFlotillasBpro.bind(this));
        const postGenerarPedidoMovBproTraslado = ajv
            .addSchema(generar_pedido_movbpro_traslado_schema_json_1.default)
            .compile(generar_pedido_movbpro_traslado_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/generarPedidoMovBproTraslado`, validate({ body: postGenerarPedidoMovBproTraslado }), this.generarPedidoMovBproTraslado.bind(this));
        const postCancelarFacturacionUnidades = ajv
            .addSchema(cancelar_facturacion_unidades_schema_json_1.default)
            .compile(cancelar_facturacion_unidades_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelarFacturacionUnidades`, validate({ body: postCancelarFacturacionUnidades }), this.cancelarFacturacionUnidades.bind(this));
        const postValidaOrdenesDeCompra = ajv
            .addSchema(valida_ordenes_de_compra_schema_json_1.default)
            .compile(valida_ordenes_de_compra_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/validaOrdenesDeCompra`, validate({ body: postValidaOrdenesDeCompra }), this.validaOrdenesDeCompra.bind(this));
        const postCambiaStatusOrdenesDeCompraPendientes = ajv
            .addSchema(cambia_status_ordenes_compra_pendientes_schema_json_1.default)
            .compile(cambia_status_ordenes_compra_pendientes_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cambiaStatusOrdenesDeCompraPendientes`, validate({ body: postCambiaStatusOrdenesDeCompraPendientes }), this.cambiaStatusOrdenesDeCompraPendientes.bind(this));
        const postGeneracionDePedidoFlotillaBpro = ajv
            .addSchema(generacion_pedido_flotillas_bpro_schema_json_1.default)
            .compile(generacion_pedido_flotillas_bpro_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/generacionDePedidoFlotillaBpro`, validate({ body: postGeneracionDePedidoFlotillaBpro }), this.generacionDePedidoFlotillaBpro.bind(this));
        const postValidaExistenciaDeMovimientos = ajv
            .addSchema(valida_existencia_movimientos_schema_json_1.default)
            .compile(valida_existencia_movimientos_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/validaExistenciaDeMovimientos`, validate({ body: postValidaExistenciaDeMovimientos }), this.validaExistenciaDeMovimientos.bind(this));
        const postCancelacionOrdenesDeServicio = ajv
            .addSchema(cancelacion_ordenes_de_servicio_schema_json_1.default)
            .compile(cancelacion_ordenes_de_servicio_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionOrdenesDeServicio`, validate({ body: postCancelacionOrdenesDeServicio }), this.cancelacionOrdenesDeServicio.bind(this));
        const postCancelacionDeTramites = ajv
            .addSchema(cancelacion_de_tramites_schema_json_1.default)
            .compile(cancelacion_de_tramites_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionDeTramites`, validate({ body: postCancelacionDeTramites }), this.cancelacionDeTramites.bind(this));
        const postCancelacionDeAccesorios = ajv
            .addSchema(cancelacion_de_accesorios_schema_json_1.default)
            .compile(cancelacion_de_accesorios_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionDeAccesorios`, validate({ body: postCancelacionDeAccesorios }), this.cancelacionDeAccesorios.bind(this));
        // Cancelacion sin VIN
        const postCancelacionOrdenesDeServicioSinVin = ajv
            .addSchema(cancelacion_ordenes_de_servicios_sin_vin_schema_json_1.default)
            .compile(cancelacion_ordenes_de_servicios_sin_vin_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionOrdenesDeServicioDespuesPedido`, validate({ body: postCancelacionOrdenesDeServicioSinVin }), this.cancelacionOrdenesDeServicioDespuesPedido.bind(this));
        const postCancelacionDeTramitesSinVin = ajv
            .addSchema(cancelacion_tramites_sin_vin_schema_json_1.default)
            .compile(cancelacion_tramites_sin_vin_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionDeTramitesSinVin`, validate({ body: postCancelacionDeTramitesSinVin }), this.cancelacionDeTramitesSinVin.bind(this));
        const postCancelacionDeAccesoriosSinVin = ajv
            .addSchema(cancelacion_de_accesorios_sin_vin_schema_json_1.default)
            .compile(cancelacion_de_accesorios_sin_vin_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionDeAccesoriosSinVin`, validate({ body: postCancelacionDeAccesoriosSinVin }), this.cancelacionDeAccesoriosSinVin.bind(this));
        this.router.post(`${this.basePath}/guardarUnidadGestionFlotillas`, validate({ body: cotizacion_grupo_unidad_schema_json_1.default }), this.guardarUnidadGestionFlotillas.bind(this));
        // Cancelación despues del pedido
        const postCancelacionOrdenesDeServicioDespuesPedido = ajv
            .addSchema(cancelacion_ordenes_de_servicios_despues_pedido_schema_json_1.default)
            .compile(cancelacion_ordenes_de_servicios_despues_pedido_array_schema_json_2.default).schema;
        this.router.post(`${this.basePath}/cancelacionOrdenesDeServicioDespuesPedido`, validate({ body: postCancelacionOrdenesDeServicioDespuesPedido }), this.cancelacionOrdenesDeServicioDespuesPedido.bind(this));
        const postCancelacionDeTramitesDespuesPedido = ajv
            .addSchema(cancelacion_tramites_despues_pedido_schema_json_1.default)
            .compile(cancelacion_tramites_despues_pedido_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionDeTramitesDespuesPedido`, validate({ body: postCancelacionDeTramitesDespuesPedido }), this.cancelacionDeTramitesDespuesPedido.bind(this));
        const postCancelacionDeAccesoriosDespuesPedido = ajv
            .addSchema(cancelacion_de_accesorios_despues_pedido_schema_json_1.default)
            .compile(cancelacion_ordenes_de_servicios_despues_pedido_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionDeAccesoriosDespuesPedido`, validate({ body: postCancelacionDeAccesoriosDespuesPedido }), this.cancelacionDeAccesoriosDespuesPedido.bind(this));
        const postcancelarAccesorioDePedidoAdicionales = ajv
            .addSchema(cancelar_accesorio_de_pedido_adicionales_schema_json_1.default)
            .compile(cancelar_accesorio_de_pedido_adicionales_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelarAccesorioDePedidoAdicionales`, validate({ body: postcancelarAccesorioDePedidoAdicionales }), this.cancelarAccesorioDePedidoAdicionales.bind(this));
        const postcancelarAccesorioDePedidoPosterior = ajv
            .addSchema(cancelar_accesorio_de_pedido_posterior_schema_json_1.default)
            .compile(cancelar_accesorio_de_pedido_posterior_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelarAccesorioDePedidoPosterior`, validate({ body: postcancelarAccesorioDePedidoPosterior }), this.cancelarAccesorioDePedidoPosterior.bind(this));
        const postCancelacionDePedidoDeUnidades = ajv
            .addSchema(cancelacion_de_pedido_unidad_schema_json_1.default)
            .compile(cancelacion_de_pedido_unidad_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionDePedidoDeUnidades`, validate({ body: postCancelacionDePedidoDeUnidades }), this.cancelacionDePedidoDeUnidades.bind(this));
        const postCancelacionDePedidoDeUnidadesAll = ajv
            .addSchema(cancelacion_de_pedido_unidad_all_schema_json_1.default)
            .compile(cancelacion_de_pedido_unidad_all_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cancelacionDePedidoDeUnidadesAll`, validate({ body: postCancelacionDePedidoDeUnidadesAll }), this.cancelacionDePedidoDeUnidadesAll.bind(this));
        this.router.get(`${this.basePath}/statusInstruccionCancelacion/:idCotizacion`, this.statusInstruccionCancelacion.bind(this));
        this.router.get(`${this.basePath}/getPedidoBproStatus/:idCotizacion`, this.getPedidoBproStatus.bind(this));
        const postCambiaStatusCotizacionUnidadesPosterior = ajv
            .addSchema(cambia_status_cotizacion_unidades_posterior_schema_json_1.default)
            .compile(cambia_status_cotizacion_unidades_posterior_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/cambiaStatusCotizacionUnidadesPosterior`, validate({ body: postCambiaStatusCotizacionUnidadesPosterior }), this.cambiaStatusCotizacionUnidadesPosterior.bind(this));
        this.router.get(`${this.basePath}/validaUnidadesFlotillasBpro/:idCotizacion`, this.validaUnidadesFlotillasBpro.bind(this));
        this.router.get(`${this.basePath}/cancelacionProcesada/:idCotizacion`, this.cancelacionProcesada.bind(this));
        this.router.get(`${this.basePath}/getLicitiacionBpro/:idCotizacion`, this.getLicitiacionBpro.bind(this));
        const postActualizarPedido = ajv
            .addSchema(actualizar_pedido_schema_json_1.default)
            .compile(actualizar_pedido_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/actualizarPedido`, validate({ body: postActualizarPedido }), this.actualizarPedido.bind(this));
        this.router.get(`${this.basePath}/validaOrdenesDeCompraPendientes/:idCotizacion`, this.validaOrdenesDeCompraPendientes.bind(this));
        const postVerificarEnviadoBpro = ajv
            .addSchema(verificar_enviado_bpro_schema_json_1.default)
            .compile(verificar_enviado_bpro_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/verificarEnviadoBpro`, validate({ body: postVerificarEnviadoBpro }), this.verificarEnviadoBpro.bind(this));
        // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
        this.router.get(`${this.basePath}/verificaUnidadesFacturadas/:idCotizacion`, this.verificaUnidadesFacturadas.bind(this));
        // OCT 99 20210215 GESTION - Agregar accesorios en Posteriores/Adicionales 1: activa , 0: desactiva
        this.router.get(`${this.basePath}/validaAgregarAccesoriosPostAd/:idCotizacion`, this.validaAgregarAccesoriosPostAd.bind(this));
        // OCT 99 20210118 sino hay OC pendientes, cambia estatus de Cotizacion a ORDENES DE COMPRA COMPLETADAS
        this.router.get(`${this.basePath}/flotillasEvalua/:idCotizacion`, this.flotillasEvalua.bind(this));
        // OCT 99 20210118 consulta el estatus de la cotizacion
        this.router.get(`${this.basePath}/consultaEstatusCotizacion/:idCotizacion`, this.consultaEstatusCotizacion.bind(this));
        const postActualizaPedidoPosterior = ajv
            .addSchema(actualiza_pedido_posterior_schema_json_1.default)
            .compile(actualiza_pedido_posterior_array_schema_json_1.default).schema;
        this.router.post(`${this.basePath}/actualizaPedidoPosterior`, validate({ body: postActualizaPedidoPosterior }), this.actualizaPedidoPosterior.bind(this));
    }
    consolidacionFlotillasBpro(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body[0].idCotizacion;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        pedidoBusiness.consolidacionFlotillasBpro(idCotizacion, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    generarPedidoMovBproTraslado(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body[0].idCotizacion;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        pedidoBusiness.generarPedidoMovBproTraslado(idCotizacion, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelarFacturacionUnidades(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const detalleUnidad = request.body;
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        pedidoBusiness.cancelarFacturacionUnidades(detalleUnidad, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    validaOrdenesDeCompra(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = (request.body.length && request.body[0].idCotizacion) ? request.body[0].idCotizacion : '';
        pedidoBusiness.validaOrdenesDeCompra(idCotizacion, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cambiaStatusOrdenesDeCompraPendientes(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
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
    generacionDePedidoFlotillaBpro(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = (request.body.length && request.body[0].idCotizacion) ? request.body[0].idCotizacion : '';
        pedidoBusiness.generacionDePedidoFlotillaBpro(idCotizacion, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    validaExistenciaDeMovimientos(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = (request.body.length && request.body[0].idCotizacion) ? request.body[0].idCotizacion : '';
        pedidoBusiness.validaExistenciaDeMovimientos(idCotizacion, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionOrdenesDeServicio(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const vin = request.body.vin;
        const idCotizacion = request.body.idCotizacion;
        pedidoBusiness.cancelacionOrdenesDeServicio(idCotizacion, vin)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionDeTramites(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const vin = request.body.vin;
        const idCotizacion = request.body.idCotizacion;
        pedidoBusiness.cancelacionDeTramites(idCotizacion, vin)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionDeAccesorios(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const vin = request.body.vin;
        const idCotizacion = request.body.idCotizacion;
        pedidoBusiness.cancelacionDeAccesorios(idCotizacion, vin)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    // Eliminacion sin vin
    cancelacionOrdenesDeServicioSinVin(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const idServicioUnidad = request.body.idServicioUnidad;
        pedidoBusiness.cancelacionOrdenesDeServicioSinVin(idCotizacion, idGrupoUnidad, idDetalleUnidad, idServicioUnidad)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionDeTramitesSinVin(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const idTramite = request.body.idTramite;
        pedidoBusiness.cancelacionDeTramitesSinVin(idCotizacion, idGrupoUnidad, idDetalleUnidad, idTramite)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionDeAccesoriosSinVin(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const idAccesorio = request.body.idAccesorio;
        const idAccesorioNuevo = Number(request.body.idAccesorioNuevo);
        const idParte = request.body.idParte;
        pedidoBusiness.cancelacionDeAccesoriosSinVin(idCotizacion, idGrupoUnidad, idDetalleUnidad, idAccesorio, idAccesorioNuevo, idParte)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    guardarUnidadGestionFlotillas(request, response) {
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const grupoUnidad = request.body;
        grupoUnidad.idUsuarioModificacion = idUsuario;
        grupoUnidad.fechaModificacion = new Date();
        const cotizadorBussiness = new pedido_business_1.PedidoBusiness();
        cotizadorBussiness.guardarUnidadGestionFlotillas(grupoUnidad).then((grupoUnidadSaved) => {
            response.json(grupoUnidadSaved);
        }, (error) => {
            this.errorHandler(response, error);
        });
    }
    // Cancelación despues del pedido - Se ejecutan cuando la cotizacion tiene estatus 13
    cancelacionOrdenesDeServicioDespuesPedido(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        const vin = request.body.vin;
        const idServicioUnidad = request.body.idServicioUnidad;
        pedidoBusiness.cancelacionOrdenesDeServicioDespuesPedido(idCotizacion, vin, idServicioUnidad)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionDeTramitesDespuesPedido(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        const vin = request.body.vin;
        const idSubtramite = request.body.idSubtramite;
        pedidoBusiness.cancelacionDeTramitesDespuesPedido(idCotizacion, vin, idSubtramite)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionDeAccesoriosDespuesPedido(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const vin = request.body.vin;
        const idAccesorioNuevo = Number(request.body.idAccesorioNuevo);
        const idParte = request.body.idParte;
        pedidoBusiness.cancelacionDeAccesoriosDespuesPedido(idCotizacion, idGrupoUnidad, idDetalleUnidad, vin, idAccesorioNuevo, idParte)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelarAccesorioDePedidoAdicionales(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const vin = request.body.vin;
        const idAccesorioNuevo = Number(request.body.idAccesorioNuevo);
        const idParte = request.body.idParte;
        pedidoBusiness.cancelarAccesorioDePedidoAdicionales(idCotizacion, idGrupoUnidad, idDetalleUnidad, vin, idAccesorioNuevo, idParte)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelarAccesorioDePedidoPosterior(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        const idGrupoUnidad = Number(request.body.idGrupoUnidad);
        const idDetalleUnidad = Number(request.body.idDetalleUnidad);
        const vin = request.body.vin;
        const idAccesorioNuevo = Number(request.body.idAccesorioNuevo);
        const idParte = request.body.idParte;
        pedidoBusiness.cancelarAccesorioDePedidoPosterior(idCotizacion, idGrupoUnidad, idDetalleUnidad, vin, idAccesorioNuevo, idParte)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionDePedidoDeUnidades(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const grupoUnidades = request.body;
        pedidoBusiness.cancelacionDePedidoDeUnidades(grupoUnidades)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionDePedidoDeUnidadesAll(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const grupoUnidades = request.body;
        pedidoBusiness.cancelacionDePedidoDeUnidadesAll(grupoUnidades)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    statusInstruccionCancelacion(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.statusInstruccionCancelacion(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getPedidoBproStatus(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.getPedidoBproStatus(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cambiaStatusCotizacionUnidadesPosterior(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.body.idCotizacion;
        pedidoBusiness.cambiaStatusCotizacionUnidadesPosterior(idCotizacion, idUsuario)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    validaUnidadesFlotillasBpro(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.validaUnidadesFlotillasBpro(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    cancelacionProcesada(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.cancelacionProcesada(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    getLicitiacionBpro(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.getLicitiacionBpro(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    actualizarPedido(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idUsuario = Number((request.headers.idusuario) ? request.headers.idusuario : 0);
        const idCotizacion = request.body.idCotizacion;
        pedidoBusiness.actualizarPedido(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    validaOrdenesDeCompraPendientes(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.validaOrdenesDeCompraPendientes(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    verificarEnviadoBpro(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        pedidoBusiness.verificarEnviadoBpro(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
    verificaUnidadesFacturadas(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.verificaUnidadesFacturadas(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    // OCT 99 20210215 GESTION - Agregar accesorios en Posteriores/Adicionales 1: activa , 0: desactiva
    validaAgregarAccesoriosPostAd(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.validaAgregarAccesoriosPostAd(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
    flotillasEvalua(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.flotillasEvalua(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    // OCT 99 20210118 verifica si todas las unidades de la cotizacion ya estan facturadas
    consultaEstatusCotizacion(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.params.idCotizacion;
        pedidoBusiness.consultaEstatusCotizacion(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
    actualizaPedidoPosterior(request, response) {
        const pedidoBusiness = new pedido_business_1.PedidoBusiness();
        const idCotizacion = request.body.idCotizacion;
        pedidoBusiness.actualizaPedidoPosterior(idCotizacion)
            .then((res) => {
            response.status(200).json(res);
        })
            .catch((error) => {
            response.status(500).json(error);
        });
    }
}
exports.PedidoController = PedidoController;
//# sourceMappingURL=pedido.controller.js.map